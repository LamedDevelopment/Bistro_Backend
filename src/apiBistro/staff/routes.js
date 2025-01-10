/*  
    RUTA: /api/staff
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { isEmail, validateFields, validateJWT } = require('../../middleware/globalValidations');
const { createUser } = require('./controller/staff');


const router = Router();


// TODO: Creacion del Usuario por el Staff del Enterprise
/* 
    RUTA: /api/staff
    METODO: POST
    DESCRIPCION: Creacion del Usuario por el Staff del Enterprise
    PARAMETROS: @name, @lastName, @email, @movil, @pass, @terms
*/
router.post('/',
    [
        isEmail, validateJWT,
        check('name', 'El campo Nombre es Obligatorio').not().isEmpty(),
        check('lastName', 'El campo Apellido es Obligatorio').not().isEmpty(),
        check('movil', 'El campo Celular es Obligatorio').not().isEmpty(),
        check('email', 'El campo Email es Obligatorio').isEmail(),
        check('pass', 'El campo Contraseña es Obligatorio').not().isEmpty(),
        check('role', 'El campo Role es Obligatorio').not().isEmpty(),
        check('terms', 'Aceptar los terminos es Obligatorio').not().isEmpty(),
        validateFields,
    ], createUser);



module.exports = router;