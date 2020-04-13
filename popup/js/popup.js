let currentWebsiteUrlElement;
let tagInputElement;
let tagContainerElement;
let currentWebsiteTitleElement;
let currentWebsiteImageElement;

let currentWebsite = new Bookmark();

document.addEventListener('DOMContentLoaded', function () {

  currentWebsiteTitleElement = document.getElementById('currentWebsiteTitleElement');
  currentWebsiteUrlElement = document.getElementById('currentWebsiteUrlElement');
  tagInputElement = document.getElementById('tagInputElement');
  tagContainerElement = document.getElementById('tagContainerElement');
  currentWebsiteImageElement = document.getElementById('currentWebsiteImageElement');

  tagInputElement.focus();

  chrome.tabs.getSelected(null, function (tab) {
    console.log(tab)
    if (tab.url !== undefined || tab.url !== null) {
      currentWebsite.url = tab.url;
    }
    if (tab.favIconUrl === "") {
      currentWebsite.favicon = "../../icons/icon16.png";
    } 
    if (tab.title !== undefined || tab.title !== null) {
      currentWebsite.title = tab.title;
    }
    updatePopup();
  });
}, false);

document.addEventListener('keydown', checkKeys);

function checkKeys(e) {
  if (e.code === "Space" && tagInputElement.value != " ") {
    updateTags(currentWebsite.tags);
  }
  if (e.code === "Enter") {
    updateTags(currentWebsite.tags);
    sendWebsiteToFirebase();
    showLoader()
  }
}

function updatePopup() {
  currentWebsiteUrlElement.innerHTML = currentWebsite.url;
  currentWebsiteTitleElement.innerHTML = currentWebsite.title;
  currentWebsiteImageElement.src = currentWebsite.favicon
}

function renderTags(tags) {
  tagContainerElement.innerHTML = "";
  for (let i = 0; i < tags.length; i++) {
    var tagElement = document.createElement("SPAN");
    tagElement.innerHTML = '#' + tags[i];
    tagElement.classList.add("slinkyTag")
    tagContainerElement.appendChild(tagElement)
  }
}

function updateTags() {
  cleanedInput = tagInputElement.value.trim().toLowerCase();
  if (!currentWebsite.tags.includes(cleanedInput) && cleanedInput.length > 0) {
    currentWebsite.tags.push(cleanedInput)
  };
  tagInputElement.value = "";
  renderTags(currentWebsite.tags)
}


function sendWebsiteToFirebase() {
  chrome.runtime.sendMessage(currentWebsite, function(response) {
  });
}

function showLoader() {
  var slinkyBox = document.getElementById('slinkyBox');
  var loaderDiv = document.getElementById('loaderDiv');
  slinkyBox.classList.remove('show');
  slinkyBox.classList.add('hide');
  loaderDiv.classList.remove('hidden')
  loaderDiv.classList.add('show')
}


