let currentSlide = 0;
let slideData: any;
let moviesgenre = [
  {
    id: 10759,
    name: "Action & Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 10762,
    name: "Kids",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10765,
    name: "Sci-Fi & Fantasy",
  },
];

let randomgenre: any;
//event onload
window.addEventListener("load", () => {
  //Init Next and Prev buttons carousel
  const nextButton = document.getElementById("image-next") as HTMLElement;
  const prevButton = document.getElementById("image-prev") as HTMLElement;
  const nextMoviedisplay = document.querySelectorAll(
    ".image-next-movie"
  ) as NodeListOf<HTMLElement>;
  const prevMoviedisplay = document.querySelectorAll(
    ".image-prev-movie"
  ) as NodeListOf<HTMLElement>;

  generateTrendingCarousel();
  //generate all genres
  moviesgenre.forEach((element) => {
    generateMovieCarousel(element.id);
  });
});

let popularMovies: any;
let playingMovies: any;
async function searchPopularMovies() {
  const url = "https://api.themoviedb.org/3/tv/popular?language=en-US&page=1";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}` /* process.env.TMDB_API_KEY */,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => (popularMovies = json))
    .then(() => {
      displayPopularMovies();
    })
    .catch((err) => console.error(err));
}

function displayPopularMovies() {
  const resultsContainer = document.getElementById("movie-caraousel-popular");
  const cardTemplate = document.getElementById(
    "movie-card-template"
  ) as HTMLTemplateElement;

  popularMovies.results.forEach((movie: any) => {
    const card = cardTemplate.content.cloneNode(true) as HTMLElement;
    const image = card.querySelector("img") as HTMLImageElement;
    const title = card.querySelector("a") as HTMLAnchorElement;
    if (image) {
      image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      image.alt = movie.original_title;
      //add onclick event to image
      image.onclick = () => {
        window.location.href = `/tv/watch.html?title=${movie.name}&id=${movie.id}`;
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
      title.href = `/tv/watch.html?title=${movie.name}&id=${movie.id}`;
    }
  });
}

function compareData(data: any, data2: any) {
  // remove duplicates at data2
  const filteredData = data2.filter(
    (item: any) => !data.some((other: any) => item.id === other.id)
  );
  return filteredData;
}

async function getmoviecountry(country: string) {
  const container = document.getElementById(
    "movie-caraousel-country"
  ) as HTMLElement;
  let moviedatacountry: any;
  const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=revenue.desc&with_origin_country=${country}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}` /* process.env.TMDB_API_KEY */,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => (moviedatacountry = json))
    .then(() => {
      displayMovieTo(container, moviedatacountry.results);
    })
    .catch((err) => console.error(err));
}

async function generateMovieCarousel(id: number) {
  const caraouselTemplate = document.getElementById(
    "movie-caraousel-template"
  ) as HTMLTemplateElement;
  const carouselParent = document.getElementById("movie-caraousel");
  const genreName = moviesgenre.find((genre) => genre.id === id);
  if (caraouselTemplate) {
    const url = `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=1&sort_by=vote_count.desc&with_genres=${id}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}` /* process.env.TMDB_API_KEY */,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        const movies = json.results;
        //make new carousel from template
        const carousel = caraouselTemplate.content.cloneNode(
          true
        ) as HTMLElement;

        const carouselTitle = carousel.querySelector("h2") as HTMLElement;
        const carouselContainer = carousel.querySelector(
          ".movie-caraousel-container-place"
        ) as HTMLElement;
        //change carouselcontainer id to genre name
        carouselContainer.id = "movie-caraousel-container-" + genreName?.name;
        const carouselButtonNextMovie = carousel.querySelector(
          ".next-popular"
        ) as HTMLElement;
        const carouselButtonPrevMovie = carousel.querySelector(
          ".prev-popular"
        ) as HTMLElement;

        if (carouselTitle) {
          carouselTitle.textContent = genreName?.name || "";
        }
        if (carouselContainer) {
          displayMovieTo(carouselContainer, movies);
        }
        if (carouselParent) {
          carouselParent.appendChild(carousel);
        }
        if (carouselButtonNextMovie) {
          //change innerHTML onclick event to genre name
          carouselButtonNextMovie.setAttribute(
            "onclick",
            `nextSlide("movie-caraousel-container-${genreName?.name}")`
          );
        } else {
          console.error("Element not found next ");
        }
        if (carouselButtonPrevMovie) {
          //change innerHTML onclick event to genre name
          carouselButtonPrevMovie.setAttribute(
            "onclick",
            `prevSlide("movie-caraousel-container-${genreName?.name}")`
          );
        } else {
          console.error("Element not found prev ");
        }
      })
      .catch((err) => console.error(err));
  }
}

