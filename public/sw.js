const SHELL = 'upani-shell-v4'
const STATIC = 'upani-static-v4'
const IMAGES = 'upani-images-v1'

const OFFLINE_HTML = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Upaninews</title><style>body{margin:0;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#2E0F2F;color:#F0E8FA;font-family:Georgia,serif;text-align:center;padding:24px}h1{font-size:1.4rem;margin-bottom:12px}p{font-size:.9rem;color:#7A5A9A;margin-bottom:28px}a{display:inline-block;padding:11px 28px;background:#CE9EF0;color:#2E0F2F;border-radius:8px;text-decoration:none;font-weight:700}</style></head><body><h1>Sin conexión</h1><p>Revisa tu internet e intenta de nuevo.</p><a href="/">Reintentar</a></body></html>`

// Pre-cache app shell on install — skipWaiting first so SW activates even if offline
self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(SHELL)
      .then((c) => c.addAll(['/', '/saved']))
      .catch(() => {}) // don't fail install if network unavailable
  )
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
          caches.match(request)
            .then((cached) => cached ?? caches.match('/'))
            .then((cached) => cached ?? new Response(OFFLINE_HTML, {
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            }))
        )
    )
    return
  }

  // ── API routes — always network, never cache ────────────────────────────
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) {
    return // let the browser handle it normally
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

// ── IndexedDB helper ─────────────────────────────────────────────────────
function openNotifDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('upani-notifs', 1)
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore('notifications', { keyPath: 'id' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function saveNotif(data) {
  return openNotifDB().then((db) => new Promise((resolve, reject) => {
    const notif = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: data.title ?? 'Upaninews',
      body: data.body ?? '',
      url: data.url ?? '/',
      time: Date.now(),
      read: false,
    }
    const tx = db.transaction('notifications', 'readwrite')
    tx.objectStore('notifications').add(notif)
    tx.oncomplete = () => resolve(notif)
    tx.onerror = () => reject(tx.error)
  }))
}

// ── Push notifications ────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  const work = saveNotif(data).then((notif) =>
    self.registration.showNotification(notif.title, {
      body: notif.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { id: notif.id, url: notif.url },
      vibrate: [100, 50, 100],
    })
  ).then(() => {
    if ('setAppBadge' in navigator) return navigator.setAppBadge(1)
  })
  event.waitUntil(work)
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  if ('clearAppBadge' in navigator) navigator.clearAppBadge()
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
