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
  AlertTriangle
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
  // Tabs: "Diretório" or "Simulador"
  const [activeTab, setActiveTab] = useState<"diretorio" | "simulador">("diretorio");
  
  // Search and Filter states for Directory
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegional, setSelectedRegional] = useState<Regional | "Todas">("Todas");
  const [selectedCompetency, setSelectedCompetency] = useState<string>("Todas");

  // Instructor Form Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formLinkType, setFormLinkType] = useState<InstructorLinkType>("Mensalista");
  const [formRegional, setFormRegional] = useState<Regional>("Oeste");
  const [formContact, setFormContact] = useState("");
  const [formCompetencies, setFormCompetencies] = useState<string[]>([]);
  const [formAvailability, setFormAvailability] = useState("");
  const [formConstraints, setFormConstraints] = useState("");
  const [formNotes, setFormNotes] = useState("");

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

  // Handle Form Open for Create/Edit
  const handleOpenForm = (inst?: Instructor) => {
    if (inst) {
      setEditingInstructor(inst);
      setFormName(inst.name);
      setFormLinkType(inst.linkType);
      setFormRegional(inst.regional);
      setFormContact(inst.contact);
      setFormCompetencies(inst.competencies);
      setFormAvailability(inst.availability);
      setFormConstraints(inst.constraints);
      setFormNotes(inst.notes || "");
    } else {
      setEditingInstructor(null);
      setFormName("");
      setFormLinkType("Mensalista");
      setFormRegional("Oeste");
      setFormContact("");
      setFormCompetencies([]);
      setFormAvailability("Segunda a Sexta");
      setFormConstraints("Sem restrições");
      setFormNotes("");
    }
    setIsModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formContact) {
      alert("Por favor, preencha o Nome e Contato.");
      return;
    }

    const instructorData: Instructor = {
      id: editingInstructor ? editingInstructor.id : `inst-${Date.now()}`,
      name: formName,
      linkType: formLinkType,
      regional: formRegional,
      contact: formContact,
      competencies: formCompetencies,
      availability: formAvailability,
      constraints: formConstraints,
      notes: formNotes
    };

    if (editingInstructor) {
      onUpdateInstructor(instructorData);
    } else {
      onAddInstructor(instructorData);
    }
    setIsModalOpen(false);
  };

  const toggleCompetencyInForm = (comp: string) => {
    if (formCompetencies.includes(comp)) {
      setFormCompetencies(formCompetencies.filter(c => c !== comp));
    } else {
      setFormCompetencies([...formCompetencies, comp]);
    }
  };

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
          `Conflito: Alocado na turma de ${confCourse?.name.split("-")[0]} para ${conflictClass.clientName} (${conflictClass.startDate} a ${conflictClass.endDate}).`
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

        <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("diretorio")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "diretorio"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            📂 Diretório de Instrutores
          </button>
          <button
            onClick={() => setActiveTab("simulador")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "simulador"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            🧠 Simulador Inteligente
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

      {/* Simulator Tab */}
      {activeTab === "simulador" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Simulator Controls Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 self-start">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-3">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              Parâmetros da Nova Turma
            </h3>

            <div className="space-y-3.5 text-xs">
              {/* Course selection */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Curso Solicitado</label>
                <select
                  value={simCourseId}
                  onChange={(e) => setSimCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name.split("-")[0].trim()} ({course.duration}h)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date selection */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Data Início</label>
                  <input
                    type="date"
                    value={simStartDate}
                    onChange={(e) => setSimStartDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-xs font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Data Término</label>
                  <input
                    type="date"
                    value={simEndDate}
                    onChange={(e) => setSimEndDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Shift selection */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Período / Turno</label>
                <select
                  value={simPeriod}
                  onChange={(e) => setSimPeriod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
                >
                  <option value="Matutino">Matutino (Manhã)</option>
                  <option value="Vespertino">Vespertino (Tarde)</option>
                  <option value="Noturno">Noturno (Noite)</option>
                  <option value="Integral">Integral (Manhã + Tarde)</option>
                  <option value="Sábado Integral">Sábado Integral</option>
                </select>
              </div>

              {/* Days selection text */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Esquema de Dias</label>
                <select
                  value={simDays}
                  onChange={(e) => setSimDays(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
                >
                  <option value="Segunda a Sexta">Segunda a Sexta</option>
                  <option value="Sábado">Apenas Sábados</option>
                  <option value="Seg, Qua, Sex">Segunda, Quarta e Sexta</option>
                  <option value="Ter, Qui">Terça e Quinta</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50/50 p-4 rounded-2xl text-[11px] text-blue-700 border border-blue-250">
              <p className="font-bold">Como funciona a inteligência?</p>
              <p className="mt-1 leading-relaxed font-medium">
                O sistema cruza as competências de cada professor (NR cadastrada), verifica o turno de preferência, os dias de disponibilidade semanal e verifica se o professor já possui turmas ativas alocadas entre as datas propostas.
              </p>
            </div>
          </div>

          {/* Simulator Results Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Compatible Section */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                Instrutores Habilitados e Disponíveis ({compatibleInsts.length})
              </h4>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {compatibleInsts.length > 0 ? (
                  compatibleInsts.map(({ instructor }) => (
                    <div key={instructor.id} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-xs">{instructor.name}</span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[8px] font-bold rounded-full">
                            {instructor.linkType}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Regional: {instructor.regional} | Competências: {instructor.competencies.join(", ")}
                        </p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <p className="text-[10px] text-slate-500 font-bold">📅 {instructor.availability}</p>
                        <p className="text-[10px] text-emerald-700 font-bold mt-0.5">✓ 100% Compatível</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic text-center py-4">Nenhum instrutor compatível para as opções selecionadas.</p>
                )}
              </div>
            </div>

            {/* Incompatible Section */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-slate-600 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <XCircle className="w-4 h-4 text-slate-400" />
                Instrutores Incompatíveis ({incompatibleInsts.length})
              </h4>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {incompatibleInsts.map(({ instructor, reasons }) => (
                  <div key={instructor.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700 text-xs">{instructor.name}</span>
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[8px] font-bold rounded-full">
                          {instructor.linkType}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Regional: {instructor.regional} | Competências: {instructor.competencies.join(", ")}
                      </p>
                    </div>
                    <div className="space-y-1 self-start sm:self-center">
                      {reasons.map((reason, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-1 text-[10px] text-rose-600 font-bold">
                          <AlertCircle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Instructor Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in-50 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingInstructor ? "Editar Cadastro do Instrutor" : "Cadastrar Novo Instrutor"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="col-span-2 space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Nome do Instrutor *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Carlos Eduardo de Souza"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Link Type */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Tipo de Vínculo</label>
                  <select
                    value={formLinkType}
                    onChange={(e) => setFormLinkType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="Mensalista">Mensalista (SESI)</option>
                    <option value="Horista">Horista (SESI)</option>
                    <option value="Terceirizado">Terceirizado</option>
                  </select>
                </div>

                {/* Regional */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Regional de Atuação</label>
                  <select
                    value={formRegional}
                    onChange={(e) => setFormRegional(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
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

                {/* Contact */}
                <div className="col-span-2 space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Contato (Tel/E-mail) *</label>
                  <input
                    type="text"
                    required
                    value={formContact}
                    onChange={(e) => setFormContact(e.target.value)}
                    placeholder="Ex: (48) 99999-8888 - professor@sesisc.org.br"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Competencies Checklist */}
                <div className="col-span-2 space-y-1.5 text-xs">
                  <label className="font-semibold text-slate-600">Competências Técnicas / NRs Habilitadas</label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {["NR 10", "SEP", "NR 35", "NR 33", "NR 20", "NR 12"].map(nr => (
                      <label key={nr} className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-700 select-none">
                        <input
                          type="checkbox"
                          checked={formCompetencies.includes(nr)}
                          onChange={() => toggleCompetencyInForm(nr)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        {nr}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Disponibilidade Semanal</label>
                  <input
                    type="text"
                    value={formAvailability}
                    onChange={(e) => setFormAvailability(e.target.value)}
                    placeholder="Ex: Seg, Qua, Sex"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Constraints */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Restrições de Turno/Horas</label>
                  <input
                    type="text"
                    value={formConstraints}
                    onChange={(e) => setFormConstraints(e.target.value)}
                    placeholder="Ex: Apenas noturno, Sábados"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Notes */}
                <div className="col-span-2 space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Observações Adicionais</label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Informações adicionais relevantes, especialidades..."
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
