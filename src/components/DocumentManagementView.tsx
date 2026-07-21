/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  FileText, 
  ExternalLink, 
  Download, 
  Search, 
  Info, 
  CheckSquare, 
  ChevronRight, 
  FileSpreadsheet, 
  BookOpen, 
  Paperclip,
  Share2
} from "lucide-react";
import { DocumentReference, Course } from "../types";

interface DocumentManagementViewProps {
  documents: DocumentReference[];
  courses: Course[];
}

export default function DocumentManagementView({ documents, courses }: DocumentManagementViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todas" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Todas", "Ficha de Curso", "Modelo", "Manual", "Regulamento"];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-600" />
            Documentos de Apoio & Modelos Padronizados
          </h2>
          <p className="text-sm text-slate-500">
            Acesso rápido a modelos de proposta, fichas SGN oficiais e regulamentos para agilizar a operação.
          </p>
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Info banner confirming official storage rule */}
      <div className="bg-amber-50/50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 leading-relaxed">
          <span className="font-bold">Atenção sobre Integridade de Dados:</span> Esta plataforma <span className="font-semibold">não substitui os sistemas corporativos oficiais do SESI</span>. Todos os registros oficiais, como cadastro de turmas, matrículas, diários lançados e certificados continuarão sendo armazenados e validados exclusivamente nos sistemas institucionais já existentes. Estes documentos servem como consulta e agilização operacional diária.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left main: documents list (col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por termo ou descrição do modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 shadow-2xs font-medium"
              />
            </div>

            <span className="text-xs text-slate-400 font-mono">
              Mostrando {filteredDocs.length} documento(s)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map(doc => (
              <div key={doc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider ${
                      doc.category === "Ficha de Curso" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                      doc.category === "Modelo" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      doc.category === "Manual" ? "bg-indigo-50 text-indigo-700 border border-indigo-100" :
                      "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {doc.category}
                    </span>
                    
                    <span className="text-[10px] text-slate-400 font-mono">
                      Alt: {doc.lastUpdated.split("-")[2]}/{doc.lastUpdated.split("-")[1]}/{doc.lastUpdated.split("-")[0]}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-800 text-sm leading-snug flex items-center gap-1.5">
                    {doc.category === "Modelo" && <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {doc.category === "Ficha de Curso" && <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />}
                    {doc.category === "Manual" && <FileText className="w-4 h-4 text-indigo-600 shrink-0" />}
                    {doc.category === "Regulamento" && <Paperclip className="w-4 h-4 text-amber-600 shrink-0" />}
                    {doc.title}
                  </h4>

                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {doc.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(doc.url);
                      alert("Link copiado para a área de transferência! Cole no navegador para acessar.");
                    }}
                    className="text-[11px] text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Copiar Link
                  </button>

                  <a
                    href="#abrir-documento"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Simulando abertura do documento de apoio: ${doc.title}\nURL oficial SGN: ${doc.url}`);
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                  >
                    Abrir Oficial
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right checklist block: checklist operacional (col-span-4) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-2.5">
            📋 Checklist de Padronização SGN
          </h3>

          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Verifique as obrigatoriedades antes de deferir ou solicitar a emissão de certificados na secretaria:
          </p>

          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-800" />
              <div>
                <p className="font-bold text-slate-700">Verificação de Pré-requisitos</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">ASO correspondente anexado na pasta (e.g. NR 33/NR 35).</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-800" />
              <div>
                <p className="font-bold text-slate-700">Lista de Presença Assinada</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Colher assinatura física diária dos participantes da turma.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-800" />
              <div>
                <p className="font-bold text-slate-700">Ementa de Aula Cumprida</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Garantir que a carga horária mínima regulamentar foi atingida.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <input type="checkbox" className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-800" />
              <div>
                <p className="font-bold text-slate-700">Notas Lançadas no SGN</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">O instrutor preencheu o diário de notas e faltas no diário.</p>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50/50 text-blue-800 text-[11px] rounded-2xl border border-blue-100 leading-relaxed mt-2 font-medium">
            <p className="font-bold">Ficou com dúvida?</p>
            <p className="mt-1">
              Consulte o <span className="font-bold">Manual de Operação do PCP</span> ao lado para saber o passo a passo exato do fluxo de liberação de faturamentos e chamados no SESI.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
