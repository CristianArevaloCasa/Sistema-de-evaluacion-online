import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getUser().pipe(
    map(user => {
      if (user) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};

export const loginGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getUser().pipe(
    map(user => {
      if (user) {
        // No redirigir automáticamente, dejar que el usuario elija su rol
        return true;
      } else {
        return true;
      }
    })
  );
};
