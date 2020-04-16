import React, { Component } from 'react';
import PropTypes from 'prop-types' 

 // { this.props.bookmark.title}
class Bookmark extends Component{

    marqueeCheck = (string) => {
        return string.length > 50
       }

    render(){
        return(
            <div className="bookmark">
                <div className="image-box">
                    <img src={this.props.bookmark.favicon}></img>
                </div>
                <div className="content-box">
                    <h3>{this.props.bookmark.title}</h3>
                    {this.props.bookmark.tags.map((tag) => <span key={tag}> {"#" + tag + " "}</span>)}
                </div>
                <div className="options-box">
                
                </div>
            </div>
        )
    }
}

Bookmark.propTypes = {
    bookmark:PropTypes.object.isRequired
}

export default Bookmark

// {if (marqueeCheck(this.props.bookmark.title)){}}
//                     <h3>{this.props.bookmark.title}</h3>