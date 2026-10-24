// Service worker: بيخزّن شكل الموقع بس. الأسئلة والداتا (Supabase) مش بتتخزّن أبداً
const V = 'medrace-v2';
const SHELL = ['./', 'manifest.json', 'icon-192-v2.png', 'icon-512-v2.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())) });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())) });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return; // أي طلب لـ Supabase أو برّه: مباشرة من النت
  // الصفحة: النت الأول (عشان التحديثات تظهر)، ولو مفيش نت النسخة المخزّنة
  e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); return res }).catch(() => caches.match(r).then(m => m || caches.match('./'))));
});
