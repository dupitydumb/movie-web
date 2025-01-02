import dotenv from "dotenv";
import { json } from "express";

dotenv.config();

document.addEventListener("DOMContentLoaded", () => {
  init();
});

let movieID: any;
let currentseason = 1;
let currentepisode = 1;
let seasondata: any;
function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieTitle = urlParams.get("title");
  const movieId = urlParams.get("id");
  const main = document.querySelector(".container-watch") as HTMLElement;
  movieID = movieId;
  if (movieTitle) {
    const titleElement = document.getElementById("movie-title");
    if (titleElement) {
      titleElement.textContent = movieTitle;
    }
  }
  updateProviders();
  if (movieId) {
    fetchMovie(movieId);
    const playerContainer = document.getElementById(
      "movie-player"
    ) as HTMLIFrameElement;
    if (playerContainer) {
      playerContainer.src = `https://vidlink.pro/tv/${movieID}/${1}/${1}?primaryColor=63b8bc&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&player=default&title=true&poster=true&autoplay=true&nextbutton=true`;
    }
  } else {
    main.innerHTML = "<h1>Movie not found</h1>";
  }
  generateServer();

  //   generateRecomendations();
}

let moviedata: any;
async function fetchMovie(movieId: string) {
  const url = `https://api.themoviedb.org/3/tv/${movieId}?language=en-US`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_API_KEY}` /* process.env.TMDB_API_KEY */,
    },
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => (moviedata = json))
    .then(() => {
      updateMovieInfo();
      seasondata = moviedata.seasons;
      GetEpisodes();
    })
    .catch((err) => console.error(err));
}

function updateMovieInfo() {
  const titleElement = document.getElementById("movie-info-title");
  const posterElement = document.getElementById(
    "movie-info-img"
  ) as HTMLImageElement;
  const descriptionElement = document.getElementById("movie-info-description");
  const releaseDateElement = document.getElementById("movie-info-date");
  const ratingElement = document.getElementById("movie-info-rating");
  const genreparent = document.getElementById("genre-container");

  if (titleElement) {
    titleElement.textContent = moviedata.name;
  }
  if (posterElement) {
    posterElement.src = `https://image.tmdb.org/t/p/w500${moviedata.poster_path}`;
  }
  if (descriptionElement) {
    descriptionElement.textContent = moviedata.overview;
  }
  if (releaseDateElement) {
    releaseDateElement.textContent = moviedata.release_date;
  }
  if (ratingElement) {
    const rating = moviedata.vote_average.toFixed(1);
    ratingElement.textContent = rating;
  }
  if (genreparent) {
    //get the first 3 genres, duplicate genreElement and append to genresElement
    const genres = moviedata.genres;
    for (let i = 0; i < genres.length; i++) {
      //create a new span element
      const genreElement = document.createElement("span");
      genreElement.textContent = genres[i].name;
      genreElement.classList.add("genre");
      genreparent.appendChild(genreElement);
    }
  }

  //change page title
  document.title = "Watch " + moviedata.name;
}

let providers = [
  {
    name: "VidLink",
    url: `https://vidlink.pro/tv/${movieID}/${currentseason}/${currentepisode}?primaryColor=63b8bc&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&player=default&title=true&poster=true&autoplay=true&nextbutton=true`,
    recommended: true,
  },
  {
    name: "Autoembed",
    url: `https://player.autoembed.cc/embed/tv/${movieID}/${currentseason}/${currentepisode}`,
    recommended: false,
  },
  {
    name: "Vidsrc",
    url: `https://vidsrc.rip/embed/tv/${movieID}/${currentseason}/${currentepisode}`,
    recommended: true,
  },
  {
    name: "111Movies",
    url: `https://111movies.com/tv/${movieID}/${currentseason}/${currentepisode}`,
    recommended: false,
  },
  {
    name: "Vidbinge",
    url: `https://vidbinge.dev/embed/tv/${movieID}/${currentseason}/${currentepisode}`,
    recommended: false,
  },
  {
    name: "embed.su",
    url: `https://embed.su/embed/tv/${movieID}/${currentseason}/${currentepisode}`,
    recommended: true,
  },
  {
    name: "Multiembed",
    url: `https://multiembed.mov/?video_id=${movieID}&tmdb=1&s=${currentseason}&e=${currentepisode}`,
    recommended: true,
  },
];

function updateProviders() {
  let newProviders = [
    {
      name: "VidLink",
      url: `https://vidlink.pro/tv/${movieID}/${currentseason}/${currentepisode}?primaryColor=63b8bc&secondaryColor=a2a2a2&iconColor=eefdec&icons=default&player=default&title=true&poster=true&autoplay=true&nextbutton=true`,
      recommended: true,
    },
    {
      name: "Autoembed",
      url: `https://player.autoembed.cc/embed/tv/${movieID}/${currentseason}/${currentepisode}`,
      recommended: false,
    },
    {
      name: "Vidsrc",
      url: `https://vidsrc.rip/embed/tv/${movieID}/${currentseason}/${currentepisode}`,
      recommended: true,
    },
    {
      name: "111Movies",
      url: `https://111movies.com/tv/${movieID}/${currentseason}/${currentepisode}`,
      recommended: false,
    },
    {
      name: "Vidbinge",
      url: `https://vidbinge.dev/embed/tv/${movieID}/${currentseason}/${currentepisode}`,
      recommended: false,
    },
    {
      name: "embed.su",
      url: `https://embed.su/embed/tv/${movieID}/${currentseason}/${currentepisode}`,
      recommended: true,
    },
    {
      name: "Multiembed",
      url: `https://multiembed.mov/?video_id=${movieID}&tmdb=1&s=${currentseason}&e=${currentepisode}`,
      recommended: true,
    },
  ];
  providers = newProviders;
  updatevideosource();
}

