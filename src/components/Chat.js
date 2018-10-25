// PUSHER CHATKIT 

// import React, { Component } from 'react'
// import Chatkit from '@pusher/chatkit';
// import Message from './Message';

// class Chat extends Component{

//     constructor(props) {
//         super(props);
//         this.state = {
//             messages: [],
//             currentRoom: {},
//             currentUser: {},
//             chatInput: ''
//         };

//         this.setChatInput = this.setChatInput.bind(this);
//         this.sendMessage = this.sendMessage.bind(this);
//         this._handleKeyPress = this._handleKeyPress.bind(this);
//       }
    
//       // update the input field when the user types something
//       setChatInput(event){
//         this.setState({
//             chatInput: event.target.value
//         });
//       }

//  sendMessage() {
//      if(this.state.chatInput){
//         this.state.currentUser.sendMessage({
//             text: this.state.chatInput,
//             roomId: this.state.currentRoom.id,
//           })
//         }

//         this.setState({ chatInput: ''})
//      }

//      _handleKeyPress(e){
//                 if (e.key === 'Enter') {
//                     this.sendMessage();
//                 }
//             }
       
//   componentDidMount () {
//     const chatManager = new Chatkit.ChatManager({
//       instanceLocator: 'v1:us1:2021ca78-70ca-4b97-a4e9-cdf2217f1294',
//       userId: 'admin',
//       tokenProvider: new Chatkit.TokenProvider({
//         url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/2021ca78-70ca-4b97-a4e9-cdf2217f1294/token',
//       }),
//     })
//     chatManager
//     .connect()
//     .then(currentUser => {
//       this.setState({ currentUser })
//       return currentUser.subscribeToRoom({
//         roomId: 19371406,
//         messageLimit: 100,
//         hooks: {
//           onNewMessage: message => {

//            // console.log(message)
            
//             let newmessage = this.state.messages;

//             newmessage.push(<Message 
//                                         key={ 
//                                             this.state.messages.length 
//                                         } 
//                                         senderId={ 
//                                             message.senderId 
//                                         } 
//                                         text={ message.text 
//                                         }/>)

//             this.setState({messages: newmessage})

//           },
//         },
//       })
//     })

//     .then(currentRoom => {
//       this.setState({ currentRoom })
//      })
//     .catch(error => console.error('error', error))
// }

//   render() {
//             return ( 
//             <div id="center">
//                 <div id="chat-output">
//                 { this.state.messages }     
//                 </div> 
//                 <input id="chat-input"
//                     type="text"
//                     placeholder='Type message...'
//                     name=""
//                     value={ this.state.chatInput } 
//                     onChange={ this.setChatInput } 
//                     onKeyPress={ this._handleKeyPress }/>
//             <div id="btndiv">
//             <input id="button" type="button"
//                 onClick={ this.sendMessage } value="Send Chat" />
//             </div>
                
//             </div>
//             );
//         }
    
//     }

// export default Chat;


// PUBNUB CHATENGINE


import React, { Component } from 'react';
import '../App.css';
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
        this._mount = true;
        ChatEngine.on('message', (payload) => {
            console.log(payload.data.text)
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

            if(this._mount){
                this.setState({
                    messages: messages
                });

            }
           
           
        });
    }

    componentWillUnmount(){
        this._mount = false;
    }

    _handleKeyPress(e){
        if (e.key === 'Enter') {
            this.sendMessage();
        }
    }

      render() {
            return ( 
            <div id="center">
                <div id="chat-output">
                { this.state.messages }     
                </div> 
                <input id="chat-input"
                    type="text"
                    placeholder='Type message...'
                    name=""
                    value={ this.state.chatInput } 
                    onChange={ this.setChatInput } 
                    onKeyPress={ this._handleKeyPress }/>
            <div id="btndiv">
            <input id="button" type="button"
                onClick={ this.sendMessage } value="Send Chat" />
            </div>
                
            </div>
            );
        }
    
  }
  
export default Chat;