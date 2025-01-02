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
          const button = document.createElement("button");
          button.textContent = i.toString();
          button.addEventListener("click", () => {
            searchMovies(query, i);
          });
          pagination.appendChild(button);
        }
      }
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
        if (movie.first_air_date)
          window.location.href = `/tv/watch.html?title=${movie.original_name}&id=${movie.id}`;
        if (movie.release_date)
          window.location.href = `/watch.html?title=${movie.original_title}&id=${movie.id}`;
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
      //if the movie has first_air_date, it is a tv show
      if (movie.first_air_date) {
        title.textContent = movie.original_name;
        title.href = `/tv/watch.html?title=${movie.original_name}&id=${movie.id}`;
      }

      //if the movie has release_date, it is a movie
      if (movie.release_date) {
        title.textContent = movie.original_title
          ? movie.original_title
          : movie.title;
        title.href = `/watch.html?title=${movie.title}&id=${movie.id}`;
      }
      // add href to the title
    }
  });
}
