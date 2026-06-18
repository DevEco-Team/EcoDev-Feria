import { Injectable, signal, computed, inject, PLATFORM_ID, Injector, runInInjectionContext } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  user,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  GoogleAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, updateDoc, enableNetwork } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private injector = inject(Injector);
  
  // Proveedor de Google
  private googleProvider = new GoogleAuthProvider();

  // Observamos el estado de autenticación de Firebase
  private firebaseUser$ = user(this.auth);
  private _currentUser: any;
  
  currentUser = computed(() => this._currentUser());
  isLoggedIn = computed(() => !!this._currentUser());

  // Datos adicionales del usuario desde Firestore
  private _userData = signal<any | null>(null);
  userData = this._userData.asReadonly();

  constructor() {
    this._currentUser = toSignal(this.firebaseUser$, { injector: this.injector });

    if (isPlatformBrowser(this.platformId)) {
      this.firebaseUser$.subscribe(async (user) => {
        if (user) {
          console.log("Usuario autenticado detectado:", user.uid);
          await this.loadUserData(user.uid);
        } else {
          this._userData.set(null);
        }
      });
    }
  }

  private _isLoadingUserData = false;

  private async loadUserData(uid: string) {
    if (this._isLoadingUserData) return;
    
    // Evitar ejecutar en el servidor si no es necesario para el SEO inicial
    if (!isPlatformBrowser(this.platformId)) return;

    this._isLoadingUserData = true;

    return runInInjectionContext(this.injector, async () => {
      try {
        const userRef = doc(this.firestore, `usuarios/${uid}`);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          this._userData.set(docSnap.data());
          console.log("Datos de usuario cargados:", docSnap.data());
        } else {
          console.warn("No se encontró el documento del usuario en Firestore.");
          // Si es un login con Google, quizás el documento no exista aún
          // Podríamos intentar crearlo aquí si tenemos los datos del auth user
        }
      } catch (error: any) {
        console.error("Error al cargar datos de usuario:", error);
        
        // Si falla por estar offline, intentamos habilitar la red explícitamente
        if (isPlatformBrowser(this.platformId)) {
          console.log("Detectado estado offline o error de conexión. Intentando reconectar...");
          try {
            await enableNetwork(this.firestore);
            // Esperamos un segundo para que la red se estabilice
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const userRef = doc(this.firestore, `usuarios/${uid}`);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
              this._userData.set(docSnap.data());
              console.log("Datos cargados tras reconexión.");
            }
          } catch (retryError) {
            console.error("Reintento tras habilitar red falló:", retryError);
          }
        }
      } finally {
        this._isLoadingUserData = false;
      }
    });
  }

  async login(email: string, password: string) {
    return runInInjectionContext(this.injector, async () => {
      try {
        console.log("Iniciando sesión para:", email);
        const result = await signInWithEmailAndPassword(this.auth, email, password);
        console.log("Sesión iniciada con éxito para UID:", result.user.uid);
        
        // Esperamos un momento para que el token se propague
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await this.loadUserData(result.user.uid);
        return { success: true };
      } catch (error: any) {
        console.error("Login error:", error);
        return { success: false, error: error.code || error.message };
      }
    });
  }

  async loginWithGoogle() {
    return runInInjectionContext(this.injector, async () => {
      try {
        const result = await signInWithPopup(this.auth, this.googleProvider);
        const user = result.user;

        // Verificar si el usuario ya existe en Firestore
        const userRef = doc(this.firestore, `usuarios/${user.uid}`);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          // Si es un usuario nuevo de Google, registrarlo en Firestore
          const userData = {
            id: user.uid,
            nombre: user.displayName || 'Usuario de Google',
            email: user.email,
            foto: user.photoURL,
            rol: 'usuario',
            fecha_registro: new Date().toISOString()
          };
          await setDoc(userRef, userData);
          this._userData.set(userData);
        } else {
          this._userData.set(docSnap.data());
        }

        return { success: true };
      } catch (error: any) {
        console.error("Google login error:", error);
        return { success: false, error: error.code || error.message };
      }
    });
  }

  async register(email: string, password: string, nombre: string) {
    return runInInjectionContext(this.injector, async () => {
      try {
        const result = await createUserWithEmailAndPassword(this.auth, email, password);
        await updateProfile(result.user, { displayName: nombre });

        const userData = {
          id: result.user.uid,
          nombre: nombre,
          email: email,
          rol: 'usuario',
          fecha_registro: new Date().toISOString()
        };
        
        const userRef = doc(this.firestore, `usuarios/${result.user.uid}`);
        await setDoc(userRef, userData);
        this._userData.set(userData);

        return { success: true };
      } catch (error: any) {
        console.error("Register error:", error);
        return { success: false, error: error.code || error.message };
      }
    });
  }

  async logout() {
    return runInInjectionContext(this.injector, async () => {
      await signOut(this.auth);
      this.router.navigate(['/auth/login']);
    });
  }

  async updateUserData(data: any) {
    return runInInjectionContext(this.injector, async () => {
      const user = this.auth.currentUser;
      if (!user) throw new Error("No hay usuario autenticado");

      const userRef = doc(this.firestore, `usuarios/${user.uid}`);
      await updateDoc(userRef, data);
      
      // Si el nombre cambió, actualizamos el perfil de Firebase Auth
      if (data.nombre) {
        await updateProfile(user, { displayName: data.nombre });
      }

      await this.loadUserData(user.uid);
    });
  }

  async sendPasswordReset() {
    return runInInjectionContext(this.injector, async () => {
      const email = this.auth.currentUser?.email;
      if (email) {
        await sendPasswordResetEmail(this.auth, email);
      } else {
        throw new Error("No se encontró el email del usuario");
      }
    });
  }

  async updatePassword(newPassword: string) {
    return runInInjectionContext(this.injector, async () => {
      const user = this.auth.currentUser;
      if (!user) throw new Error("No hay usuario autenticado");

      await updatePassword(user, newPassword);
      
      // También registramos la fecha del cambio en Firestore para la "tabla usuarios"
      const userRef = doc(this.firestore, `usuarios/${user.uid}`);
      await updateDoc(userRef, {
        ultima_actualizacion_password: new Date().toISOString()
      });
    });
  }
}
