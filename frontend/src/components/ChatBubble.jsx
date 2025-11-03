const ChatBubble = ({ message, isBot }) => {
  return (
    <div className={`message-container ${isBot ? 'bot-message' : 'user-message'}`}>
      {message}
    </div>
  );
};

export default ChatBubble;