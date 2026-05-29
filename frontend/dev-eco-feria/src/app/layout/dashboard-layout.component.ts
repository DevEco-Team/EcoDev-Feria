import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { SidebarComponent } from './sidebar.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="layout-container">
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
          <app-navbar class="flex-1"></app-navbar>
        </header>

        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }
    .dashboard-header {
      display: flex;
      align-items: center;
      background: rgba(10, 25, 47, 0.95);
      border-bottom: 1px solid var(--color-border);
      z-index: 100;
    }
    .flex-1 { flex: 1; }
    .sidebar-toggle {
      display: none;
      background: none;
      border: none;
      color: var(--color-accent);
      padding: 1rem;
      cursor: pointer;
      z-index: 101;
    }
    .sidebar-toggle svg {
      width: 24px;
      height: 24px;
    }
    .content-area {
      flex: 1;
      padding: 0;
      overflow-y: auto;
      background-color: var(--color-base);
    }

    @media (max-width: 768px) {
      .sidebar-toggle {
        display: block;
      }
      .dashboard-header ::ng-deep .navbar {
        height: 60px;
        background: transparent;
        border-bottom: none;
      }
      .dashboard-header ::ng-deep .navbar-container {
        padding: 0 1rem 0 0;
      }
      .dashboard-header ::ng-deep .brand {
        display: none; /* Hide brand in navbar on mobile dashboard to save space, toggle is enough */
      }
    }
  `]
})
export class DashboardLayoutComponent {
  isSidebarOpen = false;
}
