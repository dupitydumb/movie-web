/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var MyLibrary;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/MovieCard.ts":
/*!**************************!*\
  !*** ./src/MovieCard.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.MovieCard = void 0;\r\nclass MovieCard {\r\n    constructor(title, imageUrl, releaseDate) {\r\n        this.title = title;\r\n        this.imageUrl = imageUrl;\r\n        this.releaseDate = releaseDate;\r\n    }\r\n    render() {\r\n        const template = document.getElementById(\"movie-card-template\");\r\n        const clone = template.content.cloneNode(true);\r\n        const img = clone.querySelector(\"img\");\r\n        img.src = this.imageUrl;\r\n        img.alt = this.title;\r\n        const titleElement = clone.querySelector(\"h3\");\r\n        titleElement.textContent = this.title;\r\n        const releaseDateElement = clone.querySelector(\".image-text-data\");\r\n        releaseDateElement.textContent = this.releaseDate;\r\n        return clone;\r\n    }\r\n}\r\nexports.MovieCard = MovieCard;\r\n\n\n//# sourceURL=webpack://MyLibrary/./src/MovieCard.ts?");

/***/ }),

/***/ "./src/client.ts":
/*!***********************!*\
  !*** ./src/client.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\r\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\r\nexports.MovieCarousel = void 0;\r\nconst MovieCard_1 = __webpack_require__(/*! ./MovieCard */ \"./src/MovieCard.ts\");\r\nclass MovieCarousel {\r\n    constructor(container) {\r\n        this.container = container;\r\n    }\r\n    init(movies) {\r\n        movies.forEach((movie) => {\r\n            const movieCard = new MovieCard_1.MovieCard(movie.title, movie.imageUrl, movie.releaseDate);\r\n            this.container.appendChild(movieCard.render());\r\n        });\r\n    }\r\n}\r\nexports.MovieCarousel = MovieCarousel;\r\n//event onload\r\nwindow.addEventListener(\"load\", () => {\r\n    //Init Next and Prev buttons carousel\r\n    const nextButton = document.getElementById(\"image-next\");\r\n    const prevButton = document.getElementById(\"image-prev\");\r\n    nextButton.addEventListener(\"click\", () => {\r\n        changeSlide(1);\r\n    });\r\n    prevButton.addEventListener(\"click\", () => {\r\n        changeSlide(-1);\r\n    });\r\n    showSlide(0);\r\n});\r\nlet currentSlide = 0;\r\nlet currentSlideInfo = [\r\n    {\r\n        title: \"The Shawshank Redemption\",\r\n        description: \"Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.\",\r\n        releaseDate: \"1994\",\r\n        rating: \"9.3\",\r\n    },\r\n    {\r\n        title: \"The Godfather\",\r\n        description: \"The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.\",\r\n        releaseDate: \"1972\",\r\n        rating: \"9.2\",\r\n    },\r\n    {\r\n        title: \"The Dark Knight\",\r\n        description: \"When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham.\",\r\n        releaseDate: \"2008\",\r\n        rating: \"9.0\",\r\n    },\r\n];\r\nconst slides = document.querySelector(\".slides\");\r\nfunction showSlide(index) {\r\n    const slides = document.querySelectorAll(\".slide\");\r\n    if (index >= slides.length) {\r\n        currentSlide = 0;\r\n    }\r\n    else if (index < 0) {\r\n        currentSlide = slides.length - 1;\r\n    }\r\n    else {\r\n        currentSlide = index;\r\n    }\r\n    const offset = -currentSlide * 100;\r\n    const slidesElement = document.querySelector(\".slides\");\r\n    if (slidesElement) {\r\n        slidesElement.style.transform = `translateX(${offset}%)`;\r\n    }\r\n    const slidestitle = document.getElementById(\"caraousel-title\");\r\n    const slidesDescription = document.getElementById(\"caraousel-description\");\r\n    const slidesReleaseDate = document.getElementById(\"caraousel-year\");\r\n    const slidesRating = document.getElementById(\"caraousel-rating\");\r\n    if (slidestitle && slidesDescription && slidesReleaseDate && slidesRating) {\r\n        slidestitle.innerHTML = currentSlideInfo[currentSlide].title;\r\n        slidesDescription.innerHTML = currentSlideInfo[currentSlide].description;\r\n        slidesReleaseDate.innerHTML = currentSlideInfo[currentSlide].releaseDate;\r\n        slidesRating.innerHTML = currentSlideInfo[currentSlide].rating;\r\n    }\r\n}\r\nfunction changeSlide(direction) {\r\n    showSlide(currentSlide + direction);\r\n}\r\n\n\n//# sourceURL=webpack://MyLibrary/./src/client.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/client.ts");
/******/ 	MyLibrary = __webpack_exports__;
/******/ 	
/******/ })()
;