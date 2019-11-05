'use strict';

(function () {

  var ZOOM_STEP = 25;
  var MAX_ZOOM = 100;
  var MIN_ZOOM = 25;
  var PIN_MIN_POSITION = 0;

  var scaleInput = document.querySelector('.scale__control--value');
  var uploadPreview = document.querySelector('.img-upload__preview');
  var previewImg = uploadPreview.querySelector('img');
  var effectLevel = document.querySelector('.img-upload__effect-level');
  var effectLevelInput = document.querySelector('.effect-level__value');
  var effectLevelLine = document.querySelector('.effect-level__line');
  var effectLevelHighlight = document.querySelector('.effect-level__depth');
  window.effectLevelPin = document.querySelector('.effect-level__pin');
  // это должно быть в объекте вместе с функциями?

  // Изменение масштаба превью

  var zoomClickHandler = function (evt) {
    var targetZoomButton = evt.target;
    var currentScale = 0;
    if (targetZoomButton.classList[1] === 'scale__control--smaller') {
      scaleInput.value = parseInt(scaleInput.value, 10) - ZOOM_STEP;
      if (scaleInput.value < MIN_ZOOM) {
        scaleInput.value = MIN_ZOOM;
      }
      scaleInput.value = scaleInput.value + '%';
      currentScale = previewImg.style.transform.slice(6, -1);
      currentScale = currentScale - ZOOM_STEP * 0.01;
      if (currentScale < MIN_ZOOM * 0.01) {
        currentScale = MIN_ZOOM * 0.01;
      }
      previewImg.style.transform = 'scale(' + currentScale + ')';
    } else {
      scaleInput.value = parseInt(scaleInput.value, 10) + ZOOM_STEP;
      if (scaleInput.value > MAX_ZOOM) {
        scaleInput.value = MAX_ZOOM;
      }
      scaleInput.value = scaleInput.value + '%';
      currentScale = Number(previewImg.style.transform.slice(6, -1));
      currentScale = currentScale + ZOOM_STEP * 0.01;
      if (currentScale > MAX_ZOOM * 0.01) {
        currentScale = MAX_ZOOM * 0.01;
      }
      previewImg.style.transform = 'scale(' + currentScale + ')';
    }
  };

  // Переключение эффектов

  var getSliderWidth = function () {
    var sliderWidth = effectLevelLine.clientWidth;
    return sliderWidth;
  };

  // var checkEffectClass = function () {
  //   switch (previewImg.classList.value) {
  //     case 'effects__preview--chrome':
  //       previewImg.style.filter = ;
  //       break;
  //     case 'effects__preview--sepia':
  //       previewImg.style.filter = ;
  //       break;
  //     case 'effects__preview--marvin':
  //       previewImg.style.filter = ;
  //       break;
  //     case 'effects__preview--phobos':
  //       previewImg.style.filter = ;
  //       break;
  //     case 'effects__preview--heat':
  //       previewImg.style.filter = ;
  //       break;
  //     case 'effects__preview--':
  //       previewImg.style.filter = '';
  //       break;
  //   }
  // };

  var fxListCLickHandler = function (evt) {

    var targetID = evt.target.id;
    var effectName = targetID.replace('effect-', '');

    if (effectName === 'none') {
      previewImg.classList = '';
      effectLevel.classList.add('hidden');
      return;
    }

    previewImg.classList = 'effects__preview--' + effectName;
    window.effectLevelPin.style.left = getSliderWidth() + 'px';
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

    effectLevelInput.value = getSliderWidth();
    effectLevel.classList.remove('hidden');
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

      effectLevelInput.value = effectLevelPinShift;

      switch (previewImg.classList.value) {
        case 'effects__preview--chrome':
          previewImg.style.filter = 'grayscale(' + effectLevelPinShift / getSliderWidth() + ')';
          break;
        case 'effects__preview--sepia':
          previewImg.style.filter = 'sepia(' + effectLevelPinShift / getSliderWidth() + ')';
          break;
        case 'effects__preview--marvin':
          previewImg.style.filter = 'invert(' + (effectLevelPinShift / getSliderWidth()) * 100 + '%)';
          break;
        case 'effects__preview--phobos':
          var phobosEffectDepth = (effectLevelPinShift / getSliderWidth()) * 3;

          if (phobosEffectDepth > 3) {
            phobosEffectDepth = 3;
          }
          previewImg.style.filter = 'blur(' + phobosEffectDepth + 'px)';
          break;
        case 'effects__preview--heat':
          var heatEffectDepth = (effectLevelPinShift / getSliderWidth()) * 2 + 1;

          if (heatEffectDepth > 3) {
            heatEffectDepth = 3;
          } else if (heatEffectDepth < 1) {
            heatEffectDepth = 1;
          }
          previewImg.style.filter = 'brightness(' + heatEffectDepth + ')';
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
  // их можно тут объявлять?
})();
