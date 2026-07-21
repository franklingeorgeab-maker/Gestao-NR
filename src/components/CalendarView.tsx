/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  MapPin, 
  User, 
  Clock, 
  Info,
  Filter
} from "lucide-react";
import { CourseClass, Course, Instructor, Regional, Modality, CourseType } from "../types";

interface CalendarViewProps {
  classes: CourseClass[];
  courses: Course[];
  instructors: Instructor[];
}

export default function CalendarView({ classes, courses, instructors }: CalendarViewProps) {
  // Filters
  const [filterRegional, setFilterRegional] = useState<Regional | "Todas">("Todas");
  const [filterCity, setFilterCity] = useState("Todas");
  const [filterCourseId, setFilterCourseId] = useState("Todas");
  const [filterClientName, setFilterClientName] = useState("Todas");
  const [filterInstructorId, setFilterInstructorId] = useState("Todas");
  const [filterType, setFilterType] = useState<CourseType | "Todas">("Todas");

  // Selected class detail popover
  const [selectedClass, setSelectedClass] = useState<CourseClass | null>(classes[0] || null);

  // Month navigation (Focus on July 2026)
  const [currentMonth, setCurrentMonth] = useState(6); // 0-indexed, so 6 is July
  const [currentYear, setCurrentYear] = useState(2026);

  // Get unique lists for filter options
  const cities = Array.from(new Set(classes.map(c => c.city))).sort();
  const clientNames = Array.from(new Set(classes.map(c => c.clientName))).sort();

  // Filter logic
  const filteredClasses = classes.filter(c => {
    if (filterRegional !== "Todas" && c.regional !== filterRegional) return false;
    if (filterCity !== "Todas" && c.city !== filterCity) return false;
    if (filterCourseId !== "Todas" && c.courseId !== filterCourseId) return false;
    if (filterClientName !== "Todas" && c.clientName !== filterClientName) return false;
    if (filterInstructorId !== "Todas" && c.instructorId !== filterInstructorId) return false;
    if (filterType !== "Todas" && c.type !== filterType) return false;
    return true;
  });

  // Calendar calculations
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // First day of month weekday (0 = Sun, 1 = Mon, etc)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  // Calendar dates array
  const calendarDays: (number | null)[] = [];
  
  // Padding for initial days of previous month
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }

  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Next month / Previous month handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Helper to find classes active on a specific calendar day
  const getClassesForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    
    return filteredClasses.filter(c => {
      // Class runs between startDate and endDate
      return c.startDate <= dateStr && c.endDate >= dateStr && c.status !== "Cancelada";
    });
  };

  return (
    <div className="space-y-6">
      
      {/* View Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2 font-sans tracking-tight">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            Calendário Geral de Cursos
          </h2>
          <p className="text-sm text-slate-500">
            Acompanhe o cronograma de turmas PAC, RPC e EAD de forma visual e intuitiva com filtros por região.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-[10px] font-bold">
          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-150 rounded-full">
            🔵 PAC (Turma Aberta)
          </span>
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-150 rounded-full">
            🟢 RPC (In-Company / PJ)
          </span>
          <span className="px-2 py-0.5 bg-violet-50 text-violet-700 border border-violet-100 rounded">
            🟣 EAD (Turma EAD)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar Filter controls (col-span-3) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 self-start">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            Filtros do Calendário
          </h3>

          <div className="space-y-3.5 text-xs">
            {/* Regional Filter */}
            <div className="space-y-1">
              <label className="font-bold text-slate-600">Regional</label>
              <select
                value={filterRegional}
                onChange={(e) => setFilterRegional(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="Todas">Todas</option>
                <option value="Oeste">Oeste</option>
                <option value="Serrana">Serrana</option>
                <option value="Norte">Norte</option>
                <option value="Litoral">Litoral</option>
                <option value="Vale do Itajaí">Vale do Itajaí</option>
              </select>
            </div>

            {/* City Filter */}
            <div className="space-y-1">
              <label className="font-bold text-slate-600">Cidade</label>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="Todas">Todas</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Course Filter */}
            <div className="space-y-1">
              <label className="font-bold text-slate-600">Curso / NR</label>
              <select
                value={filterCourseId}
                onChange={(e) => setFilterCourseId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="Todas">Todos</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.name.split("-")[0].trim()}</option>
                ))}
              </select>
            </div>

            {/* Client Filter */}
            <div className="space-y-1">
              <label className="font-bold text-slate-600">Cliente PJ</label>
              <select
                value={filterClientName}
                onChange={(e) => setFilterClientName(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="Todas">Todos</option>
                {clientNames.map(client => (
                  <option key={client} value={client}>{client}</option>
                ))}
              </select>
            </div>

            {/* Instructor Filter */}
            <div className="space-y-1">
              <label className="font-bold text-slate-600">Instrutor</label>
              <select
                value={filterInstructorId}
                onChange={(e) => setFilterInstructorId(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="Todas">Todos</option>
                {instructors.map(inst => (
                  <option key={inst.id} value={inst.id}>{inst.name}</option>
                ))}
              </select>
            </div>

            {/* PAC/RPC Filter */}
            <div className="space-y-1">
              <label className="font-bold text-slate-600">Formato da Turma</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="Todas">Todos</option>
                <option value="PAC">PAC (Turma Aberta)</option>
                <option value="RPC">RPC (In-Company / PJ)</option>
                <option value="EAD_TURMA">EAD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Center Grid: Calendar Month layout (col-span-6) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          
          {/* Calendar Header Month switcher */}
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 uppercase tracking-wider">
              📅 {monthNames[currentMonth]} {currentYear}
            </h3>

            <div className="flex items-center gap-1">
              <button 
                onClick={handlePrevMonth}
                className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                title="Mês Anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCurrentMonth(6); // reset to July 2026
                  setCurrentYear(2026);
                }}
                className="px-2 py-0.5 text-[10px] font-semibold text-blue-600 bg-blue-50 rounded"
              >
                Hoje
              </button>
              <button 
                onClick={handleNextMonth}
                className="p-1 hover:bg-slate-100 rounded text-slate-600 transition-colors"
                title="Próximo Mês"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-slate-400 uppercase tracking-wider">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 min-h-[300px]">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="bg-slate-50/50 rounded-lg border border-slate-100/30"></div>;
              }

              const dayClasses = getClassesForDay(day);

              return (
                <div 
                  key={`day-${day}`} 
                  className={`bg-slate-50/50 p-2 rounded-xl border border-slate-200/80 flex flex-col justify-between h-[68px] transition-all hover:bg-slate-50 ${
                    day === 20 && currentMonth === 6 && currentYear === 2026
                      ? "ring-2 ring-blue-500 bg-blue-50/20 border-blue-200"
                      : ""
                  }`}
                >
                  <span className={`text-[11px] font-extrabold font-mono ${
                    day === 20 && currentMonth === 6 && currentYear === 2026
                      ? "text-blue-600 font-black"
                      : "text-slate-500"
                  }`}>
                    {day}
                  </span>

                  {/* Day events indicator */}
                  <div className="space-y-0.5 overflow-hidden">
                    {dayClasses.slice(0, 3).map(dc => {
                      const courseShort = courses.find(cr => cr.id === dc.courseId)?.name.split("-")[0].trim() || "NR";
                      
                      return (
                        <div
                          key={dc.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClass(dc);
                          }}
                          className={`text-[8px] font-bold px-1 py-0.2 rounded truncate select-none leading-tight ${
                            dc.type === "PAC" ? "bg-indigo-100 text-indigo-800" :
                            dc.type === "RPC" ? "bg-emerald-100 text-emerald-800" :
                            "bg-violet-100 text-violet-800"
                          } ${selectedClass?.id === dc.id ? "ring-1 ring-slate-800" : ""}`}
                          title={`${courseShort} - ${dc.clientName}`}
                        >
                          {courseShort}
                        </div>
                      );
                    })}

                    {dayClasses.length > 3 && (
                      <div className="text-[7px] text-slate-400 text-center font-bold">
                        + {dayClasses.length - 3} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-slate-400 italic text-center">
            Clique em qualquer indicador colorido dentro de um dia para detalhar aquela turma no painel lateral.
          </p>
        </div>

        {/* Right Sidebar: Selected Class Info Card (col-span-3) */}
        <div className="lg:col-span-3">
          {selectedClass ? (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2.5 space-y-1">
                <span className={`px-2 py-0.5 text-[8px] font-bold rounded-full ${
                  selectedClass.type === "PAC" ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                  selectedClass.type === "RPC" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                  "bg-violet-50 text-violet-700 border-violet-100"
                }`}>
                  {selectedClass.type === "PAC" ? "PAC (Público)" : selectedClass.type === "RPC" ? "RPC (In-Company)" : "EAD"}
                </span>
                
                <h4 className="font-extrabold text-slate-800 text-xs mt-1.5 leading-snug">
                  {courses.find(cr => cr.id === selectedClass.courseId)?.name}
                </h4>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Cliente / Empresa</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedClass.clientName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Início</p>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedClass.startDate}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Término</p>
                    <p className="font-bold text-slate-800 mt-0.5">{selectedClass.endDate}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Turno / Dias</p>
                  <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {selectedClass.period} ({selectedClass.scheduleDays})
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">📍 Local / Cidade</p>
                  <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {selectedClass.city} - Regional {selectedClass.regional}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">👤 Instrutor Responsável</p>
                  <p className="font-bold text-blue-600 mt-0.5">
                    {instructors.find(i => i.id === selectedClass.instructorId)?.name || "Pendente de Alocação"}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status Atual</p>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black mt-1 ${
                    selectedClass.status === "Em Andamento" ? "bg-blue-100 text-blue-800" :
                    selectedClass.status === "Confirmada" ? "bg-emerald-100 text-emerald-800" :
                    selectedClass.status === "Realizada" ? "bg-violet-100 text-violet-800" :
                    selectedClass.status === "Faturada" ? "bg-slate-100 text-slate-800" :
                    "bg-amber-100 text-amber-800"
                  }`}>
                    {selectedClass.status}
                  </span>
                </div>

                {selectedClass.billingCallNumber && (
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">N° Chamado Faturamento</p>
                    <p className="font-mono font-bold text-slate-800 mt-0.5">#{selectedClass.billingCallNumber}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 text-center rounded-2xl border border-slate-200 shadow-sm text-slate-400 text-xs">
              <Info className="w-6 h-6 mx-auto mb-1 text-slate-300" />
              Nenhuma turma selecionada para detalhar.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
