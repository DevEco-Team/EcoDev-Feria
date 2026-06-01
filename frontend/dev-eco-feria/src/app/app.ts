import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Componente principal de la aplicación.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  /** Título de la aplicación. */
  protected readonly title = signal('eco-dev');
}
