import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.post("/api/lexique-lookup", async (req, res) => {
  try {
    const { word } = req.body;
    if (!word) return res.status(400).json({ error: "Word is required" });

    const prompt = `Donne une définition courte et simple (niveau école primaire 4ème année) pour le mot en français : "${word}". 
    Donne aussi un exemple court d'utilisation, et une liste de 2 à 4 synonymes simples en français.
    Réponds UNIQUEMENT au format JSON : {"definition": "La définition...", "example": "L'exemple...", "synonyms": ["synonyme1", "synonyme2", ...]}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const cleanedText = response.text.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(cleanedText));
  } catch (error) {
    console.error("Lexique Error:", error);
    res.status(500).json({ error: "AI failed to fetch definition" });
  }
});

app.post("/api/dossier-generate", async (req, res) => {
  try {
    const { text } = req.body;
    const prompt = `Agis comme un expert pédagogique tunisien. À partir du texte suivant : "${text}", génère 4 activités pour un dossier pédagogique niveau 4ème année.
    1. Rédaction Dirigée : 8 phrases courtes du texte ou liées au thème, présentées comme des listes de mots mélangés.
    2. Reconstitution de Récit : 8 phrases de l'histoire (ordre chronologique).
    3. Texte à 10 Trous : Le texte (ou un résumé) avec 10 mots essentiels manquants, remplacés par [1], [2], etc. Fournis la liste des 10 mots.
    4. Mini-Dialogue : Un dialogue de 6 répliques entre personnages du texte ou lié au thème.
    Réponds UNIQUEMENT au format JSON strict : 
    {
      "redaction": [{"jumbled": "mot1 / mot2 / ...", "correct": "La phrase correcte."}],
      "reconstitution": ["Phrase 1", "Phrase 2", ...],
      "cloze": {"text": "Aujourd'hui, [1] est...", "words": ["mot1", "mot2", ...]},
      "dialogue": ["Perso A : Salut", "Perso B : Bonjour", ...]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
    const content = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    res.json(JSON.parse(content));
  } catch (error) {
    console.error("Dossier Generation Error:", error);
    res.status(500).json({ error: "AI failed to generate dossier" });
  }
});

app.post("/api/diagnose", async (req, res) => {
  try {
    const { text, type } = req.body;
    let prompt = "";
    if (type === 'redaction') {
      prompt = `Tu es un assistant pédagogique. Analyse ce texte d'élève : "${text}". 
      Identifie uniquement les mots contenant des fautes d'orthographe ou de conjugaison. 
      Réponds UNIQUEMENT par la liste des mots erronés séparés par des virgules. 
      Ne donne JAMAIS la correction. Ne fais aucun autre commentaire.`;
    } else if (type === 'redaction_seyes') {
      prompt = `Tu es un conseiller pédagogique bienveillant pour des élèves de 4ème année primaire.
      Analyse ce texte rédigé par un élève sur son cahier Seyès : "${text}".
      
      Effectue deux tâches distinctes :
      1) Orthographe & Conjugaison : Identifie uniquement les mots contenant des fautes d'orthographe ou de conjugaison. Présente-les sous forme de liste de mots séparés par des virgules (ex: "mot1, mot2"). Ne donne jamais leur correction.
      2) Structure & Syntaxe : Analyse comment les phrases sont construites. Propose 2 ou 3 pistes d'amélioration très bienveillantes pour la syntaxe (ex: couper des phrases trop longues, éviter des répétitions, etc.), mais sans JAMAIS corriger directement les phrases ni donner la solution. Tu dois l'aiguiller pour qu'il trouve lui-même ! Rédige des phrases adaptées à un enfant du primaire.
      
      Réponds TOUJOURS au format JSON strict avec exactement ces deux clés (n'ajoute aucun texte en dehors du JSON, n'oublie pas d'échapper les guillemets dans les textes) :
      {
        "feedback": "liste de mots erronés séparés par des virgules",
        "syntaxe": "tes 2 ou 3 conseils de syntaxe sous forme de puces courtes"
      }`;
    } else {
      prompt = `Tu es un professeur de français pour des élèves de 4ème année. 
      Analyse ce texte de type ${type === 'portrait' ? 'portrait' : 'description animale'} : "${text}".
      Donne un feedback court (30 mots max), encourageant et ludique. 
      Vérifie les adjectifs qualificatifs et les accords. 
      Termine par un emoji rigolo.`;
    }

    if (type === 'redaction_seyes') {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });
      let feedback = "";
      let syntaxe = "";
      try {
        const cleaned = response.text.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        feedback = parsed.feedback || "";
        syntaxe = parsed.syntaxe || "";
      } catch (e) {
        console.error("JSON PARSE ERROR IN DIAGNOSE SEYES", e);
        feedback = response.text;
      }
      return res.json({ feedback, syntaxe });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ feedback: response.text });
  } catch (error) {
    console.error("Diagnosis Error:", error);
    res.status(500).json({ error: "AI failed to diagnose" });
  }
});

