import React, { Component } from 'react';
import Bookmark from './Bookmark';
import SearchBar from './SearchBar';
import BookmarkContainerHelper from './BookmarkContainerHelper'
import "regenerator-runtime/runtime";


export class BookmarkContainer extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = {
            bookmarks: [],
            searchResults: [],
            currentSearch: [],
            currentSelection: 0,
            currentSelectionBookmark: null,
            chromeCommands: null
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.chromeExtensionService("loadCache")
        this.chromeExtensionService("getAllbookmarks", null)
        this.pollBookmarks()
    }
    
    deleteBookmark = (bId) => {
        var bookmarks = this.state.bookmarks 
        var newState = []
        for (let i = 0; i < bookmarks.length; i++) {
            var bookmark = bookmarks[i]
            if (bookmark.bId == bId) bookmark.isInSearch = false //Hides bookmark while delete takes place
            newState.push(bookmark)
        }
        this.chromeExtensionService("deleteBookmark", bId);
        this.chromeExtensionService("updateAllBookmarks", null, newState) 
    }

    updateSearchTerms = (e) => {
        var searchString = e.target.value
        if (searchString === " " || searchString === ""){
            var newState = []
            var bookmarks = this.state.bookmarks
            for (let i = 0; i < bookmarks.length; i++) {
                bookmarks[i].isInSearch = true
                newState.push(bookmarks[i])      
            }
            this.setState({ bookmarks: newState })
            this.chromeExtensionService("updateAllBookmarks", null, newState)
        }
        if (searchString.charAt(searchString.length - 1 ) === " ") { 
            var currentSearch = searchString.toLowerCase().trim().split(" ")
            this.filterBookmarks(this.state.bookmarks, currentSearch)
        }
    }

    openBookmark = (url) => {
        window.open(url, "_blank")
        this.clearCurrentSelection();
    }

    chromeExtensionService = (task, bookmarkId, sendData) => {
        //Leaving this function in as here allows the state to update instantly and I can polling take longer
        let fetchBookmarks = new Promise(function (resolve, reject) {
            var data
            chrome.runtime.sendMessage(chrome.runtime.id, { task: task, bId: bookmarkId, data: sendData }, function (response) {
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
        // Cant add listener on the chrome ext tab with chrome extensions so need to poll
        setInterval(() => {
            let fetchBookmarks = new Promise(function (resolve, reject) {
                var data
                chrome.runtime.sendMessage(chrome.runtime.id, { task: "getAllbookmarks" }, function (response) {
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

    filterBookmarks = (allBookmarks, searchTerms) => {
        if (searchTerms == undefined) return // if deleted without any keywords
        //Maybe rewrite this but not in a shitty way
        if (searchTerms[0] === "") {
            var allBookmarks = this.state.bookmarks
            var newState = []
            for (let i = 0; i < allBookmarks.length; i++) {
                var bookmark = allBookmarks[i]
                bookmark.isInSearch = true;
                newState.push(bookmark) 
            }
            this.setState({bookmarks: newState})
            this.chromeExtensionService("updateAllBookmarks", null, newState)
            return
        } else {
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
            this.chromeExtensionService("updateAllBookmarks", null, searchResults)
            this.clearCurrentSelection()
        } 
    }

    clearCurrentSelection = () => {
        var bookmarks = this.state.bookmarks
        var newState = []
        for (let i = 0; i < bookmarks.length; i++) {
            var bookmark = bookmarks[i]
            bookmark.isSelected = false
            newState.push(bookmark)
        }
        this.setState({ bookmark: newState })
        this.setState({ currentSelection: 0 })
        this.setState({ currentSelectionBookmark: null })
    }

    keyHandler = (e) => {
        if (e.key == 'Enter'){
            var currentBookmark = this.state.currentSelectionBookmark
            if (currentBookmark) this.openBookmark(currentBookmark.url);
        }

        this.clearCurrentSelection()
        var selection = this.state.currentSelection
        var shownBookmarkCount;
        var nextSelection = selection + 1 
        if (e.key == 'Tab') {
            e.preventDefault()
            this.setState({ currentSelection: nextSelection })
            let allBookmarks = this.state.bookmarks
            var shownBookmarks = []
            var selectedBookmarkId
            for (let i = 0; i < allBookmarks.length; i++) {
                if (allBookmarks[i].isInSearch) shownBookmarks.push(allBookmarks[i])  
            }
            shownBookmarkCount = shownBookmarks.length
            if (selection === shownBookmarkCount - 1) {
               this.setState({ currentSelection: 0})
            }
            for (let i = 0; i < shownBookmarkCount; i++) {
                var bookmark = shownBookmarks[i]
                if (i == selection ) {
                    selectedBookmarkId = bookmark.bId
                    break;
                }      
            }
            var selectedBookmark;
            var bookmarks = this.state.bookmarks
            var newState = [];
            for (let i = 0; i < bookmarks.length; i++) {

                var bookmark = bookmarks[i]
                if (bookmark.bId == selectedBookmarkId) {
                    bookmark.isSelected = true
                    selectedBookmark = bookmark;
                } else {
                    bookmark.isSelected = false
                }
                newState.push(bookmark)
           }
            this.setState({ currentSelectionBookmark: selectedBookmark })
            this.setState({ bookmarks: newState})
            this.chromeExtensionService("updateAllBookmarks", null, newState)
        }
  
    }

    render() {
        var helper = this.state.bookmarks.length == 0? <BookmarkContainerHelper chromeCommands={ this.state.chromeCommands }/> : null
        return (
            <div className="bookmarkcontainer"
                 onKeyDown={ this.keyHandler }
                >
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
                                    deleteBookmark={ this.deleteBookmark}
                                    openBookmark={ this.openBookmark}
                                    isSelected={ bookmark.isSelected }
                                />
                            }
                        )}
                    </div>
                    { helper }
                </div>
            </div>
        )
    }
}

export default BookmarkContainer