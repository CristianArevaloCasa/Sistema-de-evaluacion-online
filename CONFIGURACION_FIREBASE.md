# 🔥 Configuración Rápida de Firebase

## Paso 1: Crear Proyecto en Firebase

1. Ve a https://console.firebase.google.com/
2. Haz clic en "Agregar proyecto"
3. Ingresa un nombre (ej: "sistema-evaluacion")
4. Continúa con la configuración predeterminada

## Paso 2: Obtener Credenciales

1. En el panel de Firebase, haz clic en el ícono de engranaje ⚙️ > "Configuración del proyecto"
2. Desplázate hasta "Tus apps" y haz clic en el ícono web `</>`
3. Registra tu app con un nombre
4. Copia las credenciales que aparecen en el objeto `firebaseConfig`

## Paso 3: Configurar en el Proyecto

Abre `src/environments/environment.ts` y pega tus credenciales:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSy...",                    // Tu API Key
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456:web:abcdef"
  }
};
```

Haz lo mismo en `src/environments/environment.prod.ts`

## Paso 4: Habilitar Authentication

1. En el menú lateral de Firebase, ve a "Authentication"
2. Haz clic en "Comenzar"
3. En la pestaña "Sign-in method"
4. Habilita "Correo electrónico/contraseña"
5. Guarda

## Paso 5: Crear Firestore Database

1. En el menú lateral, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (o "modo de producción")
4. Elige una ubicación (ej: us-central)
5. Haz clic en "Habilitar"

## Paso 6: Configurar Reglas de Seguridad

1. Ve a la pestaña "Reglas" en Firestore
2. Reemplaza las reglas con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para colección de evaluaciones
    match /evaluaciones/{evaluacionId} {
      // Permitir leer si el usuario está autenticado y es el dueño
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      // Permitir crear si el usuario está autenticado y el userId coincide
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      // Permitir actualizar y eliminar si es el dueño
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Reglas para colección de respuestas
    match /respuestas/{respuestaId} {
      // Cualquier usuario autenticado puede leer y escribir respuestas
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Haz clic en "Publicar"

## Paso 7: Ejecutar la Aplicación

```bash
npm start
```

Abre http://localhost:4200 en tu navegador

## ✅ Verificación

1. Regístrate con un nuevo usuario
2. Deberías ser redirigido a la pantalla de evaluaciones
3. En Firebase Console > Authentication, verás tu usuario
4. Crea una evaluación de prueba
5. En Firebase Console > Firestore Database, verás el documento creado

## 🚨 Problemas Comunes

### Error: "Firebase not initialized"
- Verifica que copiaste todas las credenciales correctamente
- Asegúrate de no tener espacios extra o comillas incorrectas

### Error: "Permission denied"
- Verifica que habilitaste Authentication
- Confirma que las reglas de Firestore están configuradas correctamente

### Error: "Network error"
- Verifica tu conexión a internet
- Revisa que el proyecto de Firebase esté activo

## 📝 Notas Importantes

- **Modo de prueba**: Las reglas de seguridad permiten acceso por 30 días. Después deberás actualizarlas.
- **Cuota gratuita**: Firebase ofrece un plan gratuito generoso, pero tiene límites:
  - 50,000 lecturas/día
  - 20,000 escrituras/día
  - 1 GB de almacenamiento
- **Producción**: Para producción, considera usar las reglas de seguridad más estrictas y habilitar el modo de producción.

## 🎉 ¡Listo!

Tu sistema de evaluación online está configurado y listo para usar.
