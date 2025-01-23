import './App.css';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
    const [messageAlpha, setMessageAlpha] = useState('');
    const [messageBeta, setMessageBeta] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => socket.disconnect();
    }, []);

    const sendMessage = (message, sender) => {
        if (message.trim()) {
            socket.emit('send_message', { text: message, sender });
            setMessages((prevMessages) => [...prevMessages, { text: message, sender }]);
        }
    };

    return (
        <div className="app-container">
            <h1>Real-Time Chat</h1>
            <div className="dual-screens">
                {/* Alpha's Screen */}
                <div className="screen alpha">
                    <h2>User Alpha</h2>
                    <div className="chat-box">
                        {messages.map((msg, idx) => (
                            // Messages from Alpha are in lightblue and from Beta in lightgreen
                            <div key={idx} className={`chat-bubble ${msg.sender === 'Alpha' ? 'alpha' : 'beta'}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={messageAlpha}
                        onChange={(e) => setMessageAlpha(e.target.value)}
                        placeholder="Alpha: Type a message"
                    />
                    <button onClick={() => { sendMessage(messageAlpha, 'Alpha'); setMessageAlpha(''); }}>Send</button>
                </div>

                {/* Beta's Screen */}
                <div className="screen beta">
                    <h2>User Beta</h2>
                    <div className="chat-box">
                        {messages.map((msg, idx) => (
                            // Messages from Beta are in lightgreen and from Alpha in lightblue
                            <div key={idx} className={`chat-bubble ${msg.sender === 'Beta' ? 'beta' : 'alpha'}`}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={messageBeta}
                        onChange={(e) => setMessageBeta(e.target.value)}
                        placeholder="Beta: Type a message"
                    />
                    <button onClick={() => { sendMessage(messageBeta, 'Beta'); setMessageBeta(''); }}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default App;
