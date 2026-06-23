import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { DIAGNOSES, NOC_OUTCOMES, NIC_INTERVENTIONS, findBestNoc, findBestNic } from "./src/data";
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import Stripe from "stripe";

dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mockKey", {
  apiVersion: "2023-10-16" as any,
});

// Initialize Firebase Admin
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

let isFirebaseConfigured = false;
if (firebasePrivateKey && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PROJECT_ID) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: firebasePrivateKey,
      }),
    });
    isFirebaseConfigured = true;
    console.log("[FirebaseAdmin] Inicializado correctamente.");
  } catch (err: any) {
    console.error("[FirebaseAdmin] Error al inicializar:", err.message || err);
  }
} else {
  console.warn("[FirebaseAdmin] Variables de entorno de Firebase faltantes. Se usará el modo Mock/Desarrollo.");
}

// Fallback database for when GEMINI_API_KEY is not configured or in case of errors
const FALLBACK_ANALYSES = [
  {
    keywords: ["poliuria", "orinando mucho", "exceso de orina", "eliminacion urinaria", "orina frecuente", "miccion frecuente", "eliminación urinaria", "orina"],
    analysis: {
      nandaCode: "00016",
      nandaName: "Deterioro de la eliminación urinaria",
      definition: "Disfunción en la eliminación de la orina.",
      relatedFactors: ["Deterioro sensitivo motor", "Infección del tracto urinario", "Efecto de medicamentos (diuréticos)", "Multicausalidad (poliuria, diabetes)"],
      nocCode: "0503",
      nocName: "Eliminación urinaria",
      nocIndicators: [
        { code: "050301", name: "Patrón de eliminación" },
        { code: "050303", name: "Cantidad de orina" },
        { code: "050312", name: "Ausencia de dificultades en la micción" },
        { code: "050331", name: "Poliuria controlada" }
      ],
      nicCode: "0590",
      nicName: "Manejo de la eliminación urinaria",
      nicActivities: [
        "Monitorizar la eliminación urinaria, incluyendo la frecuencia, consistencia, olor, volumen y color.",
        "Registrar de forma exacta las entradas y salidas diarias (balance hídrico).",
        "Enseñar al paciente/familia a observar los signos de infección o alteración en el patrón miccional.",
        "Sugerir derivación al especialista si se detectan signos de diabetes o disfunción renal."
      ],
      justification: "La presencia de poliuria o micción excesiva es un síntoma cardinal de alteración miccional, requiriendo el diagnóstico de Deterioro de la eliminación urinaria [00016]."
    }
  },
  {
    keywords: ["sangrado", "sangre", "heces", "deposiciones", "evacuacion", "gastrointestinal", "rectorragia", "melena"],
    analysis: {
      nandaCode: "00027",
      nandaName: "Déficit de volumen de líquidos",
      definition: "Disminución del líquido intravascular, intersticial y/o intracelular. Se refiere a la deshidratación.",
      relatedFactors: ["Pérdida activa del volumen de líquidos (sangrado, evacuaciones)", "Ingesta insuficiente de líquidos"],
      nocCode: "0601",
      nocName: "Equilibrio hídrico",
      nocIndicators: [
        { code: "060101", name: "Presión arterial dentro de límites normales" },
        { code: "060107", name: "Entradas y salidas diarias equilibradas" },
        { code: "060109", name: "Densidad urinaria normal" }
      ],
      nicCode: "4120",
      nicName: "Manejo de líquidos",
      nicActivities: [
        "Registrar de forma exacta las entradas y salidas diarias (balance hídrico).",
        "Administrar terapia de hidratación intravenosa según prescripción médica.",
        "Supervisar el estado hemodinámico general del paciente (pulso, presión arterial).",
        "Vigilar signos de sangrado activo en heces o vómitos."
      ],
      justification: "El reporte de sangrado en heces o evacuaciones con pérdida activa representa un riesgo inminente de Déficit de volumen de líquidos [00027] que debe ser monitorizado."
    }
  },
  {
    keywords: ["aire", "disnea", "respirar", "oxigeno", "ahogo", "fatiga", "pecho", "ventilacion", "asma", "pulmon", "asfixia", "taquipnea", "sibilancia", "dificultad respiratoria"],
    analysis: {
      nandaCode: "00032",
      nandaName: "Patrón respiratorio ineficaz",
      definition: "Inspiración y/o espiración que no proporciona una ventilación adecuada.",
      relatedFactors: ["Ansiedad", "Deformidad de la pared torácica", "Dolor", "Fatiga de los músculos respiratorios"],
      nocCode: "0403",
      nocName: "Estado respiratorio: ventilación",
      nocIndicators: [
        { code: "040301", name: "Frecuencia respiratoria" },
        { code: "040302", name: "Ritmo respiratorio" },
        { code: "040303", name: "Profundidad de la respiración" },
        { code: "040309", name: "Uso de músculos accesorios" }
      ],
      nicCode: "3350",
      nicName: "Monitorización respiratoria",
      nicActivities: [
        "Monitorizar la frecuencia, ritmo, profundidad y esfuerzo de las respiraciones.",
        "Anotar el movimiento torácico, mirando la simetría, uso de músculos accesorios.",
        "Monitorizar los niveles de saturación de oxígeno en pacientes sedados.",
        "Auscultar los sonidos respiratorios, observando las áreas de disminución o ausencia de ventilación.",
        "Realizar el seguimiento de los informes de radiología."
      ],
      justification: "La presencia de dificultad respiratoria, disnea y sibilancias bilaterales se asocia directamente con un Patrón respiratorio ineficaz [00032]."
    }
  },
  {
    keywords: ["infeccion", "fiebre", "herida", "pus", "operado", "cirugia", "sangre", "riesgo", "cortada", "sutura", "sepsis", "quirúrgica", "catéter", "cateter", "vaginal", "purulenta", "purulento", "secrecion", "flujo"],
    analysis: {
      nandaCode: "00004",
      nandaName: "Riesgo de infección",
      definition: "Aumento del riesgo de ser invadido por microorganismos patógenos.",
      relatedFactors: ["Procedimientos invasivos", "Rotura de la integridad cutánea", "Inmunosupresión", "Desnutrición"],
      nocCode: "1902",
      nocName: "Control del riesgo",
      nocIndicators: [
        { code: "190201", name: "Evita la exposición a amenazas" },
        { code: "190202", name: "Supervisa los factores de riesgo del entorno" },
        { code: "190203", name: "Desarrolla estrategias de control de riesgo efectivas" }
      ],
      nicCode: "6550",
      nicName: "Protección contra las infecciones",
      nicActivities: [
        "Observar los signos y síntomas de infección sistémica y localizada.",
        "Mantener la asepsia para el paciente en riesgo.",
        "Mantener la limpieza de la piel e hidratación cutánea.",
        "Instruir al paciente y familiares sobre higiene de manos."
      ],
      justification: "La presencia de fiebre u heridas quirúrgicas/invasivas eleva exponencialmente el Riesgo de infección [00004]."
    }
  },
  {
    keywords: ["nervioso", "ansiedad", "miedo", "temor", "tenso", "angustia", "palpitaciones", "preocupado", "estrés", "estres", "inquieto", "desasosiego"],
    analysis: {
      nandaCode: "00146",
      nandaName: "Ansiedad",
      definition: "Vaga sensación de malestar o amenaza acompañada de una respuesta autonómica.",
      relatedFactors: ["Crisis situacional", "Estado de salud e incertidumbre", "Estrés agudo", "Amenaza para el autoconcepto"],
      nocCode: "1211",
      nocName: "Nivel de ansiedad",
      nocIndicators: [
        { code: "121101", name: "Desasosiego" },
        { code: "121105", name: "Aumento de la frecuencia cardíaca" },
        { code: "121117", name: "Ansiedad verbalizada" }
      ],
      nicCode: "5820",
      nicName: "Disminución de la ansiedad",
      nicActivities: [
        "Utilizar un enfoque sereno que dé seguridad.",
        "Explicar todos los procedimientos médicos y de enfermería de forma clara.",
        "Permanecer con el paciente para promover la seguridad y reducir el miedo.",
        "Animar a la manifestación de sentimientos, percepciones y miedos."
      ],
      justification: "El malestar emocional, la tensión y la angustia son compatibles con el diagnóstico de Ansiedad [00146]."
    }
  },
  {
    keywords: ["caida", "suelo", "resbalo", "viejito", "anciano", "vertigo", "mareo", "debilidad", "equilibrio", "caídas", "caidas", "resbalón", "marcha", "inestabilidad"],
    analysis: {
      nandaCode: "00155",
      nandaName: "Riesgo de caídas",
      definition: "Aumento de la susceptibilidad a las caídas que pueden causar daño físico.",
      relatedFactors: ["Edad mayor de 65 años", "Entorno desconocido", "Dificultades en la marcha", "Uso de sedantes"],
      nocCode: "1902",
      nocName: "Control del riesgo",
      nocIndicators: [
        { code: "190201", name: "Evita la exposición a amenazas para la salud" },
        { code: "190202", name: "Modifica el estilo de vida para reducir el riesgo" }
      ],
      nicCode: "6490",
      nicName: "Prevención de caídas",
      nicActivities: [
        "Identificar déficits cognitivos o físicos del paciente que aumenten la susceptibilidad.",
        "Colocar los objetos de uso cotidiano al alcance del paciente.",
        "Asegurar que las barandillas de la cama estén elevadas y las ruedas bloqueadas."
      ],
      justification: "El historial de mareos, debilidad, o factores de edad avanzada sitúan al paciente en un estado de Riesgo de caídas [00155]."
    }
  },
  {
    keywords: ["dolor", "agudo", "fuerte", "punzada", "cólico", "colico", "duele", "intenso", "opresión", "opresion"],
    analysis: {
      nandaCode: "00132",
      nandaName: "Dolor agudo",
      definition: "Experiencia sensorial y emocional desagradable asociada a una lesión tisular real o potencial.",
      relatedFactors: ["Agentes biológicos (infección)", "Agentes físicos (trauma, cirugía)", "Agentes químicos"],
      nocCode: "2102",
      nocName: "Nivel del dolor",
      nocIndicators: [
        { code: "210201", name: "Dolor referido" },
        { code: "210202", name: "Expresiones faciales de dolor" },
        { code: "210203", name: "Duración de los episodios de dolor" }
      ],
      nicCode: "1400",
      nicName: "Manejo del dolor",
      nicActivities: [
        "Realizar una valoración exhaustiva del dolor que incluya localización, características, aparición, duración, frecuencia e intensidad.",
        "Asegurar que el paciente reciba atención analgésica oportuna.",
        "Instruir al paciente sobre métodos no farmacológicos de alivio."
      ],
      justification: "El dolor referido y las expresiones faciales de tensión confirman clínicamente un estado de Dolor agudo [00132]."
    }
  },
  {
    keywords: ["corazón", "corazon", "cardíaco", "cardiaco", "arritmia", "taquicardia", "bradicardia", "latidos", "presión", "presion", "hipotensión", "hipotension", "infarto", "bombeo"],
    analysis: {
      nandaCode: "00029",
      nandaName: "Disminución del gasto cardíaco",
      definition: "La cantidad de sangre bombeada por el corazón es insuficiente para satisfacer las necesidades metabólicas.",
      relatedFactors: ["Alteración de la frecuencia cardíaca", "Alteración del volumen de eyección", "Alteración de la precarga"],
      nocCode: "0415",
      nocName: "Estado respiratorio",
      nocIndicators: [
        { code: "041501", name: "Saturación de oxígeno" },
        { code: "041502", name: "Gasometría arterial" },
        { code: "041508", name: "Facilidad de la respiración" }
      ],
      nicCode: "4040",
      nicName: "Cuidados cardíacos",
      nicActivities: [
        "Monitorizar el estado cardiovascular continuamente.",
        "Monitorizar el electrocardiograma para detectar arritmias u ondas anómalas.",
        "Observar signos de gasto cardíaco bajo (extremidades frías, letargia).",
        "Registrar lecturas de presión arterial con frecuencia."
      ],
      justification: "La inestabilidad hemodinámica y las alteraciones del ritmo cardíaco justifican una Disminución del gasto cardíaco [00029]."
    }
  },
  {
    keywords: ["piel", "úlcera", "ulcera", "escara", "lesión", "lesion", "cutánea", "cutanea", "rozadura", "enrojecimiento", "dermis", "epidermis", "cizallamiento"],
    analysis: {
      nandaCode: "00095",
      nandaName: "Deterioro de la integridad cutánea",
      definition: "Alteración de la epidermis y/o la dermis.",
      relatedFactors: ["Inmovilidad física", "Humedad", "Extremos de temperatura", "Fuerzas de cizallamiento"],
      nocCode: "1101",
      nocName: "Integridad tisular: piel y membranas",
      nocIndicators: [
        { code: "110111", name: "Perfusión tisular" },
        { code: "110113", name: "Integridad de la piel" },
        { code: "110115", name: "Pigmentación anormal" }
      ],
      nicCode: "3590",
      nicName: "Vigilancia de la piel",
      nicActivities: [
        "Observar si hay enrojecimiento, calor extremo o drenaje en la piel.",
        "Vigilar las fuentes de presión y fricción de las sábanas.",
        "Registrar cambios en la piel y membranas mucosas."
      ],
      justification: "La presencia de lesiones cutáneas o úlceras corporales requiere atención bajo el diagnóstico de Deterioro de la integridad cutánea [00095]."
    }
  },
  {
    keywords: ["calentura", "calor", "temperatura", "alta", "hipertermia", "caliente", "termómetro", "termometro", "sudor", "sudoracion", "diaforesis", "transpiracion"],
    analysis: {
      nandaCode: "00007",
      nandaName: "Hipertermia",
      definition: "Elevación de la temperatura corporal por encima del rango clínicamente normal.",
      relatedFactors: ["Deshidratación", "Enfermedad o traumatismo", "Aumento de la tasa metabólica", "Infección activa"],
      nocCode: "0800",
      nocName: "Termorregulación",
      nocIndicators: [
        { code: "080001", name: "Temperatura corporal normal" },
        { code: "080002", name: "Ausencia de sudoración profusa" },
        { code: "080018", name: "Ausencia de temblor o escalofríos" }
      ],
      nicCode: "3740",
      nicName: "Tratamiento de la fiebre",
      nicActivities: [
        "Controlar la temperatura corporal de forma continua o intermitente.",
        "Administrar medicamentos antipiréticos prescritos.",
        "Aplicar medios físicos de enfriamiento (compresas húmedas).",
        "Monitorizar pérdidas corporales de líquidos."
      ],
      justification: "La elevación sostenida de la temperatura corporal por encima de 38°C se clasifica como Hipertermia [00007]."
    }
  },
  {
    keywords: ["comer", "nutrición", "nutricion", "peso", "delgado", "flaco", "anorexia", "desnutrición", "desnutricion", "apetito", "comida", "bajo peso"],
    analysis: {
      nandaCode: "00002",
      nandaName: "Desequilibrio nutricional: inferior a las necesidades corporales",
      definition: "Consumo de nutrientes insuficiente para satisfacer las necesidades metabólicas.",
      relatedFactors: ["Incapacidad para digerir o absorber nutrientes", "Factores biológicos", "Incapacidad para ingerir alimentos"],
      nocCode: "1004",
      nocName: "Estado nutricional",
      nocIndicators: [
        { code: "100401", name: "Ingesta de nutrientes" },
        { code: "100402", name: "Ingesta de alimentos y líquidos" },
        { code: "100408", name: "Relación peso / talla" }
      ],
      nicCode: "1100",
      nicName: "Manejo de la nutrición",
      nicActivities: [
        "Determinar el estado nutricional del paciente.",
        "Fomentar la ingesta calórica adecuada a las necesidades metabólicas.",
        "Proporcionar alimentos nutritivos ricos en proteínas."
      ],
      justification: "El bajo peso corporal y el aporte nutricional deficiente fundamentan el Desequilibrio nutricional: inferior [00002]."
    }
  },
  {
    keywords: ["moverse", "caminar", "andar", "silla de ruedas", "inmovil", "inmóvil", "articulación", "articulacion", "parálisis", "paralisis", "rigidez", "marcha", "movilidad"],
    analysis: {
      nandaCode: "00085",
      nandaName: "Deterioro de la movilidad física",
      definition: "Limitación del movement independiente y intencionado del cuerpo o de una o más extremidades.",
      relatedFactors: ["Deterioro neuromuscular", "Dolor agudo", "Rigidez articular", "Falta de condición física"],
      nocCode: "0208",
      nocName: "Movilidad",
      nocIndicators: [
        { code: "020801", name: "Mantenimiento del equilibrio" },
        { code: "020803", name: "Movimiento muscular" },
        { code: "020806", name: "Ambulación" }
      ],
      nicCode: "4310",
      nicName: "Terapia de actividad",
      nicActivities: [
        "Colaborar con terapeutas ocupacionales en la planificación de actividad.",
        "Fomentar actividades motrices pasivas o activas.",
        "Ayudar al paciente a enfocarse en sus capacidades."
      ],
      justification: "La rigidez y limitación física funcional configuran el diagnóstico de Deterioro de la movilidad física [00085]."
    }
  },
  {
    keywords: ["estreñimiento", "estrenimiento", "no puedo evacuar", "heces duras", "sin ir al baño", "estreñido", "estrenido"],
    analysis: {
      nandaCode: "00011",
      nandaName: "Estreñimiento",
      definition: "Disminución de la frecuencia normal de defecación acompañada de eliminación difícil o incompleta de heces.",
      relatedFactors: ["Hábitos dietéticos deficientes", "Actividad física disminuida", "Uso crónico de laxantes"],
      nocCode: "0501",
      nocName: "Eliminación intestinal",
      nocIndicators: [
        { code: "050101", name: "Patrón de eliminación frecuente" },
        { code: "050102", name: "Consistencia adecuada de las heces" },
        { code: "050110", name: "Ausencia de estreñimiento o dolor al evacuar" }
      ],
      nicCode: "0450",
      nicName: "Manejo del estreñimiento/impactación",
      nicActivities: [
        "Evaluar la frecuencia y consistencia de las evacuaciones previas.",
        "Incentivar la ingesta hídrica oral y alimentos ricos en fibras.",
        "Administrar masajes abdominales o supositorios según pauta."
      ],
      justification: "La eliminación infrecuente y heces duras justifican el diagnóstico de Estreñimiento [00011]."
    }
  },
  {
    keywords: ["diarrea", "deposiciones líquidas", "deposiciones liquidas", "heces sueltas", "soltura", "estómago flojo"],
    analysis: {
      nandaCode: "00013",
      nandaName: "Diarrea",
      definition: "Eliminación de heces líquidas o no formadas, con aumento de la frecuencia de defecación.",
      relatedFactors: ["Procesos infecciosos gastrointestinales", "Efectos secundarios de medicamentos", "Ansiedad extrema"],
      nocCode: "0501",
      nocName: "Eliminación intestinal",
      nocIndicators: [
        { code: "050101", name: "Patrón de eliminación frecuente" },
        { code: "050102", name: "Consistencia adecuada de las heces" }
      ],
      nicCode: "0460",
      nicName: "Manejo de la diarrea",
      nicActivities: [
        "Fomentar la rehidratación oral progresiva.",
        "Supervisar la integridad de la piel perianal.",
        "Registrar la frecuencia, volumen, color y consistencia de las deposiciones."
      ],
      justification: "El aumento de frecuencia y liquidez de las evacuaciones se asocian con el diagnóstico de Diarrea [00013]."
    }
  }
];

