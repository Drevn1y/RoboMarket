const apiBase = 'http://localhost:8080/api/v1';
const roboUser = JSON.parse(localStorage.getItem('roboUser') || '{}');
const userId = roboUser.userId;

if (!userId) {
    window.location.href = 'auth.html';
}

// Маппинг категорий из HTML в значения API
const categoryMap = {
    property: 'HOUSE',
    children: 'CHILDREN',
    electronics: 'ELECTRONICS',
    transport: 'TRANSPORT',
    furniture: 'FURNITURE',
    animals: 'ANIMAL',
    forFree: 'FREE',
    other: 'OTHER'
};

// Навигация по шагам
const steps = ['step-1', 'step-2', 'step-3', 'step-4'];
function showStep(stepIndex) {
    steps.forEach((step, index) => {
        document.getElementById(step).classList.toggle('hidden', index !== stepIndex);
    });
    updateProgress((stepIndex + 1) * 25);
}

    // Обновление прогресс-бара
    function updateProgress(percent) {
        const progressBar = document.getElementById('progress-bar');
        const progressPercent = document.getElementById('progress-percent');
        if (progressBar && progressPercent) {
            progressBar.style.width = percent + '%';
            progressPercent.textContent = percent + '%';
        }
    }

document.addEventListener('DOMContentLoaded', () => {
    // Выбор категории
    document.querySelectorAll('.category-selector').forEach(selector => {
        selector.addEventListener('click', function() {
            document.querySelectorAll('.category-selector').forEach(el => {
                el.classList.remove('bg-blue-100', 'border-blue-500');
            });
            this.classList.add('bg-blue-100', 'border-blue-500');
            const category = this.getAttribute('data-category');
            document.getElementById('selected-category').value = categoryMap[category] || 'OTHER';
            document.getElementById('next-to-step-2').disabled = false;
        });
    });

    // Навигация
    document.getElementById('next-to-step-2')?.addEventListener('click', () => showStep(1));
    document.getElementById('back-to-step-1')?.addEventListener('click', () => showStep(0));
    document.getElementById('next-to-step-3')?.addEventListener('click', () => {
        const title = document.getElementById('ad-title')?.value.trim();
        const description = document.getElementById('ad-description')?.value.trim();
        const price = document.getElementById('ad-price')?.value;
        const priceType = document.querySelector('input[name="price_type"]:checked')?.value;

        if (!title || title.length < 3) {
            alert('Название должно содержать минимум 3 символа');
            return;
        }
        if (!description || description.length < 3) {
            alert('Описание должно содержать минимум 3 символа');
            return;
        }
        if (!price && priceType !== 'free') {
            alert('Укажите цену или выберите "Бесплатно"');
            return;
        }
        showStep(2);
    });
    document.getElementById('back-to-step-2')?.addEventListener('click', () => showStep(1));
    document.getElementById('next-to-step-4')?.addEventListener('click', () => {
        if (document.querySelectorAll('.image-preview').length === 0) {
            alert('Пожалуйста, загрузите хотя бы одно фото');
            return;
        }
        showStep(3);
    });
    document.getElementById('back-to-step-3')?.addEventListener('click', () => showStep(2));

    // Загрузка изображений
    const uploadedFiles = [];
    const imageInput = document.getElementById('image-input');
    const imageUploadButton = document.getElementById('image-upload-button');
    const imagePreviewContainer = document.getElementById('image-preview-container');

    if (imageInput && imageUploadButton && imagePreviewContainer) {
        imageInput.addEventListener('change', function(e) {
            const files = e.target.files;
            if (document.querySelectorAll('.image-preview').length + files.length > 10) {
                alert('Максимальное количество фото - 10');
                return;
            }

            for (let file of files) {
                if (!file.type.match('image.*')) continue;
                uploadedFiles.push(file);

                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewDiv = document.createElement('div');
                    previewDiv.className = 'image-preview relative h-32';
                    previewDiv.dataset.fileName = file.name;

                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'w-full h-full object-cover rounded-lg';

                    const removeBtn = document.createElement('div');
                    removeBtn.className = 'absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer';
                    removeBtn.innerHTML = '<i class="fas fa-times text-xs"></i>';
                    removeBtn.addEventListener('click', () => {
                        previewDiv.remove();
                        const index = uploadedFiles.findIndex(f => f.name === file.name);
                        if (index !== -1) uploadedFiles.splice(index, 1);
                        if (document.querySelectorAll('.image-preview').length === 0) {
                            imageUploadButton.style.display = 'flex';
                        }
                    });

                    previewDiv.appendChild(img);
                    previewDiv.appendChild(removeBtn);
                    imagePreviewContainer.insertBefore(previewDiv, imageUploadButton);
                };
                reader.readAsDataURL(file);
            }

            if (document.querySelectorAll('.image-preview').length >= 10) {
                imageUploadButton.style.display = 'none';
            }
            imageInput.value = '';
        });

        imageUploadButton.addEventListener('click', () => imageInput.click());
    }

    // Обновление списка городов
    const countrySelect = document.getElementById('ad-country');
    const citySelect = document.getElementById('ad-city');
    if (countrySelect && citySelect) {
        const cities = {
            Russia: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань'],
            Uzbekistan: ['Ташкент', 'Самарканд', 'Бухара', 'Андижан', 'Наманган'],
            Belarus: ['Минск', 'Гомель', 'Витебск', 'Могилев', 'Брест'],
        };
        function addCities(country) {
            citySelect.innerHTML = '';
            (cities[country] || ['Capital', 'Major City 1', 'Major City 2', 'Major City 3']).forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                citySelect.appendChild(option);
            });
        }
        // Инициализация при загрузке
        addCities(countrySelect.value);
        // Обработчик изменения страны
        countrySelect.addEventListener('change', () => addCities(countrySelect.value));
    }

    // Отправка формы
    const form = document.getElementById('ad-form');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Форма отправлена');

            const name = document.getElementById('ad-name')?.value.trim();
            const phone = document.getElementById('ad-phone')?.value.trim();
            const country = document.getElementById('ad-country')?.value;
            const city = document.getElementById('ad-city')?.value;

            if (!name || name.length < 3) {
                alert('Пожалуйста, укажите ваше имя (минимум 3 символа)');
                return;
            }
            if (!phone || phone.length < 3) {
                alert('Пожалуйста, укажите ваш телефон (минимум 3 символа)');
                return;
            }
            if (!country) {
                alert('Пожалуйста, выберите страну');
                return;
            }
            if (!city) {
                alert('Пожалуйста, выберите город');
                return;
            }

            const category = document.getElementById('selected-category')?.value;
            const itemName = document.getElementById('ad-title')?.value.trim();
            const itemDescription = document.getElementById('ad-description')?.value.trim();
            const typeSeller = document.querySelector('input[name="seller_type"]:checked')?.value.toUpperCase();
            const itemType = document.querySelector('input[name="condition"]:checked')?.value.toUpperCase();
            const itemPrice = document.getElementById('ad-price')?.value;
            const typePrice = document.getElementById('ad-currency')?.value;
            const typeMoney = document.querySelector('input[name="price_type"]:checked')?.value.toUpperCase();
            const address = document.getElementById('ad-address')?.value.trim();
            const email = document.getElementById('ad-email')?.value.trim();

            if (!category) {
                alert('Пожалуйста, выберите категорию');
                return;
            }

            const data = {
                ownerId: userId,
                itemName,
                category,
                itemDescription,
                typeSeller,
                itemType,
                itemPrice: typeMoney === 'FREE' ? 0 : parseFloat(itemPrice) || 0,
                typePrice: typeMoney === 'FREE' ? 'UZS' : typePrice,
                typeMoney: typeMoney === 'FREE' ? 'FREE' : typeMoney,
                country,
                city,
                address,
                name,
                phone,
                email
            };

            console.log('Данные для отправки:', data);

            try {
                // Сначала создаем объявление
                const createRes = await fetch(`${apiBase}/items/create`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (!createRes.ok) {
                    const errorData = await createRes.json();
                    throw new Error(`Ошибка при создании объявления: ${errorData.message || createRes.statusText}`);
                }

                const createdItem = await createRes.json();
                const itemId = createdItem.itemId;
                console.log('Объявление создано, itemId:', itemId);

                // Затем загружаем фото, если они есть
                if (uploadedFiles.length > 0) {
                    const formData = new FormData();
                    uploadedFiles.forEach(file => formData.append('files', file));

                    const photoRes = await fetch(`${apiBase}/items/upload/item/${itemId}`, {
                        method: 'POST',
                        body: formData
                    });

                    if (!photoRes.ok) {
                        throw new Error('Ошибка при загрузке фотографий');
                    }
                    console.log('Фотографии загружены');
                }

                alert('Объявление успешно опубликовано!');
                window.location.href = 'profile.html';
            } catch (err) {
                console.error('Ошибка:', err);
                alert('Ошибка: ' + err.message);
            }
        });
    }
});

// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

document.querySelector('.bg-blue-700.rounded-r-full')?.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'search.html';
});