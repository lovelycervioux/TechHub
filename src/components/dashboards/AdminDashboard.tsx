import { useState } from 'react';
import { useClubs } from '../../context/ClubContext';
import { motion } from 'framer-motion';
import { Box, Plus, UserCheck } from 'lucide-react';

export default function AdminDashboard() {
  const { clubs, createClub } = useClubs();
  const [showForm, setShowForm] = useState(false);
  const [clubName, setClubName] = useState('');
  const [clubDescription, setClubDescription] = useState('');
  const [clubCapacity, setClubCapacity] = useState(5);
  const [clubLeaderId, setClubLeaderId] = useState('');
  
  const handleCreateClub = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!clubName || !clubDescription || !clubLeaderId) {
      alert('Please fill in all fields');
      return;
    }
    
    // Create the club
    createClub({
      name: clubName,
      description: clubDescription,
      capacity: clubCapacity,
      leaderId: clubLeaderId,
    });
    
    // Reset form
    setClubName('');
    setClubDescription('');
    setClubCapacity(5);
    setClubLeaderId('');
    setShowForm(false);
  };
  
  // Get available leaders
  const getLeaders = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.filter((user: { role: string }) => user.role === 'leader');
  };
  
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-poppins)' }}>Admin Dashboard</h2>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
        >
          <Plus size={16} className="mr-2" />
          Create Club
        </button>
      </div>
      
      {showForm && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 rounded-lg p-4 mb-6"
        >
          <h3 className="text-purple-300 font-semibold mb-3">Create New Club</h3>
          
          <form onSubmit={handleCreateClub} className="space-y-4">
            <div>
              <label htmlFor="clubName" className="block text-sm font-medium text-purple-200 mb-1">
                Club Name
              </label>
              <input
                id="clubName"
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Data Science Club"
              />
            </div>
            
            <div>
              <label htmlFor="clubDescription" className="block text-sm font-medium text-purple-200 mb-1">
                Description
              </label>
              <textarea
                id="clubDescription"
                value={clubDescription}
                onChange={(e) => setClubDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Brief description of the club"
              />
            </div>
            
            <div>
              <label htmlFor="clubCapacity" className="block text-sm font-medium text-purple-200 mb-1">
                Member Capacity
              </label>
              <input
                id="clubCapacity"
                type="number"
                min={1}
                max={50}
                value={clubCapacity}
                onChange={(e) => setClubCapacity(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="clubLeader" className="block text-sm font-medium text-purple-200 mb-1">
                Club Leader
              </label>
              <select
                id="clubLeader"
                value={clubLeaderId}
                onChange={(e) => setClubLeaderId(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-purple-300/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select a leader</option>
                {getLeaders().map((leader: any) => (
                  <option key={leader.id} value={leader.id}>
                    {leader.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-purple-300/20 text-purple-300 rounded-lg text-sm hover:bg-purple-300/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
              >
                Create Club
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg p-4 flex items-center">
          <div className="h-12 w-12 bg-purple-500/30 rounded-lg flex items-center justify-center mr-4">
            <Box size={24} className="text-purple-300" />
          </div>
          <div>
            <p className="text-purple-300 text-sm">Total Clubs</p>
            <p className="text-white text-2xl font-semibold">{clubs.length}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-4 flex items-center">
          <div className="h-12 w-12 bg-blue-500/30 rounded-lg flex items-center justify-center mr-4">
            <UserCheck size={24} className="text-blue-300" />
          </div>
          <div>
            <p className="text-blue-300 text-sm">Total Members</p>
            <p className="text-white text-2xl font-semibold">
              {clubs.reduce((total, club) => total + club.memberCount, 0)}
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 flex items-center">
          <div className="h-12 w-12 bg-green-500/30 rounded-lg flex items-center justify-center mr-4">
            <UserCheck size={24} className="text-green-300" />
          </div>
          <div>
            <p className="text-green-300 text-sm">Available Spots</p>
            <p className="text-white text-2xl font-semibold">
              {clubs.reduce((total, club) => total + (club.capacity - club.memberCount), 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
