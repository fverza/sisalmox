import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Server, 
  Database, 
  Package, 
  ChevronRight, 
  Activity,
  Layers,
  ArrowUpRight,
  Sliders
} from 'lucide-react';
import axios from 'axios';

function App() {
  const [health, setHealth] = useState({ status: 'LOADING', services: null, error: null });
  const [checking, setChecking] = useState(false);

  const checkHealth = async () => {
    setChecking(true);
    try {
      // Accessing backend API (docker backend container or local)
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/health`);
      setHealth({
        status: response.data.status,
        services: response.data.services,
        error: null
      });
    } catch (err) {
      setHealth({
        status: 'DOWN',
        services: { database: 'DISCONNECTED', api: 'DISCONNECTED' },
        error: err.message || 'Erro ao conectar com a API'
      });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-[#070b13] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,80,127,0.15),rgba(255,255,255,0))] pb-12">
      {/* Top Banner / Header */}
      <header className="sticky top-0 z-50 glassmorphism border-b border-slate-800/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-brand-400 rounded-xl shadow-lg shadow-brand-500/10">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">PMESP</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                <span className="text-xs font-mono text-slate-400">v1.0.0 (Alpha)</span>
              </div>
              <h1 id="app-title" className="text-xl font-bold tracking-tight text-white font-outfit">sisalmox</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className="text-slate-400">API Status:</span>
              {health.status === 'UP' ? (
                <span className="flex items-center space-x-1 font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>ONLINE</span>
                </span>
              ) : health.status === 'LOADING' ? (
                <span className="text-amber-400">CARREGANDO...</span>
              ) : (
                <span className="flex items-center space-x-1 font-semibold text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>OFFLINE</span>
                </span>
              )}
            </div>

            <button
              id="btn-recheck-api"
              onClick={checkHealth}
              disabled={checking}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-transparent hover:border-slate-700 transition-all cursor-pointer"
              title="Recarregar status da API"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: API & Environment Check */}
        <section className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-2xl glassmorphism space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Ambiente de Operações</span>
              <h2 id="main-heading" className="text-3xl font-extrabold tracking-tight text-white font-outfit mt-1">
                Boilerplate de Infraestrutura Pronto
              </h2>
              <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                A infraestrutura base do sistema **sisalmox** (Logística e Almoxarifado Militar) foi orquestrada via Docker Compose. Os containers do banco de dados, backend e frontend estão se comunicando perfeitamente.
              </p>
            </div>

            {/* Status Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-[#0e1424] border border-slate-800/80 rounded-xl flex items-start space-x-4">
                <div className={`p-2.5 rounded-lg ${health.status === 'UP' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Servidor Express (API)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Porta mapeada: 5000</p>
                  <div className="mt-2 text-xs font-medium">
                    {health.status === 'UP' ? (
                      <span className="text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Servidor online e pronto</span>
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Sem resposta da API</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 bg-[#0e1424] border border-slate-800/80 rounded-xl flex items-start space-x-4">
                <div className={`p-2.5 rounded-lg ${health.services?.database === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Banco de Dados (PostgreSQL)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Dialeto: Sequelize / pg</p>
                  <div className="mt-2 text-xs font-medium">
                    {health.services?.database === 'CONNECTED' ? (
                      <span className="text-emerald-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Conexão estabelecida</span>
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Banco inacessível</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-4 bg-brand-500/5 border border-brand-500/10 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5 text-brand-400" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Precisa testar a conectividade novamente?</h4>
                  <p className="text-xs text-slate-400">Verifica a comunicação de ponta a ponta com o banco de dados.</p>
                </div>
              </div>
              <button 
                id="btn-test-connection"
                onClick={checkHealth}
                disabled={checking}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-98 disabled:opacity-50 flex items-center space-x-2"
              >
                <span>Testar Conectividade</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Project Architecture roadmap */}
          <div className="p-8 rounded-2xl glassmorphism space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-outfit">Fases do Cronograma do Desenvolvimento</h2>
              <p className="text-xs text-slate-400 mt-1">Conforme detalhado no arquivo analise_arquitetural.md</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-brand-500/10 border border-brand-500/20 rounded-xl flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400">FASE 1</span>
                    <h3 className="font-semibold text-white text-sm">Setup de Infraestrutura</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">Configuração de containers Docker Compose, servidor Node/Express, banco de dados e React/Vite com Tailwind.</p>
                </div>
                <span className="px-2 py-1 rounded bg-brand-500/20 text-brand-400 text-xs font-semibold">Concluído</span>
              </div>

              {[
                { phase: 'FASE 2', title: 'Estrutura de Cadastro e Migração', desc: 'Migrações Sequelize (OPMs, Seções, Usuários) e importador em lote (CSV/PHP).' },
                { phase: 'FASE 3', title: 'Módulo de Estoque e Consumíveis', desc: 'Entradas/Saídas de estoque e cálculo de valor médio mensal.' },
                { phase: 'FASE 4', title: 'Módulo de Movimentação (FMM) e Carga', desc: 'Numerador de documentos, motor de PDF e termos de Carga Pessoal.' },
                { phase: 'FASE 5', title: 'Auditoria, Segurança e Produção', desc: 'Logs imutáveis de movimentação e migração final do ambiente de produção.' }
              ].map((step, idx) => (
                <div key={idx} className="p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl flex items-start justify-between opacity-70">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">{step.phase}</span>
                      <h3 className="font-semibold text-slate-300 text-sm">{step.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Aguardando</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Column: Sidebar Stats */}
        <section className="space-y-6">
          {/* Card: OPM Security */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-brand-500/5 rounded-full blur-xl"></div>
            
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-slate-800/80 rounded-lg text-brand-400">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base font-outfit">Controle Bélico & Logístico</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              O sisalmox opera com regras estritas de domínio contábil, estoque e termos de cautela militar.
            </p>

            <ul className="mt-4 space-y-2 text-xs">
              <li className="flex items-center space-x-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Restrição de escopo de OPM ($opmroot)</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Sequenciador de FMM imutável</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Auditoria forense de movimentações</span>
              </li>
            </ul>
          </div>

          {/* Card: System Spec Overview */}
          <div className="p-6 rounded-2xl bg-[#0d1222] border border-brand-500/10 space-y-4">
            <h3 className="font-bold text-white text-base font-outfit flex items-center space-x-2">
              <Layers className="w-4 h-4 text-brand-400" />
              <span>Especificação Técnica</span>
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">Tecnologia Frontend</span>
                <span className="font-semibold text-white">Vite / React 18 / Tailwind</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">Servidor Backend</span>
                <span className="font-semibold text-white">Node.js 20 / Express</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400">ORM / Banco</span>
                <span className="font-semibold text-white">Sequelize (PostgreSQL)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Isolamento</span>
                <span className="font-semibold text-white">Docker Compose</span>
              </div>
            </div>
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-xs mt-12 pt-6 border-t border-slate-800/40">
        <p>© 2026 sisalmox. Desenvolvido para controle de logística bélica e almoxarifado.</p>
      </footer>
    </div>
  );
}

export default App;
