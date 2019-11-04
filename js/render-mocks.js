'use strict';

(function () {

  var photoContainer = document.querySelector('.pictures');
  var mockTemplate = document.querySelector('#picture').content;
  var fragment = document.createDocumentFragment();
  var mockError = document.querySelector('#error').content;

  var successHandler = function (webmock) {

    for (var i = 0; i < webmock.length; i++) {
      var currentMock = webmock[i];
      var photoMock = mockTemplate.cloneNode(true);
      photoMock.querySelector('.picture__img').setAttribute('src', currentMock.url);
      photoMock.querySelector('.picture__likes').textContent = currentMock.likes;
      photoMock.querySelector('.picture__comments').textContent = currentMock.comments.length;
      fragment.appendChild(photoMock);
    }

    photoContainer.appendChild(fragment);
  };

  var errorHandler = function (errorMessage) {
    // console.log(errorMessage);
    photoContainer.appendChild(mockError);
  };

  window.load(successHandler, errorHandler);
})();
