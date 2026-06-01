import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  isDarkMode = signal<boolean>(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.isDarkMode.set(savedTheme === 'dark');
      } else {
        // Default to dark mode as requested
        this.isDarkMode.set(true);
      }
      
      this.applyTheme();
    }

    // Effect to persist and apply theme changes
    effect(() => {
      const dark = this.isDarkMode();
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        this.applyTheme();
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update(dark => !dark);
  }

  private applyTheme() {
    if (this.isDarkMode()) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }
}
