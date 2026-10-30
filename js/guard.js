/* 🔒 COMPATIBILIDAD GITHUB PAGES — NO MODIFICAR */
(function(){
  try{
    if(location.pathname.indexOf('index.html')!==-1 || location.pathname.charAt(location.pathname.length-1)==='/') return;
    var al = null;
    try{
      var q = location.search;
      if(q && q.indexOf('alumno=')!==-1){
        var m = q.match(/[?&]alumno=([^&]+)/);
        if(m){ al = decodeURIComponent(m[1].replace(/\+/g,' ')); }
      }
    }catch(e){}
    if(al){
      try{
        var d = {nombre: al, curso:'', id: al.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''), creado: new Date().toISOString()};
        localStorage.setItem('mj:alumno', JSON.stringify(d));
      }catch(e){}
    }
    try{
      if(!localStorage.getItem('mj:alumno') && window.name && window.name.indexOf('mj:')===0){
        var d2 = JSON.parse(window.name.slice(3));
        if(d2 && d2.nombre){ localStorage.setItem('mj:alumno', JSON.stringify(d2)); }
      }
      if(localStorage.getItem('mj:alumno') && (!window.name || window.name.indexOf('mj:')!==0)){
        window.name = 'mj:' + localStorage.getItem('mj:alumno');
      }
    }catch(e){}
    try{ localStorage.setItem('mj:last', JSON.stringify({url: location.href, ts: Date.now()})); }catch(e){}
    try{
      var a = JSON.parse(localStorage.getItem('mj:alumno')||'null');
      if(!a || !a.nombre){
        if(location.protocol !== 'file:'){
          location.replace('../../index.html');
        } else {
          alert('DEBUG guard.js: no alumno. URL=' + location.href + ' | localStorage=' + localStorage.getItem('mj:alumno') + ' | window.name=' + window.name);
        }
      }
    }catch(e){
      if(location.protocol !== 'file:'){
        location.replace('../../index.html');
      } else {
        alert('DEBUG guard.js ERROR: ' + e.message);
      }
    }
  }catch(e){}
})();