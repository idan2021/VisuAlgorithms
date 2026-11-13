import { h } from 'preact';
import Icon from '../components/Icon.jsx';

/** @file Searchable catalog page for the algorithm collection. */
/** @summary Renders the searchable algorithm catalog in the selected site language. */
function AlgorithmLibraryPageView({ t, isRTL, algorithms, programmingLanguages, filter, setFilter, programLang, setProgramLang, query, setQuery, visibleAlgorithms, algoName, algoSummary, complexityText, difficultyName, onBack, onSelectAlgorithm }) {
  return <section class="library-page algorithm-library-page">
    <div class="library-top"><div><button class="back-link" onClick={onBack}><Icon name="arrow" size={16} />{t('back')}</button><div class="eyebrow"><span class="eyebrow-line" /> {t('libraryEyebrow')}</div><h1>{t('catalog')}</h1><p>{t('catalogSub')}</p></div><div class="library-stats"><strong>{String(algorithms.length).padStart(2, '0')}</strong><span>{t('algorithmCount')}</span></div></div>
    <div class="library-tools"><div class="filter-tabs">{[['all', t('all')], ['graph', t('graphs')], ['sort', t('sorts')], ['search', t('searching')]].map(([id, name]) => <button class={filter === id ? 'filter-active' : ''} onClick={() => setFilter(id)} key={id}>{name}<span>{id === 'all' ? algorithms.length : algorithms.filter((item) => item.group === id).length}</span></button>)}</div><div class="library-search-tools"><label class="library-language"><span>{'</>'}</span><select value={programLang} onChange={(event) => setProgramLang(event.currentTarget.value)} aria-label={t('language')}>{programmingLanguages.map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select><Icon name="chevron" size={12} /></label><label class="search-box"><Icon name="search" size={17} /><input value={query} onInput={(event) => setQuery(event.currentTarget.value)} placeholder={t('search')} /><kbd>Ctrl K</kbd></label></div></div>
    <div class="algorithm-grid">{visibleAlgorithms.map((item, index) => <button class={`algorithm-card card-${item.color}`} dir={isRTL ? 'rtl' : 'ltr'} onClick={() => onSelectAlgorithm(item.id)} key={item.id} style={{ animationDelay: `${index * 50}ms` }}><span class="card-index">{String(algorithms.indexOf(item) + 1).padStart(2, '0')}</span><span class="card-icon">{item.icon}</span><span class="card-type">{item.group === 'graph' ? t('graphs') : item.group === 'search' ? t('searching') : t('sorts')}</span><h2>{algoName(item)}</h2><p class="card-english">{item.english}</p><p class="card-summary">{algoSummary(item)}</p><div class="card-meta"><span>{complexityText(item)}</span><span class="difficulty-dot" />{difficultyName(item)}<Icon name="arrow" size={15} /></div><span class="card-glow" /></button>)}</div>
    {visibleAlgorithms.length === 0 && <div class="empty-state">{t('empty')}</div>}
  </section>;
}

export default AlgorithmLibraryPageView;
