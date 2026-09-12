import React, { createContext, useContext, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Achievement,
  Character,
  CompletionFeedback,
  MarketItem,
  Quest,
  QuestCategory,
  QuestCompletion,
  QuestDifficulty,
} from '../types/game';
import { processQuestCompletion, validateQuestCompletionEligibility } from '../lib/gameEngine';
import {
  ACCOUNT_A_CHARACTER,
  ACCOUNT_A_QUESTS,
  ACCOUNT_B_CHARACTER,
  ACCOUNT_B_QUESTS,
  INITIAL_ACHIEVEMENTS,
  MARKET_ITEMS,
  NEW_USER_CHARACTER,
} from '../lib/mockSeedData';

interface LevelUpInfo {
  oldLevel: number;
  newLevel: number;
  goldBonus: number;
}

interface GameContextType {
  character: Character;
  quests: Quest[];
  completions: QuestCompletion[];
  marketItems: MarketItem[];
  inventory: string[];
  achievements: Achievement[];
  activeFeedback: CompletionFeedback | null;
  levelUpInfo: LevelUpInfo | null;
  errorMessage: string | null;
  isAuthenticated: boolean;
  userEmail: string;
  currentUserId: string;
  isFirstTimeUser: boolean;
  loginUser: (email: string, isNewUser?: boolean, presetAccount?: 'account_a' | 'account_b') => void;
  logoutUser: () => void;
  createQuest: (
    title: string,
    category: QuestCategory,
    difficulty: QuestDifficulty,
    description?: string,
    dueDate?: string,
    isTimed?: boolean,
    minDurationMinutes?: number
  ) => Quest;
  updateQuest: (id: string, updates: Partial<Quest>) => void;
  deleteQuest: (id: string) => void;
  startQuestTimer: (questId: string) => void;
  completeQuest: (
    questId: string,
    reflectionNote?: string,
    proofUrl?: string
  ) => Promise<{ success: boolean; error?: string }>;
  buyMarketItem: (itemId: string) => { success: boolean; message: string };
  equipCosmetic: (type: 'avatar' | 'frame' | 'theme' | 'title', value: string) => void;
  updateCharacterName: (name: string) => void;
  dismissFeedback: () => void;
  dismissLevelUp: () => void;
  dismissError: () => void;
  resetProgress: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('life_rpg_auth') === 'true';
  });

  const [userEmail, setUserEmail] = useState<string>(() => {
    return localStorage.getItem('life_rpg_email') || '';
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('life_rpg_user_id') || '';
  });

  const getUserStorageKey = (key: string) => `life_rpg_user_${currentUserId || 'default'}_${key}`;

  // State loaded dynamically per authenticated userId
  const [character, setCharacter] = useState<Character>(() => {
    const userId = localStorage.getItem('life_rpg_user_id') || 'default';
    const saved = localStorage.getItem(`life_rpg_user_${userId}_character`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse character', e);
      }
    }
    return ACCOUNT_A_CHARACTER;
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const userId = localStorage.getItem('life_rpg_user_id') || 'default';
    const saved = localStorage.getItem(`life_rpg_user_${userId}_quests`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse quests', e);
      }
    }
    return ACCOUNT_A_QUESTS;
  });

  const [completions, setCompletions] = useState<QuestCompletion[]>(() => {
    const userId = localStorage.getItem('life_rpg_user_id') || 'default';
    const saved = localStorage.getItem(`life_rpg_user_${userId}_completions`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse completions', e);
      }
    }
    return [];
  });

  const [inventory, setInventory] = useState<string[]>(() => {
    const userId = localStorage.getItem('life_rpg_user_id') || 'default';
    const saved = localStorage.getItem(`life_rpg_user_${userId}_inventory`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse inventory', e);
      }
    }
    return ['avatar_cyber_hero', 'frame_neon_cyan', 'title_novice', 'theme_dark_cyberpunk'];
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const userId = localStorage.getItem('life_rpg_user_id') || 'default';
    const saved = localStorage.getItem(`life_rpg_user_${userId}_achievements`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse achievements', e);
      }
    }
    return INITIAL_ACHIEVEMENTS;
  });

  const [activeFeedback, setActiveFeedback] = useState<CompletionFeedback | null>(null);
  const [levelUpInfo, setLevelUpInfo] = useState<LevelUpInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync active user data to isolated storage key
  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(getUserStorageKey('character'), JSON.stringify(character));
    }
  }, [character, currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(getUserStorageKey('quests'), JSON.stringify(quests));
    }
  }, [quests, currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(getUserStorageKey('completions'), JSON.stringify(completions));
    }
  }, [completions, currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(getUserStorageKey('inventory'), JSON.stringify(inventory));
    }
  }, [inventory, currentUserId]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(getUserStorageKey('achievements'), JSON.stringify(achievements));
    }
  }, [achievements, currentUserId]);

  // Account Login / Signup Logic (Strict Data Isolation)
  const loginUser = (email: string, isNewUser?: boolean, presetAccount?: 'account_a' | 'account_b') => {
    const userId = email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');

    setIsAuthenticated(true);
    setUserEmail(email);
    setCurrentUserId(userId);
    localStorage.setItem('life_rpg_auth', 'true');
    localStorage.setItem('life_rpg_email', email);
    localStorage.setItem('life_rpg_user_id', userId);

    const savedChar = localStorage.getItem(`life_rpg_user_${userId}_character`);
    const savedQuests = localStorage.getItem(`life_rpg_user_${userId}_quests`);
    const savedComps = localStorage.getItem(`life_rpg_user_${userId}_completions`);
    const savedInv = localStorage.getItem(`life_rpg_user_${userId}_inventory`);
    const savedAch = localStorage.getItem(`life_rpg_user_${userId}_achievements`);

    if (savedChar && !presetAccount) {
      // Load Existing Returning User Data
      try {
        setCharacter(JSON.parse(savedChar));
        setQuests(savedQuests ? JSON.parse(savedQuests) : []);
        setCompletions(savedComps ? JSON.parse(savedComps) : []);
        setInventory(savedInv ? JSON.parse(savedInv) : ['avatar_cyber_hero', 'frame_neon_cyan']);
        setAchievements(savedAch ? JSON.parse(savedAch) : INITIAL_ACHIEVEMENTS);
        return;
      } catch (e) {
        console.error('Failed restoring returning user state', e);
      }
    }

    if (presetAccount === 'account_a') {
      // Preset Account A (Returning Hero)
      setCharacter(ACCOUNT_A_CHARACTER);
      setQuests(ACCOUNT_A_QUESTS);
      setCompletions([]);
      setInventory(['avatar_cyber_hero', 'frame_neon_cyan', 'title_code_sorcerer']);
      setAchievements(INITIAL_ACHIEVEMENTS);
    } else if (presetAccount === 'account_b' || isNewUser) {
      // Preset Account B or Fresh Signup (Level 1 Hero)
      const freshHero: Character = {
        ...NEW_USER_CHARACTER,
        id: userId,
        name: email.split('@')[0] || 'Novice Hero',
      };
      setCharacter(freshHero);
      setQuests(ACCOUNT_B_QUESTS);
      setCompletions([]);
      setInventory(['avatar_cyber_hero', 'frame_neon_cyan', 'title_novice', 'theme_dark_cyberpunk']);
      setAchievements(INITIAL_ACHIEVEMENTS);
    } else {
      // Fallback
      const freshHero: Character = {
        ...NEW_USER_CHARACTER,
        id: userId,
        name: email.split('@')[0] || 'Novice Hero',
      };
      setCharacter(freshHero);
      setQuests([]);
      setCompletions([]);
      setInventory(['avatar_cyber_hero', 'frame_neon_cyan', 'title_novice', 'theme_dark_cyberpunk']);
      setAchievements(INITIAL_ACHIEVEMENTS);
    }
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setCurrentUserId('');
    localStorage.removeItem('life_rpg_auth');
    localStorage.removeItem('life_rpg_email');
    localStorage.removeItem('life_rpg_user_id');
  };

  const isFirstTimeUser = character.level === 1 && completions.length === 0 && quests.length === 0;

  // Quest CRUD Operations
  const createQuest = (
    title: string,
    category: QuestCategory,
    difficulty: QuestDifficulty,
    description?: string,
    dueDate?: string,
    isTimed?: boolean,
    minDurationMinutes?: number
  ): Quest => {
    const newQuest: Quest = {
      id: `quest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title,
      category,
      difficulty,
      description: description || '',
      due_date: dueDate,
      duration_minutes: minDurationMinutes || 30,
      is_timed: isTimed || true,
      min_duration_seconds: minDurationMinutes ? minDurationMinutes * 60 : 1800,
      completed: false,
      created_at: new Date().toISOString(),
    };

    setQuests((prev) => [newQuest, ...prev]);
    return newQuest;
  };

  const updateQuest = (id: string, updates: Partial<Quest>) => {
    setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuest = (id: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  const startQuestTimer = (questId: string) => {
    const nowIso = new Date().toISOString();
    setQuests((prev) => prev.map((q) => (q.id === questId ? { ...q, started_at: nowIso } : q)));
  };

  const completeQuest = async (
    questId: string,
    reflectionNote?: string,
    proofUrl?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const targetQuest = quests.find((q) => q.id === questId);
    if (!targetQuest || targetQuest.completed) {
      return { success: false, error: 'Quest not found or already completed.' };
    }

    const eligibility = validateQuestCompletionEligibility(targetQuest, completions);
    if (!eligibility.allowed) {
      setErrorMessage(eligibility.error || 'Quest completion not allowed at this time.');
      return { success: false, error: eligibility.error };
    }

    const updatedQuestList = quests.map((q) =>
      q.id === questId ? { ...q, completed: true, completed_at: new Date().toISOString() } : q
    );
    setQuests(updatedQuestList);

    const result = processQuestCompletion(
      character,
      targetQuest,
      completions,
      achievements,
      reflectionNote,
      proofUrl
    );

    setCharacter(result.updatedCharacter);
    setCompletions((prev) => [result.completionRecord, ...prev]);
    setAchievements(result.updatedAchievements);

    setActiveFeedback(result.feedback);

    if (result.feedback.leveledUp) {
      setLevelUpInfo({
        oldLevel: result.feedback.oldLevel || character.level,
        newLevel: result.feedback.newLevel || result.updatedCharacter.level,
        goldBonus: (result.feedback.newLevel || result.updatedCharacter.level) * 50,
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#ffd700', '#ff007f', '#00ff66'],
      });
    }

    return { success: true };
  };

  const buyMarketItem = (itemId: string): { success: boolean; message: string } => {
    const item = MARKET_ITEMS.find((i) => i.id === itemId);
    if (!item) {
      return { success: false, message: 'Item not found in Guild Market.' };
    }

    if (inventory.includes(itemId)) {
      return { success: false, message: 'You already own this item in your Arsenal.' };
    }

    if (character.gold < item.cost) {
      return { success: false, message: `Insufficient Gold! Requires ${item.cost} Gold (You have ${character.gold}).` };
    }

    setCharacter((prev) => ({ ...prev, gold: prev.gold - item.cost }));
    setInventory((prev) => [...prev, itemId]);

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#ffd700', '#00f0ff'],
    });

    return { success: true, message: `Successfully acquired ${item.name}!` };
  };

  const equipCosmetic = (type: 'avatar' | 'frame' | 'theme' | 'title', value: string) => {
    setCharacter((prev) => {
      switch (type) {
        case 'avatar':
          return { ...prev, equipped_avatar: value };
        case 'frame':
          return { ...prev, equipped_frame: value };
        case 'theme':
          return { ...prev, equipped_theme: value };
        case 'title':
          return { ...prev, equipped_title: value };
        default:
          return prev;
      }
    });
  };

  const updateCharacterName = (newName: string) => {
    if (!newName.trim()) return;
    setCharacter((prev) => ({ ...prev, name: newName.trim() }));
  };

  const dismissFeedback = () => setActiveFeedback(null);
  const dismissLevelUp = () => setLevelUpInfo(null);
  const dismissError = () => setErrorMessage(null);

  const resetProgress = () => {
    if (!currentUserId) return;
    localStorage.removeItem(getUserStorageKey('character'));
    localStorage.removeItem(getUserStorageKey('quests'));
    localStorage.removeItem(getUserStorageKey('completions'));
    localStorage.removeItem(getUserStorageKey('inventory'));
    localStorage.removeItem(getUserStorageKey('achievements'));

    setCharacter(NEW_USER_CHARACTER);
    setQuests([]);
    setCompletions([]);
    setInventory(['avatar_cyber_hero', 'frame_neon_cyan', 'title_novice', 'theme_dark_cyberpunk']);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setActiveFeedback(null);
    setLevelUpInfo(null);
    setErrorMessage(null);
  };

  return (
    <GameContext.Provider
      value={{
        character,
        quests,
        completions,
        marketItems: MARKET_ITEMS,
        inventory,
        achievements,
        activeFeedback,
        levelUpInfo,
        errorMessage,
        isAuthenticated,
        userEmail,
        currentUserId,
        isFirstTimeUser,
        loginUser,
        logoutUser,
        createQuest,
        updateQuest,
        deleteQuest,
        startQuestTimer,
        completeQuest,
        buyMarketItem,
        equipCosmetic,
        updateCharacterName,
        dismissFeedback,
        dismissLevelUp,
        dismissError,
        resetProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
