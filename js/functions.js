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

    console.log(allMovieData.AllMovies)
}

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

// * Mood
$(".nav-toggle").on("click", function () {
    $(".nav-links ul").toggleClass("open");
});

$("section , header").click(function () {
    $(".nav-links ul").removeClass("open");
});

$(".mood").on("click", function () {
    const body = document.querySelector("body");

    body.setAttribute(
        "data-theme",
        body.getAttribute("data-theme") === "light" ? "dark" : "light"
    );

    if (body.getAttribute("data-theme") === "light") {
        $(".mood i").addClass("fa-sun");
        $(".mood i").removeClass("fa-moon");
    } else {
        $(".mood i").addClass("fa-moon");
        $(".mood i").removeClass("fa-sun");
    }
});


// * Top Rated Section

function swiperSlideComponent(movie) {
    return `
        <div class="swiper-slide">
            <div class="slide-card">
                <img src="https://image.tmdb.org/t/p/original${movie.images.posters[0].file_path}" alt="movie">
                
                <div class="layout layout-1"></div>                                
                
                <a href="#"><span>movie</span> <i class="fa-brands fa-empire fa-spin"></i></a>
                
                <div class="layout layout-2"></div>
            </div>
        </div>
    `
}

// * Latest Section & Categories Section
let allMoviesData = [],
    isFirstMovie = true,
    pages = [],
    currentPage = 1;

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

            <a href="#"><span>movie</span> <i class="fa-brands fa-empire fa-spin"></i></a>

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
        currentPage = (Math.ceil(pages.length / 5)) ;
    }

    showPage();

}