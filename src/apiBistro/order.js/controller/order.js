const bcrypt = require('bcryptjs');
const { response } = require('express');
const { getCreateOrdersDAO, getViewOrderDAO, getEditOrderAddDAO, getEditOrderDelDAO, getPayOrderDAO } = require('../dao/orderDAO');
const { applogger } = require('../../../utils/logger');
const { CreateOrderDTO } = require('../../menuProfile/dto/orderDTO');
const { ShowTokenInComponentsDAO } = require('../../../middleware/globalValidations');

const createOrders = async (req, res) => {

    const orderData = req.body;
    const { business, client, orderDetails, delivery } = orderData;
    try {
        
        const createOrderDto = new CreateOrderDTO(business, client, orderDetails, delivery);
        // console.log('Entramos en createOrders DTO: ',createOrderDto);
        
        const getCreateOrdersDao = await getCreateOrdersDAO(createOrderDto);

        res.status(200).json({
            ok: true,
            msg: getCreateOrdersDao.msg,
        });
    } catch (error) {

        applogger.error(`ORDCLL-01: createOrders Guardar el Pedido de ${orderData.business.nit}: ${orderData.business.tradename}, error: ${error}`);
        res.json({
            ok: false,
            msg: `NO Se Guardo el Pedido: ${orderData.business.nit}: ${orderData.business.tradename}`, error
        });
    }

}

const viewOrder = async (req, res) => { 
    const orderData = req.body;
    const { business, client } = orderData;

    try {

        const getViewOrderDao = await getViewOrderDAO(business, client);

        if (getViewOrderDao.ok === false) {
            res.status(200).json({
              ok: false,
              msg: getViewOrderDao.msg
            });
          } else {
              res.status(200).json({
                  ok: true,
                  msg: getViewOrderDao.msg,
              });
          }

    } catch (error) {
        applogger.error(`ORDCLL-02: viewOrder Error al Consultar el Pedido de ${orderData.business.nit}: ${orderData.business.tradename}, error: ${error}`);
        res.json({
            ok: false,
            msg: `Error al Consultar el Pedido de: ${orderData.business.nit}: ${orderData.business.tradename}`, error
        });
    }
}

const editOrderAdd = async (req, res) => { 
    const orderData = req.body;
        
    try {

        const getEditOrderAddDao = await getEditOrderAddDAO(orderData);

        console.log('Entramos en editOrderAdd: ', getEditOrderAddDao);

        res.status(200).json({
            ok: true,
            msg: getEditOrderAddDao.msg,
        });
        
    } catch (error) {
        applogger.error(`ORDCLL-03: editOrderAdd Error al Adicionar un producto al Pedido de ${orderData.business.nit}: ${orderData.business.tradename}, error: ${error}`);
        res.json({
            ok: false,
            msg: `Error al Adicionar un producto al Pedido de: ${orderData.business.nit}: ${orderData.business.tradename}`, error
        });
    }

}

const editOrderDel = async (req, res) => { 
    const orderData = req.body;

    try {

        const getEditOrderAddDao = await getEditOrderDelDAO(orderData);

        console.log('Entramos en editOrderAdd: ', getEditOrderAddDao);

        res.status(200).json({
            ok: true,
            msg: getEditOrderAddDao.msg,
        });
        
    } catch (error) {
        console.log('error: ', error);  
        applogger.error(`ORDCLL-03: editOrderDel Error al Eliminar un producto al Pedido de ${orderData.business.nit}: ${orderData.business.tradename}, error: ${error}`);
        res.json({
            ok: false,
            msg: `Error al Eliminar un producto al Pedido de: ${orderData.business.nit}: ${orderData.business.tradename}`, error
        });
    }

}

// TODO: Proceso de pago de Order
const payOrder = async (req, res) => { 
    const token = req.header('x-token');
    const orderData = req.body;
    const { business, client, orderDetails, delivery } = orderData;
    try {
        const decodedToken = await ShowTokenInComponentsDAO(token)
        const { uid, bus, role } = decodedToken.msg
        
        // if(role === 'Administrador' && (bus === business.nit))






        const getPayOrderDao = await getPayOrderDAO(orderData);

        res.status(200).json({
            ok: true,
            msg: getPayOrderDao.msg,
        });

    } catch (error) {
        console.log('error: ', error);  
        applogger.error(`ORDCLL-03: payOrder Error al Generar el Pago de un Pedido ${orderData.business.nit}: ${orderData.business.tradename}, error: ${error}`);
        res.json({
            ok: false,
            msg: `Error al Generar el Pago de un Pedido: ${orderData.business.nit}: ${orderData.business.tradename}`, error
        });
    }

}



module.exports = {
    createOrders,
    viewOrder,
    editOrderAdd,
    editOrderDel,
    payOrder,
}