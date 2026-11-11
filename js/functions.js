// * Variables
let allMoviesData = [],
    isFirstMovie = true,
    pages = [],
    currentPage = 1,

    listContainer = [],
    isDark = "false",

    body = document.querySelector("body");


// * Localstorage

if (localStorage.getItem('listContainer') == null) {
    localStorage.setItem('listContainer', JSON.stringify([]));
} else {
    listContainer = JSON.parse(localStorage.getItem('listContainer'));
}
if (localStorage.getItem('isDark') == null) {
    localStorage.setItem('isDark', "false");
} else {
    isDark = localStorage.getItem('isDark');
}

body.setAttribute(
    "data-theme",
    ((isDark == "true") ? "dark" : "light")
);

function updateLocalStorage() {
    localStorage.setItem('isDark', isDark);
    localStorage.setItem('listContainer', JSON.stringify(listContainer));
}

// * Mood
$(".nav-toggle").on("click", function () {
    $(".nav-links ul").toggleClass("open");
});

$("section , header").click(function () {
    $(".nav-links ul").removeClass("open");
});

$(".mood").on("click", function () {

    if (body.getAttribute("data-theme") === "light") {
        $(".mood i").addClass("fa-sun").removeClass("fa-moon");
        $(".logo img").attr("src", "./images/dark_logo.png");
        $("#Categories .title .search").attr("src", "./images/light_search.gif");

        isDark = "true";
    } else {
        $(".mood i").addClass("fa-moon").removeClass("fa-sun");
        $(".logo img").attr("src", "./images/light_logo.png");
        $("#Categories .title .search").attr("src", "./images/dark_search.gif");

        isDark = "false";
    }

    body.setAttribute(
        "data-theme",
        isDark === "true" ? "dark" : "light"
    );

    updateLocalStorage();
});


// * Get Movies
async function getMovies() {
    let movies = await fetch(
        `https://mando157.github.io/moviesJSON/data/top.json`
    );

    let allMovies = await fetch(
        `https://mando157.github.io/moviesJSON/data/allMovies.json`
    );

    let movieData = await movies.json();

    let allMovieData = await allMovies.json();

    showTopMovieData(movieData.Top);

    showLatestMovies(allMovieData.AllMovies);

    search(allMovieData.AllMovies);

}

// * Top Section
function showTopMovieData(data) {
    let counter = 0;

    data.forEach((movie) => {
        $(".carousel-inner").append(carousalItemComponent(movie, counter));
        $(".carousel-indicators .content").append(carousalItemButtonComponent(movie, counter));

        $("#Top .swiper-wrapper").append(swiperSlideComponent(movie));

        if (movie.vote_average >= 8) {
            counter++;
        }
    });

}

