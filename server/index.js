import express from 'express';
import cors from 'cors';
import TelegramBot from 'node-telegram-bot-api';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const ROOT     = dirname(dirname(fileURLToPath(import.meta.url)));
const DATA_DIR = join(ROOT, 'data');
const DATA_FILE= join(DATA_DIR, 'content.json');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OWNER_ID  = process.env.TELEGRAM_OWNER_ID;
const API_PORT  = process.env.PORT || 3001;

if (!BOT_TOKEN) { console.error('[bot] TELEGRAM_BOT_TOKEN not set'); process.exit(1); }
if (!OWNER_ID)  { console.error('[bot] TELEGRAM_OWNER_ID not set');  process.exit(1); }

const defData = {
  games: [],
  projects: [
    { key: 'active', label: 'Active Builds', items: [] },
    { key: 'upcoming', label: 'In Dev / Concepts', items: [] },
    { key: 'archive', label: 'Archive', items: [] }
  ]
};

const load = () => {
  if (!existsSync(DATA_FILE)) return defData;
  try { return JSON.parse(readFileSync(DATA_FILE, 'utf8')); }
  catch(e) { return defData; }
};

const save = (d) => {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(d, null, 2), 'utf8');
};

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const session = {};

const md = (id, txt, opt = {}) => {
  bot.sendMessage(id, txt, { parse_mode: 'Markdown', ...opt }).catch(e => console.error('[bot-error]', e.message));
};

const clean = (chatId) => { delete session[chatId]; };

/* ─── MAIN MENU ─────────────────────────────────────────────── */
const showMenu = (chatId) => {
  clean(chatId);
  md(chatId, '🛸 *Site Manager Panel*\nSelect an option below:', {
    reply_markup: { inline_keyboard: [
      [{ text: '🎮 Manage Games', callback_data: 'nav_games' }],
      [{ text: '💼 Manage Projects', callback_data: 'nav_projects' }]
    ]}
  });
};

/* ─── GAMES SECTION ─────────────────────────────────────────── */
const showGames = (chatId) => {
  const d = load();
  const lines = d.games.length
    ? d.games.map((g, i) => `*${i + 1}.* \`${g.title}\`\n${g.desc}\nurl: ${g.url || '_none_'}\nplays: ${g.plays}  color: ${g.color}`).join('\n\n')
    : '_No games yet_';
  md(chatId, `🎮 *Games (${d.games.length})*\n\n${lines}`, {
    reply_markup: { inline_keyboard: [
      [{ text: '➕ Add Game', callback_data: 'game_add' }],
      ...d.games.map((g, i) => [
        { text: `✏️ ${i + 1}`, callback_data: `game_edit_${i}` },
        { text: `🗑️ ${i + 1}`, callback_data: `game_rm_${i}` }
      ]),
      [{ text: '⬅️ Menu', callback_data: 'nav_menu' }]
    ]}
  });
};

/* ─── PROJECTS SECTION ──────────────────────────────────────── */
const showProjects = (chatId) => {
  const d = load();
  const lines = d.projects.map(s => `*${s.label}* — ${s.items.length} item(s)`).join('\n');
  md(chatId, `💼 *Projects*\n\n${lines}\n\nTap a section to manage it:`, {
    reply_markup: { inline_keyboard: [
      ...d.projects.map(s => [{ text: `📂 ${s.label}`, callback_data: `sec_${s.key}` }]),
      [{ text: '⬅️ Menu', callback_data: 'nav_menu' }]
    ]}
  });
};

