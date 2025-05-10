import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Shield, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-800 flex flex-col">
      <header className="py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-purple-400">Tech</span>
            <span>Connect</span>
          </h1>
          
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-purple-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Join the InfoTech Student Community
          </h2>
          <p className="text-lg text-purple-200 mb-8">
            Discover and connect with student-led clubs that match your interests and skills.
            Learn, collaborate, and grow together in a vibrant tech community.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-lg font-medium transition-all"
            >
              Sign Up Now
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-lg font-medium transition-all"
            >
              Browse Clubs
            </Link>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
          >
            <div className="bg-purple-500/20 rounded-full p-3 w-fit mb-4">
              <Users size={24} className="text-purple-300" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">For Students</h3>
            <p className="text-purple-200">
              Discover clubs that match your interests, submit join requests, and connect with like-minded peers.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
          >
            <div className="bg-blue-500/20 rounded-full p-3 w-fit mb-4">
              <BookOpen size={24} className="text-blue-300" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">For Leaders</h3>
            <p className="text-purple-200">
              Manage your club, approve member requests, and organize activities to grow your community.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
          >
            <div className="bg-green-500/20 rounded-full p-3 w-fit mb-4">
              <Shield size={24} className="text-green-300" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">For Admins</h3>
            <p className="text-purple-200">
              Create clubs, assign leaders, and oversee the entire ecosystem of student organizations.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
