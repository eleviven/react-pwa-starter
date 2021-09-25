const CACHE_NAME = "v1";
const SOURCE_MAP = ["index.html", "offline.html"];

const self = this;

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(SOURCE_MAP);
    })
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
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

self.addEventListener("fetch", (e) => {
  console.log(e.request);
  e.respondWith(
    caches
      .match(e.request)
      .then(() => {
        return fetch(e.request);
      })
      .catch(() => caches.match("offline.html"))
  );
});
