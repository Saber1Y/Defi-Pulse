"use client";

export function requestNotificationPermission(): boolean {
  if (typeof window === 'undefined') return false;
  
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      return permission === 'granted';
    });
  }
  
  return false;
}

export function showNotification(title: string, body: string): void {
  if (typeof window === 'undefined') return;
  
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
    });
  }
}
