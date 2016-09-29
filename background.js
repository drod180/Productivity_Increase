var urls = ["https://www.facebook.com/", "http://na.op.gg/"];
//var urls = ["facebook", "op.gg"];

var eventList = ['onBeforeNavigate', 'onCreatedNavigationTarget',
    'onCommitted', 'onCompleted', 'onDOMContentLoaded',
    'onErrorOccurred', 'onReferenceFragmentUpdated', 'onTabReplaced',
    'onHistoryStateUpdated'];


var funTime = 0.0;

eventList.forEach(function(e) {
  chrome.webNavigation[e].addListener(function(info) {
    if (funTime === 0) {
      chrome.webNavigation.getAllFrames({tabId: info.tabId}, function(details) {
        details.forEach(function (detail){
          if(detail.frameId === 0) {
            console.log("Back to work!: " + detail.url);
            //chrome.tabs.update(info.tabId, {url: "about:blank"});
          }
        });
      });
    }
  });
});

chrome.alarms.create("TimeCheck", {periodInMinutes:0.1});

chrome.alarms.onAlarm.addListener(function(alarm) {
    modifyTime();
});

var modifyTime = function () {
  var add = true;
  chrome.tabs.query({active: true}, function(tab) {
    tab.forEach(function(tabEl) {
      if (checkUrl(tabEl.url)) {
        add = false;
      }
    });
  });

  add ? addTime() : subtractTime();
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
}
