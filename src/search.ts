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
async function searchMovies(query: string, page = 1) {
  const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}&sort_by=popularity.desc`;
  const url2 = `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=${page}&sort_by=popularity.desc`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    },
  };

  try {
    const [movieResponse, tvResponse] = await Promise.all([
      fetch(url, options),
      fetch(url2, options),
    ]);

    const movieData = await movieResponse.json();
    const tvData = await tvResponse.json();

    moviedata = {
      results: [...movieData.results, ...tvData.results],
    };

    //set pagnation if results are more than 20
    if (moviedata.results.length > 20) {
      const pagination = document.getElementById("pagination");
      if (pagination) {
        //delete all children
        pagination.innerHTML = "";
        const totalPages = Math.ceil(moviedata.results.length / 20);
        for (let i = 1; i <= totalPages; i++) {
          const button = document.createElement("p");
          button.textContent = i.toString();
          button.addEventListener("click", () => {
            searchMovies(query, i);
            window.scrollTo(0, 0);
            //add active class to the p tag
            const buttons = document.querySelectorAll("#pagination p");
            buttons.forEach((button) => {
              button.classList.remove("selected");
            });
            button.classList.add("selected");
          });
          pagination.appendChild(button);
        }
      }
      //set the first page as active
      const buttons = document.querySelectorAll("#pagination p");
      buttons.forEach((button) => {
        button.classList.remove("selected");
      });
      buttons[0].classList.add("selected");
    }

    console.log(moviedata);

    setHeader(query);
    displayMovies();
  } catch (err) {
    console.error(err);
  }
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

  if (resultsContainer) {
    resultsContainer.innerHTML = "";
  }
  moviedata.results.forEach((movie: any) => {
    let isImage = true;
    const card = cardTemplate.content.cloneNode(true) as HTMLElement;
    const image = card.querySelector("img") as HTMLImageElement;
    const title = card.querySelector("a") as HTMLAnchorElement;
    const movieInfoTitle = card.querySelector(
      ".movie-info span"
    ) as HTMLElement;
    const movieInfoRating = card.querySelector(
      ".movie-card-rating span"
    ) as HTMLElement;
    const movieType = card.querySelector(".movie-type") as HTMLElement;
    if (image && movie.poster_path) {
      image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      image.alt = movie.original_title;
      //add onclick event to image
      image.onclick = () => {
        if (movie.first_air_date)
          window.location.href = `/tv/watch.html?title=${movie.original_name}&id=${movie.id}`;
        if (movie.release_date)
          window.location.href = `/watch.html?title=${movie.original_title}&id=${movie.id}`;
      };
      image.onerror = () => {
        //skip if image is not found
        isImage = false;
      };
    }
    movieInfoRating.textContent = movie.vote_average.toFixed(1);
    if (movie.first_air_date) {
      movieType.textContent = "TV";
      movieInfoTitle.textContent = movie.name || movie.original_name;
    }
    if (movie.release_date) {
      movieType.textContent = "Movie";
      movieInfoTitle.textContent = movie.title || movie.original_title;
    }
    if (resultsContainer && isImage && movie.poster_path) {
      resultsContainer.appendChild(card);
    }
  });
}
