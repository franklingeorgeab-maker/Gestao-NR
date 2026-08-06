/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course, Instructor, CourseClass, CRMOpportunity, DocumentReference, OperationalStep, AgendaBlock, UserProfile } from "../types";

export const INITIAL_USER_PROFILES: UserProfile[] = [
  {
    id: "usr-leandro",
    name: "Leandro Barbosa",
    email: "leandro.barbosa@sesisc.org.br",
    role: "Adm Geral",
    functionName: "Líder do Negócio",
    regional: "Centro-Norte"
  },
  {
    id: "usr-alexsander",
    name: "Alexsander",
    email: "alexsander@sesisc.org.br",
    role: "Adm Geral",
    functionName: "Analista CPR",
    regional: "Centro-Norte"
  },
  {
    id: "usr-lorines",
    name: "Lorinês",
    email: "lorines@sesisc.org.br",
    role: "Admin. Local",
    functionName: "Supervisor|PCP",
    regional: "Centro-Norte"
  },
  {
    id: "usr-natacha",
    name: "Natacha",
    email: "natacha@sesisc.org.br",
    role: "Admin. Local",
    functionName: "Supervisor|PCP",
    regional: "Centro-Norte"
  },
  {
    id: "usr-matheus",
    name: "Matheus",
    email: "matheus@sesisc.org.br",
    role: "Comercial",
    functionName: "Comercial",
    regional: "Centro-Norte"
  },
  {
    id: "usr-eduardo",
    name: "Eduardo Deon",
    email: "eduardo.deon@sesisc.org.br",
    role: "Comercial",
    functionName: "Comercial",
    regional: "Centro-Norte"
  },
  {
    id: "usr-anderson",
    name: "Anderson",
    email: "anderson@sesisc.org.br",
    role: "Secretaria",
    functionName: "Secretaria",
    regional: "Centro-Norte"
  },
  {
    id: "usr-queila",
    name: "Queila",
    email: "queila@sesisc.org.br",
    role: "Secretaria",
    functionName: "Secretaria",
    regional: "Centro-Norte"
  },
  {
    id: "usr-monica",
    name: "Mônica",
    email: "monica@sesisc.org.br",
    role: "Faturista",
    functionName: "Faturista",
    regional: "Centro-Norte"
  }
];

