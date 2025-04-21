const CACHE_NAME = "noblewear-cache-v1";
const urlsToCache = [
  "./index.html",
  "./assets/css/styles.css",
  "./assets/js/main.js",
  "./assets/img/featured1.png",
  "./assets/img/featured3.png"
];

// Install the service worker
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
    caches.match(event.request).then((response) => {
      if (response) {
        console.log("Serving from cache:", event.request.url);
      } else {
        console.log("Fetching from network:", event.request.url);
      }
      return response || fetch(event.request);
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

