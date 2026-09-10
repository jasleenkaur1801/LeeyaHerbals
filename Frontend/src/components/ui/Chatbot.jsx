import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllProducts } from '../../services/productService'
import './Chatbot.css'

function ChatMessage({ role, text, showFeedback, onFeedback }) {
  return (
    <div className={role === 'user' ? 'cb-msg user' : 'cb-msg bot'}>
      <div className="cb-avatar">{role === 'user' ? '🧑' : '🌿'}</div>
      <div className="cb-bubble">
        {text}
        {role === 'bot' && showFeedback && (
          <div className="cb-feedback">
            <p className="cb-feedback-text">Did that answer help, or are you looking for something else?</p>
            <div className="cb-feedback-buttons">
              <button className="cb-feedback-btn helpful" onClick={() => onFeedback('helpful')}>👍 That helped</button>
              <button className="cb-feedback-btn more" onClick={() => onFeedback('more')}>👀 Show me more</button>
              <button className="cb-feedback-btn person" onClick={() => onFeedback('person')}>👤 Talk to a person</button>
            </div>
          </div>
        )}
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

function getBotReply(message, products, navigate) {
  const q = message.toLowerCase();
  
  console.log('Chatbot query:', q);
  console.log('Products available:', products.length);
  
  // Check if user is asking for links
  const askingForLinks = q.includes('link') || q.includes('clickable') || q.includes('navigate');
  
  // If products are not loaded yet
  if (!products || products.length === 0) {
    return {
      text: "I'm loading product data. Please try again in a moment!",
      showFeedback: false
    };
  }
  
  // Extract keywords from query (remove common stopwords)
  const stopwords = ['give', 'me', 'show', 'what', 'are', 'present', 'under', 'the', 'that', 'is', 'a', 'an', 'and', 'or', 'for', 'with', 'about', 'can', 'you', 'list', 'of', 'best', 'selling', 'recommend', 'prone', 'skin', 'acne'];
  const keywords = q.split(' ').filter(word => word.length > 2 && !stopwords.includes(word));
  
  console.log('Extracted keywords:', keywords);
  
  // Common product category mappings (singular to plural and vice versa)
  const categoryMappings = {
    'serums': 'serum',
    'serum': 'serum',
    'facewash': 'facewash',
    'face wash': 'facewash',
    'facewash': 'facewash',
    'scrubs': 'scrub',
    'scrub': 'scrub',
    'face washes': 'facewash',
    'moisturizers': 'moisturzinglotion',
    'moisturizer': 'moisturzinglotion',
    'sunscreen': 'sunscreenlotion',
    'toners': 'toner',
    'toner': 'toner',
    'creams': 'cream',
    'cream': 'cream'
  };
  
  // Normalize keywords to match categories
  const normalizedKeywords = keywords.map(kw => categoryMappings[kw] || kw);
  
  console.log('Normalized keywords:', normalizedKeywords);
  
  // Find products whose category matches exactly first, then name matches
  const matches = products.filter(product => {
    const nameLower = product.name?.toLowerCase() || '';
    const categoryLower = product.category?.toLowerCase() || '';
    const descriptionLower = product.description?.toLowerCase() || '';
    
    // Check if any normalized keyword matches category exactly
    if (normalizedKeywords.some(kw => categoryLower === kw)) {
      return true;
    }
    
    // Check if any keyword matches category as substring
    if (normalizedKeywords.some(kw => categoryLower.includes(kw))) {
      return true;
    }
    
    // Check if any keyword matches name as whole word
    if (normalizedKeywords.some(kw => nameLower.includes(kw))) {
      return true;
    }
    
    return false;
  });
  
  console.log('Matches found:', matches.length);
  if (matches.length > 0) {
    console.log('First few matches:', matches.slice(0, 3).map(p => ({ name: p.name, category: p.category })));
  }
  
  if (matches.length > 0) {
    if (askingForLinks) {
      // Create clickable product links
      const productLinks = matches.map(p => {
        const handleClick = () => navigate(`/product/${p.id}`);
        return (
          <div key={p.id} className="cb-product-link" onClick={handleClick}>
            <strong>{p.name}</strong> - ₹{p.price} ({p.weight})
          </div>
        );
      });
      
      return {
        text: (
          <div>
            <p>Here are some Leeya products you might like:</p>
            {productLinks}
          </div>
        ),
        showFeedback: true
      };
    } else {
      // Just show a simple list
      return {
        text: 'Here are some Leeya products you might like:\n' + matches.map(p => `• ${p.name}`).join('\n'),
        showFeedback: true
      };
    }
  }
  
  // If no product matches, fallback to a helpful message
  return {
    text: "I'm here to help with Leeya Herbals products. Ask about face wash, serums, scrubs, or any product you see on our website!",
    showFeedback: false
  };
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m Leeya Guide. What are you looking for today?' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const listRef = useRef(null)
  const navigate = useNavigate()

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error loading products for chatbot:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

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
    const reply = getBotReply(userText, products, navigate)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: typeof reply === 'string' ? reply : reply.text,
        showFeedback: typeof reply === 'object' ? reply.showFeedback : false
      }])
      setTyping(false)
    }, 600)
  }

  const handleFeedback = (type) => {
    let responseText = ''
    switch(type) {
      case 'helpful':
        responseText = 'Great! I\'m glad I could help you find what you were looking for. Feel free to ask about any other Leeya Herbals products!'
        break
      case 'more':
        responseText = 'I\'d love to show you more! Try asking about specific categories like "face wash", "serums", "moisturizers", or "sunscreen" to see our full range.'
        break
      case 'person':
        responseText = 'I understand you\'d like to speak with someone. You can contact our team through the Contact page or call our customer service. They\'ll be happy to help with detailed product advice!'
        break
    }
    setMessages(prev => [...prev, { role: 'bot', text: responseText, showFeedback: false }])
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
            <ChatMessage key={i} role={m.role} text={m.text} showFeedback={m.showFeedback} onFeedback={handleFeedback} />
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


