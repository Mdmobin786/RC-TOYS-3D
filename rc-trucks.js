// RC Trucks Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Ensure navbar highlight
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class to the RC Trucks link
        if (link.getAttribute('href') === 'rc-trucks.html') {
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
    const truckCards = document.querySelectorAll('.truck-card');
    
    const applyFiltersAndSort = () => {
        const sortBy = sortBySelect.value;
        const filterType = filterTypeSelect.value;
        
        // Create array from truck cards for sorting
        const truckCardsArray = Array.from(truckCards);
        
        // Filter trucks based on type
        truckCardsArray.forEach(card => {
            const type = card.getAttribute('data-type');
            let showCard = true;
            
            if (filterType !== 'all' && type !== filterType) {
                showCard = false;
            }
            
            card.style.display = showCard ? 'block' : 'none';
        });
        
        // Get visible cards for sorting
        const visibleCards = truckCardsArray.filter(card => card.style.display !== 'none');
        
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
        const trucksGrid = document.querySelector('.trucks-grid');
        visibleCards.forEach(card => {
            trucksGrid.appendChild(card);
        });
    };
    
    // Event listeners for filters and sort
    if (sortBySelect && filterTypeSelect) {
        sortBySelect.addEventListener('change', applyFiltersAndSort);
        filterTypeSelect.addEventListener('change', applyFiltersAndSort);
        
        // Initialize with default sort and filter
        applyFiltersAndSort();
    }
}); 