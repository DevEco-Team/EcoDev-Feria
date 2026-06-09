import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreService, Medicion } from '../../services/firestore.service';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-history-report',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-view animate-fade-in">
      <header class="view-header">
        <h2>Historial de Mediciones</h2>
        <p>Registro detallado de telemetría ambiental capturada por la red en tiempo real.</p>
      </header>

      <div class="filters-bar">
        <div class="filters-main">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Buscar por estación...">
          </div>
        </div>
        <button class="export-button" (click)="exportData()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          <span class="btn-text">Exportar CSV/Excel</span>
        </button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Estación</th>
              <th>CO2</th>
              <th>PM2.5</th>
              <th>Temp/Hum</th>
              <th>Humo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of mediciones()">
              <td class="text-nowrap">{{ formatDate(item.fecha_hora) }}</td>
              <td><strong>{{ item.estacion_id }}</strong></td>
              <td>{{ item.co2 }} <small>ppm</small></td>
              <td>{{ item.particulas }} <small>mg/m³</small></td>
              <td>{{ item.temperatura }}°C / {{ item.humedad }}%</td>
              <td>{{ item.humo }} <small>u</small></td>
              <td>
                <span class="status-tag" [class]="getAirQualityClass(item.estado_calidad_aire)">
                  {{ item.estado_calidad_aire }}
                </span>
              </td>
            </tr>
            <tr *ngIf="mediciones().length === 0">
              <td colspan="7" style="text-align: center; padding: 3rem; color: var(--color-text-muted);">
                No se han encontrado mediciones registradas en Realtime Database.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
      .filters-bar {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        align-items: center;
        background-color: var(--color-panel-bg);
        padding: 1.25rem;
        border-radius: 12px;
        flex-wrap: wrap;
        border: 1px solid var(--color-border);
        backdrop-filter: blur(10px);
      }
      .filters-main {
        display: flex;
        gap: 1rem;
        flex: 1;
        min-width: 280px;
      }
      .search-box {
        position: relative;
        flex: 1;
      }
      .search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 18px;
        height: 18px;
        color: var(--color-accent);
        opacity: 0.6;
      }
      .search-box input {
        background: var(--color-input-bg);
        border: 1px solid var(--color-border);
        color: var(--color-text);
        padding: 0.75rem 1rem 0.75rem 2.75rem;
        border-radius: 8px;
        font-size: 0.9rem;
        outline: none;
        width: 100%;
        transition: var(--transition-smooth);
      }
      .export-button {
        background: transparent;
        border: 1px solid var(--color-accent);
        color: var(--color-accent);
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        transition: all 0.3s ease;
        white-space: nowrap;
      }
      
      @media (max-width: 768px) {
        .filters-main { width: 100%; order: 2; }
        .export-button { width: 100%; order: 1; justify-content: center; }
        .view-header h2 { font-size: 1.5rem; }
      }

      .table-container {
        background-color: var(--color-panel-bg);
        border-radius: 12px;
        overflow-x: auto;
        border: 1px solid var(--color-border);
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      }
      .data-table {
        width: 100%;
        border-collapse: collapse;
        min-width: 700px;
      }
      .data-table th, .data-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid var(--color-border);
        font-size: 0.85rem;
      }
     small { opacity: 0.6; font-size: 0.7rem; }
    .status-tag {
      padding: 0.4rem 0.75rem;
      border-radius: 20px;
      font-size: 0.7rem;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    .status-tag.positive { background: rgba(40, 167, 69, 0.1); color: #28a745; border: 1px solid #28a745; }
    .status-tag.neutral { background: rgba(255, 193, 7, 0.1); color: #ffc107; border: 1px solid #ffc107; }
    .status-tag.error { background: rgba(220, 53, 69, 0.1); color: #dc3545; border: 1px solid #dc3545; }
  `]
})
export class HistoryReportComponent implements OnInit, OnDestroy {
  private firestoreService = inject(FirestoreService);
  private exportService = inject(ExportService);
  
  mediciones = signal<Medicion[]>([]);
  private unsubRTDB: any;
  private unsubFirestore: any;

  ngOnInit() {
    this.listenToHistory();
  }

  ngOnDestroy() {
    if (this.unsubRTDB) {
      if (typeof this.unsubRTDB === 'function') this.unsubRTDB();
      else if (this.unsubRTDB.unsubscribe) this.unsubRTDB.unsubscribe();
    }
    if (this.unsubFirestore) {
      this.unsubFirestore();
    }
  }

  listenToHistory() {
    const allDataMap = new Map<string, Medicion[]>();

    const updateView = () => {
      const merged: Medicion[] = [];
      allDataMap.forEach(meds => merged.push(...meds));
      merged.sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());
      this.mediciones.set(merged);
    };

    // Fuente 1: RTDB
    this.unsubRTDB = this.firestoreService.getRTDBMedicionesHistory(50, (data) => {
      allDataMap.set('rtdb', data);
      updateView();
    });

    // Fuente 2: Firestore
    this.unsubFirestore = this.firestoreService.getFirestoreMediciones((data) => {
      allDataMap.set('firestore', data);
      updateView();
    });
  }

  formatDate(timestamp: any): string {
    if (!timestamp) return '---';
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  getAirQualityClass(status: string | undefined): string {
    if (!status) return 'neutral';
    const s = status.toLowerCase();
    
    // VERDE: Óptimo, Bueno, Excelente, Bajo
    if (s.includes('óptimo') || s.includes('bueno') || s.includes('excelente') || s.includes('bajo')) {
      return 'positive';
    }
    
    // AMARILLO: Moderado, Aceptable, Normal
    if (s.includes('moderado') || s.includes('aceptable') || s.includes('normal')) {
      return 'neutral';
    }
    
    // ROJO: Alerta, Riesgo, Crítico, Peligro, Malo
    if (s.includes('alerta') || s.includes('riesgo') || s.includes('crítico') || s.includes('peligro') || s.includes('malo')) {
      return 'error';
    }
    
    return 'neutral';
  }

  exportData() {
    const dataToExport = this.mediciones().map(m => ({
      Fecha_Hora: this.formatDate(m.fecha_hora),
      Estacion: m.estacion_id,
      CO2_ppm: m.co2,
      PM25_mgm3: m.particulas,
      Temperatura_C: m.temperatura,
      Humedad_porc: m.humedad,
      Humo_u: m.humo,
      Benceno_ppb: m.benceno,
      Estado: m.estado_calidad_aire
    }));

    this.exportService.exportToExcel(dataToExport, 'Historial_Ambiental_DevEco');
  }
}
