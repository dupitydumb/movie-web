import e, { json } from "express";
import { MovieCard } from "./MovieCard";

let currentSlide = 0;
let slideData: any;
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
  searchPopularMovies();
  searchPlayingMovies();
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

  if (slidestitle && slidesDescription && slidesReleaseDate && slidesRating) {
    if (slideData) {
      slidestitle.textContent = slideData[currentSlide].title;
      slidesDescription.textContent = slideData[currentSlide].overview;
      slidesReleaseDate.textContent = slideData[currentSlide].release_date;
      slidesRating.textContent = slideData[currentSlide].vote_average;

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
      setSlideData(popularMovies);
    })
    .catch((err) => console.error(err));
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
  const resultsContainer = document.getElementById("movie-caraousel-popular");
  const cardTemplate = document.getElementById(
    "movie-card-template"
  ) as HTMLTemplateElement;

  popularMovies.results.forEach((movie: any) => {
    const card = cardTemplate.content.cloneNode(true) as HTMLElement;
    const image = card.querySelector("img") as HTMLImageElement;
    const title = card.querySelector("a") as HTMLAnchorElement;
    const movieInfoTitle = card.querySelector(
      ".movie-card-text"
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

function displayPlaying() {
  const resultsContainer = document.getElementById("movie-caraousel-playing");
  const cardTemplate = document.getElementById(
    "movie-card-template"
  ) as HTMLTemplateElement;
  playingMovies.results.forEach((movie: any) => {
    const card = cardTemplate.content.cloneNode(true) as HTMLElement;
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

function setSlideData(data: any) {
  //get 3 random movies
  if (data && data.results) {
    const randomMovies = data.results
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    slideData = randomMovies;
  } else {
    console.error("Data or data.results is undefined");
  }
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

  if (carouselImage1 && carouselImage2 && carouselImage3) {
    carouselImage1.src = `https://image.tmdb.org/t/p/original${slideData[0].backdrop_path}`;
    carouselImage2.src = `https://image.tmdb.org/t/p/original${slideData[1].backdrop_path}`;
    carouselImage3.src = `https://image.tmdb.org/t/p/original${slideData[2].backdrop_path}`;
    // let index = 0;
    // // get image api
    // images.forEach((element) => {
    //   let imagedata: any;
    //   const url = `https://api.themoviedb.org/3/movie/${slideData[index].id}/images`;
    //   const options = {
    //     method: "GET",
    //     headers: {
    //       accept: "application/json",
    //       Authorization: `Bearer ${process.env.TMDB_API_KEY}` /* process.env.TMDB_API_KEY */,
    //     },
    //   };
    //   fetch(url, options)
    //     .then((res) => res.json())
    //     .then((json) => (imagedata = json))
    //     .then(() => {
    //       element.src = `https://image.tmdb.org/t/p/original${imagedata.backdrops[0].file_path}`;
    //     })
    //     .catch((err) => console.error(err));
    //   index++;
    // });
  }

  const slidestitle = document.getElementById("caraousel-title");
  const slidesDescription = document.getElementById("caraousel-description");
  const slidesReleaseDate = document.getElementById("caraousel-year");
  const slidesRating = document.getElementById("caraousel-rating");

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
      console.log(movieInfoTitle.textContent);
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
