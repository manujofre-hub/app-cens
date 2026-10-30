/* ===== INICIO MÓDULO MOTOR v1 =====
   Motor de clases en diapositivas: lista de temas -> diapositivas -> actividad -> registro del progreso.
   USO: pegar DENTRO del <script> de la app, DESPUÉS de alumno.js y progreso.js y antes del código propio.
   Global que crea: Motor (no usar ese nombre en la app). Inyecta sus propios estilos (clases mo-*).
   API:
     const M = Motor.crear({app, el, img, ic, titulo, sub, temas, bot, hablar, pg, estado});
        app    appId para Progreso (ej. 'teoria-tic-2')
        el     elemento donde se dibuja todo (la ventana principal)
        img    carpeta de imágenes (ej. '../imagenes/teoria-tic-2/'); cada imagen es <nombre>.webp
        ic     objeto de iconos SVG de respaldo (si falta la imagen se ve el icono)
        bot(html)  mensaje de ManuBot · hablar(texto)  lee un texto en voz alta
        pg(texto)  texto de progreso · estado(modo)  'menu' | 'slide' | 'act' | 'fin'
        temas  [{id:'a02', t:'Título', min:8, ico:'mouse', opt:true, soon:true,
                 diap:[{t, txt, img, ic, alt, partes:[[nombre,desc]], pasos:[texto], tec, cur, bot}],
                 act:ctx=>{...}}]
        ctx de la actividad: {el, bot, pg, err(), fin({omitido,res}), obj(fn), quiz(preguntas)}
           preguntas: [[texto, [opciones], indiceCorrecto, explicacion]]
     M.menu()  vuelve a la lista · M.obj()  elemento que marca el círculo rojo
   Registro: al terminar una actividad llama Progreso.registrar(app, id, {estado:'hecha', estrellas, errores, seg}).
   ===================================================================== */
