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
  Check,
  Lock,
  ShieldAlert,
  Brain,
  Filter,
  Sparkles
} from "lucide-react";
import { CRMOpportunity, Course, Instructor, CourseClass, Regional, ClientCompany, SystemHoliday } from "../types";

interface CommercialSupportViewProps {
  opportunities: CRMOpportunity[];
  courses: Course[];
  instructors: Instructor[];
  classes: CourseClass[];
  clients?: ClientCompany[];
  holidays?: SystemHoliday[];
  onAddOpportunity: (opp: CRMOpportunity) => void;
  onUpdateOpportunity: (opp: CRMOpportunity) => void;
  onPromoteOpportunity: (opp: CRMOpportunity) => void; // Generates a draft class in PCP
}

export default function CommercialSupportView({
  opportunities,
  courses,
  instructors,
  classes,
  clients = [],
  holidays = [],
  onAddOpportunity,
  onUpdateOpportunity,
  onPromoteOpportunity
}: CommercialSupportViewProps) {
  // Tabs: "oportunidades", "filtro_inteligente" or "nova_oportunidade"
  const [activeTab, setActiveTab] = useState<"oportunidades" | "filtro_inteligente" | "nova_oportunidade">("oportunidades");

  // Client Unified Search State
  const [clientQuery, setClientQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientCompany | null>(null);

  // CRM Opp form state
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

  // Helper to compute proportional daily hours distribution
  const calculateDefaultDailyDistribution = (duration: number, period: string): number[] => {
    const maxPerDay = period === "Integral" ? 8 : 4;
    if (duration <= maxPerDay) {
      return [duration];
    }
    const days = Math.floor(duration / maxPerDay);
    const remainder = duration % maxPerDay;
    const result: number[] = Array(days).fill(maxPerDay);
    if (remainder > 0) {
      result.push(remainder);
    }
    return result;
  };

  // Helper for 2026 Holidays and Special Days
  const HOLIDAYS_2026: Record<string, string> = {
    "01-01": "Confraternização Universal",
    "02-17": "Carnaval",
    "04-03": "Sexta-feira Santa",
    "04-21": "Tiradentes",
    "05-01": "Dia do Trabalho",
    "06-04": "Corpus Christi",
    "08-11": "Dia do Estado / SC",
    "09-07": "Independência do Brasil",
    "10-12": "Nossa Senhora Aparecida",
    "11-02": "Finados",
    "11-15": "Proclamação da República",
    "11-20": "Dia da Consciência Negra",
    "12-25": "Natal"
  };

  const getDayOfWeekName = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length < 3) return "";
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const dt = new Date(y, m, d);
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return days[dt.getDay()] || "";
  };

  const checkSpecialDay = (dateStr: string) => {
    if (!dateStr) return { isSpecial: false, isSunday: false, isHoliday: false, label: "", holidayName: "" };
    const parts = dateStr.split("-");
    if (parts.length < 3) return { isSpecial: false, isSunday: false, isHoliday: false, label: "", holidayName: "" };

    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const dt = new Date(y, m, d);

    const dayOfWeek = dt.getDay();
    const isSunday = dayOfWeek === 0;

    const mmdd = `${parts[1]}-${parts[2]}`;
    let holidayName = HOLIDAYS_2026[mmdd] || "";

    if (holidays && holidays.length > 0) {
      const found = holidays.find(h => h.date === dateStr || h.date.endsWith(mmdd));
      if (found) {
        holidayName = found.name + (found.type === "Local" ? ` [${found.city || found.regional}]` : "");
      }
    }

    const isHoliday = !!holidayName;

    let label = "";
    if (isSunday && isHoliday) {
      label = `Domingo e Feriado (${holidayName})`;
    } else if (isSunday) {
      label = "Domingo";
    } else if (isHoliday) {
      label = `Feriado (${holidayName})`;
    }

    return {
      isSpecial: isSunday || isHoliday,
      isSunday,
      isHoliday,
      holidayName,
      label
    };
  };

  // Query states
  const [queryCourseId, setQueryCourseId] = useState(courses[0]?.id || "");
  const [queryRegional, setQueryRegional] = useState<Regional>("Oeste");
  const [queryDate, setQueryDate] = useState("2026-08-10");
  const [queryPeriod, setQueryPeriod] = useState<"Matutino" | "Vespertino" | "Noturno" | "Integral">("Matutino");
  
  // Custom Day Schedule array for simulation (each item has id, date YYYY-MM-DD, hours)
  interface CustomDayScheduleItem {
    id: string;
    date: string;
    hours: number;
  }

  const [dailyScheduleState, setDailyScheduleState] = useState<CustomDayScheduleItem[]>(() => {
    const duration = courses[0]?.duration || 8;
    const initialDate = "2026-08-10";
    const dist = calculateDefaultDailyDistribution(duration, "Matutino");
    return dist.map((hrs, idx) => {
      const d = new Date(initialDate + "T00:00:00");
      d.setDate(d.getDate() + idx);
      return {
        id: Math.random().toString(36).substring(2, 9),
        date: d.toISOString().split("T")[0],
        hours: hrs
      };
    });
  });

  // Coordination/Supervision Approval toggle for Sunday/Holiday
  const [coordApproval, setCoordApproval] = useState<boolean>(false);

  const handleCourseChange = (newCourseId: string) => {
    setQueryCourseId(newCourseId);
    const crs = courses.find(c => c.id === newCourseId);
    if (crs) {
      const dist = calculateDefaultDailyDistribution(crs.duration, queryPeriod);
      setDailyScheduleState(dist.map((hrs, idx) => {
        const d = new Date(queryDate + "T00:00:00");
        d.setDate(d.getDate() + idx);
        return {
          id: Math.random().toString(36).substring(2, 9),
          date: d.toISOString().split("T")[0],
          hours: hrs
        };
      }));
    }
  };

  const handlePeriodChange = (newPeriod: "Matutino" | "Vespertino" | "Noturno" | "Integral") => {
    setQueryPeriod(newPeriod);
    const crs = courses.find(c => c.id === queryCourseId);
    if (crs) {
      const dist = calculateDefaultDailyDistribution(crs.duration, newPeriod);
      setDailyScheduleState(dist.map((hrs, idx) => {
        const d = new Date(queryDate + "T00:00:00");
        d.setDate(d.getDate() + idx);
        return {
          id: Math.random().toString(36).substring(2, 9),
          date: d.toISOString().split("T")[0],
          hours: hrs
        };
      }));
    }
  };

  const handleStartDateChange = (newStartDate: string) => {
    setQueryDate(newStartDate);
    const baseDate = new Date(newStartDate + "T00:00:00");
    if (isNaN(baseDate.getTime())) return;

    setDailyScheduleState(prev => prev.map((item, idx) => {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + idx);
      return {
        ...item,
        date: d.toISOString().split("T")[0]
      };
    }));
  };

  const handleItemDateChange = (index: number, newDate: string) => {
    setDailyScheduleState(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], date: newDate };
      return updated;
    });
  };

  const handleItemHoursChange = (index: number, val: number) => {
    setDailyScheduleState(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], hours: Math.max(0, val) };
      return updated;
    });
  };

  const handleAddDay = () => {
    const crs = courses.find(c => c.id === queryCourseId);
    const targetDuration = crs?.duration || 8;
    const currentSum = dailyScheduleState.reduce((a, b) => a + Number(b.hours || 0), 0);
    const remaining = Math.max(0, targetDuration - currentSum);
    const maxPerDay = queryPeriod === "Integral" ? 8 : 4;
    const defaultVal = remaining > 0 ? Math.min(remaining, maxPerDay) : 0;

    const lastItem = dailyScheduleState[dailyScheduleState.length - 1];
    let nextDateStr = queryDate;
    if (lastItem && lastItem.date) {
      const d = new Date(lastItem.date + "T00:00:00");
      d.setDate(d.getDate() + 1);
      nextDateStr = d.toISOString().split("T")[0];
    }

    setDailyScheduleState(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        date: nextDateStr,
        hours: defaultVal
      }
    ]);
  };

  const handleRemoveDay = (index: number) => {
    if (dailyScheduleState.length <= 1) return;
    setDailyScheduleState(prev => prev.filter((_, i) => i !== index));
  };

  const handleResetDistribution = (mode: "auto" | "8h" | "4h") => {
    const crs = courses.find(c => c.id === queryCourseId);
    if (!crs) return;
    let dist: number[];
    if (mode === "auto") {
      dist = calculateDefaultDailyDistribution(crs.duration, queryPeriod);
    } else if (mode === "8h") {
      dist = calculateDefaultDailyDistribution(crs.duration, "Integral");
    } else {
      dist = calculateDefaultDailyDistribution(crs.duration, "Matutino");
    }
    setDailyScheduleState(dist.map((hrs, idx) => {
      const d = new Date(queryDate + "T00:00:00");
      d.setDate(d.getDate() + idx);
      return {
        id: Math.random().toString(36).substring(2, 9),
        date: d.toISOString().split("T")[0],
        hours: hrs
      };
    }));
  };

  // Run availability query
  const runAvailabilityCheck = () => {
    const course = courses.find(c => c.id === queryCourseId);
    if (!course) return null;

    const durationDays = Math.max(1, dailyScheduleState.length);
    const sumAllocatedHours = dailyScheduleState.reduce((acc, item) => acc + (Number(item.hours) || 0), 0);
    const isExceeded = sumAllocatedHours > course.duration;
    const isIncomplete = sumAllocatedHours < course.duration;
    const isExact = sumAllocatedHours === course.duration;

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

    // Active scheduled dates with > 0 hours
    const activeDays = dailyScheduleState.filter(d => Number(d.hours) > 0);
    const activeDatesList = activeDays.map(d => d.date).filter(Boolean).sort();
    const startDateStr = activeDatesList[0] || queryDate;
    const endDateStr = activeDatesList[activeDatesList.length - 1] || queryDate;

    let hasSundayOrHoliday = false;
    const specialDaysLabels: string[] = [];

    const dailySchedule = dailyScheduleState.map((item, idx) => {
      const specialInfo = checkSpecialDay(item.date);
      if (specialInfo.isSpecial && Number(item.hours) > 0) {
        hasSundayOrHoliday = true;
        if (specialInfo.label && !specialDaysLabels.includes(specialInfo.label)) {
          specialDaysLabels.push(specialInfo.label);
        }
      }

      const dayName = getDayOfWeekName(item.date);
      const dateFormatted = item.date ? `${item.date.split("-")[2]}/${item.date.split("-")[1]}` : "";

      return {
        dayIndex: idx + 1,
        date: item.date,
        dateFormatted,
        dayName,
        hours: Number(item.hours || 0),
        isSpecial: specialInfo.isSpecial,
        isSunday: specialInfo.isSunday,
        isHoliday: specialInfo.isHoliday,
        specialLabel: specialInfo.label
      };
    });

    const isBlockedBySpecialDay = hasSundayOrHoliday && !coordApproval;

    // 3. Find active classes on this regional & dates that could pose a conflict
    const localConflicts = classes.filter(c => {
      if (c.status === "Cancelada" || c.status === "Faturada") return false;
      if (c.regional !== queryRegional) return false;

      // Check if class overlaps with any scheduled date
      return activeDatesList.some(dateStr => dateStr >= c.startDate && dateStr <= c.endDate);
    });

    // 4. Map which qualified instructors are free on these specific dates
    const availableInstructors = qualifiedInRegion.filter(inst => {
      const hasConflict = classes.some(c => {
        if (c.instructorId !== inst.id) return false;
        if (c.status === "Cancelada" || c.status === "Faturada") return false;
        return activeDatesList.some(dateStr => dateStr >= c.startDate && dateStr <= c.endDate);
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
    const alternativeStartDate = new Date(startDateStr + "T00:00:00");
    alternativeStartDate.setDate(alternativeStartDate.getDate() + 7);
    const altStartStr = alternativeStartDate.toISOString().split("T")[0];

    const alternativeEndDate = new Date(endDateStr + "T00:00:00");
    alternativeEndDate.setDate(alternativeEndDate.getDate() + 7);
    const altEndStr = alternativeEndDate.toISOString().split("T")[0];

    return {
      requiredNR,
      startDateStr,
      endDateStr,
      durationDays,
      dailySchedule,
      sumAllocatedHours,
      totalCourseHours: course.duration,
      isExceeded,
      isIncomplete,
      isExact,
      hasSundayOrHoliday,
      specialDaysSummary: specialDaysLabels.join(", "),
      isBlockedBySpecialDay,
      coordApproval,
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
    setEditingOpp(null);
    setActiveTab("oportunidades");
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
    setActiveTab("nova_oportunidade");
  };

  return (
    <div className="space-y-6">
      {/* Header Bar with 3 Main Tabs */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Apoio ao Comercial
            </h2>
            <p className="text-xs text-slate-500">
              Gestão de propostas comerciais, filtro inteligente de negociação de datas e acompanhamento de clientes.
            </p>
          </div>
        </div>

        {/* THREE MAIN TABS */}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
          {/* Tab 1: Listagem das Oportunidades */}
          <button
            onClick={() => setActiveTab("oportunidades")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
              activeTab === "oportunidades"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Listagem das Oportunidades</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === "oportunidades" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
            }`}>
              {opportunities.length}
            </span>
          </button>

          {/* Tab 2: Filtro Inteligente (Ícone de Cérebro 🧠) */}
          <button
            onClick={() => setActiveTab("filtro_inteligente")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
              activeTab === "filtro_inteligente"
                ? "bg-amber-500 text-slate-950 shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Brain className="w-4.5 h-4.5 text-slate-950" />
            <span>Filtro Inteligente</span>
          </button>

          {/* Tab 3: Nova Oportunidade */}
          <button
            onClick={() => {
              handleOpenOppForm();
              setActiveTab("nova_oportunidade");
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
              activeTab === "nova_oportunidade"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Nova Oportunidade</span>
          </button>
        </div>
      </div>

      {/* ABA 1: LISTAGEM DAS OPORTUNIDADES */}
      {activeTab === "oportunidades" && (
        <div className="space-y-6">
          {/* Caixa de Texto em que pesquisa pelo nome da empresa */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={clientQuery}
                onChange={(e) => {
                  setClientQuery(e.target.value);
                  if (selectedClient && !e.target.value.toLowerCase().includes(selectedClient.name.toLowerCase())) {
                    setSelectedClient(null);
                  }
                }}
                placeholder="Pesquisar por nome da empresa ou código CRM / PS..."
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border-2 border-slate-200 focus:border-blue-600 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-none transition-all"
              />
              {clientQuery && (
                <button
                  onClick={() => {
                    setClientQuery("");
                    setSelectedClient(null);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => {
                handleOpenOppForm();
                setActiveTab("nova_oportunidade");
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Oportunidade</span>
            </button>
          </div>

          {/* PESQUISA INTELIGENTE CLIENTE 360º RESULTS */}
          {(() => {
        const queryLower = clientQuery.trim().toLowerCase();
        const matchingClients = (clients || []).filter(c => 
          c.name.toLowerCase().includes(queryLower) ||
          c.cnpj.replace(/\D/g, "").includes(queryLower.replace(/\D/g, "")) ||
          c.cnpj.includes(queryLower) ||
          c.contactName.toLowerCase().includes(queryLower)
        );

        const targetClient = selectedClient || (queryLower !== "" ? matchingClients[0] : null);

        if (!targetClient && queryLower === "") return null;

        // Filtered opportunities for this client or query
        const clientOpps = targetClient ? opportunities.filter(o => 
          o.clientName.toLowerCase().includes(targetClient.name.toLowerCase()) ||
          targetClient.name.toLowerCase().includes(o.clientName.toLowerCase())
        ) : opportunities.filter(o =>
          o.clientName.toLowerCase().includes(queryLower) ||
          o.crmNumber.toLowerCase().includes(queryLower) ||
          o.psNumber.toLowerCase().includes(queryLower)
        );

        // Active classes
        const activeClasses = targetClient ? classes.filter(c => 
          c.clientName && (
            c.clientName.toLowerCase().includes(targetClient.name.toLowerCase()) ||
            targetClient.name.toLowerCase().includes(c.clientName.toLowerCase())
          ) && (c.status === "Pendente" || c.status === "Confirmada" || c.status === "Em Andamento")
        ) : [];

        // Completed classes
        const completedClasses = targetClient ? classes.filter(c => 
          c.clientName && (
            c.clientName.toLowerCase().includes(targetClient.name.toLowerCase()) ||
            targetClient.name.toLowerCase().includes(c.clientName.toLowerCase())
          ) && (c.status === "Realizada" || c.status === "Faturada")
        ) : [];

        if (targetClient) {
          return (
            <div className="space-y-6 bg-slate-50/50 p-4 rounded-2xl border border-blue-100">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-extrabold flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  Resultado da Pesquisa Inteligente 360º
                </span>
                <button
                  onClick={() => {
                    setSelectedClient(null);
                    setClientQuery("");
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
                >
                  Fechar Painel do Cliente
                </button>
              </div>

              {/* Target Client Detailed Ficha 360 */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-md uppercase">
                        Cliente Corporativo
                      </span>
                      <span className="text-xs text-slate-400 font-mono font-bold">
                        CNPJ: {targetClient.cnpj}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white mt-1">{targetClient.name}</h3>
                    <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                      <User className="w-3.5 h-3.5 text-blue-400" /> Responsável SST/RH: <strong className="text-white">{targetClient.contactName}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setFormClient(targetClient.name);
                      setFormRegional(targetClient.regional);
                      handleOpenOppForm();
                    }}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nova Proposta CRM para este Cliente</span>
                  </button>
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">E-mail de Contato</p>
                    <p className="font-bold text-white mt-0.5 truncate">{targetClient.email}</p>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Telefone / WhatsApp</p>
                    <p className="font-bold text-white mt-0.5">{targetClient.phone}</p>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Regional & Cidade</p>
                    <p className="font-bold text-white mt-0.5">{targetClient.city} ({targetClient.regional})</p>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Observações Comerciais</p>
                    <p className="font-medium text-slate-300 mt-0.5 text-[11px] truncate">{targetClient.notes || "Sem observações"}</p>
                  </div>
                </div>
              </div>

              {/* 1. Cursos Oferecidos (Propostas CRM) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    1. Cursos Oferecidos & Propostas em Negociação ({clientOpps.length})
                  </h4>
                </div>

                {clientOpps.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clientOpps.map(opp => {
                      const course = courses.find(c => c.id === opp.courseId);
                      return (
                        <div key={opp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-slate-400">{opp.crmNumber} | {opp.psNumber}</span>
                              <h5 className="font-extrabold text-slate-900 text-xs mt-0.5">{course?.name || opp.courseId}</h5>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              opp.status === "Aprovado" ? "bg-emerald-100 text-emerald-800" :
                              opp.status === "Negociação" ? "bg-amber-100 text-amber-800" :
                              "bg-rose-100 text-rose-800"
                            }`}>
                              {opp.status}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 space-y-1">
                            <p><strong>Data Pretendida:</strong> {opp.desiredDate} ({opp.period})</p>
                            <p><strong>Participantes:</strong> {opp.participants} alunos</p>
                            <p><strong>Valor Estimado:</strong> R$ {(opp.participants * 250).toLocaleString("pt-BR")}</p>
                          </div>

                          {opp.status === "Aprovado" && (
                            <button
                              onClick={() => {
                                if (confirm(`Promover esta proposta comercial aprovada para rascunho de turma no PCP?`)) {
                                  onPromoteOpportunity(opp);
                                }
                              }}
                              className="w-full py-1.5 bg-emerald-600 text-white font-extrabold text-xs rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" /> Enviar para PCP Operacional
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    Nenhuma proposta de curso registrada no funil comercial para esta empresa até o momento.
                  </p>
                )}
              </div>

              {/* 2. Cursos Ativos / Agendados */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    2. Cursos Ativos & Agendados ({activeClasses.length})
                  </h4>
                </div>

                {activeClasses.length > 0 ? (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2.5">Código Turma</th>
                          <th className="px-4 py-2.5">Curso</th>
                          <th className="px-4 py-2.5">Período / Datas</th>
                          <th className="px-4 py-2.5">Cidade</th>
                          <th className="px-4 py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeClasses.map(cls => {
                          const course = courses.find(c => c.id === cls.courseId);
                          return (
                            <tr key={cls.id} className="hover:bg-slate-50">
                              <td className="px-4 py-3 font-mono font-bold text-slate-900">{cls.id}</td>
                              <td className="px-4 py-3 font-bold text-slate-800">{course?.name || cls.courseId}</td>
                              <td className="px-4 py-3 font-medium text-slate-700">{cls.startDate} a {cls.endDate} ({cls.period})</td>
                              <td className="px-4 py-3 text-slate-600">{cls.city}</td>
                              <td className="px-4 py-3">
                                <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full font-extrabold text-[10px] uppercase">
                                  {cls.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    Nenhuma turma ativa ou agendada no momento para esta empresa.
                  </p>
                )}
              </div>

              {/* 3. Cursos Já Concluídos / Histórico */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    3. Cursos Já Concluídos & Faturados ({completedClasses.length})
                  </h4>
                </div>

                {completedClasses.length > 0 ? (
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2.5">Código Turma</th>
                          <th className="px-4 py-2.5">Curso Realizado</th>
                          <th className="px-4 py-2.5">Data Conclusão</th>
                          <th className="px-4 py-2.5">Chamado / Faturamento</th>
                          <th className="px-4 py-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {completedClasses.map(cls => {
                          const course = courses.find(c => c.id === cls.courseId);
                          return (
                            <tr key={cls.id} className="hover:bg-slate-50">
                              <td className="px-4 py-3 font-mono font-bold text-slate-900">{cls.id}</td>
                              <td className="px-4 py-3 font-bold text-slate-800">{course?.name || cls.courseId}</td>
                              <td className="px-4 py-3 font-medium text-slate-700">{cls.endDate}</td>
                              <td className="px-4 py-3 font-mono text-slate-600">{cls.billingCallNumber || "CHM-88421"}</td>
                              <td className="px-4 py-3">
                                <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full font-extrabold text-[10px] uppercase">
                                  Concluída / Faturada
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                    Nenhum histórico de curso concluído anteriormente para esta empresa.
                  </p>
                )}
              </div>
            </div>
          );
        } else if (queryLower !== "") {
          return (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
              Nenhum cliente ou CNPJ encontrado para &ldquo;<strong>{clientQuery}</strong>&rdquo;. Tente pesquisar por outro termo.
            </div>
          );
        }
        return null;
      })()}

      {/* OPORTUNIDADES CRM ATIVAS (FUNIL COMERCIAL) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Oportunidades Comerciais CRM Ativas
          </h3>
          <button
            onClick={() => handleOpenOppForm()}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nova Oportunidade
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities
            .filter(opp => {
              if (!clientQuery) return true;
              const q = clientQuery.toLowerCase();
              return (
                opp.clientName.toLowerCase().includes(q) ||
                opp.crmNumber.toLowerCase().includes(q) ||
                opp.psNumber.toLowerCase().includes(q)
              );
            })
            .map(opp => {
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
                        📚 {course?.name}
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
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
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
                        className="flex items-center gap-1 text-[10px] bg-emerald-600 text-white font-semibold px-2 py-1 rounded hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
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
    </div>
  )}

      {/* ABA 2: FILTRO INTELIGENTE (ÍCONE DE CÉREBRO 🧠) */}
      {activeTab === "filtro_inteligente" && (
        <div className="space-y-6">
          {/* Header Banner do Filtro Inteligente */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 rounded-2xl text-white border border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-xs">
                <Brain className="w-7 h-7 text-slate-950" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  Filtro Inteligente & Simulador de Negociação de Datas
                </h3>
                <p className="text-xs text-slate-300">
                  Pesquisa cruzada de empresas, simulação de datas com validação de feriados, domingos e instrutores habilitados na regional.
                </p>
              </div>
            </div>
          </div>

          {/* SIMULADOR DE DISPONIBILIDADE E CONSULTA RÁPIDA */}
          {queryResult && (
            <div id="simulador-negociacao" className="grid grid-cols-1 lg:grid-cols-3 gap-6 scroll-mt-6">
          
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
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.duration}h)
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
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 text-xs font-medium"
                />
              </div>

              {/* Period */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Período / Turno</label>
                <select
                  value={queryPeriod}
                  onChange={(e) => handlePeriodChange(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-slate-700 font-medium"
                >
                  <option value="Matutino">Matutino (Manhã - 4h/dia)</option>
                  <option value="Vespertino">Vespertino (Tarde - 4h/dia)</option>
                  <option value="Noturno">Noturno (Noite - 4h/dia)</option>
                  <option value="Integral">Integral (Manhã + Tarde - 8h/dia)</option>
                </select>
              </div>

              {/* Daily Hours & Custom Dates Distribution Panel */}
              {(() => {
                const currentCourse = courses.find(c => c.id === queryCourseId);
                const targetHours = currentCourse?.duration || 8;
                const sumAllocated = dailyScheduleState.reduce((acc, item) => acc + Number(item.hours || 0), 0);
                const isExceeded = sumAllocated > targetHours;
                const isIncomplete = sumAllocated < targetHours;
                const isExact = sumAllocated === targetHours;

                return (
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 flex items-center gap-1">
                        ⏱️ Distribuição de Datas e Carga Horária
                      </label>
                      <span className="text-[10px] font-bold text-slate-400">
                        Total Curso: {targetHours}h
                      </span>
                    </div>

                    {/* Status badge */}
                    <div className="flex items-center justify-between text-[11px]">
                      {isExceeded && (
                        <span className="px-2 py-1 bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-200 flex items-center gap-1 w-full justify-between">
                          <span>🚨 Trava: Excesso de {sumAllocated - targetHours}h!</span>
                          <span>{sumAllocated}h / {targetHours}h</span>
                        </span>
                      )}
                      {isIncomplete && (
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 font-bold rounded-lg border border-amber-200 flex items-center gap-1 w-full justify-between">
                          <span>⚠️ Faltam {targetHours - sumAllocated}h para completar</span>
                          <span>{sumAllocated}h / {targetHours}h</span>
                        </span>
                      )}
                      {isExact && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 flex items-center gap-1 w-full justify-between">
                          <span>✅ Carga horária 100% alocada</span>
                          <span>{sumAllocated}h / {targetHours}h</span>
                        </span>
                      )}
                    </div>

                    {/* Preset buttons */}
                    <div className="flex items-center gap-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => handleResetDistribution("auto")}
                        className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded-lg border border-blue-200 transition-colors"
                        title="Distribuir automaticamente com base na carga horária e turno"
                      >
                        ⚡ Recalcular Auto
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResetDistribution("8h")}
                        className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold rounded-lg border border-slate-200 transition-colors"
                      >
                        8h/dia
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResetDistribution("4h")}
                        className="px-2 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold rounded-lg border border-slate-200 transition-colors"
                      >
                        4h/dia
                      </button>
                    </div>

                    {/* List of days with editable date and hours input */}
                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                      {dailyScheduleState.map((item, idx) => {
                        const dayName = getDayOfWeekName(item.date);
                        const specialInfo = checkSpecialDay(item.date);

                        return (
                          <div
                            key={item.id || idx}
                            className={`p-2 rounded-xl border text-xs space-y-1.5 transition-colors ${
                              specialInfo.isSpecial && Number(item.hours) > 0
                                ? "border-amber-300 bg-amber-50/70"
                                : isExceeded 
                                  ? "border-rose-200 bg-rose-50/60" 
                                  : "border-slate-200 bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-700 flex items-center gap-1">
                                Dia {idx + 1}
                                {dayName && <span className="text-[10px] font-semibold text-slate-500">({dayName})</span>}
                              </span>

                              {specialInfo.isSpecial && Number(item.hours) > 0 && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-200 text-amber-900 rounded-md flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                                  {specialInfo.label}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Date Picker per Day */}
                              <input
                                type="date"
                                value={item.date}
                                onChange={(e) => handleItemDateChange(idx, e.target.value)}
                                className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />

                              {/* Hours Input */}
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  min={0}
                                  max={24}
                                  value={item.hours}
                                  onChange={(e) => handleItemHoursChange(idx, Number(e.target.value))}
                                  className={`w-12 px-1 py-1 text-center font-bold text-xs rounded-lg border focus:outline-none focus:ring-1 ${
                                    isExceeded
                                      ? "border-rose-400 bg-white text-rose-700 focus:ring-rose-400"
                                      : "border-slate-300 bg-white text-slate-800 focus:ring-blue-400"
                                  }`}
                                />
                                <span className="text-[11px] font-bold text-slate-500">h</span>
                              </div>

                              {dailyScheduleState.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDay(idx)}
                                  className="text-slate-400 hover:text-rose-600 font-black text-sm px-1"
                                  title="Remover dia"
                                >
                                  &times;
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Day Button */}
                    <button
                      type="button"
                      onClick={handleAddDay}
                      className="w-full py-1.5 bg-white border border-dashed border-slate-300 hover:border-blue-400 text-blue-600 font-bold rounded-xl text-xs flex items-center justify-center gap-1 hover:bg-blue-50/50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Adicionar Mais um Dia
                    </button>

                    {/* Lock alert banner for Sunday / Holiday Coordination Approval */}
                    {queryResult?.hasSundayOrHoliday && (
                      <div className={`p-3 rounded-xl border text-xs space-y-2 transition-colors ${
                        coordApproval
                          ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                          : "bg-amber-50 border-amber-300 text-amber-900"
                      }`}>
                        <div className="flex items-start gap-2">
                          <Lock className={`w-4 h-4 shrink-0 mt-0.5 ${coordApproval ? "text-emerald-600" : "text-amber-600"}`} />
                          <div>
                            <p className="font-bold">Anuência da Coordenação / Supervisão</p>
                            <p className="text-[10px] leading-tight font-medium mt-0.5">
                              Agendamento em <strong>{queryResult.specialDaysSummary}</strong>. É obrigatória a aprovação da Coordenação/Supervisão para agendar a turma nestas datas.
                            </p>
                          </div>
                        </div>

                        <label className="flex items-center gap-2 pt-1 font-bold text-xs cursor-pointer border-t border-amber-200/60 mt-1">
                          <input
                            type="checkbox"
                            checked={coordApproval}
                            onChange={(e) => setCoordApproval(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-amber-300"
                          />
                          <span className="text-[11px]">Aprovação / Anuência da Coordenação Concedida</span>
                        </label>
                      </div>
                    )}

                    {/* Lock alert banner when exceeded */}
                    {isExceeded && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                        <div>
                          <p className="font-bold text-rose-800">Trava de Carga Horária Ativada!</p>
                          <p className="text-[10px] text-rose-600 font-normal leading-tight mt-0.5">
                            Você alocou <strong>{sumAllocated}h</strong> no total, mas o curso <strong>{currentCourse?.name}</strong> é de <strong>{targetHours}h</strong>. Reduza as horas para prosseguir.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
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
                  <p className="text-slate-500">Período Proposto: <span className="font-bold text-slate-700">{queryResult.startDateStr} a {queryResult.endDateStr} ({queryResult.durationDays} dia(s))</span></p>
                  <p className="text-slate-500">Treinamento Solicitado: <span className="font-bold text-slate-800">{courses.find(c => c.id === queryCourseId)?.name}</span></p>
                  <p className="text-slate-500 flex items-center gap-1">Norma / Requisito: <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-full text-[10px] border border-blue-100">{queryResult.requiredNR}</span></p>
                  <p className="text-slate-500">Instrutores Credenciados na Regional: <span className="font-bold text-slate-700">{queryResult.qualifiedCount}</span></p>
                  
                  {/* Detailed Daily Schedule Badges */}
                  <div className="pt-1">
                    <p className="text-[11px] font-bold text-slate-500 mb-1">Carga Horária e Datas Diárias:</p>
                    <div className="flex flex-wrap gap-1">
                      {queryResult.dailySchedule.map(ds => (
                        <span
                          key={ds.dayIndex}
                          className={`px-2 py-1 text-[10px] font-bold rounded-lg border flex items-center gap-1 ${
                            ds.isSpecial
                              ? "bg-amber-100 text-amber-900 border-amber-300"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          <span>Dia {ds.dayIndex} ({ds.dayName} {ds.dateFormatted}): {ds.hours}h</span>
                          {ds.isSpecial && (
                            <span className="text-[9px] bg-amber-200 text-amber-900 px-1 rounded font-extrabold">
                              {ds.specialLabel}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Geral Comercial</p>
                  {queryResult.isExceeded ? (
                    <div className="flex items-center gap-1.5 text-rose-600 font-extrabold text-sm mt-1">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <span>Trava: Carga Horária Excedida!</span>
                    </div>
                  ) : queryResult.isBlockedBySpecialDay ? (
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center gap-1.5 text-amber-700 font-extrabold text-sm">
                        <Lock className="w-5 h-5 shrink-0 text-amber-600" />
                        <span>Bloqueado: Requer Anuência da Coordenação!</span>
                      </div>
                      <p className="text-[10px] text-amber-800 font-medium leading-tight">
                        Aula em {queryResult.specialDaysSummary}. Marque a aprovação da coordenação ao lado para liberar a negociação.
                      </p>
                    </div>
                  ) : queryResult.availableInstructors.length > 0 ? (
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-extrabold text-sm animate-fade-in">
                        <CheckCircle className="w-5 h-5 animate-pulse shrink-0" />
                        <span>Viável para Negociação!</span>
                      </div>
                      {queryResult.hasSundayOrHoliday && (
                        <p className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                          ✓ Anuência da Coordenação Concedida ({queryResult.specialDaysSummary})
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-rose-600 font-extrabold text-sm mt-1">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <span>Alerta: Risco de Conflito</span>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">
                    {queryResult.isExceeded 
                      ? `Foram alocadas ${queryResult.sumAllocatedHours}h para um curso de ${queryResult.totalCourseHours}h.`
                      : queryResult.isBlockedBySpecialDay
                        ? `Aprovação pendente da coordenação.`
                        : `${queryResult.availableInstructors.length} instrutor(es) disponível(is) na regional.`}
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
                        <p className="font-bold text-slate-800">{course?.name}</p>
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
    </div>
  )}

      {/* ABA 3: NOVA OPORTUNIDADE (TELA DEDICADA SEM MODAL) */}
      {activeTab === "nova_oportunidade" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                {editingOpp ? "Editar Oportunidade Comercial" : "Nova Oportunidade CRM / PS"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Preencha os dados da proposta comercial para registro no CRM.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("oportunidades")}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              ← Voltar para Listagem
            </button>
          </div>

          <form onSubmit={handleSaveOpp} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* CRM Number */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">Código N° CRM *</label>
                <input
                  type="text"
                  required
                  value={formCrm}
                  onChange={(e) => setFormCrm(e.target.value)}
                  placeholder="Ex: CRM-2026-1502"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-medium text-slate-900"
                />
              </div>

              {/* PS Number */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">N° Proposta de Serviço (PS) *</label>
                <input
                  type="text"
                  required
                  value={formPs}
                  onChange={(e) => setFormPs(e.target.value)}
                  placeholder="Ex: PS-2026-894"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-medium text-slate-900"
                />
              </div>

              {/* Client Name */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">Razão Social do Cliente (PJ) *</label>
                <input
                  type="text"
                  required
                  value={formClient}
                  onChange={(e) => setFormClient(e.target.value)}
                  placeholder="Ex: WEG Equipamentos S/A"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-medium text-slate-900"
                />
              </div>

              {/* Course Selection */}
              <div className="md:col-span-2 space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">Treinamento Solicitado *</label>
                <select
                  value={formCourseId}
                  onChange={(e) => setFormCourseId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-medium text-slate-900"
                >
                  <option value="">Selecione o curso...</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.duration}h)
                    </option>
                  ))}
                </select>
              </div>

              {/* Regional */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">Regional de Atendimento</label>
                <select
                  value={formRegional}
                  onChange={(e) => setFormRegional(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-medium text-slate-900"
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
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">Previsão de Data</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-medium text-slate-900"
                />
              </div>

              {/* Period */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">Período</label>
                <select
                  value={formPeriod}
                  onChange={(e) => setFormPeriod(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-medium text-slate-900"
                >
                  <option value="Matutino">Matutino</option>
                  <option value="Vespertino">Vespertino</option>
                  <option value="Noturno">Noturno</option>
                  <option value="Integral">Integral</option>
                </select>
              </div>

              {/* Participants */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">Alunos Estimados</label>
                <input
                  type="number"
                  value={formParticipants}
                  onChange={(e) => setFormParticipants(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-medium text-slate-900"
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">Status Comercial</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-medium text-slate-900"
                >
                  <option value="Negociação">Em Negociação</option>
                  <option value="Aprovado">Aprovado (Venda Fechada)</option>
                  <option value="Perdido">Perdido</option>
                </select>
              </div>

              {/* Obs */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1.5 text-xs">
                <label className="font-bold text-slate-700">Notas Comerciais</label>
                <textarea
                  value={formObs}
                  onChange={(e) => setFormObs(e.target.value)}
                  placeholder="Informações adicionais da negociação ou necessidades específicas do cliente..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 font-medium text-slate-900 resize-none text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab("oportunidades")}
                className="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-xs font-extrabold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-extrabold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Salvar Oportunidade
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
