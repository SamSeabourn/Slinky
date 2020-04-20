console.log('hello from the content script')


chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    document.dispatchEvent(new CustomEvent('csEvent', {data: request}));




});



