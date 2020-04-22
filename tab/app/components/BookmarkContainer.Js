import React, { Component } from 'react';
import Bookmark from './Bookmark';
import SearchBar from './SearchBar';
// import "core-js/stable";
import "regenerator-runtime/runtime";

var userBookmarks;

export class BookmarkContainer extends Component{

    constructor() {
      super();
      this.state ={
          bookmarks: [
              
            ],
          currentSearch: [] 
      };
    }

    componentDidMount() {
      this.getAllbookmarks()
    }

    deleteBookmark = (bId) => {
        this.setState({ bookmarks: this.state.bookmarks.map(bookmark => {
            if(bookmark.bId === bId) {
                bookmark.isDeleted = true;
            }
            return bookmark;
            })
        })
        console.log('hello there, Im the delete function')
        // console.log(firebaseConfig)

    }

    updateSearchTerms = (e) =>{
        this.setState({currentSearch: e.target.value.toLowerCase().trim().split(" ")}) 
        console.log(this.state.currentSearch)
    }

    openBookmark = (url) => {
        window.open(url, "_blank")
    }

    getAllbookmarks = (e) => {

      let fetchBookmarks = new Promise(function(resolve, reject){
        var data
        chrome.runtime.sendMessage("eniajemgofmchohalpnjoodmpbkgegna", {message: "getAllbookmarks"}, function(response){
          data = response.data
        })
        setTimeout(function () {resolve(data)}, 10); // This is janky, need to look into async in chrome runtime messages
      })

      fetchBookmarks.then((data) =>{
        this.setState({ bookmarks: data})
      })
    }

    updateBookmarks = () => {
      // this.setState({ bookmarks: userBookmarks })
      console.log(this.state.bookmarks)
      console.log(userBookmarks)
    }


    render(){
        return(
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
                            if (bookmark.isDeleted) {
                                return
                            } else {
                                return <Bookmark
                                    key={bookmark.bId}
                                    bookmark={bookmark}
                                    deleteBookmark={this.deleteBookmark}
                                    openBookmark={this.openBookmark} 
                                />
                            }}
                        )}
                    </div> 
                </div>
            </div>
        )
    }
}

export default BookmarkContainer