class Canvas {
  constuctor(image, el) {
    this.image = image;
    this.el = el;
  }

  static createCanvasEl(imageEl) {
    let $canvasDiv = $('.dynamic');
    let imgDimensions = Canvas.imageResize(imageEl.width, imageEl.height, 0.25);
    // console.log(imgDimensions);

    let $ctx = $('<canvas/>').attr({width: imgDimensions[0], height: imgDimensions[1]});
    let c = $ctx[0].getContext('2d');
    c.drawImage(imageEl, 0, 0, ...imgDimensions);

    $canvasDiv.append($ctx);
  }

  static imageResize(width, height, percentage) {
    return [width * percentage, height * percentage];
  }
}

module.exports = Canvas;
