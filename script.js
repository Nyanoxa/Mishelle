
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".navigation");

menuButton.addEventListener("click", () => {
    menuButton.classList.toggle("active");
    navigation.classList.toggle("open");
});


// Закрытие меню после перехода
document.querySelectorAll(".navigation a").forEach(link => {
    link.addEventListener("click", () => {
        menuButton.classList.remove("active");
        navigation.classList.remove("open");
    });
});


// Плавное появление блоков
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
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


// Кнопка наверх
const backTop = document.querySelector(".back-top");

backTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


// Parallax для Hero
const hero = document.querySelector(".hero");

window.addEventListener("scroll", () => {
    if (window.innerWidth > 800) {
        const scroll = window.scrollY;

        hero.style.backgroundPosition = `center ${scroll * 0.35}px`;
    }
});


// Категории меню
const menuTabs = document.querySelectorAll(".menu-tabs button");

menuTabs.forEach(tab => {
    tab.addEventListener("click", () => {

        menuTabs.forEach(item => {
            item.classList.remove("active");
        });

        tab.classList.add("active");
    });
});