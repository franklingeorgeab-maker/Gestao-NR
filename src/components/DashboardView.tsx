/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  FileCheck, 
  Calendar, 
  DollarSign, 
  Activity, 
  AlertTriangle, 
  Layers, 
  UserCheck, 
  Clock,
  MapPin,
  ShieldCheck,
  Lock,
  ShieldAlert,
  Building2
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Legend, 
  Cell,
  PieChart,
  Pie
} from "recharts";
import { CourseClass, Instructor, Course, Regional, AccessProfile } from "../types";

interface DashboardViewProps {
  classes: CourseClass[];
  instructors: Instructor[];
  courses: Course[];
  currentProfile: AccessProfile;
  userRegional?: Regional;
}

export default function DashboardView({ 
  classes, 
  instructors, 
  courses, 
  currentProfile,
  userRegional = "Centro-Norte"
}: DashboardViewProps) {
  const isAdmGeral = currentProfile === "Supervisão";
  const isAdmLocal = currentProfile === "PCP";
  const isAdm = isAdmGeral || isAdmLocal;

  // Local ADM regional
  const localRegional: Regional = userRegional;

  // Selected regional state
  const [selectedRegional, setSelectedRegional] = useState<Regional | "Todas">(
    isAdmLocal ? localRegional : "Todas"
  );

  // Sync selectedRegional when profile changes
  useEffect(() => {
    if (isAdmLocal) {
      setSelectedRegional(localRegional);
    }
  }, [isAdmLocal, localRegional]);

  // Determine effective regional
  const effectiveRegional = isAdmLocal ? localRegional : selectedRegional;

  // Filter classes based on regional
  const filteredClasses = effectiveRegional === "Todas" 
    ? classes 
    : classes.filter(c => c.regional === effectiveRegional);

  // Filter instructors based on regional
  const filteredInstructors = effectiveRegional === "Todas"
    ? instructors
    : instructors.filter(i => i.regional === effectiveRegional);

  // 1. KPI Calculations
  const inProgressClasses = filteredClasses.filter(c => c.status === "Em Andamento");
  const upcomingClasses = filteredClasses.filter(c => c.status === "Confirmada" || c.status === "Pendente");
  const completedClasses = filteredClasses.filter(c => c.status === "Realizada" || c.status === "Faturada");
  const cancelledClasses = filteredClasses.filter(c => c.status === "Cancelada");
  const postponedClasses = filteredClasses.filter(c => c.status === "Prorrogada");

  // Instructors allocated in active classes (In Progress or Confirmed)
  const activeClassInstIds = new Set(
    filteredClasses
      .filter(c => (c.status === "Em Andamento" || c.status === "Confirmada") && c.instructorId)
      .map(c => c.instructorId)
  );
  const allocatedInstructorsCount = filteredInstructors.filter(i => activeClassInstIds.has(i.id)).length;
  const instructorUtilizationRate = filteredInstructors.length > 0 
    ? Math.round((allocatedInstructorsCount / filteredInstructors.length) * 100) 
    : 0;

  // Pending certificates and processes
  // Let's look at the operational steps. "Certificados Emitidos" is a step in classes.
  // If "Curso Realizado" is Concluído but "Certificados Emitidos" is not Concluído, then certificates are pending.
  const classesWithPendingCertificates = filteredClasses.filter(c => {
    if (c.status === "Cancelada") return false;
    const courseDone = c.steps.find(s => s.name === "Curso Realizado")?.status === "Concluído";
    const certsDone = c.steps.find(s => s.name === "Certificados Emitidos")?.status === "Concluído";
    return courseDone && !certsDone;
  });

  // General pending operational steps
  // Count steps that are "Em andamento"
  let totalPendingSteps = 0;
  filteredClasses.forEach(c => {
    c.steps.forEach(s => {
      if (s.status === "Em andamento") {
        totalPendingSteps++;
      }
    });
  });

  // Students count and occupancy
  // Only count for non-cancelled classes
  const nonCancelledClasses = filteredClasses.filter(c => c.status !== "Cancelada");
  const totalStudents = nonCancelledClasses.reduce((sum, c) => sum + c.currentParticipants, 0);
  const maxCapacity = nonCancelledClasses.reduce((sum, c) => sum + c.maxParticipants, 0);
  const overallOccupancyRate = maxCapacity > 0 ? Math.round((totalStudents / maxCapacity) * 100) : 0;

  // Revenue
  const predictedRevenue = filteredClasses.reduce((sum, c) => sum + c.revenuePredicted, 0);
  const realizedRevenue = filteredClasses.reduce((sum, c) => sum + c.revenueRealized, 0);

  // 2. Schedule details for "Today & This Week" (Assume mock current date 2026-07-20 is Monday)
  // Let's filter classes that run between 2026-07-20 and 2026-07-26
  const getDayLabel = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    return weekdays[d.getDay()];
  };

  const isToday = (dateStr: string) => dateStr === "2026-07-20";
  const isThisWeek = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    const start = new Date("2026-07-20T00:00:00");
    const end = new Date("2026-07-26T00:00:00");
    return d >= start && d <= end;
  };

  const classesToday = filteredClasses.filter(c => isToday(c.startDate) || (c.startDate <= "2026-07-20" && c.endDate >= "2026-07-20" && c.status === "Em Andamento"));
  const classesThisWeek = filteredClasses.filter(c => isThisWeek(c.startDate) && !classesToday.some(t => t.id === c.id));

  // 3. Prepare data for Charts
  // Chart A: Revenue by Course (Top 5)
  const revenueByCourseData = courses.map(course => {
    const courseClasses = filteredClasses.filter(c => c.courseId === course.id);
    const predicted = courseClasses.reduce((sum, c) => sum + c.revenuePredicted, 0);
    const realized = courseClasses.reduce((sum, c) => sum + c.revenueRealized, 0);
    const courseShortName = course.name; // Full course name
    return {
      name: courseShortName,
      "Prevista (R$)": predicted,
      "Realizada (R$)": realized
    };
  }).filter(d => d["Prevista (R$)"] > 0 || d["Realizada (R$)"] > 0);

  // Chart B: Status Distribution
  const statusData = [
    { name: "Em Andamento", value: inProgressClasses.length, color: "#0ea5e9" }, // sky-500
    { name: "Confirmada", value: filteredClasses.filter(c => c.status === "Confirmada").length, color: "#10b981" }, // emerald-500
    { name: "Pendente", value: filteredClasses.filter(c => c.status === "Pendente").length, color: "#f59e0b" }, // amber-500
    { name: "Realizada/Faturada", value: completedClasses.length, color: "#6366f1" }, // indigo-500
    { name: "Cancelada/Prorrogada", value: cancelledClasses.length + postponedClasses.length, color: "#ef4444" } // red-500
  ].filter(d => d.value > 0);

  // Chart C: Occupancy and Capacity by Modality or Type
  const classTypes = ["PAC", "RPC", "EAD_TURMA"];
  const occupancyByTypeData = classTypes.map(type => {
    const typeClasses = filteredClasses.filter(c => c.type === type && c.status !== "Cancelada");
    const students = typeClasses.reduce((sum, c) => sum + c.currentParticipants, 0);
    const capacity = typeClasses.reduce((sum, c) => sum + c.maxParticipants, 0);
    const rate = capacity > 0 ? Math.round((students / capacity) * 100) : 0;
    
    let typeName = "Aberto (PAC)";
    if (type === "RPC") typeName = "In Company (RPC)";
    if (type === "EAD_TURMA") typeName = "EAD (Turma)";

    return {
      name: typeName,
      "Alunos": students,
      "Capacidade": capacity,
      "Ocupação %": rate
    };
  });

  if (!isAdm) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-amber-900 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 font-extrabold text-base">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Acesso Exclusivo aos Administradores (ADM)</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed">
          O Painel Gerencial de Indicadores é reservado exclusivamente para os perfis de <strong>ADM Geral (Supervisão)</strong> e <strong>ADM Local (PCP)</strong>.
          Por favor, utilize os menus da barra lateral correspondentes às suas atribuições operacionais.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upper header section with Regional selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Painel Geral de Indicadores</h2>
            {isAdmGeral && (
              <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-extrabold rounded-full border border-purple-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-600" /> ADM Geral (Acesso Total)
              </span>
            )}
            {isAdmLocal && (
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-full border border-blue-200 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-blue-600" /> ADM Local ({localRegional})
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            {isAdmGeral && "Acompanhamento em tempo real de todas as 5 regionais do SESI Santa Catarina."}
            {isAdmLocal && `Visão restrita e detalhada dos dados e indicadores da Regional ${localRegional}.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto max-w-full">
          <div className="flex items-center mr-1">
            <MapPin className="w-4 h-4 text-slate-400 ml-1 mr-1" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Regional:</span>
          </div>

          {isAdmLocal ? (
            <div className="flex items-center gap-2 bg-blue-50/90 px-3 py-1.5 rounded-lg border border-blue-200 text-blue-800 text-xs font-extrabold">
              <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{localRegional}</span>
              <span className="text-[10px] font-normal text-blue-600 hidden sm:inline">(Acesso Fixo ADM Local)</span>
            </div>
          ) : (
            ["Todas", "Oeste", "Serrana", "Norte", "Litoral", "Vale do Itajaí", "Centro-Norte", "Sul", "Sudeste"].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegional(reg as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  (reg === "Todas" && selectedRegional === "Todas") || selectedRegional === reg
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {reg}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Grid of Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Receita (Prevista / Realizada)</p>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-800">
                R$ {realizedRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Previsto: R$ {predictedRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            {predictedRevenue > 0 && (
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5">
                <div 
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (realizedRevenue / predictedRevenue) * 100)}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Students & Occupancy */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alunos & Ocupação Geral</p>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-800">{totalStudents} Alunos</span>
              <span className="text-xs font-medium text-slate-500">Taxa Ocupação: {overallOccupancyRate}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${overallOccupancyRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 3: Instructors Allocation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-xl border border-violet-100">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Utilização de Instrutores</p>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-800">{allocatedInstructorsCount} / {filteredInstructors.length} Alocados</span>
              <span className="text-xs font-medium text-slate-500">Taxa de Uso: {instructorUtilizationRate}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5">
              <div 
                className="bg-violet-600 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${instructorUtilizationRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 4: Pendencies & Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Processos & Certificados</p>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-800">{totalPendingSteps} Em Andamento</span>
              <span className="text-xs font-medium text-slate-500">
                Certificados Pendentes: <span className="font-semibold text-amber-600">{classesWithPendingCertificates.length} turmas</span>
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-0.5 bg-red-50 text-red-700 text-[10px] font-semibold rounded-lg border border-red-100">
                {cancelledClasses.length} Canceladas
              </span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-lg border border-slate-200">
                {postponedClasses.length} Prorrogadas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout: Charts and Schedule Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns - Charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Receita Prevista vs. Realizada por NR (R$)
              </h3>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Foco em Captação SESI</span>
            </div>
            <div className="h-64 w-full">
              {revenueByCourseData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByCourseData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip formatter={(value) => `R$ ${value}`} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Prevista (R$)" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Realizada (R$)" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                  Sem dados financeiros correspondentes na regional selecionada.
                </div>
              )}
            </div>
          </div>

          {/* Sub Grid for Occupancy and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Occupancy Chart */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                Ocupação Média por Tipo de Turma
              </h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occupancyByTypeData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 100]} unit="%" stroke="#64748b" fontSize={10} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={80} tickLine={false} />
                    <Tooltip formatter={(value) => `${value}`} />
                    <Bar dataKey="Ocupação %" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                      {occupancyByTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? "#2563eb" : index === 1 ? "#059669" : "#7c3aed"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status Pie Chart */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                Distribuição de Status das Turmas
              </h3>
              <div className="h-48 w-full flex items-center justify-between">
                <div className="w-1/2 h-full">
                  {statusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          innerRadius={45}
                          outerRadius={65}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-xs">Sem dados</div>
                  )}
                </div>
                <div className="w-1/2 space-y-2 pl-2">
                  {statusData.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: item.color }} />
                      <div className="leading-none">
                        <p className="text-[11px] font-medium text-slate-700">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{item.value} {item.value === 1 ? "turma" : "turmas"}</p>
                      </div>
                    </div>
                  ))}
                  {statusData.length === 0 && (
                    <p className="text-xs text-slate-400 text-center">Nenhuma turma cadastrada.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Operational agenda check (Turmas do dia/semana & Certificados) */}
        <div className="space-y-6">
          
          {/* Turmas do Dia e Semana */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-[340px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                Agenda do Dia e Semana
              </h3>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg border border-slate-200 font-mono">
                20/07/2026 (Seg)
              </span>
            </div>

            <div className="overflow-y-auto flex-1 space-y-3 pr-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hoje (Segunda-feira)</p>
              {classesToday.length > 0 ? (
                classesToday.map(c => {
                  const course = courses.find(cr => cr.id === c.courseId);
                  const inst = instructors.find(i => i.id === c.instructorId);
                  return (
                    <div key={c.id} className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded-full">
                          {c.type}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {c.period}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {course?.name} - {c.clientName}
                      </p>
                      <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                        <span>📍 {c.city} ({c.regional})</span>
                        <span className="font-bold text-blue-700">👤 {inst ? inst.name : "Não alocado"}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic py-2">Nenhuma turma programada para hoje.</p>
              )}

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-4 mb-1">Próximos Dias da Semana</p>
              {classesThisWeek.length > 0 ? (
                classesThisWeek.map(c => {
                  const course = courses.find(cr => cr.id === c.courseId);
                  const inst = instructors.find(i => i.id === c.instructorId);
                  return (
                    <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/50 space-y-1.5">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-slate-600">
                          {getDayLabel(c.startDate)} ({c.startDate.split("-")[2]}/{c.startDate.split("-")[1]})
                        </span>
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-bold rounded-full">
                          {c.type}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-tight">
                        {course?.name} - {c.clientName}
                      </p>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>📍 {c.city}</span>
                        <span>👤 {inst ? inst.name : "Não alocado"}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic py-2">Nenhuma outra turma para esta semana.</p>
              )}
            </div>
          </div>

          {/* Certificados Pendentes e Processos */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-[230px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                Ações Operacionais Urgentes
              </h3>
              <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full border border-amber-200/50">
                Pendências
              </span>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2.5 pr-1">
              {classesWithPendingCertificates.length > 0 ? (
                classesWithPendingCertificates.map(c => {
                  const course = courses.find(cr => cr.id === c.courseId);
                  return (
                    <div key={c.id} className="p-3 bg-amber-50/40 rounded-xl border border-amber-200/50 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-tight">
                          Certificados: {course?.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {c.clientName} | Concluído em {c.endDate.split("-")[2]}/{c.endDate.split("-")[1]}
                        </p>
                      </div>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full select-none">
                        Falta Emitir
                      </span>
                    </div>
                  );
                })
              ) : null}

              {/* Also show classes without defined instructors starting in the next 15 days */}
              {filteredClasses.filter(c => !c.instructorId && c.status === "Pendente").map(c => {
                const course = courses.find(cr => cr.id === c.courseId);
                return (
                  <div key={c.id} className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        Falta Definir Instrutor!
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {course?.name} em {c.city} - Início: {c.startDate.split("-")[2]}/{c.startDate.split("-")[1]}
                      </p>
                    </div>
                    <span className="text-[9px] bg-red-100 text-red-700 font-black px-2 py-1 rounded-full uppercase">
                      PCP / Alocar
                    </span>
                  </div>
                );
              })}

              {classesWithPendingCertificates.length === 0 && filteredClasses.filter(c => !c.instructorId && c.status === "Pendente").length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center py-6 text-slate-400">
                  <span className="text-3xl">✅</span>
                  <p className="text-xs font-medium text-slate-500 mt-2">Nenhuma pendência crítica operacional encontrada!</p>
                  <p className="text-[10px] text-slate-400 mt-1">Todos os certificados foram emitidos e instrutores alocados.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
