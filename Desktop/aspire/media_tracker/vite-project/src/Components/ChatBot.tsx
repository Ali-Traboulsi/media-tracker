import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  lastRestocked: string;
  supplier: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample inventory data
  const [inventory, ] = useState<InventoryItem[]>([
    { id: '1', name: 'Wireless Mouse', category: 'Electronics', quantity: 42, price: 24.99, lastRestocked: '2023-05-15', supplier: 'TechGear Inc.' },
    { id: '2', name: 'Mechanical Keyboard', category: 'Electronics', quantity: 18, price: 89.99, lastRestocked: '2023-06-02', supplier: 'KeyMaster Ltd.' },
    { id: '3', name: 'HDMI Cable', category: 'Accessories', quantity: 127, price: 12.49, lastRestocked: '2023-06-10', supplier: 'ConnectPro' },
    { id: '4', name: 'USB-C Adapter', category: 'Accessories', quantity: 35, price: 15.99, lastRestocked: '2023-05-28', supplier: 'PortTech' },
    { id: '5', name: 'Laptop Stand', category: 'Furniture', quantity: 23, price: 34.95, lastRestocked: '2023-06-05', supplier: 'ErgoWorks' },
  ]);

  // Replace with your actual Gemini API key
  const GEMINI_API_KEY = 'AIzaSyDdnOG2-pomHKnNZHRvykwuKY1DqwtMPfA';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Create a string representation of the inventory for the AI prompt
      const inventorySummary = inventory.map(item => 
        `${item.name} (${item.category}): ${item.quantity} in stock, $${item.price} each`
      ).join('\n');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an AI assistant for an inventory management system. 
                  Current inventory includes:\n${inventorySummary}\n\n
                  Your responses should be concise and focused on inventory management.
                  You can help with:\n
                  - Checking stock levels\n
                  - Finding items by category\n
                  - Identifying low stock items\n
                  - Providing item details\n
                  - Suggesting when to reorder\n\n
                  User question: ${input}`
                }
              ]
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const modelResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that request.";

      setMessages(prev => [...prev, { role: 'model', content: modelResponse }]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: "Sorry, I'm having trouble connecting to the service. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-[500px] bg-white dark:bg-[#121212] rounded-t-xl shadow-xl flex flex-col border border-[#29b093] dark:border-[#e0f11f] overflow-hidden">
          {/* Chat header */}
          <div className="bg-[#29b093] dark:bg-[#e0f11f] text-white dark:text-[#121212] p-3 flex justify-between items-center">
            <h3 className="font-bold">Inventory Assistant</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white cursor-pointer hover:text-[#121213] dark:hover:text-white hover:bg-opacity-20 dark:hover:bg-[#121212] dark:hover:bg-opacity-20 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                <p>Ask about inventory items, stock levels, or categories.</p>
                <p className="text-sm mt-2">Try: "How many wireless mice do we have?"</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${message.role === 'user' 
                      ? 'bg-[#29b093] dark:bg-[#e0f11f] text-white dark:text-[#121212]'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about inventory..."
                className="flex-1 rounded-l-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#29b093] dark:focus:ring-[#e0f11f] bg-white dark:bg-[#121212] text-gray-900 dark:text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`bg-[#29b093] dark:bg-[#e0f11f] text-white dark:text-[#121212] px-4 py-2 rounded-r-md ${(!input.trim() || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#29b093] cursor-pointer dark:bg-[#e0f11f] text-white dark:text-[#121212] rounded-full p-4 shadow-lg hover:opacity-90 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
}