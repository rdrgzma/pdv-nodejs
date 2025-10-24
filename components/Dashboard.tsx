import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import PDV from './sections/PDV';
import Products from './sections/Products';
import Customers from './sections/Customers';
import Reports from './sections/Reports';
import Financial from './sections/Financial';
import Settings from './sections/Settings';
import Users from './sections/Users';
import { Section, User } from '../types';
import Categories from './sections/Categories';

interface DashboardProps {
  currentUser: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onLogout }) => {
  const [activeSection, setActiveSection] = useState<Section>('pdv');

  const renderSection = () => {
    switch (activeSection) {
      case 'pdv':
        return <PDV />;
      case 'products':
        return <Products />;
      case 'categories':
        return <Categories />;
      case 'customers':
        return <Customers />;
      case 'reports':
        return <Reports />;
      case 'financial':
        return <Financial />;
      case 'settings':
        return <Settings />;
      case 'users':
        return <Users />;
      default:
        return <PDV />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        currentUser={currentUser}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentUser={currentUser} onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;