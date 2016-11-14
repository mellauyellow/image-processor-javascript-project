## Image Processing Using Kernels

### Background

Basic image processors usually come with various filters that can be applied to change the appearance of the image, such as blurring, sharpening, and edge detection. This project will give users the ability to edit an existing photo with a variety of filters, and see what the output looks like in real-time.

### Functionality & MVP  

Using my image processor, users will be able to:

- [ ] Select between a series of pre-existing photos to edit
- [ ] Choose a variety of filters (either singular or in combination) to apply to the image, and see the result on the screen in real-time
- [ ] Input custom settings to alter the sensitivity of the filters available
- [ ] Save a local version of their edited image

In addition, this project will include:

- [ ] A production Readme

### Wireframes

This app will primarily exist on a single screen.  Upon load, the user will be given an option of a few photos to select from.  After selection, the user will be taken to a screen that will show the image in higher resolution, with the ability to select different filters from a toolbar on the right hand side.  There will also be a portion of the toolbar that enables the users to input custom settings, with the settings changing based on the type of filter currently selected.

![wireframes](/wireframes/start_page.png)
![wireframes](/wireframes/edit_page.png)

### Architecture and Technologies

This project will be implemented with the following technologies:

- Vanilla JavaScript and `jquery` for overall structure and filter logic,
- `HTML5 Canvas` for DOM manipulation and rendering,
- Webpack to bundle and serve up the various scripts.

Here is a rough outline of the project structure:

`Image` class: Each photo will be an Image object, with some basic functionality included, like resizing.

`Filter` class: Each Filter object will represent a different filter capability.

`Canvas` class: This will handle all of the UI/UX aspect of the program, allowing users to apply different filters to the selected image, or alter the settings.

### Implementation Timeline

**Day 1**: Get the structure up and running with Webpack and any applicable Node modules. Complete basic Image and Filter classes. Have one working Filter object that can take in an image and output an edited image.

**Day 2**: Review readings on how various filters are implemented (either with Kernels or not). Complete all pre-set filters.

**Day 3**: Work on UI. Have a basic interface that allows for selection of image and rendering of edited photos.


**Day 4**: All styling. Enable saving on local machine of edited photos.


### Bonus features

Potential bonus features:

- [ ] Ability to select any local photo for editing instead of a pre-existing photo option.
- [ ] Ability to select specific areas of the photo to apply filters
