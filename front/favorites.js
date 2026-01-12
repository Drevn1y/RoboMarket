const API_BASE_URL = 'http://localhost:8080/api/v1/favorite';

// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Get userId from localStorage
function getUserId() {
    const user = JSON.parse(localStorage.getItem('roboUser'));
    return user ? user.userId : null;
}

// Fetch item photos
async function fetchItemPhotos(itemId) {
    try {
        const response = await fetch(`${API_BASE_URL.replace('favorite', 'items')}/item/photos/${itemId}`);
        const photos = await response.json();
        return photos;
    } catch (error) {
        console.error('Error fetching item photos:', error);
        return [];
    }
}

// Fetch and display favorites
async function fetchFavorites() {
    const userId = getUserId();
    if (!userId) {
        alert('Пожалуйста, войдите в аккаунт для просмотра избранного.');
        window.location.href = 'auth.html'; // Redirect to login/register page
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/user/${userId}`);
        const favorites = await response.json();
        const favoritesList = document.getElementById('favorites-list');
        const emptyFavorites = document.getElementById('empty-favorites');
        const favoritesCount = document.getElementById('favorites-count');

        favoritesList.innerHTML = '';
        favoritesCount.textContent = `${favorites.length} товаров`;

        if (favorites.length === 0) {
            emptyFavorites.classList.remove('hidden');
            return;
        }

        emptyFavorites.classList.add('hidden');

        for (const favorite of favorites) {
            const itemDetails = await fetchItemDetails(favorite.favoriteId);
            const photos = await fetchItemPhotos(itemDetails.itemId);
            const mainPhoto = photos.length > 0 ? photos[0] : 'https://via.placeholder.com/150?text=Нет фото';

            const shortDescription = itemDetails.itemDescription.length > 50 
                ? itemDetails.itemDescription.substring(0, 50) + '...' 
                : itemDetails.itemDescription;

            const itemElement = document.createElement('div');
            itemElement.className = 'bg-white p-4 rounded shadow cursor-pointer';
            itemElement.onclick = () => window.location.href = `announcement.html?id=${itemDetails.itemId}`;
            itemElement.innerHTML = `
                <img src="${mainPhoto}" alt="${itemDetails.itemName}" class="w-full h-32 object-cover rounded mb-2">
                <h3 class="text-lg font-bold truncate">${itemDetails.itemName}</h3>
                <p class="text-gray-600 line-clamp-2">${shortDescription}</p>
                <p class="text-gray-500">Цена: ${itemDetails.itemPrice} ${itemDetails.typePrice}</p>
                <button class="remove-favorite mt-2 text-red-500 hover:text-red-700" data-item-id="${itemDetails.itemId}">
                    <i class="fas fa-heart"></i>
                </button>
            `;
            favoritesList.appendChild(itemElement);
        }

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-favorite').forEach(button => {
            button.addEventListener('click', async (e) => {
                e.stopPropagation(); // Prevent card click event
                const itemId = button.getAttribute('data-item-id');
                const itemElement = button.closest('div.bg-white');
                await removeFromFavorites(itemId, itemElement);
            });
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
    }
}

// Fetch item details using favoriteId
async function fetchItemDetails(favoriteId) {
    try {
        const response = await fetch(`${API_BASE_URL}/item/${favoriteId}`);
        const data = await response.json();
        return data; // Return full item details
    } catch (error) {
        console.error('Error fetching item details:', error);
        return { itemName: 'Неизвестный товар', itemDescription: 'Нет описания', itemPrice: 0, typePrice: 'UZS', city: 'Неизвестно', itemId: 0 };
    }
}

// Add to favorites
async function addToFavorites(itemId) {
    const userId = getUserId();
    if (!userId) {
        alert('Пожалуйста, войдите в аккаунт для добавления в избранное.');
        window.location.href = 'auth.html'; // Redirect to login/register page
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/add-to-favorite/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, itemId })
        });
        const result = await response.json();
        console.log('Added to favorites:', result);
        await fetchFavorites(); // Refresh list
    } catch (error) {
        console.error('Error adding to favorites:', error);
    }
}

// Remove from favorites using itemId
async function removeFromFavorites(itemId, itemElement) {
    const userId = getUserId();
    if (!userId) {
        alert('Пожалуйста, войдите в аккаунт для удаления из избранного. Проверьте авторизацию.');
        console.error('userId не найден в localStorage');
        return;
    }

    try {
        // Отключаем кнопку, чтобы избежать повторных нажатий
        const button = itemElement.querySelector('.remove-favorite');
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; // Показываем загрузку

        console.log(`Удаляем товар - userId: ${userId}, itemId: ${itemId}`);
        // Пробуем сначала DELETE, затем POST, если DELETE не работает
        let response = await fetch(`${API_BASE_URL}/remove`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, itemId })
        });

        if (!response.ok && response.status === 405) { // Если метод не разрешен
            console.log('DELETE не работает, пробуем POST');
            response = await fetch(`${API_BASE_URL}/remove`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, itemId })
            });
        }

        // Читаем ответ сервера только если есть тело
        let result = {};
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            console.log('Ответ не содержит JSON, только статус:', response.status);
        }
        console.log('Полный ответ от сервера:', { status: response.status, body: result });

        if (response.ok) {
            // Удаляем товар со страницы
            if (itemElement) {
                itemElement.remove();
                const favoritesCount = document.getElementById('favorites-count');
                const count = parseInt(favoritesCount.textContent) - 1;
                favoritesCount.textContent = `${count} товаров`;
                if (count === 0) {
                    document.getElementById('empty-favorites').classList.remove('hidden');
                }
            }
        } else {
            alert(`Не удалось удалить товар. Код ошибки: ${response.status}. Сообщение: ${result.message || 'Нет данных'}. Попробуй позже.`);
            console.error('Ошибка сервера:', result.message || 'Неизвестная ошибка');
        }
    } catch (error) {
        console.error('Ошибка при удалении:', error.message);
        alert('Что-то пошло не так. Проверь интернет или аккаунт и попробуй снова. Подробности в консоли.');
    } finally {
        // Восстанавливаем кнопку
        const button = itemElement.querySelector('.remove-favorite');
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-heart"></i>';
    }
}
// Clear all favorites
document.getElementById('clear-favorites').addEventListener('click', async () => {
    const userId = getUserId();
    if (!userId) {
        alert('Пожалуйста, войдите в аккаунт для очистки избранного.');
        window.location.href = 'auth.html'; // Redirect to login/register page
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/clear/${userId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            const favoritesList = document.getElementById('favorites-list');
            favoritesList.innerHTML = '';
            document.getElementById('favorites-count').textContent = '0 товаров';
            document.getElementById('empty-favorites').classList.remove('hidden');
        }
        const result = await response.json();
        console.log('Cleared favorites:', result);
    } catch (error) {
        console.error('Error clearing favorites:', error);
    }
});

// Load favorites on page load
document.addEventListener('DOMContentLoaded', fetchFavorites);

document.querySelector('.bg-blue-700.rounded-r-full')?.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'search.html';
});