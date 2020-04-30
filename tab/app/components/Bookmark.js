import React, { Component } from 'react';
import PropTypes from 'prop-types' 
import missingImageIcon from '../../../icons/broken-image.svg'
import trashIcon from '../../../icons/trash-can.svg'
import BookmarkInput from './BookmarkInput.js'


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

    buildTagString = () => {
        return "#" + this.props.bookmark.tags.join(' #')
    }

    render(){
        const { bId, title, url, isInSearch } = this.props.bookmark //Destructuring 
        var bookmarkHidden = isInSearch? "displayed-bookmark" : "hidden-bookmark";
        return(
            <div className={ bookmarkHidden }>
                <div className="bookmark">
                    <div className="image-box" onClick={ this.props.openBookmark.bind(this, url) }>
                        <img src={this.favicon()}></img>
                    </div>
                    <div className="content-box" onClick={ this.props.openBookmark.bind(this, url) }>
                        <BookmarkInput value={ title } bId={ bId } inputClass="titleInput"/>
                        <BookmarkInput value={ this.buildTagString() } bId={ bId + "tags" }inputClass="tagsInput"/>
                        
                    </div>
                    <div className="options-box">
                        <img src={ trashIcon } type="button" 
                        onClick={ this.props.deleteBookmark.bind(this, bId) }/>
                    </div>
                </div>
            </div>
        )
    }
}

// <input className ="titleInput" readOnly value={title}/>
// {tags.map((tag) => <span key={tag}> {"#" + tag + " "}</span>)}


Bookmark.propTypes = {
    bookmark:PropTypes.object.isRequired
}

export default Bookmark

// {if (marqueeCheck(this.props.bookmark.title)){}}
//                     <h3>{this.props.bookmark.title}</h3>