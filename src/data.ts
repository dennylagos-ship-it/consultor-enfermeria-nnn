import { Assessment, Alert, Diagnosis, NocOutcome, NicIntervention, ServiceContext } from './types';

export const SERVICES: ServiceContext[] = [
  {
    id: 'urgencias',
    name: 'Emergencia',
    description: 'Cuidados críticos inmediatos y estabilización.',
    icon: 'EmergencyIcon',
    className: 'hover:border-error-container text-error-container',
  },
  {
    id: 'uci',
    name: 'UCI',
    description: 'Monitoreo continuo y soporte vital avanzado.',
    icon: 'UciIcon',
    className: 'hover:border-primary text-primary',
  },
  {
    id: 'quirofano',
    name: 'Quirófano',
    description: 'Gestión perioperatoria y seguridad quirúrgica.',
    icon: 'QuirofanoIcon',
    className: 'hover:border-secondary text-secondary',
  },
  {
    id: 'medicina_interna',
    name: 'Medicina Interna',
    description: 'Patologías complejas y cuidados crónicos.',
    icon: 'MedicinaIcon',
    className: 'hover:border-tertiary text-tertiary',
  },
  {
    id: 'pediatria',
    name: 'Pediatría',
    description: 'Atención especializada al paciente pediátrico.',
    icon: 'PediatriaIcon',
    className: 'hover:border-primary-container text-primary-container',
  },
  {
    id: 'partos',
    name: 'Partos',
    description: 'Control del trabajo de parto y nacimiento.',
    icon: 'PartosIcon',
    className: 'hover:border-tertiary-container text-tertiary-container',
  }
];

