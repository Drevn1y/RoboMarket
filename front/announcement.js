// API Base URL
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = mobileMenuButton.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Get userId from localStorage
function getUserId() {
    const user = JSON.parse(localStorage.getItem('roboUser'));
    return user ? user.userId : null;
}

// Adjust layout based on screen size
function adjustLayout() {
    const isMobile = window.innerWidth < 768;
    const mainImage = document.getElementById('main-image');
    const galleryContainer = document.querySelector('.grid.grid-cols-3.gap-1, .grid.grid-cols-5.gap-2');
    const itemDetails = document.getElementById('item-details');
    const similarItems = document.getElementById('similar-items');

    if (isMobile) {
        mainImage.classList.remove('h-96');
        mainImage.classList.add('h-48');
        if (galleryContainer) galleryContainer.classList.replace('grid-cols-5', 'grid-cols-3');
        if (galleryContainer) galleryContainer.classList.replace('gap-2', 'gap-1');
        if (itemDetails) itemDetails.classList.remove('sm:grid-cols-2');
        if (similarItems) similarItems.classList.remove('sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4');
    } else {
        mainImage.classList.add('h-96');
        mainImage.classList.remove('h-48');
        if (galleryContainer) galleryContainer.classList.replace('grid-cols-3', 'grid-cols-5');
        if (galleryContainer) galleryContainer.classList.replace('gap-1', 'gap-2');
        if (itemDetails) itemDetails.classList.add('sm:grid-cols-2');
        if (similarItems) similarItems.classList.add('sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4');
    }
}

// Load item data on page load
document.addEventListener('DOMContentLoaded', function() {
    adjustLayout();
    window.addEventListener('resize', adjustLayout);
    loadItemData();
});

// Load item data from API
async function loadItemData() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('id');
        
        if (!itemId) {
            console.error('No item ID provided');
            return;
        }
        
        const itemResponse = await fetch(`${API_BASE_URL}/items/get/id/${itemId}`);
        if (!itemResponse.ok) {
            throw new Error('Failed to fetch item data');
        }
        
        const item = await itemResponse.json();
        
        const userResponse = await fetch(`${API_BASE_URL}/users/user/id/${item.ownerUserId}`);
        let user = null;
        if (userResponse.ok) {
            user = await userResponse.json();
        }

        let photos = [];
        try {
            const photosResponse = await fetch(`${API_BASE_URL}/items/item/photos/${itemId}`);
            if (photosResponse.ok) {
                photos = await photosResponse.json();
                console.log('Loaded photos:', photos);
            } else {
                console.warn('No photos returned or error:', photosResponse.status);
            }
        } catch (e) {
            console.error('Error loading item photos:', e);
        }
        
        // Check if item is in favorites
        const userId = getUserId();
        if (userId) {
            const favoriteStatus = await checkFavoriteStatus(userId, itemId);
            console.log('Favorite check response:', favoriteStatus); // Отладка
            updateFavoriteButton(favoriteStatus.isFavorite);
        }
        
        updateItemDisplay(item, user, photos);
        await loadSimilarItems(item.category, item.itemId);
        
    } catch (error) {
        console.error('Error loading item data:', error);
    }
}

