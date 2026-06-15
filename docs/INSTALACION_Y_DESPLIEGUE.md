# Guía de Instalación y Despliegue - Eco-Dev

## Requisitos Previos
- **Node.js**: Versión 18 o superior.
- **Angular CLI**: `npm install -g @angular/cli`.
- **Firebase**: Una cuenta de Firebase con un proyecto configurado.

## Instalación de Dependencias
Ejecute el siguiente comando en la carpeta `frontend/dev-eco-feria/`:
```bash
npm install
```

## Configuración de Firebase
Los parámetros de conexión se encuentran en:
`frontend/dev-eco-feria/src/environments/firebase.config.ts`

Debe reemplazar los valores con las credenciales de su propio proyecto de Firebase:
```typescript
export const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  // ... resto de la configuración
};
```

## Ejecución en Desarrollo
Para iniciar un servidor de desarrollo local:
```bash
ng serve
```
La aplicación estará disponible en `http://localhost:4200/`.

## Construcción para Producción
Para generar los archivos listos para desplegar:
```bash
ng build
```
Los archivos se generarán en la carpeta `dist/dev-eco-feria/`.

## Despliegue en Firebase Hosting
1. Inicie sesión en Firebase CLI: `firebase login`.
2. Inicialice el proyecto: `firebase init hosting`.
3. Despliegue: `firebase deploy --only hosting`.
