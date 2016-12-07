class Filter {
  constructor(canvas) {
    this.canvas = canvas;
    this.cache = [];
    this.currentVersion = null;
    this.buildFilterElements();
    this.buildUtilityElements();
    this.gaussianBlur = this.gaussianBlur.bind(this);
  }

  buildFilterElements() {
    let $filterDiv = $('.filters');
    let $testButton = $('<button/>').html("filter test");

    $testButton.click(this.gaussianBlur.bind(this));

    $filterDiv.append($testButton);
  }

  buildUtilityElements() {
    let $utilityDiv = $('.utilities');
    let $testButton = $('<button/>').html("utility test");

    $utilityDiv.append($testButton);
  }

  gaussianBlur() {
    let ctx = this.canvas.getContext('2d');
    let myImageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    let data = myImageData.data;

    for (var i = 0; i < data.length; i += 4) {
      data[i] = 255;
      data[i + 1] = 0;
      data[i + 2] = 0;
    }

    ctx.putImageData(myImageData, 0, 0);
  }
}

module.exports = Filter;
