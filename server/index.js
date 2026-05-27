import express  from 'express';
import cors     from 'cors';
import TelegramBot from 'node-telegram-bot-api';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname  = dirname(fileURLToPath(import.meta.url));
const ROOT       = join(__dirname, '..');
const BOT_TOKEN  = process.env.TELEGRAM_BOT_TOKEN;
const OWNER_ID   = Number(process.env.TELEGRAM_OWNER_ID);
const JSONBIN_KEY = process.env.JSONBIN_KEY;
const JSONBIN_BIN = process.env.JSONBIN_BIN;
const API_PORT   = process.env.PORT || 3001;

if (!BOT_TOKEN)   { console.error('[bot] TELEGRAM_BOT_TOKEN not set'); process.exit(1); }
if (!OWNER_ID)    { console.error('[bot] TELEGRAM_OWNER_ID not set');  process.exit(1); }
if (!JSONBIN_KEY) { console.error('[data] JSONBIN_KEY not set');        process.exit(1); }
if (!JSONBIN_BIN) { console.error('[data] JSONBIN_BIN not set');        process.exit(1); }

/* ─── Content helpers ──────────────────────────────────────── */
let _cache = null;

const load = () => _cache;
const save = (d) => {
  _cache = d;
  fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN}`, {
    method: 'PUT',
    headers: { 'X-Master-Key': JSONBIN_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(d)
  }).catch(e => console.error('[data] save error:', e));
};

const init = async () => {
  const r = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN}/latest`, {
    headers: { 'X-Master-Key': JSONBIN_KEY }
  });
  const j = await r.json();
  _cache = j.record;
  console.log('[data] loaded from JSONBin');
};

init().catch(e => { console.error('[data] init failed:', e); process.exit(1); });

const nextId = (arr) => Math.max(0, ...arr.map(g => g.id || 0)) + 1;

const COLORS = ['#00ffff','#ff00ff','#aaff00','#ff6600','#7b68ee','#ff9944','#ff4444','#ffffff'];

const COLORS = ['#00ffff','#ff00ff','#aaff00','#ff6600','#7b68ee','#ff9944','#ff4444','#ffffff'];

/* ─── Express API ──────────────────────────────────────────── */
const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/content', (_req, res) => {
  try { res.json(load()); }
  catch { res.status(500).json({ error: 'Failed to load content' }); }
});

app.use(express.static(join(ROOT, 'dist')));
app.get('*', (_req, res) => res.sendFile(join(ROOT, 'dist', 'index.html')));

app.listen(API_PORT, () => console.log(`[api] http://localhost:${API_PORT}/api/content`));

/* ─── Telegram bot ─────────────────────────────────────────── */
const bot      = new TelegramBot(BOT_TOKEN, { polling: true });
const sessions = {}; // chatId → { step, data }

const isOwner  = (msg) => msg.from?.id === OWNER_ID;
const md       = (id, text, extra = {}) =>
  bot.sendMessage(id, text, { parse_mode: 'Markdown', disable_web_page_preview: true, ...extra });

/* ─── /start /menu ──────────────────────────────────────────── */
bot.onText(/^\/(start|menu)$/, (msg) => {
  if (!isOwner(msg)) return;
  sessions[msg.chat.id] = null;
  md(msg.chat.id, `🎮 *ink's site manager*\n\nWhat do you want to manage?`, {
    reply_markup: { inline_keyboard: [
      [{ text: '📝 About',    callback_data: 'nav_about'    }],
      [{ text: '🎮 Games',    callback_data: 'nav_games'    }],
      [{ text: '💼 Projects', callback_data: 'nav_projects' }],
      [{ text: 'ℹ️ Help',    callback_data: 'nav_help'     }],
    ]},
  });
});

/* ─── /help ─────────────────────────────────────────────────── */
bot.onText(/^\/help$/, (msg) => {
  if (!isOwner(msg)) return;
  md(msg.chat.id, `*Commands*\n\n/menu — main menu\n/status — content summary\n\n*About*\n/about — view & edit about\n/setbio — update bio text\n\n*Games*\n/games — list games\n/addgame — add a game\n/removegame \\<num\\> — remove game\n\n*Projects*\n/projects — list sections\n/addproject \\<section\\> — add item\n/removeproject \\<section\\> \\<num\\> — remove item\n\nSections: apps github sites bots tools`);
});

