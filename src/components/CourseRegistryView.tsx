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
  FileText,
  Search,
  Save,
  ShieldCheck,
  Check,
  Edit3,
  Trash2,
  Lock,
  AlertCircle,
  X,
  Sparkles,
  Filter
} from "lucide-react";
import { Course, Instructor, Modality, AccessProfile } from "../types";

interface CourseRegistryViewProps {
  courses: Course[];
  instructors: Instructor[];
  currentProfile: AccessProfile;
  onAddCourse: (course: Course) => void;
  onUpdateCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

export default function CourseRegistryView({ 
  courses, 
  instructors, 
  currentProfile,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse
}: CourseRegistryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(courses[0]?.id || null);
  
  // Modal State for CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  
  // Delete Confirmation Modal
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Form Fields for Course
  const [formName, setFormName] = useState("");
  const [formCodeSGN, setFormCodeSGN] = useState("");
  const [formDuration, setFormDuration] = useState(16);
  const [formSyllabus, setFormSyllabus] = useState("");
  const [formModalities, setFormModalities] = useState<Modality[]>(["Presencial"]);
  const [formMaxParticipants, setFormMaxParticipants] = useState(20);
  const [formPrerequisites, setFormPrerequisites] = useState("");

  // Only Supervisão (Supervisão/Coordenação) can create, edit, or delete courses
  const canEditCourses = currentProfile === "Supervisão";

  // Filter courses by search term
  const termLower = searchTerm.toLowerCase().trim();
  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(termLower) ||
    c.codeSGN.toLowerCase().includes(termLower) ||
    c.syllabus.toLowerCase().includes(termLower) ||
    c.duration.toString().includes(termLower) ||
    c.modalities.some(m => m.toLowerCase().includes(termLower))
  );

  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  // Find enabled instructors for a course
  const getEnabledInstructors = (course: Course) => {
    if (!course) return [];
    const nameUpper = course.name.toUpperCase();
    return instructors.filter(inst => {
      const compStr = inst.competencies.join(" ").toUpperCase();
      if (nameUpper.includes("NR 10") && (compStr.includes("NR 10") || compStr.includes("SEP"))) return true;
      if (nameUpper.includes("SEP") && compStr.includes("SEP")) return true;
      if (nameUpper.includes("NR 35") && compStr.includes("NR 35")) return true;
      if (nameUpper.includes("NR 33") && compStr.includes("NR 33")) return true;
      if (nameUpper.includes("NR 20") && compStr.includes("NR 20")) return true;
      if (nameUpper.includes("NR 12") && compStr.includes("NR 12")) return true;
      if (nameUpper.includes("NR 06") && compStr.includes("NR 06")) return true;
      if (nameUpper.includes("NR 11") && compStr.includes("NR 11")) return true;
      if (nameUpper.includes("NR 05") && compStr.includes("NR 05")) return true;
      if (nameUpper.includes("NR 18") && compStr.includes("NR 18")) return true;
      if (nameUpper.includes("NR 23") && compStr.includes("NR 23")) return true;
      if (nameUpper.includes("NR 31") && compStr.includes("NR 31")) return true;
      if (nameUpper.includes("NR 17") && compStr.includes("NR 17")) return true;
      return inst.competencies.some(comp => nameUpper.includes(comp.toUpperCase()));
    });
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    if (!canEditCourses) return;
    setModalMode("create");
    setEditingCourseId(null);
    setFormName("");
    setFormCodeSGN("");
    setFormDuration(16);
    setFormSyllabus("");
    setFormModalities(["Presencial"]);
    setFormMaxParticipants(20);
    setFormPrerequisites("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (course: Course) => {
    if (!canEditCourses) return;
    setModalMode("edit");
    setEditingCourseId(course.id);
    setFormName(course.name);
    setFormCodeSGN(course.codeSGN);
    setFormDuration(course.duration);
    setFormSyllabus(course.syllabus);
    setFormModalities(course.modalities.length > 0 ? course.modalities : ["Presencial"]);
    setFormMaxParticipants(course.maxParticipants || 20);
    setFormPrerequisites(course.prerequisites || "");
    setIsModalOpen(true);
  };

  // Submit Handler for Create & Edit
  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditCourses) {
      alert("Apenas perfis de Supervisão e Coordenação possuem permissão para editar ou cadastrar cursos.");
      return;
    }

    if (!formName.trim() || !formCodeSGN.trim()) {
      alert("Por favor, preencha o Nome e o Código SGN do curso.");
      return;
    }

