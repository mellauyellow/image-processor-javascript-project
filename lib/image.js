const Filter = require('./filter');

class Image {
  constructor(image) {
    this.origImage = document.createElement("img");
    this.origImage.file = image;
    this.canvasEl = null;
    this.filterOrder = [];
    this.imageCache = [];
    this.cacheIdx = null;
    // this.currentImg = null;
    // this.createCanvasEl = this.createCanvasEl.bind(this);
    // this.addWindowResize = this.addWindowResize.bind(this);
    // this.handleFile = this.handleFile.bind(this);
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
    let $greyButton = $('<button/>').html("grey filter");
    let $sharpenButton = $('<button/>').html("sharpen filter");

    // $greyButton.click(this.applyFilter(this.greyFilter));
    $sharpenButton.click(this.applyFilter(this.canvasEl, [0, -1, 0, -1, 5, -1, 0, -1, 0], 1));

    // $filterDiv.append($greyButton);
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

  applyFilter(canvas, matrix, weight) {
    return (e) => {
      e.preventDefault();
      let filterObject = new Filter(canvas, matrix, weight);
      let filterData = filterObject.newSharpenFilter();
      
      let ctx = canvas.getContext('2d');
      ctx.putImageData(filterData, 0, 0);
    };
  }
}

module.exports = Image;
