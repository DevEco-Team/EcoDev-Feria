import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../layout/navbar.component';
import { FooterComponent } from '../../layout/footer.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="about-container">
      <section class="team-header animate-fade-in">
        <span class="view-subtitle">Dev-Eco Team</span>
        <h2>Integrantes del Proyecto</h2>
        <div class="divider"></div>
        <p class="about-intro">
          Somos un equipo de estudiantes de la Tecnicatura Superior en Desarrollo de Software, 
          unidos por el compromiso con la innovación tecnológica y la Responsabilidad Social Empresaria.
        </p>
      </section>

      <div class="team-grid animate-fade-in" style="animation-delay: 0.2s">
        <div class="member-card" *ngFor="let member of team">
          <div class="member-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <h3>{{member.name}}</h3>
          <span class="member-role">Desarrollador de Software</span>
        </div>
      </div>

      <section class="mentors-section animate-fade-in" style="animation-delay: 0.4s">
        <div class="mentors-header">
          <h3>Profesores a Cargo</h3>
        </div>
        <div class="mentors-grid">
          <div class="mentor-card" *ngFor="let mentor of mentors">
            <h4>{{mentor.name}}</h4>
            <span>Cátedra de Práctica Profesionalizante I</span>
          </div>
        </div>
      </section>

      <section class="institution-section animate-fade-in" style="animation-delay: 0.6s">
        <div class="inst-content">
          <h3>Tecnicatura Superior en Desarrollo de Software</h3>
          <p>Feria de Ciencias, Tecnologías, Artes, Movimiento e Innovación “Alberto Maiztegui”</p>
          <span class="year">Córdoba, Argentina | 2026</span>
        </div>
      </section>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .about-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 6rem 2rem;
      min-height: auto;
    }
    .team-header {
      text-align: center;
      margin-bottom: 6rem;
    }
    .team-header h2 { font-size: 3rem; margin: 1rem 0; }
    .view-subtitle {
      color: var(--color-accent);
      text-transform: uppercase;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: 2px;
    }
    .divider {
      width: 60px;
      height: 4px;
      background: var(--color-accent);
      margin: 2rem auto;
    }
    .about-intro {
      color: var(--color-text-muted);
      max-width: 700px;
      margin: 0 auto;
      font-size: 1.1rem;
      line-height: 1.8;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 8rem;
    }
    .member-card {
      background: var(--color-panel-bg);
      border: 1px solid var(--color-border);
      padding: 3rem 2rem;
      text-align: center;
      transition: var(--transition-smooth);
      border-radius: 4px;
    }
    .member-card:hover {
      border-color: var(--color-accent);
      transform: translateY(-5px);
      background: rgba(100, 255, 218, 0.05);
    }
    .member-avatar {
      width: 80px;
      height: 80px;
      background: rgba(100, 255, 218, 0.1);
      border-radius: 50%;
      margin: 0 auto 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-accent);
    }
    .member-avatar svg { width: 40px; }
    .member-card h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
    .member-role {
      font-size: 0.8rem;
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .mentors-section {
      background: rgba(17, 34, 64, 0.3);
      padding: 4rem;
      border-radius: 8px;
      margin-bottom: 8rem;
    }
    .mentors-header { margin-bottom: 3rem; text-align: center; }
    .mentors-header h3 { color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 2px; }
    .mentors-grid {
      display: flex;
      justify-content: center;
      gap: 4rem;
      flex-wrap: wrap;
    }
    .mentor-card { text-align: center; }
    .mentor-card h4 { font-size: 1.5rem; color: var(--color-accent); margin-bottom: 0.5rem; }
    .mentor-card span { color: var(--color-text-muted); font-size: 0.9rem; }

    .institution-section {
      text-align: center;
      padding-top: 4rem;
      border-top: 1px solid var(--color-border);
    }
    .inst-content h3 { font-size: 1.5rem; margin-bottom: 1rem; }
    .inst-content p { color: var(--color-text-muted); margin-bottom: 1rem; }
    .year { color: var(--color-accent); font-weight: 600; font-size: 0.9rem; }

    @media (max-width: 768px) {
      .about-container { padding: 4rem 1.5rem; }
      .team-header { margin-bottom: 3rem; }
      .team-header h2 { font-size: 2.25rem; }
      .mentors-section { padding: 2rem; margin-bottom: 4rem; }
      .mentors-grid { gap: 2rem; }
      .team-grid { margin-bottom: 4rem; }
    }

    @media (max-width: 480px) {
      .team-header h2 { font-size: 1.75rem; }
      .member-card { padding: 2rem 1.5rem; }
      .mentor-card h4 { font-size: 1.25rem; }
    }
  `]
})
export class AboutComponent {
  team = [
    { name: 'Luciano Cañas' },
    { name: 'Lorena Paola Pereyra' },
    { name: 'Agustin Nicolas Gallardo Rios' },
    { name: 'Agustin Tanno' },
    { name: 'Romina Vanesa Huk' },
    { name: 'Nancy Maribel Morales' }
  ];

  mentors = [
    { name: 'Castro Fabiana' },
    { name: 'Giraudo Maximiliano' }
  ];
}
