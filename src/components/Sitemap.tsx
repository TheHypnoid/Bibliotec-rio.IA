import React from 'react';
import { Link } from 'react-router-dom';
import { checkPreviewEnvironment } from '../App';
import {
  Network,
  ExternalLink,
  ShieldCheck,
  Server,
  Terminal,
  Layers,
  ArrowRight,
  BookOpen,
  Compass,
  Sparkles,
  CheckCircle2,
  FileCode2,
} from 'lucide-react';

export const Sitemap: React.FC = () => {
  const isPreview = checkPreviewEnvironment();
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const currentHref = typeof window !== 'undefined' ? window.location.href : '';

  const allowlist = [
    'googleusercontent',
    'webcontainer',
    'shim',
    '.goog',
    'scf.usercontent',
    'stackblitz',
    'codesandbox',
  ];

  const matchedPattern = allowlist.find(
    (pattern) => currentHostname.includes(pattern) || currentHref.includes(pattern)
  );

  const routes = [
    {
      path: '/lp-video',
      name: 'Landing Page & Vídeo Pitch',
      type: 'Produção / Primária',
      description: 'Apresentação comercial e interativa do Fichário IA, com vídeo demonstrativo, simulador CIP com datilografia e comparativo.',
      icon: Sparkles,
      color: 'from-amber-600 to-amber-700',
    },
    {
      path: '/catalogo',
      name: 'Fichário IA & Acervo CIP',
      type: 'Aplicação Principal',
      description: 'Gerador inteligente de fichas catalográficas ABNT/AACR2, editor manual com preview em tempo real e exportação.',
      icon: BookOpen,
      color: 'from-emerald-600 to-teal-700',
    },
    {
      path: '/classificacao',
      name: 'Navegador CDD & CDU',
      type: 'Base Documental',
      description: 'Explorador das 100 divisões CDD (000 a 900) e notações CDU com busca semântica reversa por palavras-chave.',
      icon: Compass,
      color: 'from-blue-600 to-indigo-700',
    },
    {
      path: '/sitemap',
      name: 'Sitemap & Diagnóstico de Rota',
      type: 'Infraestrutura / Dev',
      description: 'Painel de inspeção do Roteamento Híbrido Agressivo, detecção de proxy e mapa navegável de rotas do projeto.',
      icon: Network,
      color: 'from-stone-700 to-stone-800',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-stone-900">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-stone-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-900 text-amber-100 rounded-xl shadow-sm">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                Mapa do Site & Roteamento Híbrido
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Arquitetura de roteamento adaptativo para ambientes de Cloud Sandbox e Produção
              </p>
            </div>
          </div>
        </div>

        {/* Environment Diagnostic Banner */}
        <div className="bg-white border border-stone-300/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-stone-700" />
              <h2 className="text-lg font-semibold text-stone-900">
                Status da Detecção de Ambiente (checkPreviewEnvironment)
              </h2>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                isPreview
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isPreview ? 'bg-blue-600 animate-ping' : 'bg-emerald-600'}`} />
              {isPreview ? 'Ambiente de Preview Ativo' : 'Ambiente de Produção Ativo'}
            </span>
          </div>

          {/* Table / Key-Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono bg-stone-100/70 p-4 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-500 block">Hostname atual:</span>
              <span className="text-stone-900 font-semibold break-all">{currentHostname}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Roteador Selecionado:</span>
              <span className="text-amber-900 font-bold">
                {isPreview ? '<HashRouter> (Sem quebra de sub-rotas)' : '<BrowserRouter> (SEO & UTMs)'}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block">Padrão Detectado:</span>
              <span className="text-emerald-700 font-semibold">
                {matchedPattern ? `Correspondência encontrada: "${matchedPattern}"` : 'Nenhum proxy detectado (Modo Nativo/Produção)'}
              </span>
            </div>
            <div>
              <span className="text-stone-500 block">Redirecionamento da raiz (/):</span>
              <span className="text-stone-800 font-semibold">
                {isPreview ? '-> /sitemap (Preview Mode)' : '-> /lp-video (Production LP)'}
              </span>
            </div>
          </div>

          {/* Proxy Indicators Allowlist Chips */}
          <div>
            <span className="text-xs font-semibold text-stone-700 block mb-2">
              Lista de verificação de Proxy (Allowlist):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {allowlist.map((item) => {
                const isMatched = currentHostname.includes(item) || currentHref.includes(item);
                return (
                  <span
                    key={item}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                      isMatched
                        ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold ring-1 ring-amber-400'
                        : 'bg-stone-100 text-stone-600 border-stone-300'
                    }`}
                  >
                    {isMatched ? `✓ ${item}` : item}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Route Index List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900 font-serif">
              Rotas Disponíveis no Projeto
            </h2>
            <span className="text-xs text-stone-500 font-mono">Total: {routes.length} rotas mapeadas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routes.map((route) => {
              const Icon = route.icon;
              return (
                <div
                  key={route.path}
                  className="bg-white border border-stone-200/90 rounded-xl p-5 hover:border-amber-700/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${route.color} text-white shadow-sm`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-stone-900 text-base">{route.name}</h3>
                          <span className="font-mono text-xs text-amber-900 font-semibold">{route.path}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                        {route.type}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed mt-2">{route.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <Link
                      to={route.path}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 hover:text-amber-700 transition-colors"
                    >
                      Acessar Rota
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {isPreview ? `#${route.path}` : route.path}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Architecture Note */}
        <div className="bg-amber-950 text-amber-100 rounded-2xl p-6 shadow-md border border-amber-800/40">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-2 text-xs leading-relaxed text-amber-200/90">
              <h3 className="font-bold text-sm text-white font-serif">
                Por que o Padrão de Roteamento Híbrido Agressivo?
              </h3>
              <p>
                Ambientes como <strong>Google Cloud Run, Google IDX, Stackblitz e WebContainers</strong> realizam proxy reverso em caminhos profundos. O tradicional <code>BrowserRouter</code> perde o ponto de entrada estático ao recarregar a página, resultando no erro <em>&quot;Cannot GET /rota&quot;</em> ou falha de matching do React Router.
              </p>
              <p>
                Com a detecção dinâmica via <code>checkPreviewEnvironment()</code>, o app usa <strong>HashRouter</strong> em ambientes de teste sem alterar uma única linha de código ao subir para a <strong>Vercel</strong> ou <strong>AWS</strong> (onde o <code>BrowserRouter</code> assume o controle para rastreamento de campanhas, SEO e parâmetros UTM).
              </p>
              <div className="pt-2 flex items-center gap-2 text-amber-300 font-mono text-[11px]">
                <FileCode2 className="w-4 h-4" />
                <span>Base Vite configurada com sucesso: <code>base: &apos;./&apos;</code></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
