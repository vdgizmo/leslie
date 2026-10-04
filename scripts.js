// Tema aplicado primeiro, para evitar piscar claro/escuro
try{document.documentElement.dataset.theme=localStorage.getItem("mp-theme")||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light")}catch(e){}

const $ = s => document.querySelector(s);
const h = (t, p = {}, ...k) => { const e = Object.assign(document.createElement(t), p); e.append(...k); return e; };
const AUDIO = /\.(mp3|wav)$/i, IMG = /\.(jpe?g|png|webp|gif)$/i;
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
let albums = [], cur = null, queue = [], qi = -1;
let meta = JSON.parse(localStorage.getItem('mp-meta') || '{}');
const save = () => localStorage.setItem('mp-meta', JSON.stringify(meta));
const au = $('#au');

/* ---------- cadastro (metadados) ---------- */
const M = a => meta[a.key] ??= { order: [], tracks: {} };
const base = n => n.replace(/\.[^.]+$/, '').replace(/^\s*\d+\s*[-._)]\s*/, '');
const atitle = a => M(a).title || a.folder.split('/').pop();
const tname = (a, t) => M(a).tracks?.[t.name]?.title || base(t.name);
const tartist = (a, t) => M(a).tracks?.[t.name]?.artist || M(a).artist || '';
function sorted(a) {
  const o = M(a).order || [], idx = n => { const i = o.indexOf(n); return i < 0 ? 1e9 : i; };
  return [...a.tracks].sort((x, y) => idx(x.name) - idx(y.name) || collator.compare(x.name, y.name));
}

