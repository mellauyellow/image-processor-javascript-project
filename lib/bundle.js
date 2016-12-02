/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Image = __webpack_require__(1);
	
	document.addEventListener('DOMContentLoaded', () => {
	  Image.createDropbox();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Canvas = __webpack_require__(2);
	
	class Image {
	  constructor(file) {
	    this.file = file;
	  }
	
	  static createDropbox() {
	    const dropbox = document.getElementById('dropbox');
	
	    const dragenter = function(e) {
	      e.stopPropagation();
	      e.preventDefault();
	    };
	
	    const dragover = function(e) {
	      e.stopPropagation();
	      e.preventDefault();
	    };
	
	    const drop = function(e) {
	      e.stopPropagation();
	      e.preventDefault();
	
	      let dt = e.dataTransfer;
	      let files = dt.files;
	
	      Image.handleFile(files[0]);
	    };
	
	    dropbox.addEventListener("dragenter", dragenter, false);
	    dropbox.addEventListener("dragover", dragover, false);
	    dropbox.addEventListener("drop", drop, false);
	  }
	
	  static handleFile(file) {
	    let img = document.createElement("img");
	    img.classList.add("obj");
	    img.file = file;
	
	    let reader = new FileReader();
	
	    reader.onload = (e) => {
	        img.src = e.target.result;
	        let width = img.width;
	        let height = img.height;
	        Canvas.createCanvasEl(img);
	        // Image.canvasTest(img);
	        // TODO: change to call function that programmatically creates canvas element and resizes it
	    };
	
	    reader.readAsDataURL(file);
	  }
	
	  static canvasTest(object) {
	    let canvas = document.getElementById("canvas");
	    let c = canvas.getContext('2d');
	    c.drawImage(object, 0, 0, 400, 600);
	  }
	}
	
	module.exports = Image;


/***/ },
/* 2 */
/***/ function(module, exports) {

	class Canvas {
	  constuctor(image, el) {
	    this.image = image;
	    this.el = el;
	  }
	
	  static createCanvasEl(imageEl) {
	    let $ctx = $('<canvas/>');
	    let $canvasDiv = $('.dynamic');
	    $canvasDiv.append($ctx);
	  }
	}
	
	module.exports = Canvas;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map