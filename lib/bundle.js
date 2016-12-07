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
	
	let selectedImage;
	
	document.addEventListener('DOMContentLoaded', () => {
	  selectedImage = new Image();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Filter = __webpack_require__(3);
	
	class Image {
	  constructor() {
	    this.createDropbox();
	    this.img = null;
	    this.width = null;
	    this.height = null;
	    this.createCanvasEl = this.createCanvasEl.bind(this);
	    this.addWindowResize = this.addWindowResize.bind(this);
	    this.handleFile = this.handleFile.bind(this);
	  }
	
	  createDropbox() {
	    let dropbox = document.getElementById('dropbox');
	
	    dropbox.addEventListener("dragenter", this.dragenter, false);
	    dropbox.addEventListener("dragover", this.dragover, false);
	    dropbox.addEventListener("drop", this.drop(), false);
	  }
	
	  dragenter(e) {
	    e.stopPropagation();
	    e.preventDefault();
	  }
	
	  dragover(e) {
	    e.stopPropagation();
	    e.preventDefault();
	  }
	
	  drop() {
	    return (e) => {
	      e.stopPropagation();
	      e.preventDefault();
	
	      let dt = e.dataTransfer;
	      let files = dt.files;
	
	      this.handleFile(files[0]);
	    };
	  }
	
	  handleFile(file) {
	    this.img = document.createElement("img");
	    this.img.file = file;
	
	    let reader = new FileReader();
	
	    reader.onload = (e) => {
	      this.img.src = e.target.result;
	      this.width = this.img.width;
	      this.height = this.img.height;
	
	      this.createCanvasEl(this.img);
	      new Filter(document.getElementById('image-canvas'));
	      this.addWindowResize();
	    };
	
	    reader.readAsDataURL(file);
	  }
	
	  createCanvasEl() {
	    let $canvasDiv = $('.dynamic-canvas');
	
	    let imgDimensions = this.imageResize(0.8);
	
	    let $ctx = $('<canvas/>').attr({width: imgDimensions[0], height: imgDimensions[1], id: 'image-canvas'});
	    let c = $ctx[0].getContext('2d');
	    c.drawImage(this.img, 0, 0, ...imgDimensions);
	    let $dropbox = $('.dropbox-and-preview');
	    $dropbox.remove();
	    $canvasDiv.append($ctx);
	  }
	
	  imageResize(percentage) {
	    let wWidth = window.innerWidth;
	    let wHeight = window.innerHeight;
	    let maxHeight = wHeight * percentage;
	    let maxWidth = wWidth * percentage;
	    let maxImgWidth = maxWidth;
	    let maxImgHeight = maxImgWidth * (this.height / this.width);
	
	    if (maxImgHeight > maxHeight) {
	      maxImgHeight = maxHeight;
	      maxImgWidth = maxImgHeight * (this.width / this.height);
	    }
	
	    if (maxImgWidth > this.width || maxImgHeight > this.height) {
	      return [this.width, this.height];
	    }
	
	    return [maxImgWidth, maxImgHeight];
	  }
	
	  addWindowResize() {
	    $(window).resize(() => {
	      let $canvasDiv = $('#image-canvas');
	      $canvasDiv.remove();
	      this.createCanvasEl();
	    });
	  }
	}
	
	module.exports = Image;


/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	class Filter {
	  constructor(canvas) {
	    this.canvas = canvas;
	    this.cache = [];
	    this.currentVersion = null;
	    this.buildFilterElements();
	    this.buildUtilityElements();
	    this.gaussianBlur = this.gaussianBlur.bind(this);
	  }
	
	  buildFilterElements() {
	    let $filterDiv = $('.filters');
	    let $testButton = $('<button/>').html("filter test");
	
	    $testButton.click(this.gaussianBlur);
	
	    $filterDiv.append($testButton);
	  }
	
	  buildUtilityElements() {
	    let $utilityDiv = $('.utilities');
	    let $testButton = $('<button/>').html("utility test");
	
	    $utilityDiv.append($testButton);
	  }
	
	  gaussianBlur() {
	    this.canvas = document.getElementById('image-canvas');
	    let ctx = this.canvas.getContext('2d');
	    let myImageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
	    let data = myImageData.data;
	
	    for (var i = 0; i < data.length; i += 4) {
	      data[i] = 255;
	      data[i + 1] = 0;
	      data[i + 2] = 0;
	    }
	
	    ctx.putImageData(myImageData, 0, 0);
	  }
	}
	
	module.exports = Filter;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map