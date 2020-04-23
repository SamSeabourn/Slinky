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

  // tagInputElement.focus();

  chrome.tabs.getSelected(null, function (tab) {
    if (tab.url !== undefined || tab.url !== null) {
      currentWebsite.url = tab.url;
    }
    if (tab.favIconUrl === "" || tab.favIconUrl === undefined) {
      currentWebsite.favicon = "../../icons/broken-image.svg";
    }
    else {
      currentWebsite.favicon = tab.favIconUrl;
    }
    if (tab.title !== undefined || tab.title !== null) {
      currentWebsite.title = tab.title;
    }
    updatePopup();
    inputScroller(currentWebsiteTitleElement, 25)
    inputScroller(currentWebsiteUrlElement, 35)
  });

}, false);

//REDO THIS SHIT AND THINK OF BETTER SHORTCUTS --> https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code
document.addEventListener('keydown', checkKeys);
function checkKeys(e) {
  if (e.code === "Space" && tagInputElement.value != " ") {
    updateTags(currentWebsite.tags);
  }
  if (e.code === "Enter") {
    updateTags(currentWebsite.tags);
    sendWebsiteToFirebase();
    uploadCompleteMessage();
  }
}


function updatePopup() {
  currentWebsiteUrlElement.value = currentWebsite.url;
  currentWebsiteTitleElement.value = currentWebsite.title;
  currentWebsiteImageElement.src = currentWebsite.favicon
}

function renderTags(tags) {
  tagContainerElement.innerHTML = "";
  for (let i = 0; i < tags.length; i++) {
    var tagElement = document.createElement("SPAN");
    tagElement.innerHTML = '#' + tags[i];
    tagElement.classList.add("slinky-tag")
    tagElement.onclick = function () { removeTagFromList(tags[i]); };
    tagContainerElement.appendChild(tagElement)
  }
}

function removeTagFromList(tag) {
  currentWebsite.tags = currentWebsite.tags.filter(t => t !== tag)
  renderTags(currentWebsite.tags)
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
  chrome.runtime.sendMessage(currentWebsite, function (response) {
  });
}

function uploadCompleteMessage() {
  var uploadCompleteDiv = document.getElementsByClassName('slinky-upload-complete')[0];
  var shownDivs = document.getElementsByClassName('fade-out')
  debugger;
  for (let i = 0; i < shownDivs.length; i++) {
    console.log(shownDivs[i])
    shownDivs[i].classList.remove('show')
    shownDivs[i].classList.add('hide');
  }
  uploadCompleteDiv.classList.remove('hidden')
  uploadCompleteDiv.classList.add('show')
}

function inputScroller(inputElement, maxCharacterCount) {
  var characterCount = inputElement.value.length;
  var speed = (characterCount > (maxCharacterCount + 20) ? 30 : 100)
  if (characterCount > maxCharacterCount) {
    var previousScrollPosition = -1 //intializer must be less than zero
    setInterval(function () {
      if (inputElement.scrollLeft > previousScrollPosition || inputElement.scrollLeft === 0) {
        previousScrollPosition = inputElement.scrollLeft
        inputElement.scrollLeft = inputElement.scrollLeft + 1
      } else {
        inputElement.scrollLeft = inputElement.scrollLeft - 1
      }
    }, speed );
  }
}


function updateShortCutInfo(){
  var shortcutMessage = document.getElementById("tagInputElement")
}




