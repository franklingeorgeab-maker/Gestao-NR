/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course, Instructor, CourseClass, CRMOpportunity, DocumentReference, OperationalStep } from "../types";

export const INITIAL_COURSES: Course[] = [
  {
    id: "nr10-basico",
    codeSGN: "SGN-NR10-B",
    name: "NR 10 - Segurança em Instalações e Serviços em Eletricidade (Básico)",
    duration: 40,
    syllabus: "1. Introdução à segurança com eletricidade. 2. Riscos em instalações e serviços com eletricidade. 3. Técnicas de análise de risco. 4. Medidas de controle do risco elétrico. 5. Normas e Regulamentações Técnicas. 6. Primeiros socorros e combate a incêndios.",
    modalities: ["Presencial", "Semipresencial"],
    maxParticipants: 25,
    prerequisites: "Idade mínima de 18 anos; Ensino Fundamental completo; Recomendável conhecimento básico em eletricidade."
  },
  {
    id: "nr10-sep",
    codeSGN: "SGN-NR10-SEP",
    name: "NR 10 - Segurança no Sistema Elétrico de Potência (SEP) e em suas Proximidades",
    duration: 40,
    syllabus: "1. Organização do Sistema Elétrico de Potência (SEP). 2. Organização do trabalho (planejamento, ordens de serviço). 3. Aspectos comportamentais e condições impeditivas. 4. Técnicas de trabalho sob tensão. 5. Equipamentos de proteção coletiva e individual (EPC/EPI). 6. Procedimentos de emergência.",
    modalities: ["Presencial", "Semipresencial"],
    maxParticipants: 20,
    prerequisites: "Curso de NR 10 Básico concluído e ativo."
  },
  {
    id: "nr35-trabalho-altura",
    codeSGN: "SGN-NR35-TA",
    name: "NR 35 - Trabalho em Altura",
    duration: 8,
    syllabus: "1. Normas e regulamentos aplicáveis ao trabalho em altura. 2. Análise de Risco e condições impeditivas. 3. Riscos potenciais inerentes ao trabalho em altura e medidas de prevenção e controle. 4. Equipamentos de Proteção Individual para trabalho em altura. 5. Acidentes típicos em trabalho em altura. 6. Condutas em situações de emergência, incluindo noções de técnicas de resgate e de primeiros socorros.",
    modalities: ["Presencial", "Semipresencial", "EAD"],
    maxParticipants: 20,
    prerequisites: "Idade mínima de 18 anos; Atestado de Saúde Ocupacional (ASO) apto para trabalho em altura."
  },
  {
    id: "nr33-espaco-confinado",
    codeSGN: "SGN-NR33-EC",
    name: "NR 33 - Segurança e Saúde nos Trabalhos em Espaços Confinados (Trabalhador e Vigia)",
    duration: 16,
    syllabus: "1. Definições de espaços confinados. 2. Reconhecimento, avaliação e controle de riscos. 3. Funcionamento de equipamentos utilizados. 4. Procedimentos e utilização da Permissão de Entrada e Trabalho (PET). 5. Noções de resgate e primeiros socorros. 6. Deveres e responsabilidades de vigias e trabalhadores.",
    modalities: ["Presencial"],
    maxParticipants: 16,
    prerequisites: "Atestado de Saúde Ocupacional (ASO) apto para trabalho em espaço confinado."
  },
  {
    id: "nr20-inflamaveis",
    codeSGN: "SGN-NR20-INF",
    name: "NR 20 - Segurança e Saúde no Trabalho com Inflamáveis e Combustíveis (Intermediário)",
    duration: 16,
    syllabus: "1. Introdução à norma NR 20. 2. Inflamáveis: características, propriedades, perigos e riscos. 3. Controles coletivos e individuais para trabalhos com inflamáveis. 4. Fontes de ignição e seu controle. 5. Procedimentos operacionais básicos. 6. Plano de Resposta a Emergências da Instalação.",
    modalities: ["Presencial", "Semipresencial", "EAD"],
    maxParticipants: 20,
    prerequisites: "Idade mínima de 18 anos."
  },
  {
    id: "nr12-maquinas",
    codeSGN: "SGN-NR12-ME",
    name: "NR 12 - Segurança no Trabalho em Máquinas e Equipamentos (Básico)",
    duration: 16,
    syllabus: "1. Conceitos gerais de segurança em máquinas e equipamentos. 2. Principais riscos associados a máquinas e equipamentos. 3. Proteções coletivas e sistemas de segurança. 4. Medidas de proteção individual. 5. Procedimentos de trabalho seguros e sinalização. 6. Riscos adicionais.",
    modalities: ["Presencial"],
    maxParticipants: 20,
    prerequisites: "Ensino Fundamental completo."
  }
];

