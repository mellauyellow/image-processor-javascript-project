class Image {
  constructor(file) {
    this.file = file;
  }

  makeThumbnail(width, height) {

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
    let preview = document.getElementById("preview");
    preview.appendChild(img);

    let reader = new FileReader();
    reader.onload = ((aImg) => {
      return (e) => {
        aImg.src = e.target.result;
      };
    })(img);
    reader.readAsDataURL(file);
  }
}

module.exports = Image;
