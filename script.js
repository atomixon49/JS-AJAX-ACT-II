function normalizaTexto(s) {
  return s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '');
}

function esPalindromo(s) {
  const t = normalizaTexto(s);
  const r = t.split('').reverse().join('');
  return t.length > 0 && t === r;
}

function anim(el) {
  if (!el) return;
  el.classList.remove('animate-in');
  void el.offsetWidth;
  el.classList.add('animate-in');
}

function mayorDeDos(a, b) {
  const n1 = Number(a);
  const n2 = Number(b);
  if (Number.isNaN(n1) || Number.isNaN(n2)) return 'Introduce números válidos';
  if (n1 > n2) return `El mayor es A (${n1})`;
  if (n2 > n1) return `El mayor es B (${n2})`;
  return 'Son iguales';
}

function vocalesPresentes(frase) {
  const f = frase.toLowerCase();
  const m = new Map();
  for (const c of f) {
    if ('aeiouáéíóú'.includes(c)) {
      const base = c.normalize('NFD').replace(/\p{Diacritic}/gu, '');
      m.set(base, true);
    }
  }
  return Array.from(m.keys());
}

function conteoVocales(frase) {
  const f = frase.toLowerCase();
  const r = { a: 0, e: 0, i: 0, o: 0, u: 0 };
  for (const c of f) {
    if ('aeiouáéíóú'.includes(c)) {
      const base = c.normalize('NFD').replace(/\p{Diacritic}/gu, '');
      if (r[base] !== undefined) r[base]++;
    }
  }
  return r;
}

function estadoReady(n) {
  if (n === 0) return 'No iniciada';
  if (n === 1) return 'Cargando';
  if (n === 2) return 'Cabeceras recibidas';
  if (n === 3) return 'Descargando';
  if (n === 4) return 'Completada';
  return String(n);
}

function proxyUrl(u) {
  return 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u);
}

function manejarAjax(url, setEstado, setStatus, setHeaders, setContenido, useProxy) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'text';
  setEstado(`${estadoReady(xhr.readyState)}`);
  xhr.onreadystatechange = function () {
    setEstado(`${estadoReady(xhr.readyState)}`);
    if (xhr.readyState === 2) setHeaders(xhr.getAllResponseHeaders());
  };
  xhr.onprogress = function () {
    setEstado(`${estadoReady(xhr.readyState)}`);
  };
  xhr.onload = function () {
    setEstado(`${estadoReady(xhr.readyState)}`);
    setStatus(`${xhr.status} ${xhr.statusText}`);
    setHeaders(xhr.getAllResponseHeaders());
    setContenido(xhr.response);
  };
  xhr.onerror = function () {
    setEstado('Error');
    setStatus('Error de red o CORS');
    if (useProxy) {
      setEstado('Intentando vía proxy CORS');
      manejarAjax(
        proxyUrl(url),
        setEstado,
        setStatus,
        setHeaders,
        setContenido,
        false
      );
    }
  };
  xhr.ontimeout = function () {
    setEstado('Tiempo excedido');
  };
  xhr.send();
}

document.addEventListener('DOMContentLoaded', function () {
  const palCadena = document.getElementById('pal-cadena');
  const palBtn = document.getElementById('pal-btn');
  const palRes = document.getElementById('pal-res');
  palBtn.addEventListener('click', function () {
    const ok = esPalindromo(palCadena.value);
    palRes.classList.remove('success', 'error');
    palRes.textContent = ok ? 'Es palíndromo' : 'No es palíndromo';
    palRes.classList.add(ok ? 'success' : 'error');
    anim(palRes);
  });

  const a = document.getElementById('mayor-a');
  const b = document.getElementById('mayor-b');
  const mayorBtn = document.getElementById('mayor-btn');
  const mayorRes = document.getElementById('mayor-res');
  mayorBtn.addEventListener('click', function () {
    mayorRes.textContent = mayorDeDos(a.value, b.value);
    anim(mayorRes);
  });

  const vocFrase = document.getElementById('voc-frase');
  const vocBtn = document.getElementById('voc-btn');
  const vocRes = document.getElementById('voc-res');
  vocBtn.addEventListener('click', function () {
    const v = vocalesPresentes(vocFrase.value);
    vocRes.textContent = v.length ? v.join(', ') : 'No hay vocales';
    anim(vocRes);
  });

  const freqFrase = document.getElementById('freq-frase');
  const freqBtn = document.getElementById('freq-btn');
  const freqRes = document.getElementById('freq-res');
  freqBtn.addEventListener('click', function () {
    const c = conteoVocales(freqFrase.value);
    freqRes.textContent = `a:${c.a} e:${c.e} i:${c.i} o:${c.o} u:${c.u}`;
    anim(freqRes);
  });

  const ajaxUrl = document.getElementById('ajax-url');
  const ajaxBtn = document.getElementById('ajax-btn');
  const ajaxEstado = document.getElementById('ajax-estado');
  const ajaxHeaders = document.getElementById('ajax-headers');
  const ajaxStatus = document.getElementById('ajax-status');
  const ajaxContenidos = document.getElementById('ajax-contenidos');
  const ajaxProxy = document.getElementById('ajax-proxy');
  ajaxUrl.value = window.location.href;
  document.getElementById('ajax-fill').addEventListener('click', function (e) {
    e.preventDefault();
    ajaxUrl.value = 'https://atomixon49.github.io/QUINGDAO';
  });
  function liveSetter(el) {
    return function (t) { el.textContent = t; anim(el); };
  }
  ajaxBtn.addEventListener('click', function () {
    ajaxEstado.textContent = '';
    ajaxHeaders.textContent = '';
    ajaxStatus.textContent = '';
    ajaxContenidos.textContent = '';
    manejarAjax(
      ajaxUrl.value,
      liveSetter(ajaxEstado),
      liveSetter(ajaxStatus),
      liveSetter(ajaxHeaders),
      liveSetter(ajaxContenidos),
      !!ajaxProxy.checked
    );
  });
});