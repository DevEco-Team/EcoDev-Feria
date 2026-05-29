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
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 160px);
      padding: 2rem;
    }
    .auth-card {
      background: var(--color-panel-bg);
      border: 1px solid var(--color-border);
      padding: 3rem;
      border-radius: 8px;
      width: 100%;
      max-width: 450px;
      backdrop-filter: blur(10px);
    }
    .auth-header { text-align: center; margin-bottom: 2.5rem; }
    .auth-header h2 { font-size: 2rem; margin-bottom: 0.5rem; color: var(--color-accent); }
    .auth-header p { color: var(--color-text-muted); font-size: 0.9rem; }

    .auth-form { display: flex; flex-direction: column; gap: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { font-size: 0.85rem; color: var(--color-text); font-weight: 500; }
    .form-group input {
      background: var(--color-base);
      border: 1px solid var(--color-border);
      padding: 0.8rem 1rem;
      border-radius: 4px;
      color: white;
      outline: none;
      transition: border-color 0.2s;
    }
    .form-group input:focus { border-color: var(--color-accent); }

    .submit-btn {
      background: var(--color-accent);
      color: var(--color-base);
      border: none;
      padding: 1rem;
      border-radius: 4px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 1rem;
      transition: transform 0.2s;
    }
    .submit-btn:hover:not(:disabled) { transform: translateY(-2px); opacity: 0.9; }
    .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .error-message { color: #ff4d4d; font-size: 0.8rem; text-align: center; }

    .auth-footer { margin-top: 2rem; text-align: center; font-size: 0.9rem; color: var(--color-text-muted); }
    .auth-footer a { color: var(--color-accent); cursor: pointer; font-weight: 600; }
    .auth-footer a:hover { text-decoration: underline; }

    @media (max-width: 480px) {
      .auth-card { padding: 2rem 1.5rem; }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLogin = true;
  username = '';
  password = '';
  error = false;

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.error = false;
  }

  onSubmit() {
    if (this.authService.login(this.username, this.password)) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      this.router.navigateByUrl(returnUrl);
    } else {
      this.error = true;
    }
  }
}
