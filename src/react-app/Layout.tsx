import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Layout() {
  const location = useLocation();

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      {/* Navigation */}
      <nav className='border-b border-white/10 bg-black/50 backdrop-blur-md'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <motion.h1
              className='text-3xl font-bold text-white'
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              🎬 CineVault
            </motion.h1>

            <div className='flex items-center space-x-4'>
              <Link
                to='/'
                className={cn(
                  'px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium',
                  location.pathname === '/'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                Manual Search
              </Link>
              <Link
                to='/live-search'
                className={cn(
                  'px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium',
                  location.pathname === '/live-search'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                Live Search
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <Outlet />
    </div>
  );
}
