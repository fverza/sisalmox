import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Building, 
  Layers, 
  TrendingUp, 
  Database, 
  AlertCircle,
  FolderOpen,
  DollarSign,
  Package,
  Calendar
} from 'lucide-react';

function EstoqueSaldos() {
  const [saldos, setSaldos] = useState([]);
  const [opms, setOpms] = useState([]);
  const [secoes, setSecoes] = useState([]);
  
  // Filter variables
  const [opmId, setOpmId] = useState('');
  const [naturezaId, setNaturezaId] = useState('');
  const [anomes, setAnomes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate current year-month in YYYYMM format
  const getDefaultAnoMes = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${yyyy}${mm}`;
  };

  const fetchFiltersData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const opmsRes = await axios.get(`${apiUrl}/opms`);
      setOpms(opmsRes.data);
    } catch (err) {
      console.error('Erro ao carregar OPMs para filtros:', err);
    }
  };

  const fetchSaldos = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const queryParams = {};
      if (opmId) queryParams.opm_id = opmId;
      if (naturezaId) queryParams.natureza_id = naturezaId;
      
      const selectedMonth = anomes || getDefaultAnoMes();
      queryParams.anomes = parseInt(selectedMonth, 10);

      const response = await axios.get(`${apiUrl}/estoque/saldos`, { params: queryParams });
      setSaldos(response.data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar saldos de estoque.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiltersData();
    setAnomes(getDefaultAnoMes());
  }, []);

  useEffect(() => {
    fetchSaldos();
  }, [opmId, naturezaId, anomes]);

  // Sum total value of all filtered stocks
  const totalValorEstoque = saldos.reduce((acc, curr) => {
    const qty = curr.estoque || 0;
    const price = parseFloat(curr.valor_medio) || 0.00;
    return acc + (qty * price);
  }, 0);

  const totalQuantidade = saldos.reduce((acc, curr) => acc + (curr.estoque || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-400">Contabilidade Físico-Financeira</span>
        <h2 className="text-2xl font-extrabold text-white font-outfit mt-0.5">Saldo Mensal de Estoque & Custo Médio</h2>
        <p className="text-xs text-slate-400 mt-1">Consulte as quantidades físicas de consumo e bélico e seus custos médios ponderados (Tabela ValorMédioMensal).</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card: Total physical stock */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-brand-500/5 rounded-full blur-lg"></div>
          <div className="flex items-center space-x-3 text-slate-400">
            <Package className="w-4 h-4 text-brand-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Itens Totais em Estoque</span>
          </div>
          <h3 className="text-3xl font-extrabold text-white font-outfit mt-2">{totalQuantidade} <span className="text-xs text-slate-400 font-normal">unidades</span></h3>
        </div>

        {/* Card: Financial Value */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-emerald-500/5 rounded-full blur-lg"></div>
          <div className="flex items-center space-x-3 text-slate-400">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Valor Contábil Total</span>
          </div>
          <h3 className="text-3xl font-extrabold text-emerald-400 font-outfit mt-2">
            R$ {totalValorEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>

        {/* Card: Selected Month */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-purple-500/5 rounded-full blur-lg"></div>
          <div className="flex items-center space-x-3 text-slate-400">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold uppercase tracking-wider">Mês de Referência</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white font-mono mt-3">
            {anomes ? `${anomes.substring(4)}/${anomes.substring(0, 4)}` : '-'}
          </h3>
        </div>

      </div>

      {/* Filter Options */}
      <div className="p-5 rounded-2xl glassmorphism grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Month Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">Mês do Saldo (AAAAMM)</label>
          <input
            id="anomes-input"
            type="number"
            value={anomes}
            onChange={(e) => setAnomes(e.target.value)}
            placeholder="Ex: 202606"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-mono text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* OPM selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">OPM Responsável</label>
          <select
            id="opm-filter"
            value={opmId}
            onChange={(e) => setOpmId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="">Todas</option>
            {opms.map((o) => (
              <option key={o.id} value={o.id}>
                {o.codigo} - {o.descricao}
              </option>
            ))}
          </select>
        </div>

        {/* Natureza select */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400">Natureza de Despesa</label>
          <select
            id="natureza-filter"
            value={naturezaId}
            onChange={(e) => setNaturezaId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="">Todas</option>
            <option value="1">339030 - Material de Consumo</option>
            <option value="2">449052 - Equipamentos e Mat. Permanente</option>
          </select>
        </div>

      </div>

      {/* Stock Table */}
      <div className="p-6 rounded-2xl glassmorphism">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-brand-400 animate-spin" />
            <span className="text-sm text-slate-400">Carregando estoque...</span>
          </div>
        ) : error ? (
          <div className="py-8 flex flex-col items-center justify-center text-rose-400 space-y-2">
            <AlertCircle className="w-8 h-8" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        ) : saldos.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 space-y-2">
            <FolderOpen className="w-10 h-10 stroke-1" />
            <span className="text-sm">Nenhum saldo registrado para este mês.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase">
                  <th className="py-3.5 px-4">Material / SIAFÍSICO</th>
                  <th className="py-3.5 px-4">OPM</th>
                  <th className="py-3.5 px-4">Despesa</th>
                  <th className="py-3.5 px-4 text-center">Físico (Qtd)</th>
                  <th className="py-3.5 px-4 text-right">Custo Médio</th>
                  <th className="py-3.5 px-4 text-right">Total Financeiro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-sm">
                {saldos.map((s) => {
                  const qty = s.estoque || 0;
                  const price = parseFloat(s.valor_medio) || 0.00;
                  const total = qty * price;
                  return (
                    <tr key={s.id} className="hover:bg-slate-900/30 transition-all">
                      
                      {/* Material */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{s.Material?.descricao}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">SIAFÍSICO: {s.Material?.codigo_siafisico || 'N/A'} ({s.Material?.unidade_medida})</div>
                      </td>

                      {/* OPM */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-300 font-semibold text-xs flex items-center space-x-1">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span>{s.Opm?.descricao}</span>
                        </div>
                      </td>

                      {/* Natureza */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-xs font-mono bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-800 inline-block">
                          {s.Natureza?.codigo} - {s.Natureza?.descricao}
                        </div>
                      </td>

                      {/* Quantidade */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap font-semibold text-white">
                        {qty}
                      </td>

                      {/* Custo Medio */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono text-slate-300">
                        R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-semibold font-mono text-emerald-400">
                        R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default EstoqueSaldos;
