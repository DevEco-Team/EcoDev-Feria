import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../layout/navbar.component';
import { FooterComponent } from '../../layout/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="auth-container animate-fade-in">
      <div class="auth-card">
        <header class="auth-header">
          <h2>{{isLogin ? 'Iniciar Sesión' : 'Registrarse'}}</h2>
          <p>{{isLogin ? 'Accede al panel de control de tu red' : 'Crea una cuenta para monitorear tus microestaciones'}}</p>
        </header>

        <form (ngSubmit)="onSubmit()" #authForm="ngForm" class="auth-form">
          <div class="form-group">
            <label for="username">Usuario / Email</label>
            <input type="text" id="username" name="username" [(ngModel)]="username" required placeholder="1234">
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" name="password" [(ngModel)]="password" required placeholder="••••">
          </div>
          
          <div *ngIf="error" class="error-message">
            Credenciales incorrectas. Intenta con "1234".
          </div>

          <button type="submit" class="submit-btn" [disabled]="!authForm.valid">
            {{isLogin ? 'Entrar' : 'Crear Cuenta'}}
          </button>
        </form>

        <footer class="auth-footer">
          <p>{{isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}} 
            <a (click)="toggleMode()">{{isLogin ? 'Regístrate aquí' : 'Inicia sesión'}}</a>
          </p>
        </footer>
      </div>
    </main>
    <app-footer></app-footer>
  `
})
/**
 * Componente que gestiona la autenticación de usuarios (inicio de sesión y registro).
 */
export class LoginComponent {
  /** Servicio para gestionar la lógica de autenticación. */
  private authService = inject(AuthService);
  /** Servicio de enrutamiento para la navegación. */
  private router = inject(Router);
  /** Servicio para acceder a los parámetros de la ruta activa. */
  private route = inject(ActivatedRoute);

  /** Indica si el formulario está en modo inicio de sesión (true) o registro (false). */
  isLogin = true;
  /** Nombre de usuario o email ingresado en el formulario. */
  username = '';
  /** Contraseña ingresada en el formulario. */
  password = '';
  /** Indica si hubo un error en el proceso de autenticación. */
  error = false;

  /**
   * Cambia el modo del formulario entre inicio de sesión y registro.
   */
  toggleMode() {
    this.isLogin = !this.isLogin;
    this.error = false;
  }

  /**
   * Procesa el envío del formulario de autenticación.
   * Si las credenciales son válidas, redirige al usuario a la URL de retorno o al dashboard.
   */
  onSubmit() {
    if (this.authService.login(this.username, this.password)) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      this.router.navigateByUrl(returnUrl);
    } else {
      this.error = true;
    }
  }
}
