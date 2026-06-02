import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-view animate-fade-in">
      <header class="view-header">
        <h2>Mapa de Calidad del Aire</h2>
        <p>Futura visualización en tiempo real de la calidad del aire en diferentes puntos del hogar o entorno.</p>
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
            <div class="legend-item"><span class="box high"></span> Alta Concentración</div>
            <div class="legend-item"><span class="box med"></span> Media Concentración</div>
            <div class="legend-item"><span class="box low"></span> Baja Concentración</div>
          </div>
        </div>
      </div>
    </div>
  `
})
/**
 * Componente que visualiza un mapa de calor para representar la densidad de personas
 * en diferentes áreas del recinto en tiempo real.
 */
export class HeatmapComponent {}
