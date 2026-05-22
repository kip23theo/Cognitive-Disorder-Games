const CACHE_NAME = "cognitive-games-v3";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./shared.js",
  "./sw.js",
  "./word-wise-data.js",
  "./balloon-float.html",
  "./light-catcher.html",
  "./matchOrNoMatch.html",
  "./rhythmTap.html",
  "./road-runner.html",
  "./settings.html",
  "./simons-path.html",
  "./sorterGame.html",
  "./word-wise.html",
  "./number-juggler.html",
  "./number-juggler-script.js",
  "./number-juggler-style.css",
  "./spot-the-odd.html",
  "./spot-the-odd-script.js",
  "./spot-the-odd-style.css",
];
// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)),
  );
  self.skipWaiting();
});

// ACTIVATE — clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

// FETCH — cache-first, fall back to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
