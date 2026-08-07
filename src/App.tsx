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
  INITIAL_USER_ACCOUNTS,
  INITIAL_HOLIDAYS,
  INITIAL_CLIENTS,
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
  StepStatus,
  UserAccount,
  SystemHoliday,
  ClientCompany
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
import SettingsView from "./components/SettingsView";
import SesiLogo from "./components/SesiLogo";

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
  Briefcase,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  ChevronLeft,
  ChevronRight,
  Settings
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
  const [users, setUsers] = useState<UserAccount[]>(() => 
    loadState<UserAccount[]>("users", INITIAL_USER_ACCOUNTS)
  );
  const [holidays, setHolidays] = useState<SystemHoliday[]>(() => 
    loadState<SystemHoliday[]>("holidays", INITIAL_HOLIDAYS)
  );
  const [clients, setClients] = useState<ClientCompany[]>(() => 
    loadState<ClientCompany[]>("clients", INITIAL_CLIENTS)
  );

  const [activeUser, setActiveUser] = useState<UserAccount>(() => 
    INITIAL_USER_ACCOUNTS[0]
  );

  // 2. Navigation State
  const [activeMenu, setActiveMenu] = useState<
    "dashboard" | "calendar" | "instructors" | "commercial" | "tracker" | "portal" | "courses" | "documents" | "settings"
  >("dashboard");

  // Sidebar toggle state (mobile drawer & desktop collapse)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
    "Regras de disponibilidade inteligente e gestão de feriados ativas."
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

  useEffect(() => {
    saveState("users", users);
  }, [users]);

  useEffect(() => {
    saveState("holidays", holidays);
  }, [holidays]);

  useEffect(() => {
    saveState("clients", clients);
  }, [clients]);

  // Effect to enforce ADM-only access to Dashboard
  useEffect(() => {
    const isAdm = currentProfile === "Supervisão" || currentProfile === "PCP";
    if (!isAdm && activeMenu === "dashboard") {
      if (currentProfile === "Comercial") {
        setActiveMenu("commercial");
      } else if (currentProfile === "Instrutor") {
        setActiveMenu("portal");
      } else if (currentProfile === "Secretária" || currentProfile === "Faturamento") {
        setActiveMenu("tracker");
      } else {
        setActiveMenu("calendar");
      }
    }
  }, [currentProfile, activeMenu]);

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
    const courseName = courses.find(c => c.id === newOpp.courseId)?.name || "NR";
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
    const courseName = courses.find(c => c.id === newClass.courseId)?.name || "NR";
    logAction(`Nova turma de ${courseName} criada em ${newClass.city} para ${newClass.clientName}.`);
  };

  const handleUpdateClass = (updatedClass: CourseClass) => {
    setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
    const courseName = courses.find(c => c.id === updatedClass.courseId)?.name || "NR";
    logAction(`Turma de ${courseName} (${updatedClass.clientName}) atualizada. Status: ${updatedClass.status}.`);
  };

  const handleAddCourse = (newCourse: Course) => {
    setCourses(prev => [...prev, newCourse]);
    logAction(`Novo padrão curricular cadastrado: ${newCourse.codeSGN} (${newCourse.name}).`);
  };

  const handleUpdateCourse = (updatedCourse: Course) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    logAction(`Curso ${updatedCourse.codeSGN} (${updatedCourse.name}) atualizado no catálogo.`);
  };

  const handleDeleteCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    setCourses(prev => prev.filter(c => c.id !== courseId));
    logAction(`Curso ${course?.codeSGN || courseId} (${course?.name || ''}) removido do catálogo.`);
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

  // Handlers for Holidays, Users & Clients
  const handleAddHoliday = (h: SystemHoliday) => {
    setHolidays(prev => [...prev, h]);
    logAction(`Feriado '${h.name}' (${h.type}) adicionado para a data ${h.date}.`);
  };

  const handleUpdateHoliday = (h: SystemHoliday) => {
    setHolidays(prev => prev.map(item => item.id === h.id ? h : item));
    logAction(`Feriado '${h.name}' atualizado.`);
  };

  const handleDeleteHoliday = (id: string) => {
    const h = holidays.find(item => item.id === id);
    setHolidays(prev => prev.filter(item => item.id !== id));
    logAction(`Feriado '${h?.name || id}' excluído do sistema.`);
  };

  const handleAddUser = (u: UserAccount) => {
    setUsers(prev => [...prev, u]);
    logAction(`Novo usuário '${u.name}' (${u.username}) cadastrado no perfil '${u.role}'.`);
  };

  const handleUpdateUser = (u: UserAccount) => {
    setUsers(prev => prev.map(item => item.id === u.id ? u : item));
    if (activeUser.id === u.id) {
      setActiveUser(u);
      setCurrentProfile(u.role);
    }
    logAction(`Conta de usuário '${u.name}' atualizada.`);
  };

  const handleDeleteUser = (id: string) => {
    const u = users.find(item => item.id === id);
    setUsers(prev => prev.filter(item => item.id !== id));
    logAction(`Conta do usuário '${u?.name || id}' removida.`);
  };

  const handleSwitchUser = (u: UserAccount) => {
    setActiveUser(u);
    setCurrentProfile(u.role);
    logAction(`Sessão alterada para o usuário '${u.name}' (Perfil: ${u.role}).`);
  };

  const handleAddClient = (c: ClientCompany) => {
    setClients(prev => [...prev, c]);
    logAction(`Nova empresa cliente '${c.name}' (CNPJ: ${c.cnpj}) cadastrada.`);
  };

  const handleUpdateClient = (c: ClientCompany) => {
    setClients(prev => prev.map(item => item.id === c.id ? c : item));
    logAction(`Cadastro da empresa '${c.name}' atualizado.`);
  };

  const handleDeleteClient = (id: string) => {
    const c = clients.find(item => item.id === id);
    setClients(prev => prev.filter(item => item.id !== id));
    logAction(`Empresa '${c?.name || id}' removida do cadastro base.`);
  };

  // Reset demo data to initial
  const handleResetDemoData = () => {
    if (confirm("Deseja redefinir os dados para os valores originais de demonstração? Suas alterações salvas localmente serão limpas.")) {
      setClasses(INITIAL_CLASSES);
      setInstructors(INITIAL_INSTRUCTORS);
      setCourses(INITIAL_COURSES);
      setOpportunities(INITIAL_CRM_OPPORTUNITIES);
      setDocuments(INITIAL_DOCUMENTS);
      setUsers(INITIAL_USER_ACCOUNTS);
      setHolidays(INITIAL_HOLIDAYS);
      setClients(INITIAL_CLIENTS);
      setActiveUser(INITIAL_USER_ACCOUNTS[0]);
      setCurrentProfile(INITIAL_USER_ACCOUNTS[0].role);
      logAction("Banco de dados local restaurado para os padrões de demonstração do SESI.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800">
      
      {/* 1. TOP HEADER BANNER - Clean Modern SESI Blue Theme */}
      <header className="bg-gradient-to-r from-blue-800 via-blue-900 to-sky-900 text-white px-4 py-3 sm:px-6 sm:py-3.5 flex flex-col md:flex-row md:items-center md:justify-between border border-blue-700/50 shadow-md rounded-2xl mx-3 sm:mx-6 mt-3 sm:mt-6 shrink-0 gap-3">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3.5">
            {/* Mobile / Tablet Drawer Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 bg-blue-800/80 hover:bg-blue-700 text-white rounded-xl border border-blue-600/50 transition-colors flex items-center justify-center shrink-0"
              title="Abrir Menu de Navegação"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Official SESI Logo Badge */}
            <div className="bg-white px-3 py-1.5 rounded-xl shadow-xs border border-blue-200/60 flex items-center justify-center shrink-0">
              <SesiLogo className="h-6 sm:h-7" variant="color" />
            </div>

            <div>
              <h1 className="text-base sm:text-xl font-black font-sans tracking-tight flex items-center gap-2 text-white">
                Gestão Integrada NR
                <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest border border-blue-400/30 px-2 py-0.5 rounded-full bg-blue-950/60 hidden sm:inline-block">SGN PRO</span>
              </h1>
            </div>
          </div>
        </div>

        {/* PROFILE SWITCHER BAR */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-end">
          <div className="bg-blue-950/60 px-3.5 py-1.5 sm:py-2 rounded-xl border border-blue-400/30 flex items-center gap-2.5">
            <UserSquare2 className="w-4 h-4 text-blue-300 shrink-0" />
            <div className="leading-tight">
              <p className="text-[8px] sm:text-[9px] text-blue-200 uppercase font-bold tracking-wider">Simulador de Perfil de Acesso</p>
              
              <div className="flex items-center gap-2 mt-0.5">
                <select
                  value={currentProfile}
                  onChange={(e) => {
                    const prof = e.target.value as AccessProfile;
                    setCurrentProfile(prof);
                    logAction(`Perfil alterado para '${prof}'. Telas e permissões adaptadas.`);
                  }}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer border-none p-0 pr-4"
                >
                  <option value="Supervisão" className="bg-slate-900 text-white">Supervisão/Coordenação</option>
                  <option value="PCP" className="bg-slate-900 text-white">PCP/Operação</option>
                  <option value="Comercial" className="bg-slate-900 text-white">Comercial (CRM)</option>
                  <option value="Secretária" className="bg-slate-900 text-white">Secretária</option>
                  <option value="Instrutor" className="bg-slate-900 text-white">Instrutor</option>
                  <option value="Faturamento" className="bg-slate-900 text-white">Faturamento</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. BODY LAYOUT: Navigation Sidebar & Master Frame Panel */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-3 sm:p-6 gap-4 sm:gap-6 relative">
        
        {/* MOBILE BACKDROP & DRAWER */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR NAVIGATION RAIL (Desktop Collapsible & Mobile Slide-Over Drawer) */}
        <aside className={`
          bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shrink-0 overflow-y-auto shadow-sm transition-all duration-300
          ${/* Mobile drawer behavior */ ""}
          fixed inset-y-0 left-0 z-50 w-72 m-3 rounded-2xl shadow-2xl md:static md:z-auto md:shadow-sm md:m-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${/* Desktop collapse behavior */ ""}
          ${isSidebarCollapsed ? "md:w-20 md:flex" : "md:w-64 md:flex"}
        `}>
          <div className={`p-3.5 space-y-4 ${isSidebarCollapsed ? "px-2" : ""}`}>
            {/* Sidebar Header with Toggle Arrow */}
            <div className={`flex items-center justify-between pb-2 border-b border-slate-100 ${isSidebarCollapsed ? "justify-center" : ""}`}>
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">
                  Navegação Geral
                </span>
              )}
              {/* Desktop Toggle Arrow */}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden md:flex p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                title={isSidebarCollapsed ? "Expandir Menu" : "Minimizar Menu"}
              >
                {isSidebarCollapsed ? <ChevronRight className="w-5 h-5 text-blue-600" /> : <ChevronLeft className="w-5 h-5" />}
              </button>

              {/* Mobile Drawer Close */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <nav className="space-y-1">
              {/* Menu 1: Dashboard */}
              {(currentProfile === "Supervisão" || currentProfile === "PCP") && (
                <button
                  onClick={() => { setActiveMenu("dashboard"); setIsSidebarOpen(false); }}
                  title="Painel Gerencial"
                  className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-2" : "justify-between px-3"} py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeMenu === "dashboard"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4 text-blue-400 shrink-0" />
                    {!isSidebarCollapsed && <span>Painel Gerencial</span>}
                  </div>
                  {!isSidebarCollapsed && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase ${
                      currentProfile === "Supervisão" 
                        ? "bg-purple-100 text-purple-800 border border-purple-200" 
                        : "bg-blue-100 text-blue-800 border border-blue-200"
                    }`}>
                      {currentProfile === "Supervisão" ? "ADM Geral" : "ADM Local"}
                    </span>
                  )}
                </button>
              )}

              {/* Menu 2: General Calendar */}
              <button
                onClick={() => { setActiveMenu("calendar"); setIsSidebarOpen(false); }}
                title="Calendário de Cursos"
                className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-2" : "gap-3 px-3"} py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === "calendar"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <CalendarIcon className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Calendário de Cursos</span>}
              </button>

              {/* Menu 3: Tracker */}
              <button
                onClick={() => { setActiveMenu("tracker"); setIsSidebarOpen(false); }}
                title="Acompanhamento de Fluxo"
                className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-2" : "gap-3 px-3"} py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === "tracker"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Acompanhamento de Fluxo</span>}
              </button>

              {/* Menu 4: Instructors */}
              <button
                onClick={() => { setActiveMenu("instructors"); setIsSidebarOpen(false); }}
                title="Agendas & Instrutores"
                className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-2" : "gap-3 px-3"} py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === "instructors"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Agendas & Instrutores</span>}
              </button>

              {/* Menu 5: Commercial Support */}
              <button
                onClick={() => { setActiveMenu("commercial"); setIsSidebarOpen(false); }}
                title="Apoio ao Comercial"
                className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-2" : "gap-3 px-3"} py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === "commercial"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Apoio ao Comercial</span>}
              </button>

              {/* Menu 6: Instructor Portal */}
              <button
                onClick={() => { setActiveMenu("portal"); setIsSidebarOpen(false); }}
                title="Portal do Instrutor"
                className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-2" : "gap-3 px-3"} py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === "portal"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <UserSquare2 className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Portal do Instrutor</span>}
              </button>

              {/* Menu 7: Course Catalog SGN */}
              <button
                onClick={() => { setActiveMenu("courses"); setIsSidebarOpen(false); }}
                title="Catálogo de Cursos SGN"
                className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-2" : "gap-3 px-3"} py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === "courses"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Catálogo de Cursos SGN</span>}
              </button>

              {/* Menu 8: Documents Helper */}
              <button
                onClick={() => { setActiveMenu("documents"); setIsSidebarOpen(false); }}
                title="Documentos de Apoio"
                className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-2" : "gap-3 px-3"} py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === "documents"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && <span>Documentos de Apoio</span>}
              </button>

              {/* Menu 9: Settings & Access Control */}
              <button
                onClick={() => { setActiveMenu("settings"); setIsSidebarOpen(false); }}
                title="Configuração & Acesso"
                className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center px-2" : "justify-between px-3"} py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeMenu === "settings"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-emerald-500 shrink-0" />
                  {!isSidebarCollapsed && <span>Configuração & Acesso</span>}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Novo
                  </span>
                )}
              </button>
            </nav>

            {/* Audit Log Panel built directly in the sidebar */}
            {!isSidebarCollapsed && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Bell className="w-3 h-3 text-blue-600" /> Histórico Operacional
                </span>
                <div className="space-y-1.5 h-32 overflow-y-auto pr-1">
                  {auditLogs.map((log, idx) => (
                    <p key={idx} className="text-[9px] text-slate-500 font-mono leading-tight border-b border-slate-100 pb-1 last:border-0">
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!isSidebarCollapsed && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-[10px] text-slate-400 text-center leading-snug">
              Plataforma Piloto NR SESI <br />
              Versão para Próxima Reunião • 2026
            </div>
          )}
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
              currentProfile={currentProfile}
              userRegional="Centro-Norte"
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
              clients={clients}
              holidays={holidays}
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
              currentProfile={currentProfile}
              onAddCourse={handleAddCourse}
              onUpdateCourse={handleUpdateCourse}
              onDeleteCourse={handleDeleteCourse}
            />
          )}

          {activeMenu === "documents" && (
            <DocumentManagementView
              documents={documents}
              courses={courses}
            />
          )}

          {activeMenu === "settings" && (
            <SettingsView
              holidays={holidays}
              onAddHoliday={handleAddHoliday}
              onUpdateHoliday={handleUpdateHoliday}
              onDeleteHoliday={handleDeleteHoliday}
              users={users}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              clients={clients}
              onAddClient={handleAddClient}
              onUpdateClient={handleUpdateClient}
              onDeleteClient={handleDeleteClient}
              activeUser={activeUser}
              onSwitchUser={handleSwitchUser}
            />
          )}

        </main>
      </div>
    </div>
  );
}
