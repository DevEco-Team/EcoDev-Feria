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
    if (error.includes('auth/invalid-credential')) return 'Credenciales incorrectas.';
    if (error.includes('auth/user-not-found')) return 'Usuario no encontrado.';
    if (error.includes('auth/wrong-password')) return 'Contraseña incorrecta.';
    if (error.includes('auth/email-already-in-use')) return 'Este correo ya está registrado.';
    if (error.includes('auth/weak-password')) return 'La contraseña debe tener al menos 6 caracteres.';
    if (error.includes('auth/invalid-email')) return 'El formato del correo no es válido.';
    return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }
}
