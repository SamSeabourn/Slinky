import React, { Component } from 'react';

export class SearchBar extends Component{

    render(){
        return(
            <div>
                <input type="text" 
                    onChange={this.props.updateSearchTerms}
                    autoFocus={true}
                    placeholder={"Filter tags here"}
                    contentEditable="true"
                    >
                </input>
            </div>  
        )
    }
}

export default SearchBar

