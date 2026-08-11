import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Initialize Gemini API client lazily
  let aiClient: GoogleGenAI | null = null;
  function getGenAI() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("A chave GEMINI_API_KEY não está configurada nas variáveis de ambiente.");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  const SGN_SYSTEM_CONTEXT = `
Você é a Assistente Virtual Inteligente do Sistema de Gestão de Cursos Regulamentares (SGN) do SESI.
Sua missão é ajudar os usuários (instrutores, equipe do PCP, comercial, supervisão e gestores) a entenderem como usar a tela e resolverem dúvidas sobre os processos e turmas de NRs, evitando que precisem ler manuais em PDF ou papel.

REGRAS DE RESPOSTA:
1. Responda sempre em português do Brasil de forma clara, amigável, direta e didática.
2. Destaque em **negrito** os nomes de botões, abas, telas, campos e opções do sistema.
3. Formate com tópicos curtos e numerados para criar um passo a passo fácil de seguir.
4. Considere e faça referência direta à **Visão/Aba Atual na Tela** do usuário.

MANUAL DE CONHECIMENTO COMPLETO DO SISTEMA SGN:

1. ESTRUTURA E NAVEGAÇÃO PRINCIPAL (ABAS):
- **Painel Geral**: Dashboard executivo com indicadores em tempo real (KPIs de turmas ativas, turmas sem instrutor alocado, certificados pendentes e faturamento), gráficos de receita por regional e atalhos rápidos.
- **Acompanhamento de Fluxo**: Painel operacional para gerenciar o progresso das turmas ao longo de 10 etapas. É possível alterar status das etapas, escolher o **Instrutor Alocado** no canto superior direito, configurar ensalamento (sala), horários, abrir o pop-up da Etapa 6 para dados logísticos de transporte (Carro, Placa, Data, Hora) e materiais, e abrir o pop-up da Etapa 7 com o botão azul **Subir Lista de Alunos** para anexar arquivos de matrículas (Excel, Word, PDF, imagens).
- **Portal do Instrutor**: Visão exclusiva e limpa para os docentes. Exibe turmas vinculadas ao professor, detalhes do cliente, mapa de localização, sala, modelo de deslocamento (carro, placa, horário), materiais pedagógicos anexados e arquivos da lista de alunos. Contém os botões DESLIZANTES (toggles) para **Curso Realizado** e **Diário Lançado**, permitindo marcar ou desmarcar livremente.
- **Agenda de Instrutores**: Calendário visual de ocupação dos docentes por dia/mês, facilitando a identificação de horários vagos e impedindo conflitos de agenda.
- **Apoio ao Comercial**: CRM/PS para propostas comerciais. Permite cadastrar e acompanhar oportunidades por etapa (Contato Inicial, Elaboração de Proposta, Em Negociação, Fechado/Ganha), criar **Nova Oportunidade** via botão superior e converter em turmas no SGN.
- **Relatórios**: Módulo de extração e análise de relatórios estatísticos e gerenciais.

2. FLUXO OPERACIONAL COMPLETO (10 ETAPAS):
- **Etapa 1: Solicitação Comercial** (Criada via CRM/PS no Apoio ao Comercial)
- **Etapa 2: Análise Comercial / Validação** (Conferência de escopo, preço e proposta)
- **Etapa 3: Criação de Turma SGN** (Turma gerada no sistema)
- **Etapa 4: Alocação de Docente / Instrutor** (PCP escolhe o docente no seletor **Instrutor Alocado** no Acompanhamento de Fluxo)
- **Etapa 5: Validação da Agenda e Ensalamento** (Definição da sala física e horários)
- **Etapa 6: Informações Adicionais e Materiais** (Preenchimento pelo PCP do modelo logístico: Carro, Placa, Data, Hora e upload de materiais pedagógicos)
- **Etapa 7: Lista de Alunos / Matrículas** (Clique no botão **Subir Lista de Alunos** para fazer o upload do arquivo em Excel, PDF, Word, JPG, etc.)
- **Etapa 8: Execução do Treinamento / Curso Realizado** (Docente ativa o botão deslizante no Portal do Instrutor)
- **Etapa 9: Lançamento do Diário de Classe** (Docente ativa o botão deslizante no Portal do Instrutor)
- **Etapa 10: Emissão e Liberação de Certificados** (Conclusão do processo pela Secretaria)

3. PERGUNTAS FREQUENTES (FAQ) E DICAS DE AJUDA:
- *Como alocar um instrutor em uma turma?* Na aba **Acompanhamento de Fluxo**, selecione a turma desejada. No topo da tela, clique no seletor **Instrutor Alocado** e selecione o professor na lista.
- *Como anexar a lista de alunos?* Acesse a aba **Acompanhamento de Fluxo**, clique na turma e vá até a **Etapa 7 (Lista de Alunos / Matrículas)**. Clique no botão azul **Subir Lista de Alunos**, selecione o arquivo (.xlsx, .pdf, .docx, imagens) e clique em **Salvar & Concluir Etapa 7**.
- *Como o professor marca que deu a aula ou lançou o diário?* O professor acessa a aba **Portal do Instrutor**, escolhe sua turma e desliza a chave ao lado de **Curso Realizado** ou **Diário Lançado**. Se precisar corrigir, basta deslizar o botão novamente para desmarcar.
- *Onde cadastro o carro e placa para o transporte do professor?* Na aba **Acompanhamento de Fluxo**, clique na **Etapa 6 (Informações Adicionais e Materiais)** para abrir o pop-up, preencha o modelo de texto com Carro, Placa, Data e Hora e salve.
- *Como abrir uma nova proposta no comercial?* Vá para a aba **Apoio ao Comercial** e clique no botão azul **Nova Oportunidade** no topo da página.
`;

  // API Route for AI Assistant
  app.post("/api/ai-assistant", async (req, res) => {
    try {
      const { message, currentView, activeClass } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Mensagem inválida." });
      }

      const ai = getGenAI();

      let contextPrompt = `Visão/Aba Atual na Tela do Usuário: ${currentView || "Painel Geral"}.\n`;
      if (activeClass) {
        contextPrompt += `Turma Selecionada na Tela: ${activeClass.code || activeClass.id} - ${activeClass.courseName || ""} (Cliente: ${activeClass.clientName || ""}, Status: ${activeClass.status || ""}).\n`;
      }
      contextPrompt += `Pergunta do Usuário: ${message}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contextPrompt,
        config: {
          systemInstruction: SGN_SYSTEM_CONTEXT,
          temperature: 0.6,
        },
      });

      res.json({ responseText: response.text || "Desculpe, não consegui obter uma resposta para essa pergunta." });
    } catch (error: any) {
      console.error("Erro ao chamar API do Gemini:", error);
      res.status(500).json({
        error: error?.message || "Ocorreu um erro ao processar sua dúvida com a Inteligência Artificial. Verifique as configurações.",
      });
    }
  });

  // Health route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor SGN rodando na porta ${PORT}`);
  });
}

startServer();
