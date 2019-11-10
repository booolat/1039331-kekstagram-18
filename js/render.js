'use strict';

(function () {

  var RANDOM_MOCKS_AMOUNT = 10;

  var photoContainer = document.querySelector('.pictures');
  var mockTemplate = document.querySelector('#picture').content;
  var fragment = document.createDocumentFragment();
  var imgFilters = document.querySelector('.img-filters');
  var popularButton = document.querySelector('#filter-popular');
  var randomButton = document.querySelector('#filter-random');
  var discussedButton = document.querySelector('#filter-discussed');

  window.render = {
    main: document.querySelector('main'),
    error: document.querySelector('#error').content
  };

  var successHandler = function (data) {

    var cleanMocks = function () {
      var oldPictures = photoContainer.querySelectorAll('a.picture');
      oldPictures.forEach(function (oldPicture) {
        photoContainer.removeChild(oldPicture);
      });
    };

    var renderMocks = function (picsPack) {
      for (var i = 0; i < picsPack.length; i++) {
        var currentMock = picsPack[i];
        var photoMock = mockTemplate.cloneNode(true);
        photoMock.querySelector('.picture__img').setAttribute('src', currentMock.url);
        photoMock.querySelector('.picture__likes').textContent = currentMock.likes;
        photoMock.querySelector('.picture__comments').textContent = currentMock.comments.length;
        fragment.appendChild(photoMock);
      }

      photoContainer.appendChild(fragment);
    };

    renderMocks(data);

    var lastTimeout;

    var getRandomNumber = function (min, max) {
      var randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
      return randomNumber;
    };

    var renderWithDelay = function (picsArray) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      window.setTimeout(function () {
        cleanMocks();
        renderMocks(picsArray);
      }, 500);
    };

    var changeActiveButton = function (evt) {
      popularButton.classList.remove('img-filters__button--active');
      randomButton.classList.remove('img-filters__button--active');
      discussedButton.classList.remove('img-filters__button--active');
      evt.target.classList.add('img-filters__button--active');
    };

    var randomButtonClickHandler = function (evt) {
      var randomPictures = [];

      var getRandomPictures = function () {
        var randomPicture = data[getRandomNumber(0, data.length - 1)];
        if (randomPictures.includes(randomPicture)) {
          getRandomPictures();
        } else if (randomPictures.length > RANDOM_MOCKS_AMOUNT - 1) {
          return randomPictures;
        } else {
          randomPictures.push(randomPicture);
          getRandomPictures();
        }
        return randomPictures;
      };

      getRandomPictures();

      changeActiveButton(evt);
      renderWithDelay(randomPictures);
    };

    var popularButtonClickHandler = function (evt) {
      changeActiveButton(evt);
      renderWithDelay(data);
    };

    var discussedButtonClickHandler = function (evt) {
      var picsByComments = data.slice().sort(function (first, second) {
        if (first.comments.length > second.comments.length) {
          return -1;
        } else if (first.comments.length < second.comments.length) {
          return 1;
        } else {
          return 0;
        }
      });

      changeActiveButton(evt);
      renderWithDelay(picsByComments);
    };

    popularButton.addEventListener('click', popularButtonClickHandler);
    randomButton.addEventListener('click', randomButtonClickHandler);
    discussedButton.addEventListener('click', discussedButtonClickHandler);

    imgFilters.classList.remove('img-filters--inactive');
  };

  var errorHandler = function () {
    var loadError = window.render.error.cloneNode(true);
    window.render.main.appendChild(loadError);
  };

  window.backend.load(successHandler, errorHandler);
})();
