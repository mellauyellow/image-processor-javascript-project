const Filter = require('./filter');

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
      this.updateOrder(filterData, filterObject);
    };
  }

  updateOrder(imageData, filterObject) {
    // let newCache = this.imageCache.slice(0, this.currentIndex + 1);

    this.imageCache.push(imageData);

    if (this.cacheIdx === null) {
      this.cacheIdx = 0;
    } else {
      this.cacheIdx += 1;
    }

    this.filterOrder.push(filterObject);

    if (this.imageCache.length > 4) {
      this.imageCache.shift();
      this.cacheIdx -= 1;
    }

    console.log(this.cacheIdx);
  }
}

module.exports = Image;
