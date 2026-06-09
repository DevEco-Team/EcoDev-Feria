import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import { NavbarComponent } from '../../layout/navbar.component';
import { FooterComponent } from '../../layout/footer.component';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="settings-container animate-fade-in">
      <!-- Diálogo de Mensaje Custom (Movido fuera del grid para evitar desorganización) -->
      <div *ngIf="messageService.message() as msg" class="custom-dialog" [class]="msg.type">
        <div class="dialog-content">
          <strong>{{msg.title}}</strong>
          <p>{{msg.text}}</p>
          <button (click)="messageService.clearMessage()">Cerrar</button>
        </div>
      </div>

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
                <p>Gestiona tu nombre de usuario en el sistema.</p>
              </header>

              <form (ngSubmit)="saveChanges()" class="settings-form">
                <div class="form-group">
                  <label>Nombre Completo</label>
                  <input type="text" [(ngModel)]="localUserData.nombre" name="nombre" placeholder="Ej: Juan Pérez">
                </div>
                
                <div class="form-group">
                  <label>Email Asociado</label>
                  <input type="email" [value]="localUserData.email" disabled style="opacity: 0.6; cursor: not-allowed;">
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
                <p>Gestiona el acceso a tu cuenta cambiando tu contraseña.</p>
              </header>

              <div class="settings-form">
                <div class="security-card-stack">
                  <div class="form-group">
                    <label>Nueva Contraseña</label>
                    <input type="password" [(ngModel)]="newPassword" name="newPassword" placeholder="••••••••">
                  </div>
                  
                  <div class="form-group">
                    <label>Repetir Nueva Contraseña</label>
                    <input type="password" [(ngModel)]="repeatPassword" name="repeatPassword" placeholder="••••••••">
                  </div>

                  <div class="form-actions" style="margin-top: 1rem;">
                    <button (click)="handleUpdatePassword()" class="save-btn" [disabled]="saving() || !newPassword() || newPassword() !== repeatPassword()">
                      Actualizar Contraseña
                    </button>
                  </div>
                </div>

                <div class="security-divider">O también puedes</div>

                <div class="security-card">
                  <div class="security-info">
                    <h4>Recuperación por Email</h4>
                    <p>Te enviaremos un enlace para restablecerla de forma externa.</p>
                  </div>
                  <button (click)="requestPasswordReset()" class="secondary-btn" [disabled]="saving()">
                    Enviar correo
                  </button>
                </div>
              </div>
            </div>

            <!-- Notificaciones -->
            <div *ngSwitchCase="'notifications'">
              <header class="content-header">
                <h2>Preferencias de Notificación</h2>
                <p>Configura las alertas en tiempo real de la plataforma.</p>
              </header>

              <div class="settings-form">
                <div class="notification-options">
                  <div class="notif-item">
                    <div class="notif-info">
                      <h4>Detección de Datos</h4>
                      <p>Avisar cuando se reciban nuevas lecturas de los sensores.</p>
                    </div>
                    <label class="switch">
                      <input type="checkbox" [(ngModel)]="localNotificationData.dataDetection" name="dataDetection">
                      <span class="slider"></span>
                    </label>
                  </div>

                  <div class="notif-item">
                    <div class="notif-info">
                      <h4>Alerta de Actuadores</h4>
                      <p>Notificar cuando un extractor o alarma se active por umbrales críticos.</p>
                    </div>
                    <label class="switch">
                      <input type="checkbox" [(ngModel)]="localNotificationData.actuatorAlerts" name="actuatorAlerts">
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
  styles: [`
    .save-btn {
      padding: 0.8rem 2rem;
      background: var(--color-accent);
      color: var(--color-base);
      border: none;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      transition: var(--transition-smooth);
    }
    .save-btn:hover:not(:disabled) {
      background: #4cd3b0;
      transform: translateY(-2px);
    }
    .secondary-btn {
      padding: 0.8rem 1.5rem;
      background: rgba(100, 255, 218, 0.1);
      color: var(--color-accent);
      border: 1px solid var(--color-accent);
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-smooth);
    }
    .secondary-btn:hover:not(:disabled) {
      background: var(--color-accent);
      color: var(--color-base);
    }
    .security-card {
      background: rgba(255, 255, 255, 0.03);
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid var(--color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }
    .security-info h4 { margin: 0 0 0.5rem 0; color: var(--color-text); }
    .security-info p { margin: 0; font-size: 0.85rem; color: var(--color-text-muted); }
    
    @media (max-width: 768px) {
      .security-card { flex-direction: column; text-align: center; }
    }
    .security-card-stack {
      background: rgba(255, 255, 255, 0.03);
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .security-divider {
      text-align: center;
      color: var(--color-text-muted);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 1rem 0;
      position: relative;
    }
    .security-divider::before, .security-divider::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 30%;
      height: 1px;
      background: var(--color-border);
    }
    .security-divider::before { left: 0; }
    .security-divider::after { right: 0; }
  `]
})
export class UserSettingsComponent {
  private authService = inject(AuthService);
  public messageService = inject(MessageService);
  private router = inject(Router);

