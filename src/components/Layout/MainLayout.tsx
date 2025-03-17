import { ReactNode, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppContext } from '../../contexts/AppContext';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { settings } = useAppContext();

  // Apply dark mode on initial load
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (settings.theme === 'system') {
      // Check system preference
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="pt-16 px-6 pb-6 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
} 