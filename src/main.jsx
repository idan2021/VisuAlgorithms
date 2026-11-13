import { h, render } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import './style.css';

const PROGRAMMING_LANGUAGES = [
  ['python', 'Python', 'Py'], ['javascript', 'JavaScript', 'JS'], ['typescript', 'TypeScript', 'TS'],
  ['java', 'Java', 'JV'], ['cpp', 'C++', 'C++'], ['csharp', 'C#', 'C#'], ['go', 'Go', 'GO'], ['rust', 'Rust', 'RS'],
];
const SITE_LANGUAGES = [
  ['he', '🇮🇱', 'עברית'], ['en', '🇺🇸', 'English'], ['ar', '🇸🇦', 'العربية'],
  ['es', '🇪🇸', 'Español'], ['fr', '🇫🇷', 'Français'], ['de', '🇩🇪', 'Deutsch'],
];
// Covers common RTL locale codes so future language additions inherit the right layout automatically.
const RTL_SITE_LANGUAGES = new Set(['ar', 'fa', 'he', 'ku', 'ps', 'sd', 'ur', 'yi']);
const ALGORITHMS = [
  { id: 'dijkstra', name: 'דייקסטרה', english: "Dijkstra's algorithm", group: 'graph', icon: '◈', summary: 'המסלול הקצר ביותר בין צמתים', complexity: 'O((V + E) log V)', difficulty: 'בינוני', color: 'violet' },
  { id: 'bfs', name: 'חיפוש לרוחב', english: 'Breadth-first search', group: 'graph', icon: '⤢', summary: 'ביקור בשכבות, מהקרוב לרחוק', complexity: 'O(V + E)', difficulty: 'קל', color: 'blue' },
  { id: 'dfs', name: 'חיפוש לעומק', english: 'Depth-first search', group: 'graph', icon: '⤴', summary: 'צלילה לעומק לפני חזרה לאחור', complexity: 'O(V + E)', difficulty: 'קל', color: 'green' },
  { id: 'bellmanFord', name: 'בלמן־פורד', english: 'Bellman–Ford', group: 'graph', icon: '⇢', summary: 'הרפיית קשתות חוזרת עד למציאת מסלולים קצרים', complexity: 'O(V · E)', difficulty: 'בינוני', color: 'violet' },
  { id: 'floydWarshall', name: 'פלויד־וורשל', english: 'Floyd–Warshall', group: 'graph', icon: '▦', summary: 'מסלולים קצרים בין כל זוג צמתים', complexity: 'O(V³)', difficulty: 'בינוני', color: 'blue' },
  { id: 'kruskal', name: 'קרוסקל', english: "Kruskal's algorithm", group: 'graph', icon: '⌁', summary: 'בניית עץ פורש מינימלי לפי משקל הקשתות', complexity: 'O(E log E)', difficulty: 'בינוני', color: 'orange' },
  { id: 'prim', name: 'פרים', english: "Prim's algorithm", group: 'graph', icon: '✳', summary: 'הרחבת עץ פורש מהקשת הזולה ביותר', complexity: 'O(E log V)', difficulty: 'בינוני', color: 'green' },
  { id: 'astar', name: 'A*', english: 'A* search', group: 'graph', icon: '✧', summary: 'חיפוש מסלול מונחה בעזרת אומדן למרחק', complexity: 'O(E log V)', difficulty: 'בינוני', color: 'pink' },
  { id: 'hungarian', name: 'האלגוריתם ההונגרי', english: 'Hungarian algorithm', group: 'graph', icon: '⇄', summary: 'התאמה מיטבית בין משימות לעובדים', complexity: 'O(n³)', difficulty: 'מתקדם', color: 'yellow' },
  { id: 'galeShapley', name: 'גייל־שפלי', english: 'Gale–Shapley', group: 'graph', icon: '♡', summary: 'התאמה יציבה לפי העדפות הדדיות', complexity: 'O(n²)', difficulty: 'בינוני', color: 'pink' },
  { id: 'bubble', name: 'מיון בועות', english: 'Bubble sort', group: 'sort', icon: '↕', summary: 'החלפת איברים סמוכים עד למיון', complexity: 'O(n²)', difficulty: 'קל', color: 'orange' },
  { id: 'insertion', name: 'מיון הכנסה', english: 'Insertion sort', group: 'sort', icon: '↳', summary: 'הכנסת כל איבר למקומו ברשימה ממוינת', complexity: 'O(n²)', difficulty: 'קל', color: 'pink' },
  { id: 'selection', name: 'מיון בחירה', english: 'Selection sort', group: 'sort', icon: '⌖', summary: 'בחירת האיבר הקטן ביותר בכל סיבוב', complexity: 'O(n²)', difficulty: 'קל', color: 'yellow' },
  { id: 'merge', name: 'מיון מיזוג', english: 'Merge sort', group: 'sort', icon: '⋈', summary: 'חלוקה לחצאים ומיזוג בסדר עולה', complexity: 'O(n log n)', difficulty: 'בינוני', color: 'blue' },
  { id: 'quick', name: 'מיון מהיר', english: 'Quick sort', group: 'sort', icon: '↗', summary: 'חלוקה סביב ציר ומיון תתי־המערכים', complexity: 'O(n log n)', difficulty: 'בינוני', color: 'green' },
  { id: 'timsort', name: 'טימסורט', english: 'TimSort', group: 'sort', icon: '⚡', summary: 'מיון היברידי שמנצל רצפים קיימים', complexity: 'O(n log n)', difficulty: 'מתקדם', color: 'violet' },
  { id: 'quickselect', name: 'Quickselect', english: 'Quickselect', group: 'sort', icon: '⌖', summary: 'מציאת האיבר ה־k בלי למיין את הכול', complexity: 'O(n) ממוצע', difficulty: 'בינוני', color: 'orange' },
  { id: 'binarySearch', name: 'חיפוש בינארי', english: 'Binary search', group: 'search', icon: '⌕', summary: 'צמצום החיפוש לחצי בכל צעד', complexity: 'O(log n)', difficulty: 'קל', color: 'blue' },
  { id: 'linearSearch', name: 'חיפוש ליניארי', english: 'Linear search', group: 'search', icon: '→', summary: 'בדיקת כל איבר עד למציאת היעד', complexity: 'O(n)', difficulty: 'קל', color: 'green' },
];
const PALETTES = [
  { id: 'aurora', name: 'אורורה', swatches: ['#8b75ff', '#39d6c3', '#ffbb6d'] },
  { id: 'ocean', name: 'אוקיינוס', swatches: ['#46a9ff', '#43ddcf', '#9b8cff'] },
  { id: 'sunset', name: 'שקיעה', swatches: ['#ff8e72', '#ffc56b', '#d57aff'] },
  { id: 'mono', name: 'מונוכרום', swatches: ['#e5e7f0', '#9298ad', '#677086'] },
];
const COPY = {
  he: { lab: 'מעבדת אלגוריתמים', subtitle: 'רעיונות גדולים, צעד אחר צעד.', search: 'חיפוש אלגוריתם...', graph: 'תצוגה חיה', code: 'הקוד בפעולה', algorithms: 'אלגוריתמים', about: 'אודות', author: 'נבנה בסקרנות על ידי', reset: 'אתחול', play: 'הפעלה', pause: 'השהיה', speed: 'מהירות', nodes: 'צמתים', edges: 'קשתות', language: 'שפת תכנות', palette: 'ערכת צבעים', selectAlgorithm: 'בחירת אלגוריתם', catalog: 'ספריית האלגוריתמים', catalogSub: 'בחרו רעיון, ואז צפו בו מתעורר לחיים.', all: 'הכול', graphs: 'גרפים', sorts: 'מיון', back: 'חזרה למעבדה', start: 'צומת התחלה', end: 'יעד', visited: 'בוקרו', pending: 'ממתינים', complete: 'הושלם', step: 'צעד', empty: 'לא נמצאו אלגוריתמים', legendPath: 'מסלול שנמצא', legendFrontier: 'חזית החיפוש', legendIdle: 'טרם בוקר', arrayLabel: 'מערך הנתונים', theme: 'מראה המעבדה' },
  en: { lab: 'Algorithm lab', subtitle: 'Big ideas, one step at a time.', search: 'Search algorithms...', graph: 'Live visualization', code: 'Code in action', algorithms: 'Algorithms', about: 'About', author: 'Made with curiosity by', reset: 'Reset', play: 'Play', pause: 'Pause', speed: 'Speed', nodes: 'Nodes', edges: 'Edges', language: 'Programming language', palette: 'Color palette', selectAlgorithm: 'Choose algorithm', catalog: 'Algorithm library', catalogSub: 'Pick an idea, then watch it come to life.', all: 'All', graphs: 'Graphs', sorts: 'Sorting', back: 'Back to lab', start: 'Start node', end: 'Target', visited: 'visited', pending: 'waiting', complete: 'Complete', step: 'Step', empty: 'No algorithms found', legendPath: 'Path found', legendFrontier: 'Search frontier', legendIdle: 'Not visited', arrayLabel: 'Data array', theme: 'Lab appearance' },
  es: { lab: 'Laboratorio de algoritmos', subtitle: 'Ideas grandes, paso a paso.', search: 'Buscar algoritmos...', graph: 'Visualización en vivo', code: 'Código en acción', algorithms: 'Algoritmos', about: 'Acerca de', author: 'Creado con curiosidad por', reset: 'Reiniciar', play: 'Iniciar', pause: 'Pausar', speed: 'Velocidad', nodes: 'Nodos', edges: 'Aristas', language: 'Lenguaje', palette: 'Paleta de colores', selectAlgorithm: 'Elegir algoritmo', catalog: 'Biblioteca', catalogSub: 'Elige una idea y mírala cobrar vida.', all: 'Todos', graphs: 'Grafos', sorts: 'Ordenación', back: 'Volver al laboratorio', start: 'Inicio', end: 'Destino', visited: 'visitados', pending: 'pendientes', complete: 'Completado', step: 'Paso', empty: 'No se encontraron algoritmos', legendPath: 'Ruta encontrada', legendFrontier: 'Frontera', legendIdle: 'Sin visitar', arrayLabel: 'Datos', theme: 'Apariencia' },
  fr: { lab: "Labo d'algorithmes", subtitle: 'Les grandes idées, pas à pas.', search: 'Rechercher...', graph: 'Visualisation en direct', code: 'Le code en action', algorithms: 'Algorithmes', about: 'À propos', author: 'Créé avec curiosité par', reset: 'Réinitialiser', play: 'Lire', pause: 'Pause', speed: 'Vitesse', nodes: 'Nœuds', edges: 'Arêtes', language: 'Langage', palette: 'Palette', selectAlgorithm: 'Choisir un algorithme', catalog: 'Bibliothèque', catalogSub: 'Choisissez une idée et regardez-la prendre vie.', all: 'Tout', graphs: 'Graphes', sorts: 'Tri', back: 'Retour au labo', start: 'Départ', end: 'Cible', visited: 'visités', pending: 'en attente', complete: 'Terminé', step: 'Étape', empty: 'Aucun algorithme trouvé', legendPath: 'Chemin trouvé', legendFrontier: 'Frontière', legendIdle: 'Non visité', arrayLabel: 'Données', theme: 'Apparence' },
  de: { lab: 'Algorithmus-Labor', subtitle: 'Große Ideen, Schritt für Schritt.', search: 'Algorithmen suchen...', graph: 'Live-Visualisierung', code: 'Code in Aktion', algorithms: 'Algorithmen', about: 'Über uns', author: 'Mit Neugier entwickelt von', reset: 'Zurücksetzen', play: 'Starten', pause: 'Pause', speed: 'Geschwindigkeit', nodes: 'Knoten', edges: 'Kanten', language: 'Programmiersprache', palette: 'Farbpalette', selectAlgorithm: 'Algorithmus auswählen', catalog: 'Algorithmus-Bibliothek', catalogSub: 'Wähle eine Idee und sieh zu, wie sie lebendig wird.', all: 'Alle', graphs: 'Graphen', sorts: 'Sortierung', back: 'Zurück zum Labor', start: 'Startknoten', end: 'Ziel', visited: 'besucht', pending: 'wartend', complete: 'Fertig', step: 'Schritt', empty: 'Keine Algorithmen gefunden', legendPath: 'Gefundener Pfad', legendFrontier: 'Suchfront', legendIdle: 'Unbesucht', arrayLabel: 'Daten', theme: 'Erscheinungsbild' },
  ar: { lab: 'مختبر الخوارزميات', subtitle: 'أفكار كبيرة، خطوة بخطوة.', search: 'ابحث عن خوارزمية...', graph: 'عرض مباشر', code: 'الكود أثناء العمل', algorithms: 'الخوارزميات', about: 'حول الموقع', author: 'بفضول وإبداع من', reset: 'إعادة', play: 'تشغيل', pause: 'إيقاف مؤقت', speed: 'السرعة', nodes: 'العُقد', edges: 'الحواف', language: 'لغة البرمجة', palette: 'لوحة الألوان', selectAlgorithm: 'اختر خوارزمية', catalog: 'مكتبة الخوارزميات', catalogSub: 'اختر فكرة وشاهدها تنبض بالحياة.', all: 'الكل', graphs: 'الرسوم البيانية', sorts: 'الترتيب', back: 'العودة إلى المختبر', start: 'نقطة البداية', end: 'الهدف', visited: 'تمت زيارتها', pending: 'قيد الانتظار', complete: 'اكتمل', step: 'خطوة', empty: 'لم يتم العثور على خوارزميات', legendPath: 'المسار', legendFrontier: 'جبهة البحث', legendIdle: 'لم تتم الزيارة', arrayLabel: 'البيانات', theme: 'مظهر المختبر' },
};
const ABOUT_DESC = {
  he: 'אלגוריתמים, בתנועה ובלמידה אינטראקטיבית', en: 'Algorithms in motion, built for curious minds',
  es: 'Algoritmos en movimiento para mentes curiosas', fr: 'Des algorithmes en mouvement pour les esprits curieux',
  de: 'Algorithmen in Bewegung für neugierige Köpfe', ar: 'خوارزميات تفاعلية تتحرك أمامك',
};
const EXTRA_COPY = {
  he: { mainMenu: 'תפריט ראשי', explore: 'ניווט', algorithmCount: 'אלגוריתמים לחקור', stepBack: 'צעד אחורה', stepForward: 'צעד קדימה', comparisons: 'השוואות', comparePair: 'זוג בהשוואה', sortComplete: 'סדר עולה ✓', sortHint: 'משווים ומחליפים לפי הצורך', footer: 'נבנה כדי לראות איך רעיונות עובדים.', running: 'בתהליך', finished: 'הסתיים' },
  en: { mainMenu: 'Main menu', explore: 'Explore', algorithmCount: 'algorithms to explore', stepBack: 'Previous step', stepForward: 'Next step', comparisons: 'comparisons', comparePair: 'Pair being compared', sortComplete: 'Sorted ascending ✓', sortHint: 'Compare and swap when needed', footer: 'Built to show how ideas work.', running: 'Running', finished: 'Finished' },
  es: { mainMenu: 'Menú principal', explore: 'Explorar', algorithmCount: 'algoritmos por explorar', stepBack: 'Paso anterior', stepForward: 'Paso siguiente', comparisons: 'comparaciones', comparePair: 'Par en comparación', sortComplete: 'Orden ascendente ✓', sortHint: 'Compara e intercambia si hace falta', footer: 'Creado para mostrar cómo funcionan las ideas.', running: 'En curso', finished: 'Terminado' },
  fr: { mainMenu: 'Menu principal', explore: 'Explorer', algorithmCount: 'algorithmes à explorer', stepBack: 'Étape précédente', stepForward: 'Étape suivante', comparisons: 'comparaisons', comparePair: 'Paire comparée', sortComplete: 'Tri croissant ✓', sortHint: 'Comparer et échanger si nécessaire', footer: 'Conçu pour montrer comment fonctionnent les idées.', running: 'En cours', finished: 'Terminé' },
  de: { mainMenu: 'Hauptmenü', explore: 'Entdecken', algorithmCount: 'Algorithmen zum Erkunden', stepBack: 'Vorheriger Schritt', stepForward: 'Nächster Schritt', comparisons: 'Vergleiche', comparePair: 'Verglichenes Paar', sortComplete: 'Aufsteigend sortiert ✓', sortHint: 'Vergleichen und bei Bedarf tauschen', footer: 'Zeigt, wie Ideen funktionieren.', running: 'Läuft', finished: 'Fertig' },
  ar: { mainMenu: 'القائمة الرئيسية', explore: 'استكشف', algorithmCount: 'خوارزميات للاستكشاف', stepBack: 'الخطوة السابقة', stepForward: 'الخطوة التالية', comparisons: 'مقارنات', comparePair: 'الزوج قيد المقارنة', sortComplete: 'تم الترتيب تصاعديًا ✓', sortHint: 'قارن وبدّل عند الحاجة', footer: 'صُمم لتوضيح كيفية عمل الأفكار.', running: 'قيد التشغيل', finished: 'اكتمل' },
};
Object.assign(EXTRA_COPY.he, { searching: 'חיפוש', target: 'ערך לחיפוש', found: 'נמצא', assignment: 'מטריצת עלויות והתאמה', stablePairing: 'הצעות והתאמות יציבות', matchingAria: 'תרשים התאמה בין שתי קבוצות', groupA: 'קבוצה א׳', groupB: 'קבוצה ב׳', matched: 'התאמה', considered: 'נבדק עכשיו', costShown: 'המספר על הקשת הוא העלות' });
Object.assign(EXTRA_COPY.en, { searching: 'Search', target: 'Target', found: 'Found', assignment: 'Costs and assignment', stablePairing: 'Proposals and stable pairs', matchingAria: 'Bipartite matching diagram', groupA: 'GROUP A', groupB: 'GROUP B', matched: 'Matched', considered: 'Being considered', costShown: 'Edge labels show cost' });
Object.assign(EXTRA_COPY.es, { searching: 'Búsqueda', target: 'Objetivo', found: 'Encontrado', assignment: 'Costes y asignación', stablePairing: 'Propuestas y parejas estables', matchingAria: 'Diagrama de emparejamiento', groupA: 'GRUPO A', groupB: 'GRUPO B', matched: 'Emparejado', considered: 'En evaluación', costShown: 'Las aristas muestran el coste' });
Object.assign(EXTRA_COPY.fr, { searching: 'Recherche', target: 'Cible', found: 'Trouvé', assignment: 'Coûts et affectation', stablePairing: 'Propositions et paires stables', matchingAria: 'Diagramme d’appariement', groupA: 'GROUPE A', groupB: 'GROUPE B', matched: 'Apparié', considered: 'En cours d’étude', costShown: 'Les arêtes indiquent le coût' });
Object.assign(EXTRA_COPY.de, { searching: 'Suche', target: 'Zielwert', found: 'Gefunden', assignment: 'Kosten und Zuordnung', stablePairing: 'Vorschläge und stabile Paare', matchingAria: 'Bipartites Zuordnungsdiagramm', groupA: 'GRUPPE A', groupB: 'GRUPPE B', matched: 'Zugeordnet', considered: 'Wird geprüft', costShown: 'Kanten zeigen Kosten' });
Object.assign(EXTRA_COPY.ar, { searching: 'بحث', target: 'القيمة المطلوبة', found: 'تم العثور', assignment: 'التكاليف والتخصيص', stablePairing: 'العروض والاقتران المستقر', matchingAria: 'مخطط اقتران بين مجموعتين', groupA: 'المجموعة أ', groupB: 'المجموعة ب', matched: 'تم الاقتران', considered: 'قيد الفحص', costShown: 'تُظهر الحواف التكلفة' });
Object.assign(EXTRA_COPY.he, { pathfinding: 'מציאת נתיבים' });
Object.assign(EXTRA_COPY.en, { pathfinding: 'Pathfinding' });
Object.assign(EXTRA_COPY.es, { pathfinding: 'Rutas' });
Object.assign(EXTRA_COPY.fr, { pathfinding: 'Recherche de chemin' });
Object.assign(EXTRA_COPY.de, { pathfinding: 'Pfadsuche' });
Object.assign(EXTRA_COPY.ar, { pathfinding: 'إيجاد المسارات' });
const ALGO_LOCALE = {
  en: {
    dijkstra: ["Dijkstra's algorithm", 'Finds shortest paths between nodes'], bfs: ['Breadth-first search', 'Visits nearby nodes before more distant ones'], dfs: ['Depth-first search', 'Explores deeply before backtracking'], bellmanFord: ['Bellman–Ford algorithm', 'Relaxes every edge to find shortest paths'], floydWarshall: ['Floyd–Warshall algorithm', 'Finds shortest paths between every pair'], kruskal: ["Kruskal's algorithm", 'Builds a minimum spanning tree from the lightest edges'], prim: ["Prim's algorithm", 'Grows a minimum spanning tree one edge at a time'], astar: ['A* search', 'Guides path search with a distance estimate'], hungarian: ['Hungarian algorithm', 'Finds the best assignment of tasks'], galeShapley: ['Gale–Shapley algorithm', 'Finds stable matches from ranked preferences'], bubble: ['Bubble sort', 'Swaps neighboring values until sorted'], insertion: ['Insertion sort', 'Places each value into its sorted position'], selection: ['Selection sort', 'Selects the smallest remaining value'], merge: ['Merge sort', 'Splits the list and merges sorted halves'], quick: ['Quicksort', 'Partitions values around a pivot'], timsort: ['TimSort', 'Combines runs and merge sorting'], quickselect: ['Quickselect', 'Finds the kth value without sorting everything'], binarySearch: ['Binary search', 'Halves the search range at each step'], linearSearch: ['Linear search', 'Checks each value until it finds the target']
  },
  es: {
    dijkstra: ['Algoritmo de Dijkstra', 'Encuentra rutas más cortas entre nodos'], bfs: ['Búsqueda en anchura', 'Visita primero los nodos más cercanos'], dfs: ['Búsqueda en profundidad', 'Explora a fondo antes de retroceder'], bellmanFord: ['Algoritmo de Bellman–Ford', 'Relaja cada arista para hallar rutas cortas'], floydWarshall: ['Algoritmo de Floyd–Warshall', 'Halla rutas cortas entre todos los pares'], kruskal: ['Algoritmo de Kruskal', 'Construye un árbol mínimo con las aristas más ligeras'], prim: ['Algoritmo de Prim', 'Amplía un árbol mínimo arista a arista'], astar: ['Búsqueda A*', 'Guía la búsqueda con una estimación de distancia'], hungarian: ['Algoritmo húngaro', 'Encuentra la mejor asignación de tareas'], galeShapley: ['Algoritmo de Gale–Shapley', 'Encuentra parejas estables según preferencias'], bubble: ['Ordenamiento burbuja', 'Intercambia valores vecinos hasta ordenarlos'], insertion: ['Ordenamiento por inserción', 'Coloca cada valor en su posición ordenada'], selection: ['Ordenamiento por selección', 'Elige el menor valor restante'], merge: ['Ordenamiento por mezcla', 'Divide la lista y mezcla mitades ordenadas'], quick: ['Ordenamiento rápido', 'Divide los valores alrededor de un pivote'], timsort: ['TimSort', 'Combina secuencias y ordenamiento por mezcla'], quickselect: ['Quickselect', 'Encuentra el valor k sin ordenar todo'], binarySearch: ['Búsqueda binaria', 'Reduce a la mitad el rango en cada paso'], linearSearch: ['Búsqueda lineal', 'Comprueba cada valor hasta hallar el objetivo']
  },
  fr: {
    dijkstra: ['Algorithme de Dijkstra', 'Trouve les plus courts chemins entre les nœuds'], bfs: ['Parcours en largeur', 'Visite les nœuds proches avant les autres'], dfs: ['Parcours en profondeur', 'Explore loin avant de revenir en arrière'], bellmanFord: ['Algorithme de Bellman–Ford', 'Relâche chaque arête pour trouver les chemins courts'], floydWarshall: ['Algorithme de Floyd–Warshall', 'Trouve les chemins courts entre toutes les paires'], kruskal: ['Algorithme de Kruskal', 'Construit un arbre couvrant avec les arêtes les moins coûteuses'], prim: ['Algorithme de Prim', 'Étend un arbre couvrant arête par arête'], astar: ['Recherche A*', 'Guide la recherche grâce à une estimation de distance'], hungarian: ['Algorithme hongrois', 'Trouve la meilleure attribution des tâches'], galeShapley: ['Algorithme de Gale–Shapley', 'Trouve des paires stables selon leurs préférences'], bubble: ['Tri à bulles', 'Échange les valeurs voisines jusqu’au tri'], insertion: ['Tri par insertion', 'Place chaque valeur à sa position triée'], selection: ['Tri par sélection', 'Choisit la plus petite valeur restante'], merge: ['Tri fusion', 'Divise la liste puis fusionne les moitiés triées'], quick: ['Tri rapide', 'Sépare les valeurs autour d’un pivot'], timsort: ['TimSort', 'Combine les séquences et le tri fusion'], quickselect: ['Quickselect', 'Trouve la kᵉ valeur sans tout trier'], binarySearch: ['Recherche binaire', 'Réduit la plage de moitié à chaque étape'], linearSearch: ['Recherche linéaire', 'Vérifie chaque valeur jusqu’à trouver la cible']
  },
  de: {
    dijkstra: ['Dijkstra-Algorithmus', 'Findet kürzeste Wege zwischen Knoten'], bfs: ['Breitensuche', 'Besucht nähere Knoten vor weiter entfernten'], dfs: ['Tiefensuche', 'Erkundet zuerst die Tiefe und geht dann zurück'], bellmanFord: ['Bellman-Ford-Algorithmus', 'Entspannt alle Kanten für kürzeste Wege'], floydWarshall: ['Floyd-Warshall-Algorithmus', 'Findet kürzeste Wege zwischen allen Paaren'], kruskal: ['Kruskal-Algorithmus', 'Baut einen minimalen Spannbaum aus leichten Kanten'], prim: ['Prim-Algorithmus', 'Erweitert einen minimalen Spannbaum Kante für Kante'], astar: ['A*-Suche', 'Lenkt die Suche mit einer Entfernungsschätzung'], hungarian: ['Ungarischer Algorithmus', 'Findet die beste Zuordnung von Aufgaben'], galeShapley: ['Gale-Shapley-Algorithmus', 'Findet stabile Paare anhand von Präferenzen'], bubble: ['Bubblesort', 'Tauscht benachbarte Werte bis zur Sortierung'], insertion: ['Insertion Sort', 'Setzt jeden Wert an die richtige Stelle'], selection: ['Selection Sort', 'Wählt den kleinsten übrigen Wert'], merge: ['Mergesort', 'Teilt die Liste und führt sortierte Hälften zusammen'], quick: ['Quicksort', 'Teilt Werte anhand eines Pivots auf'], timsort: ['TimSort', 'Kombiniert Folgen und Mergesort'], quickselect: ['Quickselect', 'Findet den k-ten Wert ohne alles zu sortieren'], binarySearch: ['Binäre Suche', 'Halbiert den Suchbereich bei jedem Schritt'], linearSearch: ['Lineare Suche', 'Prüft jeden Wert bis zum Ziel']
  },
  ar: {
    dijkstra: ['خوارزمية ديكسترا', 'تجد أقصر المسارات بين العُقد'], bfs: ['البحث بالعرض', 'تزور العُقد الأقرب قبل الأبعد'], dfs: ['البحث بالعمق', 'تستكشف إلى العمق ثم تعود للخلف'], bellmanFord: ['خوارزمية بيلمان–فورد', 'تحسّن كل حافة للعثور على أقصر المسارات'], floydWarshall: ['خوارزمية فلويد–وارشال', 'تجد أقصر المسارات بين كل زوج'], kruskal: ['خوارزمية كروسكال', 'تبني شجرة ممتدة صغرى بالحواف الأقل كلفة'], prim: ['خوارزمية بريم', 'توسّع الشجرة الممتدة حافة بعد أخرى'], astar: ['بحث A*', 'توجّه البحث بتقدير للمسافة'], hungarian: ['الخوارزمية المجرية', 'تجد أفضل توزيع للمهام'], galeShapley: ['خوارزمية غيل–شابلي', 'تجد أزواجًا مستقرة بحسب التفضيلات'], bubble: ['ترتيب الفقاعات', 'تبدّل القيم المتجاورة حتى تترتب'], insertion: ['الترتيب بالإدراج', 'تضع كل قيمة في موقعها المرتب'], selection: ['الترتيب بالاختيار', 'تختار أصغر قيمة متبقية'], merge: ['الترتيب بالدمج', 'تقسم القائمة وتدمج أنصافًا مرتبة'], quick: ['الترتيب السريع', 'تقسم القيم حول محور'], timsort: ['ترتيب TimSort', 'تجمع المقاطع والترتيب بالدمج'], quickselect: ['اختيار سريع', 'تجد القيمة k دون ترتيب القائمة كلها'], binarySearch: ['البحث الثنائي', 'تقلص نطاق البحث إلى النصف كل خطوة'], linearSearch: ['البحث الخطي', 'تفحص كل قيمة حتى تجد الهدف']
  },
};

