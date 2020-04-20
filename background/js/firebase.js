
var currentUser = new User;
var bookmarkDB;
let usersBookmarks = [];

firebase.initializeApp(firebaseConfig);


firebase.auth().signInAnonymously().catch(function (error) {
    console.log(error.code)
    console.log(error.message)
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser.isAnonymous = user.isAnonymous;
        currentUser.uId = user.uid;
        currentUser.refreshToken = user.refreshToken
        setFirebaseUpdateListener()
    } else {
        console("Auth Error")
    }
});

/// Waiting on post from popup.jj
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        var newBookmark = request;
        saveData(newBookmark)
        sendResponse({ message: "Sending data to DB" });
    });

function saveData(newBookmark) {
    if (urlAlreadyExists(newBookmark.url)){
        bookmarkDB.child(getKeyFromUrl(newBookmark.url)).set(newBookmark);
    } else {
        bookmarkDB.push(newBookmark);
    } 
}

function setFirebaseUpdateListener(){

    // Needs to rebuild the object from Firebase
    function gotData(data){
        usersBookmarks = [];
        var bookmarks = data.val()
        var keys = Object.keys(bookmarks)
        for (var i = 0; i < keys.length; i++ ){
            var k = keys[i]
            var bookmark = new Bookmark(
                bookmarks[k].url,
                bookmarks[k].favicon,
                bookmarks[k].title,
                bookmarks[k].tags,
                bookmarks[k].clicks, 
            )
            bookmark.bId = k //Grabbing the key direct from firebase
            usersBookmarks.push(bookmark)
        }
        console.log("this is the object from the DB braaah")
        console.log(usersBookmarks);
    }
    
    function errData(data){
        console.error("Error")
        console.error(err)
    }

    bookmarkDB = firebase.database().ref().child("users").child(currentUser.uId).child("bookmarks");
    bookmarkDB.on('value', function(snapshot) {
        if (snapshot.val() !== undefined)
        bookmarkDB.on('value', gotData, errData)
    })
}


function urlAlreadyExists(url){
    let exists;
    bookmarkDB.orderByChild('url').equalTo(url).on("value", function(snapshot) {
        exists = (snapshot.val() !== null )
    })
    return exists;
}

function getKeyFromUrl(url){
    let key;
    bookmarkDB.orderByChild('url').equalTo(url).on("value", function(snapshot) {
        exists = (snapshot.val() !== null )
        key = Object.keys(snapshot.val())[0];
    })
    return key;
}

function sendUserBookmarksToContent(){
        console.log("sending users bookmarks")
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, { data: usersBookmarks }, function(response) {
                console.log(response)
                console.log(response)
            });  
        });
    }



chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
      console.log(request.request)
      if (request.message === "getAllbookmarks"){
        sendResponse({data: usersBookmarks})
        // sendUserBookmarksToContent()
      }
      else {
        sendResponse({message: "wrong request G"})
      } 
    });















