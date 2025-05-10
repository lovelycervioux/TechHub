import { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Camera, CheckCheck, Save, Upload, X } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfileModal({ isOpen, onClose }: UserProfileModalProps) {
  const { currentUser, updateUserProfile } = useAuth();
  const [profilePicture, setProfilePicture] = useState<string | null>(
    currentUser?.profilePicture || null
  );
  const [displayName, setDisplayName] = useState(currentUser?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      setProfilePicture(reader.result as string);
    };
    
    reader.readAsDataURL(file);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 1048576, // 1MB
    maxFiles: 1
  });
  
  const handleSave = () => {
    if (!currentUser) return;
    
    setIsSaving(true);
    
    setTimeout(() => {
      updateUserProfile({
        ...currentUser,
        name: displayName,
        profilePicture: profilePicture,
      });
      
      setIsSaving(false);
      setSaveSuccess(true);
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    }, 500);
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Profile Settings</h2>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            {profilePicture ? (
              <div className="relative">
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-purple-500"
                />
                <button
                  onClick={() => setProfilePicture(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`w-24 h-24 rounded-full flex items-center justify-center border-2 border-dashed 
                  ${isDragActive ? 'border-purple-400 bg-purple-500/20' : 'border-purple-600 bg-purple-700/20'} 
                  cursor-pointer hover:bg-purple-600/30 transition-colors`}
              >
                <input {...getInputProps()} />
                <Camera size={24} className="text-purple-300" />
              </div>
            )}
          </div>
          
          {!profilePicture && (
            <button
              {...getRootProps()}
              className="flex items-center text-sm font-medium text-purple-400 hover:text-purple-300"
            >
              <Upload size={14} className="mr-1" />
              Upload Photo
            </button>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="displayName" className="block text-sm font-medium text-purple-300 mb-1">
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-purple-500/30 text-purple-300 rounded-lg mr-2 hover:bg-purple-500/10"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving || saveSuccess}
            className={`px-4 py-2 rounded-lg flex items-center ${
              saveSuccess 
                ? 'bg-green-600 text-white' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCheck size={18} className="mr-1" />
                Saved
              </>
            ) : isSaving ? (
              <>
                <span className="mr-2">Saving</span>
                <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
              </>
            ) : (
              <>
                <Save size={18} className="mr-1" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
