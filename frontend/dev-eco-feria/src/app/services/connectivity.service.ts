import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ConnectivityService {
  private platformId = inject(PLATFORM_ID);
  
  // Signal para el estado de conexión
  isOnline = signal<boolean>(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Inicializar con el estado actual
      this.isOnline.set(navigator.onLine);

      // Escuchar eventos de red
      window.addEventListener('online', () => {
        console.log("Conexión restablecida");
        this.isOnline.set(true);
      });

      window.addEventListener('offline', () => {
        console.log("Conexión perdida - Modo fuera de línea activado");
        this.isOnline.set(false);
      });
    }
  }

  /**
   * Alterna manualmente el estado de conexión (para pruebas o modo simulación).
   */
  toggleConnection() {
    this.isOnline.update(state => !state);
  }
}
