import React, { Component } from 'react';
import Bookmark from './Bookmark';
import SearchBar from './SearchBar';
import "regenerator-runtime/runtime";


export class BookmarkContainer extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = {
            bookmarks: [],
            searchResults: [],
            currentSearch: []
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.bookmarkService("getAllbookmarks", null)
        this.pollBookmarks()
    }
    
    deleteBookmark = (bId) => {
        
        var bookmarks = this.state.bookmarks 
        var newState = []
        for (let i = 0; i < bookmarks.length; i++) {
            if (bookmarks[i].bId == bId){
                bookmarks[i].isInSearch = false //Hides bookmark while delete takes place
            }
            newState.push(bookmarks[i])
        }
        this.setState({ bookmarks: newState})
        this.bookmarkService("deleteBookmark", bId);
        this.bookmarkService("getAllbookmarks", null)
    }

    updateSearchTerms = (e) => {
        var searchString = e.target.value
        if (searchString === " " || searchString === ""){
            var newState = []
            var bookmarks = this.state.bookmarks
            for (let i = 0; i < bookmarks.length; i++) {
                console.log("showing all")
                bookmarks[i].isInSearch = true
                newState.push(bookmarks[i])      
            }
            this.setState({ bookmarks: newState })
            this.bookmarkService("updateAllBookmarks", null, newState)
        }
        if (searchString.charAt(searchString.length - 1 ) === " ") { 
            var currentSearch = searchString.toLowerCase().trim().split(" ")
            this.filterBookmarks(this.state.bookmarks, currentSearch)
        }
    }

    openBookmark = (url) => {
        window.open(url, "_blank")
    }

    bookmarkService = (task, bookmarkId, sendData) => {
        //Leaving this function in as here allows the state to update instantly and I can polling take longer
        let fetchBookmarks = new Promise(function (resolve, reject) {
            var data
            chrome.runtime.sendMessage("eniajemgofmchohalpnjoodmpbkgegna", { task: task, bId: bookmarkId, data: sendData }, function (response) {
                data = response.data
                resolve(data)
            })
        })
        fetchBookmarks.then((data) => {
            if (this._isMounted) {
                this.setState({ bookmarks: data })
            }
        })
    }

    pollBookmarks = () => { 
        //Cant add listener on the chrome ext tab with chrome extensions so need to poll
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
        }, 5000);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    filterBookmarks = (allBookmarks, searchTerms) => {
        var searchTermCount = searchTerms.length
        var searchResults = []
        var sortableBookmarks = []
        for (let i = 0; i < allBookmarks.length; i++) {
            let bookmark = allBookmarks[i]
            let searchScore = 0 
            for (let i = 0; i < searchTerms.length; i++) {
                if (bookmark.tags.includes(searchTerms[i])){
                    searchScore++
                }
            }
            sortableBookmarks.push([bookmark, searchScore])
        }
        sortableBookmarks.sort(function(a, b) {
            return b[1] - a[1];
        });
        for (let i = 0; i < sortableBookmarks.length; i++) {
            let bookmarkScore = sortableBookmarks[i][1]
            let bookmark = sortableBookmarks[i][0]
            if (bookmarkScore >= searchTermCount ){
                bookmark.isInSearch = true
                searchResults.push(bookmark)
            } else {
                bookmark.isInSearch = false
                searchResults.push(bookmark)
            }
        }
        this.setState({ bookmark: searchResults})
        this.bookmarkService("updateAllBookmarks", null, searchResults)
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

export default BookmarkContainer