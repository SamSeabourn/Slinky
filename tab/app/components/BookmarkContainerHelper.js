import React, { Component } from 'react';
import HotKeys from '../../../icons/hotkeysGrey.svg'

class BookmarkContainerHelper extends Component{

    render(){
        return(  
            <div className="helper-message">
                <img src={HotKeys}></img>
               1. Configure your hot keys shortcuts
               <br></br>
               2. Open Slinky Extension on the page you want to bookmark
               <br></br>
            </div>
        )
    }
}

export default BookmarkContainerHelper