// Update item display
function updateItemDisplay(item, user, photos) {
    document.title = `${item.itemName} | RoboMarket`;
    
    const mainImage = document.getElementById('main-image');
    const itemTitle = document.getElementById('item-title');
    const itemPrice = document.getElementById('item-price');
    const itemDescription = document.getElementById('item-description');
    const itemDetails = document.getElementById('item-details');
    const sellerInfo = document.getElementById('seller-info');
    const phoneNumber = document.getElementById('phone-number');
    const emailAddress = document.getElementById('email-address');

    if (photos && photos.length > 0 && photos[0]) {
        const imageUrl = photos[0].startsWith('http') ? photos[0] : `${API_BASE_URL}/${photos[0]}`;
        mainImage.src = imageUrl;
        mainImage.alt = item.itemName;
    } else {
        mainImage.src = 'https://via.placeholder.com/800x600?text=Нет+фото';
        mainImage.alt = 'Нет фото';
    }

    itemTitle.textContent = item.itemName;
    const priceText = item.typeMoney === 'FREE' ? 'Бесплатно' : 
                     item.typeMoney === 'NEGOTIABLE' ? 'Договорная' :
                     `${item.itemPrice.toLocaleString()} ${item.typePrice}`;
    itemPrice.textContent = priceText;

    itemDescription.textContent = item.itemDescription;

    const categoryMap = {
        'HOUSE': 'Недвижимость',
        'CHILDREN': 'Детский мир',
        'ELECTRONICS': 'Электроника',
        'TRANSPORT': 'Транспорт',
        'FURNITURE': 'Мебель',
        'ANIMAL': 'Животные',
        'FREE': 'Отдам даром',
        'OTHER': 'Прочие'
    };
    
    const typeMap = {
        'NEW': 'Новое',
        'USED': 'Б/у'
    };
    
    const sellerMap = {
        'PRIVATE': 'Частное лицо',
        'COMPANY': 'Компания'
    };
    
    const moneyTypeMap = {
        'FIXED': 'Фиксированная цена',
        'NEGOTIABLE': 'Договорная цена',
        'FREE': 'Бесплатно'
    };
    
    itemDetails.innerHTML = `
        <div class="grid grid-cols-1 gap-1 p-1 bg-gray-50 rounded-lg sm:grid-cols-2 sm:p-2">
            <div class="p-1 bg-white rounded-md border border-gray-200">
                <span class="text-gray-600 text-xs sm:text-sm">Категория:</span>
                <span class="font-medium text-blue-600 text-xs sm:text-sm">${categoryMap[item.category] || item.category}</span>
            </div>
            <div class="p-1 bg-white rounded-md border border-gray-200">
                <span class="text-gray-600 text-xs sm:text-sm">Состояние:</span>
                <span class="font-medium text-green-600 text-xs sm:text-sm">${typeMap[item.itemType] || item.itemType}</span>
            </div>
            <div class="p-1 bg-white rounded-md border border-gray-200">
                <span class="text-gray-600 text-xs sm:text-sm">Тип продавца:</span>
                <span class="font-medium text-purple-600 text-xs sm:text-sm">${sellerMap[item.typeSeller] || item.typeSeller}</span>
            </div>
            <div class="p-1 bg-white rounded-md border border-gray-200">
                <span class="text-gray-600 text-xs sm:text-sm">Тип цены:</span>
                <span class="font-medium text-yellow-600 text-xs sm:text-sm">${moneyTypeMap[item.typeMoney] || item.typeMoney}</span>
            </div>
            <div class="p-1 bg-white rounded-md border border-gray-200 col-span-1 sm:col-span-2">
                <span class="text-gray-600 text-xs sm:text-sm">Адрес:</span>
                <span class="font-medium text-gray-800 text-xs sm:text-sm">${item.address}</span>
            </div>
        </div>
    `;

    if (user) {
        sellerInfo.innerHTML = `
            <div class="flex items-center space-x-2 p-1 bg-white rounded-lg shadow-md sm:p-2 sm:space-x-3">
                <div class="w-8 h-8 bg-gray-300 rounded-full overflow-hidden sm:w-10 sm:h-10">
                    <img src="${API_BASE_URL}/users/${user.userId}/photo" 
                         alt="${user.firstName}" 
                         class="w-full h-full object-cover"
                         onerror="this.style.display='none'">
                </div>
                <div>
                    <h3 class="font-semibold text-sm sm:text-base">${user.firstName} ${user.lastName}</h3>
                </div>
            </div>
        `;
    } else {
        sellerInfo.innerHTML = `
            <div class="flex items-center space-x-2 p-1 bg-white rounded-lg shadow-md sm:p-2 sm:space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center sm:w-10 sm:h-10">
                    <i class="fas fa-user text-blue-600 text-sm sm:text-lg"></i>
                </div>
                <div>
                    <h3 class="font-semibold text-sm sm:text-base">${item.name}</h3>
                </div>
            </div>
        `;
    }

    if (phoneNumber) {
        phoneNumber.innerHTML = `<p class="font-medium text-sm sm:text-base">${item.phone}</p>`;
    }
    
    if (emailAddress) {
        emailAddress.innerHTML = `<p class="font-medium text-sm sm:text-base">${item.email}</p>`;
    }
    
    updateGallery(photos);
}

