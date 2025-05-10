import { motion } from 'framer-motion';
import { LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoutConfirmModal({ isOpen, onClose }: LogoutConfirmModalProps) {
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    // The redirect will happen automatically as the AuthProvider will update the isLoggedIn state
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-indigo-950/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-md border border-purple-500/30 shadow-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Confirm Logout</h2>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="text-purple-200 mb-6">
          Are you sure you want to log out of your account? Your session will end and you'll need to sign in again next time.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-500/10"
          >
            Cancel
          </button>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}
