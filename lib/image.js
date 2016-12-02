class Image {
  constructor(file) {
    this.file = file;
  }

  static createDropbox() {
    const dropbox = document.getElementById('dropbox');

    const dragenter = function(e) {
      e.stopPropagation();
      e.preventDefault();
    };

    const dragover = function(e) {
      e.stopPropagation();
      e.preventDefault();
    };

    const drop = function(e) {
      e.stopPropagation();
      e.preventDefault();

      let dt = e.dataTransfer;
      let files = dt.files;

      Image.handleFile(files[0]);
    };

    dropbox.addEventListener("dragenter", dragenter, false);
    dropbox.addEventListener("dragover", dragover, false);
    dropbox.addEventListener("drop", drop, false);
  }

  static handleFile(file) {
    let img = document.createElement("img");
    img.classList.add("obj");
    img.file = file;

    let reader = new FileReader();

    reader.onload = (e) => {
        img.src = e.target.result;
        Image.canvasTest(img);
        // TODO: change canvasTest
    };

    reader.readAsDataURL(file);
  }

  static canvasTest(object) {
    let canvas = document.getElementById("canvas");
    let c = canvas.getContext('2d');
    c.drawImage(object, 0, 0, 400, 600);
  }
}

module.exports = Image;
