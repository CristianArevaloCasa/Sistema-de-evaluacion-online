import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EvaluacionesListComponent } from './components/evaluaciones-list/evaluaciones-list.component';
import { EvaluacionFormComponent } from './components/evaluacion-form/evaluacion-form.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { EvaluacionesDisponiblesComponent } from './components/evaluaciones-disponibles/evaluaciones-disponibles.component';
import { TomarEvaluacionComponent } from './components/tomar-evaluacion/tomar-evaluacion.component';
import { ResultadoEvaluacionComponent } from './components/resultado-evaluacion/resultado-evaluacion.component';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  
  // Rutas de Profesor
  { path: 'evaluaciones', component: EvaluacionesListComponent, canActivate: [authGuard] },
  { path: 'evaluaciones/nueva', component: EvaluacionFormComponent, canActivate: [authGuard] },
  { path: 'evaluaciones/editar/:id', component: EvaluacionFormComponent, canActivate: [authGuard] },
  { path: 'evaluaciones/estadisticas/:id', component: EstadisticasComponent, canActivate: [authGuard] },
  
  // Rutas de Estudiante
  { path: 'evaluaciones-disponibles', component: EvaluacionesDisponiblesComponent, canActivate: [authGuard] },
  { path: 'tomar-evaluacion/:id', component: TomarEvaluacionComponent, canActivate: [authGuard] },
  { path: 'resultado-evaluacion', component: ResultadoEvaluacionComponent, canActivate: [authGuard] },
  
  { path: '**', redirectTo: '/login' }
];

