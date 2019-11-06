'use strict';

(function () {

  var ZOOM_STEP = 25;
  var MAX_ZOOM = 100;
  var MIN_ZOOM = 25;
  var PIN_MIN_POSITION = 0;

  window.scaleInput = document.querySelector('.scale__control--value');
  var uploadPreview = document.querySelector('.img-upload__preview');
  window.previewImg = uploadPreview.querySelector('img');
  window.effectLevel = document.querySelector('.img-upload__effect-level');
  window.effectLevelInput = document.querySelector('.effect-level__value');
  var effectLevelLine = document.querySelector('.effect-level__line');
  var effectLevelHighlight = document.querySelector('.effect-level__depth');
  window.effectLevelPin = document.querySelector('.effect-level__pin');

  // Изменение масштаба превью

  var zoomClickHandler = function (evt) {
    var targetZoomButton = evt.target;
    var currentScale = 0;
    if (targetZoomButton.classList[1] === 'scale__control--smaller') {
      window.scaleInput.value = parseInt(window.scaleInput.value, 10) - ZOOM_STEP;
      if (window.scaleInput.value < MIN_ZOOM) {
        window.scaleInput.value = MIN_ZOOM;
      }
      window.scaleInput.value = window.scaleInput.value + '%';
      currentScale = window.previewImg.style.transform.slice(6, -1);
      currentScale = currentScale - ZOOM_STEP * 0.01;
      if (currentScale < MIN_ZOOM * 0.01) {
        currentScale = MIN_ZOOM * 0.01;
      }
      window.previewImg.style.transform = 'scale(' + currentScale + ')';
    } else {
      window.scaleInput.value = parseInt(window.scaleInput.value, 10) + ZOOM_STEP;
      if (window.scaleInput.value > MAX_ZOOM) {
        window.scaleInput.value = MAX_ZOOM;
      }
      window.scaleInput.value = window.scaleInput.value + '%';
      currentScale = Number(window.previewImg.style.transform.slice(6, -1));
      currentScale = currentScale + ZOOM_STEP * 0.01;
      if (currentScale > MAX_ZOOM * 0.01) {
        currentScale = MAX_ZOOM * 0.01;
      }
      window.previewImg.style.transform = 'scale(' + currentScale + ')';
    }
  };

  // Переключение эффектов

  var getSliderWidth = function () {
    var sliderWidth = effectLevelLine.clientWidth;
    return sliderWidth;
  };

  var fxListCLickHandler = function (evt) {

    var targetID = evt.target.id;
    var effectName = targetID.replace('effect-', '');

    if (effectName === 'none') {
      window.previewImg.classList = '';
      window.effectLevel.classList.add('hidden');
      return;
    }

    window.previewImg.classList = 'effects__preview--' + effectName;
    window.effectLevelPin.style.left = getSliderWidth() + 'px';
    effectLevelHighlight.style.width = '100%';

    switch (window.previewImg.classList.value) {
      case 'effects__preview--chrome':
        window.previewImg.style.filter = 'grayscale(1)';
        break;
      case 'effects__preview--sepia':
        window.previewImg.style.filter = 'sepia(1)';
        break;
      case 'effects__preview--marvin':
        window.previewImg.style.filter = 'invert(100%)';
        break;
      case 'effects__preview--phobos':
        window.previewImg.style.filter = 'blur(3px)';
        break;
      case 'effects__preview--heat':
        window.previewImg.style.filter = 'brightness(3)';
        break;
      case 'effects__preview--':
        window.previewImg.style.filter = '';
        break;
    }

    window.effectLevelInput.value = getSliderWidth();
    window.effectLevel.classList.remove('hidden');
  };

  // Изменение уровня эффекта

  var pinDragHandler = function (evt) {
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

      var effectLevelPinShift = window.effectLevelPin.offsetLeft - shift.x;

      if (effectLevelPinShift < PIN_MIN_POSITION) {
        effectLevelPinShift = PIN_MIN_POSITION;
      } else if (effectLevelPinShift > getSliderWidth()) {
        effectLevelPinShift = getSliderWidth();
      }

      effectLevelHighlight.style.width = (effectLevelPinShift / getSliderWidth()) * 100 + '%';

      window.effectLevelInput.value = effectLevelPinShift;

      switch (window.previewImg.classList.value) {
        case 'effects__preview--chrome':
          window.previewImg.style.filter = 'grayscale(' + effectLevelPinShift / getSliderWidth() + ')';
          break;
        case 'effects__preview--sepia':
          window.previewImg.style.filter = 'sepia(' + effectLevelPinShift / getSliderWidth() + ')';
          break;
        case 'effects__preview--marvin':
          window.previewImg.style.filter = 'invert(' + (effectLevelPinShift / getSliderWidth()) * 100 + '%)';
          break;
        case 'effects__preview--phobos':
          var phobosEffectDepth = (effectLevelPinShift / getSliderWidth()) * 3;

          if (phobosEffectDepth > 3) {
            phobosEffectDepth = 3;
          }
          window.previewImg.style.filter = 'blur(' + phobosEffectDepth + 'px)';
          break;
        case 'effects__preview--heat':
          var heatEffectDepth = (effectLevelPinShift / getSliderWidth()) * 2 + 1;

          if (heatEffectDepth > 3) {
            heatEffectDepth = 3;
          } else if (heatEffectDepth < 1) {
            heatEffectDepth = 1;
          }
          window.previewImg.style.filter = 'brightness(' + heatEffectDepth + ')';
          break;
      }

      window.effectLevelPin.style.left = effectLevelPinShift + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  window.preview = {
    zoomClickHandler: zoomClickHandler,
    fxListCLickHandler: fxListCLickHandler,
    pinDragHandler: pinDragHandler
  };
})();
