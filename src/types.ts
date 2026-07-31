/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Regional = "Oeste" | "Serrana" | "Norte" | "Litoral" | "Vale do Itajaí" | "Centro-Norte" | "Sul" | "Sudeste";

export type Modality = "Presencial" | "Semipresencial" | "EAD";

export type CourseType = "PAC" | "RPC" | "EAD_TURMA"; // PAC: aberta, RPC: fechada empresa, EAD: 100% EAD

export interface Course {
  id: string;
  codeSGN: string;
  name: string;
  duration: number; // in hours
  syllabus: string;
  modalities: Modality[];
  maxParticipants: number;
  prerequisites: string;
}

export type InstructorLinkType = "Horista" | "Mensalista" | "Terceirizado";

export type DayOfWeek = "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta" | "Sábado" | "Domingo";
export type DayPeriod = "Manhã" | "Tarde" | "Noite";

export interface AgendaBlock {
  id: string;
  instructorId: string;
  dayOfWeek: string; // e.g. "Sábado" or "Segunda-feira"
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: "Férias" | "Atestado Médico" | "Banco de Horas" | "Compromisso Particular" | "Feriado" | "Treinamento" | "Outro";
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "Adm Geral" | "Admin. Local" | "Comercial" | "Secretaria" | "Faturista" | "Instrutor";
  functionName: string; // e.g. "Líder do Negócio", "Analista CPR", "Supervisor|PCP"
  regional: Regional;
}

export interface Instructor {
  id: string; // ID do instrutor (Obrigatório)
  name: string; // Nome completo (Obrigatório)
  email: string; // E-mail (Obrigatório)
  phone?: string; // Telefone (Opcional)
  regionalBase: Regional; // Regional-base (Obrigatório)
  unitBase: string; // Unidade-base (Obrigatório)
  cityBase: string; // Município-base (Obrigatório)
  linkType: InstructorLinkType; // Tipo de vínculo (Horista / Mensalista / Terceirizado) (Obrigatório)
  status: "Ativo" | "Inativo"; // Situação (Obrigatório)
  allowsTravel: boolean; // Permite deslocamento (Obrigatório)
  attendedRegionals?: Regional[]; // Regionais atendidas (Opcional)
  notes: string; // Observações (Obrigatório)
  
  // Disponibilidade
  periods: DayPeriod[]; // Manhã, Tarde, Noite (Obrigatório selecionar ao menos um)
  availableDays: DayOfWeek[]; // Segunda a Sábado (Obrigatório selecionar)
  
  // Competências / Matriz de Cursos (NRs)
  competencies: string[];

  // Compatibilidade com visualizações antigas / textos formatados
  regional?: Regional;
  contact?: string;
  availability?: string;
  constraints?: string;
}

export type StepStatus = "Pendente" | "Em andamento" | "Concluído" | "N/A";

export interface OperationalStep {
  id: string;
  name: string;
  status: StepStatus;
  responsible: string; // e.g. "Comercial", "PCP", "Secretária", "Faturamento"
  updatedAt?: string;
  notes?: string;
}

export type ClassStatus = "Pendente" | "Confirmada" | "Em Andamento" | "Realizada" | "Faturada" | "Cancelada" | "Prorrogada";

export interface CourseClass {
  id: string;
  courseId: string;
  type: CourseType;
  instructorId: string | null; // null if not allocated yet
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  scheduleDays: string; // e.g. "Segunda a Sexta" or "Sábado"
  period: "Matutino" | "Vespertino" | "Noturno" | "Integral" | "Sábado Integral";
  regional: Regional;
  city: string;
  clientName: string; // "Aberto ao Público" for PAC, or specific Company Name for RPC
  maxParticipants: number;
  currentParticipants: number;
  status: ClassStatus;
  steps: OperationalStep[];
  revenuePredicted: number;
  revenueRealized: number;
  billingCallNumber?: string; // Nº abertura chamado
  crmNumber?: string; // CRM opportunity number if generated from commercial
  notes?: string;
}

export interface CRMOpportunity {
  id: string;
  crmNumber: string;
  psNumber: string; // Proposta de Serviço
  clientName: string;
  courseId: string;
  regional: Regional;
  desiredDate: string; // YYYY-MM-DD
  period: "Matutino" | "Vespertino" | "Noturno" | "Integral";
  participants: number;
  status: "Negociação" | "Aprovado" | "Perdido";
  observations?: string;
}

export interface DocumentReference {
  id: string;
  title: string;
  courseId?: string; // Optional links to courses
  category: "Ficha de Curso" | "Modelo" | "Manual" | "Regulamento";
  url: string;
  description: string;
  lastUpdated: string;
}

export type AccessProfile = 
  | "Comercial" 
  | "PCP" 
  | "Secretária" 
  | "Instrutor" 
  | "Faturamento" 
  | "Supervisão";