/* ─── /status ───────────────────────────────────────────────── */
bot.onText(/^\/status$/, (msg) => {
  if (!isOwner(msg)) return;
  const d = load();
  const total = d.projects.reduce((a, s) => a + s.items.length, 0);
  md(msg.chat.id, `📊 *Status*\n🎮 Games: ${d.games.length}\n💼 Projects: ${total} items\n📝 Bio: ${d.about.bio.length} chars\n📈 Stats: ${d.about.stats.length}\n🎒 Inventory: ${d.about.inventory.length}`);
});

/* ─── /about ────────────────────────────────────────────────── */
const showAbout = (chatId) => {
  const d = load();
  const a = d.about;
  md(chatId,
    `📝 *About*\n\n*Bio:*\n\`\`\`\n${a.bio}\n\`\`\`\n\n*Stats:*\n${a.stats.map(s=>`${s.label}: ${s.val}% ${s.color}`).join('\n')}\n\n*Inventory:*\n${a.inventory.map((x,i)=>`${i+1}. ${x}`).join('\n')}`,
    { reply_markup: { inline_keyboard: [
      [{ text: '✏️ Edit Bio',       callback_data: 'about_bio'       }],
      [{ text: '📊 Edit Stats',     callback_data: 'about_stats'     }],
      [{ text: '🎒 Edit Inventory', callback_data: 'about_inventory' }],
      [{ text: '⬅️ Menu',          callback_data: 'nav_menu'        }],
    ]}},
  );
};
bot.onText(/^\/about$/, (msg) => { if (!isOwner(msg)) return; showAbout(msg.chat.id); });

/* ─── /setbio ───────────────────────────────────────────────── */
bot.onText(/^\/setbio$/, (msg) => {
  if (!isOwner(msg)) return;
  sessions[msg.chat.id] = { step: 'about_bio', data: {} };
  md(msg.chat.id, '📝 Send the new *bio* text (multi-line ok):');
});

/* ─── /games ────────────────────────────────────────────────── */
const showGames = (chatId) => {
  const d = load();
  const lines = d.games.length
    ? d.games.map((g,i) => `*${i+1}.* \`${g.title}\`\n${g.desc}\nurl: ${g.url||'_none_'}\nplays: ${g.plays}  color: ${g.color}`).join('\n\n')
    : '_No games yet_';
  md(chatId, `🎮 *Games (${d.games.length})*\n\n${lines}`, {
    reply_markup: { inline_keyboard: [
      [{ text: '➕ Add Game', callback_data: 'game_add' }],
      ...d.games.map((g,i) => [
        { text: `✏️ ${i+1}`, callback_data: `game_edit_${i}` },
        { text: `🗑️ ${i+1}`, callback_data: `game_rm_${i}`   },
      ]),
      [{ text: '⬅️ Menu', callback_data: 'nav_menu' }],
    ]},
  });
};
bot.onText(/^\/games$/, (msg) => { if (!isOwner(msg)) return; showGames(msg.chat.id); });

/* ─── /addgame ──────────────────────────────────────────────── */
bot.onText(/^\/addgame$/, (msg) => {
  if (!isOwner(msg)) return;
  sessions[msg.chat.id] = { step: 'game_add_title', data: {} };
  md(msg.chat.id, '🎮 *Add Game*\n\nEnter the game *title* (e.g. `DUNGEON_RUSH`):');
});

/* ─── /removegame <n> ───────────────────────────────────────── */
bot.onText(/^\/removegame (\d+)$/, (msg, m) => {
  if (!isOwner(msg)) return;
  const d = load(); const idx = parseInt(m[1]) - 1;
  if (idx < 0 || idx >= d.games.length) return md(msg.chat.id, '❌ Invalid number.');
  const gone = d.games.splice(idx, 1)[0]; save(d);
  md(msg.chat.id, `✅ Removed *${gone.title}*`);
});

/* ─── /projects ─────────────────────────────────────────────── */
const showProjects = (chatId) => {
  const d = load();
  const lines = d.projects.map(s => `*${s.label}* — ${s.items.length} item(s)`).join('\n');
  md(chatId, `💼 *Projects*\n\n${lines}\n\nTap a section to manage it:`, {
    reply_markup: { inline_keyboard: [
      ...d.projects.map(s => [{ text: `📂 ${s.label}`, callback_data: `sec_${s.key}` }]),
      [{ text: '⬅️ Menu', callback_data: 'nav_menu' }],
    ]},
  });
};
bot.onText(/^\/projects$/, (msg) => { if (!isOwner(msg)) return; showProjects(msg.chat.id); });

