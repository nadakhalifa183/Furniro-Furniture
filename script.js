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

fetch('products.json')
    .then(res => res.json())
    .then(data => {

        const products = data.products;
        const grid = document.getElementById('products-grid');
        const showMoreBtn = document.getElementById('products-btn');

        let visibleCount = 8; 

        function renderProducts() {

            grid.innerHTML = ''; 

     
            const visible = products.slice(0, visibleCount);

            visible.forEach(product => {
             
                const fullStars = Math.floor(product.rating);
                const halfStar = product.rating % 1 >= 0.5;
                const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
                const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);

                grid.innerHTML += `
                <div class="product-card">
                    <div class="product-img">
                        <img src="${product.image}" alt="${product.name}">
                        ${product.isNew ? '<div class="badge-new">New</div>' : ''}
                        ${product.discount > 0 ? `<div class="badge-sale">-${product.discount}%</div>` : ''}
                    </div>
                    <div class="product-desc">
                        <div class="stars">
                            <span>${stars}</span>
                            <span class="reviews">(${product.reviews})</span>
                        </div>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="price-group">
                            <span class="new">Rp ${product.price.toLocaleString()}</span>
                            ${product.discount > 0 ? `<span class="old">Rp ${product.originalPrice.toLocaleString()}</span>` : ''}
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
            
            if (visibleCount >= products.length) {
                showMoreBtn.style.display = 'none';
            }
        }

       
        renderProducts();

      
        showMoreBtn.addEventListener('click', () => {
            visibleCount += 4; 
            renderProducts();
        });

    });