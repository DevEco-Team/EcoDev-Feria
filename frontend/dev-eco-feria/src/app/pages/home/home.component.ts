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
            Cuidaremos el aire que respirás. Nuestras futuras estaciones inteligentes medirán la calidad del aire en tiempo real para proteger tu salud, prevenir accidentes y mejorar nuestro entorno de una forma sencilla y accesible.
          </p>
          <p class="hero-description" style="font-size: 0.9em; margin-top: -10px; color: #a0aec0;">
            ¿Cómo funcionará? Nuestra placa será el "cerebro" del equipo: recolectará los datos del ambiente al instante y los mandará por internet para que puedas verlos en vivo desde cualquier pantalla.
          </p>
          <div class="hero-actions">
            <button class="primary-btn" routerLink="/dashboard">Ver Medición en Vivo</button>
            <button class="secondary-btn" routerLink="/equipo">Quiénes Somos</button>
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
            <h3>Cuidado en el Trabajo</h3>
            <p>Funcionará como un guardián invisible en fábricas y plantas. Detectará partículas en el aire para evitar accidentes y cuidar la salud respiratoria de los trabajadores.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <h3>El Aire en Nuestra Casa u Hogar</h3>
            <p>Nuestros equipos estarán diseñados para funcionar dentro del hogar, donde medirán con exactitud qué tan limpio está el aire que respirás vos y tu familia todos los días.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"></path><rect x="6" y="14" width="12" height="8" rx="1"></rect></svg>
            </div>
            <h3>Tecnología al Alcance de Todos</h3>
            <p>Combinaremos sensores económicos pero de alta precisión para medir gases, polvo, temperatura y humedad. Será fácil y económico de instalar en nuestro hogar, oficina, escuelas y hospitales.</p>
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
  `
})
/**
 * Componente de la página de inicio (Landing Page) del proyecto.
 * Presenta la propuesta de valor de la Red de Microestaciones Inteligentes,
 * sus beneficios y las tecnologías utilizadas.
 */
export class HomeComponent {}
