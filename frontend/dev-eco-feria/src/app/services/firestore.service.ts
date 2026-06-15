import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  onSnapshot,
  query as firestoreQuery,
  orderBy as firestoreOrderBy,
  limit as firestoreLimit
} from '@angular/fire/firestore';
import { Database, ref, onValue, query as rtdbQuery, orderByKey, limitToLast } from '@angular/fire/database';

/**
 * Interfaces para los datos de Firebase
 */
/**
 * Interface que define la estructura de una Medición ambiental.
 * Centraliza los datos provenientes de sensores IoT (CO2, partículas, temperatura, etc.)
 */
export interface Medicion {
  /** Identificador único de la medición (ID de documento o timestamp) */
  id?: string;
  /** Identificador de la estación de origen (ej: plaza_san_martin) */
  estacion_id: string;
  /** Nivel de presencia de humo detectado (unidad relativa) */
  humo: number;
  /** Temperatura ambiental en grados Celsius */
  temperatura: number;
  /** Concentración de partículas PM2.5 en mg/m³ */
  particulas: number;
  /** Concentración de Dióxido de Carbono en partes por millón (ppm) */
  co2: number;
  /** Porcentaje de humedad relativa ambiental */
  humedad: number;
  /** Etiqueta descriptiva del estado (Excelente, Bueno, Moderado, Malo, Crítico) */
  estado_calidad_aire: string;
  /** Fecha y hora de la medición en formato ISO String o similar */
  fecha_hora: any;
  /** Coordenada de latitud de la estación */
  lat?: number;
  /** Coordenada de longitud de la estación */
  lng?: number;
  /** Permitir campos adicionales dinámicos */
  [key: string]: any; 
}

/**
 * Interface para la definición de una Estación de monitoreo.
 */
export interface Estacion {
  /** ID único de la estación */
  id?: string;
  /** Nombre descriptivo de la estación */
  nombre: string;
  /** Ubicación geográfica (latitud) */
  lat?: number;
  /** Ubicación geográfica (longitud) */
  lng?: number;
}

/**
 * Servicio encargado de la sincronización y normalización de datos entre Firebase y la aplicación.
 * Gestiona tanto Cloud Firestore (datos persistentes) como Realtime Database (telemetría en vivo).
 */
@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);
  private database = inject(Database);

  /**
   * Establece una suscripción en tiempo real a Realtime Database (RTDB).
   * @param callback Función que se ejecuta cada vez que hay nuevos datos en el historial.
   * @returns Unsuscribe function para detener la escucha.
   */
  getRTDBMediciones(callback: (mediciones: Medicion[]) => void) {
    const dbRef = ref(this.database, 'DevEco/Historial');
    const q = rtdbQuery(dbRef, orderByKey(), limitToLast(50));

    return onValue(q, (snapshot) => {
      const data = snapshot.val();
      if (!data) { callback([]); return; }

      const mediciones: Medicion[] = Object.keys(data).map(key => {
        const item = data[key];
        return this.mapToMedicion(item, key);
      });

      // Ordenar cronológicamente descendente (más recientes primero)
      mediciones.sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());
      callback(mediciones);
    });
  }

  /**
   * Establece una suscripción en tiempo real a Cloud Firestore.
   * Utilizado como fuente alternativa o complementaria de mediciones.
   * @param callback Función que recibe el listado normalizado de mediciones.
   */
  getFirestoreMediciones(callback: (mediciones: Medicion[]) => void) {
    const collRef = collection(this.firestore, 'mediciones');
    const q = firestoreQuery(collRef, firestoreLimit(50));

    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) { callback([]); return; }

      const mediciones = snapshot.docs.map(doc => {
        const item = doc.data();
        return this.mapToMedicion(item, doc.id);
      });

      mediciones.sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());
      callback(mediciones);
    }, (error) => {
      console.error("Error Firestore Failover:", error);
      callback([]);
    });
  }

  /**
   * Normaliza y mapea objetos crudos de Firebase a la interface Medicion.
   * Asegura que el tipado y los nombres de campos sean consistentes.
   * @param item Objeto crudo de la base de datos.
   * @param id Identificador del registro.
   * @private
   */
  private mapToMedicion(item: any, id: string): Medicion {
    const rawCO2 = item['co2'] ?? item['CO2'] ?? 0;
    
    // Resolución de fecha: intenta obtener el timestamp de diversos campos posibles
    let fecha: any = item['fecha_hora'] || item['timestamp'] || item['time'] || item['fecha'] || item['FECHA_HORA'];
    
    // Fallback: si el ID es un timestamp numérico (común en RTDB)
    if (!fecha && id && !isNaN(Number(id)) && id.length >= 10) {
      const numId = Number(id);
      fecha = numId > 10000000000 ? numId : numId * 1000;
    }

    // Normalización a ISO String para consistencia en toda la app
    let fechaNormalizada: string;
    if (fecha?.toDate) {
      fechaNormalizada = fecha.toDate().toISOString();
    } else if (fecha) {
      const d = new Date(fecha);
      if (!isNaN(d.getTime())) {
        fechaNormalizada = d.toISOString();
      } else {
        fechaNormalizada = this.tryParseSpanishDate(fecha) || new Date().toISOString();
      }
    } else {
      fechaNormalizada = new Date().toISOString();
    }

    return {
      id: id,
      estacion_id: item['estacion_id'] || item['id_estacion'] || item['domo'] || item['sensor'] || 'Desconocida',
      temperatura: Number(item['temperatura'] ?? item['temp'] ?? 0),
      humedad: Number(item['humedad'] ?? item['hum'] ?? 0),
      co2: Number(rawCO2),
      particulas: Number(item['particulas'] ?? item['polvo'] ?? 0),
      humo: Number(item['humo'] ?? 0),
      estado_calidad_aire: item['estado_calidad_aire'] || this.calculateAirQuality(Number(rawCO2)),
      fecha_hora: fechaNormalizada,
      lat: Number(item['latitud'] ?? item['lat'] ?? 0),
      lng: Number(item['longitud'] ?? item['lng'] ?? 0)
    };
  }

  /**
   * Calcula semánticamente el estado de calidad del aire basándose en ppm de CO2.
   * @param co2 Concentración de CO2.
   * @returns Etiqueta de estado.
   */
  private calculateAirQuality(co2: number): string {
    if (co2 < 600) return 'Excelente';
    if (co2 < 1000) return 'Bueno';
    if (co2 < 1500) return 'Moderado';
    if (co2 < 2000) return 'Malo';
    return 'Crítico';
  }

  /**
   * Intenta parsear fechas en formatos regionales comunes (ej: DD/MM/YYYY).
   * @param dateStr String de fecha a procesar.
   */
  private tryParseSpanishDate(dateStr: any): string | null {
    if (typeof dateStr !== 'string') return null;
    const parts = dateStr.split(/[\/\s:-]/);
    if (parts.length >= 3) {
      // Formato DD/MM/YYYY
      if (parts[0].length <= 2 && parts[2].length === 4) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        return !isNaN(d.getTime()) ? d.toISOString() : null;
      }
    }
    return null;
  }

  /**
   * Alias para obtener mediciones históricas con límites.
   */
  getRTDBMedicionesHistory(limit: number = 50, callback: (mediciones: Medicion[]) => void) {
    return this.getRTDBMediciones(callback);
  }
}
