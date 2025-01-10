/*  
    METODO: POST
    RUTA: /api/mnbis
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../../middleware/globalValidations');
const { createMenuBistro } = require('./controller/menuBistro');


const router = Router();

// TODO: Creacion del Usuario por el Staff del Enterprise
/*     
    DESCRIPCION: Creacion del Usuario por el Staff del Enterprise
    PARAMETROS: @name, @lastName, @email, @movil, @pass, @terms
*/
router.post('/',
    [
        check('business', 'El campo Business es Obligatorio').not().isEmpty(),
        check('menu', 'El campo Menu es Obligatorio').not().isEmpty(),
        validateFields,
    ], createMenuBistro);


    module.exports = router;