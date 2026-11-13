import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import Icon from './Icon.jsx';

/** @file Shared graph, array, matching, and source-code visualizations. */
/** @summary Draws the graph at the current trace step, including visited nodes and weighted edges. */
function AlgorithmGraph({ algorithm, nodeCount, edges, trace, step, t }) {
  const frame = trace[Math.min(step, trace.length - 1)] || { visited: [], parent: [], distance: [], current: null, activeEdge: null };
  const reached = new Set(frame.visited);
  const visibleDistances = frame.distance;
  const treeEdges = new Set();
  frame.parent.forEach((parent, node) => { if (parent !== null && parent !== undefined) treeEdges.add(`${Math.min(node, parent)}-${Math.max(node, parent)}`); });
  // A circular layout keeps edge crossings and labels legible as the graph changes size.
  const points = Array.from({ length: nodeCount }, (_, i) => {
    const angle = (Math.PI * 2 * i) / nodeCount - Math.PI / 2;
    return { x: 250 + Math.cos(angle) * 178, y: 174 + Math.sin(angle) * 130, i };
  });
  const getDistance = (n) => visibleDistances[n] === Infinity ? '∞' : visibleDistances[n];
  return <div class="graph-wrap">
    <div class="graph-float graph-float-top"><span class="live-pulse" /> {t('graph')} <span class="graph-dot">·</span> {algorithm === 'dijkstra' ? 'Dijkstra' : algorithm.toUpperCase()}</div>
    <div class="graph-float graph-float-stat"><span class="stat-caption">{t('step')}</span><strong>{step}<small> / {Math.max(0, trace.length - 1)}</small></strong></div>
    <svg class="graph-svg" viewBox="0 0 500 350" role="img" aria-label={`${t('graph')} · ${nodeCount} ${t('nodes')} · ${edges.length} ${t('edges')}`}>
      <defs>
        <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="path-grad"><stop stopColor="var(--accent)"/><stop offset="1" stopColor="var(--accent-2)"/></linearGradient>
      </defs>
      <circle cx="250" cy="174" r="156" fill="none" stroke="rgba(255,255,255,.035)" strokeDasharray="3 8" />
      {edges.map((edge, index) => {
        const a = points[edge.a], b = points[edge.b], key = `${Math.min(edge.a, edge.b)}-${Math.max(edge.a, edge.b)}`;
        const active = treeEdges.has(key), currentEdge = frame.activeEdge !== null && frame.current !== null && key === `${Math.min(frame.current, frame.activeEdge)}-${Math.max(frame.current, frame.activeEdge)}`, frontier = reached.has(edge.a) || reached.has(edge.b);
        return <g key={`${edge.a}-${edge.b}`} class={`edge ${active ? 'edge-active' : frontier ? 'edge-frontier' : ''} ${currentEdge ? 'edge-current' : ''}`}>
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
          <g class="weight-pill"><rect x={(a.x + b.x) / 2 - 14} y={(a.y + b.y) / 2 - 10} width="28" height="20" rx="7"/><text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 + 3.5}>{edge.weight}</text></g>
        </g>;
      })}
      {points.map((point) => {
        const visited = reached.has(point.i), current = frame.current === point.i;
        return <g key={point.i} class={`node ${visited ? 'node-visited' : ''} ${current ? 'node-current' : ''} ${point.i === 0 ? 'node-start' : ''}`} transform={`translate(${point.x} ${point.y})`}>
          {current && <circle class="node-ripple" r="28" />}
          <circle class="node-halo" r="24" />
          <circle class="node-core" r="19" />
          <text class="node-label" y="1">{String.fromCharCode(65 + point.i)}</text>
          <text class="node-distance" y="36">{algorithm === 'dijkstra' ? getDistance(point.i) : visited ? '✓' : '·'}</text>
        </g>;
      })}
      <g class="start-label" transform={`translate(${points[0].x} ${points[0].y - 36})`}><rect x="-26" y="-10" width="52" height="18" rx="7"/><text y="2">{t('start')}</text></g>
    </svg>
    <div class="graph-legend">
      <span><i class="legend-swatch legend-path" />{t('legendPath')}</span>
      <span><i class="legend-swatch legend-frontier" />{t('legendFrontier')}</span>
      <span><i class="legend-swatch legend-idle" />{t('legendIdle')}</span>
    </div>
  </div>;
}

