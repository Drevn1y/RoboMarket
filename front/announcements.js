// ✅ Подгрузка всех объявлений (до 8 на страницу), с фильтрацией по категории

const API_BASE_URL = 'http://localhost:8080/api/v1';
const ITEMS_PER_PAGE = 12; 
let currentPage = 1;
let allItems = []; // сюда загрузим всё с бэка

// Получить параметр category из URL (если есть)
function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('category');
}

// Получить все объявления с бэка
async function fetchItems() {
    const category = getCategoryFromURL();
    let endpoint = category ? 
        `${API_BASE_URL}/items/get-by-category/?category=${category}` : 
        `${API_BASE_URL}/items/get-all-available`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Ошибка при загрузке объявлений');
        allItems = await response.json();
        renderPage(currentPage);
        renderPagination();
    } catch (err) {
        console.error(err);
    }
}

// Показать конкретную страницу
function renderPage(page) {
    const container = document.querySelector('.grid');
    container.innerHTML = '';
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const itemsToRender = allItems.slice(start, end);

    itemsToRender.forEach(item => {
        const card = createAdCard(item);
        container.appendChild(card);
    });
}

// Создание карточки
function createAdCard(item) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg overflow-hidden shadow-md ad-card transition-all duration-300 cursor-pointer';
    card.onclick = () => navigateToAnnouncement(item.itemId);

    // Фотка
    let imageUrl = 'https://via.placeholder.com/300x200?text=Нет+фото';
    if (item.imageUrls && item.imageUrls.length > 0) {
        imageUrl = `http://localhost:8080/${item.imageUrls[0].replace('\\', '/')}`;
    }

    let priceText;
    if (item.typeMoney === 'FREE') {
        priceText = 'Бесплатно';
    } else if (item.typeMoney === 'NEGOTIABLE') {
        priceText = `${item.itemPrice.toLocaleString()} ${item.typePrice} (Договорная)`;
    } else {
        priceText = `${item.itemPrice.toLocaleString()} ${item.typePrice}`;
    }

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

// Пагинация
function renderPagination() {
    const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);
    const pagination = document.querySelector('.pagination');
    if (!pagination) return; // если контейнера нет в html — не делаем ничего
    pagination.innerHTML = '';

    if (totalPages <= 1) return; // если всего одна страница — не показываем кнопки

    for (let i = 1; i <= totalPages; i++) {
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = i;
        a.className = 'px-3 py-1 rounded-md border border-gray-300 mx-1';
        if (i === currentPage) {
            a.classList.add('bg-blue-500', 'text-white');
        }

        a.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            renderPage(currentPage);
            renderPagination();
        });

        pagination.appendChild(a);
    }
}

function navigateToAnnouncement(itemId) {
    window.location.href = `announcement.html?id=${itemId}`;
}

function formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Сегодня';
    if (diffDays === 2) return 'Вчера';
    if (diffDays <= 7) return `${diffDays - 1} дней назад`;

    return date.toLocaleDateString('ru-RU');
}

// Запуск при загрузке страницы
fetchItems();

// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

document.querySelector('.bg-blue-700.rounded-r-full')?.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'search.html';
});
