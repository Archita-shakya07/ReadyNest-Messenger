import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { THEMES } from './types/theme';
import { socketService } from './services/socketService';
import { AppHeader } from './components/navigation/AppHeader';
import { LeftRail } from './components/navigation/LeftRail';
import { Sidebar } from './components/navigation/Sidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { SettingsPanel } from './components/navigation/SettingsPanel';
import { ContactInfoDrawer } from './components/info/ContactInfoDrawer';
import { AdminPanel } from './components/admin/AdminPanel';
import { CallsPanel } from './components/calls/CallsPanel';
import { StatusPanel } from './components/status/StatusPanel';
import { StoryViewerModal } from './components/status/StoryViewerModal';
import { SpecsRoadmapModal } from './components/specs/SpecsRoadmapModal';
import { AuthModal } from './components/auth/AuthModal';
import { AuthPage } from './components/auth/AuthPage';
import { GroupModal } from './components/chat/GroupModal';
import { VoiceVideoCallModal } from './components/chat/VoiceVideoCallModal';
import { SystemBroadcastBanner } from './components/ui/SystemBroadcastBanner';
import { MediaPreviewModal } from './components/ui/MediaPreviewModal';
import { ThemeModal } from './components/ui/ThemeModal';
import { LandingPage } from './components/landing/LandingPage';

export default function App() {
  const {
    currentUser,
    setCurrentUser,
    authPageMode,
    viewMode,
    initSocketListeners,
    isDarkMode,
    theme,
    activeConversationId
  } = useStore();

  const currentThemeConfig = THEMES[theme] || THEMES.emerald || THEMES.cloud;

  useEffect(() => {
    // Sync dark mode class on html tag
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Auto login from localStorage if available
    const savedUser = localStorage.getItem('readynest_user');
    const savedToken = localStorage.getItem('readynest_token');

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user, savedToken || undefined);
      } catch (e) {
        // If saved user invalid, stay on landing page
      }
    }

    // Listen to real-time socket events
    initSocketListeners();
  }, []);

  // If not logged in, render Landing Page or full-screen Auth Page based on authPageMode
  if (!currentUser) {
    if (authPageMode === 'signin' || authPageMode === 'signup') {
      return <AuthPage />;
    }
    return <LandingPage />;
  }

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#020617' : currentThemeConfig.appBg,
        color: isDarkMode ? '#f8fafc' : currentThemeConfig.textColor,
      }}
      className="h-screen w-screen flex flex-col font-sans overflow-hidden antialiased select-none transition-colors duration-300"
    >
      {/* Primary Navigation Header */}
      <AppHeader />

      {/* Main Body Stage */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Navigation Rail (Visible on md+ screens) */}
        <div className="hidden md:flex h-full flex-shrink-0">
          <LeftRail />
        </div>

        {viewMode === 'chat' && (
          <div className="flex-1 flex h-full w-full overflow-hidden">
            {/* Left Sidebar: Conversations List */}
            <div className={`${activeConversationId ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 h-full flex-shrink-0`}>
              <Sidebar />
            </div>

            {/* Center Chat Workspace */}
            <div className={`${!activeConversationId ? 'hidden md:flex' : 'flex'} flex-1 h-full min-w-0`}>
              <ChatWindow />
            </div>

            {/* Right Contact Details Drawer */}
            <ContactInfoDrawer />
          </div>
        )}

        {viewMode === 'calls' && <CallsPanel />}

        {viewMode === 'status' && <StatusPanel />}

        {viewMode === 'settings' && <SettingsPanel />}

        {viewMode === 'admin' && <AdminPanel />}

        {viewMode === 'specs' && <SpecsRoadmapModal />}
      </main>

      {/* Global Modals */}
      <AuthModal />
      <GroupModal />
      <VoiceVideoCallModal />
      <StoryViewerModal />
      <MediaPreviewModal />
      <ThemeModal />
    </div>
  );
}
