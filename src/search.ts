import dotenv from "dotenv";

dotenv.config();

document.addEventListener("DOMContentLoaded", () => {
  console.log("Hello from search.ts");
  init();
});

function init() {
  //Get url params
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("query");
  const main = document.querySelector(".container-search") as HTMLElement;
  if (query) {
    searchMovies(query);
  } else {
    main.innerHTML = "<h1>No search query found</h1>";
    console.error("No search query found");
  }
}

let moviedata: any;
async function searchMovies(query: string) {
  const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=true&language=en-US&page=1`;
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
      displayMovies();
      setHeader(query);
    })
    .catch((err) => console.error(err));
}

function setHeader(query: string) {
  const header = document.getElementById("search-query");
  if (header) {
    header.textContent = "Showing search results for " + query;
  }
}

function displayMovies() {
  const resultsContainer = document.getElementById("search-results");
  const cardTemplate = document.getElementById(
    "movie-card-template"
  ) as HTMLTemplateElement;

  moviedata.results.forEach((movie: any) => {
    const card = cardTemplate.content.cloneNode(true) as HTMLElement;
    const image = card.querySelector("img") as HTMLImageElement;
    const title = card.querySelector("a") as HTMLAnchorElement;
    console.log(image);
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
    if (resultsContainer) {
      resultsContainer.appendChild(card);
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
