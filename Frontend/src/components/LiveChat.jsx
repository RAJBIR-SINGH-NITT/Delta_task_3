import React, { useState, useEffect, useRef } from 'react';

export default function LiveChat({ videoId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const wsRef = useRef(null);

    useEffect(() => {
        wsRef.current = new WebSocket('ws://localhost:5000');
        
        wsRef.current.onopen = () => {
            wsRef.current.send(JSON.stringify({ type: 'JOIN_CHAT', videoId }));
        };

        wsRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'NEW_MESSAGE') {
                setMessages((prev) => [...prev, data.payload]);
            }
        };

        return () => wsRef.current?.close();
    }, [videoId]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        
        const payload = { text: input, timestamp: Date.now() };
        wsRef.current.send(JSON.stringify({ type: 'SEND_MESSAGE', videoId, payload }));
        setInput('');
    };

    return (
        <div className="live-chat-container">
            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className="chat-message">{msg.text}</div>
                ))}
            </div>
            <form onSubmit={sendMessage} className="chat-input-form">
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Say something..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}