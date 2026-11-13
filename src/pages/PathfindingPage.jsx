import { h } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import Icon from '../components/Icon.jsx';

/** @file Interactive grid pathfinding lab and its localized labels. */
const PATH_COPY = {
  he: { title: 'מעבדת מציאת נתיבים', subtitle: 'ציירו מכשולים, בחרו אלגוריתם וצפו בדרך אל היעד.', choose: 'אלגוריתם', run: 'מציאת מסלול', pause: 'השהיה', resume: 'המשך', resetRun: 'אתחול אנימציה', clear: 'ניקוי לוח', random: 'קירות אקראיים', start: 'התחלה', finish: 'יעד', wall: 'קיר', open: 'פתוח', visited: 'נבדקו', path: 'אורך מסלול', found: 'נמצא מסלול', noPath: 'לא נמצא מסלול', ready: 'מוכנים להרצה', dragHint: 'גררו על הלוח כדי לצייר קירות. אפשר גם לגרור את ההתחלה והיעד.', legend: 'מקרא', speed: 'מהירות אנימציה', resetBoard: 'איפוס מלא', dijkstra: 'דייקסטרה', astar: 'A*', bfs: 'חיפוש לרוחב', dfs: 'חיפוש לעומק' },
  en: { title: 'Pathfinding lab', subtitle: 'Draw obstacles, choose an algorithm, and watch it find a route.', choose: 'Algorithm', run: 'Find a path', pause: 'Pause', resume: 'Resume', resetRun: 'Reset animation', clear: 'Clear board', random: 'Random walls', start: 'Start', finish: 'Finish', wall: 'Wall', open: 'Open', visited: 'Visited', path: 'Path length', found: 'Path found', noPath: 'No path found', ready: 'Ready to run', dragHint: 'Drag across the grid to draw walls. You can also drag the start and finish.', legend: 'Legend', speed: 'Animation speed', resetBoard: 'Reset board', dijkstra: 'Dijkstra', astar: 'A* search', bfs: 'Breadth-first search', dfs: 'Depth-first search' },
  es: { title: 'Laboratorio de rutas', subtitle: 'Dibuja obstáculos, elige un algoritmo y observa cómo encuentra el camino.', choose: 'Algoritmo', run: 'Buscar ruta', pause: 'Pausar', resume: 'Continuar', resetRun: 'Reiniciar animación', clear: 'Limpiar tablero', random: 'Muros aleatorios', start: 'Inicio', finish: 'Destino', wall: 'Muro', open: 'Libre', visited: 'Visitados', path: 'Longitud de ruta', found: 'Ruta encontrada', noPath: 'No hay ruta', ready: 'Listo', dragHint: 'Arrastra por la cuadrícula para dibujar muros. También puedes mover el inicio y el destino.', legend: 'Leyenda', speed: 'Velocidad', resetBoard: 'Reiniciar tablero', dijkstra: 'Dijkstra', astar: 'Búsqueda A*', bfs: 'Búsqueda en anchura', dfs: 'Búsqueda en profundidad' },
  fr: { title: 'Laboratoire de chemins', subtitle: 'Dessinez des obstacles, choisissez un algorithme et observez la recherche.', choose: 'Algorithme', run: 'Trouver un chemin', pause: 'Pause', resume: 'Reprendre', resetRun: 'Réinitialiser l’animation', clear: 'Effacer la grille', random: 'Murs aléatoires', start: 'Départ', finish: 'Arrivée', wall: 'Mur', open: 'Libre', visited: 'Visités', path: 'Longueur du chemin', found: 'Chemin trouvé', noPath: 'Aucun chemin', ready: 'Prêt', dragHint: 'Faites glisser sur la grille pour dessiner des murs. Déplacez aussi le départ et l’arrivée.', legend: 'Légende', speed: 'Vitesse', resetBoard: 'Réinitialiser la grille', dijkstra: 'Dijkstra', astar: 'Recherche A*', bfs: 'Parcours en largeur', dfs: 'Parcours en profondeur' },
  de: { title: 'Pfadsuche-Labor', subtitle: 'Zeichne Hindernisse, wähle einen Algorithmus und beobachte die Suche.', choose: 'Algorithmus', run: 'Pfad suchen', pause: 'Pause', resume: 'Weiter', resetRun: 'Animation zurücksetzen', clear: 'Spielfeld leeren', random: 'Zufällige Wände', start: 'Start', finish: 'Ziel', wall: 'Wand', open: 'Frei', visited: 'Besucht', path: 'Pfadlänge', found: 'Pfad gefunden', noPath: 'Kein Pfad gefunden', ready: 'Bereit', dragHint: 'Ziehe über das Raster, um Wände zu setzen. Start und Ziel lassen sich ebenfalls ziehen.', legend: 'Legende', speed: 'Animationsgeschwindigkeit', resetBoard: 'Spielfeld zurücksetzen', dijkstra: 'Dijkstra', astar: 'A*-Suche', bfs: 'Breitensuche', dfs: 'Tiefensuche' },
  ar: { title: 'مختبر إيجاد المسارات', subtitle: 'ارسم العوائق واختر خوارزمية وشاهدها تبحث عن الطريق.', choose: 'الخوارزمية', run: 'ابحث عن مسار', pause: 'إيقاف مؤقت', resume: 'متابعة', resetRun: 'إعادة الحركة', clear: 'مسح اللوحة', random: 'عوائق عشوائية', start: 'البداية', finish: 'الهدف', wall: 'جدار', open: 'مفتوح', visited: 'تمت زيارتها', path: 'طول المسار', found: 'تم العثور على مسار', noPath: 'لا يوجد مسار', ready: 'جاهز', dragHint: 'اسحب على الشبكة لرسم الجدران. يمكنك تحريك البداية والهدف أيضًا.', legend: 'المفتاح', speed: 'سرعة الحركة', resetBoard: 'إعادة ضبط اللوحة', dijkstra: 'ديكسترا', astar: 'بحث A*', bfs: 'البحث بالعرض', dfs: 'البحث بالعمق' },
};
Object.assign(PATH_COPY.he, { back: 'חזרה למעבדה', running: 'האלגוריתם רץ' });
Object.assign(PATH_COPY.en, { back: 'Back to lab', running: 'Algorithm running' });
Object.assign(PATH_COPY.es, { back: 'Volver al laboratorio', running: 'Algoritmo en ejecución' });
Object.assign(PATH_COPY.fr, { back: 'Retour au labo', running: 'Algorithme en cours' });
Object.assign(PATH_COPY.de, { back: 'Zurück zum Labor', running: 'Algorithmus läuft' });
Object.assign(PATH_COPY.ar, { back: 'العودة إلى المختبر', running: 'الخوارزمية قيد التشغيل' });
Object.assign(PATH_COPY.he, { complexity: 'סיבוכיות זמן', cells: 'צמתים פתוחים', connections: 'קשתות', time: 'זמן חישוב עד היעד' });
Object.assign(PATH_COPY.en, { complexity: 'Time complexity', cells: 'Open cells', connections: 'Edges', time: 'Compute time to goal' });
Object.assign(PATH_COPY.es, { complexity: 'Complejidad temporal', cells: 'Celdas libres', connections: 'Conexiones', time: 'Tiempo hasta el objetivo' });
Object.assign(PATH_COPY.fr, { complexity: 'Complexité temporelle', cells: 'Cellules libres', connections: 'Arêtes', time: 'Temps jusqu’à la cible' });
Object.assign(PATH_COPY.de, { complexity: 'Zeitkomplexität', cells: 'Freie Zellen', connections: 'Kanten', time: 'Zeit bis zum Ziel' });
Object.assign(PATH_COPY.ar, { complexity: 'التعقيد الزمني', cells: 'الخلايا المفتوحة', connections: 'الحواف', time: 'الوقت حتى الهدف' });
Object.assign(PATH_COPY.he, { autoPlay: 'Auto-Play', workspaceLabel: 'סביבת עבודה למציאת נתיבים' });
Object.assign(PATH_COPY.en, { autoPlay: 'Auto-Play', workspaceLabel: 'Pathfinding workspace' });
Object.assign(PATH_COPY.es, { autoPlay: 'Auto-Play', workspaceLabel: 'Espacio de búsqueda de rutas' });
Object.assign(PATH_COPY.fr, { autoPlay: 'Auto-Play', workspaceLabel: 'Espace de recherche de chemin' });
Object.assign(PATH_COPY.de, { autoPlay: 'Auto-Play', workspaceLabel: 'Arbeitsbereich für Pfadsuche' });
Object.assign(PATH_COPY.ar, { autoPlay: 'Auto-Play', workspaceLabel: 'مساحة البحث عن المسارات' });

