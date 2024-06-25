import{intercept as B}from"@neptune";import{store as j}from"@neptune";import{intercept as V}from"@neptune";var p=(t,e,n,{timeoutMs:r,cancel:s}={})=>{r??=5e3,s??=!1;let o,i,d=new Promise((I,l)=>{o=I,i=l}),a=V(e,I=>{if(o(I),s)return!0},!0),c=V(n,i,!0),m=setTimeout(()=>i(`${n}_TIMEOUT`),r);return t(),d.finally(()=>{clearTimeout(m),a(),c()})};import{store as ce}from"@neptune";var N=()=>ce.getState()?.playbackControls??{};var g=class{static _cache={};static current(e){if(e??=N()?.playbackContext,e?.actualProductId!==void 0)return this.ensure(e.actualProductId)}static async ensure(e){if(e===void 0)return;let n=this._cache[e];if(n!==void 0)return n;let r=j.getState().content.mediaItems;for(let s in r){let o=r[s]?.item;o?.contentType==="track"&&(this._cache[s]=o)}if(this._cache[e]===void 0){let s=window.location.pathname;await p(()=>neptune.actions.router.replace(`/track/${e}`),["page/IS_DONE_LOADING"],[]),neptune.actions.router.replace(s);let i=j.getState().content.mediaItems[+e]?.item;i?.contentType==="track"&&(this._cache[e]=i)}return this._cache[e]}};import{actions as k}from"@neptune";var de=t=>{let e=i=>{let d=(...a)=>{i(t,...a)};return d.withContext=a=>(...c)=>{i(t,a,...c)},d},n=e(console.log),r=e(console.warn),s=e(console.error),o=(i,d,a)=>{let c=m=>{i(m),d({message:`${t} - ${m}`,category:"OTHER",severity:a})};return c.withContext=m=>{let I=i.withContext(m);return l=>{I(l),l instanceof Error&&(l=l.message),d({message:`${t}.${m} - ${l}`,category:"OTHER",severity:a})}},c};return{log:n,warn:r,err:s,msg:{log:o(n,k.message.messageInfo,"INFO"),warn:o(r,k.message.messageWarn,"WARN"),err:o(s,k.message.messageError,"ERROR")}}},f=de("[lib]");import{actions as G,store as Te}from"@neptune";var _=(t,e)=>e.some(n=>t instanceof n),F,W;function ue(){return F||(F=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function me(){return W||(W=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var C=new WeakMap,A=new WeakMap,b=new WeakMap;function le(t){let e=new Promise((n,r)=>{let s=()=>{t.removeEventListener("success",o),t.removeEventListener("error",i)},o=()=>{n(h(t.result)),s()},i=()=>{r(t.error),s()};t.addEventListener("success",o),t.addEventListener("error",i)});return b.set(e,t),e}function pe(t){if(C.has(t))return;let e=new Promise((n,r)=>{let s=()=>{t.removeEventListener("complete",o),t.removeEventListener("error",i),t.removeEventListener("abort",i)},o=()=>{n(),s()},i=()=>{r(t.error||new DOMException("AbortError","AbortError")),s()};t.addEventListener("complete",o),t.addEventListener("error",i),t.addEventListener("abort",i)});C.set(t,e)}var v={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return C.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return h(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function q(t){v=t(v)}function fe(t){return me().includes(t)?function(...e){return t.apply(L(this),e),h(this.request)}:function(...e){return h(t.apply(L(this),e))}}function he(t){return typeof t=="function"?fe(t):(t instanceof IDBTransaction&&pe(t),_(t,ue())?new Proxy(t,v):t)}function h(t){if(t instanceof IDBRequest)return le(t);if(A.has(t))return A.get(t);let e=he(t);return e!==t&&(A.set(t,e),b.set(e,t)),e}var L=t=>b.get(t);function D(t,e,{blocked:n,upgrade:r,blocking:s,terminated:o}={}){let i=indexedDB.open(t,e),d=h(i);return r&&i.addEventListener("upgradeneeded",a=>{r(h(i.result),a.oldVersion,a.newVersion,h(i.transaction),a)}),n&&i.addEventListener("blocked",a=>n(a.oldVersion,a.newVersion,a)),d.then(a=>{o&&a.addEventListener("close",()=>o()),s&&a.addEventListener("versionchange",c=>s(c.oldVersion,c.newVersion,c))}).catch(()=>{}),d}var ye=["get","getKey","getAll","getAllKeys","count"],Ie=["put","add","delete","clear"],P=new Map;function $(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(P.get(e))return P.get(e);let n=e.replace(/FromIndex$/,""),r=e!==n,s=Ie.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(s||ye.includes(n)))return;let o=async function(i,...d){let a=this.transaction(i,s?"readwrite":"readonly"),c=a.store;return r&&(c=c.index(d.shift())),(await Promise.all([c[n](...d),s&&a.done]))[0]};return P.set(e,o),o}q(t=>({...t,get:(e,n,r)=>$(e,n)||t.get(e,n,r),has:(e,n)=>!!$(e,n)||t.has(e,n)}));var ge=["continue","continuePrimaryKey","advance"],U={},M=new WeakMap,H=new WeakMap,be={get(t,e){if(!ge.includes(e))return t[e];let n=U[e];return n||(n=U[e]=function(...r){M.set(this,H.get(this)[e](...r))}),n}};async function*xe(...t){let e=this;if(e instanceof IDBCursor||(e=await e.openCursor(...t)),!e)return;e=e;let n=new Proxy(e,be);for(H.set(n,e),b.set(n,L(e));e;)yield n,e=await(M.get(n)||e.continue()),M.delete(n)}function Y(t,e){return e===Symbol.asyncIterator&&_(t,[IDBIndex,IDBObjectStore,IDBCursor])||e==="iterate"&&_(t,[IDBIndex,IDBObjectStore])}q(t=>({...t,get(e,n,r){return Y(e,n)?xe:t.get(e,n,r)},has(e,n){return Y(e,n)||t.has(e,n)}}));var x=class{constructor(e){this.avalibleSlots=e}queued=[];async obtain(){return this.avalibleSlots>0?this.avalibleSlots--:new Promise(e=>this.queued.push(()=>e(this.avalibleSlots--)))}release(){this.avalibleSlots++,this.queued.shift()?.()}};var z="@inrixia/sharedStorage",u=class t{constructor(e,n){this.storeName=e;t.openDB(e,n)}static db;static openSema=new x(1);static async openDB(e,n){await this.openSema.obtain();try{let r=o=>async()=>{await o.close(),this.openDB(e,n)};this.db=D(z).then(async o=>(o.addEventListener("versionchange",r(o)),o.objectStoreNames.contains(e)?o:(await o.close(),D(z,o.version+1,{blocking:r(o),upgrade(i){i.createObjectStore(e,n)}}))));let s=await this.db;s.addEventListener("versionchange",r(s))}finally{this.openSema.release()}}static close(){return this.db?.then(e=>e.close())}add(e,n){return t.db.then(r=>r.add(this.storeName,e,n))}clear(){return t.db.then(e=>e.clear(this.storeName))}count(e){return t.db.then(n=>n.count(this.storeName,e))}delete(e){return t.db.then(n=>n.delete(this.storeName,e))}get(e){return t.db.then(n=>n.get(this.storeName,e))}getAll(e,n){return t.db.then(r=>r.getAll(this.storeName,e,n))}getAllKeys(e,n){return t.db.then(r=>r.getAllKeys(this.storeName,e,n))}getKey(e){return t.db.then(n=>n.getKey(this.storeName,e))}put(e,n){return t.db.then(r=>r.put(this.storeName,e,n))}};var $e=1e3*60*60*24,T=class{static _cache={};static _trackItemsCache=new u("AlbumCache.trackItems",{keyPath:"albumId"});static async get(e){if(e===void 0)return;let n=this._cache[e];if(n!==void 0)return n;let r=Te.getState().content.albums;for(let s in r)this._cache[s]=r[s];if(this._cache[e]===void 0){let s=await p(()=>G.content.loadAlbum({albumId:e}),["content/LOAD_ALBUM_SUCCESS"],[]).then(o=>o?.[0].album).catch(f.warn.withContext("AlbumCache.get"));s!==void 0&&(this._cache[e]=s)}return this._cache[e]}static async getTrackItems(e){if(e===void 0)return;let n=await this._trackItemsCache.get(e),r=this.updateTrackItems(e);return n?.trackItems!==void 0?n.trackItems:r}static async updateTrackItems(e){let n=await p(()=>G.content.loadAllAlbumMediaItems({albumId:e}),["content/LOAD_ALL_ALBUM_MEDIA_ITEMS_SUCCESS"],["content/LOAD_ALL_ALBUM_MEDIA_ITEMS_FAIL"],{timeoutMs:2e3}).catch(f.warn.withContext("PlaylistCache.getTrackItems.interceptPromise"));if(n?.[0]?.mediaItems===void 0)return(await this._trackItemsCache.get(e))?.trackItems;let r=Array.from((n?.[0]?.mediaItems).map(s=>s?.item).filter(s=>s?.contentType==="track"));return await this._trackItemsCache.put({albumId:e,trackItems:r}),r}};import{actions as Ee}from"@neptune";var E=class extends u{maxAge;constructor(e,n){let{maxAge:r,storeSchema:s}=n??{};super(e,s),this.maxAge=r}setExpires(e,n){if(n!==void 0)e.__expires=n;else if(this.maxAge!==void 0)e.__expires=Date.now()+this.maxAge;else throw new Error("maxAge or expires must be set!")}clearExpires(e){delete e.__expires}isTooOld(e){return e?.__expires===void 0?!0:Date.now()>e.__expires}async add(e,n){return this.setExpires(e),super.add(e,n)}async put(e,n){return this.setExpires(e),super.put(e,n)}async addExpires(e,n,r){return this.setExpires(e,n),super.add(e,r)}async putExpires(e,n,r){return this.setExpires(e,n),super.put(e,r)}async get(e){let n=await super.get(e);if(!this.isTooOld(n))return this.clearExpires(n),n}async getWithExpiry(e){let n=await super.get(e);if(n===void 0)return{value:void 0,expires:void 0,expired:void 0};let r=n.__expires,s=this.isTooOld(n);return this.clearExpires(n),{value:n,expires:r,expired:s}}async getAll(e,n){return(await super.getAll(e,n)).filter(this.isTooOld.bind(this)).map(this.clearExpires.bind(this))}};var S=class{static _trackItemsCache=new E("PlaylistCache.trackItems",{maxAge:3e4,storeSchema:{keyPath:"playlistUUID"}});static async getTrackItems(e){if(e===void 0)return;let n=await this._trackItemsCache.get(e),r=this.updateTrackItems(e);return n?.trackItems!==void 0?n.trackItems:r}static async updateTrackItems(e){let n=await p(()=>Ee.content.loadListItemsPage({loadAll:!0,listName:`playlists/${e}`,listType:"mediaItems"}),["content/LOAD_LIST_ITEMS_PAGE_SUCCESS"],["content/LOAD_LIST_ITEMS_PAGE_FAIL"],{timeoutMs:2e3}).catch(f.warn.withContext("PlaylistCache.getTrackItems.interceptPromise"));if(n?.[0]?.items===void 0)return(await this._trackItemsCache.get(e))?.trackItems;let r=Array.from((n?.[0]?.items).map(s=>s?.item).filter(s=>s?.contentType==="track"));return await this._trackItemsCache.put({playlistUUID:e,trackItems:r}),r}};var w=class t{static _albumsCache={};static _playlistsCache={};static _intercepts=[B(["contextMenu/OPEN_MEDIA_ITEM"],([e])=>{(async()=>this._onOpen({type:"TRACK"},await this.getTrackItems([e.id])))()}),B(["contextMenu/OPEN_MULTI_MEDIA_ITEM"],([e])=>{(async()=>this._onOpen({type:"TRACK"},await this.getTrackItems(e.ids)))()}),B("contextMenu/OPEN",([e])=>{switch(e.type){case"ALBUM":{T.getTrackItems(e.id).then(n=>{n!==void 0&&this._onOpen({type:"ALBUM",albumId:e.id},n)});break}case"PLAYLIST":{S.getTrackItems(e.id).then(n=>{n!==void 0&&this._onOpen({type:"PLAYLIST",playlistId:e.id},n)});break}}})];static async getTrackItems(e){return(await Promise.all(e.map(g.ensure.bind(g)))).filter(r=>r!==void 0)}static _onOpen(e,n){setTimeout(async()=>{let r=0,s=document.querySelector('[data-type="list-container__context-menu"]');for(;s===null&&r<50;)await new Promise(o=>setTimeout(o,50)),s=document.querySelector('[data-type="list-container__context-menu"]');if(s!==null)for(let o of this._listeners)o(e,s,n).catch(f.err.withContext("ContextMenu.listener"))})}static _listeners=[];static onOpen(e){t._listeners.push(e)}static onUnload(){this._intercepts.forEach(e=>e())}};var J=async()=>{await u.close(),await w.onUnload()};var X=(t,e)=>{let n=document.getElementById(e);n||(n=document.createElement("style"),n.id=e,document.head.appendChild(n)),n.innerHTML=t},Q=t=>document.getElementById(t);import{storage as Z}from"@plugin";var ee=t=>(Object.keys(t).forEach(e=>Z[e]??=t[e]),Z);var te=ee({css:""}),O="__Themer__Draggable",R=`${O}__Style`,ne=()=>{let t=document.getElementById(O);if(!t){t=document.createElement("div"),t.id=O,t.style.width="300px",t.style.height="200px",t.style.position="absolute",t.style.top="100px",t.style.left="100px",t.style.border="1px solid #ccc",t.style.backgroundColor="#f9f9f9",t.style.resize="both",t.style.overflow="auto",t.style.padding="10px",t.style.cursor="move",t.style.zIndex="1000";let e=document.createElement("textarea");e.style.width="100%",e.style.height="100%",e.style.boxSizing="border-box",e.rows=10,e.cols=50,e.placeholder="Enter css styles here...",e.value=te.css,e.addEventListener("keyup",n=>X(te.css=n.target.value,R)),t.appendChild(e),document.body.appendChild(t)}return t};var y=ne(),K=!1,re,se,oe=t=>{K=!0,re=t.clientX-y.getBoundingClientRect().left,se=t.clientY-y.getBoundingClientRect().top},ie=t=>{K&&(y.style.left=`${t.clientX-re}px`,y.style.top=`${t.clientY-se}px`)},ae=()=>{K=!1};y.addEventListener("mousedown",oe);document.addEventListener("mousemove",ie);document.addEventListener("mouseup",ae);var bt=()=>{y.removeEventListener("mousedown",oe),document.removeEventListener("mousemove",ie),document.removeEventListener("mouseup",ae),y.remove(),Q(R)?.remove(),J()};export{bt as onUnload};