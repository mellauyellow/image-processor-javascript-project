const Filter = require('./filter');

class Image {
  constructor() {
    this.createDropbox();
    this.img = null;
    this.width = null;
    this.height = null;
    this.createCanvasEl = this.createCanvasEl.bind(this);
    this.addWindowResize = this.addWindowResize.bind(this);
  }

  createDropbox() {
    let dropbox = document.getElementById('dropbox');
    let that = this;

    dropbox.addEventListener("dragenter", this.dragenter, false);
    dropbox.addEventListener("dragover", this.dragover, false);
    dropbox.addEventListener("drop", this.drop(that), false);
  }

  dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  dragover(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  drop(scope) {
    return (e) => {
      e.stopPropagation();
      e.preventDefault();

      let dt = e.dataTransfer;
      let files = dt.files;

      scope.handleFile(files[0]);
    };
  }

  handleFile(file) {
    this.img = document.createElement("img");
    this.img.file = file;

    let reader = new FileReader();

    reader.onload = (e) => {
      this.img.src = e.target.result;
      this.width = this.img.width;
      this.height = this.img.height;

      this.createCanvasEl(this.img);
      new Filter(document.getElementById('image-canvas'));
      this.addWindowResize();
    };

    reader.readAsDataURL(file);
  }

  createCanvasEl() {
    let $canvasDiv = $('.dynamic-canvas');

    let imgDimensions = this.imageResize(0.8);

    let $ctx = $('<canvas/>').attr({width: imgDimensions[0], height: imgDimensions[1], id: 'image-canvas'});
    let c = $ctx[0].getContext('2d');
    c.drawImage(this.img, 0, 0, ...imgDimensions);
    let $dropbox = $('.dropbox-and-preview');
    $dropbox.remove();
    $canvasDiv.append($ctx);
  }

  imageResize(percentage) {
    let wWidth = window.innerWidth;
    let wHeight = window.innerHeight;
    let maxHeight = wHeight * percentage;
    let maxWidth = wWidth * percentage;
    let maxImgWidth = maxWidth;
    let maxImgHeight = maxImgWidth * (this.height / this.width);

    if (maxImgHeight > maxHeight) {
      maxImgHeight = maxHeight;
      maxImgWidth = maxImgHeight * (this.width / this.height);
    }

    if (maxImgWidth > this.width || maxImgHeight > this.height) {
      return [this.width, this.height];
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
}

module.exports = Image;
