/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  User, 
  MapPin, 
  Clock, 
  Users, 
  BookOpen, 
  Phone, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  FileSpreadsheet,
  ChevronRight,
  Sparkles,
  Circle
} from "lucide-react";
import { Instructor, CourseClass, Course, StepStatus } from "../types";

interface InstructorPortalViewProps {
  instructors: Instructor[];
  classes: CourseClass[];
  courses: Course[];
  selectedInstructorId: string;
  onSelectInstructor: (id: string) => void;
  onUpdateStep: (classId: string, stepName: string, status: StepStatus, notes?: string) => void;
}

export default function InstructorPortalView({
  instructors,
  classes,
  courses,
  selectedInstructorId,
  onSelectInstructor,
  onUpdateStep
}: InstructorPortalViewProps) {
  const [activeClassId, setActiveClassId] = useState<string | null>(null);

  // Filter classes assigned to selected instructor
  // Do not show cancelled classes
  const instructorClasses = classes.filter(
    c => c.instructorId === selectedInstructorId && c.status !== "Cancelada"
  );

  const selectedInstructor = instructors.find(i => i.id === selectedInstructorId) || instructors[0];

  const currentClass = instructorClasses.find(c => c.id === activeClassId) || instructorClasses[0];

  return (
    <div className="space-y-6">
      {/* Selector banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-slate-600" />
            Portal do Instrutor
          </h2>
          <p className="text-sm text-slate-500">
            Agenda pessoal de aulas, contatos com clientes, fichas pedagógicas e diários de classe.
          </p>
        </div>

        {/* Dynamic simulator login switcher */}
        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-500">Acessar como:</span>
          <select
            value={selectedInstructorId}
            onChange={(e) => {
              onSelectInstructor(e.target.value);
              setActiveClassId(null); // reset selected class on swap
            }}
            className="px-2.5 py-1 bg-white border border-slate-250 rounded-lg text-xs font-bold text-slate-700 focus:outline-none"
          >
            {instructors.map(inst => (
              <option key={inst.id} value={inst.id}>
                {inst.name} ({inst.regional})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: list of assigned classes (col-span-4) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
            Minhas Turmas ({instructorClasses.length})
          </span>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {instructorClasses.map(c => {
              const course = courses.find(cr => cr.id === c.courseId);
              const isSelected = currentClass?.id === c.id;
              
              // Check if diary or course done is completed
              const isDiaryDone = c.steps.find(s => s.name === "Diário Lançado")?.status === "Concluído";
              const isCourseDone = c.steps.find(s => s.name === "Curso Realizado")?.status === "Concluído";

              return (
                <div
                  key={c.id}
                  onClick={() => setActiveClassId(c.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected 
                      ? "bg-blue-50 border-blue-400 shadow-md ring-1 ring-blue-100/50 scale-[1.01]" 
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">
                      {c.startDate.split("-")[2]}/{c.startDate.split("-")[1]} a {c.endDate.split("-")[2]}/{c.endDate.split("-")[1]}
                    </span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                      c.status === "Em Andamento" ? "bg-blue-100 text-blue-700" :
                      c.status === "Confirmada" ? "bg-emerald-100 text-emerald-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-800 text-xs leading-snug">
                    {course?.name.split("-")[0]}
                  </h4>

                  <p className="text-[11px] text-slate-600 font-medium">
                    🏢 {c.clientName}
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-100/60 font-medium">
                    <span>📍 {c.city}</span>
                    <span className="flex gap-1.5 font-bold">
                      <span className={isCourseDone ? "text-emerald-600" : "text-slate-400"}>
                        {isCourseDone ? "✓ Ministrado" : "○ Pendente"}
                      </span>
                      <span>|</span>
                      <span className={isDiaryDone ? "text-emerald-600" : "text-slate-400"}>
                        {isDiaryDone ? "✓ Diário" : "○ Diário"}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}

            {instructorClasses.length === 0 && (
              <div className="bg-white p-8 text-center rounded-xl border border-slate-100 text-slate-400 text-xs">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                Nenhuma turma programada para você no momento.
              </div>
            )}
          </div>
        </div>

        {/* Right column: active class details & actions (col-span-8) */}
        <div className="lg:col-span-8">
          {currentClass ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6">
              
              {/* Card Header details */}
              <div className="border-b border-slate-100 pb-4 space-y-1">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">FICHA OPERACIONAL DA TURMA</span>
                  <span className="text-xs text-slate-500 font-medium">Modalidade: <span className="font-extrabold text-slate-700">{currentClass.type}</span></span>
                </div>
                <h3 className="font-black text-slate-800 text-base leading-tight">
                  {courses.find(cr => cr.id === currentClass.courseId)?.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Período: <span className="font-bold text-slate-700">{currentClass.startDate} a {currentClass.endDate}</span> | Turno: <span className="font-bold text-slate-700">{currentClass.period}</span>
                </p>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Left Block: Client & Logistics */}
                <div className="space-y-3.5 bg-slate-50/50 p-4 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-700 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                    🏢 Informações do Cliente & Local
                  </h4>
                  
                  <div className="space-y-2.5">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cliente PJ / Endereço</p>
                      <p className="font-extrabold text-slate-800 mt-0.5">{currentClass.clientName}</p>
                      <p className="text-slate-500 font-medium mt-0.5">📍 {currentClass.city} - Regional {currentClass.regional}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Responsável pelo Atendimento</p>
                      <p className="font-semibold text-slate-800 mt-0.5">Supervisor do PCP SESI / Regional Oeste</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Contato Cliente (Gestão RH)</p>
                      <p className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        (49) 99120-1122 - rh.treinamentos@empresa.com.br
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Quantidade de Participantes</p>
                      <p className="font-extrabold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {currentClass.currentParticipants} alunos confirmados
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Block: Actions / Tasks */}
                <div className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-700 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                      ✍️ Diários e Lançamentos SGN
                    </h4>

                    <p className="text-slate-500 leading-relaxed text-[11px] font-medium">
                      Como instrutor, você é responsável por ministrar o conteúdo regulamentar e lançar o diário físico/lista para que a secretaria emita os certificados.
                    </p>

                    <div className="space-y-2 mt-2">
                      {/* Checkboxes indicators */}
                      <div className="flex items-center gap-2 text-[11px]">
                        {currentClass.steps.find(s => s.name === "Curso Realizado")?.status === "Concluído" ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span className="font-bold text-slate-700">Etapa: Curso Realizado</span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        {currentClass.steps.find(s => s.name === "Diário Lançado")?.status === "Concluído" ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span className="font-bold text-slate-700">Etapa: Diário Lançado</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        onUpdateStep(currentClass.id, "Curso Realizado", "Concluído", `Concluído pelo instrutor ${selectedInstructor.name}`);
                        alert("Curso marcado como realizado! O PCP e a Supervisão foram informados no fluxo operacional.");
                      }}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-[11px] transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Marcar Curso como Realizado
                    </button>

                    <button
                      onClick={() => {
                        onUpdateStep(currentClass.id, "Diário Lançado", "Concluído", `Diário digitado e enviado pelo instrutor ${selectedInstructor.name}`);
                        alert("Diário de classe lançado! A Secretaria agora pode emitir os certificados dos alunos.");
                      }}
                      className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-[11px] border border-slate-300 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                      Lançar Diário de Classe
                    </button>
                  </div>
                </div>

              </div>

              {/* Syllabus (Ficha de curso) */}
              <div className="space-y-3.5 border-t border-slate-100 pt-5">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-slate-600" />
                  Ementa & Conteúdo Programático Regulamentar (SGN)
                </h4>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-3">
                  <p className="font-extrabold text-slate-700">
                    {courses.find(cr => cr.id === currentClass.courseId)?.name} ({courses.find(cr => cr.id === currentClass.courseId)?.duration} horas aula)
                  </p>
                  
                  <p className="whitespace-pre-line text-[11px] font-medium">
                    {courses.find(cr => cr.id === currentClass.courseId)?.syllabus}
                  </p>

                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
                    <span className="font-bold text-slate-700">Pré-requisitos: </span>
                    {courses.find(cr => cr.id === currentClass.courseId)?.prerequisites}
                  </div>
                </div>
              </div>

              {currentClass.notes && (
                <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-250 text-xs text-amber-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Notas de PCP para o Instrutor:</span>
                    <p className="mt-0.5 font-medium">{currentClass.notes}</p>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-100 text-slate-400 text-xs">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              Nenhuma turma selecionada ou atribuída.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
