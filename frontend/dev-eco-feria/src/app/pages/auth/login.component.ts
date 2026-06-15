import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
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

        <!-- Diálogo de Mensaje Custom -->
        <div *ngIf="messageService.message() as msg" class="custom-dialog" [class]="msg.type">
          <div class="dialog-content">
            <strong>{{msg.title}}</strong>
            <p>{{msg.text}}</p>
            <button (click)="messageService.clearMessage()">Cerrar</button>
          </div>
        </div>

        <form (ngSubmit)="onSubmit()" #authForm="ngForm" class="auth-form">
          <div class="form-group" *ngIf="!isLogin">
            <label for="nombre">Nombre Completo</label>
            <input type="text" id="nombre" name="nombre" [(ngModel)]="nombre" required placeholder="Tu nombre">
          </div>
          
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" [(ngModel)]="email" required placeholder="tu@email.com">
          </div>
          
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" name="password" [(ngModel)]="password" required placeholder="••••••••">
          </div>
          
          <button type="submit" class="submit-btn" [disabled]="!authForm.valid || isLoading()">
            {{ isLoading() ? 'Procesando...' : (isLogin ? 'Entrar' : 'Crear Cuenta') }}
          </button>
          
          <div class="auth-divider">
            <span>o</span>
          </div>

          <button type="button" class="google-btn" (click)="loginWithGoogle()" [disabled]="isLoading()">
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Continuar con Google
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
export class LoginComponent {
  private authService = inject(AuthService);
  public messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLogin = true;
  isLoading = signal(false);
  
  nombre = '';
  email = '';
  password = '';

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.messageService.clearMessage();
  }

  async loginWithGoogle() {
    this.messageService.clearMessage();
    try {
      // Llamamos directamente para asegurar que el navegador reconozca la acción del usuario
      const result = await this.authService.loginWithGoogle();
      
      if (result.success) {
        this.isLoading.set(true);
        this.messageService.showMessage('¡Bienvenido!', 'Sesión iniciada con Google.', 'success');
        setTimeout(() => this.router.navigateByUrl('/dashboard'), 1500);
      } else {
        this.messageService.showMessage('Error de Google', this.translateError(result.error), 'error');
      }
    } catch (err) {
      this.messageService.showMessage('Error', 'No se pudo abrir la ventana de Google.', 'error');
    }
  }

  async onSubmit() {
    this.isLoading.set(true);
    this.messageService.clearMessage();

    if (this.isLogin) {
      const result = await this.authService.login(this.email, this.password);
      if (result.success) {
        this.messageService.showMessage('¡Bienvenido!', 'Sesión iniciada correctamente.', 'success');
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        setTimeout(() => this.router.navigateByUrl(returnUrl), 1500);
      } else {
        this.messageService.showMessage('Error de Acceso', this.translateError(result.error), 'error');
      }
    } else {
      const result = await this.authService.register(this.email, this.password, this.nombre);
      if (result.success) {
        this.messageService.showMessage('Cuenta Creada', 'Te has registrado exitosamente. Redirigiendo...', 'success');
        setTimeout(() => this.router.navigateByUrl('/dashboard'), 2000);
      } else {
        this.messageService.showMessage('Error de Registro', this.translateError(result.error), 'error');
      }
    }
    this.isLoading.set(false);
  }

  private translateError(error: string): string {
    if (error.includes('auth/operation-not-allowed')) return 'El inicio de sesión con Google no está habilitado en la consola de Firebase.';
    if (error.includes('auth/invalid-credential')) return 'Credenciales incorrectas.';
    if (error.includes('auth/user-not-found')) return 'Usuario no encontrado.';
    if (error.includes('auth/wrong-password')) return 'Contraseña incorrecta.';
    if (error.includes('auth/email-already-in-use')) return 'Este correo ya está registrado.';
    if (error.includes('auth/weak-password')) return 'La contraseña debe tener al menos 6 caracteres.';
    if (error.includes('auth/invalid-email')) return 'El formato del correo no es válido.';
    return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }
}
