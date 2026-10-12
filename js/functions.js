async function getMovies() {
    let movies = await fetch(
        `https://mando157.github.io/moviesJSON/data/cartoon.json`
    );

    let allMovies = await fetch(
        `https://mando157.github.io/moviesJSON/data/allMovies.json`
    );

    let movieData = await movies.json();

    let allMovieData = await allMovies.json();

    showTopMovieData(movieData.Top);
    // console.log(movieData.Movies);
    showLatestMovies(allMovieData.AllMovies);
    console.log(allMovieData.AllMovies);

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

// * Latest Section
let allMoviesData = [],
    isFirstMovie = true;

function showLatestMovies(data) {
    allMoviesData = data;

    data.forEach(function (movie) {
        if (movie.release_date.slice(0, 4) >= 2025) {
            $("#Latest .part-1 ul").append(LatestButtonComponent(movie));
            
            if(isFirstMovie){
                $("#Latest .part-2").html(LatestDetailsComponent(movie));
                isFirstMovie = false;
            }
        }
    });
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