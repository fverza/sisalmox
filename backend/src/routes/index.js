const { Router } = require('express');
const PatrimonioController = require('../controllers/PatrimonioController');
const OpmController = require('../controllers/OpmController');
const SecaoController = require('../controllers/SecaoController');
const ImportController = require('../controllers/ImportController');

const router = Router();

// Status Check
router.get('/status', (req, res) => {
  res.json({ status: 'API Online', timestamp: new Date() });
});

// Patrimonios Routes
router.get('/patrimonios', PatrimonioController.list);
router.get('/patrimonios/:id', PatrimonioController.show);
router.post('/patrimonios', PatrimonioController.create);

// Filters helper routes
router.get('/opms', OpmController.list);
router.get('/secoes', SecaoController.list);

// CSV Import Route
router.post('/import-csv', ImportController.importLocalCsv);

module.exports = router;
