'use strict';

// Утилиты

(function () {

  var ESC_KEY = 27;

  var uploadField = document.querySelector('#upload-file');
  var editingForm = document.querySelector('.img-upload__overlay');
  var editingCloseButton = editingForm.querySelector('#upload-cancel');
  var zoomButtons = document.querySelectorAll('button.scale__control');
  var effectsList = document.querySelector('.effects__list');
  var tagInput = document.querySelector('.text__hashtags');
  var validTags = [];
  var commentInput = document.querySelector('.text__description');
  var form = document.querySelector('#upload-select-image');
  var checkboxOriginal = document.querySelector('#effect-none');
  var uploadSuccessMessage = document.querySelector('#success').content;
  var successButton = uploadSuccessMessage.querySelector('.success__button');

  var uploadFieldHandler = function () {
    editingForm.classList.remove('hidden');
    editingCloseButton.addEventListener('click', closeButtonClickHandler);
    document.addEventListener('keydown', uploadFormEscHandler);
    for (var i = 0; i < zoomButtons.length; i++) {
      zoomButtons[i].addEventListener('click', window.preview.zoomClickHandler);
    }
    effectsList.addEventListener('click', window.preview.fxListCLickHandler);
    window.effectLevelPin.addEventListener('mousedown', window.preview.pinDragHandler);
    tagInput.addEventListener('input', tagInputHandler);
    commentInput.addEventListener('input', commentInputHandler);
    form.addEventListener('submit', submitHandler);
  };

  var killFormListeners = function () {
    editingCloseButton.removeEventListener('click', closeButtonClickHandler);
    document.removeEventListener('keydown', uploadFormEscHandler);
    for (var i = 0; i < zoomButtons.length; i++) {
      zoomButtons[i].removeEventListener('click', window.preview.zoomClickHandler);
    }
    effectsList.removeEventListener('click', window.preview.fxListCLickHandler);
    window.effectLevelPin.removeEventListener('mousedown', window.preview.pinDragHandler);
    tagInput.removeEventListener('input', tagInputHandler);
    commentInput.removeEventListener('input', commentInputHandler);
    form.removeEventListener('submit', submitHandler);
  };

  var closeButtonClickHandler = function () {
    tagInput.value = '';
    commentInput.value = '';
    window.scaleInput.value = '100%';
    window.previewImg.style.transform = 'scale(1)';
    window.previewImg.classList = '';
    window.previewImg.style.filter = '';
    window.effectLevel.classList.add('hidden');
    window.effectLevelInput.value = '0';
    checkboxOriginal.checked = true;
    editingForm.classList.add('hidden');
    uploadField.value = '';
    killFormListeners();
  };

  var checkInputFocus = function () {
    if (tagInput === document.activeElement) {
      return true;
    } else if (commentInput === document.activeElement) {
      return true;
    }
    return false;
  };

  var uploadFormEscHandler = function (evt) {
    if (evt.keyCode === ESC_KEY && !checkInputFocus()) {
      closeButtonClickHandler();
    }
  };

  // Валидация хештегов

  var checkUniqueTag = function (tag) {
    for (var index = 0; index < validTags.length; index++) {
      if (validTags[index] === tag.toLowerCase()) {
        return true;
      }
    }

    return false;
  };

  var validateTag = function (tag) {
    if (tag.length > 0) {
      switch (true) {
        case checkUniqueTag(tag):
          return 'Хештеги не должны повторяться';
        case validTags.length > 5:
          return 'Не больше 5 хештегов';
        case tag.length < 2:
          return 'Хештег должен быть не короче двух символов';
        case tag.length > 20:
          return 'Максимальная длина хештега — 20 символов';
        case tag.charAt(0) !== '#':
          return 'Хештег должен начинаться с #';
        default:
          validTags.push(tag.toLowerCase());
          return '';
      }
    }
    return '';
  };

  var tagInputHandler = function (evt) {
    var target = evt.target;
    var tags = evt.target.value.split(/,| |, /);
    for (var j = 0; j < tags.length; j++) {
      var validity = validateTag(tags[j]);
      target.setCustomValidity(validity);
      if (validity.length) {
        target.reportValidity();
      }
    }
    validTags = [];
    // не лишняя ли это переменная? такая уже объявлена в начале
  };

  // Валидация комментариев

  var commentInputHandler = function (evt) {
    var target = evt.target;
    if (target.value.length > 140) {
      target.setCustomValidity('Комментарий не должен быть больше 140 символов');
    } else {
      target.setCustomValidity('');
    }
  };

  // Отправка формы

  var successButtonClickHandler = function () {
    var innerSuccess = window.photoContainer.querySelector('.success');
    window.photoContainer.removeChild(innerSuccess);
    successButton.removeEventListener('click', successButtonClickHandler);
    document.removeEventListener('keydown', successMessageEscHandler);
  };

  var errorButtonsHandler = function () {
    var errorButtons = document.querySelectorAll('.error__button');
    var innerError = window.photoContainer.querySelector('.error');
    for (var i = 0; i < errorButtons.length; i++) {
      errorButtons[i].addEventListener('click', function () {
        window.photoContainer.removeChild(innerError);
      });
    }
    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEY) {
        window.photoContainer.removeChild(innerError);
      }
    });
  };
  // не понимаю, как тут удалить листенеры

  var successMessageEscHandler = function (evt) {
    if (evt.keyCode === ESC_KEY) {
      successButtonClickHandler();
    }
  };

  var uploadSuccessHandler = function () {
    window.photoContainer.appendChild(uploadSuccessMessage);
    successButton.addEventListener('click', successButtonClickHandler);
    document.addEventListener('keydown', successMessageEscHandler);
    closeButtonClickHandler();
  };

  var uploadErrorHandler = function () {
    window.photoContainer.appendChild(window.error);
    errorButtonsHandler();
    closeButtonClickHandler();
  };

  var submitHandler = function (evt) {
    window.upload(new FormData(form), uploadSuccessHandler, uploadErrorHandler);
    evt.preventDefault();
  };

  // Листенер формы

  uploadField.addEventListener('change', uploadFieldHandler);
})();
