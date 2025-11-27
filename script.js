// script.js - Портал "Корочки.есть"

// Инициализация при загрузке страницы
window.onload = function() {
    checkAuthStatus();
    initializeData();
};

// Инициализация данных (создание администратора по умолчанию)
function initializeData() {
    // Проверяем, есть ли уже данные
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
        // Создаем администратора по умолчанию
        const admin = {
            id: 'admin-1',
            name: 'Администратор',
            email: 'Admin',
            password: 'KorokNET', // В реальном приложении пароль должен быть захеширован
            phone: '+7 (999) 000-00-00',
            role: 'admin',
            registrationDate: new Date().toISOString()
        };
        
        const users = [admin];
        localStorage.setItem('users', JSON.stringify(users));
    } else {
        // Обновляем существующего администратора, если он есть
        const users = JSON.parse(existingUsers);
        const adminIndex = users.findIndex(u => u.role === 'admin');
        if (adminIndex >= 0) {
            users[adminIndex].email = 'Admin';
            users[adminIndex].password = 'KorokNET';
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
    
    if (!localStorage.getItem('applications')) {
        localStorage.setItem('applications', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('reviews')) {
        localStorage.setItem('reviews', JSON.stringify([]));
    }
}

// Проверка статуса авторизации
function checkAuthStatus() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        showUserInterface(currentUser);
    } else {
        showGuestInterface();
    }
}

// Получение текущего пользователя
function getCurrentUser() {
    const userId = sessionStorage.getItem('currentUserId');
    if (!userId) return null;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.id === userId) || null;
}

