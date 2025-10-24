import React from 'react';
import { User } from '../types';

interface HeaderProps {
    currentUser: User;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div>
        {/* Can add search or other actions here */}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">Olá, {currentUser.name}</span>
        <img
          className="w-8 h-8 rounded-full"
          src={`https://placehold.co/40x40/E2E8F0/4A5568?text=${currentUser.name.charAt(0)}`}
          alt={currentUser.name}
        />
        <button onClick={onLogout} className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            Sair
        </button>
      </div>
    </header>
  );
};

export default Header;
