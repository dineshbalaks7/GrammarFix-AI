import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlignLeft, ArrowDownToLine, ArrowRight, ArrowUpRight, Check, CheckCheck,
  Clock3, Copy, FileText, Menu, MessageCircle, PanelLeftClose, PanelLeftOpen,
  PenLine, Plus, RotateCcw, ShieldCheck, SpellCheck, Sun, Moon, WandSparkles, X
} from 'lucide-react';
import { checkGrammar } from './lib/grammar.js';

const sample = "Yesterday I am going to college and meet my friends. I doesn't like the weather, but we had a really good time together";
const modes = [{ id: 'correct', label: 'Correct', icon: SpellCheck }, { id: 'professional', label: 'Professional', icon: BriefcaseIcon }, { id: 'clear', label: 'Make clear', icon: AlignLeft }];
function BriefcaseIcon(props) { return <FileText {...props}/> }
function Brand({ compact = false }) { return <div className="brand"><div className="brand-mark"><span>G</span><i><Check size={13}/></i></div>{!compact && <span className="brand-name">Grammar<span>Fix</span></span>}</div> }
function formatTimeAgo(value) {
  const elapsed = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
function escapeRegExp(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function highlightPhrases(text, phrases, className) {
  const targets = phrases.filter(Boolean).sort((a, b) => b.length - a.length);
  if (!text || !targets.length) return text;
  const matcher = new RegExp(`(${targets.map(escapeRegExp).join('|')})`, 'gi');
  const parts = [];
  let lastIndex = 0;
  for (const match of text.matchAll(matcher)) {
    parts.push(text.slice(lastIndex, match.index));
    parts.push(<mark className={className} key={`${match.index}-${match[0]}`}>{match[0]}</mark>);
    lastIndex = match.index + match[0].length;
  }
  parts.push(text.slice(lastIndex));
  return parts;
}
function App() {
  const [page, setPage] = useState('workspace');
  const [text, setText] = useState(sample);
  const [mode, setMode] = useState('correct');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [history, setHistory] = useState(() => { try { return JSON.parse(localStorage.getItem('gf-history') || '[]'); } catch { return []; } });
  const [mobileNav, setMobileNav] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('gf-sidebar-collapsed') === 'true');
  const [theme, setTheme] = useState(() => localStorage.getItem('gf-theme') || 'light');
  const textarea = useRef(null);
  const cursorRef = useRef(null);
  const wordCount = useMemo(() => text.trim() ? text.trim().split(/\s+/).length : 0, [text]);
  const charCount = text.length;
  const notify = (message) => { setNotice(message); window.setTimeout(() => setNotice(''), 2400); };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('gf-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('gf-sidebar-collapsed', sidebarCollapsed);
  }, [sidebarCollapsed]);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const handlePointerMove = event => {
      if (event.pointerType !== 'mouse') return;
      cursor.style.transform = `translate3d(${event.clientX - 9}px, ${event.clientY - 9}px, 0)`;
      cursor.style.opacity = '1';
      cursor.classList.toggle('cursor-hover', Boolean(event.target.closest('button, a, textarea')));
    };
    const hideCursor = () => { cursor.style.opacity = '0'; };
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerleave', hideCursor);
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', hideCursor);
    };
  }, []);

  useEffect(() => {
    if (!textarea.current) return;
    textarea.current.style.height = 'auto';
    textarea.current.style.height = `${Math.max(textarea.current.scrollHeight, 190)}px`;
  }, [text]);

  async function runCheck() {
    if (!text.trim()) { notify('Add some text to get started.'); textarea.current?.focus(); return; }
    setBusy(true); setResult(null);
    try {
      const data = await checkGrammar(text, mode);
      setResult({ ...data, originalText: text });
      const entry = { id: Date.now(), original: text, corrected: data.correctedText, date: new Date().toISOString(), mode };
      setHistory(old => { const next = [entry, ...old].slice(0, 30); localStorage.setItem('gf-history', JSON.stringify(next)); return next; });
    } catch (error) { notify(error.message || 'Could not reach the correction service.'); }
    finally { setBusy(false); }
  }
  async function copyResult() { if (!result?.correctedText) return; await navigator.clipboard.writeText(result.correctedText); notify('Corrected text copied.'); }
  function useResult() { if (result?.correctedText) { setText(result.correctedText); setResult(null); notify('Updated your writing area.'); } }
  function downloadResult() { if (!result?.correctedText) return; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([result.correctedText], { type: 'text/plain' })); a.download = 'grammarfix-corrected.txt'; a.click(); URL.revokeObjectURL(a.href); }
  function loadHistory(item) { setText(item.original); setResult({ correctedText: item.corrected, originalText: item.original, issues: [], explanation: 'Loaded from your recent history.' }); setPage('workspace'); setMobileNav(false); }

  return <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="sidebar-top"><Brand/><button className="icon-button close-nav" onClick={() => { if (mobileNav) setMobileNav(false); else setSidebarCollapsed(value => !value); }} aria-label={mobileNav ? 'Close menu' : sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{mobileNav ? <X size={18}/> : sidebarCollapsed ? <PanelLeftOpen size={18}/> : <PanelLeftClose size={18}/>}</button></div>
      <button className="new-doc" onClick={() => { setText(''); setResult(null); setPage('workspace'); setMobileNav(false); }}><Plus size={16}/> New document <span>⌘ N</span></button>
      <div className="nav-label">WORKSPACE</div>
      <nav className="main-nav">
        <button className={page === 'workspace' ? 'active' : ''} onClick={() => { setPage('workspace'); setMobileNav(false); }}><PenLine size={17}/> Writing workspace</button>
      </nav>
      <div className="conversation-section">
        <div className="nav-label">PAST CONVERSATIONS</div>
        {history.length ? <div className="conversation-list">{history.slice(0, 6).map(item => <button className="conversation-item" key={item.id} onClick={() => loadHistory(item)}><span>{item.original.slice(0, 42) || 'Untitled document'}{item.original.length > 42 ? '…' : ''}</span><small>{formatTimeAgo(item.date)}</small></button>)}</div> : <p className="conversation-empty">Your refined writing will appear here.</p>}
      </div>
      <div className="sidebar-bottom">
        <div className="privacy-note"><ShieldCheck size={16}/><div><strong>Your writing stays yours</strong><span>Private by design</span></div></div>
      </div>
    </aside>
    {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation"/>}
    <main className="main-area">
      <header className="topbar"><div className="topbar-left"><button className="icon-button menu-button" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={19}/></button></div><div className="topbar-right"><button className="theme-toggle" onClick={() => setTheme(value => value === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>{theme === 'light' ? <Moon size={15}/> : <Sun size={15}/>}</button><span className="status-dot"/> <span className="saved-label">Ready</span></div></header>
      {page === 'workspace' ? <div className="workspace-page">
        <section className="page-heading"><div><h1>What would you like to improve?</h1><p>Paste your writing below and GrammarFix will refine it while keeping your voice.</p></div></section>
        <div className="workspace-grid">
          <section className="editor-card">
            <div className="card-head"><div className="card-title"><div className="title-icon"><PenLine size={16}/></div><div><h2>Your text</h2><span>Write or paste anything you'd like to improve</span></div></div><button className="subtle-button" onClick={() => { setText(''); setResult(null); textarea.current?.focus(); }}><RotateCcw size={14}/> Clear</button></div>
            <div className="editor-tools"><div className="mode-switch">{modes.map(m => { const Icon = m.icon; return <button key={m.id} className={mode === m.id ? 'selected' : ''} onClick={() => setMode(m.id)}><Icon size={14}/>{m.label}</button>; })}</div></div>
            <div className="textarea-wrap"><textarea ref={textarea} value={text} onChange={e => { setText(e.target.value); setResult(null); }} placeholder="Start writing or paste your text here..." spellCheck="false" aria-label="Text to correct"/><div className="editor-footer"><span>{wordCount} words <i/> {charCount} characters</span><span className="shortcut-hint">⌘ ↵ to fix</span></div></div>
            <div className="editor-actions"><div className="input-note"><ShieldCheck size={14}/> Your text is processed securely</div><button className="primary-button" onClick={runCheck} disabled={busy || !text.trim()}>{busy ? <><span className="spinner"/> Working on it...</> : <><WandSparkles size={16}/> Fix my writing <ArrowRight size={15}/></>}</button></div>
          </section>
        </div>
        {result && <section className="result-card" aria-live="polite"><div className="result-heading"><div className="result-heading-left"><div className="result-check"><CheckCheck size={18}/></div><div><div className="result-kicker">YOUR REFINED TEXT</div><h2>Here is the clearer version.</h2></div></div><div className="result-actions"><button className="subtle-button" onClick={downloadResult}><ArrowDownToLine size={14}/> Export</button><button className="subtle-button" onClick={copyResult}><Copy size={14}/> Copy</button></div></div><div className="result-compare"><div className="comparison-block original-block"><span>Original</span><p>{highlightPhrases(result.originalText || '', result.issues?.map(issue => issue.original) || [], 'original-highlight')}</p></div><div className="comparison-block fixed-block"><span>Fixed</span><p>{highlightPhrases(result.correctedText, result.issues?.map(issue => issue.corrected || issue.suggestion) || [], 'fixed-highlight')}</p></div></div><div className="result-bottom"><div className="result-meta"><span className="success-dot"/> {result.issues?.length ? `${result.issues.length} improvement${result.issues.length === 1 ? '' : 's'} made` : 'No changes needed'} {result.demo && <span className="demo-tag">Preview mode</span>}</div><button className="apply-button" onClick={useResult}>Use this version <ArrowUpRight size={14}/></button></div>{result.explanation && <div className="explanation"><MessageCircle size={15}/><span>{result.explanation}</span></div>}{result.issues?.length > 0 && <div className="issue-list"><div className="issue-list-title">What changed</div>{result.issues.slice(0, 4).map((issue, i) => <div className="issue-item" key={i}><span className="issue-bullet"/><div><strong>{issue.type || 'Suggested improvement'}</strong><p className="issue-change">{issue.original || 'Original wording'} <span>→</span> {issue.corrected || issue.suggestion || 'Improved wording'}</p><p>{issue.explanation || 'This makes the sentence read more naturally.'}</p></div></div>)}</div>}</section>}
        <footer className="page-footer"><span>Made for words that matter.</span><span>GRAMMARFIX <i/> VERSION 1.0</span></footer>
      </div> : <div className="history-page"><div className="history-heading"><div className="eyebrow"><span className="eyebrow-line"/> YOUR WORKSPACE</div><h1>Recent <em>history.</em></h1><p>Pick up where you left off.</p></div>{history.length ? <div className="history-list">{history.map(item => <button className="history-item" key={item.id} onClick={() => loadHistory(item)}><div className="history-file"><FileText size={18}/></div><div className="history-content"><strong>{item.original.slice(0, 76) || 'Untitled document'}{item.original.length > 76 ? '…' : ''}</strong><span>{new Date(item.date).toLocaleString()} · {item.original.trim().split(/\s+/).length} words</span></div><ArrowUpRight size={17}/></button>)}</div> : <div className="empty-history"><div className="empty-icon"><Clock3 size={22}/></div><h3>Your next great sentence starts here.</h3><p>Text you refine will appear here so you can revisit it anytime.</p><button className="primary-button" onClick={() => setPage('workspace')}>Start writing <ArrowRight size={15}/></button></div>}</div>}
    </main>
    {notice && <div className="toast"><Check size={15}/>{notice}</div>}
    <div ref={cursorRef} className="cursor-orbit" aria-hidden="true" />
  </div>;
}
export default App;
