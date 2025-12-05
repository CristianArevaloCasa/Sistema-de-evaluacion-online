import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EvaluacionService } from '../../services/evaluacion.service';
import { AuthService } from '../../services/auth.service';
import { Evaluacion, Pregunta } from '../../models/evaluacion.model';

@Component({
  selector: 'app-evaluacion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './evaluacion-form.component.html',
  styleUrls: ['./evaluacion-form.component.css']
})
export class EvaluacionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private evaluacionService = inject(EvaluacionService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  evaluacionForm: FormGroup;
  isEditMode = false;
  evaluacionId: string | null = null;
  loading = false;
  errorMessage = '';

  constructor() {
    this.evaluacionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      categoria: ['', Validators.required],
      fechaLimite: ['', Validators.required],
      puntajeMaximo: [0, [Validators.required, Validators.min(1)]],
      estado: ['borrador', Validators.required],
      preguntas: this.fb.array([])
    });
  }

  ngOnInit() {
    this.evaluacionId = this.route.snapshot.paramMap.get('id');
    
    if (this.evaluacionId) {
      this.isEditMode = true;
      this.cargarEvaluacion();
    } else {
      this.agregarPregunta(); // Agregar una pregunta inicial
    }
  }

  get preguntas(): FormArray {
    return this.evaluacionForm.get('preguntas') as FormArray;
  }

  crearPreguntaForm(pregunta?: Pregunta): FormGroup {
    return this.fb.group({
      id: [pregunta?.id || this.generarId()],
      texto: [pregunta?.texto || '', [Validators.required, Validators.minLength(5)]],
      tipo: [pregunta?.tipo || 'opcion-multiple', Validators.required],
      opciones: [pregunta?.opciones?.join('\n') || '', Validators.required],
      respuestaCorrecta: [pregunta?.respuestaCorrecta || '', Validators.required],
      puntaje: [pregunta?.puntaje || 1, [Validators.required, Validators.min(0.5)]]
    });
  }

  agregarPregunta() {
    this.preguntas.push(this.crearPreguntaForm());
    this.calcularPuntajeMaximo();
  }

  eliminarPregunta(index: number) {
    if (this.preguntas.length > 1) {
      this.preguntas.removeAt(index);
      this.calcularPuntajeMaximo();
    } else {
      alert('Debe haber al menos una pregunta');
    }
  }

  calcularPuntajeMaximo() {
    let total = 0;
    this.preguntas.controls.forEach(control => {
      total += Number(control.get('puntaje')?.value || 0);
    });
    this.evaluacionForm.patchValue({ puntajeMaximo: total });
  }

  onPuntajeChange() {
    this.calcularPuntajeMaximo();
  }

  cargarEvaluacion() {
    if (!this.evaluacionId) return;

    this.loading = true;
    this.evaluacionService.getEvaluacionById(this.evaluacionId).subscribe({
      next: (evaluacion) => {
        if (evaluacion) {
          // Limpiar preguntas existentes
          while (this.preguntas.length) {
            this.preguntas.removeAt(0);
          }

          // Cargar preguntas
          evaluacion.preguntas?.forEach(pregunta => {
            this.preguntas.push(this.crearPreguntaForm(pregunta));
          });

          // Formatear fecha para input type="datetime-local"
          const fechaLimite = new Date(evaluacion.fechaLimite);
          const fechaFormateada = this.formatearFechaParaInput(fechaLimite);

          this.evaluacionForm.patchValue({
            titulo: evaluacion.titulo,
            descripcion: evaluacion.descripcion,
            categoria: evaluacion.categoria,
            fechaLimite: fechaFormateada,
            puntajeMaximo: evaluacion.puntajeMaximo,
            estado: evaluacion.estado
          });
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar evaluación:', error);
        this.errorMessage = 'Error al cargar la evaluación';
        this.loading = false;
      }
    });
  }

  async onSubmit() {
    if (this.evaluacionForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
      this.marcarCamposComoTocados();
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const formValue = this.evaluacionForm.value;
      
      // Procesar preguntas
      const preguntas: Pregunta[] = formValue.preguntas.map((p: any) => ({
        id: p.id,
        texto: p.texto,
        tipo: p.tipo,
        opciones: p.tipo === 'opcion-multiple' ? p.opciones.split('\n').filter((o: string) => o.trim()) : undefined,
        respuestaCorrecta: p.respuestaCorrecta,
        puntaje: Number(p.puntaje)
      }));

      const evaluacion: Evaluacion = {
        titulo: formValue.titulo,
        descripcion: formValue.descripcion,
        categoria: formValue.categoria,
        fechaCreacion: this.isEditMode ? new Date() : new Date(),
        fechaLimite: new Date(formValue.fechaLimite),
        puntajeMaximo: Number(formValue.puntajeMaximo),
        estado: formValue.estado,
        userId: user.uid,
        preguntas
      };

      if (this.isEditMode && this.evaluacionId) {
        await this.evaluacionService.actualizarEvaluacion(this.evaluacionId, evaluacion);
      } else {
        await this.evaluacionService.crearEvaluacion(evaluacion);
      }

      this.router.navigate(['/evaluaciones']);
    } catch (error) {
      console.error('Error al guardar:', error);
      this.errorMessage = 'Error al guardar la evaluación. Inténtalo de nuevo.';
    } finally {
      this.loading = false;
    }
  }

  cancelar() {
    this.router.navigate(['/evaluaciones']);
  }

  private marcarCamposComoTocados() {
    Object.keys(this.evaluacionForm.controls).forEach(key => {
      this.evaluacionForm.get(key)?.markAsTouched();
    });

    this.preguntas.controls.forEach(control => {
      Object.keys((control as FormGroup).controls).forEach(key => {
        control.get(key)?.markAsTouched();
      });
    });
  }

  private generarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private formatearFechaParaInput(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
