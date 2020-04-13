console.log('hello from background')

let slinkyViewerIsOpen = false;

chrome.commands.onCommand.addListener(function(command) {
    if (command === "open-slinky" && !slinkyViewerIsOpen) {
        chrome.tabs.create({url:"slinky.html"});
        slinkyViewerIsOpen = true;
    } else {
        //TODO Close window 
    }
});