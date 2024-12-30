import dotenv from "dotenv";

dotenv.config();

document.addEventListener("DOMContentLoaded", () => {
  console.log("Hello from watch.ts");
  init();
});

function init() {
  console.log("initing watch.ts");
  const urlParams = new URLSearchParams(window.location.search);
  const movieTitle = urlParams.get("title");
  const movieId = urlParams.get("id");
  const main = document.querySelector(".container-watch") as HTMLElement;

  if (movieTitle) {
    const titleElement = document.getElementById("movie-title");
    if (titleElement) {
      titleElement.textContent = movieTitle;
    }
  }

  if (movieId) {
    console.log("Movie ID: ", movieId);
    fetchMovie(movieId);
    const playerContainer = document.getElementById(
      "movie-player"
    ) as HTMLIFrameElement;
    if (playerContainer) {
      playerContainer.src = `https://player.autoembed.cc/embed/movie/${movieId}`;
    }
  } else {
    main.innerHTML = "<h1>Movie not found</h1>";
    console.error("Movie not found");
  }
}

let moviedata: any;
async function fetchMovie(movieId: string) {
  //debug the environment variable
  console.log(process.env.TMDB_API_KEY);

  const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}` /* process.env.TMDB_API_KEY */,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => (console.log(json), (moviedata = json)))
    .then(() => {
      updateMovieInfo();
    })
    .catch((err) => console.error(err));

  console.log("finished fetching movie data");
}

function updateMovieInfo() {
  console.log(moviedata);
  const titleElement = document.getElementById("movie-info-title");
  const posterElement = document.getElementById(
    "movie-info-img"
  ) as HTMLImageElement;
  const descriptionElement = document.getElementById("movie-info-description");
  const releaseDateElement = document.getElementById("movie-info-date");
  const ratingElement = document.getElementById("movie-info-rating");
  const genresElement = document.getElementById("movie-info-genre");
  const genreparent = document.getElementById("genre-container");

  if (titleElement) {
    titleElement.textContent = moviedata.original_title;
  }
  if (posterElement) {
    posterElement.src = `https://image.tmdb.org/t/p/w500${moviedata.poster_path}`;
  }
  if (descriptionElement) {
    descriptionElement.textContent = moviedata.overview;
  }
  if (releaseDateElement) {
    releaseDateElement.textContent = moviedata.release_date;
  }
  if (ratingElement) {
    const rating = moviedata.vote_average.toFixed(1);
    ratingElement.textContent = rating;
  }
  if (genresElement && genreparent) {
    //get the first 3 genres, duplicate genreElement and append to genresElement
    const genres = moviedata.genres;
    for (let i = 0; i < 3; i++) {
      const newGenreElement = genresElement.cloneNode(true) as HTMLElement;
      newGenreElement.textContent = genres[i].name;
      genreparent.appendChild(newGenreElement);
    }
  }
}
