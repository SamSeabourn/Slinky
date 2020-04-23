
import React, { Component } from 'react';
import Bookmark from './Bookmark';
import SearchBar from './SearchBar';
import "regenerator-runtime/runtime";



export class BookmarkContainer extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = {
            bookmarks: [

            ],
            currentSearch: []
        };

    }

    componentDidMount() {
        this._isMounted = true;
        this.pollBookmarks()

        console.log(this)    
    }
    

    deleteBookmark = (bId) => {
        this.bookmarkService("deleteBookmark", bId)
        // this.bookmarkService("getAllbookmarks", null)
    }

    updateSearchTerms = (e) => {
        this.setState({ currentSearch: e.target.value.toLowerCase().trim().split(" ") })
        console.log(this.state.currentSearch)
    }

    openBookmark = (url) => {
        console.log(url)
        window.open(url, "_blank")
    }

    bookmarkService = (task, bookmarkId) => {
            chrome.runtime.sendMessage("eniajemgofmchohalpnjoodmpbkgegna", { task: task, bId: bookmarkId }, function (response) {
                console.log(response)
            })
    }

    pollBookmarks = () => { //Cant add listener on the tab with chrome extensions 
        setInterval(() => {
            let fetchBookmarks = new Promise(function (resolve, reject) {
                var data
                chrome.runtime.sendMessage("eniajemgofmchohalpnjoodmpbkgegna", { task: "getAllbookmarks" }, function (response) {
                    data = response.data
                    resolve(data)
                })
            })
            fetchBookmarks.then((data) => {
                if (this._isMounted) {
                    this.setState({ bookmarks: data })
                }
            })
          }, 1000);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    render() {
        return (
            <div className="bookmarkcontainer-flexbox">
                <div className="search-area">
                    <SearchBar
                        updateSearchTerms={this.updateSearchTerms}
                        disableLinkOpen={this.disableLinkOpen}
                        enableLinkOpen={this.enableLinkOpen}
                    />
                    <div className="slinky-search-underscore"></div>
                    <div className="bookmark-container">
                        {this.state.bookmarks.map((bookmark) => {
                                return <Bookmark
                                    key={bookmark.bId}
                                    bookmark={bookmark}
                                    deleteBookmark={this.deleteBookmark}
                                    openBookmark={this.openBookmark}
                                />
                            }
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

// chrome.runtime.addListener(
//     function(request, sender, sendResponse) {
//       console.log(sender.tab ?
//                   "from a content script:" + sender.tab.url :
//                   "from the extension");
//       if (request.greeting == "hello")
//         sendResponse({farewell: "goodbye"});
//     });

console.log(chrome.runtime.onMessage)


export default BookmarkContainer