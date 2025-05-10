export type Role = 'student' | 'leader' | 'admin';

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  username: string;
  password: string; // In a real app, we'd never store plain text passwords
  name: string;
  role: Role;
  clubsLeading: string[]; // Club IDs for leaders
  clubsMember: string[]; // Club IDs where user is a member
  clubsRequested: string[]; // Club IDs where user has a pending request
  profilePicture?: string | null; // Data URL for profile picture
  theme?: 'light' | 'dark'; // User theme preference
}

export interface Club {
  id: string;
  name: string;
  description: string;
  capacity: number;
  memberCount: number;
  leaderId: string;
  members: string[]; // User IDs
  pendingRequests: string[]; // User IDs
}

export interface Request {
  id: string;
  userId: string;
  clubId: string;
  status: RequestStatus;
  timestamp: number;
}
