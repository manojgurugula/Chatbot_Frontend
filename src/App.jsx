import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
//https://chatbot-backend-glac.onrender.com/api/chat
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const res = await fetch("https://chatbot-backend1-e5ajhmbcezg8cxcy.centralindia-01.azurewebsites.net/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMsg.content }],
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();

      const botMsg = {
        role: "assistant",
        content: data.response || "Sorry, I couldn't generate a response. Please try again.",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to backend" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <header className="header">
        <div className="header-title">Manoj Chatbot</div>
        <div className="header-subtitle">Powered by Advanced AI</div>
      </header>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.length === 0 && !loading && (
          <div className="welcome-message">
            <div className="welcome-icon">👋</div>
            <h3>Welcome to Manoj Chatbot!</h3>
            <p>How can I help you today? Feel free to ask me anything.</p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.role === "user" ? "user" : "bot"}`}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div className="message bot typing-indicator">
            <span>AI is thinking</span>
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      
      <footer className="footer">
        © 2024 Manoj Chatbot - All Rights Reserved | Proprietary AI Technology by Manoj
      </footer>
    </div>
  );
}

export default App;
