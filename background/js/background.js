// This needs to check the tab isnt already open

chrome.commands.onCommand.addListener(function(command) {
    if (command === "open-slinky" && !slinkyIsOpen) {
        chrome.tabs.create({url:"../../tab/app/index.html"});
        slinkyViewerIsOpen = true;
    }
});




