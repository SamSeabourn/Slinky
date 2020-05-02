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
        this.bookmarkService("deleteBookmark", bId)
    }

    updateSearchTerms = (e) => {
        this.setState({ currentSearch: e.target.value.toLowerCase().trim().split(" ") })
        this.filterBookmarks(this.state.bookmarks, this.state.currentSearch)
    }

    openBookmark = (url) => {
        console.log(url)
        window.open(url, "_blank")
    }

    setInSearch = (bId, isInSearch) =>{
        // if (isInSearch) this.bookmarkService("IsInsearch", bId )
        // else this.bookmarkService("IsntInsearch", bId )
    }

    bookmarkService = (task, bookmarkId) => {
        //Leaving this function in as here allows the state to update instantly and I can polling take longer
        let fetchBookmarks = new Promise(function (resolve, reject) {
            var data
            chrome.runtime.sendMessage("eniajemgofmchohalpnjoodmpbkgegna", { task: task, bId: bookmarkId }, function (response) {
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
        }, 10000);
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
            for (let j = 0; j < bookmark.tags.length; j++) { 
                let tag = bookmark.tags[j]
                for (let k = 0; k < searchTerms.length; k++) {
                    let searchTerm = searchTerms[k]
                    if (tag.includes(searchTerm)){
                        searchScore = searchScore + 1
                    }                
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
                this.bookmarkService("IsInsearch", bookmark.bId)
            } else {
                bookmark.isInSearch = false
                searchResults.push(bookmark)
                this.bookmarkService("IsntInSearch", bookmark.bId)
            }
        }
        this.setState({ bookmark: searchResults})
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

console.log(chrome.runtime.onMessage)


export default BookmarkContainer