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

function loadOptions() {
  chrome.storage.sync.get("options", function (obj) {
    $("#break-ratio-dropdown option[value="+ obj.options.ratio + "]").prop("selected", true);
    $("#max-break-dropdown option[value="+ obj.options.maxBr + "]").prop("selected", true);;
    $("#min-break-dropdown option[value="+ obj.options.minBr + "]").prop("selected", true);;
  });
}

function addSite() {

}

function removeSite() {

}

function _getOptions() {
  var options = {};

//  options.sites = $('.sites-list');
  options.ratio = $('#break-ratio-dropdown').val();
  options.maxBr = $('#max-break-dropdown').val();
  options.minBr = $('#min-break-dropdown').val();

  return options;
}

$(document).ready(function () {
  loadOptions();
});
