/* ===== Tokens ===== */
:root{
  --bg:#eef1f5;--bg2:#d9e8ec;--panel:#fff;--glass:rgba(255,255,255,.74);
  --ink:#12151d;--mut:#667085;--line:rgba(18,21,29,.09);--track:rgba(18,21,29,.14);
  --ac:#066674;--ac2:#0d93a6;--acink:#fff;--acsoft:rgba(6,102,116,.1);--field:#fff;
  --shadow:0 1px 2px rgba(16,24,40,.06),0 14px 34px -14px rgba(16,24,40,.22);
  color-scheme:light}
:root[data-theme=dark]{
  --bg:#0c0e14;--bg2:#15203a;--panel:#161922;--glass:rgba(22,25,34,.72);
  --ink:#eceef5;--mut:#9aa2b8;--line:rgba(255,255,255,.08);--track:rgba(255,255,255,.16);
  --ac:#7b93ff;--ac2:#a6b6ff;--acink:#0b1030;--acsoft:rgba(123,147,255,.15);--field:#0f1219;
  --shadow:0 1px 2px rgba(0,0,0,.4),0 18px 38px -16px rgba(0,0,0,.7);
  color-scheme:dark}

/* ===== Base ===== */
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
[hidden]{display:none!important}
html{scrollbar-color:var(--track) transparent}
body{margin:0;min-height:100dvh;color:var(--ink);padding-bottom:150px;
  font:15px/1.5 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased;
  background:radial-gradient(900px 520px at 0% -8%,var(--acsoft),transparent 62%),radial-gradient(800px 520px at 100% 0%,var(--bg2),transparent 58%),var(--bg);
  background-repeat:no-repeat}
::selection{background:var(--acsoft)}
h1,h2,h3{font-family:"Iowan Old Style",Palatino,Georgia,serif;font-weight:700;margin:0;letter-spacing:-.01em}
.mut{color:var(--mut)}

/* ===== Botões e campos ===== */
button{font:inherit;font-weight:500;color:var(--ink);background:var(--panel);border:1px solid var(--line);padding:8px 16px;border-radius:999px;cursor:pointer;
  transition:background .15s,border-color .15s,transform .1s,box-shadow .15s,filter .15s;touch-action:manipulation}
button:active{transform:scale(.96)}
button.pri{background:linear-gradient(135deg,var(--ac),var(--ac2));border-color:transparent;color:var(--acink);font-weight:600;box-shadow:0 8px 18px -8px var(--ac)}
button:focus-visible{outline:2px solid var(--ac);outline-offset:2px}
@media(hover:hover){button:hover{background:var(--acsoft);border-color:var(--ac)}button.pri:hover{background:linear-gradient(135deg,var(--ac),var(--ac2));filter:brightness(1.1)}}
input:not([type=range]){font:inherit;color:var(--ink);background:var(--field);border:1px solid var(--line);border-radius:12px;padding:9px 12px;min-width:0;transition:border-color .15s,box-shadow .15s}
input:not([type=range]):focus{outline:none;border-color:var(--ac);box-shadow:0 0 0 4px var(--acsoft)}
input::placeholder{color:var(--mut);opacity:.8}

