import React, { useState } from 'react';
import './chatbotui.scss'

function ChatBotUI() {

  const [showChat, setShowChat] = useState(false);

  const handleImageClick = () => {

    setShowChat(prev => !prev);

  };

  return (
<div>
<img

        src="/images/fortailogo.png"

        alt="Chatbot Icon"

        style={{ cursor: 'pointer', width: '60px', borderRadius: '30px' }}

        onClick={handleImageClick}

      />

      {showChat && (
<div style={{ position: 'fixed', bottom: 90, right: 10, width: 350, height: 400, background: '#fff', border: '1px solid #ccc', borderRadius: 8, boxShadow: '0 0 12px rgba(0, 0, 0, 0.3)' }}>
    <div style={{backgroundColor: '#F5F5F5', border: 'solid 1px blue', }}>
        <h3 className='heading-h3-ai'><span>&nbsp;&nbsp;FORT-AI</span></h3>
    <span style={{position: 'relative',left:10, color: 'gray'}}>Operations Assistant</span>  
    </div>

</div>

      )}
</div>

  );

}

export default ChatBotUI;
 