/** @summary Displays array values as bars and marks the values active in this trace step. */
function SortingStage({ trace, step, algorithm, t }) {
  const frame = trace[Math.min(step, trace.length - 1)];
  const max = Math.max(...frame.values);
  const sortedResult = ['bubble', 'insertion', 'selection', 'merge', 'quick', 'timsort'].includes(algorithm) && step === trace.length - 1;
  const selectedResult = algorithm === 'quickselect' && step === trace.length - 1;
  return <div class="sort-stage">
    <div class="sort-floating"><span class="live-pulse" /> {frame.target !== undefined ? `${t('target')}: ${frame.target}` : t('arrayLabel')} <span class="sort-caption">{frame.target !== undefined ? (frame.found ? t('found') : `${t('step')} ${step} / ${trace.length - 1}`) : step === trace.length - 1 ? t('complete') : `${t('step')} ${step} / ${trace.length - 1}`}</span></div>
    <div class="bars" role="img" aria-label={t('sortVisual')}>
      {frame.values.map((value, index) => <div class={`bar-col ${frame.active.includes(index) ? 'bar-active' : ''} ${sortedResult ? 'bar-sorted' : ''} ${selectedResult && frame.active.includes(index) ? 'bar-found' : ''}`} key={index}>
        <span class="bar-value">{value}</span><div class="bar" style={{ height: `${Math.max(8, (value / max) * 82)}%`, animationDelay: `${index * 25}ms` }} /><small>{index}</small>
      </div>)}
    </div>
    <div class="sort-floor" />
    <div class="sort-foot"><span class="sort-indicator"><i class="legend-swatch legend-frontier" /> {t('comparePair')}</span><span>{sortedResult ? t('sortComplete') : step === trace.length - 1 ? t('complete') : t('sortHint')}</span></div>
  </div>;
}

/** @summary Displays assignment or stable-matching pairs and their current costs. */
function MatchingStage({ trace, step, algorithm, t }) {
  const frame = trace[Math.min(step, trace.length - 1)];
  const n = frame.cost.length, pairs = new Set(frame.matchPairs.map(([left, right]) => `${left}-${right - n}`));
  // Spreads both matching groups evenly down the same vertical range.
  const y = (index) => 48 + index * (324 / Math.max(1, n - 1));
  return <div class="matching-stage">
    <div class="matching-caption"><span class="live-pulse" />{algorithm === 'hungarian' ? t('assignment') : t('stablePairing')}<span>{t('step')} {step} / {trace.length - 1}</span></div>
    <svg class="matching-svg" viewBox="0 0 600 430" role="img" aria-label={t('matchingAria')}>
      <text class="matching-side-label" x="105" y="24">{t('groupA')}</text><text class="matching-side-label" x="495" y="24">{t('groupB')}</text>
      {frame.cost.map((row, left) => row.map((weight, right) => {
        const key = `${left}-${right}`, active = frame.activePair?.[0] === left && frame.activePair?.[1] === n + right, matched = pairs.has(key);
        return <g key={key} class={`matching-link ${matched ? 'matching-link-active' : ''} ${active ? 'matching-link-current' : ''}`}><line x1="126" y1={y(left)} x2="474" y2={y(right)} /><rect x="287" y={(y(left) + y(right)) / 2 - 10} width="26" height="20" rx="6" /><text x="300" y={(y(left) + y(right)) / 2 + 3.5}>{weight}</text></g>;
      }))}
      {Array.from({ length: n }, (_, i) => <g key={`a-${i}`} class={`matching-node ${frame.activePair?.[0] === i ? 'matching-node-current' : ''}`} transform={`translate(100 ${y(i)})`}><circle r="20" /><text y="1">{String.fromCharCode(65 + i)}</text></g>)}
      {Array.from({ length: n }, (_, i) => <g key={`b-${i}`} class={`matching-node matching-node-b ${frame.activePair?.[1] === n + i ? 'matching-node-current' : ''}`} transform={`translate(500 ${y(i)})`}><circle r="20" /><text y="1">{i + 1}</text></g>)}
    </svg>
    <div class="matching-legend"><span><i class="matching-dot matching-dot-active" />{t('matched')}</span><span><i class="matching-dot matching-dot-current" />{t('considered')}</span><span>{t('costShown')}</span></div>
  </div>;
}

