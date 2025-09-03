import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function ChatMessage({ role, text }) {
  return (
    <div className={role === 'user' ? 'cb-msg user' : 'cb-msg bot'}>
      <div className="cb-avatar">{role === 'user' ? '🧑' : '🌿'}</div>
      <div className="cb-bubble">
        {text}
      </div>
    </div>
  )
}

const SUGGESTIONS = [
  'Explore new face wash',
  'Show bestselling serums',
  'Build a face care kit',
  'Recommend for acne-prone skin',
  'Moisturizer for oily skin',
]

// List of Leeya products (expand as needed)
const LEEYA_PRODUCTS = [
  { name: 'Gentle Foam Face Wash', category: 'facewash', keywords: ['face wash', 'facewash', 'cleanser', 'foam'] },
  { name: 'Neem Purify Cleanser', category: 'facewash', keywords: ['neem', 'cleanser', 'face wash', 'facewash'] },
  { name: 'Vitamin C Glow Serum', category: 'serum', keywords: ['serum', 'vitamin c', 'glow'] },
  { name: 'Targeted Acne Gel', category: 'acne', keywords: ['acne', 'gel', 'pimple'] },
  { name: 'Tea-Tree Cleanser', category: 'facewash', keywords: ['tea-tree', 'cleanser', 'face wash'] },
  { name: 'Lightweight Moisturizer', category: 'moisturizer', keywords: ['moisturizer', 'lightweight', 'cream'] },
  { name: 'Rosewater Mist', category: 'toner', keywords: ['rosewater', 'mist', 'toner'] },
  { name: 'Herbal Scrub', category: 'scrub', keywords: ['scrub', 'exfoliate', 'herbal'] },
  { name: 'Aloe Vera Gel', category: 'gel', keywords: ['aloe', 'gel', 'soothing'] },
  // ...add more products as needed
];

function getBotReply(message) {
  const q = message.toLowerCase();
  // Find products whose name or keywords match the query
  const matches = LEEYA_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(q) ||
    product.keywords.some(kw => q.includes(kw))
  );
  if (matches.length > 0) {
    return (
      'Here are some Leeya products you might like:\n' +
      matches.map(p => `• ${p.name}`).join('\n')
    );
  }
  // If no product matches, fallback to a helpful message
  return "I'm here to help with Leeya Herbals products. Ask about face wash, serums, scrubs, or any product you see on our website!";
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m Leeya Guide. What are you looking for today?' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const send = (text) => {
    const userText = (text ?? input).trim()
    if (!userText) return
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setInput('')
    setTyping(true)
    const reply = getBotReply(userText)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', text: reply }])
      setTyping(false)
    }, 600)
  }

  return (
    <div className="chatbot-page">
      <div className="container">
        <div className="cb-header">
          <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
          <div className="cb-title">Leeya Guide <span className="cb-beta">beta</span></div>
        </div>

        <div className="cb-suggestions">
          {SUGGESTIONS.map(s => (
            <button key={s} className="cb-chip" onClick={() => send(s)}>{s}</button>
          ))}
        </div>

        <div ref={listRef} className="cb-messages">
          {messages.map((m, i) => (
            <ChatMessage key={i} role={m.role} text={m.text} />
          ))}
          {typing && (
            <div className="cb-msg bot"><div className="cb-avatar">🌿</div><div className="cb-bubble"><span className="cb-dots"><span>.</span><span>.</span><span>.</span></span></div></div>
          )}
        </div>

        <form className="cb-input" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <textarea
            className="cb-textarea"
            rows={1}
            placeholder="Ask about serums, face wash, kits..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button className="btn primary" type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}


