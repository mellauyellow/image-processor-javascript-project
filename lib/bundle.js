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

	const Filter = __webpack_require__(3);
	
	class Image {
	  constructor(image) {
	    this.origImage = document.createElement("img");
	    this.origImage.file = image;
	    this.canvasEl = null;
	    this.filterOrder = [];
	    this.imageCache = [];
	    this.cacheIdx = null;
	  }
	
	  static createDropbox() {
	    let dropbox = document.getElementById('dropbox');
	
	    const dragenter = (e) => {
	      e.stopPropagation();
	      e.preventDefault();
	    };
	
	    const dragover = (e) => {
	      e.stopPropagation();
	      e.preventDefault();
	    };
	
	    const drop = (e) => {
	      e.stopPropagation();
	      e.preventDefault();
	      let dataTransfer = e.dataTransfer;
	      let files = dataTransfer.files;
	
	      Image.handleFile(files[0]);
	    };
	
	    dropbox.addEventListener("dragenter", dragenter, false);
	    dropbox.addEventListener("dragover", dragover, false);
	    dropbox.addEventListener("drop", drop, false);
	  }
	
	  static handleFile(file) {
	    let imageObject = new Image(file);
	
	    let reader = new FileReader();
	
	    reader.onload = (e) => {
	      imageObject.origImage.src = e.target.result;
	
	      imageObject.createCanvasEl();
	      imageObject.addWindowResize();
	    };
	
	    reader.readAsDataURL(file);
	  }
	
	  createCanvasEl() {
	    let $canvasDiv = $('.dynamic-canvas');
	
	    let imgDimensions = this.imageResize(0.8);
	
	    let $ctx = $('<canvas/>').attr({width: imgDimensions[0], height: imgDimensions[1], id: 'image-canvas'});
	    let c = $ctx[0].getContext('2d');
	    c.drawImage(this.origImage, 0, 0, ...imgDimensions);
	    let $dropbox = $('.dropbox-and-preview');
	
	    this.canvasEl = $ctx[0];
	    $dropbox.remove();
	    $canvasDiv.append($ctx);
	    this.buildFilterElements();
	  }
	
	  imageResize(percentage) {
	    let wWidth = window.innerWidth;
	    let wHeight = window.innerHeight;
	    let maxHeight = wHeight * percentage;
	    let maxWidth = wWidth * percentage;
	    let maxImgWidth = maxWidth;
	    let maxImgHeight = maxImgWidth * (this.origImage.height / this.origImage.width);
	
	    if (maxImgHeight > maxHeight) {
	      maxImgHeight = maxHeight;
	      maxImgWidth = maxImgHeight * (this.origImage.width / this.origImage.height);
	    }
	
	    if (maxImgWidth > this.origImage.width || maxImgHeight > this.origImage.height) {
	      return [this.origImage.width, this.origImage.height];
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
	
	  buildFilterElements() {
	    let $filterDiv = $('.filters');
	
	    let $sharpenButton = $('<button/>').html("Sharpen");
	    $sharpenButton.click(this.applyFilter(this.canvasEl, [0, -1, 0, -1, 5, -1, 0, -1, 0], 1));
	    $filterDiv.append($sharpenButton);
	
	    let $gaussianButton = $('<button/>').html("Gaussian Blur");
	    $gaussianButton.click(this.applyFilter(this.canvasEl, [1, 2, 1, 2, 4, 2, 1, 2, 1], 1/16));
	    $filterDiv.append($gaussianButton);
	
	    let $edgeButton = $('<button/>').html("Edge Detection");
	    $edgeButton.click(this.applyFilter(this.canvasEl, [-1, -1, -1, -1, 8, -1, -1, -1, -1], 1));
	    $filterDiv.append($edgeButton);
	
	    let $edgeSharpenButton = $('<button/>').html("Edge Sharpen");
	    $edgeSharpenButton.click(this.applyFilter(this.canvasEl, [1, 1, 1, 1, -7, 1, 1, 1, 1], 1));
	    $filterDiv.append($edgeSharpenButton);
	
	    let $motionButton = $('<button/>').html("Motion Blur");
	    $motionButton.click(this.applyFilter(this.canvasEl, [1, 0, 0, 0, 1, 0, 0, 0, 1], 1/3));
	    $filterDiv.append($motionButton);
	
	    let $embossButton = $('<button/>').html("Emboss");
	    $embossButton.click(this.applyFilter(this.canvasEl, [-1, -1, 0, -1, 0, 1, 0, 1, 1], 1));
	    $filterDiv.append($embossButton);
	
	    let $unsharpButton = $('<button/>').html("Unsharp");
	    $unsharpButton.click(this.applyFilter(this.canvasEl, [1, 4, 6, 4, 1, 4, 16, 24, 16, 4, 6, 24, -476, 24, 6, 4, 16, 24, 16, 4, 1, 4, 6, 4, 1], -1/256));
	    $filterDiv.append($unsharpButton);
	    // let $greyButton = $('<button/>').html("grey filter");
	    // $greyButton.click(this.applyFilter(this.greyFilter));
	    // $filterDiv.append($greyButton);
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
	
	  applyFilter(canvas, matrix, weight) {
	    return (e) => {
	      e.preventDefault();
	      let filterObject = new Filter(canvas, matrix, weight);
	      let filterData = filterObject.updateImageData();
	
	      let ctx = canvas.getContext('2d');
	      ctx.putImageData(filterData, 0, 0);
	    };
	  }
	}
	
	module.exports = Image;


/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	class Filter {
	  constructor(currentCanvas, filterMatrix, weight) {
	    this.currentCanvas = currentCanvas;
	    this.filterMatrix = filterMatrix;
	    this.weight = weight;
	  }
	
	  buildFullImgCanvas() {
	    let canvas = document.createElement('canvas');
	    canvas.width = this.imgObject.width;
	    canvas.height = this.imgObject.height;
	
	    let ctx = canvas.getContext('2d');
	
	    ctx.drawImage(this.imgObject.img, 0, 0, this.imgObject.width, this.imgObject.height);
	    return canvas;
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
	
	  updateImageData() {
	    let ctx = this.currentCanvas.getContext('2d');
	    let imageData = ctx.getImageData(0, 0, this.currentCanvas.width, this.currentCanvas.height);
	    let data = imageData.data;
	    let dupeData = data.slice();
	
	    for (var i = 0; i < dupeData.length; i++) {
	      if (i % 4 === 3) continue;
	
	      let pixelMatrix;
	      if (this.filterMatrix.length === 9) {
	        pixelMatrix = this.calculateMatrix3(i, dupeData, this.currentCanvas.width);
	      } else {
	        pixelMatrix = this.calculateMatrix5(i, dupeData, this.currentCanvas.width);
	      }
	
	      let newValue = this.filteredPixelValue(pixelMatrix, this.filterMatrix);
	
	      if (newValue < 0) {
	        data[i] = 0;
	      } else if (newValue > 255) {
	        data[i] = 255;
	      } else {
	        data[i] = newValue;
	      }
	    }
	
	    return imageData;
	  }
	
	  calculateMatrix3(idx, data, width) {
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
	
	  calculateMatrix5(idx, data, width) {
	    let matrix = [];
	
	    if (idx - width * 4 < 0) {
	      matrix.push(data[idx - 8], data[idx - 4], data[idx], data[idx + 4], data[idx + 8]);
	    } else {
	      let offset = idx - (width * 4);
	      matrix.push(data[offset - 8], data[offset - 4], data[offset], data[offset + 4], data[offset + 8]);
	    }
	
	    matrix.push(data[idx - 8], data[idx - 4], data[idx], data[idx + 4], data[idx + 8]);
	
	    if (idx + width * 4 > data.length) {
	      matrix.push(data[idx - 8], data[idx - 4], data[idx], data[idx + 4], data[idx + 8]);
	    } else {
	      let offset = idx + (width * 4);
	      matrix.push(data[offset - 8], data[offset - 4], data[offset], data[offset + 4], data[offset + 8]);
	    }
	
	    return matrix;
	  }
	
	  filteredPixelValue(pixelMatrix, filterMatrix) {
	    let sum = 0;
	    pixelMatrix.forEach((pVal, idx) => (sum += pVal * filterMatrix[idx]));
	
	    return sum * this.weight;
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