/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  User, 
  Plus, 
  Edit2, 
  BookOpen, 
  Clock, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Phone, 
  Search, 
  SlidersHorizontal,
  Calendar,
  Save,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  Lock,
  Building2,
  Briefcase,
  FileText,
  DollarSign,
  Check,
  X
} from "lucide-react";
import { Instructor, Course, CourseClass, Regional, InstructorLinkType, AgendaBlock, UserProfile } from "../types";
import { INITIAL_AGENDA_BLOCKS, INITIAL_USER_PROFILES } from "../data/mockData";

interface InstructorScheduleViewProps {
  instructors: Instructor[];
  courses: Course[];
  classes: CourseClass[];
  onAddInstructor: (inst: Instructor) => void;
  onUpdateInstructor: (inst: Instructor) => void;
  onDeleteInstructor: (id: string) => void;
}

export default function InstructorScheduleView({
  instructors,
  courses,
  classes,
  onAddInstructor,
  onUpdateInstructor,
  onDeleteInstructor
}: InstructorScheduleViewProps) {
  // Tabs: "diretorio" | "bloqueios" | "catalogo" | "perfis" | "simulador"
  const [activeTab, setActiveTab] = useState<"diretorio" | "bloqueios" | "catalogo" | "perfis" | "simulador">("diretorio");
  
  // Search and Filter states for Directory
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegional, setSelectedRegional] = useState<Regional | "Todas">("Todas");
  const [selectedCompetency, setSelectedCompetency] = useState<string>("Todas");

  // Agenda Blocks state
  const [agendaBlocks, setAgendaBlocks] = useState<AgendaBlock[]>(INITIAL_AGENDA_BLOCKS);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [blockInstructorId, setBlockInstructorId] = useState("");
  const [blockDay, setBlockDay] = useState("Sábado");
  const [blockStart, setBlockStart] = useState("08:00");
  const [blockEnd, setBlockEnd] = useState("17:00");
  const [blockStartDate, setBlockStartDate] = useState("2026-01-01");
  const [blockEndDate, setBlockEndDate] = useState("2026-12-31");
  const [blockReason, setBlockReason] = useState<AgendaBlock["reason"]>("Férias");
  const [blockNotes, setBlockNotes] = useState("");

  // Instructor Form Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  // Expanded Form Fields (per user table specifications)
  const [formId, setFormId] = useState(""); // ID do instrutor (Sim)
  const [formName, setFormName] = useState(""); // Nome completo (Sim)
  const [formEmail, setFormEmail] = useState(""); // E-mail (Sim)
  const [formPhone, setFormPhone] = useState(""); // Telefone (Não)
  const [formRegionalBase, setFormRegionalBase] = useState<Regional>("Centro-Norte"); // Regional-base (Sim)
  const [formUnitBase, setFormUnitBase] = useState(""); // Unidade-base (Sim)
  const [formCityBase, setFormCityBase] = useState(""); // Município-base (Sim)
  const [formLinkType, setFormLinkType] = useState<InstructorLinkType>("Horista"); // Tipo de vínculo (Sim)
  const [formStatus, setFormStatus] = useState<"Ativo" | "Inativo">("Ativo"); // Situação (Sim)
  const [formAllowsTravel, setFormAllowsTravel] = useState<boolean>(true); // Permite deslocamento (Sim)
  const [formAttendedRegionals, setFormAttendedRegionals] = useState<Regional[]>(["Centro-Norte"]); // Regionais atendidas (Não)
  const [formNotes, setFormNotes] = useState(""); // Observações (Sim)
  
  // Periods & Days of week
  const [formPeriods, setFormPeriods] = useState<("Manhã" | "Tarde" | "Noite")[]>(["Noite"]);
  const [formAvailableDays, setFormAvailableDays] = useState<("Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta" | "Sábado" | "Domingo")[]>(["Segunda", "Terça", "Quarta", "Quinta", "Sábado"]);
  const [formCompetencies, setFormCompetencies] = useState<string[]>([]);

  // Course catalog search
  const [courseSearch, setCourseSearch] = useState("");

  // Handle Form Open for Create/Edit
  const handleOpenForm = (inst?: Instructor) => {
    if (inst) {
      setEditingInstructor(inst);
      setFormId(inst.id);
      setFormName(inst.name);
      setFormEmail(inst.email || "");
      setFormPhone(inst.phone || "");
      setFormRegionalBase(inst.regionalBase || inst.regional || "Centro-Norte");
      setFormUnitBase(inst.unitBase || "Caçador");
      setFormCityBase(inst.cityBase || "Caçador");
      setFormLinkType(inst.linkType);
      setFormStatus(inst.status || "Ativo");
      setFormAllowsTravel(inst.allowsTravel !== undefined ? inst.allowsTravel : true);
      setFormAttendedRegionals(inst.attendedRegionals || [inst.regionalBase || "Centro-Norte"]);
      setFormNotes(inst.notes || "");
      setFormPeriods(inst.periods || ["Noite"]);
      setFormAvailableDays(inst.availableDays || ["Segunda", "Terça", "Quarta", "Quinta", "Sábado"]);
      setFormCompetencies(inst.competencies || []);
    } else {
      setEditingInstructor(null);
      setFormId(`inst-${Math.floor(100000 + Math.random() * 900000)}`);
      setFormName("");
      setFormEmail("");
      setFormPhone("");
      setFormRegionalBase("Centro-Norte");
      setFormUnitBase("Caçador");
      setFormCityBase("Caçador");
      setFormLinkType("Horista");
      setFormStatus("Ativo");
      setFormAllowsTravel(true);
      setFormAttendedRegionals(["Centro-Norte"]);
      setFormNotes("");
      setFormPeriods(["Manhã", "Tarde"]);
      setFormAvailableDays(["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]);
      setFormCompetencies(["NR 10 - Básico", "NR 35"]);
    }
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();

    // Mandatory validations according to user table
    if (!formId.trim()) { alert("O campo 'ID do instrutor' é obrigatório."); return; }
    if (!formName.trim()) { alert("O campo 'Nome completo' é obrigatório."); return; }
    if (!formEmail.trim()) { alert("O campo 'E-mail' é obrigatório."); return; }
    if (!formRegionalBase) { alert("O campo 'Regional-base' é obrigatório."); return; }
    if (!formUnitBase.trim()) { alert("O campo 'Unidade-base' é obrigatório."); return; }
    if (!formCityBase.trim()) { alert("O campo 'Município-base' é obrigatório."); return; }
    if (!formLinkType) { alert("O campo 'Tipo de vínculo' é obrigatório."); return; }
    if (!formStatus) { alert("O campo 'Situação' é obrigatório."); return; }
    if (!formNotes.trim()) { alert("O campo 'Observações' é obrigatório."); return; }
    if (formPeriods.length === 0) { alert("Selecione pelo menos um período de disponibilidade (Manhã, Tarde, Noite)."); return; }
    if (formAvailableDays.length === 0) { alert("Selecione pelo menos um dia da semana disponível."); return; }

    const availabilityText = `${formAvailableDays.join(", ")} (${formPeriods.join(", ")})`;
    const contactText = `${formPhone ? formPhone + " - " : ""}${formEmail}`;

    const instructorData: Instructor = {
      id: formId.trim(),
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim() || undefined,
      regionalBase: formRegionalBase,
      unitBase: formUnitBase.trim(),
      cityBase: formCityBase.trim(),
      linkType: formLinkType,
      status: formStatus,
      allowsTravel: formAllowsTravel,
      attendedRegionals: formAttendedRegionals,
      notes: formNotes.trim(),
      periods: formPeriods,
      availableDays: formAvailableDays,
      competencies: formCompetencies,
      regional: formRegionalBase,
      contact: contactText,
      availability: availabilityText,
      constraints: formNotes.trim()
    };

    if (editingInstructor) {
      onUpdateInstructor(instructorData);
    } else {
      onAddInstructor(instructorData);
    }
    setIsModalOpen(false);
  };

  const togglePeriod = (p: "Manhã" | "Tarde" | "Noite") => {
    if (formPeriods.includes(p)) {
      setFormPeriods(formPeriods.filter(item => item !== p));
    } else {
      setFormPeriods([...formPeriods, p]);
    }
  };

  const toggleDay = (d: "Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta" | "Sábado" | "Domingo") => {
    if (formAvailableDays.includes(d)) {
      setFormAvailableDays(formAvailableDays.filter(item => item !== d));
    } else {
      setFormAvailableDays([...formAvailableDays, d]);
    }
  };

  const toggleRegionalAttended = (reg: Regional) => {
    if (formAttendedRegionals.includes(reg)) {
      setFormAttendedRegionals(formAttendedRegionals.filter(r => r !== reg));
    } else {
      setFormAttendedRegionals([...formAttendedRegionals, reg]);
    }
  };

  const toggleCompetencyInForm = (comp: string) => {
    if (formCompetencies.includes(comp)) {
      setFormCompetencies(formCompetencies.filter(c => c !== comp));
    } else {
      setFormCompetencies([...formCompetencies, comp]);
    }
  };

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockInstructorId) { alert("Selecione o instrutor."); return; }
    const newBlock: AgendaBlock = {
      id: `blk-${Date.now()}`,
      instructorId: blockInstructorId,
      dayOfWeek: blockDay,
      startTime: blockStart,
      endTime: blockEnd,
      startDate: blockStartDate,
      endDate: blockEndDate,
      reason: blockReason,
      notes: blockNotes
    };
    setAgendaBlocks([newBlock, ...agendaBlocks]);
    setIsBlockModalOpen(false);
    setBlockNotes("");
  };

  // Simulator state variables
  const [simCourseId, setSimCourseId] = useState<string>(courses[0]?.id || "");
  const [simStartDate, setSimStartDate] = useState("2026-07-20");
  const [simEndDate, setSimEndDate] = useState("2026-07-24");
  const [simPeriod, setSimPeriod] = useState<"Matutino" | "Vespertino" | "Noturno" | "Integral" | "Sábado Integral">("Matutino");
  const [simDays, setSimDays] = useState("Segunda a Sexta");

  // Get unique list of competencies (e.g. "NR 10", "NR 35", etc.) for filters
  const allCompetencies = Array.from(
    new Set(instructors.flatMap(inst => inst.competencies))
  ).sort();

  // Filtered Instructor list for Directory
  const filteredInstructors = instructors.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inst.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (inst.notes && inst.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRegional = selectedRegional === "Todas" || inst.regional === selectedRegional;
    const matchesCompetency = selectedCompetency === "Todas" || inst.competencies.includes(selectedCompetency);
    return matchesSearch && matchesRegional && matchesCompetency;
  });

  // SIMULATOR LOGIC: Check compatibility for every instructor
  const evaluateSimulation = () => {
    const course = courses.find(c => c.id === simCourseId);
    if (!course) return [];

    // Map course keywords like "NR 10", "NR 35", etc.
    const requiredNR = course.name.includes("NR 10") ? "NR 10" :
                       course.name.includes("SEP") ? "SEP" :
                       course.name.includes("NR 35") ? "NR 35" :
                       course.name.includes("NR 33") ? "NR 33" :
                       course.name.includes("NR 20") ? "NR 20" :
                       course.name.includes("NR 12") ? "NR 12" : "NR";

    return instructors.map(inst => {
      const reasons: string[] = [];
      let isCompatible = true;
      let isPartial = false;

      // 1. Check Competency
      const hasNRCompetency = inst.competencies.some(comp => {
        if (requiredNR === "NR 10") return comp === "NR 10" || comp === "SEP";
        if (requiredNR === "SEP") return comp === "SEP";
        return comp.toUpperCase() === requiredNR.toUpperCase();
      });

      if (!hasNRCompetency) {
        isCompatible = false;
        reasons.push(`Não possui a competência ${requiredNR} cadastrada.`);
      }

      // 2. Check Shift / Time Constraints
      // Check Saturday rule
      const isSaturdayCourse = simPeriod === "Sábado Integral" || simDays.toLowerCase().includes("sábado");
      const isNoturnCourse = simPeriod === "Noturno";

      if (isSaturdayCourse) {
        const canSaturdays = inst.availability.toLowerCase().includes("sáb") || 
                             !inst.constraints.toLowerCase().includes("indisponível aos sábados");
        if (!canSaturdays) {
          isCompatible = false;
          reasons.push("Restrição: Indisponível para aulas aos Sábados.");
        }
      }

      if (isNoturnCourse) {
        const avoidsNight = inst.constraints.toLowerCase().includes("apenas matutino") || 
                            inst.constraints.toLowerCase().includes("apenas vespertino") ||
                            inst.constraints.toLowerCase().includes("horário comercial");
        if (avoidsNight) {
          isCompatible = false;
          reasons.push("Restrição: Disponível apenas em horário comercial (Matutino/Vespertino).");
        }
      } else {
        // Daytime course
        const onlyNight = inst.constraints.toLowerCase().includes("apenas no período noturno") || 
                          inst.constraints.toLowerCase().includes("apenas noturno");
        if (onlyNight) {
          isCompatible = false;
          reasons.push("Restrição: Disponível apenas no período noturno.");
        }
      }

      // 3. Check Date Conflicts (Active Classes)
      const conflictClass = classes.find(c => {
        if (c.instructorId !== inst.id) return false;
        if (c.status === "Cancelada" || c.status === "Faturada") return false;
        
        // Simple date overlap check
        // (StartA <= EndB) and (EndA >= StartB)
        const startA = new Date(c.startDate);
        const endA = new Date(c.endDate);
        const startB = new Date(simStartDate);
        const endB = new Date(simEndDate);

        return startA <= endB && endA >= startB;
      });

      if (conflictClass) {
        isCompatible = false;
        const confCourse = courses.find(co => co.id === conflictClass.courseId);
        reasons.push(
          `Conflito: Alocado na turma de ${confCourse?.name || "Curso"} para ${conflictClass.clientName} (${conflictClass.startDate} a ${conflictClass.endDate}).`
        );
      }

      return {
        instructor: inst,
        isCompatible,
        reasons
      };
    });
  };

  const simulationResults = evaluateSimulation();
  const compatibleInsts = simulationResults.filter(r => r.isCompatible);
  const incompatibleInsts = simulationResults.filter(r => !r.isCompatible);

  return (
    <div className="space-y-6">
      {/* Header and navigation tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Agenda & Alocação dos Instrutores</h2>
          <p className="text-sm text-slate-500">
            Gerencie o cadastro de competências e simule alocações sem conflitos de agendas ou restrições.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("diretorio")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "diretorio"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            📂 Diretório ({instructors.length})
          </button>
          <button
            onClick={() => setActiveTab("bloqueios")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "bloqueios"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            ⛔ Bloqueios ({agendaBlocks.length})
          </button>
          <button
            onClick={() => setActiveTab("catalogo")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "catalogo"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            📚 Cursos SGN ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab("perfis")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "perfis"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            👥 Perfis de Acesso
          </button>
          <button
            onClick={() => setActiveTab("simulador")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "simulador"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            🧠 Simulador
          </button>
        </div>
      </div>

      {/* Directory Tab */}
      {activeTab === "diretorio" && (
        <div className="space-y-4">
          
          {/* Controls Panel */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-2.5 w-full md:w-auto">
              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar instrutor, contato..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Regional Filter */}
              <div className="w-full md:w-40">
                <select
                  value={selectedRegional}
                  onChange={(e) => setSelectedRegional(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="Todas">Regiões (Todas)</option>
                  <option value="Oeste">Oeste</option>
                  <option value="Serrana">Serrana</option>
                  <option value="Norte">Norte</option>
                  <option value="Litoral">Litoral</option>
                  <option value="Vale do Itajaí">Vale do Itajaí</option>
                  <option value="Centro-Norte">Centro-Norte</option>
                  <option value="Sul">Sul</option>
                  <option value="Sudeste">Sudeste</option>
                </select>
              </div>

              {/* Competency Filter */}
              <div className="w-full md:w-44">
                <select
                  value={selectedCompetency}
                  onChange={(e) => setSelectedCompetency(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="Todas">Competências (Todas)</option>
                  {allCompetencies.map(comp => (
                    <option key={comp} value={comp}>{comp}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => handleOpenForm()}
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all w-full md:w-auto justify-center shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Novo Instrutor
            </button>
          </div>

          {/* Instructors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInstructors.length > 0 ? (
              filteredInstructors.map(inst => {
                // Count active classes assigned to this instructor
                const activeAssigned = classes.filter(
                  c => c.instructorId === inst.id && (c.status === "Em Andamento" || c.status === "Confirmada")
                ).length;

                return (
                  <div key={inst.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Name & Badge */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-slate-100 text-slate-800 rounded-xl border border-slate-200">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{inst.name}</h4>
                            <p className="text-[10px] text-slate-400 font-bold">📍 Regional {inst.regional}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                          inst.linkType === "Mensalista" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                          inst.linkType === "Horista" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                          "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {inst.linkType}
                        </span>
                      </div>

                      {/* Contact */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{inst.contact}</span>
                      </div>

                      {/* Competencies */}
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-slate-400" /> Competências Habilitadas
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {inst.competencies.map(comp => (
                            <span key={comp} className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full border border-slate-200">
                              {comp}
                            </span>
                          ))}
                          {inst.competencies.length === 0 && (
                            <span className="text-[11px] text-rose-500 italic font-bold">Nenhuma cadastrada</span>
                          )}
                        </div>
                      </div>

                      {/* Availability & Constraints */}
                      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-150 text-xs">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5 text-slate-400" /> Dias Semana
                          </p>
                          <p className="text-[11px] font-bold text-slate-700 mt-0.5 truncate" title={inst.availability}>
                            {inst.availability}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-slate-400" /> Restrições
                          </p>
                          <p className="text-[11px] font-bold text-slate-700 mt-0.5 truncate" title={inst.constraints}>
                            {inst.constraints}
                          </p>
                        </div>
                      </div>

                      {inst.notes && (
                        <p className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded italic mt-2 leading-relaxed border-l-2 border-slate-300">
                          &ldquo;{inst.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {activeAssigned > 0 ? (
                          <span className="font-semibold text-blue-600">● {activeAssigned} aula(s) em andamento</span>
                        ) : (
                          "Disponível para escalas"
                        )}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenForm(inst)}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Tem certeza de que deseja remover o cadastro de ${inst.name}?`)) {
                              onDeleteInstructor(inst.id);
                            }
                          }}
                          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-red-600 rounded transition-colors"
                          title="Deletar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-white p-12 text-center rounded-xl border border-slate-100">
                <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-600">Nenhum instrutor encontrado</p>
                <p className="text-xs text-slate-400 mt-1">Experimente alterar os termos da busca ou os filtros de regional/competência.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Bloqueios de Agenda Tab */}
      {activeTab === "bloqueios" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Escala & Bloqueio de Agenda dos Instrutores</h3>
              <p className="text-xs text-slate-500">
                Cadastre e acompanhe afastamentos por Férias, Atestado Médico, Banco de Horas, Compromisso Particular ou Feriado.
              </p>
            </div>
            <button
              onClick={() => {
                setBlockInstructorId(instructors[0]?.id || "");
                setIsBlockModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Novo Bloqueio de Horário
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3.5">Instrutor</th>
                    <th className="p-3.5">Dia da Semana</th>
                    <th className="p-3.5">Horário</th>
                    <th className="p-3.5">Vigência</th>
                    <th className="p-3.5">Motivo do Bloqueio</th>
                    <th className="p-3.5">Observações</th>
                    <th className="p-3.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {agendaBlocks.map(block => {
                    const inst = instructors.find(i => i.id === block.instructorId);
                    return (
                      <tr key={block.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3.5 font-bold text-slate-800">
                          {inst ? inst.name : `ID: ${block.instructorId}`}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-md border border-slate-200">
                            {block.dayOfWeek}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-600">
                          {block.startTime} às {block.endTime}
                        </td>
                        <td className="p-3.5 text-slate-500 font-mono text-[11px]">
                          {block.startDate} a {block.endDate}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            block.reason === "Férias" ? "bg-amber-100 text-amber-800" :
                            block.reason === "Atestado Médico" ? "bg-rose-100 text-rose-800" :
                            block.reason === "Banco de Horas" ? "bg-blue-100 text-blue-800" :
                            block.reason === "Feriado" ? "bg-purple-100 text-purple-800" :
                            "bg-slate-100 text-slate-700"
                          }`}>
                            {block.reason}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500 max-w-xs truncate">
                          {block.notes || "—"}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setAgendaBlocks(agendaBlocks.filter(b => b.id !== block.id))}
                            className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded"
                            title="Remover Bloqueio"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {agendaBlocks.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                        Nenhum bloqueio cadastrado na agenda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Catálogo de Cursos SGN Tab */}
      {activeTab === "catalogo" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">Catálogo de Cursos de SST & NRs (Matriz SGN)</h3>
              <p className="text-xs text-slate-500">
                Parametrização oficial dos cursos, modalidades aceitas, carga horária e pré-requisitos cadastrados no SGN.
              </p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar por código SGN, título, NR..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses
              .filter(c => 
                c.name.toLowerCase().includes(courseSearch.toLowerCase()) || 
                c.codeSGN.toLowerCase().includes(courseSearch.toLowerCase()) ||
                c.syllabus.toLowerCase().includes(courseSearch.toLowerCase())
              )
              .map(course => (
                <div key={course.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-mono text-[10px] font-extrabold rounded-md border border-blue-100">
                        SGN: {course.codeSGN}
                      </span>
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full">
                        ⏱ {course.duration}h
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-800 text-xs leading-snug">{course.name}</h4>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {course.modalities.map(mod => (
                        <span key={mod} className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[9px] font-bold rounded border border-slate-200">
                          {mod}
                        </span>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                      <strong className="text-slate-700">Ementa: </strong> {course.syllabus}
                    </p>

                    {course.prerequisites && (
                      <p className="text-[10px] text-amber-700 bg-amber-50/60 p-2 rounded-lg border border-amber-100 font-medium">
                        <strong>Pré-requisito:</strong> {course.prerequisites}
                      </p>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold flex justify-between items-center">
                    <span>Capacidade Max: {course.maxParticipants} alunos</span>
                    <span className="text-emerald-600 font-extrabold">● Ativo SGN</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Perfis de Acesso Tab */}
      {activeTab === "perfis" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-800">Perfis de Acesso & Matriz de Permissões</h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Estrutura de governança e controle de acesso com permissões segregadas por perfil operacional.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold rounded-xl border border-blue-200">
                5 Perfis Operacionais
              </span>
              <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200">
                Todas as Regionais
              </span>
            </div>
          </div>

          {/* 1. Official Role Specifications */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" /> Definição Detalhada dos Perfis do Sistema
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* ADM */}
              <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-purple-600" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-purple-600 text-white rounded-xl shadow-xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-sm">ADM (Administração Geral)</h5>
                      <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                        Acesso Total • Multirregional
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                  Acesso total ao sistema. Gerencia usuários, perfis, regionais, produtos, docentes, turmas, processos, dashboards, relatórios, configurações e parametrizações gerais. Visualiza e edita informações de todas as regionais.
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1"><Check className="w-3 h-3" /> Gestão de Usuários</span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1"><Check className="w-3 h-3" /> Parametrização Geral</span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1"><Check className="w-3 h-3" /> Todas as Regionais</span>
                </div>
              </div>

              {/* ADM LOCAL */}
              <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-blue-600" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-sm">ADM LOCAL (Admin. Local / PCP)</h5>
                      <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Gestão Operacional Regional
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                  Gerencia toda a operação da regional. Pode cadastrar e editar docentes, competências, materiais, clientes, turmas, agendas e demais registros operacionais da regional. Acompanha processos, indicadores e relatórios. Não possui acesso às configurações gerais da plataforma nem aos usuários de outras regionais.
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1"><Check className="w-3 h-3" /> Docentes & Competências</span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1"><Check className="w-3 h-3" /> Turmas & Ensalamento</span>
                  <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-1"><X className="w-3 h-3" /> Sem Acesso a Outras Regionais</span>
                </div>
              </div>

              {/* COMERCIAL */}
              <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-emerald-600" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-sm">COMERCIAL</h5>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Propostas, Oportunidades & Reservas
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                  Acesso de consulta a toda a operação da sua regional. Pode visualizar docentes, competências, agenda, disponibilidade, turmas, processos, matrículas, indicadores, calendário e status das etapas. É responsável pela criação de oportunidades, reservas e pré-turmas, além do registro das informações comerciais. Não pode editar cadastros de docentes, fichas de cursos, competências, configurações, parâmetros operacionais ou registros pertencentes às demais etapas do processo.
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1"><Check className="w-3 h-3" /> Criar Oportunidades & Pré-Turmas</span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1"><Check className="w-3 h-3" /> Consulta Agenda & Calendário</span>
                  <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-1"><X className="w-3 h-3" /> Não Edita Cadastro Docente/Curso</span>
                </div>
              </div>

              {/* SECRETARIA */}
              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-sm">SECRETARIA</h5>
                      <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Matrículas, Documentos & Certificados
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                  Acesso de consulta à operação necessária ao desempenho de suas atividades. Atua após a criação da pré-turma pelo Comercial e pode editar somente os campos administrativos sob sua responsabilidade, como matrículas, documentação, listas de presença, credenciais, certificados e encerramento administrativo da turma. Não pode criar pré-turmas, ensalar docentes, cadastrar ou editar docentes, alterar competências, editar fichas de cursos, conteúdos programáticos ou configurações do sistema. Não possui acesso aos dashboards e indicadores de faturamento.
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1"><Check className="w-3 h-3" /> Matrículas & Certificados</span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1"><Check className="w-3 h-3" /> Listas de Presença & Credenciais</span>
                  <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-1"><X className="w-3 h-3" /> Sem Pré-Turma ou Faturamento</span>
                </div>
              </div>

              {/* FATURISTA */}
              <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm space-y-3 relative overflow-hidden lg:col-span-2">
                <div className="absolute top-0 right-0 w-2 h-full bg-slate-800" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 bg-slate-800 text-white rounded-xl shadow-xs">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 text-sm">FATURISTA</h5>
                      <span className="text-[10px] font-bold text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded-full border border-slate-300">
                        Encerramento Financeiro & Abertura de Chamados
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                  Acompanha as informações necessárias ao faturamento, como situação da turma, execução, encerramento e dados contratuais. Pode editar apenas os campos financeiros sob sua responsabilidade. Não altera informações comerciais, pedagógicas ou operacionais.
                </p>
                <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-500">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1"><Check className="w-3 h-3" /> Edição de Campos Financeiros</span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1"><Check className="w-3 h-3" /> Situação & Chamado de Faturamento</span>
                  <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-1"><X className="w-3 h-3" /> Não Altera Dados Comerciais/Pedagógicos</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Permission Comparison Matrix */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Matriz Comparativa de Permissões
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                    <th className="p-3 font-bold">Funcionalidade / Ação</th>
                    <th className="p-3 font-bold text-center text-purple-700">ADM</th>
                    <th className="p-3 font-bold text-center text-blue-700">ADM LOCAL</th>
                    <th className="p-3 font-bold text-center text-emerald-700">COMERCIAL</th>
                    <th className="p-3 font-bold text-center text-amber-700">SECRETARIA</th>
                    <th className="p-3 font-bold text-center text-slate-700">FATURISTA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-3 font-semibold">Configurações e Usuários da Plataforma</td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Cadastrar/Editar Docentes e Competências</td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Criar Oportunidades CRM & Pré-Turmas</td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Ensalamento e Alocação de Instrutor</td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Matrículas, Listas de Presença e Certificados</td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center"><span className="text-[10px] text-slate-400 font-bold">Consulta</span></td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Editar Dados Financeiros e Chamado de Faturamento</td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Visualizar Outras Regionais</td>
                    <td className="p-3 text-center"><Check className="w-4 h-4 text-emerald-600 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                    <td className="p-3 text-center"><X className="w-4 h-4 text-rose-400 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Active Users Directory */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Usuários com Acesso Ativo no Sistema
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {INITIAL_USER_PROFILES.map(usr => (
                <div key={usr.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-slate-900 text-white rounded-xl">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{usr.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{usr.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs border border-slate-150">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[10px] font-bold uppercase">Perfil de Acesso:</span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                        usr.role === "Adm Geral" ? "bg-purple-100 text-purple-800" :
                        usr.role === "Admin. Local" ? "bg-blue-100 text-blue-800" :
                        usr.role === "Comercial" ? "bg-emerald-100 text-emerald-800" :
                        usr.role === "Secretaria" ? "bg-amber-100 text-amber-800" :
                        "bg-slate-200 text-slate-800"
                      }`}>
                        {usr.role}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[10px] font-bold uppercase">Função:</span>
                      <span className="font-bold text-slate-700">{usr.functionName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[10px] font-bold uppercase">Regional-Base:</span>
                      <span className="font-bold text-slate-700">{usr.regional}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Bloqueio de Horário */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in-50 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Novo Bloqueio de Horário na Agenda</h3>
              <button 
                onClick={() => setIsBlockModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddBlock} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Instrutor *</label>
                <select
                  value={blockInstructorId}
                  onChange={(e) => setBlockInstructorId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 font-medium text-slate-800"
                >
                  {instructors.map(inst => (
                    <option key={inst.id} value={inst.id}>
                      {inst.id} - {inst.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Dia da Semana *</label>
                  <select
                    value={blockDay}
                    onChange={(e) => setBlockDay(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 font-medium"
                  >
                    {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Motivo do Bloqueio *</label>
                  <select
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 font-medium"
                  >
                    <option value="Férias">Férias</option>
                    <option value="Atestado Médico">Atestado Médico</option>
                    <option value="Banco de Horas">Banco de Horas</option>
                    <option value="Compromisso Particular">Compromisso Particular</option>
                    <option value="Feriado">Feriado</option>
                    <option value="Treinamento">Treinamento</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Horário Início *</label>
                  <input
                    type="time"
                    value={blockStart}
                    onChange={(e) => setBlockStart(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Horário Fim *</label>
                  <input
                    type="time"
                    value={blockEnd}
                    onChange={(e) => setBlockEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Vigência Início *</label>
                  <input
                    type="date"
                    value={blockStartDate}
                    onChange={(e) => setBlockStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Vigência Término *</label>
                  <input
                    type="date"
                    value={blockEndDate}
                    onChange={(e) => setBlockEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Observações Adicionais</label>
                <textarea
                  value={blockNotes}
                  onChange={(e) => setBlockNotes(e.target.value)}
                  placeholder="Justificativa ou detalhes do bloqueio..."
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 resize-none font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBlockModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-xs"
                >
                  Gravar Bloqueio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instructor Form Modal - Fully aligned with exact user requirement table */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in-50 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">
                  {editingInstructor ? "Editar Cadastro do Instrutor" : "Cadastrar Novo Instrutor"}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  Preencha os campos obrigatórios conforme o modelo institucional SESI/SENAI
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* ID do Instrutor (Sim) */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>ID do Instrutor</span>
                    <span className="text-[9px] text-rose-500 font-extrabold">Obrigatório</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder="Ex: 522389"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                  />
                </div>

                {/* Nome completo (Sim) */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Nome Completo</span>
                    <span className="text-[9px] text-rose-500 font-extrabold">Obrigatório</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Luiz Ricardo Mereles"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                {/* E-mail (Sim) */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>E-mail</span>
                    <span className="text-[9px] text-rose-500 font-extrabold">Obrigatório</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="Ex: luiz.mereles@sesisc.org.br"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                {/* Telefone (Não) */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Telefone</span>
                    <span className="text-[9px] text-slate-400 font-medium">Opcional</span>
                  </label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="Ex: (48) 99999-9999"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                {/* Regional-base (Sim) */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Regional-base</span>
                    <span className="text-[9px] text-rose-500 font-extrabold">Obrigatório</span>
                  </label>
                  <select
                    value={formRegionalBase}
                    onChange={(e) => setFormRegionalBase(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  >
                    {["Centro-Norte", "Oeste", "Serrana", "Norte", "Litoral", "Vale do Itajaí", "Sul", "Sudeste"].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* Unidade-base (Sim) */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Unidade-base</span>
                    <span className="text-[9px] text-rose-500 font-extrabold">Obrigatório</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formUnitBase}
                    onChange={(e) => setFormUnitBase(e.target.value)}
                    placeholder="Ex: Caçador, Videira, Canoinhas"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                {/* Município-base (Sim) */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Município-base</span>
                    <span className="text-[9px] text-rose-500 font-extrabold">Obrigatório</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formCityBase}
                    onChange={(e) => setFormCityBase(e.target.value)}
                    placeholder="Ex: Caçador"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                {/* Tipo de vínculo (Sim) */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Tipo de Vínculo</span>
                    <span className="text-[9px] text-rose-500 font-extrabold">Obrigatório</span>
                  </label>
                  <select
                    value={formLinkType}
                    onChange={(e) => setFormLinkType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="Horista">Horista</option>
                    <option value="Mensalista">Mensalista</option>
                    <option value="Terceirizado">Terceirizado</option>
                  </select>
                </div>

                {/* Situação (Sim) */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Situação</span>
                    <span className="text-[9px] text-rose-500 font-extrabold">Obrigatório</span>
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>

                {/* Permite deslocamento (Sim) */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Permite Deslocamento?</span>
                    <span className="text-[9px] text-rose-500 font-extrabold">Obrigatório</span>
                  </label>
                  <div className="flex gap-4 pt-2">
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                      <input
                        type="radio"
                        name="allowsTravel"
                        checked={formAllowsTravel === true}
                        onChange={() => setFormAllowsTravel(true)}
                        className="text-blue-600"
                      />
                      Sim
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700">
                      <input
                        type="radio"
                        name="allowsTravel"
                        checked={formAllowsTravel === false}
                        onChange={() => setFormAllowsTravel(false)}
                        className="text-blue-600"
                      />
                      Não
                    </label>
                  </div>
                </div>

                {/* Regionais atendidas (Não) */}
                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Regionais Atendidas</span>
                    <span className="text-[9px] text-slate-400 font-medium">Opcional</span>
                  </label>
                  <div className="flex flex-wrap gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    {(["Centro-Norte", "Oeste", "Serrana", "Norte", "Litoral", "Vale do Itajaí", "Sul", "Sudeste"] as Regional[]).map(reg => (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => toggleRegionalAttended(reg)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                          formAttendedRegionals.includes(reg)
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {reg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Período de disponibilidade (Manhã, Tarde, Noite) */}
                <div className="col-span-1 sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Período de Disponibilidade</span>
                    <span className="text-[9px] text-rose-500 font-extrabold">Obrigatório (mín. 1)</span>
                  </label>
                  <div className="flex gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                    {(["Manhã", "Tarde", "Noite"] as const).map(p => (
                      <label key={p} className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-800 text-xs">
                        <input
                          type="checkbox"
                          checked={formPeriods.includes(p)}
                          onChange={() => togglePeriod(p)}
                          className="rounded border-slate-300 text-blue-600"
                        />
                        {p}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dias da Semana de disponibilidade (Segunda a Sábado) */}
                <div className="col-span-1 sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Dias da Semana com Disponibilidade</span>
                    <span className="text-[9px] text-rose-500 font-extrabold">Obrigatório (mín. 1)</span>
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    {(["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"] as const).map(d => (
                      <label key={d} className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 text-xs">
                        <input
                          type="checkbox"
                          checked={formAvailableDays.includes(d)}
                          onChange={() => toggleDay(d)}
                          className="rounded border-slate-300 text-blue-600"
                        />
                        {d}
                      </label>
                    ))}
                  </div>
                </div>

                {/* NRs / Competências */}
                <div className="col-span-1 sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-700">Competências Técnicas / Matriz NRs</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    {["NR 05 - CIPA", "NR 06 - EPI", "NR 10 - Básico", "NR 10 - SEP", "NR 11 - Empilhadeira", "NR 11 - Ponte Rolante", "NR 12", "NR 13 - Caldeiras", "NR 17", "NR 18 - PEMT", "NR 20", "NR 23", "NR 31 - Máquinas Florestais", "NR 33", "NR 35"].map(comp => (
                      <label key={comp} className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-slate-700">
                        <input
                          type="checkbox"
                          checked={formCompetencies.includes(comp)}
                          onChange={() => toggleCompetencyInForm(comp)}
                          className="rounded border-slate-300 text-blue-600"
                        />
                        {comp}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Observações (Sim) */}
                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700 flex items-center justify-between">
                    <span>Observações do Instrutor</span>
                    <span className="text-[9px] text-rose-500 font-extrabold">Obrigatório</span>
                  </label>
                  <textarea
                    required
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Ex: Atende somente aos sábados ou período noturno durante a semana"
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none font-medium"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  Salvar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
