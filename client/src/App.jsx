import React, { useState, useEffect } from 'react';
import { useSocket } from './socket/socket';

export default function App() {
  const { connect, disconnect, isConnected, messages, users, sendMessage, setTyping, typingUsers, socket } = useSocket();
  const [username, setUsername] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    return () => disconnect();
  }, []);

  const join = () => {
    if (!username) return;
    connect(username);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!text) return;
    sendMessage({ message: text });
    setText('');
  };

  return (
    <div className="app">
      <header>
        <h1>Socket.io Chat</h1>
        <div className="status">Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
      </header>

      <section className="sidebar">
        <div className="join">
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <button onClick={join}>Join</button>
        </div>

        <h3>Users</h3>
        <ul>
          {users.map((u) => (
            <li key={u.id}>{u.username}</li>
          ))}
        </ul>
      </section>

      <section className="chat">
        <div className="messages">
          {messages.map((m) => (
            <div key={m.id} className={m.system ? 'system' : 'message'}>
              {m.system ? (
                <em>{m.message}</em>
              ) : (
                <>
                  <div className="meta">{m.sender} • {new Date(m.timestamp).toLocaleTimeString()}</div>
                  <div className="body">{m.message}</div>
                  {m.reactions && (
                    <div className="reactions">{m.reactions.map((r, i) => <span key={i}>{r.reaction}</span>)}</div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="typing">
          {typingUsers.length > 0 && <div>{typingUsers.join(', ')} typing...</div>}
        </div>

        <form onSubmit={submit} className="composer">
          <input
            value={text}
            onChange={(e) => { setText(e.target.value); setTyping(!!e.target.value); }}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </section>
    </div>
  );
}
