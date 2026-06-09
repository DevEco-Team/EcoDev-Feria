import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Importamos las herramientas de Firebase
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // ../ nos saca de la carpeta app para buscar en src

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('dev-eco-feria');

  // Función para mandar datos a Firebase
async probarConexion() {
    alert("¡Botón presionado! Intentando conectar con Firebase..."); // <-- Agregá esto
    try {
      const docRef = await addDoc(collection(db, "proyectos-prueba"), {
        nombre: "Stand EcoDev",
        categoria: "Tecnología y Ambiente",
        estado: "Aprobado"
      });
      console.log("¡Éxito total! Documento guardado con el ID: ", docRef.id);
      alert("¡Dato guardado con éxito! Revisá la consola de Firebase."); // <-- Y esto si sale bien
    } catch (error) {
      console.error("Falló la conexión con la base de datos: ", error);
      alert("Hubo un error. Revisá la consola del navegador."); // <-- O esto si falla
    }
  }
}