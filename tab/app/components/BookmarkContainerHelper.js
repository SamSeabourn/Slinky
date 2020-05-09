import React, { Component } from 'react';
import HotKeysImg from '../../../icons/hotkeysGrey.svg'
import ExtensionImg from '../../../icons/slinkyExtension.svg'
import SearchImg from '../../../icons/slinkySearch.svg'

class BookmarkContainerHelper extends Component{

    render(){
        return(  
            <div className="helper-message">
                <img src={ HotKeysImg }></img>
                <br></br>
                1. Configure your hotkeys
                <br></br>
                <img src={ ExtensionImg }></img>
                <br></br>
                2. Open Slinky Extension and start adding tags
                <br></br>
                <img src={ SearchImg }></img>
                <br></br>
                3. Search your tags here 
            </div>
        )
    }
}

export default BookmarkContainerHelper