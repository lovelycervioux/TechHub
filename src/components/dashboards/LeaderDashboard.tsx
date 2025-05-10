import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClubs } from '../../context/ClubContext';
import { motion } from 'framer-motion';
import { User as UserIcon, ThumbsDown, ThumbsUp, Users } from 'lucide-react';
import { Club, User, Request } from '../../types';

export default function LeaderDashboard() {
  const { currentUser } = useAuth();
  const { clubs, getClubRequests, approveRequest, rejectRequest, getClubMembers } = useClubs();
  const [myClubs, setMyClubs] = useState<Club[]>([]);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  
  useEffect(() => {
    if (!currentUser) return;
    
    // Get clubs the leader is in charge of
    const leaderClubs = clubs.filter(club => 
      currentUser.clubsLeading.includes(club.id)
    );
    
    setMyClubs(leaderClubs);
    
    // Set the first club as selected by default
    if (leaderClubs.length > 0 && !selectedClub) {
      setSelectedClub(leaderClubs[0]);
    }
  }, [currentUser, clubs]);
  
  useEffect(() => {
    if (selectedClub) {
      // Get pending requests for the selected club
      setRequests(getClubRequests(selectedClub.id));
      
      // Get members of the selected club
      setMembers(getClubMembers(selectedClub.id));
    }
  }, [selectedClub]);
  
  const handleApprove = (requestId: string) => {
    approveRequest(requestId);
    // Refresh requests after approval
    if (selectedClub) {
      setRequests(getClubRequests(selectedClub.id));
      setMembers(getClubMembers(selectedClub.id));
    }
  };
  
  const handleReject = (requestId: string) => {
    rejectRequest(requestId);
    // Refresh requests after rejection
    if (selectedClub) {
      setRequests(getClubRequests(selectedClub.id));
    }
  };
  
  if (!currentUser) return null;
  
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>Leader Dashboard</h2>
      
      {myClubs.length > 0 ? (
        <div>
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {myClubs.map(club => (
              <button
                key={club.id}
                onClick={() => setSelectedClub(club)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  selectedClub?.id === club.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                {club.name}
              </button>
            ))}
          </div>
          
          {selectedClub && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-purple-300 font-semibold">Pending Requests</h3>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                    {requests.length} pending
                  </span>
                </div>
                
                {requests.length > 0 ? (
                  <ul className="space-y-2">
                    {requests.map(request => {
                      const users = JSON.parse(localStorage.getItem('users') || '[]');
                      const user = users.find((u: User) => u.id === request.userId);
                      
                      return (
                        <li key={request.id} className="bg-white/5 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">{user?.name || 'Unknown User'}</span>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleApprove(request.id)}
                                className="p-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30"
                                disabled={selectedClub.memberCount >= selectedClub.capacity}
                                title={selectedClub.memberCount >= selectedClub.capacity ? "Club is at capacity" : "Approve request"}
                              >
                                <ThumbsUp size={16} />
                              </button>
                              <button 
                                onClick={() => handleReject(request.id)}
                                className="p-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30"
                              >
                                <ThumbsDown size={16} />
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-purple-200 text-sm">No pending requests</p>
                )}
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white/5 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-purple-300 font-semibold">Club Members</h3>
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full flex items-center">
                    <Users size={12} className="mr-1" />
                    {selectedClub.memberCount}/{selectedClub.capacity}
                  </span>
                </div>
                
                {members.length > 0 ? (
                  <ul className="space-y-2">
                    {members.map(member => (
                      <li key={member.id} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                        <div className="flex items-center">
                          {member.profilePicture ? (
                            <img 
                              src={member.profilePicture} 
                              alt={member.name}
                              className="h-6 w-6 rounded-full object-cover mr-2 border border-indigo-400"
                            />
                          ) : (
                            <div className="h-6 w-6 rounded-full bg-indigo-600/50 flex items-center justify-center mr-2">
                              <UserIcon size={12} className="text-indigo-300" />
                            </div>
                          )}
                          <span className="text-white">{member.name}</span>
                        </div>
                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">
                          Member
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-purple-200 text-sm">No members yet</p>
                )}
              </motion.div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-purple-200">You're not leading any clubs yet</p>
      )}
    </div>
  );
}
