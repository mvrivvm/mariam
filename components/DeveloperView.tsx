import React, { useState, useCallback } from 'react';
import { Ticket, TicketStatus, UserRole, User, TicketType, ChatMessage, TicketHistoryEvent } from '../types';
import TicketCard from './TicketCard';

interface DeveloperViewProps {
  currentUser: User;
  tickets: Ticket[];
  users: User[];
  messages: ChatMessage[];
  history: TicketHistoryEvent[];
  addTicket: (details: { title: string; description: string; type: TicketType; assignedDeveloperId: number }) => void;
  addMessage: (ticketId: number, text: string) => void;
  updateTicketStatus: (id: number, status: TicketStatus, notes?: string, userFriendlyNote?: string) => void;
  updateTicketAssignees: (ticketId: number, newDeveloperIds: number[]) => void;
  archiveTicket: (ticketId: number) => void;
  showNotification: (message: string) => void;
}

const CreateTaskCard: React.FC<{
  developers: User[];
  addTicket: (details: { title: string; description: string; type: TicketType; assignedDeveloperId: number }) => void;
}> = ({ developers, addTicket }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ticketType, setTicketType] = useState<TicketType>(TicketType.ProgramIssue);
  const [assignedDeveloperId, setAssignedDeveloperId] = useState<string>(developers.length > 0 ? String(developers[0].id) : '');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && assignedDeveloperId) {
      addTicket({
        title,
        description,
        type: ticketType,
        assignedDeveloperId: parseInt(assignedDeveloperId, 10),
      });
      setTitle('');
      setDescription('');
      setTicketType(TicketType.ProgramIssue);
    }
  }, [title, description, ticketType, assignedDeveloperId, addTicket]);

  return (
    <div className="bg-neutral-medium p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Task</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-1">
          <label htmlFor="dev-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" id="dev-title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-neutral-light border border-neutral-extralight text-gray-900 rounded-md p-2 focus:ring-2 focus:ring-brand-accent focus:outline-none" required />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="dev-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input type="text" id="dev-description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-neutral-light border border-neutral-extralight text-gray-900 rounded-md p-2 focus:ring-2 focus:ring-brand-accent focus:outline-none" />
        </div>
        <div>
          <label htmlFor="dev-ticketType" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select id="dev-ticketType" value={ticketType} onChange={(e) => setTicketType(e.target.value as TicketType)} className="w-full bg-neutral-light border border-neutral-extralight text-gray-900 rounded-md p-2 focus:ring-2 focus:ring-brand-accent focus:outline-none">
            <option value={TicketType.ProgramIssue}>مشكلة في البرنامج</option>
            <option value={TicketType.Unlock}>فك قيد</option>
          </select>
        </div>
        <div>
          <label htmlFor="dev-assign" className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
          <select id="dev-assign" value={assignedDeveloperId} onChange={(e) => setAssignedDeveloperId(e.target.value)} className="w-full bg-neutral-light border border-neutral-extralight text-gray-900 rounded-md p-2 focus:ring-2 focus:ring-brand-accent focus:outline-none">
            {developers.map(dev => <option key={dev.id} value={dev.id}>{dev.name}</option>)}
          </select>
        </div>
        <button type="submit" className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition h-10">Create Task</button>
      </form>
    </div>
  );
};


const TicketColumn: React.FC<{ title: string; tickets: Ticket[]; status: TicketStatus; children: React.ReactNode }> = ({ title, tickets, status, children }) => {
    const statusColor = {
        [TicketStatus.Tasks]: 'border-status-open',
        [TicketStatus.InProgress]: 'border-status-progress',
        [TicketStatus.Wait]: 'border-status-wait',
        [TicketStatus.Reject]: 'border-status-reject',
        [TicketStatus.Completed]: 'border-status-completed',
        [TicketStatus.Archived]: 'border-gray-400',
    }[status];

    return (
        <div className="bg-neutral-medium rounded-lg p-4 flex-shrink-0 w-80 md:w-96">
            <h3 className={`text-lg font-semibold mb-4 pb-2 text-gray-800 border-b-2 ${statusColor}`}>{title} ({tickets.length})</h3>
            <div className="space-y-4 h-[calc(100vh-22rem)] overflow-y-auto pr-2">
              {children}
            </div>
        </div>
    );
};

const DeveloperView: React.FC<DeveloperViewProps> = ({ currentUser, tickets, users, messages, history, addTicket, addMessage, updateTicketStatus, updateTicketAssignees, archiveTicket, showNotification }) => {
  const tasksTickets = tickets.filter(t => t.status === TicketStatus.Tasks);
  const inProgressTickets = tickets.filter(t => t.status === TicketStatus.InProgress);
  const waitTickets = tickets.filter(t => t.status === TicketStatus.Wait);
  const rejectTickets = tickets.filter(t => t.status === TicketStatus.Reject);
  const completedTickets = tickets.filter(t => t.status === TicketStatus.Completed);
  const archivedTickets = tickets.filter(t => t.status === TicketStatus.Archived);
  
  const developers = users.filter(u => u.role === UserRole.Developer);

  const renderTicketCard = (ticket: Ticket) => (
    <TicketCard 
      key={ticket.id} 
      ticket={ticket} 
      userRole={currentUser.role} 
      currentUser={currentUser}
      messages={messages}
      history={history}
      addMessage={addMessage}
      updateTicketStatus={updateTicketStatus} 
      updateTicketAssignees={updateTicketAssignees} 
      archiveTicket={archiveTicket} 
      showNotification={showNotification} 
      users={users} 
    />
  );

  return (
    <div className="p-4 md:p-8">
       <CreateTaskCard developers={developers} addTicket={addTicket} />
      <div className="flex gap-6 pb-4 overflow-x-auto">
        <TicketColumn title="Tasks" tickets={tasksTickets} status={TicketStatus.Tasks}>
          {tasksTickets.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime()).map(renderTicketCard)}
        </TicketColumn>
        <TicketColumn title="In Progress" tickets={inProgressTickets} status={TicketStatus.InProgress}>
          {inProgressTickets.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime()).map(renderTicketCard)}
        </TicketColumn>
        <TicketColumn title="Wait" tickets={waitTickets} status={TicketStatus.Wait}>
          {waitTickets.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime()).map(renderTicketCard)}
        </TicketColumn>
        <TicketColumn title="Completed" tickets={completedTickets} status={TicketStatus.Completed}>
            {completedTickets.sort((a,b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0)).map(renderTicketCard)}
        </TicketColumn>
         <TicketColumn title="Reject" tickets={rejectTickets} status={TicketStatus.Reject}>
          {rejectTickets.sort((a,b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0)).map(renderTicketCard)}
        </TicketColumn>
        {currentUser.role === UserRole.Admin && (
            <TicketColumn title="Archived" tickets={archivedTickets} status={TicketStatus.Archived}>
              {archivedTickets.sort((a,b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0)).map(renderTicketCard)}
            </TicketColumn>
        )}
      </div>
    </div>
  );
};

export default DeveloperView;