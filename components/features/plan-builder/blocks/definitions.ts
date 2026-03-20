import { BlockType } from '../store/canvasStore';

export interface BlockDefinition {
  type: BlockType;
  label: string;
  defaultCols: number;
  defaultRows: number;
  icon: string; // Lucide icon name or emoji for now
  defaultData: Record<string, unknown>;
  promptHint: string;
}

export const BLOCK_DEFINITIONS: Record<BlockType, BlockDefinition> = {
  perfilTrader: {
    type: 'perfilTrader',
    label: 'Perfil del Trader',
    defaultCols: 2,
    defaultRows: 1,
    icon: 'User',
    promptHint: 'Define tu estilo de trading. ¿Eres conservador, moderado o agresivo? ¿Qué mercados operas?',
    defaultData: {
      rows: [
        { key: 'Estilo', value: 'Conservador · Moderado' },
        { key: 'Tipo Actual', value: 'Day Trader' },
        { key: 'Objetivo', value: 'Day + Scalping' },
        { key: 'Mercado', value: 'Forex — Cripto incorporando' },
        { key: 'Precisión', value: '100%' },
      ],
    },
  },
  metas: {
    type: 'metas',
    label: 'Metas Principales',
    defaultCols: 2,
    defaultRows: 1,
    icon: 'Target',
    promptHint: '¿Cuáles son tus 2-3 metas más importantes como trader? Sé específico.',
    defaultData: {
      items: [
        { text: 'Fondeo: [nombre cuenta] + [mercado objetivo]', bullet: 'arrow' },
        { text: 'Consistencia: rentabilidad y libertad horaria', bullet: 'arrow' },
        { text: 'Futuro: [meta personal a largo plazo]', bullet: 'arrow' },
      ],
    },
  },
  gestionMonetaria: {
    type: 'gestionMonetaria',
    label: 'Gestión Monetaria',
    defaultCols: 4,
    defaultRows: 1,
    icon: 'DollarSign',
    promptHint: '¿Cuánto arriesgas por operación en cada modalidad? ¿Cuántos trades simultáneos te permites?',
    defaultData: {
      table: [
        { modality: 'Day Trading', risk: '1%', max: 'Máx. 2 globales', note: 'Total entre modalidades ≤ 2' },
        { modality: 'Swing Trading', risk: '1.5%', max: 'Máx. 2 globales', note: 'Si hay swing sin cierre: +1 Day/Scalping' },
        { modality: 'Scalping', risk: '0.5%', max: 'Máx. 2 globales', note: 'Ej: 1 Day + 1 Scalping' },
      ],
      alert: '⚠ Regla Global: El máximo global de trades simultáneos es 2.',
    },
  },
  estrategias: {
    type: 'estrategias',
    label: 'Estrategias Activas',
    defaultCols: 4,
    defaultRows: 1,
    icon: 'Zap',
    promptHint: 'Lista tus estrategias. ¿Cuáles están activas? ¿Cuáles estás incorporando?',
    defaultData: {
      table: [
        { name: 'BLUE', modality: 'Day Trading', status: 'active', tp: 'Máx/mín anterior (cuerpo)', notes: 'Mejor estrategia' },
        { name: 'RED', modality: 'Day Trading', status: 'active', tp: 'Máx/mín anterior (cuerpo)', notes: '—' },
        { name: 'RED Scalping', modality: 'Scalping', status: 'incorporating', tp: '—', notes: 'Requiere backtesting' },
      ],
    },
  },
  gestionTrade: {
    type: 'gestionTrade',
    label: 'Gestión del Trade',
    defaultCols: 2,
    defaultRows: 1,
    icon: 'Settings2',
    promptHint: '¿Gestionas tu posición durante el trade (mover SL, cierre parcial)? ¿Qué reglas tienes?',
    defaultData: {
      items: [
        { text: 'Estado actual: Sin gestión de posición activa.', bullet: 'arrow' },
        { text: 'Requisito para cambio: Tras 1-2 revisiones, si se detecta patrón en contra, analizar e implementar de forma controlada.', bullet: 'arrow' },
      ],
    },
  },
  sesiones: {
    type: 'sesiones',
    label: 'Sesiones',
    defaultCols: 1,
    defaultRows: 2,
    icon: 'Clock',
    promptHint: '¿En qué horarios operas? ¿Hay momentos en que NO operas?',
    defaultData: {
      items: [
        { label: 'Day Trading', value: 'Toda sesión EEUU + Cierre de Londres' },
        { label: 'Scalping', value: 'Primeras 2hs EEUU — dejar al terminar' },
      ],
    },
  },
  entradas: {
    type: 'entradas',
    label: 'Entradas',
    defaultCols: 2,
    defaultRows: 1,
    icon: 'LogIn',
    promptHint: '¿Entras a mercado o con límite? ¿Qué reglas tienes para tus entradas?',
    defaultData: {
      items: [
        { text: 'Estado actual: Solo entradas a mercado.', bullet: 'arrow' },
        { text: 'Incorporación de Limit: 25 trades en backtesting + reglas claras antes de live.', bullet: 'arrow' },
        { text: 'Monitoreo: Tras 1-2 revisiones, si hay patrón beneficioso, backtestearlo antes de implementar.', bullet: 'arrow' },
      ],
    },
  },
  reglasGenerales: {
    type: 'reglasGenerales',
    label: 'Reglas Generales',
    defaultCols: 2,
    defaultRows: 1,
    icon: 'AlertTriangle',
    promptHint: '¿Qué reglas absolutas tienes? Las de tipo NO HACER son tan importantes como las de hacer.',
    defaultData: {
      items: [
        { text: 'No ejecutar trades antes de noticias de alto impacto.', bullet: 'x' },
        { text: 'Cerca del cierre de viernes: no operar salvo certeza de cierre previo.', bullet: 'x' },
        { text: 'No operar si estás enfermo, desmotivado o con problemas personales.', bullet: 'x' },
        { text: 'Máximo 2 trades simultáneos globales.', bullet: 'arrow' },
      ],
    },
  },
  procesoRevision: {
    type: 'procesoRevision',
    label: 'Proceso de Revisión',
    defaultCols: 2,
    defaultRows: 1,
    icon: 'Search',
    promptHint: '¿Con qué frecuencia revisas tus resultados? ¿Qué analizas en cada revisión?',
    defaultData: {
      table: [
        { type: 'Trades', freq: 'Cada 10 trades o 1 mes', activity: 'Revisar ejecuciones, conclusiones y mejoras' },
        { type: 'Backtesting', freq: 'Cada 30–45 días', activity: 'Pulir operativas, testear activos/temporalidades' },
        { type: 'Livetesting', freq: 'Cada 45 días', activity: 'Revisar trades no ejecutados en journal' },
      ],
    },
  },
  objetivos: {
    type: 'objetivos',
    label: 'Objetivos',
    defaultCols: 2,
    defaultRows: 1,
    icon: 'Flag',
    promptHint: '¿Cuáles son tus objetivos concretos para este trimestre/año?',
    defaultData: {
      items: [
        { text: 'Preparar trades de especialización cripto', bullet: 'arrow' },
        { text: 'Aprobar examen de especialización cripto', bullet: 'arrow' },
        { text: 'Seguir puliendo operativas de Green, Red y Blue', bullet: 'arrow' },
        { text: 'Ganar experiencia con riesgo del 1%', bullet: 'arrow' },
        { text: 'Integrar herramientas de AI al trading', bullet: 'arrow' },
        { text: 'Explorar oportunidades en DeFi', bullet: 'arrow' },
      ],
    },
  },
  reglaEstrategia: {
    type: 'reglaEstrategia',
    label: 'Reglas de Estrategia',
    defaultCols: 2,
    defaultRows: 2,
    icon: 'ShieldCheck',
    promptHint: 'Define las reglas completas de esta estrategia. ¿Qué condiciones deben cumplirse para entrar? ¿Qué te hace descartar el setup?',
    defaultData: {
      sections: [
        { label: 'Condiciones de Entrada', items: [{ text: 'Ej: Pullback a EMA 20', bullet: 'arrow' }] },
        { label: 'HTF / Descartes Automáticos', items: [{ text: 'Ej: Contra tendencia D1', bullet: 'x' }] },
      ],
      parameters: [
        { key: 'EMA', value: '20' },
        { key: 'RR mínimo', value: '1:2' },
      ],
    },
  },
  checklistPreSesion: {
    type: 'checklistPreSesion',
    label: 'Checklist Pre-Sesión',
    defaultCols: 2,
    defaultRows: 1,
    icon: 'ListCheck',
    promptHint: '¿Qué haces antes de cada sesión para prepararte psicológicamente?',
    defaultData: {
      items: [
        { text: 'Lista de seguimiento completada durante sesión de Londres.', checked: false },
        { text: 'Alarmas configuradas en puntos clave.', checked: false },
        { text: 'Setup dibujado: entrada, SL y TP marcados.', checked: false },
        { text: 'Estado emocional anotado en el journal.', checked: false },
      ],
    },
  },
  learning: {
    type: 'learning',
    label: 'Learning / Backtesting',
    defaultCols: 2,
    defaultRows: 1,
    icon: 'BookOpen',
    promptHint: '¿Cuánto tiempo dedicas a aprender? ¿Qué métodos usas para mejorar?',
    defaultData: {
      backtesting: [
        '4 días a la semana mínimo',
        '6 sesiones por semana',
        'Alternar backtesting VISTO y OCULTO',
      ],
      formation: [
        'Progresar en curso principal',
        'Aprender QuantConnect / algo trading',
        'Implementar herramientas de AI',
      ],
    },
  },
  preguntasIteraciones: {
    type: 'preguntasIteraciones',
    label: 'Preguntas para Próximas Iteraciones',
    defaultCols: 4,
    defaultRows: 1,
    icon: 'MessageSquareQuestion',
    promptHint: 'Estas preguntas te ayudan a evolucionar tu plan. Edítalas o añade nuevas.',
    defaultData: {
      questions: [
        '¿Cuánto tiempo real puedo dedicar cada día sin que afecte mi vida personal?',
        '¿Me siento más cómodo con más o menos oportunidades?',
        '¿Prefiero tomar decisiones rápido o tener más tiempo?',
        '¿Tolero períodos largos en operación o trades cortos?',
        '¿Busco excusas para entrar o para no entrar?',
        '¿Qué condiciones del mercado me generan más duda?',
        '¿Qué estrategia me da mayor % de acierto?',
        '¿En qué estrategia me siento más seguro?',
        '¿Tengo identificada alguna situación técnica de pérdida?',
        '¿Tengo identificada alguna situación psicológica de pérdida?',
        '¿Qué R:R es más realista para mi estilo?',
        '¿Qué R:R me hace sentir más cómodo?',
        '¿Qué condiciones previas se repiten en mis mejores resultados?',
        '¿En qué estrategia me dominan más las emociones?',
        '¿Qué tipo de entrada me da más control: limit o mercado?',
        '¿Me siento cómodo con la reversión o continuación?',
        '¿Estoy perdiendo oportunidades por ser demasiado exigente?',
        'Si solo pudiera quedarme con 1setup, ¿cuál sería?',
      ],
    },
  },
  cover: {
    type: 'cover',
    label: 'Portada',
    defaultCols: 4,
    defaultRows: 2,
    icon: 'FileText',
    promptHint: 'Esta es la portada de tu plan. Rellena tus métricas reales.',
    defaultData: {
      title: 'TRADING PLAN',
      version: '2.0',
      lastRevision: 'MARZO 2026',
      stats: [
        { label: 'P&L Total', value: '+$XX.XX' },
        { label: 'Ratio de Acierto', value: 'XX%' },
        { label: 'Promedio R:R', value: 'X.X' },
        { label: 'Mejor Estrategia', value: '[NAME]' },
      ],
    },
  },
  watchlist: {
    type: 'watchlist',
    label: 'Watchlist',
    defaultCols: 2,
    defaultRows: 1,
    icon: 'Eye',
    promptHint: 'Lista los activos que estás siguiendo y por qué.',
    defaultData: {
      items: [
        { ticker: 'EURUSD', rationale: 'Setup BLUE en 4H consolidado', alert: true },
        { ticker: 'BTCUSD', rationale: 'Incorporando cripto, observando', alert: false },
      ],
    },
  },
  journalEntry: {
    type: 'journalEntry',
    label: 'Journal Entry',
    defaultCols: 2,
    defaultRows: 2,
    icon: 'PenTool',
    promptHint: 'Registra los detalles de un trade específico.',
    defaultData: {
      date: '',
      ticker: '',
      strategy: '',
      entry: '',
      sl: '',
      tp: '',
      result: '',
      rr: '',
      emotion: 5,
      good: '',
      improve: '',
      notes: '',
    },
  },
};