function getFallback(prompt: string) {
  const normalizedPrompt = prompt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  let bestMatch = FALLBACK_ANALYSES[0].analysis;
  let maxScore = -1;

  for (const item of FALLBACK_ANALYSES) {
    let score = 0;
    for (const keyword of item.keywords) {
      const normalizedKeyword = keyword
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      // Match using word boundary regex to avoid false positives (e.g. "orina" matching inside "sudoracion")
      const regex = new RegExp("(?:^|\\s|[.,;()¡!¿?])" + normalizedKeyword + "(?:$|\\s|[.,;()¡!¿?])", "i");
      if (regex.test(normalizedPrompt)) {
        score += normalizedKeyword.length; // Prioritize longer word matches
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = item.analysis;
    }
  }

  // Fallback to substring in name if score is 0
  if (maxScore <= 0) {
    for (const item of FALLBACK_ANALYSES) {
      const normalizedName = item.analysis.nandaName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalizedPrompt.includes(normalizedName)) {
        return item.analysis;
      }
    }
  }

  return bestMatch;
}

function isValidApiKey(key: any): boolean {
  if (!key || typeof key !== "string") return false;
  const trimmed = key.trim();
  if (trimmed === "" || trimmed === "undefined" || trimmed === "null" || trimmed === "MY_GEMINI_API_KEY") return false;
  if (trimmed.includes("API_KEY") || trimmed.includes("SECRET") || trimmed.includes("PLACEHOLDER")) return false;
  // Standard Gemini API keys have length of at least 20 characters
  if (trimmed.length < 20) return false;
  return true;
}

