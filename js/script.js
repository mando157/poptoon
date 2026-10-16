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

    mousewheel: {
        invert: true,
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