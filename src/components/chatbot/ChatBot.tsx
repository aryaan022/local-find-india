
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Send } from 'lucide-react';

interface ChatBotProps {
  onClose: () => void;
}

interface Message {
  id: number;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: 'bot',
    content: 'Hello! Welcome to Local Business Directory. How can I assist you today?',
    timestamp: new Date(),
  },
];

const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Predefined responses
  const responses: Record<string, string[]> = {
    greeting: [
      'Hello! How can I assist you today?',
      'Hi there! What can I help you with?',
      'Welcome! Ask me anything about local businesses.'
    ],
    business: [
      'We have many local businesses registered across various categories. You can search by location or category.',
      'Our platform features businesses like grocery stores, restaurants, clothing shops, and much more!',
      'You can find detailed information about businesses including contact details, reviews, and operating hours.'
    ],
    registration: [
      'To register your business, click on "Register Now" in the business section of our homepage.',
      'Business registration is simple! Just create an account and follow the guided steps.',
      'Once you register, you can manage your business profile, add products, and respond to customer reviews.'
    ],
    features: [
      'Our platform allows you to search for local businesses, read and leave reviews, and save your favorite places.',
      'You can contact businesses directly through our platform and view their product listings.',
      'We provide detailed business information including opening hours, contact details, and customer ratings.'
    ],
    help: [
      'You can navigate to different sections using the menu at the top of the page.',
      'To search for a business, use the search bar on the homepage or businesses page.',
      'If you need further assistance, you can contact our support team at support@localbiz.com'
    ]
  };

  const getResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      const random = Math.floor(Math.random() * responses.greeting.length);
      return responses.greeting[random];
    }
    
    if (input.includes('business') || input.includes('shop') || input.includes('store')) {
      const random = Math.floor(Math.random() * responses.business.length);
      return responses.business[random];
    }
    
    if (input.includes('register') || input.includes('sign up') || input.includes('create account')) {
      const random = Math.floor(Math.random() * responses.registration.length);
      return responses.registration[random];
    }
    
    if (input.includes('feature') || input.includes('what can') || input.includes('do you do')) {
      const random = Math.floor(Math.random() * responses.features.length);
      return responses.features[random];
    }
    
    if (input.includes('help') || input.includes('how to') || input.includes('guide')) {
      const random = Math.floor(Math.random() * responses.help.length);
      return responses.help[random];
    }
    
    return "I'm not sure how to respond to that. You can ask me about local businesses, registration, or features of our platform!";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        role: 'bot',
        content: getResponse(input),
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-24 right-6 w-80 md:w-96 z-50">
      <Card className="shadow-xl">
        <CardHeader className="bg-india-blue text-white py-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-white text-india-blue">LB</AvatarFallback>
              </Avatar>
              <span>Business Assistant</span>
            </CardTitle>
            <Button variant="ghost" size="icon" className="text-white" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[350px] overflow-y-auto p-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-3 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-india-blue text-white rounded-br-none' 
                      : 'bg-gray-100 rounded-bl-none'
                  }`}
                >
                  {message.content}
                  <div 
                    className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="p-2 border-t">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatBot;