const rawDIAGNOSES: Diagnosis[] = [
  {
    "id": "nanda_00097",
    "code": "00097",
    "name": "Disminución de la participación en actividades recreativas",
    "definition": "Reducción de la estimulación, el interés o la participación en actividades recreativas o de ocio.ities.",
    "relatedFactors": [
      "El entorno actual no permite la participación en actividades",
      "Motivación inadecuada",
      "Insuffiresistencia física ciente",
      "Malestar físico",
      "Trastorno sicologico"
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 1. Concienciación sobre la salud"
  },
  {
    "id": "nanda_00262",
    "code": "00262",
    "name": "Preparación para mejorar la alfabetización en salud",
    "definition": "Un patrón de uso y desarrollo de un conjunto de habilidades y competencias (alfabetización, conocimiento, motivación, cultura y lenguaje) para encontrar, comprender, evaluar y usar información y conceptos de salud para tomar decisiones de salud diarias para promover y mantener la salud, disminuir los riesgos de salud y mejorar la calidad general de vida, que se puede fortalecer.",
    "relatedFactors": [
      "Expresa el deseo de mejorar la capacidad de leer, escribir, hablar e interpretar números para las necesidades de salud diarias.",
      "Expresa su deseo de mejorar la toma de decisiones de atención médica personal.",
      "Expresa el deseo de mejorar el apoyo social para la salud.",
      "Expresa el deseo de aumentar la conciencia sobre los procesos cívicos y / o gubernamentales que tienen un impacto en la salud pública.",
      "Expresa el deseo de mejorar la comprensión de las costumbres y creencias para tomar decisiones sobre el cuidado de la salud."
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 1. Concienciación sobre la salud"
  },
  {
    "id": "nanda_00168",
    "code": "00168",
    "name": "Estilo de vida sedentario",
    "definition": "Un modo de comportamiento adquirido que requiere un bajo gasto energético.",
    "relatedFactors": [
      "Conflicto entre creencias culturales y prácticas de salud",
      "Recursos inadecuados para la actividad física.",
      "Modelos a seguir inadecuados",
      "Apoyo social inadecuado",
      "Habilidades inadecuadas de gestión del tiempo."
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 1. Concienciación sobre la salud"
  },
  {
    "id": "nanda_00290",
    "code": "00290",
    "name": "Riesgo de intento de fuga",
    "definition": "Susceptible de abandonar un centro de atención médica o un área designada en contra de la recomendación o sin comunicarse con los profesionales de la salud o los cuidadores, lo que puede comprometer la seguridad y / o la salud.",
    "relatedFactors": [
      "Comportamientos de ira",
      "Responsabilidades familiares excesivas percibidas",
      "Insatisfacción con la situación actual",
      "Falta de seguridad percibida en el entorno circundante",
      "Vagabundeo persistente"
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 2. Gestión de la salud"
  },
  {
    "id": "nanda_00257",
    "code": "00257",
    "name": "Síndrome del anciano frágil",
    "definition": "Estado dinámico de equilibrio inestable que unffafecta al individuo mayor que experimenta deterioro en uno o más dominios de la salud (física, funcional, psicológica o social) y conduce a una mayor susceptibilidad a la salud adversa miffects, en particular la discapacidad.",
    "relatedFactors": [
      "Ansiedad",
      "Disfunción congnitiva",
      "Energía disminuida",
      "Disminución de la fuerza muscular",
      "Agotamiento"
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 2. Gestión de la salud"
  },
  {
    "id": "nanda_00231",
    "code": "00231",
    "name": "Riesgo de síndrome del anciano frágil",
    "definition": "Susceptible a un estado dinámico de equilibrio inestable que unffafecta al individuo mayor que experimenta deterioro en uno o más dominios de la salud (física, funcional, psicológica o social) y conduce a una mayor susceptibilidad a la salud adversa effects, en particular la discapacidad.",
    "relatedFactors": [
      "Ansiedad",
      "Disfunción congnitiva",
      "Energía disminuida",
      "Disminución de la fuerza muscular",
      "Agotamiento"
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 2. Gestión de la salud"
  },
  {
    "id": "nanda_00307",
    "code": "00307",
    "name": "Preparación para una mayor participación en el ejercicio",
    "definition": "Un patrón de atención a la actividad física caracterizado por movimientos corporales planificados, estructurados y repetitivos, que pueden fortalecerse.",
    "relatedFactors": [
      "Expresa el deseo de mejorar la autonomía para las actividades de la vida diaria.",
      "Expresa el deseo de mejorar las habilidades físicas.",
      "Expresa el deseo de mejorar la competencia para interactuar con entornos físicos y sociales.",
      "Expresa el deseo de mejorar la apariencia física.",
      "Expresa el deseo de mejorar el acondicionamiento físico."
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 2. Gestión de la salud"
  },
  {
    "id": "nanda_00215",
    "code": "00215",
    "name": "Salud comunitaria deficiente",
    "definition": "Presencia de uno o más problemas de salud o factores que impiden el bienestar o aumentan el riesgo de problemas de salud experimentados por un grupo o población.",
    "relatedFactors": [
      "Acceso inadecuado al proveedor de atención médica",
      "Plan de evaluación del programa inadecuado",
      "Satisfacción inadecuada del consumidor con los programas",
      "Datos de resultados del programa inadecuados",
      "Experiencia inadecuada dentro de la comunidad"
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 2. Gestión de la salud"
  },
  {
    "id": "nanda_00188",
    "code": "00188",
    "name": "Comportamiento de salud propenso a riesgos",
    "definition": "Capacidad disminuida para modificar el estilo de vida y / o acciones de una manera que mejore el nivel de bienestar.",
    "relatedFactors": [
      "Apoyo social inadecuado",
      "Percepción negativa de la estrategia sanitaria recomendada",
      "Comprensión inadecuada de la información sanitaria.",
      "Ansiedad social",
      "Yo bajo efficacy"
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 2. Gestión de la salud"
  },
  {
    "id": "nanda_00292",
    "code": "00292",
    "name": "Ineffcomportamientos efectivos de mantenimiento de la salud",
    "definition": "Gestión de conocimientos, actitudes y prácticas de salud que subyacen a las acciones de salud que no son satisfactorias para mantener o mejorar el bienestar, o pre ventilar enfermedades y lesiones.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Apoyo social inadecuado",
      "Demandas competitivas",
      "Confianza inadecuada en el profesional de la salud",
      "Preferencias de estilo de vida que compiten"
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 2. Gestión de la salud"
  },
  {
    "id": "nanda_00276",
    "code": "00276",
    "name": "Ineffautogestión de la salud efectiva",
    "definition": "Manejo insatisfactorio de los síntomas, régimen de tratamiento, físico, psíquico Consecuencias sociales y espirituales con y cambios de estilo de vida inherentes a la vida una enfermedad crónica.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Conocimiento inadecuado del régimen de tratamiento",
      "Demandas competitivas",
      "Número inadecuado de señales para la acción",
      "Preferencias de estilo de vida que compiten"
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 2. Gestión de la salud"
  },
  {
    "id": "nanda_00293",
    "code": "00293",
    "name": "Disponibilidad para mejorar la autogestión de la salud",
    "definition": "Un patrón de manejo satisfactorio de los síntomas, régimen de tratamiento, consecuencias físicas, psicosociales y espirituales y cambios en el estilo de vida inherentes a vivir con una enfermedad crónica, que puede fortalecerse.",
    "relatedFactors": [
      "Expresa el deseo de mejorar la aceptación de la condición.",
      "Expresa su deseo de mejorar la gestión de los factores de riesgo.",
      "Expresa el deseo de mejorar las opciones de la vida diaria para alcanzar los objetivos de salud.",
      "Expresa el deseo de mejorar la gestión de los signos.",
      "Expresa el deseo de mejorar el compromiso con la atención de seguimiento."
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 2. Gestión de la salud"
  },
  {
    "id": "nanda_00294",
    "code": "00294",
    "name": "Ineffautogestión efectiva de la salud familiar",
    "definition": "Manejo insatisfactorio de los síntomas, el régimen de tratamiento, las consecuencias físicas, psicosociales y espirituales y los cambios en el estilo de vida inherentes a vivir con uno o más miembros de la familia.' condicion cronica.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Compromiso inadecuado con un plan de acción",
      "Disfunción cognitiva de uno o más cuidadores.",
      "Alfabetización sanitaria inadecuada del cuidador",
      "Demandas competitivas en la unidad familiar"
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 2. Gestión de la salud"
  },
  {
    "id": "nanda_00300",
    "code": "00300",
    "name": "Ineffcomportamientos efectivos de mantenimiento del hogar",
    "definition": "Un patrón insatisfactorio de conocimientos y actividades para el mantenimiento seguro de uno's residencia.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Conocimiento inadecuado de los recursos sociales.",
      "Demandas competitivas",
      "Habilidades organizativas inadecuadas",
      "Sintomas depresivos"
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 2. Gestión de la salud"
  },
  {
    "id": "nanda_00308",
    "code": "00308",
    "name": "Riesgo de ineffcomportamientos efectivos de mantenimiento del hogar",
    "definition": "Susceptible a un patrón insatisfactorio de conocimientos y actividades para el mantenimiento seguro de uno's residencia, que puede comprometer la salud.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Conocimiento inadecuado de los recursos sociales.",
      "Demandas competitivas",
      "Habilidades organizativas inadecuadas",
      "Sintomas depresivos"
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 2. Gestión de la salud"
  },
  {
    "id": "nanda_00309",
    "code": "00309",
    "name": "Preparación para comportamientos mejorados de mantenimiento del hogar",
    "definition": "Un patrón de conocimientos y actividades que se puede fortalecer. para el cuidado seguro de uno's residencia,",
    "relatedFactors": [
      "Expresa el deseo de mejorar unffect hacia las tareas del hogar",
      "Expresa su deseo de mejorar las habilidades de gestión de la lavandería.",
      "Expresa el deseo de mejorar la actitud hacia el mantenimiento del hogar.",
      "Expresa su deseo de mejorar las habilidades organizativas.",
      "Expresa el deseo de mejorar la comodidad del medio ambiente."
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 2. Gestión de la salud"
  },
  {
    "id": "nanda_00043",
    "code": "00043",
    "name": "Ineffprotección efectiva",
    "definition": "Disminución de la capacidad de protegerse de amenazas internas o externas, como enfermedad o lesión.",
    "relatedFactors": [
      "Sintomas depresivos",
      "Ineffautogestión de la salud efectiva",
      "Difficultivo de manejo de régimen de tratamiento complejo",
      "Yo bajo efficacy",
      "Desesperación"
    ],
    "defaultNocCode": "Not specified in source",
    "defaultNicCode": "Not specified in source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 1. Promoción de la salud",
    "class": "Clase 2. Gestión de la salud"
  },
  {
    "id": "nanda_00002",
    "code": "00002",
    "name": "Nutrición desequilibrada: menos que los requisitos corporales",
    "definition": "Ingesta de nutrientes insufficient para conocer necesidades metabólicas.",
    "relatedFactors": [
      "Percepción del gusto alterada",
      "Síntomas depresivos",
      "Difficulto tragar",
      "Aversión a la comida",
      "Información inexacta"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 1. Ingestión"
  },
  {
    "id": "nanda_00163",
    "code": "00163",
    "name": "Preparación para una nutrición mejorada",
    "definition": "Un patrón de ingesta de nutrientes, que puede fortalecerse.",
    "relatedFactors": [],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 1. Ingestión"
  },
  {
    "id": "nanda_00216",
    "code": "00216",
    "name": "Insuffiproducción ciente de leche materna",
    "definition": "Suministro inadecuado de lactancia materna o infantil. Leche para apoyar el estado nutricional de un",
    "relatedFactors": [
      "Ineffagarre efectivo al pecho",
      "IneffReflejo de succión efectivo",
      "Lactante's negativa a amamantar",
      "Insuffivolumen de líquido materno ciente",
      "Insuffioportunidad ciente para succionar del pecho"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 1. Ingestión"
  },
  {
    "id": "nanda_00104",
    "code": "00104",
    "name": "Inefflactancia materna efectiva",
    "definition": "Difficultivo que proporciona leche del pecho, lo que puede comprometer la nutrición estado del bebé / niño.",
    "relatedFactors": [
      "Lactogénesis tardía en estadio II",
      "Apoyo familiar inadecuado",
      "Conocimiento inadecuado de los padres sobre la lactancia materna tecnicas",
      "Conocimiento inadecuado de los padres sobre la importancia de amamantamiento",
      "IneffRespuesta efectiva de succión y deglución del lactante."
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 1. Ingestión"
  },
  {
    "id": "nanda_00105",
    "code": "00105",
    "name": "Lactancia materna interrumpida",
    "definition": "Interrumpir la continuidad de la alimentación con leche de los senos, lo que puede comprometer el éxito de la lactancia materna y / o el estado nutricional del bebé / niño.",
    "relatedFactors": [
      "Destete abrupto del lactante",
      "Separación materno-infantil"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 1. Ingestión"
  },
  {
    "id": "nanda_00106",
    "code": "00106",
    "name": "Preparación para una mejor lactancia materna",
    "definition": "Un patrón de proporcionar leche de los senos a un bebé o niño, que puede ser fortificado.",
    "relatedFactors": [],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 1. Ingestión"
  },
  {
    "id": "nanda_00269",
    "code": "00269",
    "name": "IneffDinámica de alimentación efectiva de los adolescentes.",
    "definition": "Actitudes y comportamientos alterados que resultan en patrones de alimentación excesivos o insuficientes que comprometer la salud nutricional.",
    "relatedFactors": [
      "Relaciones familiares alteradas",
      "Ansiedad",
      "Cambios en la autoestima al entrar en la pubertad.",
      "Desorden alimenticio",
      "Comer aislado"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 1. Ingestión"
  },
  {
    "id": "nanda_00270",
    "code": "00270",
    "name": "Ineffdinámica de alimentación infantil efectiva",
    "definition": "Actitudes, comportamientos e influencias alterados en los patrones de alimentación que resultan en salud nutricional comprometida.",
    "relatedFactors": [
      "Patrones anormales de hábitos alimenticios",
      "Sobornar al niño para que coma",
      "Consumo de grandes volúmenes de alimentos en un corto período de tiempo.",
      "Comer aislado",
      "Control parental excesivo sobre el niño's experiencia de comer"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 1. Ingestión"
  },
  {
    "id": "nanda_00271",
    "code": "00271",
    "name": "Ineffdinámica de alimentación infantil efectiva",
    "definition": "Comportamientos de alimentación de los padres alterados que resultan en patrones de alimentación excesivos o insuficientes.",
    "relatedFactors": [
      "Relaciones interpersonales abusivas",
      "Problemas de apego",
      "Paternidad desvinculada",
      "Crianza intrusiva",
      "Falta de confianza en el niño para desarrollar hábitos alimenticios saludables."
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 1. Ingestión"
  },
  {
    "id": "nanda_00232",
    "code": "00232",
    "name": "Obesidad",
    "definition": "Afección en la que un individuo acumula grasa excesiva para la edad y el género. der que excede el sobrepeso.",
    "relatedFactors": [
      "Patrones anormales de conducta alimentaria",
      "Patrones anormales de percepción de la alimentación",
      "La actividad física diaria promedio es menor que la recomendada para la edad y el sexo",
      "Consumo de bebidas azucaradas",
      "Disomnias"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 1. Ingestión"
  },
  {
    "id": "nanda_00233",
    "code": "00233",
    "name": "Exceso de peso",
    "definition": "Afección en la que un individuo acumula grasa excesiva para la edad y género.",
    "relatedFactors": [
      "Patrones anormales de conducta alimentaria",
      "Patrones anormales de percepción de la alimentación",
      "La actividad física diaria promedio es menor que la recomendada para la edad y el sexo",
      "Consumo de bebidas azucaradas",
      "Disomnias"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 1. Ingestión"
  },
  {
    "id": "nanda_00234",
    "code": "00234",
    "name": "Riesgo de sobrepeso",
    "definition": "Susceptible a una acumulación excesiva de grasa para la edad y el sexo, que puede prometen salud.",
    "relatedFactors": [
      "Patrones anormales de conducta alimentaria",
      "Patrones anormales de percepción de la alimentación",
      "La actividad física diaria promedio es menor que la recomendada para la edad y el sexo",
      "Consumo de bebidas azucaradas",
      "Disomnias"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 1. Ingestión"
  },
  {
    "id": "nanda_00295",
    "code": "00295",
    "name": "IneffRespuesta eficaz de succión y deglución del lactante.",
    "definition": "Deterioro de la capacidad de un bebé para succionar o para coordinar la respuesta de chupar-tragar ponse.",
    "relatedFactors": [
      "Hipoglucemia",
      "Hipotermia",
      "Hipotonía",
      "Posicionamiento inadecuado",
      "Comportamiento de succión insatisfactorio"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 1. Ingestión"
  },
  {
    "id": "nanda_00103",
    "code": "00103",
    "name": "Tragar deficiente",
    "definition": "Funcionamiento anormal del mecanismo de deglución asociado con déficits en estructura oral, faríngea o esofágica o función.",
    "relatedFactors": [
      "Atención alterada",
      "Problema de alimentación conductual"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 1. Ingestión"
  },
  {
    "id": "nanda_00179",
    "code": "00179",
    "name": "Riesgo de glucemia inestable",
    "definition": "Susceptible a variaciones en los niveles séricos de glucosa desde el rango normal, que puede comprometer la salud.",
    "relatedFactors": [
      "Estrés excesivo",
      "Aumento de peso excesivo",
      "Pérdida excesiva de peso.",
      "Cumplimiento inadecuado del régimen de tratamiento",
      "Autocontrol inadecuado de la glucosa en sangre"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 4. Metabolismo"
  },
  {
    "id": "nanda_00194",
    "code": "00194",
    "name": "Hiperbilirrubinemia neonatal",
    "definition": "La acumulación de bilirrubina no conjugada en la circulación (menos de 15 ml / dl) que se produce después de las 24 horas de vida.",
    "relatedFactors": [
      "Retraso en el paso del meconio",
      "Conducta de alimentación paterna inadecuada",
      "Bebés desnutridos"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 4. Metabolismo"
  },
  {
    "id": "nanda_00230",
    "code": "00230",
    "name": "Riesgo de hiperbilirrubinemia neonatal",
    "definition": "Susceptible a la acumulación de bilirrubina no conjugada (menos de en la circulacion 15ml / dl) que ocurre después de 24 horas de vida que puede comprometer salud.",
    "relatedFactors": [
      "Retraso en el paso del meconio",
      "Conducta de alimentación paterna inadecuada",
      "Bebés desnutridos"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 4. Metabolismo"
  },
  {
    "id": "nanda_00178",
    "code": "00178",
    "name": "Riesgo de deterioro de la función hepática",
    "definition": "Susceptible a una disminución de la función hepática, que puede comprometer la salud.",
    "relatedFactors": [
      "Mal uso de sustancia"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 4. Metabolismo"
  },
  {
    "id": "nanda_00296",
    "code": "00296",
    "name": "Riesgo de síndrome metabólico",
    "definition": "Susceptible a desarrollar una serie de síntomas que aumentan el riesgo de enfermedad cardiovascular y diabetes mellitus tipo 2, que pueden comprometer la salud.",
    "relatedFactors": [
      "Ausencia de interés en mejorar los comportamientos de salud.",
      "La actividad física diaria promedio es menor que la recomendada para la edad y el sexo",
      "Índice de masa corporal por encima del rango normal para la edad y el sexo",
      "Acumulación excesiva de grasa para la edad y el sexo.",
      "Ingesta excesiva de alcohol"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 4. Metabolismo"
  },
  {
    "id": "nanda_00195",
    "code": "00195",
    "name": "Riesgo de desequilibrio de electrolitos",
    "definition": "Susceptible a cambios en los niveles de electrolitos séricos, que pueden comprometer salud.",
    "relatedFactors": [
      "Diarrea",
      "Volumen de líquido excesivo",
      "Conocimiento inadecuado de los factores modificables.",
      "Insuffivolumen de líquido ciente",
      "Vómitos"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 5. Hidratación"
  },
  {
    "id": "nanda_00025",
    "code": "00025",
    "name": "Riesgo de volumen de líquido desequilibrado",
    "definition": "Susceptible a una disminución, aumento o cambio rápido de uno a otro de líquido intravascular, intersticial y / o intracelular, lo que puede comprometer salud.",
    "relatedFactors": [
      "Ingesta alterada de líquidos",
      "DiffiCultivo acceso al agua",
      "Ingesta excesiva de sodio",
      "Conocimiento inadecuado sobre las necesidades de fluidos.",
      "Ineffautogestión eficaz de la medicación"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 5. Hidratación"
  },
  {
    "id": "nanda_00027",
    "code": "00027",
    "name": "Volumen de líquido deficiente",
    "definition": "Disminución del líquido intravascular, intersticial y / o intracelular. Esto se refiere a la deshidratación, pérdida de agua sola sin cambios en el sodio.",
    "relatedFactors": [
      "DiffiCultivo que satisface el aumento de volumen de líquido requerido.",
      "Acceso inadecuado al líquido",
      "Conocimiento inadecuado sobre las necesidades de fluidos.",
      "Ineffautogestión eficaz de la medicación",
      "Insuffiingesta ciente de líquidos"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 5. Hidratación"
  },
  {
    "id": "nanda_00028",
    "code": "00028",
    "name": "Riesgo de volumen de líquido deficiente",
    "definition": "Susceptible de experimentar una disminución de los volúmenes de líquido intravascular, intersticial y / o intracelular, lo que puede comprometer la salud.",
    "relatedFactors": [
      "DiffiCultivo que satisface el aumento de volumen de líquido requerido.",
      "Acceso inadecuado al líquido",
      "Conocimiento inadecuado sobre las necesidades de fluidos.",
      "Ineffautogestión eficaz de la medicación",
      "Insuffiingesta ciente de líquidos"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 5. Hidratación"
  },
  {
    "id": "nanda_00026",
    "code": "00026",
    "name": "Volumen de líquido excesivo",
    "definition": "Retención excedente de líquido.",
    "relatedFactors": [
      "Ingesta excesiva de líquidos",
      "Ingesta excesiva de sodio",
      "Ineffautogestión eficaz de la medicación"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 2. Nutrición",
    "class": "Clase 5. Hidratación"
  },
  {
    "id": "nanda_00297",
    "code": "00297",
    "name": "Incontinencia urinaria asociada a discapacidad",
    "definition": "Pérdida involuntaria de orina no asociada con ninguna patología o problema relacionado al sistema urinario.",
    "relatedFactors": [
      "Comportamientos adaptativos para evitar otros' reconocimiento de la incontinencia urinaria",
      "El tiempo necesario para llegar al baño es demasiado largo después de la sensación de necesidad.",
      "Uso de técnicas para prevenir la micción.",
      "Mapeo de rutas a baños públicos antes de salir de casa",
      "Orinar antes de llegar al baño"
    ],
    "defaultNocCode": "Not Provided in Source",
    "defaultNicCode": "Not Provided in Source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 1. Función urinaria"
  },
  {
    "id": "nanda_00016",
    "code": "00016",
    "name": "Eliminación urinaria alterada",
    "definition": "Disfunción en la eliminación de orina.",
    "relatedFactors": [
      "Consumo de alcohol",
      "Factor ambiental alterado Caffeine consumo",
      "Limitaciones ambientales",
      "Impacto fecal",
      "Postura inadecuada para ir al baño"
    ],
    "defaultNocCode": "0503",
    "defaultNicCode": "0590",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 1. Función urinaria"
  },
  {
    "id": "nanda_00310",
    "code": "00310",
    "name": "Incontinencia urinaria mixta",
    "definition": "Pérdida involuntaria de orina en combinación con o después de una fuerte sensación o urgencia por orinar, y también con actividades que aumentan la actividad intraabdominal. presión.",
    "relatedFactors": [
      "Incompetencia del cuello de la vejiga",
      "Incompetencia del esfínter uretral",
      "Exceso de peso",
      "Prolapso de órganos pélvicos",
      "Atrofia muscular esquelética"
    ],
    "defaultNocCode": "Not Provided in Source",
    "defaultNicCode": "Not Provided in Source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 1. Función urinaria"
  },
  {
    "id": "nanda_00017",
    "code": "00017",
    "name": "Incontinencia urinaria de esfuerzo",
    "definition": "Pérdida involuntaria de orina con actividades que aumentan la presión intraabdominal, que no se asocia con la urgencia de orinar.",
    "relatedFactors": [
      "Exceso de peso",
      "Trastornos del suelo pélvico",
      "Prolapso de órganos pélvicos"
    ],
    "defaultNocCode": "Not Provided in Source",
    "defaultNicCode": "Not Provided in Source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 1. Función urinaria"
  },
  {
    "id": "nanda_00019",
    "code": "00019",
    "name": "Incontinencia urinaria de urgencia",
    "definition": "Pérdida involuntaria de orina en combinación con o después de una sensación fuerte. o urgencia de anular.",
    "relatedFactors": [
      "Consumo de alcohol",
      "Ansiedad",
      "Caffeine consumo",
      "Bebida carbonatada consumo",
      "Impactación fecal"
    ],
    "defaultNocCode": "Not Provided in Source",
    "defaultNicCode": "Not Provided in Source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 1. Función urinaria"
  },
  {
    "id": "nanda_00022",
    "code": "00022",
    "name": "Riesgo de incontinencia urinaria de urgencia",
    "definition": "Susceptible al paso involuntario de orina que ocurre poco después de una fuerte sensación o urgencia por orinar, lo que puede comprometer la salud.",
    "relatedFactors": [
      "Consumo de alcohol",
      "Ansiedad",
      "Caffeine consumo",
      "Bebida carbonatada consumo",
      "Impactación fecal"
    ],
    "defaultNocCode": "Not Provided in Source",
    "defaultNicCode": "Not Provided in Source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 1. Función urinaria"
  },
  {
    "id": "nanda_00023",
    "code": "00023",
    "name": "Retención urinaria",
    "definition": "Vaciado incompleto de la vejiga.",
    "relatedFactors": [
      "Limitaciones ambientales",
      "Impactación fecal",
      "Postura inadecuada para ir al baño",
      "Relajación inadecuada de los músculos del suelo pélvico.",
      "Insuffiprivacidad cient"
    ],
    "defaultNocCode": "Not Provided in Source",
    "defaultNicCode": "Not Provided in Source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 1. Función urinaria"
  },
  {
    "id": "nanda_00322",
    "code": "00322",
    "name": "Riesgo de retención urinaria",
    "definition": "Susceptible al vaciamiento incompleto de la vejiga.",
    "relatedFactors": [
      "Limitaciones ambientales",
      "Impactación fecal",
      "Postura inadecuada para ir al baño",
      "Relajación inadecuada de los músculos del suelo pélvico.",
      "Insuffiprivacidad cient"
    ],
    "defaultNocCode": "Not Provided in Source",
    "defaultNicCode": "Not Provided in Source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 1. Función urinaria"
  },
  {
    "id": "nanda_00011",
    "code": "00011",
    "name": "Estreñimiento",
    "definition": "Poco frecuentes o difficulto de evacuación de heces.",
    "relatedFactors": [
      "Rutina regular alterada",
      "La actividad física diaria promedio es menor que la recomendada para la edad y el sexo",
      "Disfunción congnitiva",
      "Barreras de comunicación",
      "Suprime habitualmente la necesidad de defecar"
    ],
    "defaultNocCode": "Not Provided in Source",
    "defaultNicCode": "Not Provided in Source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 2. Función gastrointestinal"
  },
  {
    "id": "nanda_00015",
    "code": "00015",
    "name": "Riesgo de estreñimiento",
    "definition": "Susceptible a infrecuente o difficulto de evacuación de heces, que puede comprometer mise salud.",
    "relatedFactors": [
      "Rutina regular alterada",
      "La actividad física diaria promedio es menor que la recomendada para la edad y el sexo",
      "Disfunción congnitiva",
      "Barreras de comunicación",
      "Suprime habitualmente la necesidad de defecar"
    ],
    "defaultNocCode": "Not Provided in Source",
    "defaultNicCode": "Not Provided in Source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 2. Función gastrointestinal"
  },
  {
    "id": "nanda_00012",
    "code": "00012",
    "name": "Estreñimiento percibido",
    "definition": "Autodiagnóstico de infrecuentes o difficulto de evacuación de heces combinado con el abuso de métodos para asegurar una evacuación intestinal diaria.",
    "relatedFactors": [
      "Mal uso del enema",
      "Espera evacuar el intestino a la misma hora todos los días",
      "Mal uso de laxantes",
      "Mal uso de supositorios",
      "Creencias de salud cultural"
    ],
    "defaultNocCode": "Not Provided in Source",
    "defaultNicCode": "Not Provided in Source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 2. Función gastrointestinal"
  },
  {
    "id": "nanda_00235",
    "code": "00235",
    "name": "Estreñimiento funcional crónico",
    "definition": "Poco frecuentes o difficulto de evacuación de heces, que ha estado presente durante al menos 3 de los 12 meses anteriores.",
    "relatedFactors": [
      "Disminución de la ingesta de alimentos.",
      "Deshidración",
      "Dieta desproporcionadamente alta en grasas",
      "Dieta desproporcionadamente alta en proteínas",
      "Síndrome del anciano frágil"
    ],
    "defaultNocCode": "Not Provided in Source",
    "defaultNicCode": "Not Provided in Source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 2. Función gastrointestinal"
  },
  {
    "id": "nanda_00236",
    "code": "00236",
    "name": "Riesgo de estreñimiento funcional crónico",
    "definition": "Susceptible a infrecuente o difficulto de evacuación de heces, que ha estado presente casi 3 de los 12 meses anteriores, lo que puede comprometer la salud.",
    "relatedFactors": [
      "Disminución de la ingesta de alimentos.",
      "Deshidración",
      "Dieta desproporcionadamente alta en grasas",
      "Dieta desproporcionadamente alta en proteínas",
      "Síndrome del anciano frágil"
    ],
    "defaultNocCode": "Not Provided in Source",
    "defaultNicCode": "Not Provided in Source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 2. Función gastrointestinal"
  },
  {
    "id": "nanda_00319",
    "code": "00319",
    "name": "Continencia intestinal alterada",
    "definition": "Incapacidad para retener las heces, sentir la presencia de heces en el recto, para relajarse y guarde las heces cuando no sea conveniente defecar.",
    "relatedFactors": [
      "Evitación del uso de inodoros no higiénicos",
      "Estreñimiento",
      "Dependencia para ir al baño",
      "Diarrea",
      "Difficulto encontrando el baño"
    ],
    "defaultNocCode": "Not Provided in Source",
    "defaultNicCode": "Not Provided in Source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 2. Función gastrointestinal"
  },
  {
    "id": "nanda_00013",
    "code": "00013",
    "name": "Diarrea",
    "definition": "Paso de tres o más deposiciones blandas o líquidas por día.",
    "relatedFactors": [
      "Ansiedad",
      "Alimentación temprana con fórmula",
      "Acceso inadecuado al agua potable",
      "Acceso inadecuado a alimentos seguros",
      "Conocimiento inadecuado sobre la vacuna contra el rotavirus."
    ],
    "defaultNocCode": "Not Provided in Source",
    "defaultNicCode": "Not Provided in Source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 2. Función gastrointestinal"
  },
  {
    "id": "nanda_00196",
    "code": "00196",
    "name": "Motilidad gastrointestinal disfuncional",
    "definition": "Aumento, disminución, ineffefectiva, o falta de actividad peristáltica dentro del gastro tracto intestinal.",
    "relatedFactors": [
      "Fuente de agua alterada",
      "Ansiedad",
      "Cambio de hábitos alimenticios",
      "Movilidad física deteriorada",
      "Desnutrición"
    ],
    "defaultNocCode": "Not Provided in Source",
    "defaultNicCode": "Not Provided in Source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 2. Función gastrointestinal"
  },
  {
    "id": "nanda_00197",
    "code": "00197",
    "name": "Riesgo de motilidad gastrointestinal disfuncional",
    "definition": "Susceptible a aumento, disminución, ineffefectiva o falta de actividad peristáltica dentro del tracto gastrointestinal, que mayocomprometer la salud.",
    "relatedFactors": [
      "Fuente de agua alterada",
      "Ansiedad",
      "Cambio de hábitos alimenticios",
      "Movilidad física deteriorada",
      "Desnutrición"
    ],
    "defaultNocCode": "Not Provided in Source",
    "defaultNicCode": "Not Provided in Source",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 2. Función gastrointestinal"
  },
  {
    "id": "nanda_00030",
    "code": "00030",
    "name": "Intercambio de gases deteriorado",
    "definition": "Exceso o déficit de oxigenación y / o eliminación de dióxido de carbono.",
    "relatedFactors": [
      "Inefflimpieza efectiva de las vías respiratorias",
      "Ineffpatrón de respiración efectiva",
      "Dolor"
    ],
    "defaultNocCode": "0402",
    "defaultNicCode": "3350",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 3. Eliminación e intercambio",
    "class": "Clase 4. Función respiratoria"
  },
  {
    "id": "nanda_00095",
    "code": "00095",
    "name": "Insomnio",
    "definition": "Incapacidad para iniciar o mantener el sueño, lo que afecta el funcionamiento.",
    "relatedFactors": [
      "Ansiedad",
      "Californiaffeine consumo",
      "Rol del cuidador Tensión",
      "Consumo de bebidas azucaradas",
      "Sintomas depresivos"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 1. Sueño / descanso"
  },
  {
    "id": "nanda_00096",
    "code": "00096",
    "name": "La privación del sueño",
    "definition": "Períodos prolongados de tiempo sin suspensión periódica natural sostenida de conciencia relativa que proporciona descanso.",
    "relatedFactors": [
      "Cambios en la etapa del sueño relacionados con la edad",
      "La actividad física diaria promedio es menor que la recomendada para la edad y el sexo",
      "Incomodidad",
      "Perturbaciones ambientales",
      "Sobreestimulación ambiental"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 1. Sueño / descanso"
  },
  {
    "id": "nanda_00165",
    "code": "00165",
    "name": "Preparación para dormir mejor",
    "definition": "Un patrón de suspensión periódica y natural de la conciencia relativa para proporcionar descanso y mantener un estilo de vida deseado, que puede fortalecerse.",
    "relatedFactors": [],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 1. Sueño / descanso"
  },
  {
    "id": "nanda_00198",
    "code": "00198",
    "name": "Patrón de sueño perturbado",
    "definition": "Despertares limitados en el tiempo debido a factores externos.",
    "relatedFactors": [
      "Interrupción causada por la pareja para dormir",
      "Perturbaciones ambientales",
      "Insuffiprivacidad cient"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 1. Sueño / descanso"
  },
  {
    "id": "nanda_00298",
    "code": "00298",
    "name": "Disminución de la tolerancia a la actividad.",
    "definition": "Insuffiresistencia ciente para completar las actividades diarias requeridas o deseadas.",
    "relatedFactors": [
      "Disminución de la fuerza muscular",
      "Síntomas depresivos",
      "Miedo al dolor",
      "Desequilibrio entre oferta / demanda de oxígeno",
      "Movilidad física deteriorada"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 2. Actividad / ejercicio"
  },
  {
    "id": "nanda_00299",
    "code": "00299",
    "name": "Riesgo de tolerancia disminuida a la actividad",
    "definition": "Susceptible de experimentar insuficienciaffiresistencia ciente para completar los requisitos o actividades diarias deseadas.",
    "relatedFactors": [
      "Disminución de la fuerza muscular",
      "Síntomas depresivos",
      "Miedo al dolor",
      "Desequilibrio entre suministro / demanda de oxígeno",
      "Movilidad física deteriorada"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 2. Actividad / ejercicio"
  },
  {
    "id": "nanda_00040",
    "code": "00040",
    "name": "Riesgo de síndrome de desuso",
    "definition": "Susceptible al deterioro de los sistemas corporales como resultado de una inactividad musculoesquelética prescrita o inevitable, que puede comprometer la salud.",
    "relatedFactors": [
      "Dolor"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 2. Actividad / ejercicio"
  },
  {
    "id": "nanda_00091",
    "code": "00091",
    "name": "Movilidad de la cama alterada",
    "definition": "Limitación en el movimiento independiente de una posición de cama a otra.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Flexibilidad disminuida",
      "Restricciones ambientales",
      "Deterioro del equilibrio postural",
      "Ángulo inadecuado de la cabecera"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 2. Actividad / ejercicio"
  },
  {
    "id": "nanda_00085",
    "code": "00085",
    "name": "Movilidad física deteriorada",
    "definition": "Limitación en el movimiento independiente y decidido del cuerpo o de uno o más extremidades.",
    "relatedFactors": [
      "Ansiedad",
      "Disfunción congnitiva",
      "Creencia cultural con respecto a la actividad aceptable",
      "Disminución de la tolerancia a la actividad",
      "Disminución del control muscular"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 2. Actividad / ejercicio"
  },
  {
    "id": "nanda_00089",
    "code": "00089",
    "name": "Movilidad en silla de ruedas deteriorada",
    "definition": "Limitación en el funcionamiento independiente de la silla de ruedas dentro del entorno.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Limitaciones ambientales",
      "Ajuste inadecuado al tamaño de la silla de ruedas",
      "Conocimientos inadecuados sobre el uso de sillas de ruedas",
      "Insuffifuerza muscular ciente"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 2. Actividad / ejercicio"
  },
  {
    "id": "nanda_00237",
    "code": "00237",
    "name": "Sentado impedido",
    "definition": "Limitación de la capacidad para lograr y / o mantener de manera independiente y deliberada una posición de descanso que se apoya en la nalgas y muslos, en los que el torso posición vertical.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Insuffienergía ciente Insuffifuerza muscular ciente",
      "Desnutrición"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 2. Actividad / ejercicio"
  },
  {
    "id": "nanda_00238",
    "code": "00238",
    "name": "De pie impedido",
    "definition": "Limitación de la capacidad para lograr y / o mantener de manera independiente y deliberada el cuerpo en una posición erguida de pies a cabeza.",
    "relatedFactors": [
      "Perturbación emocional excesiva",
      "Insuffienergía ciente Insuffifuerza muscular ciente Insuffiresistencia física cient",
      "Desnutrición",
      "Obesidad"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 2. Actividad / ejercicio"
  },
  {
    "id": "nanda_00090",
    "code": "00090",
    "name": "Capacidad de transferencia deteriorada",
    "definition": "Limitación del movimiento independiente entre dos superficies cercanas.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Limitaciones ambientales",
      "Deterioro del equilibrio postural",
      "Conocimiento inadecuado de las técnicas de transferencia",
      "Insuffifuerza muscular ciente"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 2. Actividad / ejercicio"
  },
  {
    "id": "nanda_00088",
    "code": "00088",
    "name": "Caminar impedido",
    "definition": "Limitación del movimiento independiente dentro del entorno a pie.",
    "relatedFactors": [
      "Estado de ánimo alterado",
      "Disfunción congnitiva",
      "Limitaciones ambientales",
      "Miedo a caer",
      "Conocimiento inadecuado de las estrategias de movilidad."
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 2. Actividad / ejercicio"
  },
  {
    "id": "nanda_00273",
    "code": "00273",
    "name": "Campo de energía desequilibrado",
    "definition": "Una interrupción en el flujo vital de la energía humana que normalmente es un continuo todo y es único, dinámico, creativo y no lineal.",
    "relatedFactors": [
      "Ansiedad",
      "Incomodidad",
      "Estrés excesivo",
      "Intervenciones que interrumpen el patrón o flujo energético",
      "Dolor"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 3. Balance energético"
  },
  {
    "id": "nanda_00093",
    "code": "00093",
    "name": "Fatiga",
    "definition": "Una abrumadora sensación sostenida de agotamiento y disminución de la capacidad para trabajo físico y mental al nivel habitual.",
    "relatedFactors": [
      "Ciclo alterado de sueño-vigilia",
      "Ansiedad",
      "Sintomas depresivos",
      "Limitaciones ambientales",
      "Mayor esfuerzo mental"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 3. Balance energético"
  },
  {
    "id": "nanda_00154",
    "code": "00154",
    "name": "Errante",
    "definition": "Locomoción serpenteante, sin rumbo o repetitiva que expone al individuo a daños; frecuentemente incongruente con fronteras, límites u obstáculos.",
    "relatedFactors": [
      "Ciclo de sueño-vigilia alterado",
      "Disfunción cognitiva",
      "Deseo de volver a casa",
      "Sobreestimulación ambiental",
      "Manifestaciones neuroconductuales"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 3. Balance energético"
  },
  {
    "id": "nanda_00032",
    "code": "00032",
    "name": "Patrón respiratorio ineficaz",
    "definition": "Inspiración y / o caducidad que no no proporcionar una ventilación adecuada.",
    "relatedFactors": [
      "Ansiedad",
      "Posición del cuerpo que inhibe la expansión pulmonar",
      "Fatiga",
      "Aumento del esfuerzo físico",
      "Obesidad"
    ],
    "defaultNocCode": "0403",
    "defaultNicCode": "3350",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 4. Respuestas cardiovasculares / pulmonares"
  },
  {
    "id": "nanda_00029",
    "code": "00029",
    "name": "Disminución del gasto cardíaco.",
    "definition": "Volumen inadecuado de sangre bombeada por el corazón para encontrarse con el metabólico demandas del cuerpo.",
    "relatedFactors": [
      "Para ser desarrollado"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 4. Respuestas cardiovasculares / pulmonares"
  },
  {
    "id": "nanda_00240",
    "code": "00240",
    "name": "Riesgo de disminución del gasto cardíaco",
    "definition": "Susceptible a un volumen inadecuado de sangre bombeada por el corazón para satisfacer las demandas metabólicas del cuerpo, lo que puede comprometer la salud.",
    "relatedFactors": [
      "Para ser desarrollado"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 4. Respuestas cardiovasculares / pulmonares"
  },
  {
    "id": "nanda_00311",
    "code": "00311",
    "name": "Riesgo de deterioro de la función cardiovascular",
    "definition": "Susceptible a alteraciones en el transporte de sustancias, homeostasis corporal, eliminación de residuos metabólicos tisulares y función orgánica, que pueden comprometer salud.",
    "relatedFactors": [
      "Ansiedad",
      "La actividad física diaria promedio es menor que la recomendada para la edad y el sexo",
      "Índice de masa corporal por encima del rango normal para la edad y el sexo",
      "Acumulación excesiva de grasa para la edad y el sexo",
      "Ingesta excesiva de alcohol"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 4. Respuestas cardiovasculares / pulmonares"
  },
  {
    "id": "nanda_00278",
    "code": "00278",
    "name": "Ineffautocontrol efectivo del linfedema",
    "definition": "Manejo insatisfactorio de síntomas, régimen de tratamiento, consecuencias físicas, psicosociales y espirituales y cambios en el estilo de vida inherentes a vivir con edema relacionado con obstrucción o trastornos de los vasos o ganglios linfáticos.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Demandas competitivas",
      "Preferencias de estilo de vida que compiten",
      "Conflicto entre comportamientos de salud y normas sociales",
      "Disminución de la calidad de vida percibida"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 4. Respuestas cardiovasculares / pulmonares"
  },
  {
    "id": "nanda_00281",
    "code": "00281",
    "name": "Riesgo de ineffautocontrol efectivo del linfedema",
    "definition": "Susceptible a un manejo insatisfactorio de los síntomas, el régimen de tratamiento, las consecuencias físicas, psicosociales y espirituales y los cambios en el estilo de vida inherentes a vivir con edema relacionado con la obstrucción o trastornos de los vasos linfáticos. o nodos, que pueden comprometer la salud.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Demandas competitivas",
      "Preferencias de estilo de vida que compiten",
      "Modelos a seguir inadecuados",
      "Apoyo social inadecuado"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 4. Respuestas cardiovasculares / pulmonares"
  },
  {
    "id": "nanda_00033",
    "code": "00033",
    "name": "Ventilación espontánea deteriorada",
    "definition": "Incapacidad para iniciar y / o mantener una respiración independiente que sea adecuada para Soporte de vida.",
    "relatedFactors": [
      "Fatiga de los músculos respiratorios",
      "Metabolismo alterado"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 4. Respuestas cardiovasculares / pulmonares"
  },
  {
    "id": "nanda_00267",
    "code": "00267",
    "name": "Riesgo de presión arterial inestable",
    "definition": "Susceptible a las fuerzas fluctuantes de la sangre que fluye a través de los vasos arteriales, que puede comprometer la salud.",
    "relatedFactors": [
      "Inconsistencia con el régimen de medicación",
      "Ortostasis",
      "E adversoffect de preparaciones farmacéuticas",
      "E adversoffefectos de la cocaína Arritmia cardíaca",
      "Síndrome de Cushing"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 4. Respuestas cardiovasculares / pulmonares"
  },
  {
    "id": "nanda_00291",
    "code": "00291",
    "name": "Riesgo de trombosis",
    "definition": "Susceptible a la obstrucción de un vaso sanguíneo por un trombo que puede romperse off y alojarse en otra embarcación, lo que puede comprometer la salud.",
    "relatedFactors": [
      "Dieta aterogénica",
      "Deshidración",
      "Estrés excesivo",
      "Movilidad física deteriorada",
      "Conocimiento inadecuado de los factores modificables."
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 4. Respuestas cardiovasculares / pulmonares"
  },
  {
    "id": "nanda_00200",
    "code": "00200",
    "name": "Riesgo de disminución de la perfusión del tejido cardíaco",
    "definition": "Susceptible a una disminución de la circulación cardíaca (coronaria), que puede comprometer mise salud.",
    "relatedFactors": [
      "Conocimiento inadecuado de los factores modificables.",
      "Mal uso de sustancia"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 4. Respuestas cardiovasculares / pulmonares"
  },
  {
    "id": "nanda_00201",
    "code": "00201",
    "name": "Riesgo de ineffperfusión de tejido cerebral eficaz",
    "definition": "Susceptible a una disminución de la circulación del tejido cerebral, que puede comprometer salud.",
    "relatedFactors": [
      "Mal uso de sustancia",
      "Tiempo de tromboplastina parcial sérico anormal",
      "Tiempo de protrombina sérica anormal",
      "Segmento de pared del ventrículo izquierdo acinético",
      "Disección arterial"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 4. Respuestas cardiovasculares / pulmonares"
  },
  {
    "id": "nanda_00204",
    "code": "00204",
    "name": "Ineffperfusión tisular periférica eficaz",
    "definition": "Disminución de la circulación sanguínea hacia la periferia, que puede comprometer la salud.",
    "relatedFactors": [
      "Ingesta excesiva de sodio",
      "Conocimiento inadecuado del proceso de la enfermedad.",
      "Estilo de vida sedentario",
      "De fumar"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 4. Respuestas cardiovasculares / pulmonares"
  },
  {
    "id": "nanda_00228",
    "code": "00228",
    "name": "Riesgo de ineffperfusión tisular periférica eficaz",
    "definition": "Susceptible a una disminución de la circulación sanguínea hacia la periferia, que puede comprometer la salud.",
    "relatedFactors": [
      "Ingesta excesiva de sodio",
      "Conocimiento inadecuado del proceso de la enfermedad.",
      "Estilo de vida sedentario",
      "De fumar"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 4. Respuestas cardiovasculares / pulmonares"
  },
  {
    "id": "nanda_00034",
    "code": "00034",
    "name": "Respuesta de destete ventilatorio disfuncional",
    "definition": "Incapacidad para adaptarse a niveles reducidos de soporte del ventilador mecánico que rompe y prolonga el proceso de destete.",
    "relatedFactors": [
      "Ciclo de sueño-vigilia alterado",
      "Inefflimpieza efectiva de las vías respiratorias",
      "Desnutrición",
      "Dolor",
      "Ansiedad"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 4. Respuestas cardiovasculares / pulmonares"
  },
  {
    "id": "nanda_00318",
    "code": "00318",
    "name": "Respuesta de destete ventilatorio disfuncional del adulto",
    "definition": "Incapacidad de personas mayores de 18 años, que han requerido ventilación mecánica. lación al menos 24 horas, para transición a ventilación espontánea.",
    "relatedFactors": [
      "Ciclo de sueño-vigilia alterado",
      "Secreciones excesivas de las vías respiratorias",
      "Inefftos activa",
      "Desnutrición",
      "Dolor"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 4. Respuestas cardiovasculares / pulmonares"
  },
  {
    "id": "nanda_00108",
    "code": "00108",
    "name": "Déficit de autocuidado al bañarse",
    "definition": "Incapacidad para completar de forma independiente las actividades de limpieza.",
    "relatedFactors": [
      "Ansiedad",
      "Disfunción congnitiva",
      "Disminución de la motivación",
      "Limitaciones ambientales",
      "Fatiga"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 5. Autocuidado"
  },
  {
    "id": "nanda_00109",
    "code": "00109",
    "name": "Vestir el déficit de autocuidado",
    "definition": "Incapacidad para ponerse o quitarse la ropa de forma independiente.",
    "relatedFactors": [
      "Ansiedad",
      "Disfunción congnitiva",
      "Disminución de la motivación",
      "Incomodidad",
      "Limitaciones ambientales"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 5. Autocuidado"
  },
  {
    "id": "nanda_00102",
    "code": "00102",
    "name": "Alimentar el déficit de autocuidado",
    "definition": "Incapacidad para comer de forma independiente.",
    "relatedFactors": [
      "Ansiedad",
      "Disfunción congnitiva",
      "Disminución de la motivación",
      "Incomodidad",
      "Limitaciones ambientales"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 5. Autocuidado"
  },
  {
    "id": "nanda_00110",
    "code": "00110",
    "name": "Déficit de autocuidado al ir al baño",
    "definition": "Incapacidad para realizar de forma independiente tareas asociadas con el intestino y la vejiga. eliminación.",
    "relatedFactors": [
      "Ansiedad",
      "Disfunción congnitiva",
      "Disminución de la motivación",
      "Limitaciones ambientales",
      "Fatiga"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 5. Autocuidado"
  },
  {
    "id": "nanda_00182",
    "code": "00182",
    "name": "Preparación para un mejor cuidado personal",
    "definition": "Un patrón de realizar actividades para uno mismo para cumplir con las metas relacionadas con la salud, que se puede fortalecer.",
    "relatedFactors": [],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 5. Autocuidado"
  },
  {
    "id": "nanda_00193",
    "code": "00193",
    "name": "Auto-negligencia",
    "definition": "Una constelación de comportamientos enmarcados culturalmente que involucran a uno o más cuidado personal actividades en las que no se mantiene un estándar de salud y bienestar socialmente aceptado (Gibbons, Lauder & Amp; Ludwick, 2006).",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Miedo a la institucionalización",
      "Función ejecutiva deteriorada",
      "Incapacidad para mantener el control",
      "Elección de estilo de vida"
    ],
    "defaultNocCode": "NOC_CODE_UNKNOWN",
    "defaultNicCode": "NIC_CODE_UNKNOWN",
    "serviceContext": "uci",
    "domain": "Dominio 4. Actividad / descanso",
    "class": "Clase 5. Autocuidado"
  },
  {
    "id": "nanda_00123",
    "code": "00123",
    "name": "Descuido unilateral",
    "definition": "Deterioro en la respuesta sensorial y motora, la representación mental y la atención espacial del cuerpo y el entorno correspondiente, caracterizado por falta de atención a un lado y exceso de atención al lado opuesto. La negligencia del lado izquierdo es más grave y persistente que la negligencia del lado derecho.",
    "relatedFactors": [
      "Para ser desarrollado"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 5. Percepción / cognición",
    "class": "Clase 1. Atención"
  },
  {
    "id": "nanda_00128",
    "code": "00128",
    "name": "Confusión aguda",
    "definition": "Alteraciones reversibles de la conciencia, la atención y la cognición. y percepción que se desarrollan en un corto período de tiempo y que duran menos de 3 meses.",
    "relatedFactors": [
      "Ciclo de sueño-vigilia alterado",
      "Deshidratación",
      "Movilidad física deteriorada",
      "Privación sensorial",
      "Mal uso de sustancia"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 5. Percepción / cognición",
    "class": "Clase 4. Cognición"
  },
  {
    "id": "nanda_00173",
    "code": "00173",
    "name": "Riesgo de confusión aguda",
    "definition": "Susceptible a alteraciones reversibles de la conciencia, la atención, la cognición y la percepción que se desarrollan durante un corto período de tiempo, que pueden comprometer mise salud.",
    "relatedFactors": [
      "Ciclo de sueño-vigilia alterado",
      "Deshidratación",
      "Movilidad física deteriorada",
      "Privación sensorial",
      "Mal uso de sustancia"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 5. Percepción / cognición",
    "class": "Clase 4. Cognición"
  },
  {
    "id": "nanda_00129",
    "code": "00129",
    "name": "Confusión crónica",
    "definition": "Alteraciones irreversibles, progresivas, insidiosas de la conciencia, la atención, la cognición y la percepción, que duran más de 3 meses.",
    "relatedFactors": [
      "Dolor chónico",
      "Estilo de vida sedentario",
      "Mal uso de sustancia"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 5. Percepción / cognición",
    "class": "Clase 4. Cognición"
  },
  {
    "id": "nanda_00251",
    "code": "00251",
    "name": "Control emocional lábil",
    "definition": "Incontrolable arrebatos de exagerado y involuntario emocional expresión.",
    "relatedFactors": [
      "Autoestima alterada",
      "Perturbación emocional excesiva",
      "Fatiga",
      "Insuffifuerza muscular ciente",
      "Angustia social"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 5. Percepción / cognición",
    "class": "Clase 4. Cognición"
  },
  {
    "id": "nanda_00222",
    "code": "00222",
    "name": "Ineffcontrol efectivo de los impulsos",
    "definition": "Un patrón de realizar reacciones rápidas y no planificadas a estímulos internos o externos sin tener en cuenta las consecuencias negativas de estas reacciones al individuo impulsivo o hacia los demás.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Desesperación",
      "Trastornos del estado de ánimo",
      "Manifestaciones neuroconductuales",
      "Tabaquismo"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 5. Percepción / cognición",
    "class": "Clase 4. Cognición"
  },
  {
    "id": "nanda_00126",
    "code": "00126",
    "name": "Conocimientos deficientes",
    "definition": "Ausencia de información cognitiva relacionada con un tema específico, o su adquisición.",
    "relatedFactors": [
      "Ansiedad",
      "Disfunción congnitiva",
      "Sintomas depresivos",
      "Acceso inadecuado a los recursos",
      "Conocimiento inadecuado de los recursos"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 5. Percepción / cognición",
    "class": "Clase 4. Cognición"
  },
  {
    "id": "nanda_00161",
    "code": "00161",
    "name": "Disponibilidad para mejorar el conocimiento",
    "definition": "Un patrón de información cognitiva relacionada con un tema específico, o su adquisición, que puede fortalecerse.",
    "relatedFactors": [
      "No especificado en el texto provisto"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 5. Percepción / cognición",
    "class": "Clase 4. Cognición"
  },
  {
    "id": "nanda_00131",
    "code": "00131",
    "name": "Memoria deteriorada",
    "definition": "Incapacidad persistente para recordar o recordar bits de información o habilidades, mientras se mantiene la capacidad de realizar de forma independiente las actividades de la vida diaria.",
    "relatedFactors": [
      "Sintomas depresivos",
      "Estimulación intelectual inadecuada",
      "Motivación inadecuada",
      "Apoyo social inadecuado",
      "Aislamiento social"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 5. Percepción / cognición",
    "class": "Clase 4. Cognición"
  },
  {
    "id": "nanda_00279",
    "code": "00279",
    "name": "Proceso de pensamiento perturbado",
    "definition": "Interrupción en el funcionamiento cognitivo que unffafecta los procesos mentales involucrados en el desarrollo de conceptos y categorías, el razonamiento y la resolución de problemas.",
    "relatedFactors": [
      "Confusión aguda",
      "Ansiedad",
      "Desorientación",
      "Temor",
      "Afligido"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 5. Percepción / cognición",
    "class": "Clase 4. Cognición"
  },
  {
    "id": "nanda_00157",
    "code": "00157",
    "name": "Disponibilidad para mejorar la comunicación",
    "definition": "Un patrón de intercambio de información e ideas con otros, que puede fortalecerse.",
    "relatedFactors": [
      "No especificado en el texto provisto"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 5. Percepción / cognición",
    "class": "Clase 5. Comunicación"
  },
  {
    "id": "nanda_00051",
    "code": "00051",
    "name": "Comunicación verbal deteriorada",
    "definition": "Capacidad disminuida, retrasada o ausente para recibir, procesar, transmitir y / o usar un sistema de símbolos.",
    "relatedFactors": [
      "Autoconcepto alterado",
      "Disfunción congnitiva",
      "Disnea",
      "Labilidad emocional",
      "Limitaciones ambientales"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 5. Percepción / cognición",
    "class": "Clase 5. Comunicación"
  },
  {
    "id": "nanda_00124",
    "code": "00124",
    "name": "Desesperación",
    "definition": "La sensación de que uno no experimentará emociones positivas o una mejora. en uno's condición.",
    "relatedFactors": [
      "Estrés crónico",
      "Temor",
      "Apoyo social inadecuado",
      "Pérdida de fe en el poder espiritual",
      "Pérdida de fe en valores trascendentes."
    ],
    "defaultNocCode": "Not Provided",
    "defaultNicCode": "Not Provided",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 6. Autopercepción",
    "class": "Clase 1. Autoconcepto"
  },
  {
    "id": "nanda_00185",
    "code": "00185",
    "name": "Disponibilidad para una mayor esperanza",
    "definition": "Un patrón de expectativas y deseos de movilizar energía para lograr resultados positivos o evitar una situación potencialmente amenazante o negativa, que puede fortificarse.",
    "relatedFactors": [
      "Expresa el deseo de mejorar la aceptación de la condición.",
      "Expresa el deseo de mejorar la capacidad para establecer metas alcanzables.",
      "Expresa el deseo de mejorar la congruencia de las expectativas con la meta.",
      "Expresa el deseo de mejorar la fuerza interior profunda.",
      "Expresa el deseo de mejorar la prestación y la recepción de cuidados."
    ],
    "defaultNocCode": "Not Provided",
    "defaultNicCode": "Not Provided",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 6. Autopercepción",
    "class": "Clase 1. Autoconcepto"
  },
  {
    "id": "nanda_00174",
    "code": "00174",
    "name": "Riesgo de dignidad humana comprometida",
    "definition": "Susceptible de pérdida percibida de respeto y honor, que puede comprometer salud.",
    "relatedFactors": [
      "Deshumanización",
      "Divulgación de información confidencial",
      "Exposición del cuerpo",
      "Humillación",
      "Comprensión inadecuada de la información sanitaria."
    ],
    "defaultNocCode": "Not Provided",
    "defaultNicCode": "Not Provided",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 6. Autopercepción",
    "class": "Clase 1. Autoconcepto"
  },
  {
    "id": "nanda_00121",
    "code": "00121",
    "name": "Identidad personal perturbada",
    "definition": "Incapacidad para mantener un percepción completa de sí mismo.",
    "relatedFactors": [
      "Rol social alterado",
      "Adoctrinamiento de culto",
      "Procesos familiares disfuncionales",
      "Conflicto de género",
      "Baja autoestima"
    ],
    "defaultNocCode": "Not Provided",
    "defaultNicCode": "Not Provided",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 6. Autopercepción",
    "class": "Clase 1. Autoconcepto"
  },
  {
    "id": "nanda_00225",
    "code": "00225",
    "name": "Riesgo de alteración de la identidad personal",
    "definition": "Susceptible a la incapacidad para mantenerse a sí una percepción integrada y completa mismo, lo que puede comprometer la salud.",
    "relatedFactors": [
      "Rol social alterado",
      "Adoctrinamiento de culto",
      "Procesos familiares disfuncionales",
      "Conflicto de género",
      "Baja autoestima"
    ],
    "defaultNocCode": "Not Provided",
    "defaultNicCode": "Not Provided",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 6. Autopercepción",
    "class": "Clase 1. Autoconcepto"
  },
  {
    "id": "nanda_00167",
    "code": "00167",
    "name": "Disponibilidad para mejorar el autoconcepto",
    "definition": "Un patrón de percepciones o ideas sobre el yo, que se puede fortalecer.",
    "relatedFactors": [
      "Expresa el deseo de mejorar la aceptación de las limitaciones.",
      "Expresa el deseo de mejorar la aceptación de las fortalezas.",
      "Expresa el deseo de mejorar la satisfacción con la imagen corporal.",
      "Expresa el deseo de mejorar la confianza en las habilidades.",
      "Expresa el deseo de mejorar la congruencia entre acciones y palabras."
    ],
    "defaultNocCode": "Not Provided",
    "defaultNicCode": "Not Provided",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 6. Autopercepción",
    "class": "Clase 1. Autoconcepto"
  },
  {
    "id": "nanda_00119",
    "code": "00119",
    "name": "Baja autoestima crónica",
    "definition": "Percepción negativa de competencia y actitud hacia uno mismo desde hace mucho tiempo. autoestima, autoaceptación, autorrespeto,",
    "relatedFactors": [
      "Disminución de la aceptación consciente",
      "Difficulto administrar las finanzas",
      "Imagen corporal perturbada",
      "Fatiga",
      "Miedo al rechazo"
    ],
    "defaultNocCode": "Not Provided",
    "defaultNicCode": "Not Provided",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 6. Autopercepción",
    "class": "Clase 2. Autoestima"
  },
  {
    "id": "nanda_00224",
    "code": "00224",
    "name": "Riesgo de baja autoestima crónica",
    "definition": "Susceptible a una percepción negativa de larga data de la autoestima, la autoaceptación, el autorrespeto, la competencia y la actitud hacia uno mismo, lo que puede comprometer mise salud.",
    "relatedFactors": [
      "Disminución de la aceptación consciente",
      "Difficulto administrar las finanzas",
      "Imagen corporal perturbada",
      "Fatiga",
      "Miedo al rechazo"
    ],
    "defaultNocCode": "Not Provided",
    "defaultNicCode": "Not Provided",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 6. Autopercepción",
    "class": "Clase 2. Autoestima"
  },
  {
    "id": "nanda_00120",
    "code": "00120",
    "name": "Baja autoestima situacional",
    "definition": "Cambiar de percepción positiva a negativa de la autoestima, la autoaceptación, el autorrespeto, la competencia y la actitud hacia uno mismo en respuesta a una corriente situación.",
    "relatedFactors": [
      "Comportamiento incongruente con los valores",
      "Disminución del control ambiental",
      "Disminución de la aceptación consciente",
      "Difficulto que acepta la alteración en el papel social",
      "Difficulto administrar las finanzas"
    ],
    "defaultNocCode": "Not Provided",
    "defaultNicCode": "Not Provided",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 6. Autopercepción",
    "class": "Clase 2. Autoestima"
  },
  {
    "id": "nanda_00153",
    "code": "00153",
    "name": "Riesgo de baja autoestima situacional",
    "definition": "Susceptible de cambiar de percepción positiva a negativa de autoestima, autoaceptación, autorrespeto, competencia y actitud hacia uno mismo en respuesta a una situación actual, lo que puede comprometer la salud.",
    "relatedFactors": [
      "Comportamiento incongruente con los valores",
      "Disminución del control ambiental",
      "Disminución de la aceptación consciente",
      "Difficulto que acepta la alteración en el papel social",
      "Difficulto administrar las finanzas"
    ],
    "defaultNocCode": "Not Provided",
    "defaultNicCode": "Not Provided",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 6. Autopercepción",
    "class": "Clase 2. Autoestima"
  },
  {
    "id": "nanda_00118",
    "code": "00118",
    "name": "Imagen corporal alterada",
    "definition": "Imagen mental negativa de uno's yo físico.",
    "relatedFactors": [
      "Conciencia corporal",
      "Disfunción congnitiva",
      "Conflicto entre creencias espirituales y régimen de tratamiento",
      "Conflicto entre valores y normas culturales",
      "Desconfianza en el funcionamiento del cuerpo"
    ],
    "defaultNocCode": "Not Provided",
    "defaultNicCode": "Not Provided",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 6. Autopercepción",
    "class": "Clase 3. Imagen corporal"
  },
  {
    "id": "nanda_00056",
    "code": "00056",
    "name": "Paternidad deteriorada",
    "definition": "Limitación del cuidador principal para nutrir, proteger y promover el crecimiento y desarrollo óptimos del niño, a través de un ejercicio de autoridad consistente y empático y un comportamiento apropiado en respuesta al niño.'s necesidades.",
    "relatedFactors": [
      "Papel parental alterado",
      "Síntomas depresivos",
      "Apoyo social inadecuado",
      "Conocimiento inadecuado sobre el desarrollo infantil",
      "Violencia de pareja íntima no abordada"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 1. Roles de cuidado"
  },
  {
    "id": "nanda_00057",
    "code": "00057",
    "name": "Riesgo de paternidad deteriorada",
    "definition": "Cuidador primario susceptible a una limitación para nutrir, proteger y promover el crecimiento y desarrollo óptimos del niño, a través de un ejercicio de autoridad consistente y empático y un comportamiento apropiado en respuesta al niño.'s necesidades.",
    "relatedFactors": [
      "Papel parental alterado",
      "Síntomas depresivos",
      "Apoyo social inadecuado",
      "Conocimiento inadecuado sobre el desarrollo infantil",
      "Violencia de pareja íntima no abordada"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 1. Roles de cuidado"
  },
  {
    "id": "nanda_00164",
    "code": "00164",
    "name": "Preparación para una mejor paternidad",
    "definition": "Un patrón de cuidador principal para nutrir, proteger y promover óptimas Se puede fortalecer el crecimiento y desarrollo del niño, la autoridad y el comportamiento apropiado. a través de un ejercicio empático consistente en respuesta al niño's necesidades, que",
    "relatedFactors": [
      "Expresa el deseo de mejorar la aceptación del niño.",
      "Expresa el deseo de mejorar la calidad de la atención.",
      "Expresa el deseo de mejorar el mantenimiento de la salud infantil.",
      "Expresa su deseo de mejorar los arreglos de cuidado infantil",
      "Expresa el deseo de mejorar el compromiso con el niño."
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 1. Roles de cuidado"
  },
  {
    "id": "nanda_00061",
    "code": "00061",
    "name": "Tensión del rol del cuidador",
    "definition": "Difficulto en el cumplimiento de las responsabilidades de cuidado, expectativas y / o comportamientos para familia u otras personas significativas.",
    "relatedFactors": [
      "Preocupado por la capacidad futura de brindar atención",
      "Síntomas depresivos",
      "Apoyo social inadecuado",
      "Conflicto familiar",
      "Pérdida de independencia"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 1. Roles de cuidado"
  },
  {
    "id": "nanda_00062",
    "code": "00062",
    "name": "Riesgo de tensión en el rol del cuidador",
    "definition": "Susceptible a difficulto en el cumplimiento de las responsabilidades de cuidado, expectativas y / o comportamientos para la familia u otras personas importantes, que pueden comprometer la salud.",
    "relatedFactors": [
      "Compromisos de roles en competencia",
      "Síntomas depresivos",
      "Inexperiencia con el cuidado de",
      "Apoyo social inadecuado",
      "Pérdida de independencia"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 1. Roles de cuidado"
  },
  {
    "id": "nanda_00058",
    "code": "00058",
    "name": "Riesgo de apego deteriorado",
    "definition": "Susceptible a la interrupción del proceso interactivo entre el padre o la pareja y el niño que fomenta el desarrollo de una protección y ing relación recíproca.",
    "relatedFactors": [
      "Ansiedad",
      "Separación de padres e hijos",
      "Comportamiento infantil desorganizado",
      "Barrera física",
      "Mal uso de sustancia"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 2. Relaciones familiares"
  },
  {
    "id": "nanda_00283",
    "code": "00283",
    "name": "Síndrome de identidad familiar perturbada",
    "definition": "Incapacidad para mantener un proceso comunicativo e interactivo continuo de creación y mantenimiento de un sentido colectivo compartido del significado de la familia.",
    "relatedFactors": [
      "Identidad personal perturbada (00121)",
      "Procesos familiares disfuncionales (00063)",
      "Estrés excesivo",
      "Apoyo social inadecuado",
      "Violencia doméstica no abordada"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 2. Relaciones familiares"
  },
  {
    "id": "nanda_00284",
    "code": "00284",
    "name": "Riesgo de síndrome de identidad familiar perturbada",
    "definition": "Susceptible a la incapacidad de mantener un proceso comunicativo e interactivo continuo para crear y mantener un sentido colectivo compartido del significado de la familia, que puede comprometer a los miembros de la familia.' salud .",
    "relatedFactors": [
      "Relaciones familiares ambivalentes",
      "Estrés excesivo",
      "Apoyo social inadecuado",
      "Violencia doméstica no abordada",
      "Valores incongruentes con las normas culturales."
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 2. Relaciones familiares"
  },
  {
    "id": "nanda_00063",
    "code": "00063",
    "name": "Procesos familiares disfuncionales",
    "definition": "Funcionamiento familiar que no apoya el bienestar de sus miembros.",
    "relatedFactors": [
      "Personalidad adictiva",
      "Habilidades inadecuadas para la resolución de problemas."
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 2. Relaciones familiares"
  },
  {
    "id": "nanda_00060",
    "code": "00060",
    "name": "Procesos familiares interrumpidos",
    "definition": "Romper la continuidad del funcionamiento familiar que no apoya al bienestar siendo de sus miembros.",
    "relatedFactors": [
      "Interacción comunitaria alterada",
      "Rol familiar alterado",
      "Difficulto que se ocupa del cambio de poder entre los miembros de la familia"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 2. Relaciones familiares"
  },
  {
    "id": "nanda_00159",
    "code": "00159",
    "name": "Preparación para procesos familiares mejorados",
    "definition": "Un patrón de funcionamiento familiar para apoyar el bienestar de sus miembros, que se puede fortalecer.",
    "relatedFactors": [
      "Expresa el deseo de mejorar el equilibrio entre la autonomía personal y la cohesión familiar.",
      "Expresa el deseo de mejorar el patrón de comunicación.",
      "Expresa el deseo de mejorar la adaptación de la familia al cambio.",
      "Expresa el deseo de mejorar la resiliencia psicológica familiar.",
      "Expresa el deseo de mejorar el respeto por los miembros de la familia."
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 2. Relaciones familiares"
  },
  {
    "id": "nanda_00223",
    "code": "00223",
    "name": "IneffRelación efectiva",
    "definition": "Un patrón de asociación mutua que es insuficientefficient para proveer el uno al otro's necesidades.",
    "relatedFactors": [
      "Habilidades de comunicación inadecuadas.",
      "Factores estresantes",
      "Mal uso de sustancia",
      "Expectativas irrealistas"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 3. Desempeño de roles"
  },
  {
    "id": "nanda_00229",
    "code": "00229",
    "name": "Riesgo de ineffrelación efectiva",
    "definition": "Susceptible de desarrollar un patrón que es insuficientefficient para proporcionar un mutuo asociación para proveer el uno al otro's necesidades.",
    "relatedFactors": [
      "Habilidades de comunicación inadecuadas",
      "Factores estresantes",
      "Mal uso de sustancia",
      "Expectativas irrealistas"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 3. Desempeño de roles"
  },
  {
    "id": "nanda_00207",
    "code": "00207",
    "name": "Preparación para una relación mejorada",
    "definition": "Un patrón de asociación mutua para proporcionar uno para el otro's necesidades, que pueden fortificarse.",
    "relatedFactors": [
      "Expresa el deseo de mejorar la autonomía entre socios.",
      "Expresa el deseo de mejorar la colaboración entre socios.",
      "Expresa el deseo de mejorar la comunicación entre socios.",
      "Expresa el deseo de mejorar el respeto mutuo entre socios.",
      "Expresa el deseo de mejorar la satisfacción con las relaciones interpersonales complementarias entre socios"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 3. Desempeño de roles"
  },
  {
    "id": "nanda_00064",
    "code": "00064",
    "name": "Conflicto de rol de los padres",
    "definition": "Experiencia de los padres de confusión de roles y conflicto en respuesta a una crisis.",
    "relatedFactors": [
      "Interrupciones en la vida familiar debido al régimen de tratamiento domiciliario",
      "Intimidado por modalidades invasivas",
      "Intimidado por modalidades restrictivas",
      "Separación de padres e hijos"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 3. Desempeño de roles"
  },
  {
    "id": "nanda_00055",
    "code": "00055",
    "name": "Ineffdesempeño efectivo del rol",
    "definition": "Un patrón de contexto mental, normas y expectativas de comportamiento y autoexpresión. que no coincide con el medio ambiente",
    "relatedFactors": [
      "Imagen corporal alterada",
      "Conflicto",
      "Fatiga",
      "Apoyo social inadecuado",
      "Violencia doméstica no abordada"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 3. Desempeño de roles"
  },
  {
    "id": "nanda_00052",
    "code": "00052",
    "name": "Interacción social deteriorada",
    "definition": "Insufficiente o excesiva cantidad o ineffcalidad efectiva del intercambio social.",
    "relatedFactors": [
      "Autoconcepto alterado",
      "Disfunción congnitiva",
      "Apoyo social inadecuado",
      "Habilidades de comunicación inadecuadas",
      "Individuos sin pareja"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 7. Relación de roles",
    "class": "Clase 3. Desempeño de roles"
  },
  {
    "id": "nanda_00059",
    "code": "00059",
    "name": "Disfunción sexual",
    "definition": "Estado en el que un individuo experimenta un cambio en la función sexual durante las fases de respuesta sexual de deseo, excitación y / o orgasmo, que se considera insatisfactorio, poco gratificante o inadecuado.",
    "relatedFactors": [
      "Información inexacta sobre la función sexual",
      "Conocimiento inadecuado sobre la función sexual",
      "Modelos a seguir inadecuados",
      "Vulnerabilidad percibida",
      "Conflicto de valores"
    ],
    "defaultNocCode": "NOT_PROVIDED_IN_TEXT",
    "defaultNicCode": "NOT_PROVIDED_IN_TEXT",
    "serviceContext": "partos",
    "domain": "Dominio 8. Sexualidad",
    "class": "Clase 2. Función sexual"
  },
  {
    "id": "nanda_00065",
    "code": "00065",
    "name": "Ineffpatrón de sexualidad efectiva",
    "definition": "Expresiones de preocupación con respecto a la propia sexualidad.",
    "relatedFactors": [
      "Conflicto sobre la orientación sexual",
      "Miedo al embarazo",
      "Relaciones de pareja sexual deterioradas",
      "Estrategias sexuales alternativas inadecuadas",
      "Modelos a seguir inadecuados"
    ],
    "defaultNocCode": "NOT_PROVIDED_IN_TEXT",
    "defaultNicCode": "NOT_PROVIDED_IN_TEXT",
    "serviceContext": "partos",
    "domain": "Dominio 8. Sexualidad",
    "class": "Clase 2. Función sexual"
  },
  {
    "id": "nanda_00221",
    "code": "00221",
    "name": "Ineffproceso de maternidad efectivo",
    "definition": "Incapacidad para prepararse y / o mantener un embarazo saludable, proceso de parto y cuidado del recién nacido para asegurar su bienestar.",
    "relatedFactors": [
      "Conocimiento inadecuado del proceso de maternidad",
      "Preparación mental inadecuada para la crianza de los hijos",
      "Baja confianza materna",
      "Angustia psicológica materna",
      "Entorno inseguro"
    ],
    "defaultNocCode": "NOT_PROVIDED_IN_TEXT",
    "defaultNicCode": "NOT_PROVIDED_IN_TEXT",
    "serviceContext": "partos",
    "domain": "Dominio 8. Sexualidad",
    "class": "Clase 3. Reproducción"
  },
  {
    "id": "nanda_00227",
    "code": "00227",
    "name": "Riesgo de ineffproceso de maternidad efectivo",
    "definition": "Susceptible a la incapacidad de prepararse y / o mantener una embarazo saludable, proceso de parto y cuidado del recién nacido para asegurar su bienestar.",
    "relatedFactors": [
      "Conocimiento inadecuado del proceso de maternidad",
      "Preparación mental inadecuada para la crianza de los hijos",
      "Baja confianza materna",
      "Angustia psicológica materna",
      "Entorno inseguro"
    ],
    "defaultNocCode": "NOT_PROVIDED_IN_TEXT",
    "defaultNicCode": "NOT_PROVIDED_IN_TEXT",
    "serviceContext": "partos",
    "domain": "Dominio 8. Sexualidad",
    "class": "Clase 3. Reproducción"
  },
  {
    "id": "nanda_00208",
    "code": "00208",
    "name": "Disponibilidad para mejorar el proceso de maternidad",
    "definition": "Un patrón de preparación y mantenimiento de un embarazo saludable, proceso de parto y cuidado del recién nacido para garantizar el bienestar que puede ser fortificado.",
    "relatedFactors": [],
    "defaultNocCode": "NOT_PROVIDED_IN_TEXT",
    "defaultNicCode": "NOT_PROVIDED_IN_TEXT",
    "serviceContext": "partos",
    "domain": "Dominio 8. Sexualidad",
    "class": "Clase 3. Reproducción"
  },
  {
    "id": "nanda_00209",
    "code": "00209",
    "name": "Riesgo de alteración de la díada materno-fetal",
    "definition": "Susceptible a una interrupción de la relación simbiótica madre-fetal como resultado de condiciones comórbidas o relacionadas con el embarazo, que pueden comprometer salud.",
    "relatedFactors": [
      "Atención prenatal inadecuada",
      "Mal uso de sustancia",
      "Abuso no abordado",
      "Complicación del embarazo",
      "Trastornos del metabolismo de la glucosa"
    ],
    "defaultNocCode": "NOT_PROVIDED_IN_TEXT",
    "defaultNicCode": "NOT_PROVIDED_IN_TEXT",
    "serviceContext": "partos",
    "domain": "Dominio 8. Sexualidad",
    "class": "Clase 3. Reproducción"
  },
  {
    "id": "nanda_00260",
    "code": "00260",
    "name": "Riesgo de una transición migratoria complicada",
    "definition": "Susceptible de experimentar sentimientos negativos (soledad, miedo, ansiedad) en respuesta a consecuencias insatisfactorias y barreras culturales para uno.'s transición de inmigración, que puede comprometer la salud.",
    "relatedFactors": [
      "Propietario abusivo",
      "Trabajo disponible por debajo de la preparación educativa",
      "Barreras de comunicación",
      "Barreras culturales",
      "Conocimiento inadecuado sobre el acceso a los recursos."
    ],
    "defaultNocCode": "1300",
    "defaultNicCode": "5270",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 1. Respuestas postraumáticas"
  },
  {
    "id": "nanda_00141",
    "code": "00141",
    "name": "Síndrome postraumático",
    "definition": "Respuesta inadaptada sostenida a un evento traumático y abrumador.",
    "relatedFactors": [
      "Fuerza del ego disminuida",
      "Entorno no propicio para las necesidades",
      "Sentido exagerado de responsabilidad",
      "Apoyo social inadecuado",
      "Comportamiento autolesivo"
    ],
    "defaultNocCode": "1305",
    "defaultNicCode": "5270",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 1. Respuestas postraumáticas"
  },
  {
    "id": "nanda_00145",
    "code": "00145",
    "name": "Riesgo de síndrome postraumático",
    "definition": "Susceptible a un evento de mala adaptación sostenido, que puede comprometer la salud.",
    "relatedFactors": [
      "Fuerza del ego disminuida",
      "Entorno no propicio para las necesidades",
      "Sentido exagerado de responsabilidad",
      "Apoyo social inadecuado",
      "Comportamiento autolesivo"
    ],
    "defaultNocCode": "1305",
    "defaultNicCode": "5270",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 1. Respuestas postraumáticas"
  },
  {
    "id": "nanda_00142",
    "code": "00142",
    "name": "Síndrome de trauma por violación",
    "definition": "Respuesta desadaptativa sostenida contra una penetración sexual forzada, violenta la víctima's voluntad y consentimiento.",
    "relatedFactors": [
      "Falta de apoyo social",
      "Sentimientos de impotencia",
      "Miedo",
      "Ansiedad",
      "Trauma físico"
    ],
    "defaultNocCode": "1305",
    "defaultNicCode": "5270",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 1. Respuestas postraumáticas"
  },
  {
    "id": "nanda_00114",
    "code": "00114",
    "name": "Síndrome de estrés por reubicación",
    "definition": "Trastorno fisiológico y / o psicosocial tras el traslado de un entorno a otro.",
    "relatedFactors": [
      "Barreras de comunicación",
      "Control inadecuado sobre el medio ambiente",
      "Asesoramiento inadecuado antes de la salida",
      "Apoyo social inadecuado"
    ],
    "defaultNocCode": "1305",
    "defaultNicCode": "5270",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 1. Respuestas postraumáticas"
  },
  {
    "id": "nanda_00149",
    "code": "00149",
    "name": "Riesgo de síndrome de estrés por reubicación",
    "definition": "Susceptible a alteraciones fisiológicas y / o psicosociales tras el traslado de un entorno a otro, que pueden comprometer la salud.",
    "relatedFactors": [
      "Barreras de comunicación",
      "Control inadecuado sobre el medio ambiente",
      "Asesoramiento inadecuado antes de la salida",
      "Apoyo social inadecuado"
    ],
    "defaultNocCode": "1305",
    "defaultNicCode": "5270",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 1. Respuestas postraumáticas"
  },
  {
    "id": "nanda_00199",
    "code": "00199",
    "name": "Ineffplanificación de actividades efectivas",
    "definition": "Incapacidad para prepararse para una serie de acciones. fijo en el tiempo y bajo ciertos condiciones.",
    "relatedFactors": [
      "Comportamiento de vuelo ante la solución propuesta",
      "Hedonismo",
      "Capacidad de procesamiento de información inadecuada",
      "Apoyo social inadecuado",
      "Percepción poco realista del evento"
    ],
    "defaultNocCode": "1601",
    "defaultNicCode": "5230",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00226",
    "code": "00226",
    "name": "Riesgo de ineffplanificación de actividades efectivas",
    "definition": "Susceptible a la imposibilidad de prepararse para un conjunto de acciones fijadas en el tiempo y bajo determinadas condiciones, que pueden comprometer la salud.",
    "relatedFactors": [
      "Comportamiento de vuelo ante la solución propuesta",
      "Hedonismo",
      "Capacidad de procesamiento de información inadecuada",
      "Apoyo social inadecuado",
      "Percepción poco realista del evento"
    ],
    "defaultNocCode": "1601",
    "defaultNicCode": "5230",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00146",
    "code": "00146",
    "name": "Ansiedad",
    "definition": "Una respuesta emocional a un diffUsar amenaza en la que el individuo anticipa un peligro inminente inespecífico, una catástrofe o una desgracia.",
    "relatedFactors": [
      "Patrón respiratorio alterado",
      "Anorexia",
      "Reflejos enérgicos",
      "Opresión en el pecho",
      "Extremidades frías"
    ],
    "defaultNocCode": "1402",
    "defaultNicCode": "5820",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00071",
    "code": "00071",
    "name": "Afrontamiento defensivo",
    "definition": "Proyección repetida de autoevaluación falsamente positiva basada en un patrón de autoprotección que defiende contra amenazas percibidas subyacentes a la autoevaluación positiva. respecto.",
    "relatedFactors": [
      "Conflicto entre autopercepción y sistema de valores",
      "Miedo al fracaso",
      "Miedo a la humillación",
      "Miedo a las repercusiones",
      "Confianza inadecuada en los demás"
    ],
    "defaultNocCode": "1302",
    "defaultNicCode": "5230",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00069",
    "code": "00069",
    "name": "Ineffafrontamiento efectivo",
    "definition": "Un patrón de evaluación inválida de los factores estresantes, con efectos cognitivos y / o conductuales.ff orts, que no gestiona las demandas relacionadas con el bienestar.",
    "relatedFactors": [
      "Alto grado de amenaza",
      "Incapacidad para conservar energías adaptativas",
      "Evaluación de amenazas inexacta",
      "Confianza inadecuada en la capacidad para lidiar con una situación",
      "Recursos sanitarios inadecuados"
    ],
    "defaultNocCode": "1302",
    "defaultNicCode": "5230",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00158",
    "code": "00158",
    "name": "Disponibilidad para afrontar mejor la situación",
    "definition": "Un patrón de valoración válida de los factores estresantes con efectos cognitivos y / o conductuales.ff Orts para gestionar demandas relacionadas con el bienestar, que se pueden fortalecer.",
    "relatedFactors": [
      "Expresa su deseo de mejorar el conocimiento de las estrategias de manejo del estrés",
      "Expresa el deseo de mejorar la gestión de los factores estresantes",
      "Expresa el deseo de mejorar el apoyo social"
    ],
    "defaultNocCode": "1302",
    "defaultNicCode": "5230",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00077",
    "code": "00077",
    "name": "Ineffafrontamiento comunitario efectivo",
    "definition": "Un patrón de actividades comunitarias para la adaptación y resolución de problemas que no es satisfactorio para satisfacer las demandas o necesidades de la comunidad.",
    "relatedFactors": [
      "Recursos comunitarios inadecuados para la resolución de problemas",
      "Sistemas comunitarios inexistentes",
      "Recursos comunitarios inadecuados"
    ],
    "defaultNocCode": "2600",
    "defaultNicCode": "7260",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00076",
    "code": "00076",
    "name": "Preparación para un afrontamiento comunitario mejorado",
    "definition": "Un patrón de actividades comunitarias para la adaptación y resolución de problemas para atendiendo las demandas o necesidades reforzadas. de la comunidad, que puede ser",
    "relatedFactors": [
      "Expresa su deseo de mejorar la disponibilidad de los programas de recreación comunitaria",
      "Expresa su deseo de mejorar la disponibilidad de programas comunitarios de relajación",
      "Expresa el deseo de mejorar la comunicación entre los miembros de la comunidad"
    ],
    "defaultNocCode": "2600",
    "defaultNicCode": "7260",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00074",
    "code": "00074",
    "name": "Afrontamiento familiar comprometido",
    "definition": "Una persona principal que suele brindar apoyo (miembro de la familia, pareja o amigo cercano) proporciona insufficient, ineffApoyo, comodidad, asistencia o estímulo efectivo o comprometido que el cliente pueda necesitar para manejar o dominar las tareas de adaptación relacionadas con su problema de salud.",
    "relatedFactors": [
      "Situaciones coexistentes affpersona de apoyo actuando",
      "Capacidad agotada de la persona de apoyo",
      "Desorganización familiar",
      "Información inexacta presentada por otros",
      "Información inadecuada disponible para la persona de apoyo."
    ],
    "defaultNocCode": "2600",
    "defaultNicCode": "7140",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00073",
    "code": "00073",
    "name": "Afrontamiento familiar discapacitado",
    "definition": "Comportamiento de la persona principal (familiar, pareja o amigo cercano) que incapacita sus capacidades y las del cliente.'s capacidades para effAbordar de manera efectiva las tareas esenciales para cualquiera de las personas.'s adaptación al desafío de la salud.",
    "relatedFactors": [
      "Relaciones familiares ambivalentes",
      "Sentimientos crónicamente no expresados por la persona de apoyo."
    ],
    "defaultNocCode": "2600",
    "defaultNicCode": "7140",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00075",
    "code": "00075",
    "name": "Preparación para afrontar mejor la familia",
    "definition": "Un patrón de gestión de tareas adaptativas por la persona principal (miembros de la familia ber, pareja o amigo cercano) lenge, que involucrado con el cliente's desafíos de salud puede fortalecerse.",
    "relatedFactors": [
      "Expresa su deseo de reconocer el impacto de la crisis en el crecimiento",
      "Expresa el deseo de elegir experiencias que optimicen el bienestar",
      "Expresa el deseo de mejorar la conexión con otras personas que han experimentado una situación similar."
    ],
    "defaultNocCode": "2600",
    "defaultNicCode": "7140",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00147",
    "code": "00147",
    "name": "Ansiedad ante la muerte",
    "definition": "Angustia e inseguridad emocional, generada por la anticipación de la muerte y el proceso de morir de uno mismo o de otras personas significativas, que effects uno's calidad de vida.",
    "relatedFactors": [
      "Anticipación de las consecuencias adversas de la anestesia",
      "Anticipación del impacto de la muerte en otros",
      "Anticipación del dolor",
      "Anticipación de suffering",
      "Conciencia de muerte inminente"
    ],
    "defaultNocCode": "1402",
    "defaultNicCode": "5820",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00072",
    "code": "00072",
    "name": "Ineffnegación efectiva",
    "definition": "Intento consciente o inconsciente de desautorizar el conocimiento o significado de un evento para reducir la ansiedad y / o el miedo, lo que conduce al detrimento de la salud.",
    "relatedFactors": [
      "Ansiedad",
      "Estrés excesivo",
      "Miedo a la muerte",
      "Miedo a perder la autonomía personal",
      "Miedo a la separación"
    ],
    "defaultNocCode": "1302",
    "defaultNicCode": "5230",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00148",
    "code": "00148",
    "name": "Temor",
    "definition": "Respuesta emocional básica e intensa que despierta la detección de una amenaza inminente, que implica una reacción de alarma inmediata (American Psychological Asociación).",
    "relatedFactors": [
      "Barreras de comunicación",
      "Respuesta aprendida a la amenaza",
      "Respuesta al estímulo fóbico",
      "Situación desconocida"
    ],
    "defaultNocCode": "1402",
    "defaultNicCode": "5820",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00301",
    "code": "00301",
    "name": "Duelo inadaptado",
    "definition": "Trastorno que se produce después de la muerte de un ser querido, en el que la experiencia de angustia que acompaña al duelo no sigue los aspectos socioculturales. Expectativas.",
    "relatedFactors": [
      "Diffilidiando con crisis concurrentes",
      "Perturbación emocional excesiva",
      "Ansiedad de apego alta",
      "Apoyo social inadecuado",
      "Baja evitación del apego"
    ],
    "defaultNocCode": "1305",
    "defaultNicCode": "5270",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00302",
    "code": "00302",
    "name": "Riesgo de duelo inadaptado",
    "definition": "Susceptible a un trastorno que ocurre después de la muerte de un ser querido, en el que la experiencia de angustia que acompaña al duelo no sigue las expectativas socioculturales, lo que puede comprometer la salud.",
    "relatedFactors": [
      "Diffilidiando con crisis concurrentes",
      "Perturbación emocional excesiva",
      "Ansiedad de apego alta",
      "Apoyo social inadecuado",
      "Baja evitación del apego"
    ],
    "defaultNocCode": "1305",
    "defaultNicCode": "5270",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00285",
    "code": "00285",
    "name": "Disposición para un duelo intensificado",
    "definition": "Un patrón de integración de una nueva realidad funcional que surge después de una pérdida significativa real, anticipada o percibida, que puede fortalecerse.",
    "relatedFactors": [
      "Expresa su deseo de continuar con el legado de los fallecidos",
      "Expresa el deseo de participar en actividades anteriores",
      "Expresa el deseo de mejorar el afrontamiento del dolor",
      "Expresa el deseo de mejorar el perdón",
      "Expresa el deseo de aumentar la esperanza."
    ],
    "defaultNocCode": "1305",
    "defaultNicCode": "5270",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00241",
    "code": "00241",
    "name": "Regulación alterada del estado de ánimo",
    "definition": "Un estado mental caracterizado por cambios de humor o unffect y que se compone de una constelación de unffafectivo, cognitivo, somático y / o fisiológico manifestaciones que varían de leves a graves.",
    "relatedFactors": [
      "Ciclo alterado de sueño-vigilia",
      "Ansiedad",
      "Difficulto funcionando socialmente",
      "Factores externos que influyen en el autoconcepto",
      "Hipervigilancia"
    ],
    "defaultNocCode": "1201",
    "defaultNicCode": "5330",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00125",
    "code": "00125",
    "name": "Impotencia",
    "definition": "Un estado de pérdida de control o influencia real o percibida sobre factores o eventos que unffect uno's bienestar, la vida personal o la sociedad (adaptado de American Psychology Asociación).",
    "relatedFactors": [
      "Ansiedad",
      "Tensión del rol del cuidador",
      "Entorno institucional disfuncional",
      "Movilidad física deteriorada",
      "Interés inadecuado en mejorar uno'situación s"
    ],
    "defaultNocCode": "1201",
    "defaultNicCode": "5230",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00152",
    "code": "00152",
    "name": "Riesgo de impotencia",
    "definition": "Susceptible a un estado de pérdida de control o influencia real o percibida sobre factores o eventos que unffect uno's el bienestar, la vida personal o la sociedad, que pueden comprometer la salud (adaptado de American Psychology Asociación).",
    "relatedFactors": [
      "Ansiedad",
      "Tensión del rol del cuidador",
      "Entorno institucional disfuncional",
      "Movilidad física deteriorada",
      "Interés inadecuado en mejorar uno'situación s"
    ],
    "defaultNocCode": "1201",
    "defaultNicCode": "5230",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00187",
    "code": "00187",
    "name": "Preparación para potencia mejorada",
    "definition": "Un patrón de participación consciente en el cambio para el bienestar, que puede ser fortificado.",
    "relatedFactors": [
      "Expresa el deseo de mejorar la conciencia de posibles cambios",
      "Expresa su deseo de mejorar las decisiones que podrían conducir a cambios",
      "Expresa el deseo de mejorar la independencia tomando medidas para el cambio",
      "Expresa el deseo de mejorar la participación en el cambio",
      "Expresa el deseo de mejorar el conocimiento para participar en el cambio."
    ],
    "defaultNocCode": "1201",
    "defaultNicCode": "5230",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00210",
    "code": "00210",
    "name": "Resiliencia deteriorada",
    "definition": "Disminución de la capacidad para recuperarse de situaciones adversas o cambiantes percibidas, a través de un proceso dinámico de adaptación.",
    "relatedFactors": [
      "Relaciones familiares alteradas",
      "Violencia comunitaria",
      "Rituales familiares interrumpidos",
      "Roles familiares interrumpidos",
      "Procesos familiares disfuncionales"
    ],
    "defaultNocCode": "1302",
    "defaultNicCode": "5230",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00211",
    "code": "00211",
    "name": "Riesgo de deterioro de la resiliencia",
    "definition": "Susceptible a una capacidad disminuida para recuperarse de situaciones adversas o cambiantes percibidas, a través de un proceso dinámico de adaptación, que puede comprometer mise salud.",
    "relatedFactors": [
      "Relaciones familiares alteradas",
      "Violencia comunitaria",
      "Rituales familiares interrumpidos",
      "Roles familiares interrumpidos",
      "Procesos familiares disfuncionales"
    ],
    "defaultNocCode": "1302",
    "defaultNicCode": "5230",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00212",
    "code": "00212",
    "name": "Preparación para una mayor resiliencia",
    "definition": "Un patrón de capacidad para recuperarse de situaciones adversas o cambiantes percibidas, a través de un proceso dinámico de adaptación, que puede fortalecerse.",
    "relatedFactors": [
      "Expresa su deseo de mejorar los recursos disponibles",
      "Expresa el deseo de mejorar las habilidades de comunicación",
      "Expresa el deseo de mejorar la seguridad ambiental",
      "Expresa el deseo de mejorar el establecimiento de metas",
      "Expresa el deseo de mejorar las relaciones interpersonales."
    ],
    "defaultNocCode": "1302",
    "defaultNicCode": "5230",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00137",
    "code": "00137",
    "name": "Dolor crónico",
    "definition": "Patrón cíclico, recurrente y potencialmente progresivo de tristeza generalizada experimentado (por un padre, cuidador, individuo con una enfermedad crónica o discapacidad) en respuesta a una pérdida continua, a lo largo de la trayectoria de una enfermedad o discapacidad.",
    "relatedFactors": [
      "Crisis de gestión de la discapacidad",
      "Crisis de manejo de enfermedades",
      "Hitos perdidos",
      "Oportunidades perdidas"
    ],
    "defaultNocCode": "2102",
    "defaultNicCode": "1400",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00177",
    "code": "00177",
    "name": "Sobrecarga de estrés",
    "definition": "Cantidades excesivas y tipos de demandas que requieren acción.",
    "relatedFactors": [
      "Recursos inadecuados",
      "Estresores repetidos",
      "Factores estresantes"
    ],
    "defaultNocCode": "1402",
    "defaultNicCode": "5230",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 2. Respuestas de afrontamiento"
  },
  {
    "id": "nanda_00258",
    "code": "00258",
    "name": "Síndrome de abstinencia aguda de sustancias",
    "definition": "Secuelas graves multifactoriales siguientes cese abrupto de un adictivo compuesto.",
    "relatedFactors": [
      "Dependencia desarrollada a sustancias adictivas",
      "Uso excesivo de una sustancia adictiva a lo largo del tiempo",
      "Desnutrición",
      "Cese repentino de una sustancia adictiva"
    ],
    "defaultNocCode": "1402",
    "defaultNicCode": "4510",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 3. Estrés neuroconductual"
  },
  {
    "id": "nanda_00259",
    "code": "00259",
    "name": "Riesgo de síndrome de abstinencia aguda de sustancias",
    "definition": "Susceptible a secuelas multifactoriales graves tras el cese abrupto de un compuesto adictivo, que puede comprometer la salud.",
    "relatedFactors": [
      "Dependencia desarrollada a sustancias adictivas",
      "Uso excesivo de una sustancia adictiva a lo largo del tiempo",
      "Desnutrición",
      "Cese repentino de una sustancia adictiva"
    ],
    "defaultNocCode": "1402",
    "defaultNicCode": "4510",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 3. Estrés neuroconductual"
  },
  {
    "id": "nanda_00009",
    "code": "00009",
    "name": "Disreflexia autonómica",
    "definition": "Respuesta simpática desinhibida y potencialmente mortal del sistema nervioso a un estímulo nocivo después de una lesión de la médula espinal en la séptima vértebra torácica (T7) o encima.",
    "relatedFactors": [
      "Distensión intestinal",
      "Estreñimiento",
      "Difficulto al paso de las heces Estimulación digital",
      "Estimulación cutánea",
      "Irritación de la piel"
    ],
    "defaultNocCode": "0802",
    "defaultNicCode": "2300",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 3. Estrés neuroconductual"
  },
  {
    "id": "nanda_00010",
    "code": "00010",
    "name": "Riesgo de disreflexia autonómica",
    "definition": "Susceptible a una respuesta desinhibida y potencialmente mortal del sistema nervioso simpático después de un choque espinal, en un individuo con lesión de la médula espinal o lesión en la sexta vértebra torácica (T6) o superior (se ha demostrado en pacientes con lesiones en la séptima vértebra torácica). [T7] y la octava vértebra torácica [T8]), que puede comprometer la salud.",
    "relatedFactors": [
      "Distensión intestinal",
      "Estreñimiento",
      "Difficulto al paso de las heces Estimulación digital",
      "Estimulación cutánea",
      "Irritación de la piel"
    ],
    "defaultNocCode": "0802",
    "defaultNicCode": "2300",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 3. Estrés neuroconductual"
  },
  {
    "id": "nanda_00264",
    "code": "00264",
    "name": "Síndrome de abstinencia neonatal",
    "definition": "Una constelación de síntomas de abstinencia observados en recién nacidos como resultado de exposición en el útero a sustancias adictivas, o como consecuencia de postnatal manejo farmacológico del dolor.",
    "relatedFactors": [
      "Dependencia desarrollada a sustancias adictivas",
      "Uso excesivo de una sustancia adictiva a lo largo del tiempo",
      "Desnutrición",
      "Cese repentino de una sustancia adictiva"
    ],
    "defaultNocCode": "0118",
    "defaultNicCode": "6800",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 3. Estrés neuroconductual"
  },
  {
    "id": "nanda_00116",
    "code": "00116",
    "name": "Comportamiento infantil desorganizado",
    "definition": "Desintegración de los fisiológico y neuroconductual sistemas de marcha.",
    "relatedFactors": [
      "El cuidador malinterpreta las señales del bebé Sobreestimulación ambiental",
      "Intolerancia alimentaria",
      "Conocimiento inadecuado por parte del cuidador de las señales conductuales",
      "Contención inadecuada dentro del medio ambiente",
      "Entorno físico inadecuado"
    ],
    "defaultNocCode": "0101",
    "defaultNicCode": "6800",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 3. Estrés neuroconductual"
  },
  {
    "id": "nanda_00115",
    "code": "00115",
    "name": "Riesgo de comportamiento infantil desorganizado",
    "definition": "Susceptible a la desintegración en el patrón de modulación de los sistemas de funcionamiento fisiológico y neuroconductual, lo que puede comprometer la salud.",
    "relatedFactors": [
      "El cuidador malinterpreta las señales del bebé Sobreestimulación ambiental",
      "Intolerancia alimentaria",
      "Conocimiento inadecuado por parte del cuidador de las señales conductuales",
      "Contención inadecuada dentro del medio ambiente",
      "Entorno físico inadecuado"
    ],
    "defaultNocCode": "0101",
    "defaultNicCode": "6800",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 3. Estrés neuroconductual"
  },
  {
    "id": "nanda_00117",
    "code": "00117",
    "name": "Preparación para una mejora organizada comportamiento infantil",
    "definition": "Un patrón integrado de modulación de los sistemas de funcionamiento fisiológico y neuroconductual, que puede fortalecerse.",
    "relatedFactors": [
      "El cuidador principal expresa su deseo de mejorar el reconocimiento de señales",
      "El cuidador principal expresa su deseo de mejorar el reconocimiento del bebé.'s comportamientos de autorregulación",
      "El cuidador principal expresa su deseo de mejorar el entorno condiciones"
    ],
    "defaultNocCode": "0101",
    "defaultNicCode": "6800",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "class": "Clase 3. Estrés neuroconductual"
  },
  {
    "id": "nanda_00068",
    "code": "00068",
    "name": "Preparación para un mayor bienestar espiritual",
    "definition": "Un patrón de integración de significado y propósito en la vida a través de conexiones con uno mismo, los demás, el mundo y / o un poder más grande que uno mismo, que puede ser fortificado.",
    "relatedFactors": [
      "Expresa el deseo de mejorar la aceptación.",
      "Expresa el deseo de mejorar la conexión con la naturaleza.",
      "Expresa el deseo de mejorar la participación en prácticas religiosas.",
      "Expresa el deseo de mejorar la satisfacción con la vida.",
      "Expresa el deseo de mejorar el servicio a los demás."
    ],
    "defaultNocCode": "2001",
    "defaultNicCode": "5420",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 10. Principios de vida",
    "class": "Clase 2. Creencias"
  },
  {
    "id": "nanda_00184",
    "code": "00184",
    "name": "Disposición para mejorar la toma de decisiones",
    "definition": "Un patrón de elección de un curso de acción para alcanzar las metas relacionadas con la salud a corto y largo plazo, que pueden fortalecerse.",
    "relatedFactors": [
      "Expresa el deseo de mejorar la congruencia de decisiones con el objetivo sociocultural.",
      "Expresa el deseo de mejorar el análisis de riesgos y beneficios de las decisiones.",
      "Expresa el deseo de mejorar la comprensión de las opciones.",
      "Expresa el deseo de mejorar la congruencia de las decisiones con el objetivo.",
      "Expresa su deseo de mejorar el uso de evidencia confiable para tomar decisiones."
    ],
    "defaultNocCode": "0900",
    "defaultNicCode": "5250",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 10. Principios de vida",
    "class": "Clase 3. Congruencia entre valores / creencias / acciones"
  },
  {
    "id": "nanda_00083",
    "code": "00083",
    "name": "Conflicto decisional",
    "definition": "Incertidumbre sobre el curso de acción que se debe tomar cuando la elección entre acciones en competencia implica riesgo, pérdida o desafío a los valores y creencias.",
    "relatedFactors": [
      "Conflicto con la obligación moral",
      "Fuentes de información conflictivas",
      "Información inadecuada",
      "Apoyo social inadecuado",
      "Peligro percibido para el sistema de valores"
    ],
    "defaultNocCode": "0900",
    "defaultNicCode": "5250",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 10. Principios de vida",
    "class": "Clase 3. Congruencia entre valores / creencias / acciones"
  },
  {
    "id": "nanda_00242",
    "code": "00242",
    "name": "Toma de decisiones emancipada deteriorada",
    "definition": "Un proceso de elección de una decisión sobre el cuidado de la salud que no incluye el conocimiento personal y / o la consideración de las normas sociales, o que no ocurre en un ambiente flexible, lo que resulta en una insatisfacción decisiva.",
    "relatedFactors": [
      "Disminución de la comprensión de las opciones de atención médica disponibles.",
      "Difficulto verbalizar adecuadamente las percepciones sobre las opciones de atención médica",
      "Privacidad inadecuada para discutir abiertamente las opciones de atención médica",
      "Autoconfianza inadecuada en la toma de decisiones.",
      "Insuffitiempo suficiente para discutir las opciones de atención médica"
    ],
    "defaultNocCode": "0900",
    "defaultNicCode": "5250",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 10. Principios de vida",
    "class": "Clase 3. Congruencia entre valores / creencias / acciones"
  },
  {
    "id": "nanda_00244",
    "code": "00244",
    "name": "Riesgo de toma de decisiones emancipada deficiente",
    "definition": "Susceptible a un proceso de elección de una decisión de atención médica que no incluye el conocimiento personal y / o la consideración de las normas sociales, o no incluye ocurrir en un entorno flexible, lo que resulta en insatisfacción decisional.",
    "relatedFactors": [
      "Disminución de la comprensión de las opciones de atención médica disponibles.",
      "Información inadecuada sobre las opciones de atención médica.",
      "Difficulto verbalizar adecuadamente las percepciones sobre las opciones de atención médica",
      "Privacidad inadecuada para discutir abiertamente las opciones de atención médica",
      "Autoconfianza inadecuada en la toma de decisiones."
    ],
    "defaultNocCode": "0900",
    "defaultNicCode": "5250",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 10. Principios de vida",
    "class": "Clase 3. Congruencia entre valores / creencias / acciones"
  },
  {
    "id": "nanda_00243",
    "code": "00243",
    "name": "Disponibilidad para una toma de decisiones emancipada mejorada",
    "definition": "Un proceso de elección de una decisión de atención médica que incluye conocimiento personal. y / o consideración de las normas sociales, que se puede fortalecer.",
    "relatedFactors": [
      "Expresa su deseo de mejorar la capacidad de elegir opciones de atención médica que mejoren el estilo de vida actual.",
      "Expresa el deseo de mejorar la capacidad de implementar la opción de atención médica elegida.",
      "Expresa el deseo de mejorar la confianza en la toma de decisiones.",
      "Expresa el deseo de mejorar la capacidad para comprender todas las opciones de atención médica disponibles.",
      "Expresa el deseo de mejorar la privacidad para discutir las opciones de atención médica."
    ],
    "defaultNocCode": "0900",
    "defaultNicCode": "5250",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 10. Principios de vida",
    "class": "Clase 3. Congruencia entre valores / creencias / acciones"
  },
  {
    "id": "nanda_00175",
    "code": "00175",
    "name": "Angustia moral",
    "definition": "Respuesta a la imposibilidad de realizar uno'es una decisión ética o moral elegida y / o actuar.",
    "relatedFactors": [
      "Conflicto entre tomadores de decisiones",
      "Difficultivar la toma de decisiones sobre el final de la vida",
      "Limitación de tiempo para la toma de decisiones",
      "Valores incongruentes con las normas culturales.",
      "Información disponible para conflictos en la toma de decisiones"
    ],
    "defaultNocCode": "1201",
    "defaultNicCode": "5420",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 10. Principios de vida",
    "class": "Clase 3. Congruencia entre valores / creencias / acciones"
  },
  {
    "id": "nanda_00169",
    "code": "00169",
    "name": "Religiosidad deteriorada",
    "definition": "Capacidad deficiente para ejercer la confianza en las creencias y / o participar en los rituales de un tradición de fe particular.",
    "relatedFactors": [
      "Ansiedad",
      "Barrera cultural para practicar la religión",
      "Sintomas depresivos",
      "Limitaciones ambientales",
      "Apoyo social inadecuado"
    ],
    "defaultNocCode": "2001",
    "defaultNicCode": "5420",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 10. Principios de vida",
    "class": "Clase 3. Congruencia entre valores / creencias / acciones"
  },
  {
    "id": "nanda_00170",
    "code": "00170",
    "name": "Riesgo de religiosidad deteriorada",
    "definition": "Susceptible a una capacidad disminuida para confiar en las creencias religiosas y / o participar en rituales de una salud fe tradición, que puede comprometer particular.",
    "relatedFactors": [
      "Ansiedad",
      "Barrera cultural para practicar la religión",
      "Sintomas depresivos",
      "Limitaciones ambientales",
      "Apoyo social inadecuado"
    ],
    "defaultNocCode": "2001",
    "defaultNicCode": "5420",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 10. Principios de vida",
    "class": "Clase 3. Congruencia entre valores / creencias / acciones"
  },
  {
    "id": "nanda_00171",
    "code": "00171",
    "name": "Preparación para una religiosidad mejorada",
    "definition": "Un patrón de dependencia de creencias religiosas y / o participación en rituales de una tradición religiosa particular, que puede fortalecerse.",
    "relatedFactors": [
      "Expresa el deseo de mejorar la conexión con un líder religioso.",
      "Expresa el deseo de mejorar el perdón.",
      "Expresa el deseo de mejorar la participación en experiencias religiosas.",
      "Expresa el deseo de mejorar la participación en prácticas religiosas.",
      "Expresa el deseo de restablecer las costumbres religiosas."
    ],
    "defaultNocCode": "2001",
    "defaultNicCode": "5420",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 10. Principios de vida",
    "class": "Clase 3. Congruencia entre valores / creencias / acciones"
  },
  {
    "id": "nanda_00066",
    "code": "00066",
    "name": "Angustia espiritual",
    "definition": "Un estado de suffering relacionado con la capacidad deficiente para integrar significado y propósito en la vida a través de conexiones de con uno mismo, los demás, el mundo y / o un poder más grande que uno mismo.",
    "relatedFactors": [
      "Ritual religioso alterado",
      "Práctica espiritual alterada",
      "Ansiedad",
      "Barrera para experimentar el amor",
      "Conflicto cultural"
    ],
    "defaultNocCode": "1201",
    "defaultNicCode": "5420",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 10. Principios de vida",
    "class": "Clase 3. Congruencia entre valores / creencias / acciones"
  },
  {
    "id": "nanda_00067",
    "code": "00067",
    "name": "Riesgo de angustia espiritual",
    "definition": "Susceptible a un estado de suffering relacionado con la capacidad deficiente para integrar significado y propósito en la vida a través de conexiones con uno mismo, los demás, el mundo, y / o un poder superior a uno mismo, que puede comprometer la salud.",
    "relatedFactors": [
      "Ritual religioso alterado",
      "Práctica espiritual alterada",
      "Ansiedad",
      "Barrera para experimentar el amor",
      "Conflicto cultural"
    ],
    "defaultNocCode": "1201",
    "defaultNicCode": "5420",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 10. Principios de vida",
    "class": "Clase 3. Congruencia entre valores / creencias / acciones"
  },
  {
    "id": "nanda_00004",
    "code": "00004",
    "name": "Riesgo de infección",
    "definition": "Susceptible a la invasión y multiplicación de organismos patógenos, que puede comprometer la salud.",
    "relatedFactors": [
      "Diffimanejo de dispositivos invasivos a largo plazo",
      "Diffimanejo del cuidado de heridas",
      "Motilidad gastrointestinal disfuncional",
      "Alimentación con fórmula exclusiva",
      "Integridad de la piel deteriorada"
    ],
    "defaultNocCode": "1902",
    "defaultNicCode": "6520",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 1. Infección"
  },
  {
    "id": "nanda_00266",
    "code": "00266",
    "name": "Riesgo de infección del sitio quirúrgico",
    "definition": "Susceptible a la invasión de organismos patógenos en el sitio quirúrgico, lo que puede comprometer la salud.",
    "relatedFactors": [
      "Alcoholismo",
      "Obesidad",
      "De fumar",
      "Personas expuestas a temperaturas ambiente frías",
      "Personas expuestas a un número excesivo de personal durante el procedimiento quirúrgico"
    ],
    "defaultNocCode": "1902",
    "defaultNicCode": "6520",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 1. Infección"
  },
  {
    "id": "nanda_00031",
    "code": "00031",
    "name": "Inefflimpieza efectiva de las vías respiratorias",
    "definition": "Capacidad reducida para eliminar secreciones u obstrucciones del tracto respiratorio para Mantenga despejadas las vías respiratorias.",
    "relatedFactors": [
      "Deshidración",
      "Moco excesivo",
      "Exposición a sustancias nocivas",
      "Miedo al dolor",
      "Cuerpo extraño en las vías respiratorias"
    ],
    "defaultNocCode": "0410",
    "defaultNicCode": "3160",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00039",
    "code": "00039",
    "name": "Riesgo de aspiración",
    "definition": "Susceptible a la entrada de secreciones gastrointestinales, secreciones orofaríngeas, sólidos o líquidos a los conductos traqueobronquiales, lo que puede comprometer la salud.",
    "relatedFactors": [
      "Barrera para elevar la parte superior del cuerpo",
      "Disminución de la motilidad gastrointestinal",
      "Difficulto tragando",
      "Tubo de nutrición enteral desplazado",
      "Conocimiento inadecuado de los factores modificables."
    ],
    "defaultNocCode": "1918",
    "defaultNicCode": "3200",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00206",
    "code": "00206",
    "name": "Riesgo de hemorragia",
    "definition": "Susceptible a una disminución del volumen sanguíneo, que puede comprometer la salud.",
    "relatedFactors": [
      "Conocimiento inadecuado de las precauciones hemorrágicas."
    ],
    "defaultNocCode": "0413",
    "defaultNicCode": "4160",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00048",
    "code": "00048",
    "name": "Dentadura deteriorada",
    "definition": "Interrupción en el patrón de desarrollo / erupción del diente o integridad estructural de dientes individuales.",
    "relatedFactors": [
      "Diffiacceso a la atención dental",
      "Difficulto que realiza el autocuidado oral",
      "Ingesta excesiva de flúor",
      "Uso excesivo de agentes abrasivos de higiene bucal.",
      "Uso indebido habitual de la sustancia colorante"
    ],
    "defaultNocCode": "0501",
    "defaultNicCode": "1720",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00219",
    "code": "00219",
    "name": "Riesgo de ojo seco",
    "definition": "Susceptible a una película lagrimal inadecuada, que puede causar molestias en los ojos y / o dañar la superficie ocular, lo que puede comprometer la salud.",
    "relatedFactors": [
      "Aire acondicionado",
      "La contaminación del aire",
      "CaliforniaffConsumo de energía",
      "Disminución de la frecuencia de parpadeo",
      "Viento excesivo"
    ],
    "defaultNocCode": "0802",
    "defaultNicCode": "1650",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00277",
    "code": "00277",
    "name": "Ineffautocontrol eficaz del ojo seco",
    "definition": "Manejo insatisfactorio de los síntomas, régimen de tratamiento, físico, psíquico Consecuencias sociales y espirituales con una película lagrimal inadecuada. y cambios de estilo de vida inherentes a la vida",
    "relatedFactors": [
      "Difficulto realizando el cuidado de los párpados",
      "Difficulty reduciendo caff eine consumo",
      "Mantenimiento inadecuado de la humedad del aire.",
      "Uso inadecuado del dispositivo de cierre de párpados",
      "Uso inadecuado de la medicación prescrita"
    ],
    "defaultNocCode": "0802",
    "defaultNicCode": "1650",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00261",
    "code": "00261",
    "name": "Riesgo de sequedad de boca",
    "definition": "Susceptible a molestias o daños en la mucosa bucal por disminución de la cantidad o calidad de la saliva para humedecer la mucosa, lo que puede comprometer la salud.",
    "relatedFactors": [
      "Deshidración",
      "Sintomas depresivos",
      "Estrés excesivo",
      "Emoción",
      "De fumar"
    ],
    "defaultNocCode": "0501",
    "defaultNicCode": "1720",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00303",
    "code": "00303",
    "name": "Riesgo de caídas de adultos",
    "definition": "Adulto susceptible de experimentar un evento que resulte en descansar inadvertidamente en el suelo, piso u otro nivel inferior, lo que puede comprometer salud.",
    "relatedFactors": [
      "Dolor musculoesquelético crónico",
      "Disminución de la fuerza de las extremidades inferiores.",
      "Deshidración",
      "Diarrea",
      "Desmayo al extender el cuello"
    ],
    "defaultNocCode": "1909",
    "defaultNicCode": "6490",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00306",
    "code": "00306",
    "name": "Riesgo de caídas de niños",
    "definition": "Niño susceptible de experimentar un evento que resulte en descansar inadvertidamente tentativamente en el suelo, piso u otra nivel inferior, que puede comprometer salud.",
    "relatedFactors": [
      "Cambia pañales en superficies elevadas",
      "Agotamiento",
      "No bloquea las ruedas del equipo infantil",
      "Conocimiento inadecuado de los cambios en las etapas del desarrollo.",
      "Supervisión inadecuada del niño"
    ],
    "defaultNocCode": "1909",
    "defaultNicCode": "6490",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00035",
    "code": "00035",
    "name": "Riesgo de lesiones",
    "definition": "Susceptible a daños físicos debido a las condiciones ambientales que interactúan con el individuo.'s recursos adaptativos y defensivos, que pueden comprometer mise salud.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Exposición a químicos tóxicos",
      "Nivel de inmunización dentro de la comunidad",
      "Conocimiento inadecuado de los factores modificables.",
      "Desnutrición"
    ],
    "defaultNocCode": "1908",
    "defaultNicCode": "6610",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00245",
    "code": "00245",
    "name": "Riesgo de lesión de la córnea",
    "definition": "Susceptible a infección o lesión inflamatoria en el tejido corneal que puedeffect capas superficiales o profundas, que pueden comprometer la salud.",
    "relatedFactors": [
      "Exposición del globo ocular",
      "Conocimiento inadecuado de los factores modificables."
    ],
    "defaultNocCode": "0802",
    "defaultNicCode": "1650",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00320",
    "code": "00320",
    "name": "Lesión del complejo areolar-pezón",
    "definition": "Daño localizado al complejo areolar-pezón como resultado de la lactancia proceso.",
    "relatedFactors": [
      "Congestión mamaria",
      "Areola endurecida",
      "Uso inadecuado de la bomba de leche",
      "Enganche inadecuado",
      "Soporte materno inadecuado de la mano del pecho"
    ],
    "defaultNocCode": "0700",
    "defaultNicCode": "3500",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00321",
    "code": "00321",
    "name": "Riesgo de lesión del complejo areolar-pezón",
    "definition": "Susceptible a daño localizado en el complejo areolar-pezón como resultado de la proceso de lactancia.",
    "relatedFactors": [
      "Congestión mamaria",
      "Areola endurecida",
      "Uso inadecuado de la bomba de leche",
      "Enganche inadecuado",
      "Soporte materno inadecuado de la mano del pecho"
    ],
    "defaultNocCode": "0700",
    "defaultNicCode": "3500",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00250",
    "code": "00250",
    "name": "Riesgo de lesión del tracto urinario",
    "definition": "Susceptible de dañar las estructuras del tracto urinario por el uso de catéteres, que puede comprometer la salud.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Confusión",
      "Conocimiento inadecuado del cuidador sobre el cuidado del catéter urinario",
      "Manifestaciones neuroconductuales",
      "Obesidad"
    ],
    "defaultNocCode": "0503",
    "defaultNicCode": "0590",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00087",
    "code": "00087",
    "name": "Riesgo de lesión por posicionamiento perioperatorio",
    "definition": "Susceptible a turas anatómicas inadvertidas o equipos de posicionamiento utilizados que puedan comprometer la salud. y cambios físicos como resultado de pos durante un procedimiento quirúrgico / invasivo,",
    "relatedFactors": [
      "Disminución de la fuerza muscular",
      "Deshidratación",
      "Factores identificados mediante una herramienta de detección estandarizada y validada",
      "Disponibilidad inadecuada de equipos para personas con obesidad",
      "Acceso inadecuado al equipo apropiado"
    ],
    "defaultNocCode": "1908",
    "defaultNicCode": "2920",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00220",
    "code": "00220",
    "name": "Riesgo de lesión térmica",
    "definition": "Susceptible a daños por temperaturas extremas en la piel y las membranas mucosas, que puede comprometer la salud.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Fatiga",
      "Conocimiento inadecuado del cuidador sobre las precauciones de seguridad.",
      "Ropa protectora inadecuada",
      "Supervisión inadecuada"
    ],
    "defaultNocCode": "0800",
    "defaultNicCode": "3900",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00045",
    "code": "00045",
    "name": "Integridad alterada de la mucosa oral",
    "definition": "Lesión en los labios, tejidos blandos, cavidad bucal y / u orofaringe.",
    "relatedFactors": [
      "Consumo de alcohol",
      "Disfunción congnitiva",
      "Disminución de la salivación",
      "Deshidración",
      "Sintomas depresivos"
    ],
    "defaultNocCode": "0501",
    "defaultNicCode": "1720",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00247",
    "code": "00247",
    "name": "Riesgo de deterioro de la integridad de la mucosa oral",
    "definition": "Susceptible a lesiones en los labios, tejidos blandos, cavidad bucal y / u orofaringe, que puede comprometer la salud.",
    "relatedFactors": [
      "Consumo de alcohol",
      "Disfunción congnitiva",
      "Disminución de la salivación",
      "Deshidración",
      "Sintomas depresivos"
    ],
    "defaultNocCode": "0501",
    "defaultNicCode": "1720",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00086",
    "code": "00086",
    "name": "Riesgo de disfunción neurovascular periférica",
    "definition": "Susceptible a la interrupción de la circulación, la sensación y el movimiento de un extremidad, que puede comprometer la salud.",
    "relatedFactors": [
      "Fracturas de hueso",
      "Quemaduras",
      "Inmovilización",
      "Compresión mecánica",
      "Cirugía Ortopédica"
    ],
    "defaultNocCode": "0407",
    "defaultNicCode": "4060",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00038",
    "code": "00038",
    "name": "Riesgo de traumatismo físico",
    "definition": "Susceptible a lesiones físicas de aparición repentina y gravedad que requieran atención inmediata.",
    "relatedFactors": [
      "Ausencia de dispositivo de llamada de auxilio",
      "Ausencia de puerta de escalera",
      "Ausencia de reja de ventana",
      "Baño con agua muy caliente",
      "Cama en posición alta"
    ],
    "defaultNocCode": "1908",
    "defaultNicCode": "6610",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00213",
    "code": "00213",
    "name": "Riesgo de traumatismo vascular",
    "definition": "Susceptible de dañar la vena y los tejidos circundantes. relacionados con la pres presencia de un catéter y / o soluciones infundidas, que puede comprometer la salud.",
    "relatedFactors": [
      "Sitio de inserción disponible inadecuado",
      "Período prolongado de tiempo que el catéter está colocado"
    ],
    "defaultNocCode": "0407",
    "defaultNicCode": "4060",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00312",
    "code": "00312",
    "name": "Lesión por presión en adultos",
    "definition": "Daño localizado en la piel y / o el tejido subyacente de un adulto, como resultado de la presión o la presión en combinación con cizallamiento (úlcera por presión europea Panel Asesor, 2019).",
    "relatedFactors": [
      "Microclima alterado entre la piel y la superficie de apoyo.",
      "Humedad excesiva",
      "Acceso inadecuado al equipo apropiado",
      "Acceso inadecuado a servicios de salud adecuados",
      "Disponibilidad inadecuada de equipos para personas con obesidad"
    ],
    "defaultNocCode": "0700",
    "defaultNicCode": "3584",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00304",
    "code": "00304",
    "name": "Riesgo de lesiones por presión en adultos",
    "definition": "Adulto susceptible a daños localizados en la piel y / o el tejido subyacente, como resultado de la presión, o la presión en combinación con el cizallamiento, lo que puede comprometer la salud (Panel Asesor Europeo de Úlceras por Presión, 2019).",
    "relatedFactors": [
      "Microclima alterado entre la piel y la superficie de apoyo.",
      "Humedad excesiva",
      "Acceso inadecuado al equipo apropiado",
      "Acceso inadecuado a servicios de salud adecuados",
      "Disponibilidad inadecuada de equipos para personas con obesidad"
    ],
    "defaultNocCode": "0700",
    "defaultNicCode": "3584",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00313",
    "code": "00313",
    "name": "Lesión por presión infantil",
    "definition": "Niños o adolescentes susceptibles a daños localizados en la piel y / o el tejido subyacente, como resultado de la presión, o la presión en combinación con el cizallamiento, lo que puede comprometer la salud (Panel Asesor Europeo de Úlceras por Presión, 2019).",
    "relatedFactors": [
      "Microclima alterado entre la piel y la superficie de apoyo.",
      "Difficulty para que el cuidador levante al paciente completamente off cama",
      "Humedad excesiva",
      "Acceso inadecuado al equipo apropiado",
      "Acceso inadecuado a servicios de salud adecuados"
    ],
    "defaultNocCode": "0700",
    "defaultNicCode": "3584",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00286",
    "code": "00286",
    "name": "Riesgo de lesiones por presión infantil",
    "definition": "Niños o adolescentes susceptibles a daños localizados en la piel y / o el tejido subyacente, como resultado de la presión, o la presión en combinación con el cizallamiento, lo que puede comprometer la salud (Panel Asesor Europeo de Úlceras por Presión, 2019).",
    "relatedFactors": [
      "Microclima alterado entre la piel y la superficie de apoyo.",
      "Difficulty para que el cuidador levante al paciente completamente off cama",
      "Humedad excesiva",
      "Acceso inadecuado al equipo apropiado",
      "Acceso inadecuado a servicios de salud adecuados"
    ],
    "defaultNocCode": "0700",
    "defaultNicCode": "3584",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00287",
    "code": "00287",
    "name": "Lesión por presión neonatal",
    "definition": "Daño localizado en la piel y / o tejido subyacente de un neonato, como resultado presión, o presión en combinación con cizallamiento (úlcera por presión europea Panel Asesor, 2019).",
    "relatedFactors": [
      "Microclima alterado entre la piel y la superficie de apoyo.",
      "Humedad excesiva",
      "Acceso inadecuado al equipo apropiado",
      "Acceso inadecuado a servicios de salud adecuados",
      "Acceso inadecuado a suministros apropiados"
    ],
    "defaultNocCode": "0700",
    "defaultNicCode": "3584",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00288",
    "code": "00288",
    "name": "Riesgo de lesión por presión neonatal",
    "definition": "Recién nacido susceptible a daños localizados en la piel y / o el tejido subyacente, como resultado de la presión, o la presión en combinación con el cizallamiento, lo que puede comprometer la salud (Panel Asesor Europeo de Úlceras por Presión, 2019).",
    "relatedFactors": [
      "Microclima alterado entre la piel y la superficie de apoyo.",
      "Humedad excesiva",
      "Acceso inadecuado al equipo apropiado",
      "Acceso inadecuado a servicios de salud adecuados",
      "Acceso inadecuado a suministros apropiados"
    ],
    "defaultNocCode": "0700",
    "defaultNicCode": "3584",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00205",
    "code": "00205",
    "name": "Riesgo de shock",
    "definition": "Susceptible a un flujo sanguíneo inadecuado a los tejidos que puede conducir a una disfunción celular, lo que puede comprometer la salud.",
    "relatedFactors": [
      "Sangrado",
      "Volumen de líquido deficiente",
      "Hipertermia",
      "Hipotermia",
      "Hipoxemia"
    ],
    "defaultNocCode": "0401",
    "defaultNicCode": "4250",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00046",
    "code": "00046",
    "name": "Integridad de la piel deteriorada",
    "definition": "Epidermis y / o dermis alterada.",
    "relatedFactors": [
      "Humedad excesiva",
      "Excreciones",
      "Humedad",
      "Hipertermia",
      "Hipotermia"
    ],
    "defaultNocCode": "0700",
    "defaultNicCode": "3584",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00047",
    "code": "00047",
    "name": "Riesgo de deterioro de la integridad de la piel",
    "definition": "Susceptible a alteraciones en la salud de la epidermis. y / o dermis, que pueden comprometer",
    "relatedFactors": [
      "Humedad excesiva",
      "Excreciones",
      "Humedad",
      "Hipertermia",
      "Hipotermia"
    ],
    "defaultNocCode": "0700",
    "defaultNicCode": "3584",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00156",
    "code": "00156",
    "name": "Riesgo de muerte súbita del lactante",
    "definition": "Lactante susceptible a una muerte imprevista.",
    "relatedFactors": [
      "Atención prenatal retrasada",
      "Atención prenatal inadecuada",
      "Falta de atención al humo de segunda mano",
      "Bebé <4 meses colocado en dispositivos para sentarse para el sueño de rutina",
      "Sobrecalentamiento infantil"
    ],
    "defaultNocCode": "1908",
    "defaultNicCode": "6610",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00036",
    "code": "00036",
    "name": "Riesgo de suffubicación",
    "definition": "Susceptible a una disponibilidad inadecuada de aire para la inhalación, que puede comprometer mise salud.",
    "relatedFactors": [
      "Acceso a frigorífico / congelador vacío",
      "Disfunción congnitiva",
      "Comer grandes bocados de comida",
      "Alteración emocional excesiva",
      "Fuga de gas"
    ],
    "defaultNocCode": "0410",
    "defaultNicCode": "3160",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00100",
    "code": "00100",
    "name": "Recuperación quirúrgica retrasada",
    "definition": "Ampliación del número de días postoperatorios necesarios para iniciar y realizar actividades que mantengan la vida, la salud y el bienestar.",
    "relatedFactors": [
      "Delirio",
      "Movilidad física alterada",
      "Aumento del nivel de glucosa en sangre",
      "Desnutrición",
      "Respuesta emocional negativa al resultado quirúrgico"
    ],
    "defaultNocCode": "2301",
    "defaultNicCode": "2380",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00246",
    "code": "00246",
    "name": "Riesgo de recuperación quirúrgica retrasada",
    "definition": "Susceptible a una extensión del número de días posoperatorios necesarios para iniciar y realizar actividades que mantengan la vida, la salud y el bienestar, que puede comprometer la salud.",
    "relatedFactors": [
      "Delirio",
      "Movilidad física alterada",
      "Aumento del nivel de glucosa en sangre",
      "Desnutrición",
      "Respuesta emocional negativa al resultado quirúrgico"
    ],
    "defaultNocCode": "2301",
    "defaultNicCode": "2380",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00044",
    "code": "00044",
    "name": "Integridad tisular deteriorada",
    "definition": "Daño a la membrana mucosa, córnea, sistema tegumentario, muscular fascia, músculo, tendón, hueso, cartílago, articulación cápsula y / o ligamento.",
    "relatedFactors": [
      "Excreciones",
      "Humedad",
      "Hipertermia",
      "Hipotermia",
      "Uso inadecuado de agente químico"
    ],
    "defaultNocCode": "0700",
    "defaultNicCode": "3584",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00248",
    "code": "00248",
    "name": "Riesgo de deterioro de la integridad del tejido",
    "definition": "Susceptible a daños en la membrana mucosa, córnea, tem, fascia muscular, músculo, tendón, hueso, cartílago, articulación sistema tegumentario cápsula y / o lig amento, que puede comprometer la salud.",
    "relatedFactors": [
      "Excreciones",
      "Humedad",
      "Hipertermia",
      "Hipotermia",
      "Uso inadecuado de agente químico"
    ],
    "defaultNocCode": "0700",
    "defaultNicCode": "3584",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 2. Lesión física"
  },
  {
    "id": "nanda_00272",
    "code": "00272",
    "name": "Riesgo de mutilación genital femenina",
    "definition": "Susceptible a la ablación total o parcial de los genitales externos femeninos y otras lesiones de los genitales, ya sea por motivos culturales, religiosos o por cualquier otro motivo no terapéutico, que puedan comprometer la salud.",
    "relatedFactors": [
      "Falta de conocimiento familiar sobre el impacto de la práctica en la salud física.",
      "Falta de conocimiento familiar sobre el impacto de la práctica en la salud psicosocial",
      "Falta de conocimiento de la familia sobre el impacto de la práctica en la salud reproductiva"
    ],
    "defaultNocCode": "1908",
    "defaultNicCode": "6610",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 3. Violencia"
  },
  {
    "id": "nanda_00138",
    "code": "00138",
    "name": "Riesgo de violencia dirigida por otros",
    "definition": "Susceptible a comportamientos en los que un individuo demuestra que el o ella puede ser física, emocional y / o sexualmente perjudicial para los demás.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Fácil acceso al arma",
      "Ineffcontrol efectivo de los impulsos",
      "Lenguaje corporal negativo",
      "Patrón de comportamiento antisocial agresivo"
    ],
    "defaultNocCode": "1908",
    "defaultNicCode": "6610",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 3. Violencia"
  },
  {
    "id": "nanda_00140",
    "code": "00140",
    "name": "Riesgo de violencia autodirigida",
    "definition": "Susceptible a comportamientos en los que un individuo demuestra que que el o ella puede ser física, emocional y / o sexualmente dañino para sí mismo.",
    "relatedFactors": [
      "Señales conductuales de intento suicida",
      "Conflicto sobre la orientación sexual",
      "Conflicto en las relaciones interpersonales",
      "Preocupación laboral",
      "Participación en actos sexuales autoeróticos"
    ],
    "defaultNocCode": "1908",
    "defaultNicCode": "6610",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 3. Violencia"
  },
  {
    "id": "nanda_00151",
    "code": "00151",
    "name": "Automutilación",
    "definition": "Comportamiento autodestructivo deliberado que causa daño tisular con la intención de causar daño no fatal para lograr el alivio de la tensión.",
    "relatedFactors": [
      "Ausencia de confidente de la familia",
      "Imagen corporal alterada",
      "Disociación",
      "Relaciones interpersonales perturbadas",
      "Trastorno de la alimentación"
    ],
    "defaultNocCode": "1408",
    "defaultNicCode": "4350",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 3. Violencia"
  },
  {
    "id": "nanda_00139",
    "code": "00139",
    "name": "Riesgo de automutilación",
    "definition": "Susceptible a un comportamiento autodestructivo deliberado que cause daño tisular con la intención de causar daño no fatal a lograr el alivio de la tensión.",
    "relatedFactors": [
      "Ausencia de confidente de la familia",
      "Imagen corporal alterada",
      "Disociación",
      "Relaciones interpersonales perturbadas",
      "Trastorno de la alimentación"
    ],
    "defaultNocCode": "1408",
    "defaultNicCode": "4350",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 3. Violencia"
  },
  {
    "id": "nanda_00289",
    "code": "00289",
    "name": "Riesgo de comportamiento suicida",
    "definition": "Susceptible a actos autolesivos asociados con alguna intención de morir.",
    "relatedFactors": [
      "Apatía",
      "Difficulto pidiendo ayuda",
      "Difficulto hacer frente a un desempeño insatisfactorio",
      "Difficulto expresando sentimientos",
      "Ineffautocontrol efectivo del dolor crónico"
    ],
    "defaultNocCode": "1400",
    "defaultNicCode": "6610",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 3. Violencia"
  },
  {
    "id": "nanda_00181",
    "code": "00181",
    "name": "Contaminación",
    "definition": "Exposición a contaminantes ambientales en dosis sufficient para causar efectos adversos salud effects.",
    "relatedFactors": [
      "Dermatológico effefectos de la exposición a plaguicidas",
      "E gastrointestinalffefectos de la exposición a plaguicidas",
      "E neurológicoffefectos de la exposición a plaguicidas",
      "E pulmonarffefectos de la exposición a plaguicidas",
      "Renal effefectos de la exposición a plaguicidas"
    ],
    "defaultNocCode": "1908",
    "defaultNicCode": "6610",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 4. Peligros ambientales"
  },
  {
    "id": "nanda_00180",
    "code": "00180",
    "name": "Riesgo de contaminación",
    "definition": "Susceptible a la exposición a contaminantes ambientales, que pueden comprometer mise salud.",
    "relatedFactors": [
      "Pisos alfombrados",
      "Contaminación química de los alimentos",
      "Contaminación química del agua",
      "Superficie descascarada y descascarada en presencia de niños pequeños",
      "Desglose inadecuado del contaminante"
    ],
    "defaultNocCode": "1908",
    "defaultNicCode": "6610",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 4. Peligros ambientales"
  },
  {
    "id": "nanda_00265",
    "code": "00265",
    "name": "Riesgo de lesiones profesionales",
    "definition": "Susceptible a una enfermedad o accidente laboral, que puede comprometer salud.",
    "relatedFactors": [
      "Distracción de las relaciones interpersonales.",
      "Estrés excesivo",
      "Uso inadecuado de equipo de protección personal",
      "Conocimiento inadecuado",
      "Habilidades inadecuadas de gestión del tiempo."
    ],
    "defaultNocCode": "1908",
    "defaultNicCode": "6610",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 4. Peligros ambientales"
  },
  {
    "id": "nanda_00037",
    "code": "00037",
    "name": "Riesgo de intoxicación",
    "definition": "Susceptible a la exposición accidental o la ingestión de drogas o productos peligrosos en suffidosis cientes, que pueden comprometer la salud.",
    "relatedFactors": [
      "Acceso a producto peligroso",
      "Acceso a drogas ilícitas potencialmente contaminadas por aditivos venenosos",
      "Acceso a preparados farmacéuticos",
      "Entorno ocupacional sin las salvaguardias adecuadas"
    ],
    "defaultNocCode": "1908",
    "defaultNicCode": "6610",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 4. Peligros ambientales"
  },
  {
    "id": "nanda_00218",
    "code": "00218",
    "name": "Riesgo de reacción adversa a los medios de contraste yodados",
    "definition": "Susceptible a reacciones nocivas o no deseadas que pueden ocurrir dentro de los siete días posteriores a la inyección del agente de contraste, que pueden comprometer la salud.",
    "relatedFactors": [
      "Deshidración",
      "Debilidad generalizada"
    ],
    "defaultNocCode": "1908",
    "defaultNicCode": "6610",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 5. Procesos defensivos"
  },
  {
    "id": "nanda_00217",
    "code": "00217",
    "name": "Riesgo de reacción alérgica",
    "definition": "Susceptible a una respuesta inmune exagerada o una reacción a sustancias, que puede comprometer la salud.",
    "relatedFactors": [
      "Exposición a alérgenos",
      "Exposición a alérgenos ambientales",
      "Exposición a químicos tóxicos",
      "Conocimiento inadecuado sobre cómo evitar alérgenos relevantes.",
      "Desatento a la posible exposición a alérgenos"
    ],
    "defaultNocCode": "1908",
    "defaultNicCode": "6610",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 5. Procesos defensivos"
  },
  {
    "id": "nanda_00042",
    "code": "00042",
    "name": "Riesgo de reacción alérgica al látex",
    "definition": "Susceptible a una reacción hipersensible a productos de caucho de látex natural o alimentos reactivos al látex, que pueden comprometer la salud.",
    "relatedFactors": [
      "Conocimiento inadecuado sobre cómo evitar alérgenos relevantes.",
      "Desatento a la posible exposición a alimentos reactivos al látex",
      "Desatento a la posible exposición ambiental al látex."
    ],
    "defaultNocCode": "1908",
    "defaultNicCode": "6610",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 5. Procesos defensivos"
  },
  {
    "id": "nanda_00007",
    "code": "00007",
    "name": "Hipertermia",
    "definition": "Temperatura corporal central por encima del rango diurno normal debido a la falla de termorregulación.",
    "relatedFactors": [
      "Deshidración",
      "Ropa inapropiada",
      "Actividad vigorosa"
    ],
    "defaultNocCode": "0800",
    "defaultNicCode": "3900",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 6. Termorregulación"
  },
  {
    "id": "nanda_00006",
    "code": "00006",
    "name": "Hipotermia",
    "definition": "Temperatura corporal central por debajo del rango diurno normal en individuos> 28 días de vida.",
    "relatedFactors": [
      "Consumo de alcohol",
      "Excesiva transferencia de calor por conducción",
      "Excesiva transferencia de calor por convección",
      "Excesiva transferencia de calor por evaporación",
      "Excesiva transferencia de calor por radiación"
    ],
    "defaultNocCode": "0800",
    "defaultNicCode": "3900",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 6. Termorregulación"
  },
  {
    "id": "nanda_00253",
    "code": "00253",
    "name": "Riesgo de hipotermia",
    "definition": "Susceptible a una falla en la termorregulación que puede resultar en una temperatura corporal central por debajo del rango diurno normal en individuos> 28 días de vida, que puede comprometer la salud.",
    "relatedFactors": [
      "Consumo de alcohol",
      "Excesiva transferencia de calor por conducción",
      "Excesiva transferencia de calor por convección",
      "Excesiva transferencia de calor por evaporación",
      "Excesiva transferencia de calor por radiación"
    ],
    "defaultNocCode": "0800",
    "defaultNicCode": "3900",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 6. Termorregulación"
  },
  {
    "id": "nanda_00280",
    "code": "00280",
    "name": "Hipotermia neonatal",
    "definition": "Temperatura corporal central de un bebé por debajo del rango diurno normal.",
    "relatedFactors": [
      "Lactancia materna retrasada",
      "Baño temprano del recién nacido",
      "Transferencia de calor por conducción excesiva",
      "Transferencia de calor por convección excesiva",
      "Transferencia de calor por evaporación excesiva"
    ],
    "defaultNocCode": "0800",
    "defaultNicCode": "3900",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 6. Termorregulación"
  },
  {
    "id": "nanda_00282",
    "code": "00282",
    "name": "Riesgo de hipotermia neonatal",
    "definition": "Susceptibilidad de un lactante a una temperatura corporal central por debajo de la normal diurna rango final, que puede comprometer la salud.",
    "relatedFactors": [
      "Lactancia materna retrasada",
      "Baño temprano del recién nacido",
      "Transferencia de calor por conducción excesiva",
      "Transferencia de calor por convección excesiva",
      "Transferencia de calor por evaporación excesiva"
    ],
    "defaultNocCode": "0800",
    "defaultNicCode": "3900",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 6. Termorregulación"
  },
  {
    "id": "nanda_00254",
    "code": "00254",
    "name": "Riesgo de hipotermia perioperatoria",
    "definition": "Susceptible a una caída inadvertida de la temperatura corporal central por debajo de 36 ° C / 96.8 ° F que ocurren una hora antes a 24 horas después de la cirugía, lo que puede prometen salud.",
    "relatedFactors": [
      "Ansiedad",
      "Índice de masa corporal por debajo del rango normal para la edad y el sexo",
      "Temperatura ambiental <21 ° C / 69,8 ° F",
      "Disponibilidad inadecuada de equipo de calentamiento adecuado",
      "Área de la herida descubierta"
    ],
    "defaultNocCode": "0800",
    "defaultNicCode": "3900",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 6. Termorregulación"
  },
  {
    "id": "nanda_00008",
    "code": "00008",
    "name": "Inefftermorregulación efectiva",
    "definition": "Fluctuación de temperatura entre hipotermia e hipertermia.",
    "relatedFactors": [
      "Deshidración",
      "Fluctuaciones de temperatura ambiental.",
      "Inactividad",
      "Ropa inapropiada para la temperatura ambiental.",
      "Mayor demanda de oxígeno"
    ],
    "defaultNocCode": "0800",
    "defaultNicCode": "3900",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 6. Termorregulación"
  },
  {
    "id": "nanda_00274",
    "code": "00274",
    "name": "Riesgo de inefftermorregulación efectiva",
    "definition": "Susceptible a fluctuaciones de temperatura entre hipotermia e hipertermia. mia, que puede comprometer la salud.",
    "relatedFactors": [
      "Deshidración",
      "Fluctuaciones de temperatura ambiental.",
      "Inactividad",
      "Ropa inapropiada para la temperatura ambiental.",
      "Mayor demanda de oxígeno"
    ],
    "defaultNocCode": "0800",
    "defaultNicCode": "3900",
    "serviceContext": "urgencias",
    "domain": "Dominio 11. Seguridad / protección",
    "class": "Clase 6. Termorregulación"
  },
  {
    "id": "nanda_00214",
    "code": "00214",
    "name": "Comodidad deteriorada",
    "definition": "Falta percibida de tranquilidad, alivio y trascendencia en las dimensiones física, psicoespiritual, ambiental, cultural y / o social.",
    "relatedFactors": [
      "Control inadecuado sobre el medio ambiente",
      "Recursos sanitarios inadecuados",
      "Control situacional inadecuado",
      "Insuffiprivacidad cient",
      "Estímulos ambientales desagradables"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 12. Comodidad",
    "class": "Clase 1. Comodidad física"
  },
  {
    "id": "nanda_00183",
    "code": "00183",
    "name": "Preparación para una mayor comodidad",
    "definition": "Un patrón de facilidad, alivio y trascendencia en lo físico, psicoespiritual, ambiental dimensiones ambientales y / o sociales, que se puede fortalecer.",
    "relatedFactors": [],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 12. Comodidad",
    "class": "Clase 1. Comodidad física"
  },
  {
    "id": "nanda_00134",
    "code": "00134",
    "name": "Náusea",
    "definition": "Un fenómeno subjetivo de una sensación desagradable en la parte posterior de la garganta y el estómago, que puede resultar en vómitos o no.",
    "relatedFactors": [
      "Ansiedad",
      "Exposición a la toxina",
      "Temor",
      "Sabor nocivo",
      "Estímulos sensoriales desagradables"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 12. Comodidad",
    "class": "Clase 1. Comodidad física"
  },
  {
    "id": "nanda_00132",
    "code": "00132",
    "name": "Dolor agudo",
    "definition": "Experiencia sensorial y emocional desagradable asociada con daño tisular real o potencial, o descrita en términos de dicho daño (Asociación Internacional para el Estudio del Dolor); Inicio repentino o lento de cualquier intensidad de leve a grave con un final anticipado o predecible, y con una duración de menos de 3 meses.",
    "relatedFactors": [
      "Agente de daño biológico",
      "Uso inadecuado de agente químico",
      "Agente de lesiones físicas"
    ],
    "defaultNocCode": "2102",
    "defaultNicCode": "1400",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 12. Comodidad",
    "class": "Clase 1. Comodidad física"
  },
  {
    "id": "nanda_00133",
    "code": "00133",
    "name": "Dolor crónico",
    "definition": "Experiencia sensorial y emocional desagradable asociada con daño tisular real o potencial, o descrita en términos de dicho daño (Asociación Internacional para el Estudio del Dolor); Inicio repentino o lento de cualquier intensidad de leve a grave, constante o recurrente sin un final anticipado o predecible, y con una duración superior a 3 meses.",
    "relatedFactors": [
      "Índice de masa corporal por encima del rango normal para la edad y el sexo",
      "Fatiga",
      "Ineffpatrón de sexualidad efectiva",
      "Agente lesivo",
      "Desnutrición"
    ],
    "defaultNocCode": "2102",
    "defaultNicCode": "1400",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 12. Comodidad",
    "class": "Clase 1. Comodidad física"
  },
  {
    "id": "nanda_00255",
    "code": "00255",
    "name": "Síndrome de dolor crónico",
    "definition": "Dolor recurrente o persistente que ha durado al menos 3 meses, y que significativamente ffafecta el funcionamiento o el bienestar diario.",
    "relatedFactors": [
      "Índice de masa corporal por encima del rango normal para la edad y el sexo",
      "Miedo al dolor",
      "Creencias de evitación del miedo",
      "Conocimiento inadecuado de las conductas de manejo del dolor.",
      "Negativo affect"
    ],
    "defaultNocCode": "2102",
    "defaultNicCode": "1400",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 12. Comodidad",
    "class": "Clase 1. Comodidad física"
  },
  {
    "id": "nanda_00256",
    "code": "00256",
    "name": "El dolor del parto",
    "definition": "Experiencia sensorial y emocional que varía de placentera a desagradable, asociado con el trabajo de parto y el parto.",
    "relatedFactors": [
      "Insuffiingesta ciente de líquidos",
      "Posición supina",
      "Miedo al parto",
      "Inadecuado conocimiento sobre el parto",
      "Preparación inadecuada para lidiar con el dolor de parto."
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 12. Comodidad",
    "class": "Clase 1. Comodidad física"
  },
  {
    "id": "nanda_00214",
    "code": "00214",
    "name": "Comodidad deteriorada",
    "definition": "Falta percibida de tranquilidad, alivio y trascendencia en las dimensiones física, psicoespiritual, ambiental, cultural y / o social.",
    "relatedFactors": [
      "Control inadecuado sobre el medio ambiente",
      "Recursos sanitarios inadecuados",
      "Control situacional inadecuado",
      "Insuffiprivacidad cient",
      "Estímulos ambientales desagradables"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 12. Comodidad",
    "class": "Clase 2. Confort ambiental"
  },
  {
    "id": "nanda_00183",
    "code": "00183",
    "name": "Preparación para una mayor comodidad",
    "definition": "Un patrón de tranquilidad, alivio y trascendencia en el entorno físico, psicoespiritual, dimensiones ambientales y / o sociales, que se puede fortalecer.",
    "relatedFactors": [],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 12. Comodidad",
    "class": "Clase 2. Confort ambiental"
  },
  {
    "id": "nanda_00214",
    "code": "00214",
    "name": "Comodidad deteriorada",
    "definition": "Falta percibida de tranquilidad, alivio y trascendencia en las dimensiones física, psicoespiritual, ambiental, cultural y / o social.",
    "relatedFactors": [
      "Control inadecuado sobre el medio ambiente",
      "Recursos sanitarios inadecuados",
      "Control situacional inadecuado",
      "Insuffiprivacidad cient",
      "Estímulos ambientales desagradables"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 12. Comodidad",
    "class": "Clase 3. Confort social"
  },
  {
    "id": "nanda_00183",
    "code": "00183",
    "name": "Preparación para una mayor comodidad",
    "definition": "Un patrón de tranquilidad, alivio y trascendencia en el entorno físico, psicoespiritual, dimensiones ambientales y / o sociales, que se puede fortalecer.",
    "relatedFactors": [],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 12. Comodidad",
    "class": "Clase 3. Confort social"
  },
  {
    "id": "nanda_00054",
    "code": "00054",
    "name": "Riesgo de soledad",
    "definition": "Susceptible de experimentar molestias asociadas con el deseo o la necesidad de tener más contacto con los demás, lo que puede comprometer la salud.",
    "relatedFactors": [
      "Affprivación parcial",
      "Privación emocional",
      "Aislamiento fisico",
      "Aislamiento social"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 12. Comodidad",
    "class": "Clase 3. Confort social"
  },
  {
    "id": "nanda_00053",
    "code": "00053",
    "name": "Aislamiento social",
    "definition": "Un estado en el que el individuo carece de un sentido de relación conectado a relaciones interpersonales positivas, duraderas y significativas.",
    "relatedFactors": [
      "Disfunción congnitiva",
      "Diffiestablecer relaciones interpersonales recíprocas satisfactorias",
      "Difficultivar la realización de actividades de la vida diaria",
      "Difficompartir las expectativas de la vida personal",
      "Miedo al crimen"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "medicina_interna",
    "domain": "Dominio 12. Comodidad",
    "class": "Clase 3. Confort social"
  },
  {
    "id": "nanda_00314",
    "code": "00314",
    "name": "Retraso en el desarrollo infantil",
    "definition": "Niño que continuamente no logra alcanzar los hitos del desarrollo dentro del plazo previsto.",
    "relatedFactors": [
      "Acceso inadecuado al proveedor de atención médica",
      "Comportamiento de apego inadecuado",
      "Estimulación inadecuada",
      "Estrés excesivo",
      "Violencia doméstica no abordada"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "pediatria",
    "domain": "Dominio 13. Crecimiento / desarrollo",
    "class": "Clase 2. Desarrollo"
  },
  {
    "id": "nanda_00305",
    "code": "00305",
    "name": "Riesgo de retraso del desarrollo infantil",
    "definition": "Niño que es susceptible de no lograr los hitos del desarrollo dentro del plazo previsto.",
    "relatedFactors": [
      "Acceso inadecuado al proveedor de atención médica",
      "Comportamiento de apego inadecuado",
      "Estimulación inadecuada",
      "Estrés excesivo",
      "Violencia doméstica no abordada"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "pediatria",
    "domain": "Dominio 13. Crecimiento / desarrollo",
    "class": "Clase 2. Desarrollo"
  },
  {
    "id": "nanda_00315",
    "code": "00315",
    "name": "Retraso en el desarrollo motor infantil",
    "definition": "Individuo que consistentemente no logra alcanzar el desarrollo hitos relacionados al fortalecimiento normal de los huesos, los músculos y la capacidad de moverse y tocar uno's alrededores.",
    "relatedFactors": [
      "Difficultivo con procesamiento sensorial",
      "Ansiedad por el cuidado infantil",
      "No permite que el bebé elija actividades físicas.",
      "No anima al bebé a agarrar",
      "Insufficient juguetes de motricidad fina para bebés"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "pediatria",
    "domain": "Dominio 13. Crecimiento / desarrollo",
    "class": "Clase 2. Desarrollo"
  },
  {
    "id": "nanda_00316",
    "code": "00316",
    "name": "Riesgo de retraso en el desarrollo motor infantil",
    "definition": "Individuo susceptible a no lograr los hitos del desarrollo relacionados con el fortalecimiento normal de los huesos, los músculos y la capacidad de moverse y tocar. uno's alrededores.",
    "relatedFactors": [
      "Difficultivo con procesamiento sensorial",
      "Ansiedad por el cuidado infantil",
      "No permite que el bebé elija actividades físicas.",
      "No anima al bebé a agarrar",
      "Insufficient juguetes de motricidad fina para bebés"
    ],
    "defaultNocCode": "N/A",
    "defaultNicCode": "N/A",
    "serviceContext": "pediatria",
    "domain": "Dominio 13. Crecimiento / desarrollo",
    "class": "Clase 2. Desarrollo"
  }
];

const fixIneffTypo = (text: string): string => {
  if (!text || typeof text !== 'string') return text;
  
  let fixed = text.replace(/Ineff([a-zA-Z0-9áéíóúñ\s,;.:\-\/]+?)\s(efectivo|efectiva|eficaz|efectivos|efectivas|eficaces)/gi, (match, p1, p2) => {
    const isPlural = /es$/i.test(p2) || /s$/i.test(p2);
    const replacement = isPlural ? 'ineficaces' : 'ineficaz';
    return `${p1} ${replacement}`;
  });

  fixed = fixed.replace(/Ineff/gi, 'Ineficaz ');
  fixed = fixed.replace(/ineffefectiva/gi, 'ineficaz');
  fixed = fixed.replace(/ineffefectivo/gi, 'ineficaz');
  fixed = fixed.replace(/\s+/g, ' ').trim();
  
  if (text[0] === text[0].toUpperCase() && fixed[0]) {
    fixed = fixed[0].toUpperCase() + fixed.substring(1);
  }
  
  return fixed;
};

export const DIAGNOSES: Diagnosis[] = rawDIAGNOSES.map(d => ({
  ...d,
  name: fixIneffTypo(d.name),
  definition: fixIneffTypo(d.definition),
  relatedFactors: d.relatedFactors ? d.relatedFactors.map(fixIneffTypo) : []
}));

export const NOC_OUTCOMES: NocOutcome[] = [
  {
    id: 'noc_0403',
    code: '0403',
    name: 'Estado respiratorio: ventilación',
    definition: 'Movimiento de entrada y salida de aire en los pulmones y el intercambio alveolar de gases.',
    domain: 'Salud Fisiológica (II)',
    indicators: [
      { code: '040301', name: 'Frecuencia respiratoria' },
      { code: '040302', name: 'Ritmo respiratorio' },
      { code: '040303', name: 'Profundidad de la respiración' },
      { code: '040309', name: 'Uso de músculos accesorios' }
    ]
  },
  {
    id: 'noc_1902',
    code: '1902',
    name: 'Control del riesgo',
    definition: 'Acciones personales para comprender, evitar, eliminar o reducir las amenazas para la salud que son modificables.',
    domain: 'Conocimiento y Conducta (IV)',
    indicators: [
      { code: '190201', name: 'Evita la exposición a amenazas' },
      { code: '190202', name: 'Supervisa los factores de riesgo del entorno' },
      { code: '190203', name: 'Desarrolla estrategias de control de riesgo efectivas' }
    ]
  },
  {
    id: 'noc_1101',
    code: '1101',
    name: 'Integridad tisular: piel y membranas',
    definition: 'Indemnidad estructural y función fisiológica normal de la piel y las membranas mucosas.',
    domain: 'Salud Fisiológica (II)',
    indicators: [
      { code: '110111', name: 'Perfusión tisular' },
      { code: '110113', name: 'Integridad de la piel' },
      { code: '110115', name: 'Pigmentación anormal' }
    ]
  },
  {
    id: 'noc_0503',
    code: '0503',
    name: 'Eliminación urinaria',
    definition: 'Recogida y descarga de la orina.',
    domain: 'Salud Fisiológica (II)',
    indicators: [
      { code: '050301', name: 'Patrón de eliminación' },
      { code: '050303', name: 'Cantidad de orina' },
      { code: '050312', name: 'Ausencia de dificultades en la micción' },
      { code: '050331', name: 'Poliuria controlada' }
    ]
  },
  {
    id: 'noc_2102',
    code: '2102',
    name: 'Nivel del dolor',
    definition: 'Intensidad del dolor referido o manifestado.',
    domain: 'Salud Percibida (V)',
    indicators: [
      { code: '210201', name: 'Dolor referido' },
      { code: '210202', name: 'Expresiones faciales de dolor' },
      { code: '210203', name: 'Duración de los episodios de dolor' }
    ]
  },
  {
    id: 'noc_0300',
    code: '0300',
    name: 'Cuidados personales: actividades de la vida diaria (AVD)',
    definition: 'Capacidad para realizar las actividades básicas del cuidado personal.',
    domain: 'Salud Funcional (I)',
    indicators: [
      { code: '030001', name: 'Higiene personal' },
      { code: '030002', name: 'Vestido' },
      { code: '030003', name: 'Alimentación' }
    ]
  },
  {
    id: 'noc_0415',
    code: '0415',
    name: 'Estado respiratorio',
    definition: 'Movimiento de aire hacia dentro y fuera de los pulmones e intercambio alveolar de gases.',
    domain: 'Salud Fisiológica (II)',
    indicators: [
      { code: '041501', name: 'Saturación de oxígeno' },
      { code: '041502', name: 'Gasometría arterial' },
      { code: '041508', name: 'Facilidad de la respiración' }
    ]
  },
  {
    id: 'noc_0800',
    code: '0800',
    name: 'Termorregulación',
    definition: 'Equilibrio entre la producción, la ganancia y la pérdida de calor para mantener la temperatura en rangos fisiológicos.',
    domain: 'Salud Fisiológica (II)',
    indicators: [
      { code: '080001', name: 'Temperatura corporal normal' },
      { code: '080002', name: 'Ausencia de sudoración profusa' },
      { code: '080018', name: 'Ausencia de temblor o escalofríos' }
    ]
  },
  {
    id: 'noc_1004',
    code: '1004',
    name: 'Estado nutricional',
    definition: 'Grado en que los nutrientes son ingeridos y absorbidos para satisfacer las necesidades metabólicas.',
    domain: 'Salud Fisiológica (II)',
    indicators: [
      { code: '100401', name: 'Ingesta de nutrientes' },
      { code: '100402', name: 'Ingesta de alimentos y líquidos' },
      { code: '100408', name: 'Relación peso / talla' }
    ]
  },
  {
    id: 'noc_0208',
    code: '0208',
    name: 'Movilidad',
    definition: 'Capacidad para moverse intencionadamente en el entorno con o sin asistencia.',
    domain: 'Salud Funcional (I)',
    indicators: [
      { code: '020801', name: 'Mantenimiento del equilibrio' },
      { code: '020803', name: 'Movimiento muscular' },
      { code: '020806', name: 'Ambulación' }
    ]
  },
  {
    id: 'noc_1211',
    code: '1211',
    name: 'Nivel de ansiedad',
    definition: 'Gravedad de la aprensión, tensión o inquietud manifestada por el paciente.',
    domain: 'Salud Psicosocial (III)',
    indicators: [
      { code: '121101', name: 'Desasosiego' },
      { code: '121105', name: 'Aumento de la frecuencia cardíaca' },
      { code: '121117', name: 'Ansiedad verbalizada' }
    ]
  },
  {
    id: 'noc_0402',
    code: '0402',
    name: 'Estado respiratorio: intercambio gaseoso',
    definition: 'Intercambio alveolar de dióxido de carbono y oxígeno para mantener las concentraciones de gases arteriales.',
    domain: 'Salud Fisiológica (II)',
    indicators: [
      { code: '040201', name: 'Presión parcial de oxígeno en sangre arterial (PaO2)' },
      { code: '040202', name: 'Presión parcial de CO2 en sangre arterial (PaCO2)' },
      { code: '040211', name: 'Saturación de O2' }
    ]
  },
  {
    id: 'noc_0601',
    code: '0601',
    name: 'Equilibrio hídrico',
    definition: 'Equilibrio de agua en los compartimentos intracelular y extracelular del organismo.',
    domain: 'Salud Fisiológica (II)',
    indicators: [
      { code: '060101', name: 'Presión arterial dentro de límites normales' },
      { code: '060107', name: 'Entradas y salidas diarias equilibradas' },
      { code: '060109', name: 'Densidad urinaria normal' },
      { code: '060119', name: 'Humedad de membranas mucosas' }
    ]
  },
  {
    id: 'noc_0004',
    code: '0004',
    name: 'Sueño',
    definition: 'Efectividad de la suspensión periódica natural de la conciencia para restaurar el organismo.',
    domain: 'Salud Funcional (I)',
    indicators: [
      { code: '000401', name: 'Horas de sueño reparador habitual' },
      { code: '000402', name: 'Patrón del sueño' },
      { code: '000403', name: 'Eficiencia de sueño' }
    ]
  },
  {
    id: 'noc_0005',
    code: '0005',
    name: 'Tolerancia a la actividad',
    definition: 'Respuestas fisiológicas a los movimientos que consumen energía en las actividades cotidianas.',
    domain: 'Salud Funcional (I)',
    indicators: [
      { code: '000501', name: 'Frecuencia cardíaca en respuesta a la actividad' },
      { code: '000502', name: 'Frecuencia respiratoria en respuesta a la actividad' },
      { code: '000518', name: 'Facilidad para realizar actividades de la vida diaria' }
    ]
  },
  {
    id: 'noc_0407',
    code: '0407',
    name: 'Perfusión tisular: periférica',
    definition: 'Adecuación del flujo sanguíneo de las extremidades para mantener la viabilidad celular.',
    domain: 'Salud Fisiológica (II)',
    indicators: [
      { code: '040701', name: 'Llenado capilar periférico' },
      { code: '040704', name: 'Pulsos periféricos simétricos' },
      { code: '040712', name: 'Ausencia de edema periférico' }
    ]
  },
  {
    id: 'noc_1918',
    code: '1918',
    name: 'Prevención de la aspiración',
    definition: 'Acciones personales para prevenir el paso de partículas sólidas o líquidas a los pulmones.',
    domain: 'Conocimiento y Conducta (IV)',
    indicators: [
      { code: '191801', name: 'Identifica factores de riesgo de la deglución' },
      { code: '191804', name: 'Evita factores precipitantes de aspiración' },
      { code: '191811', name: 'Mantiene una posición de elevación adecuada durante y tras comer' }
    ]
  },
  {
    id: 'noc_0301',
    code: '0301',
    name: 'Autocuidado: baño',
    definition: 'Capacidad para realizar por sí mismo las actividades de limpieza corporal.',
    domain: 'Salud Funcional (I)',
    indicators: [
      { code: '030101', name: 'Limpia el cuerpo de forma independiente' },
      { code: '030105', name: 'Entra y sale de la ducha o bañera' },
      { code: '030110', name: 'Seca la piel correctamente' }
    ]
  },
  {
    id: 'noc_0501',
    code: '0501',
    name: 'Eliminación intestinal',
    definition: 'Formación y evacuación de las heces de forma regular y estructurada.',
    domain: 'Salud Fisiológica (II)',
    indicators: [
      { code: '050101', name: 'Patrón de eliminación frecuente' },
      { code: '050102', name: 'Consistencia adecuada de las heces' },
      { code: '050110', name: 'Ausencia de estreñimiento o dolor al evacuar' }
    ]
  },
  {
    id: 'noc_1803',
    code: '1803',
    name: 'Conocimiento: proceso de la enfermedad',
    definition: 'Grado de comprensión transmitido sobre una patología específica y su tratamiento.',
    domain: 'Conocimiento y Conducta (IV)',
    indicators: [
      { code: '180301', name: 'Describe el proceso específico de la enfermedad' },
      { code: '180305', name: 'Identifica signos y síntomas de alarma' },
      { code: '180312', name: 'Describe las opciones de autocuidado doméstico' }
    ]
  },
  {
    id: 'noc_1823',
    code: '1823',
    name: 'Conocimiento: fomento de la salud',
    definition: 'Grado de comprensión sobre conductas para prevenir patologías y optimizar la salud.',
    domain: 'Conocimiento y Conducta (IV)',
    indicators: [
      { code: '182301', name: 'Describe pautas dietéticas saludables' },
      { code: '182308', name: 'Especifica programas de inmunizaciones idóneos' },
      { code: '182315', name: 'Describe técnicas de manejo efectivo del estrés' }
    ]
  },
  {
    id: 'noc_0902',
    code: '0902',
    name: 'Capacidad de comunicación',
    definition: 'Efectividad para transmitir y recibir mensajes estructurados mediante el habla o gestos.',
    domain: 'Salud Psicosocial (III)',
    indicators: [
      { code: '090201', name: 'Utiliza el lenguaje verbal con fluidez' },
      { code: '090203', name: 'Utiliza el lenguaje escrito y gestos adecuados' },
      { code: '090208', name: 'Intercambia ideas coherentes en el diálogo' }
    ]
  },
  {
    id: 'noc_0313',
    code: '0313',
    name: 'Autocuidado: actividades de la vida diaria',
    definition: 'Capacidad para realizar las tareas físicas del autocuidado indispensables para la vida independiente.',
    domain: 'Salud Funcional (I)',
    indicators: [
      { code: '031301', name: 'Realiza de forma segura la higiene personal' },
      { code: '031302', name: 'Prepara comidas básicas nutritivas' },
      { code: '031308', name: 'Se moviliza en el hogar de forma autónoma' }
    ]
  },
  {
    id: 'noc_0110',
    code: '0110',
    name: 'Crecimiento y desarrollo infantil',
    definition: 'Crecimiento físico y ganancia de hitos del desarrollo motor y adaptativo acordes a la edad.',
    domain: 'Salud Funcional (I)',
    indicators: [
      { code: '011001', name: 'Estatura y peso según tabla de percentil' },
      { code: '011005', name: 'Hitos motores logrados' },
      { code: '011012', name: 'Expresión verbal apropiada' }
    ]
  }
];

export const NIC_INTERVENTIONS: NicIntervention[] = [
  {
    id: 'nic_3350',
    code: '3350',
    name: 'Monitorización respiratoria',
    activities: [
      'Monitorizar la frecuencia, ritmo, profundidad y esfuerzo de las respiraciones.',
      'Anotar el movimiento torácico, mirando la simetría, uso de músculos accesorios.',
      'Monitorizar los niveles de saturación de oxígeno en pacientes sedados.',
      'Auscultar los sonidos respiratorios, observando las áreas de disminución o ausencia de ventilación.',
      'Realizar el seguimiento de los informes de radiología.'
    ]
  },
  {
    id: 'nic_0590',
    code: '0590',
    name: 'Manejo de la eliminación urinaria',
    activities: [
      'Monitorizar la eliminación urinaria, incluyendo la frecuencia, consistencia, olor, volumen y color.',
      'Registrar de forma exacta las entradas y salidas diarias (balance hídrico).',
      'Enseñar al paciente/familia a observar los signos de infección o alteración en el patrón miccional.',
      'Sugerir derivación al especialista si se detectan signos de diabetes o disfunción renal.'
    ]
  },
  {
    id: 'nic_6550',
    code: '6550',
    name: 'Protección contra las infecciones',
    activities: [
      'Observar los signos y síntomas de infección sistémica y localizada.',
      'Mantener la asepsia para el paciente en riesgo.',
      'Mantener la limpieza de la piel.',
      'Instruir al paciente sobre higiene de manos.'
    ]
  },
  {
    id: 'nic_5820',
    code: '5820',
    name: 'Disminución de la ansiedad',
    activities: [
      'Utilizar un enfoque sereno que dé seguridad.',
      'Explicar todos los procedimientos médicos.',
      'Permanecer con el paciente para promover la seguridad y reducir el miedo.',
      'Animar a la manifestación de sentimientos, percepciones y miedos.'
    ]
  },
  {
    id: 'nic_4040',
    code: '4040',
    name: 'Cuidados cardíacos',
    activities: [
      'Monitorizar el estado cardiovascular continuamente.',
      'Monitorizar el electrocardiograma para detectar arritmias u ondas anómalas.',
      'Observar signos de gasto cardíaco bajo (extremidades frías, letargia).',
      'Registrar lecturas de presión arterial con frecuencia en el expediente.'
    ]
  },
  {
    id: 'nic_3590',
    code: '3590',
    name: 'Vigilancia de la piel',
    activities: [
      'Observar si hay enrojecimiento, calor extremo o drenaje en la piel.',
      'Vigilar las fuentes de presión y fricción de las sábanas.',
      'Registrar cambios en la piel y membranas mucosas.'
    ]
  },
  {
    id: 'nic_6490',
    code: '6490',
    name: 'Prevención de caídas',
    activities: [
      'Identificar déficits cognitivos o físicos del paciente.',
      'Colocar los objetos al alcance del paciente de forma segura.',
      'Asegurar que las barandillas de la cama estén elevadas en todo momento.'
    ]
  },
  {
    id: 'nic_1400',
    code: '1400',
    name: 'Manejo del dolor',
    activities: [
      'Realizar una valoración exhaustiva del dolor que incluya localización, características, aparición, duración, frecuencia e intensidad.',
      'Asegurar que el paciente reciba atención analgésica oportuna.',
      'Instruir al paciente sobre la administración de analgésicos si corresponde y métodos no farmacológicos de alivio.'
    ]
  },
  {
    id: 'nic_3740',
    code: '3740',
    name: 'Tratamiento de la fiebre',
    activities: [
      'Controlar la temperatura corporal de forma continua o intermitente.',
      'Administrar medicamentos antipiréticos prescritos.',
      'Aplicar medios físicos de enfriamiento (compresas húmedas templadas o mantas de enfriamiento).',
      'Monitorizar pérdidas corporales de líquidos e insistir en la hidratación.'
    ]
  },
  {
    id: 'nic_1100',
    code: '1100',
    name: 'Manejo de la nutrición',
    activities: [
      'Determinar el estado nutricional del paciente y su capacidad para satisfacer las necesidades de nutrientes.',
      'Fomentar la ingesta calórica adecuada a las necesidades metabólicas del paciente.',
      'Proporcionar alimentos nutritivos, ricos en proteínas y calorías en un ambiente agradable.'
    ]
  },
  {
    id: 'nic_4310',
    code: '4310',
    name: 'Terapia de actividad',
    activities: [
      'Colaborar con terapeutas ocupacionales o físicos en la planificación de un programa de actividad motriz.',
      'Fomentar actividades motrices pasivas o activas según tolerancia del paciente.',
      'Ayudar al paciente a enfocarse en sus capacidades en lugar de en sus déficits de movilidad.'
    ]
  },
  {
    id: 'nic_3140',
    code: '3140',
    name: 'Manejo de las vías aéreas',
    activities: [
      'Colocar al paciente en la posición que permita la máxima ventilación posible (Fowler o Semi-Fowler).',
      'Realizar fisioterapia torácica si estuviera indicado.',
      'Eliminar secreciones fomentando la tos o mediante aspiración de secreciones.',
      'Administrar broncodilatadores o aerosolterapia prescrita de manera oportuna.'
    ]
  },
  {
    id: 'nic_4120',
    code: '4120',
    name: 'Manejo de líquidos',
    activities: [
      'Registrar de forma exacta las entradas y salidas diarias (balance hídrico).',
      'Administrar terapia de hidratación intravenosa según prescripción médica.',
      'Supervisar el estado hemodinámico general del paciente (pulso, presión arterial).',
      'Sopesar al paciente de ser posible con la misma ropa y horario.'
    ]
  },
  {
    id: 'nic_1850',
    code: '1850',
    name: 'Fomentar el sueño',
    activities: [
      'Regular los estímulos ambientales (ruidos, iluminación) para crear un entorno propicio.',
      'Agrupar los cuidados de enfermería para minimizar las interrupciones del ciclo circadiano.',
      'Ofrecer técnicas cardioterapéuticas o bebidas calientes previas al descanso.'
    ]
  },
  {
    id: 'nic_0180',
    code: '0180',
    name: 'Manejo de la energía',
    activities: [
      'Determinar las limitaciones físicas y déficits energéticos en base a la escala clínica.',
      'Fomentar periodos de descanso intercalados con actividad motriz moderada.',
      'Asistir en la nutrición óptima para incentivar la ganancia de masa y fuerzas.'
    ]
  },
  {
    id: 'nic_4060',
    code: '4060',
    name: 'Cuidados circulatorios: insuficiencia venosa',
    activities: [
      'Elevar las extremidades inferiores por encima del nivel del corazón para favorecer el retorno venoso.',
      'Supervisar la colocación correcta de medias de compresión elástica prescritas.',
      'Evaluar el estado del color, sensibilidad y pulsos periféricos bilaterales.'
    ]
  },
  {
    id: 'nic_3200',
    code: '3200',
    name: 'Precauciones para evitar la aspiración',
    activities: [
      'Mantener la cabecera de la cama elevada a 30-45 grados durante y 1 hora post alimentación enteral.',
      'Inspeccionar el residuo gástrico y verificar la correcta colocación de la sonda.',
      'Mantener equipo de aspiración listo y operativo al lado de la cama del paciente.'
    ]
  },
  {
    id: 'nic_3540',
    code: '3540',
    name: 'Prevención de úlceras por presión',
    activities: [
      'Realizar cambios posturales programados al menos cada 2 horas.',
      'Utilizar dispositivos de alivio de presión (colchones antiescaras, almohadas protectoras).',
      'Mantener la sábana del paciente limpia, seca y libre de arrugas.'
    ]
  },
  {
    id: 'nic_1801',
    code: '1801',
    name: 'Ayuda con los autocuidados: baño/higiene',
    activities: [
      'Proporcionar los utensilios de higiene personal necesarios al alcance del paciente.',
      'Realizar el baño en cama de forma respetuosa protegiendo la privacidad del paciente.',
      'Aplicar aceites protectores o hidratantes después de la higiene corporal.'
    ]
  },
  {
    id: 'nic_0450',
    code: '0450',
    name: 'Manejo del estreñimiento/impactación',
    activities: [
      'Evaluar la frecuencia y consistencia de las evacuaciones previas.',
      'Incentivar la ingesta hídrica oral y alimentos ricos en fibras dietéticas.',
      'Administrar masajes abdominales de orientación cólica o supositorios según pauta.'
    ]
  },
  {
    id: 'nic_0460',
    code: '0460',
    name: 'Manejo de la diarrea',
    activities: [
      'Fomentar la rehidratación oral progresiva con sales de rehidratación oral.',
      'Supervisar la integridad de la piel perianal para prevenir dermatitis.',
      'Registrar la frecuencia, volumen, color y consistencia de las deposiciones diarreas.'
    ]
  },
  {
    id: 'nic_5602',
    code: '5602',
    name: 'Enseñanza: proceso de enfermedad',
    activities: [
      'Evaluar el nivel previo de conocimientos del paciente y su capacidad de aprendizaje.',
      'Describir en lenguaje claro y accesible los signos de aviso para acudir a emergencia.',
      'Proporcionar folletos o material gráfico acreditado de apoyo médico.'
    ]
  },
  {
    id: 'nic_5510',
    code: '5510',
    name: 'Educación para la salud',
    activities: [
      'Diseñar programas de autocuidado específicos conjuntos con el paciente.',
      'Instruir sobre rutinas higiénicas, lavado de alimentos y prevención general.',
      'Fomentar la autoconfianza y la resiliencia en situaciones sanitarias complejas.'
    ]
  },
  {
    id: 'nic_4920',
    code: '4920',
    name: 'Escucha activa',
    activities: [
      'Establecercontacto visual directo y mostrar empatía sin juzgar.',
      'Evitar interrupciones imprevistas durante la narración del dolor o experiencias.',
      'Aclarar ideas repitiendo o parafraseando la queja clínica para ratificarla.'
    ]
  },
  {
    id: 'nic_1800',
    code: '1800',
    name: 'Ayuda con los autocuidados',
    activities: [
      'Asistir en las actividades cotidianas más complejas minimizando el riesgo térmico.',
      'Brindar apoyo afectuoso estimulando la mayor autonomía posible por parte del paciente.',
      'Involucrar a los cuidadores domésticos en la instrucción del soporte asistencial.'
    ]
  },
  {
    id: 'nic_8250',
    code: '8250',
    name: 'Apoyo en el desarrollo del niño',
    activities: [
      'Evaluar el logro de los hitos motores y de habla según la edad del paciente.',
      'Instruir a los padres sobre el juego cooperativo y dinámicas intelectuales guiadas.',
      'Promover estímulos de colores, texturas y sonidos acordes a la maduración pediátrica.'
    ]
  }
];

export const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'ass_1',
    status: 'Finalizado',
    dateString: 'Hoy, 10:45',
    timeAgo: 'Hace 2 horas',
    patientName: 'M. García Rodríguez',
    patientId: 'ID: 882341',
    box: 'UCI-04',
    nandaCode: '00032',
    nandaName: 'Patrón respiratorio ineficaz',
    nandaDefinition: 'Inspiración y/o espiración que no proporciona una ventilación adecuada.',
    relatedFactors: ['Ansiedad', 'Deformidad de la pared torácica'],
    nocCode: '0403',
    nocName: 'Estado respiratorio: ventilación',
    nocIndicatorsCodes: ['040301', '040303'],
    nicCode: '3350',
    nicName: 'Monitorización respiratoria',
    nicActivities: [
      'Monitorizar la frecuencia, ritmo, profundidad y esfuerzo de las respiraciones.',
      'Anotar el movimiento torácico, mirando la simetría, uso de músculos accesorios.',
      'Auscultar los sonidos respiratorios, observando las áreas de disminución o ausencia de ventilación.'
    ],
    service: 'UCI',
    noteText: 'NANDA: Patrón respiratorio ineficaz [00032]\nNOC: Estado respiratorio: ventilación [0403]\nIndicadores: Frecuencia respiratoria, Profundidad de la respiración\nNIC: Monitorización respiratoria [3350]\nActividades:\n- Monitorizar la frecuencia, ritmo, profundidad y esfuerzo...\n- Anotar el movimiento torácico...\n- Auscultar los sonidos respiratorios...'
  },
  {
    id: 'ass_2',
    status: 'Borrador',
    dateString: 'Hoy, 08:20',
    timeAgo: 'Cambio de turno',
    patientName: 'R. López Hernán',
    patientId: 'ID: 901234',
    box: 'Planta 4',
    nandaCode: '00004',
    nandaName: 'Riesgo de infección',
    nandaDefinition: 'Aumento del riesgo de ser invadido por microorganismos patógenos.',
    relatedFactors: ['Procedimientos invasivos'],
    nocCode: '1902',
    nocName: 'Control del riesgo',
    nocIndicatorsCodes: ['190201'],
    nicCode: '6550',
    nicName: 'Protección contra las infecciones',
    nicActivities: [
      'Observar los signos y síntomas de infección sistémica y localizada.',
      'Mantener la asepsia para el paciente en riesgo.'
    ],
    service: 'Planta 4',
    noteText: 'NANDA: Riesgo de infección [00004]\nNOC: Control del riesgo [1902]\nIndicadores: Evita la exposición a amenazas\nNIC: Protección contra las infecciones [6550]\nActividades:\n- Observar los signos y síntomas...'
  },
  {
    id: 'ass_3',
    status: 'Finalizado',
    dateString: 'Ayer, 22:15',
    timeAgo: 'Turno Noche',
    patientName: 'Ana P. Martínez',
    patientId: 'ID: 885671',
    box: 'Urgencias',
    nandaCode: '00146',
    nandaName: 'Ansiedad',
    nandaDefinition: 'Vaga sensación de malestar o amenaza acompañada de una respuesta autonómica.',
    relatedFactors: ['Crisis situacional'],
    nocCode: '1211',
    nocName: 'Nivel de ansiedad',
    nocIndicatorsCodes: ['121101', '121105'],
    nicCode: '5820',
    nicName: 'Disminución de la ansiedad',
    nicActivities: [
      'Utilizar un enfoque sereno que dé seguridad.',
      'Permanecer con el paciente para promover la seguridad y reducir el miedo.'
    ],
    service: 'Urgencias',
    noteText: 'NANDA: Ansiedad [00146]\nNOC: Nivel de ansiedad [1211]\nIndicadores: Desasosiego, Aumento de la frecuencia cardíaca\nNIC: Disminución de la ansiedad [5820]\nActividades:\n- Utilizar un enfoque sereno...\n- Permanecer con el paciente...'
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'al_1',
    name: 'Saturación de Oxígeno (SpO2)',
    condition: 'Disparador: < 90% | Frecuencia: Continua',
    priority: 'CRÍTICO',
    color: 'error'
  },
  {
    id: 'al_2',
    name: 'Frecuencia Respiratoria',
    condition: 'Disparador: > 25 rpm o < 10 rpm',
    priority: 'URGENTE',
    color: 'tertiary'
  },
  {
    id: 'al_3',
    name: 'Presión Arterial Media (PAM)',
    condition: 'Disparador: < 65 mmHg',
    priority: 'INFORMATIVO',
    color: 'secondary'
  }
];

export interface NandaClass {
  code: string;
  name: string;
  diagnosesCodes: string[];
}

export interface NandaDomain {
  code: string;
  name: string;
  classes: NandaClass[];
}

export const NANDA_DOMAINS: NandaDomain[] = [
  {
    "code": "D1",
    "name": "Dominio 1. Promoción de la salud",
    "classes": [
      {
        "code": "C1",
        "name": "Clase 1. Concienciación sobre la salud",
        "diagnosesCodes": [
          "00097",
          "00262",
          "00168"
        ]
      },
      {
        "code": "C2",
        "name": "Clase 2. Gestión de la salud",
        "diagnosesCodes": [
          "00290",
          "00257",
          "00231",
          "00307",
          "00215",
          "00188",
          "00292",
          "00276",
          "00293",
          "00294",
          "00300",
          "00308",
          "00309",
          "00043"
        ]
      }
    ]
  },
  {
    "code": "D2",
    "name": "Dominio 2. Nutrición",
    "classes": [
      {
        "code": "C1",
        "name": "Clase 1. Ingestión",
        "diagnosesCodes": [
          "00002",
          "00163",
          "00216",
          "00104",
          "00105",
          "00106",
          "00269",
          "00270",
          "00271",
          "00232",
          "00233",
          "00234",
          "00295",
          "00103"
        ]
      },
      {
        "code": "C2",
        "name": "Clase 4. Metabolismo",
        "diagnosesCodes": [
          "00179",
          "00194",
          "00230",
          "00178",
          "00296"
        ]
      },
      {
        "code": "C3",
        "name": "Clase 5. Hidratación",
        "diagnosesCodes": [
          "00195",
          "00025",
          "00027",
          "00028",
          "00026"
        ]
      }
    ]
  },
  {
    "code": "D3",
    "name": "Dominio 3. Eliminación e intercambio",
    "classes": [
      {
        "code": "C1",
        "name": "Clase 1. Función urinaria",
        "diagnosesCodes": [
          "00297",
          "00016",
          "00310",
          "00017",
          "00019",
          "00022",
          "00023",
          "00322"
        ]
      },
      {
        "code": "C2",
        "name": "Clase 2. Función gastrointestinal",
        "diagnosesCodes": [
          "00011",
          "00015",
          "00012",
          "00235",
          "00236",
          "00319",
          "00013",
          "00196",
          "00197"
        ]
      },
      {
        "code": "C3",
        "name": "Clase 4. Función respiratoria",
        "diagnosesCodes": [
          "00030"
        ]
      }
    ]
  },
  {
    "code": "D4",
    "name": "Dominio 4. Actividad / descanso",
    "classes": [
      {
        "code": "C1",
        "name": "Clase 1. Sueño / descanso",
        "diagnosesCodes": [
          "00095",
          "00096",
          "00165",
          "00198"
        ]
      },
      {
        "code": "C2",
        "name": "Clase 2. Actividad / ejercicio",
        "diagnosesCodes": [
          "00298",
          "00299",
          "00040",
          "00091",
          "00085",
          "00089",
          "00237",
          "00238",
          "00090",
          "00088"
        ]
      },
      {
        "code": "C3",
        "name": "Clase 3. Balance energético",
        "diagnosesCodes": [
          "00273",
          "00093",
          "00154"
        ]
      },
      {
        "code": "C4",
        "name": "Clase 4. Respuestas cardiovasculares / pulmonares",
        "diagnosesCodes": [
          "00032",
          "00029",
          "00240",
          "00311",
          "00278",
          "00281",
          "00033",
          "00267",
          "00291",
          "00200",
          "00201",
          "00204",
          "00228",
          "00034",
          "00318"
        ]
      },
      {
        "code": "C5",
        "name": "Clase 5. Autocuidado",
        "diagnosesCodes": [
          "00108",
          "00109",
          "00102",
          "00110",
          "00182",
          "00193"
        ]
      }
    ]
  },
  {
    "code": "D5",
    "name": "Dominio 5. Percepción / cognición",
    "classes": [
      {
        "code": "C1",
        "name": "Clase 1. Atención",
        "diagnosesCodes": [
          "00123"
        ]
      },
      {
        "code": "C2",
        "name": "Clase 4. Cognición",
        "diagnosesCodes": [
          "00128",
          "00173",
          "00129",
          "00251",
          "00222",
          "00126",
          "00161",
          "00131",
          "00279"
        ]
      },
      {
        "code": "C3",
        "name": "Clase 5. Comunicación",
        "diagnosesCodes": [
          "00157",
          "00051"
        ]
      }
    ]
  },
  {
    "code": "D6",
    "name": "Dominio 6. Autopercepción",
    "classes": [
      {
        "code": "C1",
        "name": "Clase 1. Autoconcepto",
        "diagnosesCodes": [
          "00124",
          "00185",
          "00174",
          "00121",
          "00225",
          "00167"
        ]
      },
      {
        "code": "C2",
        "name": "Clase 2. Autoestima",
        "diagnosesCodes": [
          "00119",
          "00224",
          "00120",
          "00153"
        ]
      },
      {
        "code": "C3",
        "name": "Clase 3. Imagen corporal",
        "diagnosesCodes": [
          "00118"
        ]
      }
    ]
  },
  {
    "code": "D7",
    "name": "Dominio 7. Relación de roles",
    "classes": [
      {
        "code": "C1",
        "name": "Clase 1. Roles de cuidado",
        "diagnosesCodes": [
          "00056",
          "00057",
          "00164",
          "00061",
          "00062"
        ]
      },
      {
        "code": "C2",
        "name": "Clase 2. Relaciones familiares",
        "diagnosesCodes": [
          "00058",
          "00283",
          "00284",
          "00063",
          "00060",
          "00159"
        ]
      },
      {
        "code": "C3",
        "name": "Clase 3. Desempeño de roles",
        "diagnosesCodes": [
          "00223",
          "00229",
          "00207",
          "00064",
          "00055",
          "00052"
        ]
      }
    ]
  },
  {
    "code": "D8",
    "name": "Dominio 8. Sexualidad",
    "classes": [
      {
        "code": "C1",
        "name": "Clase 2. Función sexual",
        "diagnosesCodes": [
          "00059",
          "00065"
        ]
      },
      {
        "code": "C2",
        "name": "Clase 3. Reproducción",
        "diagnosesCodes": [
          "00221",
          "00227",
          "00208",
          "00209"
        ]
      }
    ]
  },
  {
    "code": "D9",
    "name": "Dominio 9. Afrontamiento / tolerancia al estrés",
    "classes": [
      {
        "code": "C1",
        "name": "Clase 1. Respuestas postraumáticas",
        "diagnosesCodes": [
          "00260",
          "00141",
          "00145",
          "00142",
          "00114",
          "00149"
        ]
      },
      {
        "code": "C2",
        "name": "Clase 2. Respuestas de afrontamiento",
        "diagnosesCodes": [
          "00199",
          "00226",
          "00146",
          "00071",
          "00069",
          "00158",
          "00077",
          "00076",
          "00074",
          "00073",
          "00075",
          "00147",
          "00072",
          "00148",
          "00301",
          "00302",
          "00285",
          "00241",
          "00125",
          "00152",
          "00187",
          "00210",
          "00211",
          "00212",
          "00137",
          "00177"
        ]
      },
      {
        "code": "C3",
        "name": "Clase 3. Estrés neuroconductual",
        "diagnosesCodes": [
          "00258",
          "00259",
          "00009",
          "00010",
          "00264",
          "00116",
          "00115",
          "00117"
        ]
      }
    ]
  },
  {
    "code": "D10",
    "name": "Dominio 10. Principios de vida",
    "classes": [
      {
        "code": "C1",
        "name": "Clase 2. Creencias",
        "diagnosesCodes": [
          "00068"
        ]
      },
      {
        "code": "C2",
        "name": "Clase 3. Congruencia entre valores / creencias / acciones",
        "diagnosesCodes": [
          "00184",
          "00083",
          "00242",
          "00244",
          "00243",
          "00175",
          "00169",
          "00170",
          "00171",
          "00066",
          "00067"
        ]
      }
    ]
  },
  {
    "code": "D11",
    "name": "Dominio 11. Seguridad / protección",
    "classes": [
      {
        "code": "C1",
        "name": "Clase 1. Infección",
        "diagnosesCodes": [
          "00004",
          "00266"
        ]
      },
      {
        "code": "C2",
        "name": "Clase 2. Lesión física",
        "diagnosesCodes": [
          "00031",
          "00039",
          "00206",
          "00048",
          "00219",
          "00277",
          "00261",
          "00303",
          "00306",
          "00035",
          "00245",
          "00320",
          "00321",
          "00250",
          "00087",
          "00220",
          "00045",
          "00247",
          "00086",
          "00038",
          "00213",
          "00312",
          "00304",
          "00313",
          "00286",
          "00287",
          "00288",
          "00205",
          "00046",
          "00047",
          "00156",
          "00036",
          "00100",
          "00246",
          "00044",
          "00248"
        ]
      },
      {
        "code": "C3",
        "name": "Clase 3. Violencia",
        "diagnosesCodes": [
          "00272",
          "00138",
          "00140",
          "00151",
          "00139",
          "00289"
        ]
      },
      {
        "code": "C4",
        "name": "Clase 4. Peligros ambientales",
        "diagnosesCodes": [
          "00181",
          "00180",
          "00265",
          "00037"
        ]
      },
      {
        "code": "C5",
        "name": "Clase 5. Procesos defensivos",
        "diagnosesCodes": [
          "00218",
          "00217",
          "00042"
        ]
      },
      {
        "code": "C6",
        "name": "Clase 6. Termorregulación",
        "diagnosesCodes": [
          "00007",
          "00006",
          "00253",
          "00280",
          "00282",
          "00254",
          "00008",
          "00274"
        ]
      }
    ]
  },
  {
    "code": "D12",
    "name": "Dominio 12. Comodidad",
    "classes": [
      {
        "code": "C1",
        "name": "Clase 1. Comodidad física",
        "diagnosesCodes": [
          "00214",
          "00183",
          "00134",
          "00132",
          "00133",
          "00255",
          "00256"
        ]
      },
      {
        "code": "C2",
        "name": "Clase 2. Confort ambiental",
        "diagnosesCodes": [
          "00214",
          "00183"
        ]
      },
      {
        "code": "C3",
        "name": "Clase 3. Confort social",
        "diagnosesCodes": [
          "00214",
          "00183",
          "00054",
          "00053"
        ]
      }
    ]
  },
  {
    "code": "D13",
    "name": "Dominio 13. Crecimiento / desarrollo",
    "classes": [
      {
        "code": "C1",
        "name": "Clase 2. Desarrollo",
        "diagnosesCodes": [
          "00314",
          "00305",
          "00315",
          "00316"
        ]
      }
    ]
  }
];

export function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
}

export function findBestNoc(nandaName: string, nandaDef: string): NocOutcome {
  const queryText = normalizeText(`${nandaName} ${nandaDef}`);
  const words = queryText.split(/\s+/).filter(w => w.length > 3);
  
  let bestNoc = NOC_OUTCOMES[0];
  let maxScore = -1;
  
  for (const noc of NOC_OUTCOMES) {
    let score = 0;
    const nocText = normalizeText(`${noc.name} ${noc.definition}`);
    
    for (const word of words) {
      if (nocText.includes(word)) {
        score += word.length * 2; // Exact word match gets higher score
      }
    }
    
    // Check indicators
    if (noc.indicators) {
      for (const ind of noc.indicators) {
        const indText = normalizeText(ind.name);
        for (const word of words) {
          if (indText.includes(word)) {
            score += Math.floor(word.length * 0.8);
          }
        }
      }
    }
    
    if (score > maxScore) {
      maxScore = score;
      bestNoc = noc;
    }
  }
  
  return bestNoc;
}

export function findBestNic(nandaName: string, nandaDef: string): NicIntervention {
  const queryText = normalizeText(`${nandaName} ${nandaDef}`);
  const words = queryText.split(/\s+/).filter(w => w.length > 3);
  
  let bestNic = NIC_INTERVENTIONS[0];
  let maxScore = -1;
  
  for (const nic of NIC_INTERVENTIONS) {
    let score = 0;
    const nicText = normalizeText(nic.name);
    
    for (const word of words) {
      if (nicText.includes(word)) {
        score += word.length * 2;
      }
    }
    
    // Check activities
    if (nic.activities) {
      for (const act of nic.activities) {
        const actText = normalizeText(act);
        for (const word of words) {
          if (actText.includes(word)) {
            score += Math.floor(word.length * 0.8);
          }
        }
      }
    }
    
    if (score > maxScore) {
      maxScore = score;
      bestNic = nic;
    }
  }
  
  return bestNic;
}

