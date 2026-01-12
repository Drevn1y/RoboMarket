// Base URL for images
const BASE_IMAGE_URL = 'http://localhost:8080/';

// Pagination settings
let allItems = [];
let currentPage = 1;
const itemsPerPage = 9;

// Debounce function for search input
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
        const menu = document.getElementById('mobile-menu');
        if (menu) menu.classList.toggle('hidden');
        else console.error('Элемент #mobile-menu не найден');
    });
} else {
    console.error('Элемент #mobile-menu-button не найден');
}

// Filter sections toggle
document.querySelectorAll('.filter-toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
        const content = this.nextElementSibling;
        const icon = this.querySelector('i');
        if (content && icon) {
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        } else {
            console.error('Не удалось найти содержимое или иконку для фильтра');
        }
    });
});

// Category checkboxes (allow only one selection)
document.querySelectorAll('input[name="category"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            document.querySelectorAll('input[name="category"]').forEach(cb => {
                if (cb !== this) cb.checked = false;
            });
        }
    });
});

// Reset filters
document.getElementById('reset-filters').addEventListener('click', () => {
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = checkbox.id === 'cat-all';
    });
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = radio.id === 'condition-all' || radio.id === 'seller-all' || radio.id === 'date-all';
    });
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });
    document.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
        input.value = '';
    });
    alert('Фильтры сброшены!');
    currentPage = 1;
    fetchAllItems();
});

// Price range inputs
const priceMin = document.getElementById('price-min');
const priceMax = document.getElementById('price-max');
if (priceMin && priceMax) {
    priceMin.addEventListener('input', function() {
        if (this.value && priceMax.value && parseFloat(this.value) > parseFloat(priceMax.value)) {
            priceMax.value = this.value;
        }
    });
    priceMax.addEventListener('input', function() {
        if (this.value && priceMin.value && parseFloat(this.value) < parseFloat(priceMin.value)) {
            priceMin.value = this.value;
        }
    });
}

// Apply filters
document.getElementById('apply-filters').addEventListener('click', () => {
    console.log('Кнопка "Применить" нажата');
    currentPage = 1;
    fetchItems();
});

// Category mapping to backend enums
const categoryMap = {
    'Автомобили': 'CAR',
    'Недвижимость': 'HOUSE',
    'Детский мир': 'CHILDREN',
    'Электроника': 'ELECTRONICS',
    'Транспорт': 'TRANSPORT',
    'Мебель': 'FURNITURE',
    'Животные': 'ANIMALS',
    'Прочие': 'OTHER'
};

// ItemType mapping
const itemTypeMap = {
    'Новое': 'NEW',
    'Б/у': 'USED',
    'Любое': null
};

// TypeSeller mapping
const typeSellerMap = {
    'Частные лица': 'PRIVATE',
    'Компании': 'COMPANY',
    'Все': null
};

// TypePrice mapping
const typePriceMap = {
    'сум (UZS)': 'UZS',
    '$ (USD)': 'USD',
    '€ (EUR)': 'EUR',
    'Любое': null
};

// Fetch all available items
function fetchAllItems() {
    const container = document.querySelector('.grid.grid-cols-1');
    if (container) {
        container.innerHTML = '<p class="text-center col-span-full">Загрузка...</p>';
    } else {
        console.error('Контейнер .grid.grid-cols-1 не найден');
        return;
    }

    fetch('http://localhost:8080/api/v1/items/get-all-available', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        console.log('Статус ответа (get-all-available):', response.status);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log('Полученные данные (get-all-available):', data);
        allItems = data.sort(() => Math.random() - 0.5); // Randomize
        displayItems();
    })
    .catch(error => {
        console.error('Ошибка:', error);
        container.innerHTML = '<p class="text-center col-span-full text-red-500">Не удалось загрузить объявления.</p>';
    });
}

// Fetch items with filters
function fetchItems() {
    const searchInput = document.getElementById('search-input');
    const countrySelect = document.getElementById('country');
    const citySelect = document.getElementById('city');
    const currencySelect = document.querySelector('select[name="currency"]');

    if (!searchInput || !countrySelect || !citySelect || !currencySelect) {
        console.error('Не найдены элементы формы:', {
            searchInput: !!searchInput,
            countrySelect: !!countrySelect,
            citySelect: !!citySelect,
            currencySelect: !!currencySelect
        });
        return;
    }

    const filters = {};
    const itemName = searchInput.value.trim();
    if (itemName) filters.itemName = itemName;
    const category = getSelectedCheckboxValue('category');
    if (category) filters.category = category;
    if (priceMin.value) filters.minPrice = parseFloat(priceMin.value);
    if (priceMax.value) filters.maxPrice = parseFloat(priceMax.value);
    const itemType = getSelectedRadioValue('condition', itemTypeMap);
    if (itemType) filters.itemType = itemType;
    if (countrySelect.value) filters.country = countrySelect.value;
    if (citySelect.value) filters.city = citySelect.value;
    const typeSeller = getSelectedRadioValue('seller', typeSellerMap);
    if (typeSeller) filters.typeSeller = typeSeller;
    const typePrice = typePriceMap[currencySelect.value];
    if (typePrice) filters.typePrice = typePrice;
    const dateTimeFrom = getDateTimeFrom();
    if (dateTimeFrom) filters.dateTimeFrom = dateTimeFrom;
    filters.dateTimeTo = new Date().toISOString();
    filters.itemStatus = 'AVAILABLE';

    console.log('Отправляемые фильтры:', filters);

    const container = document.querySelector('.grid.grid-cols-1');
    if (container) {
        container.innerHTML = '<p class="text-center col-span-full">Загрузка...</p>';
    } else {
        console.error('Контейнер .grid.grid-cols-1 не найден');
        return;
    }

    fetch('http://localhost:8080/api/v1/items/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
    })
    .then(response => {
        console.log('Статус ответа (search):', response.status);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        return response.json();
    })
    .then(data => {
        console.log('Полученные данные (search):', data);
        allItems = data.sort(() => Math.random() - 0.5); // Randomize
        displayItems();
    })
    .catch(error => {
        console.error('Ошибка:', error);
        container.innerHTML = '<p class="text-center col-span-full text-red-500">Не удалось загрузить объявления.</p>';
    });
}

