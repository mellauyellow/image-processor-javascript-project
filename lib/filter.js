class Filter {
  constructor(currentCanvas, filterMatrix, weight) {
    this.currentCanvas = currentCanvas;
    this.filterMatrix = filterMatrix;
    this.weight = weight;
    // this.newSharpenFilter();
    // this.buildFilterElements();
    // this.buildUtilityElements();
    // this.greyFilter = this.greyFilter.bind(this);
    // this.greenFilter = this.greenFilter.bind(this);
    // this.resetCanvas = this.resetCanvas.bind(this);
    // this.applyFilter = this.applyFilter.bind(this);
    // this.downloadImage = this.downloadImage.bind(this);
    // this.sharpenFilter = this.sharpenFilter.bind(this);
    // this.calculateMatrix = this.calculateMatrix.bind(this);
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

  newSharpenFilter() {
    let ctx = this.currentCanvas.getContext('2d');
    let imageData = ctx.getImageData(0, 0, this.currentCanvas.width, this.currentCanvas.height);
    let data = imageData.data;
    let dupeData = data.slice();

    for (var i = 0; i < dupeData.length; i++) {
      let pixelMatrix = this.calculateMatrix(i, dupeData, this.currentCanvas.width);
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
