/**
 * ProRevest Color Selector — v11.0 (intenção de cor → backend)
 *
 * Não mexe na variação COR do VendaERP (placeholder fixo cor_prorevest).
 * A cor real escolhida é enviada ao backend ProRevest (POST /api/vendaerp/intencao-cor),
 * que casa com o pedido de e-commerce e grava a cor no item/observação do pedido no ERP.
 */
(function () {
  'use strict';

  // ─── CONFIGURAÇÃO ───────────────────────────────────────────────
  var CONFIG = {
    apiBaseUrl: 'https://prorevesttintas.com.br/api',
    defaultLimit: 400,
    perPage: 40,
    storageKey: 'prorevest_cor',
    debounceMs: 280,
    patchLimit: 50,         // máximo de elementos a patchear por ciclo
    patchInterval: 500,     // ms entre ciclos de polling
    patchMaxCycles: 30,     // máximo de ciclos
    checkoutPrefix: 'PROREVEST — COR:',
    widgetTitle: 'Escolha sua Cor ProRevest',
    loadingText: 'Carregando cores...',
    errorText: 'Erro ao carregar cores',
    badgeHtml: function (valor) {
      return '🎨 Cor selecionada: <strong>' + valor + '</strong>';
    }
  };

  var API_URL = (window.PROREVEST_API_URL || CONFIG.apiBaseUrl).replace(/\/+$/, '');
  var LIMIT = window.PROREVEST_LIMIT || CONFIG.defaultLimit;

  var allColors = [], filtered = [], page = 0, selected = null, searchTimer;
  var _debugEl = null;
  var _observer = null;

  // ─── DEBUG VISUAL ────────────────────────────────────────────────
  function debugShow(msg, color) {
    console.log('[ProRevest]', msg);
    if (!_debugEl) {
      _debugEl = document.createElement('div');
      _debugEl.id = 'pr-debug-bar';
      _debugEl.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;' +
        'background:' + (color || '#dc2626') + ';color:#fff;padding:8px 16px;' +
        'font-size:13px;font-family:monospace;text-align:center;';
      document.body.appendChild(_debugEl);
    } else {
      _debugEl.textContent = msg;
      _debugEl.style.background = color || '#dc2626';
    }
    setTimeout(function () { if (_debugEl) { _debugEl.remove(); _debugEl = null; } }, 6000);
  }

  // ─── DETECÇÃO DE PÁGINA ──────────────────────────────────────────
  function isProductPage() {
    return !!(document.getElementById('btnAddToCart') ||
              document.getElementById('btnAddToCartAndRedirect'));
  }

  function isCartPage() {
    var p = location.pathname.toLowerCase();
    return p.indexOf('carrinho') !== -1 || p.indexOf('cart') !== -1;
  }

  function isCheckoutPage() {
    var p = location.pathname.toLowerCase();
    return p.indexOf('checkout') !== -1 || p.indexOf('pedido') !== -1;
  }

  // ─── INSERÇÃO DO WIDGET ────────────────────────────────────────
  function getInsertionPoint() {
    var bg = document.querySelector('.bgDetails');
    if (bg) return { parent: bg, ref: null };
    var fallback = document.querySelector('[class*="detail"]') ||
                   document.querySelector('[class*="product"]') ||
                   document.querySelector('.bgAddToChart');
    if (fallback) return { parent: fallback, ref: null };
    return null;
  }

  // ─── PERSISTÊNCIA DA COR ─────────────────────────────────────────
  function saveColor(color) {
    var valor = color.name +
      (color.pro_revest_code ? ' | Cód: ' + color.pro_revest_code : '') +
      ' | ' + color.hex_code;

    var data = {
      name: color.name,
      code: color.pro_revest_code || '',
      hex: color.hex_code || '',
      category: color.category || '',
      valor: valor
    };

    selected = data;
    window._prColor = data;
    try { sessionStorage.setItem(CONFIG.storageKey, JSON.stringify(data)); } catch (e) {}

    debugShow('Cor selecionada: ' + color.name + ' (' + color.hex_code + ') ✓', '#059669');
    updateCartBadge();
  }

  function loadColor() {
    try {
      var raw = sessionStorage.getItem(CONFIG.storageKey);
      if (raw) {
        var data = JSON.parse(raw);
        selected = data;
        window._prColor = data;
        debugShow('Cor restaurada: ' + data.name + ' ✓', '#059669');
        return true;
      }
    } catch (e) {}
    return false;
  }

  // ─── CAPTURA DO PRODUTO + INTENÇÃO DE COR (Fase 1) ─────────────
  var produtoCodigo = '';
  var produtoNome = '';

  function getSessionId() {
    try {
      var k = 'pr_sid';
      var s = sessionStorage.getItem(k);
      if (!s) {
        s = 'sid_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        sessionStorage.setItem(k, s);
      }
      return s;
    } catch (e) { return ''; }
  }

  // Tenta descobrir o código do produto na página (ex.: "Ref: 316-1")
  function captureProduct() {
    try {
      var txt = document.body.innerText || document.body.textContent || '';
      var m = txt.match(/Ref(?:er[eê]ncia)?\.?\s*[:\-]?\s*([0-9A-Za-z][0-9A-Za-z\-\/.]*)/i);
      if (m) produtoCodigo = m[1].trim();
    } catch (e) {}
    if (!produtoCodigo) {
      var el = document.querySelector('[data-product-code],[data-codigo],[data-id-produto],[data-product-id]');
      if (el) {
        produtoCodigo = (el.getAttribute('data-product-code') || el.getAttribute('data-codigo') ||
          el.getAttribute('data-id-produto') || el.getAttribute('data-product-id') || '').trim();
      }
    }
    var h1 = document.querySelector('h1, h2, .product-title, [class*="title"]');
    if (h1) produtoNome = (h1.textContent || '').trim();
    debugLog('Produto capturado: codigo="' + produtoCodigo + '" nome="' + produtoNome + '"');
  }

  // Envia a cor escolhida ao backend ProRevest (vira "intenção" pra casar com o pedido)
  function enviarIntencao() {
    var c = selected;
    if (!c) return;
    var payload = {
      produto: produtoCodigo || '',
      produto_nome: produtoNome || '',
      cor: c.name || '',
      hex: c.hex || '',
      codigo: c.code || '',
      colecao: c.category || '',
      valor: c.valor || '',
      session_id: getSessionId()
    };
    try {
      fetch(API_URL + '/vendaerp/intencao-cor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).then(function (r) { debugLog('Intenção enviada: HTTP ' + r.status); })
        .catch(function (e) { debugLog('Falha ao enviar intenção: ' + e.message); });
    } catch (e) { debugLog('Erro enviarIntencao: ' + e.message); }
  }

  // Gancho no "Adicionar ao Carrinho" / "Comprar" pra reforçar a intenção no clique
  function hookAddToCart() {
    var triggers = document.querySelectorAll('#btnAddToCart, #btnAddToCartAndRedirect, button, a, input[type=submit], input[type=button]');
    [].forEach.call(triggers, function (b) {
      if (b.getAttribute('data-pr-hooked')) return;
      var t = ((b.id || '') + ' ' + (b.textContent || '') + ' ' + (b.className || '')).toLowerCase();
      if (/carrinho|comprar|adicionar|cart/.test(t)) {
        b.setAttribute('data-pr-hooked', '1');
        b.addEventListener('click', function () { enviarIntencao(); }, false);
      }
    });
  }

  // ─── CHECKOUT: OBSERVAÇÃO ──────────────────────────────────────
  function fillCheckoutObservation() {
    var color = window._prColor;
    if (!color) return;

    var text = CONFIG.checkoutPrefix + ' ' + color.valor;
    var textareas = document.querySelectorAll('textarea');
    for (var i = 0; i < textareas.length; i++) {
      var ta = textareas[i];
      var val = (ta.value || '').trim();
      if (val.indexOf(CONFIG.checkoutPrefix.split(' ')[0]) === -1) {
        ta.value = val ? val + '\n' + text : text;
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        ta.dispatchEvent(new Event('change', { bubbles: true }));
        debugShow('Observação de cor preenchida no checkout');
        break;
      }
    }
  }

  // ─── VISUALIZAR COR NO CARRINHO/CHECKOUT ────────────────────────
  // Patch seletivo: busca em seletores específicos primeiro.
  // Só cai no querySelectorAll('*') como último recurso.
  function patchCartCheckoutDOM() {
    var color = window._prColor;
    if (!color || !color.valor) return;

    var patched = tryPatchCorAttribute(color.valor);

    if (!patched) {
      tryInsertColorInProductCard(color.valor, color.hex);
    }
  }

  function tryPatchCorAttribute(valor) {
    var targets = document.querySelectorAll('p, td, span, div, li, label');
    var count = 0;
    for (var i = 0; i < targets.length && count < CONFIG.patchLimit; i++) {
      var el = targets[i];
      if (el.children.length > 0) continue;
      var text = el.textContent.trim();

      if ((text === 'COR' || text === 'cor_prorevest') && !el.getAttribute('data-pr-patched')) {
        el.setAttribute('data-pr-patched', '1');
        count++;
        var parent = el.parentElement;
        if (parent) {
          if (parent.tagName === 'P') {
            parent.textContent = 'COR ' + valor;
          } else {
            var next = parent.nextElementSibling || parent.nextSibling;
            if (next) {
              if (next.nodeType === 3) {
                next.textContent = ' ' + valor;
              } else {
                next.textContent = valor;
              }
            }
          }
        }
        debugLog('COR patcheada: ' + valor);
        return true;
      }
    }
    return false;
  }

  function tryInsertColorInProductCard(valor, hex) {
    if (document.getElementById('pr-color-badge')) return;

    var cardEl = findProductCard();
    if (!cardEl) {
      debugLog('Card do produto não encontrado');
      return;
    }

    var badge = document.createElement('div');
    badge.id = 'pr-color-badge';
    badge.style.cssText =
      'display:flex;align-items:center;gap:8px;padding:6px 12px;' +
      'background:#fffbeb;border:1px solid #fbbf24;border-radius:6px;' +
      'margin:6px 0;font-size:12px;color:#92400e;font-family:inherit;';

    var swatch = document.createElement('span');
    swatch.style.cssText =
      'display:inline-block;width:16px;height:16px;border-radius:50%;' +
      'background:' + (hex || '#ccc') + ';border:1px solid rgba(0,0,0,.1);flex-shrink:0;';

    var text = document.createElement('span');
    text.innerHTML = '🎨 Cor: <strong>' + valor + '</strong>';

    badge.appendChild(swatch);
    badge.appendChild(text);

    cardEl.appendChild(badge);
    debugLog('Badge inserido no card do produto');
  }

  function findProductCard() {
    // 1. Buscar pelo nome do produto
    var productNames = ['Tinta Pro Piso', 'Tinta Acrílica', 'ProRevest'];
    var allEls = document.querySelectorAll('p, div, span, td, h1, h2, h3, h4, h5, h6, strong');
    for (var n = 0; n < productNames.length; n++) {
      for (var i = 0; i < allEls.length && i < 500; i++) {
        if (allEls[i].textContent.trim().indexOf(productNames[n]) !== -1) {
          var card = allEls[i].closest('[class*="item"]') ||
                     allEls[i].closest('[class*="product"]') ||
                     allEls[i].closest('[class*="card"]') ||
                     allEls[i].closest('[class*="detail"]') ||
                     allEls[i].closest('[class*="row"]');
          if (card) return card;
        }
      }
    }

    // 2. Buscar por "cor_prorevest"
    for (var i = 0; i < allEls.length && i < 300; i++) {
      if (allEls[i].textContent.indexOf('cor_prorevest') !== -1) {
        var card = allEls[i].closest('[class*="item"]') ||
                   allEls[i].closest('[class*="product"]') ||
                   allEls[i].closest('[class*="detail"]') ||
                   allEls[i].parentElement;
        if (card) return card;
      }
    }

    // 3. Containers genéricos
    return document.querySelector('[class*="CartItem"]') ||
           document.querySelector('[class*="item-detail"]') ||
           document.querySelector('[class*="product-detail"]') ||
           document.querySelector('.bgItems') ||
           document.querySelector('.items') ||
           null;
  }

  function updateCartBadge() {
    var badge = document.getElementById('pr-color-badge');
    if (badge && selected) {
      var textEl = badge.querySelector('span:last-child');
      if (textEl) textEl.innerHTML = '🎨 Cor: <strong>' + selected.valor + '</strong>';
      var swatchEl = badge.querySelector('span:first-child');
      if (swatchEl) swatchEl.style.background = selected.hex || '#ccc';
    }
  }

  // ─── OBSERVAR MUDANÇAS NO DOM (SPA) ────────────────────────────
  function watchDOM() {
    if (_observer) _observer.disconnect();
    _observer = new MutationObserver(patchCartCheckoutDOM);
    _observer.observe(document.body, { childList: true, subtree: true });

    var count = 0;
    var interval = setInterval(function () {
      patchCartCheckoutDOM();
      count++;
      if (count >= CONFIG.patchMaxCycles) clearInterval(interval);
    }, CONFIG.patchInterval);
  }

  // ─── FETCH DE CORES (robusto) ───────────────────────────────────
  // Aceita: {colors:[...]}, {data:[...]}, {items:[...]} ou [array]
  function parseColorsResponse(body) {
    if (Array.isArray(body)) return body;
    if (body && Array.isArray(body.colors)) return body.colors;
    if (body && Array.isArray(body.data)) return body.data;
    if (body && Array.isArray(body.items)) return body.items;
    // Tenta encontrar primeiro array aninhado
    if (body && typeof body === 'object') {
      for (var key in body) {
        if (Object.prototype.hasOwnProperty.call(body, key) && Array.isArray(body[key])) {
          return body[key];
        }
      }
    }
    return [];
  }

  function fetchColors(cb, retries) {
    retries = retries || 3;
    fetch(API_URL + '/colors?limit=' + LIMIT)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (body) {
        var colors = parseColorsResponse(body);
        debugLog('Cores recebidas: ' + colors.length);
        cb(null, colors);
      })
      .catch(function (e) {
        debugLog('Erro fetch (restam ' + (retries - 1) + '): ' + e.message);
        if (retries > 1) {
          setTimeout(function () { fetchColors(cb, retries - 1); }, 2000);
        } else {
          cb(e);
        }
      });
  }

  // ─── LOG SILENCIOSO ────────────────────────────────────────────
  function debugLog(msg) {
    console.log('[ProRevest]', msg);
  }

  // ─── FILTRO E PAGINAÇÃO ─────────────────────────────────────────
  function applyFilter(q) {
    var term = (q || '').trim().toLowerCase();
    filtered = allColors.filter(function (c) {
      if (!term) return true;
      return (
        (c.name || '').toLowerCase().indexOf(term) !== -1 ||
        (c.pro_revest_code || '').toLowerCase().indexOf(term) !== -1 ||
        (c.hex_code || '').toLowerCase().indexOf(term) !== -1 ||
        (c.category || '').toLowerCase().indexOf(term) !== -1
      );
    });
    page = 0;
    var grid = document.getElementById('pr-grid');
    if (grid) grid.innerHTML = '';
    renderPage();
    var cnt = document.getElementById('pr-count');
    if (cnt) cnt.textContent = filtered.length + ' cores';
  }

  function renderPage() {
    var grid = document.getElementById('pr-grid');
    if (!grid) return;
    var slice = filtered.slice(page * CONFIG.perPage, (page + 1) * CONFIG.perPage);
    slice.forEach(function (c) { grid.appendChild(makeCard(c)); });
    page++;
    var btn = document.getElementById('pr-more');
    if (btn) btn.style.display = page * CONFIG.perPage < filtered.length ? 'inline-block' : 'none';
  }

  // ─── CARD DE COR ────────────────────────────────────────────────
  function makeCard(color) {
    var card = document.createElement('div');
    card.style.cssText =
      'display:flex;flex-direction:column;align-items:center;padding:8px 4px;' +
      'border:2px solid #f3f4f6;border-radius:8px;cursor:pointer;transition:all .15s;' +
      'background:#fff;user-select:none;text-align:center;';

    var swatch = document.createElement('div');
    swatch.style.cssText =
      'width:40px;height:40px;border-radius:50%;background:' + color.hex_code +
      ';border:2px solid rgba(0,0,0,.1);margin-bottom:4px;transition:transform .15s;flex-shrink:0;';

    var code = document.createElement('span');
    code.style.cssText = 'font-size:9px;color:#6b7280;font-weight:700;text-align:center;';
    code.textContent = color.pro_revest_code || color.hex_code;

    var name = document.createElement('span');
    name.style.cssText =
      'font-size:9px;color:#374151;text-align:center;max-width:84px;overflow:hidden;' +
      'text-overflow:ellipsis;white-space:nowrap;margin-top:2px;line-height:1.2;';
    name.textContent = color.name;
    name.title = color.name;

    card.appendChild(swatch);
    card.appendChild(code);
    card.appendChild(name);

    card.addEventListener('mouseenter', function () {
      card.style.borderColor = '#f59e0b';
      card.style.boxShadow = '0 2px 8px rgba(245,158,11,.2)';
      swatch.style.transform = 'scale(1.1)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.borderColor = selected && selected.hex === color.hex_code ? '#f59e0b' : '#f3f4f6';
      card.style.boxShadow = '';
      swatch.style.transform = '';
    });

    card.addEventListener('click', function () {
      var prev = document.querySelector('#pr-grid [data-pr-selected]');
      if (prev) {
        prev.removeAttribute('data-pr-selected');
        prev.style.borderColor = '#f3f4f6';
        prev.style.background = '#fff';
        prev.style.boxShadow = '';
      }
      card.setAttribute('data-pr-selected', '1');
      card.style.borderColor = '#f59e0b';
      card.style.background = '#fffbeb';
      card.style.boxShadow = '0 0 0 3px rgba(245,158,11,.12)';

      var badge = document.getElementById('pr-badge');
      if (badge) {
        badge.style.display = 'inline-flex';
        badge.innerHTML =
          '<span style="width:10px;height:10px;border-radius:50%;background:' + color.hex_code +
          ';border:1px solid rgba(255,255,255,.5);margin-right:5px;flex-shrink:0;display:inline-block;"></span>' +
          color.name + (color.pro_revest_code ? ' · ' + color.pro_revest_code : '');
      }

      var panel = document.getElementById('pr-selected-info');
      if (panel) {
        panel.style.display = 'flex';
        panel.innerHTML =
          '<div style="width:28px;height:28px;border-radius:50%;background:' + color.hex_code +
          ';border:2px solid rgba(0,0,0,.1);flex-shrink:0;display:inline-block;"></div>' +
          '<div style="margin-left:10px;">' +
          '<strong style="font-size:13px;color:#1a1a1a;">' + color.name + '</strong><br>' +
          '<span style="font-size:11px;color:#6b7280;">' +
          (color.pro_revest_code ? 'Cód: ' + color.pro_revest_code + ' · ' : '') +
          'Hex: <code style="background:#f3f4f6;padding:1px 4px;border-radius:3px;">' + color.hex_code + '</code> ' +
          (color.category ? '· ' + color.category : '') +
          '</span></div>';
      }

      saveColor(color);
      enviarIntencao();
    });

    return card;
  }

  // ─── CHIPS DE CATEGORIA ────────────────────────────────────────
  function renderCategoryChips() {
    var container = document.getElementById('pr-chips');
    if (!container) return;
    container.innerHTML = '';

    var cats = {};
    allColors.forEach(function (c) {
      var cat = c.category || 'Outras';
      cats[cat] = (cats[cat] || 0) + 1;
    });
    var categories = Object.keys(cats).sort();
    if (categories.length <= 1) return;

    var allChip = document.createElement('span');
    allChip.textContent = 'Todas (' + allColors.length + ')';
    allChip.style.cssText = 'padding:3px 10px;border-radius:16px;font-size:11px;cursor:pointer;background:#f59e0b;color:#fff;font-weight:600;border:1px solid #f59e0b;';
    allChip.addEventListener('click', function () {
      var srch = document.getElementById('pr-search');
      if (srch) srch.value = '';
      applyFilter('');
    });
    container.appendChild(allChip);

    categories.forEach(function (cat) {
      var chip = document.createElement('span');
      chip.textContent = cat + ' (' + cats[cat] + ')';
      chip.style.cssText = 'padding:3px 10px;border-radius:16px;font-size:11px;cursor:pointer;background:#fef3c7;color:#92400e;border:1px solid #fde68a;';
      chip.addEventListener('click', function () {
        var srch = document.getElementById('pr-search');
        if (srch) srch.value = cat;
        applyFilter(cat);
      });
      container.appendChild(chip);
    });
  }

  // ─── CONSTRUIR WIDGET ──────────────────────────────────────────
  function buildWidget() {
    var old = document.getElementById('pr-color-widget');
    if (old) old.remove();

    var w = document.createElement('div');
    w.id = 'pr-color-widget';
    w.style.cssText = 'margin:12px 0;border:2px solid #fbbf24;border-radius:10px;overflow:hidden;font-family:inherit;background:#fff;';

    var head = document.createElement('div');
    head.style.cssText = 'background:linear-gradient(135deg,#f59e0b,#fbbf24);padding:10px 14px;display:flex;align-items:center;gap:8px;';
    head.innerHTML =
      '<span style="font-size:16px;">🎨</span>' +
      '<strong style="color:#fff;font-size:14px;">' + CONFIG.widgetTitle + '</strong>' +
      '<span id="pr-badge" style="margin-left:auto;background:rgba(255,255,255,.25);color:#fff;font-size:11px;padding:2px 8px;border-radius:10px;display:none;font-weight:600;"></span>';
    w.appendChild(head);

    var body = document.createElement('div');
    body.style.cssText = 'padding:12px;';

    var srch = document.createElement('input');
    srch.type = 'text';
    srch.placeholder = 'Buscar cor por nome, código ou hex...';
    srch.id = 'pr-search';
    srch.style.cssText = 'width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid #fcd34d;border-radius:6px;font-size:13px;font-family:inherit;outline:none;';
    srch.addEventListener('focus', function () { srch.style.borderColor = '#f59e0b'; });
    srch.addEventListener('blur', function () { srch.style.borderColor = '#fcd34d'; });
    srch.addEventListener('input', function () {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () { applyFilter(srch.value); }, CONFIG.debounceMs);
    });
    body.appendChild(srch);

    var chips = document.createElement('div');
    chips.id = 'pr-chips';
    chips.style.cssText = 'display:flex;flex-wrap:wrap;gap:5px;margin:8px 0;';
    body.appendChild(chips);

    var grid = document.createElement('div');
    grid.id = 'pr-grid';
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(90px,1fr));gap:8px;max-height:320px;overflow-y:auto;padding-right:2px;';
    body.appendChild(grid);

    var foot = document.createElement('div');
    foot.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-top:10px;';

    var counter = document.createElement('span');
    counter.id = 'pr-count';
    counter.style.cssText = 'font-size:11px;color:#9ca3af;';
    foot.appendChild(counter);

    var more = document.createElement('button');
    more.id = 'pr-more';
    more.textContent = 'Carregar mais ↓';
    more.style.cssText = 'display:none;background:none;border:1px solid #fcd34d;color:#92400e;padding:4px 12px;border-radius:6px;font-size:12px;cursor:pointer;font-family:inherit;';
    more.addEventListener('click', function () { renderPage(); });
    foot.appendChild(more);
    body.appendChild(foot);

    var panel = document.createElement('div');
    panel.id = 'pr-selected-info';
    panel.style.cssText = 'display:none;margin-top:10px;padding:8px 12px;background:#fffbeb;border:1px solid #fbbf24;border-radius:6px;font-size:13px;align-items:center;gap:8px;';
    body.appendChild(panel);

    w.appendChild(body);

    var insert = getInsertionPoint();
    if (insert) {
      if (insert.ref) {
        insert.parent.insertBefore(w, insert.ref);
      } else {
        insert.parent.appendChild(w);
      }
    } else {
      document.body.appendChild(w);
    }
  }

  // ─── INICIALIZAÇÃO ─────────────────────────────────────────────
  function initProductPage() {
    captureProduct();
    hookAddToCart();
    debugShow('Carregando paleta ProRevest...', '#d97706');
    buildWidget();

    var grid = document.getElementById('pr-grid');
    if (grid) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:20px;"><div style="display:inline-block;width:24px;height:24px;border:3px solid #fde68a;border-top-color:#f59e0b;border-radius:50%;animation:spin .8s linear infinite;"></div><p style="color:#999;font-size:11px;margin-top:8px;">' + CONFIG.loadingText + '</p></div>';
    }

    fetchColors(function (err, colors) {
      if (err) {
        debugShow(CONFIG.errorText + ': ' + err.message, '#dc2626');
        if (grid) grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:20px;color:#dc2626;font-size:12px;"><p>' + CONFIG.errorText + ': ' + err.message + '</p></div>';
        return;
      }
      allColors = colors;
      renderCategoryChips();
      applyFilter('');
      debugShow(colors.length + ' cores carregadas ✓', '#059669');
    }, 3);
  }

  function initCartPage() {
    loadColor();
    watchDOM();
    patchCartCheckoutDOM();
  }

  function initCheckoutPage() {
    loadColor();
    fillCheckoutObservation();
    watchDOM();
    patchCartCheckoutDOM();
  }

  // ─── MAIN ────────────────────────────────────────────────────────
  function main() {
    loadColor();

    if (isProductPage()) {
      setTimeout(initProductPage, 500);
    } else if (isCartPage()) {
      setTimeout(initCartPage, 300);
    } else if (isCheckoutPage()) {
      setTimeout(initCheckoutPage, 300);
    } else {
      debugShow('ProRevest — script ativo (' + location.pathname + ')', '#d97706');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    setTimeout(main, 0);
  }
})();
