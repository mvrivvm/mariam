import React from 'react';
import { Ticket, User, TicketHistoryEvent, UserRole } from '../types';
import { XMarkIcon, ClockIcon } from './icons';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  users: User[];
  history: TicketHistoryEvent[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, ticket, users, history }) => {
  if (!isOpen) return null;
  
  const ticketHistory = history
    .filter(h => h.ticketId === ticket.id)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const renderEventDetails = (event: TicketHistoryEvent) => {
    const user = users.find(u => u.id === event.userId);
    const userName = user ? user.name : 'System';
    const userRole = user ? user.role : 'System';

    let detailText = '';
    switch (event.action) {
      case 'CREATE':
        detailText = `created the ticket: "${event.to}".`;
        break;
      case 'STATUS_CHANGE':
        detailText = `changed status from "${event.from}" to "${event.to}".`;
        break;
      case 'ASSIGN':
        detailText = `assigned the ticket to ${event.to}.`;
        break;
      case 'UNASSIGN':
        detailText = `removed ${event.from} from the ticket.`;
        break;
      case 'ADD_NOTE':
        detailText = `added ${event.to} to the ticket.`;
        break;
      default:
        detailText = 'performed an unknown action.';
    }
    
    return (
      <p className="text-sm text-gray-700">
        <span className={`font-semibold ${userRole === UserRole.Client ? 'text-blue-600' : 'text-green-700'}`}>{userName}</span> {detailText}
      </p>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-neutral-medium rounded-lg shadow-xl w-full max-w-2xl h-[70vh] flex flex-col transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b border-neutral-extralight">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-6 h-6 text-brand-primary" />
            <h2 className="text-xl font-bold text-gray-900">History for Ticket #{ticket.id}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          {ticketHistory.length > 0 ? (
            <div className="relative border-l-2 border-neutral-extralight ml-4">
              {ticketHistory.map((event, index) => (
                <div key={event.id} className="mb-8 ml-8">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-brand-primary/20 rounded-full -left-3 ring-4 ring-neutral-medium">
                    <ClockIcon className="w-3 h-3 text-brand-primary" />
                  </span>
                  <div className="bg-neutral-light p-3 rounded-lg border border-neutral-extralight">
                    {renderEventDetails(event)}
                  </div>
                  <time className="block mt-1 text-xs font-normal leading-none text-gray-400">
                    {new Date(event.timestamp).toLocaleString([], { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </time>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center text-gray-500 py-10">
                <p>No history events recorded for this ticket yet.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
