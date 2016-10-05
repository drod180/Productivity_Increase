/*Save options in chrome storage
* Options -
* Filtered Sites
* Work to break ratio
* Maximum break time
*/
function saveOptions() {
  chrome.storage.sync.set({
    options: options
  })
}

function loadOptions() {

}

function addSite() {

}

function removeSite() {

}
