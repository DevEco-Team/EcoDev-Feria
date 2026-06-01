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
  `
})
/**
 * Componente que representa el panel general de monitorización.
 * Muestra métricas en tiempo real de calidad del aire, partículas de polvo,
 * humedad y temperatura, además del estado de los actuadores del sistema.
 */
export class GeneralPanelComponent {}
