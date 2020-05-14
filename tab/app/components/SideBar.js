import React, { Component } from 'react';
import Logo from "../../../icons/slinky-white-vector-text.svg"
import HotKeysIcon from "../../../icons/hotkeys.svg"
import ReactTooltip from "react-tooltip";

class SideBar extends Component{

    constructor(props) {
        super(props)
        this.state = {
            flameLeftOn: true,
            animation: null
        }
    }

    openChromeShortcuts = () => {
        chrome.runtime.sendMessage(chrome.runtime.id, { task: "openChromeExtensionHotkeys" }, function () {})
    }

    render(){
        return(  
            <div className="sidebar">
                    <img src={Logo} alt="Slinky Logo"/>
                    <img src={HotKeysIcon}
                        className="toolbar-icon top" 
                        data-tip="hello world"
                        alt="Configure Hot Keys" 
                        onClick={ this.openChromeShortcuts }
                    />
                    <ReactTooltip place="right" type="light" effect="solid" className="slinky-tool-tip">
                        <span>Set up your hotkeys</span>
                    </ReactTooltip>
            </div>
        )
    }
}

export default SideBar