const Motor=(()=>{
 const CSS=`.mo-menu,.mo-sl,.mo-fn,.mo-q{width:100%;max-width:68em;margin:auto;background:rgba(8,18,34,.93);border:1px solid #4ade8044;border-radius:1em;padding:1em 1.2em}.mo-menu h2{font-size:1.5em}.mo-menu p{opacity:.85;margin:.2em 0 .6em}
.mo-bar{height:.7em;background:#1e293b;border-radius:1em;overflow:hidden;margin:.4em 0 .8em}.mo-bar i{display:block;height:100%;background:#22c55e;transition:.4s}
.mo-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(17em,1fr));gap:.7em}
.mo-it{display:flex;align-items:center;gap:.7em;text-align:left;background:#13233b;color:#fff;border:2px solid #4ade8077;border-radius:.8em;padding:.6em .8em;font:inherit;cursor:pointer}.mo-it:hover{background:#1c3556}
.mo-it.soon{opacity:.45;cursor:default}.mo-it.opt{border-style:dashed}.mo-ic{width:2.6em;height:2.6em;flex:none}.mo-ic svg{width:100%;height:100%}.mo-tt{flex:1;display:flex;flex-direction:column}.mo-tt small{opacity:.8}.mo-ok{font-size:1.4em}
.mo-hd small{opacity:.8}.mo-hd h2{font-size:1.6em;margin:.1em 0 .4em}
.mo-bd{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,6fr);gap:1.2em;align-items:start}@media(max-width:820px){.mo-bd{grid-template-columns:1fr}}
.mo-im{position:relative;aspect-ratio:4/3;background:#0d2236;border:2px solid #4ade8066;border-radius:.8em;overflow:hidden;cursor:zoom-in;display:flex;align-items:center;justify-content:center}
.mo-fb{width:60%;height:60%}.mo-fb svg{width:100%;height:100%}.mo-im img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.mo-tx{font-size:1.08em;line-height:1.55;text-align:left}.mo-tx p{margin:0 0 .6em}.mo-tx table{border-collapse:collapse;width:100%;font-size:.92em}.mo-tx td,.mo-tx th{border:1px solid #4ade8066;padding:.3em .5em;text-align:left}.mo-tx th{background:#13233b}
.mo-ch{display:flex;flex-wrap:wrap;gap:.4em;margin:.3em 0}.mo-pt{background:#16263f;color:#fff;border:2px solid #4ade80;border-radius:.5em;padding:.35em .8em;font:inherit;font-weight:700;cursor:pointer}.mo-pt.on{border-color:#facc15}
.mo-pd{background:#0d2236;border-left:3px solid #facc15;padding:.5em .7em;border-radius:.3em;min-height:2.6em;margin-bottom:.6em}
.mo-ps{list-style:none;padding:0;margin:.4em 0;counter-reset:s}.mo-ps li{counter-increment:s;display:flex;gap:.6em;align-items:flex-start;margin:.35em 0}.mo-ps li:before{content:counter(s);flex:none;width:1.8em;height:1.8em;border-radius:50%;background:#22c55e;color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center}
.mo-cu{background:#2a3a1a;border:1px solid #facc15aa;border-radius:.5em;padding:.5em .7em;margin-top:.6em;font-size:.95em}
.mo-nv{display:flex;align-items:center;justify-content:space-between;gap:.6em;flex-wrap:wrap;margin-top:1em}.mo-dots{display:flex;gap:.35em}.mo-dots i{width:.7em;height:.7em;border-radius:50%;background:#334155}.mo-dots i.on{background:#22c55e}
.mo-fn{text-align:center}.mo-big{font-size:4em}.mo-fn .row{margin-top:.8em}
.mo-q h2{font-size:1.4em;margin:.3em 0 .8em}.mo-ops{display:flex;flex-direction:column;gap:.6em;max-width:30em;margin:auto}
#mo-zoom{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;cursor:zoom-out}#mo-zoom img{max-width:96vw;max-height:94vh}`;
 function crear(c){
  if(!document.getElementById('mo-css')){const s=document.createElement('style');s.id='mo-css';s.textContent=CSS;document.head.appendChild(s)}
  const el=c.el,T=c.temas,api={obj:()=>null};let ti=0,k=0,E=0,t0=0,modo='menu',tk=0;
  const est=m=>{modo=m;if(c.estado)c.estado(m)},pg=t=>{if(c.pg)c.pg(t)},hecho=t=>!!t.id&&Progreso.hecha(c.app,t.id),ic=n=>(c.ic&&c.ic[n])||'';
  function menu(){tk++;est('menu');api.obj=()=>null;const cu=T.filter(t=>!t.opt),h=cu.filter(hecho).length;pg(h+' de '+cu.length+' temas completos');
   el.innerHTML=`<div class=mo-menu><h2>${c.titulo}</h2><p>${c.sub||''}</p><div class=mo-bar><i style="width:${Math.round(h/cu.length*100)}%"></i></div><div class=mo-list>${T.map((t,i)=>`<button class="mo-it ${t.soon?'soon':''} ${t.opt?'opt':''}" data-i=${i}><span class=mo-ic>${ic(t.ico)}</span><span class=mo-tt><b>${t.t}</b><small>${t.soon?'Próximamente':'≈ '+t.min+' min'+(t.opt?' · opcional':'')}</small></span><span class=mo-ok>${hecho(t)?'✅':''}</span></button>`).join('')}</div></div>`;
   el.onclick=e=>{const b=e.target.closest('.mo-it');if(b&&!b.classList.contains('soon'))abrir(+b.dataset.i)};
   c.bot('¡Hola {n}! Elegí el tema que quieras. Te sugiero ir en orden, pero podés empezar por donde prefieras.')}
  function abrir(i){tk++;ti=i;k=0;E=0;t0=Date.now();T[i].diap&&T[i].diap.length?slide(0):actividad()}
  function slide(j){k=j;est('slide');const t=T[ti],d=t.diap[j],n=t.diap.length;pg(t.t+' · diapositiva '+(j+1)+' de '+n);
   const im=`<div class=mo-fb>${ic(d.ic)}</div>${d.img?`<img src="${c.img+d.img}.webp" alt="${(d.alt||d.t).replace(/"/g,'')}" onerror="this.style.display='none'">`:''}`;
   el.innerHTML=`<div class=mo-sl><div class=mo-hd><small>${t.t} · diapositiva ${j+1} de ${n}</small><h2>${d.t}</h2></div><div class=mo-bd><div class=mo-im>${im}</div><div class=mo-tx>${d.txt||''}${d.partes?`<div class=mo-ch>${d.partes.map((p,x)=>`<button class=mo-pt data-p=${x}>${p[0]}</button>`).join('')}</div><div class=mo-pd id=mo-pd>Tocá cada parte para conocerla 👆</div>`:''}${d.pasos?`<ol class=mo-ps>${d.pasos.map(p=>`<li><span>${p}</span></li>`).join('')}</ol>`:''}${d.tec?`<div class=tc><b>🔧 Técnicamente</b><br>${d.tec}</div>`:''}${d.cur?`<div class=mo-cu>💡 <b>Dato curioso:</b> ${d.cur}</div>`:''}</div></div><div class=mo-nv><button class=btn id=mo-pr ${j?'':'disabled'}>◀ Anterior</button><button class=btn id=mo-lee>🔊 Leer</button><span class=mo-dots>${Array.from({length:n},(_,x)=>`<i class="${x==j?'on':''}"></i>`).join('')}</span><button class="btn go" id=mo-sg>${j<n-1?'Siguiente ▶':(t.act?'Ir a la actividad ▶':'Terminar ▶')}</button></div></div>`;
   api.obj=()=>el.querySelector('.mo-pt:not(.on)')||el.querySelector('#mo-sg');c.bot(d.bot||'Leé con calma. Cuando termines, tocá Siguiente.');
   el.onclick=e=>{const q=s=>e.target.closest(s);let b;
    if(b=q('.mo-pt')){const p=d.partes[+b.dataset.p];b.classList.add('on');el.querySelector('#mo-pd').innerHTML='<b>'+p[0]+':</b> '+p[1];c.bot(p[0]+'. '+p[1])}
    else if(q('#mo-sg'))sig();else if(q('#mo-pr'))ant();else if(q('#mo-lee')){if(c.hablar)c.hablar(el.querySelector('.mo-tx').innerText)}
    else if(q('.mo-im'))zoom(el.querySelector('.mo-im img'))};
   if(el.scrollTo)el.scrollTo(0,0)}
  const sig=()=>{const t=T[ti];if(k<t.diap.length-1)slide(k+1);else if(t.act)actividad();else cerrar({})},ant=()=>{if(k>0)slide(k-1)};
  function zoom(i){if(!i||i.style.display=='none')return;const z=document.createElement('div');z.id='mo-zoom';z.innerHTML='<img src="'+i.src+'" alt="">';z.onclick=()=>z.remove();document.body.appendChild(z)}
  function actividad(){const t=T[ti],g=++tk;est('act');el.onclick=null;el.onpointerdown=null;el.innerHTML='';api.obj=()=>null;
   const ctx={el,bot:c.bot,pg,err:()=>{E++},fin:o=>{if(g===tk)cerrar(o)},obj:f=>{api.obj=f},quiz:Q=>quiz(Q,g)};t.act(ctx)}
  function quiz(Q,g){let q=0,lk=0;const sh=()=>{lk=0;pg('Pregunta '+(q+1)+' de '+Q.length);el.innerHTML=`<div class=mo-q><small>Pregunta ${q+1} de ${Q.length}</small><h2>${Q[q][0]}</h2><div class=mo-ops>${Q[q][1].map((o,j)=>`<button class=btn data-q=${j}>${o}</button>`).join('')}</div></div>`};
   el.onclick=e=>{const b=e.target.closest('[data-q]');if(!b||lk)return;if(+b.dataset.q==Q[q][2]){lk=1;c.bot('✅ ¡Correcto! '+Q[q][3]);q++;setTimeout(()=>{if(g!==tk)return;if(q<Q.length)sh();else cerrar({})},2400)}else{E++;c.bot('¡Casi! Probá otra vez.')}};sh()}
  function cerrar(o){o=o||{};est('fin');const t=T[ti],seg=Math.round((Date.now()-t0)/1000),st=o.omitido?1:(E==0?3:E<=3?2:1);
   if(t.id)Progreso.registrar(c.app,t.id,{estado:'hecha',estrellas:st,errores:E,seg});pg(t.t+' · completado');api.obj=()=>null;
   el.innerHTML=`<div class=mo-fn><div class=mo-big>${o.omitido?'⏭️':'🎉'}</div><h2>${o.omitido?'Práctica omitida':'¡Tema completado!'}</h2><p>${t.t}</p><p style="font-size:1.4em">${'⭐'.repeat(st)}${'☆'.repeat(3-st)} · ${E} ${E==1?'error':'errores'}</p>${o.res?`<p>${o.res}</p>`:''}<div class=row><button class=btn data-a=rep>↻ Continuar ejercitando</button><button class=btn data-a=lst>📋 Lista de temas</button><button class=btn data-a=ini>🏠 Volver al inicio</button></div></div>`;
   el.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;if(b.dataset.a=='rep'){E=0;t0=Date.now();actividad()}else if(b.dataset.a=='lst')menu();else Alumno.irInicio()};
   c.bot(o.omitido?'Está bien, {n}. Dejé el tema como hecho, con una estrella. Podés volver cuando tengas el dispositivo.':'¡Muy bien, {n}! Completaste este tema.')}
  addEventListener('keydown',e=>{if(modo!='slide'||/INPUT|TEXTAREA/.test(e.target.tagName))return;if(e.key=='ArrowRight')sig();else if(e.key=='ArrowLeft')ant()});
  return{menu,obj:()=>api.obj()}}
 return{crear}})();
/* ===== FIN MÓDULO MOTOR v1 ===== */
