import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  `,
  styles: [`
    .footer {
      background: #020c1b;
      border-top: 1px solid var(--color-border);
      padding: 4rem 2rem 2rem;
      margin-top: auto;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    .footer-main {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 4rem;
      margin-bottom: 4rem;
    }
    .footer-info h3, .footer-project h4 {
      color: var(--color-accent);
      margin-bottom: 1rem;
    }
    .footer-info p, .footer-project p {
      color: var(--color-text-muted);
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    .footer-bottom {
      border-top: 1px solid var(--color-border);
      padding-top: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
    }
    .footer-bottom p {
      color: var(--color-text-muted);
      font-size: 0.8rem;
    }
    .footer-tags {
      display: flex;
      gap: 1rem;
    }
    .footer-tags span {
      font-size: 0.7rem;
      color: var(--color-accent);
      background: rgba(100, 255, 218, 0.05);
      padding: 0.2rem 0.6rem;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  `]
})
export class FooterComponent {}
