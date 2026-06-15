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
        <span class="view-subtitle">Eco-Dev</span>
        <h2>Integrantes del Proyecto</h2>
        <div class="divider"></div>
        <p class="about-intro">
          Somos un equipo de estudiantes de la Tecnicatura Superior en Desarrollo de Software, 
          unidos por el compromiso con la innovación tecnológica y la Responsabilidad Social Empresaria.
        </p>
      </section>

      <div class="team-flex animate-fade-in" style="animation-delay: 0.2s;">
        <div class="member-card" *ngFor="let member of equipoFila1">
          <div class="member-avatar">
            <img *ngIf="member.image" [src]="member.image" [alt]="member.name" class="avatar-img">
            <svg *ngIf="!member.image" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <h3>{{member.name}}</h3>
          <span class="member-role">{{member.role}}</span>
        </div>
      </div>

      <div class="team-flex animate-fade-in" style="animation-delay: 0.3s; margin-bottom: 8rem;">
        <div class="member-card" *ngFor="let member of equipoFila2">
          <div class="member-avatar">
            <img *ngIf="member.image" [src]="member.image" [alt]="member.name" class="avatar-img">
            <svg *ngIf="!member.image" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <h3>{{member.name}}</h3>
          <span class="member-role">{{member.role}}</span>
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
  `
})
/**
 * Componente que muestra la información sobre el equipo de desarrollo del proyecto Eco-Dev.
 */
export class AboutComponent {
  /** Primera fila del equipo de desarrollo, enfocada en hardware, QA y UI. */
  equipoFila1 = [
    { name: 'Luciano Cañas', role: 'Desarrollo de Hardware & IoT', image: '' },
    { name: 'Lorena Pereyra', role: 'Scrum Master & QA Testing', image: 'assets/Lorena_Pereyra.jpeg' },
    { name: 'Agustin Nicolas Gallardo Rios', role: 'Frontend Developer & Diseño UI', image: 'assets/Agustin_Nicolas_Gallardo_Rios.jpeg' }
  ];

  /** Segunda fila del equipo de desarrollo, enfocada en frontend, hardware y backend. */
  equipoFila2 = [
    { name: 'Agustin Tanno', role: 'Frontend Developer & Integración Web', image: '' },
    { name: 'Romina Huk', role: 'Ingeniería de Hardware & Sensores', image: 'assets/Romina_Huk.jpeg' },
    { name: 'Nancy Maribel Morales', role: 'Backend Developer & Arquitectura Cloud', image: 'assets/Nancy_Maribel_Morales.jpeg' },
    { name: 'Julieta Cabrera', role: 'Backend Developer & Firebase', image: 'assets/Julieta_Cabrera.jpeg' }
  ];

  /** Lista de profesores que supervisan el proyecto. */
  mentors = [
    { name: 'Ing. Castro Fabiana' },
    { name: 'Lic. Giraudo Maximiliano' }
  ];
}