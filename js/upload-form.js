'use strict';

// Утилиты

(function () {
  // ограничить область поиска формой там, где это возможно
  var uploadField = document.querySelector('#upload-file');
  var editingForm = document.querySelector('.img-upload__overlay');
  var editingCloseButton = editingForm.querySelector('#upload-cancel');
  var zoomInButton = editingForm.querySelector('.scale__control--bigger');
  var zoomOutButton = editingForm.querySelector('.scale__control--smaller');
  var scaleInput = editingForm.querySelector('.scale__control--value');
  var uploadPreview = document.querySelector('.img-upload__preview');
  var previewImg = uploadPreview.querySelector('img');
  var effectsList = document.querySelector('.effects__list');
  var effectLevel = document.querySelector('.img-upload__effect-level');
  var tagInput = document.querySelector('.text__hashtags');
  var validTags = [];
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectLevelInput = document.querySelector('.effect-level__value');
  var effectLevelHighlight = document.querySelector('.effect-level__depth');

  var ESC_KEY = 27;
  var ZOOM_STEP = 25;
  var MAX_ZOOM = 100;
  var MIN_ZOOM = 25;
  var PIN_MAX_POSITION = 453;
  var PIN_MIN_POSITION = 0;
  var PIN_WIDTH = 18;

  var uploadFieldHandler = function () {
    editingForm.classList.remove('hidden');
    editingCloseButton.addEventListener('click', closeButtonClickHandler);
    document.addEventListener('keydown', uploadFormEscHandler);
    zoomInButton.addEventListener('click', zoomInClickHandler);
    zoomOutButton.addEventListener('click', zoomOutClickHandler);
    effectsList.addEventListener('click', fxListCLickHandler);
    tagInput.addEventListener('input', tagInputHandler);
  };

  var killFormListeners = function () {
    editingCloseButton.removeEventListener('click', closeButtonClickHandler);
    document.removeEventListener('keydown', uploadFormEscHandler);
    zoomInButton.removeEventListener('click', zoomInClickHandler);
    zoomOutButton.removeEventListener('click', zoomOutClickHandler);
    effectsList.removeEventListener('click', fxListCLickHandler);
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

  // Изменение масштаба превью

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

  // Переключение эффектов

  var fxListCLickHandler = function (evt) {
    var targetID = evt.target.id;
    var effectName = targetID.replace('effect-', '');

    if (effectName === 'none') {
      previewImg.classList = '';
      effectLevel.classList.add('hidden');
      return;
    }

    previewImg.classList = 'effects__preview--' + effectName;
    effectLevelPin.style.left = PIN_MAX_POSITION + 'px';
    effectLevelHighlight.style.width = '100%';

    switch (previewImg.classList.value) {
      case 'effects__preview--chrome':
        previewImg.style.filter = 'grayscale(1)';
        break;
      case 'effects__preview--sepia':
        previewImg.style.filter = 'sepia(1)';
        break;
      case 'effects__preview--marvin':
        previewImg.style.filter = 'invert(100%)';
        break;
      case 'effects__preview--phobos':
        previewImg.style.filter = 'blur(3px)';
        break;
      case 'effects__preview--heat':
        previewImg.style.filter = 'brightness(3)';
        break;
      case 'effects__preview--':
        previewImg.style.filter = '';
        break;
    }

    effectLevelInput.value = PIN_MAX_POSITION;
    effectLevel.classList.remove('hidden');
  };

  // Изменение уровня эффекта

  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX
      };

      startCoords = {
        x: moveEvt.clientX
      };

      var effectLevelPinShift = effectLevelPin.offsetLeft - shift.x;

      if (effectLevelPinShift < PIN_MIN_POSITION) {
        effectLevelPinShift = PIN_MIN_POSITION;
      } else if (effectLevelPinShift > PIN_MAX_POSITION) {
        effectLevelPinShift = PIN_MAX_POSITION;
      }

      effectLevelHighlight.style.width = (effectLevelPinShift / PIN_MAX_POSITION) * 100 + '%';

      effectLevelInput.value = effectLevelPinShift - PIN_WIDTH / 2;
      // В ТЗ указано, что в поле должны записываться координаты середины пина
      // Всё понятно, но в крайнем левом положении в поле получается -9. Это нормально или нужно приводить к нулю?

      switch (previewImg.classList.value) {
        case 'effects__preview--chrome':
          previewImg.style.filter = 'grayscale(' + effectLevelPinShift / PIN_MAX_POSITION + ')';
          break;
        case 'effects__preview--sepia':
          previewImg.style.filter = 'sepia(' + effectLevelPinShift / PIN_MAX_POSITION + ')';
          break;
        case 'effects__preview--marvin':
          previewImg.style.filter = 'invert(' + (effectLevelPinShift / PIN_MAX_POSITION) * 100 + '%)';
          break;
        case 'effects__preview--phobos':
          var phobosEffectDepth = (effectLevelPinShift / PIN_MAX_POSITION) * 3;

          if (phobosEffectDepth > 3) {
            phobosEffectDepth = 3;
          }
          previewImg.style.filter = 'blur(' + phobosEffectDepth + 'px)';
          break;
        case 'effects__preview--heat':
          var heatEffectDepth = (effectLevelPinShift / PIN_MAX_POSITION) * 4;
          // Здесь диапазон значений от 1 до 3, но что-то не то с пропорцией, мёртвые зоны по краям слайдера

          if (heatEffectDepth > 3) {
            heatEffectDepth = 3;
          } else if (heatEffectDepth < 1) {
            heatEffectDepth = 1;
          }
          previewImg.style.filter = 'brightness(' + heatEffectDepth + ')';
          break;
      }

      effectLevelPin.style.left = effectLevelPinShift + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

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
