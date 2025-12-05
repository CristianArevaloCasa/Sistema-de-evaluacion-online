import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EvaluacionService } from '../../services/evaluacion.service';
import { AuthService } from '../../services/auth.service';
import { Evaluacion } from '../../models/evaluacion.model';

@Component({
  selector: 'app-evaluaciones-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluaciones-list.component.html',
  styleUrls: ['./evaluaciones-list.component.css']
})
export class EvaluacionesListComponent implements OnInit {
  private evaluacionService = inject(EvaluacionService);
  private authService = inject(AuthService);
  private router = inject(Router);

  evaluaciones: Evaluacion[] = [];
  evaluacionesFiltradas: Evaluacion[] = [];
  loading = true;
  searchTerm = '';
  filtroEstado = '';
  filtroCategoria = '';
  categorias: string[] = [];

  ngOnInit() {
    this.cargarEvaluaciones();
  }

  cargarEvaluaciones() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.evaluacionService.getEvaluacionesByUser(user.uid).subscribe({
      next: (evaluaciones) => {
        this.evaluaciones = evaluaciones;
        this.evaluacionesFiltradas = evaluaciones;
        this.loading = false;
        
        // Extraer categorías únicas
        this.categorias = [...new Set(evaluaciones.map(e => e.categoria))];
      },
      error: (error) => {
        console.error('Error al cargar evaluaciones:', error);
        this.loading = false;
      }
    });
  }

  aplicarFiltros() {
    let resultado = [...this.evaluaciones];

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const termino = this.searchTerm.toLowerCase();
      resultado = resultado.filter(e =>
        e.titulo.toLowerCase().includes(termino) ||
        e.descripcion.toLowerCase().includes(termino) ||
        e.categoria.toLowerCase().includes(termino)
      );
    }

    // Filtro por estado
    if (this.filtroEstado) {
      resultado = resultado.filter(e => e.estado === this.filtroEstado);
    }

    // Filtro por categoría
    if (this.filtroCategoria) {
      resultado = resultado.filter(e => e.categoria === this.filtroCategoria);
    }

    this.evaluacionesFiltradas = resultado;
  }

  onSearchChange() {
    this.aplicarFiltros();
  }

  onEstadoChange() {
    this.aplicarFiltros();
  }

  onCategoriaChange() {
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.searchTerm = '';
    this.filtroEstado = '';
    this.filtroCategoria = '';
    this.evaluacionesFiltradas = [...this.evaluaciones];
  }

  crearNuevaEvaluacion() {
    this.router.navigate(['/evaluaciones/nueva']);
  }

  editarEvaluacion(id: string | undefined) {
    if (id) {
      this.router.navigate(['/evaluaciones/editar', id]);
    }
  }

  async eliminarEvaluacion(evaluacion: Evaluacion) {
    if (!evaluacion.id) return;

    const confirmar = confirm(`¿Estás seguro de eliminar la evaluación "${evaluacion.titulo}"?`);
    if (!confirmar) return;

    try {
      await this.evaluacionService.eliminarEvaluacion(evaluacion.id);
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar la evaluación');
    }
  }

  verEstadisticas(id: string | undefined) {
    if (id) {
      this.router.navigate(['/evaluaciones/estadisticas', id]);
    }
  }

  getEstadoClass(estado: string): string {
    const classes: { [key: string]: string } = {
      'activa': 'estado-activa',
      'cerrada': 'estado-cerrada',
      'borrador': 'estado-borrador'
    };
    return classes[estado] || '';
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  get userName(): string {
    return this.authService.getCurrentUser()?.displayName || 'Usuario';
  }
}
