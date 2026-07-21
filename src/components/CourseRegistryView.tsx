/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BookOpen, 
  Plus, 
  Layers, 
  Clock, 
  Users, 
  HelpCircle, 
  UserCheck, 
  FileText,
  Search,
  Save,
  ShieldCheck,
  Check
} from "lucide-react";
import { Course, Instructor, Modality } from "../types";

interface CourseRegistryViewProps {
  courses: Course[];
  instructors: Instructor[];
  onAddCourse: (course: Course) => void;
}

export default function CourseRegistryView({ courses, instructors, onAddCourse }: CourseRegistryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(courses[0]?.id || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields for new Course
  const [formName, setFormName] = useState("");
  const [formCodeSGN, setFormCodeSGN] = useState("");
  const [formDuration, setFormDuration] = useState(16);
  const [formSyllabus, setFormSyllabus] = useState("");
  const [formModalities, setFormModalities] = useState<Modality[]>(["Presencial"]);
  const [formMaxParticipants, setFormMaxParticipants] = useState(20);
  const [formPrerequisites, setFormPrerequisites] = useState("");

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.codeSGN.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  // Dynamically find enabled instructors who have the competency for this course
  const getEnabledInstructors = (course: Course) => {
    // Map course keywords to NRs
    const requiredNR = course.name.includes("NR 10") ? "NR 10" :
                       course.name.includes("SEP") ? "SEP" :
                       course.name.includes("NR 35") ? "NR 35" :
                       course.name.includes("NR 33") ? "NR 33" :
                       course.name.includes("NR 20") ? "NR 20" :
                       course.name.includes("NR 12") ? "NR 12" : "NR";

    return instructors.filter(inst => 
      inst.competencies.includes(requiredNR) || (requiredNR === "NR 10" && inst.competencies.includes("SEP"))
    );
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCodeSGN) {
      alert("Por favor, preencha o Nome e Código SGN.");
      return;
    }

    const courseData: Course = {
      id: `course-${Date.now()}`,
      codeSGN: formCodeSGN,
      name: formName,
      duration: Number(formDuration),
      syllabus: formSyllabus,
      modalities: formModalities,
      maxParticipants: Number(formMaxParticipants),
      prerequisites: formPrerequisites
    };

    onAddCourse(courseData);
    setSelectedCourseId(courseData.id);
    setIsModalOpen(false);

    // Reset Form
    setFormName("");
    setFormCodeSGN("");
    setFormSyllabus("");
    setFormPrerequisites("");
  };

  const toggleModality = (mod: Modality) => {
    if (formModalities.includes(mod)) {
      setFormModalities(formModalities.filter(m => m !== mod));
    } else {
      setFormModalities([...formModalities, mod]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-600" />
            Parametrização e Cadastro de Cursos (SGN)
          </h2>
          <p className="text-sm text-slate-500">
            Regulamento oficial de cargas horárias, ementas regulamentares e pré-requisitos das Normas Regulamentadoras.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Novo Curso
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left pane: course lists (col-span-4) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar curso por nome, SGN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 shadow-2xs font-medium"
            />
          </div>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredCourses.map(c => {
              const isSelected = selectedCourseId === c.id;
              const enabledCount = getEnabledInstructors(c).length;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCourseId(c.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                    isSelected 
                      ? "bg-blue-50 border-blue-400 shadow-md ring-1 ring-blue-100/50 scale-[1.01]" 
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md shadow-sm"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold font-mono uppercase">
                      {c.codeSGN}
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-xs leading-snug">
                      {c.name.split("-")[0].trim()}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Carga horária: <span className="font-bold text-slate-700">{c.duration} horas</span>
                    </p>
                  </div>

                  <span className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 font-mono text-center shrink-0">
                    👥 {enabledCount} profs
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right pane: selected course detailed ficha (col-span-8) */}
        <div className="lg:col-span-8">
          {activeCourse ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6">
              
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[9px] text-slate-400 font-bold font-mono uppercase">FICHA CURRICULAR PARAMETRIZADA NO SGN</span>
                <h3 className="font-black text-slate-800 text-base leading-tight mt-1">
                  {activeCourse.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Código SGN Único: <span className="font-mono font-bold text-blue-600">{activeCourse.codeSGN}</span>
                </p>
              </div>

              {/* Specs Bento Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                  <Clock className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Carga Horária</p>
                  <p className="text-sm font-extrabold text-slate-700 mt-0.5">{activeCourse.duration} horas</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                  <Users className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Limite Alunos</p>
                  <p className="text-sm font-extrabold text-slate-700 mt-0.5">{activeCourse.maxParticipants} max</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center col-span-2">
                  <Layers className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Modalidades Autorizadas</p>
                  <p className="text-xs font-extrabold text-slate-700 mt-1">
                    {activeCourse.modalities.join(" | ")}
                  </p>
                </div>

              </div>

              {/* Syllabus details */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4.5 h-4.5 text-slate-600" />
                  Ementa e Conteúdo Padronizado
                </h4>
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200 text-xs text-slate-600 leading-relaxed whitespace-pre-line font-medium">
                  {activeCourse.syllabus}
                </div>
              </div>

              {/* Prerequisites */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-slate-600" />
                  Pré-requisitos Curriculares Obrigatórios
                </h4>
                <p className="text-xs text-slate-600 bg-amber-50/30 p-3.5 rounded-2xl border border-amber-200 leading-relaxed font-medium">
                  {activeCourse.prerequisites}
                </p>
              </div>

              {/* Enabled Instructors dynamically */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-t border-slate-100 pt-5">
                  <UserCheck className="w-4.5 h-4.5 text-slate-600" />
                  Instrutores Credenciados para este Treinamento ({getEnabledInstructors(activeCourse).length})
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {getEnabledInstructors(activeCourse).map(inst => (
                    <div key={inst.id} className="p-3 bg-emerald-50/30 rounded-2xl border border-emerald-100 flex items-center justify-between">
                      <div className="space-y-0.5 font-medium">
                        <p className="text-xs font-bold text-slate-800">{inst.name}</p>
                        <p className="text-[10px] text-slate-500">📍 Regional {inst.regional} | {inst.linkType}</p>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 shrink-0">
                        <Check className="w-3.5 h-3.5" /> Habilitado
                      </span>
                    </div>
                  ))}

                  {getEnabledInstructors(activeCourse).length === 0 && (
                    <p className="text-xs text-rose-500 italic py-2 col-span-2">
                      Atenção: Nenhum instrutor habilitado com esta competência cadastrado na plataforma!
                    </p>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-100 text-slate-400 text-xs">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              Selecione um curso na lista para visualizar sua ficha curricular parametrizada.
            </div>
          )}
        </div>

      </div>

      {/* Add New Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in-50 duration-200">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">
                Cadastrar Novo Treinamento de Norma Regulamentadora
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                
                {/* Name */}
                <div className="col-span-2 space-y-1">
                  <label className="font-semibold text-slate-600">Nome do Treinamento *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: NR 10 - Eletricidade Básico"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* SGN Code */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600">Código SGN Parametrizado *</label>
                  <input
                    type="text"
                    required
                    value={formCodeSGN}
                    onChange={(e) => setFormCodeSGN(e.target.value)}
                    placeholder="Ex: SGN-NR10-B"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 font-mono font-bold"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600">Carga Horária (horas)</label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Max participants */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600">Capacidade Máxima Alunos</label>
                  <input
                    type="number"
                    value={formMaxParticipants}
                    onChange={(e) => setFormMaxParticipants(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Modality Selector */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-600">Modalidades Permitidas</label>
                  <div className="flex gap-2.5 pt-1.5">
                    {["Presencial", "Semipresencial", "EAD"].map((m) => (
                      <label key={m} className="flex items-center gap-1 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={formModalities.includes(m as any)}
                          onChange={() => toggleModality(m as any)}
                        />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Syllabus */}
                <div className="col-span-2 space-y-1">
                  <label className="font-semibold text-slate-600">Conteúdo Programático Oficial SGN *</label>
                  <textarea
                    required
                    value={formSyllabus}
                    onChange={(e) => setFormSyllabus(e.target.value)}
                    placeholder="Descreva a ementa curricular padronizada no sistema institucional do SESI..."
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none font-sans"
                  />
                </div>

                {/* Prerequisites */}
                <div className="col-span-2 space-y-1">
                  <label className="font-semibold text-slate-600">Pré-requisitos Obrigatórios</label>
                  <input
                    type="text"
                    value={formPrerequisites}
                    onChange={(e) => setFormPrerequisites(e.target.value)}
                    placeholder="Ex: Idade mínima de 18 anos; Atestado médico de aptidão."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
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
                  Salvar Treinamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
