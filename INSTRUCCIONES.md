# Sistema de Evaluación Online

Sistema completo de evaluación online construido con Angular 20 y Firebase, que permite crear, gestionar y evaluar exámenes en línea con autenticación de usuarios y estadísticas en tiempo real.

## 🚀 Características

### Implementadas
- ✅ **Autenticación de usuarios** con Firebase Authentication (registro, login, logout)
- ✅ **Base de datos en tiempo real** con Firestore para almacenar evaluaciones
- ✅ **CRUD completo de evaluaciones** (crear, editar, eliminar) asociadas al usuario autenticado
- ✅ **Validaciones de formularios** con campos obligatorios y formatos correctos
- ✅ **Filtros y búsqueda avanzada** por nombre, fecha, categoría y estado
- ✅ **Actualización en tiempo real** desde Firestore
- ✅ **Estadísticas completas** con promedios, totales, distribución de puntajes y tasas de aprobación
- ✅ **Interfaz responsive** adaptada a móviles y tablets
- ✅ **Guards de autenticación** para proteger rutas

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Cuenta de Firebase

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd Sistema_de_evaluacion_online
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Firebase**

   a. Ve a [Firebase Console](https://console.firebase.google.com/)
   
   b. Crea un nuevo proyecto o usa uno existente
   
   c. En la configuración del proyecto, obtén tus credenciales de Firebase
   
   d. Abre el archivo `src/environments/environment.ts` y reemplaza los valores:

   ```typescript
   export const environment = {
     production: false,
     firebase: {
       apiKey: "TU_API_KEY",
       authDomain: "TU_AUTH_DOMAIN",
       projectId: "TU_PROJECT_ID",
       storageBucket: "TU_STORAGE_BUCKET",
       messagingSenderId: "TU_MESSAGING_SENDER_ID",
       appId: "TU_APP_ID"
     }
   };
   ```

   e. Haz lo mismo en `src/environments/environment.prod.ts` para producción

4. **Habilitar servicios en Firebase**

   a. **Authentication:**
   - Ve a Authentication > Sign-in method
   - Habilita "Email/Password"

   b. **Firestore Database:**
   - Ve a Firestore Database
   - Crea una base de datos en modo de prueba o producción
   - Configura las reglas de seguridad:

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /evaluaciones/{evaluacionId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
       }
       match /respuestas/{respuestaId} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

## 🎮 Uso

### Desarrollo
```bash
npm start
```
La aplicación se abrirá en `http://localhost:4200`

### Producción
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── login/                    # Autenticación (login/registro)
│   │   ├── evaluaciones-list/        # Lista y gestión de evaluaciones
│   │   ├── evaluacion-form/          # Crear/editar evaluaciones
│   │   └── estadisticas/             # Estadísticas y análisis
│   ├── services/
│   │   ├── auth.service.ts           # Servicio de autenticación
│   │   └── evaluacion.service.ts     # Servicio de evaluaciones
│   ├── models/
│   │   └── evaluacion.model.ts       # Interfaces y modelos
│   ├── guards/
│   │   └── auth.guard.ts             # Guards de autenticación
│   └── environments/
│       ├── environment.ts            # Configuración desarrollo
│       └── environment.prod.ts       # Configuración producción
```

## 🎯 Funcionalidades Detalladas

### 1. Autenticación
- Registro de nuevos usuarios con email y contraseña
- Inicio de sesión seguro
- Cierre de sesión
- Guards para proteger rutas privadas
- Validaciones de formularios

### 2. Gestión de Evaluaciones
- **Crear evaluaciones** con:
  - Título y descripción
  - Categoría personalizada
  - Fecha límite
  - Múltiples preguntas (opción múltiple, verdadero/falso, respuesta corta)
  - Puntajes personalizados por pregunta
  - Estados: borrador, activa, cerrada

- **Editar evaluaciones** existentes
- **Eliminar evaluaciones** con confirmación
- **Búsqueda y filtros** por:
  - Texto (título, descripción, categoría)
  - Estado (activa, cerrada, borrador)
  - Categoría

### 3. Estadísticas
- Total de respuestas
- Promedio general
- Puntajes máximo y mínimo
- Tasa de aprobación
- Distribución de puntajes por rangos
- Lista de respuestas individuales con detalles
- Gráficos visuales de distribución

### 4. Validaciones
- Campos obligatorios en todos los formularios
- Validación de formato de email
- Contraseñas mínimas de 6 caracteres
- Validación de puntajes positivos
- Verificación de fechas

## 🔐 Seguridad

- Autenticación requerida para todas las rutas protegidas
- Solo el creador puede ver y editar sus evaluaciones
- Validaciones tanto en cliente como en servidor
- Reglas de seguridad de Firestore configuradas

## 🎨 Tecnologías Utilizadas

- **Angular 20** - Framework principal
- **Firebase Authentication** - Autenticación de usuarios
- **Cloud Firestore** - Base de datos NoSQL en tiempo real
- **RxJS** - Programación reactiva
- **TypeScript** - Tipado estático
- **CSS3** - Estilos y diseño responsive

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- Desktop (1200px+)
- Tablets (768px - 1199px)
- Móviles (< 768px)

## 🐛 Solución de Problemas

### Error de dependencias
Si encuentras errores al instalar, usa:
```bash
npm install --legacy-peer-deps
```

### Firebase no conecta
- Verifica que las credenciales en `environment.ts` sean correctas
- Asegúrate de haber habilitado Authentication y Firestore en Firebase Console

### Errores de compilación
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📝 Próximas Mejoras

- [ ] Compartir evaluaciones con otros usuarios
- [ ] Exportar estadísticas a PDF/Excel
- [ ] Notificaciones en tiempo real
- [ ] Modo oscuro
- [ ] Múltiples idiomas
- [ ] Sistema de calificación automática avanzado

## 👨‍💻 Autor

CristianArevaloCasa

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
