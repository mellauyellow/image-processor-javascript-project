# matrixgram

[matrixgram live][github-pages]

[github-pages]: https://mellauyellow.github.io/image-processor-javascript-project/

matrixgram is a web application that allows users to apply various filters to an image and download the fully edited image file to their local drive. matrixgram is built entirely on the client side using Javascript and the jQuery library.

## Features & Implementation

### Convolution Matrices
matrixgram uses convolution matrices to apply different types of filters to images. In image processing, convolution matrices are used to assign a different weight to surrounding pixel RGB values, which are then averaged to create a new single RGB value for a given pixel using mathematical convolution. This process is used to calculate and overwrite every pixel within the original image. For more information on image processing and convolution matrices, please refer to the [Wikipedia page on image processing with kernels][wikipedia-page].

[wikipedia-page]: https://en.wikipedia.org/wiki/Kernel_(image_processing)

The animated gif below shows a sample image with each filter applied.

![animated gif of filters](wireframes/filter_gif1.gif)

### Image Manipulation
After an image is selected by the user, the image file is converted to a `Canvas` element. When a filter is applied, the image data is first extracted by calling `Canvas.getImageData()` and extracting the data property from the result, which returns an array of the RGBA values of every pixel in the image. After the appropriate convolution math is applied, the image data array is then overwritten with the new RGBA values using `Canvas.putImageData()` to create the new image.

Since all of the pixel data is represented in a single one-dimensional array, but the convolution math is based on a two-dimensional grid, I created two helper methods within my `Filter` class to easily convert between an x, y coordinate system and the image data array:

```javascript
readPixel(imageData, x, y) {
  let i = (y * this.currentCanvas.width + x) * 4;
  return [imageData[i], imageData[i + 1], imageData[i + 2]];
}

writePixel(imageData, pixelValues, x, y) {
  let [r, g, b] = pixelValues;
  let i = (y * this.currentCanvas.width + x) * 4;

  imageData[i] = r;
  imageData[i + 1] = g;
  imageData[i + 2] = b;
}
```

Certain filters utilize a 3x3 matrix while others use a 5x5 matrix. I wanted to ensure that all of a pixel's neighbors could be easily found regardless of the size of the matrix, so the code to determine the matrix of neighboring pixels is adaptable for any size:

```javascript
calculateMatrix(x, y, data) {
  let matrix = [];

  let offset = Math.floor(Math.sqrt(this.filterMatrix.length) / 2);

  for (var yOff = -1 * offset; yOff < offset + 1; yOff++) {
    for (var xOff = -1 * offset; xOff < offset + 1; xOff++) {
      let coords = this.pixelOnGridValue(x + xOff, y + yOff);
      matrix.push(this.readPixel(data, ...coords));
    }
  }

  return matrix;
}
```

### File Manipulation
matrixgram allows the user to select an image file from their local drive to manipulate using a `FileReader` object.  Upon load, the `FileReader`  creates an image tag with the source URL as the local image, and then creates a `Canvas` element with the image drawn.

The image shown in the browser is a resized version of the original image, while the original image and image tag are saved as public instance variables in the `Image` class. There are two main reasons for this:

  + Many images have a resolution that is larger than the typical screen size, so the image needed to be scaled downwards so that the user could see the entire image on the screen while editing.
  + The time complexity of applying an image is O(n * m), where n is the number of pixels in the image and m is the size of the filter matrix. Using a smaller image in the browser allows for the user to observe the effects of the filters in a shorter period of time.

As each filter is selected, a new `Filter` object is created with the appropriate filter matrix and the smaller browser image is updated immediately. Since it does take a couple seconds for each filter to be applied even to the smaller browser image, a processing spinner appears over the image and all of the buttons within the matrixgram tool are disabled to prevent users from queuing up too many filter actions at once.

<img src="https://github.com/mellauyellow/image-processor-javascript-project/blob/master/wireframes/filter_processing.png" width="300">

<!-- ![filter processing](wireframes/filter_processing.png | width=300) -->

 The `Filter` object is also stored in a public instance variable called `filterOrder`, which is an array of all `Filter` objects which have been applied. Upon saving the image, the original full-sized image is then processed based on the order of `Filter` objects in the `filterOrder` array. A brief modal pops up that alerts the user that the image is processing and will being downloading shortly.

 ![download processing](wireframes/download_processing.png | width=300)




## Future Directions for the Project
