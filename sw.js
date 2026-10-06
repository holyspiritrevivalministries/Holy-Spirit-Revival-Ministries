const CACHE="hsrm-v2";
const ASSETS=["./","./index.html","./manifest.webmanifest","./assets/ministry-logo.png","./assets/pastor-gloria.jpg","./assets/evangelist-keffa.jpg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
