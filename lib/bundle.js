/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const testDropbox = __webpack_require__(1);
	
	document.addEventListener('DOMContentLoaded', () => {
	  testDropbox();
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	const testDropbox = () => {
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
	
	    handleFiles(files);
	  };
	  
	  dropbox.addEventListener("dragenter", dragenter, false);
	  dropbox.addEventListener("dragover", dragover, false);
	  dropbox.addEventListener("drop", drop, false);
	
	  const handleFiles = function(files) {
	    for (let i = 0; i < files.length; i++) {
	      let file = files[i];
	      let imageType = /^image\//;
	
	      if (!imageType.test(file.type)) {
	        continue;
	      }
	
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
	  };
	};
	
	module.exports = testDropbox;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map