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


window.addEventListener('DOMContentLoaded', handleActiveLinks);
// handleActiveLinks();



// --------------------------------- display products -------------------

// fetch('products.json').then(res => res.json() ).then(data => {console.log(data)});

// fetch('products.json')
//     .then(res => res.json())
//     .then(data => {

//         const products = data.products;
//         const grid = document.getElementById('products-grid');
//         const showMoreBtn = document.getElementById('products-btn');

//         let visibleCount = 8; 

//         function renderProducts() {

//             grid.innerHTML = ''; 

     
//             const visible = products.slice(0, visibleCount);

//             visible.forEach(product => {
             
//                 const fullStars = Math.floor(product.rating);
//                 const halfStar = product.rating % 1 >= 0.5;
//                 const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
//                 const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);

//                 grid.innerHTML += `
//                 <div class="product-card">
//                     <div class="product-img">
//                         <img src="${product.image}" alt="${product.name}">
//                         ${product.isNew ? '<div class="badge-new">New</div>' : ''}
//                         ${product.discount > 0 ? `<div class="badge-sale">-${product.discount}%</div>` : ''}
//                     </div>
//                     <div class="product-desc">
//                         <div class="stars">
//                             <span>${stars}</span>
//                             <span class="reviews">(${product.reviews})</span>
//                         </div>
//                         <h3>${product.name}</h3>
//                         <p>${product.description}</p>
//                         <div class="price-group">
//                             <span class="new">Rp ${product.price.toLocaleString()}</span>
//                             ${product.discount > 0 ? `<span class="old">Rp ${product.originalPrice.toLocaleString()}</span>` : ''}
//                         </div>
//                     </div>
//                     <div class="card-hover">
//                         <button>Add To Cart</button>
//                         <div class="options">
//                           <span class="option-like">
//                                 <i class="fa-regular fa-heart"></i> Like
//                             </span>
                          
//                             <span class="option-compare">
//                                 <i class="fa fa-right-left"></i> Compare
//                             </span>
//                             <span class="option-share">
//                                 <i class="fa-solid fa-share"></i> Share
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             `;
//             });
            
//             if (visibleCount >= products.length) {
//                 showMoreBtn.style.display = 'none';
//             }
//         }

       
//         renderProducts();

      
//         showMoreBtn.addEventListener('click', () => {
//             visibleCount += 4; 
//             renderProducts();
//         });

//     });







    // ----------------------------

    

    function handleFilterBar() {
        const showCount  = document.getElementById('show-count');
        const sortBy     = document.getElementById('sort-by');
        const gridBtn    = document.getElementById('grid-view');
        const listBtn    = document.getElementById('list-view');
        const grid       = document.getElementById('products-grid');
    
        if (!showCount || !sortBy) return;
    
        // ── Show count changes ──────────────────────────
        showCount.addEventListener('change', () => {
            visibleCount = parseInt(showCount.value);
            renderProducts();
        });
    
        // ── Sort changes ────────────────────────────────
        sortBy.addEventListener('change', () => {
            currentSort = sortBy.value;
            renderProducts();
        });
    
        // ── Grid view ───────────────────────────────────
        gridBtn.addEventListener('click', () => {
            grid.classList.remove('list-layout');
            gridBtn.classList.add('active-view');
            listBtn.classList.remove('active-view');
        });
    
        // ── List view ───────────────────────────────────
        listBtn.addEventListener('click', () => {
            grid.classList.add('list-layout');
            listBtn.classList.add('active-view');
            gridBtn.classList.remove('active-view');
        });
    }

    // add these variables at the top of script.js
let visibleCount = 8;
let currentSort  = 'default';
let allProducts  = [];
let filteredProducts = [];

let selectedCategory = 'all';
let selectedPrice = 'all';

function renderProducts() {
    const grid         = document.getElementById('products-grid');
    const showingCount = document.getElementById('showing-count');
    const totalCount   = document.getElementById('total-count');
    const showMoreBtn  = document.getElementById('show-more-btn');

    if (!grid) return;

    let sorted = [...filteredProducts];
    if (currentSort === 'price_low')  sorted.sort((a, b) => a.price - b.price);
    if (currentSort === 'price_high') sorted.sort((a, b) => b.price - a.price);
    if (currentSort === 'rating')     sorted.sort((a, b) => b.rating - a.rating);
    if (currentSort === 'newest')     sorted = sorted.filter(p => p.isNew).concat(sorted.filter(p => !p.isNew));

    const visible = sorted.slice(0, visibleCount);

    if (showingCount) showingCount.textContent = visible.length;
    if (totalCount)   totalCount.textContent   = filteredProducts.length;

    if (showMoreBtn) {
        showMoreBtn.style.display = visibleCount >= sorted.length ? 'none' : 'block';
    }

    grid.innerHTML = '';

    visible.forEach(product => {

        const fullStars  = Math.floor(product.rating);
        const halfStar   = product.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        const stars      = '★'.repeat(fullStars)
                         + (halfStar ? '⭐' : '')
                         + '☆'.repeat(emptyStars);

        const formattedPrice    = product.price.toLocaleString();
        const formattedOriginal = product.originalPrice.toLocaleString();

        grid.innerHTML += `
            <div class="product-card">

                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.isNew
                        ? '<div class="badge-new">New</div>'
                        : ''
                    }
                    ${product.discount > 0
                        ? `<div class="badge-sale">-${product.discount}%</div>`
                        : ''
                    }
                </div>

                <div class="product-desc">
                    <div class="stars">
                        <span class="star-icons">${stars}</span>
                        <span class="reviews">(${product.reviews})</span>
                    </div>
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="price-group">
                        <span class="new">Rp ${formattedPrice}</span>
                        ${product.discount > 0
                            ? `<span class="old">Rp ${formattedOriginal}</span>`
                            : ''
                        }
                    </div>
                </div>

                <div class="card-hover">
                    <button>Add To Cart</button>
                    <div class="options">
                        <span class="option-like">
                            <i class="fa-regular fa-heart"></i> Like
                        </span>
                        <span class="option-compare">
                            <i class="fa fa-right-left"></i> Compare
                        </span>
                        <span class="option-share">
                            <i class="fa-solid fa-share"></i> Share
                        </span>
                    </div>
                </div>

            </div>
        `;
    });
}

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

function handleFilterDropdown() {
    const filterBtn = document.getElementById('filter-icon-btn');
    const dropdown = document.getElementById('filter-dropdown');
    const container = filterBtn.parentElement;
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    const priceCheckboxes = document.querySelectorAll('.price-checkbox');
    const applyBtn = document.getElementById('filter-apply-btn');

    if (!filterBtn || !dropdown) return;

    filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
        container.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            dropdown.classList.remove('show');
            container.classList.remove('active');
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

    applyBtn.addEventListener('click', () => {
        const checkedCategory = document.querySelector('.category-checkbox:checked');
        const checkedPrice = document.querySelector('.price-checkbox:checked');

        selectedCategory = checkedCategory ? checkedCategory.value : 'all';
        selectedPrice = checkedPrice ? checkedPrice.value : 'all';

        applyFilters();

        dropdown.classList.remove('show');
        container.classList.remove('active');
    });
}

fetch('products.json')
    .then(res => res.json())
    .then(data => {
        allProducts = data.products;
        filteredProducts = [...allProducts];
        renderProducts();
        handleFilterBar();
        handleFilterDropdown();
    })
    .catch(err => console.error('Fetch error:', err));