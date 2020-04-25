import React, { Component } from 'react';

export class BookmarkInput extends Component {
    state = {
        previousScrollPosition: -1,
        currentPossition: 0,
        maxPosition: 0
    }
    characterCount = 0;
    increment = 1;
    scrollRight = true
    scrollLeft = false
    inputScroller = (inputElement) => {
        this.characterCount = inputElement.value.length;
        this.characterCount = inputElement.value.length;
            setInterval(() => {
                if (this.state.maxPosition >= this.state.previousScrollPosition || inputElement.scrollLeft === 0) {
                    if (this.scrollRight) {
                        this.scrollRight = !this.scrollRight
                        this.scrollLeft = true
                        this.waitTime(3000)
                    }
                    this.setState({ previousScrollPosition: this.state.currentPossition })
                    this.setState({ currentPossition: this.state.currentPossition + this.increment })
                    inputElement.scrollLeft = this.state.currentPossition
                    this.setState({ maxPosition: inputElement.scrollLeft })
                    
                } else {
                    if(this.scrollLeft) {
                        this.scrollLeft = !this.scrollLeft
                        this.scrollRight = true
                        this.waitTime(3000)
                    }
                    this.setState({ currentPossition: this.state.currentPossition - this.increment })
                    inputElement.scrollLeft = this.state.currentPossition
                }
            }, 55)
        // }
    }

    waitTime = (ms) => {
        this.increment = 0
        setTimeout(() => { 
            this.increment = 1 
        }, ms)
    }

    componentDidMount() {
        this.inputScroller( document.getElementsByClassName(this.props.bId)[0])
    }


    render() {
        var className = `${this.props.inputClass} ${this.props.bId}`
        return (
            <input className={className} readOnly value={this.props.value} />
        )
    }
}



export default BookmarkInput