"use strict"

var eventList = ['onBeforeNavigate', 'onCreatedNavigationTarget',
    'onCommitted', 'onCompleted', 'onDOMContentLoaded',
    'onErrorOccurred', 'onReferenceFragmentUpdated', 'onTabReplaced',
    'onHistoryStateUpdated'];

  var urls = [];
  var funTime = 15.0;
  var funTimeMax = 30.0;
  var funTimeMin = 5.0;
  var funTimeRatio = 1.0;
  var timeUp = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(typeof request.options != undefined) {
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
  chrome.storage.sync.get("options", function(obj) {
    if (typeof obj.options != undefined) {
      setupOptions(obj.options);
    }
  });
})

chrome.alarms.onAlarm.addListener(function(alarm) {
    modifyTime();
});


var checkPage = function (info) {
  chrome.webNavigation.getAllFrames({tabId: info.tabId}, function(details) {
    details.forEach(function (detail){
      if(detail.frameId === 0 && checkUrl(detail.url)) {
        //alert("Not time to play yet!: ");
        chrome.tabs.update(info.tabId, {url: "chrome://newtab"});
      }
    });
  });
}

var modifyTime = function () {
  var add = true;
  var tabsProcessed = 0;
  chrome.tabs.query({active: true}, function(tabs) {
    tabs.forEach(function(tab) {
      tabsProcessed++;
      if (checkUrl(tab.url)) {
        add = false;
      }
      if (tabsProcessed === tabs.length) {
        add ? addTime() : subtractTime();
      }
    });
  });
}

var addTime = function() {
  if (funTime < funTimeMax) {
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
  funTimeRatio = options.ratio;
  funTimeMax = options.maxBr;
  funTimeMin = options.minBr;

  if (funTime > funTimeMax) { funTime = funTimeMax }
}
