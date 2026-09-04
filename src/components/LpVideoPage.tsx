import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Shield,
  FileSpreadsheet,
  Printer,
  Compass,
  Zap,
  Sliders,
  Award,
  Layers,
  Search,
} from 'lucide-react';
import { CIPCard } from './CIPCard';
import { PRESET_PROMPTS, INITIAL_SAMPLE_WORKS } from '../data/cddCduData';
import { CIPRecord } from '../types';

export const LpVideoPage: React.FC = () => {
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [isPlayingDemo, setIsPlayingDemo] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const selectedPreset = PRESET_PROMPTS[activePresetIndex];

  // Typewriter effect simulation for AI CIP generation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullText = `[IA ANALISANDO TÍTULO E GÊNERO]
Obra: "${selectedPreset.title}"
Autor: ${selectedPreset.author}
Assuntos Detectados: ${selectedPreset.subjects.join(', ')}
Classificação Sugerida: CDD ${selectedPreset.cdd} | CDU ${selectedPreset.cdu}
Cutter-Sanborn Calculado: ${selectedPreset.cutter}
Validação ABNT NBR 6023 / AACR2: Conforme (100%)
Status: Ficha CIP gerada e pronta para publicação!`;

    setTypedText('');
    setIsTypingComplete(false);
    let index = 0;

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [activePresetIndex]);

  const currentPreviewRecord: CIPRecord = {
    id: `demo-${activePresetIndex}`,
    title: selectedPreset.title,
    author: selectedPreset.author,
    city: selectedPreset.city,
    publisher: selectedPreset.publisher,
    year: selectedPreset.year,
    pages: selectedPreset.pages,
    isbn: selectedPreset.isbn,
    cdd: selectedPreset.cdd,
    cddDescription: selectedPreset.genre,
    cdu: selectedPreset.cdu,
    cduDescription: selectedPreset.genre,
    cutter: selectedPreset.cutter,
    subjects: selectedPreset.subjects,
    confidenceScore: 99.2,
    crbNumber: 'CRB-8/10425',
    aiNotes: `Classificação automática por IA treinada em 45 regras temáticas e 100 divisões CDD/CDU.`,
    timestamp: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-[#0f1318] text-stone-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-amber-900/40 via-amber-800/30 to-stone-900 border-b border-amber-800/40 px-4 py-2.5 text-center text-xs text-amber-200">
        <span className="font-semibold text-amber-100">Fichário IA v2.5:</span> Catalogação CIP instantânea em conformidade com o Conselho Federal de Biblioteconomia.
        <Link to="/catalogo" className="ml-2 font-bold underline hover:text-white inline-flex items-center gap-1">
          Abrir Fichário Completo <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Hero Section with Video/Interactive Presentation */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-800/80 border border-stone-700 text-xs text-amber-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Inteligência Artificial para Bibliotecas & Editoras</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
            Gere Fichas Catalográficas CIP e Classifique em <span className="text-amber-400 underline decoration-amber-600 decoration-4 underline-offset-8">CDD e CDU</span> em Segundos
          </h1>

          <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            Elimine horas de busca manual em tabelas impressas. O Fichário IA combina uma base temática de regras especializadas, cálculo automático de código Cutter-Sanborn e formatação padrão ABNT.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/catalogo"
              className="px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-stone-950" />
              Experimentar Gerador CIP
            </Link>
            <Link
              to="/classificacao"
              className="px-6 py-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-medium text-sm transition-all inline-flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              Navegar 100 Divisões CDD
            </Link>
          </div>
        </div>

        {/* Video Pitch Showcase & Simulated Screen */}
        <div className="mt-14 max-w-5xl mx-auto bg-stone-900/90 border border-stone-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Mock Window Titlebar */}
          <div className="bg-stone-950/80 px-4 py-3 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-3 font-mono text-xs text-stone-400">
                fichario-ia // demonstração-interativa-cip.mp4
              </span>
            </div>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/50">
              ● HD 1080p • 60 FPS
            </span>
          </div>

          {/* Interactive Screen Container */}
          <div className="p-6 lg:p-8 bg-[#13171e] grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Console / Video Controller */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
                  Testar com Obra de Referência:
                </span>
                <span className="text-[11px] text-stone-400">Base de 30 Clássicos</span>
              </div>

              {/* Selector Pills */}
              <div className="space-y-2">
                {PRESET_PROMPTS.map((preset, idx) => (
                  <button
                    key={preset.title}
                    onClick={() => setActivePresetIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs font-sans transition-all flex items-center justify-between ${
                      activePresetIndex === idx
                        ? 'bg-amber-950/50 border-amber-500 text-amber-200 shadow-sm'
                        : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="font-bold text-stone-100 truncate">{preset.title}</p>
                      <p className="text-[11px] text-stone-400">{preset.author}</p>
                    </div>
                    <span className="font-mono text-[10px] shrink-0 text-amber-400 bg-stone-950 px-1.5 py-0.5 rounded">
                      CDD {preset.cdd}
                    </span>
                  </button>
                ))}
              </div>

              {/* Typewriter Stream Terminal */}
              <div className="bg-stone-950 rounded-xl p-4 border border-stone-800 text-xs font-mono text-emerald-400 space-y-1 shadow-inner h-44 overflow-y-auto">
                <div className="text-stone-500 text-[10px] pb-1 border-b border-stone-800 flex justify-between">
                  <span>LOG DO MOTOR SEMÂNTICO</span>
                  <span>{isTypingComplete ? 'COMPLETO' : 'PROCESSANDO...'}</span>
                </div>
                <pre className="whitespace-pre-wrap font-mono text-emerald-300/90 leading-relaxed text-[11px]">
                  {typedText}
                  <span className="inline-block w-2 h-3.5 bg-emerald-400 ml-0.5 animate-pulse" />
                </pre>
              </div>
            </div>

            {/* Right: Live Rendered CIP Card */}
            <div className="lg:col-span-7">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-mono text-stone-400 uppercase tracking-wide">
                  Resultado em Tempo Real (Preview ABNT)
                </span>
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Carimbo Catalográfico Homologado
                </span>
              </div>
              <CIPCard record={currentPreviewRecord} />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section className="py-16 bg-stone-900/60 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Arquitetura Bibliotecária com Inteligência de Precisão
            </h2>
            <p className="text-stone-400 text-sm mt-2">
              Desenvolvido de acordo com as diretrizes do AACR2, RDA e normas da Associação Brasileira de Normas Técnicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl space-y-3">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg w-fit">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-100">Geração Instantânea CIP</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Preencha os metadados do livro ou selecione da base temática para ter a ficha catalográfica diagramada, com numeração Cutter e traçado de assuntos.
              </p>
            </div>

            <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl space-y-3">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg w-fit">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-100">Navegador CDD & CDU</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Acesse as 100 divisões da Classificação Decimal de Dewey (000 a 900) e notações CDU com busca reversa por palavras-chave e aplicação direta na ficha.
              </p>
            </div>

            <div className="bg-stone-900 border border-stone-800 p-6 rounded-xl space-y-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg w-fit">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-100">Acervo & Exportação</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Guarde seu acervo persistente no navegador com estatísticas automáticas de classes e exporte em JSON, CSV ou impressão direta com carimbo oficial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Stats */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-6 bg-stone-900/80 rounded-xl border border-stone-800">
            <span className="block text-3xl font-serif font-bold text-amber-400">100%</span>
            <span className="text-xs text-stone-400 uppercase font-mono mt-1 block">Conformidade ABNT</span>
          </div>
          <div className="p-6 bg-stone-900/80 rounded-xl border border-stone-800">
            <span className="block text-3xl font-serif font-bold text-emerald-400">100</span>
            <span className="text-xs text-stone-400 uppercase font-mono mt-1 block">Divisões CDD Mapeadas</span>
          </div>
          <div className="p-6 bg-stone-900/80 rounded-xl border border-stone-800">
            <span className="block text-3xl font-serif font-bold text-blue-400">30+</span>
            <span className="text-xs text-stone-400 uppercase font-mono mt-1 block">Obras de Referência</span>
          </div>
          <div className="p-6 bg-stone-900/80 rounded-xl border border-stone-800">
            <span className="block text-3xl font-serif font-bold text-purple-400">&lt; 3 seg</span>
            <span className="text-xs text-stone-400 uppercase font-mono mt-1 block">Geração Média</span>
          </div>
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-16 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border border-amber-800/40 rounded-2xl p-8 sm:p-12 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            Pronto para catalogar seu acervo com precisão de inteligência artificial?
          </h2>
          <p className="text-stone-300 text-sm max-w-xl mx-auto">
            Acesse o ambiente completo do Fichário IA e gere fichas prontas para impressão e envio à gráfica.
          </p>
          <div className="pt-2">
            <Link
              to="/catalogo"
              className="px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              Abrir Gerador do Fichário Agora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-800 py-8 text-center text-xs text-stone-500 font-mono">
        Fichário — IA de Catalogação e Classificação CDD/CDU • Padrão de Roteamento Híbrido Agressivo Ativo
      </footer>
    </div>
  );
};
