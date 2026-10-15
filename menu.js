
const products = [
    {
        name: "Капучино",
        description: "Эспрессо · молоко",
        price: 220,
        image: "coffee.jpg",
        category: "coffee"
    },
    {
        name: "Матча латте",
        description: "Матча · молоко",
        price: 240,
        image: "coffee1.jpg",
        category: "coffee"
    },
    {
        name: "Латте",
        description: "Эспрессо · нежное молоко",
        price: 230,
        image: "coffee.jpg",
        category: "coffee"
    },
    {
        name: "Тост с авокадо",
        description: "Авокадо · семена · хлеб",
        price: 280,
        image: "food.jpg",
        category: "breakfast"
    },
    {
        name: "Сырники",
        description: "Творог · сметана · ягоды",
        price: 320,
        image: "food.jpg",
        category: "breakfast"
    },
    {
        name: "Омлет с зеленью",
        description: "Яйца · зелень · свежие овощи",
        price: 290,
        image: "food.jpg",
        category: "breakfast"
    },
    {
        name: "Паста с курицей",
        description: "Паста · курица · сливочный соус",
        price: 420,
        image: "food.jpg",
        category: "main"
    },
    {
        name: "Боул с лососем",
        description: "Лосось · рис · авокадо · овощи",
        price: 490,
        image: "healthy.png",
        category: "main"
    },
    {
        name: "Баскский чизкейк",
        description: "Сливочный сыр · ваниль",
        price: 260,
        image: "food1.jpg",
        category: "dessert"
    },
    {
        name: "Морковный торт",
        description: "Морковь · орехи · крем",
        price: 270,
        image: "food1.jpg",
        category: "dessert"
    },
    {
        name: "Зелёный боул",
        description: "Авокадо · киноа · овощи",
        price: 390,
        image: "healthy.png",
        category: "healthy"
    },
    {
        name: "Салат с киноа",
        description: "Киноа · овощи · зелень",
        price: 350,
        image: "healthy.png",
        category: "healthy"
    }
];


// Каталог блюд
const catalogGrid = document.querySelector("#catalogGrid");
const catalogTabs = document.querySelectorAll(
    ".catalog-tabs button"
);

function renderProducts(category = "all") {
    if (!catalogGrid) return;

    const filteredProducts = category === "all"
        ? products
        : products.filter(product => product.category === category);

    catalogGrid.innerHTML = filteredProducts.map(product => `
        <article class="menu-card">
            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <p class="menu-name">${product.name}</p>

            <p class="menu-info">${product.description}</p>

            <span class="menu-price">${product.price} сом</span>
        </article>
    `).join("");
}


// категорий
function selectCategory(category = "all") {
    const categories = [
        "all",
        "coffee",
        "breakfast",
        "main",
        "dessert",
        "healthy"
    ];

    const selected = categories.includes(category)
        ? category
        : "all";

    catalogTabs.forEach(tab => {
        const isActive = tab.dataset.category === selected;

        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-pressed", String(isActive));
    });

    renderProducts(selected);
}


// Нажатие на категории
catalogTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const category = tab.dataset.category;

        selectCategory(category);

        history.replaceState(
            null,
            "",
            `${window.location.pathname}${window.location.search}#${category}`
        );

        if (window.innerWidth <= 800) {
            tab.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center"
            });
        }
    });
});


// Переход к категории по ссылке
window.addEventListener("hashchange", () => {
    selectCategory(window.location.hash.slice(1));
});

selectCategory(window.location.hash.slice(1) || "all");


// Кнопка наверх
const backTop = document.querySelector(".back-top");

if (backTop) {
    backTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}


// Мобильное меню
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".navigation");

if (menuButton && navigation) {

    function closeMenu() {
        menuButton.classList.remove("active");
        navigation.classList.remove("open");

        menuButton.setAttribute("aria-expanded", "false");

        document.body.style.overflow = "";
    }

    function openMenu() {
        menuButton.classList.add("active");
        navigation.classList.add("open");

        menuButton.setAttribute("aria-expanded", "true");

        document.body.style.overflow = "hidden";
    }

    menuButton.addEventListener("click", () => {
        if (navigation.classList.contains("open")) {
            closeMenu();
        } else {
            openMenu();
        }
    });


    // Закрытие после перехода
    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });


    // Закрытие при нажатии вне меню
    document.addEventListener("click", event => {
        if (
            navigation.classList.contains("open") &&
            !navigation.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            closeMenu();
        }
    });


    // Закрытие клавишей Escape
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });


    // Закрытие при изменении размера экрана
    window.addEventListener("resize", () => {
        if (window.innerWidth > 800) {
            closeMenu();
        }
    });
}
