'use client';
import React from 'react';
import { Home, MessageCircle, Calendar, BookOpen, Settings, User, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { logOut } from '@/lib/firebase';

const Sidebar = ({ darkMode }) => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: MessageCircle, label: 'Chat', href: '/chat' },
    { icon: Calendar, label: 'Mood Tracker', href: '/mood-tracker' },
    { icon: BookOpen, label: 'My Journey', href: '/journey' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  const handleLogout = async () => {
    const result = await logOut();
    if (result.success) {
      router.push('/');
    }
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen w-64 border-r transition-colors ${
      darkMode 
        ? 'bg-slate-900 border-amber-900/30' 
        : 'bg-white border-amber-200'
    }`}>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <BookOpen className={`w-8 h-8 ${darkMode ? 'text-amber-400' : 'text-orange-600'}`} />
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
            GeetaGPT+
          </span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? darkMode
                      ? 'bg-amber-900/50 text-amber-300'
                      : 'bg-orange-100 text-orange-700'
                    : darkMode
                      ? 'text-amber-100 hover:bg-slate-800'
                      : 'text-slate-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg mt-8 w-full transition-all ${
            darkMode
              ? 'text-amber-100 hover:bg-slate-800'
              : 'text-slate-700 hover:bg-gray-100'
          }`}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;