// Показать интерфейс для гостя
function showGuestInterface() {
    hideAllSections();
    document.getElementById('home').style.display = 'block';
    document.getElementById('nav-register').style.display = 'block';
    document.getElementById('nav-login').style.display = 'block';
    document.getElementById('nav-profile').style.display = 'none';
    document.getElementById('nav-application').style.display = 'none';
    document.getElementById('nav-admin').style.display = 'none';
    document.getElementById('nav-logout').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Показать интерфейс для пользователя
function showUserInterface(user) {
    hideAllSections();
    document.getElementById('home').style.display = 'block';
    document.getElementById('nav-register').style.display = 'none';
    document.getElementById('nav-login').style.display = 'none';
    document.getElementById('nav-profile').style.display = 'block';
    document.getElementById('nav-application').style.display = 'block';
    document.getElementById('nav-logout').style.display = 'block';
    
    if (user.role === 'admin') {
        document.getElementById('nav-admin').style.display = 'block';
    } else {
        document.getElementById('nav-admin').style.display = 'none';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Скрыть все секции
function hideAllSections() {
    const sections = ['home', 'courses-section', 'primary-school-section', 'middle-school-section', 'about-section', 'register-section', 'login-section', 'application-section', 'profile-section', 'admin-section'];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
}

// Показать главную страницу
function showHome() {
    hideAllSections();
    document.getElementById('home').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Показать страницу курсов
function showCourses() {
    hideAllSections();
    document.getElementById('courses-section').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Показать курсы для начальной школы
function showPrimarySchoolCourses() {
    hideAllSections();
    document.getElementById('primary-school-section').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Показать курсы для средней школы
function showMiddleSchoolCourses() {
    hideAllSections();
    document.getElementById('middle-school-section').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Показать страницу "О нас"
function showAbout() {
    hideAllSections();
    document.getElementById('about-section').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Показать форму регистрации
function showRegisterForm() {
    hideAllSections();
    document.getElementById('register-section').style.display = 'block';
    document.getElementById('register-form').reset();
}

// Показать форму входа
function showLoginForm() {
    hideAllSections();
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('login-form').reset();
}

// Показать форму заявки
function showApplicationForm() {
    hideAllSections();
    document.getElementById('application-section').style.display = 'block';
    document.getElementById('application-form').reset();
    // Устанавливаем минимальную дату на сегодня
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').setAttribute('min', today);
}

// Показать профиль пользователя
function showUserProfile() {
    hideAllSections();
    document.getElementById('profile-section').style.display = 'block';
    
    const user = getCurrentUser();
    if (user) {
        document.getElementById('user-info').innerHTML = `
            <div class="user-card">
                <p><strong>ФИО:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Телефон:</strong> ${user.phone}</p>
                <p><strong>Дата регистрации:</strong> ${new Date(user.registrationDate).toLocaleDateString('ru-RU')}</p>
            </div>
        `;
        
        displayUserApplications(user.id);
        
        // Инициализируем интерактивность звездного рейтинга
        setTimeout(initializeStarRating, 100);
    }
}

// Инициализация интерактивности звездного рейтинга
function initializeStarRating() {
    const ratingInputs = document.querySelectorAll('.rating-input');
    ratingInputs.forEach(ratingInput => {
        const stars = ratingInput.querySelectorAll('.star-label');
        const radios = ratingInput.querySelectorAll('input[type="radio"]');
        
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', () => {
                highlightStars(ratingInput, index + 1);
        });
    });
    
        ratingInput.addEventListener('mouseleave', () => {
            const checked = ratingInput.querySelector('input[type="radio"]:checked');
            if (checked) {
                highlightStars(ratingInput, parseInt(checked.value));
            } else {
                clearStars(ratingInput);
            }
        });
        
        radios.forEach(radio => {
            radio.addEventListener('change', () => {
                highlightStars(ratingInput, parseInt(radio.value));
            });
        });
    });
}

// Подсветка звезд
function highlightStars(ratingInput, count) {
    const stars = ratingInput.querySelectorAll('.star-label');
    stars.forEach((star, index) => {
        if (index < count) {
            star.style.color = 'var(--warning-color)';
        } else {
            star.style.color = 'var(--border-color)';
        }
    });
}

// Очистка подсветки звезд
function clearStars(ratingInput) {
    const stars = ratingInput.querySelectorAll('.star-label');
    stars.forEach(star => {
        star.style.color = 'var(--border-color)';
    });
}

// Показать панель администратора
function showAdminPanel() {
    hideAllSections();
    document.getElementById('admin-section').style.display = 'block';
    displayAllApplications();
}

// Обработка регистрации
function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const phone = formData.get('phone');
    
    // Получаем существующих пользователей
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Проверяем, существует ли пользователь с таким email
    if (users.find(u => u.email === email)) {
        showMessage('Пользователь с таким email уже зарегистрирован', 'error');
        return;
    }
    
    // Создаем нового пользователя
    const newUser = {
        id: 'user-' + Date.now(),
        name: name,
        email: email,
        password: password, // В реальном приложении пароль должен быть захеширован
        phone: phone,
        role: 'user',
        registrationDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage('Регистрация успешна! Теперь вы можете войти в систему.', 'success');
    setTimeout(() => {
        showLoginForm();
    }, 1500);
}

// Обработка входа
function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Получаем пользователей
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Ищем пользователя
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        sessionStorage.setItem('currentUserId', user.id);
        showMessage('Вход выполнен успешно!', 'success');
        setTimeout(() => {
            showUserInterface(user);
        }, 1000);
    } else {
        showMessage('Неверный email или пароль', 'error');
    }
}

// Обработка подачи заявки
function handleApplication(event) {
    event.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
        showMessage('Необходимо войти в систему', 'error');
        showLoginForm();
        return;
    }
    
    const formData = new FormData(event.target);
    const courseName = formData.get('courseName');
    const startDate = formData.get('startDate');
    const paymentMethod = formData.get('paymentMethod');
    
    // Получаем существующие заявки
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    
    // Создаем новую заявку
    const newApplication = {
        id: 'app-' + Date.now(),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        courseName: courseName,
        startDate: startDate,
        paymentMethod: paymentMethod,
        status: 'new', // new, in_progress, completed
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    applications.push(newApplication);
    localStorage.setItem('applications', JSON.stringify(applications));
    
    showMessage('Заявка успешно подана! Она будет рассмотрена администратором.', 'success');
    setTimeout(() => {
        showUserProfile();
    }, 1500);
}

// Отображение заявок пользователя
function displayUserApplications(userId) {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const userApplications = applications.filter(app => app.userId === userId);
    
    // Сортируем заявки по дате создания (новые сначала)
    const sortedApplications = userApplications.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    const container = document.getElementById('user-applications');
    
    if (sortedApplications.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>У вас пока нет заявок.</p><button onclick="showApplicationForm()" class="btn btn-primary">Подать заявку</button></div>';
        return;
    }
    
    container.innerHTML = sortedApplications.map(app => {
        const review = reviews.find(r => r.applicationId === app.id);
        const hasReview = !!review;
        
        return `
        <div class="application-card user-application-card" data-application-id="${app.id}">
            <div class="application-header">
                <h4>${app.courseName}</h4>
                <span class="status status-${app.status}">${getStatusText(app.status)}</span>
            </div>
            <div class="application-info">
                <p><strong>Дата начала обучения:</strong> ${new Date(app.startDate).toLocaleDateString('ru-RU')}</p>
                <p><strong>Способ оплаты:</strong> ${app.paymentMethod}</p>
                <p><strong>Дата подачи заявки:</strong> ${new Date(app.createdAt).toLocaleDateString('ru-RU')}</p>
                ${app.updatedAt ? `<p><strong>Последнее обновление:</strong> ${new Date(app.updatedAt).toLocaleDateString('ru-RU')}</p>` : ''}
            </div>
            
            ${(app.status === 'in_progress' || app.status === 'completed') ? `
                <div class="review-section">
                    ${hasReview ? `
                        <div class="existing-review">
                            <h5>Ваш отзыв:</h5>
                            <div class="review-rating">
                                ${generateStarRating(review.rating)}
                            </div>
                            <p class="review-text">${review.text}</p>
                            <p class="review-date">Оставлен: ${new Date(review.createdAt).toLocaleDateString('ru-RU')}</p>
                            <button onclick="editReview('${app.id}')" class="btn btn-secondary btn-small">Изменить отзыв</button>
                        </div>
                    ` : `
                        <div class="review-form-container" id="review-form-${app.id}">
                            <h5>Оставить отзыв о качестве образовательных услуг</h5>
                            <form onsubmit="submitReview(event, '${app.id}')" class="review-form">
                                <div class="form-group">
                                    <label>Оценка:</label>
                                    <div class="rating-input">
                                        <input type="radio" id="rating-${app.id}-5" name="rating-${app.id}" value="5" required>
                                        <label for="rating-${app.id}-5" class="star-label">★</label>
                                        <input type="radio" id="rating-${app.id}-4" name="rating-${app.id}" value="4" required>
                                        <label for="rating-${app.id}-4" class="star-label">★</label>
                                        <input type="radio" id="rating-${app.id}-3" name="rating-${app.id}" value="3" required>
                                        <label for="rating-${app.id}-3" class="star-label">★</label>
                                        <input type="radio" id="rating-${app.id}-2" name="rating-${app.id}" value="2" required>
                                        <label for="rating-${app.id}-2" class="star-label">★</label>
                                        <input type="radio" id="rating-${app.id}-1" name="rating-${app.id}" value="1" required>
                                        <label for="rating-${app.id}-1" class="star-label">★</label>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="review-text-${app.id}">Текст отзыва:</label>
                                    <textarea id="review-text-${app.id}" name="reviewText" rows="4" required placeholder="Поделитесь своими впечатлениями о курсе..."></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Отправить отзыв</button>
                            </form>
                        </div>
                    `}
                </div>
            ` : ''}
        </div>
    `;
    }).join('');
}

// Генерация звездного рейтинга
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<span class="star filled">★</span>';
        } else {
            stars += '<span class="star">★</span>';
        }
    }
    return stars;
}

