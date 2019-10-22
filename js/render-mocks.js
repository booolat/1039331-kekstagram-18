'use strict';

(function () {

  var photoContainer = document.querySelector('.pictures');
  var mockTemplate = document.querySelector('#picture').content;
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < window.mocks.MOCK_AMOUNT; i++) {
    var currentMock = window.mocks.mockArray[i];
    var photoMock = mockTemplate.cloneNode(true);
    photoMock.querySelector('.picture__img').setAttribute('src', currentMock.url);
    photoMock.querySelector('.picture__likes').textContent = currentMock.likes;
    photoMock.querySelector('.picture__comments').textContent = currentMock.comments.length;
    fragment.appendChild(photoMock);
  }

  photoContainer.appendChild(fragment);

})();
