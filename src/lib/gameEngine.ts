import { AttributeType, Character, Quest, QuestCategory, QuestCompletion, QuestState, Achievement, CompletionFeedback } from '../types/game';

// 1. Authoritative Reward Calculation
export function getRewardsForDifficulty(difficulty: string): { xp: number; gold: number } {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return { xp: 20, gold: 10 };
    case 'medium':
      return { xp: 40, gold: 20 };
    case 'hard':
      return { xp: 75, gold: 35 };
    case 'epic':
      return { xp: 150, gold: 75 };
    default:
      return { xp: 20, gold: 10 };
  }
}

// 2. Authoritative Category to Attribute Mapping
export function getAttributeForCategory(category: QuestCategory): { attribute: AttributeType; amount: number } {
  switch (category) {
    case 'Coding':
      return { attribute: 'intelligence', amount: 5 };
    case 'Study':
      return { attribute: 'intelligence', amount: 4 };
    case 'Fitness':
      return { attribute: 'strength', amount: 5 };
    case 'Health':
      return { attribute: 'agility', amount: 5 };
    case 'Reading':
      return { attribute: 'wisdom', amount: 4 };
    case 'Creativity':
      return { attribute: 'wisdom', amount: 4 };
    case 'Mindfulness':
      return { attribute: 'discipline', amount: 5 };
    case 'Personal':
    case 'Work':
    case 'Other':
    default:
      return { attribute: 'discipline', amount: 3 };
  }
}

// 3. Non-Linear XP Required: 100 * level^1.5
export function getXPToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

// 4. Quest State Calculator (READY -> ACTIVE -> COMPLETABLE -> COMPLETED)
export function getQuestState(quest: Quest): QuestState {
  if (quest.completed) {
    return 'COMPLETED';
  }

  const durationSec = quest.min_duration_seconds || (quest.duration_minutes ? quest.duration_minutes * 60 : 0);

  // Untimed or zero-duration quests are always ready & completable
  if (!quest.is_timed && durationSec <= 0) {
    return 'COMPLETABLE';
  }

  if (!quest.started_at) {
    return 'READY';
  }

  const startedMs = new Date(quest.started_at).getTime();
  const elapsedSec = Math.floor((Date.now() - startedMs) / 1000);

  if (elapsedSec >= durationSec) {
    return 'COMPLETABLE';
  }

  return 'ACTIVE';
}

// 5. Streak Calculation Helper
export function calculateNewStreak(lastCompletedAt?: string, currentStreak: number = 0): { newStreak: number; continued: boolean } {
  if (!lastCompletedAt) {
    return { newStreak: 1, continued: true };
  }

  const now = new Date();
  const lastDate = new Date(lastCompletedAt);

  const todayStr = now.toISOString().split('T')[0];
  const lastStr = lastDate.toISOString().split('T')[0];

  if (todayStr === lastStr) {
    return { newStreak: Math.max(1, currentStreak), continued: false };
  }

  const diffTime = Math.abs(now.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 2) {
    return { newStreak: currentStreak + 1, continued: true };
  } else {
    return { newStreak: 1, continued: true };
  }
}

// 6. Server-Side Anti-Gaming & Minimum Duration Eligibility Check
export function validateQuestCompletionEligibility(
  quest: Quest,
  completionHistory: QuestCompletion[]
): { allowed: boolean; error?: string } {
  const state = getQuestState(quest);

  if (state === 'COMPLETED') {
    return { allowed: false, error: 'Quest has already been completed.' };
  }

  if (state === 'READY') {
    return {
      allowed: false,
      error: "This quest has not been started yet! Click 'START QUEST' to begin tracking.",
    };
  }

  if (state === 'ACTIVE') {
    const durationSec = quest.min_duration_seconds || (quest.duration_minutes ? quest.duration_minutes * 60 : 0);
    const startedMs = quest.started_at ? new Date(quest.started_at).getTime() : Date.now();
    const elapsedSec = Math.floor((Date.now() - startedMs) / 1000);
    const remainingSec = Math.max(0, durationSec - elapsedSec);
    const remainingMin = Math.ceil(remainingSec / 60);

    return {
      allowed: false,
      error: `Quest in progress — check back in ${remainingMin} minute(s) (${remainingSec}s remaining).`,
    };
  }

  // Rate Limiting Check (Max 5 completions per 60s)
  const nowMs = Date.now();
  const oneMinuteAgoMs = nowMs - 60000;
  const completionsInLastMinute = completionHistory.filter(
    (c) => new Date(c.completed_at).getTime() >= oneMinuteAgoMs
  ).length;

  if (completionsInLastMinute >= 5) {
    return {
      allowed: false,
      error: 'Woah there, Adventurer! Take a breath — maximum 5 quest completions per minute to maintain focus.',
    };
  }

  return { allowed: true };
}

