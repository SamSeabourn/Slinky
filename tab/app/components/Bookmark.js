import React, { Component } from 'react';
import PropTypes from 'prop-types' 
import missingImageIcon from '../../../icons/broken-image.svg'
import trashIcon from '../../../icons/trash-can.svg'



 // { this.props.bookmark.title}
export class Bookmark extends Component{

    marqueeCheck = (string) => {
        return string.length > 50
       }

    favicon = () => {
        if (!this.props.bookmark.favicon.includes("http")) {
            return missingImageIcon;
        } else {
            return this.props.bookmark.favicon;
        }
    }

    render(){
        const { bId, title, tags, url } = this.props.bookmark //Destructuring 
        return(
            <div>
                <div className="bookmark">
                    <div className="image-box" onClick={this.props.openBookmark.bind(this, url)}>
                        <img src={this.favicon()}></img>
                    </div>
                    <div className="content-box" onClick={this.props.openBookmark.bind(this, url)}>
                        <h3>{title}</h3>
                        {tags.map((tag) => <span key={tag}> {"#" + tag + " "}</span>)}
                    </div>
                    <div className="options-box">
                        <img src={trashIcon} type="button" 
                        onClick={this.props.deleteBookmark.bind(this, bId)}/>
                    </div>
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