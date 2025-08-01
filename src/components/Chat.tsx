import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Loader2, ShoppingBag } from 'lucide-react';
import { getChatCompletion, type Message } from '@/lib/groq';
import ProductGrid from './ProductGrid';
import { searchHnMProducts } from '@/lib/browserUse';

interface Product {
  id: string;
  name: string;
  price: string;
  currency?: string;
  url: string;
  image_url: string;
  description: string;
  brand: string;
  category: string;
  availability: 'in_stock' | 'out_of_stock' | 'limited';
  rating?: number;
  reviews_count?: number;
}

interface ChatMessage extends Message {
  id: string;
  timestamp: Date;
  isLoading?: boolean;
  products?: Product[];
  searchQuery?: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '👋 Hi! I\'m your AI Fashion Stylist! I can help you find trendy outfits, suggest styles for any occasion, and show you real products from stores like H&M. What kind of look are you going for today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const extractProductsFromResponse = async (response: string, userQuery: string): Promise<Product[] | undefined> => {
    try {
      const productMentions = extractProductMentions(response);
      if (productMentions.length > 0) {
        const productResults = await Promise.all(
          productMentions.map(async (productName) => {
            try {
              const result = await searchHnMProducts(productName);
              return result.products[0];
            } catch (error) {
              console.error(`Error searching for product ${productName}:`, error);
              return null;
            }
          })
        );
        const validProducts = productResults.filter(Boolean) as Product[];
        if (validProducts.length > 0) {
          return validProducts;
        }
      }
      if (userQuery && userQuery.length > 2) {
        const result = await searchHnMProducts(userQuery);
        return result.products.slice(0, 4);
      }
      return [];
    } catch (error) {
      console.error('Error in product extraction:', error);
      return undefined;
    }
  };
  
  const extractProductMentions = (text: string): string[] => {
    // Extract quoted text as potential product names
    const quotedMatches = text.match(/(?:"([^"]+)"|'([^']+)')/g) || [];
    const cleanedQuotes = quotedMatches.map(match => 
      match.replace(/^['"]|['"]$/g, '')
    );
    
    // Extract common fashion product patterns
    const fashionKeywords = ['dress', 'shirt', 'pants', 'jeans', 'jacket', 'skirt', 'shoes', 'heels', 'sneakers'];
    const keywordMatches = fashionKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    );
    
    return [...new Set([...cleanedQuotes, ...keywordMatches])];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    const loadingMessage: ChatMessage = {
      id: `loading-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };
    
    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const conversationHistory: Message[] = messages
        .filter(msg => !msg.isLoading)
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));
      
      conversationHistory.push({ role: 'user', content: userMessage.content });
      
      const response = await getChatCompletion(conversationHistory);
      const products = await extractProductsFromResponse(response, userMessage.content);
      
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        products,
      };
      
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== loadingMessage.id),
        assistantMessage,
      ]);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== loadingMessage.id),
        errorMessage,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content: string, products?: Product[]) => {
    if (!content) return null;
    
    // Split by double newlines to handle paragraphs
    return content.split('\n\n').map((paragraph, i) => {
      // Check if paragraph contains a list
      if (paragraph.includes('\n- ')) {
        const [listTitle, ...items] = paragraph.split('\n');
        return (
          <div key={i} className="mb-4">
            {listTitle && <p className="mb-2 font-medium">{listTitle}</p>}
            <ul className="list-disc pl-5 space-y-1">
              {items.map((item, j) => (
                <li key={j} className="text-gray-800">
                  {item.replace(/^\s*-\s*/, '')}
                </li>
              ))}
            </ul>
          </div>
        );
      }
      
      return <p key={i} className="mb-4 last:mb-0">{paragraph}</p>;
    });
  };

  const getMessageIcon = (role: string, isLoading?: boolean) => {
    if (isLoading) {
      return <Loader2 className="w-4 h-4 animate-spin text-purple-500" />;
    }
    return role === 'assistant' ? (
      <Bot className="w-4 h-4 text-purple-500" />
    ) : (
      <User className="w-4 h-4 text-blue-500" />
    );
  };

  const getMessageBgColor = (role: string) => {
    return role === 'assistant' 
      ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100'
      : 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100';
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-100">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-2 rounded-lg">
          <ShoppingBag className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold ml-3 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          StylerGPT
        </h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 px-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl rounded-2xl p-4 ${getMessageBgColor(message.role)}`}
            >
              <div className="flex items-center mb-2">
                {getMessageIcon(message.role, message.isLoading)}
                <span className="font-semibold ml-2">
                  {message.role === 'assistant' ? 'Fashion AI' : 'You'}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              <div className="whitespace-pre-wrap text-gray-800">
                {formatMessage(message.content, message.products)}
              </div>
              
              {message.products && message.products.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-sm text-gray-600 mb-3">✨ Recommended for you:</h4>
                  <ProductGrid products={message.products} />
                </div>
              )}
              
              {message.isLoading && (
                <div className="flex items-center mt-3 text-purple-600 text-sm">
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  <span>Finding the perfect styles...</span>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me about fashion trends, outfit ideas, or find specific items..."
              className="pr-12 border-gray-200 focus-visible:ring-2 focus-visible:ring-purple-500 rounded-xl"
              disabled={isLoading}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-gray-400 hover:bg-transparent"
              onClick={() => {
                // Add emoji picker or other action
              }}
            >
              😊
            </Button>
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl shadow-sm"
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        {/* Quick suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {["Summer outfits", "Work attire", "Casual looks", "Date night"].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => {
                setInputValue(suggestion);
                // Small delay to ensure state updates before sending
                setTimeout(() => {
                  handleSendMessage();
                }, 50);
              }}
              className="text-xs rounded-full border-gray-200 hover:bg-gray-50 text-gray-700"
              disabled={isLoading}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
