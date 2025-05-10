import { motion } from 'framer-motion';
import { Club } from '../types';
import { useClubs } from '../context/ClubContext';
import { useAuth } from '../context/AuthContext';
import { User } from 'lucide-react';

interface ClubCardProps {
  club: Club;
}

export default function ClubCard({ club }: ClubCardProps) {
  const { joinClub } = useClubs();
  const { currentUser } = useAuth();
  
  const isMember = currentUser?.clubsMember.includes(club.id);
  const isPending = currentUser?.clubsRequested.includes(club.id);
  const isLeader = currentUser?.clubsLeading.includes(club.id);
  const availableSlots = club.capacity - club.memberCount;
  
  const handleJoinClub = () => {
    const result = joinClub(club.id);
    if (!result.success) {
      alert(result.message);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/5 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-white/10"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white">{club.name}</h3>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            availableSlots > 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
          }`}>
            {availableSlots} slots available
          </div>
        </div>
        
        <p className="text-purple-200 mb-6 text-sm">{club.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-purple-300">
            <span className="font-semibold">{club.memberCount}</span>/{club.capacity} members
          </div>
          
          {currentUser?.role === 'student' && !isMember && !isPending && !isLeader && (
            <button
              onClick={handleJoinClub}
              disabled={availableSlots <= 0}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                availableSlots > 0
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
            >
              {availableSlots > 0 ? 'Join Club' : 'Club Full'}
            </button>
          )}
          
          {isPending && (
            <span className="px-4 py-2 bg-yellow-500/20 text-yellow-300 rounded-lg text-sm">
              Request Pending
            </span>
          )}
          
          {isMember && (
            <span className="px-4 py-2 bg-green-500/20 text-green-300 rounded-lg text-sm">
              Member
            </span>
          )}
          
          {isLeader && (
            <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg text-sm">
              Leader
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
