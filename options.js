/*Save options in chrome storage
* Options -
* Filtered Sites
* Work to break ratio
* Maximum break time
*/
function saveOptions() {
  var options = _getOptions();
  chrome.storage.sync.set({
    options: options
  }, function() {
    console.log("Data saved!");
  });
}

//Loads items to saved values
function loadOptions() {
  chrome.storage.sync.get("options", function(obj) {
    if (obj.options) {
      obj.options.sites.forEach(function(url) {
        addSite(url);
      });
      $("#break-ratio-dropdown option[value=\""+ obj.options.ratio + "\"]").prop("selected", true);
      $("#max-break-dropdown option[value="+ obj.options.maxBr + "]").prop("selected", true);;
      $("#min-break-dropdown option[value="+ obj.options.minBr + "]").prop("selected", true);;
    }
  });
}

function addSite(inputUrl) {
  var url = _formatUrl(inputUrl);
  var sites = $(".sites-list");
  var $li = $("<li class=\"sites-list-item\">" + url + "</li>");
  var $a = $("<a class=\"delete-button\">delete</a>");
  $a.click(function() {
    $(this).parent().remove()
  })
  $li.append($a);
  sites.append($li);
}

function _formatUrl(url) {
  var u = new URL(url);
  return u.hostname;
}

function _getOptions() {
  var options = {};

  options.sites = [];
  var sites = $('.sites-list li');
  sites.each(function() {
    options.sites.push(($(this).text()));
  });
  options.ratio = $('#break-ratio-dropdown').val();
  options.maxBr = $('#max-break-dropdown').val();
  options.minBr = $('#min-break-dropdown').val();

  return options;
}

function addSiteListener() {
  console.log("added listener");
  $(".sites-form").submit(function(e) {
    e.preventDefault();
    var site = $(".sites-textbox").val();
    addSite(site);
  });
}

$(document).ready(function () {
  loadOptions();
  addSiteListener();
});