// Отправка отзыва
function submitReview(event, applicationId) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const rating = form.querySelector(`input[name="rating-${applicationId}"]:checked`).value;
    const text = formData.get('reviewText');
    
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    // Проверяем, есть ли уже отзыв для этой заявки
    const existingReviewIndex = reviews.findIndex(r => r.applicationId === applicationId);
    
    const review = {
        id: existingReviewIndex >= 0 ? reviews[existingReviewIndex].id : 'review-' + Date.now(),
        applicationId: applicationId,
        userId: getCurrentUser().id,
        rating: parseInt(rating),
        text: text,
        createdAt: existingReviewIndex >= 0 ? reviews[existingReviewIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    if (existingReviewIndex >= 0) {
        reviews[existingReviewIndex] = review;
    } else {
        reviews.push(review);
    }
    
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    showMessage('Отзыв успешно сохранен!', 'success');
    
    // Обновляем отображение заявок
    const user = getCurrentUser();
    if (user) {
        displayUserApplications(user.id);
        // Инициализируем интерактивность звездного рейтинга после обновления
        setTimeout(initializeStarRating, 100);
    }
}

// Редактирование отзыва
function editReview(applicationId) {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const review = reviews.find(r => r.applicationId === applicationId);
    
    if (!review) return;
    
    // Находим родительский элемент заявки
    const applicationCard = document.querySelector(`[data-application-id="${applicationId}"]`);
    if (!applicationCard) return;
    
    const reviewSection = applicationCard.querySelector('.review-section');
    if (!reviewSection) return;
    
    reviewSection.innerHTML = `
        <div class="review-form-container" id="review-form-${applicationId}">
            <h5>Изменить отзыв</h5>
            <form onsubmit="submitReview(event, '${applicationId}')" class="review-form">
                <div class="form-group">
                    <label>Оценка:</label>
                    <div class="rating-input">
                        <input type="radio" id="rating-${applicationId}-5" name="rating-${applicationId}" value="5" ${review.rating === 5 ? 'checked' : ''} required>
                        <label for="rating-${applicationId}-5" class="star-label">★</label>
                        <input type="radio" id="rating-${applicationId}-4" name="rating-${applicationId}" value="4" ${review.rating === 4 ? 'checked' : ''} required>
                        <label for="rating-${applicationId}-4" class="star-label">★</label>
                        <input type="radio" id="rating-${applicationId}-3" name="rating-${applicationId}" value="3" ${review.rating === 3 ? 'checked' : ''} required>
                        <label for="rating-${applicationId}-3" class="star-label">★</label>
                        <input type="radio" id="rating-${applicationId}-2" name="rating-${applicationId}" value="2" ${review.rating === 2 ? 'checked' : ''} required>
                        <label for="rating-${applicationId}-2" class="star-label">★</label>
                        <input type="radio" id="rating-${applicationId}-1" name="rating-${applicationId}" value="1" ${review.rating === 1 ? 'checked' : ''} required>
                        <label for="rating-${applicationId}-1" class="star-label">★</label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="review-text-${applicationId}">Текст отзыва:</label>
                    <textarea id="review-text-${applicationId}" name="reviewText" rows="4" required>${review.text}</textarea>
                </div>
                <button type="submit" class="btn btn-primary">Сохранить изменения</button>
                <button type="button" onclick="displayUserApplications('${getCurrentUser().id}')" class="btn btn-secondary">Отмена</button>
            </form>
        </div>
    `;
    
    // Инициализируем интерактивность звездного рейтинга
    setTimeout(initializeStarRating, 100);
}

// Отображение всех заявок для администратора
function displayAllApplications() {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const container = document.getElementById('applications-list');
    
    if (applications.length === 0) {
        container.innerHTML = '<p>Заявок пока нет.</p>';
        return;
    }
    
    // Сортируем заявки по дате создания (новые сначала)
    const sortedApplications = applications.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    container.innerHTML = sortedApplications.map(app => {
        // Определяем доступные действия в зависимости от текущего статуса
        let actionButtons = '';
        
        if (app.status === 'new') {
            actionButtons = `
                <button onclick="changeApplicationStatus('${app.id}', 'in_progress')" class="btn btn-success">Идет обучение</button>
                <button onclick="changeApplicationStatus('${app.id}', 'completed')" class="btn btn-primary">Обучение завершено</button>
            `;
        } else if (app.status === 'in_progress') {
            actionButtons = `
                <button onclick="changeApplicationStatus('${app.id}', 'new')" class="btn btn-secondary">Вернуть в "Новая"</button>
                <button onclick="changeApplicationStatus('${app.id}', 'completed')" class="btn btn-primary">Обучение завершено</button>
            `;
        } else if (app.status === 'completed') {
            actionButtons = `
                <button onclick="changeApplicationStatus('${app.id}', 'new')" class="btn btn-secondary">Вернуть в "Новая"</button>
                <button onclick="changeApplicationStatus('${app.id}', 'in_progress')" class="btn btn-success">Вернуть в "Идет обучение"</button>
            `;
        }
        
        return `
        <div class="application-card admin-card">
            <div class="application-header">
                <h4>${app.courseName}</h4>
                <span class="status status-${app.status}">${getStatusText(app.status)}</span>
            </div>
            <div class="application-info">
                <p><strong>Пользователь:</strong> ${app.userName} (${app.userEmail})</p>
                <p><strong>Дата начала обучения:</strong> ${new Date(app.startDate).toLocaleDateString('ru-RU')}</p>
                <p><strong>Способ оплаты:</strong> ${app.paymentMethod}</p>
                <p><strong>Дата подачи:</strong> ${new Date(app.createdAt).toLocaleDateString('ru-RU')}</p>
                ${app.updatedAt ? `<p><strong>Последнее обновление:</strong> ${new Date(app.updatedAt).toLocaleDateString('ru-RU')}</p>` : ''}
            </div>
            <div class="application-actions">
                ${actionButtons}
            </div>
        </div>
    `;
    }).join('');
}

// Изменение статуса заявки
function changeApplicationStatus(applicationId, newStatus) {
    const applications = JSON.parse(localStorage.getItem('applications') || '[]');
    const application = applications.find(app => app.id === applicationId);
    
    if (application) {
        application.status = newStatus;
        application.updatedAt = new Date().toISOString();
        localStorage.setItem('applications', JSON.stringify(applications));
        
        showMessage(`Статус заявки изменен на "${getStatusText(newStatus)}"`, 'success');
        displayAllApplications();
    }
}

// Получить текст статуса
function getStatusText(status) {
    const statuses = {
        'new': 'Новая',
        'in_progress': 'Идет обучение',
        'completed': 'Обучение завершено'
    };
    return statuses[status] || status;
}

// Выход из системы
function logout() {
    sessionStorage.removeItem('currentUserId');
    showMessage('Вы вышли из системы', 'success');
    setTimeout(() => {
        showGuestInterface();
    }, 1000);
}

// Показать сообщение
function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message message-${type}`;
    messageEl.style.display = 'block';
    
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 3000);
}
