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
            <a (click)="setTab('personal')" [class.active]="activeTab() === 'personal'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon-sm"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Datos Personales
            </a>
            <a (click)="setTab('security')" [class.active]="activeTab() === 'security'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon-sm"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Seguridad
            </a>
            <a (click)="setTab('notifications')" [class.active]="activeTab() === 'notifications'">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon-sm"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              Notificaciones
            </a>
            <button (click)="logout()" class="logout-btn">Cerrar Sesión</button>
          </nav>
        </aside>

        <section class="settings-content">
          <div [ngSwitch]="activeTab()">
            <!-- Datos Personales -->
            <div *ngSwitchCase="'personal'">
              <header class="content-header">
                <h2>Datos Personales</h2>
                <p>Gestiona tu información pública y cómo te mostramos en el sistema.</p>
              </header>

              <form (ngSubmit)="saveChanges()" class="settings-form">
                <div class="form-row">
                  <div class="form-group">
                    <label>Nombre Completo</label>
                    <input type="text" [(ngModel)]="userData.name" name="name" placeholder="Ej: Juan Pérez">
                  </div>
                  <div class="form-group">
                    <label>Email</label>
                    <input type="email" [(ngModel)]="userData.email" name="email" placeholder="email@ejemplo.com">
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
            </div>

            <!-- Seguridad -->
            <div *ngSwitchCase="'security'">
              <header class="content-header">
                <h2>Seguridad</h2>
                <p>Protege tu cuenta actualizando tu contraseña y configuraciones de acceso.</p>
              </header>

              <form (ngSubmit)="changePassword()" class="settings-form">
                <div class="form-group">
                  <label>Contraseña Actual</label>
                  <input type="password" [(ngModel)]="securityData.currentPassword" name="currentPassword" placeholder="••••••••">
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label>Nueva Contraseña</label>
                    <input type="password" [(ngModel)]="securityData.newPassword" name="newPassword" placeholder="Mínimo 8 caracteres">
                  </div>
                  <div class="form-group">
                    <label>Confirmar Nueva Contraseña</label>
                    <input type="password" [(ngModel)]="securityData.confirmPassword" name="confirmPassword" placeholder="Repite la contraseña">
                  </div>
                </div>

                <div class="form-actions">
                  <button type="submit" class="save-btn" [disabled]="saving() || !securityData.newPassword">
                    {{saving() ? 'Actualizando...' : 'Actualizar Contraseña'}}
                  </button>
                </div>
              </form>
            </div>

            <!-- Notificaciones -->
            <div *ngSwitchCase="'notifications'">
              <header class="content-header">
                <h2>Notificaciones</h2>
                <p>Elige qué alertas quieres recibir y por qué canales.</p>
              </header>

              <div class="settings-form">
                <div class="notification-options">
                  <div class="notif-item">
                    <div class="notif-info">
                      <h4>Alertas por Email</h4>
                      <p>Recibe avisos de calidad de aire crítica en tu correo.</p>
                    </div>
                    <label class="switch">
                      <input type="checkbox" [(ngModel)]="notificationData.emailAlerts">
                      <span class="slider"></span>
                    </label>
                  </div>

                  <div class="notif-item">
                    <div class="notif-info">
                      <h4>Notificaciones Push</h4>
                      <p>Alertas en tiempo real en tu navegador o móvil.</p>
                    </div>
                    <label class="switch">
                      <input type="checkbox" [(ngModel)]="notificationData.pushNotifications">
                      <span class="slider"></span>
                    </label>
                  </div>

                  <div class="notif-item">
                    <div class="notif-info">
                      <h4>Reportes Semanales</h4>
                      <p>Un resumen de métricas cada lunes por la mañana.</p>
                    </div>
                    <label class="switch">
                      <input type="checkbox" [(ngModel)]="notificationData.weeklyReports">
                      <span class="slider"></span>
                    </label>
                  </div>

                  <div class="notif-item">
                    <div class="notif-info">
                      <h4>Alertas de Actuadores</h4>
                      <p>Avisar cuando se dispare un extractor o alarma sonora.</p>
                    </div>
                    <label class="switch">
                      <input type="checkbox" [(ngModel)]="notificationData.criticalAlerts">
                      <span class="slider"></span>
                    </label>
                  </div>
                </div>

                <div class="form-actions">
                  <button (click)="saveNotifications()" class="save-btn" [disabled]="saving()">
                    {{saving() ? 'Guardando...' : 'Guardar Preferencias'}}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
    <app-footer></app-footer>
  `,

})
/**
 * Componente que permite al usuario gestionar su perfil y configuración personal.
 * Incluye opciones para editar datos personales y cerrar sesión.
 */
export class UserSettingsComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  activeTab = signal<'personal' | 'security' | 'notifications'>('personal');
  userData = { ...this.authService.currentUser() };
  
  // Security form data
  securityData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // Notifications form data
  notificationData = {
    emailAlerts: true,
    pushNotifications: false,
    weeklyReports: true,
    criticalAlerts: true
  };

  saving = signal(false);

  setTab(tab: 'personal' | 'security' | 'notifications') {
    this.activeTab.set(tab);
  }

  saveChanges() {
    this.saving.set(true);
    setTimeout(() => {
      this.authService.updateUser(this.userData);
      this.saving.set(false);
      alert('Datos personales actualizados');
    }, 800);
  }

  changePassword() {
    if (this.securityData.newPassword !== this.securityData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      alert('Contraseña actualizada correctamente');
      this.securityData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    }, 1000);
  }

  saveNotifications() {
    this.saving.set(true);
    setTimeout(() => {
      this.authService.updateUser({ notifications: this.notificationData });
      this.saving.set(false);
      alert('Preferencias de notificación guardadas');
    }, 800);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
