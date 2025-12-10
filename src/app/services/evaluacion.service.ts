import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Evaluacion, Respuesta } from '../models/evaluacion.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {
  private firestore: Firestore = inject(Firestore);
  private evaluacionesCollection = collection(this.firestore, 'evaluaciones');
  private respuestasCollection = collection(this.firestore, 'respuestas');

  // Crear evaluación
  async crearEvaluacion(evaluacion: Evaluacion): Promise<string> {
    try {
      console.log('💾 Guardando evaluación:', evaluacion);
      const evaluacionData = {
        ...evaluacion,
        fechaCreacion: Timestamp.fromDate(new Date(evaluacion.fechaCreacion)),
        fechaLimite: Timestamp.fromDate(new Date(evaluacion.fechaLimite))
      };
      console.log('📤 Datos a guardar:', evaluacionData);
      const docRef = await addDoc(this.evaluacionesCollection, evaluacionData);
      console.log('✅ Evaluación guardada con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error al crear evaluación:', error);
      throw error;
    }
  }

  // Obtener evaluaciones del usuario
  getEvaluacionesByUser(userId: string): Observable<Evaluacion[]> {
    console.log('🔍 Buscando evaluaciones para userId:', userId);
    return new Observable(observer => {
      const q = query(
        this.evaluacionesCollection,
        where('userId', '==', userId),
        orderBy('fechaCreacion', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          console.log('📦 Evaluaciones recibidas:', snapshot.size);
          const evaluaciones = snapshot.docs.map(doc => {
            const data = doc.data() as any;
            return {
              id: doc.id,
              ...data,
              fechaCreacion: data.fechaCreacion?.toDate(),
              fechaLimite: data.fechaLimite?.toDate()
            } as Evaluacion;
          });
          console.log('📋 Datos procesados:', evaluaciones);
          observer.next(evaluaciones);
        },
        (error) => {
          console.error('❌ Error en snapshot:', error);
          observer.error(error);
        }
      );
      
      return () => unsubscribe();
    });
  }

  // Obtener todas las evaluaciones (para buscar/filtrar)
  getTodasEvaluaciones(): Observable<Evaluacion[]> {
    return new Observable(observer => {
      const q = query(
        this.evaluacionesCollection,
        orderBy('fechaCreacion', 'desc')
      );
      
      const unsubscribe = onSnapshot(q,
        (snapshot) => {
          const evaluaciones = snapshot.docs.map(doc => {
            const data = doc.data() as any;
            return {
              id: doc.id,
              ...data,
              fechaCreacion: data.fechaCreacion?.toDate(),
              fechaLimite: data.fechaLimite?.toDate()
            } as Evaluacion;
          });
          observer.next(evaluaciones);
        },
        (error) => {
          observer.error(error);
        }
      );
      
      return () => unsubscribe();
    });
  }

  // Obtener evaluación por ID
  getEvaluacionById(id: string): Observable<Evaluacion | undefined> {
    return new Observable(observer => {
      const evaluacionDoc = doc(this.firestore, `evaluaciones/${id}`);
      
      const unsubscribe = onSnapshot(evaluacionDoc,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as any;
            const evaluacion: Evaluacion = {
              id: docSnap.id,
              ...data,
              fechaCreacion: data.fechaCreacion?.toDate(),
              fechaLimite: data.fechaLimite?.toDate()
            };
            observer.next(evaluacion);
          } else {
            observer.next(undefined);
          }
        },
        (error) => {
          observer.error(error);
        }
      );
      
      return () => unsubscribe();
    });
  }

  // Actualizar evaluación
  async actualizarEvaluacion(id: string, evaluacion: Partial<Evaluacion>): Promise<void> {
    try {
      const evaluacionDoc = doc(this.firestore, `evaluaciones/${id}`);
      const updateData: any = { ...evaluacion };
      
      if (evaluacion.fechaCreacion) {
        updateData.fechaCreacion = Timestamp.fromDate(new Date(evaluacion.fechaCreacion));
      }
      if (evaluacion.fechaLimite) {
        updateData.fechaLimite = Timestamp.fromDate(new Date(evaluacion.fechaLimite));
      }
      
      await updateDoc(evaluacionDoc, updateData);
    } catch (error) {
      console.error('Error al actualizar evaluación:', error);
      throw error;
    }
  }

  // Eliminar evaluación
  async eliminarEvaluacion(id: string): Promise<void> {
    try {
      const evaluacionDoc = doc(this.firestore, `evaluaciones/${id}`);
      await deleteDoc(evaluacionDoc);
    } catch (error) {
      console.error('Error al eliminar evaluación:', error);
      throw error;
    }
  }

  // Buscar evaluaciones por título o categoría
  buscarEvaluaciones(termino: string, userId: string): Observable<Evaluacion[]> {
    return this.getEvaluacionesByUser(userId).pipe(
      map((evaluaciones: Evaluacion[]) => 
        evaluaciones.filter((e: Evaluacion) => 
          e.titulo.toLowerCase().includes(termino.toLowerCase()) ||
          e.categoria.toLowerCase().includes(termino.toLowerCase()) ||
          e.descripcion.toLowerCase().includes(termino.toLowerCase())
        )
      )
    );
  }

  // Filtrar evaluaciones por estado
  filtrarPorEstado(estado: string, userId: string): Observable<Evaluacion[]> {
    return this.getEvaluacionesByUser(userId).pipe(
      map((evaluaciones: Evaluacion[]) => 
        evaluaciones.filter((e: Evaluacion) => e.estado === estado)
      )
    );
  }

  // Filtrar evaluaciones por categoría
  filtrarPorCategoria(categoria: string, userId: string): Observable<Evaluacion[]> {
    return this.getEvaluacionesByUser(userId).pipe(
      map((evaluaciones: Evaluacion[]) => 
        evaluaciones.filter((e: Evaluacion) => e.categoria === categoria)
      )
    );
  }

  // Guardar respuesta de estudiante
  async guardarRespuesta(respuesta: Respuesta): Promise<string> {
    try {
      const respuestaData = {
        ...respuesta,
        fechaEntrega: Timestamp.fromDate(new Date(respuesta.fechaEntrega))
      };
      const docRef = await addDoc(this.respuestasCollection, respuestaData);
      return docRef.id;
    } catch (error) {
      console.error('Error al guardar respuesta:', error);
      throw error;
    }
  }

  // Obtener respuestas por evaluación
  getRespuestasByEvaluacion(evaluacionId: string): Observable<Respuesta[]> {
    return new Observable(observer => {
      const q = query(
        this.respuestasCollection,
        where('evaluacionId', '==', evaluacionId),
        orderBy('fechaEntrega', 'desc')
      );
      
      const unsubscribe = onSnapshot(q,
        (snapshot) => {
          const respuestas = snapshot.docs.map(doc => {
            const data = doc.data() as any;
            return {
              id: doc.id,
              ...data,
              fechaEntrega: data.fechaEntrega?.toDate()
            } as Respuesta;
          });
          observer.next(respuestas);
        },
        (error) => {
          observer.error(error);
        }
      );
      
      return () => unsubscribe();
    });
  }
}
