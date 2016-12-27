class Filter {
  constructor(currentCanvas, filterMatrix, weight) {
    this.currentCanvas = currentCanvas;
    this.filterMatrix = filterMatrix;
    this.weight = weight;
  }

  updateImageData() {
    let ctx = this.currentCanvas.getContext('2d');
    let imageData = ctx.getImageData(0, 0, this.currentCanvas.width, this.currentCanvas.height);
    let data = imageData.data;
    let dupeData = data.slice();

    for (var x = 0; x < this.currentCanvas.width; x++) {
      for (var y = 0; y < this.currentCanvas.height; y++) {
        let matrix = this.calculateMatrix(x, y, dupeData);

        let newRGB = this.filteredPixelRGB(matrix, this.filterMatrix);
        this.writePixel(data, newRGB, x, y);
      }
    }

    return imageData;
  }

  calculateMatrix(x, y, data) {
    let matrix = [];

    let offset = Math.floor(Math.sqrt(this.filterMatrix.length) / 2);

    for (var yOff = -1 * offset; yOff < offset + 1; yOff++) {
      for (var xOff = -1 * offset; xOff < offset + 1; xOff++) {
        let coords = this.pixelOnGridValue(x + xOff, y + yOff);
        matrix.push(this.readPixel(data, ...coords));
      }
    }

    return matrix;
  }

  filteredPixelRGB(pixelMatrix, filterMatrix) {
    let rgb = [];
    for (var i = 0; i < 3; i++) {
      let sum = 0;
      pixelMatrix.forEach((pixel, idx) => (sum += pixel[i] * filterMatrix[idx]));
      let newValue = sum * this.weight;

      if (newValue < 0) {
        newValue = 0;
      } else if (newValue > 255) {
        newValue = 255;
      }

      rgb.push(newValue);
    }

    return rgb;
  }

  unsharpMask(n) {
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
        let newRgb = origRgb.map((val, idx) => val + (val - blurredRgb[idx]) * 0.3);
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

  pixelOffGrid(x, y) {
    return (x < 0) || (x >= this.currentCanvas.width) || (y < 0) || (y >= this.currentCanvas.height);
  }

  pixelOnGridValue(x, y) {
    if (x < 0) {
      x = 0;
    } else if (x >= this.currentCanvas.width) {
      x = this.currentCanvas.width - 1;
    }

    if (y < 0) {
      y = 0;
    } else if (y >= this.currentCanvas.height) {
      y = this.currentCanvas.height - 1;
    }

    return [x, y];
  }
}

module.exports = Filter;
