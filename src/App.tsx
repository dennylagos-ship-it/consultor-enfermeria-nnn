/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { auth, db, isFirebaseMock } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  User
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
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
  FileText,
  LogOut,
  Activity,
  Trash2,
  Printer,
  Calculator,
  Lock
} from 'lucide-react';
import { Diagnosis, NocOutcome, NicIntervention } from './types';
import { DIAGNOSES, NOC_OUTCOMES, NIC_INTERVENTIONS, NANDA_DOMAINS, findBestNoc, findBestNic } from './data';
import techNurseImg from './assets/images/tech_nurse.png';

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

  // Auth & Subscription States
  const [user, setUser] = useState<any | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'free' | 'active' | 'canceled' | 'past_due'>('free');
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [idToken, setIdToken] = useState<string>('');

  // AI Toggle States (Premium features)
  const [useAiNanda, setUseAiNanda] = useState<boolean>(false);
  const [useAiNoc, setUseAiNoc] = useState<boolean>(false);
  const [useAiNic, setUseAiNic] = useState<boolean>(false);

  // Premium Tab Navigation & Saved Plans
  const [activeTab, setActiveTab] = useState<'consultant' | 'saved_plans' | 'calculators'>('consultant');
  const [savedPlans, setSavedPlans] = useState<any[]>([]);
  const [plansLoading, setPlansLoading] = useState<boolean>(false);
  const [patientName, setPatientName] = useState<string>('');
  const [savingPlan, setSavingPlan] = useState<boolean>(false);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState<any | null>(null);
  const [soapieGenerating, setSoapieGenerating] = useState<boolean>(false);
  const [soapieResult, setSoapieResult] = useState<string>('');

  // Glasgow Scale states
  const [glasgowOcular, setGlasgowOcular] = useState<number>(4);
  const [glasgowVerbal, setGlasgowVerbal] = useState<number>(5);
  const [glasgowMotor, setGlasgowMotor] = useState<number>(6);

  // APGAR Scale states
  const [apgarColor, setApgarColor] = useState<number>(2);
  const [apgarPulse, setApgarPulse] = useState<number>(2);
  const [apgarReflex, setApgarReflex] = useState<number>(2);
  const [apgarTone, setApgarTone] = useState<number>(2);
  const [apgarResp, setApgarResp] = useState<number>(2);

  // Silverman-Andersen states
  const [silvermanThorax, setSilvermanThorax] = useState<number>(0);
  const [silvermanRetraction, setSilvermanRetraction] = useState<number>(0);
  const [silvermanXiphoid, setSilvermanXiphoid] = useState<number>(0);
  const [silvermanNasal, setSilvermanNasal] = useState<number>(0);
  const [silvermanGrunt, setSilvermanGrunt] = useState<number>(0);

  // BMI states
  const [bmiWeight, setBmiWeight] = useState<string>('70');
  const [bmiHeight, setBmiHeight] = useState<string>('170');

  // Gestational Age states
  const [furDate, setFurDate] = useState<string>('');

  // Drug Dosage states
  const [dosePrescribed, setDosePrescribed] = useState<string>('');
  const [doseConcentration, setDoseConcentration] = useState<string>('');
  const [doseDiluent, setDoseDiluent] = useState<string>('');

  // ABG states
  const [abgPh, setAbgPh] = useState<string>('7.40');
  const [abgPco2, setAbgPco2] = useState<string>('40');
  const [abgHco3, setAbgHco3] = useState<string>('24');

  // Braden Scale states
  const [bradenSensory, setBradenSensory] = useState<number>(4);
  const [bradenMoisture, setBradenMoisture] = useState<number>(4);
  const [bradenActivity, setBradenActivity] = useState<number>(4);
  const [bradenMobility, setBradenMobility] = useState<number>(4);
  const [bradenNutrition, setBradenNutrition] = useState<number>(4);
  const [bradenFriction, setBradenFriction] = useState<number>(3);

  // Downton Scale states
  const [downtonFalls, setDowntonFalls] = useState<number>(0);
  const [downtonMeds, setDowntonMeds] = useState<number>(0);
  const [downtonSensory, setDowntonSensory] = useState<number>(0);
  const [downtonMental, setDowntonMental] = useState<number>(0);
  const [downtonGait, setDowntonGait] = useState<number>(0);

  // Selected calculator subtab
  const [activeCalculator, setActiveCalculator] = useState<'glasgow' | 'apgar' | 'silverman' | 'bmi' | 'fpp' | 'dose' | 'abg' | 'braden' | 'downton'>('glasgow');

  // Auth Modal States
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Paywall Modal State
  const [showPaywallModal, setShowPaywallModal] = useState<boolean>(false);

  useEffect(() => {
    if (isFirebaseMock) {
      setUser({ email: 'mock@enfermeria.com', uid: 'mock_uid' });
      setSubscriptionStatus('active'); // active in mock mode for simple local testing
      setUseAiNanda(true);
      setUseAiNoc(true);
      setUseAiNic(true);
      setAuthLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          setIdToken(token);

          // Real-time Firestore sync
          const userDocRef = doc(db, 'users', currentUser.uid);
          const unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const status = data.subscriptionStatus || 'free';
              setSubscriptionStatus(status);
              if (status !== 'active') {
                setUseAiNanda(false);
                setUseAiNoc(false);
                setUseAiNic(false);
              } else {
                setUseAiNanda(true);
                setUseAiNoc(true);
                setUseAiNic(true);
              }
            } else {
              setSubscriptionStatus('free');
              setUseAiNanda(false);
              setUseAiNoc(false);
              setUseAiNic(false);
            }
            setAuthLoading(false);
          }, (err) => {
            console.error("Firestore user doc snapshot error:", err);
            setSubscriptionStatus('free');
            setUseAiNanda(false);
            setUseAiNoc(false);
            setUseAiNic(false);
            setAuthLoading(false);
          });

          return () => unsubscribeDoc();
        } catch (err) {
          console.error("Error getting ID token:", err);
          setAuthLoading(false);
        }
      } else {
        setSubscriptionStatus('free');
        setIdToken('');
        setUseAiNanda(false);
        setUseAiNoc(false);
        setUseAiNic(false);
        setAuthLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      }
      setShowAuthModal(false);
      setAuthEmail('');
      setAuthPassword('');
    } catch (err: any) {
      console.error("Auth error:", err);
      let msg = "Error al autenticar. Por favor revisa tus credenciales.";
      if (err.code === "auth/email-already-in-use") {
        msg = "El correo electrónico ya está registrado.";
      } else if (err.code === "auth/invalid-credential") {
        msg = "Correo electrónico o contraseña incorrectos.";
      } else if (err.code === "auth/weak-password") {
        msg = "La contraseña debe tener al menos 6 caracteres.";
      } else if (err.code === "auth/invalid-email") {
        msg = "El formato de correo electrónico no es válido.";
      } else if (err.code === "auth/operation-not-allowed") {
        msg = "El método de autenticación por Correo/Contraseña no está activado en tu consola de Firebase. Debes habilitarlo.";
      }
      setAuthError(msg);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAnalysisResult(null);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const handleSubscribe = async (planType: 'monthly' | 'yearly') => {
    if (!user) {
      setAuthMode('register');
      setShowAuthModal(true);
      return;
    }

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ planType })
      });

      if (response.status === 401) {
        setShowAuthModal(true);
        return;
      }

      if (!response.ok) {
        throw new Error("Checkout session request failed");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Stripe subscribe error:", err);
      alert("Error al iniciar el pago de suscripción.");
    }
  };

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (response.status === 401) {
        setShowAuthModal(true);
        return;
      }

      if (!response.ok) {
        throw new Error("Portal session request failed");
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Stripe portal error:", err);
      alert("No se pudo abrir el panel de facturación.");
    }
  };

  const fetchSavedPlans = async () => {
    if (!user) return;
    setPlansLoading(true);
    try {
      const response = await fetch('/api/plans', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSavedPlans(data.plans || []);
      }
    } catch (err) {
      console.error("Error fetching saved plans:", err);
    } finally {
      setPlansLoading(false);
    }
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (subscriptionStatus !== 'active') {
      setShowPaywallModal(true);
      return;
    }
    if (!analysisResult) {
      alert("Por favor selecciona un diagnóstico NANDA primero.");
      return;
    }

    setSavingPlan(true);
    try {
      const response = await fetch('/api/plans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          patientName: patientName || "Paciente Anónimo",
          nandaCode: analysisResult.nandaCode,
          nandaName: analysisResult.nandaName,
          nocCode: analysisResult.nocCode || "",
          nocName: analysisResult.nocName || "",
          nocIndicators: chosenIndicators.map(code => {
            const indObj = analysisResult.nocIndicators?.find((ind: any) => ind.code === code);
            return indObj ? `${indObj.name} (CÓD: ${indObj.code})` : code;
          }),
          nicCode: analysisResult.nicCode || "",
          nicName: analysisResult.nicName || "",
          nicActivities: chosenActivities,
          evolutionNote: clinicalNote || "",
        })
      });

      if (response.ok) {
        alert("¡Plan de cuidados guardado con éxito!");
        setPatientName('');
        fetchSavedPlans();
      } else {
        const errData = await response.json();
        alert("Error al guardar el plan: " + (errData.error || "Error desconocido"));
      }
    } catch (err: any) {
      console.error("Error saving plan:", err);
      alert("Fallo al guardar el plan de cuidados: " + (err.message || err));
    } finally {
      setSavingPlan(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este plan de cuidados guardado?")) {
      return;
    }
    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      if (response.ok) {
        setSavedPlans(prev => prev.filter(p => p.id !== planId));
        if (selectedPlanDetails?.id === planId) {
          setSelectedPlanDetails(null);
        }
      } else {
        alert("No se pudo eliminar el plan.");
      }
    } catch (err) {
      console.error("Error deleting plan:", err);
      alert("Error al intentar eliminar el plan.");
    }
  };

  const handleGenerateSoapie = async () => {
    if (!analysisResult) return;
    setSoapieGenerating(true);
    setSoapieResult('');
    try {
      const response = await fetch('/api/ai/generate-soapie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          nandaName: analysisResult.nandaName,
          nocName: analysisResult.nocName || "Sin NOC definido",
          nicName: analysisResult.nicName || "Sin NIC definido",
          activities: chosenActivities,
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSoapieResult(data.soapie);
        setClinicalNote(data.soapie);
      } else {
        alert("No se pudo generar la nota SOAPIE.");
      }
    } catch (err) {
      console.error("Error generating SOAPIE:", err);
      alert("Error al contactar al servicio de SOAPIE.");
    } finally {
      setSoapieGenerating(false);
    }
  };

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
  const [isNandaLoading, setIsNandaLoading] = useState<boolean>(false);
  const [customNandaResults, setCustomNandaResults] = useState<Diagnosis[] | null>(null);

  // Inline search states inside the NOC Card (right column)
  const [inlineNocSearchQuery, setInlineNocSearchQuery] = useState<string>('');
  const [isInlineNocLoading, setIsInlineNocLoading] = useState<boolean>(false);
  const [inlineNocResults, setInlineNocResults] = useState<NocOutcome[] | null>(null);

  // Inline search states inside the NIC Card (right column)
  const [inlineNicSearchQuery, setInlineNicSearchQuery] = useState<string>('');
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

    if (subscriptionStatus !== 'active') {
      setShowPaywallModal(true);
      return;
    }

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
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ symptoms: promptToUse })
      });

      clearTimeout(timeoutId);

      if (response.status === 401) {
        setShowAuthModal(true);
        return;
      }
      if (response.status === 403) {
        setShowPaywallModal(true);
        return;
      }

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

    if (useAiNanda && subscriptionStatus !== 'active') {
      setShowPaywallModal(true);
      return;
    }

    setIsNandaLoading(true);
    try {
      if (useAiNanda) {
        const response = await fetch('/api/search-taxonomy', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({ query: nandaSearchQuery, type: 'nanda' })
        });

        if (response.status === 401) {
          setShowAuthModal(true);
          return;
        }
        if (response.status === 403) {
          setShowPaywallModal(true);
          return;
        }

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

    if (useAiNoc && subscriptionStatus !== 'active') {
      setShowPaywallModal(true);
      return;
    }

    setIsInlineNocLoading(true);
    try {
      if (useAiNoc) {
        const response = await fetch('/api/search-taxonomy', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({ query: inlineNocSearchQuery, type: 'noc' })
        });

        if (response.status === 401) {
          setShowAuthModal(true);
          return;
        }
        if (response.status === 403) {
          setShowPaywallModal(true);
          return;
        }

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

    if (useAiNic && subscriptionStatus !== 'active') {
      setShowPaywallModal(true);
      return;
    }

    setIsInlineNicLoading(true);
    try {
      if (useAiNic) {
        const response = await fetch('/api/search-taxonomy', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({ query: inlineNicSearchQuery, type: 'nic' })
        });

        if (response.status === 401) {
          setShowAuthModal(true);
          return;
        }
        if (response.status === 403) {
          setShowPaywallModal(true);
          return;
        }

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
      if (subscriptionStatus !== 'active') {
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
          justification: `Asociación local offline mediante coincidencia de palabras clave (Plan Gratuito).`
        });

        setChosenFactors(diag.relatedFactors && diag.relatedFactors.length > 0 ? [diag.relatedFactors[0]] : ['Presencia de factores relacionados clínicos']);
        setChosenIndicators((bestNoc.indicators || []).map(i => i.code));
        setChosenActivities((bestNic.activities || []).slice(0, 3));

        setShowPaywallModal(true);
        return;
      }

      setIsMappingLoading(true);
      setAnalysisResult(null); // Show skeleton loader
      try {
        const response = await fetch('/api/get-nanda-mapping', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({ nandaCode: diag.code, nandaName: diag.name })
        });

        if (response.status === 401) {
          setShowAuthModal(true);
          setIsMappingLoading(false);
          return;
        }
        if (response.status === 403) {
          setShowPaywallModal(true);
          setIsMappingLoading(false);
          return;
        }

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

  const renderGlasgowCalculator = () => {
    const total = glasgowOcular + glasgowVerbal + glasgowMotor;
    let severity = "Trauma Leve";
    let colorClass = "bg-emerald-500 text-white border-emerald-600";
    if (total <= 8) {
      severity = "Trauma Severo / Estado de Coma";
      colorClass = "bg-rose-500 text-white border-rose-600";
    } else if (total <= 12) {
      severity = "Trauma Moderado";
      colorClass = "bg-amber-500 text-slate-900 border-amber-600";
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Escala de Coma de Glasgow</h2>
          <p className="text-xs text-slate-500 mt-0.5">Evalúa el nivel de estado de alerta y conciencia neurológica.</p>
        </div>

        <div className="space-y-4">
          {/* Ocular */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-650 block">1. Apertura Ocular</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { val: 4, txt: "4 - Espontánea" },
                { val: 3, txt: "3 - Al estímulo verbal" },
                { val: 2, txt: "2 - Al estímulo doloroso" },
                { val: 1, txt: "1 - Sin respuesta" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setGlasgowOcular(opt.val)}
                  className={`px-2 py-2.5 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer ${
                    glasgowOcular === opt.val
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          {/* Verbal */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-650 block">2. Respuesta Verbal</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { val: 5, txt: "5 - Orientado" },
                { val: 4, txt: "4 - Confuso" },
                { val: 3, txt: "3 - Inapropiado" },
                { val: 2, txt: "2 - Incomprensible" },
                { val: 1, txt: "1 - Sin respuesta" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setGlasgowVerbal(opt.val)}
                  className={`px-2 py-2.5 rounded-xl border text-[10px] font-bold text-center transition-all cursor-pointer ${
                    glasgowVerbal === opt.val
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          {/* Motor */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-650 block">3. Respuesta Motora</label>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5">
              {[
                { val: 6, txt: "6 - Obedece" },
                { val: 5, txt: "5 - Localiza" },
                { val: 4, txt: "4 - Retirada" },
                { val: 3, txt: "3 - Flexión" },
                { val: 2, txt: "2 - Extensión" },
                { val: 1, txt: "1 - Sin respuesta" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setGlasgowMotor(opt.val)}
                  className={`px-1 py-2.5 rounded-xl border text-[10px] font-bold text-center transition-all cursor-pointer ${
                    glasgowMotor === opt.val
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Resultado Escala</span>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-extrabold text-slate-800">{total}</span>
              <span className="text-xs font-bold text-slate-400">/ 15 puntos</span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl text-xs font-extrabold border shadow-sm ${colorClass}`}>
            {severity}
          </div>
        </div>
      </div>
    );
  };

  const renderApgarCalculator = () => {
    const total = apgarColor + apgarPulse + apgarReflex + apgarTone + apgarResp;
    let interpretation = "Sin depresión (Neonato normal)";
    let colorClass = "bg-emerald-500 text-white border-emerald-600";
    if (total <= 3) {
      interpretation = "Depresión severa (Asfixia grave)";
      colorClass = "bg-rose-500 text-white border-rose-600";
    } else if (total <= 6) {
      interpretation = "Depresión moderada (Asfixia moderada)";
      colorClass = "bg-amber-500 text-slate-900 border-amber-600";
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Test de APGAR</h2>
          <p className="text-xs text-slate-500 mt-0.5">Evalúa la adaptación y vitalidad fisiológica del recién nacido.</p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">1. Coloración de la Piel (Aspecto)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 0, txt: "0 - Cianótico generalizado o pálido" },
                { val: 1, txt: "1 - Acrocianosis (cuerpo rosado, extremidades azules)" },
                { val: 2, txt: "2 - Completamente rosado" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setApgarColor(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                    apgarColor === opt.val ? 'bg-indigo-600 border-indigo-600 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">2. Frecuencia Cardíaca (Pulso)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 0, txt: "0 - Ausente" },
                { val: 1, txt: "1 - < 100 latidos por minuto" },
                { val: 2, txt: "2 - >= 100 latidos por minuto" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setApgarPulse(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                    apgarPulse === opt.val ? 'bg-indigo-600 border-indigo-600 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">3. Respuesta a Estímulos (Gesto)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 0, txt: "0 - Sin respuesta / flacidez" },
                { val: 1, txt: "1 - Gesticulaciones / muecas" },
                { val: 2, txt: "2 - Llanto fuerte, tos o estornudos" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setApgarReflex(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                    apgarReflex === opt.val ? 'bg-indigo-600 border-indigo-600 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">4. Tono Muscular (Actividad)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 0, txt: "0 - Flácido / sin movimientos" },
                { val: 1, txt: "1 - Cierta flexión de extremidades" },
                { val: 2, txt: "2 - Movimientos activos y vigorosos" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setApgarTone(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                    apgarTone === opt.val ? 'bg-indigo-600 border-indigo-600 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">5. Esfuerzo Respiratorio (Respiración)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 0, txt: "0 - Ausente" },
                { val: 1, txt: "1 - Lento, irregular o quejumbroso" },
                { val: 2, txt: "2 - Llanto fuerte y vigoroso" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setApgarResp(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                    apgarResp === opt.val ? 'bg-indigo-600 border-indigo-600 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Resultado APGAR</span>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-extrabold text-slate-800">{total}</span>
              <span className="text-xs font-bold text-slate-400">/ 10 puntos</span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl text-xs font-extrabold border shadow-sm ${colorClass}`}>
            {interpretation}
          </div>
        </div>
      </div>
    );
  };

  const renderSilvermanCalculator = () => {
    const total = silvermanThorax + silvermanRetraction + silvermanXiphoid + silvermanNasal + silvermanGrunt;
    let interpretation = "Sin dificultad respiratoria";
    let colorClass = "bg-emerald-500 text-white border-emerald-600";
    if (total >= 7) {
      interpretation = "Dificultad respiratoria severa";
      colorClass = "bg-rose-500 text-white border-rose-600";
    } else if (total >= 4) {
      interpretation = "Dificultad respiratoria moderada";
      colorClass = "bg-amber-500 text-slate-900 border-amber-600";
    } else if (total >= 1) {
      interpretation = "Dificultad respiratoria leve";
      colorClass = "bg-emerald-50 text-emerald-700 border-emerald-250";
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Test de Silverman-Andersen</h2>
          <p className="text-xs text-slate-500 mt-0.5">Evalúa la presencia y gravedad de la dificultad respiratoria en recién nacidos (menor puntaje es mejor).</p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">1. Disociación toraco-abdominal</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 0, txt: "0 - Sincronizado y regular" },
                { val: 1, txt: "1 - Tórax inmóvil, abdomen en movimiento" },
                { val: 2, txt: "2 - Sube y baja alternado (sube tórax, baja abdomen)" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setSilvermanThorax(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                    silvermanThorax === opt.val ? 'bg-indigo-600 border-indigo-600 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">2. Tiraje Intercostal (Retracción)</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 0, txt: "0 - Ausente" },
                { val: 1, txt: "1 - Apenas visible" },
                { val: 2, txt: "2 - Marcado y constante" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setSilvermanRetraction(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                    silvermanRetraction === opt.val ? 'bg-indigo-600 border-indigo-600 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">3. Retracción Xifoidea</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 0, txt: "0 - Sin retracción" },
                { val: 1, txt: "1 - Apenas visible" },
                { val: 2, txt: "2 - Marcada y profunda" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setSilvermanXiphoid(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                    silvermanXiphoid === opt.val ? 'bg-indigo-600 border-indigo-600 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">4. Aleteo Nasal</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 0, txt: "0 - Ausente" },
                { val: 1, txt: "1 - Mínimo" },
                { val: 2, txt: "2 - Marcado y dilatado" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setSilvermanNasal(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                    silvermanNasal === opt.val ? 'bg-indigo-600 border-indigo-600 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">5. Quejido Espiratorio</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 0, txt: "0 - Ausente" },
                { val: 1, txt: "1 - Audible únicamente con estetoscopio" },
                { val: 2, txt: "2 - Audible a simple oído" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setSilvermanGrunt(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                    silvermanGrunt === opt.val ? 'bg-indigo-600 border-indigo-600 text-white font-bold' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Resultado Silverman</span>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-extrabold text-slate-800">{total}</span>
              <span className="text-xs font-bold text-slate-400">/ 10 puntos (menor es mejor)</span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl text-xs font-extrabold border shadow-sm ${colorClass}`}>
            {interpretation}
          </div>
        </div>
      </div>
    );
  };

  const renderBmiCalculator = () => {
    const weightNum = parseFloat(bmiWeight) || 0;
    const heightNum = (parseFloat(bmiHeight) || 0) / 100;
    const bmi = heightNum > 0 ? (weightNum / (heightNum * heightNum)) : 0;
    
    let classification = "Datos insuficientes";
    let colorClass = "bg-slate-100 text-slate-500";
    
    if (bmi > 0) {
      if (bmi < 18.5) {
        classification = "Bajo peso";
        colorClass = "bg-yellow-500 text-white border-yellow-600";
      } else if (bmi < 25) {
        classification = "Normopeso (Normal)";
        colorClass = "bg-emerald-500 text-white border-emerald-600";
      } else if (bmi < 30) {
        classification = "Sobrepeso";
        colorClass = "bg-amber-500 text-slate-900 border-amber-600";
      } else if (bmi < 35) {
        classification = "Obesidad Grado I (Leve)";
        colorClass = "bg-rose-500 text-white border-rose-600";
      } else if (bmi < 40) {
        classification = "Obesidad Grado II (Moderada)";
        colorClass = "bg-rose-650 text-white border-rose-700";
      } else {
        classification = "Obesidad Grado III (Mórbida)";
        colorClass = "bg-red-700 text-white border-red-800 animate-pulse";
      }
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Cálculo de Índice de Masa Corporal (IMC)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calcula el estado nutricional antropométrico basado en peso y estatura.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Peso Corporal (kg)</label>
            <input
              type="number"
              value={bmiWeight}
              onChange={(e) => setBmiWeight(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="70"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Estatura o Altura (cm)</label>
            <input
              type="number"
              value={bmiHeight}
              onChange={(e) => setBmiHeight(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="170"
            />
          </div>
        </div>

        {bmi > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tu IMC Calculado</span>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-3xl font-extrabold text-slate-800">{bmi.toFixed(1)}</span>
                <span className="text-xs font-bold text-slate-400">kg/m²</span>
              </div>
            </div>

            <div className={`px-4 py-2 rounded-xl text-xs font-extrabold border shadow-sm ${colorClass}`}>
              {classification}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFppCalculator = () => {
    let fppResult = "";
    let weeks = 0;
    let days = 0;
    
    if (furDate) {
      const fur = new Date(furDate);
      const fpp = new Date(fur.getTime() + 280 * 24 * 60 * 60 * 1000);
      fppResult = fpp.toLocaleDateString();

      const diffTime = Math.abs(new Date().getTime() - fur.getTime());
      const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      weeks = Math.floor(totalDays / 7);
      days = totalDays % 7;
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Fecha Probable de Parto & Edad Gestacional</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calcula la FPP usando la regla de Naegele y estima las semanas de embarazo.</p>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">Fecha de la Última Regla (FUR)</label>
          <input
            type="date"
            value={furDate}
            onChange={(e) => setFurDate(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        {furDate && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Fecha Probable de Parto</span>
              <div className="mt-2 text-2xl font-extrabold text-slate-800">
                {fppResult}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Edad Gestacional Estimada</span>
              <div className="mt-2 text-xl font-extrabold text-indigo-700">
                {weeks} semanas y {days} días
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDoseCalculator = () => {
    const prescribedNum = parseFloat(dosePrescribed) || 0;
    const concentrationNum = parseFloat(doseConcentration) || 0;
    const diluentNum = parseFloat(doseDiluent) || 0;
    const volumeResult = concentrationNum > 0 ? ((prescribedNum * diluentNum) / concentrationNum) : 0;

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Regla de Tres para Cálculo de Dosis</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calcula el volumen exacto en ml que debes administrar de un medicamento.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">1. Dosis Prescrita (mg)</label>
            <input
              type="number"
              value={dosePrescribed}
              onChange={(e) => setDosePrescribed(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="Ej: 250"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">2. Concentración Disponible (mg)</label>
            <input
              type="number"
              value={doseConcentration}
              onChange={(e) => setDoseConcentration(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="Ej: 500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">3. Volumen del Diluyente (ml)</label>
            <input
              type="number"
              value={doseDiluent}
              onChange={(e) => setDoseDiluent(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="Ej: 5"
            />
          </div>
        </div>

        {volumeResult > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Volumen a Administrar</span>
            <div className="mt-2 flex items-baseline gap-1 justify-start">
              <span className="text-3xl font-extrabold text-indigo-700">{volumeResult.toFixed(2)}</span>
              <span className="text-xs font-bold text-slate-400">ml o cc</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">
              Fórmula aplicada: (Dosis Prescrita * Volumen Diluyente) / Concentración Disponible
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderAbgCalculator = () => {
    const phVal = abgPh.trim();
    const pco2Val = abgPco2.trim();
    const hco3Val = abgHco3.trim();

    let diagnosis = "Por favor ingrese todos los valores (pH, pCO2 y HCO3) para obtener la interpretación clínica.";
    let typeClass = "bg-slate-50 text-slate-500 border-slate-200/80";

    if (phVal !== "" && pco2Val !== "" && hco3Val !== "") {
      const ph = parseFloat(phVal);
      const pco2 = parseFloat(pco2Val);
      const hco3 = parseFloat(hco3Val);

      if (isNaN(ph) || isNaN(pco2) || isNaN(hco3) || ph <= 0 || pco2 <= 0 || hco3 <= 0) {
        diagnosis = "Por favor ingrese valores numéricos válidos y mayores a cero.";
        typeClass = "bg-rose-50 text-rose-700 border-rose-200";
      } else {
        if (ph < 7.35) {
          // Acidosis / Acidemia
          if (pco2 > 45 && hco3 < 22) {
            diagnosis = "Acidosis Mixta (Respiratoria y Metabólica)";
            typeClass = "bg-rose-650 text-white border-rose-700 shadow-md";
          } else if (pco2 > 45) {
            if (hco3 > 26) {
              diagnosis = "Acidosis Respiratoria Parcialmente Compensada";
              typeClass = "bg-amber-500 text-slate-900 border-amber-600 shadow-sm";
            } else {
              diagnosis = "Acidosis Respiratoria No Compensada";
              typeClass = "bg-rose-500 text-white border-rose-600 shadow-sm";
            }
          } else if (hco3 < 22) {
            if (pco2 < 35) {
              diagnosis = "Acidosis Metabólica Parcialmente Compensada";
              typeClass = "bg-amber-500 text-slate-900 border-amber-600 shadow-sm";
            } else {
              diagnosis = "Acidosis Metabólica No Compensada";
              typeClass = "bg-rose-500 text-white border-rose-600 shadow-sm";
            }
          } else {
            // Inconsistencia o valores limítrofes
            diagnosis = "Acidemia (Valores en límites / Inconsistencia clínica)";
            typeClass = "bg-amber-100 text-amber-850 border-amber-300";
          }
        } else if (ph > 7.45) {
          // Alcalosis / Alcalemia
          if (pco2 < 35 && hco3 > 26) {
            diagnosis = "Alcalosis Mixta (Respiratoria y Metabólica)";
            typeClass = "bg-rose-650 text-white border-rose-700 shadow-md";
          } else if (pco2 < 35) {
            if (hco3 < 22) {
              diagnosis = "Alcalosis Respiratoria Parcialmente Compensada";
              typeClass = "bg-amber-500 text-slate-900 border-amber-600 shadow-sm";
            } else {
              diagnosis = "Alcalosis Respiratoria No Compensada";
              typeClass = "bg-rose-500 text-white border-rose-600 shadow-sm";
            }
          } else if (hco3 > 26) {
            if (pco2 > 45) {
              diagnosis = "Alcalosis Metabólica Parcialmente Compensada";
              typeClass = "bg-amber-500 text-slate-900 border-amber-600 shadow-sm";
            } else {
              diagnosis = "Alcalosis Metabólica No Compensada";
              typeClass = "bg-rose-500 text-white border-rose-600 shadow-sm";
            }
          } else {
            // Inconsistencia o valores limítrofes
            diagnosis = "Alcalemia (Valores en límites / Inconsistencia clínica)";
            typeClass = "bg-amber-100 text-amber-850 border-amber-300";
          }
        } else {
          // pH dentro del rango normal (7.35 - 7.45)
          if (pco2 > 45 && hco3 > 26) {
            diagnosis = ph < 7.40 ? "Acidosis Respiratoria Totalmente Compensada" : "Alcalosis Metabólica Totalmente Compensada";
            typeClass = "bg-emerald-50 text-emerald-700 border-emerald-250/80 shadow-sm";
          } else if (pco2 < 35 && hco3 < 22) {
            diagnosis = ph < 7.40 ? "Acidosis Metabólica Totalmente Compensada" : "Alcalosis Respiratoria Totalmente Compensada";
            typeClass = "bg-emerald-50 text-emerald-700 border-emerald-250/80 shadow-sm";
          } else if (pco2 > 45) {
            diagnosis = "Compensación en Curso / Tendencia a Acidosis Respiratoria";
            typeClass = "bg-emerald-50 text-emerald-750 border-emerald-200 shadow-sm";
          } else if (pco2 < 35) {
            diagnosis = "Compensación en Curso / Tendencia a Alcalosis Respiratoria";
            typeClass = "bg-emerald-50 text-emerald-750 border-emerald-200 shadow-sm";
          } else if (hco3 < 22) {
            diagnosis = "Compensación en Curso / Tendencia a Acidosis Metabólica";
            typeClass = "bg-emerald-50 text-emerald-750 border-emerald-200 shadow-sm";
          } else if (hco3 > 26) {
            diagnosis = "Compensación en Curso / Tendencia a Alcalosis Metabólica";
            typeClass = "bg-emerald-50 text-emerald-750 border-emerald-200 shadow-sm";
          } else {
            diagnosis = "Gases Arteriales Normales (Eje de Equilibrio Ácido-Base)";
            typeClass = "bg-emerald-500 text-white border-emerald-600 shadow-md";
          }
        }
      }
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Interpretación de Gases Arteriales (ABG)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Analiza el estado ácido-base del paciente a través de su pH, pCO2 y HCO3.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">pH Arterial (7.35 - 7.45)</label>
            <input
              type="number"
              step="0.01"
              value={abgPh}
              onChange={(e) => setAbgPh(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="7.40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">pCO2 mmHg (35 - 45)</label>
            <input
              type="number"
              value={abgPco2}
              onChange={(e) => setAbgPco2(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="40"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">HCO3 mEq/L (22 - 26)</label>
            <input
              type="number"
              value={abgHco3}
              onChange={(e) => setAbgHco3(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="24"
            />
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Diagnóstico Clínico</span>
            <div className={`px-4 py-3 rounded-xl text-xs font-extrabold border shadow-sm mt-1 text-center sm:text-left ${typeClass}`}>
              {diagnosis}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBradenCalculator = () => {
    const total = bradenSensory + bradenMoisture + bradenActivity + bradenMobility + bradenNutrition + bradenFriction;
    let risk = "Riesgo Leve (15-18)";
    let colorClass = "bg-emerald-50 text-emerald-700 border-emerald-250";
    if (total <= 9) {
      risk = "Riesgo Muy Alto / Severo (<=9)";
      colorClass = "bg-rose-600 text-white border-rose-700";
    } else if (total <= 12) {
      risk = "Riesgo Alto (10-12)";
      colorClass = "bg-rose-500 text-white border-rose-600";
    } else if (total <= 14) {
      risk = "Riesgo Moderado (13-14)";
      colorClass = "bg-amber-500 text-slate-900 border-amber-600";
    } else if (total > 18) {
      risk = "Sin Riesgo (>18)";
      colorClass = "bg-emerald-500 text-white border-emerald-600";
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Escala de Braden</h2>
          <p className="text-xs text-slate-500 mt-0.5">Evalúa y predice el riesgo de desarrollar úlceras por presión (UPP).</p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">1. Percepción Sensorial</label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {[
                { val: 1, txt: "1 - Completamente limitada" },
                { val: 2, txt: "2 - Muy limitada" },
                { val: 3, txt: "3 - Ligeramente limitada" },
                { val: 4, txt: "4 - Sin alteraciones" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setBradenSensory(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                    bradenSensory === opt.val ? 'bg-indigo-650 border-indigo-650 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">2. Exposición a la Humedad</label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {[
                { val: 1, txt: "1 - Constantemente húmeda" },
                { val: 2, txt: "2 - A menudo húmeda" },
                { val: 3, txt: "3 - Ocasionalmente húmeda" },
                { val: 4, txt: "4 - Raramente húmeda" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setBradenMoisture(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                    bradenMoisture === opt.val ? 'bg-indigo-650 border-indigo-650 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">3. Actividad Física</label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {[
                { val: 1, txt: "1 - Encamado" },
                { val: 2, txt: "2 - En silla de ruedas" },
                { val: 3, txt: "3 - Deambula ocasionalmente" },
                { val: 4, txt: "4 - Deambula frecuentemente" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setBradenActivity(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                    bradenActivity === opt.val ? 'bg-indigo-650 border-indigo-650 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">4. Movilidad Corporal</label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {[
                { val: 1, txt: "1 - Completamente inmóvil" },
                { val: 2, txt: "2 - Muy limitada" },
                { val: 3, txt: "3 - Ligeramente limitada" },
                { val: 4, txt: "4 - Sin limitaciones" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setBradenMobility(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                    bradenMobility === opt.val ? 'bg-indigo-650 border-indigo-650 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">5. Patrón de Nutrición</label>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {[
                { val: 1, txt: "1 - Muy pobre" },
                { val: 2, txt: "2 - Probablemente inadecuada" },
                { val: 3, txt: "3 - Adecuada" },
                { val: 4, txt: "4 - Excelente" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setBradenNutrition(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                    bradenNutrition === opt.val ? 'bg-indigo-650 border-indigo-650 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">6. Fricción y Cizallamiento</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { val: 1, txt: "1 - Problema constante" },
                { val: 2, txt: "2 - Problema potencial" },
                { val: 3, txt: "3 - Sin problemas" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setBradenFriction(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-left transition-all cursor-pointer ${
                    bradenFriction === opt.val ? 'bg-indigo-650 border-indigo-650 text-white font-bold' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Resultado Escala Braden</span>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-extrabold text-slate-800">{total}</span>
              <span className="text-xs font-bold text-slate-400">/ 23 puntos</span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl text-xs font-extrabold border shadow-sm ${colorClass}`}>
            {risk}
          </div>
        </div>
      </div>
    );
  };

  const renderDowntonCalculator = () => {
    const total = downtonFalls + downtonMeds + downtonSensory + downtonMental + downtonGait;
    let risk = "Riesgo Bajo de Caídas (<3)";
    let colorClass = "bg-emerald-500 text-white border-emerald-600";
    if (total >= 3) {
      risk = "Riesgo Alto de Caídas (>=3)";
      colorClass = "bg-rose-500 text-white border-rose-600";
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Escala de Downton</h2>
          <p className="text-xs text-slate-500 mt-0.5">Evalúa y estratifica el riesgo de caídas en pacientes hospitalizados o geriátricos.</p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">1. Antecedentes de caídas previas</label>
            <div className="grid grid-cols-2 gap-2 max-w-xs">
              {[
                { val: 0, txt: "No (0)" },
                { val: 1, txt: "Sí (1)" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setDowntonFalls(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-center transition-all cursor-pointer ${
                    downtonFalls === opt.val ? 'bg-indigo-650 border-indigo-650 text-white font-bold' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">2. Medicamentos de riesgo</label>
            <p className="text-[10px] text-slate-400 leading-tight pb-1">
              (Tranquilizantes, sedantes, diuréticos, hipotensores, antiparkinsonianos, antidepresivos, neurolepticos).
            </p>
            <div className="grid grid-cols-2 gap-2 max-w-xs">
              {[
                { val: 0, txt: "Ninguno (0)" },
                { val: 1, txt: "Sí toma uno o más (1)" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setDowntonMeds(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-center transition-all cursor-pointer ${
                    downtonMeds === opt.val ? 'bg-indigo-650 border-indigo-650 text-white font-bold' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">3. Déficits sensoriales</label>
            <p className="text-[10px] text-slate-400 leading-tight pb-1">
              (Alteraciones visuales importantes, auditivas o paresia/déficits de extremidades).
            </p>
            <div className="grid grid-cols-2 gap-2 max-w-xs">
              {[
                { val: 0, txt: "Ninguno (0)" },
                { val: 1, txt: "Sí presenta (1)" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setDowntonSensory(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-center transition-all cursor-pointer ${
                    downtonSensory === opt.val ? 'bg-indigo-650 border-indigo-650 text-white font-bold' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">4. Estado Mental</label>
            <div className="grid grid-cols-2 gap-2 max-w-xs">
              {[
                { val: 0, txt: "Orientado (0)" },
                { val: 1, txt: "Confuso o demente (1)" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setDowntonMental(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-center transition-all cursor-pointer ${
                    downtonMental === opt.val ? 'bg-indigo-650 border-indigo-650 text-white font-bold' : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">5. Tipo de Marcha / Ambulación</label>
            <div className="grid grid-cols-2 gap-2 max-w-xs">
              {[
                { val: 0, txt: "Segura / Normal (0)" },
                { val: 1, txt: "Insegura, con ayuda o limitada (1)" }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setDowntonGait(opt.val)}
                  className={`px-3 py-2 rounded-xl border text-[11px] text-center transition-all cursor-pointer ${
                    downtonGait === opt.val ? 'bg-indigo-650 border-indigo-650 text-white font-bold' : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-50'
                  }`}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Resultado Escala Downton</span>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-extrabold text-slate-800">{total}</span>
              <span className="text-xs font-bold text-slate-400">/ 5 puntos</span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl text-xs font-extrabold border shadow-sm ${colorClass}`}>
            {risk}
          </div>
        </div>
      </div>
    );
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
                <h1 className="text-sm font-extrabold tracking-tight text-white">Taxonomías NANDA-I, NOC & NIC</h1>
              </div>
            </div>
            
            <div className="flex items-center flex-wrap justify-center gap-3">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Taxonomía 2024-2026 Activa
              </span>

              {/* Dark mode friendly user profile widget */}
              <div className="flex items-center gap-2">
                {authLoading ? (
                  <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                ) : user ? (
                  <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-2xl backdrop-blur-sm">
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] font-bold text-slate-200 truncate max-w-[130px]">{user.email}</span>
                      {subscriptionStatus === 'active' ? (
                        <span className="text-[8px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20 w-fit self-end">Premium ★</span>
                      ) : (
                        <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 bg-white/10 px-1 py-0.5 rounded w-fit self-end">Plan Gratuito</span>
                      )}
                    </div>
                    
                    {subscriptionStatus === 'active' ? (
                      <button
                        onClick={handleManageSubscription}
                        className="text-[10px] font-extrabold bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-xl transition-all cursor-pointer font-sans"
                      >
                        Mi Plan
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowPaywallModal(true)}
                        className="text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2.5 py-1 rounded-xl shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all cursor-pointer font-sans"
                      >
                        Mejorar
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Cerrar Sesión"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-2xl text-[11px] font-extrabold shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all cursor-pointer font-sans"
                  >
                    Iniciar Sesión
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Landing Body */}
          <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 flex flex-col justify-center relative z-10 space-y-16">
            
            {/* Hero Section - Two Columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              {/* Left Column: Info & CTA */}
              <div className="md:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-xl text-[10px] font-bold">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                  Impulsado por Inteligencia Artificial y Respaldo Local
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-white via-indigo-100 to-slate-400 bg-clip-text text-transparent">
                  Consultor Clínico de Enfermería NNN
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                  Diseña, consulta y valida tus planes de cuidados de enfermería de manera integral y ágil. Vincula síntomas con diagnósticos NANDA, resultados NOC e intervenciones NIC al instante, con herramientas y calculadoras de soporte integradas.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => setShowLanding(false)}
                    className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl text-xs transition-all shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-2 group font-sans"
                  >
                    Comenzar Consulta de Cuidados
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <button
                    onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-5 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 font-extrabold rounded-2xl text-xs transition-all border border-white/10 cursor-pointer flex items-center gap-2 font-sans"
                  >
                    Ver Nuevas Funciones
                  </button>
                </div>
              </div>
              
              {/* Right Column: High-Tech Nurse Image */}
              <div className="md:col-span-5 flex justify-center relative">
                {/* Decorative glow effects */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500/30 via-purple-500/10 to-emerald-500/30 rounded-[36px] blur-2xl opacity-75 -z-10 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 rounded-full bg-indigo-600/10 blur-[80px] -z-10"></div>
                
                <div className="p-2 bg-white/[0.03] border border-white/10 rounded-[32px] backdrop-blur-md shadow-2xl transition-transform duration-500 hover:scale-[1.03]">
                  <img 
                    src={techNurseImg} 
                    alt="Enfermera Tecnológica NNN" 
                    className="rounded-[24px] border border-white/5 w-full max-w-[300px] md:max-w-full aspect-square object-cover bg-slate-900/60 shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Core Instruction Steps Grid */}
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-bold text-slate-100">Flujo General de Trabajo</h3>
                <p className="text-xs text-slate-400">Cuatro pasos sencillos para estructurar tu plan clínico</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* STEP 1 */}
                <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 p-6 rounded-3xl space-y-3 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-sm">
                    01
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-200">Ingresar Síntomas</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Describe los signos y síntomas de tu paciente en lenguaje natural (ej. <i>"dolor de cabeza agudo"</i>) o busca por código.
                  </p>
                </div>

                {/* STEP 2 */}
                <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 p-6 rounded-3xl space-y-3 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                    02
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-200">Mapeo NNN</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    La plataforma vincula al instante el diagnóstico NANDA, el resultado esperado (NOC) y la intervención NIC ideal.
                  </p>
                </div>

                {/* STEP 3 */}
                <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 p-6 rounded-3xl space-y-3 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    03
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-200">Personalizar Plan</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Selecciona factores e indicadores. Modifica o intercambia el NOC o NIC usando nuestros buscadores interactivos.
                  </p>
                </div>

                {/* STEP 4 */}
                <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 p-6 rounded-3xl space-y-3 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-300">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-sm">
                    04
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-200">Obtener Nota</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Copia la nota de evolución clínica redactada automáticamente en formato estándar (SOAPIE) para tu sistema de salud.
                  </p>
                </div>

              </div>
            </div>

            {/* New Features Section */}
            <div id="features-section" className="space-y-6 pt-4 scroll-mt-24">
              <div className="text-center md:text-left space-y-1">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400">Expansión Premium</div>
                <h3 className="text-lg font-bold text-slate-100">Suite Clínico y Nuevas Funcionalidades</h3>
                <p className="text-xs text-slate-400">Herramientas avanzadas integradas para optimizar la práctica diaria de enfermería</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Feature 1: Calculadoras */}
                <div className="bg-gradient-to-br from-indigo-950/20 to-slate-900/40 border border-white/5 hover:border-indigo-500/20 p-6 rounded-3xl flex gap-4 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                    <Calculator className="w-5.5 h-5.5" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
                      9 Calculadoras Clínicas
                      <span className="text-[9px] font-extrabold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">Free & Premium</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Escala de Glasgow, Test de APGAR, Test de Silverman-Andersen, Interpretación de Gases Arteriales (AGA), IMC, Dosificación de Medicamentos, Braden, Downton y cálculo de FPP integradas en un solo lugar.
                    </p>
                  </div>
                </div>

                {/* Feature 2: Guardado en la Nube */}
                <div className="bg-gradient-to-br from-emerald-950/10 to-slate-900/40 border border-white/5 hover:border-emerald-500/20 p-6 rounded-3xl flex gap-4 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Database className="w-5.5 h-5.5" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
                      Historial y Planes en la Nube
                      <span className="text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">Premium</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Guarda tus planes de cuidados directamente en Firestore con el nombre del paciente. Edita, visualiza en detalle o cárgalos de regreso al workspace activo en cualquier momento.
                    </p>
                  </div>
                </div>

                {/* Feature 3: Redactor SOAPIE IA */}
                <div className="bg-gradient-to-br from-amber-950/10 to-slate-900/40 border border-white/5 hover:border-amber-500/20 p-6 rounded-3xl flex gap-4 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5.5 h-5.5" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
                      Redacción SOAPIE con IA
                      <span className="text-[9px] font-extrabold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">Premium</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Genera notas de evolución completas siguiendo la metodología SOAPIE usando IA avanzada de Gemini. Incluye un sistema de respaldo inteligente fuera de línea.
                    </p>
                  </div>
                </div>

                {/* Feature 4: PDF & Grid de Impresión */}
                <div className="bg-gradient-to-br from-rose-950/10 to-slate-900/40 border border-white/5 hover:border-rose-500/20 p-6 rounded-3xl flex gap-4 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                    <Printer className="w-5.5 h-5.5" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
                      Exportación PDF & Impresión
                      <span className="text-[9px] font-extrabold bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30">Universal</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Imprime o exporta tus fichas de cuidados a PDF. La hoja de estilos de impresión oculta la interfaz de la app para producir una grilla de formato clínico limpio y profesional.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Database Statistics info */}
            <div className="flex flex-col items-center space-y-5 pt-4">
              <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400">
                <span className="bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60"><b>277</b> Diagnósticos NANDA</span>
                <span className="bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60"><b>612</b> Resultados NOC</span>
                <span className="bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60"><b>614</b> Intervenciones NIC</span>
              </div>

              <button
                onClick={() => setShowLanding(false)}
                className="px-10 py-4.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold rounded-2xl text-xs transition-all shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-2 group font-sans"
              >
                Comenzar Consulta de Cuidados
                <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
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
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 py-2.5 px-4 md:px-10 flex justify-between items-center sticky top-0 z-40 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-xs md:text-base shadow-md shadow-indigo-600/20">
              NNN
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-indigo-600">Consultor</p>
              </div>
              <h1 className="text-xs md:text-lg font-extrabold text-slate-800 tracking-tight">
                Plataforma NNN <span className="hidden sm:inline text-slate-400 font-medium text-xs">2024-2026</span>
              </h1>
            </div>
          </div>

          {/* Right Side: Responsive Actions & Status */}
          <div className="flex items-center gap-1.5 md:gap-3">
            {/* Database indicator: Icon-only on mobile, full text on md+ */}
            <div 
              title="Base de Datos Offline Lista"
              className="bg-emerald-50 text-emerald-700 p-1.5 md:px-3 md:py-1.5 rounded-xl text-[10px] md:text-[11px] font-bold border border-emerald-100 flex items-center gap-1 shadow-sm"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Offline</span>
            </div>

            {/* Ver Instrucciones: Icon-only on mobile, full text on md+ */}
            <button
              onClick={() => setShowLanding(true)}
              title="Ver Instrucciones"
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-1.5 md:px-3 md:py-1.5 rounded-xl text-[10px] md:text-[11px] font-bold border border-indigo-100 flex items-center gap-1 shadow-sm cursor-pointer active:scale-95 transition-all font-sans"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Instrucciones</span>
            </button>

            {/* User Widget */}
            <div className="flex items-center gap-1.5 md:gap-2 pl-1.5 md:pl-3 border-l border-slate-200">
              {authLoading ? (
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              ) : user ? (
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 md:px-2.5 md:py-1 rounded-xl md:rounded-2xl border border-slate-200/60">
                  {/* Email & Subscription Type: hidden on mobile */}
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-[10px] font-bold text-slate-700 truncate max-w-[80px] md:max-w-[120px]">{user.email}</span>
                    {subscriptionStatus === 'active' ? (
                      <span className="text-[8px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-205 w-fit self-end">Premium ★</span>
                    ) : (
                      <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500 bg-slate-200 px-1 py-0.5 rounded w-fit self-end">Gratuito</span>
                    )}
                  </div>

                  {/* Plan Action Button: compact on mobile */}
                  {subscriptionStatus === 'active' ? (
                    <button
                      onClick={handleManageSubscription}
                      className="text-[9px] md:text-[10px] font-extrabold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg md:rounded-xl transition-all cursor-pointer font-sans"
                      title="Administrar Plan"
                    >
                      <span className="hidden sm:inline">Mi Plan</span>
                      <span className="sm:hidden">Plan</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowPaywallModal(true)}
                      className="text-[9px] md:text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg md:rounded-xl shadow-sm hover:from-amber-600 hover:to-amber-700 transition-all cursor-pointer font-sans"
                    >
                      Mejorar
                    </button>
                  )}

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="p-1 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Cerrar Sesión"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-extrabold shadow-md shadow-indigo-600/10 active:scale-[0.98] transition-all cursor-pointer font-sans"
                >
                  Entrar
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Navigation Tabs Bar */}
        <div className="bg-slate-100/80 backdrop-blur-md border-b border-slate-200/60 py-2 px-4 md:px-10 flex gap-2 overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab('consultant')}
            className={`flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'consultant'
                ? 'bg-white text-indigo-650 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Consultor de Cuidados</span>
            <span className="sm:hidden">Consultor</span>
          </button>
          
          <button
            onClick={() => {
              if (subscriptionStatus !== 'active') {
                setShowPaywallModal(true);
                return;
              }
              setActiveTab('saved_plans');
              fetchSavedPlans();
            }}
            className={`flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer relative ${
              activeTab === 'saved_plans'
                ? 'bg-white text-indigo-650 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Mis Planes Guardados</span>
            <span className="sm:hidden">Planes</span>
            {subscriptionStatus !== 'active' && (
              <Sparkles className="w-3 h-3 text-amber-500 absolute -top-1 -right-1" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('calculators');
            }}
            className={`flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'calculators'
                ? 'bg-white text-indigo-650 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Calculadoras Clínicas</span>
            <span className="sm:hidden">Calculadoras</span>
          </button>
        </div>

        {activeTab === 'consultant' && (
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
                      onChange={(e) => {
                        if (e.target.checked) {
                          if (subscriptionStatus !== 'active') {
                            setShowPaywallModal(true);
                          } else {
                            setUseAiNanda(true);
                          }
                        } else {
                          setUseAiNanda(false);
                        }
                      }}
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
                        className="px-3 py-2 bg-emerald-650 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer font-sans"
                      >
                        {isInlineNocLoading ? (
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
                        id="ai-toggle-noc-search"
                        checked={useAiNoc}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (subscriptionStatus !== 'active') {
                              setShowPaywallModal(true);
                            } else {
                              setUseAiNoc(true);
                            }
                          } else {
                            setUseAiNoc(false);
                          }
                        }}
                        className="rounded border-slate-350 text-emerald-600 focus:ring-emerald-500/10 cursor-pointer w-4 h-4"
                      />
                      <label htmlFor="ai-toggle-noc-search" className="text-[10px] font-bold text-slate-600 cursor-pointer select-none flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Búsqueda Asistida por IA
                      </label>
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
                        className="px-3 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer font-sans"
                      >
                        {isInlineNicLoading ? (
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
                        id="ai-toggle-nic-search"
                        checked={useAiNic}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (subscriptionStatus !== 'active') {
                              setShowPaywallModal(true);
                            } else {
                              setUseAiNic(true);
                            }
                          } else {
                            setUseAiNic(false);
                          }
                        }}
                        className="rounded border-slate-350 text-indigo-650 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="ai-toggle-nic-search" className="text-[10px] font-bold text-slate-600 cursor-pointer select-none flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Búsqueda Asistida por IA
                      </label>
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
                    
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                      {/* AI SOAPIE Button */}
                      <button
                        onClick={() => {
                          if (subscriptionStatus !== 'active') {
                            setShowPaywallModal(true);
                            return;
                          }
                          handleGenerateSoapie();
                        }}
                        disabled={soapieGenerating}
                        className="px-3.5 py-2 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 flex-1 sm:flex-initial justify-center"
                      >
                        {soapieGenerating ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Generando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-500" /> Redactar SOAPIE con IA
                          </>
                        )}
                      </button>

                      <button
                        onClick={copyToClipboard}
                        className="px-3.5 py-2 text-xs text-indigo-650 bg-indigo-50 hover:bg-indigo-100 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 flex-1 sm:flex-initial justify-center"
                      >
                        {copiedNote ? (
                          <>
                            <CopyCheck className="w-4 h-4 text-emerald-600" /> ¡Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" /> Copiar
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <pre className="text-xs bg-slate-900 border border-slate-800 text-slate-200 p-4.5 rounded-2xl overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed max-h-56 shadow-inner">
                    {clinicalNote}
                  </pre>

                  {/* Patient Name Input */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-bold text-slate-700 block">Nombre del Paciente (Para guardar/exportar)</label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Ej. Juan Pérez García..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 text-slate-800"
                    />
                  </div>

                  {/* Actions Row */}
                  <div className="flex flex-wrap justify-end gap-3 pt-3 border-t border-slate-100 no-print">
                    <button
                      onClick={() => {
                        setSymptomInput('');
                        setAnalysisResult(null);
                        setChosenFactors([]);
                        setChosenIndicators([]);
                        setChosenActivities([]);
                        setInlineNocResults(null);
                        setInlineNicResults(null);
                        setPatientName('');
                      }}
                      className="px-4.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      Limpiar Workspace
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" /> Exportar a PDF
                    </button>

                    <button
                      onClick={handleSavePlan}
                      disabled={savingPlan}
                      className="px-4.5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {savingPlan ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Guardando...
                        </>
                      ) : (
                        <>
                          <Database className="w-4 h-4" /> Guardar Plan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </section>

        </main>
      )}

      {/* RENDER THE SAVED PLANS AND CALCULATORS TAB LAYOUTS */}
      {activeTab === 'saved_plans' && (
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-6 no-print">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-800">Mis Planes de Cuidados</h2>
              <p className="text-xs text-slate-500 mt-1">Historial de planes NANDA-NOC-NIC guardados en tu perfil.</p>
            </div>
            <button
              onClick={() => {
                setActiveTab('consultant');
              }}
              className="px-4.5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-md shadow-indigo-600/10"
            >
              <PlusCircle className="w-4 h-4" /> Nuevo Plan
            </button>
          </div>

          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-3xl border border-slate-200/85 p-6 space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                  <div className="space-y-2 pt-2">
                    <div className="h-3 bg-slate-100 rounded"></div>
                    <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : savedPlans.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-10 text-center max-w-xl mx-auto py-16 flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Database className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800">No tienes planes guardados</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-xs">
                Crea un plan en el **Consultor de Cuidados**, asígnale el nombre del paciente y presiona **Guardar Plan** para registrarlo aquí.
              </p>
              <button
                onClick={() => setActiveTab('consultant')}
                className="mt-6 px-5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Ir al Consultor
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPlans.map((plan: any) => (
                <div key={plan.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden group">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-800 truncate max-w-[180px]">{plan.patientName}</h4>
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                          {plan.createdAt ? new Date(plan.createdAt._seconds ? plan.createdAt._seconds * 1000 : (plan.createdAt.seconds ? plan.createdAt.seconds * 1000 : plan.createdAt)).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Fecha desconocida'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer shrink-0"
                        title="Eliminar Plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    <div className="space-y-2.5 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded-md">NANDA</span>
                        <p className="font-extrabold text-slate-750 leading-tight truncate">{plan.nandaCode} - {plan.nandaName}</p>
                      </div>
                      {plan.nocName && (
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md">NOC</span>
                          <p className="font-bold text-slate-650 leading-tight truncate">{plan.nocCode} - {plan.nocName}</p>
                        </div>
                      )}
                      {plan.nicName && (
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 bg-indigo-50 text-indigo-750 rounded-md">NIC</span>
                          <p className="font-bold text-slate-650 leading-tight truncate">{plan.nicCode} - {plan.nicName}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={() => setSelectedPlanDetails(plan)}
                      className="flex-1 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Ver Detalle
                    </button>
                    <button
                      onClick={() => {
                        setAnalysisResult({
                          nandaCode: plan.nandaCode,
                          nandaName: plan.nandaName,
                          definition: '',
                          relatedFactors: [],
                          nocCode: plan.nocCode,
                          nocName: plan.nocName,
                          nocIndicators: [],
                          nicCode: plan.nicCode,
                          nicName: plan.nicName,
                          nicActivities: [],
                          justification: 'Plan cargado del historial.'
                        });
                        setChosenFactors([]);
                        
                        // Extract codes from indicators formatted as "Name (CÓD: Code)" or use directly
                        const loadedIndicators = (plan.nocIndicators || []).map((indStr: string) => {
                          const m = indStr.match(/\(CÓD:\s*(\d+)\)/);
                          return m ? m[1] : indStr;
                        });
                        setChosenIndicators(loadedIndicators);
                        setChosenActivities(plan.nicActivities || []);
                        setClinicalNote(plan.evolutionNote || '');
                        setPatientName(plan.patientName || '');
                        setActiveTab('consultant');
                        alert("Plan de cuidados cargado en tu workspace activo.");
                      }}
                      className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Cargar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {activeTab === 'calculators' && (
        <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start no-print">
          {/* Aside Menu */}
          <aside className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-800">Suite de Calculadoras</h2>
              <p className="text-xs text-slate-500 mt-0.5">Selecciona una herramienta clínica.</p>
            </div>

            {/* Selector para Mobile (Dropdown) */}
            <div className="lg:hidden relative">
              <select
                id="calculator-selector"
                value={activeCalculator}
                onChange={(e) => setActiveCalculator(e.target.value as any)}
                className="w-full bg-slate-50 text-slate-800 font-extrabold text-xs pl-4 pr-10 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans cursor-pointer appearance-none animate-fade-in"
              >
                {[
                  { id: 'glasgow', name: 'Escala de Glasgow', isPremium: true },
                  { id: 'apgar', name: 'Test de APGAR', isPremium: true },
                  { id: 'silverman', name: 'Test de Silverman-Andersen', isPremium: true },
                  { id: 'abg', name: 'Gases Arteriales (ABG)', isPremium: true },
                  { id: 'braden', name: 'Escala de Braden (UPP)', isPremium: true },
                  { id: 'downton', name: 'Escala de Downton (Caídas)', isPremium: true },
                  { id: 'fpp', name: 'Fecha Probable de Parto (FPP)', isPremium: true },
                  { id: 'bmi', name: 'Cálculo de IMC', isPremium: false },
                  { id: 'dose', name: 'Regla de Tres (Dosis)', isPremium: false },
                ].map((calc) => {
                  const isLocked = calc.isPremium && subscriptionStatus !== 'active';
                  return (
                    <option key={calc.id} value={calc.id}>
                      {calc.name} {isLocked ? ' (🔒 Premium)' : calc.isPremium ? ' (★ Premium)' : ' (Gratis)'}
                    </option>
                  );
                })}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Listado de botones para Desktop */}
            <div className="hidden lg:flex flex-col gap-1">
              {[
                { id: 'glasgow', name: 'Escala de Glasgow', isPremium: true },
                { id: 'apgar', name: 'Test de APGAR', isPremium: true },
                { id: 'silverman', name: 'Test de Silverman-Andersen', isPremium: true },
                { id: 'abg', name: 'Gases Arteriales (ABG)', isPremium: true },
                { id: 'braden', name: 'Escala de Braden (UPP)', isPremium: true },
                { id: 'downton', name: 'Escala de Downton (Caídas)', isPremium: true },
                { id: 'fpp', name: 'Fecha Probable de Parto (FPP)', isPremium: true },
                { id: 'bmi', name: 'Cálculo de IMC', isPremium: false },
                { id: 'dose', name: 'Regla de Tres (Dosis)', isPremium: false },
              ].map((calc) => {
                const isActive = activeCalculator === calc.id;
                const isLocked = calc.isPremium && subscriptionStatus !== 'active';
                return (
                  <button
                    key={calc.id}
                    onClick={() => setActiveCalculator(calc.id as any)}
                    className={`w-full px-4 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-indigo-650 text-white shadow-md shadow-indigo-600/10'
                        : 'bg-slate-50 border border-slate-150 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Activity className="w-4 h-4 shrink-0" />
                      {calc.name}
                    </span>
                    {isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                    ) : calc.isPremium ? (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded-md">Gratis</span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Active Calculator Workspace */}
          <section className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 min-h-[480px] flex flex-col justify-between">
            {['glasgow', 'apgar', 'silverman', 'abg', 'braden', 'downton', 'fpp'].includes(activeCalculator) && subscriptionStatus !== 'active' ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
                <div className="w-16 h-16 bg-amber-50 rounded-3xl border border-amber-200 flex items-center justify-center animate-pulse">
                  <Lock className="w-8 h-8 text-amber-600" />
                </div>
                <div className="space-y-2 max-w-md">
                  <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-xl text-[10px] font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    Herramienta Diagnóstica Premium
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-800">
                    Acceso Restringido
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed px-4">
                    Esta calculadora y escala clínica está disponible únicamente en el plan Premium de Enfermería NNN. Desbloquea acceso completo e ilimitado para ti.
                  </p>
                </div>
                <button
                  onClick={() => setShowPaywallModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md active:scale-95 cursor-pointer font-sans"
                >
                  Obtener Plan Premium
                </button>
              </div>
            ) : (
              <div className="flex-1">
                {activeCalculator === 'glasgow' && renderGlasgowCalculator()}
                {activeCalculator === 'apgar' && renderApgarCalculator()}
                {activeCalculator === 'silverman' && renderSilvermanCalculator()}
                {activeCalculator === 'bmi' && renderBmiCalculator()}
                {activeCalculator === 'fpp' && renderFppCalculator()}
                {activeCalculator === 'dose' && renderDoseCalculator()}
                {activeCalculator === 'abg' && renderAbgCalculator()}
                {activeCalculator === 'braden' && renderBradenCalculator()}
                {activeCalculator === 'downton' && renderDowntonCalculator()}
              </div>
            )}
          </section>
        </main>
      )}

      {/* PRINT VIEW (Active Workspace) */}
      {analysisResult && (
        <div className="print-view hidden print:block p-8 bg-white text-slate-900 font-sans text-xs">
          <div className="text-center space-y-1 mb-6">
            <h1 className="text-lg font-extrabold uppercase tracking-wider text-slate-855">Plan de Cuidados de Enfermería</h1>
            <p className="text-[10px] text-slate-500 uppercase font-bold">Taxonomías Oficiales NANDA-I, NOC & NIC</p>
          </div>

          <div className="border border-slate-300 rounded-xl p-4 mb-6 grid grid-cols-2 gap-4 bg-slate-50">
            <div>
              <span className="font-bold text-slate-500 block uppercase text-[9px]">Paciente</span>
              <span className="text-sm font-extrabold text-slate-800">{patientName || "Paciente Anónimo"}</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-500 block uppercase text-[9px]">Fecha de Emisión</span>
              <span className="text-sm font-extrabold text-slate-800">{new Date().toLocaleDateString('es-ES')}</span>
            </div>
          </div>

          <table className="w-full border-collapse border border-slate-300 rounded-xl overflow-hidden mb-6">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-left text-[10px] uppercase font-bold">
                <th className="border border-slate-300 p-3 w-1/3">Diagnóstico NANDA-I</th>
                <th className="border border-slate-300 p-3 w-1/3">Resultados NOC</th>
                <th className="border border-slate-300 p-3 w-1/3">Intervenciones NIC</th>
              </tr>
            </thead>
            <tbody>
              <tr className="align-top text-slate-800 leading-relaxed">
                <td className="border border-slate-300 p-3 space-y-2">
                  <div className="font-extrabold text-indigo-700">CÓD: {analysisResult.nandaCode}</div>
                  <div className="font-bold text-[13px]">{analysisResult.nandaName}</div>
                  <div className="text-[10px] text-slate-500 italic">"{analysisResult.definition}"</div>
                  {chosenFactors.length > 0 && (
                    <div className="pt-2 border-t border-slate-150">
                      <span className="font-bold text-[9px] uppercase text-slate-400 block mb-1">Factores Relacionados</span>
                      <ul className="list-disc pl-4 space-y-1 text-[10px]">
                        {chosenFactors.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </td>
                <td className="border border-slate-300 p-3 space-y-2">
                  <div className="font-extrabold text-emerald-700">CÓD: {analysisResult.nocCode}</div>
                  <div className="font-bold text-[13px]">{analysisResult.nocName}</div>
                  {chosenIndicators.length > 0 && (
                    <div className="pt-2 border-t border-slate-150">
                      <span className="font-bold text-[9px] uppercase text-slate-400 block mb-1">Indicadores Seleccionados</span>
                      <ul className="list-disc pl-4 space-y-1 text-[10px]">
                        {chosenIndicators.map((code, idx) => {
                          const indObj = analysisResult.nocIndicators?.find((ind: any) => ind.code === code);
                          return <li key={idx}>{indObj ? `${indObj.name} (CÓD: ${indObj.code})` : code}</li>;
                        })}
                      </ul>
                    </div>
                  )}
                </td>
                <td className="border border-slate-300 p-3 space-y-2">
                  <div className="font-extrabold text-indigo-650">CÓD: {analysisResult.nicCode}</div>
                  <div className="font-bold text-[13px]">{analysisResult.nicName}</div>
                  {chosenActivities.length > 0 && (
                    <div className="pt-2 border-t border-slate-150">
                      <span className="font-bold text-[9px] uppercase text-slate-400 block mb-1">Actividades Seleccionadas</span>
                      <ul className="list-disc pl-4 space-y-1 text-[10px]">
                        {chosenActivities.map((act, idx) => (
                          <li key={idx}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {clinicalNote && (
            <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 space-y-2 page-break-avoid">
              <span className="font-bold text-[9px] uppercase text-slate-500 block">Nota de Evolución Clínico (SOAPIE)</span>
              <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-800">
                {clinicalNote}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* PRINT VIEW (Saved Plan Details) */}
      {selectedPlanDetails && (
        <div className="print-view hidden print:block p-8 bg-white text-slate-900 font-sans text-xs">
          <div className="text-center space-y-1 mb-6">
            <h1 className="text-lg font-extrabold uppercase tracking-wider text-slate-800">Plan de Cuidados de Enfermería</h1>
            <p className="text-[10px] text-slate-500 uppercase font-bold">Taxonomías Oficiales NANDA-I, NOC & NIC</p>
          </div>

          <div className="border border-slate-300 rounded-xl p-4 mb-6 grid grid-cols-2 gap-4 bg-slate-50">
            <div>
              <span className="font-bold text-slate-500 block uppercase text-[9px]">Paciente</span>
              <span className="text-sm font-extrabold text-slate-800">{selectedPlanDetails.patientName}</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-slate-500 block uppercase text-[9px]">Fecha de Creación</span>
              <span className="text-sm font-extrabold text-slate-800">
                {selectedPlanDetails.createdAt ? new Date(selectedPlanDetails.createdAt._seconds ? selectedPlanDetails.createdAt._seconds * 1000 : (selectedPlanDetails.createdAt.seconds ? selectedPlanDetails.createdAt.seconds * 1000 : selectedPlanDetails.createdAt)).toLocaleDateString('es-ES') : ''}
              </span>
            </div>
          </div>

          <table className="w-full border-collapse border border-slate-300 rounded-xl overflow-hidden mb-6">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-left text-[10px] uppercase font-bold">
                <th className="border border-slate-300 p-3 w-1/3">Diagnóstico NANDA-I</th>
                <th className="border border-slate-300 p-3 w-1/3">Resultados NOC</th>
                <th className="border border-slate-300 p-3 w-1/3">Intervenciones NIC</th>
              </tr>
            </thead>
            <tbody>
              <tr className="align-top text-slate-800 leading-relaxed">
                <td className="border border-slate-300 p-3 space-y-2">
                  <div className="font-extrabold text-indigo-700">CÓD: {selectedPlanDetails.nandaCode}</div>
                  <div className="font-bold text-[13px]">{selectedPlanDetails.nandaName}</div>
                  {selectedPlanDetails.relatedFactors && selectedPlanDetails.relatedFactors.length > 0 && (
                    <div className="pt-2 border-t border-slate-150">
                      <span className="font-bold text-[9px] uppercase text-slate-400 block mb-1">Factores Relacionados</span>
                      <ul className="list-disc pl-4 space-y-1 text-[10px]">
                        {selectedPlanDetails.relatedFactors.map((f: string, i: number) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </td>
                <td className="border border-slate-300 p-3 space-y-2">
                  <div className="font-extrabold text-emerald-700">CÓD: {selectedPlanDetails.nocCode}</div>
                  <div className="font-bold text-[13px]">{selectedPlanDetails.nocName}</div>
                  {selectedPlanDetails.nocIndicators && selectedPlanDetails.nocIndicators.length > 0 && (
                    <div className="pt-2 border-t border-slate-150">
                      <span className="font-bold text-[9px] uppercase text-slate-400 block mb-1">Indicadores Seleccionados</span>
                      <ul className="list-disc pl-4 space-y-1 text-[10px]">
                        {selectedPlanDetails.nocIndicators.map((ind: string, idx: number) => (
                          <li key={idx}>{ind}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </td>
                <td className="border border-slate-300 p-3 space-y-2">
                  <div className="font-extrabold text-indigo-650">CÓD: {selectedPlanDetails.nicCode}</div>
                  <div className="font-bold text-[13px]">{selectedPlanDetails.nicName}</div>
                  {selectedPlanDetails.nicActivities && selectedPlanDetails.nicActivities.length > 0 && (
                    <div className="pt-2 border-t border-slate-150">
                      <span className="font-bold text-[9px] uppercase text-slate-400 block mb-1">Actividades Seleccionadas</span>
                      <ul className="list-disc pl-4 space-y-1 text-[10px]">
                        {selectedPlanDetails.nicActivities.map((act: string, idx: number) => (
                          <li key={idx}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {selectedPlanDetails.evolutionNote && (
            <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 space-y-2 page-break-avoid">
              <span className="font-bold text-[9px] uppercase text-slate-500 block">Nota de Evolución Clínico (SOAPIE)</span>
              <pre className="font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-800">
                {selectedPlanDetails.evolutionNote}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Subtle page footer */}
      <footer className="py-6 border-t border-slate-200/60 text-center bg-white mt-12 no-print">
        <p className="text-[10px] text-slate-405 font-bold uppercase tracking-wider">
          Enfermería NNN • Taxonomías NANDA-I 2024-2026, NOC 7ª Ed., NIC 8ª Ed.
        </p>
      </footer>

      </div>
    )}

      {/* 1. AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-sm w-full overflow-hidden p-6 space-y-6 relative animate-scale-up">
            
            <button
              onClick={() => {
                setShowAuthModal(false);
                setAuthError('');
              }}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-lg shadow-indigo-600/20 mx-auto">
                NNN
              </div>
              <h3 className="text-base font-extrabold text-slate-800">
                {authMode === 'login' ? 'Iniciar Sesión NNN' : 'Crear Cuenta NNN'}
              </h3>
              <p className="text-xs text-slate-500">
                {authMode === 'login' 
                  ? 'Accede para sincronizar tus planes e IA premium' 
                  : 'Regístrate para obtener tu plan de cuidados de enfermería'}
              </p>
            </div>

            {/* Toggle tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'login' ? 'bg-white text-indigo-650 shadow-sm' : 'text-slate-500'
                }`}
              >
                Ingresar
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'register' ? 'bg-white text-indigo-650 shadow-sm' : 'text-slate-500'
                }`}
              >
                Registrarse
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="nombre@ejemplo.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Contraseña</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-600 text-slate-800"
                />
              </div>

              {authError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/10"
              >
                {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setAuthError('');
                }}
                className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold cursor-pointer font-sans"
              >
                {authMode === 'login' ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes una cuenta? Inicia sesión'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PAYWALL MODAL */}
      {showPaywallModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-6 relative animate-scale-up">
            
            <button
              onClick={() => setShowPaywallModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-xl text-[10px] font-bold mx-auto">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Plan Premium NNN
              </div>
              <h3 className="text-lg font-extrabold text-slate-800">
                Desbloquea el Asistente de IA
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed px-4">
                Genera mapeos automáticos de cuidados y asocia diagnósticos oficiales de NANDA-I, NOC y NIC asistidos por inteligencia artificial.
              </p>
            </div>

            {/* Premium Benefits List */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                <div>
                  <p className="font-bold">Analizador de Síntomas por IA</p>
                  <p className="text-[10px] text-slate-450 leading-tight">Introduce síntomas libres y obtén mapeos clínicos inteligentes.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                <div>
                  <p className="font-bold">Búsqueda Avanzada Grounded</p>
                  <p className="text-[10px] text-slate-450 leading-tight">Mapea NOC y NIC validados con búsquedas web oficiales en tiempo real.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                <div>
                  <p className="font-bold">Gestión de Suscripción Flexible</p>
                  <p className="text-[10px] text-slate-450 leading-tight">Cancela o cambia de plan en cualquier momento vía Stripe Billing Portal.</p>
                </div>
              </div>
            </div>

            {/* Plans Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Plan Mensual */}
              <div className="border border-slate-200 hover:border-indigo-400 rounded-2xl p-4 flex flex-col justify-between text-left space-y-3 relative group">
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs">Mensual</h4>
                  <p className="text-[10px] text-slate-400">Facturación mensual</p>
                  <div className="mt-2 flex items-baseline gap-1 text-slate-800">
                    <span className="text-2xl font-extrabold">$3</span>
                    <span className="text-xs font-bold text-slate-450">USD/mes</span>
                  </div>
                </div>
                <button
                  onClick={() => handleSubscribe('monthly')}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-[10px] transition-all cursor-pointer active:scale-95 font-sans"
                >
                  Elegir Mensual
                </button>
              </div>

              {/* Plan Anual */}
              <div className="border-2 border-indigo-600 rounded-2xl p-4 flex flex-col justify-between text-left space-y-3 relative bg-indigo-50/20">
                <span className="absolute -top-2.5 left-4 bg-indigo-600 text-white text-[8px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded-md shadow-sm">
                  MEJOR PRECIO
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-xs">Anual</h4>
                  <p className="text-[10px] text-indigo-600 font-bold">Ahorra 72% en el año</p>
                  <div className="mt-2 flex items-baseline gap-1 text-slate-800">
                    <span className="text-2xl font-extrabold">$10</span>
                    <span className="text-xs font-bold text-slate-450">USD/año</span>
                  </div>
                </div>
                <button
                  onClick={() => handleSubscribe('yearly')}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[10px] transition-all cursor-pointer active:scale-95 shadow-md shadow-indigo-600/10 font-sans"
                >
                  Elegir Anual
                </button>
              </div>

            </div>

            <div className="text-center space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowPaywallModal(false)}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-bold cursor-pointer underline font-sans"
              >
                Seguir en el Plan Gratuito (Búsqueda local offline)
              </button>
              <p className="text-[9px] text-slate-400">
                Pago seguro encriptado procesado por Stripe. Facturación recurrente. Cancela cuando quieras.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* 3. SAVED PLAN DETAILS MODAL */}
      {selectedPlanDetails && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in no-print">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden p-6 space-y-6 relative animate-scale-up max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedPlanDetails(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="overflow-y-auto flex-1 pr-1 space-y-5">
              <div>
                <span className="text-[9px] font-bold font-mono px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg uppercase">
                  Plan de Cuidados Guardado
                </span>
                <h3 className="text-lg font-extrabold text-slate-800 mt-2 leading-tight">
                  Paciente: {selectedPlanDetails.patientName}
                </h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1">
                  Guardado el: {selectedPlanDetails.createdAt ? new Date(selectedPlanDetails.createdAt._seconds ? selectedPlanDetails.createdAt._seconds * 1000 : (selectedPlanDetails.createdAt.seconds ? selectedPlanDetails.createdAt.seconds * 1000 : selectedPlanDetails.createdAt)).toLocaleString('es-ES') : 'Fecha de creación desconocida'}
                </p>
              </div>

              <div className="h-px bg-slate-150"></div>

              {/* NANDA-NOC-NIC Grid */}
              <div className="space-y-4">
                {/* NANDA */}
                <div className="bg-amber-50/20 border border-amber-250 rounded-2xl p-4 space-y-1.5">
                  <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded">DIAGNÓSTICO NANDA-I</span>
                  <h4 className="text-xs font-extrabold text-slate-800 leading-tight mt-1">{selectedPlanDetails.nandaCode} - {selectedPlanDetails.nandaName}</h4>
                </div>

                {/* NOC */}
                {selectedPlanDetails.nocName && (
                  <div className="bg-emerald-50/20 border border-emerald-250 rounded-2xl p-4 space-y-3">
                    <div>
                      <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded">RESULTADO NOC</span>
                      <h4 className="text-xs font-extrabold text-slate-800 leading-tight mt-1">{selectedPlanDetails.nocCode} - {selectedPlanDetails.nocName}</h4>
                    </div>
                    {selectedPlanDetails.nocIndicators && selectedPlanDetails.nocIndicators.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-bold text-slate-450 uppercase">Indicadores Seleccionados</p>
                        <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                          {selectedPlanDetails.nocIndicators.map((ind: string, idx: number) => (
                            <li key={idx} className="leading-tight">{ind}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* NIC */}
                {selectedPlanDetails.nicName && (
                  <div className="bg-indigo-50/20 border border-indigo-150 rounded-2xl p-4 space-y-3">
                    <div>
                      <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 bg-indigo-50 text-indigo-850 rounded">INTERVENCIÓN NIC</span>
                      <h4 className="text-xs font-extrabold text-slate-800 leading-tight mt-1">{selectedPlanDetails.nicCode} - {selectedPlanDetails.nicName}</h4>
                    </div>
                    {selectedPlanDetails.nicActivities && selectedPlanDetails.nicActivities.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-bold text-slate-455 uppercase">Actividades Seleccionadas</p>
                        <ul className="list-disc pl-4 text-xs text-slate-600 space-y-1">
                          {selectedPlanDetails.nicActivities.map((act: string, idx: number) => (
                            <li key={idx} className="leading-tight">{act}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* SOAPIE / Evolution Note */}
                {selectedPlanDetails.evolutionNote && (
                  <div className="bg-slate-50 border border-slate-250 rounded-2xl p-4 space-y-2">
                    <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded">NOTA DE EVOLUCIÓN (SOAPIE)</span>
                    <pre className="text-xs bg-slate-900 border border-slate-800 text-slate-200 p-4.5 rounded-xl overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed max-h-56 shadow-inner">
                      {selectedPlanDetails.evolutionNote}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-150">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Exportar / Imprimir PDF
              </button>
              <button
                onClick={() => setSelectedPlanDetails(null)}
                className="px-4.5 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}
