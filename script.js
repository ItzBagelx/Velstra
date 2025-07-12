
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollInView({
                behavior: 'smooth'
            });
        });
    });

    // Mobile navigation toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (navbarToggler && navbarMenu) {
        navbarToggler.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
        });
    }

    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    }

    function addToCart(productId, productName, productPrice, quantity) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id: productId, name: productName, price: productPrice, quantity: quantity });
        }
        saveCart();
        alert(`${quantity} x ${productName} added to cart!`);
    }

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const productName = this.dataset.productName;
            const productPrice = parseFloat(this.dataset.productPrice);
            const quantityInput = this.previousElementSibling; // Assuming input is right before the button
            const quantity = parseInt(quantityInput.value);
            if (quantity > 0) {
                addToCart(productId, productName, productPrice, quantity);
            } else {
                alert('Please enter a valid quantity.');
            }
        });
    });

    // Cart page specific functions
    if (window.location.pathname.includes('cart.html')) {
        function renderCart() {
            const cartItemsContainer = document.getElementById('cart-items');
            const cartTotalElement = document.getElementById('cart-total');
            cartItemsContainer.innerHTML = '';
            let total = 0;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            } else {
                cart.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.classList.add('cart-item');
                    itemElement.innerHTML = `
                        <div class="cart-item-details">
                            <h3>${item.name}</h3>
                            <p>Price: £${item.price.toFixed(2)}</p>
                            <p>Quantity: <input type="number" value="${item.quantity}" min="1" data-product-id="${item.id}" class="item-quantity-input"></p>
                        </div>
                        <button class="remove-item-btn" data-product-id="${item.id}">Remove</button>
                    `;
                    cartItemsContainer.appendChild(itemElement);
                    total += item.price * item.quantity;
                });
            }

            cartTotalElement.textContent = total.toFixed(2);
            addCartEventListeners();
        }

        function addCartEventListeners() {
            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.dataset.productId;
                    cart = cart.filter(item => item.id !== productId);
                    saveCart();
                    renderCart();
                });
            });

            document.querySelectorAll('.item-quantity-input').forEach(input => {
                input.addEventListener('change', function() {
                    const productId = this.dataset.productId;
                    const newQuantity = parseInt(this.value);
                    const item = cart.find(item => item.id === productId);
                    if (item && newQuantity > 0) {
                        item.quantity = newQuantity;
                    } else if (item && newQuantity <= 0) {
                        cart = cart.filter(item => item.id !== productId);
                    }
                    saveCart();
                    renderCart();
                });
            });

            const checkoutBtn = document.getElementById('checkout-btn');
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', function() {
                    if (cart.length > 0) {
                        alert('Simulated Checkout: Your order has been placed!\nTotal: £' + document.getElementById('cart-total').textContent);
                        cart = [];
                        saveCart();
                        renderCart();
                    } else {
                        alert('Your cart is empty. Please add items before checking out.');
                    }
                });
            }
        }

        renderCart();
    }

    updateCartCount(); // Initial cart count update on all pages
});
