import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-general-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-view animate-fade-in">
      <header class="view-header">
        <span class="view-subtitle">Red de Microestaciones Inteligentes</span>
        <h2>Monitorización de Calidad del Aire</h2>
        <p>Datos en tiempo real recolectados por nodos ESP32 (MQ135, Sharp GP2Y, DHT22).</p>
      </header>

      <!-- Métricas Específicas del Proyecto -->
      <div class="metrics-grid">
        <div class="metric-card" style="animation-delay: 0.1s">
          <div class="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v20M2 12h20"></path></svg>
          </div>
          <div class="metric-info">
            <span class="metric-label">Calidad de Aire (CO2/VOC)</span>
            <span class="metric-value">412 ppm</span>
            <span class="metric-change positive">Nivel Óptimo</span>
          </div>
        </div>
        <div class="metric-card" style="animation-delay: 0.2s">
          <div class="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          </div>
          <div class="metric-info">
            <span class="metric-label">Densidad de Polvo (PM)</span>
            <span class="metric-value">0.12 mg/m³</span>
            <span class="metric-change neutral">Bajo riesgo</span>
          </div>
        </div>
        <div class="metric-card" style="animation-delay: 0.3s">
          <div class="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <div class="metric-info">
            <span class="metric-label">Humedad Ambiental</span>
            <span class="metric-value">45.2%</span>
            <span class="metric-change positive">Rango confortable</span>
          </div>
        </div>
        <div class="metric-card" style="animation-delay: 0.4s">
          <div class="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
          </div>
          <div class="metric-info">
            <span class="metric-label">Temperatura Base</span>
            <span class="metric-value">22.4°C</span>
            <span class="metric-change positive">Estable</span>
          </div>
        </div>
      </div>

      <div class="main-grid">
        <!-- Gráfico de Polvo (Sharp GP2Y) -->
        <div class="content-card large animate-fade-in" style="animation-delay: 0.5s">
          <div class="card-header">
            <h3>Histórico de Partículas (Última Hora)</h3>
            <div class="sensor-tag">Sensor Sharp Optical</div>
          </div>
          <div class="chart-placeholder academic">
            <div class="academic-bar" style="height: 40%;" label="10:00"></div>
            <div class="academic-bar" style="height: 65%;" label="10:15"></div>
            <div class="academic-bar" style="height: 85%;" label="10:30"></div>
            <div class="academic-bar" style="height: 55%;" label="10:45"></div>
            <div class="academic-bar" style="height: 30%;" label="11:00"></div>
          </div>
        </div>

        <!-- Alertas de Actuadores -->
        <div class="content-card small animate-fade-in" style="animation-delay: 0.6s">
          <h3>Estado de Actuadores</h3>
          <div class="actuators-list">
            <div class="actuator-item active">
              <span class="act-name">Extractor Sector A</span>
              <span class="act-status">Automático / Off</span>
            </div>
            <div class="actuator-item">
              <span class="act-name">Alarma Sonara</span>
              <span class="act-status">Standby</span>
            </div>
            <div class="actuator-item active">
              <span class="act-name">Filtro de Aire</span>
              <span class="act-status">Operativo</span>
            </div>
          </div>
          <div class="alert-box">
            <p>Lógica de negocio configurada: Si $CO_2 > 800ppm$, disparar Extractor.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-view {
      display: flex;
      flex-direction: column;
      gap: 2.5rem;
      padding: 2rem;
    }
    .view-header h2 { font-size: 2.25rem; font-weight: 700; margin-bottom: 0.5rem; }
    .view-subtitle { color: var(--color-accent); text-transform: uppercase; font-size: 0.75rem; font-weight: 600; letter-spacing: 2px; }
    .view-header p { color: var(--color-text-muted); }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }
    .metric-card {
      background: var(--color-panel-bg);
      border: 1px solid var(--color-border);
      padding: 1.75rem;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      transition: var(--transition-smooth);
      animation: fadeIn 0.6s ease-out forwards;
      opacity: 0;
    }
    .metric-card:hover { border-color: var(--color-accent); transform: translateY(-5px); }
    .metric-icon { color: var(--color-accent); width: 24px; height: 24px; }
    .metric-info { display: flex; flex-direction: column; gap: 0.5rem; }
    .metric-label { font-size: 0.75rem; color: var(--color-text-muted); text-transform: uppercase; }
    .metric-value { font-size: 1.75rem; font-weight: 700; font-family: 'Space Mono', monospace; }
    .metric-change { font-size: 0.75rem; font-weight: 500; }
    .metric-change.positive { color: var(--color-accent); }
    .metric-change.neutral { color: var(--color-text-muted); }

    .main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
    .content-card { background: var(--color-panel-bg); border: 1px solid var(--color-border); padding: 2rem; border-radius: 4px; opacity: 0; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .sensor-tag { font-size: 0.7rem; color: var(--color-accent); border: 1px solid var(--color-accent); padding: 2px 8px; border-radius: 4px; }
    
    .chart-placeholder.academic { height: 200px; display: flex; align-items: flex-end; gap: 1rem; padding-bottom: 2rem; border-bottom: 1px solid var(--color-border); }
    .academic-bar { flex: 1; background: linear-gradient(to top, var(--color-accent), transparent); opacity: 0.6; border-radius: 2px; position: relative; }
    .academic-bar::after { content: attr(label); position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); font-size: 0.65rem; color: var(--color-text-muted); }

    .actuators-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
    .actuator-item { display: flex; justify-content: space-between; padding: 1rem; background: rgba(255, 255, 255, 0.02); border-radius: 4px; border: 1px solid var(--color-border); }
    .actuator-item.active { border-color: var(--color-accent); }
    .act-name { font-size: 0.9rem; font-weight: 500; }
    .act-status { font-size: 0.8rem; color: var(--color-accent); }
    
    .alert-box { padding: 1rem; background: rgba(100, 255, 218, 0.05); border-left: 4px solid var(--color-accent); }
    .alert-box p { font-size: 0.8rem; color: var(--color-text-muted); font-style: italic; }

    @media (max-width: 1024px) { 
      .main-grid { grid-template-columns: 1fr; } 
    }
    @media (max-width: 768px) {
      .dashboard-view { padding: 1.5rem; gap: 1.5rem; }
      .view-header h2 { font-size: 1.75rem; }
      .metric-value { font-size: 1.5rem; }
      .chart-placeholder.academic { gap: 0.5rem; }
    }
  `]
})
export class GeneralPanelComponent {}
