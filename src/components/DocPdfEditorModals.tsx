import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Check, 
  Trash2, 
  Edit3, 
  Plus, 
  PenTool, 
  Eye, 
  AlignLeft, 
  Bold, 
  Italic, 
  Underline, 
  AlignRight, 
  AlignCenter, 
  List, 
  CloudLightning,
  Type,
  FileText,
  Bookmark,
  Sparkles,
  Award,
  RotateCcw
} from 'lucide-react';

interface PdfEditorModalProps {
  isOpen: boolean;
  fileName: string;
  fileDataUrl: string;
  onClose: () => void;
  initialEditedText?: string;
  initialAnnotations?: string[];
  onSave: (editedText: string, annotations: string[]) => void;
}

export const PdfEditorModal: React.FC<PdfEditorModalProps> = ({
  isOpen,
  fileName,
  onClose,
  initialEditedText = '',
  initialAnnotations = [],
  onSave
}) => {
  const [editedText, setEditedText] = useState(initialEditedText);
  const [newAnnotation, setNewAnnotation] = useState('');
  const [activeTool, setActiveTool] = useState<'view' | 'pen' | 'highlight' | 'note'>('view');
  const [inkColor, setInkColor] = useState('#EF4444'); // Red standard correction ink
  const [highlights, setHighlights] = useState<number[]>([1, 3]); // Mock highlit paragraphs

  // Dynamic feedback systems state
  const [stickyNotes, setStickyNotes] = useState<Array<{ id: string, text: string, x: number, y: number, color: string }>>([]);
  const [drawings, setDrawings] = useState<Array<{ id: string, points: Array<{ x: number, y: number }>, color: string, width: number, isHighlighter?: boolean }>>([]);
  const [generalComments, setGeneralComments] = useState<string[]>([]);

  // Draft active sticky placement state
  const [noteDraft, setNoteDraft] = useState<{ x: number, y: number } | null>(null);
  const [draftText, setDraftText] = useState('');
  const [draftColor, setDraftColor] = useState('#FEF08A'); // yellow post-it default
  const [activeStickyId, setActiveStickyId] = useState<string | null>(null);

  // Parse custom styled notations on mount
  useEffect(() => {
    if (isOpen) {
      setEditedText(initialEditedText || `DEVOIR DE FRANÇAIS - ÉCOLE JUGURTHA
Élève: Adam El Oueslati

I. Lecture Compréhension 📖
[Le jour du carnaval, le village est devenu magnifique. Tout le monde se déguise sous le grand soleil...]

Rédige ci-dessous tes réponses et tes remarques pour le maître :
`);

      const parsedStickies: typeof stickyNotes = [];
      const parsedDrawings: typeof drawings = [];
      const parsedGenerals: string[] = [];

      const sourceAnnotations = initialAnnotations.length > 0 ? initialAnnotations : [
        "Revoir le vocabulaire de la fête",
        "Ajouter des détails sur le costume de Zorro"
      ];

      sourceAnnotations.forEach((ann) => {
        try {
          if (ann.startsWith('{') && ann.endsWith('}')) {
            const parsed = JSON.parse(ann);
            if (parsed && typeof parsed === 'object') {
              if (parsed.type === 'sticky') {
                parsedStickies.push(parsed);
              } else if (parsed.type === 'drawing') {
                parsedDrawings.push(parsed);
              } else {
                parsedGenerals.push(ann);
              }
            } else {
              parsedGenerals.push(ann);
            }
          } else {
            parsedGenerals.push(ann);
          }
        } catch (e) {
          parsedGenerals.push(ann);
        }
      });

      setStickyNotes(parsedStickies);
      setDrawings(parsedDrawings);
      setGeneralComments(parsedGenerals);
      setNoteDraft(null);
      setDraftText('');
      setActiveStickyId(null);
    }
  }, [isOpen, initialEditedText, initialAnnotations]);

  if (!isOpen) return null;

  // Drawing Freehand States & Event Listeners
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeStrokeId, setActiveStrokeId] = useState<string | null>(null);

  const getRelativeCoords = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pxX = e.clientX - rect.left;
    const pxY = e.clientY - rect.top;
    const pctX = (pxX / rect.width) * 100;
    const pctY = (pxY / rect.height) * 100;
    return { 
      x: Math.max(0, Math.min(100, pctX)), 
      y: Math.max(0, Math.min(100, pctY)) 
    };
  };

  const getRelativeTouchCoords = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return { x: 50, y: 50 };
    const pxX = touch.clientX - rect.left;
    const pxY = touch.clientY - rect.top;
    const pctX = (pxX / rect.width) * 100;
    const pctY = (pxY / rect.height) * 100;
    return { 
      x: Math.max(0, Math.min(100, pctX)), 
      y: Math.max(0, Math.min(100, pctY)) 
    };
  };

  const startDrawing = (pctX: number, pctY: number, isHighlighter: boolean) => {
    const strokeId = Date.now().toString() + Math.random().toString().substring(2, 6);
    const color = isHighlighter ? 'rgba(251, 191, 36, 0.4)' : inkColor;
    const width = isHighlighter ? 12 : 3;

    setDrawings(prev => [
      ...prev,
      {
        id: strokeId,
        points: [{ x: pctX, y: pctY }],
        color,
        width,
        isHighlighter
      }
    ]);
    setActiveStrokeId(strokeId);
    setIsDrawing(true);
  };

  const updateDrawing = (pctX: number, pctY: number) => {
    if (!isDrawing || !activeStrokeId) return;
    setDrawings(prev => prev.map(d => {
      if (d.id === activeStrokeId) {
        const lastPt = d.points[d.points.length - 1];
        if (lastPt && Math.hypot(lastPt.x - pctX, lastPt.y - pctY) < 0.3) {
          return d;
        }
        return {
          ...d,
          points: [...d.points, { x: pctX, y: pctY }]
        };
      }
      return d;
    }));
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setActiveStrokeId(null);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'pen' || activeTool === 'highlight') {
      const coords = getRelativeCoords(e);
      startDrawing(coords.x, coords.y, activeTool === 'highlight');
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    const coords = getRelativeCoords(e);
    updateDrawing(coords.x, coords.y);
  };

  const handleCanvasTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (activeTool === 'pen' || activeTool === 'highlight') {
      const coords = getRelativeTouchCoords(e);
      startDrawing(coords.x, coords.y, activeTool === 'highlight');
    }
  };

  const handleCanvasTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    const coords = getRelativeTouchCoords(e);
    updateDrawing(coords.x, coords.y);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool === 'note') {
      const coords = getRelativeCoords(e);
      setNoteDraft({ x: coords.x, y: coords.y });
      setDraftText('');
    }
  };

  const handleAddAnnotation = () => {
    if (newAnnotation.trim()) {
      setGeneralComments([...generalComments, newAnnotation.trim()]);
      setNewAnnotation('');
    }
  };

  const handleDeleteAnnotation = (index: number) => {
    setGeneralComments(generalComments.filter((_, i) => i !== index));
  };

  const addStickyNote = () => {
    if (noteDraft && draftText.trim()) {
      const newNote = {
        id: Date.now().toString() + Math.random().toString().substring(2, 6),
        text: draftText.trim(),
        x: noteDraft.x,
        y: noteDraft.y,
        color: draftColor
      };
      setStickyNotes([...stickyNotes, newNote]);
      setNoteDraft(null);
      setDraftText('');
    }
  };

  const deleteStickyNote = (id: string) => {
    setStickyNotes(stickyNotes.filter(n => n.id !== id));
    if (activeStickyId === id) setActiveStickyId(null);
  };

  const handleUndo = () => {
    setDrawings(prev => prev.slice(0, -1));
  };

  const triggerInject = () => {
    const listStr = [
      ...generalComments.map(c => `- ${c}`),
      ...stickyNotes.map(s => `- [📌 Note sur feuille] ${s.text}`)
    ].join('\n');
    setEditedText(prev => prev + `\n\n📌 Annotations PDF jointes: \n` + listStr);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm no-print">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border-4 border-slate-900 rounded-[36px] overflow-hidden w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-red-650 rounded-xl text-white">
              <FileText size={20} />
            </span>
            <div>
              <h3 className="font-baloo text-lg font-black tracking-tight leading-none">Rédacteur et Annotateur PDF Interactif</h3>
              <p className="text-[10px] text-slate-400 font-mono mt-1 font-bold">{fileName} • (Fichier de l&apos;élève)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-slate-50 border-b-2 border-slate-100 p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider mr-2">Outils PDF :</span>
            <button 
              onClick={() => setActiveTool('view')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${activeTool === 'view' ? 'bg-slate-900 text-white shadow-md' : 'bg-white hover:bg-slate-100 text-slate-600 border'}`}
            >
              <Eye size={14} /> Lire
            </button>
            <button 
              onClick={() => setActiveTool('highlight')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${activeTool === 'highlight' ? 'bg-amber-100 text-amber-800 border-2 border-amber-300 shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-600 border'}`}
            >
              <span className="text-amber-500">✨</span> Surligner
            </button>
            <button 
              onClick={() => setActiveTool('pen')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${activeTool === 'pen' ? 'bg-red-50 text-red-700 border-2 border-red-300 shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-600 border'}`}
            >
              <PenTool size={14} className="text-red-500" /> Écrire au stylo
            </button>
            <button 
              onClick={() => setActiveTool('note')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${activeTool === 'note' ? 'bg-blue-50 text-blue-700 border-2 border-blue-300 shadow-sm' : 'bg-white hover:bg-slate-100 text-slate-600 border'}`}
            >
              <Bookmark size={14} className="text-blue-500" /> Placer un Post-it
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTool === 'pen' && (
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border">
                <button onClick={() => setInkColor('#EF4444')} className={`w-5 h-5 rounded-full bg-red-500 border ${inkColor === '#EF4444' ? 'scale-110 ring-2 ring-red-300' : ''}`} title="Encre Rouge" />
                <button onClick={() => setInkColor('#3B82F6')} className={`w-5 h-5 rounded-full bg-blue-500 border ${inkColor === '#3B82F6' ? 'scale-110 ring-2 ring-blue-300' : ''}`} title="Encre Bleue" />
                <button onClick={() => setInkColor('#10B981')} className={`w-5 h-5 rounded-full bg-emerald-500 border ${inkColor === '#10B981' ? 'scale-110 ring-2 ring-emerald-300' : ''}`} title="Encre Verte" />
              </div>
            )}
            <button
              disabled={drawings.length === 0}
              onClick={handleUndo}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:pointer-events-none text-slate-500 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={10} /> Annuler Trait
            </button>
            <button
              onClick={() => { setDrawings([]); setHighlights([1]); setStickyNotes([]); setGeneralComments([]); }}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-red-300 hover:text-red-500 text-slate-500 rounded-xl text-[10px] font-bold uppercase transition-all"
            >
              Effacer tout
            </button>
          </div>
        </div>

        {/* Workspace Panels (Split layout) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-slate-100">
          
          {/* Left panel: Simulated interactive PDF Page */}
          <div className="p-6 overflow-y-auto flex flex-col items-center justify-start border-r-2 border-slate-200 relative select-none">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2 self-start flex items-center gap-1">
              <span>📄</span> VUE DU DOCUMENT NUMÉRISÉ (PDF) • {activeTool === 'note' ? <span className="text-indigo-600 font-bold animate-pulse">Clickez n&apos;importe où pour poser un Post-it !</span> : "Double cliquez ou glissez pour dessiner."}
            </h4>

            {/* Simulated School Sheet Canvas */}
            <div 
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={handleCanvasTouchStart}
              onTouchMove={handleCanvasTouchMove}
              onTouchEnd={stopDrawing}
              onClick={handleCanvasClick}
              className={`w-full max-w-md bg-white border-2 border-dashed border-red-300 rounded-3xl shadow-lg p-8 relative min-h-[540px] select-none ${
                activeTool === 'pen' || activeTool === 'highlight' ? 'cursor-crosshair' : 
                activeTool === 'note' ? 'cursor-cell' : 'cursor-default'
              }`}
              style={{
                backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px)',
                backgroundSize: '100% 28px',
                lineHeight: '28px'
              }}
            >
              {/* Draft School Title Header card */}
              <div className="border-b-2 border-red-400 pb-3 mb-6 relative">
                <span className="absolute right-0 top-0 text-[10px] bg-red-105 border border-red-300 text-red-600 uppercase font-black px-2 py-0.5 rounded-full">
                  Jugurtha LMS (A+)
                </span>
                <p className="font-baloo text-slate-800 text-sm font-black m-0 leading-none">Cahier de Travail du Soir</p>
                <p className="text-[8px] font-mono text-gray-400 mt-1 uppercase">Devoir d&apos;expression & grammaire</p>
              </div>

              {/* PDF Contents paragraph blocks */}
              <div className="space-y-4 font-serif text-sm text-slate-800 leading-[28px] text-justify pt-1 pr-1">
                <p className={`p-1 rounded transition-colors ${highlights.includes(1) ? 'bg-yellow-200/50 border-l-4 border-amber-500' : ''}`} onClick={(e) => {
                  if (activeTool === 'highlight') {
                    e.stopPropagation();
                    setHighlights(prev => prev.includes(1) ? prev.filter(i => i !== 1) : [...prev, 1]);
                  }
                }}>
                  <strong>Texte de support : Le Carnaval de l&apos;école</strong>
                  <br />
                  Le printemps est enfin là ! Les cloches sonnent gaiement et le village entier se prépare au défilé sous un ciel d&apos;azur splendide.
                </p>

                <p className={`p-1 rounded transition-colors ${highlights.includes(2) ? 'bg-yellow-200/50 border-l-4 border-amber-500' : ''}`} onClick={(e) => {
                  if (activeTool === 'highlight') {
                    e.stopPropagation();
                    setHighlights(prev => prev.includes(2) ? prev.filter(i => i !== 2) : [...prev, 2]);
                  }
                }}>
                  Pour l&apos;occasion, les enfants s&apos;organisent : Jeanne portera son costume de princesse brodé de fils d&apos;or et d&apos;argent, tandis que Marc viendra déguisé en pirate masqué avec un grand sabre en plastique.
                </p>

                <p className={`p-1 rounded transition-colors ${highlights.includes(3) ? 'bg-yellow-200/50 border-l-4 border-amber-500' : ''}`} onClick={(e) => {
                  if (activeTool === 'highlight') {
                    e.stopPropagation();
                    setHighlights(prev => prev.includes(3) ? prev.filter(i => i !== 3) : [...prev, 3]);
                  }
                }}>
                  Chacun apporte son goûter, avec de délicieuses tartelettes, des jus de fruits et des petits pains au lait frais faits maison.
                </p>
              </div>

              {/* Freehand Drawings Vector responsive overlay */}
              <svg className="absolute inset-0 pointer-events-none w-full h-full rounded-3xl z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                {drawings.map((drawing) => {
                  if (drawing.points.length < 1) return null;
                  const pathData = drawing.points
                    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                    .join(' ');

                  return (
                    <path
                      key={drawing.id}
                      d={pathData}
                      fill="none"
                      stroke={drawing.color}
                      strokeWidth={drawing.isHighlighter ? 3.5 : 0.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={drawing.isHighlighter ? 0.45 : 0.9}
                    />
                  );
                })}
              </svg>

              {/* Interactive Sticky Notes positions layered */}
              {stickyNotes.map((note) => {
                const isSelected = activeStickyId === note.id;
                return (
                  <div 
                    key={note.id}
                    className="absolute z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                    style={{ left: `${note.x}%`, top: `${note.y}%` }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveStickyId(isSelected ? null : note.id);
                      }}
                      className="w-8 h-8 rounded-full shadow-lg border-2 border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-xs animate-[bounce_0.6s_ease-out_1]"
                      style={{ backgroundColor: note.color }}
                      title="Post-it placé"
                    >
                      📌
                    </button>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8, y: -5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -5 }}
                          className={`absolute bottom-9 left-1/2 -translate-x-1/2 z-40 p-3 rounded-2xl shadow-2xl w-48 border-2 ${
                            note.color === '#FEF08A' ? 'bg-yellow-50 border-yellow-250 text-amber-955' :
                            note.color === '#DBEAFE' ? 'bg-blue-50 border-blue-250 text-blue-955' :
                            note.color === '#D1FAE5' ? 'bg-emerald-50 border-emerald-250 text-emerald-955' :
                            'bg-pink-50 border-pink-250 text-pink-955'
                          }`}
                        >
                          <div className="flex items-center justify-between border-b pb-1 mb-1.5 opacity-90 text-[10px] font-black uppercase tracking-wider font-mono">
                            <span>Note Active Moniteur</span>
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteStickyNote(note.id);
                              }}
                              className="text-red-600 hover:text-red-800 font-bold transition-all p-0.5 rounded hover:bg-black/5"
                              title="Delete note"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                          <p className="font-sans font-bold text-xs leading-tight whitespace-pre-wrap break-words">{note.text}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Sticky Note Draft Popover */}
              {noteDraft && (
                <div 
                  className="absolute z-50 bg-white border-2 border-indigo-400 p-4 rounded-2xl shadow-2xl w-60 -translate-x-1/2 -translate-y-[110%] pointer-events-auto"
                  style={{ left: `${noteDraft.x}%`, top: `${noteDraft.y}%` }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-2 pb-1 border-b">
                    <span className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1">
                      <span>📌</span> Poser un Post-it
                    </span>
                    <button type="button" onClick={() => setNoteDraft(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                  
                  <textarea
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    placeholder="Saisissez votre commentaire ici..."
                    rows={2}
                    className="w-full p-2 border border-slate-201 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-400 font-sans resize-none mb-3"
                    autoFocus
                  />

                  <div className="flex items-center justify-between gap-2 mt-2">
                    <div className="flex gap-1.5">
                      {[
                        { key: 'yellow', fill: '#FEF08A', bg: 'bg-yellow-200 border-yellow-350' },
                        { key: 'blue', fill: '#DBEAFE', bg: 'bg-blue-200 border-blue-350' },
                        { key: 'green', fill: '#D1FAE5', bg: 'bg-emerald-200 border-emerald-350' },
                        { key: 'pink', fill: '#FCE7F3', bg: 'bg-pink-200 border-pink-350' }
                      ].map(col => (
                        <button
                          key={col.key}
                          type="button"
                          onClick={() => setDraftColor(col.fill)}
                          className={`w-5 h-5 rounded-full border-2 ${col.bg} transition-all ${draftColor === col.fill ? 'scale-125 ring-2 ring-indigo-400' : 'hover:scale-110'}`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addStickyNote}
                      disabled={!draftText.trim()}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-[10px] uppercase font-black tracking-widest transition-all cursor-pointer"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right panel: Content Editing & Text transcript */}
          <div className="p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <span>✏️</span> EXTRACTION DU CONTENU & ÉCRITURE DU DEVOIR
                </h4>
                <button
                  type="button"
                  onClick={triggerInject}
                  className="px-3 py-1 bg-indigo-50 border border-indigo-205 rounded-lg text-[10px] font-black text-indigo-700 hover:bg-indigo-100 uppercase tracking-tight flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles size={11} /> Injecter notes dessous
                </button>
              </div>

              {/* Main text area editor mimicking fine school paper layout */}
              <div className="flex-1 bg-white rounded-3xl border-2 border-slate-200 p-4 shadow-inner flex flex-col overflow-hidden">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full flex-1 p-3 outline-none font-serif leading-[28px] text-justify text-sm text-slate-800 resize-none bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[length:24px_28px]"
                  placeholder="Écris tes réponses et ton texte d'exercice de français ici..."
                />
              </div>

              {/* Sidebar: Dynamic positioned and general remarks list */}
              <div className="bg-white p-4 rounded-2xl border-2 border-slate-150 space-y-3 overflow-y-auto max-h-[180px]">
                {generalComments.length > 0 && (
                  <div>
                    <span className="block text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1.5">📋 Notes Générales :</span>
                    <div className="flex flex-col gap-1">
                      {generalComments.map((ann, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-50 border rounded-lg px-2 py-1 text-xs">
                          <span className="font-semibold text-slate-700 truncate max-w-[90%]">{ann}</span>
                          <button type="button" onClick={() => handleDeleteAnnotation(i)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {stickyNotes.length > 0 && (
                  <div>
                    <span className="block text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1.5">📌 Post-its Positionnés ({stickyNotes.length}) :</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {stickyNotes.map((note) => (
                        <div 
                          key={note.id} 
                          onClick={() => setActiveStickyId(activeStickyId === note.id ? null : note.id)}
                          className={`cursor-pointer border rounded-lg p-1.5 text-[9px] font-bold line-clamp-1 truncate flex items-center justify-between transition-all ${activeStickyId === note.id ? 'ring-2 ring-indigo-400' : 'hover:scale-[1.02]'}`}
                          style={{ backgroundColor: note.color + '50', borderColor: note.color }}
                        >
                          <span className="truncate max-w-[80%]">📍 {note.text}</span>
                          <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); deleteStickyNote(note.id); }} 
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <label className="block text-[10px] font-black uppercase text-slate-505 tracking-wider mt-2">Ajouter un commentaire de correction général 📝</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ex: Soigner l'orthographe..." 
                    value={newAnnotation} 
                    onChange={e => setNewAnnotation(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddAnnotation()}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border-2 border-gray-100 outline-none font-bold text-slate-800 focus:border-indigo-400"
                  />
                  <button 
                    type="button"
                    onClick={handleAddAnnotation}
                    className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="pt-4 border-t flex justify-end gap-3 mt-4">
              <button 
                type="button"
                onClick={onClose} 
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-black uppercase tracking-wider transition-all"
              >
                Annuler
              </button>
              <button 
                type="button"
                onClick={() => {
                  const serializedStickies = stickyNotes.map(n => JSON.stringify({ type: 'sticky', ...n }));
                  const serializedDrawings = drawings.map(d => JSON.stringify({ type: 'drawing', ...d }));
                  onSave(editedText, [...generalComments, ...serializedStickies, ...serializedDrawings]);
                  onClose();
                }} 
                className="px-6 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Check size={16} /> Enregistrer mon Devoir
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};


/* ==================== WORD/DOC FILE EDITOR MODAL ==================== */
interface DocEditorModalProps {
  isOpen: boolean;
  fileName: string;
  fileDataUrl: string;
  onClose: () => void;
  initialEditedText?: string;
  onSave: (editedText: string) => void;
}

export const DocEditorModal: React.FC<DocEditorModalProps> = ({
  isOpen,
  fileName,
  onClose,
  initialEditedText = '',
  onSave
}) => {
  const [editedText, setEditedText] = useState(initialEditedText);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [isWordSaved, setIsWordSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditedText(initialEditedText || `RÉCURSIVE EXERCISES - CLASSE DE JUGURTHA
Document de Devoir : ${fileName}
--------------------------------------------------

Enseignant : M. Yahyaoui
Devoir rédigé par l'élève.

Propose ci-dessous les rédactions demandées de ton sujet :
`);
      setIsWordSaved(false);
    }
  }, [isOpen, initialEditedText, fileName]);

  if (!isOpen) return null;

  const handleApplyToHomework = () => {
    onSave(editedText);
    setIsWordSaved(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm no-print">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-100 border-4 border-slate-900 rounded-[36px] overflow-hidden w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl"
      >
        {/* Modal Header mimicking MS Word / Office 365 style header bar */}
        <div className="bg-blue-800 text-white p-4 flex items-center justify-between border-b-4 border-blue-900">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-blue-105 rounded-xl text-white font-black text-sm">
              W🗂️
            </span>
            <div>
              <h3 className="font-baloo text-base font-black tracking-tight leading-none flex items-center gap-1.5">
                Éditeur de document Word .docx
                {isWordSaved && (
                  <span className="text-[9px] bg-emerald-500 text-white uppercase px-2 py-0.5 rounded-full font-black flex items-center gap-1">
                    <Check size={9} /> Enregistré
                  </span>
                )}
              </h3>
              <p className="text-[9px] text-blue-200 font-mono mt-1 font-bold">{fileName} • (Microsoft Word Édition)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-blue-200 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Word Ribbon Toolbar */}
        <div className="bg-white border-b-2 border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Font Style Tools Block */}
            <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setIsBold(!isBold)} 
                className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${isBold ? 'bg-slate-305 text-blue-850 font-black' : 'text-slate-500'}`}
                title="Gras (Ctrl+B)"
              >
                <Bold size={15} />
              </button>
              <button 
                onClick={() => setIsItalic(!isItalic)} 
                className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${isItalic ? 'bg-slate-305 text-blue-850' : 'text-slate-500'}`}
                title="Italique"
              >
                <Italic size={15} />
              </button>
              <button 
                onClick={() => setIsUnderline(!isUnderline)} 
                className={`p-1.5 rounded-lg hover:bg-slate-200 transition-all ${isUnderline ? 'bg-slate-350 text-blue-850' : 'text-slate-500'}`}
                title="Souligné"
              >
                <Underline size={15} />
              </button>
            </div>

            {/* Align Tools Block */}
            <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setAlignment('left')} 
                className={`p-1.5 rounded-lg transition-all ${alignment === 'left' ? 'bg-slate-340 text-blue-800' : 'text-slate-500 hover:bg-slate-200'}`}
                title="Aligner à gauche"
              >
                <AlignLeft size={15} />
              </button>
              <button 
                onClick={() => setAlignment('center')} 
                className={`p-1.5 rounded-lg transition-all ${alignment === 'center' ? 'bg-slate-340 text-blue-800' : 'text-slate-500 hover:bg-slate-200'}`}
                title="Centrer"
              >
                <AlignCenter size={15} />
              </button>
              <button 
                onClick={() => setAlignment('right')} 
                className={`p-1.5 rounded-lg transition-all ${alignment === 'right' ? 'bg-slate-340 text-blue-800' : 'text-slate-500 hover:bg-slate-200'}`}
                title="Aligner à droite"
              >
                <AlignRight size={15} />
              </button>
            </div>

            {/* Font size Tools Block */}
            <select 
              value={fontSize} 
              onChange={(e: any) => setFontSize(e.target.value)}
              className="px-3 py-1.5 text-xs font-black bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 outline-none text-slate-700 cursor-pointer"
            >
              <option value="sm">Petite taille (12pt)</option>
              <option value="base">Standard (14pt)</option>
              <option value="lg">Grand titre (18pt)</option>
              <option value="xl">Titre En-tête (24pt)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
              <Award size={10} className="animate-spin-slow" /> Jugurtha Word Sync
            </span>
          </div>
        </div>

        {/* Word sheet space (Mock A4 sheet over gray background workspace) */}
        <div className="flex-1 p-8 overflow-y-auto flex justify-center items-start">
          <div 
            className="w-full max-w-3xl bg-white border border-slate-300 rounded-xl shadow-2xl p-12 min-h-[600px] flex flex-col justify-start relative transition-all"
            style={{
              paddingLeft: '3rem',
              paddingRight: '3rem'
            }}
          >
            {/* Mini visual indicator of page borders */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-700 rounded-t-lg" />
            
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className={`w-full flex-1 border-none focus:outline-none resize-none font-serif text-slate-850 leading-relaxed outline-none ${
                fontSize === 'sm' ? 'text-xs' : 
                fontSize === 'base' ? 'text-sm' : 
                fontSize === 'lg' ? 'text-lg' : 'text-2xl'
              } ${isBold ? 'font-bold' : ''} ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline' : ''} ${
                alignment === 'center' ? 'text-center' : 
                alignment === 'right' ? 'text-right' : 'text-left'
              }`}
              placeholder="Saisis ton texte riche ou tes réponses rédigées à ton devoir..."
              style={{
                lineHeight: '1.8',
              }}
            />
          </div>
        </div>

        {/* Word Footer save buttons */}
        <div className="bg-white border-t border-slate-200 p-4 px-6 flex items-center justify-between">
          <div className="text-[10px] text-slate-400 font-bold font-mono">
            Mots saisis : {editedText.trim().split(/\s+/).filter(Boolean).length} mots • Caractères : {editedText.length}
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose} 
              className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border rounded-xl text-xs font-bold text-slate-600 uppercase tracking-wider transition-all"
            >
              Fermer
            </button>
            <button 
              onClick={handleApplyToHomework}
              className="px-8 py-2.5 bg-blue-700 hover:bg-emerald-600 hover:scale-102 transition-all text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 cursor-pointer flex items-center gap-2"
            >
              <Check size={16} /> Enregistrer & Sync Devoir
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