export const INITIAL_AGENDA_BLOCKS: AgendaBlock[] = [
  {
    id: "blk-1",
    instructorId: "522389",
    dayOfWeek: "Sábado",
    startTime: "08:00",
    endTime: "17:00",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    reason: "Férias",
    notes: "Bloqueio anual de férias cadastrado em agenda"
  },
  {
    id: "blk-2",
    instructorId: "522389",
    dayOfWeek: "Segunda",
    startTime: "18:30",
    endTime: "22:30",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    reason: "Atestado Médico",
    notes: "Afastamento médico do período noturno"
  },
  {
    id: "blk-3",
    instructorId: "522389",
    dayOfWeek: "Terça",
    startTime: "18:30",
    endTime: "22:30",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    reason: "Banco de Horas",
    notes: "Folga de compensação de banco de horas"
  },
  {
    id: "blk-4",
    instructorId: "522389",
    dayOfWeek: "Quarta",
    startTime: "18:30",
    endTime: "22:30",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    reason: "Compromisso Particular",
    notes: "Compromisso pessoal previamente informado"
  },
  {
    id: "blk-5",
    instructorId: "522389",
    dayOfWeek: "Quinta",
    startTime: "18:30",
    endTime: "22:30",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    reason: "Feriado",
    notes: "Recesso e feriados institucionais"
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: "c-2430",
    codeSGN: "2430",
    name: "NR 35 - Trabalho em Altura",
    duration: 8,
    syllabus: "Normas e regulamentos aplicáveis ao trabalho em altura; Análise de Risco e condições impeditivas; Riscos potenciais inerentes ao trabalho em altura e medidas de prevenção e controle; Sistemas, equipamentos e procedimentos de proteção coletiva;",
    modalities: ["Presencial"],
    maxParticipants: 20,
    prerequisites: "Atestado de Saúde Ocupacional (ASO) apto para trabalho em altura."
  },
  {
    id: "c-2931",
    codeSGN: "2931",
    name: "NR 11 - Segurança na Operação de Empilhadeira de pequeno porte",
    duration: 16,
    syllabus: "Tipos de empilhadeira; Noções sobre legislação de trânsito e segurança; Descrição e identificação dos riscos associados à operação de empilhadeira elétrica e retrátil;",
    modalities: ["Presencial"],
    maxParticipants: 16,
    prerequisites: "Carteira Nacional de Habilitação (CNH) B ou superior."
  },
  {
    id: "c-2754",
    codeSGN: "2754",
    name: "NR 05 - Comissão Interna de Prevenção de Acidentes e Assédio - CIPA - Semipresencial (Grau de Risco 2)",
    duration: 12,
    syllabus: "Estudo do ambiente, das condições de trabalho, riscos originados do processo produtivo; Noções sobre acidentes e doenças relacionadas ao trabalho;",
    modalities: ["Semipresencial"],
    maxParticipants: 25,
    prerequisites: "Membro eleito ou designado da CIPA."
  },
  {
    id: "c-4236",
    codeSGN: "4236",
    name: "NR 05 - Comissão Interna de Prevenção de Acidentes e Assédio - CIPA - EAD (Grau de Risco 1)",
    duration: 8,
    syllabus: "Estudo do ambiente de trabalho e noções sobre prevenção de acidentes e assédio nas empresas de grau de risco 1.",
    modalities: ["EAD"],
    maxParticipants: 30,
    prerequisites: "Nenhum pré-requisito."
  },
  {
    id: "c-2725",
    codeSGN: "2725",
    name: "NR 05 - Comissão Interna de Prevenção de Acidentes e Assédio - CIPA (Grau de Risco 2)",
    duration: 12,
    syllabus: "Estudo do ambiente, das condições de trabalho e riscos ocupacionais.",
    modalities: ["Presencial"],
    maxParticipants: 25,
    prerequisites: "Membro CIPA."
  },
  {
    id: "c-2724",
    codeSGN: "2724",
    name: "NR 05 - Comissão Interna de Prevenção de Acidentes e Assédio - CIPA (Grau de Risco 1)",
    duration: 8,
    syllabus: "Treinamento presencial para comissão interna de prevenção de acidentes.",
    modalities: ["Presencial"],
    maxParticipants: 25,
    prerequisites: "Membro CIPA."
  },
  {
    id: "c-2726",
    codeSGN: "2726",
    name: "NR 05 - Comissão Interna de Prevenção de Acidentes e Assédio - CIPA (Grau de Risco 3)",
    duration: 16,
    syllabus: "Estudo aprofundado dos processos produtivos, mapas de risco e combate ao assédio.",
    modalities: ["Presencial"],
    maxParticipants: 25,
    prerequisites: "Membro CIPA."
  },
  {
    id: "c-2723",
    codeSGN: "2723",
    name: "NR 05 - Comissão Interna de Prevenção de Acidentes e Assédio - CIPA (Grau de Risco 4 e 5)",
    duration: 20,
    syllabus: "Treinamento completo para estabelecimentos de alto grau de risco.",
    modalities: ["Presencial"],
    maxParticipants: 25,
    prerequisites: "Membro CIPA."
  },
  {
    id: "c-4478",
    codeSGN: "4478",
    name: "NR 06 EPI 6h - EAD",
    duration: 6,
    syllabus: "Responsabilidades, Riscos no ambiente de Trabalho e Tipos de EPI.",
    modalities: ["EAD"],
    maxParticipants: 50,
    prerequisites: "Nenhum."
  },
  {
    id: "c-2458",
    codeSGN: "2458",
    name: "NR 06 EPI 4h - presencial",
    duration: 4,
    syllabus: "Treinamento presencial sobre uso adequado, guarda e conservação dos EPIs.",
    modalities: ["Presencial"],
    maxParticipants: 30,
    prerequisites: "Nenhum."
  },
  {
    id: "c-2745",
    codeSGN: "2745",
    name: "NR 06 EPI 2h - presencial",
    duration: 2,
    syllabus: "Treinamento objetivo de conscientização e manuseio de Equipamentos de Proteção Individual.",
    modalities: ["Presencial"],
    maxParticipants: 30,
    prerequisites: "Nenhum."
  },
  {
    id: "c-3397",
    codeSGN: "3397",
    name: "NR 10 - Complementar (SEP) - Reciclagem",
    duration: 8,
    syllabus: "Organização do Sistema Elétrico de Potência – SEP; Condições impeditivas para serviços; Riscos típicos no SEP;",
    modalities: ["Presencial"],
    maxParticipants: 20,
    prerequisites: "Validade do treinamento anterior expirada."
  },
  {
    id: "c-2383",
    codeSGN: "2383",
    name: "NR 10 - Básico - Reciclagem",
    duration: 8,
    syllabus: "Norma e Legislação, Prevenção e combate a Incêndio, Primeiros Socorros e Riscos Elétricos.",
    modalities: ["Presencial"],
    maxParticipants: 20,
    prerequisites: "Curso de NR 10 Básico prévio."
  },
  {
    id: "c-2386",
    codeSGN: "2386",
    name: "NR 10 - Complementar (SEP) - Formação",
    duration: 40,
    syllabus: "Medidas de Controle, Noções de Resgate, Organização do Trabalho no SEP, Trabalho Sob Tensão.",
    modalities: ["Presencial"],
    maxParticipants: 20,
    prerequisites: "NR 10 Básico concluído."
  },
  {
    id: "c-2389",
    codeSGN: "2389",
    name: "NR 10 - Básico - Formação",
    duration: 40,
    syllabus: "Norma e Legislação, Prevenção e combate a Incêndio, Primeiros Socorros e Riscos Elétricos completíssimos.",
    modalities: ["Presencial"],
    maxParticipants: 20,
    prerequisites: "Conhecimento básico em eletricidade."
  },
  {
    id: "c-2695",
    codeSGN: "2695",
    name: "NR 11 - Segurança na Operação de Empilhadeira de pequeno porte",
    duration: 8,
    syllabus: "Tipos de empilhadeira, Noções sobre legislação de trânsito e segurança do trabalho.",
    modalities: ["Presencial"],
    maxParticipants: 16,
    prerequisites: "CNH B."
  },
  {
    id: "c-3669",
    codeSGN: "3669",
    name: "NR 11 - Operador de Ponte Rolante e Talha Elétrica",
    duration: 8,
    syllabus: "Princípio de funcionamento dos conjuntos, Tipos de ponte rolante e talha elétrica, Equipamentos de segurança operacional.",
    modalities: ["Presencial"],
    maxParticipants: 15,
    prerequisites: "Nenhum."
  },
  {
    id: "c-3567",
    codeSGN: "3567",
    name: "NR 11 e NR 12 - Segurança na Operação de Máquinas Pesadas - Reciclagem",
    duration: 8,
    syllabus: "Introdução à Operação de Máquinas Pesadas, Inspeção inicial e Lista de Verificação.",
    modalities: ["Presencial"],
    maxParticipants: 15,
    prerequisites: "Curso de formação prévio."
  },
  {
    id: "c-3848",
    codeSGN: "3848",
    name: "NR 11 e NR 12 - Segurança na Operação de Empilhadeira Retrátil",
    duration: 8,
    syllabus: "Empilhadeira elétrica retrátil e princípio de funcionamento, riscos associados.",
    modalities: ["Presencial"],
    maxParticipants: 15,
    prerequisites: "CNH B."
  },
  {
    id: "c-4174",
    codeSGN: "4174",
    name: "NR 11 e NR 12 - Segurança na Operação de Máquinas Pesadas",
    duration: 16,
    syllabus: "Operação prática, responsabilidades, inspeção de pré-uso e segurança na locomoção de máquinas pesadas.",
    modalities: ["Presencial"],
    maxParticipants: 15,
    prerequisites: "CNH C ou superior."
  },
  {
    id: "c-2402",
    codeSGN: "2402",
    name: "NR 12 - Segurança no Trabalho em Máquinas e Equipamentos",
    duration: 4,
    syllabus: "Permissão de trabalho, Sistema de bloqueio e consignação, Limpeza e manutenção segura.",
    modalities: ["Presencial"],
    maxParticipants: 20,
    prerequisites: "Nenhum."
  },
  {
    id: "c-2399",
    codeSGN: "2399",
    name: "NR 12 - Segurança no Trabalho em Máquinas Injetoras de Plástico",
    duration: 8,
    syllabus: "Sistemas de proteção hidráulica, elétrica e mecânica em injetoras de plástico.",
    modalities: ["Presencial"],
    maxParticipants: 15,
    prerequisites: "Operador de injetoras."
  },
  {
    id: "c-2400",
    codeSGN: "2400",
    name: "NR 12 - Segurança na Operação de Motosserra",
    duration: 8,
    syllabus: "Reconhecimento do equipamento, preservação ambiental e práticas de corte seguro.",
    modalities: ["Presencial"],
    maxParticipants: 12,
    prerequisites: "Atestado de aptidão física."
  },
  {
    id: "c-3864",
    codeSGN: "3864",
    name: "NR 12 - Segurança na Operação de Roçadeira Costal",
    duration: 8,
    syllabus: "Identificação dos riscos associados à roçadeira costal e uso correto de EPIs e proteções.",
    modalities: ["Presencial"],
    maxParticipants: 15,
    prerequisites: "Nenhum."
  },
  {
    id: "c-3651",
    codeSGN: "3651",
    name: "NR 17 - Ergonomia",
    duration: 8,
    syllabus: "Conceito de Ergonomia, tipos de ergonomia e prevenção de riscos ergonômicos no ambiente de trabalho.",
    modalities: ["Presencial"],
    maxParticipants: 25,
    prerequisites: "Nenhum."
  },
  {
    id: "c-2750",
    codeSGN: "2750",
    name: "NR 18 - Básico",
    duration: 4,
    syllabus: "As condições e meio ambiente de trabalho na indústria da construção civil; riscos inerentes.",
    modalities: ["Presencial"],
    maxParticipants: 25,
    prerequisites: "Trabalhador da Construção Civil."
  },
  {
    id: "c-2784",
    codeSGN: "2784",
    name: "NR 18 - Operador de PEMT (Plataforma de Trabalho Aéreo)",
    duration: 8,
    syllabus: "Seleção da PEMT apropriada, regras de segurança e operação prática.",
    modalities: ["Presencial"],
    maxParticipants: 15,
    prerequisites: "NR 35 Aprovado."
  },
  {
    id: "c-2787",
    codeSGN: "2787",
    name: "NR 20 - Segurança e Saúde no Trabalho com Inflamáveis - Básico (Classe I)",
    duration: 4,
    syllabus: "Inflamáveis: características, propriedades, perigos e riscos; controles coletivos e individuais.",
    modalities: ["Presencial"],
    maxParticipants: 20,
    prerequisites: "Nenhum."
  },
  {
    id: "c-3679",
    codeSGN: "3679",
    name: "NR 23 - Brigadista Orgânico - Básico",
    duration: 8,
    syllabus: "Noções de extinção de princípios de incêndios, Primeiros Socorros e Sistemas preventivos.",
    modalities: ["Presencial"],
    maxParticipants: 20,
    prerequisites: "Aptidão física."
  },
  {
    id: "c-3681",
    codeSGN: "3681",
    name: "NR 23 - Brigadista Orgânico - Intermediário",
    duration: 16,
    syllabus: "Combate presencial a incêndios estruturais, resgate e suporte básico de vida.",
    modalities: ["Presencial"],
    maxParticipants: 20,
    prerequisites: "Brigada Básica."
  },
  {
    id: "c-2420",
    codeSGN: "2420",
    name: "NR 31 - Segurança na Operação de Máquinas Florestais",
    duration: 40,
    syllabus: "Norma Regulamentadora, tipos de máquinas florestais (Harvester, Forwarder) e manutenção preventiva.",
    modalities: ["Presencial"],
    maxParticipants: 12,
    prerequisites: "CNH C."
  },
  {
    id: "c-2422",
    codeSGN: "2422",
    name: "NR 33 - Espaço Confinado - Supervisores de Entrada (Formação)",
    duration: 8,
    syllabus: "Permissão de Entrada e Trabalho (PET), testes atmosféricos e níveis de atuação.",
    modalities: ["Presencial"],
    maxParticipants: 16,
    prerequisites: "ASO Apto Espaço Confinado."
  },
  {
    id: "c-2425",
    codeSGN: "2425",
    name: "NR 33 - Espaço Confinado - Trabalhadores e Vigias (Formação)",
    duration: 8,
    syllabus: "Definições, riscos, operação do vigia e PET.",
    modalities: ["Presencial"],
    maxParticipants: 16,
    prerequisites: "ASO Apto Espaço Confinado."
  }
];

