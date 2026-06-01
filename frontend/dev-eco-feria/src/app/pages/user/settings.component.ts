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
  `
})
/**
 * Componente que permite al usuario gestionar su perfil y configuración personal.
 * Incluye opciones para editar datos personales y cerrar sesión.
 */
export class UserSettingsComponent {
  /** Servicio para gestionar la autenticación y datos del usuario actual. */
  private authService = inject(AuthService);
  /** Servicio de enrutamiento para la navegación. */
  private router = inject(Router);

  /** Copia local de los datos del usuario para su edición en el formulario. */
  userData = { ...this.authService.currentUser() };
  /** Estado reactivo que indica si se están guardando los cambios. */
  saving = signal(false);

  /**
   * Simula el guardado de los cambios del perfil de usuario.
   * Actualiza los datos a través del AuthService tras un breve retraso.
   */
  saveChanges() {
    this.saving.set(true);
    setTimeout(() => {
      this.authService.updateUser(this.userData);
      this.saving.set(false);
      alert('Cambios guardados correctamente');
    }, 1000);
  }

  /**
   * Finaliza la sesión del usuario y lo redirige a la página principal.
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
