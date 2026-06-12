export interface Assessment {
  id: string;
  status: 'Finalizado' | 'Borrador';
  dateString: string;
  timeAgo: string;
  patientName: string;
  patientId: string;
  box: string;
  nandaCode: string;
  nandaName: string;
  nandaDefinition?: string;
  relatedFactors?: string[];
  nocCode?: string;
  nocName?: string;
  nocIndicatorsCodes?: string[];
  nicCode?: string;
  nicName?: string;
  nicActivities?: string[];
  service: string;
  noteText?: string;
}

export interface Alert {
  id: string;
  name: string;
  condition: string;
  priority: 'CRÍTICO' | 'URGENTE' | 'INFORMATIVO';
  color: string;
}

export interface Diagnosis {
  id: string;
  code: string;
  name: string;
  definition: string;
  relatedFactors: string[];
  defaultNocCode: string;
  defaultNicCode: string;
  serviceContext?: string;
  domain?: string;
  class?: string;
}

export interface NocOutcome {
  id: string;
  code: string;
  name: string;
  definition: string;
  indicators: Array<{ code: string; name: string }>;
  domain: string;
}

export interface NicIntervention {
  id: string;
  code: string;
  name: string;
  activities: string[];
}

export interface ServiceContext {
  id: string;
  name: string;
  description: string;
  icon: string;
  className: string;
}