// Update gallery
function updateGallery(photos) {
    const galleryContainer = document.querySelector('.grid.grid-cols-3.gap-1, .grid.grid-cols-5.gap-2');
    if (!galleryContainer) return;
    
    galleryContainer.innerHTML = '';
    
    if (photos && photos.length > 0) {
        photos.forEach((photoPath, index) => {
            const div = document.createElement('div');
            div.className = 'bg-white rounded-md overflow-hidden shadow-sm';
            
            let imgSrc = photoPath.startsWith('http') ? photoPath : `${API_BASE_URL}/${photoPath}`;
            console.log(`Loading photo ${index + 1}: ${imgSrc}`);
            
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = `Фото ${index + 1}`;
            img.className = 'w-full h-12 object-cover cursor-pointer transition-transform hover:scale-105 sm:h-16';
            img.addEventListener('click', () => changeMainImage(img, index));
            img.addEventListener('touchend', (e) => {
                e.preventDefault();
                changeMainImage(img, index);
                openGallery();
            }, { passive: true });
            
            div.appendChild(img);
            galleryContainer.appendChild(div);
        });
        window.images = photos.map(photoPath => photoPath.startsWith('http') ? photoPath : `${API_BASE_URL}/${photoPath}`);
        window.currentImageIndex = 0;
        console.log('Gallery images set:', window.images);
    } else {
        console.warn('No photos available to display');
    }
}

// Load similar items
async function loadSimilarItems(category, excludeItemId) {
    try {
        const response = await fetch(`${API_BASE_URL}/items/get-by-category/?category=${category}`);
        if (!response.ok) {
            throw new Error('Failed to fetch similar items');
        }
        
        const items = await response.json();
        
        const similarItems = items
            .filter(item => item.itemId !== excludeItemId)
            .slice(0, 4);
        
        const similarContainer = document.getElementById('similar-items');
        if (similarContainer) {
            similarContainer.innerHTML = '';
            
            for (const item of similarItems) {
                const itemCard = await createSimilarItemCard(item);
                similarContainer.appendChild(itemCard);
            }
        }
    } catch (error) {
        console.error('Error loading similar items:', error);
    }
}

// Create similar item card
async function createSimilarItemCard(item) {
    const card = document.createElement('a');
    card.href = `announcement.html?id=${item.itemId}`;
    card.className = 'bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300';
    
    let imageUrl = 'https://source.unsplash.com/random/300x200/?product';
    try {
        const photosResponse = await fetch(`${API_BASE_URL}/items/item/photos/${item.itemId}`);
        if (photosResponse.ok) {
            const photos = await photosResponse.json();
            imageUrl = photos.length > 0 && photos[0].startsWith('http') ? photos[0] : `${API_BASE_URL}/${photos[0]}`;
        }
    } catch (e) {
        console.error('Error fetching photo for similar item:', e);
    }
    
    const priceText = item.typeMoney === 'FREE' ? 'Бесплатно' : 
                     item.typeMoney === 'NEGOTIABLE' ? 'Договорная' :
                     `${item.itemPrice.toLocaleString()} ${item.typePrice}`;
    
    card.innerHTML = `
        <div class="relative">
            <img src="${imageUrl}" alt="${item.itemName}" class="w-full h-20 object-cover sm:h-32">
        </div>
        <div class="p-1 sm:p-2">
            <h3 class="font-semibold text-xs mb-1 truncate sm:text-sm">${item.itemName}</h3>
            <p class="text-blue-600 font-bold text-xs sm:text-sm">${priceText}</p>
        </div>
    `;
    
    return card;
}

// Gallery functionality
let currentImageIndex = 0;
let images = [];

function changeMainImage(element, index) {
    const mainImage = document.getElementById('main-image');
    mainImage.src = element.src;
    currentImageIndex = index || 0;
}

function openGallery() {
    const fullscreenGallery = document.getElementById('fullscreen-gallery');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const imageCounter = document.getElementById('image-counter');
    
    if (window.images && window.images.length > 0) {
        fullscreenImage.src = window.images[currentImageIndex];
        imageCounter.textContent = `${currentImageIndex + 1} / ${window.images.length}`;
        fullscreenGallery.style.display = 'flex';
    }
}

function closeGallery() {
    document.getElementById('fullscreen-gallery').style.display = 'none';
}

function changeGalleryImage(direction) {
    if (!window.images || window.images.length === 0) return;
    
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = window.images.length - 1;
    if (currentImageIndex >= window.images.length) currentImageIndex = 0;
    
    const fullscreenImage = document.getElementById('fullscreen-image');
    const mainImage = document.getElementById('main-image');
    const imageCounter = document.getElementById('image-counter');
    
    fullscreenImage.src = window.images[currentImageIndex];
    mainImage.src = window.images[currentImageIndex];
    imageCounter.textContent = `${currentImageIndex + 1} / ${window.images.length}`;
}

