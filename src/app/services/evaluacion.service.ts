import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  collectionData,
  docData,
  query,
  where,
  orderBy,
  Timestamp
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
    const q = query(
      this.evaluacionesCollection,
      where('userId', '==', userId),
      orderBy('fechaCreacion', 'desc')
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map((evaluaciones: any[]) => {
        console.log('📦 Evaluaciones recibidas de Firestore:', evaluaciones.length);
        console.log('📋 Datos:', evaluaciones);
        return evaluaciones.map(e => ({
          ...e,
          fechaCreacion: e.fechaCreacion?.toDate(),
          fechaLimite: e.fechaLimite?.toDate()
        }));
      })
    );
  }

  // Obtener todas las evaluaciones (para buscar/filtrar)
  getTodasEvaluaciones(): Observable<Evaluacion[]> {
    const q = query(
      this.evaluacionesCollection,
      orderBy('fechaCreacion', 'desc')
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map((evaluaciones: any[]) => 
        evaluaciones.map(e => ({
          ...e,
          fechaCreacion: e.fechaCreacion?.toDate(),
          fechaLimite: e.fechaLimite?.toDate()
        }))
      )
    );
  }

  // Obtener evaluación por ID
  getEvaluacionById(id: string): Observable<Evaluacion | undefined> {
    const evaluacionDoc = doc(this.firestore, `evaluaciones/${id}`);
    return docData(evaluacionDoc, { idField: 'id' }).pipe(
      map((evaluacion: any) => {
        if (!evaluacion) return undefined;
        return {
          ...evaluacion,
          fechaCreacion: evaluacion.fechaCreacion?.toDate(),
          fechaLimite: evaluacion.fechaLimite?.toDate()
        };
      })
    );
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
      map(evaluaciones => 
        evaluaciones.filter(e => 
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
      map(evaluaciones => 
        evaluaciones.filter(e => e.estado === estado)
      )
    );
  }

  // Filtrar evaluaciones por categoría
  filtrarPorCategoria(categoria: string, userId: string): Observable<Evaluacion[]> {
    return this.getEvaluacionesByUser(userId).pipe(
      map(evaluaciones => 
        evaluaciones.filter(e => e.categoria === categoria)
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
    const q = query(
      this.respuestasCollection,
      where('evaluacionId', '==', evaluacionId),
      orderBy('fechaEntrega', 'desc')
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map((respuestas: any[]) => 
        respuestas.map(r => ({
          ...r,
          fechaEntrega: r.fechaEntrega?.toDate()
        }))
      )
    );
  }
}
