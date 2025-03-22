const bcrypt = require('bcryptjs');
const { response } = require('express');
const { ObjectId } = require('mongodb');

const { applogger } = require('../../../utils/logger');
const { ShowTokenInComponentsDAO } = require('../../../middleware/globalValidations');
const { getViewOrderByIDDAO } = require('../../order.js/dao/orderDAO');
const { createPreBillingDTO, createBillingDTO } = require('../dto/billingDTO');
const { viewBusinessForIDDAO } = require('../../business/dao/business');
const { getCreateBillingDAO } = require('../dao/billingDAO');
const { getDateTimeForCountry } = require('../../helper/global/times');

const createBillingOrder = async (req, res) => {

    // LEER EL TOKEN
    const token = req.header('x-token');
    // LEER EL BODY
    const orderData = req.body;
    const { orderID, business, client, delivery, orderStatus, items, gratuity, subtotal, 
        discount, promoCodeItem, taxType, taxPercentage, tax, totalAmount, paymentMethod } = orderData;

    // VALIDAR EL TOKEN
    const decodedToken = await ShowTokenInComponentsDAO(token)
    const { uid, tradeName, role, establishments } = decodedToken.msg

    if(role === 'Administrador' && (establishments === orderData.business.businessID)){

        // TODO: Validamos la OrdenID corresponda al Establecimiento
        const GetViewOrderByIDDao = await getViewOrderByIDDAO(orderID);

        if (
            !GetViewOrderByIDDao.ok ||
            !new ObjectId(establishments).equals(GetViewOrderByIDDao.msg.business.businessID) ||
            GetViewOrderByIDDao.msg.business.tradename !== business.tradename ||
            GetViewOrderByIDDao.msg.orderStatus !== 'Pending'
        ) {
            return res.status(403).json({
                ok: false,
                msg: `Para la OrderID ${orderID}, El estado de No es: Pending.`,
            });
        }

        // TODO: Validamos los datos de Impuestos del Establecimiento
        const viewBusinessForIDDao = await viewBusinessForIDDAO(establishments);

        // TODO: Asignar los datos de tax del establecimiento a orderData.tax
        orderData.tax.taxType = viewBusinessForIDDao.msg.tax.taxType;
        orderData.tax.taxPercentage = viewBusinessForIDDao.msg.tax.taxPercentage;

        // TODO: Validamos los datos de la Factura del Pedido
        const createBillingDto = new createBillingDTO(orderData);

        if (!createBillingDto) {
            applogger.error(`BILLCLL-01.1: createBillingOrder => Error al Generar DTO de la Factura de ${orderData.business.nit}: ${orderData.business.tradename}`);          
            return res.status(403).json({
                ok: false,
                msg: 'Error al Generar DTO de la Factura.',
            });
        }
        // TODO: Guardamos la Factura en la Base de Datos
        const getCreateBillingDao = await getCreateBillingDAO(createBillingDto);

        res.status(200).json({
            ok: true,
            msg: getCreateBillingDao.msg,
        });

    } else {
        applogger.error(`BILLCLL-01: createBillingOrder => Error al Generar la Factura del Pedido de ${orderData.business.nit}: ${orderData.business.tradename}`);
        res.status(403).json({
            ok: false,
            msg: `Error al Generar la Factura del Pedido.`
          });
    }
}

const createPreBillingOrder = async (req, res) => {

     // LEER EL TOKEN
     const token = req.header('x-token');
     // LEER EL BODY
     const orderData = req.body;
     const { orderID, business } = orderData;
 
     // VALIDAR EL TOKEN
     const decodedToken = await ShowTokenInComponentsDAO(token)
     const { role, establishments } = decodedToken.msg
 
     
     if(role === 'Administrador' && (establishments === orderData.business.businessID)){
 
         // TODO: Validamos la OrdenID corresponda al Establecimiento
         const GetViewOrderByIDDao = await getViewOrderByIDDAO(orderID);

         console.log('GetViewOrderByIDDao: ', establishments, GetViewOrderByIDDao );
        //  console.log('GetViewOrderByIDDao: ', GetViewOrderByIDDao.msg.business.tradename, business.tradename);
         console.log('GetViewOrderByIDDao: ', GetViewOrderByIDDao.msg.orderStatus);
 
         if (
            !GetViewOrderByIDDao.ok ||
            !new ObjectId(establishments).equals(GetViewOrderByIDDao.msg.business.businessID) ||
            GetViewOrderByIDDao.msg.business.tradename !== business.tradename ||
            GetViewOrderByIDDao.msg.orderStatus !== 'Pending'
        ) {
            return res.status(403).json({
                ok: false,
                msg: `Para la OrderID ${orderID}, El estado de No es: 'Pending'.`,
            });
        } 
        try {
            // Validamos y construimos la Factura del Pedido
            const createPreBillingDto = new createPreBillingDTO(GetViewOrderByIDDao.msg);

            res.status(200).json({
                ok: true,
                msg: createPreBillingDto,
            });
        } catch (error) {
            console.error('Error al crear la estructura de la prefactura:', error);
            return res.status(500).json({
                ok: false,
                msg: 'Ocurrió un error al generar la prefactura. Por favor, inténtelo de nuevo.',
                error: error.message,
            });
        }
     } else {
        applogger.error(`BILLCLL-02: createPreBillingOrder => Error al Generar la PreFactura del Pedido de ${orderData.business.nit}: ${orderData.business.tradename}, error: ${error}`);
        res.status(403).json({
            ok: false,
            msg: `Error al Generar la PreFactura del Pedido.`
        });
     }

}

module.exports = {
    createBillingOrder,
    createPreBillingOrder,
}
