async function getMovies() {
    let respond = await fetch(
        `https://mando157.github.io/moviesJSON/data/cartoon.json`
    );

    let movieData = await respond.json();

    showTopMovieData(movieData.Top);
    console.log(movieData.Top);

}

function showTopMovieData(data) {
    let counter = 0;

    data.forEach((movie) => {
        $(".carousel-inner").append(carousalItemComponent(movie, counter));
        $(".carousel-indicators .content").append(carousalItemButtonComponent(movie, counter));

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