input[type=range]{-webkit-appearance:none;appearance:none;background:transparent;height:20px;padding:0;margin:0;border:0;cursor:pointer;--p:0%}
input[type=range]::-webkit-slider-runnable-track{height:5px;border-radius:99px;background:linear-gradient(var(--ac),var(--ac)) 0 0/var(--p) 100% no-repeat,var(--track)}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;margin-top:-4.5px;border-radius:50%;background:#fff;border:3px solid var(--ac);box-shadow:0 2px 6px rgba(0,0,0,.3);transition:transform .12s}
input[type=range]::-moz-range-track{height:5px;border-radius:99px;background:var(--track)}
input[type=range]::-moz-range-progress{height:5px;border-radius:99px;background:var(--ac)}
input[type=range]::-moz-range-thumb{width:8px;height:8px;border-radius:50%;background:#fff;border:3px solid var(--ac);box-shadow:0 2px 6px rgba(0,0,0,.3)}
@media(hover:hover){input[type=range]:hover::-webkit-slider-thumb{transform:scale(1.25)}}
input[type=range]:focus-visible{outline:none}
input[type=range]:focus-visible::-webkit-slider-thumb{box-shadow:0 0 0 4px var(--acsoft)}

/* ===== Cabeçalho ===== */
header{position:sticky;top:0;z-index:20;display:flex;gap:8px;align-items:center;flex-wrap:wrap;
  padding:calc(14px + env(safe-area-inset-top)) max(24px,calc((100% - 1100px)/2)) 14px;
  background:var(--glass);-webkit-backdrop-filter:blur(16px) saturate(1.5);backdrop-filter:blur(16px) saturate(1.5);border-bottom:1px solid var(--line)}
header h1{font-size:24px;margin-right:auto;display:flex;align-items:center}
header h1::before{content:"♪";display:inline-grid;place-items:center;width:34px;height:34px;margin-right:12px;border-radius:11px;
  background:linear-gradient(135deg,var(--ac),var(--ac2));color:var(--acink);font:700 18px system-ui;box-shadow:0 8px 18px -8px var(--ac)}
header button{font-size:13.5px;padding:7px 14px}
main{max-width:1100px;margin:0 auto;padding:28px 24px}

/* ===== Capas ===== */
.cover{aspect-ratio:1;width:100%;display:grid;place-items:center;border-radius:16px;
  background:linear-gradient(135deg,rgba(255,255,255,.24),rgba(0,0,0,.2)) center/contain no-repeat;background-color:var(--track);
  font:700 56px Georgia,serif;color:rgba(255,255,255,.88);text-shadow:0 2px 10px rgba(0,0,0,.25);box-shadow:var(--shadow)}
.cover.sm{width:52px;font-size:22px;flex:none;border-radius:12px;box-shadow:0 4px 12px -4px rgba(0,0,0,.35)}

/* ===== Grade de álbuns ===== */
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:20px}
.card{cursor:pointer;padding:10px;border-radius:20px;background:var(--panel);border:1px solid var(--line);transition:transform .2s,box-shadow .2s,border-color .2s}
.card .cover{border-radius:14px;box-shadow:0 8px 20px -10px rgba(0,0,0,.4)}
.card b{display:block;margin-top:10px;padding:0 4px;font-weight:600;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.card small{display:block;padding:0 4px 4px;color:var(--mut);font-size:12.5px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.card:focus-visible{outline:2px solid var(--ac);outline-offset:2px}
@media(hover:hover){.card:hover{transform:translateY(-5px);box-shadow:var(--shadow);border-color:var(--ac)}}

/* ===== Álbum aberto ===== */
.head{display:flex;gap:28px;align-items:flex-end;flex-wrap:wrap;margin:20px 0 26px}
.head .cover{width:220px;border-radius:22px}
.head h2{font-size:42px;line-height:1.05}
.head .btns{display:flex;gap:8px;margin-top:18px;flex-wrap:wrap}
ol.tracks{list-style:none;margin:0;padding:6px;background:var(--panel);border:1px solid var(--line);border-radius:22px;box-shadow:var(--shadow)}
ol.tracks li{display:grid;grid-template-columns:40px 1fr auto;gap:12px;align-items:center;padding:10px 14px 10px 8px;border-radius:14px;cursor:pointer;transition:background .15s}
ol.tracks li>span:first-child{text-align:center;font-variant-numeric:tabular-nums}
ol.tracks b{font-weight:600}
ol.tracks div small{display:block;color:var(--mut);font-size:12.5px}
ol.tracks li>small{font-size:13px;color:var(--mut)}
ol.tracks li:focus-visible{outline:2px solid var(--ac);outline-offset:-2px}
@media(hover:hover){ol.tracks li:hover{background:var(--acsoft)}}
ol.tracks li.on{background:var(--acsoft)}
ol.tracks li.on b{color:var(--ac)}
ol.tracks li.on>span:first-child{font-size:0}
ol.tracks li.on>span:first-child::after{content:"";display:inline-block;width:14px;height:14px;vertical-align:middle;animation:eq 1s ease-in-out infinite;
  background:linear-gradient(var(--ac),var(--ac)) 0 100%/3px 40% no-repeat,linear-gradient(var(--ac),var(--ac)) 50% 100%/3px 90% no-repeat,linear-gradient(var(--ac),var(--ac)) 100% 100%/3px 60% no-repeat}
@keyframes eq{0%,100%{background-size:3px 30%,3px 90%,3px 55%}33%{background-size:3px 85%,3px 40%,3px 100%}66%{background-size:3px 45%,3px 100%,3px 30%}}

.empty{max-width:520px;margin:12vh auto;text-align:center;padding:38px 28px;border:1px dashed var(--track);border-radius:26px;background:var(--glass)}
.empty h2{margin-bottom:8px}
.empty p{color:var(--mut);margin:0}

/* ===== Player ===== */
#bar{position:fixed;z-index:30;left:50%;transform:translateX(-50%);bottom:calc(14px + env(safe-area-inset-bottom));width:min(1100px,calc(100% - 28px));
  display:flex;gap:18px;align-items:center;flex-wrap:wrap;padding:10px 18px;border-radius:24px;
  background:var(--glass);-webkit-backdrop-filter:blur(20px) saturate(1.6);backdrop-filter:blur(20px) saturate(1.6);
  border:1px solid var(--line);box-shadow:var(--shadow),0 20px 50px -20px rgba(0,0,0,.35)}
.np{display:flex;gap:12px;align-items:center;width:270px;min-width:0}
.np div{min-width:0}
.np b,.np small{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.np b{font-weight:600}
.np small{color:var(--mut);font-size:12.5px}
.ctl,.modes{display:flex;gap:6px;align-items:center}
.ctl button,.modes button{width:42px;height:42px;padding:0;border-radius:50%;display:grid;place-items:center;font-size:16px;line-height:1}
.ctl button#pp{width:50px;height:50px;font-size:18px}
.modes button.on{background:var(--ac);border-color:var(--ac);color:var(--acink)}
.seek{display:flex;gap:10px;align-items:center;flex:1;min-width:220px;font-size:12px;font-variant-numeric:tabular-nums;color:var(--mut)}
.seek input{flex:1}
#vol{width:96px}

/* ===== Editor ===== */
dialog{border:1px solid var(--line);border-radius:26px;background:var(--panel);color:var(--ink);width:min(760px,94vw);max-height:90vh;padding:24px;box-shadow:0 30px 80px -20px rgba(0,0,0,.55)}
dialog[open]{animation:pop .22s ease}
dialog::backdrop{background:rgba(8,10,16,.55);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}
@keyframes pop{from{opacity:0;transform:translateY(10px) scale(.98)}}
.f{display:grid;grid-template-columns:100px 1fr;gap:8px 14px;align-items:center;margin:16px 0}
.f .cover{grid-row:span 3;width:100px;font-size:36px;border-radius:16px}
.rows{display:grid;gap:8px;margin:12px 0 18px}
.row{display:grid;grid-template-columns:28px 1fr 1fr auto auto;gap:6px;align-items:center}
.row button{padding:6px 11px;border-radius:10px}
.acts{display:flex;gap:8px;justify-content:flex-end}

/* ===== Toque ===== */
@media(pointer:coarse){button{min-height:44px;min-width:44px}input[type=range]{height:30px}ol.tracks li{min-height:58px}}
@media(prefers-reduced-motion:reduce){*,::before,::after{animation:none!important;transition:none!important}}

/* ===== Celular ===== */
@media(max-width:700px){
  body{padding-bottom:calc(150px + env(safe-area-inset-bottom))}
  header{position:static;padding:calc(12px + env(safe-area-inset-top)) 14px 12px;gap:6px}
  header h1{font-size:21px;width:100%}
  header button{flex:1 1 auto;padding:8px 10px;font-size:13px}
  main{padding:16px 14px}
  .grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
  .card{padding:8px;border-radius:18px}
  .head{flex-wrap:nowrap;align-items:center;gap:14px;margin:12px 0 16px}
  .head .cover{width:104px;flex:none;font-size:36px;border-radius:16px}
  .head>div:last-child{flex:1;min-width:0}
  .head h2{font-size:24px;overflow-wrap:anywhere}
  .head .btns{margin-top:10px;gap:6px}
  .head .btns button{flex:1 1 auto;padding:8px 10px}
  ol.tracks{padding:4px;border-radius:18px}
  ol.tracks li{grid-template-columns:30px 1fr auto;padding:8px 8px 8px 4px}
  input:not([type=range]){font-size:16px}
  #bar{display:grid;grid-template-columns:1fr auto;grid-template-areas:"np ctl" "seek modes";gap:6px 12px;width:calc(100% - 16px);bottom:calc(8px + env(safe-area-inset-bottom));padding:10px 12px;border-radius:22px}
  .np{grid-area:np;width:auto}
  .ctl{grid-area:ctl}
  .seek{grid-area:seek;min-width:0}
  .modes{grid-area:modes}
  #vol{display:none}
  dialog{width:100vw;max-width:100vw;height:100dvh;max-height:100dvh;margin:0;border-radius:0;border:0;padding:16px 16px 0}
  .f{grid-template-columns:80px 1fr}
  .f .cover{width:80px;font-size:30px}
  .row{grid-template-columns:24px 1fr 44px 44px}
  .row>:nth-child(1){grid-row:1/3;align-self:start;padding-top:10px}
  .row>:nth-child(2){grid-column:2;grid-row:1}
  .row>:nth-child(3){grid-column:2/-1;grid-row:2}
  .row>:nth-child(4){grid-column:3;grid-row:1}
  .row>:nth-child(5){grid-column:4;grid-row:1}
  .rows{gap:12px}
  dialog .acts:last-child{position:sticky;bottom:0;background:var(--panel);padding:10px 0 calc(10px + env(safe-area-inset-bottom));border-top:1px solid var(--line)}
}