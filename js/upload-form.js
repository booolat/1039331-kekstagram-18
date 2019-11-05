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
  };

  var closeButtonClickHandler = function () {
    editingForm.classList.add('hidden');
    uploadField.value = '';
    killFormListeners();
  };

  var uploadFormEscHandler = function (evt) {
    if (evt.keyCode === ESC_KEY && !isTagInputFocused()) {
      editingForm.classList.add('hidden');
      uploadField.value = '';
      killFormListeners();
    }
  };

  var isTagInputFocused = function () {
    if (tagInput === document.activeElement) {
      return true;
    }
    return false;
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
  };

  // Листенер формы

  uploadField.addEventListener('change', uploadFieldHandler);
})();
