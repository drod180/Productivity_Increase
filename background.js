var urls = ["https://www.facebook.com/", "http://na.op.gg/"];

urls.forEach(function(url) {
  chrome.webNavigation.onCommitted.addListener(function(info) {
    chrome.tabs.update(info.tabId, {url: "about:blank"});
  },
  {
    url: [{
      urlPrefix: url
    }],
  });
})
