# matrixgram

[matrixgram live][github-pages]

[github-pages]: https://mellauyellow.github.io/image-processor-javascript-project/

matrixgram is a web application that allows users to apply various filters to an image and download the fully edited image file to their local drive. matrixgram is built entirely on the client side using Javascript and the jQuery library.

## Features & Implementation

### Convolution Matrices
matrixgram uses convolution matrices to apply different types of filters to images. In image processing, convolution matrices are used to assign a different weight to surrounding pixel RGB values, which are then averaged to create a new single RGB value for a given pixel using mathematical convolution. This process is used to calculate and overwrite every pixel within the original image. For more information on image processing and convolution matrices, please refer to the [Wikipedia page][wikipedia-page].

[wikipedia-page]: https://en.wikipedia.org/wiki/Kernel_(image_processing)

The animated gif below shows a sample image with each filter applied.

![animated gif of filters](wireframes/filter_gif1.gif)

### Image Manipulation
After an image is selected by the user, the image file is converted to a `Canvas` element. When a filter is applied, the image data is first extracted by calling `Canvas.getImageData()` and extracting the data property from the result, which returns an array of the RGBA values of every pixel in the image. After the appropriate convolution math is applied, the image data array is then overwritten with the new RGBA values using `Canvas.putImageData()` to create the new image.

Since all of the pixel data is represented in a single one-dimensional array, but the convolution math is based on a two-dimensional grid, I created two helper methods to easily convert between an x, y coordinate system and the image data array:

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
- Reader
- Blob
- Original image separate from image on screen

## Future Directions for the Project


### Neighborhoods and Neighborhood Pages

Neighborhoods are stored in their own table in the database, with each neighborhood holding a foreign key to a region (San Francisco, Los Angeles, Chicago, or New York). Each neighborhood has a few key characteristics that help power the neighborhood page and the filter capability:
  + `center_lat` and `center_long` are used to center the map of the neighborhood
  + `walk_score`, `transit_score`, and `cost_of_living` are used as information for searching

Upon loading, Neighborhood Pages make an API call for the neighborhood information, including neighborhood reviews and images, which all live in separate parts of the application state.  The Neighborhood Page renders many key components:

#### NeighborhoodImage
The `NeighborhoodImage` component is the main image at the top of the page. The design is largely inspired by Airbnb's listing pages. There is a gradient over the image that gradually makes the image darker to make the "View Photos" button stand out on the right.  Clicking this button, or anywhere else on the image, will bring up a React modal that functions as a slideshow of all the images that have been uploaded by users for the given neighborhood, which highlights each user and any captions they may have included for the photo:

![image of image slideshow](docs/screenshots/image_slideshow.png)

#### NeighborhoodHeader
The `NeighborhoodHeader` houses the two buttons that enable a user to add content to the neighborhood page: Reviews and Images. Both buttons pop up modals over the screen to allow the user to take action.  If the user is not logged in, the modal will display the login form before they are allowed to add content.  Upon login, the modal transitions directly to either the `ReviewForm` component within the same modal or the Cloudinary photo upload widget, depending on the button.  More on reviews in the following section.

#### NeighborhoodReviewItems
Neighborhood reviews are displayed on the Neighborhood Page in descending order of date created. Each neighborhood review is stored as a `NeighborhoodReviewItem`, which has two main sections:
  + User information is displayed on the left, including the user's profile picture, first name and last initial, and zip code.
  + The text of the review and the date that the review was created, and thumbnails of any associated images.

If the logged-in user is the owner of a review item, two buttons will also appear below that allow the user to edit or delete their review. Deleting a review triggers an API call to DELETE the review item, as well as any associated images, from the database.

![image of review items](docs/screenshots/review_items.png)

#### NeighborhoodMap
The `NeighborhoodMap` component renders a small map via the Google Maps API, with a marker in the center of the neighborhood.

