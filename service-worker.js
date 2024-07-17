const CACHE_NAME = 'al-quran-digital-v3123';
const urlsToCache = [
'/',
"/audio.html",
"/bbldrizzy.html",
"/doa.html",
"/index.html",
"/emptiga.html",
"/manifest.json",
"/quran.html",
"/tasbih.html",
"/_redirects",
"/audio/hselesai.mp3",
"/audio/klik.mp3",
"/bk/claud.html",
"/css/all.min.css",
"/css/audio.css",
"/css/audio2.css",
"/css/doa.css",
"/css/index.css",
"/css/tasbih.css",
"/css/warna.css",
"/doa/doa.json",
"/font/LPMQ-IsepMisbah.woff2",
"/images/android-chrome-192x192.png",
"/images/android-chrome-512x512.png",
"/images/apple-touch-icon.png",
"/images/favicon-16x16.png",
"/images/favicon-32x32.png",
"/images/favicon.ico",
"/images/icon-192x192.png",
"/images/icon-512x512.png",
"/images/quran-thumbnail.jpg",
"/js/app.js",
"/js/theme-switcher.js",
"/js/download.js",
"/js/kdot.js",
"/js/kdot2.js",
"/js/kdot3.js",
"/js/quranen.js",
"/js/sweetalert2@11.js",
"/webfonts/fa-regular-400.ttf",
"/webfonts/fa-regular-400.woff2",
"/webfonts/fa-solid-900.ttf",
"/webfonts/fa-solid-900.woff2",
"/webfonts/Poppins-Bold.ttf",
"/webfonts/Poppins-Regular.ttf",
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});