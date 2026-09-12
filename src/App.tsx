import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { CompletionBanner } from './components/CompletionBanner';
import { LevelUpModal } from './components/LevelUpModal';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { QuestsPage } from './pages/QuestsPage';
import { CharacterPage } from './pages/CharacterPage';
import { ChroniclePage } from './pages/ChroniclePage';
import { MarketPage } from './pages/MarketPage';
import { InventoryPage } from './pages/InventoryPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const { isAuthenticated } = useGame();

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <LandingPage onNavigate={handleNavigate} />;
      case '/login':
        return <AuthPage mode="login" onNavigate={handleNavigate} />;
      case '/signup':
        return <AuthPage mode="signup" onNavigate={handleNavigate} />;
      case '/dashboard':
        return isAuthenticated ? (
          <DashboardPage onNavigate={handleNavigate} />
        ) : (
          <AuthPage mode="login" onNavigate={handleNavigate} />
        );
      case '/quests':
        return isAuthenticated ? (
          <QuestsPage />
        ) : (
          <AuthPage mode="login" onNavigate={handleNavigate} />
        );
      case '/character':
        return isAuthenticated ? (
          <CharacterPage />
        ) : (
          <AuthPage mode="login" onNavigate={handleNavigate} />
        );
      case '/chronicle':
        return isAuthenticated ? (
          <ChroniclePage />
        ) : (
          <AuthPage mode="login" onNavigate={handleNavigate} />
        );
      case '/market':
        return isAuthenticated ? (
          <MarketPage />
        ) : (
          <AuthPage mode="login" onNavigate={handleNavigate} />
        );
      case '/inventory':
        return isAuthenticated ? (
          <InventoryPage />
        ) : (
          <AuthPage mode="login" onNavigate={handleNavigate} />
        );
      case '/achievements':
        return isAuthenticated ? (
          <AchievementsPage />
        ) : (
          <AuthPage mode="login" onNavigate={handleNavigate} />
        );
      case '/settings':
        return isAuthenticated ? (
          <SettingsPage />
        ) : (
          <AuthPage mode="login" onNavigate={handleNavigate} />
        );
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Navbar currentPath={currentPath} onNavigate={handleNavigate} />
      <CompletionBanner />
      <LevelUpModal />
      <main>{renderPage()}</main>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}
