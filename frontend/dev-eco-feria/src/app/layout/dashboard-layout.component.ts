import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { SidebarComponent } from './sidebar.component';
import { FooterComponent } from './footer.component';

/**
 * Diseño principal para el panel de control, que incluye la barra lateral y la de navegación.
 */
@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent, FooterComponent],
  template: `
    <div class="layout-container">
      <app-navbar></app-navbar>
      
      <div class="dashboard-body">
        <app-sidebar [isOpen]="isSidebarOpen" (close)="isSidebarOpen = false"></app-sidebar>
        
        <div class="main-content">
          <header class="dashboard-header">
            <button class="sidebar-toggle" (click)="isSidebarOpen = !isSidebarOpen" aria-label="Toggle Sidebar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div class="breadcrumb">
              <span class="view-subtitle">Dashboard</span>
            </div>
          </header>

          <div class="content-area">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>

      <app-footer></app-footer>
    </div>
  `
})
export class DashboardLayoutComponent {
  /** Estado de apertura de la barra lateral. */
  isSidebarOpen = false;
}
