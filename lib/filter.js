class Filter {
  constructor(canvas) {
    this.canvas = canvas;
    this.cache = [];
    this.currentVersion = null;
    this.buildFilterElements();
    this.buildUtilityElements();
  }


  buildFilterElements() {
    let $filterDiv = $('.filters');
    let $testButton = $('<button/>').html("filter test");

    $filterDiv.append($testButton);
  }

  buildUtilityElements() {
    let $utilityDiv = $('.utilities');
    let $testButton = $('<button/>').html("utility test");

    $utilityDiv.append($testButton);
  }
}

module.exports = Filter;