/* ---------- arquivos ---------- */
const cache = new WeakMap();
async function urlOf(e) {
  if (!e) return null;
  if (!cache.has(e)) { let v = await e.get(); if (v instanceof Blob) v = URL.createObjectURL(v); cache.set(e, v); }
  return cache.get(e);
}
async function walk(dir, path = '', out = []) {            // File System Access API
  for await (const [name, hd] of dir.entries()) {
    if (name.startsWith('.')) continue;
    if (hd.kind === 'file') out.push({ album: path, name, get: () => hd.getFile() });
    else await walk(hd, path ? path + '/' + name : name, out);
  }
  return out;
}
async function scanHttp(url = new URL('./', location.href).href, path = '', out = [], depth = 0) { // listagem de diretório do servidor
  const r = await fetch(url); if (!r.ok) throw 0;
  const doc = new DOMParser().parseFromString(await r.text(), 'text/html');
  const root = new URL(url).pathname;
  for (const a of doc.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href');
    if (/^(\?|#|mailto:|javascript:)/i.test(href)) continue;
    const u = new URL(href, url);
    if (u.origin !== location.origin || !u.pathname.startsWith(root) || u.pathname === root) continue;
    const rel = u.pathname.slice(root.length);
    if (rel.split('/').filter(Boolean).length !== 1) continue;   // ignora pasta-pai e links fora do nível atual
    const name = decodeURIComponent(rel.replace(/\/$/, ''));
    if (name.startsWith('.')) continue;
    if (rel.endsWith('/')) { if (depth < 3) await scanHttp(u.href, path ? path + '/' + name : name, out, depth + 1); }
    else out.push({ album: path, name, get: () => u.href });
  }
  return out;
}
async function build(entries) {
  const j = entries.find(e => !e.album && e.name === 'biblioteca.json');
  if (j) try { const f = await (await fetch(await urlOf(j))).json(); for (const k in f) meta[k] ??= f[k]; } catch {}
  const m = new Map();
  for (const e of entries) {
    if (!m.has(e.album)) m.set(e.album, { key: e.album, folder: e.album || '(raiz)', tracks: [], cover: null });
    const a = m.get(e.album);
    if (AUDIO.test(e.name)) a.tracks.push(e);
    else if (IMG.test(e.name) && (!a.cover || /cover|capa|folder|front/i.test(e.name))) a.cover = e;
  }
  albums = [...m.values()].filter(a => a.tracks.length).sort((x, y) => collator.compare(x.folder, y.folder));
  renderGrid();
}

/* ---------- capas ---------- */
function paint(el, url, a) {
  if (url) { el.style.backgroundColor = ''; el.style.backgroundImage = `url("${url}")`; el.textContent = ''; return; }
  let n = 0; for (const c of a.folder) n = (n * 31 + c.charCodeAt(0)) % 360;
  el.style.backgroundImage = ''; el.style.backgroundColor = `hsl(${n} 38% 42%)`;
  el.textContent = atitle(a).charAt(0).toUpperCase();
}
const coverUrl = async a => M(a).cover || await urlOf(a.cover);
const setCover = (el, a) => { paint(el, null, a); coverUrl(a).then(u => u && paint(el, u, a)); };
const resize = f => new Promise(r => {
  const i = new Image();
  i.onload = () => {
    const s = Math.min(1, 500 / Math.max(i.width, i.height)), c = h('canvas', { width: i.width * s, height: i.height * s });
    c.getContext('2d').drawImage(i, 0, 0, c.width, c.height); r(c.toDataURL('image/jpeg', .85));
  };
  i.src = URL.createObjectURL(f);
});

/* ---------- telas ---------- */
function renderGrid() {
  cur = null; const v = $('#view'); v.replaceChildren();
  if (!albums.length) {
    v.append(h('div', { className: 'empty' }, h('h2', { textContent: 'Nenhum álbum carregado' }),
      h('p', { textContent: location.protocol === 'file:'
        ? 'Abrindo o arquivo direto do disco, o navegador não pode listar as pastas. Rode "python -m http.server" na pasta do index.html e abra http://localhost:8000, ou use "Escolher pasta".'
        : 'Este servidor não retornou a listagem das subpastas. Ative a listagem de diretórios (ex.: "python -m http.server") ou use "Escolher pasta".' })));
    return;
  }
  const g = h('div', { className: 'grid' });
  albums.forEach(a => {
    const c = h('div', { className: 'cover' });
    setCover(c, a);
    g.append(h('div', { className: 'card', tabIndex: 0, onclick: () => renderAlbum(a), onkeydown: e => e.key === 'Enter' && renderAlbum(a) },
      c, h('b', { textContent: atitle(a) }),
      h('small', { textContent: `${M(a).artist || 'Artista não informado'} · ${a.tracks.length} faixa${a.tracks.length > 1 ? 's' : ''}` })));
  });
  v.append(g);
}
function renderAlbum(a) {
  cur = a; const v = $('#view'), ts = sorted(a);
  const cv = h('div', { className: 'cover' }); setCover(cv, a);
  const list = h('ol', { className: 'tracks' });
  ts.forEach((t, i) => list.append(h('li', { tabIndex: 0, onclick: () => playList(a, ts, i), onkeydown: e => e.key === 'Enter' && playList(a, ts, i) },
    h('span', { className: 'mut', textContent: i + 1 }),
    h('div', {}, h('b', { textContent: tname(a, t) }), h('small', { textContent: tartist(a, t) })),
    h('small', { className: 'mut', textContent: t.name.split('.').pop().toUpperCase() }))));
  list.querySelectorAll('li').forEach((li, i) => li.dataset.k = a.key + '|' + ts[i].name);
  v.replaceChildren(
    h('button', { textContent: '← Álbuns', onclick: renderGrid }),
    h('div', { className: 'head' }, cv, h('div', {},
      h('h2', { textContent: atitle(a) }),
      h('div', { className: 'mut', textContent: `${M(a).artist || 'Artista não informado'}${M(a).year ? ' · ' + M(a).year : ''}` }),
      h('div', { className: 'btns' },
        h('button', { className: 'pri', textContent: '▶ Tocar álbum', onclick: () => playList(a, ts, shuffle ? Math.floor(Math.random() * ts.length) : 0) }),
        h('button', { textContent: 'Cadastrar / editar', onclick: () => openEdit(a) })))),
    list);
  mark();
}
function mark() {
  const c = queue[qi];
  document.querySelectorAll('ol.tracks li').forEach(li => li.classList.toggle('on', !!c && li.dataset.k === c.a.key + '|' + c.t.name));
}

/* ---------- editor de cadastro ---------- */
function openEdit(a) {
  const m = M(a), d = $('#dlg'); let cover = m.cover;
  const rows = sorted(a).map(t => ({ t, title: m.tracks?.[t.name]?.title || '', artist: m.tracks?.[t.name]?.artist || '' }));
  const tt = h('input', { value: m.title || '', placeholder: a.folder.split('/').pop() });
  const ar = h('input', { value: m.artist || '', placeholder: 'Artista do álbum' });
  const yr = h('input', { value: m.year || '', placeholder: 'Ano', inputMode: 'numeric' });
  const cv = h('div', { className: 'cover' });
  const showCover = () => cover ? paint(cv, cover, a) : (paint(cv, null, a), urlOf(a.cover).then(u => u && paint(cv, u, a)));
  const file = h('input', { type: 'file', accept: 'image/*', hidden: true, onchange: async e => { if (e.target.files[0]) { cover = await resize(e.target.files[0]); showCover(); } } });
  const list = h('div', { className: 'rows' });
  const draw = () => list.replaceChildren(...rows.map((r, i) => {
    const mv = k => () => { const j = i + k; if (j < 0 || j >= rows.length) return; [rows[i], rows[j]] = [rows[j], rows[i]]; draw(); };
    return h('div', { className: 'row' }, h('span', { className: 'mut', textContent: i + 1 }),
      h('input', { value: r.title, placeholder: base(r.t.name), title: r.t.name, oninput: e => r.title = e.target.value }),
      h('input', { value: r.artist, placeholder: 'Artista da faixa', oninput: e => r.artist = e.target.value }),
      h('button', { type: 'button', textContent: '↑', title: 'Subir', onclick: mv(-1) }),
      h('button', { type: 'button', textContent: '↓', title: 'Descer', onclick: mv(1) }));
  }));
  showCover(); draw();
  d.replaceChildren(
    h('h3', { textContent: 'Cadastrar álbum' }),
    h('div', { className: 'f' }, cv, tt, ar, yr),
    h('div', { className: 'acts', style: 'justify-content:flex-start' },
      h('button', { textContent: 'Escolher capa', onclick: () => file.click() }), file,
      h('button', { textContent: 'Remover capa', onclick: () => { cover = undefined; showCover(); } })),
    h('h3', { textContent: 'Faixas (ordem, nome e artista)', style: 'font-size:16px;margin-top:18px' }), list,
    h('div', { className: 'acts' },
      h('button', { textContent: 'Cancelar', onclick: () => d.close() }),
      h('button', { className: 'pri', textContent: 'Salvar', onclick: () => {
        m.title = tt.value.trim() || undefined; m.artist = ar.value.trim() || undefined;
        m.year = yr.value.trim() || undefined; m.cover = cover || undefined;
        m.order = rows.map(r => r.t.name); m.tracks = {};
        rows.forEach(r => { const ti = r.title.trim(), ao = r.artist.trim(); if (ti || ao) m.tracks[r.t.name] = { title: ti || undefined, artist: ao || undefined }; });
        save(); d.close(); renderAlbum(a);
      } })));
  d.showModal();
}

/* ---------- player ---------- */
const fmt = s => isFinite(s) ? Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0') : '0:00';
let shuffle = false, repeat = 'off', hist = [], played = new Set();
try { const m = JSON.parse(localStorage.getItem('mp-modes') || '{}'); shuffle = !!m.shuffle; repeat = m.repeat || 'off'; } catch {}
function paintModes() {
  $('#shuf').classList.toggle('on', shuffle);
  $('#shuf').title = 'Aleatório: ' + (shuffle ? 'ligado' : 'desligado');
  const r = $('#rep'); r.classList.toggle('on', repeat !== 'off'); r.textContent = repeat === 'one' ? '↻1' : '↻';
  r.title = { off: 'Repetir: desligado', all: 'Repetir: álbum', one: 'Repetir: faixa' }[repeat];
  try { localStorage.setItem('mp-modes', JSON.stringify({ shuffle, repeat })); } catch {}
}
$('#shuf').onclick = () => { shuffle = !shuffle; paintModes(); };
$('#rep').onclick = () => { repeat = { off: 'all', all: 'one', one: 'off' }[repeat]; paintModes(); };
paintModes();
function playList(a, ts, i) { queue = ts.map(t => ({ a, t })); hist = []; played = new Set(); playAt(i); }
function nextIndex() {
  const n = queue.length;
  if (shuffle) {
    let pool = [...Array(n).keys()].filter(i => !played.has(i));
    if (!pool.length) {
      if (repeat === 'off') return -1;
      played = new Set([qi]); pool = [...Array(n).keys()].filter(i => i !== qi);
      if (!pool.length) return qi;
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }
  if (qi + 1 < n) return qi + 1;
  return repeat === 'all' ? 0 : -1;
}
function goNext() { const i = nextIndex(); if (i >= 0) playAt(i); }
function goPrev() {
  if (au.currentTime > 3) { au.currentTime = 0; return; }
  if (shuffle && hist.length > 1) { hist.pop(); played.delete(qi); playAt(hist.pop()); return; }
  if (qi > 0) playAt(qi - 1); else au.currentTime = 0;
}
async function playAt(i) {
  if (i < 0 || i >= queue.length) return;
  qi = i; hist.push(i); played.add(i); if (hist.length > 200) hist.shift();
  const { a, t } = queue[i];
  au.src = await urlOf(t); au.play().catch(() => {});
  const title = tname(a, t), artist = tartist(a, t);
  $('#npt').textContent = title; $('#npa').textContent = artist ? `${artist} — ${atitle(a)}` : atitle(a);
  setCover($('#npc'), a); mark();
  if ('mediaSession' in navigator) coverUrl(a).then(u => navigator.mediaSession.metadata =
    new MediaMetadata({ title, artist, album: atitle(a), artwork: u ? [{ src: u }] : [] }));
}
const toggle = () => au.src && (au.paused ? au.play() : au.pause());
$('#pp').onclick = toggle;
$('#prev').onclick = goPrev;
$('#next').onclick = goNext;
au.onplay = () => $('#pp').textContent = '⏸';
au.onpause = () => $('#pp').textContent = '▶';
au.onended = () => {
  if (repeat === 'one') { au.currentTime = 0; au.play(); return; }
  const i = nextIndex(); if (i >= 0) playAt(i); else $('#pp').textContent = '▶';
};
au.ontimeupdate = () => { $('#cur').textContent = fmt(au.currentTime); $('#seek').value = au.duration ? au.currentTime / au.duration * 1000 : 0; };
au.onloadedmetadata = () => $('#dur').textContent = fmt(au.duration);
$('#seek').oninput = e => au.duration && (au.currentTime = e.target.value / 1000 * au.duration);
$('#vol').oninput = e => au.volume = e.target.value;
if ('mediaSession' in navigator) {
  navigator.mediaSession.setActionHandler('previoustrack', goPrev);
  navigator.mediaSession.setActionHandler('nexttrack', goNext);
}
addEventListener('keydown', e => { if (e.code === 'Space' && !/INPUT|BUTTON|DIALOG/.test(document.activeElement.tagName)) { e.preventDefault(); toggle(); } });

/* ---------- carregar pasta / exportar / importar ---------- */
const idb = () => new Promise((res, rej) => { const r = indexedDB.open('mp', 1); r.onupgradeneeded = () => r.result.createObjectStore('k'); r.onsuccess = () => res(r.result); r.onerror = rej; });
const idbGet = async k => { const d = await idb(); return new Promise(r => { const q = d.transaction('k').objectStore('k').get(k); q.onsuccess = () => r(q.result); q.onerror = () => r(); }); };
const idbSet = async (k, v) => { const d = await idb(); d.transaction('k', 'readwrite').objectStore('k').put(v, k); };

$('#pick').onclick = async () => {
  if (!window.showDirectoryPicker) return $('#fallback').click();
  try { const dir = await showDirectoryPicker({ mode: 'read' }); idbSet('dir', dir); $('#reopen').hidden = true; build(await walk(dir)); }
  catch (e) { if (e.name !== 'AbortError') $('#fallback').click(); }
};
$('#fallback').onchange = e => build([...e.target.files].map(f => {
  const p = f.webkitRelativePath.split('/');
  return { album: p.slice(1, -1).join('/'), name: f.name, get: () => f };
}));
$('#exp').onclick = () => {
  const b = new Blob([JSON.stringify(meta, null, 2)], { type: 'application/json' });
  h('a', { href: URL.createObjectURL(b), download: 'biblioteca.json' }).click();
};
$('#imp').onchange = async e => {
  try { Object.assign(meta, JSON.parse(await e.target.files[0].text())); save(); albums.length ? renderGrid() : 0; }
  catch { alert('Arquivo JSON inválido.'); }
};

const applyTheme = t => {
  document.documentElement.dataset.theme = t;
  $('#theme').textContent = t === 'dark' ? '☀ Modo claro' : '🌙 Modo escuro';
  $('meta[name=theme-color]').content = t === 'dark' ? '#12141c' : '#e9ecf1';
};
$('#theme').onclick = () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('mp-theme', t); } catch {}
  applyTheme(t);
};
applyTheme(document.documentElement.dataset.theme || 'light');

(async () => {
  renderGrid();
  if (/^https?:/.test(location.protocol)) {            // servido por servidor com listagem de pastas
    try { const e = await scanHttp(); if (e.some(x => AUDIO.test(x.name))) return build(e); } catch {}
  }
  try {                                                  // pasta usada anteriormente
    const dir = await idbGet('dir'); if (!dir) return;
    if (await dir.queryPermission({ mode: 'read' }) === 'granted') return build(await walk(dir));
    const b = $('#reopen'); b.hidden = false; b.textContent = `Reabrir “${dir.name}”`;
    b.onclick = async () => { if (await dir.requestPermission({ mode: 'read' }) === 'granted') { b.hidden = true; build(await walk(dir)); } };
  } catch {}
})();
