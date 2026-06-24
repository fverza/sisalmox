const { Material } = require('../models');

class MaterialController {
  async list(req, res, next) {
    try {
      const materiais = await Material.findAll({
        order: [['descricao', 'ASC']]
      });
      return res.status(200).json(materiais);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { codigo_siafisico, descricao, unidade_medida } = req.body;
      if (!descricao) {
        return res.status(400).json({ error: 'Descrição do material é obrigatória.' });
      }

      const material = await Material.create({
        codigo_siafisico,
        descricao,
        unidade_medida: unidade_medida || 'UN'
      });

      return res.status(201).json(material);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MaterialController();
