/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Briefcase, 
  Plus, 
  MapPin, 
  Clock, 
  Layers, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  AlertCircle,
  Save,
  Check,
  ChevronRight,
  User,
  Hash,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { CourseClass, Course, Instructor, AccessProfile, OperationalStep, StepStatus, ClassStatus, Regional, CourseType } from "../types";
import { MUNICIPALITIES, formatLocation } from "../data/municipalities";

interface OperationalTrackerViewProps {
  classes: CourseClass[];
  courses: Course[];
  instructors: Instructor[];
  currentProfile: AccessProfile;
  onAddClass: (newClass: CourseClass) => void;
  onUpdateClass: (updatedClass: CourseClass) => void;
}

export default function OperationalTrackerView({
  classes,
  courses,
  instructors,
  currentProfile,
  onAddClass,
  onUpdateClass
}: OperationalTrackerViewProps) {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(classes[0]?.id || null);
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);

  // Form states for creating a Class
  const [formCourseId, setFormCourseId] = useState(courses[0]?.id || "");
  const [formType, setFormType] = useState<CourseType>("RPC");
  const [formInstructorId, setFormInstructorId] = useState<string>("");
  const [formStartDate, setFormStartDate] = useState("2026-07-27");
  const [formEndDate, setFormEndDate] = useState("2026-07-31");
  const [formScheduleDays, setFormScheduleDays] = useState("Segunda a Sexta");
  const [formPeriod, setFormPeriod] = useState<"Matutino" | "Vespertino" | "Noturno" | "Integral" | "Sábado Integral">("Matutino");
  const [formRegional, setFormRegional] = useState<Regional>("Oeste");
  const [formCity, setFormCity] = useState("");
  const [formClientName, setFormClientName] = useState("");
  const [formMaxParticipants, setFormMaxParticipants] = useState(20);
  const [formCurrentParticipants, setFormCurrentParticipants] = useState(0);
  const [formRevenuePredicted, setFormRevenuePredicted] = useState(4500);
  const [formNotes, setFormNotes] = useState("");

  const activeClass = classes.find(c => c.id === selectedClassId) || classes[0];

  // States for Editing Agenda (Supervisor/Coordination)
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editPeriod, setEditPeriod] = useState<any>("Matutino");
  const [editScheduleDays, setEditScheduleDays] = useState("");
  const [lastSelectedClassId, setLastSelectedClassId] = useState<string | null>(null);

  React.useEffect(() => {
    if (activeClass && activeClass.id !== lastSelectedClassId) {
      setEditStartDate(activeClass.startDate);
      setEditEndDate(activeClass.endDate);
      setEditPeriod(activeClass.period);
      setEditScheduleDays(activeClass.scheduleDays);
      setLastSelectedClassId(activeClass.id);
    }
  }, [activeClass?.id, lastSelectedClassId]);

  // Helper to calculate class progress based on 13 stages
  const calculateProgress = (c: CourseClass) => {
    const completedCount = c.steps.filter(s => s.status === "Concluído").length;
    const totalCount = c.steps.length;
    return {
      completed: completedCount,
      total: totalCount,
      percent: Math.round((completedCount / totalCount) * 100)
    };
  };

  // Helper to check if current logged-in profile owns the selected step
  const doesProfileOwnStep = (stepResponsible: string, profile: AccessProfile) => {
    if (profile === "Supervisão") return true; // Supervisor owns everything
    return stepResponsible.toLowerCase() === profile.toLowerCase();
  };

  const getInstructorAvailability = () => {
    if (!activeClass || !activeClass.instructorId) {
      return { status: "no_instructor", message: "Nenhum instrutor alocado para esta turma." };
    }

    const inst = instructors.find(i => i.id === activeClass.instructorId);
    if (!inst) return { status: "error", message: "Instrutor não encontrado." };

    // Find other classes where this instructor is allocated
    const conflict = classes.find(c => {
      if (c.id === activeClass.id) return false;
      if (c.instructorId !== activeClass.instructorId) return false;
      if (c.status === "Cancelada" || c.status === "Faturada") return false;

      // Overlapping dates check
      const startA = new Date(c.startDate + "T00:00:00");
      const endA = new Date(c.endDate + "T00:00:00");
      const startB = new Date(editStartDate + "T00:00:00");
      const endB = new Date(editEndDate + "T00:00:00");

      return startA <= endB && endA >= startB;
    });

    if (conflict) {
      const course = courses.find(co => co.id === conflict.courseId);
      return {
        status: "conflict",
        message: `🚨 Conflito de Agenda! O instrutor ${inst.name} já possui a turma "${course?.name.split("-")[0]}" (${conflict.clientName}) de ${conflict.startDate} a ${conflict.endDate}.`
      };
    }

    // Shift check
    if (editPeriod === "Noturno" && (inst.constraints.toLowerCase().includes("apenas matutino") || inst.constraints.toLowerCase().includes("horário comercial"))) {
      return {
        status: "constraint",
        message: `⚠️ Restrição de Turno: O instrutor ${inst.name} prefere ou é limitado a horário comercial.`
      };
    }
    if (editPeriod !== "Noturno" && inst.constraints.toLowerCase().includes("apenas noturno")) {
      return {
        status: "constraint",
        message: `⚠️ Restrição de Turno: O instrutor ${inst.name} só está disponível no período noturno.`
      };
    }

    return {
      status: "available",
      message: `✅ Horário Disponível! O instrutor ${inst.name} está totalmente liberado para este período.`
    };
  };

  const availability = getInstructorAvailability();

  const handleUpdateStepStatus = (stepId: string, newStatus: StepStatus, notes?: string) => {
    if (!activeClass) return;

    const updatedSteps = activeClass.steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          status: newStatus,
          updatedAt: new Date().toISOString().split("T")[0],
          notes: notes !== undefined ? notes : step.notes
        };
      }
      return step;
    });

    // Automatically update general Class status depending on operational steps
    let newClassStatus = activeClass.status;
    const allDone = updatedSteps.every(s => s.status === "Concluído" || s.status === "N/A");
    const isFaturamentoDone = updatedSteps.find(s => s.name === "Faturamento")?.status === "Concluído";
    const isCursoDone = updatedSteps.find(s => s.name === "Curso Realizado")?.status === "Concluído";

    if (allDone) {
      newClassStatus = "Faturada"; // Or finished
    } else if (isFaturamentoDone) {
      newClassStatus = "Faturada";
    } else if (isCursoDone) {
      newClassStatus = "Realizada";
    }

    onUpdateClass({
      ...activeClass,
      steps: updatedSteps,
      status: newClassStatus
    });
  };

  const handleUpdateClassDetails = (field: keyof CourseClass, value: any) => {
    if (!activeClass) return;
    onUpdateClass({
      ...activeClass,
      [field]: value
    });
  };

  // Submit new class
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClientName || !formCity) {
      alert("Por favor, informe a Razão Social/Cliente e a Cidade.");
      return;
    }

    // Scaffold 13 default steps
    const defaultSteps: OperationalStep[] = [
      { id: "step-1", name: "Demanda Comercial", status: "Concluído", responsible: "Comercial" },
      { id: "step-2", name: "Proposta", status: "Concluído", responsible: "Comercial" },
      { id: "step-3", name: "Contrato", status: "Concluído", responsible: "Comercial" },
      { id: "step-4", name: "Turma Criada", status: "Concluído", responsible: "PCP" },
      { id: "step-5", name: "Instrutor Definido", status: formInstructorId ? "Concluído" : "Pendente", responsible: "PCP", notes: formInstructorId ? "Definido no cadastro inicial" : "" },
      { id: "step-6", name: "Ensalamento", status: "Pendente", responsible: "PCP" },
      { id: "step-7", name: "Lista de Alunos", status: "Pendente", responsible: "Secretária" },
      { id: "step-8", name: "Materiais", status: "Pendente", responsible: "PCP" },
      { id: "step-9", name: "Curso Realizado", status: "Pendente", responsible: "Instrutor" },
      { id: "step-10", name: "Diário Lançado", status: "Pendente", responsible: "Instrutor" },
      { id: "step-11", name: "Certificados Emitidos", status: "Pendente", responsible: "Secretária" },
      { id: "step-12", name: "Faturamento", status: "Pendente", responsible: "Faturamento" },
      { id: "step-13", name: "Finalizado", status: "Pendente", responsible: "Supervisão" }
    ];

    const newClassData: CourseClass = {
      id: `turma-${Date.now()}`,
      courseId: formCourseId,
      type: formType,
      instructorId: formInstructorId || null,
      startDate: formStartDate,
      endDate: formEndDate,
      scheduleDays: formScheduleDays,
      period: formPeriod,
      regional: formRegional,
      city: formCity,
      clientName: formClientName,
      maxParticipants: Number(formMaxParticipants),
      currentParticipants: Number(formCurrentParticipants),
      status: "Pendente",
      revenuePredicted: Number(formRevenuePredicted),
      revenueRealized: 0,
      steps: defaultSteps,
      notes: formNotes
    };

    onAddClass(newClassData);
    setSelectedClassId(newClassData.id);
    setIsNewClassModalOpen(false);

    // Reset Form
    setFormClientName("");
    setFormCity("");
    setFormInstructorId("");
    setFormNotes("");
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Rastreador Operacional de Turmas</h2>
          <p className="text-sm text-slate-500">
            Acompanhe o andamento das etapas comerciais, de PCP, pedagógicas e fiscais de cada turma cadastrada.
          </p>
        </div>

        {/* Create button available for PCP or Supervisao */}
        {(currentProfile === "PCP" || currentProfile === "Supervisão") && (
          <button
            onClick={() => setIsNewClassModalOpen(true)}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            Programar Nova Turma
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Classes List (col-span-4) */}
        <div className="lg:col-span-4 space-y-3 max-h-[580px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Turmas Ativas ({classes.length})</span>
            <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded border border-slate-200">
              Perfil: {currentProfile}
            </span>
          </div>

          {classes.map(c => {
            const course = courses.find(cr => cr.id === c.courseId);
            const isSelected = c.id === selectedClassId;
            const progress = calculateProgress(c);

            return (
              <div
                key={c.id}
                onClick={() => setSelectedClassId(c.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected 
                    ? "bg-blue-50 border-blue-400 shadow-md ring-1 ring-blue-100/50 scale-[1.01]" 
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md shadow-sm"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                      c.type === "PAC" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                      c.type === "RPC" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      "bg-violet-50 text-violet-700 border border-violet-100"
                    }`}>
                      {c.type === "PAC" ? "Aberto (PAC)" : c.type === "RPC" ? "In-Company (RPC)" : "EAD"}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                      c.status === "Em Andamento" ? "bg-blue-100 text-blue-800" :
                      c.status === "Confirmada" ? "bg-emerald-100 text-emerald-800" :
                      c.status === "Realizada" ? "bg-violet-100 text-violet-800" :
                      c.status === "Faturada" ? "bg-slate-100 text-slate-800" :
                      c.status === "Cancelada" ? "bg-red-100 text-red-800" :
                      "bg-amber-100 text-amber-800"
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-800 text-xs leading-snug">
                    {course?.name.split("-")[0].trim()}
                  </h4>

                  <div className="flex flex-wrap gap-x-2 gap-y-1 text-[10px] text-slate-500 font-medium">
                    <span>📍 {formatLocation(c.city, c.regional)}</span>
                    <span>•</span>
                    <span className="font-bold text-slate-700 truncate max-w-[150px]">🏢 {c.clientName}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span className="font-bold">Fluxo Operacional</span>
                    <span className="font-bold text-slate-600">{progress.completed}/{progress.total} etapas ({progress.percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        progress.percent === 100 ? "bg-emerald-500" : "bg-blue-600"
                      }`} 
                      style={{ width: `${progress.percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Operational Steps Flow (col-span-8) */}
        <div className="lg:col-span-8">
          {activeClass ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
              
              {/* Selected Class Core Details */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-4 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">DETALHES DA TURMA SELECIONADA</span>
                  <h3 className="font-bold text-slate-800 text-base leading-tight">
                    {courses.find(cr => cr.id === activeClass.courseId)?.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> <span className="font-semibold text-slate-700">{formatLocation(activeClass.city, activeClass.regional)}</span></span>
                    <span className="text-slate-300">|</span>
                    <span>Cliente: <span className="font-semibold text-slate-700">{activeClass.clientName}</span></span>
                  </p>
                </div>
                
                <div className="flex gap-2 self-start sm:self-auto">
                  {/* Quick actions depending on profile */}
                  {(currentProfile === "PCP" || currentProfile === "Supervisão") && (
                    <div className="flex flex-col space-y-1 text-right">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Instrutor Alocado</label>
                      <select
                        value={activeClass.instructorId || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdateClassDetails("instructorId", val || null);
                          // Trigger update of step 5 'Instrutor Definido'
                          handleUpdateStepStatus("step-5", val ? "Concluído" : "Pendente", val ? "Definido via painel rápido" : "Instrutor removido");
                        }}
                        className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium text-slate-700 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">-- Sem Instrutor --</option>
                        {instructors.map(i => (
                          <option key={i.id} value={i.id}>{i.name} (Reg. {i.regional})</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {currentProfile === "Faturamento" && (
                    <div className="flex flex-col space-y-1 text-right">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">N° Chamado Faturamento</label>
                      <input
                        type="text"
                        placeholder="Ex: CH-1234"
                        value={activeClass.billingCallNumber || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleUpdateClassDetails("billingCallNumber", val);
                          // Automatically update Step 12 status
                          handleUpdateStepStatus("step-12", val ? "Concluído" : "Pendente", val ? `Nº Chamado: ${val}` : "");
                        }}
                        className="px-2 py-1.5 border border-slate-200 rounded-xl text-xs font-mono w-28 bg-slate-50 text-slate-700 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Banner Validation always visible if an instructor is allocated */}
              {activeClass.instructorId && (
                <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                  availability.status === "available" ? "bg-emerald-50/40 border-emerald-200/60 text-emerald-800" :
                  availability.status === "conflict" ? "bg-rose-50/40 border-rose-200/60 text-rose-800" :
                  availability.status === "constraint" ? "bg-amber-50/40 border-amber-200/60 text-amber-800" :
                  "bg-slate-100 border-slate-200 text-slate-600"
                }`}>
                  {availability.status === "available" && <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />}
                  {availability.status === "conflict" && <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />}
                  {availability.status === "constraint" && <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />}
                  <div className="space-y-0.5">
                    <p className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                      <span>Validação Smart de Alocação de Instrutor</span>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono ${
                        availability.status === "available" ? "bg-emerald-200 text-emerald-900" :
                        availability.status === "conflict" ? "bg-rose-200 text-rose-900 animate-pulse" :
                        "bg-amber-200 text-amber-900"
                      }`}>
                        {availability.status === "available" ? "100% OK" :
                         availability.status === "conflict" ? "CONFLITO IMPEDITIVO" :
                         "RESTRICÃO"}
                      </span>
                    </p>
                    <p className="font-medium leading-relaxed text-xs">{availability.message}</p>
                  </div>
                </div>
              )}

              {/* Step Flow List (13 Stages) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    Etapas do Fluxo Operacional (1 a 13)
                  </span>
                  <span className="text-[10px] text-slate-500 italic">
                    💡 Passos destacados em azul pertencem ao seu departamento!
                  </span>
                </div>

                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {activeClass.steps.map((step, index) => {
                    const isOwnStep = doesProfileOwnStep(step.responsible, currentProfile);
                    
                    return (
                      <div 
                        key={step.id} 
                        className={`p-3 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${
                          isOwnStep 
                            ? "bg-blue-50/30 border-blue-300 shadow-xs" 
                            : "bg-slate-50/50 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {/* Stage Number, Name & Responsibility */}
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold font-mono ${
                            step.status === "Concluído" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                            step.status === "Em andamento" ? "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse" :
                            "bg-slate-100 text-slate-400"
                          }`}>
                            {index + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-800">{step.name}</span>
                              <span className={`px-2 py-0.5 text-[8px] font-bold rounded-full uppercase tracking-wider ${
                                isOwnStep ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                              }`}>
                                {step.responsible}
                              </span>
                            </div>
                            {step.notes && (
                              <p className="text-[10px] text-slate-500 font-mono italic mt-0.5">
                                Nota: {step.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Status controls */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                          {isOwnStep ? (
                            <div className="flex gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
                              {["Pendente", "Em andamento", "Concluído", "N/A"].map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => {
                                    const notePrompt = st === "Concluído" && step.name === "Faturamento" 
                                      ? prompt("Digite o Nº do Chamado de Abertura de Faturamento:") 
                                      : undefined;
                                    
                                    if (notePrompt !== null) {
                                      if (notePrompt) {
                                        handleUpdateClassDetails("billingCallNumber", notePrompt);
                                      }
                                      handleUpdateStepStatus(step.id, st as StepStatus, notePrompt || undefined);
                                    }
                                  }}
                                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors ${
                                    step.status === st
                                      ? st === "Concluído" ? "bg-emerald-600 text-white shadow-2xs" :
                                        st === "Em andamento" ? "bg-amber-500 text-white shadow-2xs" :
                                        st === "N/A" ? "bg-slate-500 text-white shadow-2xs" :
                                        "bg-slate-300 text-slate-700 shadow-2xs"
                                      : "text-slate-500 hover:bg-slate-100"
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              step.status === "Concluído" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                              step.status === "Em andamento" ? "bg-amber-50 text-amber-700 border-amber-100" :
                              step.status === "N/A" ? "bg-slate-100 text-slate-400 border-slate-200" :
                              "bg-slate-100 text-slate-500 border-slate-200"
                            }`}>
                              {step.status}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Change Schedule Section (For Supervision / PCP Coordination) */}
              {(currentProfile === "Supervisão" || currentProfile === "PCP") && (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      Alteração de Agenda (Supervisão / Coordenação)
                    </h4>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
                      Acesso Autorizado
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-600 block">Data de Início</label>
                      <input
                        type="date"
                        value={editStartDate}
                        onChange={(e) => setEditStartDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-600 block">Data de Término</label>
                      <input
                        type="date"
                        value={editEndDate}
                        onChange={(e) => setEditEndDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-600 block">Turno das Aulas</label>
                      <select
                        value={editPeriod}
                        onChange={(e) => setEditPeriod(e.target.value as any)}
                        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
                      >
                        <option value="Matutino">Matutino</option>
                        <option value="Vespertino">Vespertino</option>
                        <option value="Noturno">Noturno</option>
                        <option value="Integral">Integral</option>
                        <option value="Sábado Integral">Sábado Integral</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-600 block">Dias Semanais</label>
                      <input
                        type="text"
                        value={editScheduleDays}
                        onChange={(e) => setEditScheduleDays(e.target.value)}
                        placeholder="Ex: Segunda a Sexta"
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Smart availability notification */}
                  <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    availability.status === "available" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
                    availability.status === "conflict" ? "bg-rose-50 border-rose-200 text-rose-800" :
                    availability.status === "constraint" ? "bg-amber-50 border-amber-200 text-amber-800" :
                    "bg-slate-100 border-slate-200 text-slate-600"
                  }`}>
                    {availability.status === "available" && <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />}
                    {availability.status === "conflict" && <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />}
                    {availability.status === "constraint" && <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />}
                    {availability.status === "no_instructor" && <HelpCircle className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />}
                    <div className="space-y-0.5">
                      <p className="font-bold">Validação de Escala de Horários</p>
                      <p className="font-medium leading-relaxed">{availability.message}</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditStartDate(activeClass.startDate);
                        setEditEndDate(activeClass.endDate);
                        setEditPeriod(activeClass.period);
                        setEditScheduleDays(activeClass.scheduleDays);
                      }}
                      className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors"
                    >
                      Descartar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateClass({
                          ...activeClass,
                          startDate: editStartDate,
                          endDate: editEndDate,
                          period: editPeriod,
                          scheduleDays: editScheduleDays
                        });
                        alert("Agenda da turma atualizada com sucesso!");
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-650 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Salvar Nova Agenda
                    </button>
                  </div>
                </div>
              )}

              {/* Miscellaneous class specs */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Período / Dias</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{activeClass.period}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{activeClass.scheduleDays}</p>
                </div>
                
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Período de Aulas</p>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {activeClass.startDate.split("-")[2]}/{activeClass.startDate.split("-")[1]} até {activeClass.endDate.split("-")[2]}/{activeClass.endDate.split("-")[1]}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Ocupação Corrente</p>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    {activeClass.currentParticipants} / {activeClass.maxParticipants} alunos
                  </p>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    ({Math.round((activeClass.currentParticipants / activeClass.maxParticipants) * 100)}% ocupado)
                  </span>
                </div>

                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Receita Estimada</p>
                  <p className="font-semibold text-slate-700 mt-0.5">
                    R$ {activeClass.revenuePredicted.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  {activeClass.revenueRealized > 0 && (
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                      Faturado: R$ {activeClass.revenueRealized.toLocaleString("pt-BR")}
                    </p>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-100 shadow-xs">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">Nenhuma turma cadastrada</p>
              <p className="text-xs text-slate-400 mt-1">Insira uma nova turma clicando em &quot;Programar Nova Turma&quot;.</p>
            </div>
          )}
        </div>

      </div>

      {/* Program New Class Modal */}
      {isNewClassModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-xl my-8 overflow-hidden animate-in fade-in-50 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">
                Programar Nova Turma de NR
              </h3>
              <button 
                onClick={() => setIsNewClassModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                
                {/* Course Selection */}
                <div className="col-span-2 space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Curso Base SGN *</label>
                  <select
                    value={formCourseId}
                    onChange={(e) => setFormCourseId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>

                {/* Modality Type */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Tipo de Contratação (Modalidade)</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="RPC">RPC (In-Company / Sob Demanda)</option>
                    <option value="PAC">PAC (Público / Venda por Matrícula)</option>
                    <option value="EAD_TURMA">EAD (100% Online com Tutor)</option>
                  </select>
                </div>

                {/* Instructor Selection */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Instrutor Preliminar</label>
                  <select
                    value={formInstructorId}
                    onChange={(e) => setFormInstructorId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
                  >
                    <option value="">-- Deixar sem Alocação --</option>
                    {instructors.map(i => (
                      <option key={i.id} value={i.id}>{i.name} (Regional: {i.regional})</option>
                    ))}
                  </select>
                </div>

                {/* Dates */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Data de Início</label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Data de Término</label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                {/* Schedule details */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Esquema de Dias Semanais</label>
                  <input
                    type="text"
                    value={formScheduleDays}
                    onChange={(e) => setFormScheduleDays(e.target.value)}
                    placeholder="Ex: Segunda a Sexta, Sábado"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Period */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Turno das Aulas</label>
                  <select
                    value={formPeriod}
                    onChange={(e) => setFormPeriod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Noturno">Noturno</option>
                    <option value="Integral">Integral</option>
                    <option value="Sábado Integral">Sábado Integral</option>
                  </select>
                </div>

                {/* Linked Municipality & Regional Selector */}
                <div className="col-span-2 space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Município / Regional do Curso *</label>
                  <select
                    required
                    value={formCity ? `${formCity}|${formRegional}` : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        const [selectedCity, selectedRegion] = value.split("|");
                        setFormCity(selectedCity);
                        setFormRegional(selectedRegion as any);
                      } else {
                        setFormCity("");
                        setFormRegional("Oeste");
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="">-- Selecione o Município (Vinculado à Regional) --</option>
                    {MUNICIPALITIES.map((m) => (
                      <option key={`${m.city}|${m.region}`} value={`${m.city}|${m.region}`}>
                        {m.city} ({m.region})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Client Name */}
                <div className="col-span-2 space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Razão Social / Cliente (Utilizar &apos;Aberto ao Público&apos; para PAC) *</label>
                  <input
                    type="text"
                    required
                    value={formClientName}
                    onChange={(e) => setFormClientName(e.target.value)}
                    placeholder="Ex: Tupy Metalúrgica S/A"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Max & Current Participants */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Limite Máximo Alunos</label>
                  <input
                    type="number"
                    value={formMaxParticipants}
                    onChange={(e) => setFormMaxParticipants(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Alunos Matriculados Atualmente</label>
                  <input
                    type="number"
                    value={formCurrentParticipants}
                    onChange={(e) => setFormCurrentParticipants(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Revenue predicted */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Receita Prevista (R$)</label>
                  <input
                    type="number"
                    value={formRevenuePredicted}
                    onChange={(e) => setFormRevenuePredicted(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Notes */}
                <div className="col-span-2 space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Notas de Coordenação / PCP</label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Notas adicionais sobre ensalamento, equipamentos ou demandas..."
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none text-xs"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewClassModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Criar Turma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
