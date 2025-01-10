/*  
    METODO: POST    
    RUTA: /api/cust
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../../middleware/globalValidations');
const { createCustomer } = require('./controller/customer');


const router = Router();


// TODO: Creacion del Usuario por el Staff del Enterprise
/* 
    DESCRIPCION: Creacion del Cliente Final
    PARAMETROS: @fullName, @movil, @homeAddress, @addressComplement
*/
router.post('/',
    [
        check('fullName', 'El campo Nombre es Obligatorio').not().isEmpty(),
        check('movil', 'El campo Celular es Obligatorio').not().isEmpty(),
        check('homeAddress', 'El campo homeAddress es Obligatorio').not().isEmpty(),
        validateFields,
    ], createCustomer);



module.exports = router;