# Sistema de Evaluación Online

## 🎓 Información Académica

**Universidad:** Universidad Técnica de Ambato  
**Facultad:** Facultad de Ingeniería en Sistemas, Electrónica e Industrial  
**Carrera:** Ingeniería en Software  
**Asignatura:** Computación en Internet III  
**Docente:** Ing. Franklin Salazar  
**Semestre:** Septiembre 2024 - Febrero 2025  

**Integrante:**
- Cristian Gonzalo Arévalo Casa

---

## 📋 Descripción del Proyecto

Sistema web para la gestión y creación de evaluaciones académicas online. Permite a los profesores crear, administrar y hacer seguimiento de evaluaciones con preguntas personalizables, control de estados y almacenamiento seguro en la nube. Los estudiantes pueden visualizar evaluaciones disponibles, tomarlas con control de tiempo y recibir calificación automática instantánea.

---

## 🚀 Tecnologías y Herramientas Utilizadas

### Frontend
- **Angular 20.3.0** - Framework principal
- **TypeScript 5.9.2** - Lenguaje de programación
- **RxJS 7.8.0** - Programación reactiva
- **Angular Standalone Components** - Arquitectura modular

### Backend y Base de Datos
- **Firebase Authentication** - Autenticación de usuarios (email/password)
- **Cloud Firestore** - Base de datos NoSQL en tiempo real
- **Firebase Hosting** - Despliegue y hosting

### Herramientas de Desarrollo
- **Angular CLI** - Herramienta de línea de comandos
- **Git & GitHub** - Control de versiones
- **VS Code** - Editor de código

---

## 📦 Requisitos para Instalar y Ejecutar

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm (incluido con Node.js)
- Angular CLI: `npm install -g @angular/cli`
- Git

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/CristianArevaloCasa/Sistema-de-evaluacion-online.git
cd Sistema-de-evaluacion-online
```

2. **Instalar dependencias**
```bash
npm install --legacy-peer-deps
```

3. **Configurar Firebase**
- Crear proyecto en [Firebase Console](https://console.firebase.google.com)
- Habilitar Authentication (Email/Password)
- Crear base de datos Firestore
- Copiar las credenciales al archivo `src/environments/environment.ts`

4. **Ejecutar en desarrollo**
```bash
ng serve
```
Navegar a `http://localhost:4200/`

5. **Compilar para producción**
```bash
npm run build
```

---

## 🏗️ Arquitectura del Proyecto

### Componentes Principales

#### 1. **LoginComponent** (`src/app/components/login/`)
- Maneja autenticación de usuarios
- Registro de nuevas cuentas
- Validación de formularios con ReactiveFormsModule
- Redirección post-login

#### 2. **EvaluacionesListComponent** (`src/app/components/evaluaciones-list/`)
- Lista todas las evaluaciones del usuario
- Filtros por estado, categoría y búsqueda
- Navegación a creación/edición
- Eliminación de evaluaciones

#### 3. **EvaluacionFormComponent** (`src/app/components/evaluacion-form/`)
- Creación y edición de evaluaciones
- Gestión dinámica de preguntas
- Validaciones de formularios
- Cálculo automático de puntajes

#### 4. **EstadisticasComponent** (`src/app/components/estadisticas/`)
- Visualización de estadísticas
- Análisis de respuestas
- Distribución de puntajes
- Tabla de resultados

### Servicios

#### **AuthService** (`src/app/services/auth.service.ts`)
```typescript
- login(email, password): Autenticación de usuarios
- register(email, password): Registro de nuevos usuarios
- logout(): Cerrar sesión
- getCurrentUser(): Obtener usuario actual
```

#### **EvaluacionService** (`src/app/services/evaluacion.service.ts`)
```typescript
- crearEvaluacion(): Crear nueva evaluación
- getEvaluacionesByUser(): Obtener evaluaciones del usuario
- actualizarEvaluacion(): Actualizar evaluación existente
- eliminarEvaluacion(): Eliminar evaluación
- buscarEvaluaciones(): Búsqueda con filtros
```

### Guards

#### **AuthGuard** (`src/app/guards/auth.guard.ts`)
- Protege rutas que requieren autenticación
- Redirecciona a login si no está autenticado

#### **LoginGuard** (`src/app/guards/login.guard.ts`)
- Previene acceso a login si ya está autenticado
- Redirecciona a evaluaciones

