import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, LogOut, Settings } from 'lucide-react';
import UserProfileModal from './UserProfileModal';
import LogoutConfirmModal from './LogoutConfirmModal';

export default function Navbar() {
  const { currentUser } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  return (
    <nav className="bg-indigo-950 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">
                <span className="text-purple-400">Tech</span>
                <span>Connect</span>
              </h1>
            </div>
          </div>
          
          {currentUser && (
            <div className="flex items-center">
              <div 
                className="mr-4 flex items-center cursor-pointer hover:bg-purple-800/50 px-3 py-2 rounded-lg transition-colors"
                onClick={() => setShowProfileModal(true)}
              >
                {currentUser.profilePicture ? (
                  <img 
                    src={currentUser.profilePicture} 
                    alt={currentUser.name}
                    className="h-8 w-8 rounded-full object-cover border border-purple-400 mr-2"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                    <UserIcon size={16} />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-purple-300 capitalize">{currentUser.role}</p>
                </div>
                <Settings size={14} className="ml-2 text-purple-400" />
              </div>
              
              <button
                onClick={() => setShowLogoutModal(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-purple-300 hover:text-white hover:bg-purple-800 transition-colors"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <UserProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
      
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </nav>
  );
}
