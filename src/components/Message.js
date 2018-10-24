import React, {Component} from 'react';

class Message extends Component{
    render () {
        return ( 
            <div> 
            { this.props.uuid }: { this.props.text } 
            </div>
        );
    }
};

export default Message;