const CACHE_PATH = path.join(process.cwd(), "nanda_mappings_cache.json");

function readCache() {
  try {
    if (fs.existsSync(CACHE_PATH)) {
      const content = fs.readFileSync(CACHE_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading NANDA mapping cache:", err);
  }
  return {};
}

function writeCache(cache: any) {
  try {
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing NANDA mapping cache:", err);
  }
}

async function resolveNandaMapping(nandaCode: string, nandaName: string, apiKey: string | undefined): Promise<any> {
  const cache = readCache();
  if (cache[nandaCode]) {
    console.log(`[Cache Hit] NANDA mapping for code ${nandaCode}`);
    return cache[nandaCode];
  }

  console.log(`[Cache Miss] Resolving NANDA mapping for code ${nandaCode} (${nandaName})`);
  
  const diagnosis = DIAGNOSES.find(d => d.code === nandaCode);
  const nandaDef = diagnosis?.definition || "";

  // 1. Check if Gemini API is available
  if (isValidApiKey(apiKey)) {
    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const promptText = `Eres un experto certificado en taxonomías de enfermería (NANDA-I, NOC y NIC).
Para el siguiente diagnóstico NANDA:
Código NANDA: "${nandaCode}"
Nombre NANDA: "${nandaName}"
Definición NANDA: "${nandaDef}"

Realiza una búsqueda exhaustiva en internet y localiza el resultado NOC oficial (o el más recomendado y vinculado) y la intervención NIC oficial (o la más recomendada y vinculada) para este diagnóstico NANDA.
Devuelve la respuesta en formato JSON estrictamente válido, sin envolverlo en bloques de código markdown, con la siguiente estructura de campos:
{
  "nocCode": "código de 4 dígitos del resultado NOC",
  "nocName": "nombre oficial del resultado NOC en español",
  "nocDefinition": "definición oficial del resultado NOC",
  "nocIndicators": [
    { "code": "código de 6 dígitos del indicador", "name": "nombre del indicador en español" }
  ],
  "nicCode": "código de 4 dígitos de la intervención NIC",
  "nicName": "nombre oficial de la intervención NIC en español",
  "nicActivities": [
    "actividad de enfermería 1 en español",
    "actividad de enfermería 2 en español",
    "actividad de enfermería 3 en español",
    "actividad de enfermería 4 en español"
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      let responseText = response.text || "";
      console.log(`[AI Search Grounding] Raw response for NANDA ${nandaCode}:`, responseText);

      // Clean response text of markdown blocks
      responseText = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();

      const parsed = JSON.parse(responseText);

      // Align and enrich with local database if exists
      let finalNocCode = parsed.nocCode || "0403";
      let finalNocName = parsed.nocName || "Estado respiratorio: ventilación";
      let finalNocIndicators = parsed.nocIndicators || [];
      const localNoc = NOC_OUTCOMES.find(n => n.code === finalNocCode);
      if (localNoc) {
        finalNocName = localNoc.name;
        finalNocIndicators = localNoc.indicators;
      }

      let finalNicCode = parsed.nicCode || "3350";
      let finalNicName = parsed.nicName || "Monitorización respiratoria";
      let finalNicActivities = parsed.nicActivities || [];
      const localNic = NIC_INTERVENTIONS.find(n => n.code === finalNicCode);
      if (localNic) {
        finalNicName = localNic.name;
        finalNicActivities = localNic.activities;
      }

      const mapping = {
        nandaCode,
        nandaName,
        nocCode: finalNocCode,
        nocName: finalNocName,
        nocIndicators: finalNocIndicators,
        nicCode: finalNicCode,
        nicName: finalNicName,
        nicActivities: finalNicActivities,
        justification: `Vínculo oficial obtenido mediante búsqueda IA y validado con taxonomía.`
      };

      // Save to cache
      cache[nandaCode] = mapping;
      writeCache(cache);
      return mapping;

    } catch (err: any) {
      console.error(`[AI Resolution Failed] Error resolving mapping for NANDA ${nandaCode}:`, err.message || err);
    }
  }

  // 2. Fallback to Local Text Similarity Matching
  console.log(`[Local Fallback] Finding best local NOC/NIC for NANDA ${nandaCode}`);
  const bestNoc = findBestNoc(nandaName, nandaDef);
  const bestNic = findBestNic(nandaName, nandaDef);

  const localMapping = {
    nandaCode,
    nandaName,
    nocCode: bestNoc.code,
    nocName: bestNoc.name,
    nocIndicators: bestNoc.indicators || [],
    nicCode: bestNic.code,
    nicName: bestNic.name,
    nicActivities: bestNic.activities || [],
    justification: `Asociación local offline mediante coincidencia de palabras clave por faltar conexión o límite de IA.`
  };

  // Cache it for subsequent requests
  cache[nandaCode] = localMapping;
  writeCache(cache);
  return localMapping;
}

interface AuthenticatedRequest extends express.Request {
  user?: {
    uid: string;
    email?: string;
    subscriptionStatus: "free" | "active" | "canceled" | "past_due";
  };
}

async function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  // If Firebase is not configured, bypass auth (development mock mode)
  if (!isFirebaseConfigured) {
    console.log("[AuthMiddleware] Firebase no configurado. Bypass de autenticación (Mock Mode).");
    (req as AuthenticatedRequest).user = {
      uid: "mock_user_123",
      email: "mock@enfermeria.com",
      subscriptionStatus: "active", // active in mock
    };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado. Token Bearer faltante." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const userDocRef = getFirestore().collection("users").doc(uid);
    const userDoc = await userDocRef.get();
    
    let subscriptionStatus: "free" | "active" | "canceled" | "past_due" = "free";
    if (userDoc.exists) {
      const data = userDoc.data();
      subscriptionStatus = data?.subscriptionStatus || "free";
    } else {
      await userDocRef.set({
        uid,
        email: decodedToken.email || "",
        subscriptionStatus: "free",
        createdAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }

    (req as AuthenticatedRequest).user = {
      uid,
      email: decodedToken.email,
      subscriptionStatus,
    };
    
    next();
  } catch (err: any) {
    console.error("[AuthMiddleware] Error verificando token:", err.message || err);
    return res.status(401).json({ error: "Sesión inválida o expirada." });
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Stripe Webhook handler (uses raw body for signature verification)
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req: express.Request, res: express.Response) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      if (webhookSecret && sig) {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } else {
        // Fallback for testing without signature validation (development only)
        console.warn("[StripeWebhook] No webhook secret configured. Running in unverified test mode.");
        event = JSON.parse(req.body.toString());
      }
    } catch (err: any) {
      console.error("[StripeWebhook] Error verificando firma:", err.message || err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`[StripeWebhook] Recibido evento: ${event.type}`);

    try {
      // Handle the subscription events
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        const uid = session.metadata?.firebaseUid;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (uid && isFirebaseConfigured) {
          // Fetch subscription to check duration/price
          const subscription = (await stripe.subscriptions.retrieve(subscriptionId)) as any;
          const priceId = subscription.items.data[0].price.id;
          
          let plan: "monthly" | "yearly" = "monthly";
          if (priceId === process.env.STRIPE_PRICE_YEARLY) {
            plan = "yearly";
          }

          await getFirestore().collection("users").doc(uid).set({
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: "active",
            plan,
            subscriptionExpiresAt: Timestamp.fromMillis(subscription.current_period_end * 1000),
            updatedAt: FieldValue.serverTimestamp(),
          }, { merge: true });

          console.log(`[StripeWebhook] Usuario ${uid} activado con plan ${plan}`);
        }
      } else if (
        event.type === "customer.subscription.updated" || 
        event.type === "customer.subscription.deleted"
      ) {
        const subscription = event.data.object as any;
        const customerId = subscription.customer;
        const status = subscription.status; // e.g. active, past_due, canceled, unpaid

        if (isFirebaseConfigured) {
          const usersSnap = await getFirestore()
            .collection("users")
            .where("stripeCustomerId", "==", customerId)
            .get();

          if (!usersSnap.empty) {
            const userDoc = usersSnap.docs[0];
            let activeStatus: "active" | "free" | "canceled" | "past_due" = "free";
            if (status === "active") {
              activeStatus = "active";
            } else if (status === "past_due") {
              activeStatus = "past_due";
            } else {
              activeStatus = "free"; // downgrade to free if canceled or unpaid
            }

            await userDoc.ref.update({
              subscriptionStatus: activeStatus,
              subscriptionExpiresAt: Timestamp.fromMillis(subscription.current_period_end * 1000),
              updatedAt: FieldValue.serverTimestamp(),
            });

            console.log(`[StripeWebhook] Suscripción actualizada para cliente ${customerId} a ${activeStatus}`);
          }
        }
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error("[StripeWebhook] Error procesando evento:", err.message || err);
      res.status(500).send("Error interno de procesamiento de webhook.");
    }
  });

  app.use(express.json());

  // Create Stripe Checkout Session
  app.post("/api/stripe/create-checkout-session", requireAuth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthenticatedRequest;
    const { planType } = req.body; // 'monthly' | 'yearly'
    const uid = authReq.user?.uid;
    const email = authReq.user?.email;

    if (!uid) {
      return res.status(401).json({ error: "Usuario no autenticado." });
    }

    try {
      let priceId = process.env.STRIPE_PRICE_MONTHLY;
      if (planType === "yearly") {
        priceId = process.env.STRIPE_PRICE_YEARLY;
      }

      if (!priceId) {
        // Fallback for development if prices not set in env yet, using test prices
        console.warn("[Stripe] STRIPE_PRICE_MONTHLY o STRIPE_PRICE_YEARLY no configurados. Usando claves de prueba por defecto.");
        priceId = planType === "yearly" ? "price_1TlE2c0xz7HT1EnIu9REbKJk" : "price_1TlE2c0xz7HT1EnIQfbBNANJ";
      }

      const appUrl = process.env.APP_URL || "https://consultor-enfermeria-nnn.onrender.com";

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        customer_email: email,
        metadata: {
          firebaseUid: uid,
        },
        success_url: `${appUrl}/?session_id={CHECKOUT_SESSION_ID}&payment=success`,
        cancel_url: `${appUrl}/?payment=cancel`,
      });

      res.json({ url: session.url });
    } catch (err: any) {
      console.error("[Stripe] Error creando Checkout Session:", err.message || err);
      res.status(500).json({ error: "No se pudo crear la sesión de pago." });
    }
  });

  // Create Stripe Customer Portal Session (to manage/cancel subscription)
  app.post("/api/stripe/create-portal-session", requireAuth, async (req: express.Request, res: express.Response) => {
    const authReq = req as AuthenticatedRequest;
    const uid = authReq.user?.uid;

    if (!uid || !isFirebaseConfigured) {
      return res.status(401).json({ error: "Acceso denegado o Firebase inactivo." });
    }

    try {
      const userDoc = await getFirestore().collection("users").doc(uid).get();
      const customerId = userDoc.data()?.stripeCustomerId;

      if (!customerId) {
        return res.status(400).json({ error: "No tienes una suscripción activa de Stripe registrada." });
      }

      const appUrl = process.env.APP_URL || "https://consultor-enfermeria-nnn.onrender.com";

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${appUrl}/`,
      });

      res.json({ url: session.url });
    } catch (err: any) {
      console.error("[Stripe] Error creando Portal Session:", err.message || err);
      res.status(500).json({ error: "No se pudo acceder al portal de Stripe." });
    }
  });
  app.post("/api/search-taxonomy", requireAuth, async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    if (authReq.user?.subscriptionStatus !== "active") {
      return res.status(403).json({ error: "PremiumRequired", message: "Esta función requiere una suscripción activa." });
    }
    const { query, type } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Direct fallback logic if Gemini API is missing or placeholder/invalid
    if (!isValidApiKey(apiKey)) {
      console.log(`Using fallback taxonomy search for type [${type}] with query: "${query}" (API key not configured or format invalid)`);
      const q = query.toLowerCase();
      
      let matchedResults: any[] = [];
      if (type === "noc") {
        matchedResults = NOC_OUTCOMES.filter(item => 
          item.name.toLowerCase().includes(q) || 
          item.definition.toLowerCase().includes(q) || 
          item.code.includes(q)
        );
        if (matchedResults.length === 0) matchedResults = NOC_OUTCOMES.slice(0, 3);
      } else if (type === "nic") {
        matchedResults = NIC_INTERVENTIONS.filter(item => 
          item.name.toLowerCase().includes(q) || 
          item.code.includes(q) ||
          item.activities.some(act => act.toLowerCase().includes(q))
        );
        if (matchedResults.length === 0) matchedResults = NIC_INTERVENTIONS.slice(0, 3);
      } else { // nanda
        matchedResults = DIAGNOSES.filter(item => 
          item.name.toLowerCase().includes(q) || 
          item.definition.toLowerCase().includes(q) || 
          item.code.includes(q)
        );
        if (matchedResults.length === 0) matchedResults = DIAGNOSES.slice(0, 3);
      }

      return res.json({ results: matchedResults, isFallback: true });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const promptText = `Eres un experto certificado en taxonomías clínicas de enfermería (NANDA, NOC y NIC).
El usuario quiere buscar y encontrar la etiqueta más adecuada y oficial para su caso.
Tipo de búsqueda requerido: "${type}"
Consulta de búsqueda libre del usuario: "${query}"

Determina de 2 a 4 opciones oficiales o idóneas de esta taxonomía que satisfagan la búsqueda.
Si la taxonomía solicitada es:
- "nanda": Devuelve diagnósticos NANDA relevantes con su código exacto de 5 dígitos (ej. "00004"), título del diagnóstico, definición y una lista de factores relacionados (3-4 factores).
- "noc": Devuelve criterios de evaluación/resultados NOC con su código de 4 dígitos (ej. "0403"), nombre del resultado, definición oficial, dominio y una lista de indicadores ideales (3-4 indicadores con un código ficticio o real de 6 dígitos acorde al NOC, ej. "040301").
- "nic": Devuelve intervenciones NIC con su código de 4 dígitos (ej. "6550"), nombre de la intervención y una lista de actividades de enfermería concretas y prácticas (4-5 actividades).

Si la búsqueda del usuario es generalista (ej: "corazón", "caídas", "triste"), encuentra los códigos NNN exactos y devuélvelos con el máximo nivel de rigor clínico para que asistan al profesional.

Formato de salida esperado (responde ÚNICAMENTE con esta estructura JSON sin preámbulos ni marcas de formato markdown):
{
  "results": [
    // El formato varía según el tipo tal cual la definición descrita, respetando los nombres de atributos exactos del esquema.
  ]
}`;

      let responseSchema: any;
      if (type === "noc") {
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  name: { type: Type.STRING },
                  definition: { type: Type.STRING },
                  domain: { type: Type.STRING },
                  indicators: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        code: { type: Type.STRING },
                        name: { type: Type.STRING }
                      },
                      required: ["code", "name"]
                    }
                  }
                },
                required: ["code", "name", "definition", "domain", "indicators"]
              }
            }
          },
          required: ["results"]
        };
      } else if (type === "nic") {
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  name: { type: Type.STRING },
                  activities: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["code", "name", "activities"]
              }
            }
          },
          required: ["results"]
        };
      } else { // nanda
        responseSchema = {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING },
                  name: { type: Type.STRING },
                  definition: { type: Type.STRING },
                  relatedFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["code", "name", "definition", "relatedFactors"]
              }
            }
          },
          required: ["results"]
        };
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Respuesta vacía de Gemini");
      }

      const parsed = JSON.parse(responseText.trim());
      res.json({ results: parsed.results, isFallback: false });

    } catch (err: any) {
      console.log("AI Taxonomy search fallbacked smoothly. Detalle de aviso:", err.message || err);
      // Fallback
      const q = query.toLowerCase();
      let matchedResults: any[] = [];
      if (type === "noc") {
        matchedResults = NOC_OUTCOMES.filter(item => 
          item.name.toLowerCase().includes(q) || 
          item.definition.toLowerCase().includes(q) || 
          item.code.includes(q)
        );
        if (matchedResults.length === 0) matchedResults = NOC_OUTCOMES.slice(0, 3);
      } else if (type === "nic") {
        matchedResults = NIC_INTERVENTIONS.filter(item => 
          item.name.toLowerCase().includes(q) || 
          item.code.includes(q) ||
          item.activities.some(act => act.toLowerCase().includes(q))
        );
        if (matchedResults.length === 0) matchedResults = NIC_INTERVENTIONS.slice(0, 3);
      } else {
        matchedResults = DIAGNOSES.filter(item => 
          item.name.toLowerCase().includes(q) || 
          item.definition.toLowerCase().includes(q) || 
          item.code.includes(q)
        );
        if (matchedResults.length === 0) matchedResults = DIAGNOSES.slice(0, 3);
      }
      res.json({ results: matchedResults, isFallback: true, errorMsg: err.message || "Fallo AI" });
    }
  });

  app.post("/api/get-nanda-mapping", requireAuth, async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    if (authReq.user?.subscriptionStatus !== "active") {
      return res.status(403).json({ error: "PremiumRequired", message: "Esta función requiere una suscripción activa." });
    }
    const { nandaCode, nandaName } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!nandaCode || !nandaName) {
      return res.status(400).json({ error: "NANDA code and name are required" });
    }

    try {
      const mapping = await resolveNandaMapping(nandaCode, nandaName, apiKey);
      res.json({ mapping, isFallback: false });
    } catch (err: any) {
      console.error("Error in /api/get-nanda-mapping route:", err.message || err);
      res.status(500).json({ error: "Failed to map NANDA diagnosis", details: err.message || err });
    }
  });

  app.use(express.json());

  // API Route for Gemini Symptoms Analysis
  app.post("/api/analyze", requireAuth, async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    if (authReq.user?.subscriptionStatus !== "active") {
      return res.status(403).json({ error: "PremiumRequired", message: "Esta función requiere una suscripción activa." });
    }
    const { symptoms, serviceContext } = req.body;

    if (!symptoms || typeof symptoms !== "string" || symptoms.trim() === "") {
      return res.status(400).json({ error: "Symptom description is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Local analyze fallback if key is missing or is the placeholder/invalid value
    if (!isValidApiKey(apiKey)) {
      console.log("Using local fallback analysis (GEMINI_API_KEY not configured or format invalid)...");
      const fallback = getFallback(symptoms);
      return res.json({ ...fallback, isFallback: true });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const promptText = `Eres un asistente clínico de taxonomía de enfermería certificado.
Analiza la siguiente sintomatología o cuadro clínico del paciente: "${symptoms}".
${serviceContext ? `Contexto del servicio hospitalario actual: "${serviceContext}".` : ""}

Realiza un juicio clínico exacto y devuelve un objeto JSON estructurado que proponga:
1. El diagnóstico diagnóstico NANDA más adecuado con su código de 5 dígitos y nombre oficiales.
2. Definición oficial del diagnóstico NANDA.
3. Lista de factores relacionados / factores de riesgo (2-4 elementos).
4. Un resultado NOC de evaluación de cuidados adecuado con su código de 4 dígitos, nombre oficial y dominio.
5. Lista de indicadores NOC de evaluación (2-4 elementos con código de 6 dígitos y nombre).
6. Una intervención NIC de enfermería adecuada con su código de 4 dígitos y nombre oficial.
7. Lista de actividades de enfermería NIC sugeridas (4-5 elementos concretos y aplicables).
8. Justificación del juicio clínico diagnóctico (un breve texto explicativo de 2 líneas).

Formato de salida esperado (responde ÚNICAMENTE con esta estructura JSON sin preámbulos ni marcas de formato markdown):
{
  "nandaCode": "00032",
  "nandaName": "Nombre del Diagnóstico NANDA",
  "definition": "Definición oficial NANDA",
  "relatedFactors": ["factor 1", "factor 2"],
  "nocCode": "0403",
  "nocName": "Nombre del Resultado NOC",
  "nocIndicators": [
    { "code": "040301", "name": "Indicador 1" },
    { "code": "040302", "name": "Indicador 2" }
  ],
  "nicCode": "3350",
  "nicName": "Nombre de la Intervención NIC",
  "nicActivities": [
    "Actividad 1",
    "Actividad 2",
    "Actividad 3"
  ],
  "justification": "Explicación breve del juicio clínico."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nandaCode: { type: Type.STRING },
              nandaName: { type: Type.STRING },
              definition: { type: Type.STRING },
              relatedFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
              nocCode: { type: Type.STRING },
              nocName: { type: Type.STRING },
              nocIndicators: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    code: { type: Type.STRING },
                    name: { type: Type.STRING }
                  },
                  required: ["code", "name"]
                }
              },
              nicCode: { type: Type.STRING },
              nicName: { type: Type.STRING },
              nicActivities: { type: Type.ARRAY, items: { type: Type.STRING } },
              justification: { type: Type.STRING }
            },
            required: ["nandaCode", "nandaName", "definition", "relatedFactors", "nocCode", "nocName", "nocIndicators", "nicCode", "nicName", "nicActivities", "justification"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response from Gemini API");
      }

      const parsedResult = JSON.parse(responseText.trim());
      
      // Resolve/override NOC and NIC for absolute database consistency and caching support
      const resolvedMapping = await resolveNandaMapping(parsedResult.nandaCode, parsedResult.nandaName, apiKey);
      
      const responseData = {
        ...parsedResult,
        nocCode: resolvedMapping.nocCode,
        nocName: resolvedMapping.nocName,
        nocIndicators: resolvedMapping.nocIndicators,
        nicCode: resolvedMapping.nicCode,
        nicName: resolvedMapping.nicName,
        nicActivities: resolvedMapping.nicActivities,
        justification: parsedResult.justification || resolvedMapping.justification
      };

      res.json({ ...responseData, isFallback: false });

    } catch (error: any) {
      console.log("Symptoms analyzer fallbacked smoothly. Detalle de aviso:", error.message || error);
      // Failover safely to local analytics to maintain a smooth experience
      const fallback = getFallback(symptoms);
      res.json({ ...fallback, isFallback: true, errorMsg: error.message || "Error contactando a la inteligencia artificial." });
    }
  });

  // GET: Retrieve all saved plans for the authenticated user
  app.get("/api/plans", requireAuth, async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    const uid = authReq.user?.uid;
    if (!uid || !isFirebaseConfigured) {
      return res.status(400).json({ error: "Acceso denegado o Firebase inactivo." });
    }
    try {
      const snapshot = await getFirestore()
        .collection("users")
        .doc(uid)
        .collection("plans")
        .orderBy("createdAt", "desc")
        .get();
      const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ plans });
    } catch (err: any) {
      console.error("Error retrieving plans:", err.message || err);
      res.status(500).json({ error: "No se pudieron obtener los planes." });
    }
  });

  // POST: Save a new care plan to Firestore
  app.post("/api/plans", requireAuth, async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    const uid = authReq.user?.uid;
    if (!uid || !isFirebaseConfigured) {
      return res.status(400).json({ error: "Acceso denegado o Firebase inactivo." });
    }
    const { patientName, nandaCode, nandaName, nocCode, nocName, nocIndicators, nicCode, nicName, nicActivities, evolutionNote } = req.body;
    try {
      const docRef = await getFirestore()
        .collection("users")
        .doc(uid)
        .collection("plans")
        .add({
          patientName: patientName || "Paciente sin nombre",
          nandaCode: nandaCode || "",
          nandaName: nandaName || "",
          nocCode: nocCode || "",
          nocName: nocName || "",
          nocIndicators: nocIndicators || [],
          nicCode: nicCode || "",
          nicName: nicName || "",
          nicActivities: nicActivities || [],
          evolutionNote: evolutionNote || "",
          createdAt: Timestamp.now(),
        });
      res.json({ success: true, id: docRef.id });
    } catch (err: any) {
      console.error("Error saving plan:", err.message || err);
      res.status(500).json({ error: "No se pudo guardar el plan." });
    }
  });

  // DELETE: Delete a saved plan
  app.delete("/api/plans/:id", requireAuth, async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    const uid = authReq.user?.uid;
    const { id } = req.params;
    if (!uid || !isFirebaseConfigured) {
      return res.status(400).json({ error: "Acceso denegado o Firebase inactivo." });
    }
    try {
      await getFirestore()
        .collection("users")
        .doc(uid)
        .collection("plans")
        .doc(id)
        .delete();
      res.json({ success: true });
    } catch (err: any) {
      console.error("Error deleting plan:", err.message || err);
      res.status(500).json({ error: "No se pudo eliminar el plan." });
    }
  });

  // POST: Generate SOAPIE evolution note using Gemini
  app.post("/api/ai/generate-soapie", requireAuth, async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    if (authReq.user?.subscriptionStatus !== "active") {
      return res.status(403).json({ error: "PremiumRequired", message: "Esta función requiere una suscripción activa." });
    }
    const { nandaName, nocName, nicName, activities } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    const mockSoapie = `S: Paciente refiere molestias y síntomas asociados a su estado actual.
O: Se observa constante vigilancia del estado general del paciente, signos vitales estables.
A: Diagnóstico clínico NANDA: "${nandaName || "Deterioro del estado general"}".
P: Planificado resultado NOC: "${nocName || "Estado general de salud"}".
I: Ejecutada intervención NIC: "${nicName || "Cuidados de enfermería general"}". Actividades ejecutadas: ${activities ? activities.join(", ") : "Valoración constante"}.
E: Se evalúa respuesta al plan. Paciente manifiesta estabilidad clínica.`;

    if (!isValidApiKey(apiKey)) {
      return res.json({ soapie: mockSoapie, isFallback: true });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const promptText = `Eres un experto certificado en redacción de notas de evolución de enfermería y taxonomía clínica NNN.
Redacta una Nota de Evolución completa y formal siguiendo la estructura clásica SOAPIE (Subjetivo, Objetivo, Análisis, Plan, Intervención, Evaluación) en base a los siguientes datos del plan de cuidados:
- Diagnóstico NANDA: "${nandaName}"
- Resultado NOC: "${nocName}"
- Intervención NIC: "${nicName}"
- Actividades NIC seleccionadas: ${activities ? JSON.stringify(activities) : "no especificadas"}

Formatea la salida claramente estructurada en secciones independientes con las iniciales S, O, A, P, I, E en español. Escribe un texto formal y técnicamente preciso.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText,
      });

      const responseText = response.text || "";
      res.json({ soapie: responseText.trim(), isFallback: false });
    } catch (err: any) {
      console.warn("[SOAPIE Generation Fallback] Fallback a nota predefinida por error en llamada de IA:", err.message || err);
      res.json({ soapie: mockSoapie, isFallback: true, errorMsg: err.message });
    }
  });

  // POST: Analyze medication risks and map them to NANDA/NOC/NIC
  app.post("/api/ai/analyze-medication", requireAuth, async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    if (authReq.user?.subscriptionStatus !== "active") {
      return res.status(403).json({ error: "PremiumRequired", message: "Esta función requiere una suscripción activa." });
    }
    const { medication } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!medication || typeof medication !== "string" || medication.trim() === "") {
      return res.status(400).json({ error: "El nombre del medicamento es requerido." });
    }

    const mockAnalysis = {
      medication,
      indications: "Indicaciones generales según vademécum clínico estándar.",
      nandaDiagnosis: "Riesgo de efectos adversos farmacológicos o alteración fisiológica.",
      nocOutcome: "Conocimiento: medicación o Control de riesgos.",
      nicIntervention: "Administración de medicación y Vigilancia del paciente.",
      activities: [
        "Verificar la regla de los '5 correctos' antes de la administración del fármaco.",
        "Monitorear la aparición de reacciones adversas y efectos secundarios comunes.",
        "Educar al paciente sobre la importancia de la adherencia terapéutica.",
        "Registrar de forma exacta la dosis, hora y vía en el registro clínico de enfermería."
      ]
    };

    if (!isValidApiKey(apiKey)) {
      return res.json({ analysis: mockAnalysis, isFallback: true });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const promptText = `Eres un experto certificado en farmacología y planes de cuidados de enfermería NANDA/NOC/NIC.
Analiza el siguiente medicamento: "${medication}".
Proporciona un objeto JSON que contenga:
1. "indications": Breve indicación principal de uso del fármaco (1 línea).
2. "nandaDiagnosis": El diagnóstico NANDA de riesgo principal asociado a este fármaco o a sus efectos secundarios más importantes (ej. "Riesgo de sangrado" para anticoagulantes).
3. "nocOutcome": El resultado NOC oficial más idóneo para monitorizar la efectividad o riesgos del tratamiento.
4. "nicIntervention": La intervención NIC primordial para la administración o vigilancia clínica del fármaco.
5. "activities": Una lista de 4 actividades específicas y prácticas de enfermería (NIC) al administrar y monitorear a un paciente bajo este fármaco.

Formato de salida esperado (responde ÚNICAMENTE con esta estructura JSON sin preámbulos ni marcas de formato markdown):
{
  "indications": "texto indicación",
  "nandaDiagnosis": "Diagnóstico NANDA",
  "nocOutcome": "Resultado NOC",
  "nicIntervention": "Intervención NIC",
  "activities": ["actividad 1", "actividad 2", "actividad 3", "actividad 4"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              indications: { type: Type.STRING },
              nandaDiagnosis: { type: Type.STRING },
              nocOutcome: { type: Type.STRING },
              nicIntervention: { type: Type.STRING },
              activities: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["indications", "nandaDiagnosis", "nocOutcome", "nicIntervention", "activities"]
          }
        }
      });

      const responseText = response.text || "";
      const parsed = JSON.parse(responseText.trim());
      res.json({ analysis: parsed, isFallback: false });
    } catch (err: any) {
      console.warn("[Medication Analysis Fallback] Fallback a análisis predefinido por error en llamada de IA:", err.message || err);
      res.json({ analysis: mockAnalysis, isFallback: true, errorMsg: err.message });
    }
  });

  // POST: Generate structured NANDA diagnosis using PES format and rules
  app.post("/api/ai/generate-pes", requireAuth, async (req, res) => {
    const authReq = req as AuthenticatedRequest;
    if (authReq.user?.subscriptionStatus !== "active") {
      return res.status(403).json({ error: "PremiumRequired", message: "Esta función requiere una suscripción activa." });
    }
    const { nandaLabel, diagnosisType, etiology, symptoms } = req.body;

    if (!nandaLabel || !diagnosisType) {
      return res.status(400).json({ error: "Nanda label and diagnosis type are required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Helper fallback
    const buildLocalFallback = () => {
      let formattedDiagnosis = "";
      if (diagnosisType === "real") {
        formattedDiagnosis = `${nandaLabel} Relacionado con (R/C) ${etiology || "[Etiología no provista]"} Manifestado por (M/P) ${symptoms || "[Signos/Síntomas no provistos]"}`;
      } else if (diagnosisType === "risk") {
        formattedDiagnosis = `${nandaLabel} Relacionado con (R/C) ${etiology || "[Factor de riesgo no provisto]"}`;
      } else {
        formattedDiagnosis = `${nandaLabel} Manifestado por (M/P) ${symptoms || "[Deseo o conductas de mejora no provistos]"}`;
      }

      return {
        formattedDiagnosis,
        problem: nandaLabel,
        etiology: etiology || "No provista",
        signsSymptoms: symptoms || "No provistos",
        pedagogicalAdvice: "Nota: Este diagnóstico se ha estructurado de forma local offline. Para obtener una corrección y terminología clínica pulida por IA con consejos de enfermero docente, asegúrate de activar y configurar la clave de Gemini AI."
      };
    };

    if (!isValidApiKey(apiKey)) {
      return res.json({ result: buildLocalFallback(), isFallback: true });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      const promptText = `Actúas como un enfermero docente experto en la taxonomía NANDA-I. Tu tarea es ayudarme a redactar y analizar diagnósticos de enfermería utilizando de forma estricta la estructura PES (Problema, Etiología, Signos/Síntomas).

Debes seguir de forma estricta las siguientes reglas de redacción:
1. Para Diagnósticos Reales (type: "real"): Une los componentes usando los conectores estándar exactos: "[Problema] Relacionado con (R/C) [Etiología] Manifestado por (M/P) [Signos y Síntomas]".
2. Para Diagnósticos de Riesgo (type: "risk"): Usa únicamente el problema y su factor de riesgo: "[Problema de riesgo] Relacionado con (R/C) [Factor de riesgo]". No incluyas "Manifestado por" ni menciones de signos o síntomas, ya que el problema aún no ocurre.
3. Para Diagnósticos de Promoción de la Salud (type: "promotion"): Usa únicamente el problema de bienestar y las conductas de mejora: "[Problema de bienestar] Manifestado por (M/P) [Deseo o conductas de mejora]". No incluyas "Relacionado con (R/C)".

Datos del paciente / diagnóstico provistos por el usuario:
- Tipo de diagnóstico solicitado: "${diagnosisType}"
- Problema / Etiqueta NANDA: "${nandaLabel}"
- Etiología / Factor de riesgo (si aplica): "${etiology || ""}"
- Signos y Síntomas / Manifestaciones / Conductas de mejora (si aplica): "${symptoms || ""}"

Tu tarea es:
1. Redactar el diagnóstico de enfermería final completo de forma impecable y profesional en español utilizando los conectores exactos (R/C) y (M/P) según corresponda. Si el usuario ingresó etiologías o síntomas redactados de forma informal o poco clínica (ej: "le duele el pecho" o "está triste"), tradúcelos a lenguaje enfermero profesional (ej: "dolor torácico", "llanto frecuente" o "verbalización de sentimientos de desesperanza").
2. Identificar el Problema (P), la Etiología/Factor de riesgo (E) y los Signos/Síntomas (S) de forma aislada.
3. Dar un consejo o justificación pedagógica de enfermero docente (2-3 líneas) explicando por qué se redacta así según la NANDA-I.

Devuelve la respuesta estrictamente en este formato JSON:
{
  "formattedDiagnosis": "...",
  "problem": "...",
  "etiology": "...",
  "signsSymptoms": "...",
  "pedagogicalAdvice": "..."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              formattedDiagnosis: { type: Type.STRING },
              problem: { type: Type.STRING },
              etiology: { type: Type.STRING },
              signsSymptoms: { type: Type.STRING },
              pedagogicalAdvice: { type: Type.STRING }
            },
            required: ["formattedDiagnosis", "problem", "etiology", "signsSymptoms", "pedagogicalAdvice"]
          }
        }
      });

      const responseText = response.text || "";
      const parsed = JSON.parse(responseText.trim());
      res.json({ result: parsed, isFallback: false });
    } catch (err: any) {
      console.warn("[PES AI Generation Error] Fallback a local:", err.message || err);
      res.json({ result: buildLocalFallback(), isFallback: true, errorMsg: err.message });
    }
  });

  // Vite development integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NurseServer] Running on port http://localhost:${PORT}`);
  });
}

startServer();
