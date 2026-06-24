const { OPM } = require('../models');

class OpmController {
  async list(req, res, next) {
    try {
      const opms = await OPM.findAll({
        order: [['codigo', 'ASC']]
      });
      return res.status(200).json(opms);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OpmController();
