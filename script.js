// Данные о книгах
const books = [
    {
        id: 1,
        title: "Включите сердце и мозги",
        author: "Дария Бикбаева",
        category: "handmade",
        price: 5,
        image: "https://www.mann-ivanov-ferber.ru/assets/images/books/ta-dam/ta-dam-big.png",
        description: "Книга о бизнес-творчестве и креативном подходе к работе"
    },
    {
        id: 2,
        title: "Handmade",
        author: "Кари Чапан",
        category: "handmade",
        price: 5,
        image: "https://www.mann-ivanov-ferber.ru/assets/images/books/biznes_svoimi_rukami/biznes_svoimi_rukami-big.png",
        description: "Руководство по созданию handmade-бизнеса"
    },
    {
        id: 3,
        title: "Бизнес в интернете на примере известных брендов",
        author: "Пол Маккарти",
        category: "biznes",
        price: 5,
        image: "https://cdn.respublica.ru/uploads/01/00/00/c2/8p/bdf69642f898a42b.jpg?1554291648",
        description: "Анализ успешных интернет-брендов и их стратегий"
    },
    {
        id: 4,
        title: "Как зарабатывать в Instagram",
        author: "Дарья Манелова",
        category: "biznes",
        price: 5,
        image: "https://cdn.respublica.ru/uploads/01/00/00/b6/bv/4daff90980dbc1cc.jpg?1545081886",
        description: "Практическое руководство по монетизации Instagram"
    },
    {
        id: 5,
        title: "Как заработать в Интернете",
        author: "Наталья Покатилова",
        category: "biznes",
        price: 5,
        image: "https://cdn.respublica.ru/uploads/01/00/00/cu/0x/e1613e09b203eb77.jpg?1574292371",
        description: "Современные методы заработка в сети"
    },
    {
        id: 6,
        title: "О мой блог! Как начать вести блог и не останавливаться",
        author: "Анна Шуст",
        category: "biznes",
        price: 5,
        image: "https://cdn.respublica.ru/uploads/01/00/00/cm/xv/1a398205ae3b629c.jpg?1571303823",
        description: "Руководство по созданию и ведению успешного блога"
    },
    {
        id: 7,
        title: "Дурная кровь. Тайны и ложь одного стартапа Кремниевой долины",
        author: "Джона Каррейру",
        category: "biznes",
        price: 5,
        image: "https://cdn.litres.ru/pub/c/cover_200/49769803.webp",
        description: "Разоблачение скандального стартапа Theranos"
    },
    {
        id: 8,
        title: "10 уроках для мира после пандемии",
        author: "Фарид Закария",
        category: "biznes",
        price: 5,
        image: "https://cdn.litres.ru/pub/c/cover_200/67423319.webp",
        description: "Анализ изменений в мире после COVID-19"
    },
    {
        id: 9,
        title: "Сложные решения. Как управлять бизнесом, когда нет простых ответов",
        author: "Бен Хоровиц",
        category: "biznes",
        price: 5,
        image: "https://cdn.litres.ru/pub/c/cover_200/66353850.webp",
        description: "Советы по управлению бизнесом в сложных ситуациях"
    }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('cart')) || { items: [], total: 0 };

// DOM элементы
const booksContainer = document.getElementById('books-container');
const categoryButtons = document.querySelectorAll('.categories button');
const cartCounter = document.getElementById('cart-counter');
const cartLink = document.getElementById('cart-link');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.querySelector('.close');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');

// Функция для отображения книг
function renderBooks(category = 'all') {
    booksContainer.innerHTML = '';
    
    const filteredBooks = category === 'all' 
        ? books 
        : books.filter(book => book.category === category);
    
    filteredBooks.forEach((book, index) => {
        const bookCard = document.createElement('article');
        bookCard.className = 'book-card';
        bookCard.style.animationDelay = `${index * 0.1}s`;
        bookCard.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <h3 data-category="${book.category}">${book.title}</h3>
            <p>Автор: ${book.author}</p>
            <p>${book.description}</p>
            <p>Цена: ${book.price} ₽</p>
            <button onclick="addToCart(${book.id})">В корзину</button>
        `;
        booksContainer.appendChild(bookCard);
    });
}

// Функция для обновления счетчика корзины
function updateCartCounter() {
    const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    cartCounter.textContent = itemCount;
}

// Функция для добавления в корзину
function addToCart(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    const existingItem = cart.items.find(item => item.id === bookId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.items.push({
            id: book.id,
            title: book.title,
            price: book.price,
            quantity: 1
        });
    }

    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    
    // Показываем уведомление
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = `${book.title} добавлена в корзину`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 2000);
}

// Функция для отображения корзины
function renderCart() {
    cartItemsContainer.innerHTML = '';
    
    if (cart.items.length === 0) {
        cartItemsContainer.innerHTML = '<p>Ваша корзина пуста</p>';
        totalPriceElement.textContent = '0';
        return;
    }
    
    cart.items.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p>${item.price} ₽ × ${item.quantity} = ${item.price * item.quantity} ₽</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
                <button onclick="removeFromCart(${item.id})">×</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    totalPriceElement.textContent = cart.total;
}

// Функция для изменения количества товара
function changeQuantity(bookId, delta) {
    const item = cart.items.find(item => item.id === bookId);
    if (!item) return;

    item.quantity += delta;
    
    if (item.quantity <= 0) {
        cart.items = cart.items.filter(i => i.id !== bookId);
    }
    
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    renderCart();
}

// Функция для удаления из корзины
function removeFromCart(bookId) {
    cart.items = cart.items.filter(item => item.id !== bookId);
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    renderCart();
}

// Функция для оформления заказа
function checkout() {
    if (cart.items.length === 0) {
        alert('Ваша корзина пуста!');
        return;
    }
    
    alert(`Заказ на сумму ${cart.total} ₽ оформлен! Спасибо за покупку!`);
    cart = { items: [], total: 0 };
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    renderCart();
    cartModal.style.display = 'none';
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    // Загружаем все книги по умолчанию
    renderBooks();
    updateCartCounter();
    
    // Обработчики для кнопок категорий
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderBooks(button.dataset.category);
        });
    });
    
    // Обработчики для корзины
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        renderCart();
        cartModal.style.display = 'block';
    });
    
    closeModal.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    checkoutBtn.addEventListener('click', checkout);
});

// Добавляем функции в глобальную область видимости
window.addToCart = addToCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;