### Reviews
Reviews are a separate table in the database, with a foreign key to `user_id` and `neighborhood_id`, and a column for the review `body` (the main content of the review). The table also holds a few other boolean columns for rating the neighborhood in various ways, such as friendliness towards pets, which are not used in the product's current iteration but will be in the future.

#### ReviewForm
The `ReviewForm` component can only be accessed by logged-in users, and from the appropriate Neighborhood Page.  If logged in, the review form pops up as a React modal over the screen. The form covers all the columns in the Reviews database table, but also allows users to upload associated Images as well via the Cloudinary upload widget.  

The form values are stored in the component's controlled state, and upon submission, an action is dispatched to POST the review to the database.  In the Reviews controller, any images are also created in the database via associations:

```ruby
def create
  @review = Review.new(review_params)
  images = params[:review][:images]

  if @review.save
    unless images.nil?
      image_objects = images.map do |key, image|
        url = image["url"]
        user_id = image["user_id"]
        neighborhood_id = image["neighborhood_id"]
        @review.images << Image.create(url: url, user_id: user_id, neighborhood_id: neighborhood_id)
      end
    end
    render :show
  else
    @errors = @review.errors
    render :json => @errors, status: 422
  end
end
```

If the review form submission is unsuccessful, errors are rendered at the top of the form via a slice of the state that stores error messages.

![image of review form](docs/screenshots/review_form.png)

### Search Filters
One of the key features of Onward is the ability to narrow down neighborhoods based on various filters.  The main filter is to search for neighborhoods by region, but there are also other filters that help to further filter neighborhoods within a given region.

#### SearchDropdown
The `SearchDropdown` component is the main search filter that appears on the splash page and the header of every subsequent page. This component has an onChange handler that listens for a selection on the dropdown, and then fires off an API request for all the relevant region information.  The React router also pushes the user to the Search Results Page, which then fetches the appropriate neighborhoods upon mounting.

#### Neighborhood Filters
There are four main search filters that exist on the Search Results Page, all of which correspond to data from the Neighborhoods table:
  + `walk_score` and `transit_score` are both bucketed into three categories that filter based on the neighborhood's score: high (86 - 100), medium (70 - 80), low (0 - 70).
  + `cost_of_living` is bucketed into four quartiles dependent on the average rent price for a 1 bedroom apartment in that neighborhood.
  + `most_like` (or "similar to") gives the user the ability to filter neighborhoods within the given region based on its similarity to a neighborhood from another region.

All four search filters are stored in the `SearchForm` component's controlled state, and each dropdown has an onChange event handler that dispatches an action with the appropriate filter to the Regions controller to fetch the correct neighborhoods. The filters are passed to the backend via query string, and then parsed in the controller via Active Record query methods.

![image of search results](docs/screenshots/search_results.png)

### Maps
Maps are featured on both the Search Results Page and the Neighborhoods Page. Regions and Neighborhoods each have a `center_lat` and `center_long` column in their database, which enable the appropriate maps to center on the correct location.

#### SearchResultsMap
The `SearchResultsMap` displays information for the entire region, with markers on each of the neighborhoods in the search results. The component will re-render when the neighborhoods state changes, and will only display relevant data for the neighborhoods in the search results.  Each marker has two event handlers:
  + A hover effect on the markers that will bring up a Google Maps infoWindow with the name of the neighborhood, and change the color of the marker to blue.
  + A click handler that will push the user to the appropriate neighborhood page.

## Future Directions for the Project

I'd like to continue working on this app in the future, and plan to add more functionality, including the following:

### Search

Text search that will enable searching by neighborhood name, or by keywords in neighborhood reviews.

### Map Search

The ability to zoom/drag on the map and have the neighborhood search results update based on what is currently in view on the map.  Additionally, the ability to mouseover a neighborhood search result item and have the appropriate marker display in a different color.

### User Profiles and Review Tagging

Give users the ability to manage their reviews and images via their profile page. This would also store information on review tags.
