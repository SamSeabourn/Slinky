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
        const { bId, title, tags } = this.props.bookmark
        return(
            <div>
                <div className="bookmark" onClick={this.props.openBookmark}>
                    <div className="image-box">
                        <img src={this.favicon()}></img>
                    </div>
                    <div className="content-box">
                        <h3>{title}</h3>
                        {tags.map((tag) => <span key={tag}> {"#" + tag + " "}</span>)}
                    </div>
                    <div className="options-box" onClick={ e => {e.preventDefault(); this.props.disableLinkOpen}}>
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