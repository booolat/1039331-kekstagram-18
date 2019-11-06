'use strict';

(function () {

  var photoContainer = document.querySelector('.pictures');
  var mockTemplate = document.querySelector('#picture').content;
  var fragment = document.createDocumentFragment();

  window.render = {
    main: document.querySelector('main'),
    error: document.querySelector('#error').content
  };

  var successHandler = function (data) {

    for (var i = 0; i < data.length; i++) {
      var currentMock = data[i];
      var photoMock = mockTemplate.cloneNode(true);
      photoMock.querySelector('.picture__img').setAttribute('src', currentMock.url);
      photoMock.querySelector('.picture__likes').textContent = currentMock.likes;
      photoMock.querySelector('.picture__comments').textContent = currentMock.comments.length;
      fragment.appendChild(photoMock);
    }

    photoContainer.appendChild(fragment);
  };

  var errorHandler = function () {
    window.render.main.appendChild(window.render.error);
  };

  window.load(successHandler, errorHandler);
})();
