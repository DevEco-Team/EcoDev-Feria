import { Injectable, signal } from '@angular/core';

export interface Message {
  type: 'success' | 'error' | 'info';
  title: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _message = signal<Message | null>(null);
  message = this._message.asReadonly();

  showMessage(title: string, text: string, type: 'success' | 'error' | 'info' = 'info') {
    this._message.set({ title, text, type });
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.clearMessage();
    }, 5000);
  }

  clearMessage() {
    this._message.set(null);
  }
}