  activeTab = signal<'personal' | 'security' | 'notifications'>('personal');
  
  // Datos locales para el formulario
  localUserData: any = {};
  localNotificationData: any = {
    dataDetection: true,
    actuatorAlerts: true
  };

  newPassword = signal('');
  repeatPassword = signal('');
  saving = signal(false);

  constructor() {
    // Sincronizar datos locales cuando cambian los datos del servicio
    effect(() => {
      const data = this.authService.userData();
      if (data) {
        this.localUserData = { ...data };
        if (data.notifications) {
          // Asegurar que mapeamos los nuevos nombres de campos
          this.localNotificationData = {
            dataDetection: data.notifications.dataDetection !== undefined ? data.notifications.dataDetection : true,
            actuatorAlerts: data.notifications.actuatorAlerts !== undefined ? data.notifications.actuatorAlerts : true
          };
        }
      }
    });
  }

  setTab(tab: 'personal' | 'security' | 'notifications') {
    this.activeTab.set(tab);
    this.messageService.clearMessage();
  }

  async saveChanges() {
    this.saving.set(true);
    try {
      await this.authService.updateUserData({
        nombre: this.localUserData.nombre
      });
      this.messageService.showMessage('Éxito', 'Nombre actualizado correctamente.', 'success');
    } catch (error) {
      console.error(error);
      this.messageService.showMessage('Error', 'No se pudieron guardar los cambios.', 'error');
    } finally {
      this.saving.set(false);
    }
  }

  async requestPasswordReset() {
    this.saving.set(true);
    try {
      await this.authService.sendPasswordReset();
      this.messageService.showMessage('Correo Enviado', 'Revisa tu bandeja de entrada para cambiar tu contraseña.', 'success');
    } catch (error) {
      this.messageService.showMessage('Error', 'No se pudo enviar el correo de recuperación.', 'error');
    } finally {
      this.saving.set(false);
    }
  }

  async handleUpdatePassword() {
    if (this.newPassword() !== this.repeatPassword()) {
      this.messageService.showMessage('Error', 'Las contraseñas no coinciden.', 'error');
      return;
    }

    this.saving.set(true);
    try {
      await this.authService.updatePassword(this.newPassword());
      this.messageService.showMessage('Éxito', 'Contraseña actualizada correctamente y registrada en el sistema.', 'success');
      this.newPassword.set('');
      this.repeatPassword.set('');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/requires-recent-login') {
        this.messageService.showMessage('Seguridad', 'Para cambiar tu contraseña debes haber iniciado sesión recientemente. Por favor, vuelve a entrar.', 'info');
      } else {
        this.messageService.showMessage('Error', 'No se pudo actualizar la contraseña.', 'error');
      }
    } finally {
      this.saving.set(false);
    }
  }

  async saveNotifications() {
    this.saving.set(true);
    try {
      await this.authService.updateUserData({
        notifications: this.localNotificationData
      });
      this.messageService.showMessage('Éxito', 'Preferencias de notificación guardadas en Firebase.', 'success');
    } catch (error) {
      this.messageService.showMessage('Error', 'No se pudieron guardar las preferencias.', 'error');
    } finally {
      this.saving.set(false);
    }
  }

  logout() {
    this.authService.logout();
  }
}
