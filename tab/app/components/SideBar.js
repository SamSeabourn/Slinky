import React, { Component } from 'react';
import Logo from "../../../icons/slinky-white-vector-text.svg"
import HotKeysIcon from "../../../icons/hotkeys.svg"


class SideBar extends Component{
    render(){
        return(
            <div className="sidebar">
                    <img src={Logo} alt="Slinky Logo"/>
                    <img src={HotKeysIcon} className="toolbar-icon top" alt="Configure Hot Keys" />
            </div>
        )
    }
}

export default SideBar