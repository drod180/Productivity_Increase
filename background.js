var urls = ["https://www.facebook.com/", "http://na.op.gg/"];

var eventList = ['onBeforeNavigate', 'onCreatedNavigationTarget',
    'onCommitted', 'onCompleted'];

var funTime = 0;

urls.forEach(function(url) {
  eventList.forEach(function(e) {
    chrome.webNavigation[e].addListener(function(info) {
      alert(funTime);
      if (funTime === 0) {
        //chrome.tabs.update(info.tabId, {url: "about:blank"});
        alert(e + " " + info.url);
      }
    },
    {
      url: [{
        urlPrefix: url
      }],
    });
  });
});

chrome.alarms.create("TimeCheck", {periodInMinutes:0.1});

chrome.alarms.onAlarm.addListener(function (alarm){
    modifyTime();
});

var modifyTime = function () {
  var add = true;
  chrome.tabs.query({active: true}, function (tab) {
    tab.forEach(function (tabEl) {
      if (checkUrl(tabEl.url)) {
        add = false;
      }
    });
  });

  add ? addtime() : subtractTime();
}

var addTime = function () {
  if (funTime < 30) {
    funTime += 1;
  }
}

var subtractTime = function () {
  if (funTime > 0) {
    funTime -= 1;
  }
}

var checkUrl = function (inputUrl) {
}
