class Canvas {
  constructor(image, width, height) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.createCanvasEl(this.image);
  }

  updateDOMElements() {

  }

  createCanvasEl(imageEl) {
    let $canvasDiv = $('.dynamic');

    let imgDimensions = this.imageResize(imageEl.width, imageEl.height, 0.8);

    let $ctx = $('<canvas/>').attr({width: imgDimensions[0], height: imgDimensions[1]});
    let c = $ctx[0].getContext('2d');
    c.drawImage(imageEl, 0, 0, ...imgDimensions);
    let $dropbox = $('.dropbox-and-preview');
    $dropbox.remove();
    $canvasDiv.append($ctx);
  }

  imageResize(width, height, percentage) {
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

  handleWindowResize(canvas) {
    let wWidth = window.innerWidth;
    let wHeight = window.innerHeight;
  }
}

module.exports = Canvas;
