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
export interface Medicion {
  id?: string;
  estacion_id: string;
  humo: number;
  temperatura: number;
  particulas: number;
  co2: number;
  benceno: number;
  humedad: number;
  estado_calidad_aire: string;
  fecha_hora: any;
  lat?: number;
  lng?: number;
  [key: string]: any; 
}

export interface Estacion {
  id?: string;
  nombre: string;
  lat?: number;
  lng?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);
  private database = inject(Database);

  /**
   * Escucha Realtime Database (RTDB)
   * Procesa mediciones de cualquier estación presente en el historial
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

      mediciones.sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());
      callback(mediciones);
    });
  }

  /**
   * Escucha Cloud Firestore
   * Procesa mediciones de cualquier estación presente en la colección
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
   * Helper para normalizar datos de cualquier fuente
   */
  private mapToMedicion(item: any, id: string): Medicion {
    const rawCO2 = item['co2'] ?? item['CO2'] ?? 0;
    return {
      id: id,
      estacion_id: item['estacion_id'] || item['id_estacion'] || item['domo'] || 'Desconocida',
      temperatura: Number(item['temperatura'] ?? item['temp'] ?? 0),
      humedad: Number(item['humedad'] ?? item['hum'] ?? 0),
      co2: Number(rawCO2),
      particulas: Number(item['particulas'] ?? item['polvo'] ?? 0),
      benceno: Number(item['benceno'] ?? 0),
      humo: Number(item['humo'] ?? 0),
      estado_calidad_aire: item['estado_calidad_aire'] || (Number(rawCO2) > 1000 ? 'Critico' : 'Bueno'),
      fecha_hora: item['fecha_hora']?.toDate ? item['fecha_hora'].toDate().toISOString() : (item['fecha_hora'] || new Date().toISOString()),
      lat: Number(item['latitud'] ?? item['lat'] ?? 0),
      lng: Number(item['longitud'] ?? item['lng'] ?? 0)
    };
  }

  getRTDBMedicionesHistory(limit: number = 50, callback: (mediciones: Medicion[]) => void) {
    return this.getRTDBMediciones(callback);
  }
}
