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

	const Image = __webpack_require__(2);
	
	document.addEventListener('DOMContentLoaded', () => {
	  Image.createDropbox();
	});


/***/ },
/* 1 */,
/* 2 */
/***/ function(module, exports) {

	class Image {
	  constructor(file) {
	    this.file = file;
	  }
	
	  makeThumbnail(width, height) {
	
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
	    let preview = document.getElementById("preview");
	    preview.appendChild(img);
	
	    let reader = new FileReader();
	    reader.onload = ((aImg) => {
	      return (e) => {
	        aImg.src = e.target.result;
	      };
	    })(img);
	    reader.readAsDataURL(file);
	  }
	}
	
	module.exports = Image;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map