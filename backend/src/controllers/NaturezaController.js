const { Natureza } = require('../models');

class NaturezaController {
  async list(req, res, next) {
    try {
      const naturezas = await Natureza.findAll({
        order: [['codigo', 'ASC']]
      });
      return res.status(200).json(naturezas);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NaturezaController();
