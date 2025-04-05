// RC Drones Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Ensure navbar highlight
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class to the RC Drones link
        if (link.getAttribute('href') === 'rc-drones.html') {
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
    const filterTypeSelect = document.getElementById('filter-type');
    const droneCards = document.querySelectorAll('.drone-card');
    
    const applyFiltersAndSort = () => {
        const sortBy = sortBySelect.value;
        const filterType = filterTypeSelect.value;
        
        // Create array from drone cards for sorting
        const droneCardsArray = Array.from(droneCards);
        
        // Filter drones based on type
        droneCardsArray.forEach(card => {
            const type = card.getAttribute('data-type');
            let showCard = true;
            
            if (filterType !== 'all' && type !== filterType) {
                showCard = false;
            }
            
            card.style.display = showCard ? 'block' : 'none';
        });
        
        // Get visible cards for sorting
        const visibleCards = droneCardsArray.filter(card => card.style.display !== 'none');
        
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
        const dronesGrid = document.querySelector('.drones-grid');
        visibleCards.forEach(card => {
            dronesGrid.appendChild(card);
        });
    };
    
    // Event listeners for filters and sort
    sortBySelect.addEventListener('change', applyFiltersAndSort);
    filterTypeSelect.addEventListener('change', applyFiltersAndSort);
    
    // Initialize with default sort and filter
    applyFiltersAndSort();
}); 