import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../layout/navbar.component';
import { FooterComponent } from '../../layout/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="home-container">
      <!-- Hero Section -->
      <section class="hero animate-fade-in">
        <div class="hero-content">
          <span class="hero-tag">Proyecto Destacado 2026</span>
          <h1>Red de Microestaciones Inteligentes</h1>
          <p class="hero-description">
            Monitoreo preventivo de la calidad del aire para la industria y la salud urbana. 
            Tecnología IoT diseñada para proteger la vida y mejorar la eficiencia productiva.
          </p>
          <div class="hero-actions">
            <button class="primary-btn" routerLink="/dashboard">Explorar Datos en Vivo</button>
            <button class="secondary-btn" routerLink="/equipo">Conocer al Equipo</button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="microstation-model">
            <div class="core-glow"></div>
            <div class="sensor-dots">
              <div class="dot d1"></div>
              <div class="dot d2"></div>
              <div class="dot d3"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section class="features animate-fade-in" style="animation-delay: 0.3s">
        <div class="section-header">
          <h2>Soluciones de Monitoreo</h2>
          <div class="divider"></div>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H2z"></path></svg>
            </div>
            <h3>Aplicación Industrial</h3>
            <p>Centinela preventivo en plantas de alimentos. Detecta polvos en suspensión y previene explosiones y riesgos respiratorios.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"></path><path d="M6 21V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14"></path><path d="M9 21v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4"></path><path d="M10 9h.01"></path><path d="M14 9h.01"></path><path d="M10 13h.01"></path><path d="M14 13h.01"></path></svg>
            </div>
            <h3>Realidad del Peatón</h3>
            <p>Monitoreo a nivel de calle en domos de seguridad. Captura el aire real que respiran los ciudadanos en Córdoba y Río Cuarto.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"></path><rect x="6" y="14" width="12" height="8" rx="1"></rect></svg>
            </div>
            <h3>Sensores Avanzados</h3>
            <p>Integración de sensores MQ135 (gases), Sharp (polvo) y DHT22 (temp/hum) en una red distribuida de bajo costo.</p>
          </div>
        </div>
      </section>

      <!-- Tech Stack Section -->
      <section class="tech-stack animate-fade-in" style="animation-delay: 0.5s">
        <h3>Ecosistema Tecnológico</h3>
        <div class="tech-logos">
          <div class="tech-item"><span>ESP32</span></div>
          <div class="tech-item"><span>Django</span></div>
          <div class="tech-item"><span>Angular</span></div>
          <div class="tech-item"><span>PostgreSQL</span></div>
          <div class="tech-item"><span>MQTT</span></div>
        </div>
      </section>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .home-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 4rem 2rem;
    }
    .hero {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 4rem;
      align-items: center;
      margin-bottom: 8rem;
    }
    .hero-tag {
      color: var(--color-accent);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 600;
      margin-bottom: 1.5rem;
      display: block;
    }
    .hero h1 {
      font-size: 4rem;
      line-height: 1.1;
      margin-bottom: 2rem;
      background: linear-gradient(to right, #e6f1ff, #64ffda);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-description {
      font-size: 1.2rem;
      color: var(--color-text-muted);
      max-width: 600px;
      margin-bottom: 3rem;
    }
    .hero-actions {
      display: flex;
      gap: 1.5rem;
    }
    .primary-btn {
      background: var(--color-accent);
      color: var(--color-base);
      border: none;
      padding: 1rem 2rem;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-smooth);
    }
    .primary-btn:hover {
      background: #52e0c0;
      transform: translateY(-2px);
    }
    .secondary-btn {
      background: transparent;
      color: var(--color-accent);
      border: 1px solid var(--color-accent);
      padding: 1rem 2rem;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-smooth);
    }
    .secondary-btn:hover {
      background: rgba(100, 255, 218, 0.1);
    }

    /* Hero Visual Mockup */
    .hero-visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .microstation-model {
      width: 300px;
      height: 400px;
      background: rgba(17, 34, 64, 0.5);
      border: 2px solid var(--color-accent);
      border-radius: 20px;
      position: relative;
      box-shadow: 0 0 50px rgba(100, 255, 218, 0.1);
    }
    .core-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
      background: var(--color-accent);
      filter: blur(80px);
      opacity: 0.3;
    }
    .sensor-dots {
      position: absolute;
      top: 40px;
      right: 40px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .dot {
      width: 12px;
      height: 12px;
      background: var(--color-accent);
      border-radius: 50%;
      opacity: 0.6;
    }
    .d1 { animation: pulse 2s infinite 0.1s; }
    .d2 { animation: pulse 2s infinite 0.3s; }
    .d3 { animation: pulse 2s infinite 0.5s; }

    @keyframes pulse {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
    }

    /* Features Grid */
    .features {
      margin-bottom: 8rem;
    }
    .section-header {
      margin-bottom: 4rem;
      text-align: center;
    }
    .section-header h2 { font-size: 2.5rem; margin-bottom: 1rem; }
    .divider {
      width: 60px;
      height: 4px;
      background: var(--color-accent);
      margin: 0 auto;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    .feature-card {
      background: var(--color-panel-bg);
      border: 1px solid var(--color-border);
      padding: 3rem 2rem;
      border-radius: 8px;
      text-align: center;
      transition: var(--transition-smooth);
    }
    .feature-card:hover {
      border-color: var(--color-accent);
      transform: translateY(-10px);
    }
    .feature-icon { 
      margin-bottom: 1.5rem; 
      color: var(--color-accent);
      display: flex;
      justify-content: center;
    }
    .feature-icon svg {
      width: 48px;
      height: 48px;
    }
    .feature-card h3 { color: var(--color-accent); margin-bottom: 1rem; }
    .feature-card p { color: var(--color-text-muted); }

    /* Tech Stack */
    .tech-stack {
      text-align: center;
      padding-top: 4rem;
      border-top: 1px solid var(--color-border);
    }
    .tech-stack h3 { margin-bottom: 3rem; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem; }
    .tech-logos {
      display: flex;
      justify-content: center;
      gap: 4rem;
      flex-wrap: wrap;
    }
    .tech-item span {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-text);
      opacity: 0.5;
      transition: var(--transition-smooth);
    }
    .tech-item:hover span { opacity: 1; color: var(--color-accent); }

    @media (max-width: 1024px) {
      .hero { grid-template-columns: 1fr; text-align: center; margin-bottom: 4rem; }
      .hero-description { margin: 0 auto 3rem; }
      .hero-actions { justify-content: center; }
      .hero-visual { display: none; }
      .hero h1 { font-size: 3rem; }
    }

    @media (max-width: 768px) {
      .home-container { padding: 2rem 1.5rem; }
      .hero h1 { font-size: 2.5rem; }
      .section-header h2 { font-size: 2rem; }
      .features { margin-bottom: 4rem; }
      .tech-logos { gap: 2rem; }
    }

    @media (max-width: 480px) {
      .hero h1 { font-size: 2rem; }
      .hero-actions { flex-direction: column; width: 100%; }
      .primary-btn, .secondary-btn { width: 100%; }
    }
  `]
})
export class HomeComponent {}
