'use strict';

// (function () {
//   window.getRandomNumber = function (min, max) {
//     return Math.floor(Math.random() * (max - min + 1) + min);
//   };
// })();

// (function () {
//   window.utils = {
//     getRandomNumber: function (min, max) {
//       Math.floor(Math.random() * (max - min + 1) + min);
//     }
//   };
// })();

// (function () {
//   window.utils = {
//     getRandomNumber: function (min, max) {
//       Math.floor(Math.random() * (max - min + 1) + min);
//     }
//   };
// })();

(function () {
  var getRandomNumber = function (min, max) {
    Math.floor(Math.random() * (max - min + 1) + min);
  };

  window.utils = {
    getRandomNumber: getRandomNumber,
  };
})();