async function generateTrendingCarousel() {
  const caraouselTemplate = document.getElementById(
    "movie-caraousel-template"
  ) as HTMLTemplateElement;
  const carouselParent = document.getElementById("movie-caraousel");
  if (caraouselTemplate) {
    const url = "https://api.themoviedb.org/3/trending/tv/day?language=en-US";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}` /* process.env.TMDB_API_KEY */,
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        const movies = json.results;
        //make new carousel from template
        const carousel = caraouselTemplate.content.cloneNode(
          true
        ) as HTMLElement;

        const carouselTitle = carousel.querySelector("h2") as HTMLElement;
        const carouselContainer = carousel.querySelector(
          ".movie-caraousel-container-place"
        ) as HTMLElement;
        //change carouselcontainer id to genre name
        carouselContainer.id = "movie-caraousel-container-" + "trending";
        const carouselButtonNextMovie = carousel.querySelector(
          ".next-popular"
        ) as HTMLElement;
        const carouselButtonPrevMovie = carousel.querySelector(
          ".prev-popular"
        ) as HTMLElement;

        if (carouselTitle) {
          carouselTitle.textContent = "Trending";
        }
        if (carouselContainer) {
          displayMovieTo(carouselContainer, movies);
        }
        if (carouselParent) {
          carouselParent.appendChild(carousel);
        }
        if (carouselButtonNextMovie) {
          //change innerHTML onclick event to genre name
          carouselButtonNextMovie.setAttribute(
            "onclick",
            `nextSlide("movie-caraousel-container-trending")`
          );
        } else {
          console.error("Element not found next ");
        }
        if (carouselButtonPrevMovie) {
          //change innerHTML onclick event to genre name
          carouselButtonPrevMovie.setAttribute(
            "onclick",
            `prevSlide("movie-caraousel-container-trending")`
          );
        } else {
          console.error("Element not found prev ");
        }
      })
      .catch((err) => console.error(err));
  }
}

function displayMovieTo(carouselContainer: HTMLElement, movie: any) {
  const cardTemplate = document.getElementById(
    "movie-card-template"
  ) as HTMLTemplateElement;
  movie.forEach((movie: any) => {
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
    if (image) {
      image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      image.alt = movie.original_title;
      //add onclick event to image
      image.onclick = () => {
        window.location.href = `/tv/watch.html?title=${movie.name}&id=${movie.id}`;
      };
      image.onerror = () => {
        image.src = "https://via.placeholder.com/500x750";
      };
    }
    if (title) {
      title.textContent = movie.original_title;
    }
    if (carouselContainer) {
      movieInfoTitle.textContent = movie.name;
      movieInfoRating.textContent = movie.vote_average.toFixed(1);
      movieType.textContent = "TV";
      carouselContainer.appendChild(card);
    }
    //image href to watch page
    if (title) {
      // change the title to the movie title
      title.textContent = movie.original_title;
      // add href to the title
      title.href = `/tv/watch.html?title=${movie.name}&id=${movie.id}`;
    }
  });
}
