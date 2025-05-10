import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Club, User, Request, RequestStatus } from '../types';
import { initialClubs, initialRequests } from '../data/initialData';
import { useAuth } from './AuthContext';

interface ClubContextType {
  clubs: Club[];
  requests: Request[];
  joinClub: (clubId: string) => { success: boolean; message: string };
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  createClub: (club: Omit<Club, 'id' | 'memberCount' | 'members' | 'pendingRequests'>) => void;
  getUserClubRequests: () => Request[];
  getClubRequests: (clubId: string) => Request[];
  getClubMembers: (clubId: string) => User[];
  updateClub: (clubId: string, updates: Partial<Club>) => void;
  getClubById: (clubId: string) => Club | undefined;
}

const ClubContext = createContext<ClubContextType>({
  clubs: [],
  requests: [],
  joinClub: () => ({ success: false, message: '' }),
  approveRequest: () => {},
  rejectRequest: () => {},
  createClub: () => {},
  getUserClubRequests: () => [],
  getClubRequests: () => [],
  getClubMembers: () => [],
  updateClub: () => {},
  getClubById: () => undefined,
});

export const useClubs = () => useContext(ClubContext);

export const ClubProvider = ({ children }: { children: ReactNode }) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Initialize clubs in localStorage if not already there
    if (!localStorage.getItem('clubs')) {
      localStorage.setItem('clubs', JSON.stringify(initialClubs));
    }
    
    // Initialize requests in localStorage if not already there
    if (!localStorage.getItem('requests')) {
      localStorage.setItem('requests', JSON.stringify(initialRequests));
    }
    
    // Load clubs and requests from localStorage
    const savedClubs = JSON.parse(localStorage.getItem('clubs') || '[]');
    const savedRequests = JSON.parse(localStorage.getItem('requests') || '[]');
    
    setClubs(savedClubs);
    setRequests(savedRequests);
  }, []);

  // Save clubs and requests to localStorage whenever they change
  useEffect(() => {
    if (clubs.length > 0) {
      localStorage.setItem('clubs', JSON.stringify(clubs));
    }
  }, [clubs]);

  useEffect(() => {
    localStorage.setItem('requests', JSON.stringify(requests));
  }, [requests]);

  const joinClub = (clubId: string) => {
    if (!currentUser) {
      return { success: false, message: 'You must be logged in to join a club' };
    }

    // Check if user is already a member or has a pending request
    if (currentUser.clubsMember.includes(clubId)) {
      return { success: false, message: 'You are already a member of this club' };
    }
    
    if (currentUser.clubsRequested.includes(clubId)) {
      return { success: false, message: 'You already have a pending request to join this club' };
    }

    // Get the club
    const club = clubs.find(c => c.id === clubId);
    if (!club) {
      return { success: false, message: 'Club not found' };
    }

    // Check if club is at capacity
    if (club.memberCount >= club.capacity) {
      return { success: false, message: 'This club is at capacity' };
    }

    // Create a new request
    const newRequest: Request = {
      id: `req_${Date.now()}`,
      userId: currentUser.id,
      clubId,
      status: 'pending',
      timestamp: Date.now(),
    };

    // Update user's requested clubs
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: User) => {
      if (user.id === currentUser.id) {
        return {
          ...user,
          clubsRequested: [...user.clubsRequested, clubId],
        };
      }
      return user;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Update club's pending requests
    const updatedClubs = clubs.map(c => {
      if (c.id === clubId) {
        return {
          ...c,
          pendingRequests: [...c.pendingRequests, currentUser.id],
        };
      }
      return c;
    });

    setClubs(updatedClubs);
    setRequests([...requests, newRequest]);

    return { success: true, message: 'Request submitted successfully' };
  };

  const approveRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') return;

    const club = clubs.find(c => c.id === request.clubId);
    if (!club) return;

    // Check if club is at capacity
    if (club.memberCount >= club.capacity) {
      rejectRequest(requestId);
      return;
    }

    // Update request status
    const updatedRequests = requests.map(r => {
      if (r.id === requestId) {
        return { ...r, status: 'approved' as RequestStatus };
      }
      return r;
    });

    // Update club membership
    const updatedClubs = clubs.map(c => {
      if (c.id === request.clubId) {
        return {
          ...c,
          memberCount: c.memberCount + 1,
          members: [...c.members, request.userId],
          pendingRequests: c.pendingRequests.filter(id => id !== request.userId),
        };
      }
      return c;
    });

    // Update user's memberships
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: User) => {
      if (user.id === request.userId) {
        return {
          ...user,
          clubsMember: [...user.clubsMember, request.clubId],
          clubsRequested: user.clubsRequested.filter(id => id !== request.clubId),
        };
      }
      return user;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setRequests(updatedRequests);
    setClubs(updatedClubs);
  };

  const rejectRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request || request.status !== 'pending') return;

    // Update request status
    const updatedRequests = requests.map(r => {
      if (r.id === requestId) {
        return { ...r, status: 'rejected' as RequestStatus };
      }
      return r;
    });

    // Update club's pending requests
    const updatedClubs = clubs.map(c => {
      if (c.id === request.clubId) {
        return {
          ...c,
          pendingRequests: c.pendingRequests.filter(id => id !== request.userId),
        };
      }
      return c;
    });

    // Update user's requested clubs
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: User) => {
      if (user.id === request.userId) {
        return {
          ...user,
          clubsRequested: user.clubsRequested.filter(id => id !== request.clubId),
        };
      }
      return user;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setRequests(updatedRequests);
    setClubs(updatedClubs);
  };

  const createClub = (club: Omit<Club, 'id' | 'memberCount' | 'members' | 'pendingRequests'>) => {
    const newClub: Club = {
      ...club,
      id: `club_${Date.now()}`,
      memberCount: 0,
      members: [],
      pendingRequests: [],
    };

    setClubs([...clubs, newClub]);

    // Update leader's clubsLeading
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: User) => {
      if (user.id === club.leaderId) {
        return {
          ...user,
          clubsLeading: [...user.clubsLeading, newClub.id],
        };
      }
      return user;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const getUserClubRequests = () => {
    if (!currentUser) return [];
    return requests.filter(r => r.userId === currentUser.id);
  };

  const getClubRequests = (clubId: string) => {
    return requests.filter(r => r.clubId === clubId && r.status === 'pending');
  };

  const getClubMembers = (clubId: string): User[] => {
    const club = clubs.find(c => c.id === clubId);
    if (!club) return [];

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.filter((user: User) => club.members.includes(user.id));
  };

  const updateClub = (clubId: string, updates: Partial<Club>) => {
    const updatedClubs = clubs.map(club => {
      if (club.id === clubId) {
        return { ...club, ...updates };
      }
      return club;
    });
    setClubs(updatedClubs);
  };

  const getClubById = (clubId: string) => {
    return clubs.find(club => club.id === clubId);
  };

  return (
    <ClubContext.Provider 
      value={{ 
        clubs, 
        requests, 
        joinClub, 
        approveRequest, 
        rejectRequest, 
        createClub,
        getUserClubRequests,
        getClubRequests,
        getClubMembers,
        updateClub,
        getClubById
      }}
    >
      {children}
    </ClubContext.Provider>
  );
};
