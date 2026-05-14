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