const PATH_COMPLEXITY = {
  dijkstra: 'O((V + E) log V)', astar: 'O((V + E) log V)',
  bfs: 'O(V + E)', dfs: 'O(V + E)',
};

/** @summary Chooses a pathfinding grid size that fits the current viewport. */
function getPathDimensions() {
  const width = typeof window === 'undefined' ? 1100 : window.innerWidth;
  // Keep cells readable, then size rows to match the board's target aspect ratio.
  const cols = Math.max(14, Math.min(32, Math.floor((width - 100) / 31)));
  return { cols, rows: Math.max(8, Math.min(18, Math.round(cols * .52))) };
}
/** @summary Returns the valid orthogonal neighbors of a cell in the grid. */
function getPathNeighbors(id, cols, rows) {
  const row = Math.floor(id / cols), col = id % cols, neighbors = [];
  if (row > 0) neighbors.push(id - cols);
  if (col + 1 < cols) neighbors.push(id + 1);
  if (row + 1 < rows) neighbors.push(id + cols);
  if (col > 0) neighbors.push(id - 1);
  return neighbors;
}
/** @summary Inserts a distance-and-cell pair into the min-heap used by weighted path searches. */
function pathHeapPush(heap, item) {
  heap.push(item);
  let index = heap.length - 1;
  while (index > 0) {
    const parent = Math.floor((index - 1) / 2);
    if (heap[parent].priority < item.priority || (heap[parent].priority === item.priority && heap[parent].id <= item.id)) break;
    heap[index] = heap[parent]; index = parent;
  }
  heap[index] = item;
}
/** @summary Removes and returns the smallest-distance entry from a pathfinding min-heap. */
function pathHeapPop(heap) {
  if (!heap.length) return null;
  const first = heap[0], last = heap.pop();
  if (heap.length) {
    let index = 0;
    while (true) {
      const left = index * 2 + 1, right = left + 1;
      if (left >= heap.length) break;
      let child = left;
      // Cell id breaks equal-priority ties consistently, which keeps the animation stable.
      const less = (a, b) => a.priority < b.priority || (a.priority === b.priority && a.id < b.id);
      if (right < heap.length && less(heap[right], heap[left])) child = right;
      if (less(last, heap[child]) || (last.priority === heap[child].priority && last.id === heap[child].id)) break;
      heap[index] = heap[child]; index = child;
    }
    heap[index] = last;
  }
  return first;
}
/** @summary Searches the grid and returns the visited order, final route, and search runtime. */
function findPathTrace(cols, rows, walls, start, finish, algorithm) {
  // Stop the clock as soon as the target is removed from the search frontier.
  const startedAt = performance.now();
  let completedAt = null;
  const total = cols * rows, distance = Array(total).fill(Infinity), parent = Array(total).fill(-1), visited = [], closed = new Set();
  // Manhattan distance is admissible here because each move costs one and only moves orthogonally.
  const heuristic = (id) => Math.abs(Math.floor(id / cols) - Math.floor(finish / cols)) + Math.abs((id % cols) - (finish % cols));
  distance[start] = 0;
  if (algorithm === 'dijkstra' || algorithm === 'astar') {
    const open = [];
    pathHeapPush(open, { id: start, cost: 0, priority: algorithm === 'astar' ? heuristic(start) : 0 });
    while (open.length) {
      const item = pathHeapPop(open), current = item.id;
      if (item.cost !== distance[current] || closed.has(current)) continue;
      closed.add(current); visited.push(current);
      if (current === finish) { completedAt = performance.now(); break; }
      for (const next of getPathNeighbors(current, cols, rows)) {
        if (walls.has(next) || closed.has(next)) continue;
        const candidate = distance[current] + 1;
        if (candidate < distance[next]) {
          distance[next] = candidate; parent[next] = current;
          pathHeapPush(open, { id: next, cost: candidate, priority: candidate + (algorithm === 'astar' ? heuristic(next) : 0) });
        }
      }
    }
  } else if (algorithm === 'bfs') {
    const queue = [start]; let head = 0; closed.add(start);
    while (head < queue.length) {
      const current = queue[head++]; visited.push(current);
      if (current === finish) { completedAt = performance.now(); break; }
      for (const next of getPathNeighbors(current, cols, rows)) {
        if (walls.has(next) || closed.has(next)) continue;
        closed.add(next); parent[next] = current; distance[next] = distance[current] + 1; queue.push(next);
      }
    }
  } else {
    const stack = [start], discovered = new Set([start]);
    while (stack.length) {
      const current = stack.pop();
      if (closed.has(current)) continue;
      closed.add(current); visited.push(current);
      if (current === finish) { completedAt = performance.now(); break; }
      const neighbors = getPathNeighbors(current, cols, rows).reverse();
      for (const next of neighbors) {
        if (walls.has(next) || discovered.has(next)) continue;
        discovered.add(next); parent[next] = current; distance[next] = distance[current] + 1; stack.push(next);
      }
    }
  }
  // If the goal was unreachable, include the full time spent exhausting the frontier.
  if (completedAt === null) completedAt = performance.now();
  const path = [];
  if (closed.has(finish)) { for (let node = finish; node !== -1; node = parent[node]) { path.push(node); if (node === start) break; } path.reverse(); }
  return { visited, path: path[0] === start ? path : [], found: path[0] === start, elapsedMs: completedAt - startedAt };
}
/** @summary Formats a measured search duration using microseconds, milliseconds, or seconds. */
function formatSearchDuration(milliseconds) {
  if (milliseconds === null || milliseconds === undefined) return '—';
  if (milliseconds < 1) return `${Math.max(1, Math.round(milliseconds * 1000))} μs`;
  if (milliseconds < 1000) return `${milliseconds.toFixed(2)} ms`;
  return `${(milliseconds / 1000).toFixed(2)} s`;
}

