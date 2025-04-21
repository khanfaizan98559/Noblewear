const CACHE_NAME = "noblewear-cache-v1";
const urlsToCache = [
  "/",
  "./index.html",
  "./assets/css/styles.css",
  "./assets/js/main.js",
  "./assets/img/featured1.png",
  "./assets/img/featured3.png",
  "/offline.html" // Ensure this is available as an offline fallback page
];

// Install and cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate the service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch resources
self.addEventListener("fetch", (event) => {
  console.log("Fetching:", event.request.url); // Log the requested URL

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log("Serving from cache:", event.request.url);
          return cachedResponse; // Serve from cache if available
        }

        // Fetch from the network if not in the cache
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              // Optionally, cache the network response for future use
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
              });
            }
            return networkResponse;
          })
          .catch((err) => {
            console.error("Network request failed:", err);
            // Return a fallback response if network request fails (offline.html as an example)
            return caches.match("/.html"); // You can create an offline page for this scenario
          });
      })
      .catch((err) => {
        console.error("Cache match failed:", err);
        // Handle cases where matching the cache itself failed
        return fetch(event.request); // Try fetching from the network directly
      })
  );
});


// This code is correct and should be in the main JS (NOT in service-worker.js)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(reg => console.log('✅ Service Worker registered:', reg))
      .catch(err => console.error('❌ Service Worker registration failed:', err));
  });
}