/* ─── /addproject <section> ─────────────────────────────── */
bot.onText(/^\/addproject (\w+)$/, (msg, m) => {
  if (!isOwner(msg)) return;
  const id = msg.chat.id; const key = m[1].toLowerCase();
  const d = load(); const sec = d.projects.find(s => s.key === key);
  if (!sec) return md(id, `❌ Section not found. Valid: ${d.projects.map(s=>s.key).join(', ')}`);
  sessions[id] = { step: 'proj_add_title', data: { section: key } };
  md(id, `💼 *Add to ${sec.label}*\n\nEnter project *title*:`);
});

/* ─── /removeproject <section> <n> ─────────────────────────── */
bot.onText(/^\/removeproject (\w+) (\d+)$/, (msg, m) => {
  if (!isOwner(msg)) return;
  const d = load(); const sec = d.projects.find(s => s.key === m[1]);
  if (!sec) return md(msg.chat.id, '❌ Section not found.');
  const idx = parseInt(m[2]) - 1;
  if (idx < 0 || idx >= sec.items.length) return md(msg.chat.id, '❌ Invalid number.');
  const gone = sec.items.splice(idx, 1)[0]; save(d);
  md(msg.chat.id, `✅ Removed *${gone.title}* from ${sec.label}`);
});

/* ─── Callback query handler ────────────────────────────────── */
bot.on('callback_query', async (q) => {
  if (q.from.id !== OWNER_ID) return;
  const id   = q.message.chat.id;
  const data = q.data;
  bot.answerCallbackQuery(q.id).catch(() => {});

  if (data === 'nav_menu'     || data === 'nav_start') { 
    const d = load();
    md(id, `🎮 *ink's site manager*\n\nWhat do you want to manage?`, {
      reply_markup: { inline_keyboard: [
        [{ text: '📝 About',    callback_data: 'nav_about'    }],
        [{ text: '🎮 Games',    callback_data: 'nav_games'    }],
        [{ text: '💼 Projects', callback_data: 'nav_projects' }],
        [{ text: 'ℹ️ Help',    callback_data: 'nav_help'     }],
      ]},
    });
    return; 
  }
  if (data === 'nav_games')    { showGames(id); return; }
  if (data === 'nav_projects') { showProjects(id); return; }
  if (data === 'nav_about')    { showAbout(id); return; }
  if (data === 'nav_help')     { 
    md(id, `*Commands*\n\n/menu — main menu\n/status — content summary\n\n*About*\n/about — view & edit about\n/setbio — update bio text\n\n*Games*\n/games — list games\n/addgame — add a game\n/removegame \\<num\\> — remove game\n\n*Projects*\n/projects — list sections\n/addproject \\<section\\> — add item\n/removeproject \\<section\\> \\<num\\> — remove item\n\nSections: apps github sites bots tools`, {
      reply_markup: { inline_keyboard: [
        [{ text: '⬅️ Menu', callback_data: 'nav_menu' }],
      ]},
    });
    return; 
  }

  /* Games */
  if (data === 'game_add') {
    sessions[id] = { step: 'game_add_title', data: {} };
    md(id, '🎮 Enter game *title* (e.g. `DUNGEON_RUSH`):'); return;
  }
  if (data.startsWith('game_rm_')) {
    const idx = parseInt(data.slice(8));
    const d = load();
    if (idx < 0 || idx >= d.games.length) return;
    const gone = d.games.splice(idx, 1)[0]; save(d);
    md(id, `✅ Removed *${gone.title}*`); return;
  }
  if (data.startsWith('game_edit_')) {
    const idx = parseInt(data.slice(10));
    const d = load(); const g = d.games[idx];
    if (!g) return;
    sessions[id] = { step: 'game_edit_field', data: { idx } };
    md(id, `✏️ *${g.title}*\n\n• title: \`${g.title}\`\n• desc: ${g.desc}\n• url: ${g.url||'_none_'}\n• plays: ${g.plays}\n• color: ${g.color}\n\nWhich field? (title / desc / url / plays / color)`);
    return;
  }

  /* Project sections */
  if (data.startsWith('sec_')) {
    const key = data.slice(4);
    const d = load(); const sec = d.projects.find(s => s.key === key);
    if (!sec) return;
    const lines = sec.items.length
      ? sec.items.map((p,i) => `*${i+1}.* \`${p.title}\`\n${p.desc}\nbadge: ${p.badge}  url: ${p.url||'_none_'}`).join('\n\n')
      : '_Empty section_';
    md(id, `📂 *${sec.label}* (${sec.items.length} items)\n\n${lines}`, {
      reply_markup: { inline_keyboard: [
        [{ text: `➕ Add to ${sec.label}`, callback_data: `padd_${key}` }],
        ...sec.items.map((_,i) => [
          { text: `✏️ ${i+1}`, callback_data: `pedit_${key}_${i}` },
          { text: `🗑️ ${i+1}`, callback_data: `prm_${key}_${i}`   },
        ]),
        [{ text: '⬅️ Projects', callback_data: 'nav_projects' }],
      ]},
    }); return;
  }

  if (data.startsWith('padd_')) {
    const key = data.slice(5);
    const sec = load().projects.find(s => s.key === key);
    if (!sec) return;
    sessions[id] = { step: 'proj_add_title', data: { section: key } };
    md(id, `💼 *Add to ${sec.label}*\n\nEnter project *title*:`); return;
  }

  if (data.startsWith('prm_')) {
    const parts = data.slice(4).split('_'); // key_idx — but key has no underscore
    const idx = parseInt(parts[parts.length - 1]);
    const key = parts.slice(0, -1).join('_');
    const d = load(); const sec = d.projects.find(s => s.key === key);
    if (!sec || idx < 0 || idx >= sec.items.length) return;
    const gone = sec.items.splice(idx, 1)[0]; save(d);
    md(id, `✅ Removed *${gone.title}*`); return;
  }

  if (data.startsWith('pedit_')) {
    const parts = data.slice(6).split('_');
    const idx = parseInt(parts[parts.length - 1]);
    const key = parts.slice(0, -1).join('_');
    const d = load(); const sec = d.projects.find(s => s.key === key);
    const item = sec?.items[idx];
    if (!item) return;
    sessions[id] = { step: 'proj_edit_field', data: { section: key, idx } };
    md(id, `✏️ *${item.title}*\n\n• title: \`${item.title}\`\n• desc: ${item.desc}\n• url: ${item.url||'_none_'}\n• badge: ${item.badge}\n\nWhich field? (title / desc / url / badge)`);
    return;
  }

  /* About actions */
  if (data === 'about_bio') {
    sessions[id] = { step: 'about_bio', data: {} };
    md(id, '📝 Send the new *bio* text:'); return;
  }
  if (data === 'about_stats') {
    const d = load();
    md(id, `📊 *Current Stats:*\n${d.about.stats.map((s,i)=>`${i+1}. ${s.label}: ${s.val}% ${s.color}`).join('\n')}\n\nSend stats — one per line:\n\`LABEL VAL COLOR\`\nExample:\n\`\`\`\nCODING 85 #00ffff\nDESIGN 72 #ff00ff\n\`\`\``);
    sessions[id] = { step: 'about_stats', data: {} }; return;
  }
  if (data === 'about_inventory') {
    const d = load();
    md(id, `🎒 *Current Inventory:*\n${d.about.inventory.map((x,i)=>`${i+1}. ${x}`).join('\n')}\n\nSend new items — one per line:`);
    sessions[id] = { step: 'about_inventory', data: {} }; return;
  }
});

