/*  
    METODO: POST
    RUTA: /api/mnbis
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validateJWT } = require('../../middleware/globalValidations');
const { createMenuBistro, viewMenuBistro } = require('./controller/menuBistro');


const router = Router();

// TODO: Creacion del Usuario por el Staff del Enterprise
/*     
    DESCRIPCION: Creacion del Usuario por el Staff del Enterprise
    PARAMETROS: @name, @lastName, @email, @movil, @pass, @terms
*/
router.post('/',
    [
        validateJWT,
        check('business', 'El campo Business es Obligatorio').not().isEmpty(),
        check('menu', 'El campo Menu es Obligatorio').not().isEmpty(),
        validateFields,
    ], 
createMenuBistro);

router.post('/vw',
    [
        validateJWT,
        check('business', 'El campo Business es Obligatorio').not().isEmpty(),
        validateFields,
    ], 
viewMenuBistro);

// TODO: Debemos crear una Vista para que el Usuario pueda ver el menu.
// TODO: Cuando hace la consulta desde WS o la Plataforma.


    module.exports = router;