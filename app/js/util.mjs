export default {
  /** range inclusive **/
  randomNumber: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  zeroPad: function (num, padLength) {
    return ('0'.repeat(padLength) + num).slice(-padLength);
  },
}