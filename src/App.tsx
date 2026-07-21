/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  INITIAL_CLASSES, 
  INITIAL_INSTRUCTORS, 
  INITIAL_COURSES, 
  INITIAL_CRM_OPPORTUNITIES, 
  INITIAL_DOCUMENTS, 
  loadState, 
  saveState,
  createDefaultSteps
} from "./data/mockData";
import { 
  CourseClass, 
  Instructor, 
  Course, 
  CRMOpportunity, 
  DocumentReference, 
  AccessProfile, 
  StepStatus 
} from "./types";

// Import Views
import DashboardView from "./components/DashboardView";
import CalendarView from "./components/CalendarView";
import InstructorScheduleView from "./components/InstructorScheduleView";
import CommercialSupportView from "./components/CommercialSupportView";
import OperationalTrackerView from "./components/OperationalTrackerView";
import InstructorPortalView from "./components/InstructorPortalView";
import CourseRegistryView from "./components/CourseRegistryView";
import DocumentManagementView from "./components/DocumentManagementView";

// Icons
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  Users, 
  TrendingUp, 
  Layers, 
  UserSquare2, 
  BookOpen, 
  FileText,
  UserCheck,
  ShieldCheck,
  Bell,
  RefreshCw,
  Clock,
  Briefcase
} from "lucide-react";

