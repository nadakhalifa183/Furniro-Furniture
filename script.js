// --------------------------------- nav bar -------------------

function handleActiveLinks() {
    const currentPath = window.location.pathname;
    
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active-link');

        const href = link.getAttribute('href');

        if (currentPath.includes(href) && href !== 'index.html' && href !== '#') {
            link.classList.add('active-link');
        }

        if (currentPath === '/' || currentPath.endsWith('index.html')) {
            if (href.includes('index.html')) {
                link.classList.add('active-link');
            }
        }
    });
}

// --------------------------------- Global Variables -------------------
let visibleCount = 8;
let currentSort = 'default';
let allProducts = [];
let filteredProducts = [];
let selectedCategory = 'all';
let selectedPrice = 'all';
let cart = [];

// --------------------------------- Cart Functions -------------------

function initCart() {
    const savedCart = localStorage.getItem('furniroCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartBadge();
}

function saveCart() {
    localStorage.setItem('furniroCart', JSON.stringify(cart));
}

function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
    }
}

function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    saveCart();
    updateCartBadge();
    window.location.href = 'cart.html';
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartBadge();
    renderCart();
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCart();
        }
    }
}

function renderCart() {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;

    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">
                    <i class="fa-solid fa-cart-shopping"></i>
                </div>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <a href="shop.html" class="cart-empty-btn">Continue Shopping</a>
            </div>
        `;
        return;
    }

    let subtotal = 0;

    const cartItemsHTML = cart.map(cartItem => {
        const product = allProducts.find(p => p.id === cartItem.id);
        if (!product) return '';

        const itemTotal = product.price * cartItem.quantity;
        subtotal += itemTotal;

        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="cart-item-info">
                    <a href="product.html?id=${product.id}" class="cart-item-name">${product.name}</a>
                    <span class="cart-item-category">${product.category}</span>
                </div>
                <div class="cart-item-price">
                    Rp ${product.price.toLocaleString()}
                </div>
                <div class="cart-item-quantity">
                    <div class="quantity-box">
                        <button onclick="updateCartQuantity(${product.id}, -1)">-</button>
                        <span>${cartItem.quantity}</span>
                        <button onclick="updateCartQuantity(${product.id}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    Rp ${itemTotal.toLocaleString()}
                </div>
                <div class="cart-item-remove">
                    <button onclick="removeFromCart(${product.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    const shipping = subtotal >= 150 ? 0 : 50;
    const total = subtotal + shipping;

    cartContent.innerHTML = `
        <div class="cart-container">
            <div class="cart-items">
                <div class="cart-header">
                    <span class="col-span-2">Product</span>
                    <span class="col-span-2 text-center">Price</span>
                    <span class="col-span-2 text-center">Quantity</span>
                    <span class="col-span-2 text-center">Total</span>
                    <span class="col-span-1"></span>
                </div>
                ${cartItemsHTML}
            </div>
            <div class="cart-summary">
                <h3>Cart Summary</h3>
                <div class="cart-summary-row">
                    <span>Subtotal</span>
                    <span>Rp ${subtotal.toLocaleString()}</span>
                </div>
                <div class="cart-summary-row">
                    <span>Shipping</span>
                    <span>${shipping === 0 ? 'Free' : 'Rp ' + shipping.toLocaleString()}</span>
                </div>
                <div class="cart-summary-total">
                    <span>Total</span>
                    <span>Rp ${total.toLocaleString()}</span>
                </div>
                <a href="checkout.html" class="cart-checkout-btn">Proceed to Checkout</a>
                <div class="cart-continue-shopping">
                    <a href="shop.html">Continue Shopping</a>
                </div>
            </div>
        </div>
    `;
}

// --------------------------------- Display Products -------------------

// function renderProducts() {
//     const grid = document.getElementById('products-grid');
//     const showingCount = document.getElementById('showing-count');
//     const totalCount = document.getElementById('total-count');
//     const showMoreBtn = document.getElementById('show-more-btn');

//     if (!grid) return;

//     let sorted = [...filteredProducts];
//     if (currentSort === 'price_low') sorted.sort((a, b) => a.price - b.price);
//     if (currentSort === 'price_high') sorted.sort((a, b) => b.price - a.price);
//     if (currentSort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
//     if (currentSort === 'newest') sorted = sorted.filter(p => p.isNew).concat(sorted.filter(p => !p.isNew));

//     const visible = sorted.slice(0, visibleCount);

//     if (showingCount) showingCount.textContent = visible.length;
//     if (totalCount) totalCount.textContent = filteredProducts.length;

//     if (showMoreBtn) {
//         showMoreBtn.style.display = visibleCount >= sorted.length ? 'none' : 'block';
//     }

//     grid.innerHTML = '';

//     visible.forEach(product => {
//         const fullStars = Math.floor(product.rating);
//         const halfStar = product.rating % 1 >= 0.5;
//         const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//         const stars = '★'.repeat(fullStars) + (halfStar ? '★' : '') + '☆'.repeat(emptyStars);

//         const formattedPrice = product.price.toLocaleString();
//         const formattedOriginal = product.originalPrice.toLocaleString();


//         grid.innerHTML += `
//     <div class="bg-white rounded-[15px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group w-full h-full" data-id="${product.id}">
        
//         <div class="relative w-full h-[250px] bg-[#F4F5F7] overflow-hidden">
//             <a href="product.html?id=${product.id}" class="block w-full h-full">
//                 <img src="${product.image}" 
//                      alt="${product.name}" 
//                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                      onerror="this.src='https://via.placeholder.com/300x250?text=No+Image'">
//             </a>
            
//             <div class="absolute top-4 left-4 flex gap-2">
//                 ${product.isNew ? '<span class="bg-[#B88E2F] text-white text-[12px] font-medium px-3 py-1 rounded-full shadow-sm">New</span>' : ''}
//                 ${product.discount > 0 ? `<span class="bg-[#E97171] text-white text-[12px] font-medium px-3 py-1 rounded-full shadow-sm">-${product.discount}%</span>` : ''}
//             </div>
//         </div>

//         <div class="p-6 flex flex-col flex-1">
//             <a href="product.html?id=${product.id}" class="block no-underline mb-2">
//                 <h3 class="text-[#3A3A3A] font-bold text-[18px] leading-tight hover:text-[#B88E2F] transition-colors line-clamp-1">
//                     ${product.name}
//                 </h3>
//             </a>

//             <p class="text-[#898989] text-[13px] leading-relaxed line-clamp-2 mb-6 flex-1">
//                 ${product.description}
//             </p>

//             <div class="mt-auto flex justify-between items-center gap-4">
//                 <div class="flex flex-col">
//                      <span class="text-[#3A3A3A] font-bold text-[16px]">Rp ${product.price.toLocaleString()}</span>
//                      ${product.discount > 0 ? `<span class="text-[#B0B0B0] text-[12px] line-through">Rp ${formattedOriginal}</span>` : ''}
//                 </div>
                
//                 <a href="product.html?id=${product.id}" 
//                    class="bg-[#0d6efd] text-white px-4 py-2 rounded-full text-[13px] font-semibold hover:bg-blue-700 transition-all shadow-sm">
//                    View Details
//                 </a>
//             </div>
//         </div>
//     </div>
// `;
//     });

// }

// function renderProducts() {
//     const grid = document.getElementById('products-grid');
//     const showingCount = document.getElementById('showing-count');
//     const totalCount = document.getElementById('total-count');
//     const showMoreBtn = document.getElementById('show-more-btn');

//     if (!grid) return;

//     let sorted = [...filteredProducts];
//     if (currentSort === 'price_low') sorted.sort((a, b) => a.price - b.price);
//     if (currentSort === 'price_high') sorted.sort((a, b) => b.price - a.price);
//     if (currentSort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
//     if (currentSort === 'newest') sorted = sorted.filter(p => p.isNew).concat(sorted.filter(p => !p.isNew));

//     const visible = sorted.slice(0, visibleCount);

//     if (showingCount) showingCount.textContent = visible.length;
//     if (totalCount) totalCount.textContent = filteredProducts.length;
//     if (showMoreBtn) {
//         showMoreBtn.style.display = visibleCount >= sorted.length ? 'none' : 'block';
//     }

//     grid.innerHTML = '';

//     visible.forEach(product => {
//         const fullStars = Math.floor(product.rating);
//         const halfStar = product.rating % 1 >= 0.5;
//         const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//         const stars = '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);

//         const formattedPrice    = product.price.toLocaleString();
//         const formattedOriginal = product.originalPrice.toLocaleString();

//         const card = document.createElement('div');
//         card.className = 'furniro-card';
//         card.dataset.id = product.id;

//         card.innerHTML = `
//             <div class="card-img-wrap">
//                 <img src="${product.image}"
//                      alt="${product.name}"
//                      onerror="this.src='https://via.placeholder.com/400x300/F4F0E8/9A8E7C?text=No+Image'">

//                 <div class="card-badges">
//                     ${product.isNew ? '<span class="badge badge-new">New</span>' : ''}
//                     ${product.discount > 0 ? `<span class="badge badge-sale">−${product.discount}%</span>` : ''}
//                 </div>

//                 <button class="card-wish" aria-label="Add to wishlist">
//                     <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
//                         <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z"
//                               stroke="#B88E2F" stroke-width="1.5" fill="none"/>
//                     </svg>
//                 </button>
//             </div>

//             <div class="card-body">
//                 <p class="card-category">${product.category ?? 'Furniture'}</p>

//                 <a href="product.html?id=${product.id}" class="card-name">${product.name}</a>

//                 <p class="card-desc">${product.description}</p>

//                 <div class="card-stars" title="${product.rating} out of 5">${stars} <span style="font-size:11px;color:#9A8E7C;font-family:'Jost',sans-serif;">(${product.rating})</span></div>

//                 <div class="card-footer">
//                     <div class="price-block">
//                         <span class="price-current">Rp ${formattedPrice}</span>
//                         ${product.discount > 0 ? `<span class="price-original">Rp ${formattedOriginal}</span>` : ''}
//                     </div>
//                     <a href="product.html?id=${product.id}" class="view-btn">View Details</a>
//                 </div>
//             </div>
//         `;

//         // Wishlist toggle
//         card.querySelector('.card-wish').addEventListener('click', (e) => {
//             e.preventDefault();
//             e.currentTarget.classList.toggle('liked');
//         });

//         grid.appendChild(card);
//     });
// }
function renderProducts() {
    const grid = document.getElementById('products-grid');
    const showingCount = document.getElementById('showing-count');
    const totalCount = document.getElementById('total-count');
    const showMoreBtn = document.getElementById('show-more-btn');

    if (!grid) return;

    let sorted = [...filteredProducts];
    if (currentSort === 'price_low') sorted.sort((a, b) => a.price - b.price);
    if (currentSort === 'price_high') sorted.sort((a, b) => b.price - a.price);
    if (currentSort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    if (currentSort === 'newest') sorted = sorted.filter(p => p.isNew).concat(sorted.filter(p => !p.isNew));

    const visible = sorted.slice(0, visibleCount);

    if (showingCount) showingCount.textContent = visible.length;
    if (totalCount) totalCount.textContent = filteredProducts.length;
    
    if (showMoreBtn) {
        if (isShopPage()) {
            if (visibleCount >= sorted.length) {
                // 1. Change text and disable the button click
                showMoreBtn.textContent = 'No More Products';
                showMoreBtn.disabled = true;

                // 2. Change styling to a clean disabled gray state
                showMoreBtn.style.setProperty('border-color', '#9A8E7C', 'important');
                showMoreBtn.style.setProperty('color', '#9A8E7C', 'important');
                showMoreBtn.style.setProperty('cursor', 'not-allowed', 'important');
                showMoreBtn.style.setProperty('background', 'transparent', 'important');
            } else {
                // Restore original active state
                showMoreBtn.textContent = 'Show More';
                showMoreBtn.disabled = false;
                
                // Remove inline style modifications so your CSS takes back control
                showMoreBtn.style.removeProperty('border-color');
                showMoreBtn.style.removeProperty('color');
                showMoreBtn.style.removeProperty('cursor');
                showMoreBtn.style.removeProperty('background');
            }
        } else {
            // Home page keeps original default text and active behavior
            showMoreBtn.textContent = 'Show More';
            showMoreBtn.disabled = false;
            showMoreBtn.style.removeProperty('border-color');
            showMoreBtn.style.removeProperty('color');
            showMoreBtn.style.removeProperty('cursor');
            showMoreBtn.style.removeProperty('background');
        }
    }
    // Inject card styles once
    if (!document.getElementById('furniro-card-styles')) {
        const style = document.createElement('style');
        style.id = 'furniro-card-styles';
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Jost:wght@300;400;500;600&display=swap');

            .furniro-card {
                background: #FEFCF8;
                border-radius: 16px;
                border: 1px solid #EDE8E0;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                transition: box-shadow 0.3s ease, transform 0.3s ease;
                position: relative;
                font-family: 'Jost', sans-serif;
            }
            .furniro-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 20px 48px rgba(90, 60, 20, 0.12);
            }
            .furniro-card .card-img-wrap {
                position: relative;
                width: 100%;
                height: 230px;
                background: #F4F0E8;
                overflow: hidden;
                flex-shrink: 0;
            }
            .furniro-card .card-img-wrap img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
                transition: transform 0.5s ease;
            }
            .furniro-card:hover .card-img-wrap img {
                transform: scale(1.06);
            }
            .furniro-card .card-badges {
                position: absolute;
                top: 12px;
                left: 12px;
                display: flex;
                gap: 6px;
                z-index: 2;
            }
            .furniro-card .badge {
                font-size: 11px;
                font-weight: 600;
                padding: 3px 10px;
                border-radius: 20px;
                letter-spacing: 0.3px;
                font-family: 'Jost', sans-serif;
            }
            .furniro-card .badge-new  { background: #B88E2F; color: #fff; }
            .furniro-card .badge-sale { background: #E97171; color: #fff; }
            .furniro-card .card-wish {
                position: absolute;
                top: 12px;
                right: 12px;
                z-index: 2;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: rgba(255,255,255,0.9);
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transform: scale(0.8);
                transition: opacity 0.25s ease, transform 0.25s ease, background 0.2s;
            }
            .furniro-card:hover .card-wish { opacity: 1; transform: scale(1); }
            .furniro-card .card-wish:hover { background: #fff; }
            .furniro-card .card-wish.liked { opacity: 1; transform: scale(1); }
            .furniro-card .card-wish.liked svg path { fill: #E97171; stroke: #E97171; }
            .furniro-card .card-body {
                padding: 16px 18px 18px;
                display: flex;
                flex-direction: column;
                flex: 1;
            }
            .furniro-card .card-category {
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 1.2px;
                text-transform: uppercase;
                color: #B88E2F;
                margin: 0 0 5px;
            }
            .furniro-card .card-name {
                font-family: poppins;
                font-size: 16px;
                font-weight: 600;
                color: #2C2416;
                line-height: 1.35;
                margin: 0 0 6px;
                text-decoration: none;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                overflow: hidden;
                transition: color 0.2s;
            }
            .furniro-card .card-name:hover { color: #B88E2F; }
            .furniro-card .card-desc {
                font-size: 12.5px;
                color: #9A8E7C;
                line-height: 1.6;
                margin: 0;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                flex: 1;
                min-height: 40px;
            }
            .furniro-card .card-stars {
                font-size: 13px;
                color: #B88E2F;
                margin: 8px 0 0;
                letter-spacing: 1px;
            }
            .furniro-card .card-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                margin-top: 14px;
                padding-top: 14px;
                border-top: 1px solid #EDE8E0;
            }
            .furniro-card .price-block { display: flex; flex-direction: column; gap: 1px; flex-shrink: 0; }
            .furniro-card .price-current {
                font-size: 15px;
                font-weight: 600;
                color: #2C2416;
                font-family: 'Jost', sans-serif;
            }
            .furniro-card .price-original {
                font-size: 11.5px;
                color: #C0B49A;
                text-decoration: line-through;
            }
            .furniro-card .view-btn {
                background: #B88E2F;
                color: #fff;
                border: none;
                padding: 9px 16px;
                border-radius: 30px;
                font-family: 'Jost', sans-serif;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: 0.4px;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                white-space: nowrap;
                transition: background 0.2s ease;
                flex-shrink: 0;
            }
            .furniro-card .view-btn:hover { background: #9A7320; }
        `;
        document.head.appendChild(style);
    }

    grid.innerHTML = '';

    visible.forEach(product => {
        const fullStars = Math.floor(product.rating);
        const halfStar = product.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        const stars = '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);

        const formattedPrice    = product.price.toLocaleString();
        const formattedOriginal = product.originalPrice.toLocaleString();

        const card = document.createElement('div');
        card.className = 'furniro-card';
        card.dataset.id = product.id;

        card.innerHTML = `
            <div class="card-img-wrap">
                <img src="${product.image}"
                     alt="${product.name}"
                     onerror="this.src='https://via.placeholder.com/400x300/F4F0E8/9A8E7C?text=No+Image'">

                <div class="card-badges">
                    ${product.isNew ? '<span class="badge badge-new">New</span>' : ''}
                    ${product.discount > 0 ? `<span class="badge badge-sale">−${product.discount}%</span>` : ''}
                </div>

                <button class="card-wish" aria-label="Add to wishlist">
                    <svg viewBox="0 0 24 24" fill="none" width="15" height="15">
                        <path d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z"
                              stroke="#B88E2F" stroke-width="1.5" fill="none"/>
                    </svg>
                </button>
            </div>

            <div class="card-body">
                <p class="card-category">${product.category ?? 'Furniture'}</p>

                <a href="product.html?id=${product.id}" class="card-name">${product.name}</a>

                <p class="card-desc">${product.description}</p>

                <div class="card-stars" title="${product.rating} out of 5">${stars} <span style="font-size:11px;color:#9A8E7C;font-family:'Jost',sans-serif;">(${product.rating})</span></div>

                <div class="card-footer">
                    <div class="price-block">
                        <span class="price-current">Rp ${formattedPrice}</span>
                        ${product.discount > 0 ? `<span class="price-original">Rp ${formattedOriginal}</span>` : ''}
                    </div>
                    <a href="product.html?id=${product.id}" class="view-btn">View Details</a>
                </div>
            </div>
        `;

        // Wishlist toggle
        card.querySelector('.card-wish').addEventListener('click', (e) => {
            e.preventDefault();
            e.currentTarget.classList.toggle('liked');
        });

        grid.appendChild(card);
    });
}

// function handleShowMore() {
//     const showMoreBtn = document.getElementById('show-more-btn');
//     if (!showMoreBtn) return;

//     showMoreBtn.addEventListener('click', () => {
      
//         visibleCount += 8; 
//         renderProducts();
//     });
// }

function handleShowMore() {
    const showMoreBtn = document.getElementById('show-more-btn');
    if (!showMoreBtn) return;

    showMoreBtn.addEventListener('click', () => {
        if (isShopPage()) {

            visibleCount += 8; 
            renderProducts();
        } else {
     
            window.location.href = 'shop.html';
        }
    });
}
// --------------------------------- Filter Functions -------------------

function applyFilters() {
    filteredProducts = allProducts.filter(product => {
        const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;

        let priceMatch = true;
        if (selectedPrice !== 'all') {
            const [min, max] = selectedPrice.split('-').map(v => v === '+' ? Infinity : parseFloat(v));
            if (selectedPrice === '1000+') {
                priceMatch = product.price >= 1000;
            } else {
                priceMatch = product.price >= min && product.price <= max;
            }
        }

        return categoryMatch && priceMatch;
    });

    visibleCount = 8;
    renderProducts();
}

function handleFilterBar() {
    const showCount = document.getElementById('show-count');
    const sortBy = document.getElementById('sort-by');
    const gridBtn = document.getElementById('grid-view');
    const listBtn = document.getElementById('list-view');
    const grid = document.getElementById('products-grid');

    if (!showCount || !sortBy) return;

    showCount.addEventListener('change', () => {
        visibleCount = parseInt(showCount.value);
        renderProducts();
    });

    sortBy.addEventListener('change', () => {
        currentSort = sortBy.value;
        renderProducts();
    });

    if (gridBtn) {
        gridBtn.addEventListener('click', () => {
            grid.classList.remove('list-layout');
            gridBtn.classList.add('active-view');
            if (listBtn) listBtn.classList.remove('active-view');
        });
    }

    if (listBtn) {
        listBtn.addEventListener('click', () => {
            grid.classList.add('list-layout');
            listBtn.classList.add('active-view');
            if (gridBtn) gridBtn.classList.remove('active-view');
        });
    }
}

function handleFilterDropdown() {
    const filterBtn = document.getElementById('filter-icon-btn');
    const dropdown = document.getElementById('filter-dropdown');
    const container = filterBtn.parentElement;
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    const priceCheckboxes = document.querySelectorAll('.price-checkbox');
    const applyBtn = document.getElementById('filter-apply-btn');
    const chevronIcon = filterBtn?.querySelector('.chevron-icon');

    if (!filterBtn || !dropdown) return;

    filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
        if (chevronIcon) chevronIcon.classList.toggle('rotate-180');
    });

    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            dropdown.classList.remove('show');
            if (chevronIcon) chevronIcon.classList.remove('rotate-180');
        }
    });

    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.value === 'all') {
                categoryCheckboxes.forEach(cb => {
                    if (cb.value === 'all') cb.checked = true;
                    else cb.checked = false;
                });
            } else {
                const checkedOthers = document.querySelectorAll('.category-checkbox:not([value="all"]):checked');
                const allCheckbox = document.querySelector('.category-checkbox[value="all"]');
                if (checkedOthers.length > 0) {
                    allCheckbox.checked = false;
                } else {
                    allCheckbox.checked = true;
                }
            }
        });
    });

    priceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.value === 'all') {
                priceCheckboxes.forEach(cb => {
                    if (cb.value === 'all') cb.checked = true;
                    else cb.checked = false;
                });
            } else {
                const checkedOthers = document.querySelectorAll('.price-checkbox:not([value="all"]):checked');
                const allCheckbox = document.querySelector('.price-checkbox[value="all"]');
                if (checkedOthers.length > 0) {
                    allCheckbox.checked = false;
                } else {
                    allCheckbox.checked = true;
                }
            }
        });
    });

    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const checkedCategory = document.querySelector('.category-checkbox:checked');
            const checkedPrice = document.querySelector('.price-checkbox:checked');

            selectedCategory = checkedCategory ? checkedCategory.value : 'all';
            selectedPrice = checkedPrice ? checkedPrice.value : 'all';

            applyFilters();

            dropdown.classList.remove('show');
            if (chevronIcon) chevronIcon.classList.remove('rotate-180');
        });
    }
}

// --------------------------------- Initialize -------------------

function isCartPage() {
    return window.location.pathname.includes('cart.html');
}

function isShopPage() {
    return window.location.pathname.includes('shop.html');
}

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', handleActiveLinks);

fetch('products.json')
    .then(res => res.json())
    .then(data => {
        allProducts = data.products;
        filteredProducts = [...allProducts];

        initCart();

        if (isCartPage()) {
            renderCart();
        } else if (isShopPage()) {
            const urlCategory = getUrlParameter('category');
            if (urlCategory) {
                selectedCategory = urlCategory;
                const categoryCheckbox = document.querySelector(`.category-checkbox[value="${urlCategory}"]`);
                if (categoryCheckbox) {
                    const allCheckbox = document.querySelector('.category-checkbox[value="all"]');
                    if (allCheckbox) allCheckbox.checked = false;
                    categoryCheckbox.checked = true;
                }
                applyFilters();
            }
            renderProducts();
            handleFilterBar();
            handleFilterDropdown();
            handleShowMore();
        } else {
            renderProducts();
            handleShowMore();
        }
    })
    .catch(err => console.error('Fetch error:', err));
