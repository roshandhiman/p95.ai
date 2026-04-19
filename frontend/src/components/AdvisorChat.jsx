import { useState } from 'react';
import { X, Send, Bot } from 'lucide-react';

export default function AdvisorChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am your Outreach Advisor. Need help optimizing your Subject Lines or finding the right companies?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    const currentInput = input;
    setInput('');
    
    // Add a temporary "typing" message
    setMessages(prev => [...prev, { sender: 'bot', text: 'Analyzing your product and our company dataset...' }]);

    try {
        const response = await fetch('http://localhost:3001/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productDescription: currentInput })
        });
        
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        
        // Remove the "typing" message
        setMessages(prev => prev.filter(m => m.text !== 'Analyzing your product and our company dataset...'));

        if (data.suggestions && data.suggestions.length > 0) {
            data.suggestions.forEach(suggestion => {
                const emailContent = typeof suggestion.email === 'object' 
                    ? `Subject: ${suggestion.email.subject}\n\n${suggestion.email.body}`
                    : suggestion.email;

                const formattedText = `**Company:** ${suggestion.company}\n\n**Reason:** ${suggestion.reason}\n\n**Pain Points:** ${suggestion.pain_points}\n\n**Best Approach:** ${suggestion.approach}\n\n**Personalized Cold Email:**\n${emailContent}`;
                setMessages(prev => [...prev, { sender: 'bot', text: formattedText }]);
            });
        } else {
            setMessages(prev => [...prev, { sender: 'bot', text: "I couldn't find any perfect matches in our current dataset, but I recommend targeting companies in similar high-growth sectors." }]);
        }
    } catch (error) {
        setMessages(prev => prev.filter(m => m.text !== 'Analyzing your product and our company dataset...'));
        setMessages(prev => [...prev, { sender: 'bot', text: "I'm having a bit of trouble connecting to my brain right now. Please try again in a few seconds!" }]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gray-900 border border-gray-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform z-50 group"
        >
          <Bot size={24} className="group-hover:animate-pulse" />
        </button>
      )}

      {/* Chat Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-2xl transition-transform duration-300 z-50 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <Bot size={20} className="text-blue-500" /> AI Advisor
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-900">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white text-sm">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-lg whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-gray-900 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-2">
          <div className="relative">
            <input 
              type="text"
              placeholder="Ask for advice..."
              className="input-field pr-10 bg-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 px-2 py-1">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
