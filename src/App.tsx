/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  HashRouter,
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sitemap } from './components/Sitemap';
import { LpVideoPage } from './components/LpVideoPage';
import { FicharioApp } from './components/FicharioApp';
import { ClassificationExplorer } from './components/ClassificationExplorer';

/**
 * Detecção de Ambiente (Roteamento Híbrido Agressivo)
 * Retorna true se o hostname ou href contiver qualquer um dos indicadores
 * de proxies e ambientes de desenvolvimento em nuvem (Google IDX, Cloud Run, StackBlitz, etc.)
 */
export function checkPreviewEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  const { hostname, href } = window.location;
  const proxyIndicators = [
    'googleusercontent',
    'webcontainer',
    'shim',
    '.goog',
    'scf.usercontent',
    'stackblitz',
    'codesandbox',
  ];
  return proxyIndicators.some(
    (indicator) => hostname.includes(indicator) || href.includes(indicator)
  );
}

export default function App() {
  const isPreview = checkPreviewEnvironment();
  // Se for Ambiente de Preview: Use HashRouter (evita quebra de sub-rotas em proxies).
  // Se for Produção: Use BrowserRouter (obrigatório para UTMs, pixels de anúncios e SEO).
  const Router = isPreview ? HashRouter : BrowserRouter;

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-stone-100 text-stone-900 font-sans selection:bg-amber-500/20 selection:text-amber-900">
        <Navbar isPreview={isPreview} />

        <main className="flex-1">
          <Routes>
            {/* Redirecionamento Inteligente da Raiz (/):
                - Preview: /sitemap (facilita testes e navegação ágil entre rotas)
                - Produção: /lp-video (rota principal de conversão e vídeo pitch) */}
            <Route
              path="/"
              element={<Navigate to={isPreview ? '/sitemap' : '/lp-video'} replace />}
            />

            {/* Rota da Landing Page Principal com Demonstração em Vídeo */}
            <Route path="/lp-video" element={<LpVideoPage />} />

            {/* Rota do Sitemap / Diagnóstico de Infraestrutura */}
            <Route path="/sitemap" element={<Sitemap />} />

            {/* Rota do Fichário IA Completo (Gerador CIP, Datilografia & Acervo) */}
            <Route path="/catalogo" element={<FicharioApp />} />
            <Route path="/app" element={<Navigate to="/catalogo" replace />} />
            <Route path="/fichario" element={<Navigate to="/catalogo" replace />} />

            {/* Rota do Navegador de CDD e CDU */}
            <Route
              path="/classificacao"
              element={
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <ClassificationExplorer />
                </div>
              }
            />

            {/* Fallback de rotas não encontradas */}
            <Route
              path="*"
              element={<Navigate to={isPreview ? '/sitemap' : '/lp-video'} replace />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
