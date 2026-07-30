import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { THEMES } from '../../types/theme';
import { api } from '../../services/api';
import { User } from '../../types';
import { Users, X, Check, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export const GroupModal: React.FC = () => {
  const {
    isNewGroupModalOpen,
    setNewGroupModalOpen,
    currentUser,
    loadConversations,
    setActiveConversation,
    theme,
    isDarkMode
  } = useStore();

  const currentThemeConfig = THEMES[theme] || THEMES.cloud;

  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isNewGroupModalOpen && currentUser) {
      api.getDemoUsers().then((res) => {
        setAvailableUsers((res.users || []).filter((u) => u.id !== currentUser.id && u.id !== 'user-ai'));
      });
    }
  }, [isNewGroupModalOpen, currentUser]);

  if (!isNewGroupModalOpen) return null;

  const toggleUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName || selectedUserIds.length === 0 || !currentUser) return;

    setLoading(true);
    try {
      const res = await api.createConversation({
        isGroup: true,
        name: groupName,
        description,
        participantIds: [currentUser.id, ...selectedUserIds],
        createdBy: currentUser.id,
      });

      setNewGroupModalOpen(false);
      setGroupName('');
      setSelectedUserIds([]);
      await loadConversations();
      if (res.conversation) {
        setActiveConversation(res.conversation.id);
      }
    } catch (err) {
      console.error('Group creation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
          borderColor: isDarkMode ? '#334155' : `${currentThemeConfig.primary}30`,
          color: isDarkMode ? '#f8fafc' : currentThemeConfig.textColor,
        }}
        className="w-full max-w-md border rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors"
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : `${currentThemeConfig.primary}08`,
            borderColor: isDarkMode ? '#334155' : `${currentThemeConfig.primary}20`,
          }}
          className="p-5 border-b flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{ backgroundColor: `${currentThemeConfig.primary}20`, color: currentThemeConfig.primary }}
              className="p-2 rounded-xl"
            >
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Create New Group Chat</h3>
              <p className="text-[11px] opacity-70">Theme: {currentThemeConfig.name}</p>
            </div>
          </div>
          <button
            onClick={() => setNewGroupModalOpen(false)}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-slate-500/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreate} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 opacity-80">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Core Engineering Team"
              required
              style={{
                backgroundColor: isDarkMode ? '#020617' : '#f8fafc',
                borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                color: isDarkMode ? '#ffffff' : '#0f172a',
              }}
              className="w-full px-3.5 py-2 border rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 opacity-80">Group Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Channel for real-time updates"
              style={{
                backgroundColor: isDarkMode ? '#020617' : '#f8fafc',
                borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                color: isDarkMode ? '#ffffff' : '#0f172a',
              }}
              className="w-full px-3.5 py-2 border rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2 opacity-80">
              Select Group Members ({selectedUserIds.length} selected)
            </label>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {availableUsers.map((user) => {
                const isSelected = selectedUserIds.includes(user.id);
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleUser(user.id)}
                    style={{
                      backgroundColor: isSelected
                        ? `${currentThemeConfig.primary}15`
                        : isDarkMode
                        ? '#020617'
                        : '#f8fafc',
                      borderColor: isSelected
                        ? currentThemeConfig.primary
                        : isDarkMode
                        ? '#334155'
                        : '#e2e8f0',
                    }}
                    className="w-full p-2.5 rounded-xl border flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                      />
                      <div className="text-left min-w-0">
                        <p className="font-semibold text-xs truncate">{user.name}</p>
                        <p className="text-[10px] opacity-60 truncate">{user.email}</p>
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: isSelected ? currentThemeConfig.primary : 'transparent',
                        borderColor: isSelected ? currentThemeConfig.primary : isDarkMode ? '#475569' : '#cbd5e1',
                      }}
                      className="w-5 h-5 rounded-full flex items-center justify-center border transition-colors text-white"
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !groupName || selectedUserIds.length === 0}
            style={{
              backgroundColor: currentThemeConfig.primary,
              color: '#ffffff',
            }}
            className="w-full py-2.5 hover:opacity-90 disabled:opacity-50 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            {loading ? 'Creating Group...' : 'Create Group Chat'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

