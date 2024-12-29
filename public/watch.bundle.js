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

/***/ "./src/watch.ts":
/*!**********************!*\
  !*** ./src/watch.ts ***!
  \**********************/
/***/ (() => {

eval("\r\ndocument.addEventListener(\"DOMContentLoaded\", () => {\r\n    console.log(\"Hello from watch.ts\");\r\n    const urlParams = new URLSearchParams(window.location.search);\r\n    const movieTitle = urlParams.get(\"title\");\r\n    const movieId = urlParams.get(\"id\");\r\n    if (movieTitle) {\r\n        const titleElement = document.getElementById(\"movie-title\");\r\n        if (titleElement) {\r\n            titleElement.textContent = movieTitle;\r\n        }\r\n    }\r\n    if (movieId) {\r\n        const playerContainer = document.getElementById(\"movie-player\");\r\n    }\r\n    else {\r\n        const playerContainer = document.getElementById(\"movie-player\");\r\n        if (playerContainer) {\r\n            playerContainer.innerHTML = \"Invalid movie id\";\r\n        }\r\n    }\r\n});\r\n\n\n//# sourceURL=webpack://MyLibrary/./src/watch.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/watch.ts"]();
/******/ 	MyLibrary = __webpack_exports__;
/******/ 	
/******/ })()
;