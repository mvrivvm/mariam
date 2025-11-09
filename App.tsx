import React, { useState, useEffect, useCallback } from 'react';
import { initialUsers, initialTickets, initialMessages, initialHistory } from './data';
import { User, Ticket, UserRole, TicketStatus, TicketType, ChatMessage, AIChatMessage, TicketHistoryEvent } from './types';
import LoginView from './components/LoginView';
import ClientView from './components/ClientView';
import DeveloperView from './components/DeveloperView';
import SettingsView from './components/SettingsView';
import Header from './components/Header';
import { sendEmail } from './services/emailService';
import { CheckCircleIcon, CpuChipIcon } from './components/icons';
import AIChatModal from './components/AIChatModal';
import { askAIChat } from './components/geminiService';

function App() {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const savedUsers = localStorage.getItem('users');
      return savedUsers ? JSON.parse(savedUsers) : initialUsers;
    } catch (error) {
      return initialUsers;
    }
  });
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const savedTickets = localStorage.getItem('tickets');
      return savedTickets ? JSON.parse(savedTickets, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt') return new Date(value);
        return value;
      }) : initialTickets;
    } catch (error) {
      return initialTickets;
    }
  });
  
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const savedMessages = localStorage.getItem('messages');
      return savedMessages ? JSON.parse(savedMessages, (key, value) => {
        if (key === 'timestamp') return new Date(value);
        return value;
      }) : initialMessages;
    } catch (error) {
      return initialMessages;
    }
  });

  const [history, setHistory] = useState<TicketHistoryEvent[]>(() => {
    try {
        const savedHistory = localStorage.getItem('history');
        return savedHistory ? JSON.parse(savedHistory, (key, value) => {
            if (key === 'timestamp') return new Date(value);
            return value;
        }) : initialHistory;
    } catch (error) {
        return initialHistory;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [adminView, setAdminView] = useState<'dashboard' | 'settings'>('dashboard');

  // AI Chat State
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<AIChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I'm the Metallic ERP AI assistant. How can I help you today? You can ask me general questions about ERP systems or technical concepts.",
    }
  ]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }, [tickets]);
  
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
  }, [history]);
  
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  const showNotification = useCallback((message: string) => {
    setNotification(message);
  }, []);

  const addHistoryEvent = useCallback((ticketId: number, action: TicketHistoryEvent['action'], from: string | null, to: string | null) => {
    if (!currentUser) return;
    const newEvent: TicketHistoryEvent = {
      id: Date.now() + Math.random(), // Simplified unique ID
      ticketId,
      userId: currentUser.id,
      action,
      from,
      to,
      timestamp: new Date(),
    };
    setHistory(prev => [...prev, newEvent]);
  }, [currentUser]);


  const handleLogin = (user: User) => {
    setCurrentUser(user);
    showNotification(`Welcome back, ${user.name}! It's great to see you again.`);
  };

  const handleRegisterClient = (details: Omit<User, 'id' | 'role'>) => {
    const newUser: User = {
      ...details,
      id: Math.max(0, ...users.map(u => u.id)) + 1,
      role: UserRole.Client,
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    showNotification(`Welcome, ${newUser.name}! Your account has been created.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };
  
  const addTicket = useCallback((details: { title: string; description: string; type: TicketType; assignedDeveloperId?: number }) => {
    if (!currentUser) return;

    const developers = users.filter(u => u.role === UserRole.Developer);
    if (developers.length === 0) {
      showNotification("Cannot create ticket: No developers available.");
      return;
    }

    let devId = details.assignedDeveloperId;
    if (!devId) {
      // Rule-based assignment for client-created tickets
      const karim = users.find(u => u.name === 'Karim' && u.role === UserRole.Developer);
      const mariam = users.find(u => u.name === 'Mariam' && u.role === UserRole.Developer);
      
      if (details.type === TicketType.ProgramIssue && karim) {
        devId = karim.id;
      } else if (details.type === TicketType.Unlock && mariam) {
        devId = mariam.id;
      } else {
        // Fallback to round-robin assignment if no rule matches or the developer doesn't exist
        const lastTicket = tickets.length > 0 ? tickets.sort((a,b) => b.id - a.id)[0] : null;
        const lastDevId = lastTicket ? lastTicket.developerIds[0] : developers[0].id;
        const lastDevIndex = developers.findIndex(d => d.id === lastDevId);
        const nextDevIndex = (lastDevIndex >= 0 ? lastDevIndex + 1 : 1) % developers.length;
        devId = developers[nextDevIndex].id;
      }
    }

    const newTicket: Ticket = {
      id: Math.max(0, ...tickets.map(t => t.id)) + 1,
      title: details.title,
      description: details.description,
      type: details.type,
      status: TicketStatus.Tasks,
      clientId: currentUser.id,
      developerIds: [devId],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTickets(prev => [...prev, newTicket]);
    const assignedDeveloper = users.find(u => u.id === devId);
    showNotification(`Ticket #${newTicket.id} created and assigned to ${assignedDeveloper?.name}.`);
    
    // History Logging
    addHistoryEvent(newTicket.id, 'CREATE', null, newTicket.title);
    if(assignedDeveloper) {
        addHistoryEvent(newTicket.id, 'ASSIGN', null, assignedDeveloper.name);
    }

  }, [tickets, users, currentUser, showNotification, addHistoryEvent]);
  
  const updateTicketStatus = useCallback(async (id: number, status: TicketStatus, notes?: string, userFriendlyNote?: string) => {
    let updatedTicket: Ticket | undefined;
    let originalStatus: TicketStatus | undefined;

    const ticketToUpdate = tickets.find(t => t.id === id);
    if (!ticketToUpdate) return;
    originalStatus = ticketToUpdate.status;

    setTickets(prev =>
      prev.map(ticket => {
        if (ticket.id === id) {
          const isReopening = originalStatus === TicketStatus.Completed && status !== TicketStatus.Completed;

          updatedTicket = { 
            ...ticket, 
            status, 
            updatedAt: new Date()
          };

          if (isReopening) {
            updatedTicket.resolutionNotes = undefined;
            updatedTicket.userFriendlyResolution = undefined;
          } else {
            if (notes !== undefined) updatedTicket.resolutionNotes = notes;
            if (userFriendlyNote !== undefined) updatedTicket.userFriendlyResolution = userFriendlyNote;
          }
          return updatedTicket;
        }
        return ticket;
      })
    );
    
    const mainNotification = originalStatus === TicketStatus.Completed && status === TicketStatus.InProgress
      ? `Ticket #${id} has been re-opened.`
      : `Ticket #${id} status updated to "${status}".`;
    showNotification(mainNotification);
    
    // History Logging
    if (originalStatus) {
        addHistoryEvent(id, 'STATUS_CHANGE', originalStatus, status);
    }
    if (status === TicketStatus.Reject && notes) {
        addHistoryEvent(id, 'ADD_NOTE', null, 'Rejection reason');
    }
    if (status === TicketStatus.Completed && notes) {
        addHistoryEvent(id, 'ADD_NOTE', null, 'Resolution notes');
    }

    if (updatedTicket && (status === TicketStatus.Completed || status === TicketStatus.Reject)) {
        const client = users.find(u => u.id === updatedTicket?.clientId);
        if (client) {
            const subject = `Update on your support ticket #${updatedTicket.id}: ${updatedTicket.title}`;
            const body = `
                <p>Hello ${client.name},</p>
                <p>There has been an update on your support ticket.</p>
                <p><b>Status:</b> ${status}</p>
                <p><b>Summary:</b></p>
                <p>${userFriendlyNote || notes}</p>
                <p>Thank you for using Metallic ERP.</p>
            `;
            try {
                await sendEmail(client.email, subject, body);
                showNotification(`Ticket #${id} updated. Client has been notified via email.`);
            } catch (error) {
                showNotification(`Ticket #${id} updated, but the email notification failed to send.`);
            }
        }
    }
  }, [users, showNotification, tickets, addHistoryEvent]);
  
  const updateTicketAssignees = useCallback((ticketId: number, newDeveloperIds: number[]) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    const oldDeveloperIds = ticket.developerIds;
    
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, developerIds: newDeveloperIds, updatedAt: new Date() } : t));
    showNotification(`Assignees for ticket #${ticketId} updated.`);

    // History Logging
    const oldDevelopers = users.filter(u => oldDeveloperIds.includes(u.id)).map(u => u.name);
    const newDevelopers = users.filter(u => newDeveloperIds.includes(u.id)).map(u => u.name);
    
    const added = newDevelopers.filter(d => !oldDevelopers.includes(d));
    const removed = oldDevelopers.filter(d => !newDevelopers.includes(d));

    if (added.length > 0) {
      addHistoryEvent(ticketId, 'ASSIGN', null, added.join(', '));
    }
    if (removed.length > 0) {
      addHistoryEvent(ticketId, 'UNASSIGN', removed.join(', '), null);
    }
  }, [showNotification, tickets, users, addHistoryEvent]);

  const archiveTicket = useCallback((ticketId: number) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      updateTicketStatus(ticketId, TicketStatus.Archived);
      showNotification(`Ticket #${ticketId} has been archived.`);
    }
  }, [tickets, updateTicketStatus, showNotification]);

  const addUser = useCallback((user: Omit<User, 'id' | 'password' | 'role'>) => {
      const newUser: User = { 
        ...user, 
        id: Math.max(0, ...users.map(u => u.id)) + 1,
        role: UserRole.Developer,
      };
      setUsers(prev => [...prev, newUser]);
  }, [users]);

  const addMessage = useCallback((ticketId: number, text: string) => {
    if (!currentUser) return;

    const newMessage: ChatMessage = {
      id: Math.max(0, ...messages.map(m => m.id)) + 1,
      ticketId,
      senderId: currentUser.id,
      text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, [messages, currentUser]);

  const updateUser = useCallback((updatedUser: User) => {
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  }, []);

  const handleSendAIChatMessage = async (message: string) => {
    const userMessage: AIChatMessage = { role: 'user', text: message };
    const newHistory = [...aiChatHistory, userMessage];
    setAiChatHistory(newHistory);
    setIsAIThinking(true);

    try {
      const aiResponse = await askAIChat(aiChatHistory, message);
      const modelMessage: AIChatMessage = { role: 'model', text: aiResponse };
      setAiChatHistory([...newHistory, modelMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: AIChatMessage = { role: 'model', text: "Sorry, I encountered an error. Please try again." };
      setAiChatHistory([...newHistory, errorMessage]);
    } finally {
      setIsAIThinking(false);
    }
  };

  const renderContent = () => {
    if (!currentUser) {
      return <LoginView users={users} onLogin={handleLogin} onRegisterClient={handleRegisterClient} />;
    }

    switch (currentUser.role) {
      case UserRole.Client:
        return <ClientView currentUser={currentUser} tickets={tickets.filter(t => t.clientId === currentUser.id)} addTicket={addTicket} showNotification={showNotification} users={users} messages={messages} addMessage={addMessage} history={history} />;
      case UserRole.Developer:
        return <DeveloperView currentUser={currentUser} tickets={tickets.filter(t => t.developerIds.includes(currentUser.id) && t.status !== TicketStatus.Archived)} users={users} addTicket={addTicket} updateTicketStatus={updateTicketStatus} updateTicketAssignees={updateTicketAssignees} archiveTicket={archiveTicket} showNotification={showNotification} messages={messages} addMessage={addMessage} history={history} />;
      case UserRole.Admin:
        if (adminView === 'settings') {
          return <SettingsView users={users} addUser={addUser} updateUser={updateUser} showNotification={showNotification} />;
        }
        return <DeveloperView currentUser={currentUser} tickets={tickets} users={users} addTicket={addTicket} updateTicketStatus={updateTicketStatus} updateTicketAssignees={updateTicketAssignees} archiveTicket={archiveTicket} showNotification={showNotification} messages={messages} addMessage={addMessage} history={history} />;
      default:
        return <div>Invalid user role.</div>;
    }
  };

  return (
    <div className="bg-neutral-extralight min-h-screen font-sans">
      {currentUser && <Header user={currentUser} onLogout={handleLogout} currentView={adminView} onNavigate={setAdminView}/>}
      <main>
        {renderContent()}
      </main>

      {currentUser && (
        <>
          <button
            onClick={() => setIsAIChatOpen(true)}
            className="fixed bottom-5 right-5 z-40 bg-brand-primary hover:bg-brand-secondary text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform"
            title="Open AI Assistant"
            aria-label="Open AI Assistant"
          >
            <CpuChipIcon className="w-8 h-8" />
          </button>
          <AIChatModal
            isOpen={isAIChatOpen}
            onClose={() => setIsAIChatOpen(false)}
            messages={aiChatHistory}
            onSendMessage={handleSendAIChatMessage}
            isThinking={isAIThinking}
          />
        </>
      )}

      {notification && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-out z-50">
          <CheckCircleIcon className="w-5 h-5" />
          {notification}
        </div>
      )}
    </div>
  );
}

export default App;