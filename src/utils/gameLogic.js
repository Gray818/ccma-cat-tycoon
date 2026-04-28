const XP_PER_LEVEL = 120;

export function getLevelFromXp(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function getXpProgress(xp) {
  return xp % XP_PER_LEVEL;
}

export function rectsOverlap(a, b) {
  return !(
    a.x + a.w < b.x ||
    a.x > b.x + b.w ||
    a.y + a.h < b.y ||
    a.y > b.y + b.h
  );
}

export function canUnlockUpgrade(upgrade, builtIds) {
  return upgrade.prerequisites.every((req) => builtIds.includes(req));
}

export function getPassiveIncome(upgrades, builtIds) {
  return upgrades
    .filter((u) => builtIds.includes(u.id))
    .reduce((sum, u) => sum + u.incomePerSecond, 0);
}

export function getDifficultyRank(difficulty) {
  const rank = {
    Easy: 1,
    Medium: 2,
    Hard: 3,
    Boss: 4
  };
  return rank[difficulty] ?? 1;
}

export function getQuestionForUpgrade(questions, upgrade, masteryFocus = null) {
  const targetRank = getDifficultyRank(upgrade.difficulty);
  let filtered = questions.filter(
    (q) => q.domain === upgrade.category && getDifficultyRank(q.difficulty) >= targetRank
  );

  if (masteryFocus) {
    const focusMatches = filtered.filter((q) => q.domain === masteryFocus || q.category === masteryFocus);
    if (focusMatches.length > 0) filtered = focusMatches;
  }

  if (filtered.length === 0) filtered = questions;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function pickDailyQuest() {
  const quests = [
    { id: 'quest_phleb', text: 'Answer 3 Phlebotomy questions correctly', type: 'correctByDomain', domain: 'Phlebotomy', goal: 3 },
    { id: 'quest_build_ekg', text: 'Build the EKG Room', type: 'buildUpgrade', upgradeId: 'ekg_room', goal: 1 },
    { id: 'quest_vitals', text: 'Answer 2 Vital Signs questions correctly', type: 'correctByDomain', domain: 'Vital Signs', goal: 2 },
    { id: 'quest_boss', text: 'Pass 1 Boss question', type: 'correctByDifficulty', difficulty: 'Boss', goal: 1 }
  ];

  return quests[Math.floor(Math.random() * quests.length)];
}

export function createInitialGameState() {
  return {
    yarn: 60,
    xp: 0,
    lives: 5,
    streak: 0,
    combo: 1,
    builtUpgrades: [],
    answered: [],
    incorrect: [],
    questProgress: 0,
    dailyQuest: pickDailyQuest(),
    skin: 'default',
    bossPassed: 0
  };
}

export function updateQuestProgress(state, question, isCorrect, upgradeId = null) {
  const quest = state.dailyQuest;
  let progress = state.questProgress;

  if (quest.type === 'correctByDomain' && isCorrect && question.domain === quest.domain) progress += 1;
  if (quest.type === 'correctByDifficulty' && isCorrect && question.difficulty === quest.difficulty) progress += 1;
  if (quest.type === 'buildUpgrade' && upgradeId === quest.upgradeId) progress = 1;

  const completed = progress >= quest.goal;
  return {
    progress: Math.min(progress, quest.goal),
    completed
  };
}

export function getWeakDomains(answeredIds, incorrectIds, questions) {
  const totals = new Map();
  const misses = new Map();

  questions.forEach((q) => {
    if (answeredIds.includes(q.id)) {
      totals.set(q.domain, (totals.get(q.domain) || 0) + 1);
    }
  });

  questions.forEach((q) => {
    if (incorrectIds.includes(q.id)) {
      misses.set(q.domain, (misses.get(q.domain) || 0) + 1);
    }
  });

  const stats = [...totals.entries()].map(([domain, total]) => {
    const wrong = misses.get(domain) || 0;
    return {
      domain,
      total,
      wrong,
      missRate: total ? wrong / total : 0
    };
  });

  return stats.sort((a, b) => b.missRate - a.missRate).slice(0, 5);
}

export function validateGameData({ questionsValidation, upgradesValidation }) {
  return {
    valid: questionsValidation.valid && upgradesValidation.valid,
    issues: [...questionsValidation.issues, ...upgradesValidation.issues]
  };
}
