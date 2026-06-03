/**
 * furniro-extras.js
 * ─────────────────────────────────────────────────────
 * Drop-in enhancement layer for Furniro E-Commerce.
 * Add <script src="furniro-extras.js"></script> to ALL
 * pages AFTER <script src="script.js"></script>.
 *
 * Features:
 *  1. Navbar Search Overlay  — live product search
 *  2. Product Comparison Bar — compare up to 3 products
 *  3. Wishlist Persistence   — localStorage wishlist
 *  4. Scroll-to-Top Button   — smooth scroll
 * ─────────────────────────────────────────────────────
 */

(function () {
    'use strict';

    /* ═══════════════════════════════════════════════
       DESIGN TOKENS  (match tailwind.config.js)
    ═══════════════════════════════════════════════ */
    const CLR = {
        primary : '#B88E2F',
        dark    : '#3A3A3A',
        grey    : '#9F9F9F',
        light   : '#F4F5F7',
        beige   : '#F9F1E7',
        red     : '#eb6f72',
        border  : '#EDE8E0',
        card    : '#FEFCF8',
    };

    /* ═══════════════════════════════════════════════
       SHARED UTILITIES
    ═══════════════════════════════════════════════ */
    let _cachedProducts = null;

    async function fetchProducts() {
        if (_cachedProducts) return _cachedProducts;
        try {
            const res  = await fetch('products.json');
            const data = await res.json();
            _cachedProducts = data.products || [];
            return _cachedProducts;
        } catch {
            return [];
        }
    }

    function injectStyles(id, css) {
        if (document.getElementById(id)) return;
        const el = document.createElement('style');
        el.id = id;
        el.textContent = css;
        document.head.appendChild(el);
    }

    function showToast(msg, bg = CLR.dark) {
        const existing = document.getElementById('fe-toast');
        if (existing) existing.remove();
        const t = Object.assign(document.createElement('div'), {
            id: 'fe-toast', textContent: msg
        });
        Object.assign(t.style, {
            position:'fixed', bottom:'2rem', right:'2rem', zIndex:'10000',
            background: bg, color:'#fff', padding:'.75rem 1.5rem',
            borderRadius:'8px', fontSize:'.85rem',
            fontFamily:"'Montserrat',sans-serif", fontWeight:'600',
            opacity:'0', transform:'translateY(10px)',
            transition:'opacity .3s, transform .3s', pointerEvents:'none',
            boxShadow:'0 4px 20px rgba(0,0,0,.15)'
        });
        document.body.appendChild(t);
        requestAnimationFrame(() => {
            t.style.opacity = '1';
            t.style.transform = 'translateY(0)';
        });
        setTimeout(() => {
            t.style.opacity = '0';
            t.style.transform = 'translateY(10px)';
            setTimeout(() => t.remove(), 350);
        }, 3000);
    }

    function fmtPrice(p) {
        return 'Rp\u00a0' + Number(p).toLocaleString('id-ID');
    }

    function renderStars(rating) {
        const full  = Math.floor(rating);
        const empty = 5 - full;
        return `<span style="color:${CLR.primary}">${'★'.repeat(full)}</span>`
             + `<span style="color:#D9D9D9">${'☆'.repeat(empty)}</span>`;
    }

    /* ═══════════════════════════════════════════════
       1. SEARCH OVERLAY
    ═══════════════════════════════════════════════ */
    function initSearch() {
        injectStyles('fe-search-css', `
            /* ── Overlay shell ── */
            #fe-search-overlay {
                position: fixed; inset: 0; z-index: 9500;
                opacity: 0; pointer-events: none;
                transition: opacity .25s ease;
            }
            #fe-search-overlay.open {
                opacity: 1; pointer-events: all;
            }

            /* ── Dark backdrop ── */
            #fe-search-backdrop {
                position: absolute; inset: 0;
                background: rgba(20,16,8,.6);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
            }

            /* ── White panel slides down ── */
            #fe-search-panel {
                position: absolute; top: 0; left: 0; right: 0;
                background: #fff;
                border-radius: 0 0 24px 24px;
                padding: 2rem 2rem 2rem;
                max-height: 88vh; overflow-y: auto;
                transform: translateY(-30px);
                transition: transform .35s cubic-bezier(.4,0,.2,1);
                box-shadow: 0 16px 56px rgba(0,0,0,.14);
            }
            #fe-search-overlay.open #fe-search-panel {
                transform: translateY(0);
            }

            /* ── Input row ── */
            #fe-search-header {
                display: flex; align-items: center; gap: 1rem;
                padding-bottom: 1.25rem;
                border-bottom: 2px solid ${CLR.light};
                max-width: 820px; margin: 0 auto;
            }
            #fe-search-input {
                flex: 1; border: none; outline: none;
                font-size: 1.2rem; font-family: 'Montserrat', sans-serif;
                color: ${CLR.dark}; background: transparent;
                caret-color: ${CLR.primary};
            }
            #fe-search-input::placeholder { color: #CCC; font-weight: 400; }
            #fe-search-close {
                flex-shrink: 0; background: none; border: none;
                cursor: pointer; padding: .4rem;
                border-radius: 50%; display: flex;
                align-items: center; justify-content: center;
                transition: background .2s;
            }
            #fe-search-close:hover { background: ${CLR.light}; }

            /* ── Results area ── */
            #fe-search-results {
                max-width: 820px; margin: 1.5rem auto 0;
                min-height: 80px;
            }
            .fe-sr-hint {
                text-align: center; padding: 2rem;
                color: ${CLR.grey}; font-family: 'Montserrat', sans-serif;
                font-size: .9rem;
            }
            .fe-sr-label {
                font-family: 'Montserrat', sans-serif;
                font-size: .72rem; font-weight: 700;
                letter-spacing: 1.6px; text-transform: uppercase;
                color: ${CLR.grey}; margin-bottom: .9rem;
            }
            .fe-sr-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                gap: 1rem;
            }
            .fe-sr-card {
                display: flex; flex-direction: column;
                background: ${CLR.card}; border: 1px solid ${CLR.border};
                border-radius: 14px; overflow: hidden;
                text-decoration: none; color: inherit;
                transition: box-shadow .2s, transform .2s;
            }
            .fe-sr-card:hover {
                box-shadow: 0 8px 28px rgba(0,0,0,.1);
                transform: translateY(-3px);
            }
            .fe-sr-card img {
                width: 100%; height: 130px; object-fit: cover;
            }
            .fe-sr-card-body { padding: .75rem; }
            .fe-sr-cat {
                font-family: 'Montserrat', sans-serif;
                font-size: .68rem; font-weight: 700;
                letter-spacing: 1px; text-transform: uppercase;
                color: ${CLR.primary}; margin-bottom: .2rem;
            }
            .fe-sr-name {
                font-family: 'Montserrat', sans-serif;
                font-size: .85rem; font-weight: 600;
                color: ${CLR.dark}; margin-bottom: .3rem;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .fe-sr-price {
                font-family: 'Montserrat', sans-serif;
                font-size: .82rem; font-weight: 700; color: ${CLR.dark};
            }
            .fe-sr-view-all {
                display: block; text-align: center;
                margin-top: 1.25rem;
                padding: .85rem; background: ${CLR.beige};
                border-radius: 12px;
                font-family: 'Montserrat', sans-serif;
                font-size: .85rem; font-weight: 700;
                color: ${CLR.primary}; text-decoration: none;
                transition: background .2s, color .2s;
            }
            .fe-sr-view-all:hover { background: ${CLR.primary}; color: #fff; }
        `);

        /* Inject overlay HTML */
        const overlay = document.createElement('div');
        overlay.id = 'fe-search-overlay';
        overlay.innerHTML = `
            <div id="fe-search-backdrop"></div>
            <div id="fe-search-panel">
                <div id="fe-search-header">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                         stroke="${CLR.primary}" stroke-width="2.2" stroke-linecap="round">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <input id="fe-search-input"
                           type="text"
                           placeholder="Search for furniture, chairs, sofas…"
                           autocomplete="off"/>
                    <button id="fe-search-close" aria-label="Close search">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="${CLR.dark}" stroke-width="2.2" stroke-linecap="round">
                            <path d="M18 6 6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <div id="fe-search-results">
                    <p class="fe-sr-hint">Start typing to search all products…</p>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        /* Bind to ALL search buttons (title="search") */
        document.querySelectorAll('[title="search"]').forEach(btn =>
            btn.addEventListener('click', openSearch)
        );

        document.getElementById('fe-search-close')
            .addEventListener('click', closeSearch);
        document.getElementById('fe-search-backdrop')
            .addEventListener('click', closeSearch);
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeSearch();
        });

        /* Debounced live search */
        let debounce;
        document.getElementById('fe-search-input')
            .addEventListener('input', e => {
                clearTimeout(debounce);
                debounce = setTimeout(() => doSearch(e.target.value.trim()), 220);
            });
    }

    function openSearch() {
        document.getElementById('fe-search-overlay').classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => document.getElementById('fe-search-input').focus(), 60);
    }

    function closeSearch() {
        document.getElementById('fe-search-overlay').classList.remove('open');
        document.getElementById('fe-search-input').value = '';
        document.getElementById('fe-search-results').innerHTML =
            '<p class="fe-sr-hint">Start typing to search all products…</p>';
        document.body.style.overflow = '';
    }

    async function doSearch(query) {
        const resultsEl = document.getElementById('fe-search-results');
        if (!query) {
            resultsEl.innerHTML = '<p class="fe-sr-hint">Start typing to search all products…</p>';
            return;
        }

        const products = await fetchProducts();
        const q = query.toLowerCase();
        const all = products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            (p.category  || '').toLowerCase().includes(q) ||
            (p.description || '').toLowerCase().includes(q)
        );
        const shown = all.slice(0, 8);

        if (!shown.length) {
            resultsEl.innerHTML = `
                <p class="fe-sr-hint">
                    No products found for <strong>"${query}"</strong>.<br>
                    <a href="shop.html" style="color:${CLR.primary};font-weight:700;">Browse all products →</a>
                </p>`;
            return;
        }

        const cards = shown.map(p => `
            <a href="product.html?id=${p.id}" class="fe-sr-card"
               onclick="document.getElementById('fe-search-overlay').classList.remove('open');
                        document.body.style.overflow='';">
                <img src="${p.image}" alt="${p.name}"
                     onerror="this.src='https://via.placeholder.com/200x130/F4F0E8/9A8E7C?text=No+Image'">
                <div class="fe-sr-card-body">
                    <p class="fe-sr-cat">${p.category || 'Furniture'}</p>
                    <p class="fe-sr-name">${p.name}</p>
                    <p class="fe-sr-price">${fmtPrice(p.price)}</p>
                </div>
            </a>`).join('');

        const moreCount = all.length - shown.length;
        resultsEl.innerHTML = `
            <p class="fe-sr-label">${all.length} result${all.length !== 1 ? 's' : ''} for "${query}"</p>
            <div class="fe-sr-grid">${cards}</div>
            ${moreCount > 0
                ? `<a href="shop.html?q=${encodeURIComponent(query)}" class="fe-sr-view-all">
                       View ${moreCount} more result${moreCount !== 1 ? 's' : ''} in Shop →
                   </a>` : ''}
        `;
    }

    /* ═══════════════════════════════════════════════
       2. PRODUCT COMPARISON
    ═══════════════════════════════════════════════ */
    const COMPARE_KEY = 'furniroCompare';
    const MAX_COMPARE = 3;

    function getCompareList() {
        try { return JSON.parse(localStorage.getItem(COMPARE_KEY)) || []; }
        catch { return []; }
    }

    function saveCompareList(ids) {
        localStorage.setItem(COMPARE_KEY, JSON.stringify(ids));
    }

    /* Public API — called from onclick in rendered HTML */
    window.FurniroExtras = {
        addToCompare(id) {
            id = Number(id);
            let list = getCompareList();
            if (list.includes(id)) {
                list = list.filter(i => i !== id);
                saveCompareList(list);
                showToast('Removed from comparison', CLR.grey);
            } else if (list.length >= MAX_COMPARE) {
                showToast(`Max ${MAX_COMPARE} products for comparison`, CLR.red);
                return;
            } else {
                list.push(id);
                saveCompareList(list);
                showToast('Added to comparison!', CLR.primary);
            }
            _refreshCompare();
        }
    };

    function initCompare() {
        injectStyles('fe-compare-css', `
            /* ── Floating compare bar ── */
            #fe-compare-bar {
                position: fixed; bottom: 0; left: 0; right: 0; z-index: 8500;
                background: #fff; border-top: 2px solid ${CLR.border};
                box-shadow: 0 -6px 30px rgba(0,0,0,.1);
                transform: translateY(100%);
                transition: transform .38s cubic-bezier(.4,0,.2,1);
                padding: .9rem 1.5rem;
            }
            #fe-compare-bar.open { transform: translateY(0); }
            #fe-compare-inner {
                max-width: 1280px; margin: 0 auto;
                display: flex; align-items: center;
                justify-content: space-between; gap: 1rem; flex-wrap: wrap;
            }
            #fe-compare-slots {
                display: flex; align-items: center; gap: .75rem; flex: 1; flex-wrap: wrap;
            }
            .fe-cmp-label {
                font-family: 'Montserrat', sans-serif;
                font-size: .75rem; font-weight: 700;
                color: ${CLR.grey}; white-space: nowrap;
            }
            .fe-cmp-slot {
                width: 76px; height: 76px; border-radius: 10px;
                border: 2px dashed ${CLR.border}; background: ${CLR.light};
                display: flex; flex-direction: column;
                align-items: center; justify-content: center;
                gap: .25rem; position: relative;
                overflow: hidden; flex-shrink: 0;
                transition: border-color .2s;
            }
            .fe-cmp-slot.filled { border-style: solid; border-color: ${CLR.primary}; }
            .fe-cmp-slot img {
                width: 100%; height: 100%; object-fit: cover;
            }
            .fe-cmp-slot-name {
                position: absolute; bottom: 0; left: 0; right: 0;
                background: rgba(20,16,8,.55); color: #fff;
                font-size: 8px; font-family: 'Montserrat', sans-serif;
                padding: 2px 4px; text-align: center;
                overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
            }
            .fe-cmp-slot-rm {
                position: absolute; top: 2px; right: 2px;
                width: 18px; height: 18px; border-radius: 50%;
                background: ${CLR.red}; color: #fff; border: none;
                font-size: 12px; line-height: 18px; text-align: center;
                cursor: pointer; display: flex; align-items: center; justify-content: center;
                font-weight: 700;
            }
            .fe-cmp-empty-svg { color: #D5D0C8; }
            .fe-cmp-empty-text {
                font-size: 9px; font-family: 'Montserrat', sans-serif;
                color: ${CLR.grey}; text-align: center; padding: 0 4px; line-height: 1.3;
            }
            #fe-compare-actions { display: flex; gap: .75rem; align-items: center; flex-shrink: 0; }
            #fe-compare-go {
                display: inline-flex; align-items: center; gap: .45rem;
                background: ${CLR.primary}; color: #fff;
                padding: .65rem 1.4rem; border-radius: 8px;
                font-family: 'Montserrat', sans-serif;
                font-size: .8rem; font-weight: 700;
                text-decoration: none; white-space: nowrap;
                transition: background .2s, opacity .2s;
            }
            #fe-compare-go:hover { background: #9A7320; }
            #fe-compare-go.disabled {
                opacity: .45; pointer-events: none;
            }
            #fe-compare-clear {
                background: none; border: 1.5px solid ${CLR.border};
                color: ${CLR.grey}; padding: .65rem 1rem; border-radius: 8px;
                font-family: 'Montserrat', sans-serif;
                font-size: .8rem; font-weight: 600; cursor: pointer;
                white-space: nowrap; transition: border-color .2s, color .2s;
            }
            #fe-compare-clear:hover { border-color: ${CLR.red}; color: ${CLR.red}; }

            /* ── Compare pill injected on each product card ── */
            .fe-cmp-pill {
                display: inline-flex; align-items: center; gap: .3rem;
                background: transparent; border: 1.5px solid ${CLR.border};
                color: ${CLR.grey}; padding: .3rem .7rem; border-radius: 20px;
                font-size: .68rem; font-family: 'Montserrat', sans-serif;
                font-weight: 600; cursor: pointer;
                transition: all .2s; white-space: nowrap; flex-shrink: 0;
            }
            .fe-cmp-pill:hover,
            .fe-cmp-pill.active {
                background: ${CLR.beige}; border-color: ${CLR.primary}; color: ${CLR.primary};
            }
            .fe-cmp-pill.active { font-weight: 700; }

            /* Nudge scroll-top button up when bar is open */
            #fe-scroll-top { transition: bottom .38s cubic-bezier(.4,0,.2,1), opacity .3s, transform .3s; }
            #fe-compare-bar.open ~ #fe-scroll-top { bottom: 7rem; }
        `);

        /* Build bar DOM */
        const bar = document.createElement('div');
        bar.id = 'fe-compare-bar';
        bar.innerHTML = `
            <div id="fe-compare-inner">
                <div id="fe-compare-slots"></div>
                <div id="fe-compare-actions">
                    <a href="compare.html" id="fe-compare-go" class="disabled">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3
                                     m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                        </svg>
                        Compare Now
                    </a>
                    <button id="fe-compare-clear">Clear All</button>
                </div>
            </div>`;
        document.body.appendChild(bar);

        document.getElementById('fe-compare-clear').addEventListener('click', () => {
            saveCompareList([]);
            _refreshCompare();
        });

        /* Watch product grid for newly rendered cards */
        const grid = document.getElementById('products-grid');
        if (grid) {
            new MutationObserver(() => {
                _injectComparePills();
                _highlightPills();
            }).observe(grid, { childList: true });
        }

        _refreshCompare();
    }

    async function _refreshCompare() {
        const list    = getCompareList();
        const bar     = document.getElementById('fe-compare-bar');
        const slotsEl = document.getElementById('fe-compare-slots');
        const goBtn   = document.getElementById('fe-compare-go');
        if (!bar) return;

        /* Show / hide bar */
        bar.classList.toggle('open', list.length > 0);

        /* Enable/disable compare button */
        if (goBtn) goBtn.classList.toggle('disabled', list.length < 2);

        /* Render slots */
        if (!slotsEl) return;
        const products = await fetchProducts();

        const slotHTMLs = [];
        for (let i = 0; i < MAX_COMPARE; i++) {
            const id = list[i];
            if (id !== undefined) {
                const p = products.find(pr => Number(pr.id) === Number(id));
                slotHTMLs.push(p ? `
                    <div class="fe-cmp-slot filled">
                        <img src="${p.image}" alt="${p.name}"
                             onerror="this.src='https://via.placeholder.com/80/F4F0E8?text=?'">
                        <span class="fe-cmp-slot-name">${p.name}</span>
                        <button class="fe-cmp-slot-rm"
                                onclick="FurniroExtras.addToCompare(${p.id})"
                                title="Remove">&#215;</button>
                    </div>` : '');
            } else {
                slotHTMLs.push(`
                    <div class="fe-cmp-slot">
                        <svg class="fe-cmp-empty-svg" width="22" height="22" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <path d="M12 8v8M8 12h8"/>
                        </svg>
                        <span class="fe-cmp-empty-text">Add product</span>
                    </div>`);
            }
        }

        slotsEl.innerHTML = `
            <span class="fe-cmp-label">Compare (${list.length}/${MAX_COMPARE}):</span>
            ${slotHTMLs.join('')}`;

        _highlightPills();
    }

    function _injectComparePills() {
        document.querySelectorAll('.furniro-card:not([data-cmp-init])')
            .forEach(card => {
                const id     = parseInt(card.dataset.id);
                if (!id) return;
                const footer = card.querySelector('.card-footer');
                if (!footer) return;

                const pill = document.createElement('button');
                pill.className = 'fe-cmp-pill';
                pill.dataset.cmpId = id;
                pill.innerHTML = `
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3
                                 m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                    </svg>
                    Compare`;
                pill.addEventListener('click', e => {
                    e.preventDefault();
                    window.FurniroExtras.addToCompare(id);
                });
                footer.appendChild(pill);
                card.setAttribute('data-cmp-init', '1');
            });
    }

    function _highlightPills() {
        const list = getCompareList().map(Number);
        document.querySelectorAll('.fe-cmp-pill').forEach(pill => {
            const id = parseInt(pill.dataset.cmpId);
            const active = list.includes(id);
            pill.classList.toggle('active', active);
            pill.title = active ? 'Remove from comparison' : 'Add to comparison';
        });
    }

    /* ═══════════════════════════════════════════════
       3. WISHLIST PERSISTENCE
    ═══════════════════════════════════════════════ */
    const WISH_KEY = 'furniroWishlist';

    function initWishlist() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;
        new MutationObserver(_restoreWishlist).observe(grid, { childList: true });
    }

    function _getWishlist() {
        try { return JSON.parse(localStorage.getItem(WISH_KEY)) || []; }
        catch { return []; }
    }

    function _restoreWishlist() {
        const list = _getWishlist().map(Number);
        document.querySelectorAll('.card-wish:not([data-wish-init])').forEach(btn => {
            const card = btn.closest('[data-id]');
            if (!card) return;
            const id = parseInt(card.dataset.id);
            if (list.includes(id)) btn.classList.add('liked');

            btn.addEventListener('click', () => {
                let wl = _getWishlist().map(Number);
                if (btn.classList.contains('liked')) {
                    wl = wl.filter(i => i !== id);
                } else {
                    wl.push(id);
                    showToast('Added to wishlist ♥', CLR.primary);
                }
                localStorage.setItem(WISH_KEY, JSON.stringify(wl));
                btn.classList.toggle('liked');
            }, { once: false });

            btn.setAttribute('data-wish-init', '1');
        });
    }

    /* ═══════════════════════════════════════════════
       4. SCROLL-TO-TOP
    ═══════════════════════════════════════════════ */
    function initScrollTop() {
        injectStyles('fe-scroll-css', `
            #fe-scroll-top {
                position: fixed; bottom: 2rem; right: 2rem; z-index: 7500;
                width: 46px; height: 46px; border-radius: 50%;
                background: ${CLR.primary}; color: #fff; border: none;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer;
                opacity: 0; transform: translateY(14px); pointer-events: none;
                box-shadow: 0 4px 18px rgba(184,142,47,.35);
            }
            #fe-scroll-top.visible {
                opacity: 1; transform: translateY(0); pointer-events: all;
            }
            #fe-scroll-top:hover { background: #9A7320; }
        `);

        const btn = document.createElement('button');
        btn.id = 'fe-scroll-top';
        btn.setAttribute('aria-label', 'Back to top');
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M12 19V5M5 12l7-7 7 7"/>
            </svg>`;
        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            btn.classList.toggle('visible', window.scrollY > 450);
        }, { passive: true });

        btn.addEventListener('click', () =>
            window.scrollTo({ top: 0, behavior: 'smooth' })
        );
    }

    /* ═══════════════════════════════════════════════
       BOOT
    ═══════════════════════════════════════════════ */
    document.addEventListener('DOMContentLoaded', () => {
        initSearch();
        initCompare();
        initWishlist();
        initScrollTop();
    });

})();