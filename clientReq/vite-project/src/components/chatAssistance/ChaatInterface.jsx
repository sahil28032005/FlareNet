// components/ChatInterface.jsx
import { useState } from 'react';

export const ChatInterface = ({ onSendMessage, triggerAnimation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your Spider-Man assistant! How can I help?", isBot: true }
  ]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessages = [...messages, { text: inputMessage, isBot: false }];
    setMessages(newMessages);
    setInputMessage('');

    // Trigger animation based on message
    if (inputMessage.toLowerCase().includes('jump')) {
      triggerAnimation('jump');
    }

    // Simulate AI response
    const response = await generateAIResponse(inputMessage);
    
    // Add bot response
    setMessages([...newMessages, { text: response, isBot: true }]);
  };

  const generateAIResponse = async (message) => {
    // Replace this with actual AI API call
    const dummyResponses = [
      "With great power comes great responsibility!",
      "I'm busy swinging through the city, but I can help!",
      "Let me check the spider-sense...",
      "Stay alert for villains!",
    ];
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    return dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      {isOpen && (
        <div style={{
          width: '300px',
          height: '400px',
          backgroundColor: 'rgba(0,0,0,0.9)',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1rem',
          color: 'white'
        }}>
          <div style={{ 
            height: '320px', 
            overflowY: 'auto',
            marginBottom: '1rem'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ 
                textAlign: msg.isBot ? 'left' : 'right',
                margin: '0.5rem 0'
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  borderRadius: '15px',
                  background: msg.isBot ? '#333' : '#e53e3e',
                  color: 'white'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                padding: '0.5rem',
                borderRadius: '5px',
                border: 'none',
                marginRight: '0.5rem'
              }}
            />
            <button
              onClick={handleSend}
              style={{
                padding: '0.5rem 1rem',
                background: '#e53e3e',
                border: 'none',
                borderRadius: '5px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#e53e3e',
          border: 'none',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          cursor: 'pointer',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img 
          src="/spider-icon.png" // Add your spider icon
          alt="Chat"
          style={{ width: '30px', height: '30px' }}
        />
      </button>
    </div>
  );
};