'use strict'

function updateTime(time) {
  $(".timer").text(time);
}

function addOptionListener() {
  $(".settings-button").click(function () {
    chrome.runtime.openOptionsPage();
  });
}

function adjustColor(timeLeft) {
  var green = timeLeft * 10 > 255 ? 255 : timeLeft * 15;
  var red = Math.floor(255 / timeLeft);
  var color = "rgb(" + red + ", " + green + ", 0)";
  $(".timer").css("background-color", color);
}

document.addEventListener('DOMContentLoaded', function () {
  var bg = chrome.extension.getBackgroundPage();
  var time = bg.funTime;
  updateTime(time);
  addOptionListener();
  adjustColor(time);
});
