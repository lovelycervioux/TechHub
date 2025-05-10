import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, KeyRound, Mail, User, CircleX } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  // Check username availability
  useEffect(() => {
    const checkUsername = setTimeout(() => {
      if (username.length >= 3) {
        setIsChecking(true);
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const exists = users.some((user: any) => user.username === username);
        setUsernameAvailable(!exists);
        setIsChecking(false);
      } else {
        setUsernameAvailable(null);
      }
    }, 500);

    return () => clearTimeout(checkUsername);
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Form validation
    if (!name || !username || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!usernameAvailable) {
      setError('Username is already taken');
      return;
    }

    // Register the user
    const success = registerStudent(name, username, password);
    if (success) {
      navigate('/login');
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-xl border border-white/20"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">TechConnect</h1>
          <p className="text-purple-200">Create your student account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-purple-200 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-purple-300" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-purple-300/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-purple-200 mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={16} className="text-purple-300" />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                className="w-full pl-10 pr-10 py-3 bg-white/5 border border-purple-300/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Choose a username"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {username.length >= 3 && (
                  isChecking ? (
                    <span className="animate-pulse text-purple-300">...</span>
                  ) : (
                    usernameAvailable ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <CircleX size={16} className="text-red-400" />
                    )
                  )
                )}
              </div>
            </div>
            {username.length >= 3 && usernameAvailable && (
              <p className="mt-1 text-xs text-green-400">Username is available</p>
            )}
            {username.length >= 3 && usernameAvailable === false && (
              <p className="mt-1 text-xs text-red-400">Username is already taken</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-purple-200 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound size={16} className="text-purple-300" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-purple-300/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Create a password"
              />
            </div>
            {password.length > 0 && password.length < 6 && (
              <p className="mt-1 text-xs text-yellow-400">Password must be at least 6 characters</p>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-purple-200 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound size={16} className="text-purple-300" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-purple-300/20 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Confirm your password"
              />
            </div>
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center text-purple-300 text-sm">
          <p>Already have an account? <Link to="/login" className="text-purple-400 hover:text-white">Sign In</Link></p>
        </div>
      </motion.div>
    </div>
  );
}
