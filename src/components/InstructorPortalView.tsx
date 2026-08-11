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
  Circle,
  Download,
  FileText,
  FolderArchive,
  Info,
  Building2,
  Layers
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
                    {course?.name}
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
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ensalamento / Local de Aula (PCP)</p>
                      <p className="font-extrabold text-blue-900 bg-blue-50/70 px-2.5 py-1 rounded-lg border border-blue-200/60 inline-block mt-0.5">
                        🏫 {currentClass.room || "Sala a definir pelo PCP"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Responsável pelo Atendimento</p>
                      <p className="font-semibold text-slate-800 mt-0.5">Supervisor do PCP SESI / Regional {currentClass.regional}</p>
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

                    {(() => {
                      const isCourseDone = currentClass.steps.find(s => s.name === "Curso Realizado")?.status === "Concluído";
                      const isDiaryDone = currentClass.steps.find(s => s.name === "Diário Lançado")?.status === "Concluído";

                      return (
                        <div className="space-y-3 pt-1">
                          {/* Toggle 1: Marcar Curso como Realizado */}
                          <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                            <div className="flex items-center gap-2.5">
                              <div className={`p-2 rounded-xl transition-colors ${isCourseDone ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                                <CheckCircle className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-800 text-xs">Curso Realizado</p>
                                <p className="text-[10px] text-slate-500 font-medium">
                                  {isCourseDone ? "Concluído pelo instrutor" : "Pendente de realização"}
                                </p>
                              </div>
                            </div>

                            {/* Sliding Toggle Switch */}
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isCourseDone}
                              onClick={() => {
                                const newStatus: StepStatus = isCourseDone ? "Pendente" : "Concluído";
                                const note = isCourseDone ? undefined : `Concluído pelo instrutor ${selectedInstructor.name}`;
                                onUpdateStep(currentClass.id, "Curso Realizado", newStatus, note);
                              }}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isCourseDone ? "bg-emerald-600" : "bg-slate-300"
                              }`}
                              title={isCourseDone ? "Clique para desmarcar curso realizado" : "Clique para marcar curso como realizado"}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                  isCourseDone ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Toggle 2: Lançar Diário de Classe */}
                          <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                            <div className="flex items-center gap-2.5">
                              <div className={`p-2 rounded-xl transition-colors ${isDiaryDone ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                                <FileSpreadsheet className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-800 text-xs">Diário Lançado</p>
                                <p className="text-[10px] text-slate-500 font-medium">
                                  {isDiaryDone ? "Diário digitado e enviado" : "Pendente de lançamento"}
                                </p>
                              </div>
                            </div>

                            {/* Sliding Toggle Switch */}
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isDiaryDone}
                              onClick={() => {
                                const newStatus: StepStatus = isDiaryDone ? "Pendente" : "Concluído";
                                const note = isDiaryDone ? undefined : `Diário digitado e enviado pelo instrutor ${selectedInstructor.name}`;
                                onUpdateStep(currentClass.id, "Diário Lançado", newStatus, note);
                              }}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isDiaryDone ? "bg-emerald-600" : "bg-slate-300"
                              }`}
                              title={isDiaryDone ? "Clique para desmarcar diário lançado" : "Clique para marcar diário como lançado"}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                  isDiaryDone ? "translate-x-5" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>

              {/* Informações Adicionais e Materiais Anexados pelo PCP */}
              <div className="space-y-3.5 border-t border-slate-100 pt-5">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <FolderArchive className="w-4 h-4 text-emerald-600" />
                  Informações Adicionais & Materiais Pedagógicos (Definidos pelo PCP)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Orientações do PCP */}
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-emerald-600" />
                      Orientações Adicionais da Turma
                    </p>
                    <p className="text-xs text-emerald-950 leading-relaxed font-medium whitespace-pre-wrap">
                      {currentClass.additionalInfo || "Nenhuma orientação especial cadastrada. Seguir ementa e cronograma oficial."}
                    </p>
                  </div>

                  {/* Arquivos de Apoio */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-600" />
                      Materiais de Apoio & Planos de Aula ({currentClass.materials?.length || 0})
                    </p>
                    {currentClass.materials && currentClass.materials.length > 0 ? (
                      <div className="space-y-1.5 pt-1">
                        {currentClass.materials.map((mat) => (
                          <div key={mat.id} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                              <span className="font-bold text-slate-800 truncate">{mat.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({mat.size})</span>
                            </div>
                            <button
                              onClick={() => alert(`Iniciando download de: ${mat.name}`)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="Baixar Material"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic pt-1">Nenhum arquivo ou apostila anexado para esta turma.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Lista de Alunos (In Company / Dependência / PAC vs EAD Online) */}
              <div className="space-y-3.5 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <Users className="w-4 h-4 text-slate-600" />
                    Lista de Alunos da Turma
                  </h4>
                  {currentClass.type === "EAD_TURMA" ? (
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-full uppercase">
                      100% Online EAD (SGN)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-extrabold rounded-full uppercase">
                      In-Company / Presencial
                    </span>
                  )}
                </div>

                {currentClass.type === "EAD_TURMA" ? (
                  <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-extrabold">Alunos de Curso Online (EAD)</p>
                      <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                        Os alunos de turmas 100% online são cadastrados e matriculados individualmente no SGN separadamente pela Secretaria. O acompanhamento de acesso e diário EAD ocorre diretamente na plataforma de ensino.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* File Download Banners if provided */}
                    {(currentClass.studentListFiles && currentClass.studentListFiles.length > 0) ? (
                      <div className="space-y-2">
                        {currentClass.studentListFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between bg-slate-900 text-white p-3.5 rounded-2xl shadow-xs">
                            <div className="flex items-center gap-3">
                              <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />
                              <div>
                                <p className="text-xs font-extrabold">{file.name}</p>
                                <p className="text-[10px] text-slate-300">
                                  Arquivo oficial com a listagem de alunos cadastrados ({file.size || "Anexo"}) • {file.uploadedAt || "Recente"}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => alert(`Baixando arquivo de alunos: ${file.name}`)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Baixar
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : currentClass.studentListFile ? (
                      <div className="flex items-center justify-between bg-slate-900 text-white p-3.5 rounded-2xl shadow-xs">
                        <div className="flex items-center gap-3">
                          <FileSpreadsheet className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div>
                            <p className="text-xs font-extrabold">{currentClass.studentListFile.name}</p>
                            <p className="text-[10px] text-slate-300">Arquivo oficial com a listagem de alunos cadastrados da empresa ({currentClass.studentListFile.size})</p>
                          </div>
                        </div>
                        <button
                          onClick={() => alert(`Baixando arquivo de alunos: ${currentClass.studentListFile?.name}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Baixar Arquivo
                        </button>
                      </div>
                    ) : null}

                    {/* Table of students if populated */}
                    {currentClass.students && currentClass.students.length > 0 ? (
                      <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                        <table className="w-full text-left text-xs text-slate-700">
                          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold border-b border-slate-200">
                            <tr>
                              <th className="px-4 py-2.5">Nome do Aluno</th>
                              <th className="px-4 py-2.5">CPF</th>
                              <th className="px-4 py-2.5">E-mail</th>
                              <th className="px-4 py-2.5">Empresa / Vínculo</th>
                              <th className="px-4 py-2.5">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {currentClass.students.map((st) => (
                              <tr key={st.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-bold text-slate-800">{st.name}</td>
                                <td className="px-4 py-3 font-mono text-slate-600">{st.cpf || "—"}</td>
                                <td className="px-4 py-3 text-slate-600">{st.email || "—"}</td>
                                <td className="px-4 py-3 text-slate-600">{st.company || currentClass.clientName}</td>
                                <td className="px-4 py-3">
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                                    {st.status || "Matriculado"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : !currentClass.studentListFile && (
                      <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-200">
                        Nenhuma lista física de alunos anexada para esta turma no momento.
                      </p>
                    )}
                  </div>
                )}
              </div>
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
