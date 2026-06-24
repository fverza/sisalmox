const { Secao } = require('../models');

class SecaoController {
  async list(req, res, next) {
    try {
      const secoes = await Secao.findAll({
        order: [['nome', 'ASC']]
      });
      return res.status(200).json(secoes);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SecaoController();
