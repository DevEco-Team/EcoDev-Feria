# Documentación Técnica - Proyecto Eco-Dev 2026

## 1. Introducción
El proyecto **Eco-Dev** es una Red de Microestaciones Inteligentes diseñada para el monitoreo de la calidad del aire en tiempo real. Utiliza tecnologías IoT para la recolección de datos y una plataforma web moderna para la visualización y análisis de la telemetría ambiental.

## 2. Arquitectura del Sistema
El sistema se basa en una arquitectura de cliente-servidor desacoplada:
- **Frontend**: Aplicación SPA (Single Page Application) desarrollada con **Angular 19**.
- **Backend/Backend-as-a-Service**: **Firebase**, utilizando:
  - **Realtime Database (RTDB)**: Para la recepción de telemetría de baja latencia desde los dispositivos IoT.
  - **Cloud Firestore**: Para la persistencia de datos históricos y failover.
  - **Firebase Auth**: Para la gestión de usuarios y seguridad.

## 3. Estructura del Proyecto Frontend
La aplicación sigue el patrón de diseño por componentes y servicios de Angular:

### 3.1. Servicios Principales (`src/app/services/`)
- **`FirestoreService`**: El corazón de la gestión de datos. Normaliza la información de RTDB y Firestore, calcula la calidad del aire y expone señales reactivas (Signals) a los componentes.
- **`AuthService`**: Gestiona el ciclo de vida de la sesión del usuario mediante Firebase Auth.
- **`ConnectivityService`**: Detecta el estado de la conexión a internet y permite la simulación de modo offline mediante un interruptor manual.
- **`ThemeService`**: Gestiona la persistencia y el cambio entre temas claro y oscuro.
- **`ExportService`**: Utiliza `xlsx` para generar reportes descargables del historial de mediciones.

### 3.2. Vistas del Dashboard (`src/app/pages/dashboard/`)
- **Panel General**: Visualización en tiempo real con gráficos de Chart.js, indicadores de estado semánticos y selección de estaciones.
- **Historial y Reporte**: Tabla detallada de registros históricos con capacidad de exportación a Excel/CSV.
- **Mapa de Calor**: Visualización geoespacial de la concentración de contaminantes.

## 4. Lógica de Calidad del Aire
El sistema implementa un algoritmo de clasificación automática basado en niveles de CO2 (ppm):
- **Excelente**: < 600 ppm
- **Bueno**: 600 - 1000 ppm
- **Moderado**: 1000 - 1500 ppm
- **Malo**: 1500 - 2000 ppm
- **Crítico**: > 2000 ppm

Esta lógica está centralizada en `FirestoreService` para asegurar consistencia en toda la interfaz.

## 5. Modelos de Datos
### Medicion
```typescript
export interface Medicion {
  id?: string;
  estacion_id: string;
  humo: number;
  temperatura: number;
  particulas: number;
  co2: number;
  humedad: number;
  estado_calidad_aire: string;
  fecha_hora: string;
  lat?: number;
  lng?: number;
}
```

## 6. Características Especiales
- **Modo Offline**: Implementado mediante un Toggle en el Navbar que permite probar la resiliencia de la app ante desconexiones.
- **Dashboard Reactivo**: Utiliza Angular Signals para actualizaciones instantáneas de la interfaz sin recargas de página cuando llegan nuevos datos IoT.
- **Responsividad Crítica**: Diseñado con un enfoque "Mobile-First" para ser consultado desde dispositivos móviles en plantas industriales o en el hogar.
