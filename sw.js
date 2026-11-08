
const CACHE='travel-shell-48fabb936bdb';
const FILES=["./","./index.html","./cloud-config.json","./favicon.svg","./otaru.jpg","./illustrations/travel-suitcase-v1.webp","./illustrations/travel-stamp-v1.webp","./assets/index-CClLAM0k.js","./assets/index-45VBAMdD.css"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('travel-shell-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url),base=new URL(self.registration.scope);
 if(request.method!=='GET'||url.origin!==base.origin||!url.pathname.startsWith(base.pathname))return;
 const navigation=request.mode==='navigate',config=url.pathname===base.pathname+'cloud-config.json';
 const asset=/\.(?:js|css|webp|jpg|png|svg)$/.test(url.pathname);
 if(!navigation&&!config&&!asset)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const key=navigation?new URL('index.html',base).href:request;
  const cached=await cache.match(key);
  if(asset&&cached)return cached;
  try{const response=await fetch(request,{signal:AbortSignal.timeout(7000)});if(response.ok)await cache.put(key,response.clone());return response}catch(error){if(cached)return cached;throw error}
 })());
});