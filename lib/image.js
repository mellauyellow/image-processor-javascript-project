const Filter = require('./filter');

const matrices = {
  "Sharpen" : [[0, -1, 0, -1, 5, -1, 0, -1, 0], 1],
  "Gaussian Blur" : [[1, 2, 1, 2, 4, 2, 1, 2, 1], 1/16],
  "Edge Detection" : [[-1, -1, -1, -1, 8, -1, -1, -1, -1], 1],
  "Edge Sharpen" : [[1, 1, 1, 1, -7, 1, 1, 1, 1], 1],
  // "Motion Blur" : [[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], 1/5],
  "Motion Blur" : [[1, 0, 0, 0, 1, 0, 0, 0, 1], 1/3],
  "Emboss" : [[-1, -1, 0, -1, 0, 1, 0, 1, 1], 1],
  "Unsharp" : [[1, 4, 6, 4, 1, 4, 16, 24, 16, 4, 6, 24, -476, 24, 6, 4, 16, 24, 16, 4, 1, 4, 6, 4, 1], -1/256]
};

class Image {
  constructor(image) {
    this.origImage = document.createElement("img");
    this.origImage.file = image;
    this.canvasEl = null;
    this.filterOrder = [];
    this.imageCache = [];
    this.cacheIdx = 0;
    this.filterIdx = 0;
    this.fullImgCanvas = null;
    this.clearScreen = this.clearScreen.bind(this);
  }

  static createDropbox() {
    let dropbox = document.getElementById('dropbox');

    let $fileInput = $('#file-chooser');

    $fileInput.change(function() {
      Image.handleFile(this.files[0]);
    });

    const dragenter = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };

    const dragover = (e) => {
      e.stopPropagation();
      e.preventDefault();
    };

    const drop = (e) => {
      e.stopPropagation();
      e.preventDefault();
      let dataTransfer = e.dataTransfer;
      let files = dataTransfer.files;

      Image.handleFile(files[0]);
    };

