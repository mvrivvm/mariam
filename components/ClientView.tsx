import React, { useState, useCallback } from 'react';
import { Ticket, TicketStatus, TicketType, User, ChatMessage, TicketHistoryEvent } from '../types';
import TicketCard from './TicketCard';

interface ClientViewProps {
  currentUser: User;
  users: User[];
  tickets: Ticket[];
  messages: ChatMessage[];
  history: TicketHistoryEvent[];
  addTicket: (details: { title: string; description: string; type: TicketType }) => void;
  addMessage: (ticketId: number, text: string) => void;
  showNotification: (message: string) => void;
}

const ClientView: React.FC<ClientViewProps> = ({ currentUser, users, tickets, messages, history, addTicket, addMessage, showNotification }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ticketType, setTicketType] = useState<TicketType>(TicketType.ProgramIssue);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      addTicket({ title, description, type: ticketType });
      setTitle('');
      setDescription('');
      setTicketType(TicketType.ProgramIssue);
    }
  }, [title, description, ticketType, addTicket]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8">
      <div className="lg:col-span-1 bg-neutral-medium p-6 rounded-lg shadow-lg h-fit">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit a New Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-light border border-neutral-extralight text-gray-900 rounded-md p-2 focus:ring-2 focus:ring-brand-accent focus:outline-none"
              placeholder="e.g., Login issue"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="ticketType" className="block text-sm font-medium text-gray-700 mb-1">نوع المشكلة</label>
            <select
              id="ticketType"
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value as TicketType)}
              className="w-full bg-neutral-light border border-neutral-extralight text-gray-900 rounded-md p-2 focus:ring-2 focus:ring-brand-accent focus:outline-none"
            >
              <option value={TicketType.ProgramIssue}>مشكلة في البرنامج</option>
              <option value={TicketType.Unlock}>فك قيد</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full bg-neutral-light border border-neutral-extralight text-gray-900 rounded-md p-2 focus:ring-2 focus:ring-brand-accent focus:outline-none"
              placeholder="Please describe the issue in detail..."
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
          >
            Submit Ticket
          </button>
        </form>
      </div>

      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Tickets</h2>
        <div className="space-y-4">
          {tickets.length > 0 ? (
            tickets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map(ticket => (
              <TicketCard 
                key={ticket.id} 
                ticket={ticket} 
                users={users} 
                userRole={currentUser.role}
                currentUser={currentUser}
                messages={messages}
                history={history}
                addMessage={addMessage}
              />
            ))
          ) : (
            <div className="bg-neutral-medium p-6 rounded-lg text-center text-gray-500">
              You have not submitted any tickets yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientView;