// Add click and touch events to main image
document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
        mainImage.addEventListener('click', openGallery);
        mainImage.addEventListener('touchend', (e) => {
            e.preventDefault();
            openGallery();
        }, { passive: true });
    }
    
    // Keyboard navigation for gallery
    document.addEventListener('keydown', function(e) {
        const gallery = document.getElementById('fullscreen-gallery');
        if (gallery && gallery.style.display === 'flex') {
            switch(e.key) {
                case 'Escape':
                    closeGallery();
                    break;
                case 'ArrowLeft':
                    changeGalleryImage(-1);
                    break;
                case 'ArrowRight':
                    changeGalleryImage(1);
                    break;
            }
        }
    });
});

// Check favorite status
async function checkFavoriteStatus(userId, itemId) {
    try {
        const response = await fetch(`${API_BASE_URL}/favorite/isFavorite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, itemId })
        });
        if (!response.ok) {
            console.error('Failed to check favorite status:', response.status);
            return { isFavorite: false };
        }
        return await response.json();
    } catch (error) {
        console.error('Error checking favorite status:', error);
        return { isFavorite: false };
    }
}

// Favorite button toggle
document.addEventListener('DOMContentLoaded', function() {
    const favoriteButton = document.getElementById('favorite-button');
    if (favoriteButton) {
        favoriteButton.addEventListener('click', async () => {
            const icon = favoriteButton.querySelector('i');
            const urlParams = new URLSearchParams(window.location.search);
            const itemId = urlParams.get('id');
            const userId = getUserId();

            if (!userId) {
                alert('Пожалуйста, войдите в аккаунт для управления избранным.');
                return;
            }

            const isFavorite = icon.classList.contains('fas');
            if (isFavorite) {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.classList.remove('text-red-500');
                icon.classList.add('text-gray-400');
                await removeFromFavorites(itemId, userId);
            } else {
                await addToFavorites(itemId, userId);
                const favoriteStatus = await checkFavoriteStatus(userId, itemId);
                console.log('Post-add favorite check:', favoriteStatus); // Отладка
                updateFavoriteButton(favoriteStatus.isFavorite);
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.classList.add('text-red-500');
                icon.classList.remove('text-gray-400');
            }
        });
    }
});

// Update favorite button state
function updateFavoriteButton(isFavorite) {
    const favoriteButton = document.getElementById('favorite-button');
    const icon = favoriteButton.querySelector('i');
    if (isFavorite) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        icon.classList.add('text-red-500');
        icon.classList.remove('text-gray-400');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        icon.classList.remove('text-red-500');
        icon.classList.add('text-gray-400');
    }
}

// Add item to favorites
async function addToFavorites(itemId, userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/favorite/add-to-favorite/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, itemId })
        });
        if (!response.ok) throw new Error('Failed to add to favorites');
        console.log('Added to favorites successfully');
    } catch (error) {
        console.error('Error adding to favorites:', error);
        alert('Не удалось добавить в избранное. Попробуйте позже.');
        const favoriteButton = document.getElementById('favorite-button');
        const icon = favoriteButton.querySelector('i');
        icon.classList.add('far');
        icon.classList.remove('fas');
        icon.classList.add('text-gray-400');
        icon.classList.remove('text-red-500');
    }
}

// Remove item from favorites (унифицировано)
async function removeFromFavorites(itemId, userId) {
    try {
        let response = await fetch(`${API_BASE_URL}/favorite/remove`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, itemId })
        });

        if (!response.ok && response.status === 405) {
            // если DELETE не работает, fallback на POST
            response = await fetch(`${API_BASE_URL}/favorite/remove`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, itemId })
            });
        }

        if (!response.ok) {
            throw new Error(`Ошибка ${response.status}`);
        }

        console.log('Удалено из избранного ✅');
        updateFavoriteButton(false);

    } catch (error) {
        console.error('Ошибка при удалении из избранного:', error);
        alert('Не удалось удалить из избранного. Попробуйте позже.');
        updateFavoriteButton(true);
    }
}


// Show phone number
document.addEventListener('DOMContentLoaded', function() {
    const showPhoneButton = document.getElementById('show-phone');
    const phoneNumber = document.getElementById('phone-number');
    if (showPhoneButton && phoneNumber) {
        showPhoneButton.addEventListener('click', () => {
            phoneNumber.classList.toggle('hidden');
        });
    }
});

// Show email form
document.addEventListener('DOMContentLoaded', function() {
    const showEmailButton = document.getElementById('show-email');
    const emailAddress = document.getElementById('email-address');
    if (showEmailButton && emailAddress) {
        showEmailButton.addEventListener('click', () => {
            emailAddress.classList.toggle('hidden');
        });
    }
});

document.querySelector('.bg-blue-700.rounded-r-full')?.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'search.html';
});