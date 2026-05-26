import { useState, useEffect } from 'react';

/* ── Types ─────────────────────────────────────────────────── */
export type Stat = { label: string; val: number; color: string };
export type Game = { id: number; title: string; desc: string; plays: string; color: string; url: string };
export type ProjectItem = { title: string; desc: string; badge: string; url: string };
export type ProjectSection = { key: string; label: string; tag: string; color: string; items: ProjectItem[] };

export type Content = {
  about: { bio: string; stats: Stat[]; inventory: string[] };
  games: Game[];
  projects: ProjectSection[];
};

/* ── Default content (shown before API responds / if API fails) */
export const DEFAULT_CONTENT: Content = {
  about: {
    bio: `> id        : ink\n> class     : coder / artist / gamer\n> status    : perpetually online\n> location  : internet\n\n  i build cool stuff. rhythm games are\n  my lifeblood. i love creating worlds,\n  writing code, and drawing characters\n  that live inside my head.`,
    stats: [
      { label: 'CODING', val: 85, color: '#00ffff' },
      { label: 'RHYTHM', val: 99, color: '#ff00ff' },
      { label: 'ART',    val: 60, color: '#ffff00' },
      { label: 'SLEEP',  val: 12, color: '#ff4444' },
    ],
    inventory: ['Mechanical Keyboard', 'Wacom Tablet', 'Too much coffee', 'Cat  (Mythical Rarity)'],
  },
  games: [
    { id: 1, title: 'GAME_01', desc: 'roblox game — add your description here.', plays: '—', color: '#00ffff', url: 'https://www.roblox.com/share?code=8af0c4416bad5b49b466339afd919695&type=ExperienceDetails&stamp=1779766307952' },
    { id: 2, title: 'GAME_02', desc: 'roblox game — add your description here.', plays: '—', color: '#ff00ff', url: 'https://www.roblox.com/share?code=52ccbf7e27d05f49bc986e19db7f86d2&type=ExperienceDetails&stamp=1779766256461' },
    { id: 3, title: 'GAME_03', desc: 'your roblox game description here.', plays: '—', color: '#aaff00', url: '' },
    { id: 4, title: 'GAME_04', desc: 'your roblox game description here.', plays: '—', color: '#ff6600', url: '' },
  ],
  projects: [
    { key: 'apps',   label: 'APPS',   tag: '.EXE / SOFTWARE',    color: '#00ffff', items: [
      { title: 'APP_01',  desc: 'your app description.',           badge: 'DOWNLOAD', url: '' },
      { title: 'APP_02',  desc: 'your app description.',           badge: 'DOWNLOAD', url: '' },
    ]},
    { key: 'github', label: 'GITHUB', tag: 'OPEN SOURCE',         color: '#aaff00', items: [
      { title: 'REPO_01', desc: 'your repo description.',          badge: 'GITHUB',   url: '' },
      { title: 'REPO_02', desc: 'your repo description.',          badge: 'GITHUB',   url: '' },
    ]},
    { key: 'sites',  label: 'SITES',  tag: 'WEB',                 color: '#ff00ff', items: [
      { title: 'UNCASING.SBS',  desc: 'visit uncasing.sbs',  badge: 'VISIT', url: 'https://uncasing.sbs'  },
      { title: 'BAITED.ONLINE', desc: 'visit baited.online', badge: 'VISIT', url: 'https://baited.online' },
    ]},
    { key: 'bots',   label: 'BOTS',   tag: 'DISCORD / TELEGRAM',  color: '#7b68ee', items: [
      { title: 'BOT_01',  desc: 'discord or telegram bot.',        badge: 'INVITE',   url: '' },
      { title: 'BOT_02',  desc: 'discord or telegram bot.',        badge: 'INVITE',   url: '' },
    ]},
    { key: 'tools',  label: 'TOOLS',  tag: '.PY / .BAT / SCRIPTS', color: '#ff9944', items: [
      { title: 'TOOL_01', desc: 'python, bat, or utility script.', badge: 'GET',      url: '' },
      { title: 'TOOL_02', desc: 'python, bat, or utility script.', badge: 'GET',      url: '' },
    ]},
  ],
};

/* ── Hook ───────────────────────────────────────────────────── */
export const useContent = (): Content => {
  const [content, setContent] = useState<Content>(DEFAULT_CONTENT);

  useEffect(() => {
    const load = () => {
      fetch('/api/content')
        .then(r => (r.ok ? r.json() : null))
        .then((data: Content | null) => { if (data) setContent(data); })
        .catch(() => {}); // silently fall back to defaults
    };
    load();                                    // initial fetch
    const timer = setInterval(load, 30_000);   // poll every 30 s
    return () => clearInterval(timer);
  }, []);

  return content;
};
