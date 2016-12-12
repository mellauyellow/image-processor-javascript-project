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
}

module.exports = Filter;