// These labels complete the shared interface copy and keep controls localized.
Object.assign(COPY.he, { labEyebrow: 'מדעי המחשב באופן אינטראקטיבי', libraryEyebrow: 'אינדקס האלגוריתמים', siteLanguageTitle: 'שפת האתר', openMenu: 'פתיחת תפריט', closeMenu: 'סגירת תפריט', live: 'חי', keywordLegend: 'מילות מפתח', functionLegend: 'פונקציות', typeLegend: 'טיפוסים', stringLegend: 'מחרוזות', interactiveFooter: 'PREACT · אינטראקטיבי', autoPlay: 'Auto-Play', sortVisual: 'המחשה של מיון מערך', easy: 'קל', medium: 'בינוני', advanced: 'מתקדם', decreaseNodes: 'הפחתת צמתים', increaseNodes: 'הוספת צמתים', decreaseEdges: 'הפחתת קשתות', increaseEdges: 'הוספת קשתות' });
Object.assign(COPY.en, { labEyebrow: 'Interactive computer science', libraryEyebrow: 'Algorithm index', siteLanguageTitle: 'Site language', openMenu: 'Open menu', closeMenu: 'Close menu', live: 'Live', keywordLegend: 'Keywords', functionLegend: 'Functions', typeLegend: 'Types', stringLegend: 'Strings', interactiveFooter: 'PREACT · Interactive', autoPlay: 'Auto-Play', sortVisual: 'Array sorting visualization', easy: 'Easy', medium: 'Intermediate', advanced: 'Advanced', decreaseNodes: 'Decrease nodes', increaseNodes: 'Increase nodes', decreaseEdges: 'Decrease edges', increaseEdges: 'Increase edges' });
Object.assign(COPY.es, { labEyebrow: 'Informática interactiva', libraryEyebrow: 'Índice de algoritmos', siteLanguageTitle: 'Idioma del sitio', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú', live: 'En vivo', keywordLegend: 'Palabras clave', functionLegend: 'Funciones', typeLegend: 'Tipos', stringLegend: 'Cadenas', interactiveFooter: 'PREACT · Interactivo', autoPlay: 'Auto-Play', sortVisual: 'Visualización del ordenamiento', easy: 'Fácil', medium: 'Intermedio', advanced: 'Avanzado', decreaseNodes: 'Reducir nodos', increaseNodes: 'Aumentar nodos', decreaseEdges: 'Reducir aristas', increaseEdges: 'Aumentar aristas' });
Object.assign(COPY.fr, { labEyebrow: 'Informatique interactive', libraryEyebrow: 'Index des algorithmes', siteLanguageTitle: 'Langue du site', openMenu: 'Ouvrir le menu', closeMenu: 'Fermer le menu', live: 'En direct', keywordLegend: 'Mots-clés', functionLegend: 'Fonctions', typeLegend: 'Types', stringLegend: 'Chaînes', interactiveFooter: 'PREACT · Interactif', autoPlay: 'Auto-Play', sortVisual: 'Visualisation du tri du tableau', easy: 'Facile', medium: 'Intermédiaire', advanced: 'Avancé', decreaseNodes: 'Réduire les nœuds', increaseNodes: 'Ajouter des nœuds', decreaseEdges: 'Réduire les arêtes', increaseEdges: 'Ajouter des arêtes' });
Object.assign(COPY.de, { labEyebrow: 'Interaktive Informatik', libraryEyebrow: 'Algorithmusindex', siteLanguageTitle: 'Seitensprache', openMenu: 'Menü öffnen', closeMenu: 'Menü schließen', live: 'Live', keywordLegend: 'Schlüsselwörter', functionLegend: 'Funktionen', typeLegend: 'Typen', stringLegend: 'Zeichenfolgen', interactiveFooter: 'PREACT · Interaktiv', autoPlay: 'Auto-Play', sortVisual: 'Visualisierung der Sortierung', easy: 'Einfach', medium: 'Mittel', advanced: 'Fortgeschritten', decreaseNodes: 'Knoten verringern', increaseNodes: 'Knoten erhöhen', decreaseEdges: 'Kanten verringern', increaseEdges: 'Kanten erhöhen' });
Object.assign(COPY.ar, { labEyebrow: 'علوم حاسوب تفاعلية', libraryEyebrow: 'فهرس الخوارزميات', siteLanguageTitle: 'لغة الموقع', openMenu: 'فتح القائمة', closeMenu: 'إغلاق القائمة', live: 'مباشر', keywordLegend: 'كلمات محجوزة', functionLegend: 'دوال', typeLegend: 'أنواع', stringLegend: 'نصوص', interactiveFooter: 'PREACT · تفاعلي', autoPlay: 'Auto-Play', sortVisual: 'تصوّر ترتيب المصفوفة', easy: 'سهل', medium: 'متوسط', advanced: 'متقدم', decreaseNodes: 'تقليل العُقد', increaseNodes: 'زيادة العُقد', decreaseEdges: 'تقليل الحواف', increaseEdges: 'زيادة الحواف' });
const DIFFICULTY_KEY = { 'קל': 'easy', 'בינוני': 'medium', 'מתקדם': 'advanced' };
const COMPLEXITY_SUFFIX = { he: 'בממוצע', en: 'on average', es: 'en promedio', fr: 'en moyenne', de: 'im Durchschnitt', ar: 'في المتوسط' };
const PALETTE_LOCALE = {
  he: { aurora: 'אורורה', ocean: 'אוקיינוס', sunset: 'שקיעה', mono: 'מונוכרום' },
  en: { aurora: 'Aurora', ocean: 'Ocean', sunset: 'Sunset', mono: 'Monochrome' },
  es: { aurora: 'Aurora', ocean: 'Océano', sunset: 'Atardecer', mono: 'Monocromo' },
  fr: { aurora: 'Aurore', ocean: 'Océan', sunset: 'Coucher de soleil', mono: 'Monochrome' },
  de: { aurora: 'Aurora', ocean: 'Ozean', sunset: 'Sonnenuntergang', mono: 'Monochrom' },
  ar: { aurora: 'الشفق', ocean: 'المحيط', sunset: 'الغروب', mono: 'أحادي اللون' },
};

// A small curated code library, indexed by language and algorithm.
const SNIPPETS = {
  python: {
    dijkstra: ['import heapq', 'def dijkstra(graph, start):', '    dist = {v: float("inf") for v in graph}', '    dist[start] = 0', '    queue = [(0, start)]', '    while queue:', '        cost, node = heapq.heappop(queue)', '        if cost != dist[node]: continue', '        for neighbor, weight in graph[node]:', '            new_cost = cost + weight', '            if new_cost < dist[neighbor]:', '                dist[neighbor] = new_cost', '                heapq.heappush(queue, (new_cost, neighbor))', '    return dist'],
    bfs: ['from collections import deque', 'def bfs(graph, start):', '    visited = {start}', '    queue = deque([start])', '    while queue:', '        node = queue.popleft()', '        yield node', '        for neighbor in graph[node]:', '            if neighbor not in visited:', '                visited.add(neighbor)', '                queue.append(neighbor)'],
    dfs: ['def dfs(graph, start):', '    visited = set()', '    stack = [start]', '    while stack:', '        node = stack.pop()', '        if node in visited: continue', '        visited.add(node)', '        yield node', '        stack.extend(reversed(graph[node]))'],
    bubble: ['def bubble_sort(values):', '    n = len(values)', '    for end in range(n - 1, 0, -1):', '        swapped = False', '        for i in range(end):', '            if values[i] > values[i + 1]:', '                values[i], values[i + 1] = values[i + 1], values[i]', '                swapped = True', '        if not swapped: break', '    return values'],
    insertion: ['def insertion_sort(values):', '    for i in range(1, len(values)):', '        current = values[i]', '        j = i - 1', '        while j >= 0 and values[j] > current:', '            values[j + 1] = values[j]', '            j -= 1', '        values[j + 1] = current', '    return values'],
    selection: ['def selection_sort(values):', '    n = len(values)', '    for i in range(n):', '        smallest = i', '        for j in range(i + 1, n):', '            if values[j] < values[smallest]:', '                smallest = j', '        values[i], values[smallest] = values[smallest], values[i]', '    return values'],
  },
  javascript: {
    dijkstra: ['function dijkstra(graph, start) {', '  const dist = new Map();', '  for (const v of graph.keys()) dist.set(v, Infinity);', '  dist.set(start, 0);', '  const queue = [[0, start]];', '  while (queue.length) {', '    queue.sort((a, b) => a[0] - b[0]);', '    const [cost, node] = queue.shift();', '    if (cost !== dist.get(node)) continue;', '    for (const [next, weight] of graph.get(node)) {', '      const candidate = cost + weight;', '      if (candidate < dist.get(next)) {', '        dist.set(next, candidate);', '        queue.push([candidate, next]);', '      }', '    }', '  }', '  return dist;', '}'],
    bfs: ['function* bfs(graph, start) {', '  const visited = new Set([start]);', '  const queue = [start];', '  while (queue.length) {', '    const node = queue.shift();', '    yield node;', '    for (const next of graph.get(node)) {', '      if (!visited.has(next)) {', '        visited.add(next);', '        queue.push(next);', '      }', '    }', '  }', '}'],
    dfs: ['function* dfs(graph, start) {', '  const visited = new Set();', '  const stack = [start];', '  while (stack.length) {', '    const node = stack.pop();', '    if (visited.has(node)) continue;', '    visited.add(node);', '    yield node;', '    stack.push(...graph.get(node).slice().reverse());', '  }', '}'],
    bubble: ['function bubbleSort(values) {', '  for (let end = values.length - 1; end > 0; end--) {', '    let swapped = false;', '    for (let i = 0; i < end; i++) {', '      if (values[i] > values[i + 1]) {', '        [values[i], values[i + 1]] = [values[i + 1], values[i]];', '        swapped = true;', '      }', '    }', '    if (!swapped) break;', '  }', '  return values;', '}'],
    insertion: ['function insertionSort(values) {', '  for (let i = 1; i < values.length; i++) {', '    const current = values[i];', '    let j = i - 1;', '    while (j >= 0 && values[j] > current) {', '      values[j + 1] = values[j];', '      j--;', '    }', '    values[j + 1] = current;', '  }', '  return values;', '}'],
    selection: ['function selectionSort(values) {', '  for (let i = 0; i < values.length; i++) {', '    let smallest = i;', '    for (let j = i + 1; j < values.length; j++) {', '      if (values[j] < values[smallest]) smallest = j;', '    }', '    [values[i], values[smallest]] = [values[smallest], values[i]];', '  }', '  return values;', '}'],
  },
  cpp: {
    dijkstra: ['vector<int> dijkstra(Graph& graph, int start) {', '  vector<int> dist(graph.size(), INF);', '  priority_queue<Pair, vector<Pair>, greater<>> queue;', '  dist[start] = 0;', '  queue.push({0, start});', '  while (!queue.empty()) {', '    auto [cost, node] = queue.top(); queue.pop();', '    if (cost != dist[node]) continue;', '    for (auto [next, weight] : graph[node]) {', '      if (cost + weight < dist[next]) {', '        dist[next] = cost + weight;', '        queue.push({dist[next], next});', '      }', '    }', '  }', '  return dist;', '}'],
    bfs: ['void bfs(Graph& graph, int start) {', '  vector<bool> seen(graph.size());', '  queue<int> q;', '  seen[start] = true; q.push(start);', '  while (!q.empty()) {', '    int node = q.front(); q.pop();', '    visit(node);', '    for (int next : graph[node]) {', '      if (!seen[next]) {', '        seen[next] = true; q.push(next);', '      }', '    }', '  }', '}'],
    dfs: ['void dfs(Graph& graph, int start) {', '  vector<bool> seen(graph.size());', '  stack<int> pending; pending.push(start);', '  while (!pending.empty()) {', '    int node = pending.top(); pending.pop();', '    if (seen[node]) continue;', '    seen[node] = true; visit(node);', '    for (int next : graph[node])', '      if (!seen[next]) pending.push(next);', '  }', '}'],
    bubble: ['void bubbleSort(vector<int>& a) {', '  for (int end = a.size() - 1; end > 0; --end) {', '    bool swapped = false;', '    for (int i = 0; i < end; ++i) {', '      if (a[i] > a[i + 1]) {', '        swap(a[i], a[i + 1]); swapped = true;', '      }', '    }', '    if (!swapped) break;', '  }', '}'],
    insertion: ['void insertionSort(vector<int>& a) {', '  for (int i = 1; i < a.size(); ++i) {', '    int current = a[i], j = i - 1;', '    while (j >= 0 && a[j] > current) {', '      a[j + 1] = a[j]; --j;', '    }', '    a[j + 1] = current;', '  }', '}'],
    selection: ['void selectionSort(vector<int>& a) {', '  for (int i = 0; i < a.size(); ++i) {', '    int smallest = i;', '    for (int j = i + 1; j < a.size(); ++j)', '      if (a[j] < a[smallest]) smallest = j;', '    swap(a[i], a[smallest]);', '  }', '}'],
  },
  java: {
    dijkstra: ['int[] dijkstra(List<List<int[]>> graph, int start) {', '  int[] dist = new int[graph.size()];', '  Arrays.fill(dist, Integer.MAX_VALUE);', '  dist[start] = 0;', '  PriorityQueue<int[]> q = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));', '  q.add(new int[]{0, start});', '  while (!q.isEmpty()) {', '    int[] item = q.poll(); int cost = item[0], node = item[1];', '    if (cost != dist[node]) continue;', '    for (int[] edge : graph.get(node)) {', '      int next = edge[0], candidate = cost + edge[1];', '      if (candidate < dist[next]) {', '        dist[next] = candidate; q.add(new int[]{candidate, next});', '      }', '    }', '  }', '  return dist;', '}'],
    bfs: ['void bfs(List<List<Integer>> graph, int start) {', '  boolean[] seen = new boolean[graph.size()];', '  Queue<Integer> queue = new ArrayDeque<>();', '  seen[start] = true; queue.add(start);', '  while (!queue.isEmpty()) {', '    int node = queue.remove(); visit(node);', '    for (int next : graph.get(node)) {', '      if (!seen[next]) {', '        seen[next] = true; queue.add(next);', '      }', '    }', '  }', '}'],
    dfs: ['void dfs(List<List<Integer>> graph, int start) {', '  boolean[] seen = new boolean[graph.size()];', '  Deque<Integer> stack = new ArrayDeque<>();', '  stack.push(start);', '  while (!stack.isEmpty()) {', '    int node = stack.pop();', '    if (seen[node]) continue;', '    seen[node] = true; visit(node);', '    for (int next : graph.get(node))', '      if (!seen[next]) stack.push(next);', '  }', '}'],
    bubble: ['void bubbleSort(int[] values) {', '  for (int end = values.length - 1; end > 0; end--) {', '    boolean swapped = false;', '    for (int i = 0; i < end; i++) {', '      if (values[i] > values[i + 1]) {', '        int temp = values[i]; values[i] = values[i + 1]; values[i + 1] = temp;', '        swapped = true;', '      }', '    }', '    if (!swapped) break;', '  }', '}'],
    insertion: ['void insertionSort(int[] values) {', '  for (int i = 1; i < values.length; i++) {', '    int current = values[i], j = i - 1;', '    while (j >= 0 && values[j] > current) {', '      values[j + 1] = values[j]; j--;', '    }', '    values[j + 1] = current;', '  }', '}'],
    selection: ['void selectionSort(int[] values) {', '  for (int i = 0; i < values.length; i++) {', '    int smallest = i;', '    for (int j = i + 1; j < values.length; j++)', '      if (values[j] < values[smallest]) smallest = j;', '    int temp = values[i]; values[i] = values[smallest]; values[smallest] = temp;', '  }', '}'],
  },
  go: {
    dijkstra: ['func dijkstra(graph [][]Edge, start int) []int {', '  dist := make([]int, len(graph))', '  used := make([]bool, len(graph))', '  for i := range dist { dist[i] = math.MaxInt }', '  dist[start] = 0', '  for range graph {', '    node := -1', '    for i := range dist { if !used[i] && (node < 0 || dist[i] < dist[node]) { node = i } }', '    if node < 0 || dist[node] == math.MaxInt { break }', '    used[node] = true', '    for _, edge := range graph[node] {', '      if dist[node]+edge.Weight < dist[edge.To] {', '        dist[edge.To] = dist[node] + edge.Weight', '      }', '    }', '  }', '  return dist', '}'],
    bfs: ['func bfs(graph [][]int, start int) {', '  seen := make([]bool, len(graph))', '  queue := []int{start}', '  seen[start] = true', '  for len(queue) > 0 {', '    node := queue[0]; queue = queue[1:]', '    visit(node)', '    for _, next := range graph[node] {', '      if !seen[next] { seen[next] = true; queue = append(queue, next) }', '    }', '  }', '}'],
    dfs: ['func dfs(graph [][]int, start int) {', '  seen := make([]bool, len(graph))', '  stack := []int{start}', '  for len(stack) > 0 {', '    node := stack[len(stack)-1]; stack = stack[:len(stack)-1]', '    if seen[node] { continue }', '    seen[node] = true; visit(node)', '    for i := len(graph[node])-1; i >= 0; i-- {', '      if !seen[graph[node][i]] { stack = append(stack, graph[node][i]) }', '    }', '  }', '}'],
    bubble: ['func bubbleSort(values []int) {', '  for end := len(values)-1; end > 0; end-- {', '    swapped := false', '    for i := 0; i < end; i++ {', '      if values[i] > values[i+1] {', '        values[i], values[i+1] = values[i+1], values[i]', '        swapped = true', '      }', '    }', '    if !swapped { break }', '  }', '}'],
    insertion: ['func insertionSort(values []int) {', '  for i := 1; i < len(values); i++ {', '    current, j := values[i], i-1', '    for j >= 0 && values[j] > current {', '      values[j+1] = values[j]; j--', '    }', '    values[j+1] = current', '  }', '}'],
    selection: ['func selectionSort(values []int) {', '  for i := range values {', '    smallest := i', '    for j := i+1; j < len(values); j++ {', '      if values[j] < values[smallest] { smallest = j }', '    }', '    values[i], values[smallest] = values[smallest], values[i]', '  }', '}'],
  },
  rust: {
    dijkstra: ['fn dijkstra(graph: &[Vec<(usize, usize)>], start: usize) -> Vec<usize> {', '  let mut dist = vec![usize::MAX; graph.len()];', '  let mut used = vec![false; graph.len()];', '  dist[start] = 0;', '  for _ in 0..graph.len() {', '    let node = (0..graph.len()).filter(|&i| !used[i])', '      .min_by_key(|&i| dist[i]);', '    let Some(node) = node else { break };', '    if dist[node] == usize::MAX { break; }', '    used[node] = true;', '    for &(next, weight) in &graph[node] {', '      if dist[node] + weight < dist[next] {', '        dist[next] = dist[node] + weight;', '      }', '    }', '  }', '  dist', '}'],
    bfs: ['fn bfs(graph: &[Vec<usize>], start: usize) {', '  let mut seen = vec![false; graph.len()];', '  let mut queue = VecDeque::from([start]);', '  seen[start] = true;', '  while let Some(node) = queue.pop_front() {', '    visit(node);', '    for &next in &graph[node] {', '      if !seen[next] { seen[next] = true; queue.push_back(next); }', '    }', '  }', '}'],
    dfs: ['fn dfs(graph: &[Vec<usize>], start: usize) {', '  let mut seen = vec![false; graph.len()];', '  let mut stack = vec![start];', '  while let Some(node) = stack.pop() {', '    if seen[node] { continue; }', '    seen[node] = true; visit(node);', '    for &next in graph[node].iter().rev() {', '      if !seen[next] { stack.push(next); }', '    }', '  }', '}'],
    bubble: ['fn bubble_sort(values: &mut [i32]) {', '  for end in (1..values.len()).rev() {', '    let mut swapped = false;', '    for i in 0..end {', '      if values[i] > values[i + 1] {', '        values.swap(i, i + 1); swapped = true;', '      }', '    }', '    if !swapped { break; }', '  }', '}'],
    insertion: ['fn insertion_sort(values: &mut [i32]) {', '  for i in 1..values.len() {', '    let mut j = i;', '    while j > 0 && values[j] < values[j - 1] {', '      values.swap(j, j - 1); j -= 1;', '    }', '  }', '}'],
    selection: ['fn selection_sort(values: &mut [i32]) {', '  for i in 0..values.len() {', '    let smallest = (i..values.len())', '      .min_by_key(|&j| values[j]).unwrap();', '    values.swap(i, smallest);', '  }', '}'],
  },
  csharp: {
    dijkstra: ['int[] Dijkstra(List<List<(int Node, int Weight)>> graph, int start) {', '  int[] dist = Enumerable.Repeat(int.MaxValue, graph.Count).ToArray();', '  dist[start] = 0;', '  var queue = new PriorityQueue<int, int>();', '  queue.Enqueue(start, 0);', '  while (queue.TryDequeue(out int node, out int cost)) {', '    if (cost != dist[node]) continue;', '    foreach (var (next, weight) in graph[node]) {', '      int candidate = cost + weight;', '      if (candidate < dist[next]) {', '        dist[next] = candidate;', '        queue.Enqueue(next, candidate);', '      }', '    }', '  }', '  return dist;', '}'],
    bfs: ['void BFS(List<List<int>> graph, int start) {', '  var seen = new HashSet<int> { start };', '  var queue = new Queue<int>();', '  queue.Enqueue(start);', '  while (queue.Count > 0) {', '    int node = queue.Dequeue(); Visit(node);', '    foreach (int next in graph[node]) {', '      if (seen.Add(next)) {', '        queue.Enqueue(next);', '      }', '    }', '  }', '}'],
    dfs: ['void DFS(List<List<int>> graph, int start) {', '  var seen = new HashSet<int>();', '  var stack = new Stack<int>();', '  stack.Push(start);', '  while (stack.Count > 0) {', '    int node = stack.Pop();', '    if (!seen.Add(node)) continue;', '    Visit(node);', '    foreach (int next in graph[node].AsEnumerable().Reverse()) {', '      if (!seen.Contains(next)) stack.Push(next);', '    }', '  }', '}'],
    bubble: ['void BubbleSort(int[] values) {', '  for (int end = values.Length - 1; end > 0; end--) {', '    bool swapped = false;', '    for (int i = 0; i < end; i++) {', '      if (values[i] > values[i + 1]) {', '        (values[i], values[i + 1]) = (values[i + 1], values[i]);', '        swapped = true;', '      }', '    }', '    if (!swapped) break;', '  }', '}'],
    insertion: ['void InsertionSort(int[] values) {', '  for (int i = 1; i < values.Length; i++) {', '    int current = values[i];', '    int j = i - 1;', '    while (j >= 0 && values[j] > current) {', '      values[j + 1] = values[j];', '      j--;', '    }', '    values[j + 1] = current;', '  }', '}'],
    selection: ['void SelectionSort(int[] values) {', '  for (int i = 0; i < values.Length; i++) {', '    int smallest = i;', '    for (int j = i + 1; j < values.Length; j++) {', '      if (values[j] < values[smallest]) smallest = j;', '    }', '    (values[i], values[smallest]) = (values[smallest], values[i]);', '  }', '}'],
  },
};
const EXTRA_SNIPPETS = {
  bellmanFord: ['function bellmanFord(graph, start) {', '  const dist = Array(graph.length).fill(Infinity);', '  dist[start] = 0;', '  for (let pass = 0; pass < graph.length - 1; pass++) {', '    let changed = false;', '    for (const edge of graph.edges) {', '      const candidate = dist[edge.a] + edge.weight;', '      if (candidate < dist[edge.b]) {', '        dist[edge.b] = candidate;', '        changed = true;', '      }', '      const reverse = dist[edge.b] + edge.weight;', '      if (reverse < dist[edge.a]) {', '        dist[edge.a] = reverse;', '        changed = true;', '      }', '    }', '    if (!changed) break;', '  }', '  return dist;', '}'],
  floydWarshall: ['function floydWarshall(graph) {', '  const dist = makeDistanceMatrix(graph);', '  for (let k = 0; k < graph.length; k++) {', '    for (let i = 0; i < graph.length; i++) {', '      for (let j = 0; j < graph.length; j++) {', '        const candidate = dist[i][k] + dist[k][j];', '        if (candidate < dist[i][j]) {', '          dist[i][j] = candidate;', '        }', '      }', '    }', '  }', '  return dist;', '}'],
  kruskal: ['function kruskal(graph) {', '  const edges = graph.edges.slice().sort((a, b) => a.weight - b.weight);', '  const parent = makeDisjointSet(graph.length);', '  const tree = [];', '  for (const edge of edges) {', '    const rootA = find(parent, edge.a);', '    const rootB = find(parent, edge.b);', '    if (rootA !== rootB) {', '      parent[rootA] = rootB;', '      tree.push(edge);', '    }', '  }', '  return tree;', '}'],
  prim: ['function prim(graph, start) {', '  const visited = new Set([start]);', '  const tree = [];', '  while (visited.size < graph.length) {', '    let best = null;', '    for (const edge of graph.edges) {', '      const crossing = visited.has(edge.a) !== visited.has(edge.b);', '      if (crossing && (!best || edge.weight < best.weight)) best = edge;', '    }', '    if (!best) break;', '    tree.push(best);', '    visited.add(visited.has(best.a) ? best.b : best.a);', '  }', '  return tree;', '}'],
  astar: ['function aStar(graph, start, goal) {', '  const open = [start];', '  const gScore = Array(graph.length).fill(Infinity);', '  const parent = Array(graph.length).fill(null);', '  gScore[start] = 0;', '  while (open.length) {', '    const current = popLowestEstimate(open, gScore, goal);', '    if (current === goal) break;', '    for (const edge of graph[current]) {', '      const candidate = gScore[current] + edge.weight;', '      if (candidate < gScore[edge.node]) {', '        gScore[edge.node] = candidate;', '        parent[edge.node] = current;', '        open.push(edge.node);', '      }', '    }', '  }', '  return parent;', '}'],
  hungarian: ['function hungarian(cost) {', '  const n = cost.length, u = Array(n + 1).fill(0), v = Array(n + 1).fill(0);', '  const match = Array(n + 1).fill(0), way = Array(n + 1).fill(0);', '  for (let row = 1; row <= n; row++) {', '    match[0] = row;', '    let column = 0;', '    const minValue = Array(n + 1).fill(Infinity), used = Array(n + 1).fill(false);', '    do {', '      used[column] = true;', '      const currentRow = match[column];', '      let delta = Infinity, nextColumn = 0;', '      for (let j = 1; j <= n; j++) {', '        if (!used[j]) {', '          const reduced = cost[currentRow - 1][j - 1] - u[currentRow] - v[j];', '          if (reduced < minValue[j]) { minValue[j] = reduced; way[j] = column; }', '          if (minValue[j] < delta) { delta = minValue[j]; nextColumn = j; }', '        }', '      }', '      for (let j = 0; j <= n; j++) {', '        if (used[j]) { u[match[j]] += delta; v[j] -= delta; }', '        else minValue[j] -= delta;', '      }', '      column = nextColumn;', '    } while (match[column] !== 0);', '    do {', '      const previous = way[column];', '      match[column] = match[previous];', '      column = previous;', '    } while (column !== 0);', '  }', '  return match;', '}'],
  galeShapley: ['function galeShapley(preferences) {', '  const free = Array.from({ length: preferences.length }, (_, i) => i);', '  const partner = Array(preferences.length).fill(-1);', '  const nextChoice = Array(preferences.length).fill(0);', '  while (free.length) {', '    const proposer = free.shift();', '    const receiver = preferences[proposer][nextChoice[proposer]++];', '    if (partner[receiver] === -1) {', '      partner[receiver] = proposer;', '    } else if (prefers(receiver, proposer, partner[receiver])) {', '      free.push(partner[receiver]);', '      partner[receiver] = proposer;', '    } else {', '      free.push(proposer);', '    }', '  }', '  return partner;', '}'],
  binarySearch: ['function binarySearch(values, target) {', '  let low = 0, high = values.length - 1;', '  while (low <= high) {', '    const middle = Math.floor((low + high) / 2);', '    if (values[middle] === target) return middle;', '    if (values[middle] < target) low = middle + 1;', '    else high = middle - 1;', '  }', '  return -1;', '}'],
  linearSearch: ['function linearSearch(values, target) {', '  for (let i = 0; i < values.length; i++) {', '    if (values[i] === target) return i;', '  }', '  return -1;', '}'],
  merge: ['function mergeSort(values) {', '  if (values.length <= 1) return values;', '  const middle = Math.floor(values.length / 2);', '  const left = mergeSort(values.slice(0, middle));', '  const right = mergeSort(values.slice(middle));', '  return merge(left, right);', '}', 'function merge(left, right) {', '  const result = [];', '  while (left.length && right.length) {', '    if (left[0] <= right[0]) result.push(left.shift());', '    else result.push(right.shift());', '  }', '  return result.concat(left, right);', '}'],
  quick: ['function quickSort(values, low = 0, high = values.length - 1) {', '  if (low >= high) return values;', '  const pivot = values[high];', '  let boundary = low;', '  for (let i = low; i < high; i++) {', '    if (values[i] <= pivot) {', '      [values[i], values[boundary]] = [values[boundary], values[i]];', '      boundary++;', '    }', '  }', '  [values[boundary], values[high]] = [values[high], values[boundary]];', '  quickSort(values, low, boundary - 1);', '  quickSort(values, boundary + 1, high);', '  return values;', '}'],
  timsort: ['function timSort(values) {', '  const runs = [];', '  let start = 0;', '  while (start < values.length) {', '    let end = start + 1;', '    const descending = end < values.length && values[end] < values[start];', '    while (end < values.length && (descending ? values[end] < values[end - 1] : values[end] >= values[end - 1])) end++;', '    end = Math.max(end, Math.min(values.length, start + 4));', '    const run = values.slice(start, end);', '    if (descending) run.reverse();', '    binaryInsertionSort(run);', '    runs.push(run);', '    start = end;', '  }', '  while (runs.length > 1) {', '    const left = runs.shift();', '    const right = runs.shift();', '    runs.push(merge(left, right));', '  }', '  return runs[0];', '}'],
  quickselect: ['function quickselect(values, k) {', '  let low = 0, high = values.length - 1;', '  while (low <= high) {', '    const pivot = partition(values, low, high);', '    if (pivot === k) return values[pivot];', '    if (pivot < k) low = pivot + 1;', '    else high = pivot - 1;', '  }', '  return null;', '}'],
};
/** @summary Converts one JavaScript-style pseudocode line into the displayed Python variant. */
function pythonizeExtraLine(source) {
  const indent = source.match(/^\s*/)[0], line = source.trim();
  if (line === '}') return '';
  if (line === '} else {') return `${indent}else:`;
  if (/^}\s*else if \(.*\) \{$/.test(line)) return `${indent}elif ${line.replace(/^}\s*else if \((.*)\) \{$/, '$1')}:`;
  if (line.startsWith('function ')) return line.replace(/^function (\w+)\((.*?)\) \{$/, 'def $1($2):').replace(/\bnull\b/g, 'None');
  let body = line;
  const forOf = body.match(/^for \((?:const|let|var) (\w+) of (.*?)\) \{$/);
  if (forOf) return `${indent}for ${forOf[1]} in ${forOf[2]}:`;
  const counted = body.match(/^for \(let (\w+) = (.*?); \w+ < (.*?); \w+\+\+\) \{$/);
  const inclusive = body.match(/^for \(let (\w+) = (.*?); \w+ <= (.*?); \w+\+\+\) \{$/);
  if (counted || inclusive) {
    const parts = counted || inclusive, stop = inclusive ? `${parts[3]} + 1` : parts[3];
    return `${indent}for ${parts[1]} in range(${parts[2]}, ${stop}):`;
  }
  if (body === 'do {') return `${indent}while True:`;
  body = body.replace(/^function (\w+)\((.*?)\) \{$/, 'def $1($2):');
  body = body.replace(/^else if \((.*)\) \{$/, 'elif $1:').replace(/^if \((.*)\) \{ (.*) \}$/, 'if $1: $2');
  body = body.replace(/^if \((.*)\) (return .*;|.*\.push\(.*\);)$/, 'if $1: $2');
  body = body.replace(/^if \((.*)\) \{$/, 'if $1:').replace(/^while \((.*)\) \{$/, 'while $1:').replace(/^else \{$/, 'else:');
  body = body.replace(/\b(?:const|let|var)\s+/g, '').replace(/\bnull\b/g, 'None').replace(/\bInfinity\b/g, "float('inf')").replace(/\btrue\b/g, 'True').replace(/\bfalse\b/g, 'False');
  body = body.replace(/\b(\w+)\.length\b/g, 'len($1)').replace(/\.push\(/g, '.append(').replace(/\.shift\(\)/g, '.pop(0)');
  body = body.replace(/===/g, '==').replace(/!==/g, '!=').replace(/&&/g, ' and ').replace(/\|\|/g, ' or ').replace(/;\s*/g, '; ').replace(/;$/, '').replace(/\s*\{$/, ':');
  return `${indent}${body}`;
}
const EXTRA_PYTHON = Object.fromEntries(Object.entries(EXTRA_SNIPPETS).map(([id, lines]) => [id, lines.map(pythonizeExtraLine)]));
/** @summary Adapts shared pseudocode syntax to the C# snippets shown in the code panel. */
function csharpizeExtraLine(line) {
  const header = line.match(/^function (\w+)\((.*?)\) \{$/);
  if (header) return `static dynamic ${header[1]}(${header[2].split(',').map((arg) => `dynamic ${arg.trim()}`).join(', ')}) {`;
  return line.replace(/\bconst\s+|\blet\s+/g, 'var ').replace(/\.length\b/g, '.Length').replace(/\.push\(/g, '.Add(').replace(/\bInfinity\b/g, 'double.PositiveInfinity').replace(/===/g, '==').replace(/!==/g, '!=');
}
const EXTRA_CSHARP = Object.fromEntries(Object.entries(EXTRA_SNIPPETS).map(([id, lines]) => [id, lines.map(csharpizeExtraLine)]));
/** @summary Adds lightweight TypeScript annotations to the shared pseudocode samples. */
const EXTRA_TYPESCRIPT = Object.fromEntries(Object.entries(EXTRA_SNIPPETS).map(([id, lines]) => [id, lines.map((line) => {
  const header = line.match(/^function (\w+)\((.*?)\) \{$/);
  return header ? `function ${header[1]}(${header[2].split(',').map((arg) => `${arg.trim()}: any`).join(', ')}): any {` : line;
})]));
/** @summary Selects the source-code sample for the chosen algorithm and programming language. */
function codeFor(language, algorithm) {
  if (EXTRA_SNIPPETS[algorithm]) {
    const lines = EXTRA_SNIPPETS[algorithm];
    if (language === 'typescript') return EXTRA_TYPESCRIPT[algorithm];
    if (language === 'csharp') return EXTRA_CSHARP[algorithm] || lines;
    if (language === 'python') return EXTRA_PYTHON[algorithm] || lines;
    return lines;
  }
  if (language === 'typescript') return SNIPPETS.javascript[algorithm].map((line) => line.replace('function ', 'function ').replace('values)', 'values: number[])').replace('Map();', 'Map<number, number>();'));
  if (SNIPPETS[language]?.[algorithm]?.length) return SNIPPETS[language][algorithm];
  return SNIPPETS.javascript[algorithm];
}
/** @summary Builds a deterministic undirected graph with the requested node and edge counts. */
function makeEdges(count, edgeCount) {
  const result = [];
  const seen = new Set();
  // Adds an undirected edge only once, including when the ring wraps around.
  const add = (a, b) => {
    const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
    if (a !== b && !seen.has(key) && result.length < edgeCount) {
      seen.add(key);
      result.push({ a, b, weight: ((a * 7 + b * 3) % 9) + 1 });
    }
  };
  for (let i = 0; i < count; i++) add(i, (i + 1) % count);
  for (let gap = 2; gap < count && result.length < edgeCount; gap++) {
    for (let i = 0; i < count && result.length < edgeCount; i++) add(i, (i + gap) % count);
  }
  return result;
}
/** @summary Finds a matching source line so trace frames can highlight the correct code. */
function findCodeLine(lines, pattern, from = 0, fallback = 0) {
  const index = lines.findIndex((line, i) => i >= from && pattern.test(line));
  return index < 0 ? fallback : index;
}
/** @summary Maps each graph-search phase to its line number in the selected language sample. */
function graphCodeLines(algorithm, lines) {
  // Match syntax from several languages to one conceptual step in the trace.
  const entry = findCodeLine(lines, /\b(dijkstra|bfs|dfs)\s*\(/i);
  if (algorithm === 'dijkstra') {
    const source = findCodeLine(lines, /dist\s*(?:\[start\]|\.set\(start)/, entry);
    const init = findCodeLine(lines, /dist.*(?:=|\.fill|\.set\()/, entry, source);
    const outer = findCodeLine(lines, /\bwhile\b|\bfor\b/, source + 1, entry);
    const pop = findCodeLine(lines, /heappop|\.poll\(|\.shift\(|\.popleft\(|\.dequeue\(|\.top\(|\.front\(|queue\[0\]|TryDequeue/, outer, outer);
    const stale = findCodeLine(lines, /\bif\b.*(?:dist|visited|seen|used|cost)/, pop + 1, outer);
    const neighbor = findCodeLine(lines, /\b(?:for|foreach)\b.*(?:graph|adj|edge|neighbor|next)/, Math.max(outer + 1, stale + 1), outer);
    const candidate = findCodeLine(lines, /(?:candidate|new_cost)\s*=|cost\s*\+\s*weight/, neighbor + 1, neighbor);
    const relax = findCodeLine(lines, /\bif\b.*(?:candidate|dist\[|dist\.get|weight|cost\s*\+)/, Math.max(neighbor + 1, candidate + 1), neighbor);
    const update = findCodeLine(lines, /dist\s*(?:\[[^]]+\]\s*=|\.set\()/, relax + 1, relax);
    const enqueue = findCodeLine(lines, /(?:heappush|\.push\(|\.append\(|\.add\(|\.enqueue\(|\.push_back\()/i, Math.max(update, relax) + 1, update);
    const finish = findCodeLine(lines, /\breturn\b|^\s*dist\s*$/, entry + 1, lines.length - 1);
    let container = findCodeLine(lines, /queue/i, entry + 1, -1);
    if (container < 0) container = findCodeLine(lines, /used|visited/i, entry + 1, source);
    const seed = findCodeLine(lines, /(?:\.push|\.add|\.enqueue)\([^)]*(?:start|\b0\b)/i, container + 1, container);
    return { entry, init, source, container, seed, outer, pop, stale, neighbor, candidate, relax, update, enqueue, finish };
  }
  const init = findCodeLine(lines, /(?:visited|seen)\s*(?:=|= new|:=|\.add|\[)/, entry + 1, entry);
  const container = findCodeLine(lines, /(?:queue|stack|Deque|VecDeque)\s*(?:=|:=|= new|<|\[)|(?:Queue|Stack)</i, entry + 1, init);
  const outer = findCodeLine(lines, /\bwhile\b|\bfor\s*(?:\(|[A-Za-z_]|range\b)/, Math.max(entry + 1, container + 1), entry);
  const pop = findCodeLine(lines, /(?:\.pop\(|\.shift\(|\.popleft\(|\.dequeue\(|\.remove\(|queue\[0\]|stack\[|stack\.pop\()/i, outer, outer);
  if (algorithm === 'dfs') {
    const nodeCondition = findCodeLine(lines, /\bif\b.*(?:visited|seen|node)/, pop + 1, pop);
    const mark = findCodeLine(lines, /(?:visited|seen).*(?:add|=\s*true|=\s*1)|(?:\.add\()/i, nodeCondition + 1, nodeCondition);
    const visit = findCodeLine(lines, /\byield\b|\bvisit\(/i, Math.max(mark, pop) + 1, mark);
    const neighbor = findCodeLine(lines, /\b(?:for|foreach)\b.*(?:graph|adj|next|neighbor)|(?:stack|pending)\.(?:extend|push)|push_back\(/i, visit + 1, pop);
    const condition = findCodeLine(lines, /\bif\b.*(?:visited|seen|next|neighbor)/i, neighbor + 1, neighbor);
    const push = findCodeLine(lines, /(?:queue|stack|pending|q)\.(?:append|push|add|enqueue|push_back|extend)|\.push\(/i, condition, neighbor);
    const finish = findCodeLine(lines, /\breturn\b/, entry + 1, lines.length - 1);
    const seed = findCodeLine(lines, /(?:\.push|\.add|\.enqueue)\([^)]*(?:start|\b0\b)/i, container + 1, container);
    return { entry, init, container, seed, outer, pop, nodeCondition, neighbor, condition, mark, push, visit, finish };
  }
  const neighbor = findCodeLine(lines, /\b(?:for|foreach)\b.*(?:graph|adj|next|neighbor)/, Math.max(pop + 1, outer + 1), pop);
  const condition = findCodeLine(lines, /\bif\b.*(?:visited|seen|next|neighbor|node)/, neighbor + 1, neighbor);
  const mark = findCodeLine(lines, /(?:visited|seen).*(?:add|=\s*true|=\s*1)|(?:\.add\()/i, condition, condition);
  const push = findCodeLine(lines, /(?:queue|stack|pending|q)\.(?:append|push|add|enqueue|push_back|extend)|\.push\(/i, condition + 1, mark);
  const visit = findCodeLine(lines, /\byield\b|\bvisit\(/, pop, pop);
  const finish = findCodeLine(lines, /\breturn\b/, entry + 1, lines.length - 1);
  const seed = findCodeLine(lines, /(?:\.push|\.add|\.enqueue)\([^)]*(?:start|\b0\b)/i, container + 1, container);
  return { entry, init, container, seed, outer, pop, neighbor, condition, mark, push, visit, finish };
}
/** @summary Simulates BFS, DFS, or Dijkstra and records visual state for each code-line step. */
function makeGraphTrace(algorithm, count, edges, lines, language) {
  if (!['dijkstra', 'bfs', 'dfs'].includes(algorithm)) return makeExtendedGraphTrace(algorithm, count, edges, lines);
  const adjacency = Array.from({ length: count }, () => []);
  edges.forEach((edge) => { adjacency[edge.a].push({ node: edge.b, weight: edge.weight }); adjacency[edge.b].push({ node: edge.a, weight: edge.weight }); });
  adjacency.forEach((items) => items.sort((a, b) => a.node - b.node));
  const map = graphCodeLines(algorithm, lines);
  const frames = [];
  const distance = Array(count).fill(Infinity), parent = Array(count).fill(null), visited = new Set();
  let current = null;
  // Snapshots mutable search state so playback can revisit every source line.
  const emit = (line, active = current, activeEdge = null) => frames.push({ line, current: active, activeEdge, visited: [...visited], distance: [...distance], parent: [...parent] });
  emit(map.entry, null);
  emit(map.init, null);
  if (algorithm === 'dijkstra') {
    if (map.container < map.source) emit(map.container, null);
    distance[0] = 0;
    emit(map.source, null);
    if (map.container >= map.source) emit(map.container, null);
    const queue = [[0, 0]];
    if (map.seed !== map.container) emit(map.seed, null);
    while (queue.length) {
      emit(map.outer);
      queue.sort((a, b) => a[0] - b[0]);
      const [cost, node] = queue.shift();
      current = node;
      emit(map.pop);
      emit(map.stale);
      if (cost !== distance[node] || visited.has(node)) continue;
      visited.add(node);
      for (const edge of adjacency[node]) {
        emit(map.neighbor, current, edge.node);
        const candidate = cost + edge.weight;
        emit(map.candidate, current, edge.node);
        emit(map.relax, current, edge.node);
        if (candidate < distance[edge.node]) {
          distance[edge.node] = candidate;
          parent[edge.node] = node;
          emit(map.update, current, edge.node);
          queue.push([candidate, edge.node]);
          emit(map.enqueue, current, edge.node);
        }
      }
    }
    current = null;
    emit(map.outer, null);
    emit(map.finish, null);
    return frames;
  }
  distance[0] = 0;
  const pending = [0];
  if (algorithm === 'bfs') {
    visited.add(0);
    emit(map.container, null);
    if (map.seed !== map.container) emit(map.seed, null);
    while (pending.length) {
      emit(map.outer);
      current = pending.shift();
      emit(map.pop);
      emit(map.visit);
      for (const edge of adjacency[current]) {
        emit(map.neighbor, current, edge.node);
        emit(map.condition, current, edge.node);
        if (visited.has(edge.node)) continue;
        visited.add(edge.node);
        parent[edge.node] = current;
        distance[edge.node] = distance[current] + 1;
        emit(map.mark, current, edge.node);
        pending.push(edge.node);
        emit(map.push, current, edge.node);
      }
    }
  } else {
    visited.clear();
    emit(map.container, null);
    if (map.seed !== map.container) emit(map.seed, null);
    while (pending.length) {
      emit(map.outer);
      current = pending.pop();
      emit(map.pop);
      emit(map.nodeCondition ?? map.condition);
      if (visited.has(current)) continue;
      visited.add(current);
      emit(map.mark);
      emit(map.visit);
      const neighbors = ['cpp', 'java'].includes(language) ? [...adjacency[current]] : [...adjacency[current]].reverse();
      for (const edge of neighbors) {
        emit(map.neighbor, current, edge.node);
        emit(map.condition, current, edge.node);
        if (visited.has(edge.node)) continue;
        if (parent[edge.node] === null) { parent[edge.node] = current; distance[edge.node] = distance[current] + 1; }
        pending.push(edge.node);
        emit(map.push, current, edge.node);
      }
    }
  }
  current = null;
  emit(map.outer, null);
  emit(map.finish, null);
  return frames;
}
/** @summary Locates the meaningful loop and comparison lines in a sorting snippet. */
function sortCodeLines(kind, lines) {
  const entry = findCodeLine(lines, /(?:bubble|insertion|selection)[_A-Za-z]*\s*\(|(?:def|fn)\s+[a-z_]+\s*\(/i);
  const loops = lines.map((line, index) => /\b(?:for|while)\b/.test(line) ? index : -1).filter((index) => index >= 0 && index > entry);
  const outer = loops[0] ?? entry;
  const inner = loops[1] ?? outer;
  const condition = findCodeLine(lines, /\bif\b.*(?:values|\ba\[)|\bwhile\b.*(?:values|\ba\[)/, inner + 1, inner);
  const swap = findCodeLine(lines, /\.swap\(|\bswap\(|values\[[^]]+\]\s*,\s*values\[|values\[[^]]+\]\s*=\s*values\[|\ba\[[^]]+\]\s*=\s*a\[/, condition + 1, condition);
  const returnLine = findCodeLine(lines, /\breturn\b|^\s*values\s*$/, entry + 1, lines.length - 1);
  return {
    entry, outer, inner, condition, swap, returnLine,
    swapped: findCodeLine(lines, /swapped\s*=|swapped\s*:=/, outer + 1, outer),
    current: findCodeLine(lines, /current\s*=\s*values\[|current,\s*j\s*:=/, outer + 1, outer),
    jInit: findCodeLine(lines, /j\s*=\s*i\s*-\s*1|j\s*:=\s*i\s*-\s*1/, outer + 1, inner),
    shift: findCodeLine(lines, /values\[j\s*\+\s*1\]\s*=\s*values\[j\]|a\[j\s*\+\s*1\]\s*=\s*a\[j\]/, inner + 1, swap),
    decrement: findCodeLine(lines, /j\s*(?:--|-=\s*1|-=\s*1;)/, inner + 1, shift),
    insert: findCodeLine(lines, /values\[j\s*\+\s*1\]\s*=\s*current|a\[j\s*\+\s*1\]\s*=\s*current/, inner + 1, swap),
    smallest: findCodeLine(lines, /smallest\s*=\s*i/, outer + 1, outer),
    updateSmallest: findCodeLine(lines, /smallest\s*=\s*j/, inner + 1, condition),
    breakLine: findCodeLine(lines, /\bbreak\b/, outer + 1, outer),
  };
}
/** @summary Creates an ordered sequence of array states and source lines for simple sorting algorithms. */
function makeSortTrace(kind, size, lines) {
  if (['merge', 'quick', 'timsort', 'quickselect'].includes(kind)) return makeAdvancedSortTrace(kind, size, lines);
  const initial = Array.from({ length: size }, (_, i) => ((i * 47 + 29) % 83) + 14);
  const values = [...initial], trace = [];
  const map = sortCodeLines(kind, lines);
  // Copies the array at each step; later mutations cannot alter earlier frames.
  const emit = (line, active = []) => trace.push({ line, values: [...values], active });
  emit(map.entry);
  if (kind === 'bubble') {
    for (let end = values.length - 1; end > 0; end--) {
      emit(map.outer);
      let swapped = false;
      emit(map.swapped);
      for (let i = 0; i < end; i++) {
        emit(map.inner, [i, i + 1]);
        emit(map.condition, [i, i + 1]);
        if (values[i] > values[i + 1]) {
          [values[i], values[i + 1]] = [values[i + 1], values[i]];
          swapped = true;
          emit(map.swap, [i, i + 1]);
        }
      }
      emit(map.inner);
      if (!swapped) { emit(map.breakLine); break; }
    }
  } else if (kind === 'insertion') {
    for (let i = 1; i < values.length; i++) {
      emit(map.outer, [i]);
      const current = values[i];
      emit(map.current, [i]);
      let j = i - 1;
      emit(map.jInit, [j, i]);
      while (j >= 0) {
        emit(map.inner, [j, j + 1]);
        emit(map.condition, [j, j + 1]);
        if (values[j] <= current) break;
        values[j + 1] = values[j];
        emit(map.shift, [j, j + 1]);
        j--;
        emit(map.decrement, [Math.max(0, j), j + 1]);
      }
      emit(map.inner);
      values[j + 1] = current;
      emit(map.insert, [j + 1, i]);
    }
  } else {
    for (let i = 0; i < values.length; i++) {
      emit(map.outer, [i]);
      let smallest = i;
      emit(map.smallest, [i]);
      for (let j = i + 1; j < values.length; j++) {
        emit(map.inner, [i, j]);
        emit(map.condition, [i, j]);
        if (values[j] < values[smallest]) {
          smallest = j;
          emit(map.updateSmallest, [i, j]);
        }
      }
      emit(map.inner, [i]);
      [values[i], values[smallest]] = [values[smallest], values[i]];
      emit(map.swap, [i, smallest]);
    }
  }
  emit(map.returnLine);
  return trace;
}

/** @summary Simulates binary or linear search and records each comparison for playback. */
function makeSearchTrace(kind, size, lines) {
  const values = Array.from({ length: size }, (_, i) => i * 4 + 11);
  if (kind === 'linearSearch') values[1] += 1;
  const target = values[Math.min(size - 2, Math.floor(size * 0.64))];
  const trace = [];
  // Keeps the source-line lookups concise while allowing a safe fallback line.
  const line = (pattern, fallback = 0) => findCodeLine(lines, pattern, 0, fallback);
  const emit = (codeLine, active = [], found = false) => trace.push({ line: codeLine, values: [...values], active, target, found });
  const entry = line(/function .*Search|def .*search/i);
  const loop = line(/\b(?:while|for)\b/);
  const check = line(/if .*values\[.*(?:===|==)/, loop);
  const update = line(/(?:low\s*=|high\s*=)/, loop);
  const finish = line(/return -1|return -1|return null/);
  emit(entry);
  if (kind === 'binarySearch') {
    let low = 0, high = values.length - 1;
    emit(line(/low\s*=.*high\s*=/, entry + 1));
    while (low <= high) {
      const middle = Math.floor((low + high) / 2);
      emit(loop, [middle]);
      emit(line(/middle\s*=|const middle/), [middle]);
      emit(check, [middle]);
      if (values[middle] === target) { emit(check, [middle], true); break; }
      emit(line(/values\[middle\].*</, check + 1), [middle]);
      if (values[middle] < target) { low = middle + 1; emit(update, [middle]); }
      else { high = middle - 1; emit(findCodeLine(lines, /high\s*=/, update + 1, update), [middle]); }
    }
  } else {
    let found = false;
    for (let i = 0; i < values.length; i++) {
      emit(loop, [i]);
      emit(check, [i]);
      if (values[i] === target) { emit(check, [i], true); found = true; break; }
    }
    if (!found) emit(finish);
  }
  emit(line(/return .*;/, lines.length - 1), [], true);
  return trace;
}

/** @summary Records the recursive or partition-based steps used by advanced sorting visualizations. */
function makeAdvancedSortTrace(kind, size, lines) {
  const original = Array.from({ length: size }, (_, i) => ((i * 47 + 29) % 83) + 14);
  const values = [...original], trace = [];
  // These helpers connect recursive operations to the exact displayed code lines.
  const line = (pattern, fallback = 0, from = 0) => findCodeLine(lines, pattern, from, fallback);
  const emit = (codeLine, active = []) => trace.push({ line: codeLine, values: [...values], active });
  const entry = line(/function .*Sort|function quickselect/i);
  const compare = line(/if .*values\[.*(?:<=|<|>)/, entry + 1);
  if (kind === 'merge') {
    const base = line(/values\.length <= 1/), split = line(/middle\s*=/), mergeLine = line(/return merge\(/), mergeLoop = line(/while \(left\.length/), take = line(/left\[0\].*<=.*right\[0\]/);
    emit(entry);
    // Merges two adjacent sorted slices and records the values copied at each step.
    const mergeRange = (left, right) => {
      const out = [];
      while (left.length && right.length) {
        emit(mergeLoop, [values.indexOf(left[0]), values.indexOf(right[0])]);
        emit(take, [values.indexOf(left[0]), values.indexOf(right[0])]);
        out.push(left[0] <= right[0] ? left.shift() : right.shift());
      }
      return out.concat(left, right);
    };
    // Recursively splits a range until each half can be merged in sorted order.
    const sortRange = (lo, hi) => {
      emit(base, Array.from({ length: hi - lo }, (_, i) => lo + i));
      if (hi - lo <= 1) return values.slice(lo, hi);
      const mid = Math.floor((lo + hi) / 2);
      emit(split, [mid]);
      emit(line(/mergeSort\(values\.slice\(0, middle\)/), [lo, mid]);
      const left = sortRange(lo, mid);
      emit(line(/mergeSort\(values\.slice\(middle\)/), [mid, hi - 1]);
      const right = sortRange(mid, hi);
      emit(mergeLine, [lo, hi - 1]);
      const merged = mergeRange(left, right);
      values.splice(lo, hi - lo, ...merged);
      return merged;
    };
    sortRange(0, values.length);
  } else if (kind === 'quick') {
    const pivotLine = line(/const pivot/), loop = line(/for \(let i = low/), swapLine = line(/values\[i\].*values\[boundary\]/), pivotSwap = findCodeLine(lines, /values\[boundary\].*values\[high\]/), recurse = line(/quickSort\(values, low/);
    emit(entry);
    // Partitions a range around its pivot and then sorts both remaining sides.
    const sortRange = (low, high) => {
      emit(line(/low >= high/), [low, high]);
      if (low >= high) return;
      const pivot = values[high]; let boundary = low;
      emit(pivotLine, [high]);
      for (let i = low; i < high; i++) {
        emit(loop, [i, high]); emit(compare, [i, high]);
        if (values[i] <= pivot) { [values[i], values[boundary]] = [values[boundary], values[i]]; emit(swapLine, [i, boundary]); boundary++; }
      }
      [values[boundary], values[high]] = [values[high], values[boundary]]; emit(pivotSwap, [boundary, high]);
      emit(recurse, [low, boundary - 1]); sortRange(low, boundary - 1);
      emit(line(/quickSort\(values, boundary/), [boundary + 1, high]); sortRange(boundary + 1, high);
    };
    sortRange(0, values.length - 1);
  } else if (kind === 'quickselect') {
    const targetIndex = Math.floor(values.length / 2), partitionLine = line(/partition\(/), condition = line(/pivot === k/), lowLine = line(/pivot < k/), swapLine = findCodeLine(lines, /partition\(/, entry + 1, entry);
    emit(entry);
    let low = 0, high = values.length - 1;
    while (low <= high) {
      emit(line(/while \(low <= high/), [low, high]);
      const pivotValue = values[high]; let boundary = low;
      emit(partitionLine, [high]);
      for (let i = low; i < high; i++) {
        emit(compare, [i, high]);
        if (values[i] <= pivotValue) { [values[i], values[boundary]] = [values[boundary], values[i]]; emit(swapLine, [i, boundary]); boundary++; }
      }
      [values[boundary], values[high]] = [values[high], values[boundary]]; emit(swapLine, [boundary, high]);
      emit(condition, [boundary]);
      if (boundary === targetIndex) break;
      emit(lowLine, [boundary]);
      if (boundary < targetIndex) low = boundary + 1; else high = boundary - 1;
    }
    emit(line(/return values\[pivot\]/), [targetIndex]);
  } else {
    const runLine = line(/while \(start < values\.length/), detect = line(/while \(end < values\.length/), insertion = line(/binaryInsertionSort/), mergeLoop = line(/while \(runs\.length/), merge = line(/runs\.push\(merge/);
    emit(entry); emit(line(/const runs/));
    const runs = [];
    let start = 0;
    while (start < values.length) {
      emit(runLine, [start]);
      let end = start + 1;
      const descending = end < values.length && values[end] < values[start];
      emit(line(/const descending/), [start, end]);
      while (end < values.length && (descending ? values[end] < values[end - 1] : values[end] >= values[end - 1])) { emit(detect, [end - 1, end]); end++; }
      end = Math.max(end, Math.min(values.length, start + 4));
      const run = values.slice(start, end);
      if (descending) { run.reverse(); emit(line(/if \(descending\)/), Array.from({ length: run.length }, (_, j) => start + j)); }
      emit(insertion, Array.from({ length: run.length }, (_, j) => start + j));
      run.sort((a, b) => a - b); values.splice(start, run.length, ...run); runs.push(run); start = end;
    }
    while (runs.length > 1) {
      emit(mergeLoop);
      const left = runs.shift(), right = runs.shift();
      emit(merge);
      const joined = [...left, ...right].sort((a, b) => a - b); runs.push(joined); values.splice(0, values.length, ...runs.flat());
    }
  }
  emit(line(/return values|return runs\[0\]|return values\[pivot\]/, lines.length - 1));
  return trace;
}

/** @summary Creates a repeatable square cost matrix for the matching visualizations. */
function matchingCosts(n) { return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => ((i * 7 + j * 5 + i * j * 3) % 17) + 1)); }
/** @summary Simulates stable matching or assignment and captures every visible decision. */
function makeMatchingTrace(algorithm, count, lines) {
  const n = Math.max(2, Math.floor(count / 2)), cost = matchingCosts(n), trace = [];
  // Source-line lookup and frame capture are shared by both matching algorithms.
  const line = (pattern, fallback = 0) => findCodeLine(lines, pattern, 0, fallback);
  let pairs = [], activePair = null;
  const emit = (codeLine, active = activePair) => trace.push({ line: codeLine, matchPairs: pairs.map((pair) => [...pair]), activePair: active ? [...active] : null, cost });
  const entry = line(/function (hungarian|galeShapley)/);
  emit(entry, null);
  if (algorithm === 'galeShapley') {
    const preferences = cost.map((row) => row.map((_, j) => j).sort((a, b) => row[a] - row[b]));
    const rank = Array.from({ length: n }, (_, receiver) => Array.from({ length: n }, (_, proposer) => ({ proposer, score: (proposer * 5 + receiver * 7 + proposer * receiver) % 13 })).sort((a, b) => a.score - b.score).map((item) => item.proposer));
    const partner = Array(n).fill(-1), nextChoice = Array(n).fill(0), free = Array.from({ length: n }, (_, i) => i);
    // Rebuilds visual pairs from the current receiver-to-proposer assignment.
    const rebuild = () => partner.forEach((proposer, receiver) => { if (proposer >= 0 && !pairs.some(([left]) => left === proposer)) pairs.push([proposer, n + receiver]); });
    while (free.length) {
      emit(line(/while \(free\.length/), null);
      const proposer = free.shift(); emit(line(/proposer = free\.shift/));
      const receiver = preferences[proposer][nextChoice[proposer]++]; activePair = [proposer, n + receiver]; emit(line(/receiver = preferences/));
      emit(line(/if \(partner\[receiver\] === -1/));
      if (partner[receiver] < 0) partner[receiver] = proposer;
      else {
        emit(line(/prefers\(/));
        if (rank[receiver].indexOf(proposer) < rank[receiver].indexOf(partner[receiver])) { free.push(partner[receiver]); partner[receiver] = proposer; }
        else free.push(proposer);
      }
      pairs = []; rebuild(); emit(line(/partner\[receiver\] = proposer/));
    }
  } else {
    const u = Array(n + 1).fill(0), v = Array(n + 1).fill(0), match = Array(n + 1).fill(0), way = Array(n + 1).fill(0);
    for (let row = 1; row <= n; row++) {
      emit(line(/for \(let row/)); match[0] = row; let column = 0;
      const minValue = Array(n + 1).fill(Infinity), used = Array(n + 1).fill(false);
      do {
        used[column] = true; const currentRow = match[column]; let delta = Infinity, nextColumn = 0;
        emit(line(/used\[column\] = true/));
        for (let j = 1; j <= n; j++) {
          activePair = [currentRow - 1, j - 1]; emit(line(/for \(let j = 1/));
          if (!used[j]) {
            const reduced = cost[currentRow - 1][j - 1] - u[currentRow] - v[j];
            if (reduced < minValue[j]) { minValue[j] = reduced; way[j] = column; }
            if (minValue[j] < delta) { delta = minValue[j]; nextColumn = j; }
          }
          emit(line(/minValue\[j\] < delta/));
        }
        for (let j = 0; j <= n; j++) {
          if (used[j]) { u[match[j]] += delta; v[j] -= delta; } else minValue[j] -= delta;
          emit(line(/if \(used\[j\]\)/));
        }
        column = nextColumn;
      } while (match[column] !== 0);
      do {
        const previous = way[column]; match[column] = match[previous]; column = previous;
        pairs = []; for (let j = 1; j <= n; j++) if (match[j]) pairs.push([match[j] - 1, n + j - 1]);
        emit(line(/const previous = way/));
      } while (column !== 0);
    }
  }
  activePair = null; emit(lines.length - 2, null);
  return trace;
}

/** @summary Generates visual frames for graph algorithms beyond the basic BFS, DFS, and Dijkstra set. */
function makeExtendedGraphTrace(algorithm, count, edges, lines) {
  if (algorithm === 'hungarian' || algorithm === 'galeShapley') return makeMatchingTrace(algorithm, count, lines);
  const graph = Array.from({ length: count }, () => []);
  edges.forEach((edge) => { graph[edge.a].push({ node: edge.b, weight: edge.weight }); graph[edge.b].push({ node: edge.a, weight: edge.weight }); });
  const dist = Array(count).fill(Infinity), parent = Array(count).fill(null), visited = new Set(), frames = [];
  let current = null, activeEdge = null;
  // Captures common graph state while the chosen algorithm updates its own structures.
  const emit = (pattern, active = current, edge = null) => {
    const codeLine = typeof pattern === 'number' ? pattern : findCodeLine(lines, pattern, 0, 0);
    frames.push({ line: codeLine, current: active, activeEdge: edge, visited: [...visited], distance: [...dist], parent: [...parent] });
  };
  const code = {
    bellmanFord: { entry: /function bellmanFord/, init: /const dist/, outer: /for \(let pass/, edge: /for \(const edge/, candidate: /const candidate/, condition: /if \(candidate/, update: /dist\[edge\.b\] = candidate/, finish: /return dist/ },
    floydWarshall: { entry: /function floydWarshall/, init: /const dist/, outer: /for \(let k/, middle: /for \(let i/, inner: /for \(let j/, candidate: /const candidate/, condition: /if \(candidate/, update: /dist\[i\]\[j\] = candidate/, finish: /return dist/ },
    kruskal: { entry: /function kruskal/, init: /const edges/, outer: /for \(const edge/, candidate: /const rootA/, condition: /if \(rootA/, update: /parent\[rootA\]/, enqueue: /tree\.push/, finish: /return tree/ },
    prim: { entry: /function prim/, init: /const visited/, outer: /while \(visited/, candidate: /for \(const edge/, condition: /const crossing/, update: /if \(crossing/, enqueue: /tree\.push/, finish: /return tree/ },
    astar: { entry: /function aStar/, init: /const open/, outer: /while \(open/, pop: /const current/, stale: /if \(current === goal/, neighbor: /for \(const edge/, candidate: /const candidate/, relax: /if \(candidate/, update: /gScore\[edge\.node\] = candidate/, enqueue: /open\.push/, finish: /return parent/ },
  }[algorithm];
  if (!code) { emit(lines.length - 1, null); return frames; }
  emit(code.entry, null); emit(code.init, null); dist[0] = 0;
  if (algorithm === 'bellmanFord') {
    for (let pass = 0; pass < count - 1; pass++) {
      emit(code.outer); let changed = false;
      for (const edge of edges) {
        emit(code.edge, edge.a, edge.b); emit(code.candidate, edge.a, edge.b);
        if (dist[edge.a] + edge.weight < dist[edge.b]) { dist[edge.b] = dist[edge.a] + edge.weight; parent[edge.b] = edge.a; changed = true; emit(code.condition, edge.a, edge.b); emit(code.update, edge.a, edge.b); }
        if (dist[edge.b] + edge.weight < dist[edge.a]) { dist[edge.a] = dist[edge.b] + edge.weight; parent[edge.a] = edge.b; changed = true; emit(code.candidate, edge.b, edge.a); emit(code.update, edge.b, edge.a); }
      }
      if (!changed) break;
    }
  } else if (algorithm === 'floydWarshall') {
    const matrix = Array.from({ length: count }, (_, i) => Array.from({ length: count }, (_, j) => i === j ? 0 : Infinity));
    edges.forEach((edge) => { matrix[edge.a][edge.b] = edge.weight; matrix[edge.b][edge.a] = edge.weight; });
    for (let k = 0; k < count; k++) { emit(code.outer, k); for (let i = 0; i < count; i++) { emit(code.middle, i); for (let j = 0; j < count; j++) { emit(code.inner, i, j); emit(code.candidate, i, j); if (matrix[i][k] + matrix[k][j] < matrix[i][j]) { matrix[i][j] = matrix[i][k] + matrix[k][j]; parent[j] = i; emit(code.update, i, j); } } } dist.splice(0, count, ...matrix[0]); }
  } else if (algorithm === 'kruskal') {
    const roots = Array.from({ length: count }, (_, i) => i), find = (value) => { while (roots[value] !== value) { roots[value] = roots[roots[value]]; value = roots[value]; } return value; };
    const sorted = [...edges].sort((a, b) => a.weight - b.weight); emit(code.outer, null);
    for (const edge of sorted) { emit(code.outer, edge.a, edge.b); const a = find(edge.a), b = find(edge.b); emit(code.candidate, edge.a, edge.b); if (a !== b) { roots[a] = b; parent[edge.b] = edge.a; visited.add(edge.a); visited.add(edge.b); dist[edge.b] = edge.weight; emit(code.condition, edge.a, edge.b); emit(code.update, edge.a, edge.b); emit(code.enqueue, edge.a, edge.b); } }
  } else if (algorithm === 'prim') {
    visited.add(0); dist[0] = 0; emit(code.init, 0);
    while (visited.size < count) { emit(code.outer); let best = null; for (const edge of edges) { emit(code.candidate, edge.a, edge.b); const crossing = visited.has(edge.a) !== visited.has(edge.b); if (crossing && (!best || edge.weight < best.weight)) { best = edge; emit(code.update, edge.a, edge.b); } } if (!best) break; const next = visited.has(best.a) ? best.b : best.a, from = visited.has(best.a) ? best.a : best.b; parent[next] = from; dist[next] = best.weight; visited.add(next); emit(code.enqueue, from, next); }
  } else if (algorithm === 'astar') {
    const scale = Math.min(...edges.map((edge) => edge.weight / Math.max(1, Math.abs(edge.a - edge.b))));
    const heuristic = (node) => Math.abs(node - (count - 1)) * scale; const open = [0], gScore = Array(count).fill(Infinity); gScore[0] = 0;
    while (open.length) { emit(code.outer); open.sort((a, b) => gScore[a] + heuristic(a) - gScore[b] - heuristic(b)); current = open.shift(); visited.add(current); dist[current] = gScore[current]; emit(code.pop); emit(code.stale); if (current === count - 1) break; for (const edge of graph[current]) { emit(code.neighbor, current, edge.node); const candidate = gScore[current] + edge.weight; emit(code.candidate, current, edge.node); if (candidate < gScore[edge.node]) { gScore[edge.node] = candidate; dist[edge.node] = candidate; parent[edge.node] = current; open.push(edge.node); emit(code.relax, current, edge.node); emit(code.update, current, edge.node); emit(code.enqueue, current, edge.node); } } }
  }
  emit(code.finish, null);
  return frames;
}

/** @summary Renders a small reusable SVG icon by name. */
function Icon({ name, size = 18 }) {
  const paths = {
    play: <path d="m8 5 11 7-11 7z" fill="currentColor" stroke="none" />,
    pause: <><path d="M8 5h3v14H8z" fill="currentColor" stroke="none" /><path d="M15 5h3v14h-3z" fill="currentColor" stroke="none" /></>,
    reset: <><path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" /><path d="M3 3v5h5" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
    arrow: <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
    spark: <><path d="m12 3 1.5 6 5.5 3-5.5 2.5L12 21l-1.5-6.5L5 12l5.5-3z" /><path d="m19 3 .6 2.4L22 6l-2.4.6L19 9l-.6-2.4L16 6l2.4-.6z" /></>,
    code: <><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" /></>,
    chevron: <path d="m8 10 4 4 4-4" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

/** @summary Draws the graph at the current trace step, including visited nodes and weighted edges. */
function AlgorithmGraph({ algorithm, nodeCount, edgeCount, trace, step, palette, t }) {
  const edges = useMemo(() => makeEdges(nodeCount, edgeCount), [nodeCount, edgeCount]);
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
function CodePanel({ algorithm, language, trace, step, maxStep, t, isRTL }) {
  const lines = codeFor(language, algorithm);
  const targetLine = trace[Math.min(step, trace.length - 1)]?.line ?? 0;
  const activeLineRef = useRef(null);
  useEffect(() => { activeLineRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [targetLine, step]);
  return <section class="panel code-panel">
    <div class="panel-heading code-heading">
      <div class="heading-icon code-icon"><Icon name="code" size={17} /></div>
      <div class="panel-title-group code-title-group" dir={isRTL ? 'rtl' : 'ltr'}><h2>{t('code')}</h2><span class="panel-caption">{algorithm === 'dijkstra' ? 'Dijkstra · shortest path' : ALGORITHMS.find((a) => a.id === algorithm)?.english}</span></div>
      <span class="code-lang-chip"><i />{PROGRAMMING_LANGUAGES.find(([id]) => id === language)?.[1]}</span>
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

// URL fragments give each in-app page its own browser-history entry.
const PAGE_ROUTE = { lab: '#/lab', library: '#/algorithms', pathfinding: '#/pathfinding' };
/** @summary Resolves the current hash fragment to a known in-app page. */
function pageFromHash(hash) {
  return Object.keys(PAGE_ROUTE).find((page) => PAGE_ROUTE[page] === hash) || 'lab';
}

const AUTHOR_NAME = { he: 'עידן דאר', en: 'Idan Dar', es: 'Idan Dar', fr: 'Idan Dar', de: 'Idan Dar', ar: 'إيدان دار' };

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

/** @summary Renders the interactive algorithm lab and owns its playback loop. */
function LabPageView({ t, siteLang, currentAlgorithm, algorithm, nodes, edges, palette, trace, step, maxStep, playing, speed, graphEdges, programLang, autoPlay, isRTL, algoName, algoSummary, complexityText, onReset, onTogglePlay, onSetSpeed, onSetPlaying, onSetStep, onSetNodeCount, onSetEdgeCount, onSetPalette, onSetAutoPlay, onSelectAlgorithm, onOpenLibrary }) {
  return <section class="lab-page">
    <div class="page-intro">
      <div><div class="eyebrow"><span class="eyebrow-line" /> {t('labEyebrow')} <span class="eyebrow-spark">✳</span></div><h1>{t('subtitle')}</h1><p class="intro-sub">{algoSummary(currentAlgorithm)} <span class="intro-dot">·</span> {complexityText(currentAlgorithm)}</p></div>
      <div class="intro-right"><label class="algorithm-picker"><span>{t('selectAlgorithm')}</span><select value={algorithm} onChange={(event) => onSelectAlgorithm(event.currentTarget.value)} aria-label={t('selectAlgorithm')}>{ALGORITHMS.map((item) => <option value={item.id} key={item.id}>{algoName(item)}</option>)}</select><Icon name="chevron" size={13} /></label><span class="complexity-pill">{complexityText(currentAlgorithm)}</span></div>
    </div>
    <div class="workspace-grid">
      <section class="panel stage-panel" key={`visual-${algorithm}`}>
        <div class="panel-heading stage-heading">
          <div class="heading-icon stage-icon"><span class="mini-nodes">••<br />•</span></div>
          <div class="panel-title-group" dir={isRTL ? 'rtl' : 'ltr'}><h2>{currentAlgorithm.group === 'graph' ? t('graph') : currentAlgorithm.group === 'search' ? t('searching') : t('arrayLabel')}</h2><span class="panel-caption">{currentAlgorithm.english}</span></div>
          <span class="live-badge"><i /> {t('live')}</span>
        </div>
        <div class="visual-stage" key={`${algorithm}-${nodes}-${edges}-${palette}`}>
          {algorithm === 'hungarian' || algorithm === 'galeShapley' ? <MatchingStage trace={trace} step={step} algorithm={algorithm} t={t} /> : currentAlgorithm.group === 'graph' ? <AlgorithmGraph algorithm={algorithm} nodeCount={nodes} edgeCount={edges} trace={trace} step={step} palette={palette} t={t} /> : <SortingStage trace={trace} step={step} algorithm={algorithm} t={t} />}
        </div>
        <div class="stage-bottom">
          <div class="stage-metrics"><div class="metric"><span class="metric-icon metric-violet">◉</span><span><small>{currentAlgorithm.group === 'graph' ? t('nodes') : t('arrayLabel')}</small><strong>{nodes}</strong></span></div><div class="metric-separator" /><div class="metric"><span class="metric-icon metric-teal">⌁</span><span><small>{currentAlgorithm.group === 'graph' ? t('edges') : t('comparisons')}</small><strong>{currentAlgorithm.group === 'graph' ? graphEdges.length : maxStep}</strong></span></div></div>
          <div class="run-controls"><button class="reset-button" onClick={onReset} aria-label={t('reset')} title={t('reset')}><Icon name="reset" size={16} /></button><button class="play-button" onClick={onTogglePlay}><Icon name={playing ? 'pause' : 'play'} size={15} />{playing ? t('pause') : t('play')}</button><div class="speed-control"><span>{t('speed')}</span><select value={speed} onChange={(event) => onSetSpeed(Number(event.currentTarget.value))} aria-label={t('speed')}><option value="0.5">0.5×</option><option value="1">1×</option><option value="1.5">1.5×</option><option value="2">2×</option><option value="3">3×</option></select><Icon name="chevron" size={12} /></div><label class="auto-play-control"><input type="checkbox" checked={autoPlay} onChange={(event) => onSetAutoPlay(event.currentTarget.checked)} /><span>{t('autoPlay')}</span></label></div>
        </div>
        <div class="timeline-row"><button onClick={() => { onSetPlaying(false); onSetStep((value) => Math.max(0, value - 1)); }} aria-label={t('stepBack')}>‹</button><input type="range" min="0" max={Math.max(1, maxStep)} value={step} onInput={(event) => { onSetPlaying(false); onSetStep(Number(event.currentTarget.value)); }} /><button onClick={() => { onSetPlaying(false); onSetStep((value) => Math.min(maxStep, value + 1)); }} aria-label={t('stepForward')}>›</button></div>
      </section>
      <div class="right-column">
        <CodePanel algorithm={algorithm} language={programLang} trace={trace} step={step} maxStep={maxStep} t={t} isRTL={isRTL} />
        <section class="panel settings-panel">
          <div class="settings-title-row"><div class="settings-title"><div class="settings-icon"><Icon name="spark" size={17} /></div><div><h2>{t('theme')}</h2><span>{t('palette')} · {t('selectAlgorithm')}</span></div></div><button class="text-button" onClick={onOpenLibrary}>{t('algorithms')} <Icon name="arrow" size={14} /></button></div>
          <div class="settings-grid">
            <div class="setting-control"><div class="control-label"><span>{t('nodes')}</span><div class="stepper"><button onClick={() => onSetNodeCount(nodes - 1)} aria-label={t('decreaseNodes')}>−</button><b>{nodes}</b><button onClick={() => onSetNodeCount(nodes + 1)} aria-label={t('increaseNodes')}>+</button></div></div><input type="range" min="5" max="12" value={nodes} onInput={(event) => onSetNodeCount(Number(event.currentTarget.value))} /></div>
            <div class="setting-control"><div class="control-label"><span>{t('edges')}</span><div class="stepper"><button onClick={() => onSetEdgeCount(edges - 1)} aria-label={t('decreaseEdges')}>−</button><b>{edges}</b><button onClick={() => onSetEdgeCount(edges + 1)} aria-label={t('increaseEdges')}>+</button></div></div><input type="range" min={nodes} max={(nodes * (nodes - 1)) / 2} value={edges} onInput={(event) => onSetEdgeCount(Number(event.currentTarget.value))} /></div>
          </div>
          <div class="palette-row"><span class="palette-label">{t('palette')}</span><div class="palette-options">{PALETTES.map((item) => { const paletteName = PALETTE_LOCALE[siteLang]?.[item.id] || item.name; return <button key={item.id} class={`palette-option ${palette === item.id ? 'palette-selected' : ''}`} onClick={() => onSetPalette(item.id)} aria-label={paletteName} title={paletteName}><span class="swatches">{item.swatches.map((color) => <i style={{ background: color }} key={color} />)}</span>{palette === item.id && <b>✓</b>}</button>; })}</div></div>
        </section>
      </div>
    </div>
    <footer class="page-footer"><span>{t('footer')}</span><span><i class="footer-dot" /> {t('interactiveFooter')}</span></footer>
  </section>;
}

/** @summary Renders the searchable algorithm catalog in the selected site language. */
function AlgorithmLibraryPageView({ t, isRTL, filter, setFilter, programLang, setProgramLang, query, setQuery, visibleAlgorithms, algoName, algoSummary, complexityText, difficultyName, onBack, onSelectAlgorithm }) {
  return <section class="library-page algorithm-library-page">
    <div class="library-top"><div><button class="back-link" onClick={onBack}><Icon name="arrow" size={16} />{t('back')}</button><div class="eyebrow"><span class="eyebrow-line" /> {t('libraryEyebrow')}</div><h1>{t('catalog')}</h1><p>{t('catalogSub')}</p></div><div class="library-stats"><strong>{String(ALGORITHMS.length).padStart(2, '0')}</strong><span>{t('algorithmCount')}</span></div></div>
    <div class="library-tools"><div class="filter-tabs">{[['all', t('all')], ['graph', t('graphs')], ['sort', t('sorts')], ['search', t('searching')]].map(([id, name]) => <button class={filter === id ? 'filter-active' : ''} onClick={() => setFilter(id)} key={id}>{name}<span>{id === 'all' ? ALGORITHMS.length : ALGORITHMS.filter((item) => item.group === id).length}</span></button>)}</div><div class="library-search-tools"><label class="library-language"><span>{'</>'}</span><select value={programLang} onChange={(event) => setProgramLang(event.currentTarget.value)} aria-label={t('language')}>{PROGRAMMING_LANGUAGES.map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select><Icon name="chevron" size={12} /></label><label class="search-box"><Icon name="search" size={17} /><input value={query} onInput={(event) => setQuery(event.currentTarget.value)} placeholder={t('search')} /><kbd>Ctrl K</kbd></label></div></div>
    <div class="algorithm-grid">{visibleAlgorithms.map((item, index) => <button class={`algorithm-card card-${item.color}`} dir={isRTL ? 'rtl' : 'ltr'} onClick={() => onSelectAlgorithm(item.id)} key={item.id} style={{ animationDelay: `${index * 50}ms` }}><span class="card-index">{String(ALGORITHMS.indexOf(item) + 1).padStart(2, '0')}</span><span class="card-icon">{item.icon}</span><span class="card-type">{item.group === 'graph' ? t('graphs') : item.group === 'search' ? t('searching') : t('sorts')}</span><h2>{algoName(item)}</h2><p class="card-english">{item.english}</p><p class="card-summary">{algoSummary(item)}</p><div class="card-meta"><span>{complexityText(item)}</span><span class="difficulty-dot" />{difficultyName(item)}<Icon name="arrow" size={15} /></div><span class="card-glow" /></button>)}</div>
    {visibleAlgorithms.length === 0 && <div class="empty-state">{t('empty')}</div>}
  </section>;
}

/** @summary Coordinates application state, localized shell UI, routes, and page components. */
function App() {
  const [algorithm, setAlgorithm] = useState('dijkstra');
  const [programLang, setProgramLang] = useState('python');
  const [siteLang, setSiteLang] = useState('he');
  const [palette, setPalette] = useState('aurora');
  const [nodes, setNodes] = useState(8);
  const [edges, setEdges] = useState(10);
  const [speed, setSpeed] = useState(1);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState(() => pageFromHash(window.location.hash));
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const currentAlgorithm = ALGORITHMS.find((item) => item.id === algorithm) || ALGORITHMS[0];
  const isRTL = RTL_SITE_LANGUAGES.has(siteLang.split('-')[0].toLowerCase());
  /** @summary Resolves interface text for the selected locale, then uses the Hebrew base copy. */
  const t = (key) => (COPY[siteLang] || COPY.he)[key] || EXTRA_COPY[siteLang]?.[key] || COPY.he[key] || EXTRA_COPY.he[key] || key;
  /** @summary Returns the localized algorithm title used in cards, menus, and selectors. */
  const algoName = (item) => siteLang === 'he' ? item.name : (ALGO_LOCALE[siteLang]?.[item.id]?.[0] || item.english);
  /** @summary Returns the localized algorithm description shown beside its visualization. */
  const algoSummary = (item) => siteLang === 'he' ? item.summary : (ALGO_LOCALE[siteLang]?.[item.id]?.[1] || item.english);
  /** @summary Translates the Hebrew difficulty value stored in the algorithm catalog. */
  const difficultyName = (item) => t(DIFFICULTY_KEY[item.difficulty] || 'medium');
  /** @summary Localizes the only descriptive word attached to an algorithm's complexity. */
  const complexityText = (item) => item.id === 'quickselect' ? `O(n) ${COMPLEXITY_SUFFIX[siteLang]}` : item.complexity;
  /** @summary Pushes an in-app route into browser history without reloading the page. */
  const navigatePage = (nextPage) => {
    if (!PAGE_ROUTE[nextPage]) return;
    setMenuOpen(false);
    if (nextPage === page) return;
    if (nextPage !== 'lab') setPlaying(false);
    try {
      window.history.pushState({ page: nextPage }, '', PAGE_ROUTE[nextPage]);
    } catch {
      // Hash navigation keeps the in-app route working in stricter local-file browsers.
      window.location.hash = PAGE_ROUTE[nextPage];
    }
    setPage(nextPage);
  };
  useEffect(() => {
    document.documentElement.lang = siteLang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [siteLang, isRTL]);
  useEffect(() => {
    // Back, Forward, and manual hash changes all restore the page recorded in the URL.
    const syncPageWithUrl = () => { setPage(pageFromHash(window.location.hash)); setMenuOpen(false); };
    window.addEventListener('popstate', syncPageWithUrl);
    window.addEventListener('hashchange', syncPageWithUrl);
    return () => { window.removeEventListener('popstate', syncPageWithUrl); window.removeEventListener('hashchange', syncPageWithUrl); };
  }, []);
  const graphEdges = useMemo(() => makeEdges(nodes, edges), [nodes, edges]);
  const codeLines = useMemo(() => codeFor(programLang, algorithm), [programLang, algorithm]);
  const traceLines = useMemo(() => EXTRA_SNIPPETS[algorithm] || codeLines, [algorithm, codeLines]);
  const trace = useMemo(() => algorithm === 'hungarian' || algorithm === 'galeShapley'
    ? makeMatchingTrace(algorithm, nodes, traceLines)
    : currentAlgorithm.group === 'sort'
      ? makeSortTrace(algorithm, nodes, traceLines)
      : currentAlgorithm.group === 'search'
        ? makeSearchTrace(algorithm, nodes, traceLines)
        : makeGraphTrace(algorithm, nodes, graphEdges, traceLines, programLang),
  [algorithm, nodes, graphEdges, traceLines, programLang, currentAlgorithm.group]);
  const maxStep = trace.length - 1;
  useEffect(() => { setStep(0); setPlaying(false); }, [algorithm, nodes, edges, programLang]);
  useEffect(() => {
    if (!playing) return undefined;
    if (step >= maxStep) {
      if (autoPlay) {
        // The last frame remains visible during a short pause before the next cycle.
        const restart = window.setTimeout(() => setStep(0), Math.max(350, 900 / speed));
        return () => window.clearTimeout(restart);
      }
      setPlaying(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setStep((value) => Math.min(value + 1, maxStep)), 400 / speed);
    return () => window.clearTimeout(timer);
  }, [playing, autoPlay, step, maxStep, speed]);
  /** @summary Stops the current algorithm animation and returns to its first trace frame. */
  const reset = () => { setPlaying(false); setStep(0); };
  /** @summary Starts or pauses playback, rewinding first when the trace is already complete. */
  const togglePlay = () => {
    if (step >= maxStep) setStep(0);
    setPlaying(!playing);
  };
  /** @summary Clamps the node count and keeps the selected graph edge count valid. */
  const setNodeCount = (value) => {
    const next = Math.max(5, Math.min(12, value));
    setNodes(next);
    setEdges((edgeValue) => Math.max(next, Math.min(edgeValue, (next * (next - 1)) / 2)));
  };
  /** @summary Clamps the edge count between a connected ring and a complete graph. */
  const setEdgeCount = (value) => setEdges(Math.max(nodes, Math.min((nodes * (nodes - 1)) / 2, value)));
  /** @summary Selects an algorithm and returns to the lab page when selection came from the library. */
  const selectAlgorithm = (id) => { setAlgorithm(id); if (page !== 'lab') navigatePage('lab'); else setMenuOpen(false); };
  const visibleAlgorithms = ALGORITHMS.filter((item) => (filter === 'all' || item.group === filter) && `${item.name} ${item.english} ${item.summary} ${algoName(item)} ${algoSummary(item)}`.toLowerCase().includes(query.toLowerCase()));

  return <div class={`app-shell palette-${palette} ${isRTL ? 'is-rtl' : 'is-ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
    <div class="ambient ambient-a" /><div class="ambient ambient-b" />
    <header class="topbar">
      <div class="topbar-left-group" dir="ltr">
        <div class="brand-text" dir={isRTL ? 'rtl' : 'ltr'}><strong>VisuAlgorithms</strong><small>{t('lab')}</small></div>
        <div class="brand-mark brand-mark-path"><svg viewBox="0 0 32 32" aria-hidden="true"><path class="brand-code-mark" d="m11 8-5 4 5 4m4-8-3 8" /><path class="brand-data-mark" d="M19 18v-4m5 4V10" /><path class="brand-target-mark" d="M29 18V6" /><path class="brand-baseline-mark" d="M18 21h12" /></svg></div>
        <button class={`icon-button menu-button ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? t('closeMenu') : t('openMenu')} title={menuOpen ? t('closeMenu') : t('openMenu')}><Icon name={menuOpen ? 'close' : 'menu'} size={20} /></button>
      </div>
      <div class="topbar-center"><span class="breadcrumb-light">VisuAlgorithms</span><span class="breadcrumb-slash">/</span><span>{page === 'library' ? t('catalog') : page === 'pathfinding' ? t('pathfinding') : algoName(currentAlgorithm)}</span></div>
      <div class="topbar-actions"><label class="lang-select-wrap" title={t('language')}><span class="language-glyph">{'</>'}</span><select value={programLang} onChange={(event) => setProgramLang(event.currentTarget.value)} aria-label={t('language')}>{PROGRAMMING_LANGUAGES.map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select><Icon name="chevron" size={14} /></label></div>
    </header>

    <main class="main-content">
      {page === 'lab' && <LabPageView t={t} siteLang={siteLang} currentAlgorithm={currentAlgorithm} algorithm={algorithm} nodes={nodes} edges={edges} palette={palette} trace={trace} step={step} maxStep={maxStep} playing={playing} speed={speed} graphEdges={graphEdges} programLang={programLang} autoPlay={autoPlay} isRTL={isRTL} algoName={algoName} algoSummary={algoSummary} complexityText={complexityText} onReset={reset} onTogglePlay={togglePlay} onSetSpeed={setSpeed} onSetPlaying={setPlaying} onSetStep={setStep} onSetNodeCount={setNodeCount} onSetEdgeCount={setEdgeCount} onSetPalette={setPalette} onSetAutoPlay={setAutoPlay} onSelectAlgorithm={selectAlgorithm} onOpenLibrary={() => navigatePage('library')} />}
      {page === 'pathfinding' && <PathfindingPage key="pathfinding" siteLang={siteLang} onBack={() => navigatePage('lab')} />}
      {page === 'library' && <AlgorithmLibraryPageView t={t} isRTL={isRTL} filter={filter} setFilter={setFilter} programLang={programLang} setProgramLang={setProgramLang} query={query} setQuery={setQuery} visibleAlgorithms={visibleAlgorithms} algoName={algoName} algoSummary={algoSummary} complexityText={complexityText} difficultyName={difficultyName} onBack={() => navigatePage('lab')} onSelectAlgorithm={selectAlgorithm} />}
    </main>

    <div class={`menu-backdrop ${menuOpen ? 'backdrop-visible' : ''}`} onClick={() => setMenuOpen(false)} />
    <aside class={`side-drawer ${menuOpen ? 'drawer-open' : ''}`} aria-hidden={!menuOpen}>
      <div class="drawer-heading"><div class="brand-mark brand-mark-path"><svg viewBox="0 0 32 32" aria-hidden="true"><path class="brand-code-mark" d="m11 8-5 4 5 4m4-8-3 8" /><path class="brand-data-mark" d="M19 18v-4m5 4V10" /><path class="brand-target-mark" d="M29 18V6" /><path class="brand-baseline-mark" d="M18 21h12" /></svg></div><span>{t('mainMenu')}</span><button onClick={() => setMenuOpen(false)} aria-label={t('closeMenu')}><Icon name="close" /></button></div>
      <div class="drawer-section"><small>{t('explore')}</small><button class={`drawer-link ${page === 'lab' ? 'drawer-link-active' : ''}`} onClick={() => navigatePage('lab')}><span>⌘</span>{t('lab')}<Icon name="arrow" size={14} /></button><button class={`drawer-link ${page === 'library' ? 'drawer-link-active' : ''}`} onClick={() => navigatePage('library')}><span>▦</span>{t('algorithms')}<Icon name="arrow" size={14} /></button><button class={`drawer-link ${page === 'pathfinding' ? 'drawer-link-active' : ''}`} onClick={() => navigatePage('pathfinding')}><span>⌁</span>{t('pathfinding')}<Icon name="arrow" size={14} /></button></div>
      <div class="drawer-section"><small>{t('selectAlgorithm')}</small><div class="drawer-algorithms">{ALGORITHMS.map((item) => <button class={algorithm === item.id ? 'drawer-algo-selected' : ''} onClick={() => selectAlgorithm(item.id)} key={item.id}><span class={`drawer-algo-icon algo-${item.color}`}>{item.icon}</span><span>{algoName(item)}<small>{item.english}</small></span>{algorithm === item.id && <i />}</button>)}</div></div>
      <div class="drawer-section site-language-section"><small>{t('siteLanguageTitle')}</small><div class="site-language-grid">{SITE_LANGUAGES.map(([id, flag, name]) => <button class={siteLang === id ? 'site-language-active' : ''} onClick={() => setSiteLang(id)} key={id}><span>{flag}</span>{name}{siteLang === id && <b>✓</b>}</button>)}</div></div>
      <div class="drawer-about"><div class="about-avatar">ע<span>✳</span></div><div><small>{t('about')} · VisuAlgorithms</small><strong>{ABOUT_DESC[siteLang] || ABOUT_DESC.he}</strong><strong>{t('author')} <b>{AUTHOR_NAME[siteLang] || AUTHOR_NAME.en}</b></strong></div><span class="about-heart">✦</span></div>
    </aside>
  </div>;
}

render(<App />, document.getElementById('app'));
