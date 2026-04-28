import { useEffect, useMemo, useState } from 'react';
import { questions, validateQuestions } from './data/questions';
import { upgrades, validateUpgrades } from './data/upgrades';
import {
  canUnlockUpgrade,
  createInitialGameState,
  getLevelFromXp,
  getPassiveIncome,
  getQuestionForUpgrade,
  getWeakDomains,
  rectsOverlap,
  updateQuestProgress,
  validateGameData
} from './utils/gameLogic';

const MAP_W = 1200;
const MAP_H = 700;
const PLAYER_SIZE = 44;
const SPEED = 4;
const SAVE_KEY = 'ccma-cat-clinic-tycoon-save-v1';

const skins = [
  { id: 'default', label: 'Classic Cat', emoji: '🐱', unlockLevel: 1 },
  { id: 'nurse', label: 'Nurse Cat', emoji: '😺', unlockLevel: 4 },
  { id: 'shadow', label: 'Shadow Cat', emoji: '🐈‍⬛', unlockLevel: 8 }
];

const bossMilestones = [10, 20, 30, 38];

export default function App() {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    return saved ? JSON.parse(saved) : createInitialGameState();
  });

  const [player, setPlayer] = useState({ x: 120, y: 120, facing: 'right' });
  const [keys, setKeys] = useState({});
  const [activeUpgrade, setActiveUpgrade] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [sparkles, setSparkles] = useState([]);
  const [showMastery, setShowMastery] = useState(false);
  const [studyMode, setStudyMode] = useState('');

  const level = getLevelFromXp(state.xp);
  const passiveIncome = getPassiveIncome(upgrades, state.builtUpgrades);
  const builtSet = useMemo(() => new Set(state.builtUpgrades), [state.builtUpgrades]);

  const qValidation = useMemo(() => validateQuestions(questions), []);
  const uValidation = useMemo(() => validateUpgrades(upgrades), []);
  const dataValidation = useMemo(
    () => validateGameData({ questionsValidation: qValidation, upgradesValidation: uValidation }),
    [qValidation, uValidation]
  );

  const questCompleted = state.questProgress >= state.dailyQuest.goal;
  const weakDomains = getWeakDomains(state.answered, state.incorrect, questions);

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const down = (e) => setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: true }));
    const up = (e) => setKeys((prev) => ({ ...prev, [e.key.toLowerCase()]: false }));
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useEffect(() => {
    if (activeQuestion) return;
    const move = () => {
      let dx = 0;
      let dy = 0;
      if (keys.w || keys.arrowup) dy -= SPEED;
      if (keys.s || keys.arrowdown) dy += SPEED;
      if (keys.a || keys.arrowleft) dx -= SPEED;
      if (keys.d || keys.arrowright) dx += SPEED;

      if (!dx && !dy) return;

      setPlayer((prev) => {
        const next = {
          x: Math.max(0, Math.min(MAP_W - PLAYER_SIZE, prev.x + dx)),
          y: Math.max(0, Math.min(MAP_H - PLAYER_SIZE, prev.y + dy)),
          facing: dx < 0 ? 'left' : dx > 0 ? 'right' : prev.facing
        };
        return next;
      });
    };

    const id = setInterval(move, 16);
    return () => clearInterval(id);
  }, [keys, activeQuestion]);

  useEffect(() => {
    const incomeTick = setInterval(() => {
      setState((prev) => ({ ...prev, yarn: prev.yarn + passiveIncome }));
    }, 3000);
    return () => clearInterval(incomeTick);
  }, [passiveIncome]);

  useEffect(() => {
    const sparkTick = setInterval(() => {
      setSparkles((prev) => prev.filter((s) => Date.now() - s.t < 1200));
    }, 200);
    return () => clearInterval(sparkTick);
  }, []);

  useEffect(() => {
    const playerRect = { x: player.x, y: player.y, w: PLAYER_SIZE, h: PLAYER_SIZE };
    const nearby = upgrades.find((u) => {
      const pad = { x: u.position.x, y: u.position.y, w: u.size.w, h: u.size.h };
      return rectsOverlap(playerRect, pad);
    });
    setActiveUpgrade(nearby || null);
  }, [player]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key.toLowerCase() !== 'e' || !activeUpgrade || activeQuestion) return;
      if (builtSet.has(activeUpgrade.id)) return;
      if (!canUnlockUpgrade(activeUpgrade, state.builtUpgrades)) return;
      if (state.yarn < activeUpgrade.cost) return;

      const question = getQuestionForUpgrade(questions, activeUpgrade, studyMode || null);
      setSelectedChoice(null);
      setFeedback(null);
      setActiveQuestion({ question, upgrade: activeUpgrade });
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeUpgrade, activeQuestion, state.builtUpgrades, state.yarn, builtSet, studyMode]);

  function submitAnswer() {
    if (selectedChoice === null || !activeQuestion) return;
    const { question, upgrade } = activeQuestion;
    const isCorrect = selectedChoice === question.correctAnswer;

    setState((prev) => {
      let next = { ...prev };
      next.answered = [...new Set([...next.answered, question.id])];

      const streak = isCorrect ? prev.streak + 1 : 0;
      const combo = isCorrect ? Math.min(5, 1 + Math.floor(streak / 3)) : 1;
      const quest = updateQuestProgress(next, question, isCorrect, upgrade.id);

      next.streak = streak;
      next.combo = combo;
      next.questProgress = quest.progress;

      if (isCorrect) {
        const gainedYarn = Math.floor((upgrade.incomePerSecond * 3 + upgrade.cost * 0.25) * combo);
        next.yarn = prev.yarn - upgrade.cost + gainedYarn;
        next.xp = prev.xp + Math.floor(upgrade.xpReward * combo);
        next.builtUpgrades = [...new Set([...prev.builtUpgrades, upgrade.id])];
        if (question.difficulty === 'Boss') next.bossPassed += 1;
      } else {
        next.lives = Math.max(1, prev.lives - 1);
        next.incorrect = [...new Set([...prev.incorrect, question.id])];
      }

      return next;
    });

    if (isCorrect) {
      setFeedback({
        ok: true,
        text: `Great job! ${upgrade.name} is now built.`,
        explanation: question.explanation,
        tip: question.examTip
      });
      setSparkles((prev) => [...prev, { id: `${upgrade.id}-${Date.now()}`, x: upgrade.position.x, y: upgrade.position.y, t: Date.now() }]);
    } else {
      setFeedback({ ok: false, text: 'Not quite. Keep studying!', explanation: question.explanation, tip: question.examTip });
    }
  }

  function closeModal() {
    setActiveQuestion(null);
    setSelectedChoice(null);
    setFeedback(null);
  }

  function handleReset() {
    localStorage.removeItem(SAVE_KEY);
    setState(createInitialGameState());
    setPlayer({ x: 120, y: 120, facing: 'right' });
    setStudyMode('');
  }

  const availableSkins = skins.filter((s) => level >= s.unlockLevel);
  const needsBoss = bossMilestones.some((m) => state.builtUpgrades.length >= m && state.bossPassed < Math.floor(m / 10));

  return (
    <div className="app-wrap">
      <header className="topbar">
        <h1>CCMA Cat Clinic Tycoon 🏥🐾</h1>
        <p className="disclaimer">
          Study tool disclaimer: This game supports review only and should be used with official NHA CCMA materials.
        </p>
      </header>

      <div className="layout">
        <aside className="side-panel">
          <h2>Clinic Stats</h2>
          <ul>
            <li>🧶 Yarn: {Math.floor(state.yarn)}</li>
            <li>⭐ XP: {state.xp}</li>
            <li>📶 Level: {level}</li>
            <li>❤️ Lives: {state.lives}</li>
            <li>🔥 Streak: {state.streak}</li>
            <li>✨ Combo: x{state.combo}</li>
            <li>💸 Passive Income: +{passiveIncome}/s</li>
            <li>🏗️ Built Upgrades: {state.builtUpgrades.length}/{upgrades.length}</li>
          </ul>

          <div className="quest-box">
            <h3>Shift Quest</h3>
            <p>{state.dailyQuest.text}</p>
            <strong>
              {state.questProgress}/{state.dailyQuest.goal} {questCompleted ? '✅' : ''}
            </strong>
          </div>

          <div className="study-box">
            <h3>Study Mode</h3>
            <select value={studyMode} onChange={(e) => setStudyMode(e.target.value)}>
              <option value="">Auto by upgrade</option>
              {[...new Set(questions.map((q) => q.domain))].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="study-box">
            <h3>Cat Skins</h3>
            {skins.map((skin) => (
              <button
                key={skin.id}
                className={`skin-btn ${state.skin === skin.id ? 'picked' : ''}`}
                disabled={!availableSkins.find((s) => s.id === skin.id)}
                onClick={() => setState((prev) => ({ ...prev, skin: skin.id }))}
              >
                {skin.emoji} {skin.label} {level < skin.unlockLevel ? `(Unlock L${skin.unlockLevel})` : ''}
              </button>
            ))}
          </div>

          <button onClick={() => setShowMastery(true)}>📊 Mastery Screen</button>
          <button onClick={handleReset}>♻️ Reset Save</button>
          {!dataValidation.valid && <p className="warn">Data issues detected: {dataValidation.issues[0]}</p>}
        </aside>

        <main>
          <div className="map" style={{ width: MAP_W, height: MAP_H }}>
            {upgrades.map((u) => {
              const built = builtSet.has(u.id);
              const unlocked = canUnlockUpgrade(u, state.builtUpgrades);
              const nearby = activeUpgrade?.id === u.id;
              return (
                <div
                  key={u.id}
                  className={`upgrade-pad ${built ? 'built' : unlocked ? 'unlocked' : 'locked'} ${nearby ? 'nearby' : ''}`}
                  style={{ left: u.position.x, top: u.position.y, width: u.size.w, height: u.size.h }}
                >
                  <span className="pad-emoji">{u.emoji}</span>
                  <span className="pad-label">{built ? u.name : u.label}</span>
                </div>
              );
            })}

            {sparkles.map((s) => (
              <div key={s.id} className="sparkle" style={{ left: s.x + 24, top: s.y + 10 }}>
                ✨
              </div>
            ))}

            <div className={`player ${player.facing}`} style={{ left: player.x, top: player.y }}>
              {skins.find((s) => s.id === state.skin)?.emoji ?? '🐱'}
            </div>

            {activeUpgrade && !builtSet.has(activeUpgrade.id) && canUnlockUpgrade(activeUpgrade, state.builtUpgrades) && (
              <div className="prompt">Press E to build {activeUpgrade.name} ({activeUpgrade.cost} yarn)</div>
            )}
          </div>

          <section className="checklist">
            <h3>Mini-map Upgrade Checklist</h3>
            <div className="checklist-grid">
              {upgrades.map((u) => (
                <div key={u.id} className={builtSet.has(u.id) ? 'done' : ''}>
                  {builtSet.has(u.id) ? '✅' : '⬜'} {u.name}
                </div>
              ))}
            </div>
            {needsBoss && <p className="boss-alert">⚔️ Boss Exam Ready! Build major rooms and pass boss questions.</p>}
          </section>
        </main>
      </div>

      {activeQuestion && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{activeQuestion.upgrade.name} Challenge ({activeQuestion.question.difficulty})</h3>
            <p className="scenario">{activeQuestion.question.scenario}</p>
            <p className="question">{activeQuestion.question.question}</p>

            <div className="choices">
              {activeQuestion.question.choices.map((c, idx) => (
                <button
                  key={c}
                  className={selectedChoice === idx ? 'selected' : ''}
                  onClick={() => setSelectedChoice(idx)}
                  disabled={!!feedback}
                >
                  {String.fromCharCode(65 + idx)}. {c}
                </button>
              ))}
            </div>

            {!feedback ? (
              <button onClick={submitAnswer} className="submit-btn">
                Submit Answer
              </button>
            ) : (
              <div className={`feedback ${feedback.ok ? 'ok' : 'bad'}`}>
                <strong>{feedback.text}</strong>
                <p>{feedback.explanation}</p>
                <p>Exam Tip: {feedback.tip}</p>
                <button onClick={closeModal}>Continue</button>
              </div>
            )}
          </div>
        </div>
      )}

      {showMastery && (
        <div className="modal-backdrop">
          <div className="modal mastery">
            <h3>Mastery Report</h3>
            <p>Focus weak domains in Study Mode before boss exams.</p>
            {weakDomains.length === 0 ? (
              <p>Answer more questions to generate analytics.</p>
            ) : (
              <ul>
                {weakDomains.map((d) => (
                  <li key={d.domain}>
                    <strong>{d.domain}</strong> — Miss rate {(d.missRate * 100).toFixed(0)}% ({d.wrong}/{d.total})
                  </li>
                ))}
              </ul>
            )}
            <button onClick={() => setShowMastery(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
