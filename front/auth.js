
// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function () {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Simple ad filter functionality
document.querySelectorAll('.category-icon').forEach(icon => {
    icon.addEventListener('click', function (e) {
        e.preventDefault();
        const category = this.querySelector('span').textContent;
        alert(`Показать объявления из категории: ${category}`);
    });
});

// Ad card click
document.querySelectorAll('.ad-card').forEach(card => {
    card.addEventListener('click', function () {
        const title = this.querySelector('h3').textContent;
        alert(`Открыть объявление: ${title}`);
    });
});
// Base API URL
const apiBase = 'http://localhost:8080/api/v1';

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
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

function setCookie(name, value, days = 7) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r
    }, '');
}

// Switch between login and register forms
document.getElementById('switch-to-register').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('login-tab').classList.add('bg-gray-100', 'text-gray-700');
    document.getElementById('register-tab').classList.add('active');
    document.getElementById('register-tab').classList.remove('bg-gray-100', 'text-gray-700');
});

document.getElementById('switch-to-login').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-tab').classList.remove('active');
    document.getElementById('register-tab').classList.add('bg-gray-100', 'text-gray-700');
    document.getElementById('login-tab').classList.add('active');
    document.getElementById('login-tab').classList.remove('bg-gray-100', 'text-gray-700');
});

// Tab switching
document.getElementById('login-tab').addEventListener('click', function () {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
    this.classList.add('active');
    this.classList.remove('bg-gray-100', 'text-gray-700');
    document.getElementById('register-tab').classList.remove('active');
    document.getElementById('register-tab').classList.add('bg-gray-100', 'text-gray-700');
});

document.getElementById('register-tab').addEventListener('click', function () {
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
    this.classList.add('active');
    this.classList.remove('bg-gray-100', 'text-gray-700');
    document.getElementById('login-tab').classList.remove('active');
    document.getElementById('login-tab').classList.add('bg-gray-100', 'text-gray-700');
});

// Password strength checker
document.getElementById('register-password').addEventListener('input', function () {
    const password = this.value;
    const strengthBar = document.getElementById('password-strength');
    const hint = document.getElementById('password-hint');

    // Reset
    strengthBar.className = 'password-strength';

    if (password.length === 0) {
        hint.textContent = 'Пароль должен содержать минимум 8 символов, включая цифры и буквы';
        return;
    }

    if (password.length < 8) {
        strengthBar.classList.add('weak');
        hint.textContent = 'Слишком короткий пароль (минимум 8 символов)';
        return;
    }

    // Check password strength
    let strength = 0;

    // Length contributes to strength
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Contains numbers
    if (/\d/.test(password)) strength += 1;

    // Contains lowercase and uppercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;

    // Contains special characters
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    // Update strength bar
    if (strength <= 2) {
        strengthBar.classList.add('weak');
        hint.textContent = 'Ненадежный пароль (добавьте цифры и буквы разных регистров)';
    } else if (strength === 3) {
        strengthBar.classList.add('medium');
        hint.textContent = 'Средний пароль (добавьте специальные символы)';
    } else if (strength === 4) {
        strengthBar.classList.add('strong');
        hint.textContent = 'Хороший пароль';
    } else {
        strengthBar.classList.add('very-strong');
        hint.textContent = 'Очень надежный пароль!';
    }
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Введите email и пароль');
        return;
    }

    try {
        const res = await fetch(`${apiBase}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) throw new Error('Ошибка входа');

        const data = await res.json(); // { userId, email, role }
        localStorage.setItem('roboUser', JSON.stringify(data));
        window.location.href = 'profile.html';
    } catch (err) {
        alert('Ошибка: ' + err.message);
    }
});

// Register form submission
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const firstName = document.getElementById('register-first-name').value.trim();
    const lastName = document.getElementById('register-last-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }

    const userData = { firstName, lastName, email, password, confirmPassword };

    try {
        const res = await fetch(`${apiBase}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!res.ok) throw new Error('Ошибка регистрации');

        // Auto-login after registration
        const loginRes = await fetch(`${apiBase}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!loginRes.ok) throw new Error('Вход после регистрации не удался');

        const loginData = await loginRes.json(); // { userId, email, role }
        localStorage.setItem('roboUser', JSON.stringify(loginData));
        window.location.href = 'profile.html';
    } catch (err) {
        alert('Ошибка: ' + err.message);
    }
});

document.querySelector('.bg-blue-700.rounded-r-full')?.addEventListener('click', function (e) {
    e.preventDefault();
    window.location.href = 'search.html';
});
