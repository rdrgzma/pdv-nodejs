import React from 'react';
import { Section, User, UserRole } from '../types';

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  currentUser: User;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, currentUser }) => {
  // Define all navigation items and restrict some to the 'admin' role
  const navItems: { id: Section; label: string; icon: string; role?: UserRole }[] = [
    { id: 'pdv', label: 'PDV', icon: '🛒' },
    { id: 'products', label: 'Produtos', icon: '📦' },
    { id: 'categories', label: 'Categorias', icon: '🏷️', role: 'admin' },
    { id: 'customers', label: 'Clientes', icon: '👥' },
    { id: 'reports', label: 'Relatórios', icon: '📊', role: 'admin' },
    { id: 'financial', label: 'Financeiro', icon: '💰', role: 'admin' },
    { id: 'users', label: 'Usuários', icon: '🧑‍💼', role: 'admin' },
    { id: 'settings', label: 'Configurações', icon: '⚙️', role: 'admin' },
  ];

  // Filter navigation items based on the current user's role
  const filteredNavItems = navItems.filter(item => {
    // If an item requires a specific role, only show it if the user has that role.
    if (item.role) {
      return item.role === currentUser.role;
    }
    // If an item does not require a specific role, show it to everyone.
    return true;
  });

  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b dark:border-gray-700">
        <h1 className="text-xl font-bold">Oficina PDV</h1>
      </div>
      <nav className="flex-1 px-4 py-4">
        <ul>
          {filteredNavItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 my-1 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;