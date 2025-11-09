export enum UserRole {
  Client = 'Client',
  Developer = 'Developer',
  Admin = 'Admin',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  companyName?: string;
}

export enum TicketStatus {
  Tasks = 'Tasks',
  InProgress = 'In Progress',
  Wait = 'Wait',
  Reject = 'Reject',
  Completed = 'Completed',
  Archived = 'Archived',
}

export enum TicketType {
  Unlock = 'فك قيد',
  ProgramIssue = 'مشكلة في البرنامج',
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  type: TicketType;
  status: TicketStatus;
  clientId: number;
  developerIds: number[];
  createdAt: Date;
  updatedAt: Date;
  resolutionNotes?: string;
  userFriendlyResolution?: string;
}

export interface ChatMessage {
  id: number;
  ticketId: number;
  senderId: number;
  text: string;
  timestamp: Date;
}

export interface AIChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface TicketHistoryEvent {
  id: number;
  ticketId: number;
  userId: number;
  action: 'CREATE' | 'STATUS_CHANGE' | 'ASSIGN' | 'UNASSIGN' | 'ADD_NOTE';
  from: string | null;
  to: string | null;
  timestamp: Date;
}