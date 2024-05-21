import { Router } from 'express';
import { Controller } from '../controller/presupuesto.controller';

const router = Router();
const controller = new Controller();
router.get('/', controller.getPresupuestos);

router.post('/', controller.createPresupuesto);
router.post('/token', controller.createToken);
router.post('/pdf', controller.crearReporte);

export default router;
