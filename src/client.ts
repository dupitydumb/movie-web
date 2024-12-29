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
