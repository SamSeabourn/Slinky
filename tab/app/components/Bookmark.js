import React, { Component } from 'react';


class Bookmark extends Component{

    render(){
        return(
            <div className="bookmark">
                { this.props.bookmark.title}
            </div>
        )
    }
}

export default Bookmark