function carousalItemComponent(movie, index) {
    if (movie.vote_average >= 8) {
        return `
        <div class="carousel-item ${index == 0 ? "active" : ""}" data-bs-interval="10000">
            <img src="https://image.tmdb.org/t/p/original${movie.images.backdrops[0].file_path}" class="d-block h-100" alt="${movie.title}">

            <div class="container h-100">
                <div class="carousel-caption">
                    <div class="box">
                        <h1>${movie.title}</h1>
                        <p class="overview">${movie.overview?.slice(0, 150) || ""} ...</p>
                        <p>
                            <span class="date">${movie.release_date?.slice(0, 4) || ""}</span>
                            |
                            <span class="lang">${movie.tagline}</span>
                        </p>
                        <a href="https://www.youtube.com/watch?v=${movie.videos.results[0].key}" target="_blank" class="mainButton">
                            <span>
                                <i class="fa-solid fa-play"></i>
                                Watch Trailer
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    }
}

function carousalItemButtonComponent(movie, index) {
    if (movie.vote_average >= 8) {
        return `
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="${index}"
                class="${index === 0 ? "active" : ""} image" aria-current="true" aria-label="Slide ${index}">
                <img src="https://image.tmdb.org/t/p/original${movie.images.posters[1].file_path}" class="d-block" alt="hero">
            </button>
        `
    }
}

// * Top Rated Section
function swiperSlideComponent(movie) {
    return `
        <div class="swiper-slide">
            <div class="slide-card">
                <img src="https://image.tmdb.org/t/p/original${movie.images.posters[0].file_path}" alt="movie">
                
                <div class="layout layout-1"></div>                                
                
                <a href="./pages/movie.html?id=${movie.id}"><span>movie</span> <i class="fa-brands fa-empire fa-spin"></i></a>
                
                <div class="layout layout-2"></div>
            </div>
        </div>
    `
}

// * Latest Section & Categories Section
// * Latest Section
function showLatestMovies(data) {
    let category = document.querySelector("#Categories .content-categories-data").getAttribute("data-category")
    allMoviesData = data;

    data.forEach(function (movie) {

        if (movie.release_date.slice(0, 4) >= 2025) {
            $("#Latest .part-1 ul").append(LatestButtonComponent(movie));

            if (isFirstMovie) {
                $("#Latest .part-2").html(LatestDetailsComponent(movie));
                isFirstMovie = false;
            }
        }

        if (movie.genre == category) {
            pages.push(movie);
        }

    });

    showCategoryMovies();
}

function LatestButtonComponent(movie) {
    return `
        <li>
            <button class="movie-button" onclick="changeMovieDetails(this)" data-id="${movie.id}">
                <img src="https://image.tmdb.org/t/p/original${movie.images.logos[0].file_path}" alt="movie" class="img-fluid">
                <span class="name">${movie.title}</span>
            </button>
        </li>
    `
}
function changeMovieDetails(that) {
    let currentId = that.getAttribute("data-id");

    let currentMovie = allMoviesData.find(function (movie) {
        return movie.id == currentId;
    });

    $("#Latest .part-2").html("");

    if (currentMovie) {
        $("#Latest .part-2").html(LatestDetailsComponent(currentMovie));
    }
}
function LatestDetailsComponent(movie) {
    return `
        <div class="image">
            <div class="overlay">
                <svg xmlns="http://www.w3.org/2000/svg" width="45px" height="45px" viewBox="0 0 24 24">
                    <g fill="#fff">
                        <circle cx="5" cy="12" r="2">
                            <animate attributeName="cy" values="12;6;12;12" keyTimes="0;0.25;0.5;1" dur="1s"
                                repeatCount="indefinite" />
                        </circle>
                        <circle cx="12" cy="12" r="2">
                            <animate attributeName="cy" values="12;6;12;12" keyTimes="0;0.25;0.5;1" dur="1s" begin="0.15s"
                                repeatCount="indefinite" />
                        </circle>
                        <circle cx="19" cy="12" r="2">
                            <animate attributeName="cy" values="12;6;12;12" keyTimes="0;0.25;0.5;1" dur="1s" begin="0.3s"
                                repeatCount="indefinite" />
                        </circle>
                    </g>
                </svg>
            </div>
            <img src="https://image.tmdb.org/t/p/original${movie.images.backdrops[1].file_path}" alt="movieBackDrop">
        </div>

        <div class="text">
            <h3 class="name">${movie.title}</h3>
            <p class="overview">
                <span class="date">
                    ${movie.release_date.slice(0, 4)}
                </span>
                |
                <span>
                    ${movie.overview.slice(0, 120)} ...
                </span>
            </p>

            <a href="https://www.youtube.com/watch?v=${movie.videos.results[0].key}" target="_blank" class="mainButton">
                <span>
                    <i class="fa-solid fa-play"></i>
                    Watch Trailer
                </span>
            </a>
        </div>
    `
}

// * Categories Section
function CategoriesCardComponent(movie, index) {
    return `
        <div class="box" data-index="${index}">
            <img src="https://image.tmdb.org/t/p/original${movie.images.posters[0].file_path}" alt="movie">

            <div class="back-rate">

            </div>

            <div class="rate">
                <h6>${Number(movie.vote_average).toFixed(1)}</h6>
            </div>

            <div class="layout layout-1"></div>

            <a href="./pages/movie.html?id=${movie.id}"><span>movie</span> <i class="fa-brands fa-empire fa-spin"></i></a>

            <div class="layout layout-2"></div>
        </div>
    `
}

function changeCategory(categoryName) {
    document.querySelector("#Categories .content-categories-data").setAttribute("data-category", categoryName);

    showCategoryMovies();
}

// * Pagination
function preparePagination(index) {
    let li = "";

    for (let i = 0; i < index; i++) {
        li += `<li class="page-item ${(i == 0) ? 'active' : ''}" onclick="changePage(${i + 1}) ; changeActive(this)"><p class="page-link">${i + 1}</p></li>`
    }

    $(".pagination-nav .pagination").html(li);
}

function showCategoryMovies() {
    let category = $("#Categories .content-categories-data").attr("data-category");

    pages = [];

    pages = allMoviesData.filter(function (movie) {
        return movie.genre == category;
    });

    preparePagination(Math.ceil(pages.length / 5));

    currentPage = 1;

    showPage();

}

function showPage() {
    let start = (currentPage - 1) * 5,
        moviesToShow = pages.slice(start, start + 5),
        category = $("#Categories .content-categories-data").attr("data-category"),
        container = $(`[aria-labelledby = 'pills-${category}-tab'] .content`);

    container.empty();

    moviesToShow.forEach(function (movie, index) {
        container.append(CategoriesCardComponent(movie, index));
    });
}

function changePage(pageNumber) {
    currentPage = pageNumber;
    showPage();
}

function changeActive(that) {
    let currentPaginate = $(".page-item.active");

    currentPaginate.removeClass("active");
    that.classList.add("active");
}

function toNextPage() {
    let currentPaginate = document.querySelector(".page-item.active"),
        nextPaginate = currentPaginate.nextElementSibling ?? currentPaginate.parentElement.querySelector(":first-child");

    console.log(currentPaginate.parentElement.querySelector(":first-child"));

    currentPaginate.classList.remove("active");
    nextPaginate.classList.add("active");

    if (currentPage < Math.ceil(pages.length / 5)) {
        currentPage = currentPage + 1;
    } else {
        currentPage = 1;
    }

    showPage();

}

function toPrevPage() {
    let currentPaginate = document.querySelector(".page-item.active"),
        prevPaginate = currentPaginate.previousElementSibling ?? currentPaginate.parentElement.lastElementChild;

    currentPaginate.classList.remove("active");
    prevPaginate.classList.add("active");

    if (currentPage > 1) {
        currentPage = currentPage - 1;
    } else {
        currentPage = (Math.ceil(pages.length / 5));
    }

    showPage();

}

// * Search Popup
let input = document.querySelector(".popup[data-popup='search'] .input");

function search(data) {
    input.addEventListener("keyup", function () {
        let inputValue = input.value.trim().toLowerCase();

        let filteredMovies = data.filter(function (movie) {
            let title = movie.title.toLowerCase(),
                overview = movie.overview.toLowerCase(),
                keywordMatch = movie.keywords.keywords.some(function (key) {
                    return key.name.toLowerCase().includes(inputValue);
                });

            return (
                title.includes(inputValue) ||
                overview.includes(inputValue) ||
                keywordMatch
            );
        });

        let content = $(".popup[data-popup='search'] .search .content");

        content.empty();

        filteredMovies.forEach(function (movie) {
            content.append(CategoriesCardComponent(movie));
        });

        if (inputValue == "" || filteredMovies.length == 0) {
            content.html('<img src="./images/no-videos.svg" alt="no-videos">');
        }
    });
}

function emptySearch() {
    input.value = "";
    $(".popup[data-popup='search'] .search .content").html('<img src="./images/no-videos.svg" alt="no-videos">');
}

// * Close Popup
function closePopup(popupName, duration) {
    $(`.popup[data-popup='${popupName}'] .popup-element`).removeClass("appear");

    $(".popup[data-popup='list'] >.image >img ").removeClass("round");

    setTimeout(function () {
        $(`.popup[data-popup='${popupName}']`).fadeOut(500);
        $(`.popup[data-popup='sign']`).removeClass("d-flex");
        $(".popup[data-popup='list'] >.image >img ").removeClass("fall");
        $(".popup[data-popup='list'] .popup-element .box").removeClass("appear");
    }, Number(duration));

    $(" .popup[data-popup='reviews'] > img").attr("src", "");
}

$(".popup-element").click(function (e) {
    e.stopPropagation();
});

// * Add to List & Remove From List
function removeToList(movieId, that) {
    let indexOfMovie = listContainer.findIndex(
        (movie) => movie.id == movieId
    );

    if (indexOfMovie != -1) {
        listContainer.splice(indexOfMovie, 1);
        $(that.closest(".box")).addClass("d-none");
        $(`[data-popup='list'] .piece[data-id="${movieId}"]`).addClass("d-none");
        $(that.closest(".box"))?.empty();
    }

    if (listContainer.length == 0) {
        $("[data-popup='list'] #EmptyList").removeClass("d-none");
    }

    updateLocalStorage();
}

// * Remove Alert Function
function removedAlert() {
    Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,

        customClass: {
            popup: `list-toast list-toast--add`,
            title: "list-toast__title",
            icon: "list-toast__icon list-toast__icon--add",
            timerProgressBar: "list-toast__progress list-toast__progress--add"
        },

        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    }).fire({
        icon: "success",
        title: "Add successfully"
    });
}

// * My List Popup
function showMyList() {
    const content = $(".popup[data-popup='list'] .popup-element .content");
    const piecesContainer = $(".popup[data-popup='list'] .pieces");

    content.find(".box").remove();
    piecesContainer.empty();

    if (listContainer.length >= 1) {
        $("[data-popup='list'] #EmptyList").addClass("d-none");
        $("[data-popup='list'] >.image").removeClass("d-none");
    } else {
        $("[data-popup='list'] #EmptyList").removeClass("d-none");
        $("[data-popup='list'] >.image").addClass("d-none");
    }

    listContainer.forEach(function (movie) {
        content.append(listCardComponent(movie));
        piecesContainer.append(popcornPiecesComponent(movie));
    });

    updateLocalStorage();
}

function listCardComponent(movie) {
    return `
        <div class="box" data-id="${movie.id}">
            <div class="row w-100 flex-column flex-md-row p-3">

                <div class="image col-12 col-md-3 rounded-2">
                    <img
                        src="https://image.tmdb.org/t/p/original${movie.images.posters[0].file_path}"
                        class="w-100 rounded-2"
                        alt="poster">
                </div>

                <div class="details col-12 col-md-9">
                    <div class="text">
                        <h5>${movie.title}</h5>
                        <span class="tagline">${movie.tagline}</span>
                    </div>

                    <div class="buttons">
                        <a href="./pages/movie.html?id=${movie.id}" class="mb-2">
                            <span>movie</span>
                            <i class="fa-brands fa-empire fa-spin"></i>
                        </a>

                        <button class="remove mt-2"
                            onclick="removeToList(${movie.id}, this)">
                            <span>
                                <i class="fa-solid fa-trash"></i>
                                Remove from list
                            </span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    `;
}

function popcornPiecesComponent(movie) {
    const randomTop = Math.random() * 20;
    const randomLeft = Math.random() * 55;

    const randomRotate = Math.random() * 30 - 15;
    const randomScale = 0.85 + Math.random() * 0.3;

    return `
        <div class="piece"
            data-id="${movie.id}"
            onclick="movieAlert(${movie.id})"

            style="
                top: ${randomTop}%;
                left: ${randomLeft}%;
                transform: rotate(${randomRotate}deg) scale(${randomScale});
            ">

            <img
                src="./images/piece-of-popcorn.png"
                class="piece-of-popcorn"
                alt="popcorn">

            <img
                src="https://image.tmdb.org/t/p/original${movie.images.posters[0].file_path}"
                class="movie"
                alt="poster">

        </div>
    `;
}

function dropPieces() {
    if(listContainer == 0){
        return;
    }
    
    const image = document.querySelector(
        ".popup[data-popup='list'] > .image"
    );

    const pieces = gsap.utils.toArray(".bucket .piece");
    const imageRect = image.getBoundingClientRect();
    const timeline = gsap.timeline({
        onComplete: makePiecesDraggable
    });
    const rolls = [];

    pieces.forEach((piece, index) => {
        const rect = piece.getBoundingClientRect();
        const startX = rect.left - imageRect.left;
        const startY = rect.top - imageRect.top;
        const baseRotation = Number(gsap.getProperty(piece, "rotation")) || 0;

        image.appendChild(piece);

        gsap.set(piece, {
            position: "absolute",
            left: startX,
            top: startY,
            x: 0,
            y: 0,
            rotation: baseRotation
        });

        const maxX = image.clientWidth - piece.offsetWidth;
        const landingX = pieces.length === 1
            ? maxX / 2
            : maxX * index / (pieces.length - 1);
        const landingY = image.clientHeight - piece.offsetHeight;
        const rollDistance = landingX - startX;
        const rollRotation = baseRotation + rollDistance / piece.offsetWidth * 360;

        rolls.push({ piece, rollDistance, rollRotation });

        timeline
            .to(piece, {
                y: landingY - startY,
                rotation: baseRotation + (rollDistance < 0 ? -90 : 90),
                duration: 0.55,
                ease: "power2.in"
            }, 0);
    });

    rolls.forEach(({ piece, rollDistance, rollRotation }) => {
        timeline.to(piece, {
            x: rollDistance,
            rotation: rollRotation,
            duration: Math.max(0.35, Math.abs(rollDistance) / 300),
            ease: "power1.out"
        }, 0.55);
    });
}

function makePiecesDraggable() {
    const pieces = document.querySelectorAll(
        ".popup[data-popup='list'] .piece"
    );

    Draggable.create(pieces, {
        type: "x,y",
        bounds: ".popup[data-popup='list'] > .image",
        inertia: true
    });
}

function movieAlert(movieId) {
    let clickedMovie = document.querySelector(`.popup[data-popup='list'] .popup-element .box[data-id="${movieId}"]`),
        topOfMovieBox = clickedMovie.offsetTop,
        content = document.querySelector(".popup[data-popup='list'] .popup-element .content");

    content.scrollTo({
        top: topOfMovieBox - 110,
        behavior: "smooth",
    });

    clickedMovie.classList.add("clicked");

    setTimeout(() => {
        clickedMovie.classList.remove("clicked");
    }, 500);
}

function removeAll() {
    const popup = document.querySelector(".popup[data-popup='list']");
    const image = popup.querySelector(":scope > .image");
    const bucket = popup.querySelector(".bucket");
    const pieces = gsap.utils.toArray(".popup[data-popup='list'] .piece");

    let vacuumCleaner = document.querySelector(".popup[data-popup='list'] .image >img");

    setTimeout(() => {
        resetListAnimation(vacuumCleaner);
        closePopup('list' , '500');
    }, 6500);

    if (listContainer.length == 0) {
        bucket.classList.add("lift");
        finishRemoveAll();
        return;
    }else if (listContainer.length >= 1) {
        resetListAnimation(vacuumCleaner);
    }

    const imageRect = image.getBoundingClientRect();
    const timeline = gsap.timeline({
        onComplete: finishRemoveAll
    });

    pieces.forEach(function (piece, index) {
        const draggable = Draggable.get(piece);
        if (draggable) draggable.kill();

        const rect = piece.getBoundingClientRect();
        const startX = rect.left - imageRect.left;
        const startY = rect.top - imageRect.top;
        const pieceWidth = piece.offsetWidth;
        const pieceHeight = piece.offsetHeight;
        const slotWidth = pieceWidth + 4;
        const columns = Math.max(1, Math.floor((image.clientWidth - 16) / slotWidth));
        const orderIndex = pieces.length - 1 - index;
        const row = Math.floor(orderIndex / columns);
        const column = orderIndex % columns;
        const targetX = image.clientWidth - 8 - pieceWidth - column * slotWidth;
        const targetY = image.clientHeight - pieceHeight - row * (pieceHeight * 0.55);
        const baseRotation = Number(gsap.getProperty(piece, "rotation")) || 0;

        gsap.killTweensOf(piece);
        image.appendChild(piece);
        gsap.set(piece, {
            position: "absolute",
            left: startX,
            top: startY,
            x: 0,
            y: 0,
            rotation: baseRotation
        });
        piece.removeAttribute("onclick");

        timeline.to(piece, {
            left: targetX,
            top: targetY,
            rotation: baseRotation + (index % 2 === 0 ? 180 : -180),
            duration: 0.55,
            ease: "power2.in"
        }, index * 0.18);

        setTimeout(() => {
            vacuumCleaner.setAttribute("src", "./images/vacuum-cleaner.svg");
            vacuumCleaner.classList.remove("d-none");
            vacuumCleaner.classList.add("d-block");

            setTimeout(() => {
                $(piece).fadeOut(500);
                $(piece).addClass("shrink");
            }, 100);
        }, 500);
    });

    bucket.classList.add("lift");
}

function finishRemoveAll() {
    $(".popup[data-popup='list'] .popup-element .content .box").remove();
    $("[data-popup='list'] #EmptyList").removeClass("d-none");
    listContainer = [];
    updateLocalStorage();
}

function resetListAnimation(vacuumCleaner, piece = null) {
    $(piece).removeClass("shrink");

    vacuumCleaner.setAttribute("src", "");
    vacuumCleaner.classList.remove("d-block");
    vacuumCleaner.classList.add("d-none");
}

// * Mouse
function mouse() {
    const cursor = document.querySelector(".mouse");
    const follower = document.querySelector(".mouse-follower");

    let mouseX = 0;
    let mouseY = 0;

    let followerX = 0;
    let followerY = 0;

    window.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    function animateCursor() {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;

        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    document.querySelectorAll("a, .movie-button , button, [data-cursor='hover']")
        .forEach(element => {
            element.addEventListener("mouseenter", () => {
                follower.classList.add("focus");
            });

            element.addEventListener("mouseleave", () => {
                follower.classList.remove("focus");
            });
        });
}

// * Timeline
let timeLine = document.querySelector(".timeline"),
    progress = timeLine.querySelector(".progress"),
    indicators = timeLine.querySelectorAll("span"),
    sections = document.querySelectorAll(".section");

function setPositions() {
    let docHeight = document.documentElement.scrollHeight - window.innerHeight;

    indicators.forEach(function (indicator) {
        sections.forEach(function (section) {
            if (section.getAttribute("id") == indicator.dataset.name) {
                let topOfSection = section.getBoundingClientRect().top + window.scrollY - nav.clientHeight;

                let ratio = Math.min(Math.max(topOfSection / docHeight, 0), 1);

                indicator.style.top = (ratio * timeLine.clientHeight + "px");
                indicator.dataset.ratio = ratio;

            }
        });

        indicators.forEach(function (indicator) {
            indicator.addEventListener("click", function () {
                let targetSection = document.querySelector("#" + indicator.dataset.name);
                if (!targetSection) return;
                let targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - nav.clientHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            });
        });

    });

}

function updateActive() {
    let docHeight = document.documentElement.scrollHeight - window.innerHeight,
        scrollPercent = (window.scrollY / docHeight) * 100;

    indicators.forEach(function (indicator) {
        indicator.classList.toggle("active", scrollPercent + 0.5 >= indicator.dataset.ratio * 100);
    });
}