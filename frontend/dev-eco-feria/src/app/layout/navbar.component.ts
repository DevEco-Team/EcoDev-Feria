import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
  `,
  styles: [`
    .navbar {
      height: 80px;
      background: rgba(10, 25, 47, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
    }
    .navbar-container {
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      z-index: 1001;
      min-width: 0;
    }
    .logo-img {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      border: 1px solid var(--color-accent);
      flex-shrink: 0;
    }
    .brand-text {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .brand-name {
      font-weight: 700;
      color: var(--color-text);
      letter-spacing: 0.5px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .brand-tagline {
      font-size: 0.7rem;
      color: var(--color-accent);
      text-transform: uppercase;
      letter-spacing: 1px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .nav-links {
      display: flex;
      gap: 3rem;
      list-style: none;
      align-items: center;
    }
    .nav-links a {
      color: var(--color-text-muted);
      font-size: 0.9rem;
      font-weight: 500;
      transition: var(--transition-smooth);
      position: relative;
      padding: 0.5rem 0;
    }
    .nav-links a:hover, .nav-links a.active {
      color: var(--color-accent);
    }
    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--color-accent);
      border-radius: 2px;
    }
    .nav-cta {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .status-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--color-accent);
      background: rgba(100, 255, 218, 0.1);
      padding: 0.4rem 1rem;
      border-radius: 20px;
      border: 1px solid var(--color-border);
      white-space: nowrap;
    }
    .nav-icons {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .icon-link {
      color: var(--color-text-muted);
      transition: var(--transition-smooth);
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .icon-link:hover {
      color: var(--color-accent);
    }
    .nav-icon {
      width: 20px;
      height: 20px;
    }
    .dot {
      width: 6px;
      height: 6px;
      background: var(--color-accent);
      border-radius: 50%;
    }
    .pulse {
      animation: pulse-animation 2s infinite;
    }
    @keyframes pulse-animation {
      0% { box-shadow: 0 0 0 0px rgba(100, 255, 218, 0.4); }
      100% { box-shadow: 0 0 0 10px rgba(100, 255, 218, 0); }
    }

    /* Mobile Menu Styles */
    .mobile-menu-toggle {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 10px;
      z-index: 1001;
    }
    .hamburger {
      display: block;
      width: 24px;
      height: 2px;
      background: var(--color-accent);
      position: relative;
      transition: background 0.3s;
    }
    .hamburger::before, .hamburger::after {
      content: '';
      position: absolute;
      width: 24px;
      height: 2px;
      background: var(--color-accent);
      transition: transform 0.3s;
    }
    .hamburger::before { top: -8px; }
    .hamburger::after { bottom: -8px; }
    .hamburger.open { background: transparent; }
    .hamburger.open::before { transform: translateY(8px) rotate(45deg); }
    .hamburger.open::after { transform: translateY(-8px) rotate(-45deg); }

    .mobile-only { display: none; }

    @media (max-width: 768px) {
      .navbar { height: 70px; }
      .navbar-container { padding: 0 1rem; gap: 0.5rem; }
      .mobile-menu-toggle { 
        display: block;
        margin-left: auto;
      }
      .desktop-only { display: none; }
      .mobile-only { display: block; }
      
      .brand-name { font-size: 0.85rem; }
      .brand-tagline { font-size: 0.55rem; }
      
      .nav-links {
        position: fixed;
        top: 0;
        right: -100%;
        width: 100%;
        height: 100vh;
        background: rgba(10, 25, 47, 0.98);
        backdrop-filter: blur(15px);
        flex-direction: column;
        justify-content: center;
        gap: 3rem;
        transition: right 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
      }
      .nav-links.mobile-open {
        right: 0;
      }
      .nav-links a {
        font-size: 1.5rem;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
      .brand-name { font-size: 0.9rem; }
      .brand-tagline { font-size: 0.6rem; }
    }
  `]
})
export class NavbarComponent {
  public authService = inject(AuthService);
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    document.body.style.overflow = 'auto';
  }
}
