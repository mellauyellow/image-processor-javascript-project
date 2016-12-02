class Canvas {
  constuctor(image, el) {
    this.image = image;
    this.el = el;
  }

  static createCanvasEl(imageEl) {
    let $ctx = $('<canvas/>');
    let $canvasDiv = $('.dynamic');
    $canvasDiv.append($ctx);
  }
}

module.exports = Canvas;
