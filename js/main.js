'use strict';

var photoContainer = document.querySelector('.pictures');

var mockTemplate = document.querySelector('#picture').content;

var fragment = document.createDocumentFragment();

var commentTexts = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var commentAuthors = ['Порфирий', 'Цифровой олень', 'Куртка Бэйна', 'Владимир Ясно Солнышко', 'Наталья Орейро', 'Пушистый друг', 'Последний абориген Полинезии', 'Коля, просто Коля', 'Мама Стифлера'];

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var createMock = function () {
  var mock = {
    url: 'photos/' + getRandomNumber(1, 25) + '.jpg',
    description: 'Описание фотографии',
    likes: getRandomNumber(15, 200),
    comments: [{avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg', message: commentTexts[getRandomNumber(0, 5)], name: commentAuthors[getRandomNumber(0, 8)]}]
  };
  return mock;
};

var createMockArray = function () {
  var mockArray = [];
  for (var i = 0; i < 25; i++) {
    mockArray.push(createMock());
  }
  return mockArray;
};

var mockArray = createMockArray();

for (var i = 0; i < 25; i++) {
  var photoMock = mockTemplate.cloneNode(true);

  photoMock.querySelector('.picture__img').setAttribute('src', mockArray[i].url);
  photoMock.querySelector('.picture__likes').textContent = mockArray[i].likes;
  photoMock.querySelector('.picture__comments').textContent = mockArray[i].comments;

  fragment.appendChild(photoMock);
}

photoContainer.appendChild(fragment);
// debugger
