import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClubs } from '../../context/ClubContext';
import { motion } from 'framer-motion';
import { CircleCheck, CircleX, Clock } from 'lucide-react';
import type { Club, Request } from '../../types';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const { clubs, requests } = useClubs();
  const [myClubs, setMyClubs] = useState<Club[]>([]);
  const [myRequests, setMyRequests] = useState<Request[]>([]);
  
  useEffect(() => {
    if (!currentUser) return;
    
    // Get clubs the student is a member of
    const memberClubs = clubs.filter(club => 
      currentUser.clubsMember.includes(club.id)
    );
    setMyClubs(memberClubs);
    
    // Get pending requests
    const userRequests = requests.filter(request => 
      request.userId === currentUser.id
    );
    setMyRequests(userRequests);
  }, [currentUser, clubs, requests]);
  
  if (!currentUser) return null;
  
  const getClubName = (clubId: string) => {
    const club = clubs.find(club => club.id === clubId);
    return club ? club.name : 'Unknown Club';
  };
  
  const getRequestStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CircleCheck size={16} className="text-green-400" />;
      case 'rejected':
        return <CircleX size={16} className="text-red-400" />;
      default:
        return <Clock size={16} className="text-yellow-400" />;
    }
  };
  
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>My Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 rounded-lg p-4"
        >
          <h3 className="text-purple-300 font-semibold mb-3">My Clubs</h3>
          
          {myClubs.length > 0 ? (
            <ul className="space-y-2">
              {myClubs.map(club => (
                <li key={club.id} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-white">{club.name}</span>
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                    Member
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-purple-200 text-sm">You haven't joined any clubs yet</p>
          )}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white/5 rounded-lg p-4"
        >
          <h3 className="text-purple-300 font-semibold mb-3">My Requests</h3>
          
          {myRequests.length > 0 ? (
            <ul className="space-y-2">
              {myRequests.map(request => (
                <li key={request.id} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-white">{getClubName(request.clubId)}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                      request.status === 'approved' ? 'bg-green-500/20 text-green-300' :
                      request.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                      'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {getRequestStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-purple-200 text-sm">You don't have any club requests</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