### Modelos

#### **Evaluacion** (`src/app/models/evaluacion.model.ts`)
```typescript
interface Evaluacion {
  id?: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  fechaCreacion: Date;
  fechaLimite: Date;
  puntajeMaximo: number;
  estado: 'borrador' | 'activa' | 'cerrada';
  userId: string;
  preguntas: Pregunta[];
}
```

### Estructura de Archivos
```
src/
├── app/
│   ├── components/          # Componentes visuales
│   │   ├── login/
│   │   ├── evaluaciones-list/
│   │   ├── evaluacion-form/
│   │   ├── estadisticas/
│   │   ├── evaluaciones-disponibles/  # Vista de estudiante
│   │   ├── tomar-evaluacion/           # Responder evaluación
│   │   └── resultado-evaluacion/       # Ver resultados
│   ├── services/            # Lógica de negocio
│   │   ├── auth.service.ts
│   │   └── evaluacion.service.ts
│   ├── guards/              # Protección de rutas
│   │   ├── auth.guard.ts
│   │   └── login.guard.ts
│   ├── models/              # Interfaces TypeScript
│   │   └── evaluacion.model.ts
│   └── app.routes.ts        # Configuración de rutas
├── environments/            # Variables de entorno
└── styles.css              # Estilos globales
```

---

## 🌐 URL de Despliegue

