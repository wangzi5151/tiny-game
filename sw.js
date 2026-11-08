const CACHE_NAME = 'tiny-game-v1.1.0';
const GAMES = [
  '2048.html',
  'breakout.html',
  'flappy-bird.html',
  'jump-jump.html',
  'match-3.html',
  'memory.html',
  'minesweeper.html',
  'pinball.html',
  'puzzle-15.html',
  'snake.html',
  'space-shooter.html',
  'tetris.html'
];
const APP_SHELL = [
  './1.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-maskable.svg'
].concat(GAMES.map(function(name) { return './games/' + name; }));

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) { return cache.addAll(APP_SHELL); })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(key) { return key !== CACHE_NAME; }).map(function(key) {
        return caches.delete(key);
      }));
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event) {
  var request = event.request;
  if (request.method !== 'GET') return;
  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request)
        .then(function(cached) { return cached || caches.match('./1.html'); })
        .then(function(response) { return response || fetch(request); })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function(cached) {
      if (cached) return cached;
      return fetch(request).then(function(response) {
        if (response && response.ok) {
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(request, copy); });
        }
        return response;
      }).catch(function() { return caches.match('./1.html'); });
    })
  );
});
