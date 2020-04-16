import React, { Component } from 'react';
import Bookmark from './Bookmark';

const SearchBar = () => 
    <div>
        <input className="slinkySearch" type="text" value="jjjjqy" contentEditable="true"></input>
    </div>; 


class BookmarkContainer extends Component{
    state = {
        bookmarks: [
            {
              "bId": "-M50h1jlZalkQPZlWEx_",
              "title": "Slinky – Firebase console",
              "url": "https://console.firebase.google.com/u/0/project/slinky-0001/database/slinky-0001/data",
              "favicon": "icons/icon48",
              "tags": [
                "this",
                "sis",
                "is",
                "so",
                "cool"
              ],
              "clicks": 0,
              "isDeleted": false
            },
            {
              "bId": "-M50hITqodnHqYCW9h_H",
              "title": "React: Nested Components and Props - YouTube",
              "url": "https://www.youtube.com/watch?v=7Mftj2FaRsg",
              "favicon": "icons/icon48",
              "tags": [
                "test",
                "react",
                "cool",
                "tutorial",
                "javascript"
              ],
              "clicks": 0,
              "isDeleted": false
            },
            {
              "bId": "-M50hN_nu3nP5qBY_feM",
              "title": "React JS Crash Course - YouTube",
              "url": "https://www.youtube.com/watch?v=sBws8MSXN7A",
              "favicon": "icons/icon48",
              "tags": [
                "react",
                "crash",
                "course",
                "traverst",
                "cool"
              ],
              "clicks": 0,
              "isDeleted": false
            },
            {
              "bId": "-M50hS9iTWn4UleN0tN8",
              "title": "slinkyio-app-creative_v2 – Figma",
              "url": "https://www.figma.com/file/iKyxNeU15U48es4QiCdxVs/slinkyio-app-creative_v2?node-id=0%3A1",
              "favicon": "icons/icon48",
              "tags": [
                "slinky",
                "figma",
                "design",
                "neon",
                "vaporwave"
              ],
              "clicks": 0,
              "isDeleted": false
            },
            {
              "bId": "-M50hUrKHoiQRs2FZB2s",
              "title": "In Laravel 5.7 React app, getting the error: 'classProperties' isn't currently enabled",
              "url": "https://laracasts.com/discuss/channels/general-discussion/in-laravel-57-react-app-getting-the-error-classproperties-isnt-currently-enabled",
              "favicon": "icons/icon48",
              "tags": [
                "more",
                "stif",
                "to",
                "learn"
              ],
              "clicks": 0,
              "isDeleted": false
            }
          ],
        currentSearch: "" 
    }

    render(){
        return(
            <div className="bookmarkcontainer-flexbox">
                <div className="search-area">
                    <SearchBar />
                    <div className="slinkyUnderScoreLine"></div>
                    {this.state.bookmarks.map((bookmark) => <Bookmark key={bookmark.bId} bookmark={bookmark}/>)}
                </div>
            </div>
        )
    }
}

export default BookmarkContainer