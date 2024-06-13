import React, { useState } from 'react';
import axios from 'axios';
import './Chat.css';
import 'boxicons/css/boxicons.min.css';

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'sent'
    };

    setMessages([...messages, newMessage]);
    setInput('');
    setTimeout(() => {
      const autoReply = {
        text: 'Thank you for your awesome support!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'received'
      };
      setMessages([...messages, newMessage, autoReply]);
    }, 1000);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', { input });
      // Add response to the messages (you can customize this part)
      const responseMessage = {
        text: res.data.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'received'
      };
      setMessages([...messages, newMessage, responseMessage]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleDropdownToggle = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest('.chatbox-message-dropdown')) {
      setShowDropdown(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className="chatbox-wrapper">
      <div className="chatbox-toggle" onClick={handleToggle}>
        <i className='bx bx-message-dots'></i>
      </div>
      <div className={`chatbox-message-wrapper ${isOpen ? 'show' : ''}`}>
        <div className="chatbox-message-header">
          <div className="chatbox-message-profile">
            <img src="https://img.collegepravesh.com/2021/06/GRIET-Hyderabad-Logo.png" alt="" className="chatbox-message-image" />
            <div>
              <h4 className="chatbox-message-name">GRIET Chatbot</h4>
              <p className="chatbox-message-status">online</p>
            </div>
          </div>
          <div className="chatbox-message-dropdown">
            <i className='bx bx-dots-vertical-rounded chatbox-message-dropdown-toggle' onClick={handleDropdownToggle}></i>
            <ul className={`chatbox-message-dropdown-menu ${showDropdown ? 'show' : ''}`}>
              <li><a href="#">Search</a></li>
              <li><a href="#">Report</a></li>
            </ul>
          </div>
        </div>
        <div className="chatbox-message-content">
          {messages.length === 0 && <h4 className="chatbox-message-no-message">You don't have message yet!</h4>}
          {messages.map((msg, index) => (
            <div key={index} className={`chatbox-message-item ${msg.type}`}>
              <span className="chatbox-message-item-text">{msg.text}</span>
              <span className="chatbox-message-item-time">{msg.time}</span>
            </div>
          ))}
        </div>
        <div className="chatbox-message-bottom">
          <form className="chatbox-message-form" onSubmit={handleSubmit}>
            <textarea
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
              className="chatbox-message-input"
            ></textarea>
            <button type="submit" className="chatbox-message-submit"><i className='bx bx-send'></i></button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
