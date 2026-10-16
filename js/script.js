let nav = document.querySelector("#Nav"),
    navLinks = document.querySelectorAll("#Nav .nav-links ul a");
getMovies();

// * Swiper JS
const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    speed: 700,
    centeredSlides: true,

    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    },

    pagination: {
        el: ".swiper-pagination",
        clickable: true, dynamicBullets: false,
    },

    effect: "coverflow",

    coverflowEffect: {
        rotate: -10,
        stretch: 0,
        depth: 50,
        modifier: 1,
        slideShadows: false,
    },

    breakpoints: {
        0: { slidesPerView: 1 },
        576: { slidesPerView: 2 },
        992: { slidesPerView: 4 },
    },
});

// * Navbar
window.addEventListener("scroll", function () {
    navLinks.forEach(function (link) {
        let currentActive = document.querySelector("#Nav .nav-links ul li.active"),
            currentId = link.getAttribute("href"),
            currentSection = document.querySelector(currentId),
            topOfSection = currentSection.offsetTop - nav.clientHeight,
            bottomOfSection = topOfSection + currentSection.clientHeight;

        if (window.scrollY >= topOfSection && window.scrollY < bottomOfSection) {
            currentActive.classList.remove("active");

            link.parentElement.classList.add("active");
        }

    });
});