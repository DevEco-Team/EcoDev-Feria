import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../layout/navbar.component';
import { FooterComponent } from '../../layout/footer.component';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="settings-container animate-fade-in">
      <div class="settings-grid">
        <aside class="settings-sidebar">
          <h3>Mi Perfil</h3>
          <nav class="settings-nav">
            <a class="active">Datos Personales</a>
            <a>Seguridad</a>
            <a>Notificaciones</a>
            <button (click)="logout()" class="logout-btn">Cerrar Sesión</button>
          </nav>
        </aside>

        <section class="settings-content">
          <header class="content-header">
            <h2>Configuración de Usuario</h2>
            <p>Gestiona tu información personal y preferencias del sistema.</p>
          </header>

          <form (ngSubmit)="saveChanges()" class="settings-form">
            <div class="form-row">
              <div class="form-group">
                <label>Nombre Completo</label>
                <input type="text" [(ngModel)]="userData.name" name="name">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" [(ngModel)]="userData.email" name="email">
              </div>
            </div>

            <div class="form-group">
              <label>Bio / Descripción</label>
              <textarea [(ngModel)]="userData.bio" name="bio" rows="4" placeholder="Cuéntanos sobre tu rol en el equipo..."></textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="save-btn" [disabled]="saving()">
                {{saving() ? 'Guardando...' : 'Guardar Cambios'}}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    .settings-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 4rem 2rem;
      min-height: 80vh;
    }
    .settings-grid {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 4rem;
    }
    .settings-sidebar {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .settings-sidebar h3 { font-size: 1.5rem; color: var(--color-text); }
    .settings-nav { display: flex; flex-direction: column; gap: 0.5rem; }
    .settings-nav a {
      padding: 0.75rem 1rem;
      border-radius: 4px;
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all 0.2s;
    }
    .settings-nav a.active {
      background: rgba(100, 255, 218, 0.1);
      color: var(--color-accent);
    }
    .logout-btn {
      margin-top: 2rem;
      background: rgba(255, 77, 77, 0.1);
      color: #ff4d4d;
      border: 1px solid rgba(255, 77, 77, 0.2);
      padding: 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    .logout-btn:hover { background: rgba(255, 77, 77, 0.2); }

    .settings-content {
      background: var(--color-panel-bg);
      border: 1px solid var(--color-border);
      padding: 3rem;
      border-radius: 8px;
    }
    .content-header { margin-bottom: 3rem; }
    .content-header h2 { font-size: 2rem; margin-bottom: 0.5rem; }
    .content-header p { color: var(--color-text-muted); }

    .settings-form { display: flex; flex-direction: column; gap: 2rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-size: 0.85rem; color: var(--color-text-muted); }
    .form-group input, .form-group textarea {
      background: var(--color-base);
      border: 1px solid var(--color-border);
      padding: 0.8rem 1rem;
      border-radius: 4px;
      color: white;
      outline: none;
    }
    .form-group input:focus, .form-group textarea:focus { border-color: var(--color-accent); }

    .save-btn {
      background: var(--color-accent);
      color: var(--color-base);
      border: none;
      padding: 1rem 2rem;
      border-radius: 4px;
      font-weight: 700;
      cursor: pointer;
    }
    .save-btn:disabled { opacity: 0.5; }

    @media (max-width: 900px) {
      .settings-grid { grid-template-columns: 1fr; gap: 2rem; }
      .settings-content { padding: 2rem 1.5rem; }
    }
  `]
})
export class UserSettingsComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  userData = { ...this.authService.currentUser() };
  saving = signal(false);

  saveChanges() {
    this.saving.set(true);
    setTimeout(() => {
      this.authService.updateUser(this.userData);
      this.saving.set(false);
      alert('Cambios guardados correctamente');
    }, 1000);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
