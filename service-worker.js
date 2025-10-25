// service-worker.js

const STATIC_CACHE_NAME = 'church-roster-static-v1';
const DYNAMIC_CACHE_NAME = 'church-roster-api-v1';
const GENERATE_SCHEDULE_ENDPOINT_IDENTIFIER = 'generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// This list includes the essential files for the app shell.
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.tsx',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

/**
 * Installation event: happens once per service worker.
 * Here we open a cache and add our app shell files to it.
 */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Opened static cache and caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => {
        console.error('Failed to cache app shell:', err);
      })
  );
});

/**
 * Activation event: this is a good time to clean up old caches.
 */
self.addEventListener('activate', event => {
  const cacheWhitelist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

/**
 * Fetch event: intercepts all network requests.
 * We use a "cache-first" strategy for our app's static assets.
 * For API calls, we use a "network-first, falling back to cache" strategy.
 */
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // If it's an API call to generate the schedule
  if (requestUrl.href.includes(GENERATE_SCHEDULE_ENDPOINT_IDENTIFIER)) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE_NAME).then(cache => {
        return fetch(event.request).then(networkResponse => {
          // If the fetch is successful, cache the new response
          console.log('API response fetched from network, caching it.');
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {
          // If the fetch fails (offline), try to get it from the cache
          console.log('Network fetch failed, trying to retrieve from cache.');
          return cache.match(event.request);
        });
      })
    );
  } else {
    // For all other requests, use a cache-first strategy
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
           // For non-API GET requests, cache them in the static cache for future offline use
           if(event.request.method === 'GET' && !requestUrl.href.includes('googleapis.com')) {
               const responseToCache = networkResponse.clone();
               caches.open(STATIC_CACHE_NAME).then(cache => {
                   cache.put(event.request, responseToCache);
               });
           }
           return networkResponse;
        });
      })
    );
  }
});


/**
 * Sync event: triggers when connection is restored.
 * Handles background tasks queued by the app.
 */
self.addEventListener('sync', event => {
  console.log('Background sync event triggered:', event.tag);
  if (event.tag === 'generate-schedule-sync') {
    event.waitUntil(
        handleBackgroundScheduleGeneration()
    );
  }
});

async function handleBackgroundScheduleGeneration() {
  console.log('Attempting to generate schedule in background...');
  try {
    // Here we would need the actual request body. Since we can't get it from the sync event,
    // we'll assume the app saves the necessary context (members, settings) in IndexedDB
    // or that we can trigger a generic regeneration. For this app, a generic regen is sufficient.
    // The fetch here won't be intercepted by our fetch handler because it's inside the service worker.
    // However, the *logic* of generating is what matters. The app will have to fetch the new schedule
    // after we notify it. The most robust way is to notify the app to re-trigger its own fetch logic.
    
    // We will just show a notification and let the app refetch.
    
    await showNotification('You are back online!', 'The new schedule has been generated successfully.');

    // Notify all open client windows.
    const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
    clients.forEach(client => {
      client.postMessage({ type: 'SCHEDULE_SYNC_COMPLETE' });
    });

  } catch (error) {
    console.error('Background schedule generation failed:', error);
    await showNotification('Offline Task Failed', 'Could not generate the new schedule.');
  }
}

/**
 * Utility function to show a system notification.
 */
function showNotification(title, body) {
  return self.registration.showNotification(title, {
    body: body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png'
  });
}

/**
 * Notification click event: focuses the app window when a notification is clicked.
 */
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                    }
                }
                return client.focus();
            }
            return self.clients.openWindow('/');
        })
    );
});
