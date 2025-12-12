import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EvaluacionService } from '../../services/evaluacion.service';
import { AuthService } from '../../services/auth.service';
import { Evaluacion, Respuesta } from '../../models/evaluacion.model';

@Component({
  selector: 'app-tomar-evaluacion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tomar-evaluacion.component.html',
  styleUrls: ['./tomar-evaluacion.component.css']
})
export class TomarEvaluacionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private evaluacionService = inject(EvaluacionService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  evaluacion: Evaluacion | null = null;
  respuestaForm: FormGroup;
  loading = true;
  enviando = false;
  evaluacionId: string | null = null;
  errorMessage = '';
  tiempoRestante = '';
  intervalo: any;

  constructor() {
    this.respuestaForm = this.fb.group({
      respuestas: this.fb.array([])
    });
  }

  ngOnInit() {
    this.evaluacionId = this.route.snapshot.paramMap.get('id');
    
    if (this.evaluacionId) {
      this.cargarEvaluacion();
    } else {
      this.router.navigate(['/evaluaciones-disponibles']);
    }
  }

  get respuestas(): FormArray {
    return this.respuestaForm.get('respuestas') as FormArray;
  }

  cargarEvaluacion() {
    if (!this.evaluacionId) return;

    this.evaluacionService.getEvaluacionById(this.evaluacionId).subscribe({
      next: (evaluacion) => {
        if (evaluacion && evaluacion.estado === 'activa') {
          this.evaluacion = evaluacion;
          this.inicializarFormulario();
          this.iniciarContador();
          this.loading = false;
        } else {
          this.errorMessage = 'Esta evaluación no está disponible';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error al cargar evaluación:', error);
        this.errorMessage = 'Error al cargar la evaluación';
        this.loading = false;
      }
    });
  }

  inicializarFormulario() {
    if (!this.evaluacion) return;

    this.evaluacion.preguntas.forEach(pregunta => {
      this.respuestas.push(this.fb.group({
        preguntaId: [pregunta.id],
        respuesta: ['', Validators.required]
      }));
    });
  }

  iniciarContador() {
    if (!this.evaluacion) return;

    this.intervalo = setInterval(() => {
      const ahora = new Date().getTime();
      const fin = new Date(this.evaluacion!.fechaLimite).getTime();
      const distancia = fin - ahora;

      if (distancia < 0) {
        clearInterval(this.intervalo);
        this.tiempoRestante = 'Tiempo agotado';
        this.enviarRespuestas();
      } else {
        const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distancia % (1000 * 60)) / 1000);
        this.tiempoRestante = `${horas}h ${minutos}m ${segundos}s`;
      }
    }, 1000);
  }

  async enviarRespuestas() {
    if (this.respuestaForm.invalid) {
      this.errorMessage = 'Por favor, responde todas las preguntas.';
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user || !this.evaluacion || !this.evaluacionId) return;

    this.enviando = true;
    this.errorMessage = '';

    try {
      // Calcular puntaje
      let puntajeObtenido = 0;
      const respuestasArray = this.respuestaForm.value.respuestas;
      const respuestasMap: { [preguntaId: string]: string | number } = {};

      respuestasArray.forEach((resp: any, index: number) => {
        const pregunta = this.evaluacion!.preguntas[index];
        respuestasMap[pregunta.id] = resp.respuesta;
        
        // Comparar respuestas (convertir a string para comparación)
        const respuestaCorrecta = String(pregunta.respuestaCorrecta).toLowerCase().trim();
        const respuestaEstudiante = String(resp.respuesta).toLowerCase().trim();
        
        if (respuestaCorrecta === respuestaEstudiante) {
          puntajeObtenido += pregunta.puntaje;
        }
      });

      const respuesta: Respuesta = {
        evaluacionId: this.evaluacionId,
        userId: user.uid,
        userName: user.email || 'Estudiante',
        respuestas: respuestasMap,
        puntajeObtenido,
        fechaEntrega: new Date(),
        estado: 'completada'
      };

      await this.evaluacionService.guardarRespuesta(respuesta);
      
      // Limpiar intervalo
      if (this.intervalo) {
        clearInterval(this.intervalo);
      }

      // Navegar a resultado
      this.router.navigate(['/resultado-evaluacion', this.evaluacionId], {
        queryParams: { puntaje: puntajeObtenido, maximo: this.evaluacion.puntajeMaximo }
      });
    } catch (error) {
      console.error('Error al enviar respuestas:', error);
      this.errorMessage = 'Error al enviar las respuestas. Intenta de nuevo.';
      this.enviando = false;
    }
  }

  cancelar() {
    if (confirm('¿Estás seguro de que quieres salir? Se perderán tus respuestas.')) {
      if (this.intervalo) {
        clearInterval(this.intervalo);
      }
      this.router.navigate(['/evaluaciones-disponibles']);
    }
  }

  volverAEvaluaciones() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
    this.router.navigate(['/evaluaciones-disponibles']);
  }

  ngOnDestroy() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }
}
