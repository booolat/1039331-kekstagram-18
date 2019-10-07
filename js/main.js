'use strict';

var photoContainer = document.querySelector('.pictures');
var mockTemplate = document.querySelector('#picture').content;
var fragment = document.createDocumentFragment();
var uploadField = document.querySelector('.img-upload__input');
var editingForm = document.querySelector('.img-upload__overlay');
var editingCloseButton = editingForm.querySelector('.img-upload__cancel');
var zoomInButton = editingForm.querySelector('.scale__control--bigger');
var zoomOutButton = editingForm.querySelector('.scale__control--smaller');
var scaleInput = editingForm.querySelector('.scale__control--value');
var uploadPreview = document.querySelector('.img-upload__preview');
var previewImg = uploadPreview.querySelector('img');

var commentTexts = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var commentAuthors = ['Порфирий', 'Цифровой олень', 'Куртка Бэйна', 'Владимир Ясно Солнышко', 'Наталья Орейро', 'Пушистый друг', 'Последний абориген Полинезии', 'Коля, просто Коля', 'Мама Стифлера'];

var MOCK_AMOUNT = 25;
var ESC_KEY = 27;
var ZOOM_STEP = 25;
var MAX_ZOOM = 100;
var MIN_ZOOM = 25;

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
      uploadField.value = '';
    }
  });
};

var closeButtonClickHandler = function () {
  editingForm.classList.add('hidden');
  uploadField.value = '';
};

uploadField.addEventListener('change', imgUploadHandler);

editingCloseButton.addEventListener('click', closeButtonClickHandler);

var zoomInClickHandler = function () {
  scaleInput.value = parseInt(scaleInput.value, 10) + ZOOM_STEP;
  if (scaleInput.value > MAX_ZOOM) {
    scaleInput.value = MAX_ZOOM;
  }
  scaleInput.value = scaleInput.value + '%';
  var currentScale = Number(previewImg.style.transform.slice(6, -1));
  currentScale = currentScale + ZOOM_STEP * 0.01;
  if (currentScale > MAX_ZOOM * 0.01) {
    currentScale = MAX_ZOOM * 0.01;
  }
  previewImg.style.transform = 'scale(' + currentScale + ')';
};

zoomInButton.addEventListener('click', zoomInClickHandler);

var zoomOutClickHandler = function () {
  scaleInput.value = parseInt(scaleInput.value, 10) - ZOOM_STEP;
  if (scaleInput.value < MIN_ZOOM) {
    scaleInput.value = MIN_ZOOM;
  }
  scaleInput.value = scaleInput.value + '%';
  var currentScale = previewImg.style.transform.slice(6, -1);
  currentScale = currentScale - ZOOM_STEP * 0.01;
  if (currentScale < MIN_ZOOM * 0.01) {
    currentScale = MIN_ZOOM * 0.01;
  }
  previewImg.style.transform = 'scale(' + currentScale + ')';
};

zoomOutButton.addEventListener('click', zoomOutClickHandler);

var effectsList = document.querySelector('.effects__list');
var effectLevel = document.querySelector('.img-upload__effect-level');

var fxListCLickHandler = function (evt) {
  var targetID = evt.target.id;
  switch (targetID) {

    case 'effect-none':
      previewImg.classList = '';
      effectLevel.classList.add('hidden');
      break;

    case 'effect-chrome':
      previewImg.classList = '';
      previewImg.classList.add('effects__preview--chrome');
      effectLevel.classList.remove('hidden');
      break;

    case 'effect-sepia':
      previewImg.classList = '';
      previewImg.classList.add('effects__preview--sepia');
      effectLevel.classList.remove('hidden');
      break;

    case 'effect-marvin':
      previewImg.classList = '';
      previewImg.classList.add('effects__preview--marvin');
      effectLevel.classList.remove('hidden');
      break;

    case 'effect-phobos':
      previewImg.classList = '';
      previewImg.classList.add('effects__preview--phobos');
      effectLevel.classList.remove('hidden');
      break;

    case 'effect-heat':
      previewImg.classList = '';
      previewImg.classList.add('effects__preview--heat');
      effectLevel.classList.remove('hidden');
      break;
  }
};

effectsList.addEventListener('click', fxListCLickHandler);

var hashtagField = document.querySelector('.text__hashtags');

var hashtagInputHandler = function (evt) {
  var target = evt.target;
  var tagArray = evt.target.value.split(' ');
  for (var j = 0; j <= tagArray.length - 1; j++) {
    // if (tagArray[j] === tagArray[0] || tagArray[1] || tagArray[2] || tagArray[3] || tagArray[4] || tagArray[5]) {
    //   target.setCustomValidity('Хештеги не должны повторяться');
    // } else
    // Почему не работает?
    if (tagArray.length > 5) {
      target.setCustomValidity('Не больше 5 хештегов');
    } else if (tagArray[j].length < 2) {
      target.setCustomValidity('Минимальная длина хештега — 2 символа');
    } else if (tagArray[j].length > 20) {
      target.setCustomValidity('Максимальная длина хештега — 20 символов');
    } else if (tagArray[j].charAt(0) !== '#') {
      target.setCustomValidity('Хештег должен начинаться с #');
    } else {
      target.setCustomValidity('');
    }
  }
};

hashtagField.addEventListener('input', hashtagInputHandler);
