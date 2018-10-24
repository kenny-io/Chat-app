import React, { Component } from 'react';
import '../App.css';
import ReactDOM from 'react-dom';
import Message from './Message';
import ChatEngineCore from 'chat-engine';



// create user id and username
const id = new Date().getTime();
const username = ['user', id].join('-');

// configure ChatEngine
const ChatEngine = ChatEngineCore.create({
    publishKey: 'pub-c-fb384a34-6131-4082-85cb-3c7c7a0d5441',
    subscribeKey: 'sub-c-2aad9428-d763-11e8-957e-be7a2fcdb3b6'
}, {
    globalChannel: 'chat-engine-react'
});

// connect with user

ChatEngine.connect(username, {
  signedOnTime: id
}, 'auth-key');
 

class Chat extends Component {

// return the initial state of our Chat class
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            chatInput: ''
        };

        this.setChatInput = this.setChatInput.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this._handleKeyPress = this._handleKeyPress.bind(this);

      }
    // update the input field when the user types something
        
      setChatInput(event){
        this.setState({
            chatInput: event.target.value
        });
      }

    // send message
    sendMessage(){
        if(this.state.chatInput){
            ChatEngine.global.emit(
                'message', {
                    text: this.state.chatInput
                });
    // clear chat Input
                this.setState({
                    
                    chatInput: ''

                })
                
        }
    }

    // listen for messages and send callback

    componentDidMount(){
        
        ChatEngine.on('message', (payload) => {
            let messages = this.state.messages;
            messages.push( 
                <Message 
                key={ 
                    this.state.messages.length 
                } 
                uuid={ 
                    payload.sender.uuid 
                } 
                text={ payload.data.text 
                }/>
            );

            this.setState({
                messages: messages
            });
           
        });
    }

    _handleKeyPress(e){
        if (e.key === 'Enter') {
            this.sendMessage();
        }
    }
    
    render() {

        return ( 
        <div>
            <div id="chat-output"> { this.state.messages } 
        </div> 
            <input id="chat-input"
                type="text"
                name=""
                value={ this.state.chatInput } 
                onChange={ this.setChatInput } 
                onKeyPress={ this._handleKeyPress }/>
            <input type="button"
            onClick={ this.sendMessage } value="Send Chat" />
        </div>
        );
    }
    
  }


ChatEngine.on('$.ready', () => {
    ReactDOM.render( 
        <Chat /> ,
        document.getElementById('root')
    );
    
});
  
  export default Chat;