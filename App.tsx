
import React, { useState } from 'react';
import { AppDataProvider, useAppData } from './hooks/useAppData';
import LoginScreen from './components/LoginScreen';
import { User } from './types';
// FIX: Import the Dashboard component to resolve a reference error.
import Dashboard from './components/Dashboard';

// Componente que consome o contexto para realizar o login
const AuthGate = () => {
  const { isLoading } = useAppData();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return false;
      }

      const user = await response.json();
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error("Login request failed:", error);
      // This catch block handles network errors, e.g., "Failed to fetch"
      return false;
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="text-xl font-semibold animate-pulse">Carregando dados...</div>
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
