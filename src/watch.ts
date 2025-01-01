import dotenv from "dotenv";

dotenv.config();

document.addEventListener("DOMContentLoaded", () => {
  console.log("Hello from watch.ts");
  init();
});

let movieID: any;

function init() {
  console.log("initing watch.ts");
  const urlParams = new URLSearchParams(window.location.search);
  const movieTitle = urlParams.get("title");
  const movieId = urlParams.get("id");
  const main = document.querySelector(".container-watch") as HTMLElement;
  movieID = movieId;
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
      playerContainer.src = `https://vidlink.pro/movie/${movieID}`;
    }
  } else {
    main.innerHTML = "<h1>Movie not found</h1>";
    console.error("Movie not found");
  }
  generateServer();
  generateRecomendations();
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
      getSameGenreMovies();
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
  if (genreparent) {
    //get the first 3 genres, duplicate genreElement and append to genresElement
    const genres = moviedata.genres;
    for (let i = 0; i < genres.length; i++) {
      //create a new span element
      const genreElement = document.createElement("span");
      genreElement.textContent = genres[i].name;
      genreElement.classList.add("genre");
      genreparent.appendChild(genreElement);
    }
  }

  //change page title
  document.title = "Watch " + moviedata.original_title;
}

function generateServer() {
  const buttoncontainer = document.getElementById("movie-server-buttons");

  const playerContainer = document.getElementById(
    "movie-player"
  ) as HTMLIFrameElement;
  console.log("generating server buttons with movieID: ", movieID);
  //list of providers name and their corresponding link
  let providers = [
    {
      name: "VidLink",
      url: `https://vidlink.pro/movie/${movieID}`,
      recommended: true,
    },
    {
      name: "Autoembed",
      url: `https://player.autoembed.cc/embed/movie/${movieID}`,
      recommended: true,
    },
    {
      name: "Vidsrc",
      url: `https://vidsrc.rip/embed/movie/${movieID}`,
      recommended: true,
    },
    {
      name: "111Movies",
      url: `https://111movies.com/movie/${movieID}`,
      recommended: false,
    },
    {
      name: "Vidbinge",
      url: `https://vidbinge.dev/embed/movie/${movieID}`,
      recommended: false,
    },
    {
      name: "embed.su",
      url: `https://embed.su/embed/movie/${movieID}`,
      recommended: true,
    },
    {
      name: "Multiembed",
      url: `https://multiembed.mov/?video_id=${movieID}&tmdb=1`,
      recommended: true,
    },
  ];

  //create a button for each provider
  providers.forEach((provider) => {
    const button = document.createElement("button");
    if (provider.recommended) {
      button.textContent = provider.name + " (👍)";
    } else {
      button.textContent = provider.name + " (👎)";
    }
    button.onclick = () => {
      playerContainer.src = provider.url;
      // add selected class to the button
      const buttons = document.querySelectorAll("button");
      buttons.forEach((button) => {
        button.classList.remove("selected");
      });
      button.classList.add("selected");
    };
    buttoncontainer?.appendChild(button);
  });

  //select the first button by default
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.classList.remove("selected");
  });
  buttons[0].classList.add("selected");

  console.log("finished generating server buttons");
}

let recomendations: any;
async function generateRecomendations() {
  const url = `https://api.themoviedb.org/3/movie/${movieID}/recommendations?language=en-US&page=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}` /* process.env.TMDB_API_KEY */,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => (console.log(json), (recomendations = json)))
    .then(() => {
      displayRecomendations();
    })
    .catch((err) => console.error(err));

  console.log("finished generating recomendations");
}

function displayRecomendations() {
  const movieCardTemplate = document.getElementById(
    "movie-card-template"
  ) as HTMLTemplateElement;
  const movieCardContainer = document.getElementById(
    "movie-caraousel-recommendation"
  ) as HTMLDivElement;

  if (movieCardTemplate)
    recomendations.results.forEach((movie: any) => {
      const card = movieCardTemplate.content.cloneNode(true) as HTMLElement;
      const image = card.querySelector("img") as HTMLImageElement;
      const title = card.querySelector("a") as HTMLAnchorElement;
      if (image) {
        image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        image.alt = movie.original_title;
        //add onclick event to image
        image.onclick = () => {
          window.location.href = `/watch.html?title=${movie.title}&id=${movie.id}`;
        };
        image.onerror = () => {
          image.src = "https://via.placeholder.com/500x750";
        };
      }
      if (title) {
        title.textContent = movie.original_title;
      }
      if (movieCardContainer) {
        movieCardContainer.appendChild(card);
      }
      //image href to watch page
      if (title) {
        // change the title to the movie title
        title.textContent = movie.original_title;
        // add href to the title
        title.href = `/watch.html?title=${movie.title}&id=${movie.id}`;
      }
    });
}

async function getSameGenreMovies() {
  const genres = moviedata.genres;
  console.log("genres: ", genres);
  const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genres[0].id}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}` /* process.env.TMDB_API_KEY */,
    },
  };
  console.log("getting same genre movies with id " + moviedata.genres[0].id);
  fetch(url, options)
    .then((res) => res.json())
    .then((json) => (console.log(json), (sameGenreMovies = json)))
    .then(() => {
      displayMovieTo("movie-caraousel-same-genre", sameGenreMovies);
    })
    .catch((err) => console.error(err));
}

let sameGenreMovies: any;

function displayMovieTo(carouselContainer: string, movie: any) {
  const movieCardTemplate = document.getElementById(
    "movie-card-template"
  ) as HTMLTemplateElement;
  const movieCardContainer = document.getElementById(
    carouselContainer
  ) as HTMLDivElement;

  if (movieCardTemplate)
    movie.results.forEach((movie: any) => {
      const card = movieCardTemplate.content.cloneNode(true) as HTMLElement;
      const image = card.querySelector("img") as HTMLImageElement;
      const title = card.querySelector("a") as HTMLAnchorElement;
      if (image) {
        image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        image.alt = movie.original_title;
        //add onclick event to image
        image.onclick = () => {
          window.location.href = `/watch.html?title=${movie.title}&id=${movie.id}`;
        };
        image.onerror = () => {
          image.src = "https://via.placeholder.com/500x750";
        };
      }
      if (title) {
        title.textContent = movie.original_title;
      }
      if (movieCardContainer) {
        movieCardContainer.appendChild(card);
      }
      //image href to watch page
      if (title) {
        // change the title to the movie title
        title.textContent = movie.original_title;
        // add href to the title
        title.href = `/watch.html?title=${movie.title}&id=${movie.id}`;
      }
    });
}
