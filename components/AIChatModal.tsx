import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, SparklesIcon, UserIcon } from './icons';
import { AIChatMessage } from '../types';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: AIChatMessage[];
  onSendMessage: (message: string) => void;
  isThinking: boolean;
}

const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose, messages, onSendMessage, isThinking }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && !isThinking) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-neutral-medium rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-neutral-extralight">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-brand-primary" />
            <h2 className="text-xl font-bold text-gray-900">AI Assistant</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((message, index) => {
            const isUser = message.role === 'user';
            return (
              <div key={index} className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center font-bold text-brand-primary text-sm flex-shrink-0"><SparklesIcon className="w-5 h-5" /></div>}
                <div className={`max-w-md p-3 rounded-lg ${isUser ? 'bg-brand-primary text-white rounded-br-none' : 'bg-neutral-light text-gray-800 rounded-bl-none'}`}>
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
                {isUser && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-sm flex-shrink-0"><UserIcon className="w-5 h-5"/></div>}
              </div>
            );
          })}
          {isThinking && (
            <div className="flex items-start gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center font-bold text-brand-primary text-sm flex-shrink-0"><SparklesIcon className="w-5 h-5" /></div>
              <div className="max-w-md p-3 rounded-lg bg-neutral-light text-gray-800 rounded-bl-none">
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                 </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-neutral-extralight">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-neutral-light border border-neutral-extralight text-gray-900 rounded-md p-2 focus:ring-2 focus:ring-brand-accent focus:outline-none"
              placeholder="Ask about Metallic ERP..."
              autoFocus
              disabled={isThinking}
            />
            <button type="submit" className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={isThinking}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChatModal;