// Helper functions
function getSelectedCheckboxValue(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    if (checked && checked.id !== 'cat-all') {
        return categoryMap[checked.value] || null;
    }
    return null;
}

function getSelectedRadioValue(name, valueMap) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    if (checked && !checked.id.includes('all')) {
        return valueMap[checked.value] || null;
    }
    return null;
}

function getDateTimeFrom() {
    const selectedDate = document.querySelector('input[name="date"]:checked');
    if (!selectedDate || selectedDate.id === 'date-all') return null;
    const now = new Date();
    if (selectedDate.id === 'date-today') {
        return new Date(now.setHours(0, 0, 0, 0)).toISOString();
    } else if (selectedDate.id === 'date-week') {
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
    } else if (selectedDate.id === 'date-month') {
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
    }
    return null;
}

// Display items with pagination
function displayItems() {
    const container = document.querySelector('.grid.grid-cols-1');
    if (!container) {
        console.error('Контейнер .grid.grid-cols-1 не найден');
        return;
    }

    container.innerHTML = '';

    if (!Array.isArray(allItems) || allItems.length === 0) {
        container.innerHTML = '<p class="text-center col-span-full">Нет объявлений по заданным фильтрам.</p>';
        return;
    }

    const totalPages = Math.ceil(allItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = allItems.slice(startIndex, endIndex);

    paginatedItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'ad-card bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300';
        card.innerHTML = `
            <div class="relative">
                <img src="${item.imageUrls && item.imageUrls[0] ? BASE_IMAGE_URL + item.imageUrls[0].replace(/\\/g, '/') : 'https://via.placeholder.com/150'}" alt="${item.itemName || 'Без названия'}" class="w-full h-48 object-cover">
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg mb-1 truncate">${item.itemName || 'Без названия'}</h3>
                <p class="text-gray-600 text-sm mb-2 line-clamp-2">${item.itemDescription || 'Без описания'}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-blue-600">${item.itemPrice ? item.itemPrice.toLocaleString('ru-RU') : 0} ${item.typePrice || 'UZS'}</span>
                    <span class="text-gray-500 text-sm">${item.createdAt ? new Date(item.createdAt).toLocaleDateString('ru-RU') : 'Неизвестно'}</span>
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-500">
                    <i class="fas fa-map-marker-alt mr-1"></i>
                    <span>${item.city || 'Не указан'}</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => {
            if (item.itemId) {
                window.location.href = `announcement.html?id=${item.itemId}`;
            } else {
                console.error('itemId не найден для товара:', item);
                alert('Ошибка: ID товара не найден');
            }
        });
        container.appendChild(card);
    });

    const countElement = document.querySelector('.text-gray-600');
    if (countElement) {
        countElement.textContent = `Найдено ${allItems.length} объявлений`;
    }

    const paginationContainer = document.querySelector('.mt-6.flex.justify-center');
    if (paginationContainer) {
        paginationContainer.innerHTML = '';
        const paginationDiv = document.createElement('div');
        paginationDiv.className = 'flex space-x-2';

        const prevButton = document.createElement('button');
        prevButton.className = `px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`;
        prevButton.textContent = 'Назад';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayItems();
            }
        });
        paginationDiv.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `px-3 py-1 rounded ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`;
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayItems();
            });
            paginationDiv.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.className = `px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`;
        nextButton.textContent = 'Вперёд';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayItems();
            }
        });
        paginationDiv.appendChild(nextButton);

        paginationContainer.appendChild(paginationDiv);
    }
}

// Initial fetch and search input handler
document.addEventListener('DOMContentLoaded', () => {
    console.log('Страница загружена, запускаем fetchAllItems');
    fetchAllItems();

    // Получаем оба инпута
    const searchInputs = [
        document.getElementById('search-input'), // боковая панель
        document.getElementById('searchPc')     // навбар
    ];

    searchInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', debounce(() => {
                // Синхронизируем значения между двумя полями
                searchInputs.forEach(i => {
                    if (i !== input) i.value = input.value;
                });

                currentPage = 1;
                fetchItems();
            }, 500));
        } else {
            console.error('Элемент поиска не найден');
        }
    });
});





