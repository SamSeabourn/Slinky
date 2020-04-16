import React, { Component } from 'react';
import Logo from "../../../icons/slinky-white-vector-text.svg"


class SideBar extends Component{
    render(){
        return(
            <div className="sidebar-flexbox sidebar">
                <img src={Logo} alt="Slinky Logo"/>
            </div>
        )
    }
}

export default SideBar