'use strict';

(function () {
  var getRandomNumber = function (min, max) {
    var randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
    return randomNumber;
  };

  window.utils = {
    getRandomNumber: getRandomNumber,
  };
})();
