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
  const [activeTab, setActiveTab] = useState<'consultant' | 'saved_plans' | 'calculators' | 'pes'>('consultant');
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

  // PES Builder states
  const [pesType, setPesType] = useState<'real' | 'risk' | 'promotion'>('real');
  const [pesSearchNanda, setPesSearchNanda] = useState<string>('');
  const [pesSelectedNanda, setPesSelectedNanda] = useState<Diagnosis | null>(null);
  const [pesEtiology, setPesEtiology] = useState<string>('');
  const [pesSymptoms, setPesSymptoms] = useState<string>('');
  const [pesResult, setPesResult] = useState<{
    formattedDiagnosis: string;
    problem: string;
    etiology: string;
    signsSymptoms: string;
    pedagogicalAdvice: string;
  } | null>(null);
  const [pesLoading, setPesLoading] = useState<boolean>(false);
  const [pesCopied, setPesCopied] = useState<boolean>(false);
  const [pesError, setPesError] = useState<string>('');
  const [showNandaDropdown, setShowNandaDropdown] = useState<boolean>(false);
  const [pesSelectedNoc, setPesSelectedNoc] = useState<any | null>(null);
  const [pesSelectedNic, setPesSelectedNic] = useState<any | null>(null);
  const [pesSelectedIndicators, setPesSelectedIndicators] = useState<string[]>([]);
  const [pesSelectedActivities, setPesSelectedActivities] = useState<string[]>([]);
  const [pesSoapieResult, setPesSoapieResult] = useState<string>('');
  const [pesSoapieGenerating, setPesSoapieGenerating] = useState<boolean>(false);

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

  // Selected calculator subtab and category filter
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Norton Scale states
  const [nortonPhysical, setNortonPhysical] = useState<number>(4);
  const [nortonMental, setNortonMental] = useState<number>(4);
  const [nortonActivity, setNortonActivity] = useState<number>(4);
  const [nortonMobility, setNortonMobility] = useState<number>(4);
  const [nortonIncontinence, setNortonIncontinence] = useState<number>(4);

  // Barthel Index states
  const [barthelFeeding, setBarthelFeeding] = useState<number>(10);
  const [barthelBathing, setBarthelBathing] = useState<number>(5);
  const [barthelGrooming, setBarthelGrooming] = useState<number>(5);
  const [barthelDressing, setBarthelDressing] = useState<number>(10);
  const [barthelBowels, setBarthelBowels] = useState<number>(10);
  const [barthelBladder, setBarthelBladder] = useState<number>(10);
  const [barthelToilet, setBarthelToilet] = useState<number>(10);
  const [barthelTransfers, setBarthelTransfers] = useState<number>(15);
  const [barthelMobility, setBarthelMobility] = useState<number>(15);
  const [barthelStairs, setBarthelStairs] = useState<number>(10);

  // Maddox Scale states
  const [maddoxGrade, setMaddoxGrade] = useState<number>(0);

  // Aldrete Scale states
  const [aldreteActivity, setAldreteActivity] = useState<number>(2);
  const [aldreteRespiration, setAldreteRespiration] = useState<number>(2);
  const [aldreteCirculation, setAldreteCirculation] = useState<number>(2);
  const [aldreteConsciousness, setAldreteConsciousness] = useState<number>(2);
  const [aldreteO2Sat, setAldreteO2Sat] = useState<number>(2);

  // Apgar Familiar states
  const [famApgarAdaptation, setFamApgarAdaptation] = useState<number>(2);
  const [famApgarPartnership, setFamApgarPartnership] = useState<number>(2);
  const [famApgarGrowth, setFamApgarGrowth] = useState<number>(2);
  const [famApgarAffection, setFamApgarAffection] = useState<number>(2);
  const [famApgarResolve, setFamApgarResolve] = useState<number>(2);

  // Body Surface Area states (Adults/Kids)
  const [scWeight, setScWeight] = useState<string>('70');
  const [scHeight, setScHeight] = useState<string>('170');

  // Mean Arterial Pressure states
  const [pamSystolic, setPamSystolic] = useState<string>('120');
  const [pamDiastolic, setPamDiastolic] = useState<string>('80');

  // Alcohol Dilution states
  const [alcoholVol, setAlcoholVol] = useState<string>('1000');
  const [alcoholGrad, setAlcoholGrad] = useState<string>('96');

  // Sensible Losses states
  const [lossesWeight, setLossesWeight] = useState<string>('70');
  const [lossesHours, setLossesHours] = useState<string>('24');
  const [lossesTemp, setLossesTemp] = useState<string>('37.0');
  const [lossesResp, setLossesResp] = useState<string>('16');
  const [lossesSweat, setLossesSweat] = useState<string>('none'); // 'none' | 'mild' | 'moderate' | 'severe'

  // Inotrope Infusion states
  const [inotropeDose, setInotropeDose] = useState<string>('5'); // mcg/kg/min
  const [inotropeWeight, setInotropeWeight] = useState<string>('70'); // kg
  const [inotropeAmpoules, setInotropeAmpoules] = useState<string>('200'); // mg
  const [inotropeDilutionVolume, setInotropeDilutionVolume] = useState<string>('250'); // ml

  // Inotrope 1:1 Volume states
  const [inotrope1to1Dose, setInotrope1to1Dose] = useState<string>('5');
  const [inotrope1to1Weight, setInotrope1to1Weight] = useState<string>('70');
  const [inotrope1to1Concentration, setInotrope1to1Concentration] = useState<string>('1600');

  // APACHE II state inputs
  const [ap2Temp, setAp2Temp] = useState<number>(0); // Points: 0 to 4
  const [ap2Map, setAp2Map] = useState<number>(0);
  const [ap2Hr, setAp2Hr] = useState<number>(0);
  const [ap2Rr, setAp2Rr] = useState<number>(0);
  const [ap2Aado2, setAp2Aado2] = useState<number>(0);
  const [ap2Ph, setAp2Ph] = useState<number>(0);
  const [ap2Na, setAp2Na] = useState<number>(0);
  const [ap2K, setAp2K] = useState<number>(0);
  const [ap2Creat, setAp2Creat] = useState<number>(0);
  const [ap2CreatAcute, setAp2CreatAcute] = useState<boolean>(false); // AKI doubles creatinine score
  const [ap2Hct, setAp2Hct] = useState<number>(0);
  const [ap2Wbc, setAp2Wbc] = useState<number>(0);
  const [ap2Gcs, setAp2Gcs] = useState<number>(15); // GCS score (GCS points = 15 - GCS)
  const [ap2Age, setAp2Age] = useState<number>(0); // Points: 0 to 6
  const [ap2Chronic, setAp2Chronic] = useState<number>(0); // Points: 0, 2 or 5

  // TISS-28 states
  const [tissItems, setTissItems] = useState<Record<number, boolean>>({});

  // CAM-ICU states
  const [camOnset, setCamOnset] = useState<boolean>(false);
  const [camInattention, setCamInattention] = useState<boolean>(false);
  const [camRass, setCamRass] = useState<string>('0'); // '0' is alert/calm. Any other is altered.
  const [camDisorganized, setCamDisorganized] = useState<boolean>(false);

  // FLACC Scale states
  const [flaccFace, setFlaccFace] = useState<number>(0);
  const [flaccLegs, setFlaccLegs] = useState<number>(0);
  const [flaccActivity, setFlaccActivity] = useState<number>(0);
  const [flaccCry, setFlaccCry] = useState<number>(0);
  const [flaccConsolability, setFlaccConsolability] = useState<number>(0);

  // Pediatric Dose states
  const [pedDosePrescribed, setPedDosePrescribed] = useState<string>('');
  const [pedConcentrationMg, setPedConcentrationMg] = useState<string>('250');
  const [pedConcentrationMl, setPedConcentrationMl] = useState<string>('5');

  // Gestational Age states (additional)
  const [egFurDate, setEgFurDate] = useState<string>('');

  // Sueroterapia states
  const [dripVolume, setDripVolume] = useState<string>('500');
  const [dripTime, setDripTime] = useState<string>('8');
  const [dripFactor, setDripFactor] = useState<string>('20'); // 20: gotas, 60: microgotas

  const [infusionRate, setInfusionRate] = useState<string>('21');
  const [infusionTime, setInfusionTime] = useState<string>('8');
  const [infusionFactor, setInfusionFactor] = useState<string>('20');

  const [timeVolume, setTimeVolume] = useState<string>('500');
  const [timeRate, setTimeRate] = useState<string>('21');
  const [timeFactor, setTimeFactor] = useState<string>('20');

  // Injectable states
  const [injDosePrescribed, setInjDosePrescribed] = useState<string>('');
  const [injPresentationMg, setInjPresentationMg] = useState<string>('100');
  const [injPresentationMl, setInjPresentationMl] = useState<string>('2');

  // Dextrose mixing states
  const [dexTargetVol, setDexTargetVol] = useState<string>('500');
  const [dexTargetConc, setDexTargetConc] = useState<string>('10');
  const [dexHighConc, setDexHighConc] = useState<string>('50');
  const [dexLowConc, setDexLowConc] = useState<string>('5');

  // Chloride mixing states
  const [clVolume, setClVolume] = useState<string>('100');
  const [clTargetConc, setClTargetConc] = useState<string>('0.9');
  const [clHighConc, setClHighConc] = useState<string>('20');


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

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#pes-nanda-search-container')) {
        setShowNandaDropdown(false);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
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
      } else if (err.code === "auth/admin-restricted-operation") {
        msg = "El registro de nuevos usuarios está deshabilitado en tu consola de Firebase (Authentication > Configuración).";
      } else if (err.code === "auth/network-request-failed") {
        msg = "Error de red. No se pudo conectar con Firebase. Por favor verifica tu conexión a internet o VPN.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Demasiados intentos. Acceso temporalmente bloqueado. Inténtalo más tarde.";
      } else if (err.code) {
        msg = `Error (${err.code}): ${err.message || "Por favor verifica las credenciales."}`;
      } else if (err.message) {
        msg = `Error: ${err.message}`;
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

  const renderNortonScale = () => {
    const total = nortonPhysical + nortonMental + nortonActivity + nortonMobility + nortonIncontinence;
    let risk = "Riesgo Muy Alto (<=12)";
    let colorClass = "bg-rose-500 text-white border-rose-600 shadow-sm";
    if (total > 14) {
      risk = "Riesgo Mínimo o Sin Riesgo (>14)";
      colorClass = "bg-emerald-500 text-white border-emerald-600 shadow-sm";
    } else if (total > 12) {
      risk = "Riesgo Evidente (13-14)";
      colorClass = "bg-amber-500 text-slate-900 border-amber-600 shadow-sm";
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Escala de Norton Modificada</h2>
          <p className="text-xs text-slate-500 mt-0.5">Evalúa el estado físico y el riesgo de presentar úlceras o lesiones por presión (UPP).</p>
        </div>

        <div className="space-y-4 text-xs">
          {[
            { label: "1. Estado Físico General", state: nortonPhysical, set: setNortonPhysical, opts: [{ v: 4, t: "4 - Bueno" }, { v: 3, t: "3 - Mediano" }, { v: 2, t: "2 - Pobre" }, { v: 1, t: "1 - Muy malo" }] },
            { label: "2. Estado Mental", state: nortonMental, set: setNortonMental, opts: [{ v: 4, t: "4 - Alerta" }, { v: 3, t: "3 - Apático" }, { v: 2, t: "2 - Confuso" }, { v: 1, t: "1 - Estuporoso/Comatoso" }] },
            { label: "3. Actividad / Movilidad", state: nortonActivity, set: setNortonActivity, opts: [{ v: 4, t: "4 - Ambulante" }, { v: 3, t: "3 - Camina con ayuda" }, { v: 2, t: "2 - Sentado (Silla)" }, { v: 1, t: "1 - En cama (Encamado)" }] },
            { label: "4. Movilidad Física", state: nortonMobility, set: setNortonMobility, opts: [{ v: 4, t: "4 - Total" }, { v: 3, t: "3 - Disminuida leve" }, { v: 2, t: "2 - Muy limitada" }, { v: 1, t: "1 - Inmóvil" }] },
            { label: "5. Incontinencia", state: nortonIncontinence, set: setNortonIncontinence, opts: [{ v: 4, t: "4 - Ninguna" }, { v: 3, t: "3 - Ocasional" }, { v: 2, t: "2 - Usualmente urinaria" }, { v: 1, t: "1 - Doble incontinencia (Urinaria y Fecal)" }] }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <label className="font-bold text-slate-700 block">{item.label}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {item.opts.map(opt => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => item.set(opt.v)}
                    className={`px-2.5 py-2 rounded-xl border text-[11px] text-center transition-all cursor-pointer ${
                      item.state === opt.v ? 'bg-indigo-650 border-indigo-650 text-white font-bold' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    {opt.t}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Resultado Escala Norton</span>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-extrabold text-slate-800">{total}</span>
              <span className="text-xs font-bold text-slate-400">/ 20 puntos</span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl text-xs font-extrabold border shadow-sm ${colorClass}`}>
            {risk}
          </div>
        </div>
      </div>
    );
  };

  const renderBarthelIndex = () => {
    const total = barthelFeeding + barthelBathing + barthelGrooming + barthelDressing + barthelBowels + barthelBladder + barthelToilet + barthelTransfers + barthelMobility + barthelStairs;
    
    let interpretation = "Independencia Total (100)";
    let colorClass = "bg-emerald-500 text-white border-emerald-600 shadow-sm";
    
    if (total < 20) {
      interpretation = "Dependencia Total (<20)";
      colorClass = "bg-rose-650 text-white border-rose-700 shadow-sm";
    } else if (total <= 35) {
      interpretation = "Dependencia Grave (20-35)";
      colorClass = "bg-rose-500 text-white border-rose-600 shadow-sm";
    } else if (total <= 55) {
      interpretation = "Dependencia Moderada (40-55)";
      colorClass = "bg-amber-500 text-slate-900 border-amber-600 shadow-sm";
    } else if (total <= 95) {
      interpretation = "Dependencia Leve (60-95)";
      colorClass = "bg-emerald-50 text-emerald-700 border-emerald-250 shadow-sm";
    }

    const items = [
      { label: "1. Comer", state: barthelFeeding, set: setBarthelFeeding, opts: [{ v: 10, t: "10 - Independiente" }, { v: 5, t: "5 - Necesita ayuda" }, { v: 0, t: "0 - Dependiente" }] },
      { label: "2. Lavarse (Baño)", state: barthelBathing, set: setBarthelBathing, opts: [{ v: 5, t: "5 - Independiente" }, { v: 0, t: "0 - Dependiente" }] },
      { label: "3. Asearse (Higiene personal)", state: barthelGrooming, set: setBarthelGrooming, opts: [{ v: 5, t: "5 - Independiente" }, { v: 0, t: "0 - Dependiente" }] },
      { label: "4. Vestirse", state: barthelDressing, set: setBarthelDressing, opts: [{ v: 10, t: "10 - Independiente" }, { v: 5, t: "5 - Necesita ayuda" }, { v: 0, t: "0 - Dependiente" }] },
      { label: "5. Deposición (Control de esfínter anal)", state: barthelBowels, set: setBarthelBowels, opts: [{ v: 10, t: "10 - Continente" }, { v: 5, t: "5 - Accidente ocasional" }, { v: 0, t: "0 - Incontinente" }] },
      { label: "6. Micción (Control de esfínter vesical)", state: barthelBladder, set: setBarthelBladder, opts: [{ v: 10, t: "10 - Continente" }, { v: 5, t: "5 - Accidente ocasional" }, { v: 0, t: "0 - Incontinente" }] },
      { label: "7. Usar el retrete", state: barthelToilet, set: setBarthelToilet, opts: [{ v: 10, t: "10 - Independiente" }, { v: 5, t: "5 - Necesita ayuda" }, { v: 0, t: "0 - Dependiente" }] },
      { label: "8. Trasladarse (Silla/Cama)", state: barthelTransfers, set: setBarthelTransfers, opts: [{ v: 15, t: "15 - Independiente" }, { v: 10, t: "10 - Mínima ayuda" }, { v: 5, t: "5 - Gran ayuda" }, { v: 0, t: "0 - Dependiente" }] },
      { label: "9. Deambulación (Caminar en llano)", state: barthelMobility, set: setBarthelMobility, opts: [{ v: 15, t: "15 - Independiente" }, { v: 10, t: "10 - Camina con ayuda" }, { v: 5, t: "5 - En silla de ruedas" }, { v: 0, t: "0 - Inmóvil" }] },
      { label: "10. Escalones (Subir/Bajar escaleras)", state: barthelStairs, set: setBarthelStairs, opts: [{ v: 10, t: "10 - Independiente" }, { v: 5, t: "5 - Necesita ayuda" }, { v: 0, t: "0 - Dependiente" }] }
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Índice de Barthel</h2>
          <p className="text-xs text-slate-500 mt-0.5">Evalúa el nivel de independencia funcional del paciente en actividades de la vida diaria (AVD).</p>
        </div>

        <div className="space-y-5 text-xs max-h-[420px] overflow-y-auto pr-2">
          {items.map((item, idx) => (
            <div key={idx} className="space-y-1.5 border-b border-slate-100 pb-3">
              <label className="font-bold text-slate-700 block">{item.label}</label>
              <div className="flex flex-wrap gap-2">
                {item.opts.map(opt => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => item.set(opt.v)}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] transition-all cursor-pointer ${
                      item.state === opt.v ? 'bg-indigo-650 border-indigo-650 text-white font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    {opt.t}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Resultado Índice Barthel</span>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-extrabold text-slate-800">{total}</span>
              <span className="text-xs font-bold text-slate-400">/ 100 puntos</span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl text-xs font-extrabold border shadow-sm ${colorClass}`}>
            {interpretation}
          </div>
        </div>
      </div>
    );
  };

  const renderMaddoxScale = () => {
    let details = "Sin síntomas de flebitis.";
    let colorClass = "bg-emerald-500 text-white border-emerald-600 shadow-sm";
    
    if (maddoxGrade === 1) {
      details = "Dolor local o eritema en zona del catéter. Sin cordón palpable.";
      colorClass = "bg-emerald-50 text-emerald-700 border-emerald-250 shadow-sm";
    } else if (maddoxGrade === 2) {
      details = "Dolor local, eritema y/o edema en zona de inserción. Sin cordón palpable.";
      colorClass = "bg-amber-500 text-slate-900 border-amber-600 shadow-sm";
    } else if (maddoxGrade === 3) {
      details = "Dolor local, eritema, edema e induración. Cordón venoso palpable < 8 cm.";
      colorClass = "bg-rose-500 text-white border-rose-600 shadow-sm";
    } else if (maddoxGrade === 4) {
      details = "Dolor local severo, eritema, edema, induración. Cordón palpable > 8 cm y drenaje purulento visible.";
      colorClass = "bg-rose-650 text-white border-rose-700 shadow-sm";
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Escala de Maddox (Flebitis)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Evalúa el grado de flebitis por infusión venosa periférica para decidir el retiro del catéter.</p>
        </div>

        <div className="space-y-2 text-xs">
          <label className="font-bold text-slate-700 block">Selecciona el Grado de Flebitis Observado</label>
          <div className="flex flex-col gap-2">
            {[
              { val: 0, title: "Grado 0 - Normal", desc: "Sitio de punción con aspecto normal, sin dolor." },
              { val: 1, title: "Grado 1 - Leve", desc: "Dolor local leve o eritema ligero, sin hinchazón ni endurecimiento." },
              { val: 2, title: "Grado 2 - Moderado", desc: "Dolor en zona de inserción con eritema y/o edema leve." },
              { val: 3, title: "Grado 3 - Severo (Inicio de tromboflebitis)", desc: "Dolor, eritema, edema e induración local. Cordón venoso palpable." },
              { val: 4, title: "Grado 4 - Flebitis Purulenta Avanzada", desc: "Dolor severo, cordón venoso palpable extenso (>8cm) y secreción purulenta." }
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setMaddoxGrade(opt.val)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                  maddoxGrade === opt.val ? 'bg-indigo-650 border-indigo-650 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/75'
                }`}
              >
                <span className="font-extrabold text-xs">{opt.title}</span>
                <span className={`text-[10px] ${maddoxGrade === opt.val ? 'text-indigo-100' : 'text-slate-400'}`}>{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between gap-2.5">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Clasificación Clínica</span>
            <div className={`px-4 py-3 rounded-xl text-xs font-extrabold border ${colorClass} mt-1 text-center`}>
              Grado {maddoxGrade} • {maddoxGrade >= 2 ? "Retirar Catéter Inmediatamente" : "Vigilancia Continua"}
            </div>
            <p className="text-[10px] text-slate-500 italic text-center mt-1">{details}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderAldreteScale = () => {
    const total = aldreteActivity + aldreteRespiration + aldreteCirculation + aldreteConsciousness + aldreteO2Sat;
    let verdict = "Mantener en Observación / Cuidado de Recuperación (<8)";
    let colorClass = "bg-rose-500 text-white border-rose-600 shadow-sm";
    
    if (total >= 9) {
      verdict = "Criterio de Alta Aprobado (Puntaje >= 9)";
      colorClass = "bg-emerald-500 text-white border-emerald-600 shadow-sm";
    } else if (total === 8) {
      verdict = "Criterio de Alta Limítrofe (Puntaje 8)";
      colorClass = "bg-amber-500 text-slate-900 border-amber-600 shadow-sm";
    }

    const categories = [
      { label: "1. Actividad Motora (Movimiento voluntario/órdenes)", state: aldreteActivity, set: setAldreteActivity, opts: [{ v: 2, t: "2 - Mueve 4 extremidades" }, { v: 1, t: "1 - Mueve 2 extremidades" }, { v: 0, t: "0 - Incapaz de mover extremidades" }] },
      { label: "2. Respiración", state: aldreteRespiration, set: setAldreteRespiration, opts: [{ v: 2, t: "2 - Capaz de respirar profundo y toser" }, { v: 1, t: "1 - Disnea, respiración limitada o taquipnea" }, { v: 0, t: "0 - Apnea o ventilación asistida" }] },
      { label: "3. Circulación (Presión Arterial con respecto al nivel basal)", state: aldreteCirculation, set: setAldreteCirculation, opts: [{ v: 2, t: "2 - PA ±20% del nivel preanestésico" }, { v: 1, t: "1 - PA ±20% a 50% del basal" }, { v: 0, t: "0 - PA ±50% o más del basal" }] },
      { label: "4. Consciencia", state: aldreteConsciousness, set: setAldreteConsciousness, opts: [{ v: 2, t: "2 - Completamente despierto" }, { v: 1, t: "1 - Responde a estímulos / Despertable" }, { v: 0, t: "0 - No responde" }] },
      { label: "5. Saturación de Oxígeno (SpO2)", state: aldreteO2Sat, set: setAldreteO2Sat, opts: [{ v: 2, t: "2 - SpO2 >92% respirando aire ambiente" }, { v: 1, t: "1 - Requiere O2 para mantener SpO2 >90%" }, { v: 0, t: "0 - SpO2 <90% con aporte de oxígeno" }] }
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Escala de Aldrete</h2>
          <p className="text-xs text-slate-500 mt-0.5">Evalúa los criterios de recuperación post-anestésica para determinar el alta segura del paciente.</p>
        </div>

        <div className="space-y-4 text-xs max-h-[380px] overflow-y-auto pr-2">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-1.5 border-b border-slate-100 pb-3">
              <label className="font-bold text-slate-700 block">{cat.label}</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {cat.opts.map(opt => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => cat.set(opt.v)}
                    className={`px-3 py-2 rounded-xl border text-[11px] text-center transition-all cursor-pointer ${
                      cat.state === opt.v ? 'bg-indigo-650 border-indigo-650 text-white font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    {opt.t}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Resultado Escala Aldrete</span>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-extrabold text-slate-800">{total}</span>
              <span className="text-xs font-bold text-slate-400">/ 10 puntos</span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl text-xs font-extrabold border shadow-sm ${colorClass}`}>
            {verdict}
          </div>
        </div>
      </div>
    );
  };

  const renderFamApgarScale = () => {
    const total = famApgarAdaptation + famApgarPartnership + famApgarGrowth + famApgarAffection + famApgarResolve;
    let status = "Familia Altamente Funcional (7-10)";
    let colorClass = "bg-emerald-500 text-white border-emerald-600 shadow-sm";
    
    if (total <= 3) {
      status = "Disfunción Familiar Severa (0-3)";
      colorClass = "bg-rose-500 text-white border-rose-600 shadow-sm";
    } else if (total <= 6) {
      status = "Disfunción Familiar Leve a Moderada (4-6)";
      colorClass = "bg-amber-500 text-slate-900 border-amber-600 shadow-sm";
    }

    const criteria = [
      { label: "1. Adaptación (Recursos compartidos al afrontar crisis)", state: famApgarAdaptation, set: setFamApgarAdaptation },
      { label: "2. Participación (Diálogo y toma de decisiones familiar)", state: famApgarPartnership, set: setFamApgarPartnership },
      { label: "3. Gradación / Crecimiento (Apoyo en nuevas etapas y madurez)", state: famApgarGrowth, set: setFamApgarGrowth },
      { label: "4. Afecto (Expresión de amor y emociones familiares)", state: famApgarAffection, set: setFamApgarAffection },
      { label: "5. Resolución (Tiempo de calidad, compromisos compartidos)", state: famApgarResolve, set: setFamApgarResolve }
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Apgar Familiar</h2>
          <p className="text-xs text-slate-500 mt-0.5">Evalúa de forma rápida y objetiva la percepción de funcionalidad y soporte del núcleo familiar.</p>
        </div>

        <div className="space-y-4 text-xs">
          {criteria.map((crit, idx) => (
            <div key={idx} className="space-y-1.5 border-b border-slate-100 pb-3">
              <label className="font-bold text-slate-700 block">{crit.label}</label>
              <div className="grid grid-cols-3 gap-2 max-w-sm">
                {[
                  { v: 2, t: "Casi siempre (2)" },
                  { v: 1, t: "Algunas veces (1)" },
                  { v: 0, t: "Casi nunca (0)" }
                ].map(opt => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => crit.set(opt.v)}
                    className={`px-2 py-2 rounded-xl border text-[11px] text-center transition-all cursor-pointer ${
                      crit.state === opt.v ? 'bg-indigo-650 border-indigo-650 text-white font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    {opt.t}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Resultado Apgar Familiar</span>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-extrabold text-slate-800">{total}</span>
              <span className="text-xs font-bold text-slate-400">/ 10 puntos</span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl text-xs font-extrabold border shadow-sm ${colorClass}`}>
            {status}
          </div>
        </div>
      </div>
    );
  };

  const renderScCalculator = () => {
    const w = parseFloat(scWeight) || 0;
    const h = parseFloat(scHeight) || 0;

    let bsa = 0;
    if (w > 0 && h > 0) {
      // Mosteller Formula: BSA = sqrt( (W * H) / 3600 )
      bsa = Math.sqrt((w * h) / 3600);
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Superficie Corporal (BSA)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calcula el área de superficie corporal usando la fórmula estandarizada de Mosteller.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Peso del Paciente (kg)</label>
            <input
              type="number"
              value={scWeight}
              onChange={(e) => setScWeight(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="70"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Estatura / Altura (cm)</label>
            <input
              type="number"
              value={scHeight}
              onChange={(e) => setScHeight(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="170"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 flex flex-col justify-between gap-3 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase">Superficie Corporal Estimada (Mosteller)</span>
            <div className="text-4xl font-black text-indigo-750 font-mono">
              {bsa > 0 ? bsa.toFixed(2) : "0.00"} <span className="text-lg font-bold text-slate-500 font-sans">m²</span>
            </div>
          </div>
          <p className="text-[9px] text-slate-400">Útil para la dosificación de quimioterapias, fármacos vasoactivos y estimación de balances hídricos.</p>
        </div>
      </div>
    );
  };

  const renderPamCalculator = () => {
    const s = parseFloat(pamSystolic) || 0;
    const d = parseFloat(pamDiastolic) || 0;

    let map = 0;
    let label = "Ingrese valores";
    let colorClass = "bg-slate-100 text-slate-500 border-slate-200/80 shadow-sm";

    if (s > 0 && d > 0) {
      // MAP = (Systolic + 2*Diastolic) / 3
      map = (s + 2 * d) / 3;
      if (map < 60) {
        label = "Presión de Perfusión Tisular Insuficiente (<60)";
        colorClass = "bg-rose-500 text-white border-rose-600 shadow-sm";
      } else if (map <= 105) {
        label = "Perfusión Orgánica Normal (70 - 105)";
        colorClass = "bg-emerald-500 text-white border-emerald-600 shadow-sm";
      } else {
        label = "Presión de Perfusión Elevada (>105)";
        colorClass = "bg-amber-500 text-slate-900 border-amber-600 shadow-sm";
      }
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Presión Arterial Media (PAM)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calcula la presión promedio que empuja la sangre a los tejidos para asegurar la perfusión de órganos vitales.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">PAS (Presión Sistólica mmHg)</label>
            <input
              type="number"
              value={pamSystolic}
              onChange={(e) => setPamSystolic(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="120"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">PAD (Presión Diastólica mmHg)</label>
            <input
              type="number"
              value={pamDiastolic}
              onChange={(e) => setPamDiastolic(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="80"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Resultado PAM</span>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">{map > 0 ? map.toFixed(1) : "0.0"}</span>
              <span className="text-xs font-bold text-slate-400">mmHg</span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl text-xs font-extrabold border shadow-sm ${colorClass}`}>
            {label}
          </div>
        </div>
      </div>
    );
  };

  const renderAlcoholDilutionCalculator = () => {
    const vol = parseFloat(alcoholVol) || 0;
    const grad = parseFloat(alcoholGrad) || 0;

    let waterToAdd = 0;
    let totalVol = 0;

    if (vol > 0 && grad > 70) {
      // V2 = V1 * (C1 / C2) => Water = V2 - V1 = V1 * (C1 / 70 - 1)
      waterToAdd = vol * ((grad / 70) - 1);
      totalVol = vol + waterToAdd;
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Dilución de Alcohol a 70°</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calcula el volumen de agua destilada a agregar a alcoholes de alta graduación para rebajarlos a 70° (desinfectante óptimo).</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Volumen Inicial de Alcohol (ml)</label>
            <input
              type="number"
              value={alcoholVol}
              onChange={(e) => setAlcoholVol(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="1000"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Graduación Inicial (ej. 96°)</label>
            <input
              type="number"
              value={alcoholGrad}
              onChange={(e) => setAlcoholGrad(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="96"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-bold text-indigo-400 uppercase block">Instrucciones de Mezcla</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-slate-450 uppercase block">Agua destilada a agregar</span>
              <span className="text-xl font-extrabold text-indigo-700 font-mono">{waterToAdd > 0 ? waterToAdd.toFixed(0) : "0"} ml</span>
            </div>
            <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-slate-455 uppercase block">Volumen Total Final</span>
              <span className="text-xl font-extrabold text-indigo-700 font-mono">{totalVol > 0 ? totalVol.toFixed(0) : "0"} ml</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSensibleLossesCalculator = () => {
    const w = parseFloat(lossesWeight) || 0;
    const hrs = parseFloat(lossesHours) || 0;
    const temp = parseFloat(lossesTemp) || 0;
    const resp = parseFloat(lossesResp) || 0;

    let losses = 0;
    if (w > 0 && hrs > 0) {
      // Base: 0.5 ml/kg/hour
      let factor = 0.5;

      // Adjust for fever: +0.1 ml/kg/hour for each °C above 37.0
      if (temp > 37.0) {
        factor += 0.1 * (temp - 37.0);
      }

      // Adjust for tachypnea: +0.1 ml/kg/hour for each 5 respirations above 20
      if (resp > 20) {
        factor += 0.1 * Math.floor((resp - 20) / 5);
      }

      losses = factor * w * hrs;

      // Adjust for sweating (Diaforesis): Leve: +10ml/h, Mod: +20ml/h, Sev: +40ml/h
      if (lossesSweat === 'mild') {
        losses += 10 * hrs;
      } else if (lossesSweat === 'moderate') {
        losses += 20 * hrs;
      } else if (lossesSweat === 'severe') {
        losses += 40 * hrs;
      }
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Cálculo de Pérdidas Insensibles</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calcula la pérdida hídrica por respiración y piel, considerando hipertermia, taquipnea y diaforesis.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Peso Corporal (kg)</label>
            <input
              type="number"
              value={lossesWeight}
              onChange={(e) => setLossesWeight(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Horas de Balance</label>
            <input
              type="number"
              value={lossesHours}
              onChange={(e) => setLossesHours(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Temperatura Máx (°C)</label>
            <input
              type="number"
              step="0.1"
              value={lossesTemp}
              onChange={(e) => setLossesTemp(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Frecuencia Resp. (rpm)</label>
            <input
              type="number"
              value={lossesResp}
              onChange={(e) => setLossesResp(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Diaforesis selector */}
        <div className="space-y-2 text-xs">
          <label className="font-bold text-slate-700 block">Gravedad de la Diaforesis (Sudoración)</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { val: 'none', t: "Ninguna" },
              { val: 'mild', t: "Leve (+10ml/h)" },
              { val: 'moderate', t: "Mod. (+20ml/h)" },
              { val: 'severe', t: "Sev. (+40ml/h)" }
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setLossesSweat(opt.val)}
                className={`px-1 py-2 rounded-xl border text-[10px] text-center transition-all cursor-pointer ${
                  lossesSweat === opt.val ? 'bg-indigo-650 border-indigo-650 text-white font-bold' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                }`}
              >
                {opt.t}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col justify-between gap-3 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase">Volumen de Pérdida Estimado</span>
            <div className="text-3xl font-black text-indigo-750 font-mono">
              {losses > 0 ? losses.toFixed(0) : "0"} <span className="text-sm font-bold text-slate-500 font-sans">ml</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInotropeCalculator = () => {
    const d = parseFloat(inotropeDose) || 0;
    const w = parseFloat(inotropeWeight) || 0;
    const amp = parseFloat(inotropeAmpoules) || 0;
    const vol = parseFloat(inotropeDilutionVolume) || 0;

    let conc = 0;
    let rate = 0;
    if (amp > 0 && vol > 0) {
      // Concentration in mcg/ml = (mg * 1000) / ml
      conc = (amp * 1000) / vol;
      if (d > 0 && w > 0) {
        // Rate in ml/hr = (dose * weight * 60) / concentration
        rate = (d * w * 60) / conc;
      }
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Infusión de Inotrópicos</h2>
          <p className="text-xs text-slate-500 mt-0.5">Convierte la dosis prescrita de vasoactivos/inotrópicos (mcg/kg/min) a velocidad de infusión en bomba (ml/h).</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Dosis prescrita (mcg/kg/min)</label>
            <input
              type="number"
              value={inotropeDose}
              onChange={(e) => setInotropeDose(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Peso del Paciente (kg)</label>
            <input
              type="number"
              value={inotropeWeight}
              onChange={(e) => setInotropeWeight(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Concentración de Ampolla (mg)</label>
            <input
              type="number"
              value={inotropeAmpoules}
              onChange={(e) => setInotropeAmpoules(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Volumen del Diluyente (ml)</label>
            <input
              type="number"
              value={inotropeDilutionVolume}
              onChange={(e) => setInotropeDilutionVolume(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-bold text-indigo-400 uppercase block">Resultados de Dosificación</span>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-slate-450 uppercase block">Concentración Mezcla</span>
              <span className="text-base font-extrabold text-indigo-700 font-mono">{conc > 0 ? conc.toFixed(0) : "0"} mcg/ml</span>
            </div>
            <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-slate-455 uppercase block">Flujo Bomba Infusión</span>
              <span className="text-base font-extrabold text-indigo-700 font-mono">{rate > 0 ? rate.toFixed(1) : "0.0"} ml/h</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInotrope1to1Calculator = () => {
    const d = parseFloat(inotrope1to1Dose) || 0;
    const w = parseFloat(inotrope1to1Weight) || 0;
    const conc = parseFloat(inotrope1to1Concentration) || 1600; // default 1600 mcg/ml (e.g. 400mg in 250ml)

    let rate = 0;
    if (d > 0 && w > 0 && conc > 0) {
      rate = (d * w * 60) / conc;
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Volumen Total Inotrópicos (1:1)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calcula el flujo de bomba rápido (ml/h) para soluciones estándar de infusión 1:1, donde se conoce la concentración fija en mcg/ml.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Dosis (mcg/kg/min)</label>
            <input
              type="number"
              value={inotrope1to1Dose}
              onChange={(e) => setInotrope1to1Dose(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Peso (kg)</label>
            <input
              type="number"
              value={inotrope1to1Weight}
              onChange={(e) => setInotrope1to1Weight(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Concentración (mcg/ml)</label>
            <input
              type="number"
              value={inotrope1to1Concentration}
              onChange={(e) => setInotrope1to1Concentration(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col justify-between gap-3 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase">Flujo Requerido (ml/h)</span>
            <div className="text-3xl font-black text-indigo-750 font-mono">
              {rate > 0 ? rate.toFixed(1) : "0.0"} <span className="text-sm font-bold text-slate-500 font-sans">ml/h</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderApache2Scale = () => {
    // APACHE II is physiology (ap2Temp + ap2Map + ap2Hr + ap2Rr + ap2Aado2 + ap2Ph + ap2Na + ap2K + ap2Creat*doubleIfAcute + ap2Hct + ap2Wbc + (15-ap2Gcs)) + age + chronic
    const creatPoints = ap2CreatAcute ? (ap2Creat * 2) : ap2Creat;
    const gcsPoints = 15 - ap2Gcs;
    const total = ap2Temp + ap2Map + ap2Hr + ap2Rr + ap2Aado2 + ap2Ph + ap2Na + ap2K + creatPoints + ap2Hct + ap2Wbc + gcsPoints + ap2Age + ap2Chronic;

    let mortality = "Mortalidad aprox: ~8-10%";
    let colorClass = "bg-emerald-500 text-white border-emerald-600 shadow-sm";

    if (total >= 35) {
      mortality = "Mortalidad crítica: >80%";
      colorClass = "bg-rose-650 text-white border-rose-700 shadow-sm";
    } else if (total >= 25) {
      mortality = "Mortalidad severa: ~50-55%";
      colorClass = "bg-rose-500 text-white border-rose-600 shadow-sm";
    } else if (total >= 15) {
      mortality = "Mortalidad moderada: ~25%";
      colorClass = "bg-amber-500 text-slate-900 border-amber-600 shadow-sm";
    } else if (total >= 10) {
      mortality = "Mortalidad leve: ~15%";
      colorClass = "bg-emerald-50 text-emerald-700 border-emerald-250 shadow-sm";
    }

    const items = [
      { label: "1. Temperatura (°C)", state: ap2Temp, set: setAp2Temp, opts: [{ v: 0, t: "36.0-38.4 (0)" }, { v: 1, t: "38.5-38.9 / 34.0-35.9 (+1)" }, { v: 2, t: "32.0-33.9 (+2)" }, { v: 3, t: ">=41.0 / 30.0-31.9 (+3)" }, { v: 4, t: ">=40.0 / <30.0 (+4)" }] },
      { label: "2. Presión Arterial Media (PAM mmHg)", state: ap2Map, set: setAp2Map, opts: [{ v: 0, t: "70-109 (0)" }, { v: 1, t: "110-129 / 61-69 (+1)" }, { v: 2, t: "130-159 / 50-60 (+2)" }, { v: 3, t: ">=160 / <50 (+3)" }, { v: 4, t: "Anormal Extremo (+4)" }] },
      { label: "3. Frecuencia Cardíaca (LPM)", state: ap2Hr, set: setAp2Hr, opts: [{ v: 0, t: "70-109 (0)" }, { v: 1, t: "110-139 / 55-69 (+1)" }, { v: 2, t: "140-179 / 40-54 (+2)" }, { v: 3, t: ">=180 / <40 (+3)" }, { v: 4, t: "Anormal Extremo (+4)" }] },
      { label: "4. Frecuencia Respiratoria (RPM)", state: ap2Rr, set: setAp2Rr, opts: [{ v: 0, t: "12-24 (0)" }, { v: 1, t: "25-34 / 10-11 (+1)" }, { v: 2, t: "6-9 (+2)" }, { v: 3, t: "35-49 (+3)" }, { v: 4, t: ">=50 / <=5 (+4)" }] },
      { label: "5. Oxigenación / A-aDO2", state: ap2Aado2, set: setAp2Aado2, opts: [{ v: 0, t: "Normal / PaO2 >70 (0)" }, { v: 1, t: "A-aDO2 200-349 (+1)" }, { v: 2, t: "A-aDO2 350-499 (+2)" }, { v: 3, t: "PaO2 55-60 (+3)" }, { v: 4, t: "PaO2 <55 o A-aDO2 >=500 (+4)" }] },
      { label: "6. pH Arterial", state: ap2Ph, set: setAp2Ph, opts: [{ v: 0, t: "7.33-7.49 (0)" }, { v: 1, t: "7.50-7.59 / 7.25-7.32 (+1)" }, { v: 2, t: "7.60-7.69 / 7.15-7.24 (+2)" }, { v: 3, t: ">=7.70 / 7.00-7.14 (+3)" }, { v: 4, t: "<7.00 (+4)" }] },
      { label: "7. Sodio Sérico (mmol/L)", state: ap2Na, set: setAp2Na, opts: [{ v: 0, t: "130-149 (0)" }, { v: 1, t: "150-154 / 120-129 (+1)" }, { v: 2, t: "155-159 / 115-119 (+2)" }, { v: 3, t: "160-179 / 110-114 (+3)" }, { v: 4, t: ">=180 / <110 (+4)" }] },
      { label: "8. Potasio Sérico (mmol/L)", state: ap2K, set: setAp2K, opts: [{ v: 0, t: "3.5-5.4 (0)" }, { v: 1, t: "5.5-5.9 / 3.0-3.4 (+1)" }, { v: 2, t: "2.5-2.9 (+2)" }, { v: 3, t: "6.0-6.9 (+3)" }, { v: 4, t: ">=7.0 / <2.5 (+4)" }] },
      { label: "9. Creatinina Sérica (mg/dL)", state: ap2Creat, set: setAp2Creat, opts: [{ v: 0, t: "<0.6-1.4 (0)" }, { v: 1, t: "Basal / Límite (+1)" }, { v: 2, t: "1.5-1.9 (+2)" }, { v: 3, t: "2.0-3.4 (+3)" }, { v: 4, t: ">=3.5 (+4)" }] },
      { label: "10. Hematocrito (%)", state: ap2Hct, set: setAp2Hct, opts: [{ v: 0, t: "30-45.9 (0)" }, { v: 1, t: "46-49.9 / 20-29.9 (+1)" }, { v: 2, t: "50-59.9 (+2)" }, { v: 4, t: ">=60 / <20 (+4)" }] },
      { label: "11. Leucocitos (x1000)", state: ap2Wbc, set: setAp2Wbc, opts: [{ v: 0, t: "3.0-14.9 (0)" }, { v: 1, t: "15.0-19.9 / 1.0-2.9 (+1)" }, { v: 2, t: "20.0-39.9 (+2)" }, { v: 4, t: ">=40 / <1 (+4)" }] },
      { label: "12. Edad del Paciente", state: ap2Age, set: setAp2Age, opts: [{ v: 0, t: "<=44 años (0)" }, { v: 2, t: "45-54 años (+2)" }, { v: 3, t: "55-64 años (+3)" }, { v: 5, t: "65-74 años (+5)" }, { v: 6, t: ">=75 años (+6)" }] },
      { label: "13. Ineficiencia Orgánica Crónica / Inmunocompromiso", state: ap2Chronic, set: setAp2Chronic, opts: [{ v: 0, t: "Ninguno (0)" }, { v: 2, t: "Sí - Postoperatorio electivo (+2)" }, { v: 5, t: "Sí - No operatorio o postoperatorio de urgencia (+5)" }] }
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Escala APACHE II</h2>
          <p className="text-xs text-slate-500 mt-0.5">Sistema de puntuación de severidad para evaluar el pronóstico de mortalidad en pacientes ingresados a UCI en las primeras 24 horas.</p>
        </div>

        {/* Creatinine kidney failure check */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex justify-between items-center gap-4 text-xs font-bold text-amber-800">
          <span>¿El paciente tiene Insuficiencia Renal Aguda (IRA / AKI)?</span>
          <button
            onClick={() => setAp2CreatAcute(!ap2CreatAcute)}
            className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
              ap2CreatAcute ? 'bg-amber-600 border-amber-600 text-white shadow-sm' : 'bg-white border-amber-300 text-amber-700'
            }`}
          >
            {ap2CreatAcute ? "Sí (Puntaje de Creatinina x2)" : "No (Normal)"}
          </button>
        </div>

        {/* Glasgow check inside APACHE */}
        <div className="space-y-2 text-xs">
          <label className="font-bold text-slate-700 block">Puntaje Escala de Glasgow (Puntos = 15 - GCS)</label>
          <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <input
              type="range"
              min="3"
              max="15"
              value={ap2Gcs}
              onChange={(e) => setAp2Gcs(parseInt(e.target.value))}
              className="flex-1 accent-indigo-600 cursor-pointer"
            />
            <span className="font-extrabold font-mono text-slate-700">{ap2Gcs} / 15 GCS ({gcsPoints} pts APACHE)</span>
          </div>
        </div>

        {/* All physiology selectors */}
        <div className="space-y-5 text-xs max-h-[300px] overflow-y-auto pr-2">
          {items.map((item, idx) => (
            <div key={idx} className="space-y-1.5 border-b border-slate-100 pb-3">
              <label className="font-bold text-slate-700 block">{item.label}</label>
              <div className="flex flex-wrap gap-1.5">
                {item.opts.map(opt => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => item.set(opt.v)}
                    className={`px-2 py-1.5 rounded-xl border text-[10px] transition-all cursor-pointer ${
                      item.state === opt.v ? 'bg-indigo-650 border-indigo-650 text-white font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    {opt.t}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Puntuación Total APACHE II</span>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">{total}</span>
              <span className="text-xs font-bold text-slate-400">puntos</span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl text-xs font-extrabold border shadow-sm ${colorClass}`}>
            {mortality}
          </div>
        </div>
      </div>
    );
  };

  const renderTiss28Scale = () => {
    // TISS-28 contains 28 checklist items.
    const items = [
      { id: 1, p: 3, cat: "Actividades Básicas", t: "Monitorización estándar (ECG, PA, SatO2, balances)" },
      { id: 2, p: 3, cat: "Actividades Básicas", t: "Pruebas de laboratorio estándar (Bioquímica/Gases diarios)" },
      { id: 3, p: 2, cat: "Actividades Básicas", t: "Medicación única o múltiple (IV, IM o Subcutánea)" },
      { id: 4, p: 1, cat: "Actividades Básicas", t: "Procedimientos de higiene, curación estándar y aseo del paciente" },
      { id: 5, p: 5, cat: "Actividades Básicas", t: "Cuidados de enfermería complejos (Decúbito prono, movilización asistida >3 personas)" },
      { id: 6, p: 1, cat: "Actividades Básicas", t: "Procedimientos diagnósticos fuera de UCI (Escáner, RMN)" },
      { id: 7, p: 5, cat: "Soporte Ventilatorio", t: "Ventilación mecánica invasiva (Tubo ET o Traqueostomía)" },
      { id: 8, p: 2, cat: "Soporte Ventilatorio", t: "Soporte respiratorio no invasivo (VNI, mascarilla reservorio, CPAP)" },
      { id: 9, p: 2, cat: "Soporte Ventilatorio", t: "Cuidado estándar de vía aérea (Fisioterapia respiratoria, aspiración de secreciones)" },
      { id: 10, p: 3, cat: "Soporte Cardiovascular", t: "Medicamento inotrópico o vasoactivo único (Dopamina, Dobuta, etc.)" },
      { id: 11, p: 4, cat: "Soporte Cardiovascular", t: "Medicamentos inotrópicos múltiples (ej. Noradrenalina + Dobutamina)" },
      { id: 12, p: 4, cat: "Soporte Cardiovascular", t: "Infusión de fluidos masiva (>3L/día) o reposición de volumen activa" },
      { id: 13, p: 8, cat: "Soporte Cardiovascular", t: "Catéter arterial pulmonar de Swan-Ganz o monitoreo de gasto cardíaco avanzado" },
      { id: 14, p: 8, cat: "Soporte Cardiovascular", t: "Resucitación cardiopulmonar activa (RCP en las últimas 24h)" },
      { id: 15, p: 3, cat: "Soporte Renal", t: "Hemodiálisis, hemofiltración activa o diálisis peritoneal" },
      { id: 16, p: 3, cat: "Soporte Renal", t: "Medición horaria de diuresis (Sonda Foley)" },
      { id: 17, p: 4, cat: "Soporte Neurológico", t: "Monitorización de presión intracraneal (PIC) o monitoreo continuo de EEG" },
      { id: 18, p: 4, cat: "Soporte Metabólico", t: "Nutrición parenteral total (NPT)" },
      { id: 19, p: 2, cat: "Soporte Metabólico", t: "Nutrición enteral por sonda (SNG / SNY)" },
      { id: 20, p: 4, cat: "Soporte Metabólico", t: "Monitoreo metabólico complejo (Control glucémico estricto con bomba de insulina)" },
      { id: 21, p: 1, cat: "Soporte Gastrointestinal", t: "Cuidado estándar del tracto digestivo (Aseo, enemas, prevención de reflujo)" },
      { id: 22, p: 3, cat: "Soporte Gastrointestinal", t: "Lavados gástricos continuos o manejo de sangrado digestivo activo" },
      { id: 23, p: 3, cat: "Procedimientos Específicos", t: "Línea arterial periférica (Línea radial/femoral)" },
      { id: 24, p: 2, cat: "Procedimientos Específicos", t: "Vía Venosa Central (CVC multilumen)" },
      { id: 25, p: 3, cat: "Procedimientos Específicos", t: "Manejo de marcapasos temporal externo" },
      { id: 26, p: 1, cat: "Procedimientos Específicos", t: "Manejo y vaciado de múltiples drenajes quirúrgicos" },
      { id: 27, p: 3, cat: "Procedimientos Específicos", t: "Cambios de vendajes complejos con asistencia médica o estériles" },
      { id: 28, p: 4, cat: "Procedimientos Específicos", t: "Procedimiento de intubación endotraqueal de urgencia en UCI" }
    ];

    const toggleItem = (itemId: number) => {
      setTissItems(prev => ({
        ...prev,
        [itemId]: !prev[itemId]
      }));
    };

    const total = items.reduce((acc, item) => acc + (tissItems[item.id] ? item.p : 0), 0);
    const scorePercentage = (total / 78) * 100;
    
    // Workforce evaluation: 1 nurse per shift can manage ~46 points of TISS-28
    let ratio = "Carga leve: 1 Enfermero(a) puede cuidar a 2 pacientes con este puntaje.";
    let colorClass = "bg-emerald-500 text-white border-emerald-600 shadow-sm";
    
    if (total >= 46) {
      ratio = "Carga Extrema: Requiere atención 1:1 exclusiva (1 Enfermero por paciente).";
      colorClass = "bg-rose-650 text-white border-rose-700 shadow-sm";
    } else if (total >= 25) {
      ratio = "Carga Alta: 1 Enfermero por paciente o asistencia parcial.";
      colorClass = "bg-amber-500 text-slate-900 border-amber-600 shadow-sm";
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Escala TISS-28</h2>
          <p className="text-xs text-slate-500 mt-0.5">Mide la carga de trabajo del personal de enfermería en base a las intervenciones terapéuticas del paciente crítico.</p>
        </div>

        <div className="space-y-2 text-xs max-h-[300px] overflow-y-auto pr-2 border border-slate-100 rounded-2xl p-2.5 bg-slate-50/50">
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-2.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                tissItems[item.id] ? 'bg-indigo-50 border-indigo-200 text-slate-800' : 'bg-white border-slate-150 text-slate-650 hover:bg-slate-50'
              }`}
            >
              <input
                type="checkbox"
                checked={!!tissItems[item.id]}
                onChange={() => {}} // handled by div click
                className="mt-0.5 accent-indigo-600 shrink-0 cursor-pointer"
              />
              <div className="flex-1 space-y-0.5">
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block">{item.cat}</span>
                <p className="text-[11px] font-bold leading-snug">{item.t}</p>
              </div>
              <span className={`text-xs font-black shrink-0 ${tissItems[item.id] ? 'text-indigo-650' : 'text-slate-400'}`}>+{item.p} pts</span>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Carga de Enfermería TISS-28</span>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">{total}</span>
              <span className="text-xs font-bold text-slate-400">/ 78 puntos ({scorePercentage.toFixed(0)}%)</span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl text-xs font-extrabold border shadow-sm ${colorClass}`}>
            {ratio}
          </div>
        </div>
      </div>
    );
  };

  const renderCamIcuScale = () => {
    // CAM-ICU diagnosis algorithm:
    // Delirium is positive if: (Feature 1 AND Feature 2) AND (Feature 3 OR Feature 4)
    // Feature 1: camOnset (fluctuating course / acute onset)
    // Feature 2: camInattention (>=2 errors on attention test)
    // Feature 3: camRass != 0 (altered consciousness)
    // Feature 4: camDisorganized (>=2 errors on thinking questions)
    const hasFeature1 = camOnset;
    const hasFeature2 = camInattention;
    const hasFeature3 = camRass !== '0';
    const hasFeature4 = camDisorganized;

    const isDeliriumPositive = hasFeature1 && hasFeature2 && (hasFeature3 || hasFeature4);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Evaluación CAM-ICU (Delirium)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Evalúa el delirium y la confusión en pacientes de UCI con ventilación asistida o sedados.</p>
        </div>

        <div className="space-y-4 text-xs">
          {/* Feature 1 */}
          <div className="bg-slate-55 border border-slate-200/80 rounded-2xl p-4 flex justify-between items-center gap-4">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block">Característica 1</span>
              <p className="font-extrabold text-slate-700">Inicio agudo o curso fluctuante</p>
              <p className="text-[10px] text-slate-400 leading-snug">¿Hay cambios en el estado mental basal del paciente o fluctúa su nivel de consciencia?</p>
            </div>
            <button
              onClick={() => setCamOnset(!camOnset)}
              className={`px-4 py-2 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                camOnset ? 'bg-indigo-650 border-indigo-650 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
              }`}
            >
              {camOnset ? "Sí" : "No"}
            </button>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-55 border border-slate-200/80 rounded-2xl p-4 flex justify-between items-center gap-4">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block">Característica 2</span>
              <p className="font-extrabold text-slate-700">Falta de atención (Inatención)</p>
              <p className="text-[10px] text-slate-400 leading-snug">¿El paciente cometió 2 o más errores al apretar la mano con la palabra "SAVEAHAART"?</p>
            </div>
            <button
              onClick={() => setCamInattention(!camInattention)}
              className={`px-4 py-2 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                camInattention ? 'bg-indigo-650 border-indigo-650 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
              }`}
            >
              {camInattention ? "Sí (Inatento)" : "No"}
            </button>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-55 border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block">Característica 3</span>
              <p className="font-extrabold text-slate-700">Nivel de conciencia alterado (RASS)</p>
              <p className="text-[10px] text-slate-400 leading-snug">¿El puntaje actual de la escala RASS es diferente de cero (ej. agitado, sedado)?</p>
            </div>
            <div className="flex gap-1 shrink-0 self-end sm:self-auto">
              {['-2', '0', '+2'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setCamRass(opt)}
                  className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold cursor-pointer transition-all ${
                    camRass === opt ? 'bg-indigo-650 border-indigo-650 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  {opt === '0' ? "RASS 0 (Normal)" : opt === '-2' ? "Sedado (<-1)" : "Agitado (>+1)"}
                </button>
              ))}
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-55 border border-slate-200/80 rounded-2xl p-4 flex justify-between items-center gap-4">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block">Característica 4</span>
              <p className="font-extrabold text-slate-700">Pensamiento desorganizado</p>
              <p className="text-[10px] text-slate-400 leading-snug">¿El paciente tiene dificultad con preguntas lógicas simples (ej. ¿flota una piedra en el agua?)?</p>
            </div>
            <button
              onClick={() => setCamDisorganized(!camDisorganized)}
              className={`px-4 py-2 rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                camDisorganized ? 'bg-indigo-650 border-indigo-650 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
              }`}
            >
              {camDisorganized ? "Sí (Desorganizado)" : "No"}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between gap-3 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Diagnóstico de Delirium (CAM-ICU)</span>
          <div className={`px-4 py-3 rounded-xl text-xs font-black border ${
            isDeliriumPositive ? "bg-rose-500 text-white border-rose-600 shadow-md" : "bg-emerald-500 text-white border-emerald-600 shadow-md"
          }`}>
            {isDeliriumPositive ? "CAM-ICU POSITIVO (Delirium Detectado)" : "CAM-ICU NEGATIVO (Sin Delirium)"}
          </div>
          <p className="text-[9px] text-slate-400">El diagnóstico requiere de Características 1 y 2 presentes, junto con Característica 3 o 4 alterada.</p>
        </div>
      </div>
    );
  };

  const renderFlaccScale = () => {
    const total = flaccFace + flaccLegs + flaccActivity + flaccCry + flaccConsolability;
    let level = "Sin dolor (0)";
    let colorClass = "bg-emerald-500 text-white border-emerald-600 shadow-sm";

    if (total >= 7) {
      level = "Dolor Severo (7-10)";
      colorClass = "bg-rose-650 text-white border-rose-700 shadow-sm";
    } else if (total >= 4) {
      level = "Dolor Moderado (4-6)";
      colorClass = "bg-amber-500 text-slate-900 border-amber-600 shadow-sm";
    } else if (total >= 1) {
      level = "Dolor Leve (1-3)";
      colorClass = "bg-emerald-50 text-emerald-700 border-emerald-250 shadow-sm";
    }

    const categories = [
      { label: "1. Cara (Expresión facial)", state: flaccFace, set: setFlaccFace, opts: [{ v: 0, t: "0 - Expresión de sonrisa o relajada" }, { v: 1, t: "1 - Ceño fruncido ocasional, desinterés" }, { v: 2, t: "2 - Ceño fruncido constante, mandíbula apretada" }] },
      { label: "2. Piernas (Posición y tensión)", state: flaccLegs, set: setFlaccLegs, opts: [{ v: 0, t: "0 - Normales / Relajadas" }, { v: 1, t: "1 - Inquietas, tensas o flexionadas" }, { v: 2, t: "2 - Pataleando, encogidas o muy rígidas" }] },
      { label: "3. Actividad", state: flaccActivity, set: setFlaccActivity, opts: [{ v: 0, t: "0 - Acostado tranquilo, se mueve fácil" }, { v: 1, t: "1 - Se retuerce, tenso, cambia de posición" }, { v: 2, t: "2 - Arqueado, rígido, espasmos constantes" }] },
      { label: "4. Llanto", state: flaccCry, set: setFlaccCry, opts: [{ v: 0, t: "0 - No llora (despierto/dormido)" }, { v: 1, t: "1 - Quejidos, llanto/lloriqueo ocasional" }, { v: 2, t: "2 - Llanto continuo, gritos frecuentes" }] },
      { label: "5. Consolabilidad", state: flaccConsolability, set: setFlaccConsolability, opts: [{ v: 0, t: "0 - Tranquilo, relajado" }, { v: 1, t: "1 - Se calma con caricias, abrazos o voz" }, { v: 2, t: "2 - Muy difícil de consolar o distraer" }] }
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Escala de Dolor FLACC</h2>
          <p className="text-xs text-slate-500 mt-0.5">Escala observacional para medir la intensidad del dolor en bebés, niños pequeños o pacientes no verbales.</p>
        </div>

        <div className="space-y-4 text-xs max-h-[380px] overflow-y-auto pr-2">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-1.5 border-b border-slate-100 pb-3">
              <label className="font-bold text-slate-700 block">{cat.label}</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {cat.opts.map(opt => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => cat.set(opt.v)}
                    className={`px-3 py-2 rounded-xl border text-[11px] text-center transition-all cursor-pointer ${
                      cat.state === opt.v ? 'bg-indigo-650 border-indigo-650 text-white font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    {opt.t}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Resultado Escala FLACC</span>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-3xl font-extrabold text-slate-800">{total}</span>
              <span className="text-xs font-bold text-slate-400">/ 10 puntos</span>
            </div>
          </div>

          <div className={`px-4 py-2 rounded-xl text-xs font-extrabold border shadow-sm ${colorClass}`}>
            {level}
          </div>
        </div>
      </div>
    );
  };

  const renderPediatricDoseCalculator = () => {
    const dose = parseFloat(pedDosePrescribed) || 0;
    const mg = parseFloat(pedConcentrationMg) || 0;
    const ml = parseFloat(pedConcentrationMl) || 0;

    let adminMl = 0;
    if (mg > 0 && ml > 0 && dose > 0) {
      adminMl = (dose * ml) / mg;
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Dosis Pediátricas (Jarabes / Suspensiones)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calcula el volumen exacto en mililitros (ml) a administrar a partir de la dosis prescrita en miligramos (mg).</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Dosis Prescrita (mg)</label>
            <input
              type="number"
              value={pedDosePrescribed}
              onChange={(e) => setPedDosePrescribed(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="e.g. 125"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Concentración Jarabe (mg)</label>
            <input
              type="number"
              value={pedConcentrationMg}
              onChange={(e) => setPedConcentrationMg(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="250"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">en Volumen (ml)</label>
            <input
              type="number"
              value={pedConcentrationMl}
              onChange={(e) => setPedConcentrationMl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
              placeholder="5"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 flex flex-col justify-between gap-3 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase">Volumen a Administrar</span>
            <div className="text-3xl font-black text-indigo-750 font-mono">
              {adminMl > 0 ? adminMl.toFixed(2) : "0.00"} <span className="text-sm font-bold text-slate-500 font-sans">ml</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGestationalAgeCalculator = () => {
    let result = "Seleccione la Fecha de Última Regla (FUR)";
    let weeks = 0;
    let days = 0;

    if (egFurDate) {
      const fur = new Date(egFurDate);
      const today = new Date();
      
      // Reset hours to compare clean days
      fur.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - fur.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0) {
        weeks = Math.floor(diffDays / 7);
        days = diffDays % 7;
        result = `${weeks} semanas y ${days} días de gestación`;
      } else {
        result = "La fecha de la FUR no puede ser en el futuro.";
      }
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Cálculo de Edad Gestacional</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calcula automáticamente el tiempo de gestación en semanas y días a partir de la FUR.</p>
        </div>

        <div className="space-y-1.5 max-w-xs text-xs">
          <label className="font-bold text-slate-700 block">Fecha de Última Regla (FUR)</label>
          <input
            type="date"
            value={egFurDate}
            onChange={(e) => setEgFurDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Edad Gestacional Estimada</span>
            <p className="text-sm font-extrabold text-slate-800 mt-1">{result}</p>
          </div>
          {weeks > 0 && (
            <div className="px-4 py-2 rounded-xl text-[10px] font-extrabold border bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm">
              Trimestre: {weeks < 13 ? "Primer" : weeks < 27 ? "Segundo" : "Tercer"} Trimestre
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderDripRateCalculator = () => {
    const vol = parseFloat(dripVolume) || 0;
    const time = parseFloat(dripTime) || 0;
    const factor = parseFloat(dripFactor) || 20;

    let rate = 0;
    let mlPerHour = 0;
    if (vol > 0 && time > 0) {
      // Drip Rate = (Volume * factor) / (time * 60)
      rate = (vol * factor) / (time * 60);
      mlPerHour = vol / time;
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Velocidad de Goteo</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calcula el goteo por minuto necesario para completar la infusión parenteral en un tiempo específico.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Volumen Total (ml)</label>
            <input
              type="number"
              value={dripVolume}
              onChange={(e) => setDripVolume(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Tiempo de infusión (h)</label>
            <input
              type="number"
              value={dripTime}
              onChange={(e) => setDripTime(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Factor de Goteo</label>
            <select
              value={dripFactor}
              onChange={(e) => setDripFactor(e.target.value)}
              className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="20">Macrogotero (20 got/ml)</option>
              <option value="15">Macrogotero (15 got/ml)</option>
              <option value="60">Microgotero (60 got/ml)</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-bold text-indigo-400 uppercase block">Resultados Tasa de Infusión</span>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-slate-405 uppercase block">Frecuencia Goteo</span>
              <span className="text-base font-extrabold text-indigo-750 font-mono">{rate > 0 ? rate.toFixed(0) : "0"} {factor == 60 ? "microgotas" : "gotas"} / min</span>
            </div>
            <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center">
              <span className="text-[9px] font-bold text-slate-405 uppercase block">Flujo de Infusión</span>
              <span className="text-base font-extrabold text-indigo-750 font-mono">{mlPerHour > 0 ? mlPerHour.toFixed(1) : "0.0"} ml/h</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInfusionVolumeCalculator = () => {
    const rate = parseFloat(infusionRate) || 0;
    const time = parseFloat(infusionTime) || 0;
    const factor = parseFloat(infusionFactor) || 20;

    let totalVol = 0;
    if (rate > 0 && time > 0) {
      // Volume = (rate * time * 60) / factor
      totalVol = (rate * time * 60) / factor;
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Volumen de Infusión</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calcula el volumen total en ml que ingresará en base a un goteo por minuto y el tiempo de infusión.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Velocidad Goteo (got/min)</label>
            <input
              type="number"
              value={infusionRate}
              onChange={(e) => setInfusionRate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Duración de infusión (h)</label>
            <input
              type="number"
              value={infusionTime}
              onChange={(e) => setInfusionTime(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Factor Goteo</label>
            <select
              value={infusionFactor}
              onChange={(e) => setInfusionFactor(e.target.value)}
              className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="20">Macrogotero (20 got/ml)</option>
              <option value="60">Microgotero (60 got/ml)</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col justify-between gap-3 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase">Volumen Total Calculado</span>
            <div className="text-3xl font-black text-indigo-750 font-mono">
              {totalVol > 0 ? totalVol.toFixed(0) : "0"} <span className="text-sm font-bold text-slate-500 font-sans">ml</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInfusionTimeCalculator = () => {
    const vol = parseFloat(timeVolume) || 0;
    const rate = parseFloat(timeRate) || 0;
    const factor = parseFloat(timeFactor) || 20;

    let timeHours = 0;
    let timeMinutes = 0;
    let formatResult = "Ingrese valores";

    if (vol > 0 && rate > 0) {
      // Time (minutes) = (Volume * factor) / rate
      const totalMinutes = (vol * factor) / rate;
      timeHours = Math.floor(totalMinutes / 60);
      timeMinutes = Math.floor(totalMinutes % 60);
      formatResult = `${timeHours} horas y ${timeMinutes} minutos`;
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Tiempo de Infusión</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calcula cuánto tardará en completarse un suero o solución a partir de su volumen y goteo.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Volumen Total (ml)</label>
            <input
              type="number"
              value={timeVolume}
              onChange={(e) => setTimeVolume(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Velocidad Goteo (got/min)</label>
            <input
              type="number"
              value={timeRate}
              onChange={(e) => setTimeRate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Factor Goteo</label>
            <select
              value={timeFactor}
              onChange={(e) => setTimeFactor(e.target.value)}
              className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="20">Macrogotero (20 got/ml)</option>
              <option value="60">Microgotero (60 got/ml)</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Tiempo Requerido</span>
            <p className="text-sm font-extrabold text-slate-800 mt-1">{formatResult}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderInjectableDoseCalculator = () => {
    const dose = parseFloat(injDosePrescribed) || 0;
    const mg = parseFloat(injPresentationMg) || 0;
    const ml = parseFloat(injPresentationMl) || 0;

    let adminMl = 0;
    if (mg > 0 && ml > 0 && dose > 0) {
      adminMl = (dose * ml) / mg;
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Dosis de Inyectables</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calcula el volumen exacto en ml a extraer de un frasco ampolla o vial para inyecciones IM, IV o SC.</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Dosis Prescrita (mg)</label>
            <input
              type="number"
              value={injDosePrescribed}
              onChange={(e) => setInjDosePrescribed(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Presentación Ampolla (mg)</label>
            <input
              type="number"
              value={injPresentationMg}
              onChange={(e) => setInjPresentationMg(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Volumen Ampolla (ml)</label>
            <input
              type="number"
              value={injPresentationMl}
              onChange={(e) => setInjPresentationMl(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 flex flex-col justify-between gap-3 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase">Volumen a Administrar</span>
            <div className="text-3xl font-black text-indigo-750 font-mono">
              {adminMl > 0 ? adminMl.toFixed(2) : "0.00"} <span className="text-sm font-bold text-slate-500 font-sans">ml</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDextroseConverter = () => {
    const targetVol = parseFloat(dexTargetVol) || 0;
    const targetConc = parseFloat(dexTargetConc) || 0;
    const highConc = parseFloat(dexHighConc) || 50;
    const lowConc = parseFloat(dexLowConc) || 5;

    let vHigh = 0;
    let vLow = 0;
    let valid = false;

    if (targetVol > 0 && targetConc > 0 && highConc > targetConc && targetConc > lowConc) {
      // Pearson Square formula:
      // vHigh = targetVol * (targetConc - lowConc) / (highConc - lowConc)
      // vLow = targetVol - vHigh
      vHigh = targetVol * (targetConc - lowConc) / (highConc - lowConc);
      vLow = targetVol - vHigh;
      valid = true;
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Conversión de Dextrosa</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calcula la mezcla de Dextrosa hipertónica (ej. 50%) e hipotónica (ej. 5%) para preparar una concentración deseada (ej. 10%).</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Volumen Deseado (ml)</label>
            <input
              type="number"
              value={dexTargetVol}
              onChange={(e) => setDexTargetVol(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Conc. Deseada (%)</label>
            <input
              type="number"
              value={dexTargetConc}
              onChange={(e) => setDexTargetConc(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Conc. Alta (%)</label>
            <input
              type="number"
              value={dexHighConc}
              onChange={(e) => setDexHighConc(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Conc. Baja (%)</label>
            <input
              type="number"
              value={dexLowConc}
              onChange={(e) => setDexLowConc(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-bold text-indigo-400 uppercase block">Instrucciones de Preparación</span>
          {valid ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center">
                <span className="text-[9px] font-bold text-slate-450 uppercase block">Volumen Dextrosa {highConc}% (Alta)</span>
                <span className="text-lg font-extrabold text-indigo-700 font-mono">{vHigh.toFixed(1)} ml</span>
              </div>
              <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center">
                <span className="text-[9px] font-bold text-slate-450 uppercase block">Volumen Dextrosa {lowConc}% (Baja)</span>
                <span className="text-lg font-extrabold text-indigo-700 font-mono">{vLow.toFixed(1)} ml</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-rose-500 font-bold text-center">La concentración deseada debe estar estrictamente entre la concentración alta y baja.</p>
          )}
        </div>
      </div>
    );
  };

  const renderChlorideConverter = () => {
    const vol = parseFloat(clVolume) || 0;
    const target = parseFloat(clTargetConc) || 0;
    const high = parseFloat(clHighConc) || 20; // NaCl al 20%

    let naclVol = 0;
    let waterVol = 0;
    let valid = false;

    if (vol > 0 && target > 0 && high > target) {
      // grams of NaCl required = targetVol * targetConc / 100
      const gramsRequired = (vol * target) / 100;
      // concentration of high NaCl in g/ml = high / 100 => 20% is 0.2 g/ml
      const highDensity = high / 100;
      
      naclVol = gramsRequired / highDensity;
      waterVol = vol - naclVol;
      if (waterVol >= 0) {
        valid = true;
      }
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Conversión de Cloruro (NaCl)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Calcula la cantidad de Hipersodio / NaCl hipertónico (ej. 20%) a diluir en agua destilada para preparar soluciones salinas de concentración específica (ej. NaCl 3% o NaCl 0.9%).</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Volumen Deseado (ml)</label>
            <input
              type="number"
              value={clVolume}
              onChange={(e) => setClVolume(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Conc. Deseada (%)</label>
            <input
              type="number"
              step="0.1"
              value={clTargetConc}
              onChange={(e) => setClTargetConc(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Conc. NaCl Alta (%)</label>
            <input
              type="number"
              value={clHighConc}
              onChange={(e) => setClHighConc(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-bold text-indigo-400 uppercase block">Instrucciones de Mezcla</span>
          {valid ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center">
                <span className="text-[9px] font-bold text-slate-450 uppercase block">NaCl al {high}% (Hipersodio)</span>
                <span className="text-lg font-extrabold text-indigo-700 font-mono">{naclVol.toFixed(1)} ml</span>
              </div>
              <div className="bg-white border border-indigo-100 rounded-xl p-3 text-center">
                <span className="text-[9px] font-bold text-slate-450 uppercase block">Agua destilada / Solvente</span>
                <span className="text-lg font-extrabold text-indigo-700 font-mono">{waterVol.toFixed(1)} ml</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-rose-500 font-bold text-center">Verifique que el volumen deseado sea válido y que la concentración final deseada sea menor que la concentración alta.</p>
          )}
        </div>
      </div>
    );
  };

  const handleGeneratePes = async () => {
    if (!pesSelectedNanda) {
      setPesError("Por favor, selecciona una etiqueta NANDA.");
      return;
    }
    setPesLoading(true);
    setPesError('');
    setPesResult(null);
    setPesSelectedNoc(null);
    setPesSelectedNic(null);
    setPesSelectedIndicators([]);
    setPesSelectedActivities([]);
    setPesSoapieResult('');

    try {
      const response = await fetch('/api/ai/generate-pes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          nandaLabel: `NANDA ${pesSelectedNanda.code}: ${pesSelectedNanda.name}`,
          diagnosisType: pesType,
          etiology: pesEtiology,
          symptoms: pesSymptoms
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPesResult(data.result);
        
        // Find and link best NOC & NIC based on NANDA name and definition
        let bestNoc = findBestNoc(pesSelectedNanda.name, pesSelectedNanda.definition);
        let bestNic = findBestNic(pesSelectedNanda.name, pesSelectedNanda.definition);

        try {
          const mappingRes = await fetch('/api/get-nanda-mapping', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ nandaCode: pesSelectedNanda.code, nandaName: pesSelectedNanda.name })
          });

          if (mappingRes.ok) {
            const mapData = await mappingRes.json();
            if (mapData && mapData.mapping) {
              const mapping = mapData.mapping;
              
              // Enrich NOC definition from local outcomes if possible
              const matchedNoc = NOC_OUTCOMES.find((n: any) => n.code === mapping.nocCode);
              bestNoc = {
                id: matchedNoc?.id || `noc_${mapping.nocCode}`,
                code: mapping.nocCode,
                name: mapping.nocName,
                definition: matchedNoc?.definition || '',
                indicators: mapping.nocIndicators || [],
                domain: matchedNoc?.domain || ''
              };

              const matchedNic = NIC_INTERVENTIONS.find((n: any) => n.code === mapping.nicCode);
              bestNic = {
                id: matchedNic?.id || `nic_${mapping.nicCode}`,
                code: mapping.nicCode,
                name: mapping.nicName,
                activities: mapping.nicActivities || []
              };
            }
          }
        } catch (err) {
          console.warn("Failed to fetch NANDA mapping, using local search fallback:", err);
        }

        setPesSelectedNoc(bestNoc);
        setPesSelectedNic(bestNic);
      } else {
        const errData = await response.json();
        setPesError(errData.message || "Error al estructurar el diagnóstico.");
      }
    } catch (err) {
      console.error("Error generating PES:", err);
      setPesError("Error de conexión al servicio de IA.");
    } finally {
      setPesLoading(false);
    }
  };

  const handleGeneratePesSoapie = async () => {
    if (!pesResult || !pesSelectedNoc || !pesSelectedNic) return;
    setPesSoapieGenerating(true);
    setPesSoapieResult('');
    try {
      const response = await fetch('/api/ai/generate-soapie', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          nandaName: pesResult.formattedDiagnosis,
          nocName: `${pesSelectedNoc.code} - ${pesSelectedNoc.name}`,
          nicName: `${pesSelectedNic.code} - ${pesSelectedNic.name}`,
          activities: pesSelectedActivities.length > 0 ? pesSelectedActivities : ["Vigilancia clínica general y cuidados de enfermería"],
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPesSoapieResult(data.soapie);
      } else {
        alert("No se pudo generar la nota SOAPIE.");
      }
    } catch (err) {
      console.error("Error generating PES SOAPIE:", err);
      alert("Error al contactar al servicio de SOAPIE.");
    } finally {
      setPesSoapieGenerating(false);
    }
  };

  const renderPesBuilder = () => {
    const getLivePreview = () => {
      if (!pesSelectedNanda) return "Selecciona una etiqueta NANDA para ver la estructura básica...";
      const problemStr = `NANDA ${pesSelectedNanda.code}: ${pesSelectedNanda.name}`;
      const etiologyStr = pesEtiology.trim() || "[Etiología / Factor de riesgo]";
      const symptomsStr = pesSymptoms.trim() || "[Características definitorias / Signos y síntomas]";
      
      if (pesType === 'real') {
        return `${problemStr} Relacionado con (R/C) ${etiologyStr} Manifestado por (M/P) ${symptomsStr}`;
      } else if (pesType === 'risk') {
        return `${problemStr} Relacionado con (R/C) ${etiologyStr}`;
      } else {
        return `${problemStr} Manifestado por (M/P) ${symptomsStr}`;
      }
    };

    const getSmartSearchMatches = (query: string) => {
      const q = query.toLowerCase().trim();
      if (q === '') return DIAGNOSES;

      const words = q.replace(/[^a-z0-9áéíóúñ]/g, ' ').split(/\s+/).filter(w => w.length > 0);
      if (words.length === 0) return DIAGNOSES;

      const SYNONYMS: Record<string, string[]> = {
        "gaseoso": ["gas", "gases", "respiratorio", "ventilación"],
        "gaseosos": ["gas", "gases", "respiratorio", "ventilación"],
        "gases": ["gaseoso", "respiratorio", "ventilación", "intercambio"],
        "respirar": ["respiratorio", "respiratoria", "ventilación", "gases", "aéreas"],
        "respiracion": ["respiratorio", "respiratoria", "ventilación", "gases", "aéreas"],
        "respiración": ["respiratorio", "respiratoria", "ventilación", "gases", "aéreas"],
        "corazon": ["cardiaco", "cardíaco", "perfusión", "tisular", "vascular"],
        "corazón": ["cardiaco", "cardíaco", "perfusión", "tisular", "vascular"],
        "cardiaco": ["cardíaco", "corazón", "perfusión", "vascular"],
        "cardíaco": ["cardiaco", "corazón", "perfusión", "vascular"],
        "orina": ["urinario", "urinaria", "eliminación"],
        "eliminar": ["eliminación", "urinario", "gastrointestinal"],
        "fiebre": ["hipertermia", "temperatura", "termorregulación"],
        "calentura": ["hipertermia", "temperatura", "termorregulación"],
        "frio": ["hipotermia", "temperatura", "termorregulación"],
        "frío": ["hipotermia", "temperatura", "termorregulación"],
        "comer": ["nutrición", "nutricional", "deglución", "peso"],
        "comida": ["nutrición", "nutricional", "deglución", "peso"],
        "gordo": ["peso", "nutricional", "sobrepeso"],
        "flaco": ["peso", "nutricional"],
        "triste": ["duelo", "desesperanza", "ansiedad", "afrontamiento"],
        "miedo": ["temor", "ansiedad"],
        "susto": ["temor", "ansiedad"],
        "dolor": ["comodidad", "confort", "dolorido"]
      };

      const searchTerms = new Set<string>();
      words.forEach(w => {
        searchTerms.add(w);
        if (w.length > 4) {
          searchTerms.add(w.substring(0, 4));
        }
        if (SYNONYMS[w]) {
          SYNONYMS[w].forEach(syn => {
            searchTerms.add(syn);
            if (syn.length > 4) {
              searchTerms.add(syn.substring(0, 4));
            }
          });
        }
      });

      return DIAGNOSES.filter(d => {
        const name = d.name.toLowerCase();
        const code = d.code;
        const definition = d.definition ? d.definition.toLowerCase() : '';
        const domain = d.domain ? d.domain.toLowerCase() : '';

        return Array.from(searchTerms).some(term => 
          name.includes(term) || 
          code.includes(term) || 
          definition.includes(term) || 
          domain.includes(term)
        );
      });
    };

    const filteredNandaRaw = getSmartSearchMatches(pesSearchNanda);

    // Deduplicate by code
    const uniqueNanda: typeof DIAGNOSES = [];
    const seenCodes = new Set<string>();
    for (const d of filteredNandaRaw) {
      if (!seenCodes.has(d.code)) {
        seenCodes.add(d.code);
        uniqueNanda.push(d);
      }
    }
    const filteredNanda = uniqueNanda.slice(0, 15);

    return (
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Editor */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 space-y-6 flex flex-col">
          <div>
            <h2 className="text-base font-extrabold text-slate-800">Estructurador PES de Diagnósticos</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-sans">Ayuda pedagógica para redactar diagnósticos NANDA-I oficiales usando Problema, Etiología y Signos/Síntomas.</p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-455 uppercase block font-sans">Tipo de Diagnóstico</label>
            <div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
              {[
                { id: 'real', name: 'Real (Focalizado)' },
                { id: 'risk', name: 'De Riesgo' },
                { id: 'promotion', name: 'Promoción de la Salud' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setPesType(t.id as any);
                    setPesResult(null);
                    setPesError('');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-sans ${
                    pesType === t.id
                      ? 'bg-white text-indigo-650 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div id="pes-nanda-search-container" className="space-y-2 relative">
            <label className="text-[11px] font-bold text-slate-455 uppercase block font-sans">1. Diagnóstico NANDA (Problema)</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar diagnóstico por nombre o código (ej: 00032)..."
                value={pesSearchNanda}
                onChange={(e) => {
                  setPesSearchNanda(e.target.value);
                  setShowNandaDropdown(true);
                }}
                onFocus={() => setShowNandaDropdown(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredNanda.length > 0) {
                      const firstMatch = filteredNanda[0];
                      setPesSelectedNanda(firstMatch);
                      setPesSearchNanda(`NANDA ${firstMatch.code}: ${firstMatch.name}`);
                      setShowNandaDropdown(false);
                      setPesResult(null);
                    }
                  }
                }}
                className="w-full pl-3 pr-10 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs bg-slate-50/50 font-sans"
              />
              <button
                type="button"
                onClick={() => {
                  if (filteredNanda.length > 0) {
                    const firstMatch = filteredNanda[0];
                    setPesSelectedNanda(firstMatch);
                    setPesSearchNanda(`NANDA ${firstMatch.code}: ${firstMatch.name}`);
                    setShowNandaDropdown(false);
                    setPesResult(null);
                  }
                }}
                className="absolute right-3 top-3 text-slate-400 hover:text-indigo-650 transition-colors cursor-pointer"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            </div>

            {showNandaDropdown && (
              <div className="absolute z-30 left-0 right-0 top-full mt-1.5 bg-white border border-slate-200/90 shadow-2xl rounded-2xl max-h-60 overflow-y-auto divide-y divide-slate-150">
                {filteredNanda.length === 0 ? (
                  <p className="p-4 text-xs text-slate-400 text-center font-sans">No se encontraron diagnósticos.</p>
                ) : (
                  filteredNanda.map(d => (
                    <button
                      key={d.id}
                      onClick={() => {
                        setPesSelectedNanda(d);
                        setPesSearchNanda(`NANDA ${d.code}: ${d.name}`);
                        setShowNandaDropdown(false);
                        setPesResult(null);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex flex-col gap-0.5 cursor-pointer font-sans"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold text-slate-800">{d.name}</span>
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">Cód. {d.code}</span>
                      </div>
                      <span className="text-[10px] text-slate-450 line-clamp-1">{d.definition}</span>
                    </button>
                  ))
                )}
              </div>
            )}

            {pesSelectedNanda && (
              <div className="bg-indigo-50/20 border border-indigo-150 rounded-2xl p-4.5 space-y-2 mt-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 bg-indigo-100 text-indigo-850 rounded">DIAGNÓSTICO SELECCIONADO</span>
                    <h4 className="text-xs font-extrabold text-indigo-950 mt-1 font-sans">Cód. {pesSelectedNanda.code} - {pesSelectedNanda.name}</h4>
                  </div>
                  <button 
                    onClick={() => {
                      setPesSelectedNanda(null);
                      setPesSearchNanda('');
                      setPesResult(null);
                    }}
                    className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] leading-relaxed text-indigo-900/80 font-sans">{pesSelectedNanda.definition}</p>
                {pesSelectedNanda.domain && (
                  <p className="text-[9px] font-bold text-indigo-700/60 uppercase tracking-wider font-mono">Dominio: {pesSelectedNanda.domain}</p>
                )}
              </div>
            )}
          </div>

          {(pesType === 'real' || pesType === 'risk') && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-455 uppercase block font-sans">
                  {pesType === 'real' ? '2. Etiología (Relacionado con - R/C)' : '2. Factor de Riesgo (Relacionado con - R/C)'}
                </label>
                <span className="text-[10px] text-slate-400 italic font-sans">Causa primaria o factor de riesgo</span>
              </div>
              <textarea
                placeholder={pesType === 'real' ? "Ej: desequilibrio entre el aporte y la demanda de oxígeno, alteración de la perfusión arterial..." : "Ej: deshidratación, inmovilidad física, extremos de edad..."}
                value={pesEtiology}
                onChange={(e) => {
                  setPesEtiology(e.target.value);
                  setPesResult(null);
                }}
                rows={3}
                className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs bg-slate-50/50 resize-none font-sans"
              />

              {pesSelectedNanda && pesSelectedNanda.relatedFactors && pesSelectedNanda.relatedFactors.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-sans">Factores NANDA Sugeridos (Haz clic para rellenar):</span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/30">
                    {pesSelectedNanda.relatedFactors.map((factor, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setPesEtiology(factor);
                          setPesResult(null);
                        }}
                        className="text-[10px] bg-white hover:bg-slate-100 border border-slate-200/80 hover:border-slate-350 text-slate-650 px-2 py-1 rounded-lg transition-all text-left truncate max-w-full cursor-pointer font-sans"
                        title={factor}
                      >
                        {factor}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {(pesType === 'real' || pesType === 'promotion') && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-455 uppercase block font-sans">
                  {pesType === 'real' ? '3. Características Definitorias (Manifestado por - M/P)' : '2. Conductas de Mejora (Manifestado por - M/P)'}
                </label>
                <span className="text-[10px] text-slate-400 italic font-sans">Signos, síntomas u objetivaciones observables</span>
              </div>
              <textarea
                placeholder={pesType === 'real' ? "Ej: fatiga, disnea de esfuerzo, frecuencia cardíaca anormal..." : "Ej: expresa deseos de mejorar el estado nutricional, verbaliza interés en pautas de ejercicio..."}
                value={pesSymptoms}
                onChange={(e) => {
                  setPesSymptoms(e.target.value);
                  setPesResult(null);
                }}
                rows={3}
                className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs bg-slate-50/50 resize-none font-sans"
              />
            </div>
          )}

          {pesError && (
            <div className="bg-rose-50 border border-rose-150 rounded-2xl p-3 text-xs text-rose-600 flex items-center gap-2 font-sans">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{pesError}</span>
            </div>
          )}

          <button
            onClick={handleGeneratePes}
            disabled={pesLoading || !pesSelectedNanda}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 active:scale-[0.99] transition-all cursor-pointer font-sans ${
              !pesSelectedNanda
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-indigo-650 hover:bg-indigo-700 text-white hover:shadow-indigo-600/20'
            }`}
          >
            {pesLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analizando y Estructurando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Estructurar y Pulir Diagnóstico con IA</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Previews & Results */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
            <div>
              <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-sans">ESTRUCTURACIÓN BÁSICA (EN TIEMPO REAL)</span>
              <h3 className="text-sm font-extrabold text-slate-800 mt-1 font-sans">Esquema del Diagnóstico</h3>
            </div>
            <div className="bg-white border border-slate-200/80 p-4.5 rounded-2xl min-h-20 shadow-inner flex items-center">
              <p className="text-xs text-slate-650 leading-relaxed font-sans select-all italic w-full">
                {getLivePreview()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getLivePreview());
                  alert("Diagnóstico básico copiado.");
                }}
                disabled={!pesSelectedNanda}
                className="flex-1 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-slate-650 font-bold rounded-xl text-[11px] flex items-center justify-center gap-1.5 cursor-pointer font-sans"
              >
                <Copy className="w-3.5 h-3.5" /> Copiar Fórmula Básica
              </button>
            </div>
          </div>

          {pesLoading && (
            <div className="bg-indigo-50/20 border border-indigo-150 rounded-3xl p-8 flex flex-col items-center justify-center space-y-3 min-h-60 font-sans">
              <RefreshCw className="w-8 h-8 text-indigo-650 animate-spin" />
              <p className="text-xs font-bold text-indigo-900">El enfermero docente está estructurando el diagnóstico...</p>
              <p className="text-[10px] text-slate-500 text-center">Traduciendo términos a lenguaje técnico y ordenando las variables NANDA según la estructura PES.</p>
            </div>
          )}

          {pesResult && (
            <div className="space-y-6">
              <div className="bg-indigo-650 text-white rounded-3xl p-6 space-y-4 shadow-xl shadow-indigo-650/15">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-extrabold tracking-wider bg-white/20 text-indigo-50 px-2 py-0.5 rounded uppercase font-mono">DIAGNÓSTICO REDACTADO POR IA</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pesResult.formattedDiagnosis);
                      setPesCopied(true);
                      setTimeout(() => setPesCopied(false), 2000);
                    }}
                    className="p-1.5 hover:bg-white/10 rounded-xl transition-all cursor-pointer text-white"
                  >
                    {pesCopied ? <CopyCheck className="w-4 h-4 text-emerald-350" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-sm font-extrabold leading-relaxed font-sans select-all">
                  {pesResult.formattedDiagnosis}
                </p>
                {pesCopied && (
                  <p className="text-[10px] text-emerald-350 font-bold text-right font-sans">¡Copiado con éxito!</p>
                )}
              </div>

              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-4 shadow-md font-sans">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 font-sans">Desglose PES Académico</h3>
                  <p className="text-xs text-slate-500 font-sans">Componentes individuales identificados en el diagnóstico.</p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-2xl flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center shrink-0">P</div>
                    <div>
                      <span className="text-[10px] font-bold text-rose-800 uppercase block font-sans">Problema (Etiqueta NANDA)</span>
                      <p className="text-xs text-slate-700 leading-normal mt-0.5 font-sans">{pesResult.problem}</p>
                    </div>
                  </div>

                  {pesType !== 'promotion' && (
                    <div className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-2xl flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-900 text-xs font-black flex items-center justify-center shrink-0 font-sans animate-none">E</div>
                      <div>
                        <span className="text-[10px] font-bold text-amber-800 uppercase block font-sans">
                          {pesType === 'risk' ? 'Factor de Riesgo (Etiología)' : 'Etiología (Relacionado con)'}
                        </span>
                        <p className="text-xs text-slate-700 leading-normal mt-0.5 font-sans">{pesResult.etiology}</p>
                      </div>
                    </div>
                  )}

                  {pesType !== 'risk' && (
                    <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-black flex items-center justify-center shrink-0 font-sans">S</div>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase block font-sans">
                          {pesType === 'promotion' ? 'Conductas de Mejora (Manifestado por)' : 'Signos y Síntomas (Manifestado por)'}
                        </span>
                        <p className="text-xs text-slate-700 leading-normal mt-0.5 font-sans">{pesResult.signsSymptoms}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-amber-50/60 border border-amber-150 rounded-3xl p-6 space-y-3 font-sans">
                <div className="flex items-center gap-2 text-amber-850">
                  <span className="text-[10px] font-extrabold tracking-wider bg-amber-100 px-2 py-0.5 rounded uppercase font-mono">CONSEJO DEL DOCENTE DE ENFERMERÍA</span>
                </div>
                <p className="text-xs italic leading-relaxed text-amber-900">
                  "{pesResult.pedagogicalAdvice}"
                </p>
              </div>

              {/* NOC / NIC / SOAPIE Integration */}
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 space-y-6 shadow-md font-sans">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 font-sans">Plan de Cuidados Asociado</h3>
                  <p className="text-xs text-slate-500 font-sans">Resultados NOC e Intervenciones NIC vinculados clínicamente.</p>
                </div>

                <div className="space-y-4 divide-y divide-slate-100">
                  {/* NOC */}
                  {pesSelectedNoc && (
                    <div className="space-y-3 pb-4">
                      <div>
                        <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 bg-indigo-50 text-indigo-850 rounded">CRITERIO DE EVALUACIÓN (NOC)</span>
                        <h4 className="text-xs font-extrabold text-slate-850 leading-tight mt-1">Cód. {pesSelectedNoc.code} - {pesSelectedNoc.name}</h4>
                        <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{pesSelectedNoc.definition}</p>
                      </div>

                      {pesSelectedNoc.indicators && pesSelectedNoc.indicators.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider block font-sans">Selecciona los Indicadores NOC:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 max-h-36 overflow-y-auto">
                            {pesSelectedNoc.indicators.map((ind: { code: string; name: string }, idx: number) => {
                              const isChecked = pesSelectedIndicators.includes(ind.code);
                              return (
                                <label key={idx} className="flex items-start gap-2 text-[10px] leading-tight text-slate-650 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setPesSelectedIndicators([...pesSelectedIndicators, ind.code]);
                                      } else {
                                        setPesSelectedIndicators(pesSelectedIndicators.filter(i => i !== ind.code));
                                      }
                                    }}
                                    className="mt-0.5"
                                  />
                                  <span>{ind.code} - {ind.name}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* NIC */}
                  {pesSelectedNic && (
                    <div className="space-y-3 pt-4 pb-4">
                      <div>
                        <span className="text-[8px] font-bold font-mono px-1.5 py-0.5 bg-indigo-50 text-indigo-850 rounded">INTERVENCIÓN DE ENFERMERÍA (NIC)</span>
                        <h4 className="text-xs font-extrabold text-slate-855 leading-tight mt-1">Cód. {pesSelectedNic.code} - {pesSelectedNic.name}</h4>
                      </div>

                      {pesSelectedNic.activities && pesSelectedNic.activities.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-455 uppercase tracking-wider block font-sans">Selecciona las Actividades NIC:</span>
                          <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 max-h-40 overflow-y-auto">
                            {pesSelectedNic.activities.map((act: string, idx: number) => {
                              const isChecked = pesSelectedActivities.includes(act);
                              return (
                                <label key={idx} className="flex items-start gap-2 text-[10px] leading-tight text-slate-650 cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setPesSelectedActivities([...pesSelectedActivities, act]);
                                      } else {
                                        setPesSelectedActivities(pesSelectedActivities.filter(a => a !== act));
                                      }
                                    }}
                                    className="mt-0.5"
                                  />
                                  <span>{act}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SOAPIE Note Generator */}
                  <div className="pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-extrabold tracking-wider bg-slate-150 text-slate-700 px-2 py-0.5 rounded uppercase font-mono">Nota de Evolución (SOAPIE)</span>
                      <button
                        onClick={handleGeneratePesSoapie}
                        disabled={pesSoapieGenerating || !pesSelectedNoc || !pesSelectedNic}
                        className={`px-3 py-1.5 rounded-xl font-extrabold text-[10px] flex items-center gap-1.5 transition-all cursor-pointer ${
                          pesSoapieGenerating
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {pesSoapieGenerating ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Generando SOAPIE...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            <span>Generar SOAPIE con IA</span>
                          </>
                        )}
                      </button>
                    </div>

                    {pesSoapieResult && (
                      <div className="bg-slate-900 text-slate-200 border border-slate-850 p-4.5 rounded-2xl space-y-2 relative shadow-inner">
                        <div className="absolute right-3 top-3">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(pesSoapieResult);
                              alert("Nota SOAPIE copiada.");
                            }}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10 transition-all cursor-pointer"
                            title="Copiar SOAPIE"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <pre className="text-[11px] font-mono whitespace-pre-wrap leading-relaxed pr-6 select-all max-h-48 overflow-y-auto">
                          {pesSoapieResult}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>

                {/* Final Buttons */}
                <div className="pt-4 border-t border-slate-100 flex gap-3">
                  <button
                    onClick={() => {
                      if (!pesResult) return;
                      let planText = `=========================================\n`;
                      planText += `   PLAN DE CUIDADOS DE ENFERMERÍA (PES)\n`;
                      planText += `=========================================\n\n`;
                      planText += `1. DIAGNÓSTICO NANDA-I (Estructura PES):\n`;
                      planText += `${pesResult.formattedDiagnosis}\n\n`;
                      planText += `DESGLOSE PES:\n`;
                      planText += `- Problema (P): ${pesResult.problem}\n`;
                      if (pesType !== 'promotion') {
                        planText += `- Etiología (E): ${pesResult.etiology}\n`;
                      }
                      if (pesType !== 'risk') {
                        planText += `- Signos/Síntomas (S): ${pesResult.signsSymptoms}\n`;
                      }
                      planText += `\n-----------------------------------------\n\n`;
                      if (pesSelectedNoc) {
                        planText += `2. RESULTADO NOC (Esperado):\n`;
                        planText += `${pesSelectedNoc.code} - ${pesSelectedNoc.name}\n`;
                        if (pesSelectedIndicators.length > 0) {
                          planText += `Indicadores seleccionados:\n`;
                          pesSelectedIndicators.forEach(code => {
                            const indObj = pesSelectedNoc.indicators?.find((i: any) => i.code === code);
                            if (indObj) {
                              planText += `  [x] ${indObj.code} - ${indObj.name}\n`;
                            } else {
                              planText += `  [x] ${code}\n`;
                            }
                          });
                        }
                        planText += `\n`;
                      }
                      if (pesSelectedNic) {
                        planText += `3. INTERVENCIÓN NIC (Acciones):\n`;
                        planText += `${pesSelectedNic.code} - ${pesSelectedNic.name}\n`;
                        if (pesSelectedActivities.length > 0) {
                          planText += `Actividades seleccionadas:\n`;
                          pesSelectedActivities.forEach(act => {
                            planText += `  [x] ${act}\n`;
                          });
                        }
                        planText += `\n`;
                      }
                      if (pesSoapieResult) {
                        planText += `-----------------------------------------\n`;
                        planText += `4. NOTA DE EVOLUCIÓN (SOAPIE):\n`;
                        planText += `${pesSoapieResult}\n`;
                      }
                      planText += `=========================================`;

                      navigator.clipboard.writeText(planText);
                      alert("¡Plan de cuidados completo copiado!");
                    }}
                    disabled={!pesResult}
                    className="flex-1 py-3 bg-indigo-650 hover:bg-indigo-750 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99] transition-all cursor-pointer font-sans"
                  >
                    <CopyCheck className="w-4 h-4" /> Copiar Plan de Cuidados Completo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
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

            {/* PES Explanation Section */}
            <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900/50 to-emerald-950/20 border border-indigo-500/20 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Metodología Académica</span>
                <h3 className="text-xl md:text-2xl font-black text-white">La Estructura PES de Diagnósticos</h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Cualquier enfermero experto sabe que formular un diagnóstico preciso requiere rigor científico. El formato <b>PES</b> es el estándar clínico para redactar juicios diagnósticos ordenados bajo la taxonomía NANDA-I.
                </p>
              </div>

              {/* Three column PES breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* P */}
                <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl space-y-2.5 relative">
                  <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center">P</div>
                  <h4 className="font-extrabold text-sm text-slate-200">Problema (Etiqueta NANDA)</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Identifica el estado o respuesta del paciente. Describe la etiqueta diagnóstica oficial de la taxonomía (ej: <i>Dolor agudo</i>).
                  </p>
                </div>

                {/* E */}
                <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl space-y-2.5 relative">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 font-black text-xs flex items-center justify-center font-sans">E</div>
                  <h4 className="font-extrabold text-sm text-slate-200">Etiología / Causa (R/C)</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Factores relacionados o de riesgo que originan o propician el problema. Se vincula usando el conector <b>Relacionado con (R/C)</b>.
                  </p>
                </div>

                {/* S */}
                <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl space-y-2.5 relative">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center font-sans">S</div>
                  <h4 className="font-extrabold text-sm text-slate-200">Signos y Síntomas (M/P)</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Características definitorias que demuestran el problema (manifestaciones clínicas). Se vincula usando <b>Manifestado por (M/P)</b>.
                  </p>
                </div>
              </div>

              {/* Redaction Rules Summary Box */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4.5 space-y-3">
                <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider block">Reglas de Redacción NANDA-I Oficiales</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-rose-400 block">1. Diagnóstico Real</span>
                    <p className="text-[10px] text-slate-350 leading-normal">
                      Requiere los 3 componentes: <b className="text-white">Problema</b> (R/C) <b className="text-white">Etiología</b> (M/P) <b className="text-white">Signos/Síntomas</b>.
                    </p>
                  </div>
                  <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4">
                    <span className="text-[10px] font-bold text-amber-400 block">2. Diagnóstico de Riesgo</span>
                    <p className="text-[10px] text-slate-350 leading-normal">
                      Solo requiere: <b className="text-white">Problema de riesgo</b> (R/C) <b className="text-white">Factor de riesgo</b>. (No existe manifestación clínica aún).
                    </p>
                  </div>
                  <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-4">
                    <span className="text-[10px] font-bold text-emerald-400 block">3. Promoción de la Salud</span>
                    <p className="text-[10px] text-slate-350 leading-normal">
                      Requiere: <b className="text-white">Problema de bienestar</b> (M/P) <b className="text-white">Conductas de mejora</b>. (No hay etiología).
                    </p>
                  </div>
                </div>
              </div>

              {/* Call-to-action to use the tool */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2 border-t border-white/5">
                <div className="text-left">
                  <h4 className="text-xs font-extrabold text-indigo-200">¿Quieres redactar uno ahora mismo?</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Hemos añadido un nuevo Creador/Estructurador PES interactivo asistido por IA.</p>
                </div>
                <button
                  onClick={() => {
                    setShowLanding(false);
                    setActiveTab('pes');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-[11px] transition-all cursor-pointer font-sans shadow-md shadow-indigo-600/20 active:scale-[0.98]"
                >
                  Abrir Estructurador PES
                </button>
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

          <button
            onClick={() => {
              if (subscriptionStatus !== 'active') {
                setShowPaywallModal(true);
                return;
              }
              setActiveTab('pes');
            }}
            className={`flex-1 sm:flex-none justify-center px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer relative ${
              activeTab === 'pes'
                ? 'bg-white text-indigo-650 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Estructurador PES (NANDA-I)</span>
            <span className="sm:hidden">Redactor PES</span>
            {subscriptionStatus !== 'active' && (
              <Sparkles className="w-3 h-3 text-amber-500 absolute -top-1 -right-1" />
            )}
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

      {activeTab === 'calculators' && (() => {
        const allCalculators = [
          { id: 'glasgow', name: 'Escala de Glasgow', desc: 'Evalúa la respuesta ocular, verbal y motora para medir el nivel de alerta neurológico.', isPremium: true, cats: ['uci', 'adults'] },
          { id: 'apgar', name: 'Test de APGAR', desc: 'Valoración rápida del estado de salud y vitalidad del recién nacido al 1er y 5to minuto.', isPremium: true, cats: ['pediatria'] },
          { id: 'silverman', name: 'Test de Silverman-Andersen', desc: 'Evaluación del grado de dificultad respiratoria en recién nacidos.', isPremium: true, cats: ['pediatria'] },
          { id: 'abg', name: 'Gases Arteriales (ABG)', desc: 'Intérprete ácido-base avanzado para evaluar acidosis, alcalosis y compensaciones.', isPremium: true, cats: ['uci', 'adults'] },
          { id: 'braden', name: 'Escala de Braden (UPP)', desc: 'Herramienta predictiva para evaluar el riesgo de presentar úlceras por presión.', isPremium: true, cats: ['adults', 'uci'] },
          { id: 'downton', name: 'Escala de Downton (Caídas)', desc: 'Estratificación del riesgo de caídas basada en medicación, marcha y déficits.', isPremium: true, cats: ['adults'] },
          { id: 'fpp', name: 'Fecha Probable de Parto (FPP)', desc: 'Calculadora gestacional para estimar el parto basada en la FUR (Regla Naegele).', isPremium: true, cats: ['obstetricia'] },
          { id: 'bmi', name: 'Cálculo de IMC', desc: 'Evalúa el estado nutricional calculando la relación entre peso y altura del paciente.', isPremium: false, cats: ['adults', 'pediatria'] },
          { id: 'dose', name: 'Regla de Tres (Dosis)', desc: 'Cálculo de proporcionalidad estándar para diluciones rápidas y dosificación.', isPremium: false, cats: ['sueroterapia', 'pediatria'] },
          { id: 'norton', name: 'Escala de Norton Modificada', desc: 'Valoración alternativa del estado físico y riesgo de lesiones por presión.', isPremium: true, cats: ['adults'] },
          { id: 'barthel', name: 'Índice de Barthel (AVD)', desc: 'Mide la independencia funcional en las 10 principales actividades cotidianas.', isPremium: true, cats: ['adults'] },
          { id: 'maddox', name: 'Escala de Maddox (Flebitis)', desc: 'Clasifica la gravedad de la flebitis local para guiar el cambio de accesos venosos.', isPremium: true, cats: ['adults'] },
          { id: 'aldrete', name: 'Escala de Aldrete (Recuperación)', desc: 'Criterio estándar para autorizar el alta del paciente de salas de recuperación postanestésica.', isPremium: true, cats: ['adults'] },
          { id: 'fam_apgar', name: 'Apgar Familiar', desc: 'Mide el nivel de percepción sobre la funcionalidad y soporte de la familia.', isPremium: true, cats: ['adults'] },
          { id: 'sc_adults', name: 'Superficie Corporal Adultos', desc: 'Cálculo de área corporal de adultos para dosificar fármacos y quimioterapias.', isPremium: true, cats: ['adults'] },
          { id: 'sc_kids', name: 'Superficie Corporal Niños', desc: 'Cálculo del área corporal pediátrica empleando la fórmula de Mosteller.', isPremium: true, cats: ['pediatria'] },
          { id: 'pam', name: 'Presión Arterial Media (PAM)', desc: 'Calcula la presión arterial de perfusión orgánica vital y sus niveles de riesgo.', isPremium: true, cats: ['adults', 'uci'] },
          { id: 'alcohol', name: 'Conversión de Alcohol a 70°', desc: 'Cálculo de dilución para preparar alcohol desinfectante de 70° a partir de 96°.', isPremium: true, cats: ['sueroterapia'] },
          { id: 'losses', name: 'Cálculo de Pérdidas Insensibles', desc: 'Estima la evaporación hídrica por piel y respiración con correcciones clínicas.', isPremium: true, cats: ['uci'] },
          { id: 'inotrope', name: 'Infusión de Inotrópicos', desc: 'Convierte dosificación de vasoactivos (mcg/kg/min) a tasa de bomba (ml/h).', isPremium: true, cats: ['uci'] },
          { id: 'inotrope_1to1', name: 'Volumen Total Inotrópicos (1:1)', desc: 'Tasa de infusión rápida de inotrópicos para diluciones de concentración conocida.', isPremium: true, cats: ['uci'] },
          { id: 'apache2', name: 'Escala APACHE II', desc: 'Mide severidad fisiológica y estima la mortalidad intrahospitalaria en UCI.', isPremium: true, cats: ['uci'] },
          { id: 'tiss28', name: 'Escala TISS-28', desc: 'Evalúa la carga asistencial de enfermería en base a de procedimientos críticos.', isPremium: true, cats: ['uci'] },
          { id: 'cam_icu', name: 'CAM-ICU (Delirium)', desc: 'Algoritmo para diagnosticar de forma objetiva la presencia de delirium en UCI.', isPremium: true, cats: ['uci'] },
          { id: 'flacc', name: 'Escala FLACC (Dolor)', desc: 'Valoración objetiva del dolor pediátrico mediante la observación de gestos y llanto.', isPremium: true, cats: ['pediatria'] },
          { id: 'ped_dose', name: 'Jarabes y Suspensiones Pediátricas', desc: 'Cálculo en ml para suspensiones orales en base a mg indicados y concentración.', isPremium: true, cats: ['pediatria', 'sueroterapia'] },
          { id: 'eg', name: 'Edad Gestacional (EG)', desc: 'Cálculo del tiempo exacto de embarazo en semanas/días basándose en la FUR.', isPremium: true, cats: ['obstetricia'] },
          { id: 'drip_rate', name: 'Velocidad de Goteo', desc: 'Calcula gotas/minuto y flujo ml/h para macrogoteros o microgoteros.', isPremium: true, cats: ['sueroterapia'] },
          { id: 'infusion_volume', name: 'Volumen de Infusión', desc: 'Estima el volumen total infundido a partir de la tasa de goteo y tiempo.', isPremium: true, cats: ['sueroterapia'] },
          { id: 'infusion_time', name: 'Tiempo de Infusión', desc: 'Calcula la duración en horas/minutos requerida para terminar un suero.', isPremium: true, cats: ['sueroterapia'] },
          { id: 'injectable_dose', name: 'Dosis de Inyectables', desc: 'Volumen a extraer en ml para fármacos en viales o ampollas diluidas.', isPremium: true, cats: ['sueroterapia'] },
          { id: 'dextrose', name: 'Conversión de Dextrosa', desc: 'Mezcla de dextrosas para alcanzar la concentración prescrita (Pearson Square).', isPremium: true, cats: ['sueroterapia'] },
          { id: 'chloride', name: 'Conversión de Cloruro (NaCl)', desc: 'Cálculo de volumen de hipersodio a diluir para preparar soluciones salinas.', isPremium: true, cats: ['sueroterapia'] }
        ];

        return (
          <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 no-print">
            {activeCalculator === null ? (
              <div className="space-y-6">
                {/* Category Filter bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Suite de Calculadoras y Fórmulas Clínicas</h2>
                    <p className="text-xs text-slate-500 mt-1">Selecciona una herramienta interactiva para tu práctica diaria en enfermería.</p>
                  </div>
                  
                  {/* Horizontal scrollable category filters */}
                  <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 whitespace-nowrap scrollbar-thin">
                    {[
                      { id: 'all', label: 'Todas' },
                      { id: 'adults', label: 'Adultos / Gral' },
                      { id: 'pediatria', label: 'Pediatría / Neo' },
                      { id: 'obstetricia', label: 'Obstetricia' },
                      { id: 'uci', label: 'UCI / Urgencias' },
                      { id: 'sueroterapia', label: 'Sueroterapia / Dosis' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategoryFilter(cat.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeCategoryFilter === cat.id
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                            : 'bg-white border border-slate-200 text-slate-655 hover:bg-slate-50'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid of calculator cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                  {allCalculators
                    .filter(c => activeCategoryFilter === 'all' || c.cats.includes(activeCategoryFilter))
                    .map(calc => {
                      const isLocked = calc.isPremium && subscriptionStatus !== 'active';
                      return (
                        <button
                          key={calc.id}
                          type="button"
                          onClick={() => setActiveCalculator(calc.id)}
                          className="bg-white border border-slate-200/90 rounded-3xl p-5 text-left flex flex-col justify-between h-[160px] hover:shadow-lg hover:border-indigo-100 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                        >
                          {/* Hover accent decoration */}
                          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/40 rounded-full blur-2xl group-hover:bg-indigo-100/50 transition-all pointer-events-none"></div>
                          
                          <div className="space-y-1.5 relative z-10">
                            <div className="flex justify-between items-start">
                              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <Activity className="w-4 h-4" />
                              </div>
                              {isLocked ? (
                                <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                                  <Lock className="w-2.5 h-2.5" /> Premium
                                </span>
                              ) : calc.isPremium ? (
                                <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[9px] font-extrabold px-2 py-0.5 rounded-lg flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5" /> Premium
                                </span>
                              ) : (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-extrabold px-2 py-0.5 rounded-lg">
                                  Gratis
                                </span>
                              )}
                            </div>
                            
                            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight leading-snug pt-1 group-hover:text-indigo-650 transition-colors">
                              {calc.name}
                            </h3>
                          </div>

                          <p className="text-[11px] text-slate-450 leading-normal line-clamp-2 relative z-10">
                            {calc.desc}
                          </p>
                        </button>
                      );
                    })}
                </div>
              </div>
            ) : (
              /* Selected calculator view */
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 min-h-[500px] flex flex-col justify-between animate-fade-in">
                {/* Back Button and active calculator details */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-6 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveCalculator(null)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-indigo-50 px-3.5 py-2 rounded-xl cursor-pointer"
                  >
                    <span>← Volver al Menú</span>
                  </button>
                  <div className="text-right hidden sm:block">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-655 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      {allCalculators.find(c => c.id === activeCalculator)?.isPremium ? "Premium ★" : "Gratis ✓"}
                    </span>
                  </div>
                </div>

                {/* Render either Paywall lock or active workspace calculator */}
                {activeCalculator !== null && !['bmi', 'dose'].includes(activeCalculator) && subscriptionStatus !== 'active' ? (
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
                      type="button"
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
                    {activeCalculator === 'norton' && renderNortonScale()}
                    {activeCalculator === 'barthel' && renderBarthelIndex()}
                    {activeCalculator === 'maddox' && renderMaddoxScale()}
                    {activeCalculator === 'aldrete' && renderAldreteScale()}
                    {activeCalculator === 'fam_apgar' && renderFamApgarScale()}
                    {activeCalculator === 'sc_adults' && renderScCalculator()}
                    {activeCalculator === 'sc_kids' && renderScCalculator()}
                    {activeCalculator === 'pam' && renderPamCalculator()}
                    {activeCalculator === 'alcohol' && renderAlcoholDilutionCalculator()}
                    {activeCalculator === 'losses' && renderSensibleLossesCalculator()}
                    {activeCalculator === 'inotrope' && renderInotropeCalculator()}
                    {activeCalculator === 'inotrope_1to1' && renderInotrope1to1Calculator()}
                    {activeCalculator === 'apache2' && renderApache2Scale()}
                    {activeCalculator === 'tiss28' && renderTiss28Scale()}
                    {activeCalculator === 'cam_icu' && renderCamIcuScale()}
                    {activeCalculator === 'flacc' && renderFlaccScale()}
                    {activeCalculator === 'ped_dose' && renderPediatricDoseCalculator()}
                    {activeCalculator === 'eg' && renderGestationalAgeCalculator()}
                    {activeCalculator === 'drip_rate' && renderDripRateCalculator()}
                    {activeCalculator === 'infusion_volume' && renderInfusionVolumeCalculator()}
                    {activeCalculator === 'infusion_time' && renderInfusionTimeCalculator()}
                    {activeCalculator === 'injectable_dose' && renderInjectableDoseCalculator()}
                    {activeCalculator === 'dextrose' && renderDextroseConverter()}
                    {activeCalculator === 'chloride' && renderChlorideConverter()}
                  </div>
                )}
              </div>
            )}
          </main>
        );
      })()}

      {activeTab === 'pes' && renderPesBuilder()}

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
                        {selectedPlanDetails.nocIndicators.map((ind: any, idx: number) => (
                          <li key={idx}>{typeof ind === 'object' && ind !== null ? `${ind.code} - ${ind.name}` : ind}</li>
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
                          {selectedPlanDetails.nocIndicators.map((ind: any, idx: number) => (
                            <li key={idx} className="leading-tight">
                              {typeof ind === 'object' && ind !== null ? `${ind.code} - ${ind.name}` : ind}
                            </li>
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