// 7. Complete Quest Engine
export function processQuestCompletion(
  character: Character,
  quest: Quest,
  allCompletions: QuestCompletion[],
  achievements: Achievement[],
  reflectionNote?: string,
  proofUrl?: string
): {
  updatedCharacter: Character;
  completionRecord: QuestCompletion;
  feedback: CompletionFeedback;
  updatedAchievements: Achievement[];
} {
  const rewards = getRewardsForDifficulty(quest.difficulty);
  const attributeReward = getAttributeForCategory(quest.category);
  const streakCalc = calculateNewStreak(character.last_quest_completed_at, character.current_streak);

  let newXP = character.xp + rewards.xp;
  let newGold = character.gold + rewards.gold;
  let newLevel = character.level;
  let leveledUp = false;
  const oldLevel = character.level;

  let currentXPToNext = character.xp_to_next_level;

  while (newXP >= currentXPToNext) {
    newXP -= currentXPToNext;
    newLevel += 1;
    leveledUp = true;
    currentXPToNext = getXPToNextLevel(newLevel);
    newGold += newLevel * 50;
  }

  const updatedAttributes = {
    strength: character.strength,
    intelligence: character.intelligence,
    wisdom: character.wisdom,
    agility: character.agility,
    discipline: character.discipline,
  };

  updatedAttributes[attributeReward.attribute] += attributeReward.amount;

  if (leveledUp) {
    updatedAttributes.intelligence += 2;
    updatedAttributes.wisdom += 1;
    updatedAttributes.strength += 1;
    updatedAttributes.agility += 1;
    updatedAttributes.discipline += 2;
  }

  const updatedCharacter: Character = {
    ...character,
    level: newLevel,
    xp: newXP,
    xp_to_next_level: currentXPToNext,
    gold: newGold,
    current_streak: streakCalc.newStreak,
    longest_streak: Math.max(character.longest_streak, streakCalc.newStreak),
    last_quest_completed_at: new Date().toISOString(),
    ...updatedAttributes,
  };

  const verifiedVia = proofUrl ? 'proof_upload' : 'self_report';

  const completionRecord: QuestCompletion = {
    id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    quest_id: quest.id,
    quest_title: quest.title,
    category: quest.category,
    difficulty: quest.difficulty,
    xp_awarded: rewards.xp,
    gold_awarded: rewards.gold,
    attribute_boosted: attributeReward.attribute,
    attribute_amount: attributeReward.amount,
    reflection_note: reflectionNote?.trim() || undefined,
    verified_via: verifiedVia,
    proof_url: proofUrl?.trim() || undefined,
    completed_at: new Date().toISOString(),
  };

  const updatedCompletions = [completionRecord, ...allCompletions];
  const totalCompletedCount = updatedCompletions.length;

  const newlyUnlockedAchievements: Achievement[] = [];

  const updatedAchievements = achievements.map((ach) => {
    let currentCount = ach.current_count;

    if (ach.code === 'FIRST_QUEST') {
      currentCount = totalCompletedCount;
    } else if (ach.code === 'EARLY_RISE') {
      currentCount = streakCalc.newStreak;
    } else if (ach.code === 'WARRIOR') {
      currentCount = updatedCompletions.filter((c) => c.category === 'Fitness').length;
    } else if (ach.code === 'SCHOLAR') {
      currentCount = updatedCompletions.filter((c) => c.category === 'Coding' || c.category === 'Study').length;
    } else if (ach.code === 'STREAK_MASTER') {
      currentCount = streakCalc.newStreak;
    } else if (ach.code === 'LEVEL_10') {
      currentCount = newLevel;
    } else if (ach.code === 'CENTURION') {
      currentCount = totalCompletedCount;
    }

    const isUnlockedNow = currentCount >= ach.required_count;

    if (isUnlockedNow && !ach.unlocked) {
      const unlockedAch = { ...ach, unlocked: true, unlocked_at: new Date().toISOString(), current_count: currentCount };
      newlyUnlockedAchievements.push(unlockedAch);
      return unlockedAch;
    }

    return { ...ach, current_count: currentCount };
  });

  const thirtySecsAgoMs = Date.now() - 30000;
  const recentCompletionsCount = updatedCompletions.filter(
    (c) => new Date(c.completed_at).getTime() >= thirtySecsAgoMs
  ).length;

  let anomalyNudge: string | undefined = undefined;
  if (recentCompletionsCount >= 3) {
    anomalyNudge = '⚡ Rapid Victory Sequence! You are on a roll — remember to rest and reflect between quests.';
  }

  const feedback: CompletionFeedback = {
    questTitle: quest.title,
    xpAwarded: rewards.xp,
    goldAwarded: rewards.gold,
    attributeBoosted: attributeReward.attribute,
    attributeAmount: attributeReward.amount,
    leveledUp,
    oldLevel,
    newLevel,
    streak: streakCalc.newStreak,
    streakContinued: streakCalc.continued,
    unlockedAchievements: newlyUnlockedAchievements,
    anomalyNudge,
  };

  return {
    updatedCharacter,
    completionRecord,
    feedback,
    updatedAchievements,
  };
}
