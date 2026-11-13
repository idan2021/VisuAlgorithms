import { h } from 'preact';
import Icon from '../components/Icon.jsx';
import { AlgorithmGraph, SortingStage, MatchingStage, CodePanel } from '../components/AlgorithmVisuals.jsx';

/** @file Home algorithm lab: visualization, source trace, playback, and settings. */
/** @summary Renders the interactive algorithm lab and owns its playback loop. */
function LabPageView({ t, siteLang, algorithms, palettes, paletteLocale, codeLines, programLangName, currentAlgorithm, algorithm, nodes, edges, palette, trace, step, maxStep, playing, speed, graphEdges, programLang, autoPlay, isRTL, algoName, algoSummary, complexityText, onReset, onTogglePlay, onSetSpeed, onSetPlaying, onSetStep, onSetNodeCount, onSetEdgeCount, onSetPalette, onSetAutoPlay, onSelectAlgorithm, onOpenLibrary }) {
  return <section class="lab-page">
    <div class="page-intro">
      <div><div class="eyebrow"><span class="eyebrow-line" /> {t('labEyebrow')} <span class="eyebrow-spark">✳</span></div><h1>{t('subtitle')}</h1><p class="intro-sub">{algoSummary(currentAlgorithm)} <span class="intro-dot">·</span> {complexityText(currentAlgorithm)}</p></div>
      <div class="intro-right"><label class="algorithm-picker"><span>{t('selectAlgorithm')}</span><select value={algorithm} onChange={(event) => onSelectAlgorithm(event.currentTarget.value)} aria-label={t('selectAlgorithm')}>{algorithms.map((item) => <option value={item.id} key={item.id}>{algoName(item)}</option>)}</select><Icon name="chevron" size={13} /></label><span class="complexity-pill">{complexityText(currentAlgorithm)}</span></div>
    </div>
    <div class="workspace-grid">
      <section class="panel stage-panel" key={`visual-${algorithm}`}>
        <div class="panel-heading stage-heading">
          <div class="heading-icon stage-icon"><span class="mini-nodes">••<br />•</span></div>
          <div class="panel-title-group" dir={isRTL ? 'rtl' : 'ltr'}><h2>{currentAlgorithm.group === 'graph' ? t('graph') : currentAlgorithm.group === 'search' ? t('searching') : t('arrayLabel')}</h2><span class="panel-caption">{currentAlgorithm.english}</span></div>
          <span class="live-badge"><i /> {t('live')}</span>
        </div>
        <div class="visual-stage" key={`${algorithm}-${nodes}-${edges}-${palette}`}>
          {algorithm === 'hungarian' || algorithm === 'galeShapley' ? <MatchingStage trace={trace} step={step} algorithm={algorithm} t={t} /> : currentAlgorithm.group === 'graph' ? <AlgorithmGraph algorithm={algorithm} nodeCount={nodes} edges={graphEdges} trace={trace} step={step} t={t} /> : <SortingStage trace={trace} step={step} algorithm={algorithm} t={t} />}
        </div>
        <div class="stage-bottom">
          <div class="stage-metrics"><div class="metric"><span class="metric-icon metric-violet">◉</span><span><small>{currentAlgorithm.group === 'graph' ? t('nodes') : t('arrayLabel')}</small><strong>{nodes}</strong></span></div><div class="metric-separator" /><div class="metric"><span class="metric-icon metric-teal">⌁</span><span><small>{currentAlgorithm.group === 'graph' ? t('edges') : t('comparisons')}</small><strong>{currentAlgorithm.group === 'graph' ? graphEdges.length : maxStep}</strong></span></div></div>
          <div class="run-controls"><button class="reset-button" onClick={onReset} aria-label={t('reset')} title={t('reset')}><Icon name="reset" size={16} /></button><button class="play-button" onClick={onTogglePlay}><Icon name={playing ? 'pause' : 'play'} size={15} />{playing ? t('pause') : t('play')}</button><div class="speed-control"><span>{t('speed')}</span><select value={speed} onChange={(event) => onSetSpeed(Number(event.currentTarget.value))} aria-label={t('speed')}><option value="0.5">0.5×</option><option value="1">1×</option><option value="1.5">1.5×</option><option value="2">2×</option><option value="3">3×</option></select><Icon name="chevron" size={12} /></div><label class="auto-play-control"><input type="checkbox" checked={autoPlay} onChange={(event) => onSetAutoPlay(event.currentTarget.checked)} /><span>{t('autoPlay')}</span></label></div>
        </div>
        <div class="timeline-row"><button onClick={() => { onSetPlaying(false); onSetStep((value) => Math.max(0, value - 1)); }} aria-label={t('stepBack')}>‹</button><input type="range" min="0" max={Math.max(1, maxStep)} value={step} onInput={(event) => { onSetPlaying(false); onSetStep(Number(event.currentTarget.value)); }} /><button onClick={() => { onSetPlaying(false); onSetStep((value) => Math.min(maxStep, value + 1)); }} aria-label={t('stepForward')}>›</button></div>
      </section>
      <div class="right-column">
        <CodePanel algorithm={algorithm} algorithmTitle={currentAlgorithm.english} languageName={programLangName} codeLines={codeLines} trace={trace} step={step} maxStep={maxStep} t={t} isRTL={isRTL} />
        <section class="panel settings-panel">
          <div class="settings-title-row"><div class="settings-title"><div class="settings-icon"><Icon name="spark" size={17} /></div><div><h2>{t('theme')}</h2><span>{t('palette')} · {t('selectAlgorithm')}</span></div></div><button class="text-button" onClick={onOpenLibrary}>{t('algorithms')} <Icon name="arrow" size={14} /></button></div>
          <div class="settings-grid">
            <div class="setting-control"><div class="control-label"><span>{t('nodes')}</span><div class="stepper"><button onClick={() => onSetNodeCount(nodes - 1)} aria-label={t('decreaseNodes')}>−</button><b>{nodes}</b><button onClick={() => onSetNodeCount(nodes + 1)} aria-label={t('increaseNodes')}>+</button></div></div><input type="range" min="5" max="12" value={nodes} onInput={(event) => onSetNodeCount(Number(event.currentTarget.value))} /></div>
            <div class="setting-control"><div class="control-label"><span>{t('edges')}</span><div class="stepper"><button onClick={() => onSetEdgeCount(edges - 1)} aria-label={t('decreaseEdges')}>−</button><b>{edges}</b><button onClick={() => onSetEdgeCount(edges + 1)} aria-label={t('increaseEdges')}>+</button></div></div><input type="range" min={nodes} max={(nodes * (nodes - 1)) / 2} value={edges} onInput={(event) => onSetEdgeCount(Number(event.currentTarget.value))} /></div>
          </div>
          <div class="palette-row"><span class="palette-label">{t('palette')}</span><div class="palette-options">{palettes.map((item) => { const paletteName = paletteLocale[siteLang]?.[item.id] || item.name; return <button key={item.id} class={`palette-option ${palette === item.id ? 'palette-selected' : ''}`} onClick={() => onSetPalette(item.id)} aria-label={paletteName} title={paletteName}><span class="swatches">{item.swatches.map((color) => <i style={{ background: color }} key={color} />)}</span>{palette === item.id && <b>✓</b>}</button>; })}</div></div>
        </section>
      </div>
    </div>
    <footer class="page-footer"><span>{t('footer')}</span><span><i class="footer-dot" /> {t('interactiveFooter')}</span></footer>
  </section>;
}

export default LabPageView;