/* ─── Message handler (session state machine) ───────────────── */
bot.on('message', (msg) => {
  if (msg.from?.id !== OWNER_ID) return;
  if (!msg.text || msg.text.startsWith('/')) return;
  const id   = msg.chat.id;
  const text = msg.text.trim();
  const sess = sessions[id];
  if (!sess) return;

  const done = (reply) => { sessions[id] = null; md(id, reply + '\n\n_Site updates in ~30s._'); };

  /* ── Add game ─────────────────────────────── */
  if (sess.step === 'game_add_title') {
    sess.data.title = text.toUpperCase().replace(/\s+/g,'_');
    sess.step = 'game_add_desc';
    md(id, `✅ Title: \`${sess.data.title}\`\n\nNow the *description*:`); return;
  }
  if (sess.step === 'game_add_desc') {
    sess.data.desc = text; sess.step = 'game_add_url';
    md(id, '✅ Description saved.\n\n*Roblox URL* (or \`-\` to skip):'); return;
  }
  if (sess.step === 'game_add_url') {
    sess.data.url = text === '-' ? '' : text; sess.step = 'game_add_plays';
    md(id, '✅ URL saved.\n\n*Visit count* (e.g. `12.5K` or `-` for unknown):'); return;
  }
  if (sess.step === 'game_add_plays') {
    sess.data.plays = text === '-' ? '—' : text; sess.step = 'game_add_color';
    md(id, `✅ Count saved.\n\n*Accent color* hex (e.g. \`#00ffff\`) or number:\n${COLORS.map((c,i)=>`${i+1}. ${c}`).join('\n')}`); return;
  }
  if (sess.step === 'game_add_color') {
    const n = parseInt(text);
    sess.data.color = (!isNaN(n) && n >= 1 && n <= COLORS.length) ? COLORS[n-1] : (text.startsWith('#') ? text : '#00ffff');
    const d = load(); d.games.push({ id: nextId(d.games), ...sess.data }); save(d);
    done(`✅ *${sess.data.title}* added to games!`); return;
  }

  /* ── Edit game ────────────────────────────── */
  if (sess.step === 'game_edit_field') {
    if (!['title','desc','url','plays','color'].includes(text.toLowerCase())) {
      md(id, '❌ Choose: title / desc / url / plays / color'); return;
    }
    sess.data.field = text.toLowerCase(); sess.step = 'game_edit_value';
    md(id, `✏️ Enter new *${sess.data.field}*:`); return;
  }
  if (sess.step === 'game_edit_value') {
    const d = load(); const g = d.games[sess.data.idx]; if (!g) { sessions[id]=null; return; }
    let val = text;
    if (sess.data.field === 'title') val = text.toUpperCase().replace(/\s+/g,'_');
    if (sess.data.field === 'plays' && text === '-') val = '—';
    g[sess.data.field] = val; save(d);
    done(`✅ *${g.title}* — ${sess.data.field}: \`${val}\``); return;
  }

  /* ── Add project ──────────────────────────── */
  if (sess.step === 'proj_add_title') {
    sess.data.title = text.toUpperCase().replace(/\s+/g,'_');
    sess.step = 'proj_add_desc';
    md(id, `✅ Title: \`${sess.data.title}\`\n\nDescription:`); return;
  }
  if (sess.step === 'proj_add_desc') {
    sess.data.desc = text; sess.step = 'proj_add_url';
    md(id, '✅ Description saved.\n\n*URL* (or \`-\` to skip):'); return;
  }
  if (sess.step === 'proj_add_url') {
    sess.data.url = text === '-' ? '' : text; sess.step = 'proj_add_badge';
    md(id, '✅ URL saved.\n\n*Badge label* (e.g. `VISIT`, `DOWNLOAD`, `GITHUB`, `GET`, `INVITE`):'); return;
  }
  if (sess.step === 'proj_add_badge') {
    sess.data.badge = text.toUpperCase();
    const d = load(); const sec = d.projects.find(s => s.key === sess.data.section);
    if (!sec) { sessions[id]=null; return; }
    sec.items.push({ title: sess.data.title, desc: sess.data.desc, url: sess.data.url, badge: sess.data.badge });
    save(d); done(`✅ *${sess.data.title}* added to ${sec.label}!`); return;
  }

  /* ── Edit project ─────────────────────────── */
  if (sess.step === 'proj_edit_field') {
    if (!['title','desc','url','badge'].includes(text.toLowerCase())) {
      md(id, '❌ Choose: title / desc / url / badge'); return;
    }
    sess.data.field = text.toLowerCase(); sess.step = 'proj_edit_value';
    md(id, `✏️ Enter new *${sess.data.field}*:`); return;
  }
  if (sess.step === 'proj_edit_value') {
    const d = load(); const sec = d.projects.find(s => s.key === sess.data.section);
    const item = sec?.items[sess.data.idx]; if (!item) { sessions[id]=null; return; }
    let val = text;
    if (sess.data.field === 'title') val = text.toUpperCase().replace(/\s+/g,'_');
    if (sess.data.field === 'badge') val = text.toUpperCase();
    item[sess.data.field] = val; save(d);
    done(`✅ ${sess.data.field}: \`${val}\``); return;
  }

  /* ── About bio ────────────────────────────── */
  if (sess.step === 'about_bio') {
    const d = load(); d.about.bio = text; save(d);
    done('✅ Bio updated!'); return;
  }

  /* ── About stats ──────────────────────────── */
  if (sess.step === 'about_stats') {
    try {
      const stats = text.trim().split('\n').map(line => {
        const p = line.trim().split(/\s+/);
        return { label: p[0].toUpperCase(), val: parseInt(p[1]) || 0, color: p[2] || '#00ffff' };
      });
      const d = load(); d.about.stats = stats; save(d);
      done(`✅ Stats updated (${stats.length} entries)!`);
    } catch { md(id, '❌ Format error. Each line: `LABEL VAL COLOR`'); }
    return;
  }

  /* ── About inventory ──────────────────────── */
  if (sess.step === 'about_inventory') {
    const items = text.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const d = load(); d.about.inventory = items; save(d);
    done(`✅ Inventory updated (${items.length} items)!`); return;
  }
});

bot.on('polling_error', (e) => console.error('[bot] polling error:', e.code, e.message));
console.log('[bot] started — polling for updates');
