'use strict';

(function () {

  var ZOOM_STEP = 25;
  var MAX_ZOOM = 100;
  var MIN_ZOOM = 25;
  var PIN_MIN_POSITION = 0;
  var LEFT_ARROW = 37;
  var RIGHT_ARROW = 39;

  var uploadPreview = document.querySelector('.img-upload__preview');
  var effectLevelLine = document.querySelector('.effect-level__line');
  var effectLevelHighlight = document.querySelector('.effect-level__depth');

  var zoomClickHandler = function (evt) {
    var targetZoomButton = evt.target;
    var currentScale = 0;
    if (targetZoomButton.classList[1] === 'scale__control--smaller') {
      window.preview.scaleInput.value = parseInt(window.preview.scaleInput.value, 10) - ZOOM_STEP;
      if (window.preview.scaleInput.value < MIN_ZOOM) {
        window.preview.scaleInput.value = MIN_ZOOM;
      }
      window.preview.scaleInput.value = window.preview.scaleInput.value + '%';
      currentScale = window.preview.previewImg.style.transform.slice(6, -1);
      currentScale = currentScale - ZOOM_STEP * 0.01;
      if (currentScale < MIN_ZOOM * 0.01) {
        currentScale = MIN_ZOOM * 0.01;
      }
      window.preview.previewImg.style.transform = 'scale(' + currentScale + ')';
    } else {
      window.preview.scaleInput.value = parseInt(window.preview.scaleInput.value, 10) + ZOOM_STEP;
      if (window.preview.scaleInput.value > MAX_ZOOM) {
        window.preview.scaleInput.value = MAX_ZOOM;
      }
      window.preview.scaleInput.value = window.preview.scaleInput.value + '%';
      currentScale = Number(window.preview.previewImg.style.transform.slice(6, -1));
      currentScale = currentScale + ZOOM_STEP * 0.01;
      if (currentScale > MAX_ZOOM * 0.01) {
        currentScale = MAX_ZOOM * 0.01;
      }
      window.preview.previewImg.style.transform = 'scale(' + currentScale + ')';
    }
  };

  var getSliderWidth = function () {
    var sliderWidth = effectLevelLine.clientWidth;
    return sliderWidth;
  };

  var classToEffect = function (shift) {
    switch (window.preview.previewImg.classList.value) {
      case 'effects__preview--chrome':
        window.preview.previewImg.style.filter = 'grayscale(' + shift / getSliderWidth() + ')';
        break;
      case 'effects__preview--sepia':
        window.preview.previewImg.style.filter = 'sepia(' + shift / getSliderWidth() + ')';
        break;
      case 'effects__preview--marvin':
        window.preview.previewImg.style.filter = 'invert(' + (shift / getSliderWidth()) * 100 + '%)';
        break;
      case 'effects__preview--phobos':
        var phobosEffectDepth = (shift / getSliderWidth()) * 3;

        if (phobosEffectDepth > 3) {
          phobosEffectDepth = 3;
        }
        window.preview.previewImg.style.filter = 'blur(' + phobosEffectDepth + 'px)';
        break;
      case 'effects__preview--heat':
        var heatEffectDepth = (shift / getSliderWidth()) * 2 + 1;

        if (heatEffectDepth > 3) {
          heatEffectDepth = 3;
        } else if (heatEffectDepth < 1) {
          heatEffectDepth = 1;
        }
        window.preview.previewImg.style.filter = 'brightness(' + heatEffectDepth + ')';
        break;
    }
  };

  var fxListCLickHandler = function (evt) {

    var targetID = evt.target.id;
    var effectName = targetID.replace('effect-', '');

    if (effectName === 'none') {
      window.preview.effectLevel.classList.add('hidden');
      return;
    }
    window.preview.effectLevel.classList.remove('hidden');

    window.preview.previewImg.classList = 'effects__preview--' + effectName;
    window.preview.effectLevelPin.style.left = getSliderWidth() + 'px';

    effectLevelHighlight.style.width = '100%';

    switch (window.preview.previewImg.classList.value) {
      case 'effects__preview--chrome':
        window.preview.effectLevelPin.style.left = getSliderWidth() + 'px';

        window.preview.previewImg.style.filter = 'grayscale(1)';
        break;
      case 'effects__preview--sepia':
        window.preview.previewImg.style.filter = 'sepia(1)';
        break;
      case 'effects__preview--marvin':
        window.preview.previewImg.style.filter = 'invert(100%)';
        break;
      case 'effects__preview--phobos':
        window.preview.previewImg.style.filter = 'blur(3px)';
        break;
      case 'effects__preview--heat':
        window.preview.previewImg.style.filter = 'brightness(3)';
        break;
      case 'effects__preview--':
        window.preview.previewImg.style.filter = '';
        break;
    }

    window.preview.effectLevelInput.value = getSliderWidth();
    window.preview.effectLevel.classList.remove('hidden');
  };

  var pinKeyHandler = function (evt) {
    if ((evt.keyCode === LEFT_ARROW) || (evt.keyCode === RIGHT_ARROW)) {

      evt.preventDefault();
      var pinShift;

      if (evt.keyCode === LEFT_ARROW) {
        pinShift = window.preview.effectLevelPin.offsetLeft - 10;
      }

      if (evt.keyCode === RIGHT_ARROW) {
        pinShift = window.preview.effectLevelPin.offsetLeft + 10;
      }

      if (pinShift < PIN_MIN_POSITION) {
        pinShift = PIN_MIN_POSITION;
      } else if (pinShift > getSliderWidth()) {
        pinShift = getSliderWidth();
      }

      window.preview.effectLevelPin.style.left = pinShift + 'px';

      effectLevelHighlight.style.width = (pinShift / getSliderWidth()) * 100 + '%';

      window.preview.effectLevelInput.value = pinShift;

      classToEffect(pinShift);
    }
  };

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

      var effectLevelPinShift = window.preview.effectLevelPin.offsetLeft - shift.x;

      if (effectLevelPinShift < PIN_MIN_POSITION) {
        effectLevelPinShift = PIN_MIN_POSITION;
      } else if (effectLevelPinShift > getSliderWidth()) {
        effectLevelPinShift = getSliderWidth();
      }

      effectLevelHighlight.style.width = (effectLevelPinShift / getSliderWidth()) * 100 + '%';

      window.preview.effectLevelInput.value = effectLevelPinShift;

      classToEffect(effectLevelPinShift);

      window.preview.effectLevelPin.style.left = effectLevelPinShift + 'px';
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
    pinDragHandler: pinDragHandler,
    pinKeyHandler: pinKeyHandler,
    scaleInput: document.querySelector('.scale__control--value'),
    previewImg: uploadPreview.querySelector('img'),
    effectLevel: document.querySelector('.img-upload__effect-level'),
    effectLevelInput: document.querySelector('.effect-level__value'),
    effectLevelPin: document.querySelector('.effect-level__pin')
  };
})();