const RESERVED_WORDS = new Set('if else elif for foreach while return def fn func function class public private static const let var yield from import in of true false new break continue mut package use namespace using struct enum match loop where async await do switch case try catch throw yieldfrom pass and or not None True False'.split(' '));
const TYPE_WORDS = new Set('int int32 int64 float double bool boolean str string String char byte long short void dynamic List Map Vector vector Vec HashMap HashSet Queue Stack Deque PriorityQueue Graph Edge Object any'.split(' '));
/** @summary Escapes code text before inserting syntax-highlighted spans into the page. */
function escapeCodeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
/** @summary Wraps code tokens in CSS classes for keywords, types, functions, and literals. */
function highlightCodeLine(line) {
  const tokens = line.match(/\/\/.*$|#.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b[\w$]+\b|\s+|./g) || [];
  return tokens.map((token, index) => {
    if (/^\s+$/.test(token)) return escapeCodeHtml(token);
    let kind = '';
    if (token.startsWith('//') || token.startsWith('#')) kind = 'syntax-comment';
    else if (token.startsWith('"') || token.startsWith("'")) kind = 'syntax-string';
    else if (/^\d/.test(token)) kind = 'syntax-number';
    else if (TYPE_WORDS.has(token)) kind = 'syntax-type';
    else if (RESERVED_WORDS.has(token)) kind = 'syntax-keyword';
    else if (/^[\w$]+$/.test(token) && tokens.slice(index + 1).find((next) => next.trim()) === '(') kind = 'syntax-function';
    else if (/^[=+*/%<>!&|?:-]+$/.test(token)) kind = 'syntax-operator';
    const escaped = escapeCodeHtml(token);
    return kind ? `<span class="${kind}">${escaped}</span>` : escaped;
  }).join('');
}

/** @summary Renders the selected code sample, highlights its active line, and shows execution status. */
function CodePanel({ algorithm, algorithmTitle, languageName, codeLines, trace, step, maxStep, t, isRTL }) {
  const lines = codeLines;
  const targetLine = trace[Math.min(step, trace.length - 1)]?.line ?? 0;
  const activeLineRef = useRef(null);
  useEffect(() => { activeLineRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [targetLine, step]);
  return <section class="panel code-panel">
    <div class="panel-heading code-heading">
      <div class="heading-icon code-icon"><Icon name="code" size={17} /></div>
      <div class="panel-title-group code-title-group" dir={isRTL ? 'rtl' : 'ltr'}><h2>{t('code')}</h2><span class="panel-caption">{algorithm === 'dijkstra' ? 'Dijkstra · shortest path' : algorithmTitle}</span></div>
      <span class="code-lang-chip"><i />{languageName}</span>
    </div>
    <div class="code-body" dir="ltr">
      <div class="code-scroll">
        {lines.map((line, i) => {
          const active = i === targetLine;
          const html = highlightCodeLine(line);
          return <div ref={active ? activeLineRef : null} class={`code-line ${active ? 'line-active' : ''}`} key={`${i}-${line}`}><span class="line-num">{String(i + 1).padStart(2, '0')}</span><code dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} /></div>;
        })}
      </div>
      <div class="code-legend" dir={isRTL ? 'rtl' : 'ltr'}><span><i class="legend-keyword" />{t('keywordLegend')}</span><span><i class="legend-function" />{t('functionLegend')}</span><span><i class="legend-type" />{t('typeLegend')}</span><span><i class="legend-string" />{t('stringLegend')}</span></div>
      <div class="code-status"><span class="status-indicator"><i />{step >= maxStep ? t('finished') : t('running')}</span><span>{t('step')} {step} <b>/</b> {maxStep}</span></div>
    </div>
  </section>;
}

export { AlgorithmGraph, SortingStage, MatchingStage, CodePanel };
