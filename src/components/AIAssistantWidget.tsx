import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  HelpCircle,
  ChevronRight,
  RefreshCw,
  Zap,
  BookOpen
} from "lucide-react";

interface AIAssistantWidgetProps {
  currentViewName: string;
  activeClassContext?: any;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  currentViewName,
  activeClassContext,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: `Olá! Sou a **Assistente Virtual de IA do SGN** 🤖✨\n\nEstou aqui para tirar qualquer dúvida sobre telas, botões, regras e o fluxo operacional do sistema. Pode perguntar diretamente em vez de consultar manuais!\n\n📍 *Visão atual:* **${currentViewName}**`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Quick prompt suggestions tailored to the active view
  const getSuggestions = () => {
    if (currentViewName.includes("Acompanhamento") || currentViewName.includes("Fluxo")) {
      return [
        "Como anexar a lista de alunos na Etapa 7?",
        "Como alocar um professor na turma?",
        "Onde cadestro a placa e horário do transporte?",
        "Como avançar as etapas do fluxo?"
      ];
    }
    if (currentViewName.includes("Portal do Instrutor")) {
      return [
        "Como o professor marca curso realizado e diário?",
        "Onde o professor baixa a lista de alunos?",
        "Como visualizar o mapa e sala da aula?"
      ];
    }
    if (currentViewName.includes("Comercial")) {
      return [
        "Como criar uma nova oportunidade comercial?",
        "Como converter uma proposta em turma SGN?"
      ];
    }
    if (currentViewName.includes("Agenda")) {
      return [
        "Como identificar horários vagos dos professores?",
        "O que fazer em caso de choque de agenda?"
      ];
    }
    return [
      "Como funciona o fluxo operacional de 10 etapas?",
      "Como anexar a lista de alunos em uma turma?",
      "Como alocar um professor em uma turma?"
    ];
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          currentView: currentViewName,
          activeClass: activeClassContext,
        }),
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.responseText || "Desculpe, ocorreu uma falha ao processar sua dúvida. Tente novamente.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      // Fallback local instantâneo do assistente
      const fallbackText = getClientFallbackAnswer(text.trim(), currentViewName);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-fallback-${Date.now()}`,
          sender: "ai",
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Resposta local de contingência caso a conexão falhe
  const getClientFallbackAnswer = (question: string, view: string): string => {
    const q = question.toLowerCase();
    if (q.includes("aluno") || q.includes("lista") || q.includes("etapa 7") || q.includes("matrícula")) {
      return `Para anexar a lista de alunos e matrículas:\n\n1. Acesse **Acompanhamento de Fluxo**.\n2. Escolha a turma desejada.\n3. Vá até a **Etapa 7: Lista de Alunos / Matrículas**.\n4. Clique no botão **Subir Lista de Alunos**.\n5. Anexe o arquivo (.xlsx, .pdf, .docx, imagens) e clique em **Salvar & Concluir Etapa 7**.`;
    }
    if (q.includes("professor") || q.includes("instrutor") || q.includes("alocar") || q.includes("etapa 4")) {
      return `Para alocar um professor:\n\n1. Vá até a aba **Acompanhamento de Fluxo**.\n2. Clique no seletor **Instrutor Alocado** no canto superior direito do painel da turma.\n3. Escolha o docente desejado. O sistema verifica a agenda e atualiza a **Etapa 4**.`;
    }
    if (q.includes("diário") || q.includes("diario") || q.includes("realizado") || q.includes("toggle")) {
      return `Para o professor registrar a aula ou o diário:\n\n1. Acesse o **Portal do Instrutor**.\n2. Selecione a turma.\n3. Utilize os **botões deslizantes (toggles)** ao lado de **Curso Realizado** e **Diário Lançado**. Se precisar corrigir, deslize novamente para desmarcar.`;
    }
    return `Estou pronto para te ajudar na visão **${view}**!\n\nVocê pode me perguntar sobre:\n- Como alocar o professor na turma\n- Como anexar a lista de alunos (Etapa 7)\n- Como preencher os dados de transporte (Etapa 6)\n- Como o professor lança o diário de classe`;
  };

  // Helper to format text with markdown-like bolding
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split("\n");
    return lines.map((line, lIdx) => {
      // Parse bold segments **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={pIdx} className="font-extrabold text-slate-900 bg-emerald-50/70 px-1 rounded-sm">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
          return (
            <em key={pIdx} className="italic text-slate-600 font-medium">
              {part.slice(1, -1)}
            </em>
          );
        }
        return part;
      });

      return (
        <React.Fragment key={lIdx}>
          {renderedParts}
          {lIdx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-emerald-400/30"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
            </span>
          </div>
          <div className="text-left pr-1">
            <p className="text-xs font-black tracking-wide flex items-center gap-1">
              Assistente SGN IA
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </p>
            <p className="text-[10px] text-emerald-100 font-medium opacity-90">
              Tire dúvidas da tela
            </p>
          </div>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-4 text-white flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm tracking-wide flex items-center gap-1.5">
                  Tira-Dúvidas SGN IA
                  <span className="px-1.5 py-0.5 bg-emerald-500/30 text-emerald-300 rounded-full text-[9px] uppercase font-bold tracking-wider">
                    Gemini
                  </span>
                </h3>
                <p className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Visão: <span className="font-bold text-white underline decoration-emerald-400/50">{currentViewName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: `welcome-${Date.now()}`,
                      sender: "ai",
                      text: `Histórico limpo! Como posso te ajudar na visão **${currentViewName}**? 🤖✨`,
                      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    },
                  ]);
                }}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Limpar Conversa"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "ai" && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 shadow-2xs text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-slate-900 text-white rounded-tr-xs"
                      : "bg-white border border-slate-200/80 text-slate-700 rounded-tl-xs"
                  }`}
                >
                  <div>{renderFormattedText(msg.text)}</div>
                  <div
                    className={`text-[9px] mt-1.5 font-mono text-right ${
                      msg.sender === "user" ? "text-slate-400" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === "user" && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Thinking Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="bg-white border border-slate-200/80 p-3 rounded-2xl text-xs text-slate-500 font-medium flex items-center gap-2 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                  <span>SGN IA está consultando as regras da tela...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="p-2.5 bg-white border-t border-slate-100 shrink-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Perguntas Rápidas sobre esta tela:
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {getSuggestions().map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(suggestion)}
                  disabled={isLoading}
                  className="whitespace-nowrap text-[10px] font-bold bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200/80 hover:border-emerald-300 px-2.5 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <span>{suggestion}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Pergunte algo sobre ${currentViewName}...`}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 font-medium transition-colors"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-2xl transition-all shadow-2xs cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
