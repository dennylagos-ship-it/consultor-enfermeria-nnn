/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { 
  HeartPulse, 
  ListChecks, 
  Sparkles, 
  Search, 
  Copy, 
  BookOpen, 
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  CopyCheck,
  Database,
  ChevronDown,
  ChevronUp,
  X,
  FileText
} from 'lucide-react';
import { Diagnosis, NocOutcome, NicIntervention } from './types';
import { DIAGNOSES, NOC_OUTCOMES, NIC_INTERVENTIONS, NANDA_DOMAINS, findBestNoc, findBestNic } from './data';

// Class Component Error Boundary to catch and display any React runtime crashes on screen
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };
  props: ErrorBoundaryProps;
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 border-2 border-red-500 rounded-2xl m-4 space-y-4 font-sans max-w-2xl mx-auto mt-12 shadow-lg">
          <h2 className="text-red-700 font-extrabold text-lg flex items-center gap-2">
            <span className="text-xl animate-bounce">⚠️</span>
            Se produjo un error en la aplicación (React Crash)
          </h2>
          <p className="text-xs text-red-650 font-semibold">
            Detalle técnico del error:
          </p>
          <pre className="p-4 bg-slate-900 text-red-400 rounded-xl text-xs overflow-auto font-mono max-h-60 whitespace-pre-wrap leading-relaxed">
            {this.state.error?.toString() || 'Error desconocido'}
          </pre>
          <pre className="p-4 bg-slate-900 text-slate-300 rounded-xl text-[10px] overflow-auto font-mono max-h-60 whitespace-pre-wrap leading-tight">
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white font-bold rounded-xl text-xs active:scale-95 transition-all shadow-md shadow-red-200 cursor-pointer"
          >
            Recargar Aplicación
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // Toggle landing page with instructions
  const [showLanding, setShowLanding] = useState<boolean>(true);

  // Scroll to top when switching between landing/instruction screen and main workspace
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [showLanding]);

  // Mode selection for left column
  const [nandaMode, setNandaMode] = useState<'ai_analizer' | 'catalog' | 'domains'>('ai_analizer');
  
  // Input for symptom analyzer
  const [symptomInput, setSymptomInput] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Main mapping result (active plan workspace)
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isMappingLoading, setIsMappingLoading] = useState<boolean>(false);
  
  // Checkbox selections inside active workspace
  const [chosenFactors, setChosenFactors] = useState<string[]>([]);
  const [chosenIndicators, setChosenIndicators] = useState<string[]>([]);
  const [chosenActivities, setChosenActivities] = useState<string[]>([]);
  const [clinicalNote, setClinicalNote] = useState<string>('');
  const [copiedNote, setCopiedNote] = useState<boolean>(false);

  // Domain Explorer states (Accordion structure)
  const [expandedDomainCode, setExpandedDomainCode] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  // Unified global NANDA Search States (left column)
  const [nandaSearchQuery, setNandaSearchQuery] = useState<string>('');
  const [useAiNanda, setUseAiNanda] = useState<boolean>(true);
  const [isNandaLoading, setIsNandaLoading] = useState<boolean>(false);
  const [customNandaResults, setCustomNandaResults] = useState<Diagnosis[] | null>(null);

  // Inline search states inside the NOC Card (right column)
  const [inlineNocSearchQuery, setInlineNocSearchQuery] = useState<string>('');
  const [useAiNoc, setUseAiNoc] = useState<boolean>(true);
  const [isInlineNocLoading, setIsInlineNocLoading] = useState<boolean>(false);
  const [inlineNocResults, setInlineNocResults] = useState<NocOutcome[] | null>(null);

  // Inline search states inside the NIC Card (right column)
  const [inlineNicSearchQuery, setInlineNicSearchQuery] = useState<string>('');
  const [useAiNic, setUseAiNic] = useState<boolean>(true);
  const [isInlineNicLoading, setIsInlineNicLoading] = useState<boolean>(false);
  const [inlineNicResults, setInlineNicResults] = useState<NicIntervention[] | null>(null);

  // 100% Offline client-side scoring algorithm
  const getClientFallbackAnalysis = (symptoms: string) => {
    const cleanQuery = symptoms.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 2);

    let bestDiag = DIAGNOSES[0];
    let maxScore = -1;

    for (const diag of DIAGNOSES) {
      let score = 0;
      
      // Exact code match check
      if (cleanQuery.includes(diag.code)) {
        score += 1000;
      }

      const cleanName = diag.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const cleanDef = diag.definition.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      // Count word matches
      for (const word of queryWords) {
        if (cleanName.includes(word)) score += 15;
        if (cleanDef.includes(word)) score += 3;
        if (diag.relatedFactors) {
          for (const factor of diag.relatedFactors) {
            const cleanFactor = factor.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (cleanFactor.includes(word)) score += 8;
          }
        }
      }

      if (score > maxScore) {
        maxScore = score;
        bestDiag = diag;
      }
    }

    const isNocInvalid = !bestDiag.defaultNocCode || 
      bestDiag.defaultNocCode === "Not specified in source" || 
      bestDiag.defaultNocCode === "N/A" || 
      bestDiag.defaultNocCode === "Not Provided in Source";
      
    const isNicInvalid = !bestDiag.defaultNicCode || 
      bestDiag.defaultNicCode === "Not specified in source" || 
      bestDiag.defaultNicCode === "N/A" || 
      bestDiag.defaultNicCode === "Not Provided in Source";

    const matchedNoc = isNocInvalid 
      ? findBestNoc(bestDiag.name, bestDiag.definition) 
      : (NOC_OUTCOMES.find(n => n.code === bestDiag.defaultNocCode) || NOC_OUTCOMES[0]);

    const matchedNic = isNicInvalid 
      ? findBestNic(bestDiag.name, bestDiag.definition) 
      : (NIC_INTERVENTIONS.find(n => n.code === bestDiag.defaultNicCode) || NIC_INTERVENTIONS[0]);

    return {
      nandaCode: bestDiag.code,
      nandaName: bestDiag.name,
      definition: bestDiag.definition,
      relatedFactors: diagRelatedFactors(bestDiag),
      nocCode: matchedNoc.code,
      nocName: matchedNoc.name,
      nocIndicators: matchedNoc.indicators || [],
      nicCode: matchedNic.code,
      nicName: matchedNic.name,
      nicActivities: matchedNic.activities || [],
      justification: `Asociación offline realizada mediante análisis semántico de síntomas coincidente con el diagnóstico NANDA ${bestDiag.code} (${bestDiag.name}).`
    };
  };

  const diagRelatedFactors = (diag: Diagnosis) => {
    return diag.relatedFactors && diag.relatedFactors.length > 0 
      ? diag.relatedFactors 
      : ['Presencia de factores de riesgo o estado clínico relacionado'];
  };

  // Main symptom mapping runner
  const executeAnalysis = async (customPrompt?: string) => {
    const promptToUse = customPrompt || symptomInput;
    if (!promptToUse.trim()) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setCopiedNote(false);

    // Setup an 8-second timeout controller for UX reliability (prevents infinite loading)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      try { controller.abort(); } catch(e) {}
    }, 8000);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: promptToUse })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('API server error response');
      }

      const data = await response.json();
      setAnalysisResult(data);
      
      // Auto select factors, indicators and activities
      if (data.relatedFactors) {
        setChosenFactors([data.relatedFactors[0] || '']);
      }
      if (data.nocIndicators) {
        setChosenIndicators(data.nocIndicators.map((ind: any) => ind.code));
      }
      if (data.nicActivities) {
        setChosenActivities(data.nicActivities.slice(0, 3));
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn('Backend API failed or timed out, running offline client analyzer fallback:', error);
      const fallbackData = getClientFallbackAnalysis(promptToUse);
      setAnalysisResult(fallbackData);
      
      if (fallbackData.relatedFactors) {
        setChosenFactors([fallbackData.relatedFactors[0] || '']);
      }
      if (fallbackData.nocIndicators) {
        setChosenIndicators(fallbackData.nocIndicators.map((ind: any) => ind.code));
      }
      if (fallbackData.nicActivities) {
        setChosenActivities(fallbackData.nicActivities.slice(0, 3));
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Manual NANDA catalog search execution
  const handleNandaSearch = async () => {
    if (!nandaSearchQuery.trim()) {
      setCustomNandaResults(null);
      return;
    }
    setIsNandaLoading(true);
    try {
      if (useAiNanda) {
        const response = await fetch('/api/search-taxonomy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: nandaSearchQuery, type: 'nanda' })
        });
        if (!response.ok) throw new Error('API search error');
        const data = await response.json();
        if (data.results) {
          const mapped = data.results.map((item: any, idx: number) => {
            const bestN = findBestNoc(item.name, item.definition || '');
            const bestI = findBestNic(item.name, item.definition || '');
            return {
              id: `custom-nanda-${idx}-${Date.now()}`,
              code: item.code,
              name: item.name,
              definition: item.definition || 'Sin definición',
              relatedFactors: item.relatedFactors || [],
              defaultNocCode: bestN.code,
              defaultNicCode: bestI.code
            };
          });
          setCustomNandaResults(mapped);
        } else {
          setCustomNandaResults([]);
        }
      } else {
        const q = nandaSearchQuery.toLowerCase();
        const localMatched = DIAGNOSES.filter(item => 
          item.name.toLowerCase().includes(q) || 
          item.code.includes(q) || 
          item.definition.toLowerCase().includes(q)
        );
        setCustomNandaResults(localMatched);
      }
    } catch (err) {
      console.warn('NANDA Search API failed, using client fallback filter:', err);
      const q = nandaSearchQuery.toLowerCase();
      const localMatched = DIAGNOSES.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.code.includes(q) || 
        item.definition.toLowerCase().includes(q)
      );
      setCustomNandaResults(localMatched);
    } finally {
      setIsNandaLoading(false);
    }
  };

  // Inline NOC search execution
  const handleInlineNocSearch = async () => {
    if (!inlineNocSearchQuery.trim()) return;
    setIsInlineNocLoading(true);
    try {
      if (useAiNoc) {
        const response = await fetch('/api/search-taxonomy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: inlineNocSearchQuery, type: 'noc' })
        });
        if (!response.ok) throw new Error('API NOC search error');
        const data = await response.json();
        setInlineNocResults(data.results || []);
      } else {
        const q = inlineNocSearchQuery.toLowerCase();
        const localMatched = NOC_OUTCOMES.filter(item => 
          item.name.toLowerCase().includes(q) || 
          item.code.includes(q) || 
          item.definition.toLowerCase().includes(q)
        );
        setInlineNocResults(localMatched);
      }
    } catch (err) {
      console.warn('Inline NOC search API failed, using local filter:', err);
      const q = inlineNocSearchQuery.toLowerCase();
      const localMatched = NOC_OUTCOMES.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.code.includes(q) || 
        item.definition.toLowerCase().includes(q)
      );
      setInlineNocResults(localMatched);
    } finally {
      setIsInlineNocLoading(false);
    }
  };

  // Inline NIC search execution
  const handleInlineNicSearch = async () => {
    if (!inlineNicSearchQuery.trim()) return;
    setIsInlineNicLoading(true);
    try {
      if (useAiNic) {
        const response = await fetch('/api/search-taxonomy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: inlineNicSearchQuery, type: 'nic' })
        });
        if (!response.ok) throw new Error('API NIC search error');
        const data = await response.json();
        setInlineNicResults(data.results || []);
      } else {
        const q = inlineNicSearchQuery.toLowerCase();
        const localMatched = NIC_INTERVENTIONS.filter(item => 
          item.name.toLowerCase().includes(q) || 
          item.code.includes(q) ||
          item.activities.some(act => act.toLowerCase().includes(q))
        );
        setInlineNicResults(localMatched);
      }
    } catch (err) {
      console.warn('Inline NIC search API failed, using local filter:', err);
      const q = inlineNicSearchQuery.toLowerCase();
      const localMatched = NIC_INTERVENTIONS.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.code.includes(q) ||
        item.activities.some(act => act.toLowerCase().includes(q))
      );
      setInlineNicResults(localMatched);
    } finally {
      setIsInlineNicLoading(false);
    }
  };

  // Populates the workspace when selecting a NANDA diagnosis
  const selectDiagnosisFromSearch = async (diag: Diagnosis) => {
    // Scroll right column workspace into view on mobile
    const el = document.getElementById('consult-workspace');
    if (el) el.scrollIntoView({ behavior: 'smooth' });

    const isNocInvalid = !diag.defaultNocCode || 
      diag.defaultNocCode === "Not specified in source" || 
      diag.defaultNocCode === "N/A" || 
      diag.defaultNocCode === "Not Provided in Source";
      
    const isNicInvalid = !diag.defaultNicCode || 
      diag.defaultNicCode === "Not specified in source" || 
      diag.defaultNicCode === "N/A" || 
      diag.defaultNicCode === "Not Provided in Source";

    if (isNocInvalid || isNicInvalid) {
      setIsMappingLoading(true);
      setAnalysisResult(null); // Show skeleton loader
      try {
        const response = await fetch('/api/get-nanda-mapping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nandaCode: diag.code, nandaName: diag.name })
        });
        if (!response.ok) throw new Error('API mapping error');
        const data = await response.json();
        const mapping = data.mapping;

        setAnalysisResult({
          nandaCode: diag.code,
          nandaName: diag.name,
          definition: diag.definition,
          relatedFactors: diagRelatedFactors(diag),
          nocCode: mapping.nocCode,
          nocName: mapping.nocName,
          nocIndicators: mapping.nocIndicators || [],
          nicCode: mapping.nicCode,
          nicName: mapping.nicName,
          nicActivities: mapping.nicActivities || [],
          justification: mapping.justification || `Asociación de cuidados recomendada por la inteligencia artificial.`
        });

        setChosenFactors(diag.relatedFactors && diag.relatedFactors.length > 0 ? [diag.relatedFactors[0]] : ['Presencia de factores relacionados clínicos']);
        if (mapping.nocIndicators) {
          setChosenIndicators(mapping.nocIndicators.map((i: any) => i.code));
        } else {
          setChosenIndicators([]);
        }
        if (mapping.nicActivities) {
          setChosenActivities(mapping.nicActivities.slice(0, 3));
        } else {
          setChosenActivities([]);
        }
      } catch (err) {
        console.warn('API get-nanda-mapping failed, using local similarity fallback:', err);
        const bestNoc = findBestNoc(diag.name, diag.definition);
        const bestNic = findBestNic(diag.name, diag.definition);

        setAnalysisResult({
          nandaCode: diag.code,
          nandaName: diag.name,
          definition: diag.definition,
          relatedFactors: diagRelatedFactors(diag),
          nocCode: bestNoc.code,
          nocName: bestNoc.name,
          nocIndicators: bestNoc.indicators || [],
          nicCode: bestNic.code,
          nicName: bestNic.name,
          nicActivities: bestNic.activities || [],
          justification: `Asociación local offline mediante coincidencia de palabras clave por faltar conexión o límite de IA.`
        });

        setChosenFactors(diag.relatedFactors && diag.relatedFactors.length > 0 ? [diag.relatedFactors[0]] : ['Presencia de factores relacionados clínicos']);
        setChosenIndicators((bestNoc.indicators || []).map(i => i.code));
        setChosenActivities((bestNic.activities || []).slice(0, 3));
      } finally {
        setIsMappingLoading(false);
      }
      return;
    }

    // Direct match if codes are valid in static data
    const matchedNoc = NOC_OUTCOMES.find(n => n.code === diag.defaultNocCode);
    const matchedNic = NIC_INTERVENTIONS.find(n => n.code === diag.defaultNicCode);

    setAnalysisResult({
      nandaCode: diag.code,
      nandaName: diag.name,
      definition: diag.definition,
      relatedFactors: diagRelatedFactors(diag),
      nocCode: diag.defaultNocCode,
      nocName: matchedNoc?.name || 'Resultado por definir',
      nocIndicators: matchedNoc?.indicators || [],
      nicCode: diag.defaultNicCode,
      nicName: matchedNic?.name || 'Intervención por definir',
      nicActivities: matchedNic?.activities || [],
      justification: `Seleccionado directamente del catálogo de diagnósticos NANDA [Código: ${diag.code}].`
    });

    setChosenFactors(diag.relatedFactors && diag.relatedFactors.length > 0 ? [diag.relatedFactors[0]] : ['Presencia de factores relacionados clínicos']);
    if (matchedNoc) {
      setChosenIndicators(matchedNoc.indicators.map(i => i.code));
    } else {
      setChosenIndicators([]);
    }
    if (matchedNic) {
      setChosenActivities(matchedNic.activities.slice(0, 3));
    } else {
      setChosenActivities([]);
    }
  };

  // Apply swapped NOC outcome
  const applyInlineNoc = (noc: NocOutcome) => {
    setAnalysisResult((prev: any) => ({
      ...prev,
      nocCode: noc.code,
      nocName: noc.name,
      nocIndicators: noc.indicators || []
    }));
    setChosenIndicators((noc.indicators || []).map(i => i.code));
    setInlineNocResults(null);
    setInlineNocSearchQuery('');
  };

  // Apply swapped NIC intervention
  const applyInlineNic = (nic: NicIntervention) => {
    setAnalysisResult((prev: any) => ({
      ...prev,
      nicCode: nic.code,
      nicName: nic.name,
      nicActivities: nic.activities || []
    }));
    setChosenActivities((nic.activities || []).slice(0, 3));
    setInlineNicResults(null);
    setInlineNicSearchQuery('');
  };

  // Live clinical note builder
  useEffect(() => {
    if (!analysisResult) return;

    const indicatorsStr = analysisResult.nocIndicators
      ? analysisResult.nocIndicators
          .filter((ind: any) => chosenIndicators.includes(ind.code))
          .map((ind: any) => ind.name)
          .join(', ')
      : '';

    const activitiesStr = chosenActivities.map(act => `- ${act}`).join('\n');

    const note = `DIAGNÓSTICO NANDA: ${analysisResult.nandaName} [${analysisResult.nandaCode}]
Definición: ${analysisResult.definition}
Factores Relacionados / Riesgo: ${chosenFactors.join(', ')}

RESULTADO NOC EVALUADO: ${analysisResult.nocName} [${analysisResult.nocCode}]
Indicadores de evaluación seleccionados: ${indicatorsStr}

INTERVENCIÓN NIC PLANIFICADA: ${analysisResult.nicName} [${analysisResult.nicCode}]
Actividades de enfermería planificadas:
${activitiesStr}

Justificación del plan: ${analysisResult.justification}`;

    setClinicalNote(note);
  }, [analysisResult, chosenFactors, chosenIndicators, chosenActivities]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(clinicalNote);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  // Expand domain and class accordion helper
  const handleDomainHeaderClick = (domainCode: string) => {
    if (expandedDomainCode === domainCode) {
      setExpandedDomainCode(null);
    } else {
      setExpandedDomainCode(domainCode);
    }
    setSelectedClass(null);
  };

  // Safeguard default values to render cards statically without crashing when analysisResult is null
  const defaultWorkspaceData = analysisResult || {
    nandaCode: '00000',
    nandaName: 'Sin diagnóstico activo',
    definition: 'Por favor, inicie un análisis de síntomas o seleccione un diagnóstico en el catálogo.',
    relatedFactors: ['Factores clínicos por definir'],
    nocCode: '0000',
    nocName: 'Resultado por definir',
    nocIndicators: [],
    nicCode: '0000',
    nicName: 'Intervención por definir',
    nicActivities: [],
    justification: 'Por favor, inicie una consulta para rellenar este plan.'
  };

  return (
    <ErrorBoundary>
      {showLanding ? (
        <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col relative overflow-hidden">
          {/* Sleek background decoration */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>

          {/* Landing Header */}
          <header className="py-6 px-8 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-lg shadow-indigo-600/30">
                NNN
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">Consultor Clínico</p>
                <h1 className="text-sm font-extrabold tracking-tight">Taxonomías NANDA-I, NOC & NIC</h1>
              </div>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Taxonomía 2024-2026 Activa
            </span>
          </header>

          {/* Landing Body */}
          <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 flex flex-col justify-center relative z-10 space-y-12">
            
            {/* Hero Section */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-xl text-[10px] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Impulsado por Inteligencia Artificial y Respaldo Local
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-indigo-100 to-slate-400 bg-clip-text text-transparent">
                Consultor Clínico de Enfermería NNN
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Diseña, consulta y valida tus planes de cuidados de enfermería de manera integral y ágil. Vincula síntomas con diagnósticos NANDA, resultados NOC e intervenciones NIC al instante.
              </p>
            </div>

            {/* Core Instruction Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* STEP 1 */}
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 p-6 rounded-3xl space-y-3 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">
                  01
                </div>
                <h3 className="font-extrabold text-sm text-slate-200">Indicar Síntomas o Buscar Códigos</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Describe los síntomas de tu paciente en lenguaje natural (ej. <i>"sudoración excesiva"</i>), busca directamente por código NANDA, o explora las clases del árbol taxonómico completo.
                </p>
              </div>

              {/* STEP 2 */}
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 p-6 rounded-3xl space-y-3 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                  02
                </div>
                <h3 className="font-extrabold text-sm text-slate-200">Mapeo Automático de Cuidados</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  La plataforma (vía Gemini IA o su base de datos local) generará al instante el diagnóstico NANDA, el resultado esperado (NOC) y la intervención de enfermería (NIC) más adecuados.
                </p>
              </div>

              {/* STEP 3 */}
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 p-6 rounded-3xl space-y-3 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  03
                </div>
                <h3 className="font-extrabold text-sm text-slate-200">Personalización e Intercambio Inline</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Selecciona los factores relacionados o actividades que apliquen a tu paciente. ¿Quieres cambiar el NOC o el NIC sugerido? Usa los buscadores internos para realizar un <b>intercambio (swap)</b> inmediato.
                </p>
              </div>

              {/* STEP 4 */}
              <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 p-6 rounded-3xl space-y-3 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-sm">
                  04
                </div>
                <h3 className="font-extrabold text-sm text-slate-200">Copia la Nota de Evolución</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A medida que personalizas tu plan, la plataforma compila una nota clínica estructurada en formato estándar. Cópiala con un solo clic para pegarla en tu sistema de historia clínica.
                </p>
              </div>

            </div>

            {/* Database Info & CTA */}
            <div className="flex flex-col items-center space-y-6 pt-4">
              <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
                <span className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700"><b>277</b> Diagnósticos NANDA</span>
                <span className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700"><b>612</b> Resultados NOC</span>
                <span className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700"><b>614</b> Intervenciones NIC</span>
              </div>

              <button
                onClick={() => setShowLanding(false)}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl text-xs transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-2 group font-sans"
              >
                Comenzar Consulta de Cuidados
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

          </main>

          {/* Footer */}
          <footer className="py-6 border-t border-white/5 text-center text-[10px] text-slate-500 relative z-10">
            Enfermería NNN • Soporte Offline & Asistente Gemini Activos
          </footer>
        </div>
      ) : (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col relative">
        
        {/* Premium Glassmorphism Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 py-4 px-6 md:px-10 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-40 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-lg shadow-indigo-600/20">
              NNN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Consultor Clínico de Cuidados</p>
              </div>
              <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">
                Plataforma Taxonómica NNN <span className="text-slate-400 font-medium text-xs">2024-2026</span>
              </h1>
            </div>
          </div>

          {/* Database statistics and offline badge */}
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <button
              onClick={() => setShowLanding(true)}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-indigo-100 flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Ver Instrucciones
            </button>

            <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-600">
              <span>277 NANDA</span>
              <span className="text-slate-300">•</span>
              <span>612 NOC</span>
              <span className="text-slate-300">•</span>
              <span>614 NIC</span>
            </div>

            <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-emerald-100 flex items-center gap-1.5 shadow-sm whitespace-nowrap">
              <Database className="w-3.5 h-3.5" />
              Base de Datos Offline Lista
            </span>
          </div>
        </header>

        {/* Main split-screen panel */}
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Query tools (col-span-5) */}
          <section className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-6 flex flex-col">
            <div>
              <h2 className="text-base font-extrabold text-slate-800">1. Selector de Consulta</h2>
              <p className="text-xs text-slate-500 mt-0.5">Elige el método para buscar y mapear el diagnóstico clínico.</p>
            </div>

            {/* Mode Selector Buttons */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
              <button
                onClick={() => setNandaMode('ai_analizer')}
                className={`flex-1 py-2 rounded-xl text-[11px] md:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  nandaMode === 'ai_analizer'
                    ? 'bg-white text-indigo-650 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Sintomatología
              </button>
              <button
                onClick={() => setNandaMode('catalog')}
                className={`flex-1 py-2 rounded-xl text-[11px] md:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  nandaMode === 'catalog'
                    ? 'bg-white text-indigo-650 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                Catálogo
              </button>
              <button
                onClick={() => setNandaMode('domains')}
                className={`flex-1 py-2 rounded-xl text-[11px] md:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  nandaMode === 'domains'
                    ? 'bg-white text-indigo-650 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Dominios
              </button>
            </div>

            {/* Mode-specific Query content - rendered statically to prevent extension insertBefore bugs */}
            <div className="flex-1">
              
              {/* VIEW: SYMPTOM ANALYZER */}
              <div className={nandaMode === 'ai_analizer' ? "block" : "hidden"}>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Describir Sintomatología</label>
                    <textarea
                      rows={5}
                      value={symptomInput}
                      onChange={(e) => setSymptomInput(e.target.value)}
                      placeholder="Describa libremente los síntomas del paciente, signos vitales o cuadro clínico general (ej: 'paciente refiere disnea al esfuerzo, ruidos sibilantes bilaterales, fatiga y taquipnea leve')...."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all leading-relaxed"
                    />
                  </div>

                  <button
                    onClick={() => executeAnalysis()}
                    disabled={isAnalyzing || !symptomInput.trim()}
                    className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-bold text-xs hover:bg-indigo-700 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Mapeando síntomas en base de datos...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Analizar & Vincular Cuidados (IA/Offline)
                      </>
                    )}
                  </button>

                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Casos Clínicos Frecuentes</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Disnea, fatiga extrema y ruidos respiratorios sibilantes',
                        'Temperatura de 39°C, enrojecimiento y secreción en herida',
                        'Ansiedad extrema, miedo r/t angina y dolor opresivo',
                        'Inestabilidad al caminar, mareo frecuente en paciente anciano',
                        'Deposiciones líquidas frecuentes, dolor tipo cólico abdominal'
                      ].map((chip) => (
                        <button
                          key={chip}
                          onClick={() => {
                            setSymptomInput(chip);
                            executeAnalysis(chip);
                          }}
                          className="px-3 py-2 text-[10px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-xl font-bold text-left transition-colors whitespace-normal break-words leading-tight cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* VIEW: CATALOG MANUAL SEARCH */}
              <div className={nandaMode === 'catalog' ? "block" : "hidden"}>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={nandaSearchQuery}
                        onChange={(e) => setNandaSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleNandaSearch()}
                        placeholder="Busca por código (ej. 00032) o nombre (ej. dolor)..."
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white text-slate-800"
                      />
                    </div>

                    <button
                      onClick={handleNandaSearch}
                      disabled={isNandaLoading}
                      className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {isNandaLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Search className="w-3.5 h-3.5" />
                      )}
                      <span>Buscar</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 border border-slate-150 rounded-xl">
                    <input
                      type="checkbox"
                      id="ai-toggle-nanda-catalog"
                      checked={useAiNanda}
                      onChange={(e) => setUseAiNanda(e.target.checked)}
                      className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500/10 cursor-pointer w-4 h-4"
                    />
                    <label htmlFor="ai-toggle-nanda-catalog" className="text-[10px] font-bold text-slate-600 cursor-pointer select-none flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Búsqueda Asistida por IA
                    </label>
                  </div>

                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Resultados NANDA-I</p>
                    {(customNandaResults || DIAGNOSES).length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200">
                        <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-1.5" />
                        <p className="text-xs text-slate-550 font-bold">No se hallaron diagnósticos</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Prueba una palabra clave distinta</p>
                      </div>
                    ) : (
                      (customNandaResults || DIAGNOSES).map((diag) => (
                        <div 
                          key={diag.code}
                          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 transition-all text-left space-y-2 group shadow-sm"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold font-mono px-2 py-0.5 bg-amber-50 text-amber-800 rounded-lg">
                              CÓD: {diag.code}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold">NANDA-I 2026</span>
                          </div>
                          <h5 className="font-extrabold text-slate-800 text-xs leading-snug">
                            {diag.name}
                          </h5>
                          <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                            {diag.definition}
                          </p>
                          <button
                            onClick={() => selectDiagnosisFromSearch(diag)}
                            className="w-full py-2 bg-indigo-50 hover:bg-indigo-650 hover:text-white rounded-xl text-[10px] font-bold text-indigo-650 border border-indigo-100 hover:border-indigo-600 transition-all active:scale-95 text-center cursor-pointer"
                          >
                            Cargar en Workspace de Cuidados
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* VIEW: DOMAIN TREE EXPLORER */}
              <div className={nandaMode === 'domains' ? "block" : "hidden"}>
                <div className="space-y-4">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Explorador de Taxonomía (13 Dominios)</p>
                  
                  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                    {NANDA_DOMAINS.map((dom) => {
                      const isExpanded = expandedDomainCode === dom.code;
                      return (
                        <div key={dom.code} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition-all">
                          <button
                            onClick={() => handleDomainHeaderClick(dom.code)}
                            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-100/60 transition-colors cursor-pointer"
                          >
                            <div>
                              <p className="text-[9px] font-mono font-bold text-indigo-650">{dom.code}</p>
                              <h4 className="text-xs font-extrabold text-slate-800 leading-tight mt-0.5">{dom.name}</h4>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                            )}
                          </button>

                          {isExpanded ? (
                            <div className="border-t border-slate-200/80 bg-white p-3 space-y-2">
                              {dom.classes.map((cls) => {
                                const isClassSelected = selectedClass === cls.code;
                                const classDiagnoses = DIAGNOSES.filter(diag => 
                                  (cls.diagnosesCodes || []).includes(diag.code) || 
                                  (diag.domain === dom.name && diag.class === cls.name)
                                );

                                return (
                                  <div key={cls.code} className="border border-slate-150 rounded-xl overflow-hidden">
                                    <button
                                      onClick={() => setSelectedClass(isClassSelected ? null : cls.code)}
                                      className="w-full px-3 py-2.5 bg-slate-50/50 hover:bg-slate-100/50 text-left flex justify-between items-center cursor-pointer"
                                    >
                                      <div>
                                        <p className="text-[8px] font-bold text-slate-400 font-mono">{cls.code}</p>
                                        <h5 className="text-[11px] font-bold text-slate-700 leading-snug">{cls.name}</h5>
                                      </div>
                                      <span className="text-[9px] bg-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded-md shrink-0 ml-2">
                                        {classDiagnoses.length} dx
                                      </span>
                                    </button>

                                    {isClassSelected ? (
                                      <div className="bg-white p-2 divide-y divide-slate-100 max-h-48 overflow-y-auto">
                                        {classDiagnoses.length === 0 ? (
                                          <p className="text-[10px] text-slate-400 text-center py-2">Sin diagnósticos pre-asignados.</p>
                                        ) : (
                                          classDiagnoses.map((diag) => (
                                            <button
                                              key={diag.code}
                                              onClick={() => selectDiagnosisFromSearch(diag)}
                                              className="w-full text-left p-2 hover:bg-indigo-50/55 rounded-lg transition-colors flex items-start justify-between group gap-2 cursor-pointer"
                                            >
                                              <div className="space-y-0.5">
                                                <p className="text-[9px] font-mono font-bold text-amber-700">CÓD: {diag.code}</p>
                                                <h6 className="text-[11px] font-bold text-slate-800 group-hover:text-indigo-650 leading-tight transition-colors">{diag.name}</h6>
                                              </div>
                                              <span className="text-xs text-slate-400 group-hover:text-indigo-650 mt-0.5 font-bold">→</span>
                                            </button>
                                          ))
                                        )}
                                      </div>
                                    ) : null}
                                  </div>
                                );
                              })}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* RIGHT COLUMN: Workspace panels rendered statically to prevent insertBefore browser extension issues */}
          <section id="consult-workspace" className="lg:col-span-7 space-y-6">
            
            {/* PANEL 1: LOADING STATE */}
            <div style={{ display: isAnalyzing ? "block" : "none" }}>
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-10 text-center flex flex-col items-center justify-center min-h-[480px] space-y-4">
                <div className="relative">
                  <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  <Sparkles className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h3 className="text-base font-extrabold text-slate-850">Mapeando taxonomías NNN...</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Identificando la etiqueta diagnóstica NANDA correspondiente y vinculándola con sus resultados NOC e intervenciones NIC.
                </p>
              </div>
            </div>

            {/* PANEL 1.5: MAPPING LOADING STATE */}
            <div style={{ display: isMappingLoading ? "block" : "none" }}>
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-10 text-center flex flex-col items-center justify-center min-h-[480px] space-y-4">
                <div className="relative">
                  <div className="w-14 h-14 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                  <Sparkles className="w-6 h-6 text-emerald-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h3 className="text-base font-extrabold text-slate-850">Buscando vinculación oficial con IA...</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Buscando en catálogos oficiales mediante internet para encontrar y completar los resultados NOC e intervenciones NIC correspondientes a este diagnóstico.
                </p>
              </div>
            </div>

            {/* PANEL 2: EMPTY STATE */}
            <div style={{ display: (!analysisResult && !isAnalyzing && !isMappingLoading) ? "block" : "none" }}>
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-10 text-center flex flex-col items-center justify-center min-h-[480px]">
                <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mb-5 border border-slate-200/50">
                  <HeartPulse className="w-8 h-8 text-slate-400 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-extrabold text-slate-800">Workspace de Planificación NNN</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed font-medium">
                  Introduce los síntomas del paciente a la izquierda o navega por el catálogo de diagnósticos para diseñar el plan de cuidados integral.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setSymptomInput('Disnea, fatiga extrema y ruidos respiratorios sibilantes');
                      executeAnalysis('Disnea, fatiga extrema y ruidos respiratorios sibilantes');
                    }}
                    className="px-4 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    Ejemplo de Mapeo Clínico
                  </button>
                  <button
                    onClick={() => {
                      setNandaMode('catalog');
                    }}
                    className="px-4 py-2 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                  >
                    Buscar Código Directo
                  </button>
                </div>
              </div>
            </div>

            {/* PANEL 3: ACTIVE WORKSPACE CARDS */}
            <div style={{ display: (analysisResult && !isAnalyzing && !isMappingLoading) ? "block" : "none" }}>
              <div className="space-y-6">
                
                {/* 1. NANDA DIAGNOSIS CARD */}
                <div className="bg-white border-t-[5px] border-t-amber-500 rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold font-mono px-2 py-0.5 bg-amber-50 text-amber-800 rounded-lg">
                        DIAGNÓSTICO NANDA-I [2024-2026]
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 mt-2 leading-snug">
                        {defaultWorkspaceData.nandaName}
                      </h3>
                      <p className="text-[9px] font-mono text-slate-400 font-bold mt-1">CÓDIGO: {defaultWorkspaceData.nandaCode}</p>
                    </div>
                    <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">N</span>
                  </div>

                  <div className="h-px bg-slate-100"></div>

                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Definición oficial</span>
                    <p className="text-xs text-slate-650 leading-relaxed font-medium italic font-sans">
                      "{defaultWorkspaceData.definition}"
                    </p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <span className="text-[9px] uppercase font-bold text-slate-455 tracking-wider">Factores Relacionados / de Riesgo</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {defaultWorkspaceData.relatedFactors?.map((factor: string) => {
                        const isChecked = chosenFactors.includes(factor);
                        return (
                          <label 
                            key={factor} 
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                              isChecked 
                                ? 'bg-amber-50/40 border-amber-200/80 text-slate-800' 
                                : 'bg-slate-50/50 border-slate-150 hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setChosenFactors(chosenFactors.filter(f => f !== factor));
                                } else {
                                  setChosenFactors([...chosenFactors, factor]);
                                }
                              }}
                              className="rounded border-slate-350 text-amber-650 focus:ring-amber-500 mt-0.5 w-3.5 h-3.5"
                            />
                            <span className="leading-snug">{factor}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. NOC OUTCOME CARD */}
                <div className="bg-white border-t-[5px] border-t-emerald-500 rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-lg">
                        RESULTADO NOC (CRITERIO EVALUADO)
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 mt-2 leading-snug">
                        {defaultWorkspaceData.nocName}
                      </h3>
                      <p className="text-[9px] font-mono text-slate-400 font-bold mt-1">CÓDIGO: {defaultWorkspaceData.nocCode}</p>
                    </div>
                    <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">O</span>
                  </div>

                  <div className="h-px bg-slate-100"></div>

                  {/* Indicators Checkbox list */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Criterios de Evaluación / Indicadores</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {defaultWorkspaceData.nocIndicators?.map((ind: { code: string; name: string }) => {
                        const isChecked = chosenIndicators.includes(ind.code);
                        return (
                          <label 
                            key={ind.code} 
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                              isChecked 
                                ? 'bg-emerald-50/40 border-emerald-250 text-slate-800' 
                                : 'bg-slate-50/50 border-slate-150 hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setChosenIndicators(chosenIndicators.filter(c => c !== ind.code));
                                } else {
                                  setChosenIndicators([...chosenIndicators, ind.code]);
                                }
                              }}
                              className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500 mt-0.5 w-3.5 h-3.5"
                            />
                            <div className="space-y-0.5 leading-snug">
                              <p>{ind.name}</p>
                              <span className="text-[9px] text-slate-400 font-bold font-mono">CÓD: {ind.code}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inline NOC search drawer/box */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Búsqueda & Intercambio de Resultado NOC</span>
                    
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-405 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={inlineNocSearchQuery}
                          onChange={(e) => setInlineNocSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleInlineNocSearch()}
                          placeholder="Buscar otro objetivo NOC alternativo..."
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white text-slate-800"
                        />
                      </div>
                      
                      <button
                        onClick={handleInlineNocSearch}
                        disabled={isInlineNocLoading}
                        className="px-3 py-2 bg-emerald-650 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                      >
                        {isInlineNocLoading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Search className="w-3.5 h-3.5" />
                        )}
                        <span>Buscar</span>
                      </button>
                    </div>

                    {/* Inline NOC results */}
                    {inlineNocResults && (
                      <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-3 space-y-2.5 max-h-56 overflow-y-auto">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Resultados de Búsqueda ({inlineNocResults.length})</span>
                          <button 
                            onClick={() => setInlineNocResults(null)} 
                            className="p-1 text-slate-450 hover:text-slate-700 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {inlineNocResults.length === 0 ? (
                          <p className="text-[10px] text-slate-400 py-1 text-center font-bold">No se hallaron resultados NOC.</p>
                        ) : (
                          inlineNocResults.map((noc) => (
                            <div key={noc.code} className="bg-white p-2.5 rounded-xl border border-slate-150 flex items-start justify-between gap-3 shadow-sm">
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded">CÓD: {noc.code}</span>
                                  <span className="text-[9px] text-slate-400 font-bold uppercase">{noc.domain}</span>
                                </div>
                                <h6 className="text-[11px] font-extrabold text-slate-800 leading-snug">{noc.name}</h6>
                                <p className="text-[9px] text-slate-500 italic leading-snug">"{noc.definition}"</p>
                              </div>
                              <button
                                onClick={() => applyInlineNoc(noc)}
                                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-lg text-[10px] font-bold text-emerald-700 transition-all border border-emerald-100 flex items-center gap-0.5 shrink-0 cursor-pointer"
                              >
                                <PlusCircle className="w-3 h-3" /> Swap
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. NIC INTERVENTION CARD */}
                <div className="bg-white border-t-[5px] border-t-indigo-500 rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold font-mono px-2 py-0.5 bg-indigo-50 text-indigo-850 rounded-lg">
                        INTERVENCIÓN NIC (CUIDADO PLANIFICADO)
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900 mt-2 leading-snug">
                        {defaultWorkspaceData.nicName}
                      </h3>
                      <p className="text-[9px] font-mono text-slate-400 font-bold mt-1">CÓDIGO: {defaultWorkspaceData.nicCode}</p>
                    </div>
                    <span className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">C</span>
                  </div>

                  <div className="h-px bg-slate-100"></div>

                  {/* Activities list checklist */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold text-slate-455 tracking-wider">Actividades recomendadas</span>
                    <div className="flex flex-col gap-2">
                      {defaultWorkspaceData.nicActivities?.map((act: string) => {
                        const isChecked = chosenActivities.includes(act);
                        return (
                          <label 
                            key={act} 
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                              isChecked 
                                ? 'bg-indigo-50/40 border-indigo-250 text-slate-800' 
                                : 'bg-slate-50/50 border-slate-150 hover:bg-slate-50 text-slate-650'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setChosenActivities(chosenActivities.filter(a => a !== act));
                                } else {
                                  setChosenActivities([...chosenActivities, act]);
                                }
                              }}
                              className="rounded border-slate-350 text-indigo-650 focus:ring-indigo-500 w-3.5 h-3.5 mt-0.5"
                            />
                            <span className="leading-relaxed">{act}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inline NIC search drawer/box */}
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Búsqueda & Intercambio de Intervención NIC</span>
                    
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={inlineNicSearchQuery}
                          onChange={(e) => setInlineNicSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleInlineNicSearch()}
                          placeholder="Buscar otra intervención NIC alternativa..."
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 focus:bg-white text-slate-800"
                        />
                      </div>
                      
                      <button
                        onClick={handleInlineNicSearch}
                        disabled={isInlineNicLoading}
                        className="px-3 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                      >
                        {isInlineNicLoading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Search className="w-3.5 h-3.5" />
                        )}
                        <span>Buscar</span>
                      </button>
                    </div>

                    {/* Inline NIC results */}
                    {inlineNicResults && (
                      <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-3 space-y-2.5 max-h-56 overflow-y-auto">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Resultados de Búsqueda ({inlineNicResults.length})</span>
                          <button 
                            onClick={() => setInlineNicResults(null)} 
                            className="p-1 text-slate-450 hover:text-slate-700 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {inlineNicResults.length === 0 ? (
                          <p className="text-[10px] text-slate-400 py-1 text-center font-bold">No se hallaron resultados NIC.</p>
                        ) : (
                          inlineNicResults.map((nic) => (
                            <div key={nic.code} className="bg-white p-2.5 rounded-xl border border-slate-150 flex items-start justify-between gap-3 shadow-sm">
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded">NIC {nic.code}</span>
                                </div>
                                <h6 className="text-[11px] font-extrabold text-slate-800 leading-snug">{nic.name}</h6>
                                <div className="text-[9px] text-slate-500 leading-snug space-y-0.5">
                                  <p className="font-bold text-slate-400 uppercase">Actividades:</p>
                                  {nic.activities.slice(0, 2).map((act, index) => (
                                    <p key={index} className="line-clamp-1">• {act}</p>
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={() => applyInlineNic(nic)}
                                className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-650 hover:text-white rounded-lg text-[10px] font-bold text-indigo-700 transition-all border border-indigo-100 flex items-center gap-0.5 shrink-0 cursor-pointer"
                              >
                                <PlusCircle className="w-3 h-3" /> Swap
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. NOTE PREVIEW CARD */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <h4 className="font-extrabold text-slate-800 text-sm">Nota de Evolución Clínica de Enfermería</h4>
                    </div>
                    
                    <button
                      onClick={copyToClipboard}
                      className="px-3.5 py-2 text-xs text-indigo-650 bg-indigo-50 hover:bg-indigo-100 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 w-full sm:w-auto justify-center"
                    >
                      {copiedNote ? (
                        <>
                          <CopyCheck className="w-4 h-4 text-emerald-600" /> ¡Nota Copiada!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" /> Copiar al Clipboard
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="text-xs bg-slate-900 border border-slate-800 text-slate-200 p-4.5 rounded-2xl overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed max-h-56 shadow-inner">
                    {clinicalNote}
                  </pre>

                  {/* Actions Row */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSymptomInput('');
                        setAnalysisResult(null);
                        setChosenFactors([]);
                        setChosenIndicators([]);
                        setChosenActivities([]);
                        setInlineNocResults(null);
                        setInlineNicResults(null);
                      }}
                      className="px-4.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      Limpiar Workspace Activo
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </section>

        </main>

        {/* Subtle page footer */}
        <footer className="py-6 border-t border-slate-200/60 text-center bg-white mt-12">
          <p className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">
            Enfermería NNN • Taxonomías NANDA-I 2024-2026, NOC 7ª Ed., NIC 8ª Ed.
          </p>
        </footer>

        </div>
      )}
    </ErrorBoundary>
  );
}
