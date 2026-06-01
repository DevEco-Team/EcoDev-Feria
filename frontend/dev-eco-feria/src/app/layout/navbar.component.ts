import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Componente de la barra de navegación superior.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar animate-fade-in">
      <div class="navbar-container">
        <div class="brand" routerLink="/">
          <img src="assets/icon.jpg" alt="Dev-Eco Logo" class="logo-img">
          <div class="brand-text">
            <span class="brand-name">Dev-Eco Team</span>
            <span class="brand-tagline">Microestaciones Inteligentes</span>
          </div>
        </div>
        
        <button class="mobile-menu-toggle" (click)="toggleMenu()" aria-label="Toggle menu">
          <span class="hamburger" [class.open]="isMenuOpen"></span>
        </button>

        <ul class="nav-links" [class.mobile-open]="isMenuOpen">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()">Inicio</a></li>
          <li><a routerLink="/equipo" routerLinkActive="active" (click)="closeMenu()">Quiénes Somos</a></li>
          <li class="mobile-only">
            <div class="nav-cta">
              <span class="status-badge">
                <span class="dot pulse"></span> Red Online
              </span>
              <div class="nav-icons">
                <a [routerLink]="authService.isLoggedIn() ? '/dashboard' : '/login'" (click)="closeMenu()" class="icon-link">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                </a>
                <a [routerLink]="authService.isLoggedIn() ? '/perfil' : '/login'" (click)="closeMenu()" class="icon-link">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </a>
              </div>
            </div>
          </li>
        </ul>

        <div class="nav-cta desktop-only">
          <span class="status-badge">
            <span class="dot pulse"></span> Red Online
          </span>
          <div class="nav-icons">
            <a [routerLink]="authService.isLoggedIn() ? '/dashboard' : '/login'" class="icon-link" [title]="authService.isLoggedIn() ? 'Dashboard' : 'Iniciar Sesión'">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </a>
            <a [routerLink]="authService.isLoggedIn() ? '/perfil' : '/login'" class="icon-link" [title]="authService.isLoggedIn() ? 'Mi Perfil' : 'Iniciar Sesión'">
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  /** Servicio de autenticación para gestionar el estado de la sesión. */
  public authService = inject(AuthService);
  
  /** Indica si el menú móvil está abierto. */
  isMenuOpen = false;

  /**
   * Alterna la visibilidad del menú móvil y gestiona el desplazamiento del cuerpo.
   */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  /**
   * Cierra el menú móvil y habilita el desplazamiento del cuerpo.
   */
  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = 'auto';
  }
}
