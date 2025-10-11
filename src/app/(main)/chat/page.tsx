'use client';
import { withAuth } from '@/components/WithAuth';
import { useState } from 'react';

function ChatPage() {
  const [messages, setMessages] = useState([
    { user: 'Agent', text: 'Hello, how can I help you?' },
    { user: 'You', text: 'I have a question about my account.' }
  ]);
  const [input, setInput] = useState('');

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { user: 'You', text: input }]);
      setInput('');
      // Add socket send logic here
    }
  }

  return (
    <div className="flex flex-col h-[70vh] max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-6">
      <h1 className="text-2xl font-bold mb-4 text-primary">Chat</h1>
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg max-w-[70%] 
              ${msg.user === 'You' ? 'bg-accent text-white' : 'bg-gray-100 text-gray-800'}`}>
              <span className="font-semibold">{msg.user}: </span>{msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          className="input input-bordered flex-1"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}

export default withAuth(ChatPage, true); // true = auth required