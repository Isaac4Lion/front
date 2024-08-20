import { Router } from "express";
import { crearCondicion, detalleCondicion, eliminarCondicion, modificarCondicion } from "../controllers/condiciones_controller.js";

const router = Router()

router.get('/condicion/:id',detalleCondicion)
router.post('/condicion',crearCondicion)
router.put('/condicion/:id',modificarCondicion)
router.delete('/condicion/:id',eliminarCondicion)

export default router