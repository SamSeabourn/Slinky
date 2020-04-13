
///chrome.tabs.create({url:"popup.html"});
/////////////////THIS IS HOW YOU GET THE BOOKMARK LIBRARY PAGE TO OPEN!!!

var currentUser = new User;
var bookmarkDB;
var currentLinks;

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
    bookmarkDB = firebase.database().ref().child("users").child(currentUser.uId).child("bookmarks");
    bookmarkDB.on('value', snap => console.log(snap.val()));
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











