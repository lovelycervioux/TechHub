import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useClubs } from '../context/ClubContext';
import { BookOpen, Search, Users } from 'lucide-react';
import ClubCard from './ClubCard';
import Navbar from './Navbar';
import StudentDashboard from './dashboards/StudentDashboard';
import LeaderDashboard from './dashboards/LeaderDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { clubs } = useClubs();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClubs, setFilteredClubs] = useState(clubs);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClubs(clubs);
    } else {
      const filtered = clubs.filter(
        club => club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               club.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClubs(filtered);
    }
  }, [searchTerm, clubs]);

  // Load custom fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    document.documentElement.style.setProperty('--font-poppins', '"Poppins", sans-serif');
    document.documentElement.style.setProperty('--font-inter', '"Inter", sans-serif');
    document.documentElement.style.setProperty('--font-space', '"Space Grotesk", sans-serif');

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800" style={{ fontFamily: 'var(--font-inter)' }}>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role-specific dashboard */}
        <div className="mb-8">
          {currentUser.role === 'student' && <StudentDashboard />}
          {currentUser.role === 'leader' && <LeaderDashboard />}
          {currentUser.role === 'admin' && <AdminDashboard />}
        </div>
        
        {/* Club Search Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>Club Directory</h2>
          
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-purple-300" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search clubs..."
                className="bg-white/10 border border-purple-300/20 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="bg-white/10 border border-purple-300/20 rounded-lg px-4 py-3 flex items-center">
              <Users size={18} className="text-purple-300 mr-2" />
              <span className="text-white">{clubs.reduce((acc, club) => acc + club.memberCount, 0)} Members</span>
            </div>
            
            <div className="bg-white/10 border border-purple-300/20 rounded-lg px-4 py-3 flex items-center">
              <BookOpen size={18} className="text-purple-300 mr-2" />
              <span className="text-white">{clubs.length} Clubs</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map(club => (
              <ClubCard key={club.id} club={club} />
            ))}
            
            {filteredClubs.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-purple-300 text-lg">No clubs found matching your search</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
