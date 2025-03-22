/*  
    METODO: POST
    RUTA: /api/mnbis
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validateJWT } = require('../../middleware/globalValidations');
const { createMenuBistro, viewMenuBistro } = require('./controller/menuBistro');
const { createOrders, viewOrder, editOrderAdd, editOrderDel, payOrder } = require('../order.js/controller/order');


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
        // validateJWT,
        check('business', 'El campo Business es Obligatorio').not().isEmpty(),
        check('business.tableID', 'El campo Business es Obligatorio').not().isEmpty(),
        validateFields,
    ], 
viewMenuBistro);

router.post('/order',
    [
        check('business', 'El campo Business es Obligatorio').not().isEmpty(),
        check('business.tableID', 'El campo Business es Obligatorio').not().isEmpty(),
        check('orderDetails', 'El campo orderDetails es Obligatorio').not().isEmpty(),
        validateFields,
    ],
createOrders
);

// TODO: Vista de una Orden
router.post('/vworder',
    [
        check('business', 'El campo Business es Obligatorio').not().isEmpty(),
        validateFields,
    ],
viewOrder
);

// TODO: Editar una orden para agregar mas productos
router.post('/edtorderadd',
    [
        check('business', 'El campo Business es Obligatorio').not().isEmpty(),
        check('orderDetails', 'El campo orderDetails es Obligatorio').not().isEmpty(),
        check('delivery', 'El campo delivery es Obligatorio').not().isEmpty(),
        validateFields,
    ],
    editOrderAdd
);

// TODO: Eliminar un producto de la Orden.
router.post('/edtorderdel',
    [
        check('business', 'El campo Business es Obligatorio').not().isEmpty(),
        check('orderDetails', 'El campo orderDetails es Obligatorio').not().isEmpty(),
        check('delivery', 'El campo delivery es Obligatorio').not().isEmpty(),
        validateFields,
    ],
    editOrderDel
);

// TODO: Pago de la Orden.
router.post('/payorder',
    [
        validateJWT,
        check('business', 'El campo business es Obligatorio').not().isEmpty(),
        check('client', 'El campo client es Obligatorio').not().isEmpty(),
        check('OrderID', 'El campo OrderID es Obligatorio').not().isEmpty(),
        validateFields,
    ],
    payOrder
);

// TODO: Debemos crear una Vista para que el Usuario pueda ver el menu.
// TODO: Cuando hace la consulta desde WS o la Plataforma.


    module.exports = router;