import React from 'react';
import ReactDOM from 'react-dom';
import BookmarkContainer from './components/BookmarkContainer'
import SideBar from './components/SideBar'
import './index.css';

if (process.env.NODE_ENV !== 'production') {
       console.log('Looks like we are in development mode!');
}


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