export const INITIAL_INSTRUCTORS: Instructor[] = [
  {
    id: "inst-joao",
    name: "João Silva",
    linkType: "Mensalista",
    regional: "Oeste",
    contact: "(49) 98877-6655 - joao.silva@sesisc.org.br",
    competencies: ["NR 10", "SEP", "NR 35"],
    availability: "Seg, Ter, Qua, Qui, Sex",
    constraints: "Indisponível aos Sábados. Prefere turno Matutino/Vespertino.",
    notes: "Especialista em segurança elétrica de alta tensão."
  },
  {
    id: "inst-carlos",
    name: "Carlos Souza",
    linkType: "Horista",
    regional: "Oeste",
    contact: "(49) 99111-2233 - carlos.souza@partner.org.br",
    competencies: ["NR 33", "NR 20"],
    availability: "Seg, Qua, Sex",
    constraints: "Disponível apenas no período Noturno (após 18:30) e Sábados.",
    notes: "Engenheiro químico com vasta experiência em inflamáveis."
  },
  {
    id: "inst-roberto",
    name: "Roberto Nunes",
    linkType: "Terceirizado",
    regional: "Serrana",
    contact: "(49) 99933-4455 - roberto.nunes@externo.com.br",
    competencies: ["NR 35", "NR 12"],
    availability: "Qui, Sex, Sáb",
    constraints: "Sem restrições nestes dias.",
    notes: "Instrutor credenciado de resgate em altura e máquinas florestais."
  },
  {
    id: "inst-marcia",
    name: "Márcia Santos",
    linkType: "Mensalista",
    regional: "Litoral",
    contact: "(47) 98455-1122 - marcia.santos@sesisc.org.br",
    competencies: ["NR 10", "NR 20", "NR 33"],
    availability: "Seg, Ter, Wed, Thu, Fri",
    constraints: "Disponibilidade em horário comercial.",
    notes: "Excelente didática, foco em indústrias pesqueiras e portuárias."
  },
  {
    id: "inst-alexandre",
    name: "Alexandre Goulart",
    linkType: "Horista",
    regional: "Norte",
    contact: "(47) 99200-8877 - alexandre.g@sesisc.org.br",
    competencies: ["NR 12", "NR 35"],
    availability: "Ter, Qui, Sáb",
    constraints: "Prefere região de Joinville e Jaraguá do Sul.",
    notes: "Engenheiro mecânico especializado em conformidade de prensas (NR 12)."
  },
  {
    id: "inst-ana",
    name: "Ana Oliveira",
    linkType: "Mensalista",
    regional: "Vale do Itajaí",
    contact: "(47) 98811-5544 - ana.oliveira@sesisc.org.br",
    competencies: ["NR 10", "NR 35", "NR 33", "SEP"],
    availability: "Seg, Ter, Qua, Qui, Sex",
    constraints: "Sem restrições de horário.",
    notes: "Mestre em Engenharia de Segurança do Trabalho."
  },
  {
    id: "inst-fernando",
    name: "Fernando Souza",
    linkType: "Mensalista",
    regional: "Centro-Norte",
    contact: "(49) 98822-1144 - fernando.souza@sesisc.org.br",
    competencies: ["NR 10", "NR 35", "NR 33"],
    availability: "Seg, Ter, Qua, Qui, Sex",
    constraints: "Prefere região de Videira e Caçador.",
    notes: "Especialista em trabalho em altura e espaço confinado."
  }
];

