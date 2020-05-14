let currentWebsiteUrlElement;
let tagInputElement;
let tagContainerElement;
let currentWebsiteTitleElement;
let currentWebsiteImageElement;
let currentWebsite = new Bookmark();
let chromeCommands;
let shortcutMessage1;

chrome.commands.getAll(function(commands){
  chromeCommands = commands
})

document.addEventListener('DOMContentLoaded', function () {
  currentWebsiteTitleElement = document.getElementById('currentWebsiteTitleElement');
  currentWebsiteUrlElement = document.getElementById('currentWebsiteUrlElement');
  tagInputElement = document.getElementById('tagInputElement');
  tagContainerElement = document.getElementById('tagContainerElement');
  currentWebsiteImageElement = document.getElementById('currentWebsiteImageElement');
  shortcutMessage1 = document.getElementById('shortcutMessage1');
  shortcutMessage2= document.getElementById('shortcutMessage2');

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

window.addEventListener("keydown", function(e) {
  if (e.key === " " && tagInputElement.value != " ") {
    updateTags(currentWebsite.tags);
  }
  if (e.key === "Enter" && currentWebsite.tags.length > 0) {
    updateTags(currentWebsite.tags);
    showHideSlinkyTips("hide")
    updateTitle();
    sendWebsiteToFirebase();
    showUploadCompleteMessage();
  }
}, true);

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
  showHideSlinkyTips('show')
}

function updateTitle() {
  currentWebsite.title = currentWebsiteTitleElement.value
}

function sendWebsiteToFirebase() {
  chrome.runtime.sendMessage("eniajemgofmchohalpnjoodmpbkgegna", {task: 'SaveBookmark', data: currentWebsite }, function (response) {
  });
}

function showUploadCompleteMessage() {
  shortcutMessage1.innerHTML = createShortcutString("Press","to see your saved links", 1);
  var uploadCompleteDiv = document.getElementsByClassName('slinky-upload-complete')[0];
  var shownDivs = document.getElementsByClassName('fade-out')
  for (let i = 0; i < shownDivs.length; i++) {
    shownDivs[i].classList.remove('show')
    shownDivs[i].classList.add('hide');
  }
  uploadCompleteDiv.classList.remove('hidden')
  uploadCompleteDiv.classList.add('show')

}

function showHideSlinkyTips(display) {
  var slinkyTipsDiv = document.getElementById('slinky-delete-tip')
  switch(display){
    case "show":
      slinkyTipsDiv.classList.remove('hide')
      slinkyTipsDiv.classList.add('show')
      break;
    case "hide":
      slinkyTipsDiv.classList.remove('show')
      slinkyTipsDiv.classList.add('hide')
      break;
    default:
      return
  }
}

function inputScroller(inputElement, maxCharacterCount) {
  var increment = 1 
  function waitTime(ms) {
      increment = 0
      setTimeout(function () { increment = 1 }, ms);
  }
  var characterCount = inputElement.value.length;
  var speed = (characterCount > (maxCharacterCount + 5) ? 40 : 100)
  var scrollRight = true
  var scrollLeft  = false 
  
  if (characterCount > maxCharacterCount) {
    var previousScrollPosition = -1 //intializer must be less than zero
    setInterval(function () {
      if (inputElement.scrollLeft > previousScrollPosition || inputElement.scrollLeft === 0) {
        if (scrollRight) {
          scrollRight = !scrollRight
          scrollLeft = true
          waitTime(3000)
        }
        previousScrollPosition = inputElement.scrollLeft
        inputElement.scrollLeft = inputElement.scrollLeft + increment
      } else {
        if (scrollLeft) {
          scrollLeft = !scrollLeft
          scrollRight = true
          waitTime(3000)
        }
        inputElement.scrollLeft = inputElement.scrollLeft - increment
      }
    }, speed );
  }
}

function createShortcutString(startOfMessage, endOfMessage, commandNumber){
  const openSlinkyKeys = chromeCommands[commandNumber].shortcut.split("+")
  let resultString = startOfMessage + " ";
  for (let i = 0; i < openSlinkyKeys.length; i++) {
    resultString = resultString + `<span class="short-cut-keys">${ openSlinkyKeys[i] }</span>`
    if (i < openSlinkyKeys.length-1){
      resultString = resultString + "+"
    }
  }
  resultString = resultString + " " + endOfMessage
  return resultString
}