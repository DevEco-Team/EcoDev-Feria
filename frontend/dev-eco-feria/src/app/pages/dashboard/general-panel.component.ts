import { Component, inject, OnInit, signal, OnDestroy, ViewChild, ElementRef, effect, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { FirestoreService, Medicion } from '../../services/firestore.service';
import { Router } from '@angular/router';

interface MetricDisplayConfig {
  key: string;
  label: string;
  unit: string;
  icon: string;
  threshold?: number;
  thresholdType?: 'high' | 'low';
}

@Component({
  selector: 'app-general-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-view animate-fade-in">
      <header class="view-header">
        <div class="header-main">
          <div class="header-text">
            <span class="view-subtitle">Red de Microestaciones Inteligentes</span>
            <h2>Monitorización de Calidad del Aire</h2>
          </div>
          <div class="header-actions">
            <div class="live-indicator">
              <span class="dot pulse"></span>
              EN VIVO
            </div>
            <button class="logout-btn-panel" (click)="logout()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span>Salir</span>
            </button>
          </div>
        </div>
        <p>Sistema dinámico de telemetría ambiental. Los datos se actualizan automáticamente al detectarse cambios en los sensores.</p>
      </header>

      <!-- Selector de Estaciones (Slider) -->
      <div class="station-slider-container">
        <button class="slide-btn prev" (click)="prevStation()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        
        <div class="station-track">
          <div *ngFor="let s of stations" 
               class="station-chip" 
               [class.active]="selectedStationId() === s.id"
               (click)="selectStation(s.id)">
            <span class="chip-dot"></span>
            {{ s.name }}
          </div>
        </div>

        <button class="slide-btn next" (click)="nextStation()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>

      <!-- Estado General (Resumen) -->
      @if (latestMedicion(); as data) {
        <div class="summary-card" [ngClass]="getAirQualityClass(data.estado_calidad_aire)">
          <div class="summary-icon">
            @if (getAirQualityClass(data.estado_calidad_aire) === 'positive') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            } @else if (getAirQualityClass(data.estado_calidad_aire) === 'neutral') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            }
          </div>
          <div class="summary-content">
            <span class="summary-label">Estado de la Estación: <strong>{{ getStationName(selectedStationId()) }}</strong></span>
            <h3>{{ data.estado_calidad_aire }}</h3>
          </div>
        </div>
      } @else {
        <div class="summary-card neutral">
          <div class="summary-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <div class="summary-content">
            <span class="summary-label">Estado de la Estación: <strong>{{ getStationName(selectedStationId()) }}</strong></span>
            <h3>SIN DATOS / CONECTANDO...</h3>
          </div>
        </div>
      }

      <!-- Métricas Dinámicas -->
      <div class="metrics-grid">
        <div *ngFor="let config of metricConfigs; let i = index" 
             class="metric-card" 
             [style.animation-delay]="(i * 0.1) + 's'">
          <div class="metric-icon" [innerHTML]="sanitizeHtml(config.icon)"></div>
          <div class="metric-info">
            <span class="metric-label">{{ config.label }}</span>
            <span class="metric-value">
              {{ latestMedicion() ? latestMedicion()![config.key] : '---' }}
              <small>{{ config.unit }}</small>
            </span>
            <span class="metric-change" [ngClass]="getMetricStatusClass(config)">
              {{ getMetricStatusLabel(config) }}
            </span>
          </div>
        </div>
      </div>

      <div class="main-grid">
        <!-- Gráfico de Gases y Partículas -->
        <div class="content-card animate-fade-in" style="animation-delay: 0.7s">
          <div class="card-header">
            <h3>Calidad del Aire</h3>
            <div class="sensor-tag">Historial de Estación</div>
          </div>
          <div class="chart-container">
            <canvas #gasesChart></canvas>
          </div>
        </div>

        <!-- Gráfico de Variables Ambientales -->
        <div class="content-card animate-fade-in" style="animation-delay: 0.8s">
          <div class="card-header">
            <h3>Variables Ambientales</h3>
            <div class="sensor-tag">Temp & Hum</div>
          </div>
          <div class="chart-container">
            <canvas #envChart></canvas>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .header-actions { display: flex; align-items: center; gap: 1.5rem; }
    .live-indicator { 
      display: flex; align-items: center; gap: 0.5rem; 
      font-size: 0.7rem; font-weight: 800; color: #ff4d4d;
      padding: 0.4rem 0.8rem; background: rgba(255, 77, 77, 0.1);
      border-radius: 4px; border: 1px solid rgba(255, 77, 77, 0.2);
    }

    /* Station Slider Styles */
    .station-slider-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 1rem 0;
      padding: 0.5rem;
      background: rgba(100, 255, 218, 0.03);
      border-radius: 12px;
      border: 1px solid var(--color-border);
    }
    .station-track {
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
      flex: 1;
      scrollbar-width: none;
      scroll-behavior: smooth;
      padding: 0.5rem 0.25rem;
      mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
    }
    .station-track::-webkit-scrollbar { display: none; }
    
    .station-chip {
      padding: 0.6rem 1.25rem;
      background: var(--color-panel-bg);
      border: 1px solid var(--color-border);
      border-radius: 50px;
      color: var(--color-text-muted);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: var(--transition-smooth);
      flex-shrink: 0;
    }
    .station-chip:hover { border-color: var(--color-accent); color: var(--color-text); }
    .station-chip.active {
      background: rgba(100, 255, 218, 0.1);
      border-color: var(--color-accent);
      color: var(--color-accent);
      box-shadow: 0 0 15px rgba(100, 255, 218, 0.1);
    }
    .chip-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
    
    .slide-btn {
      background: rgba(100, 255, 218, 0.05);
      border: 1px solid var(--color-border);
      color: var(--color-accent);
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .slide-btn:hover { background: var(--color-accent); color: var(--color-base); }
    .slide-btn svg { width: 18px; }

    .summary-card {
      display: flex; align-items: center; gap: 2rem;
      padding: 2rem; border-radius: 12px; border: 1px solid var(--color-border);
      background: var(--color-panel-bg); backdrop-filter: blur(10px);
      transition: var(--transition-smooth);
    }
    .summary-card.positive { border-color: #28a745; box-shadow: 0 0 20px rgba(40, 167, 69, 0.1); }
    .summary-card.neutral { border-color: #ffc107; box-shadow: 0 0 20px rgba(255, 193, 7, 0.1); }
    .summary-card.error { border-color: #dc3545; box-shadow: 0 0 20px rgba(220, 53, 69, 0.1); }
    .summary-icon { width: 48px; height: 48px; color: var(--color-accent); flex-shrink: 0; }
    .summary-card.positive .summary-icon { color: #28a745; }
    .summary-card.neutral .summary-icon { color: #ffc107; }
    .summary-card.error .summary-icon { color: #dc3545; }
    .summary-label { font-size: 0.7rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 1px; }
    .summary-label strong { color: var(--color-accent); }
    .summary-content h3 { font-size: 1.5rem; margin: 0.25rem 0 0; }

    .metric-value small { font-size: 0.9rem; opacity: 0.6; margin-left: 4px; }
    
    .chart-container {
      position: relative;
      height: 300px;
      width: 100%;
    }

    .main-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    @media (max-width: 1024px) {
      .main-grid {
        grid-template-columns: 1fr;
      }
      .summary-card { padding: 1.5rem; gap: 1.5rem; }
    }

    @media (max-width: 768px) {
      .summary-card { flex-direction: column; text-align: center; gap: 1rem; padding: 1.25rem; }
      .header-actions { width: 100%; justify-content: space-between; }
      .view-header h2 { font-size: 1.5rem; }
      .station-chip { padding: 0.5rem 1rem; font-size: 0.75rem; }
    }
  `]
})
export class GeneralPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  private authService = inject(AuthService);
  private firestoreService = inject(FirestoreService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);

  @ViewChild('gasesChart') gasesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('envChart') envCanvas!: ElementRef<HTMLCanvasElement>;

  latestMedicion = signal<Medicion | null>(null);
  historicalMediciones = signal<Medicion[]>([]);
  allMediciones = signal<Medicion[]>([]);
  selectedStationId = signal<string>('plaza_san_martin');
  
  private unsubscribe: any;
  private unsubFirestore: any;

  gasesChart: any = null;
  envChart: any = null;
  private viewInitialized = false;
  private Chart: any;

  stations = [
    { id: 'plaza_san_martin', name: 'Plaza San Martín' },
    { id: 'av_colon_gral_paz', name: 'Av. Colón y Gral. Paz' },
    { id: 'terminal_omnibus', name: 'Terminal de Ómnibus' },
    { id: 'microestacion_01', name: 'Microestación 01' },
    { id: 'Rio Cuarto', name: 'Central de Río Cuarto' }
  ];

  // Configuración dinámica de métricas
  metricConfigs: MetricDisplayConfig[] = [
    { 
      key: 'co2', label: 'Dióxido de Carbono', unit: 'ppm', 
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M2 12h20"></path></svg>',
      threshold: 800, thresholdType: 'high'
    },
    { 
      key: 'benceno', label: 'Benceno (C6H6)', unit: 'ppb', 
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>',
      threshold: 5, thresholdType: 'high'
    },
    { 
      key: 'particulas', label: 'Partículas PM2.5', unit: 'mg/m³', 
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
      threshold: 50, thresholdType: 'high'
    },
    { 
      key: 'humo', label: 'Presencia de Humo', unit: 'u', 
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M8 12v.01"></path><path d="M12 12v.01"></path><path d="M16 12v.01"></path></svg>',
      threshold: 200, thresholdType: 'high'
    },
    { 
      key: 'humedad', label: 'Humedad Relativa', unit: '%', 
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
      threshold: 30, thresholdType: 'low'
    },
    { 
      key: 'temperatura', label: 'Temperatura', unit: '°C', 
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>'
    }
  ];

  constructor() {
    // Efecto para actualizar gráficos cuando cambian las mediciones filtradas
    effect(() => {
      const data = this.historicalMediciones();
      if (data.length > 0 && this.viewInitialized && isPlatformBrowser(this.platformId)) {
        this.updateCharts(data);
      }
    });

    // Efecto para filtrar datos cuando cambia la estación o llegan nuevos datos
    effect(() => {
      const all = this.allMediciones();
      const stationId = this.selectedStationId();
      
      console.log(`Filtrando para: ${stationId}. Total en BD: ${all.length}`);
      
      const filtered = all.filter(m => m.estacion_id === stationId);
      
      if (filtered.length > 0) {
        console.log(`Dato encontrado para ${stationId}:`, filtered[0]);
        this.latestMedicion.set(filtered[0]);
        // Para el gráfico mostramos cronológicamente
        this.historicalMediciones.set([...filtered].reverse());
      } else {
        console.warn(`Sin datos en BD para la estación: ${stationId}`);
        this.latestMedicion.set(null);
        this.historicalMediciones.set([]);
      }
    });
  }

  ngOnInit() {
    this.listenToMediciones();
  }

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.viewInitialized = true;
      
      // Carga dinámica de Chart.js solo en el navegador
      const { default: ChartJs } = await import('chart.js/auto');
      this.Chart = ChartJs;

      const data = this.historicalMediciones();
      if (data.length > 0) {
        setTimeout(() => this.updateCharts(data), 0);
      }
    }
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      if (typeof this.unsubscribe === 'function') {
        this.unsubscribe();
      } else if (this.unsubscribe.unsubscribe) {
        this.unsubscribe.unsubscribe();
      }
    }
    if (this.unsubFirestore) {
      this.unsubFirestore();
    }
    if (this.gasesChart) this.gasesChart.destroy();
    if (this.envChart) this.envChart.destroy();
  }

  sanitizeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  listenToMediciones() {
    const allDataMap = new Map<string, Medicion[]>();

    const updateAllMediciones = () => {
      const merged: Medicion[] = [];
      allDataMap.forEach(meds => merged.push(...meds));
      // Ordenar por fecha descendente
      merged.sort((a, b) => {
        const timeA = new Date(a.fecha_hora).getTime();
        const timeB = new Date(b.fecha_hora).getTime();
        return timeB - timeA;
      });
      this.allMediciones.set(merged);
    };

    // Fuente 1: Realtime Database (4 estaciones originales)
    this.unsubscribe = this.firestoreService.getRTDBMediciones((mediciones) => {
      const rtdbIds = ['plaza_san_martin', 'av_colon_gral_paz', 'terminal_omnibus', 'microestacion_01'];
      const rtdbData = mediciones.filter(m => rtdbIds.includes(m.estacion_id));
      allDataMap.set('rtdb', rtdbData);
      updateAllMediciones();
    });

    // Fuente 2: Cloud Firestore (Central de Río Cuarto)
    this.unsubFirestore = this.firestoreService.getFirestoreMediciones((mediciones) => {
      // Usamos el ID exacto que viene de Firestore
      const firestoreData = mediciones.filter(m => m.estacion_id === 'Rio Cuarto');
      allDataMap.set('firestore', firestoreData);
      updateAllMediciones();
    });
  }

  selectStation(id: string) {
    this.selectedStationId.set(id);
  }

  getStationName(id: string): string {
    return this.stations.find(s => s.id === id)?.name || id;
  }

  prevStation() {
    const idx = this.stations.findIndex(s => s.id === this.selectedStationId());
    const prevIdx = (idx - 1 + this.stations.length) % this.stations.length;
    this.selectStation(this.stations[prevIdx].id);
  }

  nextStation() {
    const idx = this.stations.findIndex(s => s.id === this.selectedStationId());
    const nextIdx = (idx + 1) % this.stations.length;
    this.selectStation(this.stations[nextIdx].id);
  }

  updateCharts(data: Medicion[]) {
    if (!this.gasesCanvas || !this.envCanvas || !this.Chart) return;

    const labels = data.map(m => this.formatTime(m.fecha_hora));
    const ctxGases = this.gasesCanvas.nativeElement.getContext('2d');
    const ctxEnv = this.envCanvas.nativeElement.getContext('2d');

    if (!ctxGases || !ctxEnv) return;

    // Helper for gradients
    const createGradient = (ctx: CanvasRenderingContext2D, color: string) => {
      const g = ctx.createLinearGradient(0, 0, 0, 300);
      
      // Robust Hex to RGBA conversion
      let r = 100, g1 = 255, b = 218; // Default accent color
      
      if (color.startsWith('#')) {
        const hex = color.replace('#', '');
        if (hex.length === 3) {
          r = parseInt(hex[0] + hex[0], 16);
          g1 = parseInt(hex[1] + hex[1], 16);
          b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
          r = parseInt(hex.slice(0, 2), 16);
          g1 = parseInt(hex.slice(2, 4), 16);
          b = parseInt(hex.slice(4, 6), 16);
        }
      }

      try {
        g.addColorStop(0, `rgba(${r}, ${g1}, ${b}, 0.2)`);
        g.addColorStop(1, `rgba(${r}, ${g1}, ${b}, 0)`);
        return g;
      } catch (e) {
        console.warn('Error creating gradient for color:', color);
        return 'transparent';
      }
    };

    const commonOptions: any = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: { 
            color: '#8892b0', 
            usePointStyle: true,
            pointStyle: 'circle',
            font: { size: 10, family: "'Plus Jakarta Sans', sans-serif" },
            padding: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(10, 25, 47, 0.9)',
          titleFont: { family: "'Oswald', sans-serif" },
          bodyFont: { family: "'Plus Jakarta Sans', sans-serif" },
          borderColor: 'rgba(100, 255, 218, 0.2)',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: (context: any) => ` ${context.dataset.label}: ${context.parsed.y}`
          }
        }
      },
      scales: {
        x: { 
          grid: { display: false }, 
          ticks: { color: '#8892b0', font: { size: 10 }, maxRotation: 0 } 
        },
        y: { 
          grid: { color: 'rgba(100, 255, 218, 0.05)', drawBorder: false }, 
          ticks: { color: '#8892b0', font: { size: 10 }, padding: 10 } 
        }
      }
    };

    // Gases Chart
    const gasesDatasets = [
      { label: 'CO2 (ppm)', data: data.map(m => m.co2), borderColor: '#64ffda', backgroundColor: createGradient(ctxGases, '#64ffda'), fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4 },
      { label: 'PM2.5 (mg)', data: data.map(m => m.particulas), borderColor: '#ffc107', backgroundColor: createGradient(ctxGases, '#ffc107'), fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4 },
      { label: 'Humo (u)', data: data.map(m => m.humo), borderColor: '#ff4d4d', backgroundColor: createGradient(ctxGases, '#ff4d4d'), fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4 },
      { label: 'Benceno (ppb)', data: data.map(m => m.benceno), borderColor: '#bd93f9', backgroundColor: createGradient(ctxGases, '#bd93f9'), fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4 }
    ];

    if (!this.gasesChart) {
      this.gasesChart = new this.Chart(this.gasesCanvas.nativeElement, {
        type: 'line',
        data: { labels, datasets: gasesDatasets },
        options: commonOptions
      });
    } else {
      this.gasesChart.data.labels = labels;
      this.gasesChart.data.datasets = gasesDatasets;
      this.gasesChart.update('none');
    }

    // Env Chart
    const envDatasets = [
      { label: 'Temp (°C)', data: data.map(m => m.temperatura), borderColor: '#ff944d', backgroundColor: createGradient(ctxEnv, '#ff944d'), fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4 },
      { label: 'Hum (%)', data: data.map(m => m.humedad), borderColor: '#4da3ff', backgroundColor: createGradient(ctxEnv, '#4da3ff'), fill: true, tension: 0.4, borderWidth: 2, pointRadius: 0, pointHoverRadius: 4 }
    ];

    if (!this.envChart) {
      this.envChart = new this.Chart(this.envCanvas.nativeElement, {
        type: 'line',
        data: { labels, datasets: envDatasets },
        options: {
          ...commonOptions,
          scales: {
            ...commonOptions.scales,
            y: { ...commonOptions.scales.y, min: 0, max: 100 } // Fix scale for % and normal temp
          }
        }
      });
    } else {
      this.envChart.data.labels = labels;
      this.envChart.data.datasets = envDatasets;
      this.envChart.update('none');
    }
  }

  getAirQualityClass(status: string | undefined): string {
    if (!status) return 'neutral';
    const s = status.toLowerCase();
    if (s.includes('bueno') || s.includes('óptimo') || s.includes('excelente') || s.includes('bajo')) return 'positive';
    if (s.includes('moderado') || s.includes('aceptable')) return 'neutral';
    return 'error';
  }

  getMetricStatusClass(config: MetricDisplayConfig): string {
    const val = this.latestMedicion()?.[config.key];
    if (val === undefined || config.threshold === undefined) return 'neutral';
    
    if (config.thresholdType === 'high') {
      if (val > config.threshold * 1.5) return 'error'; 
      if (val > config.threshold) return 'neutral'; 
      return 'positive'; 
    } else {
      if (val < config.threshold * 0.5) return 'error';
      if (val < config.threshold) return 'neutral';
      return 'positive';
    }
  }

  getMetricStatusLabel(config: MetricDisplayConfig): string {
    const val = this.latestMedicion()?.[config.key];
    if (val === undefined) return 'Cargando...';
    if (config.threshold === undefined) return 'Estable';

    const isAlert = config.thresholdType === 'high' ? val > config.threshold : val < config.threshold;
    return isAlert ? 'Fuera de rango' : 'Normal';
  }

  formatTime(timestamp: any): string {
    if (!timestamp) return '--:--';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
