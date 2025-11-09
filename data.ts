import { User, Ticket, UserRole, TicketStatus, TicketType, ChatMessage, TicketHistoryEvent } from './types';

export const initialUsers: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@metallic.com', role: UserRole.Admin, password: 'admin' },
  { id: 2, name: 'Karim', email: 'karim@metallic.com', role: UserRole.Developer, password: 'dev' },
  { id: 3, name: 'Mariam', email: 'mariam@metallic.com', role: UserRole.Developer, password: 'dev' },
  { id: 4, name: 'Mohamed', email: 'mohamed@metallic.com', role: UserRole.Developer, password: 'dev' },
];

export const initialTickets: Ticket[] = [];

export const initialMessages: ChatMessage[] = [];

export const initialHistory: TicketHistoryEvent[] = [];
