export class MovieCard {
  title: string;
  imageUrl: string;
  releaseDate: string;

  constructor(title: string, imageUrl: string, releaseDate: string) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.releaseDate = releaseDate;
  }

  render(): DocumentFragment {
    const template = document.getElementById(
      "movie-card-template"
    ) as HTMLTemplateElement;
    const clone = template.content.cloneNode(true) as DocumentFragment;

    const img = clone.querySelector("img") as HTMLImageElement;
    img.src = this.imageUrl;
    img.alt = this.title;

    const titleElement = clone.querySelector("h3") as HTMLElement;
    titleElement.textContent = this.title;

    const releaseDateElement = clone.querySelector(
      ".image-text-data"
    ) as HTMLElement;
    releaseDateElement.textContent = this.releaseDate;

    return clone;
  }
}
