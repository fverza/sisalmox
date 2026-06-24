const { sequelize, Entrada, EntradaItem, Saida, SaidaItem, EstoqueSaldo, Material, OPM, Secao, Natureza } = require('../models');
const EstoqueService = require('../services/EstoqueService');
const { Op } = require('sequelize');

class EstoqueController {
  // Retrieve stock balances
  async getSaldos(req, res, next) {
    try {
      const { opm_id, natureza_id, material_id, anomes } = req.query;
      const whereClause = {};

      if (opm_id) whereClause.opm_id = opm_id;
      if (natureza_id) whereClause.natureza_id = natureza_id;
      if (material_id) whereClause.material_id = material_id;
      
      // Default to current year-month if not specified
      if (anomes) {
        whereClause.anomes = anomes;
      } else {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        whereClause.anomes = parseInt(`${yyyy}${mm}`, 10);
      }

      const saldos = await EstoqueSaldo.findAll({
        where: whereClause,
        include: [
          { model: Material, as: 'Material', attributes: ['id', 'codigo_siafisico', 'descricao', 'unidade_medida'] },
          { model: OPM, as: 'Opm', attributes: ['id', 'codigo', 'descricao'] },
          { model: Natureza, as: 'Natureza', attributes: ['id', 'codigo', 'descricao'] }
        ],
        order: [[{ model: Material, as: 'Material' }, 'descricao', 'ASC']]
      });

      return res.status(200).json(saldos);
    } catch (error) {
      next(error);
    }
  }

  // Register a stock Entry (Entrada)
  async createEntrada(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { data, motivo, nota, ne, opm_id, secao_id, usuario_id, itens } = req.body;

      if (!opm_id || !secao_id || !usuario_id || !itens || !itens.length) {
        return res.status(400).json({ error: 'Dados incompletos para a entrada de estoque.' });
      }

      // Format Year-Month from entry date
      const entryDate = new Date(data || new Date());
      const yyyy = entryDate.getFullYear();
      const mm = String(entryDate.getMonth() + 1).padStart(2, '0');
      const anomes = parseInt(`${yyyy}${mm}`, 10);

      // Create Entrada header
      const entrada = await Entrada.create({
        data: data || entryDate,
        motivo,
        origem: req.body.origem || '',
        nota,
        ne,
        opm_id,
        secao_id,
        usuario_id
      }, { transaction: t });

      // Save items and update balances
      const createdItens = [];
      for (const item of itens) {
        const { material_id, quantidade, valor_unitario, natureza_id } = item;

        const entradaItem = await EntradaItem.create({
          entrada_id: entrada.id,
          material_id,
          quantidade,
          valor_unitario,
          natureza_id
        }, { transaction: t });

        // Update Stock Balances via EstoqueService
        await EstoqueService.registrarEntradaItem(
          t,
          material_id,
          opm_id,
          natureza_id,
          anomes,
          quantidade,
          parseFloat(valor_unitario)
        );

        createdItens.push(entradaItem);
      }

      await t.commit();
      return res.status(201).json({ entrada, itens: createdItens });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  // Register a stock Exit (Saida)
  async createSaida(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { data, tipo, opm_origem_id, secao_origem_id, opm_destino_id, secao_destino_id, re_recebedor, usuario_id, itens } = req.body;

      if (!opm_origem_id || !secao_origem_id || !usuario_id || !itens || !itens.length) {
        return res.status(400).json({ error: 'Dados incompletos para a saída de estoque.' });
      }

      const exitDate = new Date(data || new Date());
      const yyyy = exitDate.getFullYear();
      const mm = String(exitDate.getMonth() + 1).padStart(2, '0');
      const anomes = parseInt(`${yyyy}${mm}`, 10);

      // Calculate sequential receipt number
      const startOfYear = `${yyyy}-01-01`;
      const endOfYear = `${yyyy}-12-31`;
      
      const count = await Saida.count({
        where: {
          opm_origem_id,
          secao_origem_id,
          data: {
            [Op.between]: [startOfYear, endOfYear]
          }
        },
        transaction: t
      });

      const nextNum = count + 1;
      const formattedNum = String(nextNum).padStart(4, '0');
      const numrec = `REC-${opm_origem_id}-${formattedNum}/${String(yyyy).substring(2)}`;

      // Create Saida header
      const saida = await Saida.create({
        data: data || exitDate,
        tipo,
        numero: nextNum,
        numrec,
        opm_origem_id,
        secao_origem_id,
        opm_destino_id,
        secao_destino_id,
        re_recebedor,
        usuario_id
      }, { transaction: t });

      // Save exit items
      const createdItens = [];
      for (const item of itens) {
        const { material_id, quantidade, natureza_id } = item;

        // Retrieve current average cost for the item to record on the invoice
        const currentBalance = await EstoqueSaldo.findOne({
          where: { material_id, opm_id: opm_origem_id, natureza_id, anomes },
          transaction: t
        });

        const valorUnitario = currentBalance ? parseFloat(currentBalance.valor_medio) : 0.00;

        const saidaItem = await SaidaItem.create({
          saida_id: saida.id,
          material_id,
          quantidade,
          valor_unitario: valorUnitario,
          natureza_id
        }, { transaction: t });

        // Update Stock Balances via EstoqueService
        await EstoqueService.registrarSaidaItem(
          t,
          material_id,
          opm_origem_id,
          natureza_id,
          anomes,
          quantidade
        );

        createdItens.push(saidaItem);
      }

      await t.commit();
      return res.status(201).json({ saida, itens: createdItens });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
}

module.exports = new EstoqueController();
