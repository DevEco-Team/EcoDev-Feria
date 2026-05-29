import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private _currentUser = signal<any | null>(null);
  
  currentUser = computed(() => this._currentUser());
  isLoggedIn = computed(() => !!this._currentUser());

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Check local storage for existing session
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this._currentUser.set(JSON.parse(savedUser));
      }
    }
  }

  login(username: string, password: string): boolean {
    if (username === '1234' && password === '1234') {
      const user = { id: '1', name: 'Usuario Piloto', email: 'piloto@deveco.com' };
      this._currentUser.set(user);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      return true;
    }
    return false;
  }

  logout() {
    this._currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
    }
  }

  updateUser(userData: any) {
    const updated = { ...this._currentUser(), ...userData };
    this._currentUser.set(updated);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(updated));
    }
  }
}
