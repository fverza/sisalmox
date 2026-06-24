import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertCircle, 
  CheckCircle,
  FileText
} from 'lucide-react';

function EstoqueMovimentacao() {
  const [subTab, setSubTab] = useState('entrada'); // 'entrada' or 'saida'
  
  // Catalogs
  const [opms, setOpms] = useState([]);
  const [secoes, setSecoes] = useState([]);
  const [materiais, setMateriais] = useState([]);
  const [naturezas, setNaturezas] = useState([]);
  
  // Common states
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // ENTRADA Form State
  const [entHeader, setEntHeader] = useState({
    data: new Date().toISOString().substring(0, 10),
    motivo: 'NF',
    nota: '',
    ne: '',
    origem: '',
    opm_id: '',
    secao_id: '',
    usuario_id: 1 // Default test user
  });
  
  const [entItens, setEntItens] = useState([
    { material_id: '', quantidade: 1, valor_unitario: 0.00, natureza_id: '' }
  ]);

  // SAIDA Form State
  const [saiHeader, setSaiHeader] = useState({
    data: new Date().toISOString().substring(0, 10),
    tipo: 'Consumo',
    opm_origem_id: '',
    secao_origem_id: '',
    opm_destino_id: '',
    secao_destino_id: '',
    re_recebedor: '',
    usuario_id: 1 // Default test user
  });

  const [saiItens, setSaiItens] = useState([
    { material_id: '', quantidade: 1, natureza_id: '' }
  ]);

  const loadData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const [opmRes, secaoRes, matRes, natRes] = await Promise.all([
        axios.get(`${apiUrl}/opms`),
        axios.get(`${apiUrl}/secoes`),
        axios.get(`${apiUrl}/materiais`),
        axios.get(`${apiUrl}/naturezas`)
      ]);
      setOpms(opmRes.data);
      setSecoes(secaoRes.data);
      setMateriais(matRes.data);
      setNaturezas(natRes.data);

      // Prepopulate dropdown defaults if entries exist
      if (opmRes.data.length > 0) {
        setEntHeader(prev => ({ ...prev, opm_id: opmRes.data[0].id }));
        setSaiHeader(prev => ({ ...prev, opm_origem_id: opmRes.data[0].id, opm_destino_id: opmRes.data[0].id }));
      }
      if (secaoRes.data.length > 0) {
        setEntHeader(prev => ({ ...prev, secao_id: secaoRes.data[0].id }));
        setSaiHeader(prev => ({ ...prev, secao_origem_id: secaoRes.data[0].id, secao_destino_id: secaoRes.data[0].id }));
      }
    } catch (err) {
      console.error('Erro ao carregar catálogos:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Items manipulation (ENTRADA)
  const addEntItem = () => {
    setEntItens(prev => [...prev, { material_id: '', quantidade: 1, valor_unitario: 0.00, natureza_id: '' }]);
  };

  const removeEntItem = (index) => {
    if (entItens.length === 1) return;
    setEntItens(prev => prev.filter((_, i) => i !== index));
  };

  const changeEntItemField = (index, field, val) => {
    setEntItens(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: val };
      }
      return item;
    }));
  };

  // Items manipulation (SAIDA)
  const addSaiItem = () => {
    setSaiItens(prev => [...prev, { material_id: '', quantidade: 1, natureza_id: '' }]);
  };

  const removeSaiItem = (index) => {
    if (saiItens.length === 1) return;
    setSaiItens(prev => prev.filter((_, i) => i !== index));
  };

  const changeSaiItemField = (index, field, val) => {
    setSaiItens(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: val };
      }
      return item;
    }));
  };

  // Submit Entrada Form
  const submitEntrada = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    // Basic validation
    const invalidItem = entItens.some(item => !item.material_id || !item.natureza_id || item.quantidade <= 0);
    if (invalidItem) {
      setErrorMsg('Por favor, preencha o material, natureza e quantidade de todos os itens.');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const payload = {
        ...entHeader,
        itens: entItens.map(it => ({
          material_id: parseInt(it.material_id, 10),
          quantidade: parseInt(it.quantidade, 10),
          valor_unitario: parseFloat(it.valor_unitario),
          natureza_id: parseInt(it.natureza_id, 10)
        }))
      };

      await axios.post(`${apiUrl}/estoque/entradas`, payload);
      setSuccessMsg('Entrada de estoque registrada com sucesso!');
      // Reset items list
      setEntItens([{ material_id: '', quantidade: 1, valor_unitario: 0.00, natureza_id: '' }]);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || 'Erro ao registrar entrada.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Saida Form
  const submitSaida = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const invalidItem = saiItens.some(item => !item.material_id || !item.natureza_id || item.quantidade <= 0);
    if (invalidItem) {
      setErrorMsg('Por favor, preencha o material, natureza e quantidade de todos os itens.');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const payload = {
        ...saiHeader,
        itens: saiItens.map(it => ({
          material_id: parseInt(it.material_id, 10),
          quantidade: parseInt(it.quantidade, 10),
          natureza_id: parseInt(it.natureza_id, 10)
        }))
      };

      const res = await axios.post(`${apiUrl}/estoque/saidas`, payload);
      setSuccessMsg(`Saída registrada com sucesso! Recibo gerado: ${res.data.saida.numrec}`);
      setSaiItens([{ material_id: '', quantidade: 1, natureza_id: '' }]);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || 'Erro ao registrar saída de estoque.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Sub-tabs menu */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => { setSubTab('entrada'); setSuccessMsg(null); setErrorMsg(null); }}
          className={`pb-4 px-6 text-sm font-semibold flex items-center space-x-2 border-b-2 cursor-pointer transition-all ${
            subTab === 'entrada'
              ? 'border-brand-500 text-white font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
          <span>Lançar Entrada (Lote)</span>
        </button>

        <button
          onClick={() => { setSubTab('saida'); setSuccessMsg(null); setErrorMsg(null); }}
          className={`pb-4 px-6 text-sm font-semibold flex items-center space-x-2 border-b-2 cursor-pointer transition-all ${
            subTab === 'saida'
              ? 'border-brand-500 text-white font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowUpRight className="w-4 h-4 text-rose-400" />
          <span>Lançar Saída (Requisição/Consumo)</span>
        </button>
      </div>

      {/* Success/Error messages */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center space-x-3 text-xs">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center space-x-3 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ENTRADA FORM */}
      {subTab === 'entrada' && (
        <form onSubmit={submitEntrada} className="space-y-6">
          
          {/* Header Details */}
          <div className="p-6 rounded-2xl glassmorphism space-y-4">
            <h3 className="text-white font-bold text-base flex items-center space-x-2">
              <FileText className="w-4 h-4 text-brand-400" />
              <span>Dados Fiscais & Cabeçalho da Entrada</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="text-slate-400">Data de Entrada</label>
                <input
                  type="date"
                  value={entHeader.data}
                  onChange={(e) => setEntHeader(prev => ({ ...prev, data: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Motivo</label>
                <select
                  value={entHeader.motivo}
                  onChange={(e) => setEntHeader(prev => ({ ...prev, motivo: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300"
                >
                  <option value="NF">Nota Fiscal (Empresa)</option>
                  <option value="TR">Transferência OPM</option>
                  <option value="DO">Doação</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Número da Nota Fiscal</label>
                <input
                  type="text"
                  value={entHeader.nota}
                  onChange={(e) => setEntHeader(prev => ({ ...prev, nota: e.target.value }))}
                  placeholder="Ex: 88921"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Nota de Empenho (NE)</label>
                <input
                  type="text"
                  value={entHeader.ne}
                  onChange={(e) => setEntHeader(prev => ({ ...prev, ne: e.target.value }))}
                  placeholder="Ex: 2026NE00192"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-slate-400">Origem / Fornecedor</label>
                <input
                  type="text"
                  value={entHeader.origem}
                  onChange={(e) => setEntHeader(prev => ({ ...prev, origem: e.target.value }))}
                  placeholder="Ex: TAURUS ARMAS S.A. ou 4º BPM/I"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Destino (OPM)</label>
                <select
                  value={entHeader.opm_id}
                  onChange={(e) => setEntHeader(prev => ({ ...prev, opm_id: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300"
                >
                  {opms.map((o) => (
                    <option key={o.id} value={o.id}>{o.codigo} - {o.descricao}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Seção Almoxarifado</label>
                <select
                  value={entHeader.secao_id}
                  onChange={(e) => setEntHeader(prev => ({ ...prev, secao_id: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300"
                >
                  {secoes.map((s) => (
                    <option key={s.id} value={s.id}>{s.nome}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Items rows */}
          <div className="p-6 rounded-2xl glassmorphism space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <h3 className="text-white font-bold text-base">Itens de Entrada</h3>
              <button
                type="button"
                onClick={addEntItem}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-brand-400 hover:text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Material</span>
              </button>
            </div>

            <div className="space-y-3">
              {entItens.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs items-end bg-slate-950/40 p-4 rounded-xl border border-slate-800/40 relative">
                  
                  {/* Select Material */}
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-slate-400">Material / Item</label>
                    <select
                      value={item.material_id}
                      onChange={(e) => changeEntItemField(index, 'material_id', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
                    >
                      <option value="">Selecione...</option>
                      {materiais.map((m) => (
                        <option key={m.id} value={m.id}>{m.descricao}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-slate-400">Quantidade</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) => changeEntItemField(index, 'quantidade', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                    />
                  </div>

                  {/* Unit Value */}
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-slate-400">Valor Unitário (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.valor_unitario}
                      onChange={(e) => changeEntItemField(index, 'valor_unitario', parseFloat(e.target.value) || 0.00)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                    />
                  </div>

                  {/* Select Natureza */}
                  <div className="md:col-span-3 space-y-1">
                    <label className="text-slate-400">Natureza</label>
                    <select
                      value={item.natureza_id}
                      onChange={(e) => changeEntItemField(index, 'natureza_id', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
                    >
                      <option value="">Selecione...</option>
                      {naturezas.map((n) => (
                        <option key={n.id} value={n.id}>{n.codigo} - {n.descricao}</option>
                      ))}
                    </select>
                  </div>

                  {/* Delete button */}
                  <div className="md:col-span-1 flex items-center justify-end pb-1.5">
                    <button
                      type="button"
                      onClick={() => removeEntItem(index)}
                      disabled={entItens.length === 1}
                      className="p-2 text-slate-500 hover:text-rose-400 disabled:opacity-30 transition-all cursor-pointer"
                      title="Excluir Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-98 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Processando...' : 'Salvar Entrada de Estoque'}</span>
              </button>
            </div>

          </div>

        </form>
      )}

      {/* SAIDA FORM */}
      {subTab === 'saida' && (
        <form onSubmit={submitSaida} className="space-y-6">
          
          {/* Header Details */}
          <div className="p-6 rounded-2xl glassmorphism space-y-4">
            <h3 className="text-white font-bold text-base flex items-center space-x-2">
              <FileText className="w-4 h-4 text-brand-400" />
              <span>Dados do Recebedor & Origem/Destino</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="text-slate-400">Data de Saída</label>
                <input
                  type="date"
                  value={saiHeader.data}
                  onChange={(e) => setSaiHeader(prev => ({ ...prev, data: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Tipo de Retirada</label>
                <select
                  value={saiHeader.tipo}
                  onChange={(e) => setSaiHeader(prev => ({ ...prev, tipo: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300"
                >
                  <option value="Consumo">Consumo Interno</option>
                  <option value="Transferência">Transferência de OPM</option>
                  <option value="Baixa">Baixa / Descarte</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">RE do Recebedor</label>
                <input
                  type="text"
                  value={saiHeader.re_recebedor}
                  onChange={(e) => setSaiHeader(prev => ({ ...prev, re_recebedor: e.target.value }))}
                  placeholder="Ex: 158066-7"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">OPM Origem (Estoque)</label>
                <select
                  value={saiHeader.opm_origem_id}
                  onChange={(e) => setSaiHeader(prev => ({ ...prev, opm_origem_id: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300"
                >
                  {opms.map((o) => (
                    <option key={o.id} value={o.id}>{o.codigo} - {o.descricao}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Seção Origem (Estoque)</label>
                <select
                  value={saiHeader.secao_origem_id}
                  onChange={(e) => setSaiHeader(prev => ({ ...prev, secao_origem_id: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300"
                >
                  {secoes.map((s) => (
                    <option key={s.id} value={s.id}>{s.nome}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">OPM Destino</label>
                <select
                  value={saiHeader.opm_destino_id}
                  onChange={(e) => setSaiHeader(prev => ({ ...prev, opm_destino_id: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300"
                >
                  <option value="">Nenhum (Consumo local)</option>
                  {opms.map((o) => (
                    <option key={o.id} value={o.id}>{o.codigo} - {o.descricao}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Seção Destino</label>
                <select
                  value={saiHeader.secao_destino_id}
                  onChange={(e) => setSaiHeader(prev => ({ ...prev, secao_destino_id: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300"
                >
                  <option value="">Nenhum (Consumo local)</option>
                  {secoes.map((s) => (
                    <option key={s.id} value={s.id}>{s.nome}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Items rows */}
          <div className="p-6 rounded-2xl glassmorphism space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <h3 className="text-white font-bold text-base">Itens de Saída</h3>
              <button
                type="button"
                onClick={addSaiItem}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-brand-400 hover:text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Material</span>
              </button>
            </div>

            <div className="space-y-3">
              {saiItens.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs items-end bg-slate-950/40 p-4 rounded-xl border border-slate-800/40 relative">
                  
                  {/* Select Material */}
                  <div className="md:col-span-5 space-y-1">
                    <label className="text-slate-400">Material / Item</label>
                    <select
                      value={item.material_id}
                      onChange={(e) => changeSaiItemField(index, 'material_id', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
                    >
                      <option value="">Selecione...</option>
                      {materiais.map((m) => (
                        <option key={m.id} value={m.id}>{m.descricao}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-slate-400">Quantidade</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantidade}
                      onChange={(e) => changeSaiItemField(index, 'quantidade', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none"
                    />
                  </div>

                  {/* Select Natureza */}
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-slate-400">Natureza</label>
                    <select
                      value={item.natureza_id}
                      onChange={(e) => changeSaiItemField(index, 'natureza_id', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none"
                    >
                      <option value="">Selecione...</option>
                      {naturezas.map((n) => (
                        <option key={n.id} value={n.id}>{n.codigo} - {n.descricao}</option>
                      ))}
                    </select>
                  </div>

                  {/* Delete button */}
                  <div className="md:col-span-1 flex items-center justify-end pb-1.5">
                    <button
                      type="button"
                      onClick={() => removeSaiItem(index)}
                      disabled={saiItens.length === 1}
                      className="p-2 text-slate-500 hover:text-rose-400 disabled:opacity-30 transition-all cursor-pointer"
                      title="Excluir Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-98 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Confirmando...' : 'Confirmar Saída de Estoque'}</span>
              </button>
            </div>

          </div>

        </form>
      )}

    </div>
  );
}

export default EstoqueMovimentacao;
