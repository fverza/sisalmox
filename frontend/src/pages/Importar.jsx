import React, { useState } from 'react';
import axios from 'axios';
import { 
  FileSpreadsheet, 
  Play, 
  CheckCircle, 
  XCircle, 
  Terminal, 
  HelpCircle,
  RefreshCw,
  Info
} from 'lucide-react';

function Importar() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTriggerImport = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${apiUrl}/import-csv`);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Erro de rede ao executar importação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Migração de Dados Históricos</span>
        <h2 className="text-2xl font-extrabold text-white font-outfit mt-0.5">Importador de Planilha (CSV)</h2>
        <p className="text-xs text-slate-400 mt-1">Carregue dados legados de armas, coletes e ativos na infraestrutura do novo sistema.</p>
      </div>

      {/* Instructions Card */}
      <div className="p-6 rounded-2xl glassmorphism space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800/60 pb-3">
          <HelpCircle className="w-5 h-5 text-brand-400" />
          <h3 className="font-semibold text-white text-sm">Instruções para Carga de Dados</h3>
        </div>
        
        <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
          <p>
            1. No Excel ou Calc, configure sua planilha com os cabeçalhos obrigatórios em minúsculas: 
            <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-brand-400 ml-1">patrimonio</span>, 
            <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-brand-400 ml-1">nserie</span>, 
            <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-brand-400 ml-1">grupo</span>, 
            <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-brand-400 ml-1">descricao</span>, 
            <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-brand-400 ml-1">valor</span>, 
            <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-brand-400 ml-1">opmatual</span> e 
            <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-brand-400 ml-1">localizacao</span>.
          </p>
          <p>
            2. Salve o arquivo no formato **CSV separado por ponto e vírgula (;)** ou **vírgula (,)** com o nome exato de <span className="font-mono text-emerald-400 font-semibold">import.csv</span>.
          </p>
          <p>
            3. Salve o arquivo na pasta **raiz do backend** (junto do Dockerfile ou package.json do backend).
          </p>
          <p className="flex items-center space-x-2 p-3 bg-brand-500/5 rounded-xl border border-brand-500/10 text-slate-400">
            <Info className="w-4 h-4 text-brand-400 shrink-0" />
            <span>O importador detectará automaticamente a codificação de caracteres (ANSI/Windows-1252 do Excel ou UTF-8) e atualizará registros já cadastrados.</span>
          </p>
        </div>
      </div>

      {/* Control Card */}
      <div className="p-6 rounded-2xl glassmorphism flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Disparar Carga do Arquivo</h4>
            <p className="text-xs text-slate-400 mt-0.5">Executa o processamento do arquivo import.csv no servidor do backend.</p>
          </div>
        </div>

        <button
          id="btn-run-import"
          onClick={handleTriggerImport}
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2 shrink-0"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Importando Planilha...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Processar import.csv no Servidor</span>
            </>
          )}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-start space-x-3 text-xs">
          <XCircle className="w-5 h-5 shrink-0" />
          <div>
            <h5 className="font-bold text-white">Falha no Processamento</h5>
            <p className="mt-1 leading-relaxed">{error}</p>
            <p className="mt-1.5 text-slate-400">Verifique se você copiou o arquivo para a pasta <span className="font-mono text-slate-300">backend/import.csv</span>.</p>
          </div>
        </div>
      )}

      {/* Success Details Card */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Stats summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center space-x-4">
              <CheckCircle className="w-10 h-10 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Sucesso</span>
                <h4 className="text-2xl font-bold text-emerald-400 font-mono">{result.successCount}</h4>
                <p className="text-xs text-slate-400">Patrimônios cadastrados/atualizados</p>
              </div>
            </div>

            <div className="p-5 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center space-x-4">
              <XCircle className="w-10 h-10 text-rose-400 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Erros / Pulados</span>
                <h4 className="text-2xl font-bold text-rose-400 font-mono">{result.errorCount}</h4>
                <p className="text-xs text-slate-400">Erros ou registros em branco ignorados</p>
              </div>
            </div>
          </div>

          {/* Detailed logs */}
          <div className="p-6 rounded-2xl glassmorphism space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800/60 pb-3">
              <Terminal className="w-4 h-4 text-slate-400" />
              <h3 className="font-semibold text-white text-sm">Registros de Log do Processamento</h3>
            </div>
            
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 max-h-60 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-300 space-y-1 scrollbar">
              {result.logs && result.logs.length > 0 ? (
                result.logs.map((logStr, idx) => {
                  let colorClass = 'text-slate-400';
                  if (logStr.includes('Inserido')) colorClass = 'text-emerald-400';
                  if (logStr.includes('Atualizado')) colorClass = 'text-sky-400';
                  if (logStr.includes('Erro') || logStr.includes('Ignorada')) colorClass = 'text-rose-400';
                  
                  return (
                    <div key={idx} className={colorClass}>
                      &gt; {logStr}
                    </div>
                  );
                })
              ) : (
                <div className="text-slate-500 text-center py-2">Sem logs registrados.</div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

export default Importar;
