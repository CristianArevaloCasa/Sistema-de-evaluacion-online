import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { EvaluacionesListComponent } from './components/evaluaciones-list/evaluaciones-list.component';
import { EvaluacionFormComponent } from './components/evaluacion-form/evaluacion-form.component';
import { EstadisticasComponent } from './components/estadisticas/estadisticas.component';
import { authGuard, loginGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'evaluaciones', component: EvaluacionesListComponent, canActivate: [authGuard] },
  { path: 'evaluaciones/nueva', component: EvaluacionFormComponent, canActivate: [authGuard] },
  { path: 'evaluaciones/editar/:id', component: EvaluacionFormComponent, canActivate: [authGuard] },
  { path: 'evaluaciones/estadisticas/:id', component: EstadisticasComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
