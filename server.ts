import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_CHARACTER, INITIAL_QUESTS, MARKET_ITEMS, INITIAL_ACHIEVEMENTS } from './src/lib/mockSeedData';
import { processQuestCompletion, validateQuestCompletionEligibility } from './src/lib/gameEngine';
import { Character, Quest, QuestCompletion, Achievement } from './src/types/game';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Server State (Authoritative Server Database Backup)
let serverCharacter: Character = { ...INITIAL_CHARACTER };
let serverQuests: Quest[] = [...INITIAL_QUESTS];
let serverCompletions: QuestCompletion[] = [];
let serverInventory: string[] = ['avatar_cyber_hero', 'frame_neon_cyan', 'title_novice', 'theme_dark_cyberpunk'];
let serverAchievements: Achievement[] = [...INITIAL_ACHIEVEMENTS];

// ------------------------------------
// AUTHORITATIVE GAME ENGINE API ROUTES
// ------------------------------------

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'LIFE RPG — Turn your real life into an adventure.',
    version: '2.1.0',
    timestamp: new Date().toISOString(),
  });
});

// 2. Get Character Info
app.get('/api/character', (req, res) => {
  res.json({
    character: serverCharacter,
    inventory: serverInventory,
  });
});

// 3. Start Timed Quest
app.post('/api/quests/:id/start', (req, res) => {
  const { id } = req.params;
  const quest = serverQuests.find((q) => q.id === id);

  if (!quest) {
    return res.status(404).json({ error: 'Quest not found on server.' });
  }

  quest.started_at = new Date().toISOString();
  res.json({ success: true, quest });
});

// 4. Complete Quest (Authoritative Backend Verification & Rate Limiting)
app.post('/api/quests/complete', (req, res) => {
  const { questId, reflectionNote, proofUrl } = req.body;
  const quest = serverQuests.find((q) => q.id === questId);

  if (!quest) {
    return res.status(404).json({ error: 'Quest not found on server.' });
  }

  if (quest.completed) {
    return res.status(400).json({ error: 'Quest has already been completed.' });
  }

  // Authoritative Backend Check: Minimum Duration & Rate Limiting
  const eligibility = validateQuestCompletionEligibility(quest, serverCompletions);
  if (!eligibility.allowed) {
    return res.status(400).json({ error: eligibility.error });
  }

  // Mark quest complete on server
  quest.completed = true;
  quest.completed_at = new Date().toISOString();

  // Run authoritative game engine logic
  const result = processQuestCompletion(
    serverCharacter,
    quest,
    serverCompletions,
    serverAchievements,
    reflectionNote,
    proofUrl
  );

  serverCharacter = result.updatedCharacter;
  serverCompletions.unshift(result.completionRecord);
  serverAchievements = result.updatedAchievements;

  res.json({
    success: true,
    character: serverCharacter,
    completion: result.completionRecord,
    feedback: result.feedback,
    achievements: serverAchievements,
  });
});

// 5. Buy Market Item (Authoritative Gold Check)
app.post('/api/market/buy', (req, res) => {
  const { itemId } = req.body;
  const item = MARKET_ITEMS.find((i) => i.id === itemId);

  if (!item) {
    return res.status(404).json({ error: 'Market item not found.' });
  }

  if (serverInventory.includes(itemId)) {
    return res.status(400).json({ error: 'Item already owned in Arsenal.' });
  }

  if (serverCharacter.gold < item.cost) {
    return res.status(400).json({ error: 'Insufficient Gold on server.' });
  }

  // Deduct Gold & Add to Inventory
  serverCharacter.gold -= item.cost;
  serverInventory.push(itemId);

  res.json({
    success: true,
    character: serverCharacter,
    inventory: serverInventory,
    message: `Acquired ${item.name}!`,
  });
});

// ------------------------------------
// VITE DEV SERVER MIDDLEWARE / STATIC SERVING
// ------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(
          url,
          `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>LIFE RPG — Turn your real life into an adventure</title>
              <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
            </head>
            <body class="bg-[#080c14] text-slate-100 font-mono">
              <div id="root"></div>
              <script type="module" src="/src/main.tsx"></script>
            </body>
          </html>
        `
        );
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    // Production Static Asset Serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`⚔️ LIFE RPG Server running at http://localhost:${PORT}`);
  });
}

startServer();
