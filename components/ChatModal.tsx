import React, { useState, useRef, useEffect } from 'react';
import { Ticket, User, ChatMessage } from '../types';
import { XMarkIcon } from './icons';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  currentUser: User;
  users: User[];
  messages: ChatMessage[];
  addMessage: (ticketId: number, text: string) => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, ticket, currentUser, users, messages, addMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const ticketMessages = messages.filter(m => m.ticketId === ticket.id).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [ticketMessages, isOpen]);


  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      addMessage(ticket.id, newMessage.trim());
      setNewMessage('');
    }
  };

  const getSender = (senderId: number) => users.find(u => u.id === senderId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-neutral-medium rounded-lg shadow-xl w-full max-w-lg h-[70vh] flex flex-col transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-neutral-extralight">
          <h2 className="text-xl font-bold text-gray-900">Chat for Ticket #{ticket.id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {ticketMessages.map(message => {
            const sender = getSender(message.senderId);
            const isCurrentUser = message.senderId === currentUser.id;
            return (
              <div key={message.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                {!isCurrentUser && <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center font-bold text-brand-primary text-sm flex-shrink-0">{sender?.name.charAt(0)}</div>}
                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${isCurrentUser ? 'bg-brand-primary text-white rounded-br-none' : 'bg-neutral-light text-gray-800 rounded-bl-none'}`}>
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-neutral-extralight">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-neutral-light border border-neutral-extralight text-gray-900 rounded-md p-2 focus:ring-2 focus:ring-brand-accent focus:outline-none"
              placeholder="Type your message..."
              autoFocus
            />
            <button type="submit" className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
