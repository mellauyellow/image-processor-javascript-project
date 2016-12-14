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

	const Filter = __webpack_require__(2);
	
	const matrices = {
	  "Sharpen" : [[0, -1, 0, -1, 5, -1, 0, -1, 0], 1],
	  "Gaussian Blur" : [[1, 2, 1, 2, 4, 2, 1, 2, 1], 1/16],
	  "Edge Detection" : [[-1, -1, -1, -1, 8, -1, -1, -1, -1], 1],
	  "Edge Sharpen" : [[1, 1, 1, 1, -7, 1, 1, 1, 1], 1],
	  "Motion Blur" : [[1, 0, 0, 0, 1, 0, 0, 0, 1], 1/3],
	  "Emboss" : [[-1, -1, 0, -1, 0, 1, 0, 1, 1], 1],
	  "Unsharp" : [[1, 4, 6, 4, 1, 4, 16, 24, 16, 4, 6, 24, -476, 24, 6, 4, 16, 24, 16, 4, 1, 4, 6, 4, 1], -1/256]
	};
	
	class Image {
	  constructor(image) {
	    this.origImage = document.createElement("img");
	    this.origImage.file = image;
	    this.canvasEl = null;
	    this.filterOrder = [];
	    this.imageCache = [];
	    this.cacheIdx = 0;
	    this.filterIdx = 0;
	    this.fullImgCanvas = null;
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
	      // imageObject.addWindowResize();
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
	    this.imageCache.push(c.getImageData(0, 0, this.canvasEl.width, this.canvasEl.height));
	    this.filterOrder.push(null);
	    $dropbox.remove();
	    $canvasDiv.append($ctx);
	    this.buildFilterElements();
	    this.buildUtilityElements();
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
	
	    let sharpen = "Sharpen";
	    let $sharpenButton = $('<button/>').html(sharpen);
	    $sharpenButton.click(this.applyFilter(this.canvasEl, matrices[sharpen][0], matrices[sharpen][1]));
	    $filterDiv.append($sharpenButton);
	
	    let gaussian = "Gaussian Blur";
	    let $gaussianButton = $('<button/>').html(gaussian);
	    $gaussianButton.click(this.applyFilter(this.canvasEl, matrices[gaussian][0], matrices[gaussian][1]));
	    $filterDiv.append($gaussianButton);
	
	    let edgeDet = "Edge Detection";
	    let $edgeButton = $('<button/>').html(edgeDet);
	    $edgeButton.click(this.applyFilter(this.canvasEl, matrices[edgeDet][0], matrices[edgeDet][1]));
	    $filterDiv.append($edgeButton);
	
	    let edgeSharp = "Edge Sharpen";
	    let $edgeSharpenButton = $('<button/>').html(edgeSharp);
	    $edgeSharpenButton.click(this.applyFilter(this.canvasEl, matrices[edgeSharp][0], matrices[edgeSharp][1]));
	    $filterDiv.append($edgeSharpenButton);
	
	    let motion = "Motion Blur";
	    let $motionButton = $('<button/>').html(motion);
	    $motionButton.click(this.applyFilter(this.canvasEl, matrices[motion][0], matrices[motion][1]));
	    $filterDiv.append($motionButton);
	
	    let emboss = "Emboss";
	    let $embossButton = $('<button/>').html(emboss);
	    $embossButton.click(this.applyFilter(this.canvasEl, matrices[emboss][0], matrices[emboss][1]));
	    $filterDiv.append($embossButton);
	
	    let unsharp = "Unsharp";
	    let $unsharpButton = $('<button/>').html(unsharp);
	    $unsharpButton.click(this.applyFilter(this.canvasEl, matrices[unsharp][0], matrices[unsharp][1]));
	    $filterDiv.append($unsharpButton);
	
	    let $megaBlurButton = $('<button/>').html("Unsharp + Mask");
	    $megaBlurButton.click(this.applyFilter(this.canvasEl));
	    $filterDiv.append($megaBlurButton);
	    // let $greyButton = $('<button/>').html("grey filter");
	    // $greyButton.click(this.applyFilter(this.greyFilter));
	    // $filterDiv.append($greyButton);
	  }
	
	  buildUtilityElements() {
	    let $utilityDiv = $('.utilities');
	
	    let saveLink = document.createElement('a');
	    saveLink.innerHTML = "Save";
	    saveLink.href = "#";
	
	    saveLink.addEventListener('click', () => {
	      this.buildFullImgCanvas();
	      this.downloadImage('canvas.jpg');
	    });
	
	    let $undoButton = $('<button/>').html("Undo");
	    $undoButton.click(() => {
	      this.undoOperation();
	    });
	
	    let $redoButton = $('<button/>').html("Redo");
	    $redoButton.click(() => {
	      this.redoOperation();
	    });
	
	    $utilityDiv.append(saveLink, $undoButton, $redoButton);
	  }
	
	  downloadImage(filename) {
	    let canvas = this.fullImgCanvas;
	    canvas.toBlob((blob) => {
	      let saveLink = document.createElement('a');
	      saveLink.href = URL.createObjectURL(blob);
	      saveLink.download = filename;
	      var clickEvent = new MouseEvent("click", {
	          "view": window,
	          "bubbles": true,
	          "cancelable": false
	      });
	
	      saveLink.dispatchEvent(clickEvent);
	    }, "image/jpeg", 1);
	  }
	
	  applyFilter(canvas, matrix, weight) {
	    return (e) => {
	      e.preventDefault();
	      let filterObject = new Filter(canvas, matrix, weight);
	      let filterData;
	
	      if (matrix) {
	        filterData = filterObject.updateImageData();
	      } else {
	        filterData = filterObject.megaBlur(80);
	      }
	
	      let ctx = canvas.getContext('2d');
	      ctx.putImageData(filterData, 0, 0);
	      this.updateOrder(filterData, filterObject);
	    };
	  }
	
	  undoOperation() {
	    let ctx = this.canvasEl.getContext('2d');
	
	    if (this.cacheIdx > 0) {
	      ctx.putImageData(this.imageCache[this.cacheIdx - 1], 0, 0);
	      this.cacheIdx -= 1;
	      this.filterIdx -= 1;
	    }
	    console.log(this.cacheIdx);
	  }
	
	  redoOperation() {
	    let ctx = this.canvasEl.getContext('2d');
	
	    if (this.cacheIdx < this.imageCache.length - 1) {
	      ctx.putImageData(this.imageCache[this.cacheIdx + 1], 0, 0);
	      this.cacheIdx += 1;
	      this.filterIdx += 1;
	    }
	    console.log(this.cacheIdx);
	  }
	
	  updateOrder(imageData, filterObject) {
	    let newCache = this.imageCache.slice(0, this.cacheIdx + 1);
	    newCache.push(imageData);
	    this.cacheIdx += 1;
	    this.imageCache = newCache;
	
	    if (this.imageCache.length > 4) {
	      this.imageCache.shift();
	      this.cacheIdx -= 1;
	    }
	
	    // if (this.cacheIdx === null) {
	    //   this.cacheIdx = 0;
	    // } else {
	    //   this.cacheIdx += 1;
	    // }
	
	    let newFilterOrder = this.filterOrder.slice(0, this.filterIdx + 1);
	    newFilterOrder.push(filterObject);
	    this.filterOrder = newFilterOrder;
	    this.filterIdx += 1;
	
	    console.log(this.cacheIdx);
	    console.log(this.filterOrder);
	  }
	
	  buildFullImgCanvas() {
	    let $canvas = $('<canvas/>').attr({width: this.origImage.width, height: this.origImage.height});
	    this.fullImgCanvas = $canvas[0];
	    let ctx = this.fullImgCanvas.getContext('2d');
	    ctx.drawImage(this.origImage, 0, 0);
	
	    this.filterOrder.forEach((filter, idx) => {
	      if (idx === 0) return;
	      filter.currentCanvas = this.fullImgCanvas;
	      let filterData;
	      if (filter.filterMatrix) {
	        filterData = filter.updateImageData();
	      } else {
	        filterData = filter.megaBlur(80);
	      }
	
	      ctx.putImageData(filterData, 0, 0);
	    });
	  }
	}
	
	module.exports = Image;


