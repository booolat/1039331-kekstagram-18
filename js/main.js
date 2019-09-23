'use strict';

var mockData = {
  url: 'photos/5.jpg',
  description: 'Описание фотографии',
  likes: 10,
  comments: 'Шляпа полная'
};

var mockTemplate = document.querySelector('#picture').content;

var photoContainer = document.querySelector('.pictures');

for (var i = 0; i < 25; i++) {
  var photoMock = mockTemplate.cloneNode(true);

  photoMock.querySelector('.picture__img').setAttribute('src', mockData.url);
  photoMock.querySelector('.picture__likes').textContent = mockData.likes;
  photoMock.querySelector('.picture__comments').textContent = mockData.comments;

  var fragment = photoMock.createDocumentFragment();

  photoContainer.appendChild(fragment);
}
