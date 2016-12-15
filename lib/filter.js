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
