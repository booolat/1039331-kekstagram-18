'use strict';

(function () {
  var photoContainer = document.querySelector('.pictures');
  var mockTemplate = document.querySelector('#picture').content;
  var fragment = document.createDocumentFragment();
  var MOCK_AMOUNT = 25;

  var commentTexts = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

  var commentAuthors = ['Порфирий', 'Цифровой олень', 'Куртка Бэйна', 'Владимир Ясно Солнышко', 'Наталья Орейро', 'Пушистый друг', 'Последний абориген Полинезии', 'Коля, просто Коля', 'Маленький гадёныш', 'Пешка Навального', 'Мама Стифлера'];

  var getCommentsArray = function () {
    var comment = {
      avatar: 'img/avatar-' + window.utils.getRandomNumber(1, 6) + '.svg',
      message: commentTexts[window.utils.getRandomNumber(0, commentAuthors.length)],
      name: commentAuthors[window.utils.getRandomNumber(0, commentAuthors.length)]
    };
    var commentsArray = [];
    var maxComments = window.utils.getRandomNumber(0, 10);
    for (var i = 0; i < maxComments; i++) {
      commentsArray.push(comment);
    }
    return commentsArray;
  };

  var createMock = function (selectedPhotos) {
    function selectPhoto() {
      var current = window.utils.getRandomNumber(1, MOCK_AMOUNT);
      if (selectedPhotos.includes(current)) {
        // переписать с использованием цикла
        return selectPhoto();
      }
      selectedPhotos.push(current);
      return current;
    }
    return {
      url: 'photos/' + selectPhoto() + '.jpg',
      description: 'Описание фотографии',
      likes: window.utils.getRandomNumber(15, 200),
      comments: getCommentsArray()
    };
  };

  var createMockArray = function () {
    var selectedPhotos = [];
    var mockArray = [];
    for (var i = 0; i < MOCK_AMOUNT; i++) {
      mockArray.push(createMock(selectedPhotos));
    }
    return mockArray;
  };
  var mockArray = createMockArray();

  for (var i = 0; i < MOCK_AMOUNT; i++) {

    var currentMock = mockArray[i];
    var photoMock = mockTemplate.cloneNode(true);
    photoMock.querySelector('.picture__img').setAttribute('src', currentMock.url);
    photoMock.querySelector('.picture__likes').textContent = currentMock.likes;
    photoMock.querySelector('.picture__comments').textContent = currentMock.comments.length;
    fragment.appendChild(photoMock);
  }

  photoContainer.appendChild(fragment);
})();
