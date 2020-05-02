import React, { Component } from 'react';

export class BookmarkInput extends Component {
    _isMounted = false;
    characterCount = 0;
    increment = 1;
    scrollRight = true;
    scrollLeft = false;

    state = {
        previousScrollPosition: -1,
        currentPossition: 0,
        maxPosition: 0
    }

    componentDidMount() {
        this._isMounted = true;
        this.inputScroller(document.getElementsByClassName(this.props.bId)[0])
    }

    inputScroller = (input) => {
        var inputScroll;
        this.characterCount = input.value.length
        input.addEventListener("mouseover",(input) =>{
            inputScroll = setInterval( scrollOnHover , 10);
        })
        input.addEventListener("mouseout",() =>{
            clearInterval(inputScroll)
        })
    
        var scrollOnHover = () => {
            if (this.state.maxPosition >= this.state.previousScrollPosition || input.scrollLeft === 0) {
                if (this.scrollRight) {
                    this.scrollRight = !this.scrollRight;
                    this.scrollLeft = true;
                    this.waitTime(1500)
                }
                this.setState({ previousScrollPosition: this.state.currentPossition })
                this.setState({ currentPossition: this.state.currentPossition + this.increment })
             input.scrollLeft = this.state.currentPossition
                this.setState({ maxPosition: input.scrollLeft })
                
            } else {
                if(this.scrollLeft) {
                    this.scrollLeft = !this.scrollLeft
                    this.scrollRight = true
                    this.waitTime(1500)
                }
                this.setState({ currentPossition: this.state.currentPossition - this.increment })
             input.scrollLeft = this.state.currentPossition
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    waitTime = (ms) => {
        this.increment = 0
        setTimeout(() => { 
            this.increment = 1 
        }, ms)
    }

    render() {
        var className = `${this.props.inputClass} ${this.props.bId}`
        return (
            <input 
            className={className} 
            readOnly 
            value={this.props.value}
            />
        )
    }
}

export default BookmarkInput