/***/ },
/* 2 */
/***/ function(module, exports) {

	class Filter {
	  constructor(currentCanvas, filterMatrix, weight) {
	    this.currentCanvas = currentCanvas;
	    this.filterMatrix = filterMatrix;
	    this.weight = weight;
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
	
	  megaBlur(n) {
	    let ctx = this.currentCanvas.getContext('2d');
	    let imageData = ctx.getImageData(0, 0, this.currentCanvas.width, this.currentCanvas.height);
	    let data = imageData.data;
	    let origData = data.slice();
	    let dupeData = data.slice();
	
	    for (var x = 0; x < this.currentCanvas.width; x++) {
	      for (var y = 0; y < this.currentCanvas.height; y++) {
	        let neighbors = this.getVertNeighbors(dupeData, n, x, y);
	        let sum = neighbors.reduce((rgb, accum) => {
	          return [rgb[0] + accum[0], rgb[1] + accum[1], rgb[2] + accum[2]];
	        });
	        let averages = sum.map((value) => (Math.floor(value / neighbors.length)));
	        this.writePixel(data, averages, x, y);
	      }
	    }
	
	    dupeData = data.slice();
	    for (var x = 0; x < this.currentCanvas.width; x++) {
	      for (var y = 0; y < this.currentCanvas.height; y++) {
	        let neighbors = this.getHorNeighbors(dupeData, n, x, y);
	        let sum = neighbors.reduce((rgb, accum) => {
	          return [rgb[0] + accum[0], rgb[1] + accum[1], rgb[2] + accum[2]];
	        });
	        let averages = sum.map((value) => (Math.floor(value / neighbors.length)));
	        this.writePixel(data, averages, x, y);
	      }
	    }
	
	    for (var x = 0; x < this.currentCanvas.width; x++) {
	      for (var y = 0; y < this.currentCanvas.height; y++) {
	        let blurredRgb = this.readPixel(data, x, y);
	        let origRgb = this.readPixel(origData, x, y);
	        let newRgb = origRgb.map((val, idx) => val + (val - blurredRgb[idx]) * 0.2);
	        this.writePixel(data, newRgb, x, y);
	      }
	    }
	
	    return imageData;
	  }
	
	  getVertNeighbors(data, n, x, y) {
	    let neighbors = [];
	    for (var i = Math.max(y - Math.floor(n / 2), 0); i < Math.min(y + Math.floor(n / 2), this.currentCanvas.height - 1); i++) {
	      neighbors.push(this.readPixel(data, x, i));
	    }
	
	    return neighbors;
	  }
	
	  getHorNeighbors(data, n, x, y) {
	    let neighbors = [];
	    for (var i = Math.max(x - Math.floor(n / 2), 0); i < Math.min(x + Math.floor(n / 2), this.currentCanvas.width - 1); i++) {
	      neighbors.push(this.readPixel(data, i, y));
	    }
	
	    return neighbors;
	  }
	
	  readPixel(imageData, x, y) {
	    let i = (y * this.currentCanvas.width + x) * 4;
	    return [imageData[i], imageData[i + 1], imageData[i + 2]];
	  }
	
	  writePixel(imageData, pixelValues, x, y) {
	    let [r, g, b] = pixelValues;
	    let i = (y * this.currentCanvas.width + x) * 4;
	
	    imageData[i] = r;
	    imageData[i + 1] = g;
	    imageData[i + 2] = b;
	  }
	}
	
	module.exports = Filter;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map