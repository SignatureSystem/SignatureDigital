// Signature Digital — Service Worker
// Handles background push notifications

self.addEventListener('push', function(event) {
  if (!event.data) return;
  const data = event.data.json();
  const title = data.title || 'Signature Digital';
  const options = {
    body: data.body || 'You have a new message',
    icon: data.icon || '/icon.png',
    badge: data.badge || '/icon.png',
    tag: data.tag || 'sigdig-notif',
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