    dropbox.addEventListener("dragenter", dragenter, false);
    dropbox.addEventListener("dragover", dragover, false);
    dropbox.addEventListener("drop", drop, false);
  }

  static handleFile(file) {
    let imageObject = new Image(file);

    let reader = new FileReader();

    reader.onload = (e) => {
      imageObject.origImage.src = e.target.result;

      imageObject.createCanvasEl();
      // imageObject.addWindowResize();
    };

    reader.readAsDataURL(file);
  }

  createCanvasEl() {
    let $canvasDiv = $('.dynamic-canvas');

    let imgDimensions = this.imageResize(0.7);

    let $ctx = $('<canvas/>').attr({width: imgDimensions[0], height: imgDimensions[1], id: 'image-canvas'});
    let c = $ctx[0].getContext('2d');
    c.drawImage(this.origImage, 0, 0, ...imgDimensions);

    this.canvasEl = $ctx[0];
    this.imageCache.push(c.getImageData(0, 0, this.canvasEl.width, this.canvasEl.height));
    this.filterOrder.push(null);
    $('#dropbox').toggle();
    $canvasDiv.append($ctx);
    this.buildFilterElements();
    this.buildUtilityElements();
  }

  imageResize(percentage) {
    let wWidth = window.innerWidth;
    let wHeight = window.innerHeight;
    let maxHeight = wHeight * percentage;
    let maxWidth = wWidth * percentage;
    let maxImgWidth = maxWidth;
    let maxImgHeight = maxImgWidth * (this.origImage.height / this.origImage.width);

    if (maxImgHeight > maxHeight) {
      maxImgHeight = maxHeight;
      maxImgWidth = maxImgHeight * (this.origImage.width / this.origImage.height);
    }

    if (maxImgWidth > this.origImage.width || maxImgHeight > this.origImage.height) {
      return [this.origImage.width, this.origImage.height];
    }

    return [maxImgWidth, maxImgHeight];
  }

  // addWindowResize() {
  //   $(window).resize(() => {
  //     let $canvasDiv = $('#image-canvas');
  //     $canvasDiv.remove();
  //     this.createCanvasEl();
  //   });
  // }

  buildFilterElements() {
    let $filterDiv = $('.filter-buttons');

    let $header = $('<h5/>').html("Filters:");

    let sharpen = "Sharpen";
    let $sharpenDiv = $('<div/>').attr('class', 'sharpen');
    let $sharpenLabel = $('<h6/>').html(sharpen);
    let $sharpenIcon = $('<img/>').attr('src', 'http://res.cloudinary.com/mellauyellow/image/upload/c_scale,q_auto:best,w_25/v1482275242/eye_y11iyk.png');
    $sharpenDiv.append($sharpenIcon, $sharpenLabel);
    $sharpenDiv.click(this.applyFilter(this.canvasEl, matrices[sharpen][0], matrices[sharpen][1]));

    let gaussian = "Gaussian Blur";
    let $gaussianDiv = $('<div/>').attr('class', 'gaussian');
    let $gaussianLabel = $('<h6/>').html(gaussian);
    let $gaussianIcon = $('<img/>').attr('src', 'http://res.cloudinary.com/mellauyellow/image/upload/c_scale,q_auto:best,w_25/v1482275242/eye-1_ujhtbw.png');
    $gaussianDiv.append($gaussianIcon, $gaussianLabel);
    $gaussianDiv.click(this.applyFilter(this.canvasEl, matrices[gaussian][0], matrices[gaussian][1]));

    let edgeDet = "Edge Detection";
    let $edgeDetDiv = $('<div/>').attr('class', 'edge-detection');
    let $edgeDetLabel = $('<h6/>').html(edgeDet);
    let $edgeDetIcon = $('<img/>').attr('src', 'http://res.cloudinary.com/mellauyellow/image/upload/c_scale,q_auto:best,w_25/v1482275304/pantone_jxpyuc.png');
    $edgeDetDiv.append($edgeDetIcon, $edgeDetLabel);
    $edgeDetDiv.click(this.applyFilter(this.canvasEl, matrices[edgeDet][0], matrices[edgeDet][1]));

    let edgeSharp = "Edge Sharpen";
    let $edgeSharpDiv = $('<div/>').attr('class', 'edge-sharp');
    let $edgeSharpLabel = $('<h6/>').html(edgeSharp);
    let $edgeSharpIcon = $('<img/>').attr('src', 'http://res.cloudinary.com/mellauyellow/image/upload/c_scale,q_auto:best,w_25/v1482275073/cutter_l9hoqz.png');
    $edgeSharpDiv.append($edgeSharpIcon, $edgeSharpLabel);
    $edgeSharpDiv.click(this.applyFilter(this.canvasEl, matrices[edgeSharp][0], matrices[edgeSharp][1]));

    let motion = "Motion Blur";
    let $motionDiv = $('<div/>').attr('class', 'motion');
    let $motionLabel = $('<h6/>').html(motion);
    let $motionIcon = $('<img/>').attr('src', 'http://res.cloudinary.com/mellauyellow/image/upload/c_scale,q_auto:best,w_25/v1482273597/blur_prgwoa.png');
    $motionDiv.append($motionIcon, $motionLabel);
    $motionDiv.click(this.applyFilter(this.canvasEl, matrices[motion][0], matrices[motion][1]));

    let emboss = "Emboss";
    let $embossDiv = $('<div/>').attr('class', 'emboss');
    let $embossLabel = $('<h6/>').html(emboss);
    let $embossIcon = $('<img/>').attr('src', 'http://res.cloudinary.com/mellauyellow/image/upload/c_scale,q_auto:best,w_25/v1482275641/stamp_l6fycv.png');
    $embossDiv.append($embossIcon, $embossLabel);
    $embossDiv.click(this.applyFilter(this.canvasEl, matrices[emboss][0], matrices[emboss][1]));

    let unsharp = "Unsharp";
    let $unsharpDiv = $('<div/>').attr('class', 'unsharp');
    let $unsharpLabel = $('<h6/>').html(unsharp);
    let $unsharpIcon = $('<img/>').attr('src', 'http://res.cloudinary.com/mellauyellow/image/upload/c_scale,q_auto:best,w_25/v1482275772/art_jftnnb.png');
    $unsharpDiv.append($unsharpIcon, $unsharpLabel);
    $unsharpDiv.click(this.applyFilter(this.canvasEl, matrices[unsharp][0], matrices[unsharp][1]));

    let unsharpMask = "Unsharp Mask";
    let $unsharpMaskDiv = $('<div/>').attr('class', 'unsharp-mask');
    let $unsharpMaskLabel = $('<h6/>').html(unsharpMask);
    let $unsharpMaskIcon = $('<img/>').attr('src', 'http://res.cloudinary.com/mellauyellow/image/upload/c_scale,q_auto:best,w_25/v1482275255/layers_lbzey0.png');
    $unsharpMaskDiv.append($unsharpMaskIcon, $unsharpMaskLabel);
    $unsharpMaskDiv.click(this.applyFilter(this.canvasEl));

    $filterDiv.append($sharpenDiv, $gaussianDiv, $edgeDetDiv, $edgeSharpDiv, $motionDiv, $embossDiv, $unsharpDiv, $unsharpMaskDiv);
    // let $greyButton = $('<button/>').html("grey filter");
    // $greyButton.click(this.applyFilter(this.greyFilter));
    // $filterDiv.append($greyButton);
  }

  applyFilter(canvas, matrix, weight) {
    return (e) => {
      $("button").prop('disabled', true);
      $(".spinner-filters").css('visibility','visible');

      e.preventDefault();

      setTimeout(() => {
        let filterObject = new Filter(canvas, matrix, weight);
        let filterData;

        if (matrix) {
          filterData = filterObject.updateImageData();
        } else {
          filterData = filterObject.megaBlur(80);
        }

        let ctx = canvas.getContext('2d');
        ctx.putImageData(filterData, 0, 0);
        this.updateOrder(filterData, filterObject);
        $("button").prop('disabled', false);
        $(".spinner-filters").css('visibility','hidden');

      }, 1000);
    };
  }

  buildUtilityElements() {
    let $utilityDiv = $('.utility-buttons');

    let $downloadDiv = $('<div/>').attr('class', 'download');
    let $downloadLabel = $('<h6/>').html("Download");
    let $downloadIcon = $('<i/>').attr('class', 'flaticon-download-1');
    $downloadDiv.append($downloadIcon, $downloadLabel);
    // let saveLink = document.createElement('a');
    // saveLink.innerHTML = "Save";
    // saveLink.href = "#";

    $downloadDiv.click(() => {
      $('.download-processing').css('visibility', 'visible');

      setTimeout(() => {
        this.buildFullImgCanvas();
        this.downloadImage('canvas.jpg');
      }, 1000);
    });

    let $undoDiv = $('<div/>').attr('class', 'undo');
    let $undoLabel = $('<h6/>').html("Undo");
    let $undoIcon = $('<i/>').attr('class', 'flaticon-undo');
    $undoDiv.append($undoIcon, $undoLabel);
    $undoDiv.click(() => {
      this.undoOperation();
    });

    let $redoDiv = $('<div/>').attr('class', 'redo');
    let $redoLabel = $('<h6/>').html("Redo");
    let $redoIcon = $('<i/>').attr('class', 'flaticon-redo');
    $redoDiv.append($redoIcon, $redoLabel);
    $redoDiv.click(() => {
      this.redoOperation();
    });

    let $restartDiv = $('<div/>').attr('class', 'restart');
    let $restartLabel = $('<h6/>').html("Start Over");
    let $restartIcon = $('<i/>').attr('class', 'flaticon-power-button');
    $restartDiv.append($restartIcon, $restartLabel);
    $restartDiv.click(this.handleStartOver.bind(this));

    $utilityDiv.append($downloadDiv, $undoDiv, $redoDiv, $restartDiv);
  }

  downloadImage(filename) {
    let canvas = this.fullImgCanvas;

    canvas.toBlob((blob) => {
      let saveLink = document.createElement('a');
      saveLink.href = URL.createObjectURL(blob);
      saveLink.download = filename;
      var clickEvent = new MouseEvent("click", {
          "view": window,
          "bubbles": true,
          "cancelable": false
      });

      $('.download-processing').css('visibility', 'hidden');
      saveLink.dispatchEvent(clickEvent);
      this.handleStartOver();
    }, "image/jpeg", 1.0);
  }

  handleStartOver() {
    $('.new-image-button').unbind('click', this.newStart);
    $('.new-image-button').bind('click', this.newStart);

    $('.same-image-button').unbind('click', this.sameStart(this));
    $('.same-image-button').bind('click', this.sameStart(this));

    $('.cancel').unbind('click', this.clearStartOver);
    $('.cancel').bind('click', this.clearStartOver);

    $('.start-over').css('visibility', 'visible');
  }

  clearStartOver() {
    $('.start-over').css('visibility', 'hidden');
  }

  newStart() {
    $('.download-processing').css('visibility', 'hidden');
    $('.start-over').css('visibility', 'hidden');
    $('#image-canvas').remove();
    $('.filter-buttons').empty();
    $('.utility-buttons').empty();
    $('#dropbox').toggle();
  }

  sameStart(scope) {
    return () => {
      scope.newStart();

      this.filterOrder = [];
      this.imageCache = [];
      this.cacheIdx = 0;
      this.filterIdx = 0;

      scope.createCanvasEl();
    };
  }

  clearScreen() {
    $('.download-processing').css('visibility', 'hidden');
    $('.start-over').css('visibility', 'hidden');
    $('#image-canvas').remove();
    $('.filter-buttons').empty();
    $('.utility-buttons').empty();
  }

  undoOperation() {
    let ctx = this.canvasEl.getContext('2d');

    if (this.cacheIdx > 0) {
      ctx.putImageData(this.imageCache[this.cacheIdx - 1], 0, 0);
      this.cacheIdx -= 1;
      this.filterIdx -= 1;
    }
  }

  redoOperation() {
    let ctx = this.canvasEl.getContext('2d');

    if (this.cacheIdx < this.imageCache.length - 1) {
      ctx.putImageData(this.imageCache[this.cacheIdx + 1], 0, 0);
      this.cacheIdx += 1;
      this.filterIdx += 1;
    }
  }

  updateOrder(imageData, filterObject) {
    let newCache = this.imageCache.slice(0, this.cacheIdx + 1);
    newCache.push(imageData);
    this.cacheIdx += 1;
    this.imageCache = newCache;

    if (this.imageCache.length > 4) {
      this.imageCache.shift();
      this.cacheIdx -= 1;
    }

    let newFilterOrder = this.filterOrder.slice(0, this.filterIdx + 1);
    newFilterOrder.push(filterObject);
    this.filterOrder = newFilterOrder;
    this.filterIdx += 1;
  }

  buildFullImgCanvas() {
    let $canvas = $('<canvas/>').attr({width: this.origImage.width, height: this.origImage.height});
    this.fullImgCanvas = $canvas[0];
    let ctx = this.fullImgCanvas.getContext('2d');
    ctx.drawImage(this.origImage, 0, 0);

    for (var i = 0; i <= this.filterIdx; i++) {
      if (i === 0) continue;

      let filter = this.filterOrder[i];
      filter.currentCanvas = this.fullImgCanvas;

      let filterData;

      if (filter.filterMatrix) {
        filterData = filter.updateImageData();
      } else {
        filterData = filter.megaBlur(80);
      }

      ctx.putImageData(filterData, 0, 0);
    }
  }
}

module.exports = Image;
