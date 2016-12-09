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
	    this.currentImg = null;
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
	      new Filter(document.getElementById('image-canvas'), this);
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
	  constructor(currentCanvas, imgObject) {
	    this.currentCanvas = currentCanvas;
	    this.currentCtx = this.currentCanvas.getContext('2d');
	    this.cache = [this.currentCtx.getImageData(0, 0, this.currentCanvas.width, this.currentCanvas.height)];
	    this.filterOrder = [];
	    this.currentIndex = 0;
	    this.imgObject = imgObject;
	    this.fullImgCanvas = this.buildFullImgCanvas();
	    this.buildFilterElements();
	    this.buildUtilityElements();
	    this.greyFilter = this.greyFilter.bind(this);
	    this.greenFilter = this.greenFilter.bind(this);
	    this.resetCanvas = this.resetCanvas.bind(this);
	    this.applyFilter = this.applyFilter.bind(this);
	    this.downloadImage = this.downloadImage.bind(this);
	    this.sharpenFilter = this.sharpenFilter.bind(this);
	    this.calculateMatrix = this.calculateMatrix.bind(this);
	  }
	
	  buildFullImgCanvas() {
	    let canvas = document.createElement('canvas');
	    canvas.width = this.imgObject.width;
	    canvas.height = this.imgObject.height;
	
	    let ctx = canvas.getContext('2d');
	
	    ctx.drawImage(this.imgObject.img, 0, 0, this.imgObject.width, this.imgObject.height);
	    return canvas;
	  }
	
	  buildFilterElements() {
	    let $filterDiv = $('.filters');
	    let $greyButton = $('<button/>').html("grey filter");
	    let $sharpenButton = $('<button/>').html("sharpen filter");
	
	    $greyButton.click(this.applyFilter(this.greyFilter));
	    $sharpenButton.click(this.applyFilter(this.sharpenFilter));
	
	    $filterDiv.append($greyButton);
	    $filterDiv.append($sharpenButton);
	  }
	
	  buildUtilityElements() {
	    let $utilityDiv = $('.utilities');
	    let $testButton = $('<a/>').html("utility test").attr({href: "#"});
	    let that = this;
	
	    $testButton.click(
	      function() {
	        that.downloadImage(this, 'canvas.jpg');
	        that.fullImgCanvas = that.buildFullImgCanvas();
	      }
	    );
	
	    $utilityDiv.append($testButton);
	  }
	
	  downloadImage(link, filename) {
	    let canvas = this.fullImgCanvas;
	
	    this.filterOrder.forEach(filter => filter(canvas));
	
	    link.href = canvas.toDataURL();
	    link.download = filename;
	  }
	
	  applyFilter(filter) {
	    return (e) => {
	      e.preventDefault();
	      this.resetCanvas();
	      filter(this.currentCanvas, this);
	      this.filterOrder.push(filter);
	    };
	  }
	
	  greyFilter(canvas) {
	    let ctx = canvas.getContext('2d');
	
	    let ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	    let data = ImageData.data;
	
	    for (var i = 0; i < data.length; i += 4) {
	      let newValue = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
	      data[i] = newValue;
	      data[i + 1] = newValue;
	      data[i + 2] = newValue;
	    }
	    // this.cache.push(ImageData);
	    // this.currentIndex++;
	    ctx.putImageData(ImageData, 0, 0);
	  }
	
	  greenFilter(canvas) {
	    let ctx = canvas.getContext('2d');
	
	    let ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	    let data = ImageData.data;
	
	    for (var i = 0; i < data.length; i += 4) {
	      data[i] = 0;
	      data[i + 1] = 255;
	      data[i + 2] = 0;
	    }
	    // this.cache.push(ImageData);
	    // this.currentIndex++;
	    ctx.putImageData(ImageData, 0, 0);
	  }
	
	  sharpenFilter(canvas, scope) {
	    let filterMatrix = [0, -1, 0, -1, 5, -1, 0, -1, 0];
	    let ctx = canvas.getContext('2d');
	
	    let ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	    let data = ImageData.data;
	    let dupeData = data.slice();
	
	    for (var i = 0; i < dupeData.length; i++) {
	      let pixelMatrix = scope.calculateMatrix(i, dupeData, canvas.width);
	      let newValue = scope.filteredPixelValue(pixelMatrix, filterMatrix);
	
	      if (newValue < 0) {
	        data[i] = 0;
	      } else if (newValue > 255) {
	        data[i] = 255;
	      } else {
	        data[i] = newValue;
	      }
	    }
	
	    // this.cache.push(ImageData);
	    // this.currentIndex++;
	    ctx.putImageData(ImageData, 0, 0);
	  }
	
	  calculateMatrix(idx, data, width) {
	    let matrix = [];
	
	    if (idx - width * 4 < 0) {
	      matrix.push(data[idx - 4], data[idx], data[idx + 4]);
	    } else {
	      let offset = idx - (width * 4);
	      matrix.push(data[offset - 4], data[offset], data[offset + 4]);
	    }
	
	    matrix.push(data[idx - 4], data[idx], data[idx + 4]);
	
	    if (idx + width * 4 > data.length) {
	      matrix.push(data[idx - 4], data[idx], data[idx + 4]);
	    } else {
	      let offset = idx + (width * 4);
	      matrix.push(data[offset - 4], data[offset], data[offset + 4]);
	    }
	
	    return matrix;
	  }
	
	  filteredPixelValue(pixelMatrix, filterMatrix) {
	    let sum = 0;
	    pixelMatrix.forEach((pVal, idx) => (sum += pVal * filterMatrix[idx]));
	
	    return sum;
	  }
	
	  resetCanvas() {
	    this.currentCanvas = document.getElementById('image-canvas');
	    this.currentCtx = this.currentCanvas.getContext('2d');
	  }
	}
	
	module.exports = Filter;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map