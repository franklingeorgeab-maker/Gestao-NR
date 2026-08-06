/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  Search, 
  Plus, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Calendar, 
  User, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Save,
  Check
} from "lucide-react";
import { CRMOpportunity, Course, Instructor, CourseClass, Regional } from "../types";

interface CommercialSupportViewProps {
  opportunities: CRMOpportunity[];
  courses: Course[];
  instructors: Instructor[];
  classes: CourseClass[];
  onAddOpportunity: (opp: CRMOpportunity) => void;
  onUpdateOpportunity: (opp: CRMOpportunity) => void;
  onPromoteOpportunity: (opp: CRMOpportunity) => void; // Generates a draft class in PCP
}

export default function CommercialSupportView({
  opportunities,
  courses,
  instructors,
  classes,
  onAddOpportunity,
  onUpdateOpportunity,
  onPromoteOpportunity
}: CommercialSupportViewProps) {
  // Tabs: "Oportunidades" or "Consulta Rápida"
  const [activeTab, setActiveTab] = useState<"oportunidades" | "consulta">("oportunidades");

  // CRM Opp form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<CRMOpportunity | null>(null);

  // Form Fields
  const [formCrm, setFormCrm] = useState("");
  const [formPs, setFormPs] = useState("");
  const [formClient, setFormClient] = useState("");
  const [formCourseId, setFormCourseId] = useState("");
  const [formRegional, setFormRegional] = useState<Regional>("Oeste");
  const [formDate, setFormDate] = useState("2026-08-10");
  const [formPeriod, setFormPeriod] = useState<"Matutino" | "Vespertino" | "Noturno" | "Integral">("Matutino");
  const [formParticipants, setFormParticipants] = useState(15);
  const [formStatus, setFormStatus] = useState<"Negociação" | "Aprovado" | "Perdido">("Negociação");
  const [formObs, setFormObs] = useState("");

  // Query states
  const [queryCourseId, setQueryCourseId] = useState(courses[0]?.id || "");
  const [queryRegional, setQueryRegional] = useState<Regional>("Oeste");
  const [queryDate, setQueryDate] = useState("2026-08-10");
  const [queryPeriod, setQueryPeriod] = useState<"Matutino" | "Vespertino" | "Noturno" | "Integral">("Matutino");
  const [queryDurationDays, setQueryDurationDays] = useState(5); // Default 5 days course

  // Run availability query
  const runAvailabilityCheck = () => {
    const course = courses.find(c => c.id === queryCourseId);
    if (!course) return null;

    // 1. Identify which NR code is required
    const requiredNR = course.name.includes("NR 10") ? "NR 10" :
                       course.name.includes("SEP") ? "SEP" :
                       course.name.includes("NR 35") ? "NR 35" :
                       course.name.includes("NR 33") ? "NR 33" :
                       course.name.includes("NR 20") ? "NR 20" :
                       course.name.includes("NR 12") ? "NR 12" : "NR";

    // 2. Identify qualified instructors in this regional
    const regionalInstructors = instructors.filter(i => i.regional === queryRegional);
    const qualifiedInRegion = regionalInstructors.filter(i => 
      i.competencies.includes(requiredNR) || (requiredNR === "NR 10" && i.competencies.includes("SEP"))
    );

    // Calculate dates range
    const startDate = new Date(queryDate + "T00:00:00");
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (queryDurationDays - 1));

    const startDateStr = queryDate;
    const endDateStr = endDate.toISOString().split("T")[0];

    // 3. Find active classes on this regional & dates that could pose a conflict
    const localConflicts = classes.filter(c => {
      if (c.status === "Cancelada" || c.status === "Faturada") return false;
      if (c.regional !== queryRegional) return false;

      const classStart = new Date(c.startDate);
      const classEnd = new Date(c.endDate);
      return classStart <= endDate && classEnd >= startDate;
    });

    // 4. Map which qualified instructors are free
    const availableInstructors = qualifiedInRegion.filter(inst => {
      // Check if they are allocated to any conflicting class
      const hasConflict = classes.some(c => {
        if (c.instructorId !== inst.id) return false;
        if (c.status === "Cancelada" || c.status === "Faturada") return false;
        const classStart = new Date(c.startDate);
        const classEnd = new Date(c.endDate);
        return classStart <= endDate && classEnd >= startDate;
      });
      
      // Also check shift rules
      let shiftFine = true;
      if (queryPeriod === "Noturno" && (inst.constraints.toLowerCase().includes("apenas matutino") || inst.constraints.toLowerCase().includes("horário comercial"))) {
        shiftFine = false;
      }
      if (queryPeriod !== "Noturno" && inst.constraints.toLowerCase().includes("apenas noturno")) {
        shiftFine = false;
      }

      return !hasConflict && shiftFine;
    });

    // 5. Generate alternative suggestions
    // E.g., if no instructors are free, suggest starting 1 week later
    const alternativeStartDate = new Date(startDate);
    alternativeStartDate.setDate(startDate.getDate() + 7);
    const altStartStr = alternativeStartDate.toISOString().split("T")[0];

    const altEndDate = new Date(alternativeStartDate);
    altEndDate.setDate(alternativeStartDate.getDate() + (queryDurationDays - 1));
    const altEndStr = altEndDate.toISOString().split("T")[0];

    return {
      requiredNR,
      startDateStr,
      endDateStr,
      qualifiedCount: qualifiedInRegion.length,
      availableInstructors,
      conflictingClasses: localConflicts,
      alternativeDates: {
        start: altStartStr,
        end: altEndStr
      }
    };
  };

  const queryResult = runAvailabilityCheck();

  // Save CRM opportunity
  const handleSaveOpp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCrm || !formPs || !formClient || !formCourseId) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const oppData: CRMOpportunity = {
      id: editingOpp ? editingOpp.id : `opp-${Date.now()}`,
      crmNumber: formCrm,
      psNumber: formPs,
      clientName: formClient,
      courseId: formCourseId,
      regional: formRegional,
      desiredDate: formDate,
      period: formPeriod,
      participants: Number(formParticipants),
      status: formStatus,
      observations: formObs
    };

    if (editingOpp) {
      onUpdateOpportunity(oppData);
    } else {
      onAddOpportunity(oppData);
    }
    setIsFormOpen(false);
  };

  const handleOpenOppForm = (opp?: CRMOpportunity) => {
    if (opp) {
      setEditingOpp(opp);
      setFormCrm(opp.crmNumber);
      setFormPs(opp.psNumber);
      setFormClient(opp.clientName);
      setFormCourseId(opp.courseId);
      setFormRegional(opp.regional);
      setFormDate(opp.desiredDate);
      setFormPeriod(opp.period);
      setFormParticipants(opp.participants);
      setFormStatus(opp.status);
      setFormObs(opp.observations || "");
    } else {
      setEditingOpp(null);
      setFormCrm(`CRM-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      setFormPs(`PS-2026-${Math.floor(100 + Math.random() * 900)}`);
      setFormClient("");
      setFormCourseId(courses[0]?.id || "");
      setFormRegional("Oeste");
      setFormDate("2026-08-10");
      setFormPeriod("Matutino");
      setFormParticipants(15);
      setFormStatus("Negociação");
      setFormObs("");
    }
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header section with instructions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Apoio ao Comercial</h2>
          <p className="text-sm text-slate-500">
            Evite retrabalho: verifique previamente a disponibilidade de instrutores antes de fechar propostas com clientes.
          </p>
        </div>

        <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("oportunidades")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "oportunidades"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            💼 Oportunidades CRM / PS
          </button>
          <button
            onClick={() => setActiveTab("consulta")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === "consulta"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            🔍 Consulta Rápida
          </button>
        </div>
      </div>

      {/* WARNING BANNER about official role confirmation */}
      <div className="bg-blue-50/50 border border-blue-200 p-4 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-800 leading-relaxed">
          <span className="font-bold">Aviso Importante:</span> Esta consulta rápida serve apenas como <span className="font-semibold">apoio durante a negociação comercial</span>. A confirmação definitiva de turmas, salas e alocação final de instrutores continuará sendo realizada formalmente pelo PCP ou pelo Supervisor Operacional através do sistema institucional.
        </div>
      </div>

      {/* Opportunities Tab */}
      {activeTab === "oportunidades" && (
        <div className="space-y-4">
          
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Oportunidades Comerciais Ativas</h3>
            <button
              onClick={() => handleOpenOppForm()}
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Nova Oportunidade
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunities.map(opp => {
              const course = courses.find(c => c.id === opp.courseId);
              return (
                <div key={opp.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 font-bold font-mono">
                          {opp.crmNumber} | {opp.psNumber}
                        </span>
                        <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 leading-tight">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {opp.clientName}
                        </h4>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                        opp.status === "Aprovado" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        opp.status === "Perdido" ? "bg-rose-50 text-rose-700 border border-rose-100" :
                        "bg-amber-50 text-amber-700 border border-amber-100 animate-pulse"
                      }`}>
                        {opp.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <p className="font-bold text-slate-700 truncate">
                        📚 {course ? `[SGN ${course.codeSGN}] ${course.name}` : "Curso não encontrado"}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-200 mt-1">
                        <div>
                          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Regional</p>
                          <p className="font-medium text-slate-700">{opp.regional}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Previsão Data</p>
                          <p className="font-medium text-slate-700">
                            {opp.desiredDate.split("-")[2]}/{opp.desiredDate.split("-")[1]}/{opp.desiredDate.split("-")[0]}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Turno</p>
                          <p className="font-medium text-slate-700">{opp.period}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Alunos Previstos</p>
                          <p className="font-medium text-slate-700">{opp.participants} participantes</p>
                        </div>
                      </div>
                    </div>

                    {opp.observations && (
                      <p className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded italic">
                        &ldquo;{opp.observations}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenOppForm(opp)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      Editar Dados
                    </button>

                    {opp.status === "Aprovado" && (
                      <button
                        onClick={() => {
                          if (confirm(`Deseja criar uma rascunho de Pré-Turma operacional no PCP a partir desta oportunidade aprovada para o cliente ${opp.clientName}?`)) {
                            onPromoteOpportunity(opp);
                          }
                        }}
                        className="flex items-center gap-1 text-[10px] bg-emerald-600 text-white font-semibold px-2 py-1 rounded hover:bg-emerald-700 transition-colors shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                        Criar Pré-Turma
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Availability Query Tab */}
      {activeTab === "consulta" && queryResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Query Settings Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 self-start">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Simular Negociação de Data
            </h3>

            <div className="space-y-3.5 text-xs">
              {/* Course */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Treinamento Solicitado</label>
                <select
                  value={queryCourseId}
                  onChange={(e) => setQueryCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      SGN {course.codeSGN} • {course.name} ({course.duration}h)
                    </option>
                  ))}
                </select>
              </div>

              {/* Regional */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Regional do Cliente</label>
                <select
                  value={queryRegional}
                  onChange={(e) => setQueryRegional(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
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

              {/* Date */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Data de Início Proposta</label>
                <input
                  type="date"
                  value={queryDate}
                  onChange={(e) => setQueryDate(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-xs font-medium"
                />
              </div>

              {/* Period */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Período / Turno</label>
                <select
                  value={queryPeriod}
                  onChange={(e) => setQueryPeriod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
                >
                  <option value="Matutino">Matutino (Manhã)</option>
                  <option value="Vespertino">Vespertino (Tarde)</option>
                  <option value="Noturno">Noturno (Noite)</option>
                  <option value="Integral">Integral (Manhã + Tarde)</option>
                </select>
              </div>

              {/* Course Duration approximation in days */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Duração Estimada (Dias Consecutivos)</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={queryDurationDays}
                  onChange={(e) => setQueryDurationDays(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Query Results Panel */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Summary Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                Resultado do Cruzamento de Disponibilidade
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 font-medium">
                  <p className="text-slate-500">Período Proposto: <span className="font-bold text-slate-700">{queryResult.startDateStr} a {queryResult.endDateStr}</span></p>
                  <p className="text-slate-500 flex items-center gap-1">Requisito do Treinamento: <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-full text-[10px] border border-blue-100">{queryResult.requiredNR}</span></p>
                  <p className="text-slate-500">Instrutores Credenciados na Regional: <span className="font-bold text-slate-700">{queryResult.qualifiedCount}</span></p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Geral Comercial</p>
                  {queryResult.availableInstructors.length > 0 ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-extrabold text-sm mt-1 animate-fade-in">
                      <CheckCircle className="w-5 h-5 animate-pulse" />
                      <span>Viável para Negociação!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-rose-600 font-extrabold text-sm mt-1">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Alerta: Risco de Conflito</span>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">
                    {queryResult.availableInstructors.length} instrutor(es) disponível(is) na regional.
                  </p>
                </div>
              </div>
            </div>

            {/* List of Available Instructors for this deal */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Instrutores Locais Compatíveis para Negociar ({queryResult.availableInstructors.length})
              </h4>

              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {queryResult.availableInstructors.map(inst => (
                  <div key={inst.id} className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{inst.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">📞 {inst.contact}</p>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                      <Check className="w-3.5 h-3.5" /> Disponível
                    </span>
                  </div>
                ))}

                {queryResult.availableInstructors.length === 0 && (
                  <p className="text-xs text-rose-500 italic text-center py-4 bg-rose-50 rounded-xl border border-rose-100 font-medium">
                    Nenhum instrutor credenciado disponível nesta regional e datas. Negociar data alternativa!
                  </p>
                )}
              </div>
            </div>

            {/* Local Conflicts (existing classes) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Outras Turmas no Período nesta Regional ({queryResult.conflictingClasses.length})
              </h4>

              <div className="space-y-2">
                {queryResult.conflictingClasses.map(c => {
                  const course = courses.find(co => co.id === c.courseId);
                  const inst = instructors.find(i => i.id === c.instructorId);
                  return (
                    <div key={c.id} className="p-3 bg-amber-50/40 border border-amber-200/50 rounded-xl flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800">{course ? `[SGN ${course.codeSGN}] ${course.name}` : "Curso"}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Cliente: {c.clientName} | {c.startDate} a {c.endDate}</p>
                      </div>
                      <div className="text-right text-[10px] text-slate-500 font-medium">
                        <p>👤 {inst ? inst.name : "Não alocado"}</p>
                        <p className="font-semibold text-amber-700 mt-0.5">{c.status}</p>
                      </div>
                    </div>
                  );
                })}

                {queryResult.conflictingClasses.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-2">
                    Nenhuma outra turma ativa agendada na regional nestas datas.
                  </p>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
              <TrendingUp className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-slate-800">Datas Alternativas Recomendadas para Proposta:</p>
                <p className="leading-relaxed font-medium">
                  Para obter maior flexibilidade operacional e facilidade de escala do PCP, sugira ao cliente iniciar o curso uma semana depois: <span className="font-semibold text-blue-700">{queryResult.alternativeDates.start} a {queryResult.alternativeDates.end}</span>.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* CRM Opportunity Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in-50 duration-200">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">
                {editingOpp ? "Editar Oportunidade Comercial" : "Nova Oportunidade CRM / PS"}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveOpp} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* CRM Number */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Código N° CRM *</label>
                  <input
                    type="text"
                    required
                    value={formCrm}
                    onChange={(e) => setFormCrm(e.target.value)}
                    placeholder="Ex: CRM-2026-1502"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* PS Number */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">N° Proposta de Serviço (PS) *</label>
                  <input
                    type="text"
                    required
                    value={formPs}
                    onChange={(e) => setFormPs(e.target.value)}
                    placeholder="Ex: PS-2026-894"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Client Name */}
                <div className="col-span-2 space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Razão Social do Cliente (PJ) *</label>
                  <input
                    type="text"
                    required
                    value={formClient}
                    onChange={(e) => setFormClient(e.target.value)}
                    placeholder="Ex: WEG Equipamentos S/A"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Course Selection */}
                <div className="col-span-2 space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Treinamento Solicitado *</label>
                  <select
                    value={formCourseId}
                    onChange={(e) => setFormCourseId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Selecione o curso...</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        SGN {course.codeSGN} • {course.name} ({course.duration}h)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Regional */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Regional de Atendimento</label>
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

                {/* Desired Date */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Previsão de Data</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Period */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Período</label>
                  <select
                    value={formPeriod}
                    onChange={(e) => setFormPeriod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Noturno">Noturno</option>
                    <option value="Integral">Integral</option>
                  </select>
                </div>

                {/* Participants */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Alunos Estimados</label>
                  <input
                    type="number"
                    value={formParticipants}
                    onChange={(e) => setFormParticipants(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Status Comercial</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="Negociação">Em Negociação</option>
                    <option value="Aprovado">Aprovado (Venda Fechada)</option>
                    <option value="Perdido">Perdido</option>
                  </select>
                </div>

                {/* Obs */}
                <div className="col-span-2 space-y-1 text-xs">
                  <label className="font-semibold text-slate-600">Notas Comerciais</label>
                  <textarea
                    value={formObs}
                    onChange={(e) => setFormObs(e.target.value)}
                    placeholder="Informações adicionais da negociação ou necessidades específicas do cliente..."
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-xs resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
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
