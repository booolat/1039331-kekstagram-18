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
      var oldMocks = photoContainer.querySelectorAll('a.picture');
      oldMocks.forEach(function (oldMock) {
        photoContainer.removeChild(oldMock);
      });
    };

    var renderMocks = function (mockPack) {
      for (var i = 0; i < mockPack.length; i++) {
        var currentMock = mockPack[i];
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

    var renderWithDelay = function (mockArray) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      window.setTimeout(function () {
        cleanMocks();
        renderMocks(mockArray);
      }, 500);
    };

    var randomButtonClickHandler = function () {
      var randomMocks = [];

      var getRandomMocks = function () {
        var randomMock = data[getRandomNumber(0, data.length - 1)];
        if (randomMocks.includes(randomMock)) {
          getRandomMocks();
        } else if (randomMocks.length > RANDOM_MOCKS_AMOUNT - 1) {
          return randomMocks;
        } else {
          randomMocks.push(randomMock);
          getRandomMocks();
        }
        return randomMocks;
      };

      getRandomMocks();

      popularButton.classList.remove('img-filters__button--active');
      discussedButton.classList.remove('img-filters__button--active');
      randomButton.classList.add('img-filters__button--active');

      renderWithDelay(randomMocks);
    };

    var popularButtonClickHandler = function () {
      randomButton.classList.remove('img-filters__button--active');
      discussedButton.classList.remove('img-filters__button--active');
      popularButton.classList.add('img-filters__button--active');

      renderWithDelay(data);
    };

    var discussedButtonClickHandler = function () {
      var mocksByComments = data.slice().sort(function (first, second) {
        if (first.comments.length > second.comments.length) {
          return -1;
        } else if (first.comments.length < second.comments.length) {
          return 1;
        } else {
          return 0;
        }
      });

      popularButton.classList.remove('img-filters__button--active');
      randomButton.classList.remove('img-filters__button--active');
      discussedButton.classList.add('img-filters__button--active');

      renderWithDelay(mocksByComments);
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
