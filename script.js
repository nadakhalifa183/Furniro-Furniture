// fetch('products.json').then(res => res.json() ).then(data => {console.log(data)});

fetch('products.json')
    .then(res => res.json())
    .then(data => {

        const products = data.products;
        const grid = document.getElementById('products-grid');
        const showMoreBtn = document.getElementById('products-btn');

        let visibleCount = 8; // show 8 at start

        function renderProducts() {

            grid.innerHTML = ''; // clear grid first

            // only show products up to visibleCount
            const visible = products.slice(0, visibleCount);

            visible.forEach(product => {
                // Generate star display from rating
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
            // hide button if all products shown
            if (visibleCount >= products.length) {
                showMoreBtn.style.display = 'none';
            }
        }

        // first render
        renderProducts();

        // show more click
        showMoreBtn.addEventListener('click', () => {
            visibleCount += 4; // load 4 more each click
            renderProducts();
        });

    });