/* ─── INLINE ACTIONS ────────────────────────────────────────── */
bot.on('callback_query', (q) => {
  const id = q.message.chat.id;
  if (String(q.from.id) !== String(OWNER_ID)) return bot.answerCallbackQuery(q.id, { text: 'Unauthorized' });

  const act = q.data;
  bot.answerCallbackQuery(q.id);

  if (act === 'nav_menu') return showMenu(id);
  if (act === 'nav_games') return showGames(id);
  if (act === 'nav_projects') return showProjects(id);

  if (act === 'game_add') {
    session[id] = { step: 'g_title' };
    return md(id, 'Enter *Title* for the new game:');
  }

  if (act.startsWith('game_rm_')) {
    const idx = parseInt(act.split('_')[2]);
    const d = load();
    d.games.splice(idx, 1);
    save(d);
    return showGames(id);
  }

  if (act.startsWith('game_edit_')) {
    const idx = parseInt(act.split('_')[2]);
    session[id] = { step: 'g_edit_select', idx };
    return md(id, 'What do you want to edit?', {
      reply_markup: { inline_keyboard: [
        [{ text: 'Title', callback_data: `ge_title_${idx}` }, { text: 'Desc', callback_data: `ge_desc_${idx}` }],
        [{ text: 'URL', callback_data: `ge_url_${idx}` }, { text: 'Plays', callback_data: `ge_plays_${idx}` }],
        [{ text: 'Color', callback_data: `ge_color_${idx}` }],
        [{ text: '⬅️ Back', callback_data: 'nav_games' }]
      ]}
    });
  }

  if (act.startsWith('ge_')) {
    const parts = act.split('_');
    const field = parts[0].substring(2); 
    const idx = parseInt(parts[2]);
    session[id] = { step: `g_edit_${field}`, idx };
    return md(id, `Enter new value for *${field.toUpperCase()}*:`);
  }

  if (act.startsWith('sec_')) {
    const key = act.split('_')[1];
    const d = load();
    const sec = d.projects.find(s => s.key === key);
    const lines = sec.items.length ? sec.items.map((t, i) => `*${i + 1}.* ${t}`).join('\n') : '_Empty_';
    return md(id, `📁 *${sec.label}*\n\n${lines}`, {
      reply_markup: { inline_keyboard: [
        [{ text: '➕ Add Item', callback_data: `p_add_${key}` }],
        ...sec.items.map((t, i) => [
          { text: `🗑️ Remove ${i + 1}`, callback_data: `p_rm_${key}_${i}` }
        ]),
        [{ text: '⬅️ Back', callback_data: 'nav_projects' }]
      ]}
    });
  }

  if (act.startsWith('p_add_')) {
    const key = act.split('_')[2];
    session[id] = { step: 'p_item', key };
    return md(id, 'Type the text/title for this item:');
  }

  if (act.startsWith('p_rm_')) {
    const [,, key, idxStr] = act.split('_');
    const idx = parseInt(idxStr);
    const d = load();
    const sec = d.projects.find(s => s.key === key);
    sec.items.splice(idx, 1);
    save(d);
    return bot.editMessageText(`📁 *${sec.label}*\n\nUpdated...`, { chat_id: id, message_id: q.message.message_id, parse_mode: 'Markdown' }).then(() => showProjects(id));
  }
});

/* ─── TEXT ROUTER ───────────────────────────────────────────── */
bot.on('message', (msg) => {
  const id = msg.chat.id;
  const txt = msg.text ? msg.text.trim() : '';

  if (String(msg.from?.id) !== String(OWNER_ID)) return;
  if (txt === '/start' || txt === '/menu') return showMenu(id);

  const s = session[id];
  if (!s) return;

  const d = load();

  // Add Game Sequence
  if (s.step === 'g_title') {
    s.title = txt;
    s.step = 'g_desc';
    return md(id, 'Enter *Description*:');
  }
  if (s.step === 'g_desc') {
    s.desc = txt;
    s.step = 'g_url';
    return md(id, 'Enter *URL* (or type /skip):');
  }
  if (s.step === 'g_url') {
    s.url = txt === '/skip' ? '' : txt;
    s.step = 'g_plays';
    return md(id, 'Enter starting *Plays count* (number):');
  }
  if (s.step === 'g_plays') {
    s.plays = parseInt(txt) || 0;
    s.step = 'g_color';
    return md(id, 'Enter theme *Color hex/name* (e.g., #FF0055):');
  }
  if (s.step === 'g_color') {
    d.games.push({ title: s.title, desc: s.desc, url: s.url, plays: s.plays, color: txt });
    save(d);
    clean(id);
    return md(id, '✅ Game Added!').then(() => showGames(id));
  }

  // Edit Game Fields
  if (s.step.startsWith('g_edit_')) {
    const field = s.step.replace('g_edit_', '');
    const target = d.games[s.idx];
    if (target) {
      if (field === 'plays') target[field] = parseInt(txt) || 0;
      else target[field] = txt;
      save(d);
    }
    clean(id);
    return md(id, '✅ Field Updated!').then(() => showGames(id));
  }

  // Add Project Item
  if (s.step === 'p_item') {
    const sec = d.projects.find(x => x.key === s.key);
    if (sec) {
      sec.items.push(txt);
      save(d);
    }
    clean(id);
    return md(id, '✅ Item saved!').then(() => showProjects(id));
  }
});

/* ─── WEB API ENDPOINTS ─────────────────────────────────────── */
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/content', (req, res) => {
  res.json(load());
});

app.listen(API_PORT, () => {
  console.log(`[api] running on port ${API_PORT}`);
  console.log(`[bot] started — polling for updates`);
});

// 🧪 DIAGNOSTIC CONSOLE CHECK
bot.getMe().then((u) => console.log(`✅ Telegram Connection Verified: @${u.username}`)).catch(e => console.error('❌ Bot error:', e.message));
