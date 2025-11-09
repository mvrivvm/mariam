const CACHE_NAME = 'metallic-erp-cache-v1';

self.addEventListener('install', event => {
    console.log('[Service Worker] Installing service worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('[Service Worker] Caching app shell');
            // Pre-cache essential assets. The rest will be cached on-the-fly.
            return cache.addAll([
                '/',
                '/index.html',
                'https://cdn.tailwindcss.com'
            ]);
        }).catch(error => {
            console.error('[Service Worker] Failed to cache app shell:', error);
        })
    );
});

self.addEventListener('fetch', event => {
    // Do not cache API requests to Google to ensure fresh data
    if (event.request.url.includes('googleapis.com')) {
        return event.respondWith(fetch(event.request));
    }
    
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // Cache hit - return the response from the cache
            if (response) {
                return response;
            }

            // Not in cache - fetch from network, cache it, and return the response
            return fetch(event.request).then(
                function(response) {
                    // Check if we received a valid response
                    if(!response || response.status !== 200) {
                        return response;
                    }
                    
                    // We don't cache 'opaque' responses (from cross-origin requests without CORS)
                    // as we can't verify their status.
                    if(response.type === 'opaque') {
                        return response;
                    }

                    // IMPORTANT: Clone the response. A response is a stream
                    // and because we want the browser to consume the response
                    // as well as the cache consuming the response, we need
                    // to clone it so we have two streams.
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }
            );
        })
    );
});

self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating service worker...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