export const STAGES_CONFIG = [
  { id: "step-1", name: "Demanda Comercial", responsible: "Comercial" },
  { id: "step-2", name: "Proposta", responsible: "Comercial" },
  { id: "step-3", name: "Contrato", responsible: "Comercial" },
  { id: "step-4", name: "Turma Criada", responsible: "PCP" },
  { id: "step-5", name: "Instrutor Definido", responsible: "PCP" },
  { id: "step-6", name: "Ensalamento", responsible: "PCP" },
  { id: "step-7", name: "Lista de Alunos", responsible: "Secretária" },
  { id: "step-8", name: "Materiais", responsible: "PCP" },
  { id: "step-9", name: "Curso Realizado", responsible: "Instrutor" },
  { id: "step-10", name: "Diário Lançado", responsible: "Instrutor" },
  { id: "step-11", name: "Certificados Emitidos", responsible: "Secretária" },
  { id: "step-12", name: "Faturamento", responsible: "Faturamento" },
  { id: "step-13", name: "Finalizado", responsible: "Supervisão" }
];

export function createDefaultSteps(completedCount = 3, billingCallNumber = "", crmNumber = ""): OperationalStep[] {
  return STAGES_CONFIG.map((stage, idx) => {
    let status: "Pendente" | "Em andamento" | "Concluído" | "N/A" = "Pendente";
    if (idx < completedCount) {
      status = "Concluído";
    } else if (idx === completedCount) {
      status = "Em andamento";
    }
    
    let notes = "";
    if (stage.name === "Demanda Comercial" && crmNumber) {
      notes = `Oportunidade CRM nº ${crmNumber}`;
    } else if (stage.name === "Faturamento" && billingCallNumber) {
      notes = `Chamado faturamento nº ${billingCallNumber}`;
    }

    return {
      id: stage.id,
      name: stage.name,
      status,
      responsible: stage.responsible,
      notes
    };
  });
}

