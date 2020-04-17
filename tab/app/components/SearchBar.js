import React, { Component } from 'react';

export class SearchBar extends Component{

    render(){
        return(
            <div>
                <input type="text" onChange={this.props.updateSearchTerms}></input>
            </div>  
        )
    }
}

export default SearchBar

