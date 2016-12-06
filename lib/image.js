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
    let img = document.createElement("img");
    this.img = img;
    this.width = img.width;
    this.height = img.height;
    img.file = file;

    let reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
      this.createCanvasEl(this.img);
      this.addWindowResize();
    };

    reader.readAsDataURL(file);
  }

  createCanvasEl(imageEl) {
    let $canvasDiv = $('.dynamic-canvas');

    let imgDimensions = this.imageResize(imageEl.width, imageEl.height, 0.8);

    let $ctx = $('<canvas/>').attr({width: imgDimensions[0], height: imgDimensions[1], class: 'image-canvas'});
    let c = $ctx[0].getContext('2d');
    c.drawImage(imageEl, 0, 0, ...imgDimensions);
    let $dropbox = $('.dropbox-and-preview');
    $dropbox.remove();
    $canvasDiv.append($ctx);
    new Filter($('.image-canvas'));
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

  addWindowResize() {
    $(window).resize(() => {
      let $canvasDiv = $('.image-canvas');
      $canvasDiv.remove();
      this.createCanvasEl(this.img);
    });
  }
}

module.exports = Image;
