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
	const Canvas = __webpack_require__ (2);
	
	let selectedImage;
	
	document.addEventListener('DOMContentLoaded', () => {
	  selectedImage = new Image();
	});
	
	window.addEventListener('resize', () => {
	
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Canvas = __webpack_require__(2);
	
	class Image {
	  constructor() {
	    this.createDropbox();
	    this.img = null;
	    this.width = null;
	    this.height = null;
	    this.createCanvasEl = this.createCanvasEl.bind(this);
	    this.addWindowResize = this.addWindowResize.bind(this);
	  }
	
	  createDropbox() {
	    let dropbox = document.getElementById('dropbox');
	    let that = this;
	
	    dropbox.addEventListener("dragenter", this.dragenter, false);
	    dropbox.addEventListener("dragover", this.dragover, false);
	    dropbox.addEventListener("drop", this.drop(that), false);
	  }
	
	  dragenter(e) {
	    e.stopPropagation();
	    e.preventDefault();
	  }
	
	  dragover(e) {
	    e.stopPropagation();
	    e.preventDefault();
	  }
	
	  drop(scope) {
	    return (e) => {
	      e.stopPropagation();
	      e.preventDefault();
	
	      let dt = e.dataTransfer;
	      let files = dt.files;
	
	      scope.handleFile(files[0]);
	    };
	  }
	
	  handleFile(file) {
	    let img = document.createElement("img");
	    this.img = img;
	    this.width = img.width;
	    this.height = img.height;
	    img.file = file;
	
	    let reader = new FileReader();
	
	    reader.onload = (e) => {
	      img.src = e.target.result;
	      this.createCanvasEl(this.img);
	      this.addWindowResize();
	    };
	
	    reader.readAsDataURL(file);
	  }
	
	  createCanvasEl(imageEl) {
	    let $canvasDiv = $('.dynamic');
	
	    let imgDimensions = this.imageResize(imageEl.width, imageEl.height, 0.8);
	
	    let $ctx = $('<canvas/>').attr({width: imgDimensions[0], height: imgDimensions[1], class: 'image-canvas'});
	    let c = $ctx[0].getContext('2d');
	    c.drawImage(imageEl, 0, 0, ...imgDimensions);
	    let $dropbox = $('.dropbox-and-preview');
	    $dropbox.remove();
	    $canvasDiv.append($ctx);
	
	  }
	
	  imageResize(width, height, percentage) {
	    let wWidth = window.innerWidth;
	    let wHeight = window.innerHeight;
	    let maxHeight = wHeight * percentage;
	    let maxWidth = wWidth * percentage;
	    let maxImgWidth = maxWidth;
	    let maxImgHeight = maxImgWidth * (height / width);
	
	    if (maxImgHeight > maxHeight) {
	      maxImgHeight = maxHeight;
	      maxImgWidth = maxImgHeight * (width / height);
	    }
	
	    return [maxImgWidth, maxImgHeight];
	  }
	
	  addWindowResize() {
	    $(window).resize(() => {
	      let $canvasDiv = $('.image-canvas');
	      $canvasDiv.remove();
	      this.createCanvasEl(this.img);
	    });
	  }
	}
	
	module.exports = Image;


/***/ },
/* 2 */
/***/ function(module, exports) {

	class Canvas {
	  constructor(image, width, height) {
	    this.image = image;
	    this.width = width;
	    this.height = height;
	    this.createCanvasEl(this.image);
	  }
	
	  updateDOMElements() {
	
	  }
	
	  createCanvasEl(imageEl) {
	    let $canvasDiv = $('.dynamic');
	
	    let imgDimensions = this.imageResize(imageEl.width, imageEl.height, 0.8);
	
	    let $ctx = $('<canvas/>').attr({width: imgDimensions[0], height: imgDimensions[1]});
	    let c = $ctx[0].getContext('2d');
	    c.drawImage(imageEl, 0, 0, ...imgDimensions);
	    let $dropbox = $('.dropbox-and-preview');
	    $dropbox.remove();
	    $canvasDiv.append($ctx);
	  }
	
	  imageResize(width, height, percentage) {
	    let wWidth = window.innerWidth;
	    let wHeight = window.innerHeight;
	    let maxHeight = wHeight * percentage;
	    let maxWidth = wWidth * percentage;
	    let maxImgWidth = maxWidth;
	    let maxImgHeight = maxImgWidth * (height / width);
	
	    if (maxImgHeight > maxHeight) {
	      maxImgHeight = maxHeight;
	      maxImgWidth = maxImgHeight * (width / height);
	    }
	
	    return [maxImgWidth, maxImgHeight];
	  }
	
	  handleWindowResize(canvas) {
	    let wWidth = window.innerWidth;
	    let wHeight = window.innerHeight;
	  }
	}
	
	module.exports = Canvas;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map