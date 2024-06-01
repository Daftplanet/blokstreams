import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './styles.css';

const socket = io('http://localhost:5000');

function App() {
  const [streams, setStreams] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStreams();
    socket.on('message', (msg) => setChatMessages([...chatMessages, msg]));
  }, [chatMessages]);

  const fetchStreams = async () => {
    const response = await fetch('http://localhost:5000/streams');
    const data = await response.json();
    setStreams(data);
  };

  const sendMessage = () => {
    socket.send(message);
    setMessage('');
  };

  return (
    <div className="App">
      <h1>Live Streaming Dashboard</h1>
      <div className="streams">
        {streams.map(stream => (
          <div key={stream.id} className="stream">
            <img src={stream.thumbnail} alt="thumbnail" />
            <h2>{stream.title}</h2>
            <p>{stream.description}</p>
          </div>
        ))}
      </div>
      <div className="chat">
        <h2>Live Chat</h2>
        <div className="messages">
          {chatMessages.map((msg, idx) => (
            <p key={idx}>{msg}</p>
          ))}
        </div>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
