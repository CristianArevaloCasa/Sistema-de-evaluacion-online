import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User,
  user,
  updateProfile
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  currentUser: User | null = null;

  constructor() {
    this.user$.subscribe((aUser: User | null) => {
      this.currentUser = aUser;
    });
  }

  // Registro de usuario
  async register(email: string, password: string, displayName: string): Promise<void> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (credential.user) {
        await updateProfile(credential.user, { displayName });
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      throw error;
    }
  }

  // Inicio de sesión
  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Observable del usuario
  getUser(): Observable<User | null> {
    return this.user$;
  }
}
