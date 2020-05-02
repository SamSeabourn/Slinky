
var currentUser = new User;
var bookmarkDB;
let usersBookmarks = []; //Caching user bookmarks

firebase.initializeApp(firebaseConfig);

firebase.auth().signInAnonymously().catch(function (error) {
    //Todo Error handling
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser.isAnonymous = user.isAnonymous;
        currentUser.uId = user.uid;
        currentUser.refreshToken = user.refreshToken;
        initalizeFirebaseUpdateListener();
    } else {
        console("Authentication Error")
    }
});

function saveData(newBookmark) {         //This will update existing bookmark with new data
    if (urlAlreadyExists(newBookmark.url)) {
        updateBookmark(getKeyFromUrl(newBookmark.url), newBookmark)
    } else {
        bookmarkDB.push(newBookmark);
    }
}

function updateBookmark(bookmarkId, updatedBookmark) {
    bookmarkDB.child(bookmarkId).set(updatedBookmark);
}

function initalizeFirebaseUpdateListener() {
    function gotData(data) {
        usersBookmarks = [];
        var bookmarks = data.val()
        var keys = Object.keys(bookmarks)
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i]
            if (!bookmarks[k].isDeleted) {

                var bookmark = new Bookmark(
                    bookmarks[k].url,
                    bookmarks[k].favicon,
                    bookmarks[k].title,
                    bookmarks[k].tags,
                    bookmarks[k].clicks,
                    // bookmarks[k].isInSearch,
                )
                bookmark.bId = k
                usersBookmarks.push(bookmark)
            }
        }
    }

    function errData(data) {
        console.error("Error")
        console.error(err)
    }

    bookmarkDB = firebase.database().ref(`/users/${currentUser.uId}/bookmarks`)

    bookmarkDB.on('value', function (snapshot) {
        if (snapshot.val() !== undefined)
            bookmarkDB.on('value', gotData, errData)
    })
}

function urlAlreadyExists(url) {
    let exists;
    bookmarkDB.orderByChild('url').equalTo(url).on("value", function (snapshot) {
        exists = (snapshot.val() !== null)
    })
    return exists;
}

function getKeyFromUrl(url) {
    let key;
    bookmarkDB.orderByChild('url').equalTo(url).on("value", function (snapshot) {
        exists = (snapshot.val() !== null)
        key = Object.keys(snapshot.val())[0];
    })
    return key;
}

// function sendUserBookmarksToContent(){
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
//         });
//       });
// }

function deleteBookmark(bId) {
    firebase.database().ref(`/users/${currentUser.uId}/bookmarks/${bId}`).update({ isDeleted: true });
}

function updateAllBookmarks(data){
    usersBookmarks = data
}

//Waiting for data from the popup.js
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        var newBookmark = request;
        saveData(newBookmark)
        sendResponse({ message: "Sending data to DB" });
    });

//Waiting for requests from the Tabs  
chrome.runtime.onMessageExternal.addListener(
    function (task, sender, sendResponse) {
        switch (task.task) {
            case "getAllbookmarks":
                sendResponse({ data: usersBookmarks })
                break;
            case "deleteBookmark":
                deleteBookmark(task.bId)
                sendResponse({ data: usersBookmarks })
                break;
            case "updateAllBookmarks":
                updateAllBookmarks(task.data)
                sendResponse({ data: usersBookmarks })
                break;
            default:
                sendResponse({ data: "BAD REQUEST BRAH" })
                break;
        }
    });


















