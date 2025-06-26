import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private installPromptSubject = new BehaviorSubject<BeforeInstallPromptEvent | null>(null);
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  private isInstalledSubject = new BehaviorSubject<boolean>(false);

  public installPrompt$ = this.installPromptSubject.asObservable();
  public isOnline$ = this.isOnlineSubject.asObservable();
  public isInstalled$ = this.isInstalledSubject.asObservable();

  constructor() {
    this.initializePwa();
  }

  private initializePwa(): void {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      this.installPromptSubject.next(e as BeforeInstallPromptEvent);
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      this.isInstalledSubject.next(true);
      this.installPromptSubject.next(null);
    });

    // Listen for online/offline status
    window.addEventListener('online', () => {
      this.isOnlineSubject.next(true);
    });

    window.addEventListener('offline', () => {
      this.isOnlineSubject.next(false);
    });

    // Check if app is running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone) {
      this.isInstalledSubject.next(true);
    }
  }

  async installPwa(): Promise<boolean> {
    const prompt = this.installPromptSubject.value;
    if (!prompt) {
      return false;
    }

    try {
      await prompt.prompt();
      const choiceResult = await prompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
      return false;
    }
  }

  isInstallable(): boolean {
    return !!this.installPromptSubject.value;
  }

  isInstalled(): boolean {
    return this.isInstalledSubject.value;
  }

  isOnline(): boolean {
    return this.isOnlineSubject.value;
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  // Show notification
  showNotification(title: string, options?: NotificationOptions): void {
    if (Notification.permission === 'granted') {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // Send message to service worker to show notification
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          payload: { title, options }
        });
      } else {
        // Fallback to direct notification
        new Notification(title, {
          icon: '/assets/icons/icon-192x192.png',
          badge: '/assets/icons/icon-72x72.png',
          ...options
        });
      }
    }
  }

  // Check if device supports PWA features
  isPwaSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // Get PWA installation status
  getPwaStatus(): {
    isSupported: boolean;
    isInstallable: boolean;
    isInstalled: boolean;
    isOnline: boolean;
  } {
    return {
      isSupported: this.isPwaSupported(),
      isInstallable: this.isInstallable(),
      isInstalled: this.isInstalled(),
      isOnline: this.isOnline()
    };
  }
}