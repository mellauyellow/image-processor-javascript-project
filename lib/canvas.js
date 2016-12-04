class Canvas {
  constuctor(image, el, width, height) {
    this.image = image;
    this.el = el;
    this.width = width;
    this.height = height;
  }

  static createCanvasEl(imageEl) {
    let $canvasDiv = $('.dynamic');

    let imgDimensions = Canvas.imageResize(imageEl.width, imageEl.height, 0.8);

    let $ctx = $('<canvas/>').attr({width: imgDimensions[0], height: imgDimensions[1]});
    let c = $ctx[0].getContext('2d');
    c.drawImage(imageEl, 0, 0, ...imgDimensions);

    $canvasDiv.append($ctx);
  }

  static imageResize(width, height, percentage) {
    let wWidth = window.innerWidth;
    let wHeight = window.innerHeight;
    let maxHeight = wHeight * percentage;
    let maxWidth = wWidth * percentage;
    let maxImgWidth = maxWidth;
    let maxImgHeight = maxImgWidth * (height / width);

    if (maxImgHeight > maxHeight) {
      maxImgHeight = maxHeight;
      maxImgWidth = maxImgHeight * (width / height);
    }

    return [maxImgWidth, maxImgHeight];
  }

  static handleWindowResize(canvas) {
    let wWidth = window.innerWidth;
    let wHeight = window.innerHeight;
  }
}

module.exports = Canvas;