/** @summary Owns the pathfinding grid, drawing gestures, algorithm playback, and localized controls. */
function PathfindingPage({ siteLang, onBack }) {
  const c = PATH_COPY[siteLang] || PATH_COPY.he;
  const [dimensions, setDimensions] = useState(getPathDimensions);
  const [walls, setWalls] = useState(() => new Set());
  const [startId, setStartId] = useState(() => { const size = getPathDimensions(); return Math.floor(size.rows / 2) * size.cols + 2; });
  const [finishId, setFinishId] = useState(() => { const size = getPathDimensions(); return Math.floor(size.rows / 2) * size.cols + size.cols - 3; });
  const [algorithm, setAlgorithm] = useState('dijkstra');
  const [trace, setTrace] = useState(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [status, setStatus] = useState('ready');
  const [elapsedMs, setElapsedMs] = useState(null);
  const dragMode = useRef(null);
  /** @summary Looks up a pathfinding label and falls back to English when needed. */
  const pathT = (key) => c[key] || PATH_COPY.en[key] || key;
  const totalSteps = trace ? trace.visited.length + trace.path.length : 0;
  const visitedNow = useMemo(() => new Set(trace ? trace.visited.slice(0, Math.min(step, trace.visited.length)) : []), [trace, step]);
  const pathNow = useMemo(() => new Set(trace && step > trace.visited.length ? trace.path.slice(0, step - trace.visited.length) : []), [trace, step]);
  const rows = dimensions.rows, cols = dimensions.cols;
  const openEdgeCount = useMemo(() => {
    // Counting only neighbors with a larger cell id avoids counting each edge twice.
    let count = 0;
    for (let id = 0; id < rows * cols; id++) if (!walls.has(id)) {
      getPathNeighbors(id, cols, rows).forEach((next) => { if (next > id && !walls.has(next)) count++; });
    }
    return count;
  }, [rows, cols, walls]);
  /** @summary Stops playback and clears the previous search trace and timer reading. */
  const resetAnimation = () => { setPlaying(false); setTrace(null); setStep(0); setStatus('ready'); setElapsedMs(null); };

  useEffect(() => {
    // Resize only resets the grid when its row or column count actually changes.
    const resize = () => setDimensions((current) => {
      const next = getPathDimensions();
      return current.cols === next.cols && current.rows === next.rows ? current : next;
    });
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  useEffect(() => {
    // Pointer cancellation also ends a wall-drawing gesture if the pointer leaves the grid.
    const clearDrag = () => { dragMode.current = null; };
    window.addEventListener('pointerup', clearDrag);
    window.addEventListener('pointercancel', clearDrag);
    return () => { window.removeEventListener('pointerup', clearDrag); window.removeEventListener('pointercancel', clearDrag); };
  }, []);
  useEffect(() => {
    if (!playing || !trace) return undefined;
    if (step >= totalSteps) {
      setStatus(trace.found ? 'found' : 'noPath');
      if (autoPlay) {
        // Keep the completed route visible briefly, then replay the same saved trace.
        const restart = window.setTimeout(() => { setStep(0); setStatus('running'); }, Math.max(350, 900 / speed));
        return () => window.clearTimeout(restart);
      }
      setPlaying(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setStep((value) => Math.min(value + 1, totalSteps)), Math.max(8, 24 / speed));
    return () => window.clearTimeout(timer);
  }, [playing, autoPlay, trace, step, totalSteps, speed]);
  useEffect(() => {
    const startRow = Math.floor(rows / 2);
    setStartId(startRow * cols + 2);
    setFinishId(startRow * cols + cols - 3);
    setWalls(new Set());
    resetAnimation();
  }, [rows, cols]);

  /** @summary Applies the current drag mode to a cell or moves an endpoint without overlap. */
  const applyDrag = (id) => {
    const mode = dragMode.current;
    if (!mode) return;
    setPlaying(false); setTrace(null); setStep(0); setStatus('ready'); setElapsedMs(null);
    if (mode === 'start') { if (id !== finishId && !walls.has(id)) setStartId(id); return; }
    if (mode === 'finish') { if (id !== startId && !walls.has(id)) setFinishId(id); return; }
    if (id === startId || id === finishId) return;
    setWalls((current) => {
      if (current.has(id) === (mode === 'draw')) return current;
      const next = new Set(current);
      if (mode === 'draw') next.add(id); else next.delete(id);
      return next;
    });
  };
  /** @summary Chooses draw, erase, or endpoint-move mode from the starting cell. */
  const beginDrag = (event, id) => {
    event.preventDefault();
    if (id === startId) dragMode.current = 'start';
    else if (id === finishId) dragMode.current = 'finish';
    else dragMode.current = walls.has(id) ? 'erase' : 'draw';
    applyDrag(id);
  };
  /** @summary Computes the chosen search trace, records its runtime, and starts playback. */
  const runPath = () => {
    const result = findPathTrace(cols, rows, walls, startId, finishId, algorithm);
    setTrace(result); setStep(0); setPlaying(true); setStatus('running'); setElapsedMs(result.elapsedMs);
  };
  /** @summary Removes all walls and clears the previous route animation. */
  const clearWalls = () => { setWalls(new Set()); resetAnimation(); };
  /** @summary Places random walls while keeping the start and finish cells open. */
  const makeRandomWalls = () => {
    const next = new Set();
    for (let id = 0; id < cols * rows; id++) if (id !== startId && id !== finishId && Math.random() < .24) next.add(id);
    setWalls(next); resetAnimation();
  };
  const statusText = status === 'found' ? pathT('found') : status === 'noPath' ? pathT('noPath') : status === 'running' ? pathT('running') : pathT('ready');

  return <section class="pathfinding-page">
    <div class="path-page-heading">
      <div><button class="back-link" onClick={onBack}><Icon name="arrow" size={16} />{pathT('back')}</button><div class="eyebrow"><span class="eyebrow-line" /> {pathT('workspaceLabel')}</div><h1>{pathT('title')}</h1><p>{pathT('subtitle')}</p></div>
      <div class="path-size-badge"><strong>{cols} × {rows}</strong><span>{pathT('open')}: {cols * rows - walls.size}</span></div>
    </div>
    <section class="panel path-toolbar">
      <label class="path-select-label"><span>{pathT('choose')}</span><select value={algorithm} onChange={(event) => { setAlgorithm(event.currentTarget.value); resetAnimation(); }}><option value="dijkstra">{pathT('dijkstra')}</option><option value="astar">{pathT('astar')}</option><option value="bfs">{pathT('bfs')}</option><option value="dfs">{pathT('dfs')}</option></select><Icon name="chevron" size={14} /></label>
      <div class="path-complexity"><span>{pathT('complexity')}</span><strong dir="ltr">{PATH_COMPLEXITY[algorithm]}</strong><small dir="ltr">V = {rows * cols - walls.size} · E = {openEdgeCount}</small></div>
      <div class="path-toolbar-actions"><button class="path-primary-button" onClick={runPath}><Icon name="play" size={15} />{pathT('run')}</button><button class="path-tool-button" onClick={makeRandomWalls}>{pathT('random')}</button><button class="path-tool-button" onClick={clearWalls}>{pathT('clear')}</button></div>
    </section>
    <section class="panel path-board-panel">
      <div class="path-board-head"><span class="path-run-state"><i class={playing ? 'path-pulse-on' : ''} />{statusText}</span><span>{pathT('dragHint')}</span></div>
      <div class="path-grid-scroll"><div class="path-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} role="grid" aria-label={pathT('title')}>
        {Array.from({ length: rows * cols }, (_, id) => {
          const isStart = id === startId, isFinish = id === finishId, isWall = walls.has(id), isPath = pathNow.has(id), isVisited = visitedNow.has(id);
          const className = `path-cell ${isWall ? 'path-cell-wall' : ''} ${isVisited ? 'path-cell-visited' : ''} ${isPath ? 'path-cell-route' : ''} ${isStart ? 'path-cell-start' : ''} ${isFinish ? 'path-cell-finish' : ''}`;
          const cellLabel = isStart ? pathT('start') : isFinish ? pathT('finish') : isWall ? pathT('wall') : isPath ? pathT('path') : isVisited ? pathT('visited') : pathT('open');
          return <button key={id} class={className} role="gridcell" aria-label={`${cellLabel}, ${Math.floor(id / cols) + 1}:${id % cols + 1}`} onPointerDown={(event) => beginDrag(event, id)} onPointerEnter={() => applyDrag(id)} onContextMenu={(event) => event.preventDefault()}>{isStart ? 'S' : isFinish ? 'E' : ''}</button>;
        })}
      </div></div>
      <div class="path-board-footer">
        <div class="path-legend"><span><i class="path-legend-start" />{pathT('start')}</span><span><i class="path-legend-finish" />{pathT('finish')}</span><span><i class="path-legend-wall" />{pathT('wall')}</span><span><i class="path-legend-visited" />{pathT('visited')}</span><span><i class="path-legend-route" />{pathT('path')}</span></div>
        <div class="path-stats"><span><b>{Math.min(step, trace?.visited.length || 0)}</b>{pathT('visited')}</span><span><b>{trace?.found ? trace.path.length - 1 : '—'}</b>{pathT('path')}</span><span class="path-time-stat"><b>{formatSearchDuration(elapsedMs)}</b>{pathT('time')}</span></div>
      </div>
    </section>
    <section class="panel path-playback">
      <div class="path-playback-actions"><button class="reset-button" onClick={resetAnimation} aria-label={pathT('resetRun')} title={pathT('resetRun')}><Icon name="reset" size={16} /></button><button class="play-button" onClick={() => { if (!trace) runPath(); else if (step >= totalSteps) { setStep(0); setPlaying(true); } else setPlaying((value) => !value); }}><Icon name={playing ? 'pause' : 'play'} size={14} />{playing ? pathT('pause') : pathT('resume')}</button><button class="path-tool-button" onClick={() => { setWalls(new Set()); setStartId(Math.floor(rows / 2) * cols + 2); setFinishId(Math.floor(rows / 2) * cols + cols - 3); resetAnimation(); }}>{pathT('resetBoard')}</button><label class="auto-play-control"><input type="checkbox" checked={autoPlay} onChange={(event) => setAutoPlay(event.currentTarget.checked)} /><span>{pathT('autoPlay')}</span></label></div>
      <div class="path-timeline"><input aria-label={pathT('run')} type="range" min="0" max={Math.max(1, totalSteps)} value={Math.min(step, Math.max(1, totalSteps))} onInput={(event) => { setPlaying(false); setStep(Number(event.currentTarget.value)); }} /><span>{step} / {totalSteps}</span></div>
      <label class="path-speed"><span>{pathT('speed')}</span><input type="range" min="0.5" max="4" step="0.5" value={speed} onInput={(event) => setSpeed(Number(event.currentTarget.value))} /><b>{speed}×</b></label>
    </section>
  </section>;
}

export default PathfindingPage;
