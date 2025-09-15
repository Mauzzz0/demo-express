// Конфигурация API
const API_BASE_URL = 'http://localhost:2000';

// Глобальные переменные
let currentUser = null;
let currentPage = 1;
const tasksPerPage = 6;
let totalTasks = 0;
const currentFilters = {
  search: '',
  sortBy: '',
  sortDirection: '',
};
let searchTimeout = null;

// Утилиты
function showNotification(message, type = 'info') {
  const toast = document.getElementById('notificationToast');
  const toastMessage = document.getElementById('toastMessage');

  toastMessage.textContent = message;
  toast.className = `toast ${type === 'error' ? 'bg-danger text-white' : ''}`;

  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}

function setLoading(element, loading = true) {
  if (loading) {
    element.classList.add('loading');
  } else {
    element.classList.remove('loading');
  }
}

// Аутентификация
function saveToken(token) {
  localStorage.setItem('accessToken', token);
}

function getToken() {
  return localStorage.getItem('accessToken');
}

function clearToken() {
  localStorage.removeItem('accessToken');
}

function isAuthenticated() {
  return getToken() !== null;
}

// API запросы
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const finalOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    finalOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, finalOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка сервера');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Функции аутентификации
async function login(credentials) {
  try {
    const response = await apiRequest('/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    saveToken(response.accessToken);
    currentUser = { email: credentials.email };
    showPage('tasks');
    showNotification('Успешный вход в систему!', 'success');
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

async function register(userData) {
  try {
    await apiRequest('/user/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    showNotification('Регистрация успешна! Теперь вы можете войти в систему.', 'success');
    // Очищаем форму регистрации
    document.getElementById('registerForm').reset();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

function logout() {
  clearToken();
  currentUser = null;
  showPage('login');
  showNotification('Вы вышли из системы');
}

// Управление страницами
function showPage(page) {
  const loginPage = document.getElementById('loginPage');
  const tasksPage = document.getElementById('tasksPage');
  const logoutBtn = document.getElementById('logoutBtn');

  if (page === 'login') {
    loginPage.classList.remove('hidden');
    tasksPage.classList.add('hidden');
    logoutBtn.style.display = 'none';
  } else if (page === 'tasks') {
    loginPage.classList.add('hidden');
    tasksPage.classList.remove('hidden');
    logoutBtn.style.display = 'block';
    loadTasks();
  }
}

// Функции для работы с задачами
async function loadTasks() {
  try {
    setLoading(document.getElementById('tasksList'), true);

    const offset = (currentPage - 1) * tasksPerPage;
    const params = new URLSearchParams({
      limit: tasksPerPage,
      offset: offset,
      ...(currentFilters.search ? { search: currentFilters.search } : {}),
      ...(currentFilters.sortBy ? { sortBy: currentFilters.sortBy } : {}),
      ...(currentFilters.sortDirection ? { sortDirection: currentFilters.sortDirection } : {}),
    });

    const response = await apiRequest(`/task?${params}`);
    totalTasks = response.total;

    displayTasks(response.data);
    updatePagination();
  } catch (error) {
    showNotification(error.message, 'error');
  } finally {
    setLoading(document.getElementById('tasksList'), false);
  }
}

function displayTasks(tasks) {
  const tasksList = document.getElementById('tasksList');

  if (tasks.length === 0) {
    tasksList.innerHTML = `
                    <div class="col-12">
                        <div class="text-center py-5">
                            <i class="fas fa-tasks fa-3x text-muted mb-3"></i>
                            <h5 class="text-muted">Задач не найдено</h5>
                            <p class="text-muted">Создайте свою первую задачу!</p>
                        </div>
                    </div>
                `;
    return;
  }

  tasksList.innerHTML = tasks
    .map(
      (task) => `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card task-card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${task.title}</h5>
                            <p class="card-text">${task.description || 'Без описания'}</p>
                            <small class="text-muted">
                                <i class="fas fa-calendar me-1"></i>
                                ${new Date(task.createdAt).toLocaleDateString('ru-RU')}
                            </small>
                        </div>
                        <div class="card-footer bg-transparent">
                            <div class="btn-group w-100" role="group">
                                <button class="btn btn-outline-primary btn-sm" onclick="editTask('${task.id}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-outline-danger btn-sm delete-task-btn" data-task-id="${task.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
    )
    .join('');
}

function updatePagination() {
  const totalPages = Math.ceil(totalTasks / tasksPerPage);
  const pagination = document.getElementById('pagination');

  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let paginationHTML = '';

  // Предыдущая страница
  paginationHTML += `
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Предыдущая</a>
                </li>
            `;

  // Номера страниц
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      paginationHTML += `
                        <li class="page-item ${i === currentPage ? 'active' : ''}">
                            <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                        </li>
                    `;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
    }
  }

  // Следующая страница
  paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Следующая</a>
                </li>
            `;

  pagination.innerHTML = paginationHTML;
}

function changePage(page) {
  if (page < 1 || page > Math.ceil(totalTasks / tasksPerPage)) return;
  currentPage = page;
  loadTasks();
}

// CRUD операции с задачами
async function createTask(taskData) {
  try {
    await apiRequest('/task', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });

    showNotification('Задача создана успешно!');
    loadTasks();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

async function updateTask(taskId, taskData) {
  try {
    await apiRequest(`/task/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });

    showNotification('Задача обновлена успешно!');
    loadTasks();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

async function deleteTask(taskId) {
  try {
    await apiRequest(`/task/${taskId}`, {
      method: 'DELETE',
    });

    showNotification('Задача удалена успешно!');
    loadTasks();
  } catch (error) {
    showNotification(error.message, 'error');
  }
}

function editTask(taskId) {
  // Загружаем данные задачи для редактирования
  apiRequest(`/task/${taskId}`)
    .then((task) => {
      document.getElementById('taskId').value = task.id;
      document.getElementById('taskTitle').value = task.title;
      document.getElementById('taskDescription').value = task.description || '';
      document.getElementById('taskModalTitle').textContent = 'Редактировать задачу';

      const modal = new bootstrap.Modal(document.getElementById('taskModal'));
      modal.show();
    })
    .catch((error) => {
      showNotification(error.message, 'error');
    });
}

function confirmDeleteTask(taskId) {
  const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
  modal.show();

  // Сохраняем ID задачи в data-атрибут модального окна
  document.getElementById('deleteModal').setAttribute('data-task-id', taskId);
}

// Утилиты
// function escapeHtml(text) {
//     const div = document.createElement('div');
//     div.textContent = text;
//     return div.innerHTML;
// }

// Обработчики событий
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const credentials = {
    email: document.getElementById('loginEmail').value,
    password: document.getElementById('loginPassword').value,
  };
  login(credentials);
});

document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const userData = {
    name: document.getElementById('registerName').value,
    email: document.getElementById('registerEmail').value,
    password: document.getElementById('registerPassword').value,
  };
  register(userData);
});

document.getElementById('logoutBtn').addEventListener('click', logout);

// Обработчик для кнопки подтверждения удаления
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
  const taskId = document.getElementById('deleteModal').getAttribute('data-task-id');
  if (taskId) {
    deleteTask(taskId);
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    modal.hide();
  }
});

// Обработчик для кнопок удаления задач (делегирование событий)
document.addEventListener('click', (e) => {
  if (e.target.closest('.delete-task-btn')) {
    const taskId = e.target.closest('.delete-task-btn').getAttribute('data-task-id');
    confirmDeleteTask(taskId);
  }
});

document.getElementById('saveTaskBtn').addEventListener('click', () => {
  const taskId = document.getElementById('taskId').value;
  const title = document.getElementById('taskTitle').value;
  const description = document.getElementById('taskDescription').value;

  if (!title.trim()) {
    showNotification('Название задачи обязательно!', 'error');
    return;
  }

  const taskData = {
    title: title.trim(),
    description: description.trim(),
  };

  if (taskId) {
    updateTask(taskId, taskData);
  } else {
    createTask(taskData);
  }

  const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
  modal.hide();

  // Очищаем форму
  document.getElementById('taskForm').reset();
  document.getElementById('taskModalTitle').textContent = 'Добавить задачу';
});

// Обработчики фильтров
document.getElementById('searchInput').addEventListener('input', (e) => {
  // Очищаем предыдущий таймаут
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Устанавливаем новый таймаут на 500мс
  searchTimeout = setTimeout(() => {
    currentFilters.search = e.target.value;
    currentPage = 1;
    loadTasks();
  }, 500);
});

document.getElementById('orderBySelect').addEventListener('change', (e) => {
  currentFilters.sortBy = e.target.value;
  currentPage = 1;
  loadTasks();
});

document.getElementById('orderDirectionSelect').addEventListener('change', (e) => {
  currentFilters.sortDirection = e.target.value;
  currentPage = 1;
  loadTasks();
});

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  if (isAuthenticated()) {
    showPage('tasks');
  } else {
    showPage('login');
  }
});

// Глобальные функции для вызова из HTML
window.editTask = editTask;
window.changePage = changePage;
