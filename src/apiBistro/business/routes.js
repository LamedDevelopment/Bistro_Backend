/*  
    RUTA: /api/buss
    METODO: POST
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { isEmail, validateFields, validateJWT } = require('../../middleware/globalValidations');
const { createBusiness } = require('./controller/business');


const router = Router();
// TODO: Creacion del Business
/*
    DESCRIPCION: Creacion del la Empresa
    PARAMETROS: @businessName, @nit, @movil, @email, @phone, @address, @services, @typeService
*/
router.post('/',
    [
        isEmail, validateJWT,
        check('businessName', 'El campo businessName es Obligatorio').not().isEmpty(),
        check('nit', 'El campo nit es Obligatorio').not().isEmpty(),
        check('movil', 'El campo movil es Obligatorio').not().isEmpty(),
        check('email', 'El campo email es Obligatorio').isEmail(),
        check('phone', 'El campo phone es Obligatorio').not().isEmpty(),
        check('address', 'El campo address es Obligatorio').not().isEmpty(),
        check('services', 'Aceptar los services es Obligatorio').not().isEmpty(),
        check('typeService', 'Aceptar los typeService es Obligatorio').not().isEmpty(),
        validateFields,
    ], createBusiness);




module.exports = router;

