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
    this.redFilter = this.redFilter.bind(this);
    this.resetCanvas = this.resetCanvas.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.downloadImage = this.downloadImage.bind(this);
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
    let $redButton = $('<button/>').html("red filter");

    $redButton.click(this.applyFilter(this.redFilter));

    $filterDiv.append($redButton);
  }

  buildUtilityElements() {
    let $utilityDiv = $('.utilities');
    let $testButton = $('<a/>').html("utility test").attr({href: "#"});
    let that = this;

    $testButton.click(
      function() {
        that.downloadImage(this, 'canvas.jpg');
      });

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
      filter(this.currentCanvas);
      this.filterOrder.push(filter);
    };
  }

  redFilter(canvas) {
    let ctx = canvas.getContext('2d');

    let ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = ImageData.data;

    for (var i = 0; i < data.length; i += 4) {
      data[i] = 255;
      data[i + 1] = 0;
      data[i + 2] = 0;
    }
    // this.cache.push(ImageData);
    // this.currentIndex++;
    ctx.putImageData(ImageData, 0, 0);
  }

  resetCanvas() {
    this.currentCanvas = document.getElementById('image-canvas');
    this.currentCtx = this.currentCanvas.getContext('2d');
  }
}

module.exports = Filter;
