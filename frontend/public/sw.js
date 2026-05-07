self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open('lab-cache').then((cache) =>
      fetch(event.request).then((response) => {
        cache.put(event.request, response.clone()).catch(() => undefined);
        return response;
      }).catch(() => cache.match(event.request))
    )
  );
});
