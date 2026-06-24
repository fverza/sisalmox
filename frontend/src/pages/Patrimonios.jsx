import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  Building, 
  Layers, 
  Tag, 
  User, 
  Plus, 
  Info, 
  X, 
  AlertCircle,
  Package,
  Calendar,
  DollarSign
} from 'lucide-react';

function Patrimonios() {
  const [patrimonios, setPatrimonios] = useState([]);
  const [opms, setOpms] = useState([]);
  const [secoes, setSecoes] = useState([]);
  
  // Filters state
  const [search, setSearch] = useState('');
  const [grupo, setGrupo] = useState('');
  const [opmId, setOpmId] = useState('');
  const [secaoId, setSecaoId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Selected patrimonio details modal
  const [selectedPat, setSelectedPat] = useState(null);

  const fetchFiltersData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const [opmRes, secaoRes] = await Promise.all([
        axios.get(`${apiUrl}/opms`),
        axios.get(`${apiUrl}/secoes`)
      ]);
      setOpms(opmRes.data);
      setSecoes(secaoRes.data);
    } catch (err) {
      console.error('Erro ao buscar dados dos filtros:', err);
    }
  };

  const fetchPatrimonios = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/patrimonios`, {
        params: {
          search,
          grupo,
          opm_id: opmId,
          secao_id: secaoId
        }
      });
      setPatrimonios(response.data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar patrimônios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiltersData();
  }, []);

  useEffect(() => {
    fetchPatrimonios();
  }, [search, grupo, opmId, secaoId]);

  const getGrupoBadge = (g) => {
    switch (g) {
      case 'ARM':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">ARMAMENTO</span>;
      case 'TEL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">TELECOM</span>;
      case 'INF':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">INFORMÁTICA</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">DIVERSOS</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Ativos Permanentes</span>
          <h2 className="text-2xl font-extrabold text-white font-outfit mt-0.5">Gestão de Cargas & Tombos</h2>
          <p className="text-xs text-slate-400 mt-1">Busque, filtre e consulte detalhes de patrimônios cadastrados.</p>
        </div>
      </div>

      {/* Filters Card */}
      <div className="p-6 rounded-2xl glassmorphism space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-800/60 pb-3">
          <Filter className="w-4 h-4 text-brand-400" />
          <h3 className="font-semibold text-white text-sm">Filtros de Pesquisa</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Keyword Search */}
          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <label className="text-xs font-medium text-slate-400">Buscar por palavra-chave</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                id="search-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Patrimônio, marca, modelo, série, RE detentor..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
              />
            </div>
          </div>

          {/* Group select */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Grupo de Material</label>
            <select
              id="select-group"
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"
            >
              <option value="">Todos</option>
              <option value="ARM">ARM (Armamento)</option>
              <option value="TEL">TEL (Telecomunicações)</option>
              <option value="INF">INF (Informática)</option>
              <option value="DIV">DIV (Diversos)</option>
            </select>
          </div>

          {/* OPM select */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">OPM Atual</label>
            <select
              id="select-opm"
              value={opmId}
              onChange={(e) => setOpmId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"
            >
              <option value="">Todas</option>
              {opms.map((opm) => (
                <option key={opm.id} value={opm.id}>
                  {opm.codigo} - {opm.descricao}
                </option>
              ))}
            </select>
          </div>

          {/* Section select */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">Seção Atual</label>
            <select
              id="select-secao"
              value={secaoId}
              onChange={(e) => setSecaoId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"
            >
              <option value="">Todas</option>
              {secoes.map((secao) => (
                <option key={secao.id} value={secao.id}>
                  {secao.nome}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Results Section */}
      <div className="p-6 rounded-2xl glassmorphism space-y-4">
        
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-brand-400 animate-spin" />
            <span className="text-sm text-slate-400">Carregando registros...</span>
          </div>
        ) : error ? (
          <div className="py-8 flex flex-col items-center justify-center text-rose-400 space-y-2">
            <AlertCircle className="w-8 h-8" />
            <span className="text-sm font-semibold">{error}</span>
            <span className="text-xs text-slate-500">Verifique se o backend está rodando no Docker.</span>
          </div>
        ) : patrimonios.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-2">
            <Package className="w-10 h-10 stroke-1" />
            <span className="text-sm">Nenhum patrimônio encontrado com os filtros selecionados.</span>
            <span className="text-xs">Cadastre novos itens ou faça a importação da planilha.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                  <th className="py-3.5 px-4">Patrimônio / Série</th>
                  <th className="py-3.5 px-4">Grupo</th>
                  <th className="py-3.5 px-4">Descrição</th>
                  <th className="py-3.5 px-4">OPM / Seção</th>
                  <th className="py-3.5 px-4">Detentor</th>
                  <th className="py-3.5 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-sm">
                {patrimonios.map((pat) => (
                  <tr key={pat.id} className="hover:bg-slate-900/30 transition-all">
                    
                    {/* Patrimonio */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-white font-mono">{pat.numero_patrimonio}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">S/N: {pat.numero_serie || 'N/A'}</div>
                    </td>

                    {/* Grupo */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getGrupoBadge(pat.grupo)}
                    </td>

                    {/* Descricao */}
                    <td className="py-3.5 px-4 max-w-xs truncate">
                      <div className="text-slate-200 font-medium">{pat.marca} - {pat.modelo}</div>
                      <div className="text-xs text-slate-400 mt-0.5 truncate">{pat.descricao}</div>
                    </td>

                    {/* OPM / Secao */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-semibold text-xs flex items-center space-x-1">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        <span>{pat.OpmAtual?.descricao || 'Não Vinculada'}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center space-x-1">
                        <Layers className="w-3.5 h-3.5 text-slate-600" />
                        <span>{pat.SecaoAtual?.nome || 'Almoxarifado'}</span>
                      </div>
                    </td>

                    {/* Detentor */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {pat.re_detentor ? (
                        <div className="flex items-center space-x-1.5 text-slate-300 font-mono text-xs font-medium">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>RE: {pat.re_detentor}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">Em Estoque</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button 
                        onClick={() => setSelectedPat(pat)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center space-x-1.5 ml-auto"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Detalhes</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Details Modal */}
      {selectedPat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0e1322] border border-slate-800 rounded-2xl shadow-2xl p-6 relative">
            <button 
              onClick={() => setSelectedPat(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              
              {/* Modal Header */}
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-brand-500/10 rounded-xl text-brand-400">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wide">Ficha Cadastral do Bem</span>
                  <h3 className="text-lg font-bold text-white font-mono">{selectedPat.numero_patrimonio}</h3>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-800 py-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Marca</span>
                  <span className="text-white text-sm font-semibold mt-0.5 block">{selectedPat.marca || 'Não informado'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Modelo</span>
                  <span className="text-white text-sm font-semibold mt-0.5 block">{selectedPat.modelo || 'Não informado'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Número de Série</span>
                  <span className="text-white text-sm font-semibold font-mono mt-0.5 block">{selectedPat.numero_serie || 'Sem Série'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Grupo do Material</span>
                  <span className="mt-0.5 block">{getGrupoBadge(selectedPat.grupo)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium flex items-center space-x-1">
                    <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                    <span>Valor de Compra</span>
                  </span>
                  <span className="text-white text-sm font-semibold mt-0.5 block">
                    R$ {Number(selectedPat.valor_compra).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Detentor da Carga</span>
                  <span className="text-white text-sm font-semibold mt-0.5 block font-mono">
                    {selectedPat.re_detentor ? `RE ${selectedPat.re_detentor}` : 'Em Estoque / Almox'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1 text-xs">
                <span className="text-slate-400 font-medium">Descrição Técnica / Observações</span>
                <p className="p-3 bg-slate-950/80 rounded-xl text-slate-300 leading-relaxed border border-slate-800">
                  {selectedPat.descricao}
                </p>
              </div>

              {/* Associations */}
              <div className="space-y-2 border-t border-slate-800 pt-4 text-xs">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Building className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold">OPM:</span>
                  <span className="text-slate-400">{selectedPat.OpmAtual?.descricao || 'Não cadastrada'}</span>
                </div>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Layers className="w-4 h-4 text-slate-500" />
                  <span className="font-semibold">Seção:</span>
                  <span className="text-slate-400">{selectedPat.SecaoAtual?.nome || 'Almoxarifado Geral'}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Patrimonios;
