import e, { json } from "express";
import { MovieCard } from "./MovieCard";

let currentSlide = 0;
let slideData: any = [];
let moviesgenre = [
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
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
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

let randomgenre: any;
//event onload
window.addEventListener("load", () => {
  const warningText = document.querySelector(
    ".welcome-container"
  ) as HTMLElement;

  //get data from local storage if user has visited the site before
  if (localStorage.getItem("visited") === "true") {
    warningText.style.display = "none";
  } else {
    warningText.style.display = "visible";
    localStorage.setItem("visited", "true");
  }

  searchPopularMovies();
  searchPlayingMovies();
  getFeaturedMovies();
  //Init Next and Prev buttons carousel
  const nextButton = document.getElementById("image-next") as HTMLElement;
  const prevButton = document.getElementById("image-prev") as HTMLElement;
  const nextMoviedisplay = document.querySelectorAll(
    ".image-next-movie"
  ) as NodeListOf<HTMLElement>;
  const prevMoviedisplay = document.querySelectorAll(
    ".image-prev-movie"
  ) as NodeListOf<HTMLElement>;

  nextButton.addEventListener("click", () => {
    changeSlide(1);
  });

  prevButton.addEventListener("click", () => {
    changeSlide(-1);
  });

  //get country of the user
  getmoviecountry("ID");

  // click next button every 5 seconds
  setInterval(() => {
    changeSlide(1);
  }, 15000);
  generateTrendingCarousel();
  //generate all genres
  moviesgenre.forEach((element) => {
    generateMovieCarousel(element.id);
  });
});

function showSlide(index: number) {
  const slides = document.querySelectorAll(".slide");
  if (index >= slides.length) {
    index = 0;
  } else if (index < 0) {
    index = slides.length - 1;
  }
  currentSlide = index;
  const offset = -currentSlide * 100;
  const slidesElement = document.querySelector(".slides") as HTMLElement;
  if (slidesElement) {
    slidesElement.style.transform = `translateX(${offset}%)`;
  }
  const slidestitle = document.getElementById("caraousel-title");
  const slidesDescription = document.getElementById("caraousel-description");
  const slidesReleaseDate = document.getElementById("caraousel-year");
  const slidesRating = document.getElementById("caraousel-rating");
  const slidesLogo = document.getElementById(
    "caraousel-logo"
  ) as HTMLImageElement;

  if (slidestitle && slidesDescription && slidesReleaseDate && slidesRating) {
    if (slideData) {
      slidestitle.textContent = slideData[currentSlide].title;
      slidesDescription.textContent = slideData[currentSlide].overview;
      slidesReleaseDate.textContent = slideData[currentSlide].release_date;
      slidesRating.textContent = slideData[currentSlide].vote_average;

      if (movideFeatured.movies[currentSlide].logo && slidesLogo) {
        slidesLogo.src =
          "https://image.tmdb.org/t/p/original" +
          movideFeatured.movies[currentSlide].logo;
        //hide title
        if (slidestitle) {
          slidestitle.style.display = "none";
        }
      } else {
        if (slidesLogo) {
          slidesLogo.style.display = "none";
        }
        if (slidestitle) {
          slidestitle.style.display = "block";
        }
      }

      //make tittle clickable
      slidestitle.onclick = () => {
        window.location.href = `/watch.html?title=${slideData[currentSlide].title}&id=${slideData[currentSlide].id}`;
      };
    } else {
      console.error("slideData is undefined");
    }
  } else {
    console.error("Element not found");
  }
}

function changeSlide(direction: number) {
  showSlide(currentSlide + direction);
}

let popularMovies: any;
let playingMovies: any;
async function searchPopularMovies() {
  const url =
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
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
let movideFeatured: any;
async function getFeaturedMovies() {
  //get local data from json
  const featureJson = await fetch("../data/featured-movies.json");
  const featureData = await featureJson.json();
  //select 3 random movies
  const randomMovies = featureData.movies.sort(() => Math.random() - 0.5);
  featureData.movies = randomMovies.slice(0, 3);

  // for each movie id, get the movie data
  featureData.movies.forEach(async (movie: any) => {
    const url = `https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}` /* process.env.TMDB_API_KEY */,
      },
    };

    //get logo image
    const ulr2 = `https://api.themoviedb.org/3/movie/${movie.id}/images`;
    const options2 = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}` /* process.env.TMDB_API_KEY */,
      },
    };

    fetch(ulr2, options2)
      .then((res) => res.json())
      .then((json) => {
        // add the logo image to the movie data
        json.logos.forEach((logo: any) => {
          if (logo.iso_639_1 === "en") {
            movie.logo = logo.file_path;
          }
        });
      });

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        // add the movie data to the featured movies
        slideData.push(json);
      })
      .then(() => {
        setSlideData(slideData);
      })
      .catch((err) => console.error(err));
  });

  console.log(slideData);
  console.log(featureData);
  movideFeatured = featureData;
}

async function searchPlayingMovies() {
  const url =
    "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}` /* process.env.TMDB_API_KEY */,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => (console.log(json), (playingMovies = json)))
    .then(() => {
      displayPlaying();
    })
    .catch((err) => console.error(err));
}

