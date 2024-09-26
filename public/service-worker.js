self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Check if the request URL ends with .m3u8
  if (url.endsWith('.m3u8')) {
    // Use cache-first strategy or other optimizations
    event.respondWith(
      caches.open('video-cache').then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // If no cached response, fetch it from the network
          return fetch(event.request).then((networkResponse) => {
            // Optionally cache the response
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
  } else {
    return event.respondWith(fetch(event.request));
  }
});
