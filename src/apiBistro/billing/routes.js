/*  
    METODO: POST
    RUTA: /api/bill
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { createBillingOrder, createPreBillingOrder } = require('./controller/billing');
const { validateJWT, validateFields } = require('../../middleware/globalValidations');


const router = Router();


router.post('/',
        [
            validateJWT,
            check('business', 'El campo business es Obligatorio').not().isEmpty(),
            check('client', 'El campo client es Obligatorio').not().isEmpty(),
            check('orderID', 'El campo orderID es Obligatorio').not().isEmpty(),
            validateFields,
        ],
        createBillingOrder
    );

router.post('/pre',
        [
            validateJWT,
            check('business', 'El campo business es Obligatorio').not().isEmpty(),
            check('client', 'El campo client es Obligatorio').not().isEmpty(),
            check('orderID', 'El campo orderID es Obligatorio').not().isEmpty(),
            validateFields,
        ],
        createPreBillingOrder
    );

module.exports = router;