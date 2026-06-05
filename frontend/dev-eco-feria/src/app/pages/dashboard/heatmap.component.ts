import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-view animate-fade-in">
      <header class="view-header">
        <h2>Mapa de Calor</h2>
        <p>Visualización en tiempo real de la densidad de visitantes en el recinto.</p>
      </header>

      <div class="map-container">
        <div class="map-placeholder">
          <div class="heatmap-overlay">
            <div class="hot-spot s1"></div>
            <div class="hot-spot s2"></div>
            <div class="hot-spot s3"></div>
          </div>
          <p>Cargando mapa interactivo...</p>
        </div>
        
        <div class="map-controls">
          <h3>Filtros de Mapa</h3>
          <div class="control-group">
            <label><input type="checkbox" checked> Densidad de Calor</label>
            <label><input type="checkbox" checked> Marcadores de Stand</label>
            <label><input type="checkbox"> Zonas de Salida</label>
          </div>
          <div class="legend">
            <div class="legend-item"><span class="box high"></span> Alta Densidad</div>
            <div class="legend-item"><span class="box med"></span> Media Densidad</div>
            <div class="legend-item"><span class="box low"></span> Baja Densidad</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-view {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 2rem;
    }
    .view-header h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    .view-header p {
      color: rgba(255, 255, 255, 0.6);
    }
    .map-container {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 1.5rem;
      min-height: 600px;
    }
    .map-placeholder {
      background-color: var(--color-panel-bg);
      border: 1px solid var(--color-border);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      min-height: 400px;
    }
    .heatmap-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .hot-spot {
      position: absolute;
      border-radius: 50%;
      filter: blur(20px);
      opacity: 0.6;
    }
    .s1 { top: 20%; left: 30%; width: 150px; height: 150px; background: radial-gradient(circle, #ff4d4d, transparent); }
    .s2 { top: 50%; left: 60%; width: 200px; height: 200px; background: radial-gradient(circle, #ff944d, transparent); }
    .s3 { top: 40%; left: 40%; width: 100px; height: 100px; background: radial-gradient(circle, #ff4d4d, transparent); }

    .map-controls {
      background-color: var(--color-panel-bg);
      border: 1px solid var(--color-border);
      padding: 1.5rem;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .control-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .legend {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }
    .box { width: 12px; height: 12px; border-radius: 2px; }
    .box.high { background: #ff4d4d; }
    .box.med { background: #ff944d; }
    .box.low { background: #ffff4d; }

    @media (max-width: 1024px) {
      .map-container {
        grid-template-columns: 1fr;
        min-height: auto;
      }
    }
    @media (max-width: 768px) {
      .dashboard-view { padding: 1.5rem; }
      .map-placeholder { min-height: 300px; }
    }
  `]
})
export class HeatmapComponent {}
