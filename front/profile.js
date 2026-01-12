const apiBase = 'http://localhost:8080/api/v1';
const roboUser = JSON.parse(localStorage.getItem('roboUser') || '{}');
const userId = roboUser.userId;

if (!userId) {
    window.location.href = 'auth.html';
}

// Метки для категорий и статусов на русском языке
const categoryLabels = {
    HOUSE: 'Недвижимость',
    CHILDREN: 'Детский мир',
    ELECTRONICS: 'Электроника',
    TRANSPORT: 'Транспорт',
    FURNITURE: 'Мебель',
    ANIMAL: 'Животные',
    FREE: 'Отдам даром',
    OTHER: 'Прочие',
};

const statusLabels = {
    MODERATION: 'На проверке',
    AVAILABLE: 'Опубликовано',
    UNAVAILABLE: 'Отклонено',
};

// Список городов по странам
const citiesByCountry = {
    Russia: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань'],
    Uzbekistan: ['Ташкент', 'Самарканд', 'Бухара', 'Андижан', 'Наманган'],
    Belarus: ['Минск', 'Гомель', 'Витебск', 'Могилев', 'Брест'],
};

// Переключение мобильного меню
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Переключение видимости пароля
function togglePassword(element) {
    const input = element.previousElementSibling;
    const icon = element.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Загрузка фото пользователя
function loadUserPhoto() {
    const avatarImg = document.getElementById('avatar-img');
    avatarImg.src = 'https://via.placeholder.com/128'; // Устанавливаем заглушку до загрузки
    fetch(`${apiBase}/users/${userId}/photo?t=${new Date().getTime()}`, {
        headers: {
            'Cache-Control': 'no-cache' // Предотвращаем кэширование
        }
    })
        .then(res => {
            if (res.ok) {
                return res.blob();
            } else {
                throw new Error('Не удалось загрузить фото');
            }
        })
        .then(blob => {
            avatarImg.src = URL.createObjectURL(blob);
        })
        .catch(err => {
            console.error('Ошибка загрузки фото:', err);
            avatarImg.src = 'https://via.placeholder.com/128'; // Оставляем заглушку при ошибке
        });
}

// Загрузка данных пользователя
function loadUserData() {
    fetch(`${apiBase}/users/user/id/${userId}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('username').textContent = `${data.firstName} ${data.lastName}`;
            const form = document.getElementById('profile-form');
            form.first_name.value = data.firstName || '';
            form.last_name.value = data.lastName || '';
            form.email.value = data.email || '';
            form.phone.value = data.phone || '';
            form.birth_date.value = data.birthDate || '';
            form.gender.value = data.gender || '';
            form.country.value = data.country || '';
            form.city.value = data.city || '';
            updateCities(data.country);
            document.querySelectorAll('.view-mode').forEach(el => {
                el.textContent = form[el.dataset.field].value || 'Не указано';
            });
            // Загружаем фото после загрузки данных
            loadUserPhoto();
        })
        .catch(err => alert('Ошибка загрузки данных: ' + err.message));
}

// Обработка загрузки фото профиля
document.getElementById('avatar-input').addEventListener('change', async function() {
    const file = this.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`${apiBase}/users/${userId}/upload-photo`, {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                loadUserPhoto(); // Повторно загружаем фото
                alert('Фото профиля успешно обновлено');
            } else {
                alert('Ошибка загрузки фото: ' + res.statusText);
            }
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    }
});

// Загрузка объявлений пользователя
function loadUserAds() {
    fetch(`${apiBase}/items/get-all/user/${userId}/items`)
        .then(res => res.json())
        .then(items => {
            const container = document.getElementById('user-ads');
            container.innerHTML = '';
            items.forEach(item => {
                // Формируем полный URL для первого фото
                const imageUrl = item.imageUrls && item.imageUrls.length > 0 
                    ? `${apiBase.replace('/api/v1', '')}/${item.imageUrls[0].replace(/\\/g, '/')}` 
                    : 'https://via.placeholder.com/300x200';

                const card = document.createElement('div');
                card.className = 'border rounded-lg overflow-hidden hover:shadow-md transition-shadow';
                card.innerHTML = `
                    <img src="${imageUrl}" alt="Товар" class="w-full h-48 object-cover" onerror="this.src='https://via.placeholder.com/300x200'; this.onerror=null;">
                    <div class="p-4">
                        <h3 class="font-bold text-lg mb-2">${item.itemName}</h3>
                        <p class="text-gray-600 mb-2">Категория: ${categoryLabels[item.category] || item.category}</p>
                        <p class="text-gray-600 mb-2">Состояние: ${statusLabels[item.itemStatus] || item.itemStatus}</p>
                        <p class="text-gray-800 font-bold">${item.itemPrice} ${item.typePrice || 'сум'}</p>
                        <div class="flex justify-between items-center mt-4">
                            <span class="text-sm text-gray-500">${new Date(item.createdAt).toLocaleDateString()}</span>
                            <div class="flex space-x-2">
                                <button onclick="editAd(${item.itemId})" class="text-blue-600 hover:text-blue-800">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteAd(${item.itemId})" class="text-red-600 hover:text-red-800">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        })
        .catch(err => console.error('Ошибка загрузки объявлений:', err));
}

// Обработка формы профиля
document.getElementById('profile-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const data = {
        firstName: this.first_name.value,
        lastName: this.last_name.value,
        email: this.email.value,
        phone: this.phone.value,
        birthDate: this.birth_date.value,
        gender: this.gender.value,
        country: this.country.value,
        city: this.city.value,
        nowPassword: this.current_password.value,
        newPassword: this.new_password.value || null,
        confirmPassword: this.confirm_password.value || null
    };

    if (!data.nowPassword) {
        alert('Введите текущий пароль');
        return;
    }
    if (data.newPassword && data.newPassword !== data.confirmPassword) {
        alert('Новые пароли не совпадают');
        return;
    }

    try {
        const res = await fetch(`${apiBase}/users/edit/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Ошибка обновления');
        alert('Профиль обновлен');
        loadUserData();
        document.getElementById('cancel-edit').click();
    } catch (err) {
        alert('Ошибка: ' + err.message);
    }
});

// Переключение режима редактирования профиля
document.getElementById('edit-toggle').addEventListener('click', function() {
    const form = document.getElementById('profile-form');
    form.classList.add('edit-mode');
    document.querySelectorAll('.edit-input').forEach(input => input.style.display = 'block');
    document.querySelectorAll('.view-mode').forEach(view => view.style.display = 'none');
    document.getElementById('cancel-edit').classList.remove('hidden');
    document.getElementById('profile-form').querySelector('button[type="submit"]').classList.remove('hidden');
});

// Обработка кнопки "Отмена"
document.getElementById('cancel-edit').addEventListener('click', function() {
    const form = document.getElementById('profile-form');
    form.classList.remove('edit-mode');
    document.querySelectorAll('.edit-input').forEach(input => input.style.display = 'none');
    document.querySelectorAll('.view-mode').forEach(view => view.style.display = 'block');
    this.classList.add('hidden');
    document.getElementById('profile-form').querySelector('button[type="submit"]').classList.add('hidden');
    loadUserData();
});

// Обновление списка городов
function updateCities(country) {
    const citySelect = document.getElementById('city-select');
    citySelect.innerHTML = '';
    const cities = citiesByCountry[country] || [];
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

// Обработчик изменения страны
document.getElementById('country-select').addEventListener('change', function() {
    updateCities(this.value);
});

// Редактирование объявления
function editAd(id) {
    fetch(`${apiBase}/items/get/id/${id}`)
        .then(res => res.json())
        .then(item => {
            const form = document.getElementById('edit-ad-form');
            form.classList.remove('hidden');
            const formEl = form.querySelector('form');
            formEl.itemId.value = item.itemId;
            formEl.itemName.value = item.itemName;
            formEl.itemDescription.value = item.itemDescription;
            formEl.category.value = item.category;
            formEl.itemPrice.value = item.itemPrice;
            formEl.typePrice.value = item.typePrice || 'UZS';
            formEl.typeSeller.value = item.typeSeller || 'PRIVATE';
            formEl.itemType.value = item.itemType || 'NEW';
            formEl.country.value = item.country || '';
            formEl.city.value = item.city || '';
            formEl.address.value = item.address || '';
            formEl.name.value = item.name || '';
            formEl.phone.value = item.phone || '';
            formEl.email.value = item.email || '';
            // Загрузка фотографий из API
            return fetch(`${apiBase}/items/item/photos/${id}`);
        })
        .then(res => res.json())
        .then(photos => {
            console.log('Загруженные фотографии:', photos); // Логирование для проверки
            displayPhotos(id, photos);
        })
        .catch(err => console.error('Ошибка загрузки данных или фото:', err));
}

// Отображение фотографий в форме редактирования
function displayPhotos(itemId, photos) {
    const container = document.getElementById('current-photos');
    container.innerHTML = '';
    photos.forEach(url => {
        const div = document.createElement('div');
        div.className = 'relative';
        div.innerHTML = `
            <img src="${url}" class="w-24 h-24 object-cover rounded">
            <button class="absolute top-0 right-0 bg-red-500 text-white p-1 rounded" onclick="deletePhoto(${itemId}, '${url}')">
                <i class="fas fa-trash"></i>
            </button>
        `;
        container.appendChild(div);
    });
}

// Удаление фотографии
async function deletePhoto(itemId, photoUrl) {
    try {
        await fetch(`${apiBase}/items/delete/photo/${itemId}?photoUrl=${encodeURIComponent(photoUrl)}`, {
            method: 'DELETE'
        });
        editAd(itemId);
    } catch (err) {
        alert('Ошибка удаления фото: ' + err.message);
    }
}

// Обработка отправки формы редактирования
document.getElementById('edit-ad-form').querySelector('form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = this;
    const id = form.querySelector('[name="itemId"]').value;
    const data = {
        itemName: form.querySelector('[name="itemName"]').value,
        itemDescription: form.querySelector('[name="itemDescription"]').value,
        category: form.querySelector('[name="category"]').value,
        itemPrice: parseFloat(form.querySelector('[name="itemPrice"]').value),
        typePrice: form.querySelector('[name="typePrice"]').value,
        typeMoney: form.querySelector('[name="typeMoney"]').value,
        typeSeller: form.querySelector('[name="typeSeller"]').value,
        itemType: form.querySelector('[name="itemType"]').value,
        country: form.querySelector('[name="country"]').value,
        city: form.querySelector('[name="city"]').value,
        address: form.querySelector('[name="address"]').value,
        name: form.querySelector('[name="name"]').value,
        phone: form.querySelector('[name="phone"]').value,
        email: form.querySelector('[name="email"]').value,
    };

    try {
        await fetch(`${apiBase}/items/edit/item/id/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const photoInput = document.getElementById('new-photos');
        if (photoInput.files.length > 0) {
            const formData = new FormData();
            Array.from(photoInput.files).forEach(file => formData.append('files', file));
            await fetch(`${apiBase}/items/upload/item/${id}`, {
                method: 'POST',
                body: formData
            });
        }
        alert('Объявление обновлено');
        loadUserAds();
        document.getElementById('edit-ad-form').classList.add('hidden');
    } catch (err) {
        alert('Ошибка: ' + err.message);
    }
});

// Удаление объявления
function deleteAd(id) {
    if (confirm('Удалить объявление?')) {
        fetch(`${apiBase}/items/delete/id/${id}`, { method: 'DELETE' })
            .then(() => loadUserAds());
    }
}

// Выход из системы
document.getElementById('logout-button').addEventListener('click', logout);
document.getElementById('logout-button-mobile').addEventListener('click', logout);

function logout() {
    localStorage.removeItem('roboUser');
    window.location.href = 'auth.html';
}

// Инициализация
loadUserData();
loadUserAds();

document.querySelector('.bg-blue-700.rounded-r-full')?.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'search.html';
});