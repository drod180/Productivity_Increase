'use strict'

function updateTime(time) {
  $(".timer").text(time);
}

document.addEventListener('DOMContentLoaded', function () {
  var bg = chrome.extension.getBackgroundPage();
  var time = bg.funTime;
  updateTime(time);
});