export const INITIAL_CLASSES: CourseClass[] = [
  {
    id: "turma-videira",
    courseId: "nr35-trabalho-altura",
    type: "RPC",
    instructorId: "inst-fernando",
    startDate: "2026-07-27",
    endDate: "2026-07-28",
    scheduleDays: "Segunda e Terça",
    period: "Matutino",
    regional: "Centro-Norte",
    city: "Videira",
    clientName: "Iomerê Vinícola Ltda",
    maxParticipants: 15,
    currentParticipants: 12,
    status: "Confirmada",
    revenuePredicted: 3000,
    revenueRealized: 0,
    steps: createDefaultSteps(5, "", ""),
    notes: "Turma de NR 35 agendada para Videira, Região Centro-Norte."
  },
  {
    id: "turma-1",
    courseId: "nr10-basico",
    type: "RPC", // Closed for company
    instructorId: "inst-joao",
    startDate: "2026-07-20",
    endDate: "2026-07-24",
    scheduleDays: "Segunda a Sexta",
    period: "Matutino",
    regional: "Oeste",
    city: "Chapecó",
    clientName: "Aurora Alimentos S/A",
    maxParticipants: 25,
    currentParticipants: 22,
    status: "Em Andamento",
    revenuePredicted: 7500,
    revenueRealized: 7500,
    crmNumber: "CRM-2026-0941",
    billingCallNumber: "CH-8821",
    steps: createDefaultSteps(8, "CH-8821", "CRM-2026-0941"),
    notes: "Turma corporativa de grande importância. Diário e lista integrados."
  },
  {
    id: "turma-2",
    courseId: "nr35-trabalho-altura",
    type: "PAC", // Open public
    instructorId: "inst-roberto",
    startDate: "2026-07-25",
    endDate: "2026-07-25",
    scheduleDays: "Sábado",
    period: "Sábado Integral",
    regional: "Serrana",
    city: "Lages",
    clientName: "Aberto ao Público",
    maxParticipants: 20,
    currentParticipants: 18,
    status: "Confirmada",
    revenuePredicted: 3600,
    revenueRealized: 0,
    steps: createDefaultSteps(5, "", ""),
    notes: "Atingiu quorum mínimo de 12 alunos."
  },
  {
    id: "turma-3",
    courseId: "nr33-espaco-confinado",
    type: "RPC",
    instructorId: "inst-carlos",
    startDate: "2026-07-21",
    endDate: "2026-07-22",
    scheduleDays: "Terça e Quarta",
    period: "Noturno",
    regional: "Oeste",
    city: "Concórdia",
    clientName: "BRF Foods S/A",
    maxParticipants: 16,
    currentParticipants: 14,
    status: "Confirmada",
    revenuePredicted: 4800,
    revenueRealized: 0,
    crmNumber: "CRM-2026-1102",
    steps: createDefaultSteps(6, "", "CRM-2026-1102"),
    notes: "Turma noturna respeitando disponibilidade do instrutor Carlos."
  },
  {
    id: "turma-4",
    courseId: "nr20-inflamaveis",
    type: "EAD_TURMA",
    instructorId: "inst-marcia",
    startDate: "2026-08-03",
    endDate: "2026-08-14",
    scheduleDays: "EAD Auto-instrucional",
    period: "Integral",
    regional: "Litoral",
    city: "Itajaí",
    clientName: "Multi-Empresas Porto de Itajaí",
    maxParticipants: 50,
    currentParticipants: 45,
    status: "Pendente",
    revenuePredicted: 9000,
    revenueRealized: 0,
    steps: createDefaultSteps(3, "", ""),
    notes: "Acompanhamento de tutoria por Márcia."
  },
  {
    id: "turma-5",
    courseId: "nr12-maquinas",
    type: "RPC",
    instructorId: "inst-alexandre",
    startDate: "2026-07-13",
    endDate: "2026-07-14",
    scheduleDays: "Segunda e Terça",
    period: "Vespertino",
    regional: "Norte",
    city: "Joinville",
    clientName: "Tupy S/A",
    maxParticipants: 20,
    currentParticipants: 20,
    status: "Realizada",
    revenuePredicted: 5200,
    revenueRealized: 5200,
    crmNumber: "CRM-2026-0831",
    billingCallNumber: "CH-8710",
    steps: createDefaultSteps(11, "CH-8710", "CRM-2026-0831"),
    notes: "Curso finalizado com sucesso. Faturamento em processamento pela secretaria."
  },
  {
    id: "turma-6",
    courseId: "nr10-sep",
    type: "RPC",
    instructorId: null, // Pending allocation
    startDate: "2026-08-10",
    endDate: "2026-08-14",
    scheduleDays: "Segunda a Sexta",
    period: "Noturno",
    regional: "Vale do Itajaí",
    city: "Blumenau",
    clientName: "WEG Equipamentos Elétricos",
    maxParticipants: 20,
    currentParticipants: 12,
    status: "Pendente",
    revenuePredicted: 8200,
    revenueRealized: 0,
    steps: createDefaultSteps(3, "", ""),
    notes: "Aguardando definição de instrutor habilitado para SEP. Ana Oliveira e João Silva são opções."
  },
  {
    id: "turma-7",
    courseId: "nr35-trabalho-altura",
    type: "RPC",
    instructorId: "inst-roberto",
    startDate: "2026-07-01",
    endDate: "2026-07-02",
    scheduleDays: "Quarta e Quinta",
    period: "Vespertino",
    regional: "Serrana",
    city: "Curitibanos",
    clientName: "Madeireira Klabin S/A",
    maxParticipants: 15,
    currentParticipants: 15,
    status: "Faturada",
    revenuePredicted: 3200,
    revenueRealized: 3200,
    crmNumber: "CRM-2026-0701",
    billingCallNumber: "CH-8520",
    steps: (() => {
      // Create step where everything is completed
      const steps = createDefaultSteps(13, "CH-8520", "CRM-2026-0701");
      return steps.map(s => ({ ...s, status: "Concluído" as const }));
    })(),
    notes: "Processo totalmente finalizado e faturado."
  },
  {
    id: "turma-8",
    courseId: "nr10-basico",
    type: "PAC",
    instructorId: "inst-ana",
    startDate: "2026-07-15",
    endDate: "2026-07-19",
    scheduleDays: "Segunda a Sexta",
    period: "Matutino",
    regional: "Vale do Itajaí",
    city: "Brusque",
    clientName: "Aberto ao Público",
    maxParticipants: 20,
    currentParticipants: 4,
    status: "Prorrogada",
    revenuePredicted: 4000,
    revenueRealized: 0,
    steps: createDefaultSteps(4, "", ""),
    notes: "Transferida para agosto devido a baixo quorum."
  },
  {
    id: "turma-9",
    courseId: "nr33-espaco-confinado",
    type: "RPC",
    instructorId: "inst-marcia",
    startDate: "2026-07-05",
    endDate: "2026-07-06",
    scheduleDays: "Domingo e Segunda",
    period: "Integral",
    regional: "Litoral",
    city: "Penha",
    clientName: "Beto Carrero World",
    maxParticipants: 15,
    currentParticipants: 0,
    status: "Cancelada",
    revenuePredicted: 4500,
    revenueRealized: 0,
    steps: (() => {
      const steps = createDefaultSteps(4, "", "");
      return steps.map((s, idx) => idx > 3 ? { ...s, status: "N/A" as const } : s);
    })(),
    notes: "Cancelada pelo cliente por problemas internos de escala."
  }
];

