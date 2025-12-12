import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EvaluacionService } from '../../services/evaluacion.service';
import { AuthService } from '../../services/auth.service';
import { Evaluacion } from '../../models/evaluacion.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-evaluaciones-disponibles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluaciones-disponibles.component.html',
  styleUrls: ['./evaluaciones-disponibles.component.css']
})
export class EvaluacionesDisponiblesComponent implements OnInit, OnDestroy {
  evaluaciones: Evaluacion[] = [];
  evaluacionesFiltradas: Evaluacion[] = [];
  categorias: string[] = ['Todas', 'Matemáticas', 'Ciencias', 'Lenguaje', 'Historia', 'Geografía', 'Inglés', 'Programación', 'Arte', 'Música', 'Educación Física', 'Otros'];
  categoriaSeleccionada: string = 'Todas';
  busqueda: string = '';
  loading: boolean = true;
  errorMessage: string = '';
  currentUser: any = null;
  
  private subscription?: Subscription;

  constructor(
    private evaluacionService: EvaluacionService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    console.log('🎓 Cargando evaluaciones disponibles para estudiantes');
    this.currentUser = this.authService.getCurrentUser();
    this.cargarEvaluaciones();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cargarEvaluaciones(): void {
    this.loading = true;
    this.errorMessage = '';

    // Obtener todas las evaluaciones activas (de todos los profesores)
    this.subscription = this.evaluacionService.getEvaluacionesActivas().subscribe({
      next: (evaluaciones: Evaluacion[]) => {
        console.log('✅ Evaluaciones activas cargadas:', evaluaciones.length);
        
        // Filtrar solo las evaluaciones activas y no vencidas
        const ahora = new Date();
        this.evaluaciones = evaluaciones.filter(evaluacion => {
          const fechaLimite = new Date(evaluacion.fechaLimite);
          return evaluacion.estado === 'activa' && fechaLimite > ahora;
        });

        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('❌ Error al cargar evaluaciones:', error);
        this.errorMessage = 'Error al cargar las evaluaciones disponibles';
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.evaluacionesFiltradas = this.evaluaciones.filter(evaluacion => {
      // Filtro por categoría
      const cumpleCategoria = this.categoriaSeleccionada === 'Todas' || 
                             evaluacion.categoria === this.categoriaSeleccionada;

      // Filtro por búsqueda
      const cumpleBusqueda = this.busqueda === '' || 
                            evaluacion.titulo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                            evaluacion.descripcion.toLowerCase().includes(this.busqueda.toLowerCase());

      return cumpleCategoria && cumpleBusqueda;
    });

    console.log('🔍 Evaluaciones filtradas:', this.evaluacionesFiltradas.length);
  }

  onCategoriaChange(): void {
    this.aplicarFiltros();
  }

  onBusquedaChange(): void {
    this.aplicarFiltros();
  }

  comenzarEvaluacion(id: string): void {
    console.log('▶️ Comenzando evaluación:', id);
    this.router.navigate(['/tomar-evaluacion', id]);
  }

  calcularTiempoRestante(fechaLimite: Date | string): string {
    const ahora = new Date();
    const limite = new Date(fechaLimite);
    const diferencia = limite.getTime() - ahora.getTime();

    if (diferencia <= 0) {
      return 'Vencida';
    }

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));

    if (dias > 0) {
      return `${dias}d ${horas}h`;
    } else if (horas > 0) {
      return `${horas}h ${minutos}m`;
    } else {
      return `${minutos}m`;
    }
  }

  cerrarSesion(): void {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
