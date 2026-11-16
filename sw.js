// Service worker: lets the phone / computer install the app, and shows 📲 notifications (Web Push).
// Always uses the network for the app itself (attendance must be live).
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {});
// A push is only a "wake up": ask the server for the newest notice text of this device, then show it.
self.addEventListener('push', e => e.waitUntil((async () => {
  let items = [];
  try {
    const c = await caches.open('wm-push'), r = await c.match('id'), id = r && await r.json();
    if (id) { const x = await fetch(id.api, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ fn: 'pushPeek', args: [id.sid, id.key] }) }).then(r => r.json());
      if (x && x.ok && Array.isArray(x.data)) items = x.data; }
  } catch (err) {}
  if (!items.length) items = [{ t: 'You have a new notification – tap to open' }];
  const last = items[items.length - 1].t;
  return self.registration.showNotification('WORKMEC FZE', { body: items.length > 1 ? last + '\n+' + (items.length - 1) + ' more' : last,
    icon: 'icon-192.png', badge: 'icon-192.png', tag: 'wm', renotify: true, data: { url: './?bell=1' } });
})()));
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => {
    for (const c of l) if ('focus' in c) { c.postMessage('bell'); return c.focus(); }
    return self.clients.openWindow(e.notification.data && e.notification.data.url || './');
  }));
});
