const { Op } = require('sequelize');
const { Patrimonio, OPM, Secao } = require('../models');

class PatrimonioController {
  // List with filters and search
  async list(req, res, next) {
    try {
      const { search, grupo, opm_id, secao_id } = req.query;
      const whereClause = {};

      if (grupo) {
        whereClause.grupo = grupo;
      }

      if (opm_id) {
        whereClause.opm_atual_id = opm_id;
      }

      if (secao_id) {
        whereClause.secao_atual_id = secao_id;
      }

      if (search) {
        whereClause[Op.or] = [
          { numero_patrimonio: { [Op.like]: `%${search}%` } },
          { numero_serie: { [Op.like]: `%${search}%` } },
          { marca: { [Op.like]: `%${search}%` } },
          { modelo: { [Op.like]: `%${search}%` } },
          { descricao: { [Op.like]: `%${search}%` } },
          { re_detentor: { [Op.like]: `%${search}%` } }
        ];
      }

      const patrimonios = await Patrimonio.findAll({
        where: whereClause,
        include: [
          { model: OPM, as: 'OpmAtual', attributes: ['id', 'codigo', 'descricao'] },
          { model: Secao, as: 'SecaoAtual', attributes: ['id', 'nome'] }
        ],
        order: [['createdAt', 'DESC']]
      });

      return res.status(200).json(patrimonios);
    } catch (error) {
      next(error);
    }
  }

  // Create new patrimonio manually
  async create(req, res, next) {
    try {
      const {
        numero_patrimonio,
        numero_serie,
        grupo,
        descricao,
        marca,
        modelo,
        valor_compra,
        re_detentor,
        opm_atual_id,
        secao_atual_id
      } = req.body;

      if (!numero_patrimonio) {
        return res.status(400).json({ error: 'Número de patrimônio é obrigatório' });
      }

      const exists = await Patrimonio.findOne({ where: { numero_patrimonio } });
      if (exists) {
        return res.status(400).json({ error: 'Patrimônio já cadastrado com esse número' });
      }

      const patrimonio = await Patrimonio.create({
        numero_patrimonio,
        numero_serie,
        grupo: grupo || 'DIV',
        descricao: descricao || '',
        marca: marca || '',
        modelo: modelo || '',
        valor_compra: valor_compra || 0.00,
        re_detentor: re_detentor || null,
        opm_atual_id: opm_atual_id || null,
        secao_atual_id: secao_atual_id || null
      });

      return res.status(201).json(patrimonio);
    } catch (error) {
      next(error);
    }
  }

  // Show single patrimonio
  async show(req, res, next) {
    try {
      const { id } = req.params;
      const patrimonio = await Patrimonio.findByPk(id, {
        include: [
          { model: OPM, as: 'OpmAtual', attributes: ['id', 'codigo', 'descricao'] },
          { model: Secao, as: 'SecaoAtual', attributes: ['id', 'nome'] }
        ]
      });

      if (!patrimonio) {
        return res.status(404).json({ error: 'Patrimônio não encontrado' });
      }

      return res.status(200).json(patrimonio);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PatrimonioController();
