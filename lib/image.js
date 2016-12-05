const Canvas = require('./canvas');

class Image {
  constructor() {
    this.createDropbox();
    this.img = null;
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
    img.classList.add("obj");
    img.file = file;

    let reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
      let width = img.width;
      let height = img.height;
      let canvas = new Canvas(img, width, height);
    };

    reader.readAsDataURL(file);
  }
}

module.exports = Image;
