import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente que representa el pie de página de la aplicación.
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-main">
          <div class="footer-info">
            <h3>Dev-Eco Team</h3>
            <p>Tecnicatura Superior en Desarrollo de Software</p>
            <p>Feria de Ciencias "Alberto Maiztegui" | 2026</p>
          </div>
          <div class="footer-project">
            <h4>Red de Microestaciones Inteligentes</h4>
            <p>Monitoreo de Calidad del Aire en Tiempo Real</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Dev-Eco Team. Innovación Tecnológica Aplicada.</p>
          <div class="footer-tags">
            <span>IoT</span>
            <span>Angular</span>
            <span>Django</span>
            <span>ESP32</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
