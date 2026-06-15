import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { DIAGNOSES, NOC_OUTCOMES, NIC_INTERVENTIONS, findBestNoc, findBestNic } from "./src/data";

dotenv.config();

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

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());
  app.post("/api/search-taxonomy", async (req, res) => {
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

  app.post("/api/get-nanda-mapping", async (req, res) => {
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
  app.post("/api/analyze", async (req, res) => {
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
