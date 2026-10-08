// 

async function getMovies(page = 1) {

    let movieURL = new URLSearchParams({
        api_key: "6fe664a1e43c55e5453cf014dd4dadc8",
        with_genres: "16,10751",
        append_to_response: "videos",
        without_genres: "27,53",
        include_adult: "false",
        sort_by: "popularity.desc",
        page: page,

        "vote_count.gte": 100,
        "vote_average.gte": 6,
        "vote_average.lte": 10,
    });

    let respond = await fetch(
        `https://api.themoviedb.org/3/discover/movie?${movieURL.toString()}`
    );

    let movieData = await respond.json();

    for (let movie of movieData.results) {
        let trailer = await getMoreDetails(movie.id , "trailer");
        let tagline = await getMoreDetails(movie.id , "tagline");

        movie.trailer = trailer;
        movie.tagline = tagline;
    
    }

    showTopMovieData(movieData.results);

}


async function getMoreDetails(id , item = "") {
    let detailsURL = new URLSearchParams({
        api_key: "6fe664a1e43c55e5453cf014dd4dadc8",
        append_to_response: "videos"
    });

    let response = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?${detailsURL.toString()}`
    );
    
    let movieDetails = await response.json();

    console.log(movieDetails);

    if(item == "trailer"){
        let trailer = movieDetails.videos.results.find(
            video => video.type === "Trailer" && video.site === "YouTube"
        );
    
        return trailer ? trailer.key : null;
    }

    if(item == "tagline"){
        let tagline = movieDetails.tagline;

        return tagline ? tagline : null;
    }

}


// * Top Rated Movies
function showTopMovieData(data) {
    let counter = 0;

    data.forEach((movie) => {
        $(".carousel-inner").append(carousalItemComponent(movie, counter));
        $(".carousel-indicators .content").append(carousalItemButtonComponent(movie, counter));

        if (movie.vote_average >= 8.3) {
            counter++;
        }
    });

}

function carousalItemComponent(movie, index) {
    if (movie.vote_average >= 8.3) {
        return `
        <div class="carousel-item ${index == 0 ? "active" : ""}" data-bs-interval="10000">
            <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path}" class="d-block h-100" alt="${movie.title}">

            <div class="container h-100 position-relative">
                <div class="carousel-caption">
                    <div class="box">
                        <div class="image">
                            <div class="overview">
                                <p>${movie.overview}</p>
                                <i class="fa-solid fa-caret-right fa-fade"></i>
                            </div>
                            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                        </div>

                        <div class="text">
                            <h5>${movie.title}</h5>
                            <p>
                                <span class="date">${movie.release_date?.slice(0, 4) || ""}</span>
                                |
                                <span class="lang">${movie.tagline}</span>
                            </p>

                            <a href="https://www.youtube.com/watch?v=${movie.trailer}" target="_blank" class="mainButton">
                                <span>
                                    <i class="fa-solid fa-play"></i>
                                    Watch Trailer
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    }
}

function carousalItemButtonComponent(movie, index) {
    if (movie.vote_average >= 8.3) {
        return `
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="${index}"
                class="${index === 0 ? "active" : ""} image" aria-current="true" aria-label="Slide ${index}">
                <img src="https://image.tmdb.org/t/p/w500${movie.backdrop_path}" class="d-block" alt="hero">
            </button>
        `
    }
}

