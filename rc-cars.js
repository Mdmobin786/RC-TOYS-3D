// RC Cars Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Ensure navbar highlight
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class to the RC Cars link
        if (link.getAttribute('href') === 'rc-cars.html') {
            link.classList.add('active');
        }
    });
    
    // Add to cart button click handlers (delegating to cart.js)
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const id = parseInt(button.getAttribute('data-id'));
            const name = button.getAttribute('data-name');
            const price = parseInt(button.getAttribute('data-price'));
            
            // Call the addToCart function from cart.js
            if (window.addToCart) {
                window.addToCart(id, name, price);
            }
        });
    });
    
    // Filtering and sorting functionality
    const sortBySelect = document.getElementById('sort-by');
    const filterSpeedSelect = document.getElementById('filter-speed');
    const carCards = document.querySelectorAll('.car-card');
    
    const applyFiltersAndSort = () => {
        const sortBy = sortBySelect.value;
        const filterSpeed = filterSpeedSelect.value;
        
        // Create array from car cards for sorting
        const carCardsArray = Array.from(carCards);
        
        // Filter cars based on speed
        carCardsArray.forEach(card => {
            const speed = parseInt(card.getAttribute('data-speed'));
            let showCard = true;
            
            if (filterSpeed === 'beginner' && (speed < 10 || speed > 20)) {
                showCard = false;
            } else if (filterSpeed === 'intermediate' && (speed < 20 || speed > 40)) {
                showCard = false;
            } else if (filterSpeed === 'advanced' && speed < 40) {
                showCard = false;
            }
            
            card.style.display = showCard ? 'block' : 'none';
        });
        
        // Get visible cards for sorting
        const visibleCards = carCardsArray.filter(card => card.style.display !== 'none');
        
        // Sort cards
        switch(sortBy) {
            case 'price-low':
                visibleCards.sort((a, b) => {
                    return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
                });
                break;
            case 'price-high':
                visibleCards.sort((a, b) => {
                    return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
                });
                break;
            case 'newest':
                // For demo purposes, just reverse the order to simulate newest first
                visibleCards.reverse();
                break;
        }
        
        // Rearrange in DOM
        const carsGrid = document.querySelector('.cars-grid');
        visibleCards.forEach(card => {
            carsGrid.appendChild(card);
        });
    };
    
    // Event listeners for filters and sort
    sortBySelect.addEventListener('change', applyFiltersAndSort);
    filterSpeedSelect.addEventListener('change', applyFiltersAndSort);
    
    // Initialize with default sort and filter
    applyFiltersAndSort();
}); 