app.post("/api/explain-answer", async (req, res) => {
  try {
    const { question, selected, answer, context, type } = req.body;
    if (!question || !answer) return res.status(400).json({ error: "Required fields missing" });

    const isCorrect = String(selected || '').toLowerCase().trim() === String(answer).toLowerCase().trim();
    const prompt = `Agis comme un enseignant de français attentionné, magique et pédagogue pour des enfants du primaire (niveau 4ème année).
    La question d'évaluation est : "${question}"
    La bonne réponse attendue est : "${answer}"
    L'élève a répondu : "${selected || '(vide)'}" (${isCorrect ? 'Correct !' : 'Incorrect'})
    Fiche de lecture / Contexte de l'histoire : "${context || ''}"
    Type de question : ${type || 'QCM'}

    Génère une explication courte, positive, très claire et ludique (maximum 40 mots de vocabulaire simple) expliquant de façon concise pourquoi "${answer}" est correct dans l'histoire ou d'après les règles de conjugaison/grammaire française.
    Parle directement à l'élève à la deuxième personne ("tu").
    Reste toujours encourageant et utilise un ton chaleureux. Termine par un emoji rigolo ou félicitant. Réponds directement avec l'explication, sans introduction ni conclusion artificielle.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ explanation: response.text });
  } catch (error) {
    console.error("Explanation Error:", error);
    res.status(500).json({ error: "Local system failed to build live AI comment" });
  }
});

// --- START REAL-TIME MULTIPLAYER COMPETITION ENGINE ---

interface Player {
  id: string;
  ws: WebSocket;
  name: string;
  avatar: string;
  ficheId: number;
}

interface GameRoom {
  id: string;
  ficheId: number;
  player1: Player;
  player2: Player;
  questions: any[];
  p1Progress: {
    questionIndex: number;
    score: number;
    finished: boolean;
    timeSpent?: number;
  };
  p2Progress: {
    questionIndex: number;
    score: number;
    finished: boolean;
    timeSpent?: number;
  };
}

const matchmakingQueue: Record<number, Player[]> = {};
const activeRooms: Record<string, GameRoom> = {};

function generateQuestions(ficheId: number, ficheData: any) {
  const questions: any[] = [];
  
  // 1. Vocabulary Question 1
  if (ficheData.vocab && ficheData.vocab.length > 0) {
    const v1 = ficheData.vocab[0];
    const opts = ficheData.vocabOptions?.[v1] || [v1, "Mauvais choix 1", "Mauvais choix 2"];
    const correctAnswer = opts[0];
    const shuffled = [...opts].sort(() => Math.random() - 0.5);
    questions.push({
      type: "vocab",
      word: v1,
      title: `Que signifie le mot "${v1}" ? 💡`,
      choices: shuffled,
      answer: correctAnswer
    });
  }
  
  // 2. Vocabulary Question 2
  if (ficheData.vocab && ficheData.vocab.length > 1) {
    const v2 = ficheData.vocab[1];
    const opts = ficheData.vocabOptions?.[v2] || [v2, "Mauvais choix 1", "Mauvais choix 2"];
    const correctAnswer = opts[0];
    const shuffled = [...opts].sort(() => Math.random() - 0.5);
    questions.push({
      type: "vocab",
      word: v2,
      title: `Que signifie le mot "${v2}" ? 💡`,
      choices: shuffled,
      answer: correctAnswer
    });
  }

  // 3. Orthographe/Spelling (Dictation-themed rapid fire)
  if (ficheData.vocab && ficheData.vocab.length > 2) {
    const v3 = ficheData.vocab[2];
    const alt1 = v3.replace(/e/g, "é").replace(/éé/g, "é").replace(/ss/g, "s") + "e";
    const alt2 = v3.replace(/s/g, "ss").replace(/ssss/g, "ss") + "s";
    const options = [v3, alt1 !== v3 ? alt1 : v3 + "r", alt2 !== v3 ? alt2 : v3 + "x"];
    const uniqOptions = Array.from(new Set(options));
    const shuffled = [...uniqOptions].sort(() => Math.random() - 0.5);
    questions.push({
      type: "spelling",
      word: v3,
      title: `Trouve la bonne orthographe pour ce mot : ✏️`,
      choices: shuffled,
      answer: v3
    });
  }

  // 4. Comprehension QCM 1
  if (ficheData.evaluation && ficheData.evaluation.length > 0) {
    const qcmEvals = ficheData.evaluation.filter((ev: any) => ev.choices && ev.choices.length > 0);
    if (qcmEvals.length > 0) {
      const qSelected = qcmEvals[0];
      const shuffled = [...qSelected.choices].sort(() => Math.random() - 0.5);
      questions.push({
        type: "comprehension",
        title: qSelected.q,
        choices: shuffled,
        answer: qSelected.answer
      });
    } else {
      const qSelected = ficheData.evaluation[0];
      const answer = qSelected.answer || "Oui";
      const choices = [answer, "Non", "Peut-être"];
      const shuffled = choices.sort(() => Math.random() - 0.5);
      questions.push({
        type: "comprehension",
        title: qSelected.q,
        choices: shuffled,
        answer: answer
      });
    }
  }

  // 5. Comprehension/Grammar Question 2
  if (ficheData.evaluation && ficheData.evaluation.length > 1) {
    const qcmEvals = ficheData.evaluation.filter((ev: any) => ev.choices && ev.choices.length > 0);
    if (qcmEvals.length > 1) {
      const qSelected = qcmEvals[1];
      const shuffled = [...qSelected.choices].sort(() => Math.random() - 0.5);
      questions.push({
        type: "comprehension",
        title: qSelected.q,
        choices: shuffled,
        answer: qSelected.answer
      });
    } else {
      const qSelected = ficheData.evaluation[ficheData.evaluation.length - 1];
      const answer = qSelected.answer || "Vrai";
      const choices = [answer, "Faux", "Je ne sais pas"];
      const shuffled = choices.sort(() => Math.random() - 0.5);
      questions.push({
        type: "comprehension",
        title: qSelected.q,
        choices: shuffled,
        answer: answer
      });
    }
  }

  // Fill to 5 if any were lacking
  while (questions.length < 5) {
    questions.push({
      type: "comprehension",
      title: `Es-tu prêt à remporter la victoire sur la Fiche ${ficheId} ? 🏆`,
      choices: ["Oui, absolument !", "Je suis prêt !", "C'est parti !"],
      answer: "Je suis prêt !"
    });
  }

  return questions.slice(0, 5);
}

function checkMatchmaking(ficheId: number, ficheData: any) {
  const queue = matchmakingQueue[ficheId] || [];
  if (queue.length >= 2) {
    const player1 = queue.shift()!;
    const player2 = queue.shift()!;
    
    const roomId = `room_${Math.random().toString(36).substring(2, 9)}`;
    const questions = generateQuestions(ficheId, ficheData);
    
    const room: GameRoom = {
      id: roomId,
      ficheId,
      player1,
      player2,
      questions,
      p1Progress: { questionIndex: -1, score: 0, finished: false },
      p2Progress: { questionIndex: -1, score: 0, finished: false }
    };
    
    activeRooms[roomId] = room;
    
    const startPayload1 = {
      type: "game_start",
      roomId,
      questions,
      opponent: { name: player2.name, avatar: player2.avatar },
      isPlayer1: true
    };
    
    const startPayload2 = {
      type: "game_start",
      roomId,
      questions,
      opponent: { name: player1.name, avatar: player1.avatar },
      isPlayer1: false
    };
    
    player1.ws.send(JSON.stringify(startPayload1));
    player2.ws.send(JSON.stringify(startPayload2));
  }
}

function handleDisconnect(ws: WebSocket) {
  for (const FId in matchmakingQueue) {
    const idNum = parseInt(FId);
    if (!isNaN(idNum)) {
      matchmakingQueue[idNum] = (matchmakingQueue[idNum] || []).filter(p => p.ws !== ws);
    }
  }
  
  for (const roomId in activeRooms) {
    const room = activeRooms[roomId];
    if (room.player1.ws === ws || room.player2.ws === ws) {
      const isPlayer1 = room.player1.ws === ws;
      const loser = isPlayer1 ? room.player1 : room.player2;
      const winner = isPlayer1 ? room.player2 : room.player1;
      
      if (winner.ws.readyState === WebSocket.OPEN) {
        winner.ws.send(JSON.stringify({
          type: "opponent_disconnected",
          message: `Ton adversaire ${loser.name} s'est déconnecté. Tu remportes la victoire par forfait ! 🏆🎉`
        }));
      }
      
      delete activeRooms[roomId];
    }
  }
}

