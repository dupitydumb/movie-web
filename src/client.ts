import { MovieCard } from "./MovieCard";

export class MovieCarousel {
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  init(
    movies: { title: string; imageUrl: string; releaseDate: string }[]
  ): void {
    movies.forEach((movie) => {
      const movieCard = new MovieCard(
        movie.title,
        movie.imageUrl,
        movie.releaseDate
      );
      this.container.appendChild(movieCard.render());
    });
  }
}

//event onload
window.addEventListener("load", () => {
  console.log("Hello from client.ts");
  //Init Next and Prev buttons carousel
  const nextButton = document.getElementById("image-next") as HTMLElement;
  const prevButton = document.getElementById("image-prev") as HTMLElement;

  nextButton.addEventListener("click", () => {
    changeSlide(1);
  });

  prevButton.addEventListener("click", () => {
    changeSlide(-1);
  });

  showSlide(0);
});

let currentSlide = 0;
let currentSlideInfo = [
  {
    title: "The Shawshank Redemption",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseDate: "1994",
    rating: "9.3",
  },
  {
    title: "The Godfather",
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    releaseDate: "1972",
    rating: "9.2",
  },
  {
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.",
    releaseDate: "2008",
    rating: "9.0",
  },
];

const slides = document.querySelector(".slides") as HTMLElement;
function showSlide(index: number) {
  const slides = document.querySelectorAll(".slide");
  if (index >= slides.length) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide = index;
  }
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
    slidestitle.innerHTML = currentSlideInfo[currentSlide].title;
    slidesDescription.innerHTML = currentSlideInfo[currentSlide].description;
    slidesReleaseDate.innerHTML = currentSlideInfo[currentSlide].releaseDate;
    slidesRating.innerHTML = currentSlideInfo[currentSlide].rating;
  }
}

function changeSlide(direction: number) {
  showSlide(currentSlide + direction);
}
