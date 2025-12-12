export interface Evaluacion {
  id?: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  fechaCreacion: Date;
  fechaLimite: Date;
  puntajeMaximo: number;
  estado: 'activa' | 'cerrada' | 'borrador';
  userId: string;
  preguntas: Pregunta[];
}

export interface Pregunta {
  id: string;
  texto: string;
  tipo: 'opcion-multiple' | 'abierta' | 'verdadero-falso' | 'respuesta-corta';
  opciones?: string[];
  respuestaCorrecta: string | number;
  puntaje: number;
}

export interface Respuesta {
  id?: string;
  evaluacionId: string;
  userId: string;
  userName: string;
  respuestas: { [preguntaId: string]: string | number };
  puntajeObtenido: number;
  fechaEntrega: Date;
  estado: 'completada' | 'en-progreso';
}
