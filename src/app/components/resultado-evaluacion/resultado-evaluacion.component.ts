import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resultado-evaluacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultado-evaluacion.component.html',
  styleUrls: ['./resultado-evaluacion.component.css']
})
export class ResultadoEvaluacionComponent implements OnInit {
  puntajeObtenido: number = 0;
  puntajeMaximo: number = 0;
  porcentaje: number = 0;
  aprobado: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Obtener parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.puntajeObtenido = Number(params['puntaje']) || 0;
      this.puntajeMaximo = Number(params['maximo']) || 0;
      
      if (this.puntajeMaximo > 0) {
        this.porcentaje = Math.round((this.puntajeObtenido / this.puntajeMaximo) * 100);
        this.aprobado = this.porcentaje >= 60; // 60% para aprobar
      }

      console.log('📊 Resultado:', {
        puntajeObtenido: this.puntajeObtenido,
        puntajeMaximo: this.puntajeMaximo,
        porcentaje: this.porcentaje,
        aprobado: this.aprobado
      });
    });
  }

  volverAEvaluaciones(): void {
    this.router.navigate(['/evaluaciones-disponibles']);
  }

  getMensaje(): string {
    if (this.porcentaje >= 90) {
      return '¡Excelente! Demostraste un dominio excepcional del tema.';
    } else if (this.porcentaje >= 75) {
      return '¡Muy bien! Tienes un buen entendimiento del tema.';
    } else if (this.porcentaje >= 60) {
      return 'Aprobado. Sigue practicando para mejorar.';
    } else if (this.porcentaje >= 40) {
      return 'No aprobaste. Te recomendamos revisar el material y volver a intentarlo.';
    } else {
      return 'Necesitas estudiar más el tema. No te desanimes, sigue intentando.';
    }
  }

  getIcono(): string {
    if (this.porcentaje >= 90) return '🏆';
    if (this.porcentaje >= 75) return '🎉';
    if (this.porcentaje >= 60) return '👍';
    if (this.porcentaje >= 40) return '📚';
    return '💪';
  }

  getEstadoClase(): string {
    return this.aprobado ? 'aprobado' : 'reprobado';
  }
}
