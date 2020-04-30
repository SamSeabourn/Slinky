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
        console.log(this.state.currentSearch)
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
        }, 100000);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    filterBookmarks = (allBookmarks, searchTerms) => {
        // if (searchTerms.length > 1 || searchTerms[0] === "") {
        //     // for (let i = 0; i < allBookmarks.length; i++) {
        //         var bookmark = allBookmarks[0]
        //         var matches;
        //         for (let f = 0; f < searchTerms.length; f++) {
        //             console.log(bookmark)
        //             console.log(searchTerms[f])
        //             var currentSearchTerm = searchTerms[f];
        //             var newState;

        //             for (let g = 0; g < bookmark.tags.length; g++) {
        //                 if (bookmark.tags[g].includes(currentSearchTerm)) 
        //                 {
        //                     console.log("Match true")
        //                     matches = true;
        //                     bookmark.tags[g] = ""
        //                     return
        //                 } else {
        //                     // newState = bookmark.isInSearch = false;
        //                     console.log("Match false")
        //                     matchesFalse++
        //                     return
        //                 }
        //                 this.setState({ newState })
        //             }    
        //             console.log("there is a match: " + matches)
        //         }
            


                   
            // }
        // } else {
        //     for (let i = 0; i < allBookmarks.length; i++) {
        //         var bookmark = allBookmarks[i]
        //         newState = bookmark.isInSearch = true;
        //         this.setState({ newState })
        //     }
        }
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