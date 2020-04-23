import React, { Component } from 'react';
import Bookmark from './Bookmark';
import SearchBar from './SearchBar';
import "regenerator-runtime/runtime";

var userBookmarks;

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
        this.bookmarkService("getAllbookmarks", null)
    }

    deleteBookmark = (bId) => {
        this.bookmarkService("deleteBookmark", bId)
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
        let fetchBookmarks = new Promise(function (resolve, reject) {
            var data
            chrome.runtime.sendMessage("eniajemgofmchohalpnjoodmpbkgegna", { task: task, bId: bookmarkId }, function (response) {
                data = response.data
            })
            setTimeout(function () { resolve(data) }, 10); // This is janky, need to look into async in chrome runtime messages
        })
        fetchBookmarks.then((data) => {
            if (this._isMounted) {
                console.log(data)
                this.setState({ bookmarks: data })
            }
        })
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

export default BookmarkContainer