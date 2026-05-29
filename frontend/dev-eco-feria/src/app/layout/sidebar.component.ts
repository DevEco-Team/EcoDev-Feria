import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.mobile-open]="isOpen">
      <div class="logo-container">
        <img src="assets/icon.jpg" alt="DevEco Logo" class="logo">
      </div>
      <nav class="nav-menu">
        <a routerLink="/dashboard/general" routerLinkActive="active" class="nav-item" (click)="onItemClick()">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span class="label">General</span>
        </a>
        <a routerLink="/dashboard/history" routerLinkActive="active" class="nav-item" (click)="onItemClick()">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="12 8 12 12 14 14"></polyline>
            <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"></path>
          </svg>
          <span class="label">Historial</span>
        </a>
        <a routerLink="/dashboard/heatmap" routerLinkActive="active" class="nav-item" (click)="onItemClick()">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2c1.88 0 3.39 1.19 4.32 2.83.85.3 1.68.73 2.48 1.28a9.91 9.91 0 0 1 2.2 2.2c.55.8.98 1.63 1.28 2.48C22.81 11.61 24 13.12 24 15c0 4.97-4.03 9-9 9s-9-4.03-9-9c0-1.88 1.19-3.39 2.83-4.32.3-.85.73-1.68 1.28-2.48a9.91 9.91 0 0 1 2.2-2.2c.8-.55 1.63-.98 2.48-1.28C10.61 3.19 9.12 2 12 2z"></path>
            <path d="M12 18a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
          </svg>
          <span class="label">Mapa de Calor</span>
        </a>
      </nav>
      <div class="sidebar-footer">
        <button class="cta-button">Descargar Reporte</button>
      </div>
    </aside>
    <div class="sidebar-overlay" *ngIf="isOpen" (click)="closeSidebar()"></div>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100%;
      background-color: var(--color-base);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
      transition: transform 0.3s ease;
      z-index: 1100;
    }
    .logo-container {
      margin-bottom: 3rem;
      display: flex;
      justify-content: center;
    }
    .logo {
      width: 48px;
    }
    .nav-menu {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      flex: 1;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      transition: all 0.2s ease;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
    }
    .icon {
      width: 20px;
      height: 20px;
    }
    .nav-item:hover {
      background-color: var(--color-panel-bg);
      color: var(--color-text);
    }
    .nav-item.active {
      background-color: rgba(0, 255, 255, 0.1);
      color: var(--color-accent);
      border-left: 4px solid var(--color-accent);
    }
    .sidebar-footer {
      margin-top: auto;
      padding-top: 2rem;
    }
    .cta-button {
      width: 100%;
      background-color: var(--color-cta);
      color: var(--color-base);
      border: none;
      padding: 0.75rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .cta-button:hover {
      opacity: 0.9;
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        transform: translateX(-100%);
      }
      .sidebar.mobile-open {
        transform: translateX(0);
      }
      .sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 1099;
      }
    }
  `]
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  onItemClick() {
    if (window.innerWidth <= 768) {
      this.closeSidebar();
    }
  }

  closeSidebar() {
    this.close.emit();
  }
}
