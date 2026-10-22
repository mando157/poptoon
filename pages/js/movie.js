// * Movie Page
async function showMovie() {
    let allMovies = await fetch(
        `https://mando157.github.io/moviesJSON/data/allMovies.json`
    );

    let allMovieData = await allMovies.json();


    let parameter = new URLSearchParams(window.location.search);

    let movieId = parameter.get("id");

    let movie = allMovieData.AllMovies.find((movie) => movie.id == movieId);

    showMovieDetails(movie);

    showReview(movie);

    listButtonToggler(movie);

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

function movieDetailsComponent(movie) {
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
                        <li><i class="fa-regular fa-calendar-days calendar-days"></i> <span>${(movie.release_date).slice(0, 4)}</span></li>
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

                    <button class="list-button add" data-type="add">
                        <span>
                            <i class="fa-solid fa-plus fa-shake"></i>
                            Add to My list
                        </span>
                    </button>
                </div>
            </div>
        </div>
    `
}

$("#Movie nav p").click(function () {
    $(" .popup[data-popup='reviews']").fadeIn(500, function () {
        $(" .popup[data-popup='reviews'] > img").attr("src", "../images/car-chain.svg");
        $(" .popup[data-popup='reviews'] .popup-element").addClass("appear");
    });

    setTimeout(function () {
        $(" .popup[data-popup='reviews'] > img").attr("src", "");
    }, 7500);
});

function showReview(movie) {
    movie.reviews.results.forEach(review => {
        $(".popup[data-popup='reviews'] .content").append(
            `
                <div class="box">
                    <h5 class="author">${review.author}</h5>
                    <p class="review">${review.content}</p>
                    <span class="date">${(review.created_at).split("T")[0]} | ${(review.created_at).slice(11, -4)}</span>
                </div>
            `
        );
    });

}

// * Add to List
function addToList(movie) {
    listContainer.push(movie);
    updateLocalStorage();
}

function listButtonToggler(movie) {
    let buttonToggle = document.querySelector("#Movie .list-button"),
        isMovie = listContainer.some((thisMovie) => thisMovie.id == movie.id);

    if (isMovie) {
        removeButtonStyle(buttonToggle);
    }

    buttonToggle.addEventListener("click", function () {
        if (buttonToggle.getAttribute("data-type") == "add") {
            addToList(movie);

            removeButtonStyle(buttonToggle);
            alert("add");

        } else if (buttonToggle.getAttribute("data-type") == "remove") {
            removeToList(movie.id);
            alert("remove");

            buttonToggle.classList.remove("remove");
            buttonToggle.classList.add("add");
            buttonToggle.setAttribute("data-type", "add");
            $(buttonToggle).html(
                `
                    <span>
                        <i class="fa-solid fa-plus fa-shake"></i>
                        Add to My list
                    </span>
                `
            );
        }
    });
}

function removeButtonStyle(button) {
    button.setAttribute("data-type", "remove");
    $(button).html(
        `
            <span>
                <i class="fa-solid fa-trash"></i>
                Remove from list
            </span>
        `
    );
    button.classList.add("remove");
    button.classList.remove("add");
}

// * Sweet Alert
function alert(condition) {
    if (condition == 'remove') {
        Swal.mixin({
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,

            customClass: {
                popup: `list-toast list-toast--remove`,
                title: "list-toast__title",
                icon: "list-toast__icon list-toast__icon--remove",
                timerProgressBar: "list-toast__progress list-toast__progress--remove"
            },

            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        }).fire({
            icon: "success",
            title: "Removed successfully"
        });

    } else if (condition == 'add') {
        removedAlert();
    }
}

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