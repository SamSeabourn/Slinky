import React from 'react';
import ReactDOM from 'react-dom';
import BookmarkContainer from './components/BookmarkContainer'
import SideBar from './components/SideBar'
import './index.css';


class App extends React.Component{
    render(){
        return(
            <div className="App">
                    <SideBar />
                    <BookmarkContainer />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
