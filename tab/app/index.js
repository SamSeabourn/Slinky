import React from 'react';
import ReactDOM from 'react-dom';
import Bookmark from './components/Bookmark'
import BookmarkContainer from './components/BookmarkContainer'
import SideBar from './components/SideBar'
import './index.css';

//TODO, we will get this updates when firebase updates 
var userBookmarks = [
    {
      "title": "Slinky – Firebase console",
      "url": "https://console.firebase.google.com/u/0/project/slinky-0001/database/slinky-0001/data",
      "favicon": "https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/favicon.ico",
      "tags": [
        "yo",
        "are"
      ],
      "clicks": 0,
      "isDeleted": false
    },
    {
      "title": "JavaScript — Multiple ways to create object - codeburst",
      "url": "https://codeburst.io/various-ways-to-create-javascript-object-9563c6887a47",
      "favicon": "https://miro.medium.com/fit/c/128/128/1*mNmxddJJTzkiBfK77mWuGA.png",
      "tags": [
        "javascript",
        "learning",
        "bookmarks"
      ],
      "clicks": 0,
      "isDeleted": false
    },
    {
      "title": "9.3: Firebase: Retrieving Data - Programming with Text - YouTube",
      "url": "https://www.youtube.com/watch?v=NcewaPfFR6Y",
      "favicon": "https://s.ytimg.com/yts/img/favicon_32-vflOogEID.png",
      "tags": [
        "this",
        "guy",
        "is",
        "a",
        "legegenf"
      ],
      "clicks": 0,
      "isDeleted": false
    },
    {
      "title": "Extensions",
      "url": "chrome://extensions/",
      "favicon": "../../icons/icon16.png",
      "tags": [
        "kdwl;k",
        "law;k;ld",
        "ww",
        "adwa",
        "wda",
        "wdawad",
        "wad"
      ],
      "clicks": 0,
      "isDeleted": false
    }
  ]


class App extends React.Component{
    render(){
        return(
            <div className="App">
                <div className="flexbox">
                    <SideBar />
                    <BookmarkContainer />
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