function declareWinner(room: GameRoom) {
  const p1 = room.p1Progress;
  const p2 = room.p2Progress;
  
  let winnerName = "";
  if (p1.score > p2.score) {
    winnerName = room.player1.name;
  } else if (p2.score > p1.score) {
    winnerName = room.player2.name;
  } else {
    const t1 = p1.timeSpent || 999;
    const t2 = p2.timeSpent || 999;
    if (t1 < t2) {
      winnerName = room.player1.name;
    } else if (t2 < t1) {
      winnerName = room.player2.name;
    } else {
      winnerName = "Egalité";
    }
  }
  
  const resultsPayload = {
    type: "game_over",
    winner: winnerName,
    results: {
      player1: { name: room.player1.name, score: p1.score, timeSpent: p1.timeSpent },
      player2: { name: room.player2.name, score: p2.score, timeSpent: p2.timeSpent }
    }
  };
  
  if (room.player1.ws.readyState === WebSocket.OPEN) {
    room.player1.ws.send(JSON.stringify(resultsPayload));
  }
  if (room.player2.ws.readyState === WebSocket.OPEN) {
    room.player2.ws.send(JSON.stringify(resultsPayload));
  }
  
  delete activeRooms[room.id];
}

// Vite middleware for development
async function startServer() {
  const server = http.createServer(app);
  
  // Set up WebSocket server attached to the HTTP server
  const wss = new WebSocketServer({ server });
  
  wss.on("connection", (ws: WebSocket) => {
    let currentPlayerObj: Player | null = null;
    
    ws.on("message", (msg: string) => {
      try {
        const data = JSON.parse(msg);
        
        switch (data.type) {
          case "join_queue": {
            const { ficheId, playerName, avatar, ficheData } = data;
            const fidNum = parseInt(ficheId);
            if (isNaN(fidNum)) return;
            
            const playerId = Math.random().toString(36).substring(2, 9);
            
            currentPlayerObj = {
              id: playerId,
              ws,
              name: playerName || "Élève mystérieux",
              avatar: avatar || "🧙",
              ficheId: fidNum
            };
            
            if (!matchmakingQueue[fidNum]) {
              matchmakingQueue[fidNum] = [];
            }
            
            // Clean dead connections
            matchmakingQueue[fidNum] = matchmakingQueue[fidNum].filter(p => p.ws.readyState === WebSocket.OPEN);
            
            matchmakingQueue[fidNum].push(currentPlayerObj);
            
            ws.send(JSON.stringify({ type: "queue_joined", playerId }));
            
            checkMatchmaking(fidNum, ficheData);
            break;
          }
          
          case "submit_answer": {
            const { roomId, questionIndex, isCorrect, score } = data;
            const room = activeRooms[roomId];
            if (!room) return;
            
            const isPlayer1 = room.player1.id === currentPlayerObj?.id;
            const progress = isPlayer1 ? room.p1Progress : room.p2Progress;
            const opponent = isPlayer1 ? room.player2 : room.player1;
            
            progress.questionIndex = questionIndex;
            if (isCorrect) progress.score += score || 1;
            
            if (opponent.ws.readyState === WebSocket.OPEN) {
              opponent.ws.send(JSON.stringify({
                type: "opponent_progress",
                questionIndex,
                score: progress.score
              }));
            }
            break;
          }
          
          case "player_finished": {
            const { roomId, timeSpent } = data;
            const room = activeRooms[roomId];
            if (!room) return;
            
            const isPlayer1 = room.player1.id === currentPlayerObj?.id;
            const progress = isPlayer1 ? room.p1Progress : room.p2Progress;
            
            progress.finished = true;
            progress.timeSpent = timeSpent;
            
            if (room.p1Progress.finished && room.p2Progress.finished) {
              declareWinner(room);
            } else {
              const opponent = isPlayer1 ? room.player2 : room.player1;
              if (opponent.ws.readyState === WebSocket.OPEN) {
                opponent.ws.send(JSON.stringify({
                  type: "opponent_finished",
                  opponentScore: progress.score,
                  opponentTime: timeSpent
                }));
              }
            }
            break;
          }
          
          case "leave_competition": {
            handleDisconnect(ws);
            break;
          }
        }
      } catch (err) {
        console.error("[WS ERROR]", err);
      }
    });
    
    ws.on("close", () => {
      handleDisconnect(ws);
    });
    
    ws.on("error", () => {
      handleDisconnect(ws);
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server (HTTP + WebSockets) running on http://localhost:${PORT}`);
  });
}

startServer();
