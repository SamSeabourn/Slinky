import React, { Component } from 'react';
import Bookmark from './Bookmark';
import SearchBar from './SearchBar';
import "regenerator-runtime/runtime";
import Fuse from 'fuse.js'

console.log(Fuse)


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

        var options = { includeScore: true, keys: ['tags'] }
        var results = []

        for (let i = 0; i < searchTerms.length; i++) {

            const fuse = new Fuse(allBookmarks, options)
            
            var fuseResults = fuse.search(searchTerms[i])
            fuseResults.forEach(element => { 
                results.push(element.item)
            });;
        }
        
        this.setState({ searchResults: results })
        console.log(this.state.searchResults)
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