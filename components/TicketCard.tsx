import React, { useState, useCallback, useEffect } from 'react';
import { Ticket, TicketStatus, UserRole, User, ChatMessage, TicketHistoryEvent } from '../types';
import { generateResolutionNote } from './geminiService';
import { SparklesIcon, XMarkIcon, TrashIcon, ChatBubbleLeftRightIcon, UserGroupIcon, ClockIcon } from './icons';
import ChatModal from './ChatModal';
import HistoryModal from './HistoryModal';

interface TicketCardProps {
  ticket: Ticket;
  users: User[];
  currentUser: User;
  messages: ChatMessage[];
  history?: TicketHistoryEvent[];
  addMessage: (ticketId: number, text: string) => void;
  userRole?: UserRole;
  updateTicketStatus?: (id: number, status: TicketStatus, notes?: string, userFriendlyNote?: string) => void;
  updateTicketAssignees?: (ticketId: number, newDeveloperIds: number[]) => void;
  archiveTicket?: (ticketId: number) => void;
  showNotification?: (message: string) => void;
}

const statusStyles: { [key in TicketStatus]: string } = {
  [TicketStatus.Tasks]: 'bg-status-open/20 text-status-open border border-status-open',
  [TicketStatus.InProgress]: 'bg-status-progress/20 text-status-progress border border-status-progress',
  [TicketStatus.Wait]: 'bg-status-wait/20 text-status-wait border border-status-wait',
  [TicketStatus.Reject]: 'bg-status-reject/20 text-status-reject border border-status-reject',
  [TicketStatus.Completed]: 'bg-status-completed/20 text-status-completed border border-status-completed',
  [TicketStatus.Archived]: 'bg-gray-400/20 text-gray-500 border border-gray-400',
};

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-neutral-medium rounded-lg shadow-xl w-full max-w-2xl transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-neutral-extralight">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const AssigneesModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  allDevelopers: User[];
  onSave: (newDeveloperIds: number[]) => void;
}> = ({ isOpen, onClose, ticket, allDevelopers, onSave }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(ticket.developerIds);

  useEffect(() => {
    if (isOpen) {
      setSelectedIds(ticket.developerIds);
    }
  }, [isOpen, ticket.developerIds]);
  
  const handleToggle = (devId: number) => {
    setSelectedIds(prev =>
      prev.includes(devId)
        ? prev.filter(id => id !== devId)
        : [...prev, devId]
    );
  };

  const handleSave = () => {
    if(selectedIds.length === 0) {
      // Simple validation, can be replaced with a proper toast notification
      alert("A ticket must have at least one assignee.");
      return;
    }
    onSave(selectedIds);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Manage Assignees for Ticket #${ticket.id}`}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Select the developers who should be assigned to this ticket.</p>
        <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
          {allDevelopers.map(dev => (
            <label key={dev.id} htmlFor={`dev-${dev.id}`} className="flex items-center p-3 bg-neutral-light hover:bg-neutral-extralight rounded-md cursor-pointer transition">
              <input
                type="checkbox"
                id={`dev-${dev.id}`}
                checked={selectedIds.includes(dev.id)}
                onChange={() => handleToggle(dev.id)}
                className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-accent"
              />
              <span className="ml-3 font-medium text-gray-800">{dev.name}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button onClick={onClose} className="bg-neutral-extralight hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition">Cancel</button>
          <button onClick={handleSave} className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition">Save Changes</button>
        </div>
      </div>
    </Modal>
  );
};


const TicketCard: React.FC<TicketCardProps> = ({ ticket, users, currentUser, messages, history, addMessage, userRole, updateTicketStatus, updateTicketAssignees, archiveTicket, showNotification }) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [rejectionReason, setRejectionReason] = useState('');
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [userFriendlyNotes, setUserFriendlyNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const client = users.find(u => u.id === ticket.clientId);
  const allDevelopers = users.filter(u => u.role === UserRole.Developer);
  const assignedDevelopers = users.filter(u => ticket.developerIds.includes(u.id));

  const canChat = (
    (currentUser.role === UserRole.Client && assignedDevelopers.some(d => d.name === 'Mariam')) ||
    (currentUser.role === UserRole.Developer && currentUser.name === 'Mariam')
  );

  const handleStatusChange = useCallback((newStatus: TicketStatus) => {
    if (updateTicketStatus) {
      updateTicketStatus(ticket.id, newStatus);
    }
  }, [ticket.id, updateTicketStatus]);

  const handleGenerateNote = useCallback(async () => {
    if (!technicalNotes.trim()) {
        showNotification?.('Please enter technical notes first.');
        return;
    }
    setIsGenerating(true);
    try {
        const note = await generateResolutionNote(ticket.description, technicalNotes);
        setUserFriendlyNotes(note);
    } catch (error) {
        showNotification?.('Failed to generate note with AI.');
    } finally {
        setIsGenerating(false);
    }
  }, [technicalNotes, ticket.description, showNotification]);

  const handleCompleteSubmit = useCallback(() => {
    if (!technicalNotes.trim() || !userFriendlyNotes.trim()) {
      showNotification?.('Please fill in both technical notes and generate a user-friendly note.');
      return;
    }
    if (updateTicketStatus) {
      updateTicketStatus(ticket.id, TicketStatus.Completed, technicalNotes, userFriendlyNotes);
      setIsCompleteModalOpen(false);
      setTechnicalNotes('');
      setUserFriendlyNotes('');
    }
  }, [technicalNotes, userFriendlyNotes, ticket.id, updateTicketStatus, showNotification]);

  const handleRejectSubmit = useCallback(() => {
    if (!rejectionReason.trim()) {
      showNotification?.('Please enter a reason for rejection.');
      return;
    }
    if (updateTicketStatus) {
      updateTicketStatus(ticket.id, TicketStatus.Reject, rejectionReason);
      setIsRejectModalOpen(false);
      setRejectionReason('');
    }
  }, [rejectionReason, ticket.id, updateTicketStatus, showNotification]);

  const handleArchive = useCallback(() => {
    if (archiveTicket) {
      archiveTicket(ticket.id);
      setIsArchiveModalOpen(false);
    }
  }, [ticket.id, archiveTicket]);
  
  const handleUpdateAssignees = (newDeveloperIds: number[]) => {
      if (updateTicketAssignees) {
        updateTicketAssignees(ticket.id, newDeveloperIds);
      }
  };

  return (
    <>
      <div className="bg-neutral-light p-5 rounded-lg shadow-md border-l-4 border-brand-accent transform hover:scale-[1.02] transition-transform duration-200 flex flex-col justify-between min-h-[180px]">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-bold text-gray-900 mb-2 pr-4">{ticket.title}</h3>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[ticket.status]}`}>
              {ticket.status}
            </span>
          </div>
          <div className="mb-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-extralight text-gray-600 border border-gray-300">
              {ticket.type}
            </span>
          </div>
          <p className={`text-gray-600 text-sm mb-3 ${ticket.status === TicketStatus.Completed ? 'line-clamp-1' : 'line-clamp-2'}`}>{ticket.description}</p>
        </div>
        
        <div className="mt-auto pt-3 border-t border-neutral-extralight">
          <div className="flex justify-between items-end text-xs text-gray-500">
            <div>
              <p>Client: <span className="font-semibold text-gray-700">{client?.name || 'Unknown'}</span></p>
              <p>Created: {ticket.createdAt.toLocaleDateString()}</p>
              {(ticket.status === TicketStatus.Reject || ticket.status === TicketStatus.Completed) && <p>Updated: {ticket.updatedAt.toLocaleDateString()}</p>}
            </div>
            {userRole === UserRole.Developer && (
                 <div className="text-right">
                    <p>Assigned: <span className="font-semibold text-gray-700">{assignedDevelopers.length > 0 ? assignedDevelopers.map(d => d.name).join(', ') : 'Unassigned'}</span></p>
                    {updateTicketAssignees && (
                       <button onClick={() => setIsAssignModalOpen(true)} className="mt-1 flex items-center gap-1 text-xs text-brand-primary hover:underline">
                        <UserGroupIcon className="w-4 h-4" />
                        Manage Assignees
                      </button>
                    )}
                 </div>
            )}
             {userRole === UserRole.Admin && ticket.status !== TicketStatus.Archived && (
                 <div className="text-right">
                    <p>Assigned: <span className="font-semibold text-gray-700">{assignedDevelopers.length > 0 ? assignedDevelopers.map(d => d.name).join(', ') : 'Unassigned'}</span></p>
                 </div>
            )}
          </div>
           <div className="flex justify-between items-center mt-3">
              {userRole === UserRole.Developer ? (
                  <div className="flex gap-2 flex-wrap">
                    {ticket.status === TicketStatus.Tasks && (
                      <button onClick={() => handleStatusChange(TicketStatus.InProgress)} className="bg-status-progress/80 hover:bg-status-progress text-white text-xs font-bold py-1 px-3 rounded-md transition">
                        Start Work
                      </button>
                    )}
                    {ticket.status === TicketStatus.InProgress && (
                      <>
                         <button onClick={() => setIsRejectModalOpen(true)} className="bg-status-reject/80 hover:bg-status-reject text-white text-xs font-bold py-1 px-3 rounded-md transition">
                          Reject
                        </button>
                         <button onClick={() => handleStatusChange(TicketStatus.Wait)} className="bg-status-wait/80 hover:bg-status-wait text-white text-xs font-bold py-1 px-3 rounded-md transition">
                          Wait
                        </button>
                        <button onClick={() => setIsCompleteModalOpen(true)} className="bg-status-completed/80 hover:bg-status-completed text-white text-xs font-bold py-1 px-3 rounded-md transition">
                          Complete
                        </button>
                      </>
                    )}
                    {ticket.status === TicketStatus.Wait && (
                       <button onClick={() => handleStatusChange(TicketStatus.InProgress)} className="bg-status-progress/80 hover:bg-status-progress text-white text-xs font-bold py-1 px-3 rounded-md transition">
                        Resume Work
                      </button>
                    )}
                    {ticket.status === TicketStatus.Completed && (
                       <button onClick={() => handleStatusChange(TicketStatus.InProgress)} className="bg-gray-500 hover:bg-gray-600 text-white text-xs font-bold py-1 px-3 rounded-md transition">
                        Re-open Ticket
                      </button>
                    )}
                  </div>
              ) : <div></div> /* Empty div to align items to the right */}

              <div className="flex items-center gap-2">
                 <button onClick={() => setIsHistoryOpen(true)} title="View History" className="text-gray-400 hover:text-brand-primary transition">
                    <ClockIcon className="w-5 h-5" />
                  </button>
                  {canChat && (
                    <button onClick={() => setIsChatOpen(true)} title="Open Chat" className="text-gray-400 hover:text-brand-primary transition">
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    </button>
                  )}
                  {userRole === UserRole.Developer && archiveTicket && ticket.status !== TicketStatus.Archived && (
                      <button onClick={() => setIsArchiveModalOpen(true)} title="Archive Ticket" className="text-gray-400 hover:text-red-500 transition">
                          <TrashIcon className="w-5 h-5" />
                      </button>
                  )}
              </div>
            </div>
        </div>

        {ticket.status === TicketStatus.Reject && ticket.resolutionNotes && (
          <div className="mt-4 pt-3 border-t border-neutral-extralight bg-status-reject/10 p-3 rounded-md">
            <h4 className="font-semibold text-sm text-status-reject mb-1">Rejection Reason:</h4>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{ticket.resolutionNotes}</p>
          </div>
        )}
        {ticket.status === TicketStatus.Completed && ticket.userFriendlyResolution && (
          <div className="mt-4 pt-3 border-t border-neutral-extralight bg-status-completed/10 p-3 rounded-md">
            <h4 className="font-semibold text-sm text-status-completed mb-1">Resolution Summary:</h4>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">{ticket.userFriendlyResolution}</p>
          </div>
        )}
      </div>

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        ticket={ticket}
        history={history || []}
        users={users}
      />

      {canChat && (
        <ChatModal 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          ticket={ticket}
          currentUser={currentUser}
          users={users}
          messages={messages}
          addMessage={addMessage}
        />
      )}

      {userRole === UserRole.Developer && (
        <AssigneesModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          ticket={ticket}
          allDevelopers={allDevelopers}
          onSave={handleUpdateAssignees}
        />
      )}

      <Modal isOpen={isCompleteModalOpen} onClose={() => setIsCompleteModalOpen(false)} title={`Complete Ticket #${ticket.id}`}>
          <div>
              <div className="mb-4">
                  <label htmlFor="technicalNotes" className="block text-sm font-medium text-gray-700 mb-1">
                      Technical Resolution Notes
                  </label>
                  <textarea
                      id="technicalNotes"
                      value={technicalNotes}
                      onChange={(e) => setTechnicalNotes(e.target.value)}
                      rows={4}
                      className="w-full bg-neutral-light border border-neutral-extralight text-gray-900 rounded-md p-2 focus:ring-2 focus:ring-brand-accent focus:outline-none"
                      required
                  />
              </div>
              <div className="mb-4">
                  <button
                      onClick={handleGenerateNote}
                      disabled={isGenerating || !technicalNotes.trim()}
                      className="flex items-center justify-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:bg-neutral-extralight disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                      <SparklesIcon className="w-5 h-5 mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate User-Friendly Note with AI'}
                  </button>
              </div>
              {userFriendlyNotes && (
                  <div className="mb-4 p-4 bg-brand-primary/10 rounded-md">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preview of Note for Client:
                      </label>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{userFriendlyNotes}</p>
                  </div>
              )}
              <div className="flex justify-end">
                  <button
                      onClick={handleCompleteSubmit}
                      disabled={isGenerating || !userFriendlyNotes.trim()}
                      className="flex items-center justify-center bg-status-completed hover:bg-status-completed/80 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:bg-neutral-extralight disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                      Confirm Completion
                  </button>
              </div>
          </div>
      </Modal>

      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title={`Reject Ticket #${ticket.id}`}>
          <div>
            <div className="mb-4">
                <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Rejection
                </label>
                <textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    className="w-full bg-neutral-light border border-neutral-extralight text-gray-900 rounded-md p-2 focus:ring-2 focus:ring-brand-accent focus:outline-none"
                    placeholder="e.g., This is a duplicate of ticket #123. The feature requested is out of scope for the current project."
                    required
                />
            </div>
            <div className="flex justify-end">
                <button
                    onClick={handleRejectSubmit}
                    disabled={!rejectionReason.trim()}
                    className="flex items-center justify-center bg-status-reject hover:bg-status-reject/80 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out disabled:bg-neutral-extralight disabled:text-gray-500 disabled:cursor-not-allowed"
                >
                    Confirm Rejection
                </button>
            </div>
          </div>
      </Modal>

      <Modal isOpen={isArchiveModalOpen} onClose={() => setIsArchiveModalOpen(false)} title={`Archive Ticket #${ticket.id}`}>
          <div>
            <p className="text-gray-700 mb-6">Are you sure you want to archive this ticket? It will be hidden from the main dashboard but can be viewed by an admin.</p>
            <div className="flex justify-end gap-4">
                <button
                    onClick={() => setIsArchiveModalOpen(false)}
                    className="bg-neutral-extralight hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md transition"
                >
                    Cancel
                </button>
                <button
                    onClick={handleArchive}
                    className="bg-status-reject hover:bg-status-reject/80 text-white font-bold py-2 px-4 rounded-md transition"
                >
                    Confirm Archive
                </button>
            </div>
          </div>
      </Modal>
    </>
  );
};

export default TicketCard;