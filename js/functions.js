// * Variables
let allMoviesData = [],
    isFirstMovie = true,
    pages = [],
    currentPage = 1,

    listContainer = [],
    isDark = "false"
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
        <img src="https://image.tmdb.org/t/p/original${movie.images.backdrops[1].file_path}" alt="movieBackDrop">

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
    setTimeout(function () {
        $(`.popup[data-popup='${popupName}']`).fadeOut(500);
        $(`.popup[data-popup='sign']`).removeClass("d-flex");
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

function showMyList() {
    if (listContainer.length >= 1) {
        $("[data-popup='list'] #EmptyList").addClass("d-none");
    }

    listContainer.forEach(function (movie) {
        $(".popup[data-popup='list'] .popup-element .content").append(listCardComponent(movie));
        updateLocalStorage();
    })
}

function listCardComponent(movie) {
    return `
        <div class="box">
            <div class="row w-100">
                <div class="image col-3 p-0">
                    <img src="https://image.tmdb.org/t/p/original${movie.images.posters[0].file_path}"
                        class="img-fluid" alt="poster">
                </div>
                <div class="details col-9 py-4">
                    <div class="text">
                        <h5>${movie.title}</h5>
                        <span class="tagline">${movie.tagline}</span>
                    </div>

                    <div class="buttons">
                        <a href="./pages/movie.html?id=${movie.id}"><span>movie</span> <i
                                class="fa-brands fa-empire fa-spin"></i></a>

                        <button class="remove" onclick="removeToList(${movie.id} , this)">
                            <span>
                                <i class="fa-solid fa-trash"></i>
                                Remove from list
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
}