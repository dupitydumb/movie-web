document.addEventListener("DOMContentLoaded", () => {
  console.log("Hello from watch.ts");

  const urlParams = new URLSearchParams(window.location.search);
  const movieTitle = urlParams.get("title");
  const movieId = urlParams.get("id");

  if (movieTitle) {
    const titleElement = document.getElementById("movie-title");
    if (titleElement) {
      titleElement.textContent = movieTitle;
    }
  }

  if (movieId) {
    const playerContainer = document.getElementById("movie-player");
  } else {
    const playerContainer = document.getElementById("movie-player");
    if (playerContainer) {
      playerContainer.innerHTML = "Invalid movie id";
    }
  }
});
