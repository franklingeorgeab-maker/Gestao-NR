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
  Phone, 
  Search, 
  Calendar, 
  Save, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  Filter,
  Users
} from "lucide-react";
import { Instructor, Course, CourseClass, Regional, InstructorLinkType } from "../types";

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
  // 2 Clean Tabs: "quadro" (Quadro de Instrutores) | "pesquisa" (Pesquisa Inteligente)
  const [activeTab, setActiveTab] = useState<"quadro" | "pesquisa">("quadro");
  
  // Search and Filter states for Quadro
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegional, setSelectedRegional] = useState<Regional | "Todas">("Todas");
  const [selectedCompetency, setSelectedCompetency] = useState<string>("Todas");

  // Instructor Form Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  // Form Fields
  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRegionalBase, setFormRegionalBase] = useState<Regional>("Centro-Norte");
  const [formUnitBase, setFormUnitBase] = useState("");
  const [formCityBase, setFormCityBase] = useState("");
  const [formLinkType, setFormLinkType] = useState<InstructorLinkType>("Horista");
  const [formStatus, setFormStatus] = useState<"Ativo" | "Inativo">("Ativo");
  const [formAllowsTravel, setFormAllowsTravel] = useState<boolean>(true);
  const [formAttendedRegionals, setFormAttendedRegionals] = useState<Regional[]>(["Centro-Norte"]);
  const [formNotes, setFormNotes] = useState("");
  
  // Periods & Days of week
  const [formPeriods, setFormPeriods] = useState<("Manhã" | "Tarde" | "Noite")[]>(["Noite"]);
  const [formAvailableDays, setFormAvailableDays] = useState<("Segunda" | "Terça" | "Quarta" | "Quinta" | "Sexta" | "Sábado" | "Domingo")[]>(["Segunda", "Terça", "Quarta", "Quinta", "Sábado"]);
  const [formCompetencies, setFormCompetencies] = useState<string[]>([]);

  // Pesquisa Inteligente Query States
  const [simCourseId, setSimCourseId] = useState<string>(courses[0]?.id || "");
  const [simStartDate, setSimStartDate] = useState("2026-08-10");
  const [simEndDate, setSimEndDate] = useState("2026-08-14");
  const [simPeriod, setSimPeriod] = useState<"Matutino" | "Vespertino" | "Noturno" | "Integral" | "Sábado Integral">("Matutino");
  const [simDays, setSimDays] = useState("Segunda a Sexta");
  const [simRegional, setSimRegional] = useState<Regional | "Todas">("Todas");

  // Get unique list of competencies (e.g. "NR 10", "NR 35", etc.) for filters
  const allCompetencies = Array.from(
    new Set(instructors.flatMap(inst => inst.competencies))
  ).sort();

  // Filtered Instructor list for Quadro
  const filteredInstructors = instructors.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inst.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (inst.notes && inst.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRegional = selectedRegional === "Todas" || inst.regional === selectedRegional;
    const matchesCompetency = selectedCompetency === "Todas" || inst.competencies.includes(selectedCompetency);
    return matchesSearch && matchesRegional && matchesCompetency;
  });

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

    if (!formId.trim()) { alert("O campo 'ID do instrutor' é obrigatório."); return; }
    if (!formName.trim()) { alert("O campo 'Nome completo' é obrigatório."); return; }
    if (!formEmail.trim()) { alert("O campo 'E-mail' é obrigatório."); return; }
    if (!formRegionalBase) { alert("O campo 'Regional-base' é obrigatório."); return; }
    if (!formUnitBase.trim()) { alert("O campo 'Unidade-base' é obrigatório."); return; }
    if (!formCityBase.trim()) { alert("O campo 'Município-base' é obrigatório."); return; }

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
      constraints: formNotes.trim() || "Sem restrições declaradas"
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

  // PESQUISA INTELIGENTE EVALUATION ENGINE
  const evaluateSmartSearch = () => {
    const course = courses.find(c => c.id === simCourseId);
    if (!course) return [];

    const requiredNR = course.name.includes("NR 10") ? "NR 10" :
                       course.name.includes("SEP") ? "SEP" :
                       course.name.includes("NR 35") ? "NR 35" :
                       course.name.includes("NR 33") ? "NR 33" :
                       course.name.includes("NR 20") ? "NR 20" :
                       course.name.includes("NR 12") ? "NR 12" : "NR";

    return instructors.map(inst => {
      const reasons: string[] = [];
      let isCompatible = true;

      // 1. Regional Filter
      if (simRegional !== "Todas" && inst.regional !== simRegional && (!inst.attendedRegionals || !inst.attendedRegionals.includes(simRegional))) {
        isCompatible = false;
        reasons.push(`Regional: Base em ${inst.regional} e não atende ${simRegional}.`);
      }

      // 2. Check Competency
      const hasNRCompetency = inst.competencies.some(comp => {
        if (requiredNR === "NR 10") return comp.includes("NR 10") || comp.includes("SEP");
        if (requiredNR === "SEP") return comp.includes("SEP");
        return comp.toUpperCase().includes(requiredNR.toUpperCase());
      });

      if (!hasNRCompetency) {
        isCompatible = false;
        reasons.push(`Sem Habilitação: Não possui certificação ${requiredNR} cadastrada.`);
      }

      // 3. Check Saturday & Night Restrictions
      const isSaturdayCourse = simPeriod === "Sábado Integral" || simDays.toLowerCase().includes("sábado");
      const isNoturnCourse = simPeriod === "Noturno";

      if (isSaturdayCourse) {
        const canSaturdays = inst.availability.toLowerCase().includes("sáb") || 
                             inst.availableDays?.includes("Sábado") ||
                             !inst.constraints.toLowerCase().includes("indisponível aos sábados");
        if (!canSaturdays) {
          isCompatible = false;
          reasons.push("Restrição: Indisponível para aulas aos sábados.");
        }
      }

      if (isNoturnCourse) {
        const avoidsNight = inst.constraints.toLowerCase().includes("apenas matutino") || 
                            inst.constraints.toLowerCase().includes("apenas vespertino") ||
                            inst.constraints.toLowerCase().includes("horário comercial");
        if (avoidsNight) {
          isCompatible = false;
          reasons.push("Restrição: Atende apenas em horário comercial (Matutino/Vespertino).");
        }
      }

      // 4. Check Date Overlap Conflicts with Active Classes
      const conflictClass = classes.find(c => {
        if (c.instructorId !== inst.id) return false;
        if (c.status === "Cancelada" || c.status === "Faturada") return false;
        
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
          `Conflito de Agenda: Alocado em ${confCourse?.name || "Turma Ativa"} (${conflictClass.startDate} a ${conflictClass.endDate}).`
        );
      }

      return {
        instructor: inst,
        isCompatible,
        reasons
      };
    });
  };

  const searchResults = evaluateSmartSearch();
  const compatibleInsts = searchResults.filter(r => r.isCompatible);
  const incompatibleInsts = searchResults.filter(r => !r.isCompatible);

  return (
    <div className="space-y-6">
      
      {/* Header and 2 Clean Navigation Tabs */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-800" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Agendas & Instrutores</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Quadro centralizado de docentes, qualificação por NR e ferramenta de Pesquisa Inteligente de disponibilidade sem conflitos.
          </p>
        </div>

        {/* Uncluttered 2-Tab Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("quadro")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "quadro"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Quadro de Instrutores ({instructors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("pesquisa")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "pesquisa"
                ? "bg-blue-700 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Pesquisa Inteligente</span>
          </button>
        </div>
      </div>

      {/* TAB 1: QUADRO DE INSTRUTORES */}
      {activeTab === "quadro" && (
        <div className="space-y-4">
          
          {/* Controls Panel */}
          <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-2.5 w-full md:w-auto">
              
              {/* Search */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar instrutor, e-mail, telefone..."
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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Todas">Regiões (Todas)</option>
                  <option value="Centro-Norte">Centro-Norte</option>
                  <option value="Oeste">Oeste</option>
                  <option value="Serrana">Serrana</option>
                  <option value="Norte">Norte</option>
                  <option value="Litoral">Litoral</option>
                  <option value="Vale do Itajaí">Vale do Itajaí</option>
                  <option value="Sul">Sul</option>
                </select>
              </div>

              {/* Competency Filter */}
              <div className="w-full md:w-44">
                <select
                  value={selectedCompetency}
                  onChange={(e) => setSelectedCompetency(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Todas">Competências NRs</option>
                  {allCompetencies.map(comp => (
                    <option key={comp} value={comp}>{comp}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => handleOpenForm()}
              className="flex items-center gap-1.5 px-4.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all w-full md:w-auto justify-center shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Novo Instrutor
            </button>
          </div>

          {/* Instructors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInstructors.length > 0 ? (
              filteredInstructors.map(inst => {
                const activeAssigned = classes.filter(
                  c => c.instructorId === inst.id && (c.status === "Em Andamento" || c.status === "Confirmada")
                ).length;

                return (
                  <div key={inst.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      
                      {/* Name & Badge */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2.5 bg-blue-50 text-blue-800 rounded-xl border border-blue-200 shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-sm leading-tight">{inst.name}</h4>
                            <p className="text-[10px] text-slate-500 font-bold">📍 Regional {inst.regional}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                          inst.linkType === "Mensalista" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                          inst.linkType === "Horista" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                          "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}>
                          {inst.linkType}
                        </span>
                      </div>

                      {/* Contact */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{inst.contact}</span>
                      </div>

                      {/* Competencies */}
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-slate-400" /> Matriz NRs Habilitadas
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {inst.competencies.map(comp => (
                            <span key={comp} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md border border-slate-200">
                              {comp}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Availability & Constraints */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Dias Disponíveis</p>
                          <p className="text-[11px] font-bold text-slate-700 truncate mt-0.5" title={inst.availability}>
                            {inst.availability}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Restrições</p>
                          <p className="text-[11px] font-bold text-slate-700 truncate mt-0.5" title={inst.constraints}>
                            {inst.constraints}
                          </p>
                        </div>
                      </div>

                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold">
                        {activeAssigned > 0 ? (
                          <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            ● {activeAssigned} aula(s) em andamento
                          </span>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            ● Livre para escalas
                          </span>
                        )}
                      </span>

                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleOpenForm(inst)}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-blue-700 rounded-lg transition-colors cursor-pointer"
                          title="Editar Cadastro"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remover o instrutor ${inst.name}?`)) {
                              onDeleteInstructor(inst.id);
                            }
                          }}
                          className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Instrutor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200">
                <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">Nenhum instrutor localizado</p>
                <p className="text-xs text-slate-400 mt-1">Ajuste os filtros de busca, regional ou competência NR.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PESQUISA INTELIGENTE DE ALOCAÇÃO */}
      {activeTab === "pesquisa" && (
        <div className="space-y-6">
          
          {/* Query Filter Box */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-extrabold text-white">Pesquisa Inteligente de Disponibilidade & Alocação</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Course selection */}
              <div className="space-y-1">
                <label className="font-bold text-blue-200">Curso / Norma Regulamentadora</label>
                <select
                  value={simCourseId}
                  onChange={(e) => setSimCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold focus:outline-none focus:border-blue-400 cursor-pointer"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.codeSGN} - {c.name} ({c.duration}h)
                    </option>
                  ))}
                </select>
              </div>

              {/* Start & End Date */}
              <div className="space-y-1">
                <label className="font-bold text-blue-200">Período da Turma (Início - Fim)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={simStartDate}
                    onChange={(e) => setSimStartDate(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold focus:outline-none focus:border-blue-400"
                  />
                  <input
                    type="date"
                    value={simEndDate}
                    onChange={(e) => setSimEndDate(e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Shift */}
              <div className="space-y-1">
                <label className="font-bold text-blue-200">Turno de Aula</label>
                <select
                  value={simPeriod}
                  onChange={(e) => setSimPeriod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold focus:outline-none focus:border-blue-400 cursor-pointer"
                >
                  <option value="Matutino">Matutino (08h às 12h)</option>
                  <option value="Vespertino">Vespertino (13h30 às 17h30)</option>
                  <option value="Noturno">Noturno (18h30 às 22h30)</option>
                  <option value="Integral">Integral (08h às 17h)</option>
                  <option value="Sábado Integral">Sábado Integral (08h às 17h)</option>
                </select>
              </div>

              {/* Regional */}
              <div className="space-y-1">
                <label className="font-bold text-blue-200">Regional SESI</label>
                <select
                  value={simRegional}
                  onChange={(e) => setSimRegional(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold focus:outline-none focus:border-blue-400 cursor-pointer"
                >
                  <option value="Todas">Todas as Regionais</option>
                  <option value="Centro-Norte">Centro-Norte</option>
                  <option value="Oeste">Oeste</option>
                  <option value="Serrana">Serrana</option>
                  <option value="Norte">Norte</option>
                  <option value="Litoral">Litoral</option>
                  <option value="Vale do Itajaí">Vale do Itajaí</option>
                  <option value="Sul">Sul</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* COMPATIBLE INSTRUCTORS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Instrutores Elegíveis sem Conflito ({compatibleInsts.length})</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded-full">
                  100% Compatíveis
                </span>
              </div>

              <div className="space-y-3">
                {compatibleInsts.length > 0 ? (
                  compatibleInsts.map(({ instructor: inst }) => (
                    <div key={inst.id} className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs space-y-2.5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-xs">{inst.name}</h4>
                          <p className="text-[10px] text-slate-500 font-semibold">
                            📍 Regional {inst.regional} • Vínculo: {inst.linkType}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-md">
                          Livre para Alocação
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-600 space-y-1">
                        <p><strong>Contato:</strong> {inst.contact}</p>
                        <p><strong>Competências:</strong> {inst.competencies.join(", ")}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 bg-white text-center rounded-xl border border-slate-200 text-xs text-slate-400 italic">
                    Nenhum instrutor atende 100% dos critérios para este curso e período.
                  </div>
                )}
              </div>
            </div>

            {/* INCOMPATIBLE / CONFLICT INSTRUCTORS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-rose-50 p-3.5 rounded-xl border border-rose-200">
                <div className="flex items-center gap-2 text-rose-900 font-extrabold text-xs">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Instrutores Indisponíveis / Com Restrição ({incompatibleInsts.length})</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-rose-200 text-rose-900 rounded-full">
                  Impedidos
                </span>
              </div>

              <div className="space-y-3">
                {incompatibleInsts.length > 0 ? (
                  incompatibleInsts.map(({ instructor: inst, reasons }) => (
                    <div key={inst.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 opacity-85">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs">{inst.name}</h4>
                          <p className="text-[10px] text-slate-400 font-medium">📍 Regional {inst.regional}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {reasons.map((r, idx) => (
                          <p key={idx} className="text-[10px] font-bold text-rose-700 bg-rose-100/70 px-2 py-1 rounded-md border border-rose-200/50">
                            • {r}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 bg-white text-center rounded-xl border border-slate-200 text-xs text-slate-400 italic">
                    Nenhum instrutor impedido.
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Instructor Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl my-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {editingInstructor ? "Editar Cadastro do Instrutor" : "Cadastrar Novo Instrutor"}
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  Informações institucionais e atribuição de competências NRs
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ID do Instrutor *</label>
                  <input
                    type="text"
                    required
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder="Ex: 522389"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Luiz Ricardo Mereles"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">E-mail *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="Ex: luiz.mereles@sesisc.org.br"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Telefone</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="Ex: (48) 99999-9999"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Regional-Base *</label>
                  <select
                    value={formRegionalBase}
                    onChange={(e) => setFormRegionalBase(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                  >
                    {["Centro-Norte", "Oeste", "Serrana", "Norte", "Litoral", "Vale do Itajaí", "Sul"].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Unidade-Base *</label>
                  <input
                    type="text"
                    required
                    value={formUnitBase}
                    onChange={(e) => setFormUnitBase(e.target.value)}
                    placeholder="Ex: Caçador, Videira, Canoinhas"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tipo de Vínculo *</label>
                  <select
                    value={formLinkType}
                    onChange={(e) => setFormLinkType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                  >
                    <option value="Horista">Horista</option>
                    <option value="Mensalista">Mensalista</option>
                    <option value="Terceirizado">Terceirizado</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Situação *</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium cursor-pointer"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>

                <div className="col-span-1 sm:col-span-2 space-y-1.5">
                  <label className="font-bold text-slate-700">Competências Técnicas / Matriz NRs</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    {["NR 05 - CIPA", "NR 06 - EPI", "NR 10 - Básico", "NR 10 - SEP", "NR 11 - Empilhadeira", "NR 11 - Ponte Rolante", "NR 12", "NR 13 - Caldeiras", "NR 17", "NR 18 - PEMT", "NR 20", "NR 23", "NR 31", "NR 33", "NR 35"].map(comp => (
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

                <div className="col-span-1 sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Observações / Restrições de Agenda</label>
                  <textarea
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
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  Salvar Instrutor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
