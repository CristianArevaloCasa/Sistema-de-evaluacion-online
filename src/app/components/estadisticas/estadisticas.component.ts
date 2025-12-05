import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { EvaluacionService } from '../../services/evaluacion.service';
import { Evaluacion, Respuesta } from '../../models/evaluacion.model';

interface Estadisticas {
  totalRespuestas: number;
  promedioGeneral: number;
  puntajeMaximo: number;
  puntajeMinimo: number;
  aprobados: number;
  reprobados: number;
  porcentajeAprobacion: number;
  distribucionPuntajes: { rango: string; cantidad: number; }[];
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  private evaluacionService = inject(EvaluacionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  evaluacion: Evaluacion | null = null;
  respuestas: Respuesta[] = [];
  estadisticas: Estadisticas | null = null;
  loading = true;

  ngOnInit() {
    const evaluacionId = this.route.snapshot.paramMap.get('id');
    if (evaluacionId) {
      this.cargarDatos(evaluacionId);
    }
  }

  cargarDatos(evaluacionId: string) {
    this.loading = true;

    // Cargar evaluación
    this.evaluacionService.getEvaluacionById(evaluacionId).subscribe({
      next: (evaluacion) => {
        this.evaluacion = evaluacion || null;
        
        // Cargar respuestas
        this.evaluacionService.getRespuestasByEvaluacion(evaluacionId).subscribe({
          next: (respuestas) => {
            this.respuestas = respuestas;
            this.calcularEstadisticas();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al cargar respuestas:', error);
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar evaluación:', error);
        this.loading = false;
      }
    });
  }

  calcularEstadisticas() {
    if (!this.evaluacion || this.respuestas.length === 0) {
      this.estadisticas = null;
      return;
    }

    const puntajes = this.respuestas
      .filter(r => r.estado === 'completada')
      .map(r => r.puntajeObtenido);

    if (puntajes.length === 0) {
      this.estadisticas = null;
      return;
    }

    const totalRespuestas = puntajes.length;
    const sumaTotal = puntajes.reduce((sum, p) => sum + p, 0);
    const promedioGeneral = sumaTotal / totalRespuestas;
    const puntajeMaximo = Math.max(...puntajes);
    const puntajeMinimo = Math.min(...puntajes);

    // Calcular aprobados (60% o más)
    const puntajeAprobacion = this.evaluacion.puntajeMaximo * 0.6;
    const aprobados = puntajes.filter(p => p >= puntajeAprobacion).length;
    const reprobados = totalRespuestas - aprobados;
    const porcentajeAprobacion = (aprobados / totalRespuestas) * 100;

    // Distribución de puntajes
    const maxPuntaje = this.evaluacion.puntajeMaximo;
    const distribucionPuntajes = [
      {
        rango: `0-${Math.floor(maxPuntaje * 0.25)}`,
        cantidad: puntajes.filter(p => p < maxPuntaje * 0.25).length
      },
      {
        rango: `${Math.floor(maxPuntaje * 0.25)}-${Math.floor(maxPuntaje * 0.5)}`,
        cantidad: puntajes.filter(p => p >= maxPuntaje * 0.25 && p < maxPuntaje * 0.5).length
      },
      {
        rango: `${Math.floor(maxPuntaje * 0.5)}-${Math.floor(maxPuntaje * 0.75)}`,
        cantidad: puntajes.filter(p => p >= maxPuntaje * 0.5 && p < maxPuntaje * 0.75).length
      },
      {
        rango: `${Math.floor(maxPuntaje * 0.75)}-${maxPuntaje}`,
        cantidad: puntajes.filter(p => p >= maxPuntaje * 0.75).length
      }
    ];

    this.estadisticas = {
      totalRespuestas,
      promedioGeneral,
      puntajeMaximo,
      puntajeMinimo,
      aprobados,
      reprobados,
      porcentajeAprobacion,
      distribucionPuntajes
    };
  }

  volver() {
    this.router.navigate(['/evaluaciones']);
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  redondear(num: number): number {
    return Math.round(num * 100) / 100;
  }

  getBarWidth(cantidad: number): string {
    if (!this.estadisticas || this.estadisticas.totalRespuestas === 0) return '0%';
    return `${(cantidad / this.estadisticas.totalRespuestas) * 100}%`;
  }
}
