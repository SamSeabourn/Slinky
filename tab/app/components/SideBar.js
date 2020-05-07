import React, { Component } from 'react';
import Logo from "../../../icons/slinky-white-vector-text.svg"
import HotKeysIcon from "../../../icons/hotkeys.svg"


class SideBar extends Component{
    render(){
        return(
            <div className="sidebar-flexbox sidebar">
                <img src={Logo} alt="Slinky Logo"/>
                <div className="toolbar">
                    <img src={HotKeysIcon} alt="Configure Hot Keys" />
                </div>
            </div>
        )
    }
}

export default SideBar