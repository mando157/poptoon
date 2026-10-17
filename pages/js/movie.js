// * Movie Page
async function showMovie() {
    let allMovies = await fetch(
        `https://mando157.github.io/moviesJSON/data/allMovies.json`
    );

    let allMovieData = await allMovies.json();


    let parameter = new URLSearchParams(window.location.search);

    let movieId = parameter.get("id");

    let movie = allMovieData.AllMovies.find((movie) => movie.id == movieId);

    console.log(movieId)
    console.log(movie)

    showMovieDetails(movie);
}

showMovie();

function showMovieDetails(movie) {
    $(".carousel-inner").append(carouselItemComponent(movie));
    $(".movie-details .row").append(movieDetailsComponent(movie));
}

function carouselItemComponent(movie) {
    let carouselItem = "",
        first = true;

    for (let backdrop of movie.images.backdrops) {
        carouselItem += `
            <div class="carousel-item ${(first == true) ? 'active' : ''}" data-bs-interval="5000">
                <img src="https://image.tmdb.org/t/p/original${backdrop.file_path}" class="d-block h-100" alt="backdrop">
            </div>
        `

        first = false;
    }


    return carouselItem;
}

function movieDetailsComponent(movie){
    return `
        <div class="part-1 col-lg-4">
            <div class="poster">
                <img src="https://image.tmdb.org/t/p/original/${movie.images.posters[0].file_path}" alt="poster">
            </div>
        </div>

        <div class="part-2 col-lg-8">
            <div class="content">
                <h2 class="name">${movie.title}</h2>

                <h6 class="tagline">${movie.tagline}</h6>

                <div class="details">
                    <ul>
                        <li><i class="fa-regular fa-star star"></i> <span>${(movie.vote_average).toFixed(1)}</span></li>
                        <li><i class="fa-regular fa-calendar-days calendar-days"></i> <span>${(movie.release_date).slice(0,4)}</span></li>
                        <li><i class="fa-regular fa-clock clock"></i> <span>${movie.runtime} min</span></li>
                        <li class="category">${(movie.genre).toUpperCase()}</li>
                    </ul>
                </div>

                <div class="overview">
                    ${movie.overview}
                </div>

                <div class="buttons">
                    <a href="https://www.youtube.com/watch?v=${movie.videos.results[0].key}" target="_blank"
                        class="mainButton">
                        <span>
                            <i class="fa-solid fa-play"></i>
                            Watch Trailer
                        </span>
                    </a>

                    <button class="mainButton">
                        <span>
                            <i class="fa-solid fa-plus"></i>
                            My list
                        </span>
                    </button>
                </div>
            </div>
        </div>
    `
}