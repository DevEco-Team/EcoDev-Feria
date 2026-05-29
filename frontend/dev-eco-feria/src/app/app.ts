import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('dev-eco-feria');

  estaciones: any[] = [];

  constructor(private firestoreService: FirestoreService) {

    this.firestoreService.getEstaciones()
      .then(data => {
        this.estaciones = data;
        console.log('DATOS:', data);
      })
      .catch(err => console.error(err));

  }
}