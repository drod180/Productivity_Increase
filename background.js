var urls = ["facebook.com", "twitch.tv", "op.gg"];

var eventList = ['onBeforeNavigate', 'onCreatedNavigationTarget',
    'onCommitted', 'onCompleted', 'onDOMContentLoaded',
    'onErrorOccurred', 'onReferenceFragmentUpdated', 'onTabReplaced',
    'onHistoryStateUpdated'];


var funTime = 15.0;

eventList.forEach(function(e) {
  chrome.webNavigation[e].addListener(function(info) {
    if (funTime === 0) {
      checkPage(info);
    }
  });
});

chrome.runtime.onInstalled.addListener(function () {
    chrome.alarms.create("TimeCheck", {periodInMinutes:0.1});
});


chrome.alarms.onAlarm.addListener(function(alarm) {
    modifyTime();
    console.log(funTime);
});


var checkPage = function (info) {
  chrome.webNavigation.getAllFrames({tabId: info.tabId}, function(details) {
    details.forEach(function (detail){
      if(detail.frameId === 0 && checkUrl(detail.url)) {
        alert("Back to work!: " + detail.url);
        //chrome.tabs.update(info.tabId, {url: "about:blank"});
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
  if (funTime < 30) {
    funTime += 0.25;
  }
}

var subtractTime = function() {
  funTime > 1 ? funTime -= 1 : funTime = 0;
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
