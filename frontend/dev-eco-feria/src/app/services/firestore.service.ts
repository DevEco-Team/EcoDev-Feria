import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private firestore = inject(Firestore);

  async getEstaciones() {
    const estacionesRef = collection(this.firestore, 'estaciones');
    const snapshot = await getDocs(estacionesRef);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}