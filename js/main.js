'use strict';

var photoContainer = document.querySelector('.pictures');
var mockTemplate = document.querySelector('#picture').content;
var fragment = document.createDocumentFragment();
var uploadField = document.querySelector('.img-upload__input');
var editingForm = document.querySelector('.img-upload__overlay');
var editingCloseButton = editingForm.querySelector('.img-upload__cancel');
var zoomStep = 25;

var commentTexts = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var commentAuthors = ['Порфирий', 'Цифровой олень', 'Куртка Бэйна', 'Владимир Ясно Солнышко', 'Наталья Орейро', 'Пушистый друг', 'Последний абориген Полинезии', 'Коля, просто Коля', 'Мама Стифлера'];

var MOCK_AMOUNT = 25;
var ESC_KEY = 27;

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getCommentsArray = function () {
  var comment = {
    avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg',
    message: commentTexts[getRandomNumber(0, 5)],
    name: commentAuthors[getRandomNumber(0, 8)]
  };
  var commentsArray = [];
  var maxComments = getRandomNumber(0, 10);
  for (var i = 0; i < maxComments; i++) {
    commentsArray.push(comment);
  }
  return commentsArray;
};

var createMock = function (selectedPhotos) {
  function selectPhoto() {
    var current = getRandomNumber(1, MOCK_AMOUNT);
    if (selectedPhotos.includes(current)) {
      return selectPhoto();
    }
    selectedPhotos.push(current);
    return current;
  }
  return {
    url: 'photos/' + selectPhoto() + '.jpg',
    description: 'Описание фотографии',
    likes: getRandomNumber(15, 200),
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

var imgUploadHandler = function () {
  editingForm.classList.remove('hidden');

  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ESC_KEY) {
      editingForm.classList.add('hidden');
    }
  });
};

var closeButtonClickHandler = function () {
  editingForm.classList.add('hidden');
};

uploadField.addEventListener('change', imgUploadHandler);

editingCloseButton.addEventListener('click', closeButtonClickHandler);

var zoomInButton = editingForm.querySelector('.scale__control--bigger');
var zoomOutButton = editingForm.querySelector('.scale__control--smaller');
var scaleInput = editingForm.querySelector('.scale__control--value');
// var scaleDefaultValue = 55;

zoomInButton.addEventListener('click', function () {
  scaleInput.value = parseInt(scaleInput.value, 10) + zoomStep + '%';
});

zoomOutButton.addEventListener('click', function () {
  scaleInput.value = parseInt(scaleInput.value, 10) - zoomStep + '%';
});

// debugger
