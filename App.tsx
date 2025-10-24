
import React, { useState } from 'react';
import { AppDataProvider, useAppData } from './hooks/useAppData';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import { User } from './types';

// Componente que consome o contexto para realizar o login
const AuthGate = () => {
  const { users, isLoading } = useAppData();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const handleLogin = (email: string, password: string):boolean => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="text-xl font-semibold animate-pulse">Carregando banco de dados...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }
  
  return <Dashboard currentUser={currentUser} onLogout={handleLogout} />;
};


function App() {
  return (
    <AppDataProvider>
      <AuthGate />
    </AppDataProvider>
  );
}

export default App;