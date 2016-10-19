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
  chrome.alarms.create("TimeCheck", {periodInMinutes: 0.01});
});

chrome.runtime.onStartup.addListener(function () {
  getAttributes();
  chrome.storage.sync.get("time", function(obj) {
    if (typeof obj.time != "undefined") {
      funTime = parseFloat(obj.time);
    }
  });
});

//Every time alarm goes off adjust the timer, update memory with the new time.
// and get the attributes.
chrome.alarms.onAlarm.addListener(function(alarm) {
  modifyTime();
  getAttributes();
  chrome.storage.sync.set({ time: funTime });
});

var getAttributes = function () {
  chrome.storage.sync.get("options", function(obj) {
    if (typeof obj.options != "undefined") {
      setupOptions(obj.options);
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
  var windowsProcessed = 0;
  chrome.windows.getAll({populate:true}, function(windows) {

    windows.forEach(function(window){

      windowsProcessed++;
      window.tabs.forEach(function(tab){
        if (tab.active && checkUrl(tab.url)) {
          add = false;
        }
      });
      if (windowsProcessed === windows.length) {
        add ? addTime() : subtractTime();
      }

    });

  });
}
//
// var modifyTime = function () {
//   var add = true;
//   var tabsProcessed = 0;
//   chrome.tabs.query({active: true}, function(tabs) {
//     if (typeof tabs != undefined) {
//       tabs.forEach(function(tab) {
//         tabsProcessed++;
//         if (checkUrl(tab.url)) {
//           add = false;
//         }
//         if (tabsProcessed === tabs.length) {
//           add ? addTime() : subtractTime();
//         }
//       });
//     }
//   });
// }

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
  funTimeRatio = parseFloat(options.ratio);
  funTimeMax = parseFloat(options.maxBr);
  funTimeMin = parseFloat(options.minBr);

  if (funTimeMax != 0 && funTime > funTimeMax) { funTime = funTimeMax; }
  if (funTime < funTimeMin) { timeUp = true; }
}
