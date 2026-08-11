import React, { useState } from "react";
import { 
  BookOpen, 
  X, 
  Code2, 
  ShieldCheck, 
  Layers, 
  Search, 
  Calendar, 
  Users, 
  TrendingUp, 
  FileText, 
  Settings, 
  CheckCircle2, 
  Cpu, 
  Database, 
  Sparkles,
  UserSquare2,
  HelpCircle,
  ChevronRight,
  Printer,
  Download
} from "lucide-react";

interface SystemManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SystemManualModal({ isOpen, onClose }: SystemManualModalProps) {
  const [activeTab, setActiveTab] = useState<"visao_geral" | "tecnologias" | "modulos" | "perfis" | "passo_a_passo">("visao_geral");
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 rounded-xl border border-blue-400/30">
              <BookOpen className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-blue-500/30 text-blue-200 rounded-md border border-blue-400/30">
                  Documentação Oficial SESI
                </span>
                <span className="text-[10px] text-slate-400 font-mono">v2026.1</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Manual do Sistema & Catálogo Técnico
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="Fechar Manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Navigation Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("visao_geral")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "visao_geral"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              📌 Visão Geral
            </button>

            <button
              onClick={() => setActiveTab("tecnologias")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "tecnologias"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              💻 Stack de Tecnologias
            </button>

            <button
              onClick={() => setActiveTab("modulos")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "modulos"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              🧩 Catálogo de Módulos
            </button>

            <button
              onClick={() => setActiveTab("perfis")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "perfis"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              👥 Perfis de Acesso
            </button>

            <button
              onClick={() => setActiveTab("passo_a_passo")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "passo_a_passo"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              🔄 Fluxo de 12 Passos
            </button>
          </div>

          {/* Quick Filter */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filtrar manual..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-700">

          {/* TAB 1: VISÃO GERAL */}
          {activeTab === "visao_geral" && (
            <div className="space-y-6">
              <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 space-y-3">
                <h3 className="text-base font-extrabold text-blue-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Plataforma Gestão Integrada NR — SESI-SC SGN PRO
                </h3>
                <p className="text-xs leading-relaxed text-blue-950 font-medium">
                  A plataforma foi projetada para unificar o gerenciamento operacional, comercial e administrativo dos cursos de Segurança e Saúde no Trabalho (SST) regulamentados pelas Normas Regulamentadoras (NR 10, NR 35, NR 33, NR 20, NR 12, SEP e outras). O sistema garante total rastreabilidade desde o primeiro contato comercial até o faturamento da turma, integrando equipes de 5 regionais de Santa Catarina.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Apoio ao Comercial & CRM</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Consulta rápida de disponibilidade de turmas, orçamentos sob medida por CNPJ e simulação de concorrência com 0 conflitos.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Gestão de Instrutores</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Escala inteligente com validação de competências por NR, tipos de vínculo (Horista / Mensalista / PJ) e bloqueios de agenda.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Rastreabilidade Operacional</h4>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Acompanhamento em tempo real dos 12 passos do ciclo de vida da turma: da proposta comercial à emissão do chamado no SAP.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-blue-400">Cobertura das 5 Regionais SESI-SC</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-semibold text-slate-300">
                  <div className="p-2.5 bg-slate-800 rounded-lg text-center">Centro-Norte</div>
                  <div className="p-2.5 bg-slate-800 rounded-lg text-center">Oeste</div>
                  <div className="p-2.5 bg-slate-800 rounded-lg text-center">Fiesc / Litoral</div>
                  <div className="p-2.5 bg-slate-800 rounded-lg text-center">Sul</div>
                  <div className="p-2.5 bg-slate-800 rounded-lg text-center">Vale do Itajaí</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TECNOLOGIAS */}
          {activeTab === "tecnologias" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <Code2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Stack Tecnológica & Arquitetura de Software</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-purple-600" />
                    <h4 className="font-extrabold text-slate-900 text-xs">Core & Runtime</h4>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-800">• React 18:</span> Componentização reativa com hooks customizados e gerenciamento de estado previsível.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-800">• TypeScript 5.x:</span> Tipagem estática rigorosa para prevencão de falhas em tempo de execução.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-800">• Vite 5:</span> Bundler ultra-rápido otimizado para compilação instantânea.
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <h4 className="font-extrabold text-slate-900 text-xs">Estilização & Design System</h4>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-800">• Tailwind CSS v4:</span> Design de utilitários de alta performance e responsividade total.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-800">• Lucide React Icons:</span> Biblioteca gráfica unificada para representação intuitiva de ações.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-800">• Paleta Oficial SESI:</span> Tons corporativos (Azul SESI `#002e5d`, Grafite e Destaques em Verde e Amarelo).
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-extrabold text-slate-900 text-xs">Persistência & Motor de Documentos</h4>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-800">• LocalStorage Persist Engine:</span> Sincronização offline-first com salvamento automático de dados de turmas, instrutores e propostas.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-800">• Renderizador de Fichas SVG:</span> Geração dinâmica em tempo real de Fichas do Curso em formato limpo pronto para impressão/PDF.
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <h4 className="font-extrabold text-slate-900 text-xs">Segurança & Controle de Acesso</h4>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-800">• Simulação Dinâmica de Perfis:</span> Chaveamento instantâneo de permissões entre 6 papéis operacionais.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-slate-800">• Log de Auditoria Integrado:</span> Rastreamento do histórico de ações realizadas na sessão.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CATÁLOGO DE MÓDULOS */}
          {activeTab === "modulos" && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">Catálogo do Menu de Navegação do Sistema</h3>

              <div className="space-y-3">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    1. Agenda / Calendário de Cursos (Tabela Inicial)
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    Exibe a visualização mensal e em lista de todas as turmas agendadas e em andamento nas 5 regionais. Permite filtrar por mês, regional, modalidade e status da turma.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    2. Acompanhamento de Fluxo (PCP Operacional)
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    Acompanhamento visual passo a passo dos 12 estágios operacionais da turma. Destaca as atribuições específicas de cada perfil de usuário.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <Users className="w-4 h-4 text-purple-600" />
                    3. Agendas & Instrutores
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    Contém o Quadro de Instrutores com dados completos de contato, vínculo e competências, além da <strong>Pesquisa Inteligente</strong> para simulação instantânea de disponibilidades sem conflito.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    4. Apoio ao Comercial
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    Funil de vendas CRM/PS, criação de novas propostas comerciais, cálculo de orçamentos e Pesquisa Inteligente 360º por Cliente / CNPJ.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <UserSquare2 className="w-4 h-4 text-sky-600" />
                    5. Portal do Instrutor
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    Visão dedicada ao docente para consulta de turmas atribuídas, acesso às fichas do curso, registro de frequência dos alunos e lançamento do diário de notas.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    6. Catálogo de Cursos SGN
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    Cadastro centralizado de todas as matrizes curriculares, ementas de NRs, cargas horárias mínimas e pré-requisitos exigidos.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <FileText className="w-4 h-4 text-rose-600" />
                    7. Documentos de Apoio
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    Gerador automático de Fichas do Curso prontas para impressão e envio aos clientes e instrutores.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <Settings className="w-4 h-4 text-emerald-600" />
                    8. Configuração & Acesso
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    Gestão unificada de <strong>Bloqueios de Agenda e Feriados</strong>, <strong>Perfis de Acesso & Credenciais de Usuários</strong>, cadastros de empresas clientes e personalização da marca SESI.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PERFIS DE ACESSO */}
          {activeTab === "perfis" && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">Matriz de Permissões por Perfil de Usuário</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-purple-300 uppercase">Supervisão / Coordenação</span>
                    <span className="px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded text-[10px] font-bold">Acesso Total</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Acesso irrestrito a todos os módulos, relatórios gerenciais, aprovação de datas especiais, gestão de bloqueios de agenda e controle de contas de usuários.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-blue-300 uppercase">PCP / Operação</span>
                    <span className="px-2 py-0.5 bg-blue-500/30 text-blue-200 rounded text-[10px] font-bold">Gestão Operacional</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Criação e edição de turmas, alocação de instrutores, definição de salas e acompanhamento dos Passos 4, 5, 6 e 8 do fluxo operacional.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-amber-300 uppercase">Comercial (CRM)</span>
                    <span className="px-2 py-0.5 bg-amber-500/30 text-amber-200 rounded text-[10px] font-bold">Vendas & Clientes</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Abertura de propostas no CRM, consulta de disponibilidade de turmas, cadastro de empresas clientes e acompanhamento dos Passos 1 a 3.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-emerald-300 uppercase">Secretária</span>
                    <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-200 rounded text-[10px] font-bold">Matrículas & Certificados</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Coordenação das matrículas dos alunos, verificação do diário eletrônico e emissão dos certificados de conclusão (Passos 7 e 11).
                  </p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-sky-300 uppercase">Instrutor Docente</span>
                    <span className="px-2 py-0.5 bg-sky-500/30 text-sky-200 rounded text-[10px] font-bold">Portal Docente</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Visualização das turmas atribuídas, download da Ficha do Curso, registro diário de frequências e lançamento de notas (Passos 9 e 10).
                  </p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-rose-300 uppercase">Faturamento</span>
                    <span className="px-2 py-0.5 bg-rose-500/30 text-rose-200 rounded text-[10px] font-bold">Finanças & SAP</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Visualização de turmas concluídas, conferência de diários e inserção do número de chamado no sistema financeiro/SAP (Passo 12).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PASSO A PASSO */}
          {activeTab === "passo_a_passo" && (
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900">Guia Sequencial dos 12 Passos do Fluxo SGN</h3>

              <div className="space-y-2 text-xs">
                {[
                  { step: "Passo 1", role: "Comercial", title: "Oportunidade CRM Criada", desc: "Registro inicial do interesse da empresa contratante no CRM." },
                  { step: "Passo 2", role: "Comercial", title: "Proposta Enviada", desc: "Envio do orçamento detalhado com carga horária e valores ao cliente." },
                  { step: "Passo 3", role: "Comercial", title: "Proposta Aprovada pelo Cliente", desc: "Confirmação do aceite comercial pela empresa parceira." },
                  { step: "Passo 4", role: "PCP", title: "Rascunho / Pré-turma Aberta", desc: "Lançamento da pré-turma no sistema com local e perío do pretendido." },
                  { step: "Passo 5", role: "PCP", title: "Instrutor Alocado sem Conflito", desc: "Designação do instrutor com competência e disponibilidade validada." },
                  { step: "Passo 6", role: "PCP", title: "Turma Confirmada no PCP", desc: "Aprovação final do planejamento e publicação no calendário oficial." },
                  { step: "Passo 7", role: "Secretária", title: "Matrículas dos Alunos Realizadas", desc: "Inscrição dos trabalhadores no sistema acadêmico." },
                  { step: "Passo 8", role: "PCP", title: "Material Didático Separado", desc: "Separação de apostilas, EPIs de demonstração e simuladores." },
                  { step: "Passo 9", role: "Instrutor", title: "Curso em Andamento / Realizado", desc: "Execução presencial/EAD das aulas na unidade ou empresa." },
                  { step: "Passo 10", role: "Instrutor", title: "Diário Eletrônico & Frequência", desc: "Registro das presenças e notas dos alunos no Portal do Instrutor." },
                  { step: "Passo 11", role: "Secretária", title: "Certificados Emitidos", desc: "Validação final das notas e emissão dos certificados com QR Code." },
                  { step: "Passo 12", role: "Faturamento", title: "Chamado SAP & Faturamento", desc: "Lançamento do chamado financeiro e encerramento oficial da turma." },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <span className="px-2.5 py-1 bg-slate-900 text-white font-mono font-black rounded-lg text-[10px] shrink-0">
                      {item.step}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-xs">{item.title}</h4>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          {item.role}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 p-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Desenvolvido para o Serviço Social da Indústria (SESI Santa Catarina)
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Entendido, Fechar Manual
          </button>
        </div>

      </div>
    </div>
  );
}
