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

export const DIAGNOSES: Diagnosis[] = [
  {
    id: 'nanda_00032',
    code: '00032',
    name: 'Patrón respiratorio ineficaz',
    definition: 'Inspiración y/o espiración que no proporciona una ventilación adecuada.',
    relatedFactors: ['Ansiedad', 'Deformidad de la pared torácica', 'Dolor', 'Fatiga de los músculos respiratorios'],
    defaultNocCode: '0403',
    defaultNicCode: '3350',
    serviceContext: 'uci',
    domain: 'Dominio 4: Actividad/reposo',
    class: 'Clase 4: Respuestas cardiovasculares/pulmonares'
  },
  {
    id: 'nanda_00004',
    code: '00004',
    name: 'Riesgo de infección',
    definition: 'Aumento del riesgo de ser invadido por microorganismos patógenos.',
    relatedFactors: ['Procedimientos invasivos', 'Rotura de la integridad cutánea', 'Inmunosupresión', 'Desnutrición'],
    defaultNocCode: '1902',
    defaultNicCode: '6550',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 11: Seguridad/protección',
    class: 'Clase 1: Infección'
  },
  {
    id: 'nanda_00146',
    code: '00146',
    name: 'Ansiedad',
    definition: 'Vaga sensación de malestar o amenaza acompañada de una respuesta autonómica.',
    relatedFactors: ['Crisis situacional', 'Estado de salud', 'Estrés', 'Necesidades no satisfechas'],
    defaultNocCode: '1211',
    defaultNicCode: '5820',
    serviceContext: 'urgencias',
    domain: 'Dominio 9: Afrontamiento/tolerancia al estrés',
    class: 'Clase 2: Respuestas de afrontamiento'
  },
  {
    id: 'nanda_00029',
    code: '00029',
    name: 'Disminución del gasto cardíaco',
    definition: 'La cantidad de sangre bombeada por el corazón es insuficiente para satisfacer las necesidades metabólicas.',
    relatedFactors: ['Alteración de la frecuencia cardíaca', 'Alteración del volumen de eyección', 'Alteración de la precarga'],
    defaultNocCode: '0415',
    defaultNicCode: '4040',
    serviceContext: 'uci',
    domain: 'Dominio 4: Actividad/reposo',
    class: 'Clase 4: Respuestas cardiovasculares/pulmonares'
  },
  {
    id: 'nanda_00095',
    code: '00095',
    name: 'Deterioro de la integridad cutánea',
    definition: 'Alteración de la epidermis y/o la dermis.',
    relatedFactors: ['Inmovilidad física', 'Humedad', 'Extremos de temperatura', 'Fuerzas de cizallamiento'],
    defaultNocCode: '1101',
    defaultNicCode: '3590',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 11: Seguridad/protección',
    class: 'Clase 2: Lesión física'
  },
  {
    id: 'nanda_00155',
    code: '00155',
    name: 'Riesgo de caídas',
    definition: 'Aumento de la susceptibilidad a las caídas que pueden causar daño físico.',
    relatedFactors: ['Edad mayor de 65 años', 'Entorno desconocido', 'Dificultades en la marcha', 'Uso de sedantes'],
    defaultNocCode: '1902',
    defaultNicCode: '6490',
    serviceContext: 'pediatria',
    domain: 'Dominio 11: Seguridad/protección',
    class: 'Clase 2: Lesión física'
  },
  {
    id: 'nanda_00132',
    code: '00132',
    name: 'Dolor agudo',
    definition: 'Experiencia sensorial y emocional desagradable asociada a una lesión tisular real o potencial.',
    relatedFactors: ['Agentes biológicos (infección)', 'Agentes físicos (trauma, cirugía)', 'Agentes químicos (quemaduras)'],
    defaultNocCode: '2102',
    defaultNicCode: '1400',
    serviceContext: 'urgencias',
    domain: 'Dominio 12: Confort',
    class: 'Clase 1: Confort físico'
  },
  {
    id: 'nanda_00007',
    code: '00007',
    name: 'Hipertermia',
    definition: 'Elevación de la temperatura corporal por encima del rango clínicamente normal.',
    relatedFactors: ['Deshidratación', 'Enfermedad o traumatismo', 'Aumento de la tasa metabólica', 'Infección activa'],
    defaultNocCode: '0800',
    defaultNicCode: '3740',
    serviceContext: 'pediatria',
    domain: 'Dominio 11: Seguridad/protección',
    class: 'Clase 6: Termorregulación'
  },
  {
    id: 'nanda_00002',
    code: '00002',
    name: 'Desequilibrio nutricional: inferior a las necesidades corporales',
    definition: 'Consumo de nutrientes insuficiente para satisfacer las necesidades metabólicas.',
    relatedFactors: ['Incapacidad para digerir o absorber nutrientes', 'Factores biológicos', 'Incapacidad para ingerir alimentos'],
    defaultNocCode: '1004',
    defaultNicCode: '1100',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 2: Nutrición',
    class: 'Clase 1: Ingestión'
  },
  {
    id: 'nanda_00085',
    code: '00085',
    name: 'Deterioro de la movilidad física',
    definition: 'Limitación del movement independiente y intencionado del cuerpo o de una o más extremidades.',
    relatedFactors: ['Deterioro neuromuscular', 'Dolor agudo', 'Rigidez articular', 'Falta de condición física'],
    defaultNocCode: '0208',
    defaultNicCode: '4310',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 4: Actividad/reposo',
    class: 'Clase 2: Actividad/ejercicio'
  },
  {
    id: 'nanda_00031',
    code: '00031',
    name: 'Limpieza ineficaz de las vías aéreas',
    definition: 'Incapacidad para eliminar las secreciones u obstrucciones del tracto respiratorio para mantener las vías aéreas permeables.',
    relatedFactors: ['Mucosidad excesiva', 'Vía aérea artificial', 'Espasmo de las vías aéreas', 'Retención de secreciones'],
    defaultNocCode: '0403',
    defaultNicCode: '3140',
    serviceContext: 'uci',
    domain: 'Dominio 4: Actividad/reposo',
    class: 'Clase 4: Respuestas cardiovasculares/pulmonares'
  },
  {
    id: 'nanda_00030',
    code: '00030',
    name: 'Deterioro del intercambio de gases',
    definition: 'Exceso o déficit en la oxigenación y/o eliminación del dióxido de carbono en la membrana alvéolo-capilar.',
    relatedFactors: ['Cambios en la membrana alvéolo-capilar', 'Desequilibrio en la ventilación-perfusión', 'Espasmo bronquial'],
    defaultNocCode: '0402',
    defaultNicCode: '3140',
    serviceContext: 'uci',
    domain: 'Dominio 4: Actividad/reposo',
    class: 'Clase 4: Respuestas cardiovasculares/pulmonares'
  },
  {
    id: 'nanda_00028',
    code: '00028',
    name: 'Riesgo de déficit de volumen de líquidos',
    definition: 'Vulnerable a sufrir una disminución del volumen de líquidos intravascular, intersticial y/o intracelular.',
    relatedFactors: ['Pérdidas excesivas de líquidos por vías normales (diarrea, emesis)', 'Extremos de edad', 'Factores que influyen en las necesidades hídricas'],
    defaultNocCode: '0601',
    defaultNicCode: '4120',
    serviceContext: 'urgencias',
    domain: 'Dominio 2: Nutrición',
    class: 'Clase 5: Hidratación'
  },
  {
    id: 'nanda_00027',
    code: '00027',
    name: 'Déficit de volumen de líquidos',
    definition: 'Disminución del líquido intravascular, intersticial y/o intracelular. Se refiere a la deshidratación.',
    relatedFactors: ['Fracaso de los mecanismos reguladores', 'Pérdida activa del volumen de líquidos', 'Ingesta insuficiente'],
    defaultNocCode: '0601',
    defaultNicCode: '4120',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 2: Nutrición',
    class: 'Clase 5: Hidratación'
  },
  {
    id: 'nanda_00133',
    code: '00133',
    name: 'Dolor crónico',
    definition: 'Experiencia sensorial y emocional desagradable asociada a lesión tisular real o potencial, de inicio repentino o lento, de duración mayor a 3 meses.',
    relatedFactors: ['Enfermedades musculoesqueléticas de larga duración', 'Incapacidad prolongada', 'Compresión de terminaciones nerviosas'],
    defaultNocCode: '2102',
    defaultNicCode: '1400',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 12: Confort',
    class: 'Clase 1: Confort físico'
  },
  {
    id: 'nanda_00198',
    code: '00198',
    name: 'Trastorno del patrón del sueño',
    definition: 'Despierte de la calidad y cantidad del sueño limitado temporal o ambientalmente.',
    relatedFactors: ['Interrupciones por cuidados de enfermería', 'Ruidos ambientales', 'Estrés situacional', 'Incomodidad física'],
    defaultNocCode: '0004',
    defaultNicCode: '1850',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 4: Actividad/reposo',
    class: 'Clase 1: Sueño/reposo'
  },
  {
    id: 'nanda_00093',
    code: '00093',
    name: 'Fatiga',
    definition: 'Sensación abrumadora y sostenida de agotamiento y disminución de la capacidad para el trabajo físico y mental.',
    relatedFactors: ['Estados de enfermedad crónicos', 'Privación del sueño', 'Aumento del esfuerzo físico', 'Desnutrición'],
    defaultNocCode: '0005',
    defaultNicCode: '0180',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 4: Actividad/reposo',
    class: 'Clase 3: Equilibrio de la energía'
  },
  {
    id: 'nanda_00204',
    code: '00204',
    name: 'Perfusión tisular periférica ineficaz',
    definition: 'Disminución de la circulación sanguínea periférica que puede comprometer la salud.',
    relatedFactors: ['Diabetes mellitus', 'Tabaquismo', 'Sedentarismo', 'Hipertensión arterial'],
    defaultNocCode: '0407',
    defaultNicCode: '4060',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 4: Actividad/reposo',
    class: 'Clase 4: Respuestas cardiovasculares/pulmonares'
  },
  {
    id: 'nanda_00039',
    code: '00039',
    name: 'Riesgo de aspiración',
    definition: 'Vulnerable a la penetración de secreciones gastrointestinales u orofaríngeas en el árbol traqueobronquial.',
    relatedFactors: ['Alimentación por sonda nasogástrica', 'Disminución del nivel de conciencia', 'Presencia de vía aérea artificial', 'Afecciones neurológicas'],
    defaultNocCode: '1918',
    defaultNicCode: '3200',
    serviceContext: 'uci',
    domain: 'Dominio 11: Seguridad/protección',
    class: 'Clase 2: Lesión física'
  },
  {
    id: 'nanda_00047',
    code: '00047',
    name: 'Riesgo de deterioro de la integridad cutánea',
    definition: 'Vulnerable a una alteración de la epidermis y/o la dermis, que puede comprometer la salud.',
    relatedFactors: ['Inmovilización física', 'Excreciones húmedas de la piel', 'Fuerzas de cizallamiento continuas', 'Extremos de temperatura'],
    defaultNocCode: '1101',
    defaultNicCode: '3540',
    serviceContext: 'uci',
    domain: 'Dominio 11: Seguridad/protección',
    class: 'Clase 2: Lesión física'
  },
  {
    id: 'nanda_00108',
    code: '00108',
    name: 'Déficit de autocuidado: baño',
    definition: 'Incapacidad para realizar por sí mismo las actividades de lavado e higiene corporal.',
    relatedFactors: ['Deterioro musculoesquelético', 'Debilidad muscular', 'Dolor intenso', 'Ansiedad grave'],
    defaultNocCode: '0301',
    defaultNicCode: '1801',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 4: Actividad/reposo',
    class: 'Clase 5: Autocuidado'
  },
  {
    id: 'nanda_00011',
    code: '00011',
    name: 'Estreñimiento',
    definition: 'Disminución de la frecuencia normal de defecación acompañada de eliminación difícil o incompleta de heces.',
    relatedFactors: ['Hábitos dietéticos deficientes (poca fibra y agua)', 'Actividad física disminuida', 'Uso crónico de laxantes o fármacos'],
    defaultNocCode: '0501',
    defaultNicCode: '0450',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 3: Eliminación e intercambio',
    class: 'Clase 2: Función gastrointestinal'
  },
  {
    id: 'nanda_00013',
    code: '00013',
    name: 'Diarrea',
    definition: 'Eliminación de heces líquidas o no formadas, con aumento de la frecuencia de defecación.',
    relatedFactors: ['Procesos infecciosos gastrointestinales', 'Efectos secundarios de medicamentos (antibióticos)', 'Ansiedad extrema'],
    defaultNocCode: '0501',
    defaultNicCode: '0460',
    serviceContext: 'pediatria',
    domain: 'Dominio 3: Eliminación e intercambio',
    class: 'Clase 2: Función gastrointestinal'
  },
  {
    id: 'nanda_00126',
    code: '00126',
    name: 'Conocimientos deficientes',
    definition: 'Carencia o deficiencia de información cognitiva relacionada con un tema específico en salud.',
    relatedFactors: ['Falta de exposición a la información', 'Alteración cognitiva', 'Poca familiaridad con los recursos'],
    defaultNocCode: '1803',
    defaultNicCode: '5602',
    serviceContext: 'urgencias',
    domain: 'Dominio 5: Percepción/cognición',
    class: 'Clase 4: Cognición'
  },
  {
    id: 'nanda_00161',
    code: '00161',
    name: 'Disposición para mejorar los conocimientos',
    definition: 'Patrón de información cognitiva relacionada con un tema específico que puede ser reforzado.',
    relatedFactors: ['Expresa deseos de aprendizaje', 'Muestra disposición para el autocuidado', 'Colaborativo en la consulta'],
    defaultNocCode: '1823',
    defaultNicCode: '5510',
    serviceContext: 'partos',
    domain: 'Dominio 5: Percepción/cognición',
    class: 'Clase 4: Cognición'
  },
  {
    id: 'nanda_00051',
    code: '00051',
    name: 'Deterioro de la comunicación verbal',
    definition: 'Disminución, retraso o ausencia de la capacidad para recibir, procesar y transmitir un sistema de símbolos.',
    relatedFactors: ['Barrera idiomática', 'Déficits anatómicos o neurológicos', 'Efecto de sedación o anestesia'],
    defaultNocCode: '0902',
    defaultNicCode: '4920',
    serviceContext: 'partos',
    domain: 'Dominio 5: Percepción/cognición',
    class: 'Clase 5: Comunicación'
  },
  {
    id: 'nanda_00319',
    code: '00319',
    name: 'Síndrome de fragilidad del anciano',
    definition: 'Estado dinámico de equilibrio inestable que afecta al adulto mayor, con susceptibilidad a daños de salud.',
    relatedFactors: ['Disminución de la tolerancia al esfuerzo', 'Sarcopenia', 'Deterioro cognitivo leve', 'Polimedicación'],
    defaultNocCode: '0313',
    defaultNicCode: '1800',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 1: Promoción de la salud',
    class: 'Clase 2: Gestión de la salud'
  },
  {
    id: 'nanda_00322',
    code: '00322',
    name: 'Riesgo de retraso en el desarrollo',
    definition: 'Vulnerable a sufrir un retraso físico, cognitivo, social o del lenguaje en comparación con los parámetros normales.',
    relatedFactors: ['Desnutrición infantil', 'Falta de estimulación oportuna', 'Infecciones repetidas'],
    defaultNocCode: '0110',
    defaultNicCode: '8250',
    serviceContext: 'pediatria',
    domain: 'Dominio 13: Crecimiento/desarrollo',
    class: 'Clase 2: Desarrollo'
  },
  {
    id: 'nanda_00001',
    code: '00001',
    name: 'Desequilibrio nutricional: ingesta superior a las necesidades',
    definition: 'Consumo de nutrientes que supera las necesidades metabólicas corporales.',
    relatedFactors: ['Aporte calórico excesivo', 'Actividad física deficiente', 'Hábitos alimentarios inapropiados'],
    defaultNocCode: '1004',
    defaultNicCode: '1100',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 2: Nutrición',
    class: 'Clase 1: Ingestión'
  },
  {
    id: 'nanda_00015',
    code: '00015',
    name: 'Riesgo de estreñimiento',
    definition: 'Vulnerable a sufrir una disminución de la frecuencia normal de defecación acompañada de eliminación difícil de heces.',
    relatedFactors: ['Hábitos higiénicos deficientes', 'Disminución de la actividad física', 'Aporte insuficiente de líquidos'],
    defaultNocCode: '0501',
    defaultNicCode: '0450',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 3: Eliminación e intercambio',
    class: 'Clase 2: Función gastrointestinal'
  },
  {
    id: 'nanda_00134',
    code: '00134',
    name: 'Náuseas',
    definition: 'Sensación subjetiva desagradable en la parte posterior de la garganta y el estómago que puede provocar el vómito.',
    relatedFactors: ['Distensión gástrica', 'Efectos secundarios farmacológicos', 'Dolor intenso'],
    defaultNocCode: '2102',
    defaultNicCode: '1400',
    serviceContext: 'urgencias',
    domain: 'Dominio 12: Confort',
    class: 'Clase 1: Confort físico'
  },
  {
    id: 'nanda_00179',
    code: '00179',
    name: 'Riesgo de nivel de glucemia inestable',
    definition: 'Vulnerable a la variación de los límites de los niveles de glucosa en sangre, que puede comprometer la salud.',
    relatedFactors: ['Control insuficiente de la diabetes', 'Aporte dietético inadecuado', 'Falta de actividad física'],
    defaultNocCode: '1004',
    defaultNicCode: '1100',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 2: Nutrición',
    class: 'Clase 4: Metabolismo'
  },
  {
    id: 'nanda_00195',
    code: '00195',
    name: 'Riesgo de desequilibrio electrolítico',
    definition: 'Vulnerable a cambios en los niveles de electrolitos séricos que pueden comprometer la salud.',
    relatedFactors: ['Vómitos repetidos', 'Diarrea severa', 'Deshidratación', 'Disfunción renal'],
    defaultNocCode: '0601',
    defaultNicCode: '4120',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 2: Nutrición',
    class: 'Clase 5: Hidratación'
  },
  {
    id: 'nanda_00232',
    code: '00232',
    name: 'Obesidad',
    definition: 'Problema en el cual un individuo acumula un nivel excesivo de grasa corporal acorde a su edad y sexo.',
    relatedFactors: ['Ingesta de energía superior al consumo', 'Patrón de sedentarismo', 'Factores de conducta alimentaria'],
    defaultNocCode: '1004',
    defaultNicCode: '1100',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 2: Nutrición',
    class: 'Clase 1: Ingestión'
  },
  {
    id: 'nanda_00118',
    code: '00118',
    name: 'Trastorno de la imagen corporal',
    definition: 'Confusión en la imagen mental del yo físico, inducida por una pérdida estructural o funcional real o percibida.',
    relatedFactors: ['Procedimiento quirúrgico destructivo', 'Pérdida de función de miembro', 'Alteración cognitiva'],
    defaultNocCode: '1211',
    defaultNicCode: '5820',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 6: Autopercepción',
    class: 'Clase 3: Imagen corporal'
  },
  {
    id: 'nanda_00120',
    code: '00120',
    name: 'Baja autoestima situacional',
    definition: 'Desarrollo de una percepción negativa de la propia valía en respuesta a una situación actual.',
    relatedFactors: ['Alteración del rol social', 'Fracaso en actividades profesionales', 'Pérdidas afectivas recientes'],
    defaultNocCode: '1211',
    defaultNicCode: '5820',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 6: Autopercepción',
    class: 'Clase 2: Autoestima'
  },
  {
    id: 'nanda_00016',
    code: '00016',
    name: 'Deterioro de la eliminación urinaria',
    definition: 'Disfunción en la eliminación de la orina.',
    relatedFactors: ['Deterioro sensitivo motor', 'Infección del tracto urinario', 'Efectos de medicamentos (diuréticos)', 'Multicausalidad (poliuria, diabetes)'],
    defaultNocCode: '0503',
    defaultNicCode: '0590',
    serviceContext: 'medicina_interna',
    domain: 'Dominio 3: Eliminación e intercambio',
    class: 'Clase 1: Función urinaria'
  }
];

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
    code: 'D1',
    name: 'Dominio 1: Promoción de la salud',
    classes: [
      { code: 'C1', name: 'Clase 1: Toma de conciencia de la salud', diagnosesCodes: [] },
      { code: 'C2', name: 'Clase 2: Gestión de la salud', diagnosesCodes: ['00319'] }
    ]
  },
  {
    code: 'D2',
    name: 'Dominio 2: Nutrición',
    classes: [
      { code: 'C1', name: 'Clase 1: Ingestión', diagnosesCodes: ['00002', '00001', '00232'] },
      { code: 'C2', name: 'Clase 2: Digestión', diagnosesCodes: [] },
      { code: 'C3', name: 'Clase 3: Absorción', diagnosesCodes: [] },
      { code: 'C4', name: 'Clase 4: Metabolismo', diagnosesCodes: ['00179'] },
      { code: 'C5', name: 'Clase 5: Hidratación', diagnosesCodes: ['00028', '00027', '00195'] }
    ]
  },
  {
    code: 'D3',
    name: 'Dominio 3: Eliminación e intercambio',
    classes: [
      { code: 'C1', name: 'Clase 1: Función urinaria', diagnosesCodes: ['00016'] },
      { code: 'C2', name: 'Clase 2: Función gastrointestinal', diagnosesCodes: ['00011', '00013', '00015'] },
      { code: 'C3', name: 'Clase 3: Función tegumentaria', diagnosesCodes: [] },
      { code: 'C4', name: 'Clase 4: Función respiratoria', diagnosesCodes: [] }
    ]
  },
  {
    code: 'D4',
    name: 'Dominio 4: Actividad/reposo',
    classes: [
      { code: 'C1', name: 'Clase 1: Sueño/reposo', diagnosesCodes: ['00198'] },
      { code: 'C2', name: 'Clase 2: Actividad/ejercicio', diagnosesCodes: ['00085'] },
      { code: 'C3', name: 'Clase 3: Equilibrio de la energía', diagnosesCodes: ['00093'] },
      { code: 'C4', name: 'Clase 4: Respuestas cardiovasculares/pulmonares', diagnosesCodes: ['00032', '00029', '00031', '00030', '00204'] },
      { code: 'C5', name: 'Clase 5: Autocuidado', diagnosesCodes: ['00108'] }
    ]
  },
  {
    code: 'D5',
    name: 'Dominio 5: Percepción/cognición',
    classes: [
      { code: 'C1', name: 'Clase 1: Atención', diagnosesCodes: [] },
      { code: 'C2', name: 'Clase 2: Orientación', diagnosesCodes: [] },
      { code: 'C3', name: 'Clase 3: Sensación/percepción', diagnosesCodes: [] },
      { code: 'C4', name: 'Clase 4: Cognición', diagnosesCodes: ['00126', '00161'] },
      { code: 'C5', name: 'Clase 5: Comunicación', diagnosesCodes: ['00051'] }
    ]
  },
  {
    code: 'D6',
    name: 'Dominio 6: Autopercepción',
    classes: [
      { code: 'C1', name: 'Clase 1: Autoconcepto', diagnosesCodes: [] },
      { code: 'C2', name: 'Clase 2: Autoestima', diagnosesCodes: ['00120'] },
      { code: 'C3', name: 'Clase 3: Imagen corporal', diagnosesCodes: ['00118'] }
    ]
  },
  {
    code: 'D7',
    name: 'Dominio 7: Rol/relaciones',
    classes: [
      { code: 'C1', name: 'Clase 1: Roles de cuidador', diagnosesCodes: [] },
      { code: 'C2', name: 'Clase 2: Relaciones familiares', diagnosesCodes: [] },
      { code: 'C3', name: 'Clase 3: Desempeño del rol', diagnosesCodes: [] }
    ]
  },
  {
    code: 'D8',
    name: 'Dominio 8: Sexualidad',
    classes: [
      { code: 'C1', name: 'Clase 1: Identidad sexual', diagnosesCodes: [] },
      { code: 'C2', name: 'Clase 2: Función sexual', diagnosesCodes: [] },
      { code: 'C3', name: 'Clase 3: Reproducción', diagnosesCodes: [] }
    ]
  },
  {
    code: 'D9',
    name: 'Dominio 9: Afrontamiento/tolerancia al estrés',
    classes: [
      { code: 'C1', name: 'Clase 1: Respuestas postraumáticas', diagnosesCodes: [] },
      { code: 'C2', name: 'Clase 2: Respuestas de afrontamiento', diagnosesCodes: ['00146'] },
      { code: 'C3', name: 'Clase 3: Neurocomportamental', diagnosesCodes: [] }
    ]
  },
  {
    code: 'D10',
    name: 'Dominio 10: Principios vitales',
    classes: [
      { code: 'C1', name: 'Clase 1: Valores', diagnosesCodes: [] },
      { code: 'C2', name: 'Clase 2: Creencias', diagnosesCodes: [] },
      { code: 'C3', name: 'Clase 3: Congruencia de las acciones con los valores/creencias', diagnosesCodes: [] }
    ]
  },
  {
    code: 'D11',
    name: 'Dominio 11: Seguridad/protección',
    classes: [
      { code: 'C1', name: 'Clase 1: Infección', diagnosesCodes: ['00004'] },
      { code: 'C2', name: 'Clase 2: Lesión física', diagnosesCodes: ['00095', '00155', '00039', '00047'] },
      { code: 'C3', name: 'Clase 3: Violencia', diagnosesCodes: [] },
      { code: 'C4', name: 'Clase 4: Peligros del entorno', diagnosesCodes: [] },
      { code: 'C5', name: 'Clase 5: Procesos defensivos', diagnosesCodes: [] },
      { code: 'C6', name: 'Clase 6: Termorregulación', diagnosesCodes: ['00007'] }
    ]
  },
  {
    code: 'D12',
    name: 'Dominio 12: Confort',
    classes: [
      { code: 'C1', name: 'Clase 1: Confort físico', diagnosesCodes: ['00132', '00133', '00134'] },
      { code: 'C2', name: 'Clase 2: Confort ambiental', diagnosesCodes: [] },
      { code: 'C3', name: 'Clase 3: Confort social', diagnosesCodes: [] },
      { code: 'C4', name: 'Clase 4: Confort psicológico', diagnosesCodes: [] }
    ]
  },
  {
    code: 'D13',
    name: 'Dominio 13: Crecimiento/desarrollo',
    classes: [
      { code: 'C1', name: 'Clase 1: Crecimiento', diagnosesCodes: [] },
      { code: 'C2', name: 'Clase 2: Desarrollo', diagnosesCodes: ['00322'] }
    ]
  }
];
