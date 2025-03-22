const { ObjectId } = require('mongodb');
const { getDateTimeForCountry } = require('../../helper/global/times');
const { applogger } = require('../../../utils/logger');
const { viewBusinessForIDDAO, getUpdateinvoiceNumberByIDDAO } = require('../../business/dao/business');
const { createBillingDataDTO } = require('../dto/billingDTO');
const billing = require('../model/billing');
const { getUpdateorderByOrderIDDAO } = require('../../order.js/dao/orderDAO');


const getCreateBillingDAO = async (createBillingDto) => {

    const { orderID,business,client,delivery,orderStatus,items,subtotal,gratuity,
        discount,promoCodeItem,tax,totalAmount, paymentMethod } = createBillingDto;

        try {

            // Validamos que la orderID que NO exista en la base de datos.
            const validationOrderIDDB = await billing.findOne({ orderID: orderID });
            if (validationOrderIDDB) {
                return {
                    ok: false,
                    msg: `La OrderID ${orderID} ya fue facturada.`,
                };
            } else {
                const paymentDate = getDateTimeForCountry(business.countryCod);
                const viewBusinessForIDDao = await viewBusinessForIDDAO(business.businessID);
                
                const createBillingDataDto = new createBillingDataDTO(createBillingDto, 
                    viewBusinessForIDDao.msg.billingResolution, paymentDate);                
    
                // Crear una nueva instancia del modelo con la data del DTO
                const newBilling = new billing(createBillingDataDto);
                
                // Guardar la factura en la base de datos
                const savedBilling = await newBilling.save();
                console.log('savedBilling: ', savedBilling);
    
                // se actualiza el nuevo numero para la facturacion en business.
                console.log('Antes de Guardar: ', business.businessID, savedBilling.billingDetails.invoiceNumber);
                const getUpdateinvoiceNumberByIDDao = await getUpdateinvoiceNumberByIDDAO(business.businessID, savedBilling.billingDetails.invoiceNumber);
                console.log('getUpdateinvoiceNumberByIDDao: ', getUpdateinvoiceNumberByIDDao);
                // Sevactualiza la orden para que se muestre como cuenta pagada.
                const getUpdateorderByOrderIDDao = await getUpdateorderByOrderIDDAO(orderID);
    
                return {
                    ok: true,
                    msg: 'Factura Creada correctamente.',
                };
            }

            
        } catch (error) {
            applogger.error(`BILLDAO-01: getCreateBillingDAO Error al Consultar el Pedido de ${business.nit}: ${business.tradename}, error: ${error}`);
            return {
                ok: false,
                msg: `Error al Crear la Factura para el Pedido de: ${business.nit}: ${business.tradename}`, error
            };
        }
}




module.exports = { 
    getCreateBillingDAO,
}