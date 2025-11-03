import { useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';

const ChatContainer = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="messages-wrapper">
        {messages.map((message, index) => (
          <ChatBubble
            key={index}
            message={message.text}
            isBot={message.isBot}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;