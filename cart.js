// Professional Shopping Cart System for RC Toy World
document.addEventListener('DOMContentLoaded', function() {
    // Cart Elements
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const totalAmount = document.querySelector('.total-amount');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const closeCartBtn = document.querySelector('.close-cart');
    
    // Get cart from localStorage or initialize empty cart
    let cart = JSON.parse(localStorage.getItem('rcToyCart')) || [];
    
    // Initialize cart
    updateCartDisplay();
    
    // Add to cart function (exposed globally for all pages)
    window.addToCart = function(id, name, price, image = null) {
        const existingItemIndex = cart.findIndex(item => item.id === id);
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }
        
        // Save cart to localStorage
        saveCart();
        
        // Update cart display
        updateCartDisplay();
        
        // Show notification
        showAddToCartNotification(name);
    };
    
    // Show notification when product is added to cart
    function showAddToCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="notification-content">
                <p><strong>${productName}</strong> added to cart</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 2500);
    }
    
    // Update cart display
    function updateCartDisplay() {
        // Update cart count
        if (cartCount) {
            const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = itemCount;
            cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
        }
        
        // If cart modal doesn't exist, don't continue
        if (!cartItemsContainer) return;
        
        // Clear cart items
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            // Show empty cart message
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <p>Your cart is empty</p>
                    <a href="index.html" class="continue-shopping">Continue Shopping</a>
                </div>
            `;
            
            // Hide checkout button
            if (cartTotal) {
                totalAmount.textContent = '₹0';
                checkoutBtn.style.display = 'none';
            }
            
            return;
        }
        
        // Show checkout button
        if (checkoutBtn) {
            checkoutBtn.style.display = 'block';
        }
        
        // Calculate total
        let total = 0;
        
        // Add items to cart
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            // Create cart item element
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            // Default image if none provided
            const imageUrl = item.image || 'images/product-placeholder.jpg';
            
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${imageUrl}" alt="${item.name}" onerror="this.src='images/product-placeholder.jpg'">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <div class="item-total">₹${itemTotal.toLocaleString()}</div>
                    <button class="remove-item" data-index="${index}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Update total price
        if (totalAmount) {
            totalAmount.textContent = `₹${total.toLocaleString()}`;
        }
        
        // Add event listeners to cart item buttons
        attachCartItemEventListeners();
    }
    
    // Attach event listeners to cart item buttons
    function attachCartItemEventListeners() {
        // Quantity decrease buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    // Remove item if quantity would be less than 1
                    cart.splice(index, 1);
                }
                
                saveCart();
                updateCartDisplay();
            });
        });
        
        // Quantity increase buttons
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity += 1;
                
                saveCart();
                updateCartDisplay();
            });
        });
        
        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                
                saveCart();
                updateCartDisplay();
            });
        });
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('rcToyCart', JSON.stringify(cart));
    }
    
    // Open cart modal
    if (cartIcon && cartModal) {
        cartIcon.addEventListener('click', function() {
            cartModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            updateCartDisplay();
        });
    }
    
    // Close cart modal
    if (closeCartBtn && cartModal) {
        closeCartBtn.addEventListener('click', function() {
            cartModal.style.display = 'none';
            document.body.style.overflow = '';
        });
        
        // Close when clicking outside the cart content
        window.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                cartModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    // Checkout process
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty. Add some products before checkout.');
                return;
            }
            
            // Start checkout process
            startCheckout();
        });
    }
    
    // Start checkout process
    function startCheckout() {
        // Hide cart items and show checkout form
        cartItemsContainer.style.display = 'none';
        cartTotal.style.display = 'none';
        
        // Calculate totals
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const tax = Math.round(subtotal * 0.18); // 18% tax
        const shipping = subtotal > 10000 ? 0 : 149; // Free shipping for orders over ₹10,000
        const total = subtotal + tax + shipping;
        
        // Create checkout form
        const checkoutForm = document.createElement('div');
        checkoutForm.className = 'checkout-container';
        
        checkoutForm.innerHTML = `
            <div class="checkout-steps">
                <div class="step active" data-step="1">1. Shipping</div>
                <div class="step" data-step="2">2. Payment</div>
                <div class="step" data-step="3">3. Review</div>
            </div>
            
            <div class="step-content" id="step-1">
                <h3>Shipping Information</h3>
                <form id="shipping-form" class="checkout-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="first-name">First Name*</label>
                            <input type="text" id="first-name" required>
                        </div>
                        <div class="form-group">
                            <label for="last-name">Last Name*</label>
                            <input type="text" id="last-name" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email Address*</label>
                        <input type="email" id="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Phone Number*</label>
                        <input type="tel" id="phone" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="address">Street Address*</label>
                        <input type="text" id="address" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="apartment">Apartment, Suite, etc. (optional)</label>
                        <input type="text" id="apartment">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="city">City*</label>
                            <input type="text" id="city" required>
                        </div>
                        <div class="form-group">
                            <label for="state">State*</label>
                            <select id="state" required>
                                <option value="">Select State</option>
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                <option value="Assam">Assam</option>
                                <option value="Bihar">Bihar</option>
                                <option value="Chhattisgarh">Chhattisgarh</option>
                                <option value="Goa">Goa</option>
                                <option value="Gujarat">Gujarat</option>
                                <option value="Haryana">Haryana</option>
                                <option value="Himachal Pradesh">Himachal Pradesh</option>
                                <option value="Jharkhand">Jharkhand</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Kerala">Kerala</option>
                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Manipur">Manipur</option>
                                <option value="Meghalaya">Meghalaya</option>
                                <option value="Mizoram">Mizoram</option>
                                <option value="Nagaland">Nagaland</option>
                                <option value="Odisha">Odisha</option>
                                <option value="Punjab">Punjab</option>
                                <option value="Rajasthan">Rajasthan</option>
                                <option value="Sikkim">Sikkim</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="Telangana">Telangana</option>
                                <option value="Tripura">Tripura</option>
                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                <option value="Uttarakhand">Uttarakhand</option>
                                <option value="West Bengal">West Bengal</option>
                                <option value="Delhi">Delhi</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="pincode">PIN Code*</label>
                            <input type="text" id="pincode" required>
                        </div>
                        <div class="form-group">
                            <label for="country">Country*</label>
                            <select id="country" required>
                                <option value="India">India</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-buttons">
                        <button type="button" class="back-to-cart-btn">Back to Cart</button>
                        <button type="submit" class="continue-btn">Continue to Payment</button>
                    </div>
                </form>
            </div>
            
            <div class="step-content" id="step-2" style="display: none;">
                <h3>Payment Method</h3>
                <form id="payment-form" class="checkout-form">
                    <div class="payment-options">
                        <div class="payment-option">
                            <input type="radio" id="creditcard" name="payment-method" value="creditcard" checked>
                            <label for="creditcard">
                                <span class="radio-label">Credit / Debit Card</span>
                                <div class="card-icons">
                                    <i class="fab fa-cc-visa"></i>
                                    <i class="fab fa-cc-mastercard"></i>
                                    <i class="fab fa-cc-amex"></i>
                                </div>
                            </label>
                        </div>
                        
                        <div class="payment-option">
                            <input type="radio" id="upi" name="payment-method" value="upi">
                            <label for="upi">
                                <span class="radio-label">UPI Payment</span>
                                <div class="upi-icons">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" class="upi-icon">
                                </div>
                            </label>
                        </div>
                        
                        <div class="payment-option">
                            <input type="radio" id="cod" name="payment-method" value="cod">
                            <label for="cod">
                                <span class="radio-label">Cash on Delivery</span>
                                <div class="cod-icon">
                                    <i class="fas fa-money-bill-wave"></i>
                                </div>
                            </label>
                        </div>
                    </div>
                    
                    <div id="creditcard-details" class="payment-details">
                        <div class="form-group">
                            <label for="cardnumber">Card Number*</label>
                            <input type="text" id="cardnumber" placeholder="1234 5678 9012 3456" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="expiry">Expiry Date*</label>
                                <input type="text" id="expiry" placeholder="MM/YY" required>
                            </div>
                            <div class="form-group">
                                <label for="cvv">CVV*</label>
                                <input type="password" id="cvv" placeholder="123" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="cardholder">Cardholder Name*</label>
                            <input type="text" id="cardholder" required>
                        </div>
                    </div>
                    
                    <div id="upi-details" class="payment-details" style="display: none;">
                        <div class="form-group">
                            <label for="upi-id">UPI ID*</label>
                            <input type="text" id="upi-id" placeholder="yourname@bank" required>
                        </div>
                    </div>
                    
                    <div id="cod-details" class="payment-details" style="display: none;">
                        <p class="cod-notice">
                            <i class="fas fa-info-circle"></i>
                            Payment will be collected at the time of delivery.
                        </p>
                    </div>
                    
                    <div class="form-buttons">
                        <button type="button" class="back-btn" data-step="1">Back</button>
                        <button type="submit" class="continue-btn">Continue to Review</button>
                    </div>
                </form>
            </div>
            
            <div class="step-content" id="step-3" style="display: none;">
                <h3>Order Review</h3>
                
                <div class="order-summary">
                    <h4>Order Items</h4>
                    <div class="review-items">
                        ${cart.map(item => `
                            <div class="review-item">
                                <div class="review-item-name">${item.name} × ${item.quantity}</div>
                                <div class="review-item-price">₹${(item.price * item.quantity).toLocaleString()}</div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="review-totals">
                        <div class="review-total-row">
                            <span>Subtotal</span>
                            <span>₹${subtotal.toLocaleString()}</span>
                        </div>
                        <div class="review-total-row">
                            <span>Tax (18%)</span>
                            <span>₹${tax.toLocaleString()}</span>
                        </div>
                        <div class="review-total-row">
                            <span>Shipping</span>
                            <span>${shipping === 0 ? 'Free' : '₹' + shipping.toLocaleString()}</span>
                        </div>
                        <div class="review-total-row grand-total">
                            <span>Total</span>
                            <span>₹${total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                <div class="review-sections">
                    <div class="review-section">
                        <h4>Shipping Address</h4>
                        <div id="review-address"></div>
                        <button class="edit-btn" data-step="1">Edit</button>
                    </div>
                    
                    <div class="review-section">
                        <h4>Payment Method</h4>
                        <div id="review-payment"></div>
                        <button class="edit-btn" data-step="2">Edit</button>
                    </div>
                </div>
                
                <div class="form-buttons">
                    <button type="button" class="back-btn" data-step="2">Back</button>
                    <button type="button" id="place-order-btn" class="place-order-btn">Place Order</button>
                </div>
            </div>
            
            <div class="step-content" id="order-confirmation" style="display: none;">
                <div class="order-success">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Order Placed Successfully!</h2>
                    <p>Your order has been received and is now being processed.</p>
                    <div class="order-number">
                        <span>Order #:</span>
                        <span id="order-id">RC-${Date.now().toString().substring(6)}</span>
                    </div>
                    <p>A confirmation email has been sent to <span id="confirmation-email"></span></p>
                    <button class="continue-shopping-btn">Continue Shopping</button>
                </div>
            </div>
        `;
        
        // Append checkout form to cart content
        document.querySelector('.cart-content').appendChild(checkoutForm);
        
        // Form submission event listeners
        const shippingForm = document.getElementById('shipping-form');
        const paymentForm = document.getElementById('payment-form');
        
        // Back to cart button
        document.querySelector('.back-to-cart-btn').addEventListener('click', function() {
            // Remove checkout form
            checkoutForm.remove();
            
            // Show cart items and total
            cartItemsContainer.style.display = '';
            cartTotal.style.display = '';
        });
        
        // Step navigation buttons
        document.querySelectorAll('.back-btn').forEach(button => {
            button.addEventListener('click', function() {
                const previousStep = this.getAttribute('data-step');
                navigateToStep(parseInt(previousStep));
            });
        });
        
        // Edit buttons in review page
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                const step = this.getAttribute('data-step');
                navigateToStep(parseInt(step));
            });
        });
        
        // Payment method radio buttons
        const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                // Hide all payment details
                document.querySelectorAll('.payment-details').forEach(details => {
                    details.style.display = 'none';
                });
                
                // Show selected payment details
                document.getElementById(`${this.value}-details`).style.display = 'block';
            });
        });
        
        // Shipping form submission
        shippingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect shipping data
            const shippingData = {
                firstName: document.getElementById('first-name').value,
                lastName: document.getElementById('last-name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                apartment: document.getElementById('apartment').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                pincode: document.getElementById('pincode').value,
                country: document.getElementById('country').value
            };
            
            // Store shipping data
            localStorage.setItem('rcToyShipping', JSON.stringify(shippingData));
            
            // Go to payment step
            navigateToStep(2);
        });
        
        // Payment form submission
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get selected payment method
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
            
            // Collect payment data
            const paymentData = {
                method: paymentMethod,
                cardNumber: paymentMethod === 'creditcard' ? document.getElementById('cardnumber').value : null,
                expiry: paymentMethod === 'creditcard' ? document.getElementById('expiry').value : null,
                cvv: paymentMethod === 'creditcard' ? document.getElementById('cvv').value : null,
                cardholderName: paymentMethod === 'creditcard' ? document.getElementById('cardholder').value : null,
                upiId: paymentMethod === 'upi' ? document.getElementById('upi-id').value : null
            };
            
            // Store payment data
            localStorage.setItem('rcToyPayment', JSON.stringify(paymentData));
            
            // Fill review page
            fillReviewPage();
            
            // Go to review step
            navigateToStep(3);
        });
        
        // Fill review page with collected data
        function fillReviewPage() {
            // Get shipping data
            const shippingData = JSON.parse(localStorage.getItem('rcToyShipping'));
            
            // Get payment data
            const paymentData = JSON.parse(localStorage.getItem('rcToyPayment'));
            
            // Fill shipping address
            const addressHtml = `
                <p>${shippingData.firstName} ${shippingData.lastName}</p>
                <p>${shippingData.address}</p>
                ${shippingData.apartment ? `<p>${shippingData.apartment}</p>` : ''}
                <p>${shippingData.city}, ${shippingData.state} ${shippingData.pincode}</p>
                <p>${shippingData.country}</p>
                <p>${shippingData.phone}</p>
                <p>${shippingData.email}</p>
            `;
            document.getElementById('review-address').innerHTML = addressHtml;
            
            // Fill payment method
            let paymentHtml = '';
            switch(paymentData.method) {
                case 'creditcard':
                    const maskedCard = '****' + paymentData.cardNumber.slice(-4);
                    paymentHtml = `
                        <p>Credit/Debit Card</p>
                        <p>${maskedCard}</p>
                        <p>${paymentData.cardholderName}</p>
                    `;
                    break;
                case 'upi':
                    paymentHtml = `
                        <p>UPI Payment</p>
                        <p>${paymentData.upiId}</p>
                    `;
                    break;
                case 'cod':
                    paymentHtml = `
                        <p>Cash on Delivery</p>
                    `;
                    break;
            }
            document.getElementById('review-payment').innerHTML = paymentHtml;
            
            // Save email for confirmation
            document.getElementById('confirmation-email').textContent = shippingData.email;
        }
        
        // Place order button
        document.getElementById('place-order-btn').addEventListener('click', function() {
            // Complete order
            completeOrder();
        });
        
        // Continue shopping button
        document.querySelector('.continue-shopping-btn').addEventListener('click', function() {
            // Clear cart
            cart = [];
            saveCart();
            
            // Close modal
            cartModal.style.display = 'none';
            document.body.style.overflow = '';
            
            // Remove checkout form
            setTimeout(() => {
                checkoutForm.remove();
                cartItemsContainer.style.display = '';
                cartTotal.style.display = '';
                updateCartDisplay();
            }, 500);
        });
        
        // Complete order function
        function completeOrder() {
            // Clear localStorage except for cart items
            localStorage.removeItem('rcToyShipping');
            localStorage.removeItem('rcToyPayment');
            
            // Show order confirmation
            navigateToStep(4);
        }
        
        // Function to navigate between steps
        function navigateToStep(stepNumber) {
            // Update active step
            document.querySelectorAll('.step').forEach(step => {
                const stepNum = parseInt(step.getAttribute('data-step'));
                if (stepNum <= stepNumber) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            });
            
            // Hide all step content
            document.querySelectorAll('.step-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Show current step content
            if (stepNumber === 4) {
                document.getElementById('order-confirmation').style.display = 'block';
            } else {
                document.getElementById(`step-${stepNumber}`).style.display = 'block';
            }
        }
    }
}); 