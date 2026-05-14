const SHELL = 'upani-shell-v3'
const STATIC = 'upani-static-v3'
const IMAGES = 'upani-images-v1'

// Pre-cache app shell pages on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL).then((c) => c.addAll(['/', '/saved']))
  )
  self.skipWaiting()
})

// Remove old caches and take control immediately
self.addEventListener('activate', (event) => {
  const keep = new Set([SHELL, STATIC, IMAGES])
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // ── Next.js immutable static bundles (cache-first, hash-based filenames) ──
  if (url.origin === self.location.origin && url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((res) => {
          caches.open(STATIC).then((c) => c.put(request, res.clone()))
          return res
        })
      })
    )
    return
  }

  // ── Images (cache-first; also pre-populated when user saves an article) ──
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request)
          .then((res) => {
            if (res.ok || res.type === 'opaque') {
              caches.open(IMAGES).then((c) => c.put(request, res.clone()))
            }
            return res
          })
          .catch(() => new Response('', { status: 408 }))
      })
    )
    return
  }

  // ── Navigation requests (network-first, fall back to cached shell) ──────
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) caches.open(SHELL).then((c) => c.put(request, res.clone()))
          return res
        })
        .catch(() =>
          caches.match(request).then((cached) => cached ?? caches.match('/'))
        )
    )
    return
  }

  // ── Same-origin assets (icons, manifest) — cache-first ──────────────────
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((res) => {
          caches.open(SHELL).then((c) => c.put(request, res.clone()))
          return res
        })
      })
    )
  }
})

// ── Push notifications ────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Upaninews', {
      body: data.body ?? '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: data.url ?? '/' },
      vibrate: [100, 50, 100],
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const path = event.notification.data?.url ?? '/'
      const url = self.registration.scope.replace(/\/$/, '') + path
      for (const client of clientList) {
        if (client.url.startsWith(self.registration.scope) && 'focus' in client) {
          return client.navigate ? client.navigate(url).then(c => c.focus()) : client.focus()
        }
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})
