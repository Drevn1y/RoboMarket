// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function () {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Типы уведомлений и их символы
const typeIcons = {
    'ADS': '💰',
    'IMPORTANT': '🔔',
    'UPDATE': '🔄',
    'SYSTEM': '🛠️'
};

function getTypeIcon(type) {
    return typeIcons[type] || '🔔';
}

// Пагинация
let currentPage = 1;
const pageSize = 5;
let allNotifications = [];

function renderNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    notificationsList.innerHTML = '';

    // Сортировка по дате (свежие вверх)
    const sorted = [...allNotifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = sorted.slice(start, end);

    if (pageItems.length === 0) {
        document.getElementById('empty-notifications').classList.remove('hidden');
        return;
    }

    document.getElementById('empty-notifications').classList.add('hidden');

    pageItems.forEach(notification => {
        const icon = getTypeIcon(notification.typeNotification);
        const notificationItem = document.createElement('div');
        notificationItem.className = 'notification-item flex items-start gap-4 p-4 bg-white border-b border-gray-200 hover:bg-gray-50 cursor-pointer rounded-md';

        notificationItem.innerHTML = `
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold">
                ${icon}
            </div>
            <div class="flex-1">
                <p class="text-xs text-indigo-500 font-semibold uppercase mb-1">${notification.typeNotification || 'Без категории'}</p>
                <p class="text-sm font-medium text-gray-900">${notification.title}</p>
                <p class="text-sm text-gray-500 mb-1">${notification.message}</p>
                <p class="text-xs text-gray-400">${new Date(notification.createdAt).toLocaleString()}</p>
            </div>
        `;

        notificationsList.appendChild(notificationItem);
    });

    updatePaginationButtons(sorted.length);
}

function updatePaginationButtons(totalItems) {
    const totalPages = Math.ceil(totalItems / pageSize);
    document.getElementById('pagination').innerHTML = `
        <button id="prev-page" ${currentPage === 1 ? 'disabled' : ''} class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">← Назад</button>
        <span class="px-4 text-sm text-gray-600">Страница ${currentPage} из ${totalPages}</span>
        <button id="next-page" ${currentPage === totalPages ? 'disabled' : ''} class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Вперёд →</button>
    `;

    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderNotifications();
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        const maxPages = Math.ceil(allNotifications.length / pageSize);
        if (currentPage < maxPages) {
            currentPage++;
            renderNotifications();
        }
    });
}

// Основной запрос
async function fetchNotifications() {
    try {
        const response = await fetch('http://localhost:8080/api/v1/notification/get-all');
        allNotifications = await response.json();
        currentPage = 1;
        renderNotifications();
    } catch (error) {
        console.error('Ошибка при загрузке уведомлений:', error);
        document.getElementById('empty-notifications').classList.remove('hidden');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', fetchNotifications);

document.querySelector('.bg-blue-700.rounded-r-full')?.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'search.html';
});