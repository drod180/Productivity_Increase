var urls = ["https://www.facebook.com/", "http://na.op.gg/"];

var eventList = ['onBeforeNavigate', 'onCreatedNavigationTarget',
    'onCommitted', 'onCompleted'];

var funTime = 3;

urls.forEach(function(url) {
  eventList.forEach(function(e) {
    chrome.webNavigation[e].addListener(function(info) {
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
