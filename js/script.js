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

// * Search

$("#Categories .title .search").click(function () {
    $(".popup[data-popup='search']").fadeIn(1);
    document.querySelector(".popup[data-popup='search'] > img").setAttribute("src", "./images/rope.svg");
    $(".popup[data-popup='search'] .popup-element").addClass("appear");

    setTimeout(function () {
        document.querySelector(".popup[data-popup='search'] > img").setAttribute("src", "");
    }, 3600);
});

$(".popup[data-popup='search'] .popup-element > p").click(function () {

    $(".popup[data-popup='search'] .popup-element").removeClass("appear");

    setTimeout(function () {
        $(".popup[data-popup='search']").fadeOut(500);
    }, 2100)

    document.querySelector(".popup[data-popup='search'] > img").setAttribute("src", "");
});

// * List Button

$("#Nav .favorites").click(function () {
    $(`.popup[data-popup='list']`).fadeIn(500, function () {
        $(".popup[data-popup='list'] .popup-element").addClass("appear");
    });
});

// * List
showMyList();

// * Loading Page 
window.addEventListener("DOMContentLoaded", function () {
    const loading  = document.querySelector(".loading");
    if (!loading) return;

    const left     = loading.querySelector(".cl");
    const right    = loading.querySelector(".cr");
    const DURATION = 3500;
    const EASE     = "cubic-bezier(.65, 0, .35, 1)";

    left.style.animation  = "openL " + DURATION + "ms " + EASE + " forwards";
    right.style.animation = "openR " + DURATION + "ms " + EASE + " forwards";

    setTimeout(function () {
        loading.style.transition = "opacity .5s ease";
        loading.style.opacity = "0";
    }, DURATION);

    setTimeout(function () {
        loading.style.display = "none";
        document.documentElement.style.overflow = "";
    }, DURATION + 500);
});

$("#Nav .account , footer .sign").click(function () {
    $(`.popup[data-popup='sign']`).fadeIn(500, function () {
        $(`.popup[data-popup='sign']`).addClass("d-flex");
        $(".popup[data-popup='sign'] .popup-element").addClass("appear");
    });
});