function displayPopularMovies() {
  const popularMoviesContainer = document.getElementById(
    "movie-caraousel-popular"
  ) as HTMLElement;
  displayMovieTo(popularMoviesContainer, popularMovies.results);
}

function displayPlaying() {
  const playingMoviesContainer = document.getElementById(
    "movie-caraousel-playing"
  ) as HTMLElement;
  displayMovieTo(playingMoviesContainer, playingMovies.results);
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

async function setSlideData(data: any) {
  //get 3 random movies
  showSlide(1);
  const carouselImage1 = document.getElementById(
    "caraousel-image-1"
  ) as HTMLImageElement;
  const carouselImage2 = document.getElementById(
    "caraousel-image-2"
  ) as HTMLImageElement;
  const carouselImage3 = document.getElementById(
    "caraousel-image-3"
  ) as HTMLImageElement;

  //array of images
  const images = [carouselImage1, carouselImage2, carouselImage3];
  console.log(slideData);
  if (carouselImage1 && carouselImage2 && carouselImage3) {
    carouselImage1.src = `https://image.tmdb.org/t/p/original${slideData[0].backdrop_path}`;
    carouselImage2.src = `https://image.tmdb.org/t/p/original${slideData[1].backdrop_path}`;
    carouselImage3.src = `https://image.tmdb.org/t/p/original${slideData[2].backdrop_path}`;
  }

  const slidestitle = document.getElementById("caraousel-title");
  const slidesDescription = document.getElementById("caraousel-description");
  const slidesReleaseDate = document.getElementById("caraousel-year");
  const slidesRating = document.getElementById("caraousel-rating");
  const slidesLogo = document.getElementById(
    "caraousel-logo"
  ) as HTMLImageElement;

  //set logo image
  if (slidesLogo && movideFeatured.movies[currentSlide].logo) {
    slidesLogo.src = `https://image.tmdb.org/t/p/original${movideFeatured.movies[currentSlide].logo}`;
    slidesLogo.onclick = () => {
      window.location.href = `/watch.html?title=${movideFeatured.movies[currentSlide].title}&id=${movideFeatured.movies[currentSlide].id}`;
    };
    //hide title
    if (slidestitle) {
      slidestitle.style.display = "none";
    }
  } else {
    if (slidesLogo) {
      slidesLogo.style.display = "none";
    }
  }
  console.log(movideFeatured.movies[currentSlide].logo);

  if (slidestitle && slidesDescription && slidesReleaseDate && slidesRating) {
    if (slideData) {
      slidestitle.textContent = slideData[currentSlide].title;
      slidesDescription.textContent = slideData[currentSlide].overview;
      slidesReleaseDate.textContent = slideData[currentSlide].release_date;
      slidesRating.textContent = slideData[currentSlide].vote_average;
    } else {
      console.error("slideData is undefined");
    }
  } else {
    console.error("Element not found");
  }
}

async function generateMovieCarousel(id: number) {
  const caraouselTemplate = document.getElementById(
    "movie-caraousel-template"
  ) as HTMLTemplateElement;
  const carouselParent = document.getElementById("movie-caraousel");
  const genreName = moviesgenre.find((genre) => genre.id === id);
  if (caraouselTemplate) {
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${id}&language=en-US&page=1`;
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
    const url = `https://api.themoviedb.org/3/trending/movie/day?language=en-US`;
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
        window.location.href = `/watch.html?title=${movie.title}&id=${movie.id}`;
      };
      image.onerror = () => {
        image.src = "https://via.placeholder.com/500x750";
      };
    }
    if (title) {
      title.textContent = movie.original_title;
    }
    if (carouselContainer) {
      carouselContainer.appendChild(card);
    }
    if (movieInfoRating) {
      movieInfoRating.textContent = movie.vote_average.toFixed(1);
      movieInfoTitle.textContent = movie.original_title;
    }
    //image href to watch page
    if (title) {
      // change the title to the movie title
      title.textContent = movie.original_title;
      movieInfoTitle.textContent = movie.original_title;
      console.log(movieInfoTitle.textContent);
      // add href to the title
      title.href = `/watch.html?title=${movie.title}&id=${movie.id}`;
    }
  });
}
