"use strict"

var eventList = ['onBeforeNavigate', 'onCreatedNavigationTarget',
    'onCommitted', 'onCompleted', 'onDOMContentLoaded',
    'onErrorOccurred', 'onReferenceFragmentUpdated', 'onTabReplaced',
    'onHistoryStateUpdated'];

var urls = [];
var funTime = 15.0;
var funTimeMax = 30.0;
var funTimeMin = 0.0;
var funTimeRatio = 1.0;
var timeUp = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(typeof request.options != "undefined") {
    setupOptions(request.options);
  }
});

eventList.forEach(function(e) {
  chrome.webNavigation[e].addListener(function(info) {
    if (timeUp) {
      checkPage(info);
    }
  });
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.alarms.create("TimeCheck", {periodInMinutes: 1});
});

chrome.runtime.onStartup.addListener(function () {
  getAttributes();
});

//Every time alarm goes off get the attributes, adjust the timer and update
//memory with the new time.
chrome.alarms.onAlarm.addListener(function(alarm) {
  getAttributes();
  modifyTime();
  chrome.storage.sync.set({ time: funTime });
});

var getAttributes = function () {
  chrome.storage.sync.get(["options", "time"], function(obj) {
    if (typeof obj.options != "undefined") {
      setupOptions(obj.options);
    }
    if (typeof obj.time != "undefined") {
      funTime = parseInt(obj.time);
    }
  });
}

var checkPage = function (info) {
  chrome.webNavigation.getAllFrames({tabId: info.tabId}, function(details) {
    details.forEach(function (detail){
      if(detail.frameId === 0 && checkUrl(detail.url)) {
        chrome.tabs.update(info.tabId, {url: "chrome://newtab"});
      }
    });
  });
}

var modifyTime = function () {
  var add = true;
  var tabsProcessed = 0;
  chrome.tabs.query({active: true}, function(tabs) {
    if (typeof tabs != undefined) {
      tabs.forEach(function(tab) {
        tabsProcessed++;
        if (checkUrl(tab.url)) {
          add = false;
        }
        if (tabsProcessed === tabs.length) {
          add ? addTime() : subtractTime();
        }
      });
    }
  });
}

var addTime = function() {
  //check for zero to account for unlimited funTimeMax value
  if (funTime < funTimeMax || funTimeMax === 0) {
    funTime += funTimeRatio;
  }
  if (timeUp && funTime > funTimeMin) {
    timeUp = false;
  }
}

var subtractTime = function() {
  funTime > 1 ? funTime -= 1 : funTime = 0;
  if (funTime === 0) {
    timeUp = true;
    alert("Get back to work!");
  }
}

var checkUrl = function(inputUrl) {
  var parser = document.createElement('a');
  parser.href = inputUrl;

  var match = false;
  urls.forEach(function(url) {
    var comparer = new RegExp(url);
    if (parser.hostname.match(comparer)) {
      match = true;
    }
  });

  return match;
}

var setupOptions = function(options) {
  urls = options.sites;
  funTimeRatio = parseInt(options.ratio);
  funTimeMax = parseInt(options.maxBr);
  funTimeMin = parseInt(options.minBr);

  if (funTime > funTimeMax) { funTime = funTimeMax }
}
