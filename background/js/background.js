
// This needs to check the tab isnt already open
let slinkyIsOpen = false;

chrome.commands.onCommand.addListener(function(command) {
    if (command === "open-slinky" && !slinkyIsOpen) {

        chrome.tabs.create({url:"../../tab/app/index.html"});
        var x = chrome.commands.getAll()
        slinkyViewerIsOpen = true;
        console.log(x)
    } else {
        //TODO Close window 
    }
});



chrome.commands.getAll(function(commands){
    console.log(commands)
  })