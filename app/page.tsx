'use client';

import { useEffect, useMemo, useState } from 'react';

type Quote = { id: number; quote: string; author: string; category: string; explanation: string; action: string; image: string; tone: string };

const quotes: Quote[] = [
  { id: 1, quote: '가격은 당신이 지불하는 것이고,\n가치는 당신이 얻는 것이다.', author: '워런 버핏', category: '가치투자', explanation: '싼 가격만 좇기보다, 내가 지불한 돈보다 더 큰 가치를 얻는지 살펴보라는 뜻이에요.', action: '관심 있는 투자 대상 하나의 가격과 가치를 따로 적어보세요.', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85', tone: 'sunset' },
  { id: 2, quote: '투자에서 가장 중요한 자질은\n지성이 아니라 기질이다.', author: '워런 버핏', category: '투자심리', explanation: '시장의 소음에 흔들리지 않고 세운 원칙을 지키는 태도가 지식만큼 중요하다는 뜻이에요.', action: '가격이 크게 움직일 때 지킬 나만의 원칙 한 줄을 적어보세요.', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85', tone: 'mountain' },
  { id: 3, quote: '작은 지출을 조심하라.\n작은 구멍이 큰 배를 가라앉힌다.', author: '벤저민 프랭클린', category: '절약', explanation: '별것 아닌 듯 반복되는 소비가 장기적으로 큰돈이 될 수 있다는 조언이에요.', action: '이번 달 자동결제 목록에서 가장 덜 쓰는 항목 하나를 찾아보세요.', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=85', tone: 'forest' },
  { id: 4, quote: '부자가 되는 길은\n내일 할 일을 오늘 하고,\n오늘 먹을 것을 내일 먹는 것이다.', author: '벤저민 프랭클린', category: '장기투자', explanation: '해야 할 일은 미루지 않고, 당장의 소비는 조금 늦추는 습관이 자산을 만든다는 의미예요.', action: '오늘 쓰려던 금액 중 1만 원을 투자 계좌로 옮겨보세요.', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85', tone: 'desert' },
];
const categories = ['전체', '가치투자', '투자심리', '절약', '장기투자'];

export default function Home() {
  const [view, setView] = useState<'home' | 'explore' | 'saved'>('home');
  const [index, setIndex] = useState(0);
  const [category, setCategory] = useState('전체');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    try { const saved = JSON.parse(localStorage.getItem('moneyQuote_favorites') || '[]'); setFavorites(Array.isArray(saved) ? saved : []); } catch { setFavorites([]); }
    const today = new Date();
    const localDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    setIndex(Math.floor(localDay / 86400000) % quotes.length);
  }, []);

  const current = quotes[index];
  const filtered = useMemo(() => category === '전체' ? quotes : quotes.filter(q => q.category === category), [category]);
  const savedQuotes = quotes.filter(q => favorites.includes(q.id));
  function flash(message: string) { setToast(message); window.setTimeout(() => setToast(''), 1800); }
  function toggleFavorite(id = current.id) { const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id]; setFavorites(next); localStorage.setItem('moneyQuote_favorites', JSON.stringify(next)); flash(next.includes(id) ? '명언을 저장했어요' : '저장을 해제했어요'); }
  async function shareQuote() { const text = `“${current.quote.replace('\n', ' ')}” — ${current.author}`; try { if (navigator.share) await navigator.share({ title: '오늘의 머니 문장', text }); else { await navigator.clipboard.writeText(text); flash('명언을 복사했어요'); } } catch { /* share cancelled */ } }
  function openQuote(id: number) { setIndex(quotes.findIndex(q => q.id === id)); setView('home'); }

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <section className="phone-frame" aria-label="머니 문장 앱">
        <header className="topbar"><div><p className="eyebrow">MONEY QUOTE</p><h1>{view === 'home' ? '오늘의 머니 문장' : view === 'explore' ? '명언 탐색' : '저장한 문장'}</h1></div><button className="avatar" aria-label="프로필">M</button></header>
        {view === 'home' && <div className="home-view">
          <article className={`quote-card ${current.tone}`} style={{ backgroundImage: `url(${current.image})` }}>
            <div className="card-topline"><span>{current.category}</span><span>{String(index + 1).padStart(2, '0')} / {String(quotes.length).padStart(2, '0')}</span></div>
            <div className="quote-content"><p className="quote-mark">“</p><blockquote>{current.quote.split('\n').map((line, i) => <span key={i}>{line}</span>)}</blockquote><p className="author">— {current.author}</p></div>
            <div className="card-actions"><button onClick={() => setIndex((index - 1 + quotes.length) % quotes.length)} aria-label="이전 명언">←</button><div><button className={favorites.includes(current.id) ? 'active' : ''} onClick={() => toggleFavorite()} aria-label="즐겨찾기">{favorites.includes(current.id) ? '♥' : '♡'}</button><button onClick={shareQuote} aria-label="공유">↗</button></div><button onClick={() => setIndex((index + 1) % quotes.length)} aria-label="다음 명언">→</button></div>
          </article>
          <section className="insight-card"><div><span className="section-icon">01</span><div><h2>쉬운 해설</h2><p>{current.explanation}</p></div></div><div className="divider" /><div><span className="section-icon accent">02</span><div><h2>오늘의 실천</h2><p>{current.action}</p></div></div></section>
        </div>}
        {view === 'explore' && <div className="list-view"><div className="chips">{categories.map(item => <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="quote-list">{filtered.map(q => <button key={q.id} className="mini-card" onClick={() => openQuote(q.id)} style={{ backgroundImage: `url(${q.image})` }}><span>{q.category}</span><strong>{q.quote.replace('\n', ' ')}</strong><small>{q.author}</small></button>)}</div></div>}
        {view === 'saved' && <div className="list-view saved-view">{savedQuotes.length ? <div className="quote-list">{savedQuotes.map(q => <button key={q.id} className="saved-row" onClick={() => openQuote(q.id)}><span className="saved-number">{String(q.id).padStart(2, '0')}</span><span><strong>{q.quote.replace('\n', ' ')}</strong><small>{q.author} · {q.category}</small></span><i>→</i></button>)}</div> : <div className="empty"><span>♡</span><h2>아직 저장한 문장이 없어요</h2><p>마음에 드는 문장의 하트를 눌러<br />나만의 명언록을 만들어보세요.</p><button onClick={() => setView('home')}>오늘의 문장 보기</button></div>}</div>}
        <nav className="bottom-nav" aria-label="주 메뉴"><button className={view === 'home' ? 'current' : ''} onClick={() => setView('home')}><span>⌂</span>홈</button><button className={view === 'explore' ? 'current' : ''} onClick={() => setView('explore')}><span>⌕</span>탐색</button><button className={view === 'saved' ? 'current' : ''} onClick={() => setView('saved')}><span>♡</span>저장</button></nav>
        {toast && <div className="toast" role="status">{toast}</div>}
      </section>
    </main>
  );
}