    if (modalMode === "create") {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        codeSGN: formCodeSGN.trim(),
        name: formName.trim(),
        duration: Number(formDuration),
        syllabus: formSyllabus.trim(),
        modalities: formModalities,
        maxParticipants: Number(formMaxParticipants),
        prerequisites: formPrerequisites.trim()
      };
      onAddCourse(newCourse);
      setSelectedCourseId(newCourse.id);
    } else if (modalMode === "edit" && editingCourseId) {
      const updatedCourse: Course = {
        id: editingCourseId,
        codeSGN: formCodeSGN.trim(),
        name: formName.trim(),
        duration: Number(formDuration),
        syllabus: formSyllabus.trim(),
        modalities: formModalities,
        maxParticipants: Number(formMaxParticipants),
        prerequisites: formPrerequisites.trim()
      };
      onUpdateCourse(updatedCourse);
    }

    setIsModalOpen(false);
  };

  // Confirm Delete Handler
  const handleConfirmDelete = () => {
    if (!canEditCourses || !courseToDelete) return;

    onDeleteCourse(courseToDelete.id);
    
    // Select remaining course if needed
    const remaining = courses.filter(c => c.id !== courseToDelete.id);
    if (selectedCourseId === courseToDelete.id) {
      setSelectedCourseId(remaining[0]?.id || null);
    }

    setCourseToDelete(null);
  };

  const toggleModality = (mod: Modality) => {
    if (formModalities.includes(mod)) {
      if (formModalities.length === 1) return; // keep at least one
      setFormModalities(formModalities.filter(m => m !== mod));
    } else {
      setFormModalities([...formModalities, mod]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Catálogo de Cursos & Parametrização SGN
            </h2>
            {canEditCourses ? (
              <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                <Check className="w-3 h-3" /> Supervisão / Coordenação (Acesso Total CRUD)
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" /> Modo Consulta
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestão parametrizada de cargas horárias, ementas regulamentares e consulta rápida por norma ou modalidade.
          </p>
        </div>

        {canEditCourses ? (
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Novo Curso
          </button>
        ) : (
          <div className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 flex items-center gap-1.5 shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Edição e cadastro restritos à <strong>Supervisão e Coordenação</strong>.</span>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left pane: Quick Search & Course List (col-span-4) */}
        <div className="lg:col-span-4 space-y-3">
          
          {/* Consulta Rápida Box */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-blue-700">
                <Search className="w-4 h-4 text-blue-600" />
                Consulta Rápida de Cursos
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-normal">
                {filteredCourses.length} de {courses.length}
              </span>
            </label>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Consulta rápida (Ex: NR 06 EPI 6h - EAD ou NR 06 EPI 2h - presencial)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-500 transition-colors"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-slate-200 transition-colors"
                  title="Limpar busca"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter Shortcut Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Atalhos Rápidos de Busca:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSearchTerm("NR 06 EPI 6h - EAD")}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                    searchTerm === "NR 06 EPI 6h - EAD"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200"
                  }`}
                >
                  NR 06 EPI 6h - EAD
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTerm("NR 06 EPI 2h - presencial")}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border ${
                    searchTerm === "NR 06 EPI 2h - presencial"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200"
                  }`}
                >
                  NR 06 EPI 2h - presencial
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTerm("NR 10")}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border ${
                    searchTerm === "NR 10"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200"
                  }`}
                >
                  NR 10
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTerm("NR 35")}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border ${
                    searchTerm === "NR 35"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200"
                  }`}
                >
                  NR 35
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTerm("NR 33")}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all border ${
                    searchTerm === "NR 33"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200"
                  }`}
                >
                  NR 33
                </button>
              </div>
            </div>
          </div>

          {/* Courses List Scrollable Container */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(c => {
                const isSelected = selectedCourseId === c.id;
                const enabledCount = getEnabledInstructors(c).length;

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCourseId(c.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex justify-between items-start gap-3 ${
                      isSelected 
                        ? "bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-100/60" 
                        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-blue-700 font-bold font-mono bg-blue-100/60 px-1.5 py-0.2 rounded border border-blue-200/50">
                          SGN {c.codeSGN}
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                          {c.duration}h
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-xs leading-snug break-words">
                        {c.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium truncate">
                        Modalidades: <span className="font-semibold text-slate-700">{c.modalities.join(" • ")}</span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 font-mono">
                        👥 {enabledCount} profs
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-400 space-y-1">
                <Search className="w-6 h-6 mx-auto text-slate-300" />
                <p className="text-xs font-medium">Nenhum curso encontrado para "{searchTerm}".</p>
                <button 
                  onClick={() => setSearchTerm("")}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Limpar filtro de busca
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right pane: Selected Course Ficha & CRUD actions (col-span-8) */}
        <div className="lg:col-span-8">
          {activeCourse ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6">
              
              {/* Header Details with Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400 font-bold font-mono uppercase tracking-wider">
                      FICHA CURRICULAR PARAMETRIZADA NO SGN
                    </span>
                    <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.2 rounded-full border border-blue-100 font-mono">
                      CÓDIGO {activeCourse.codeSGN}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-900 text-lg leading-snug mt-1">
                    {activeCourse.name}
                  </h3>
                </div>

                {/* CRUD Controls: Only visible & actionable for Supervisão / Coordenação */}
                {canEditCourses ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(activeCourse)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      title="Editar ficha e parametrização deste curso"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Editar Curso
                    </button>
                    <button
                      onClick={() => setCourseToDelete(activeCourse)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      title="Excluir este curso do catálogo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Excluir
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold shrink-0">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Apenas Leitura</span>
                  </div>
                )}
              </div>

              {/* Specs Bento Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                  <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Carga Horária</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{activeCourse.duration} horas</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                  <Users className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Limite Alunos</p>
                  <p className="text-sm font-extrabold text-slate-800 mt-0.5">{activeCourse.maxParticipants} max</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center col-span-2">
                  <Layers className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Modalidades Autorizadas</p>
                  <p className="text-xs font-extrabold text-slate-800 mt-1">
                    {activeCourse.modalities.join(" | ")}
                  </p>
                </div>

              </div>

              {/* Syllabus details */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Conteúdo Programático Oficial SGN
                </h4>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                  {activeCourse.syllabus}
                </div>
              </div>

              {/* Prerequisites */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Pré-requisitos Curriculares Obrigatórios
                </h4>
                <p className="text-xs text-slate-700 bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200 leading-relaxed font-medium">
                  {activeCourse.prerequisites || "Nenhum pré-requisito registrado."}
                </p>
              </div>

              {/* Enabled Instructors dynamically */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-600" />
                    Instrutores Credenciados ({getEnabledInstructors(activeCourse).length})
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Habilitados por competência</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {getEnabledInstructors(activeCourse).map(inst => (
                    <div key={inst.id} className="p-3 bg-emerald-50/40 rounded-2xl border border-emerald-100 flex items-center justify-between">
                      <div className="space-y-0.5 font-medium">
                        <p className="text-xs font-bold text-slate-800">{inst.name}</p>
                        <p className="text-[10px] text-slate-500">📍 Regional {inst.regional} | {inst.linkType}</p>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 shrink-0 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Habilitado
                      </span>
                    </div>
                  ))}

                  {getEnabledInstructors(activeCourse).length === 0 && (
                    <p className="text-xs text-rose-500 italic py-2 col-span-2">
                      Atenção: Nenhum instrutor cadastrado possui competência cadastrada para este treinamento!
                    </p>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              Selecione um curso na lista para visualizar sua ficha curricular parametrizada.
            </div>
          )}
        </div>

      </div>

      {/* CRUD Modal: Cadastrar / Editar Curso */}
      {isModalOpen && canEditCourses && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in-50 duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                {modalMode === "create" ? "Cadastrar Novo Curso SGN" : "Editar Parametrização do Curso"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                
                {/* Course Name */}
                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Nome do Treinamento *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: NR 06 EPI 6h - EAD ou NR 06 EPI 2h - presencial"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                  />
                  <p className="text-[10px] text-slate-400">
                    Defina o título identificador. Exemplo: <i>NR 06 EPI 6h - EAD</i> ou <i>NR 06 EPI 2h - presencial</i>.
                  </p>
                </div>

                {/* SGN Code */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Código SGN Parametrizado *</label>
                  <input
                    type="text"
                    required
                    value={formCodeSGN}
                    onChange={(e) => setFormCodeSGN(e.target.value)}
                    placeholder="Ex: 4478 ou SGN-NR06"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-mono font-bold"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Carga Horária (horas) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                {/* Max participants */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Capacidade Máxima de Alunos</label>
                  <input
                    type="number"
                    min={1}
                    value={formMaxParticipants}
                    onChange={(e) => setFormMaxParticipants(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                {/* Modality Selector */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Modalidades Autorizadas</label>
                  <div className="flex gap-2 pt-1">
                    {(["Presencial", "Semipresencial", "EAD"] as Modality[]).map((m) => (
                      <label key={m} className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={formModalities.includes(m)}
                          onChange={() => toggleModality(m)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Syllabus */}
                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Conteúdo Programático Oficial SGN *</label>
                  <textarea
                    required
                    value={formSyllabus}
                    onChange={(e) => setFormSyllabus(e.target.value)}
                    placeholder="Descreva a ementa curricular padronizada e os tópicos do treinamento..."
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-sans text-xs leading-relaxed"
                  />
                </div>

                {/* Prerequisites */}
                <div className="col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Pré-requisitos Obrigatórios</label>
                  <input
                    type="text"
                    value={formPrerequisites}
                    onChange={(e) => setFormPrerequisites(e.target.value)}
                    placeholder="Ex: Atestado ASO apto; Idade mínima de 18 anos."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  {modalMode === "create" ? "Cadastrar Curso" : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {courseToDelete && canEditCourses && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in-50 duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-100 rounded-xl shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Confirmar Exclusão de Curso
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Tem certeza que deseja remover o curso <strong>"{courseToDelete.name}"</strong> (Código SGN: <strong>{courseToDelete.codeSGN}</strong>) do catálogo? Esta ação removerá o treinamento das consultas e parametrizações ativas.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCourseToDelete(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Trash2 className="w-4 h-4" />
                Sim, Excluir Curso
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
