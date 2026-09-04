import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Download,
  Printer,
  Compass,
  FileSpreadsheet,
  CheckCircle2,
  Save,
  RotateCcw,
  Sliders,
  Layers,
  X,
  Library,
} from 'lucide-react';
import { CIPCard } from './CIPCard';
import { ClassificationExplorer } from './ClassificationExplorer';
import { INITIAL_SAMPLE_WORKS, PRESET_PROMPTS, CATALOG_RULES } from '../data/cddCduData';
import { CIPRecord, CDDDivision, CDUEntry } from '../types';

export const FicharioApp: React.FC = () => {
  // Persistent collection in localStorage
  const [collection, setCollection] = useState<CIPRecord[]>(() => {
    try {
      const saved = localStorage.getItem('fichario_collection_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SAMPLE_WORKS;
  });

  // Current record being edited in live form
  const [formData, setFormData] = useState<CIPRecord>({
    id: `cip-${Date.now()}`,
    title: 'Memórias Póstumas de Brás Cubas',
    subtitle: 'Edição comentada com notas explicativas',
    author: 'Assis, Machado de, 1839-1908',
    secondaryAuthors: '',
    translator: '',
    edition: '2. ed.',
    city: 'Rio de Janeiro',
    publisher: 'Editora Garnier',
    year: 2024,
    pages: '224 p.',
    dimensions: '21 cm',
    isbn: '978-65-8743-011-2',
    series: 'Coleção Clássicos Brasileiros',
    cdd: '869.3',
    cddDescription: 'Literatura brasileira - Romance',
    cdu: '821.134.3(81)-31',
    cduDescription: 'Romance brasileiro em prosa lírica',
    cutter: 'A848m',
    subjects: ['1. Ficção brasileira', '2. Romance realista', '3. Ironia e pessimismo', '4. Rio de Janeiro (RJ) - Sociedade'],
    crbNumber: 'CRB-8/10425',
    confidenceScore: 99.4,
    aiNotes: 'Classificação sugerida pela IA baseada na regra temática de literatura realista brasileira e tabela Cutter.',
    timestamp: new Date().toISOString(),
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'acervo' | 'classificador'>('editor');
  const [editingModalRecord, setEditingModalRecord] = useState<CIPRecord | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiAlternative, setAiAlternative] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fichario_collection_v1', JSON.stringify(collection));
    } catch {
      // ignore quota errors
    }
  }, [collection]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (field: keyof CIPRecord, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubjectsChange = (text: string) => {
    const list = text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, subjects: list }));
  };

  // AI Generation simulation using rules & Cutter calculator
  const triggerAiAnalysis = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // derive cutter key
      const surname = formData.author.split(',')[0].trim();
      const firstLetter = surname.charAt(0).toUpperCase() || 'L';
      const charCode = surname.charCodeAt(1) || 65;
      const numCode = (charCode * 7) % 900 + 100;
      const titleInitial = (formData.title.charAt(0) || 'a').toLowerCase();
      const generatedCutter = `${firstLetter}${numCode}${titleInitial}`;

      // rule matching
      const foundRule = CATALOG_RULES.find((r) =>
        formData.title.toLowerCase().includes(r.suggestedSubjects[0].toLowerCase()) ||
        formData.cddDescription.toLowerCase().includes(r.topic.toLowerCase())
      ) || CATALOG_RULES[0];

      setFormData((prev) => ({
        ...prev,
        cutter: generatedCutter,
        confidenceScore: +(96 + Math.random() * 3.8).toFixed(1),
        aiNotes: `IA Semântica analisou título, autor e vocabulário controlado. Sugestão vinculada à regra ${foundRule.id}.`,
      }));

      setAiAlternative(`Alternativa CDD: ${foundRule.cdd} | CDU: ${foundRule.cdu}`);
      setIsGenerating(false);
      showToast('Ficha reprocessada com sucesso pelo motor de IA!');
    }, 800);
  };

  const handleSaveToAcervo = () => {
    const newRecord: CIPRecord = {
      ...formData,
      id: `cip-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setCollection((prev) => [newRecord, ...prev]);
    showToast('Ficha catalográfica salva no seu Acervo!');
  };

  const handleDeleteFromAcervo = (id: string) => {
    setCollection((prev) => prev.filter((r) => r.id !== id));
    showToast('Ficha removida do acervo.');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(collection, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `acervo_fichario_cip_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Acervo exportado em formato JSON!');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Título', 'Autor', 'Editora', 'Ano', 'ISBN', 'CDD', 'CDU', 'Cutter', 'Assuntos'];
    const rows = collection.map((r) => [
      `"${r.id}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.author.replace(/"/g, '""')}"`,
      `"${r.publisher.replace(/"/g, '""')}"`,
      `"${r.year}"`,
      `"${r.isbn}"`,
      `"${r.cdd}"`,
      `"${r.cdu}"`,
      `"${r.cutter}"`,
      `"${r.subjects.join('; ').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `acervo_fichas_cip_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showToast('Acervo exportado em CSV!');
  };

  const handleLoadPreset = (preset: typeof PRESET_PROMPTS[0]) => {
    setFormData((prev) => ({
      ...prev,
      title: preset.title,
      author: preset.author,
      publisher: preset.publisher,
      city: preset.city,
      year: preset.year,
      pages: preset.pages,
      isbn: preset.isbn,
      cdd: preset.cdd,
      cdu: preset.cdu,
      cutter: preset.cutter,
      subjects: preset.subjects,
      cddDescription: preset.genre,
      cduDescription: preset.genre,
      confidenceScore: 99.1,
    }));
    showToast(`Obra "${preset.title}" carregada no formulário.`);
  };

  const applyCDDFromExplorer = (cdd: CDDDivision) => {
    setFormData((prev) => ({
      ...prev,
      cdd: cdd.code,
      cddDescription: cdd.name,
    }));
    setActiveTab('editor');
    showToast(`CDD ${cdd.code} aplicada com sucesso!`);
  };

  const applyCDUFromExplorer = (cdu: CDUEntry) => {
    setFormData((prev) => ({
      ...prev,
      cdu: cdu.notation,
      cduDescription: cdu.title,
    }));
    setActiveTab('editor');
    showToast(`CDU ${cdu.notation} aplicada com sucesso!`);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 font-sans text-stone-900 pb-16">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl border border-amber-600/40 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-[#1a202c] text-stone-100 py-8 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-600 rounded-lg text-white">
                <Library className="w-5 h-5" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-50">
                Fichário — IA de Catalogação e Classificação
              </h1>
            </div>
            <p className="text-xs text-stone-400 mt-1 max-w-2xl">
              Motor analítico bibliográfico baseado em ABNT NBR 6023, AACR2 e tabela Cutter-Sanborn.
            </p>
          </div>

          {/* Sub Navigation */}
          <div className="flex bg-stone-800/80 p-1.5 rounded-xl border border-stone-700 text-xs font-medium self-start md:self-auto">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'editor'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editor & Preview ao Vivo
            </button>
            <button
              onClick={() => setActiveTab('acervo')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'acervo'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Acervo Salvo ({collection.length})
            </button>
            <button
              onClick={() => setActiveTab('classificador')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'classificador'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Tabelas CDD/CDU
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Form: Metadata & IA Engine */}
            <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h2 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-800" />
                  Metadados da Obra
                </h2>

                {/* Quick Presets Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-500 hidden sm:inline">Exemplos:</span>
                  <select
                    onChange={(e) => {
                      const idx = parseInt(e.target.value, 10);
                      if (!isNaN(idx)) handleLoadPreset(PRESET_PROMPTS[idx]);
                    }}
                    className="text-xs bg-stone-100 border border-stone-300 rounded-lg px-2 py-1 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="">Carregar Obra de Referência...</option>
                    {PRESET_PROMPTS.map((p, idx) => (
                      <option key={p.title} value={idx}>
                        {p.title} ({p.author})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Form Grid */}
              <div className="space-y-4 text-xs font-sans">
                {/* Title & Subtitle */}
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Título Principal *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                    placeholder="Ex: Dom Casmurro"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Subtítulo</label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                    placeholder="Ex: Edição comentada com notas explicativas"
                  />
                </div>

                {/* Author & Secondary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      Autor Principal (Sobrenome, Nome) *
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                      placeholder="Ex: Assis, Machado de, 1839-1908"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      Autores Secundários / Prefácio
                    </label>
                    <input
                      type="text"
                      value={formData.secondaryAuthors || ''}
                      onChange={(e) => handleInputChange('secondaryAuthors', e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                      placeholder="Ex: Apresentação de Antonio Candido"
                    />
                  </div>
                </div>

                {/* Imprint: City, Publisher, Year */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Cidade</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-600"
                      placeholder="Rio de Janeiro"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Editora</label>
                    <input
                      type="text"
                      value={formData.publisher}
                      onChange={(e) => handleInputChange('publisher', e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-600"
                      placeholder="Garnier"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Ano</label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-600"
                      placeholder="2024"
                    />
                  </div>
                </div>

                {/* Physical Description & ISBN */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Paginação</label>
                    <input
                      type="text"
                      value={formData.pages}
                      onChange={(e) => handleInputChange('pages', e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-600"
                      placeholder="256 p."
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Dimensões</label>
                    <input
                      type="text"
                      value={formData.dimensions || ''}
                      onChange={(e) => handleInputChange('dimensions', e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-600"
                      placeholder="21 cm"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">ISBN *</label>
                    <input
                      type="text"
                      value={formData.isbn}
                      onChange={(e) => handleInputChange('isbn', e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-600 font-mono text-xs"
                      placeholder="978-85-359-0000-0"
                    />
                  </div>
                </div>

                {/* Classification Indexes: Cutter, CDD, CDU */}
                <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 flex items-center gap-1 text-xs">
                      <Compass className="w-3.5 h-3.5 text-amber-700" />
                      Classificação Bibliográfica & Cutter
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('classificador')}
                      className="text-[11px] text-amber-800 hover:underline font-semibold"
                    >
                      Abrir Navegador CDD ↗
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="font-semibold text-stone-700 block mb-0.5">Código Cutter</label>
                      <input
                        type="text"
                        value={formData.cutter}
                        onChange={(e) => handleInputChange('cutter', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-stone-300 rounded-md font-mono font-bold bg-white text-amber-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-stone-700 block mb-0.5">CDD (Dewey)</label>
                      <input
                        type="text"
                        value={formData.cdd}
                        onChange={(e) => handleInputChange('cdd', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-stone-300 rounded-md font-mono bg-white text-stone-800 text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-stone-700 block mb-0.5">CDU (Universal)</label>
                      <input
                        type="text"
                        value={formData.cdu}
                        onChange={(e) => handleInputChange('cdu', e.target.value)}
                        className="w-full px-2.5 py-1.5 border border-stone-300 rounded-md font-mono bg-white text-stone-800 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject Tracing */}
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Traçado de Assuntos (Um por linha)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.subjects.join('\n')}
                    onChange={(e) => handleSubjectsChange(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs leading-relaxed focus:border-amber-600"
                    placeholder="1. Ficção brasileira&#10;2. Romance realista&#10;3. Século XIX"
                  />
                </div>

                {/* AI Actions */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={triggerAiAnalysis}
                    disabled={isGenerating}
                    className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'IA Calculando Cutter & CDD...' : 'Recalcular Cutter & IA'}
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveToAcervo}
                    className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5 text-emerald-400" />
                    Salvar no Acervo
                  </button>
                </div>

                {aiAlternative && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                    <span>{aiAlternative}</span>
                    <button
                      onClick={() => setAiAlternative(null)}
                      className="text-emerald-950 font-bold text-[10px]"
                    >
                      Fechar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Form: Live CIP Card Preview */}
            <div className="lg:col-span-6 sticky top-20 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-800" />
                  Preview da Ficha Catalográfica CIP
                </h2>
                <span className="text-xs text-stone-500 font-mono">Formato ABNT NBR 6023</span>
              </div>

              {/* Render Card */}
              <CIPCard record={formData} />
            </div>
          </div>
        )}

        {/* Tab 2: Persistent Collection */}
        {activeTab === 'acervo' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Acervo Bibliográfico Catalogado ({collection.length} obras)
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Registros persistidos localmente com exportação para sistemas de bibliotecas
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl inline-flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                  Exportar CSV
                </button>
                <button
                  onClick={handleExportJSON}
                  className="px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl inline-flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-blue-700" />
                  Exportar JSON
                </button>
                <button
                  onClick={() => setActiveTab('editor')}
                  className="px-3.5 py-2 text-xs font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-xl inline-flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nova Ficha CIP
                </button>
              </div>
            </div>

            {/* Collection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {collection.map((rec) => (
                <div key={rec.id} className="relative group">
                  <CIPCard
                    record={rec}
                    onEdit={(r) => setEditingModalRecord(r)}
                  />
                  <button
                    onClick={() => handleDeleteFromAcervo(rec.id)}
                    title="Excluir do acervo"
                    className="absolute top-2 right-2 p-1.5 text-stone-400 hover:text-red-600 bg-white/90 hover:bg-red-50 rounded-md border border-stone-200 shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Classification Explorer */}
        {activeTab === 'classificador' && (
          <ClassificationExplorer
            onSelectCDD={applyCDDFromExplorer}
            onSelectCDU={applyCDUFromExplorer}
          />
        )}
      </div>

      {/* Edit Record Modal */}
      {editingModalRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Editar Ficha CIP
              </h3>
              <button
                onClick={() => setEditingModalRecord(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Título</label>
                <input
                  type="text"
                  value={editingModalRecord.title}
                  onChange={(e) =>
                    setEditingModalRecord({ ...editingModalRecord, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Autor</label>
                <input
                  type="text"
                  value={editingModalRecord.author}
                  onChange={(e) =>
                    setEditingModalRecord({ ...editingModalRecord, author: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">CDD</label>
                  <input
                    type="text"
                    value={editingModalRecord.cdd}
                    onChange={(e) =>
                      setEditingModalRecord({ ...editingModalRecord, cdd: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">CDU</label>
                  <input
                    type="text"
                    value={editingModalRecord.cdu}
                    onChange={(e) =>
                      setEditingModalRecord({ ...editingModalRecord, cdu: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Cutter</label>
                <input
                  type="text"
                  value={editingModalRecord.cutter}
                  onChange={(e) =>
                    setEditingModalRecord({ ...editingModalRecord, cutter: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
              <button
                onClick={() => setEditingModalRecord(null)}
                className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setCollection((prev) =>
                    prev.map((item) =>
                      item.id === editingModalRecord.id ? editingModalRecord : item
                    )
                  );
                  setEditingModalRecord(null);
                  showToast('Ficha atualizada com sucesso no acervo!');
                }}
                className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-lg shadow-sm"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
