
let currentUser = new User;
let bookmarkDB;
let usersBookmarks = []; //Caching user bookmarks

firebase.initializeApp(firebaseConfig);

firebase.auth().signInAnonymously().catch(function (error) {
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser.isAnonymous = user.isAnonymous;
        currentUser.uId = user.uid;
        currentUser.refreshToken = user.refreshToken;
        initalizeFirebaseUpdateListener();
    } else {
        console.log("Authentication Error")
    }
});

function saveData(newBookmark) {  //This will update existing bookmark with new data
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
        if (data === null || data === undefined ) return 
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
        exists = (snapshot.val() !== null || undefined)
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
};

function deleteBookmark(bId) {
    firebase.database().ref(`/users/${currentUser.uId}/bookmarks/${bId}`).update({ isDeleted: true });
};

function updateAllBookmarks(data){
    usersBookmarks = data
};

function openChromeExtensionHotkeys(){
    chrome.tabs.create({
        active: true,
        url: 'chrome://extensions/shortcuts'
    }, null)
};

function getAllChromeCommands(){
    return chromeCommands;
}

function buildCache(data) {
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
                // bookmarks[k].isSelected, Both of these are local to chrome extension only and do not pass through to firebase
                // bookmarks[k].isInSearch,
            )
            bookmark.bId = k
            usersBookmarks.push(bookmark)
        }
    }
}

function loadCache(){
 
        function gotData(data) {
            buildCache(data)
        }

        function errData(data) {
            console.error("🔥🔥🔥")
            console.error(err)
        }   
    bookmarkDB = firebase.database().ref(`/users/${currentUser.uId}/bookmarks`)
    bookmarkDB.on('value', function (snapshot) {
        if (snapshot.val() !== undefined)
            bookmarkDB.on('value', gotData, errData)
    })
}

//Waiting for requests from the Tabs  
chrome.runtime.onMessage.addListener(
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
            case "openChromeExtensionHotkeys":
                openChromeExtensionHotkeys()
                sendResponse({ data: usersBookmarks })
                break;
            case "loadCache":
                loadCache();
                sendResponse({ data: usersBookmarks })
                break;
            case "SaveBookmark":
                saveData(task.data)
                sendResponse({ data: usersBookmarks });
            default:
                sendResponse({ data: usersBookmarks })
        }
        return true;
});



















