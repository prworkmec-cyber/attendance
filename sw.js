// Minimal service worker: lets the phone install the app. Always uses the network (attendance must be live).
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {});