**Firebase Hosting:** [https://sistema-evaluacion-5b6eb.web.app](https://sistema-evaluacion-5b6eb.web.app)

**GitHub Pages:** [https://cristianarevalocasa.github.io/Sistema-de-evaluacion-online/](https://cristianarevalocasa.github.io/Sistema-de-evaluacion-online/)

---

## 🎥 Video Demostración

**URL del Video:** [Insertar enlace aquí]

> **📹 Espacio reservado para el video demostrativo del sistema**
> 
> El video debe incluir:
> 1. **Funcionalidades principales**
>    - Vista de profesor: Creación y gestión de evaluaciones
>    - Vista de estudiante: Tomar evaluaciones y ver resultados
>    - Sistema de filtros y búsqueda
> 
> 2. **Flujo de autenticación**
>    - Registro con selección de rol (Estudiante/Profesor)
>    - Inicio de sesión
>    - Protección de rutas con Guards
> 
> 3. **Operaciones con Firestore**
>    - Escritura de datos (crear evaluaciones y respuestas)
>    - Lectura en tiempo real
>    - Actualización y eliminación
>    - Reglas de seguridad
> 
> 4. **Explicación del código**
>    - Componentes principales (profesor y estudiante)
>    - Servicios de Firebase (AuthService, EvaluacionService)
>    - Guards de autenticación
>    - Sistema de calificación automática

---

## 📖 Manual de Usuario

### 1. Registro e Inicio de Sesión

#### Crear una cuenta nueva
1. Acceder a la aplicación
2. Hacer clic en "Registrarse"
3. **Seleccionar tipo de usuario:** 👨‍🎓 Estudiante o 👨‍🏫 Profesor
4. Ingresar correo electrónico y contraseña (mínimo 6 caracteres)
5. Hacer clic en "Registrarse"

#### Iniciar sesión
1. **Seleccionar tipo de usuario:** Estudiante o Profesor
2. Ingresar correo y contraseña
3. Hacer clic en "Iniciar Sesión"
4. **Redireccionamiento:**
   - Estudiantes → Evaluaciones Disponibles
   - Profesores → Gestión de Evaluaciones

---

### 2. Flujo del Estudiante 👨‍🎓

#### Ver evaluaciones disponibles
1. Después de iniciar sesión como estudiante, verás todas las evaluaciones activas
2. Puedes filtrar por:
   - **Categoría:** Matemáticas, Ciencias, Lenguaje, etc.
   - **Búsqueda:** Por título o descripción
3. Cada evaluación muestra:
   - Título y descripción
   - Número de preguntas
   - Puntaje máximo
   - ⏰ Tiempo restante (cuenta regresiva)
   - Fecha límite

#### Tomar una evaluación
1. Hacer clic en "▶️ Comenzar Evaluación"
2. **Durante la evaluación:**
   - Lee cada pregunta cuidadosamente
   - Responde todas las preguntas (obligatorio)
   - El temporizador muestra el tiempo restante hasta la fecha límite
   - Si el tiempo se agota, la evaluación se envía automáticamente
3. **Tipos de preguntas:**
   - **Opción múltiple:** Selecciona una opción con radio buttons
   - **Abierta:** Escribe tu respuesta en el campo de texto
4. Hacer clic en "📝 Enviar Respuestas" cuando termines

#### Ver resultados
1. Después de enviar, verás inmediatamente:
   - 🏆 Icono según tu rendimiento
   - Puntaje obtenido / Puntaje máximo
   - Porcentaje con gráfico circular animado
   - ✓ Badge de "Aprobado" (≥60%) o ✗ "No Aprobado" (<60%)
   - Mensaje motivacional personalizado
2. Hacer clic en "📚 Volver a Evaluaciones" para continuar

---

### 3. Gestión de Evaluaciones (Profesores) 👨‍🏫

#### Crear una nueva evaluación
1. Hacer clic en "Nueva Evaluación"
2. Completar información general:
   - **Título:** Nombre de la evaluación
   - **Descripción:** Detalles sobre el contenido
   - **Categoría:** Materia o tema
   - **Fecha límite:** Fecha y hora de cierre
   - **Estado:** 
     - `Borrador` - No visible para estudiantes
     - `Activa` - Visible y disponible para estudiantes
     - `Cerrada` - Ya no acepta respuestas

3. Agregar preguntas:
   - Hacer clic en "Agregar Pregunta"
   - Escribir el texto de la pregunta
   - Seleccionar tipo (opción múltiple o abierta)
   - Para opción múltiple: agregar opciones (una por línea)
   - Indicar respuesta correcta
   - Asignar puntaje

4. Hacer clic en "Guardar Evaluación"

#### Editar una evaluación
1. En la lista de evaluaciones, hacer clic en "Editar"
2. Modificar la información deseada
3. Hacer clic en "Actualizar Evaluación"

#### Eliminar una evaluación
1. En la lista de evaluaciones, hacer clic en "Eliminar"
2. Confirmar la acción

---

### 4. Búsqueda y Filtros

#### Buscar evaluaciones
- Escribir en el campo de búsqueda
- La búsqueda filtra por título, descripción o categoría en tiempo real

#### Filtrar por estado (Profesores)
- Seleccionar en el menú desplegable:
  - Todos los estados
  - Borrador
  - Activa
  - Cerrada

#### Filtrar por categoría
- Seleccionar categoría del menú desplegable
- Las categorías se generan automáticamente de las evaluaciones existentes

---

### 5. Estadísticas

#### Ver estadísticas de una evaluación (Profesores)
1. En la lista de evaluaciones, hacer clic en "Ver Estadísticas"
2. Se mostrará:
   - Total de respuestas recibidas
   - Promedio de calificaciones
   - Lista de estudiantes con sus puntajes
   - Fecha de entrega de cada respuesta
   - Distribución de puntajes

*Nota: Las estadísticas se actualizan en tiempo real conforme los estudiantes envían sus respuestas.*

---

### 5. Cerrar Sesión

1. Hacer clic en el botón "Cerrar Sesión" en la esquina superior derecha
2. Se redirige automáticamente a la página de login

---

## 🔒 Seguridad

- Las reglas de Firestore garantizan que cada usuario solo puede acceder a sus propias evaluaciones
- Las contraseñas se manejan de forma segura mediante Firebase Authentication
- Todas las rutas protegidas requieren autenticación válida

---

## 👨‍💻 Desarrollo

### Comandos útiles

```bash
# Servidor de desarrollo
ng serve

# Compilar
ng build

# Desplegar a Firebase
firebase deploy --only hosting

# Desplegar a GitHub Pages
ng deploy --base-href=https://CristianArevaloCasa.github.io/Sistema-de-evaluacion-online/
```

---

---

## 👤 Autor

**Cristian Gonzalo Arévalo Casa**

- GitHub: [@CristianArevaloCasa](https://github.com/CristianArevaloCasa)
- Repositorio: [Sistema-de-evaluacion-online](https://github.com/CristianArevaloCasa/Sistema-de-evaluacion-online)
- Universidad Técnica de Ambato
- Carrera: Ingeniería en Software

---

## 📝 Licencia

Este proyecto es de uso académico desarrollado para la asignatura de Computación en Internet III.

