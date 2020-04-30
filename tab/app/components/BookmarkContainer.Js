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
        }, 5000);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    filterBookmarks = (allBookmarks, searchTerms) => {
        var filteredBookmarkList = []
        filteredBookmarkList = allBookmarks
        for (let i = 0; i < filteredBookmarkList.length; i++) {
            var currentBookmark = filteredBookmarkList[i]

            var matches = 0
            var nonMatches = 0

            for (let j = 0; j < currentBookmark.tags.length; j++) {
                var currentTag = currentBookmark.tags[j]

                for (let k = 0; k < searchTerms.length; k++) {
                    var currentSearchTerm = searchTerms[k]
                    if(currentTag.includes(currentSearchTerm)){
                        matches++
                    } else {
                        nonMatches++
                    }
                }
                // console.log(currentBookmark)
                // console.log("matches " + matches)
                // console.log("non matches " + nonMatches)
            } 

            if (matches > 1 ) {
               var searchResults = this.state.searchResults
               searchResults.push(currentBookmark)
                this.setState({ searchResults: searchResults})
            }
            console.log()

        }
        // if theres a match its marked as true bookmark gets added to filtered results

        //
 
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