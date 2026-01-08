const express = require('express');
const router = express.Router();
const estanqueController = require('../controllers/estanqueController');
const auth = require('../middleware/auth');

router.post('/', auth, estanqueController.crearEstanque); 
router.get('/', auth, estanqueController.obtenerEstanques);
router.put('/:id', auth, estanqueController.actualizarEstanque); // Esta es la clave
router.delete('/:id', auth, estanqueController.eliminarEstanque);
router.post('/monitoreo', auth, estanqueController.registrarMonitoreo);
router.post('/clima-manual', auth, estanqueController.registrarClimaManual);
router.get('/grafica/:id', auth, estanqueController.obtenerGrafica);

module.exports = router;