function generateServer() {
  const buttoncontainer = document.getElementById("movie-server-buttons");

  const playerContainer = document.getElementById(
    "movie-player"
  ) as HTMLIFrameElement;
  //create a button for each provider
  providers.forEach((provider) => {
    let index = 0;
    const button = document.createElement("button");
    if (provider.recommended) {
      button.textContent = provider.name + " (Minimal Ads)";
    } else {
      button.textContent = provider.name + " (With Ads)";
    }
    button.onclick = () => {
      // add selected class to the button
      const buttons = document.querySelectorAll("button");
      buttons.forEach((button) => {
        button.classList.remove("selected");
      });
      button.classList.add("selected");
      providerIndex = index;
      updatevideosource();
    };
    buttoncontainer?.appendChild(button);
    index++;
  });

  //select the first button by default
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.classList.remove("selected");
  });
  buttons[0].classList.add("selected");
}

interface Season {
  season_number: number;
  episodes: any[];
}

let fullseasonjson: Season[] = [];

async function GetEpisodes() {
  let index = 0;
  // For each season, get the episodes
  const promises = seasondata.map((season: any) => {
    const url = `https://api.themoviedb.org/3/tv/${movieID}/season/${season.season_number}?language=en-US`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    };
    index++;
    return fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        // add season and episodes to fullseasonjson
        // compare season number to ensure that the episodes are added in the correct order

        fullseasonjson.push({
          season_number: json.season_number,
          episodes: json.episodes,
        });
        //sort the seasons in descending order
        fullseasonjson.sort((a, b) => a.season_number - b.season_number);
      })
      .catch((err) => console.error(err));
  });

  await Promise.all(promises);
  displaySeasons();
}

function displaySeasons() {
  //sort the seasons in descending order
  const seasonDropdown = document.getElementById(
    "season-select"
  ) as HTMLSelectElement;
  const episodeContainer = document.getElementById(
    "episodes"
  ) as HTMLSelectElement;
  const episodeTemplate = document.getElementById(
    "episode-card-template"
  ) as HTMLTemplateElement;

  //clear the episode container
  episodeContainer.innerHTML = "";
  fullseasonjson.forEach((season: any) => {
    const option = document.createElement("option");
    option.value = season.season_number;
    if (season.season_number == 0) {
      option.textContent = "Specials";
    } else {
      option.textContent = "Season " + season.season_number;
    }
    seasonDropdown.appendChild(option);
  });
  //arrange dropdown in ascending order
  const options = Array.from(seasonDropdown.options);
  options.sort((a, b) => Number(a.value) - Number(b.value));

  //add event listener to the season dropdown
  seasonDropdown.addEventListener("change", () => {
    displayEpisodes(fullseasonjson[seasonDropdown.selectedIndex]);
  });

  //set the first season as selected by default
  if (seasonDropdown) {
    // if specials exist, select it by default
    if (seasonDropdown.options[0].value == "0") {
      seasonDropdown.selectedIndex = 1;
      displayEpisodes(fullseasonjson[1]);
    } else {
      seasonDropdown.selectedIndex = 0;
      displayEpisodes(fullseasonjson[0]);
    }
  }

  //display the first season by default, no specials
}

function displayEpisodes(seasons: any) {
  const episodeContainer = document.getElementById(
    "episodes"
  ) as HTMLSelectElement;
  const episodeTemplate = document.getElementById(
    "episode-card-template"
  ) as HTMLTemplateElement;

  //remove all div in the episode container
  episodeContainer.innerHTML = "";
  seasons.episodes.forEach((episode: any) => {
    const episodeCard = episodeTemplate.content.cloneNode(true) as HTMLElement;
    const episodeTitle = episodeCard.querySelector(
      ".episode-title"
    ) as HTMLAnchorElement;
    const episodeDescription = episodeCard.querySelector(
      ".episode-description"
    ) as HTMLParagraphElement;

    if (episodeTitle) {
      episodeTitle.textContent =
        "S" + episode.season_number + "E" + episode.episode_number;
    }
    if (episodeDescription) {
      episodeDescription.textContent = episode.name;
    }
    // on click event for the episode card
    const episodeCardElement = episodeCard.querySelector(
      ".episode-card"
    ) as HTMLElement;
    if (episodeCardElement) {
      episodeCardElement.onclick = () => {
        const episodeNumber = episode.episode_number;
        const seasonNumber = episode.season_number;
        currentseason = seasonNumber;
        currentepisode = episodeNumber;
        updateProviders();

        //chang this to selected class
        const episodeCards = document.querySelectorAll(".episode-card");
        episodeCards.forEach((card) => {
          card.classList.remove("episode-selected");
        });
        episodeCardElement.classList.add("episode-selected");
      };
    }
    episodeContainer.appendChild(episodeCard);
  });

  //set the first episode as selected by default
  const episodeCards = document.querySelectorAll(".episode-card");
  if (episodeCards.length > 0) {
    episodeCards[0].classList.add("episode-selected");
  }
}
let providerIndex = 0;
function updatevideosource() {
  const playerContainer = document.getElementById(
    "movie-player"
  ) as HTMLIFrameElement;
  playerContainer.src = providers[providerIndex].url;
}
