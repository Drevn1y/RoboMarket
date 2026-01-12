// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// API Base URL
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Load featured ads on page load
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedAds();
});

// Load featured ads from API
async function loadFeaturedAds() {
    try {
        const response = await fetch(`${API_BASE_URL}/items/get-all-available`);
        if (!response.ok) {
            throw new Error('Failed to fetch items');
        }
        
        let items = await response.json();
        // Shuffle items randomly
        items = items.sort(() => Math.random() - 0.5);
        const featuredAdsContainer = document.querySelector('.grid.grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-4');
        
        if (featuredAdsContainer) {
            featuredAdsContainer.innerHTML = '';
            
            // Display 8 random items
            const itemsToShow = items.slice(0, 8);
            
            for (const item of itemsToShow) {
                const adCard = await createAdCard(item);
                featuredAdsContainer.appendChild(adCard);
            }
        }
    } catch (error) {
        console.error('Error loading featured ads:', error);
        // Fallback to static content if API fails
    }
}

// Create ad card element
async function createAdCard(item) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg overflow-hidden shadow-md ad-card transition-all duration-300 cursor-pointer';
    card.onclick = () => navigateToAnnouncement(item.itemId);

    // Получаем фото через API
    let imageUrl = 'https://via.placeholder.com/300x200?text=Нет+фото'; // fallback
    try {
        const photosResponse = await fetch(`${API_BASE_URL}/items/item/photos/${item.itemId}`);
        if (photosResponse.ok) {
            const photos = await photosResponse.json();
            if (photos && photos.length > 0 && photos[0]) {
                imageUrl = photos[0].startsWith('http') ? photos[0] : `${API_BASE_URL}/${photos[0]}`;
            }
        }
    } catch (e) {
        // fallback already set
    }
    
    // Format price
    let priceText;
    if (item.typeMoney === 'FREE') {
        priceText = 'Бесплатно';
    } else if (item.typeMoney === 'NEGOTIABLE') {
        priceText = `${item.itemPrice.toLocaleString()} ${item.typePrice} (Договорная)`;
    } else {
        priceText = `${item.itemPrice.toLocaleString()} ${item.typePrice}`;
    }
    
    // Format date
    const date = new Date(item.createdAt);
    const dateText = formatDate(date);
    
    card.innerHTML = `
        <div class="relative">
            <img src="${imageUrl}" alt="${item.itemName}" class="w-full h-48 object-cover">
        </div>
        <div class="p-4">
            <h3 class="font-bold text-lg mb-1 truncate">${item.itemName}</h3>
            <p class="text-gray-600 text-sm mb-2 line-clamp-2">${item.itemDescription}</p>
            <div class="flex justify-between items-center">
                <span class="font-bold text-blue-600">${priceText}</span>
                <span class="text-gray-500 text-sm">${dateText}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Navigate to announcement page
function navigateToAnnouncement(itemId) {
    window.location.href = `announcement.html?id=${itemId}`;
}

// Format date
function formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Сегодня';
    } else if (diffDays === 2) {
        return 'Вчера';
    } else if (diffDays <= 7) {
        return `${diffDays - 1} дней назад`;
    } else {
        return date.toLocaleDateString('ru-RU');
    }
}

document.querySelector('.bg-blue-700.rounded-r-full')?.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'search.html';
});