export default function App() {
  // 1. Persistent State Management
  const [classes, setClasses] = useState<CourseClass[]>(() => 
    loadState<CourseClass[]>("classes", INITIAL_CLASSES)
  );
  const [instructors, setInstructors] = useState<Instructor[]>(() => 
    loadState<Instructor[]>("instructors", INITIAL_INSTRUCTORS)
  );
  const [courses, setCourses] = useState<Course[]>(() => 
    loadState<Course[]>("courses", INITIAL_COURSES)
  );
  const [opportunities, setOpportunities] = useState<CRMOpportunity[]>(() => 
    loadState<CRMOpportunity[]>("opportunities", INITIAL_CRM_OPPORTUNITIES)
  );
  const [documents, setDocuments] = useState<DocumentReference[]>(() => 
    loadState<DocumentReference[]>("documents", INITIAL_DOCUMENTS)
  );

  // 2. Navigation State
  const [activeMenu, setActiveMenu] = useState<
    "dashboard" | "calendar" | "instructors" | "commercial" | "tracker" | "portal" | "courses" | "documents"
  >("dashboard");

  // 3. User Access Profile state
  const [currentProfile, setCurrentProfile] = useState<AccessProfile>("Supervisão");

  // 4. Selected instructor context (for instructor portal simulator)
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>(
    INITIAL_INSTRUCTORS[0]?.id || ""
  );

  // 5. Audit Feed Logs state
  const [auditLogs, setAuditLogs] = useState<string[]>([
    "Sistema inicializado com dados das 5 regionais do SESI-SC.",
    "Fluxo SGN unificado e carregado com sucesso.",
    "Regras de disponibilidade inteligente ativadas para PCP."
  ]);

  // Persist State when changed
  useEffect(() => {
    saveState("classes", classes);
  }, [classes]);

  useEffect(() => {
    saveState("instructors", instructors);
  }, [instructors]);

  useEffect(() => {
    saveState("courses", courses);
  }, [courses]);

  useEffect(() => {
    saveState("opportunities", opportunities);
  }, [opportunities]);

  // Add Log Helper
  const logAction = (actionText: string) => {
    const timestamp = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setAuditLogs(prev => [`[${timestamp}] - ${actionText}`, ...prev.slice(0, 7)]);
  };

  // State handlers to bubble up modifications
  const handleAddInstructor = (newInst: Instructor) => {
    setInstructors(prev => [...prev, newInst]);
    logAction(`Instrutor ${newInst.name} cadastrado na Regional ${newInst.regional}.`);
  };

  const handleUpdateInstructor = (updatedInst: Instructor) => {
    setInstructors(prev => prev.map(i => i.id === updatedInst.id ? updatedInst : i));
    logAction(`Cadastro do Instrutor ${updatedInst.name} atualizado.`);
  };

  const handleDeleteInstructor = (id: string) => {
    const name = instructors.find(i => i.id === id)?.name || "Desconhecido";
    setInstructors(prev => prev.filter(i => i.id !== id));
    logAction(`Instrutor ${name} removido do banco de dados.`);
  };

  const handleAddOpportunity = (newOpp: CRMOpportunity) => {
    setOpportunities(prev => [...prev, newOpp]);
    const courseName = courses.find(c => c.id === newOpp.courseId)?.name.split("-")[0] || "NR";
    logAction(`Oportunidade criada para o cliente ${newOpp.clientName} (Curso: ${courseName}).`);
  };

  const handleUpdateOpportunity = (updatedOpp: CRMOpportunity) => {
    setOpportunities(prev => prev.map(o => o.id === updatedOpp.id ? updatedOpp : o));
    logAction(`Oportunidade ${updatedOpp.crmNumber} do cliente ${updatedOpp.clientName} atualizada para '${updatedOpp.status}'.`);
  };

  const handlePromoteOpportunity = (opp: CRMOpportunity) => {
    // Generates a draft class in PCP
    const defaultSteps = createDefaultSteps(3, "", opp.crmNumber);
    const newClass: CourseClass = {
      id: `turma-crm-${opp.crmNumber}-${Date.now()}`,
      courseId: opp.courseId,
      type: "RPC", // Closed
      instructorId: null, // Pending PCP allocation
      startDate: opp.desiredDate,
      endDate: (() => {
        const d = new Date(opp.desiredDate + "T00:00:00");
        d.setDate(d.getDate() + 4); // Default 5 days
        return d.toISOString().split("T")[0];
      })(),
      scheduleDays: "Segunda a Sexta",
      period: opp.period === "Noturno" ? "Noturno" : "Matutino",
      regional: opp.regional,
      city: opp.regional === "Oeste" ? "Chapecó" : opp.regional === "Serrana" ? "Lages" : opp.regional === "Norte" ? "Joinville" : opp.regional === "Litoral" ? "Itajaí" : "Blumenau",
      clientName: opp.clientName,
      maxParticipants: opp.participants || 20,
      currentParticipants: 0,
      status: "Pendente",
      revenuePredicted: opp.participants * 250, // estimated
      revenueRealized: 0,
      steps: defaultSteps,
      crmNumber: opp.crmNumber,
      notes: "Gerada automaticamente a partir do Comercial por proposta aprovada."
    };

    setClasses(prev => [newClass, ...prev]);
    // Also update opportunity status to Approved in state
    setOpportunities(prev => prev.map(o => o.id === opp.id ? { ...o, status: "Aprovado" as const } : o));
    
    // Auto redirect to tracker
    setActiveMenu("tracker");
    logAction(`Pré-turma operacional criada no PCP para ${opp.clientName}.`);
  };

  const handleAddClass = (newClass: CourseClass) => {
    setClasses(prev => [newClass, ...prev]);
    const courseName = courses.find(c => c.id === newClass.courseId)?.name.split("-")[0] || "NR";
    logAction(`Nova turma de ${courseName} criada em ${newClass.city} para ${newClass.clientName}.`);
  };

  const handleUpdateClass = (updatedClass: CourseClass) => {
    setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
    const courseName = courses.find(c => c.id === updatedClass.courseId)?.name.split("-")[0] || "NR";
    logAction(`Turma de ${courseName} (${updatedClass.clientName}) atualizada. Status: ${updatedClass.status}.`);
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
    logAction(`Novo padrão curricular cadastrado: ${newCourse.codeSGN} (${newCourse.name.split("-")[0]}).`);
  };

  // Specialized handler for Instructor Portal to update specific operational step
  const handleInstructorPortalUpdateStep = (classId: string, stepName: string, status: StepStatus, notes?: string) => {
    setClasses(prev => prev.map(c => {
      if (c.id === classId) {
        const updatedSteps = c.steps.map(step => {
          if (step.name === stepName) {
            return {
              ...step,
              status,
              updatedAt: new Date().toISOString().split("T")[0],
              notes: notes || step.notes
            };
          }
          return step;
        });

        let newClassStatus = c.status;
        if (stepName === "Curso Realizado" && status === "Concluído") {
          newClassStatus = "Realizada";
        }

        return {
          ...c,
          steps: updatedSteps,
          status: newClassStatus
        };
      }
      return c;
    }));

    logAction(`Portal do Instrutor: Etapa '${stepName}' para a turma de ID ${classId} marcada como '${status}'.`);
  };

  // Reset demo data to initial
  const handleResetDemoData = () => {
    if (confirm("Deseja redefinir os dados para os valores originais de demonstração? Suas alterações salvas localmente serão limpas.")) {
      setClasses(INITIAL_CLASSES);
      setInstructors(INITIAL_INSTRUCTORS);
      setCourses(INITIAL_COURSES);
      setOpportunities(INITIAL_CRM_OPPORTUNITIES);
      setDocuments(INITIAL_DOCUMENTS);
      logAction("Banco de dados local restaurado para os padrões de demonstração do SESI.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800">
      
      {/* 1. TOP HEADER BANNER: Title, Profile Switcher, and Sesi Styling */}
      <header className="bg-slate-900 text-white px-6 py-4.5 flex flex-col md:flex-row md:items-center md:justify-between border border-slate-800 shadow-md rounded-2xl mx-6 mt-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white px-2.5 py-1.5 rounded-xl font-extrabold text-base leading-none tracking-tight">
            SESI
          </div>
          <div>
            <h1 className="text-xl font-black font-sans tracking-tight flex items-center gap-2">
              Gestão Integrada de Cursos NR
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-700 px-2 py-0.5 rounded-full bg-slate-800">SGN PRO</span>
            </h1>
            <p className="text-xs text-slate-400">
              Planejamento, Disponibilidade e Fluxo Operacional • Hub de Santa Catarina
            </p>
          </div>
        </div>

        {/* PROFILE SWITCHER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4 md:mt-0">
          <div className="bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700/80 flex items-center gap-2.5">
            <UserSquare2 className="w-4 h-4 text-blue-400" />
            <div className="leading-tight">
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Simulador de Perfil de Acesso</p>
              
              <div className="flex items-center gap-2 mt-0.5">
                <select
                  value={currentProfile}
                  onChange={(e) => {
                    const prof = e.target.value as AccessProfile;
                    setCurrentProfile(prof);
                    logAction(`Perfil alterado para '${prof}'. Telas e permissões adaptadas.`);
                  }}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer border-none p-0 pr-6"
                >
                  <option value="Supervisão" className="bg-slate-900 text-white">Supervisão/Coordenação (Completo)</option>
                  <option value="PCP" className="bg-slate-900 text-white">PCP/Operação (Agendador)</option>
                  <option value="Comercial" className="bg-slate-900 text-white">Comercial (CRM & Consultas)</option>
                  <option value="Secretária" className="bg-slate-900 text-white">Secretária (Matrícula & Certificado)</option>
                  <option value="Instrutor" className="bg-slate-900 text-white">Instrutor (Portal do Professor)</option>
                  <option value="Faturamento" className="bg-slate-900 text-white">Faturamento (Chamados/Notas)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reset Demo button */}
          <button
            onClick={handleResetDemoData}
            title="Restaurar Banco de Dados"
            className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors shrink-0 flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Limpar Edições
          </button>
        </div>
      </header>

      {/* 2. BODY LAYOUT: Navigation Sidebar & Master Frame Panel */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-6 gap-6">
        
        {/* SIDEBAR NAVIGATION RAIL */}
        <aside className="w-full md:w-64 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shrink-0 overflow-y-auto shadow-sm">
          <div className="p-4 space-y-5">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-3 mb-2">
                Navegação Geral
              </span>
              
              <nav className="space-y-1">
                {/* Menu 1: Dashboard */}
                <button
                  onClick={() => setActiveMenu("dashboard")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeMenu === "dashboard"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Painel Gerencial
                </button>

                {/* Menu 2: General Calendar */}
                <button
                  onClick={() => setActiveMenu("calendar")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeMenu === "calendar"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                  Calendário de Cursos
                </button>

                {/* Menu 3: Tracker (Operational Lifecycle) */}
                <button
                  onClick={() => setActiveMenu("tracker")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeMenu === "tracker"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Acompanhamento de Fluxo
                </button>

                {/* Menu 4: Instructor Availability & Sim */}
                <button
                  onClick={() => setActiveMenu("instructors")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeMenu === "instructors"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Agendas & Instrutores
                </button>

                {/* Menu 5: Commercial Support */}
                <button
                  onClick={() => setActiveMenu("commercial")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeMenu === "commercial"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Apoio ao Comercial
                </button>

                {/* Menu 6: Instructor Portal View */}
                <button
                  onClick={() => setActiveMenu("portal")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeMenu === "portal"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <UserSquare2 className="w-4 h-4" />
                  Portal do Instrutor
                </button>

                {/* Menu 7: Course Catalog SGN */}
                <button
                  onClick={() => setActiveMenu("courses")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeMenu === "courses"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Catálogo de Cursos SGN
                </button>

                {/* Menu 8: Documents Helper */}
                <button
                  onClick={() => setActiveMenu("documents")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeMenu === "documents"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Documentos de Apoio
                </button>
              </nav>
            </div>

            {/* Audit Log Panel built directly in the sidebar */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Bell className="w-3 h-3 text-blue-600" /> Histórico Operacional
              </span>
              <div className="space-y-1.5 h-36 overflow-y-auto pr-1">
                {auditLogs.map((log, idx) => (
                  <p key={idx} className="text-[9px] text-slate-500 font-mono leading-tight border-b border-slate-100 pb-1 last:border-0">
                    {log}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 text-center leading-snug">
            Plataforma Piloto NR SESI <br />
            Versão para Próxima Reunião • 2026
          </div>
        </aside>

        {/* MASTER FRAME PANEL (Main view screen scrollable) */}
        <main className="flex-1 overflow-y-auto pr-2 pb-2">
          
          {/* PROFILE EXPLANATORY HEADER CHIP */}
          <div className="mb-6 bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5 text-xs">
            <span className="w-3 h-3 rounded-full bg-blue-600 animate-pulse shrink-0"></span>
            <div className="text-slate-600 leading-relaxed">
              Acesso ativo: <span className="font-extrabold text-[#002e5d]">{currentProfile}</span>. 
              {currentProfile === "Supervisão" && " Você possui privilégios de administrador total para monitorar todos os fluxos comerciais e operacionais."}
              {currentProfile === "Comercial" && " Você é responsável pelo funil de vendas (CRM/PS) e consultas rápidas de viabilidade. Passos 1 a 3 no fluxo operacional estão destacados para você."}
              {currentProfile === "PCP" && " Você gerencia a criação de turmas, alocação de instrutores e materiais. Passos 4, 5, 6 e 8 estão destacados para você."}
              {currentProfile === "Secretária" && " Você coordena as matrículas físicas e emissão de certificados pós-diário. Passos 7 e 11 estão destacados."}
              {currentProfile === "Instrutor" && " Você pode visualizar suas turmas alocadas, baixar fichas do curso e lançar frequências e diários de notas. Passos 9 e 10 destacados."}
              {currentProfile === "Faturamento" && " Você gerencia o faturamento das turmas concluídas. Digite o número do chamado de abertura no Passo 12 destacado."}
            </div>
          </div>

          {/* Core View Router */}
          {activeMenu === "dashboard" && (
            <DashboardView 
              classes={classes} 
              instructors={instructors} 
              courses={courses} 
            />
          )}

          {activeMenu === "calendar" && (
            <CalendarView 
              classes={classes} 
              courses={courses} 
              instructors={instructors} 
            />
          )}

          {activeMenu === "tracker" && (
            <OperationalTrackerView
              classes={classes}
              courses={courses}
              instructors={instructors}
              currentProfile={currentProfile}
              onAddClass={handleAddClass}
              onUpdateClass={handleUpdateClass}
            />
          )}

          {activeMenu === "instructors" && (
            <InstructorScheduleView
              instructors={instructors}
              courses={courses}
              classes={classes}
              onAddInstructor={handleAddInstructor}
              onUpdateInstructor={handleUpdateInstructor}
              onDeleteInstructor={handleDeleteInstructor}
            />
          )}

          {activeMenu === "commercial" && (
            <CommercialSupportView
              opportunities={opportunities}
              courses={courses}
              instructors={instructors}
              classes={classes}
              onAddOpportunity={handleAddOpportunity}
              onUpdateOpportunity={handleUpdateOpportunity}
              onPromoteOpportunity={handlePromoteOpportunity}
            />
          )}

          {activeMenu === "portal" && (
            <InstructorPortalView
              instructors={instructors}
              classes={classes}
              courses={courses}
              selectedInstructorId={selectedInstructorId}
              onSelectInstructor={setSelectedInstructorId}
              onUpdateStep={handleInstructorPortalUpdateStep}
            />
          )}

          {activeMenu === "courses" && (
            <CourseRegistryView
              courses={courses}
              instructors={instructors}
              onAddCourse={handleAddCourse}
            />
          )}

          {activeMenu === "documents" && (
            <DocumentManagementView
              documents={documents}
              courses={courses}
            />
          )}

        </main>
      </div>
    </div>
  );
}
