import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PaperPlaneIcon, Cross2Icon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import spiderIcon from '../../assets/spider.png';
import './chat.css';

export const ChatInterface = ({ triggerAnimation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your Spider-Man assistant! How can I help?", isBot: true }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const [botThinking, setBotThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);
  // Add this new function to handle user typing
  const handleTyping = (e) => {
    setInputMessage(e.target.value);
    setUserTyping(true);
    // Clear typing indicator after 1 second of no typing
    setTimeout(() => setUserTyping(false), 1000);
  };
  // Modify handleSend function
  const handleSend = async () => {
    if (!inputMessage.trim()) return;
    const userId = 1;
    setUserTyping(false);
    
    // Add user message with typing animation
    const newMessages = [...messages, { 
      text: inputMessage, 
      isBot: false,
      isTyping: true 
    }];
    setMessages(newMessages);
    setInputMessage('');
  
    if (inputMessage.toLowerCase().includes('jump')) {
      triggerAnimation('jump');
    }
  
    setBotThinking(true);
    setIsTyping(true);
  
    try {
      // Simulate bot thinking process
      const thinkingMessage = {
        text: "Let me think about that...",
        isBot: true,
        isThinking: true
      };
      setMessages([...newMessages, thinkingMessage]);
  
      const response = await fetch('http://localhost:5000/api/llm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputMessage,
          userId
        })
      });
  
      const data = await response.json();
      
      // Replace thinking message with actual response
      setMessages([...newMessages, { 
        text: data.reply, 
        isBot: true,
        isNew: true 
      }]);
    } catch (error) {
      console.error("❌ Error calling API:", error);
      setMessages([...newMessages, { 
        text: "Oops! Something went wrong. 😵", 
        isBot: true,
        isError: true 
      }]);
    }
  
    setBotThinking(false);
    setIsTyping(false);
  };
  // Update the message rendering part
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-96 glass-morphism shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="p-4 border-b border-green-500/20 bg-gradient-to-r from-green-900/20 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="border-2 border-green-500/80 bg-black/50 p-1">
                  <AvatarImage src={spiderIcon} className="p-1" />
                  <AvatarFallback className="bg-green-600/80">SP</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-green-400">Spider-Assist</h3>
                  <p className="text-xs text-green-500/50">
                    {isTyping ? 'Typing...' : 'Online'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-400/50 hover:text-green-400 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <Cross2Icon className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 h-[480px] bg-gradient-to-b from-black/50 to-green-900/10">
            <ScrollArea className="h-full p-4">
              <div className="flex flex-col gap-4">
                {messages.map((msg, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "flex",
                      msg.isBot ? 'justify-start' : 'justify-end'
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] p-3 rounded-2xl relative transition-all",
                        "animate-message",
                        msg.isBot 
                          ? 'bg-green-900/30 text-green-400 chat-message-bot' 
                          : 'bg-green-600 text-white chat-message-user',
                        msg.isThinking && 'thinking-animation',
                        msg.isNew && 'new-message-animation',
                        msg.isError && 'error-animation'
                      )}
                    >
                      {msg.text}
                      {msg.isThinking && (
                        <div className="absolute -bottom-6 left-0 text-xs text-green-400/60">
                          Processing response...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {(userTyping || isTyping) && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] p-3 rounded-2xl">
                      <div className="flex space-x-2 items-center">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-4 border-t border-green-500/20 bg-gradient-to-r from-green-900/10 to-black/50">
            <form
              className="flex w-full gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Message Spider-Assist..."
                className="bg-black/50 text-green-400 border-green-500/20 backdrop-blur-sm
                         focus:border-green-500/50 focus-visible:ring-0 rounded-xl h-11
                         placeholder:text-green-500/50"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-green-600/80 hover:bg-green-500 rounded-xl h-11 w-11
                         transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/20"
                disabled={isTyping}
              >
                <PaperPlaneIcon className="h-5 w-5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-16 w-16 rounded-full bg-green-600/80 hover:bg-green-500 
                   shadow-2xl hover:shadow-green-500/20 transition-all
                   animate-in zoom-in-95 slide-in-from-bottom-4"
          style={{
            transform: 'translateY(0)',
            animation: 'float 3s ease-in-out infinite'
          }}
        >
          <img 
            src={spiderIcon}
            alt="Chat"
            className="h-9 w-9 invert opacity-90 hover:opacity-100 
                     transition-opacity"
          />
        </Button>
      )}
    </div>
  );
};
