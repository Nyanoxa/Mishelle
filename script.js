
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".navigation");

if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
        menuButton.classList.toggle("active");
        navigation.classList.toggle("open");

        menuButton.setAttribute(
            "aria-expanded",
            navigation.classList.contains("open")
        );
    });

    document.querySelectorAll(".navigation a").forEach(link => {
        link.addEventListener("click", () => {
            menuButton.classList.remove("active");
            navigation.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
        });
    });
}


// Плавное появление блоков
if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    document.querySelectorAll(
        ".about, .menu-section, .care, .healthy, .atmosphere, .instagram, .contacts"
    ).forEach(section => {
        section.classList.add("animate");
        observer.observe(section);
    });
}


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

const hero = document.querySelector(".hero");

if (hero) {
    window.addEventListener("scroll", () => {
        if (window.innerWidth > 800) {
            const scroll = window.scrollY;
            hero.style.backgroundPosition =
                `center ${scroll * 0.35}px`;
        }
    });
}


const menuTabs = document.querySelectorAll(
    ".menu-section .menu-tabs button"
);

const categories = [
    "coffee",
    "breakfast",
    "main",
    "dessert",
    "healthy"
];

menuTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
        const category = categories[index];

        if (category) {
            window.location.href =
                `menu.html#${category}`;
        }
    });
});
