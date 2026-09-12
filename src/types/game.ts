export type AttributeType = 'strength' | 'intelligence' | 'wisdom' | 'agility' | 'discipline';

export type QuestCategory =
  | 'Coding'
  | 'Study'
  | 'Fitness'
  | 'Reading'
  | 'Health'
  | 'Creativity'
  | 'Mindfulness'
  | 'Personal'
  | 'Work'
  | 'Other';

export type QuestDifficulty = 'Easy' | 'Medium' | 'Hard' | 'Epic';

export type QuestState = 'READY' | 'ACTIVE' | 'COMPLETABLE' | 'COMPLETED';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  due_date?: string;
  is_recurring?: boolean;
  recurring_frequency?: 'daily' | 'weekly' | 'monthly';
  // Quest Timeline & Real-Time Timer Fields
  duration_minutes?: number;
  is_timed?: boolean;
  started_at?: string;
  min_duration_seconds?: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export function getDefaultDurationForCategory(category: QuestCategory): number {
  switch (category) {
    case 'Fitness':
    case 'Health':
      return 30;
    case 'Study':
      return 60;
    case 'Coding':
      return 45;
    case 'Reading':
      return 30;
    case 'Creativity':
      return 45;
    case 'Mindfulness':
      return 15;
    case 'Personal':
    case 'Work':
    case 'Other':
    default:
      return 30;
  }
}

export interface Character {
  id: string;
  name: string;
  level: number;
  xp: number;
  xp_to_next_level: number;
  gold: number;
  current_streak: number;
  longest_streak: number;
  last_quest_completed_at?: string;
  strength: number;
  intelligence: number;
  wisdom: number;
  agility: number;
  discipline: number;
  equipped_avatar: string;
  equipped_frame: string;
  equipped_theme: string;
  equipped_title: string;
}

export interface QuestCompletion {
  id: string;
  quest_id?: string;
  quest_title: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  xp_awarded: number;
  gold_awarded: number;
  attribute_boosted: AttributeType;
  attribute_amount: number;
  reflection_note?: string;
  verified_via?: 'self_report' | 'proof_upload' | 'github';
  proof_url?: string;
  completed_at: string;
}

export type MarketItemType = 'avatar' | 'frame' | 'theme' | 'title' | 'badge';
export type MarketItemRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export interface MarketItem {
  id: string;
  name: string;
  type: MarketItemType;
  rarity: MarketItemRarity;
  cost: number;
  description: string;
  icon: string;
  preview_style?: Record<string, string>;
}

export interface UserInventoryItem {
  id: string;
  item_id: string;
  acquired_at: string;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: MarketItemRarity;
  required_count: number;
  current_count: number;
  unlocked: boolean;
  unlocked_at?: string;
}

export interface CompletionFeedback {
  questTitle: string;
  xpAwarded: number;
  goldAwarded: number;
  attributeBoosted: AttributeType;
  attributeAmount: number;
  leveledUp: boolean;
  oldLevel?: number;
  newLevel?: number;
  streak: number;
  streakContinued: boolean;
  unlockedAchievements: Achievement[];
  anomalyNudge?: string;
}
