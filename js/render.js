'use strict';

(function () {

  var RANDOM_MOCKS_AMOUNT = 10;
  var COMMENTS_PORTION = 5;
  var ESC_KEY = 27;
  var ENTER_KEY = 13;

  var photoContainer = document.querySelector('.pictures');
  var mockTemplate = document.querySelector('#picture').content;
  var fragment = document.createDocumentFragment();
  var imgFilters = document.querySelector('.img-filters');
  var popularButton = document.querySelector('#filter-popular');
  var randomButton = document.querySelector('#filter-random');
  var discussedButton = document.querySelector('#filter-discussed');
  var bigPicture = document.querySelector('.big-picture');

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

    var photoClickHandler = function (evt, target) {
      if (evt.type === 'click') {
        target = evt.target;
      }

      if (target.classList.contains('picture__img')) {
        evt.preventDefault();
        bigPicture.classList.remove('hidden');
        document.querySelector('body').classList.add('modal-open');
        var bigPictureImg = bigPicture.querySelector('img');
        var targetSource = target.getAttribute('src');
        var commentsList = bigPicture.querySelector('.social__comments');
        var bigPictureCloseButton = bigPicture.querySelector('#picture-cancel');
        var commentsLoadButton = bigPicture.querySelector('.comments-loader');

        for (var i = 0; i < data.length; i++) {
          if (targetSource === data[i].url) {
            bigPictureImg.setAttribute('src', data[i].url);
            bigPicture.querySelector('.social__caption').textContent = data[i].description;
            bigPicture.querySelector('.likes-count').textContent = data[i].likes;

            var comments = bigPicture.querySelectorAll('.social__comment');
            var commentTemplate = bigPicture.querySelector('.social__comment');
            comments.forEach(function (comment) {
              commentsList.removeChild(comment);
            });

            var appendComments = function () {
              for (var j = 0; j < data[i].comments.length; j++) {
                var comment = commentTemplate.cloneNode(true);
                var commentIndex = bigPicture.querySelectorAll('.social__comment').length;

                comment.querySelector('img').setAttribute('src', data[i].comments[commentIndex].avatar);
                comment.querySelector('img').setAttribute('alt', data[i].comments[commentIndex].name);
                comment.querySelector('.social__text').textContent = data[i].comments[commentIndex].message;
                bigPicture.querySelector('.social__comment-count').textContent = commentIndex + 1 + ' из ' + data[i].comments.length + ' комментариев';
                commentsList.appendChild(comment);

                var commentsCount = bigPicture.querySelectorAll('.social__comment').length;

                if (j === (COMMENTS_PORTION - 1)) {
                  break;
                } else if (commentsCount === data[i].comments.length) {
                  commentsLoadButton.classList.add('hidden');
                  break;
                }
              }
            };
            appendComments();
            break;
          }
        }

        var bigPictureCloseButtonHandler = function () {
          bigPicture.classList.add('hidden');
          document.querySelector('body').classList.remove('modal-open');
          bigPictureCloseButton.removeEventListener('click', bigPictureCloseButtonHandler);
          document.removeEventListener('keydown', bigPictureEscHandler);
          commentsLoadButton.removeEventListener('click', loadButtonClickHandler);
          commentsLoadButton.classList.remove('hidden');

        };

        var bigPictureEscHandler = function (event) {
          if (event.keyCode === ESC_KEY) {
            bigPictureCloseButtonHandler();
          }
        };

        var loadButtonClickHandler = function () {
          appendComments();
        };

        bigPictureCloseButton.addEventListener('click', bigPictureCloseButtonHandler);
        document.addEventListener('keydown', bigPictureEscHandler);
        commentsLoadButton.addEventListener('click', loadButtonClickHandler);
      }
    };

    var bigPictureEnterHandler = function (e) {
      if ((e.keyCode === ENTER_KEY) && (e.target.tagName === 'A')) {
        var image = e.target.querySelector('img');
        photoClickHandler(e, image);
      }
    };

    popularButton.addEventListener('click', popularButtonClickHandler);
    randomButton.addEventListener('click', randomButtonClickHandler);
    discussedButton.addEventListener('click', discussedButtonClickHandler);
    photoContainer.addEventListener('click', photoClickHandler);
    photoContainer.addEventListener('keydown', bigPictureEnterHandler);
    imgFilters.classList.remove('img-filters--inactive');
  };

  var errorHandler = function (errorlog) {
    var loadError = window.render.error.cloneNode(true);
    window.render.main.appendChild(loadError);
    throw new Error(errorlog);
  };

  window.backend.load(successHandler, errorHandler);
})();
