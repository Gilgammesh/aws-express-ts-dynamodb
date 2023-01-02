/*******************************************************************************************************/
// Importamos las dependencias //
/*******************************************************************************************************/
import { Router } from 'express'
// import { validarToken, validarRol } from '../middlewares/authentication'
import * as palmicultor from './controllers/palmicultorController'

/*******************************************************************************************************/
// Instanciamos router //
/*******************************************************************************************************/
const router: Router = Router()

/*******************************************************************************************************/
// Definimos las rutas //
/*******************************************************************************************************/

// Palmicultor
router.get('/palmicultor',  palmicultor.getAll)
router.post('/palmicultor',  palmicultor.create)
router.post('/palmicultor/upload/', palmicultor.upload)
router.get('/palmicultor/:id',  palmicultor.get)
router.put('/palmicultor/:id', palmicultor.update)

/*******************************************************************************************************/
// Exportamos las rutas definidas en router por defecto //
/*******************************************************************************************************/
export default router