export const INITIAL_INSTRUCTORS: Instructor[] = [
  {
    id: "522389",
    name: "Luiz Ricardo Mereles",
    email: "luiz.mereles@sesisc.org.br",
    phone: "(48) 99999-9999",
    regionalBase: "Centro-Norte",
    unitBase: "Caçador",
    cityBase: "Caçador",
    linkType: "Horista",
    status: "Ativo",
    allowsTravel: true,
    attendedRegionals: ["Centro-Norte"],
    notes: "Atende somente aos sábados ou período noturno durante a semana",
    periods: ["Noite"],
    availableDays: ["Segunda", "Terça", "Quarta", "Quinta", "Sábado"],
    competencies: ["NR 10 - Básico", "NR 10 - SEP", "NR 18 - PEMT", "NR 33", "NR 35"],
    regional: "Centro-Norte",
    contact: "(48) 99999-9999 - luiz.mereles@sesisc.org.br",
    availability: "Segunda a Quinta (Noturno), Sábado (Integral)",
    constraints: "Atende somente aos sábados ou período noturno durante a semana"
  },
  {
    id: "516915",
    name: "Tiago Alves de Almeida",
    email: "tiago.a.almeida@sesisc.org.br",
    phone: "(48) 99999-9999",
    regionalBase: "Centro-Norte",
    unitBase: "Canoinhas",
    cityBase: "Canoinhas",
    linkType: "Mensalista",
    status: "Ativo",
    allowsTravel: true,
    attendedRegionals: ["Centro-Norte"],
    notes: "Atendimento horário comercial",
    periods: ["Manhã", "Tarde"],
    availableDays: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
    competencies: ["NR 05 - CIPA", "NR 06 - EPI", "NR 10 - Básico", "NR 11 - Ponte Rolante", "NR 11 - Empilhadeira", "NR 12", "NR 17", "NR 18", "NR 20", "NR 23", "NR 33", "NR 35"],
    regional: "Centro-Norte",
    contact: "(48) 99999-9999 - tiago.a.almeida@sesisc.org.br",
    availability: "Segunda a Sexta (Manhã e Tarde)",
    constraints: "Atendimento em horário comercial"
  },
  {
    id: "525908",
    name: "Alex Sandro Cavalheiro do Amaral",
    email: "alex.sandro@sesisc.org.br",
    phone: "(48) 99999-9999",
    regionalBase: "Centro-Norte",
    unitBase: "Caçador",
    cityBase: "Caçador",
    linkType: "Horista",
    status: "Ativo",
    allowsTravel: true,
    attendedRegionals: ["Centro-Norte"],
    notes: "Atende somente aos sábados ou período noturno durante a semana",
    periods: ["Manhã", "Tarde", "Noite"],
    availableDays: ["Sexta", "Sábado"],
    competencies: ["NR 31 - Máquinas Florestais", "NR 33", "NR 35"],
    regional: "Centro-Norte",
    contact: "(48) 99999-9999 - alex.sandro@sesisc.org.br",
    availability: "Sexta (Integral) e Sábado (Integral)",
    constraints: "Atende conforme disponibilidade em escala"
  },
  {
    id: "516918",
    name: "Jandir Lucas",
    email: "jandir.lucas@sesisc.org.br",
    phone: "(48) 99999-9999",
    regionalBase: "Centro-Norte",
    unitBase: "Videira",
    cityBase: "Videira",
    linkType: "Mensalista",
    status: "Ativo",
    allowsTravel: true,
    attendedRegionals: ["Centro-Norte"],
    notes: "Atendimento horário comercial",
    periods: ["Manhã", "Tarde"],
    availableDays: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
    competencies: ["NR 05 - CIPA", "NR 06 - EPI", "NR 10 - Básico", "NR 12", "NR 17", "NR 20", "NR 23", "NR 33", "NR 35"],
    regional: "Centro-Norte",
    contact: "(48) 99999-9999 - jandir.lucas@sesisc.org.br",
    availability: "Segunda a Sexta (Horário comercial)",
    constraints: "Atendimento em horário comercial"
  },
  {
    id: "516910",
    name: "Vanderlei Batista",
    email: "vanderlei.batista@sesisc.org.br",
    phone: "(48) 99999-9999",
    regionalBase: "Centro-Norte",
    unitBase: "Caçador",
    cityBase: "Caçador",
    linkType: "Horista",
    status: "Ativo",
    allowsTravel: true,
    attendedRegionals: ["Centro-Norte"],
    notes: "Atende somente aos sábados ou período noturno durante a semana",
    periods: ["Noite"],
    availableDays: ["Quarta", "Sábado"],
    competencies: ["NR 05", "NR 06", "NR 10", "NR 11 - Ponte Rolante", "NR 11 - Empilhadeira", "NR 11 - Máquinas Pesadas", "NR 12", "NR 17", "NR 20", "NR 23", "NR 33", "NR 35"],
    regional: "Centro-Norte",
    contact: "(48) 99999-9999 - vanderlei.batista@sesisc.org.br",
    availability: "Quarta-feira (Noturno), Sábado (Integral)",
    constraints: "Atende somente aos sábados ou período noturno durante a semana"
  },
  {
    id: "518298",
    name: "Adriano Tumiski",
    email: "adriano.tumiski@sesisc.org.br",
    phone: "(48) 99999-9999",
    regionalBase: "Centro-Norte",
    unitBase: "Caçador",
    cityBase: "Caçador",
    linkType: "Horista",
    status: "Ativo",
    allowsTravel: true,
    attendedRegionals: ["Centro-Norte"],
    notes: "Atende somente aos sábados ou período noturno durante a semana",
    periods: ["Manhã", "Tarde"],
    availableDays: ["Sábado"],
    competencies: ["NR 05", "NR 06", "NR 11 - Empilhadeira", "NR 11 - Ponte Rolante", "NR 12", "NR 17", "NR 20", "NR 23"],
    regional: "Centro-Norte",
    contact: "(48) 99999-9999 - adriano.tumiski@sesisc.org.br",
    availability: "Sábado (Integral)",
    constraints: "Disponível aos Sábados"
  },
  {
    id: "522344",
    name: "Everaldo Cesar de Castro",
    email: "everaldo.castro@sesisc.org.br",
    phone: "(48) 99999-9999",
    regionalBase: "Centro-Norte",
    unitBase: "Caçador",
    cityBase: "Caçador",
    linkType: "Horista",
    status: "Ativo",
    allowsTravel: true,
    attendedRegionals: ["Centro-Norte"],
    notes: "Atende somente aos sábados ou período noturno durante a semana",
    periods: ["Manhã", "Tarde"],
    availableDays: ["Sábado"],
    competencies: ["NR 13 - Caldeiras", "NR 13 - Unidades de Processo"],
    regional: "Centro-Norte",
    contact: "(48) 99999-9999 - everaldo.castro@sesisc.org.br",
    availability: "Sábado (Integral)",
    constraints: "Especialista em NR 13"
  },
  {
    id: "522135",
    name: "Romão Gonçalves",
    email: "romao.goncalves@sesisc.org.br",
    phone: "(48) 99999-9999",
    regionalBase: "Centro-Norte",
    unitBase: "Canoinhas",
    cityBase: "Canoinhas",
    linkType: "Horista",
    status: "Ativo",
    allowsTravel: true,
    attendedRegionals: ["Centro-Norte"],
    notes: "Atende somente conforme escala em dias programados mensal",
    periods: ["Manhã", "Tarde"],
    availableDays: ["Sábado"],
    competencies: ["NR 05", "NR 06", "NR 10", "NR 11", "NR 12", "NR 17", "NR 20", "NR 23"],
    regional: "Centro-Norte",
    contact: "(48) 99999-9999 - romao.goncalves@sesisc.org.br",
    availability: "Conforme escala mensal",
    constraints: "Verificar escala programada mensal"
  },
  {
    id: "524281",
    name: "Vinnicius Bruno Antunes",
    email: "vinnicius.antunes@sesisc.org.br",
    phone: "(48) 99999-9999",
    regionalBase: "Centro-Norte",
    unitBase: "Videira",
    cityBase: "Videira",
    linkType: "Horista",
    status: "Ativo",
    allowsTravel: true,
    attendedRegionals: ["Centro-Norte"],
    notes: "Atende Noturno e sábados",
    periods: ["Noite", "Manhã", "Tarde"],
    availableDays: ["Sábado"],
    competencies: ["NR 05", "NR 06", "NR 11", "NR 12", "NR 18", "NR 20", "NR 23", "NR 33", "NR 35"],
    regional: "Centro-Norte",
    contact: "(48) 99999-9999 - vinnicius.antunes@sesisc.org.br",
    availability: "Noturno e Sábados",
    constraints: "Atende Noturno e Sábados"
  },
  {
    id: "530675",
    name: "Jaison Wroblewski",
    email: "jaison.wroblewski@sesisc.org.br",
    phone: "(48) 99999-9999",
    regionalBase: "Centro-Norte",
    unitBase: "Videira",
    cityBase: "Videira",
    linkType: "Horista",
    status: "Ativo",
    allowsTravel: true,
    attendedRegionals: ["Centro-Norte"],
    notes: "Atende Noturno e sábados",
    periods: ["Noite", "Manhã", "Tarde"],
    availableDays: ["Sábado"],
    competencies: ["NR 05", "NR 06", "NR 11", "NR 12", "NR 18", "NR 20", "NR 23", "NR 33", "NR 35"],
    regional: "Centro-Norte",
    contact: "(48) 99999-9999 - jaison.wroblewski@sesisc.org.br",
    availability: "Noturno e Sábados",
    constraints: "Atende Noturno e Sábados"
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
    courseId: "c-2430",
    type: "RPC",
    instructorId: "522389",
    startDate: "2026-07-27",
    endDate: "2026-07-28",
    scheduleDays: "Segunda e Terça",
    period: "Noturno",
    regional: "Centro-Norte",
    city: "Videira",
    clientName: "Iomerê Vinícola Ltda",
    maxParticipants: 15,
    currentParticipants: 12,
    status: "Confirmada",
    revenuePredicted: 3000,
    revenueRealized: 0,
    steps: createDefaultSteps(5, "", ""),
    notes: "Turma de NR 35 agendada para Videira, Região Centro-Norte com Luiz Ricardo."
  },
  {
    id: "turma-1",
    courseId: "c-2389",
    type: "RPC", // Closed for company
    instructorId: "516915",
    startDate: "2026-07-20",
    endDate: "2026-07-24",
    scheduleDays: "Segunda a Sexta",
    period: "Matutino",
    regional: "Centro-Norte",
    city: "Canoinhas",
    clientName: "Papeis e Celulose Canoinhas S/A",
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
    courseId: "c-2430",
    type: "PAC", // Open public
    instructorId: "525908",
    startDate: "2026-07-25",
    endDate: "2026-07-25",
    scheduleDays: "Sábado",
    period: "Sábado Integral",
    regional: "Centro-Norte",
    city: "Caçador",
    clientName: "Aberto ao Público",
    maxParticipants: 20,
    currentParticipants: 18,
    status: "Confirmada",
    revenuePredicted: 3600,
    revenueRealized: 0,
    steps: createDefaultSteps(5, "", ""),
    notes: "Atingiu quorum mínimo de 12 alunos com Alex Sandro."
  },
  {
    id: "turma-3",
    courseId: "c-2425",
    type: "RPC",
    instructorId: "516910",
    startDate: "2026-07-22",
    endDate: "2026-07-22",
    scheduleDays: "Quarta",
    period: "Noturno",
    regional: "Centro-Norte",
    city: "Caçador",
    clientName: "Guararapes Painéis S/A",
    maxParticipants: 16,
    currentParticipants: 14,
    status: "Confirmada",
    revenuePredicted: 4800,
    revenueRealized: 0,
    crmNumber: "CRM-2026-1102",
    steps: createDefaultSteps(6, "", "CRM-2026-1102"),
    notes: "Turma noturna respeitando disponibilidade de Vanderlei Batista."
  },
  {
    id: "turma-4",
    courseId: "c-2787",
    type: "EAD_TURMA",
    instructorId: "516918",
    startDate: "2026-08-03",
    endDate: "2026-08-14",
    scheduleDays: "EAD Auto-instrucional",
    period: "Integral",
    regional: "Centro-Norte",
    city: "Videira",
    clientName: "BRF S/A - Unidade Videira",
    maxParticipants: 50,
    currentParticipants: 45,
    status: "Pendente",
    revenuePredicted: 9000,
    revenueRealized: 0,
    steps: createDefaultSteps(3, "", ""),
    notes: "Acompanhamento de tutoria por Jandir Lucas."
  },
  {
    id: "turma-5",
    courseId: "c-2402",
    type: "RPC",
    instructorId: "518298",
    startDate: "2026-07-18",
    endDate: "2026-07-18",
    scheduleDays: "Sábado",
    period: "Matutino",
    regional: "Centro-Norte",
    city: "Caçador",
    clientName: "Alfa Transportes S/A",
    maxParticipants: 20,
    currentParticipants: 20,
    status: "Realizada",
    revenuePredicted: 5200,
    revenueRealized: 5200,
    crmNumber: "CRM-2026-0831",
    billingCallNumber: "CH-8710",
    steps: createDefaultSteps(11, "CH-8710", "CRM-2026-0831"),
    notes: "Curso finalizado com sucesso com Adriano Tumiski."
  },
  {
    id: "turma-6",
    courseId: "c-2386",
    type: "RPC",
    instructorId: null, // Pending allocation
    startDate: "2026-08-10",
    endDate: "2026-08-14",
    scheduleDays: "Segunda a Sexta",
    period: "Noturno",
    regional: "Centro-Norte",
    city: "Caçador",
    clientName: "Industria de Madeiras Caçador",
    maxParticipants: 20,
    currentParticipants: 12,
    status: "Pendente",
    revenuePredicted: 8200,
    revenueRealized: 0,
    steps: createDefaultSteps(3, "", ""),
    notes: "Aguardando definição de instrutor habilitado para SEP. Luiz Ricardo é opção."
  },
  {
    id: "turma-7",
    courseId: "c-2430",
    type: "RPC",
    instructorId: "522389",
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
