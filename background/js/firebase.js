
var currentUser = new User;
var bookmarkDB;
var usersBookmarks = [];

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
        var website = request;
        saveData(website)
        sendResponse({ message: "Sending data to DB" });
    });

function saveData(website) {
    if (urlAlreadyExists(website.url)){
        bookmarkDB.child(getKeyFromUrl(website.url)).set(website);
    } else {
        bookmarkDB.push(website);
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
                bookmarks[k].clicks
            )
            usersBookmarks.push(bookmark)
        }
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