export const INITIAL_CRM_OPPORTUNITIES: CRMOpportunity[] = [
  {
    id: "opp-1",
    crmNumber: "CRM-2026-1502",
    psNumber: "PS-2026-894",
    clientName: "Melt Metalúrgica Ltda",
    courseId: "nr12-maquinas",
    regional: "Norte",
    desiredDate: "2026-08-04",
    period: "Vespertino",
    participants: 15,
    status: "Negociação",
    observations: "Aguardando retorno do cliente sobre as datas propostas."
  },
  {
    id: "opp-2",
    crmNumber: "CRM-2026-1503",
    psNumber: "PS-2026-895",
    clientName: "Melnex Têxtil S/A",
    courseId: "nr35-trabalho-altura",
    regional: "Vale do Itajaí",
    desiredDate: "2026-08-11",
    period: "Matutino",
    participants: 20,
    status: "Aprovado",
    observations: "Proposta aprovada. Repassado ao PCP para agendar instrutor."
  },
  {
    id: "opp-3",
    crmNumber: "CRM-2026-1504",
    psNumber: "PS-2026-896",
    clientName: "Portobello Cerâmicas",
    courseId: "nr33-espaco-confinado",
    regional: "Litoral",
    desiredDate: "2026-08-18",
    period: "Noturno",
    participants: 12,
    status: "Negociação",
    observations: "Consultando disponibilidade de instrutor no período noturno."
  }
];

export const INITIAL_DOCUMENTS: DocumentReference[] = [
  {
    id: "doc-1",
    title: "Ficha de Curso SGN - NR 10 Básico",
    category: "Ficha de Curso",
    url: "https://sgn.sesisc.org.br/fichas/nr10-basico",
    description: "Ficha oficial de parametrização curricular do SGN para o curso básico de NR 10.",
    lastUpdated: "2026-01-15"
  },
  {
    id: "doc-2",
    title: "Ficha de Curso SGN - NR 35 Trabalho em Altura",
    category: "Ficha de Curso",
    url: "https://sgn.sesisc.org.br/fichas/nr35-altura",
    description: "Ficha oficial de parametrização curricular do SGN para NR 35.",
    lastUpdated: "2025-11-20"
  },
  {
    id: "doc-3",
    title: "Modelo de Proposta Comercial - RPC Corporativo",
    category: "Modelo",
    url: "https://share.sesisc.org.br/comercial/modelos/proposta-rpc.docx",
    description: "Template de proposta comercial pré-aprovado para turmas fechadas (RPC) de NR.",
    lastUpdated: "2026-03-01"
  },
  {
    id: "doc-4",
    title: "Manual de Operação PCP - Agendamento de Instrutores",
    category: "Manual",
    url: "https://share.sesisc.org.br/pcp/manuais/agendamento-instrutores.pdf",
    description: "Passo a passo das regras de alocação de instrutores de acordo com região e competências.",
    lastUpdated: "2026-02-10"
  },
  {
    id: "doc-5",
    title: "Modelo de Diário de Classe e Lista de Presença NR",
    category: "Modelo",
    url: "https://share.sesisc.org.br/secretaria/modelos/diario-presenca-nr.xlsx",
    description: "Template de diário de classe padrão e folha de presença física em conformidade com o SGN.",
    lastUpdated: "2026-04-12"
  }
];

// Helper to save data to localStorage
export function saveState(stateName: string, data: any) {
  try {
    localStorage.setItem(`sesi_nr_state_${stateName}`, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving state to localStorage", e);
  }
}

// Helper to load data from localStorage
export function loadState<T>(stateName: string, defaultData: T): T {
  try {
    const saved = localStorage.getItem(`sesi_nr_state_${stateName}`);
    if (saved) {
      return JSON.parse(saved) as T;
    }
  } catch (e) {
    console.error("Error loading state from localStorage", e);
  }
  return defaultData;
}
