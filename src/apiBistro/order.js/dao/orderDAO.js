const { ObjectId } = require('mongodb');
const { getDateTimeForCountry } = require('../../helper/global/times');
const order = require('../model/order');
const menuBistro = require('../../menuBistro/model/menuBistro');

const getCreateMenuBistroDAO = async (DataMenuBistroDto) => {
    const { business, menu } = DataMenuBistroDto;
  
    try {
      // Generar la fecha actual según el país
      const dateNow = getDateTimeForCountry(business.countryCod);
  
      // Log para verificar los datos de entrada
      console.log('Datos de Entrada: ', business, menu, dateNow);
  
      // Construir el filtro para buscar el documento
      const filter = {
        'business.nit': business.nit,
        'business.tradename': business.tradename,
      };
  
      // Construir el nuevo documento
      const updatedDocument = {
        business: {
          business: business.business,
          nit: business.nit,
          nameBusiness: business.businessName,
          tradename: business.tradename,
          countryCod: business.countryCod,
        },
        menu: menu.map((category) => ({
          ...category,
          product: category.product.map((product) => ({
            ...product,
            productUnique: category.category + '_' + product.name,
            dateCreate: dateNow, // Añadir fecha de creación a cada producto
          })),
        })),
      };
  
      // Opciones para el método findOneAndUpdate
      const options = {
        new: true, // Devuelve el documento actualizado
        upsert: true, // Crea un nuevo documento si no existe
      };
  
      // Ejecutar la operación en la base de datos
      const result = await menuBistro.findOneAndUpdate(filter, updatedDocument, options);
  
      // Log del resultado
      console.log('Documento actualizado/creado:', result);
  
      return result;
    } catch (error) {
      console.error('Error al crear/actualizar el menú bistró:', error);
      throw new Error('Error al procesar la solicitud en la base de datos.');
    }
  };

  const getCreateOrdersDAO = async (orderData) => {
    const { business, client, orderDetails, delivery } = orderData;
    
    try {
        // Verificar si la mesa tiene una orden vigente
        let existingOrder = await order.findOne({
            "business.businessID": new mongoose.Types.ObjectId(business.businessID),
            "delivery.method": "DineIn",
            "delivery.status": "Unpaid Order",
            "orderStatus": { $ne: "Closed Order" },
            $or: [
                { "business.tableID": business.tableID },
                { "orderDetails.items": { 
                    $elemMatch: { 
                        statusItem: true, 
                        combinedTables: parseInt(business.tableID, 10) 
                    } 
                }}
            ]
        });
        
        if (existingOrder) {
            // Agregar los nuevos productos a la orden existente
            existingOrder.orderDetails.items.push(...orderDetails.items.map(item => ({
                productID: new mongoose.Types.ObjectId(item.productID),
                name: item.name,
                toppings: item.toppings.map(t => ({
                    flavor: t.flavor,
                    slices: parseInt(t.slices, 10) || 0
                })),
                quantity: parseInt(item.quantity, 10),
                price: parseFloat(item.price),
                promoCode: parseFloat(item.promoCode) || 0,
                total: parseFloat(item.total),
                statusItem: item.statusItem,
                notes: item.notes || '',
                takeAway: item.takeAway,
                mainTable: item.mainTable ? new mongoose.Types.ObjectId(item.mainTable) : null,
                tableID: parseInt(item.tableID, 10) || 0,
                table: parseInt(item.table, 10) || 0,
                combinedTables: item.combinedTables.map(t => parseInt(t, 10) || 0),
                staff: item.staff && item.staff.staffID
                    ? {
                        staffID: new mongoose.Types.ObjectId(item.staff.staffID),
                        fullName: item.staff.fullName
                    }
                    : {}
            })));
            
            // Guardar la orden actualizada
            const result = await existingOrder.save();
            return { ok: true, msg: 'Orden actualizada con nuevos productos.', order: result };
        }

        // Si no hay orden existente, crear una nueva
        const newOrder = new order({
            business: {
                businessID: new mongoose.Types.ObjectId(business.businessID),
                nit: parseInt(business.nit, 10),
                nameBusiness: business.nameBusiness,
                tradename: business.tradename,
                countryCod: business.countryCod,
                tableID: business.tableID
            },
            client: {
                document: client.document,
                fullName: client.fullName,
                phone: parseInt(client.phone, 10) || 0,
                address: client.address || '',
                addressComplement: client.addressComplement || ''
            },
            orderDetails: {
                items: orderDetails.items.map(item => ({
                    productID: new mongoose.Types.ObjectId(item.productID),
                    name: item.name,
                    toppings: item.toppings.map(t => ({
                        flavor: t.flavor,
                        slices: parseInt(t.slices, 10) || 0
                    })),
                    quantity: parseInt(item.quantity, 10),
                    price: parseFloat(item.price),
                    promoCode: parseFloat(item.promoCode) || 0,
                    total: parseFloat(item.total),
                    statusItem: item.statusItem,
                    notes: item.notes || '',
                    takeAway: item.takeAway,
                    mainTable: item.mainTable ? new mongoose.Types.ObjectId(item.mainTable) : null,
                    tableID: parseInt(item.tableID, 10) || 0,
                    table: parseInt(item.table, 10) || 0,
                    combinedTables: item.combinedTables.map(t => parseInt(t, 10) || 0),
                    staff: item.staff && item.staff.staffID
                        ? {
                            staffID: new mongoose.Types.ObjectId(item.staff.staffID),
                            fullName: item.staff.fullName
                        }
                        : {}
                })),
                deliveryMethod: orderDetails.deliveryMethod,
                status: orderDetails.status,
                subtotal: parseFloat(orderDetails.subtotal),
                tip: {
                    amount: parseFloat(orderDetails.tip.amount) || 0,
                    notes: orderDetails.tip.notes || '',
                    staff: orderDetails.tip.staff && orderDetails.tip.staff.staffID
                        ? {
                            staffID: new mongoose.Types.ObjectId(orderDetails.tip.staff.staffID),
                            fullName: orderDetails.tip.staff.fullName
                        }
                        : {}
                },
                totalPromoCode: parseFloat(orderDetails.totalPromoCode) || 0,
                tax: parseFloat(orderDetails.tax),
                totalAmount: parseFloat(orderDetails.totalAmount)
            },
            delivery: {
                method: delivery.method,
                status: delivery.status,
                cost: parseFloat(delivery.cost),
                estimatedTime: delivery.estimatedTime || '',
                address: delivery.address || '',
                addressComplement: delivery.addressComplement || ''
            },
            orderStatus: 'Pending'
        });

        // Guardar la orden en la base de datos
        const result = await newOrder.save();
        return { ok: true, msg: result };

    } catch (error) {
        console.error('Error al procesar el pedido:', error);
        return { ok: false, msg: `NO se creó el pedido para: ${business.nit}: ${business.tradename} - ${error.message}` };
    }
};




// TODO: Adicionar un producto al Pedido

const getViewOrderDAO = async (business) => {
  try {
    switch (business.deliveryMethod) {
      case "DineIn":
        return await getViewDineInOrders(business);
      case "StorePickup":
        console.log("Entro en StorePickup");
        return await getViewStorePickupOrders(business);
      case "HomeDelivery":
        return await getViewHomeDeliveryOrders(business); 
      default:
        return { ok: false, msg: "Método de entrega no válido" };
    }
  } catch (error) {
    console.error(`Error al obtener pedidos: ${error}`);
    return { ok: false, msg: error.message };
  }
};

// TODO: Gestion de ordenes desde la mesa del establecimiento
const getViewDineInOrders = async (business) => {
  try {
    const tableNumber = parseInt(business.tableID, 10);

    const pipeline = [
      {
        $match: {
          "business.businessID": new ObjectId(business.businessID),
          "delivery.method": "DineIn",
          "delivery.status": "Unpaid Order",
          "orderStatus": { $ne: "Closed Order" },
          $or: [
            { "business.tableID": business.tableID },
            { "orderDetails.items": { 
                $elemMatch: { 
                  statusItem: true, 
                  combinedTables: tableNumber 
                } 
              }
            }
          ]
        }
      },
      { $unwind: "$orderDetails.items" },
      { $match: { "orderDetails.items.statusItem": true } },
      {
        $group: {
          _id: {
            orderId: "$_id",
            productID: "$orderDetails.items.productID",
            name: "$orderDetails.items.name",
            price: "$orderDetails.items.price",
            takeAway: "$orderDetails.items.takeAway"
          },
          quantity: { $sum: "$orderDetails.items.quantity" },
          total: { $sum: "$orderDetails.items.total" },
          toppingsArrays: { $push: "$orderDetails.items.toppings" },
          business: { $first: "$business" },
          client: { $first: "$client" },
          orderStatus: { $first: "$orderStatus" },
          gratuity: { $first: { $ifNull: ["$gratuity", 0] } }
        }
      },
      {
        $project: {
          productID: "$_id.productID",
          name: "$_id.name",
          price: "$_id.price",
          takeAway: "$_id.takeAway",
          quantity: 1,
          total: 1,
          toppings: {
            $reduce: {
              input: "$toppingsArrays",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] }
            }
          },
          business: 1,
          client: 1,
          orderStatus: 1,
          gratuity: 1,
          orderId: "$_id.orderId"
        }
      },
      {
        $group: {
          _id: "$orderId",
          items: {
            $push: {
              productID: "$productID",
              name: "$name",
              price: "$price",
              takeAway: "$takeAway",
              quantity: "$quantity",
              total: "$total",
              toppings: "$toppings"
            }
          },
          business: { $first: "$business" },
          client: { $first: "$client" },
          orderStatus: { $first: "$orderStatus" },
          gratuity: { $first: { $ifNull: ["$gratuity", 0] } }
        }
      },
      {
        $addFields: {
          subtotal: {
            $sum: {
              $map: {
                input: "$items",
                as: "item",
                in: { $multiply: [ "$$item.price", "$$item.quantity" ] }
              }
            }
          }
        }
      },
      {
        $project: {
          orderId: "$_id",
          business: 1,
          client: 1,
          orderStatus: 1,
          gratuity: 1,
          items: 1,
          subtotal: 1
        }
      }
    ];

    const results = await order.aggregate(pipeline);
    return results.length
      ? { ok: true, msg: results[0] }
      : { ok: false, msg: "No hay órdenes pendientes en esta mesa" };
  } catch (error) {
    console.error(`Error en DineIn: ${error}`);
    return { ok: false, msg: error.message };
  }
};



// TODO: Ordenes para Recoger en Tienda
const getViewStorePickupOrders = async (business) => {
  try {
    const pipeline = [
      {
        $match: {
          "business.businessID": new ObjectId(business.businessID),
          "business.nit": business.nit,
          "business.tradename": business.tradename,
          "business.countryCod": business.countryCod,
          "business.tableID": business.tableID,
          "delivery.method": "StorePickup",
          "delivery.status": "Unpaid Order"
        }
      },
      // Descomponer el array de items (si existe)
      { 
        $unwind: { 
          path: "$orderDetails.items", 
          preserveNullAndEmptyArrays: true 
        } 
      },
      // Filtrar únicamente los ítems activos
      { 
        $match: { "orderDetails.items.statusItem": true } 
      },
      // Agrupar por producto para sumar cantidades, totales y acumular toppings
      {
        $group: {
          _id: {
            orderId: "$_id",
            productID: "$orderDetails.items.productID",
            name: "$orderDetails.items.name",
            price: "$orderDetails.items.price"
          },
          quantity: { $sum: "$orderDetails.items.quantity" },
          total: { $sum: "$orderDetails.items.total" },
          toppingsArrays: { $push: "$orderDetails.items.toppings" },
          // Recuperar otros campos de la orden
          business: { $first: "$business" },
          client: { $first: "$client" },
          orderStatus: { $first: "$orderStatus" },
          gratuity: { $first: "$gratuity" },
          delivery: { $first: "$delivery" }
        }
      },
      // Unificar los arrays de toppings en uno solo
      {
        $project: {
          productID: "$_id.productID",
          name: "$_id.name",
          price: "$_id.price",
          quantity: 1,
          total: 1,
          toppings: {
            $reduce: {
              input: "$toppingsArrays",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] }
            }
          },
          business: 1,
          client: 1,
          orderStatus: 1,
          gratuity: 1,
          delivery: 1,
          orderId: "$_id.orderId"
        }
      },
      // Reagrupar por orden para reconstruir el array de ítems
      {
        $group: {
          _id: "$orderId",
          items: {
            $push: {
              productID: "$productID",
              name: "$name",
              price: "$price",
              quantity: "$quantity",
              total: "$total",
              toppings: "$toppings"
            }
          },
          business: { $first: "$business" },
          client: { $first: "$client" },
          orderStatus: { $first: "$orderStatus" },
          gratuity: { $first: "$gratuity" },
          delivery: { $first: "$delivery" }
        }
      },
      // Calcular el subtotal sumando (price * quantity) de cada ítem agrupado
      {
        $addFields: {
          subtotal: {
            $sum: {
              $map: {
                input: "$items",
                as: "item",
                in: { $multiply: ["$$item.price", "$$item.quantity"] }
              }
            }
          }
        }
      },
      // Proyección final
      {
        $project: {
          _id: 0,
          business: 1,
          client: 1,
          orderStatus: 1,
          gratuity: 1,
          delivery: 1,
          items: 1,
          subtotal: 1
        }
      }
    ];

    const results = await order.aggregate(pipeline);
    return results.length
      ? { ok: true, msg: results }
      : { ok: false, msg: "No hay órdenes para recoger" };
  } catch (error) {
    console.error(`Error en StorePickup: ${error}`);
    return { ok: false, msg: error.message };
  }
};


// TODO: Ordenes para Domicilios
const getViewHomeDeliveryOrders = async (business) => {
  try {
    const pipeline = [
      {
        $match: {
          "business.businessID": new ObjectId(business.businessID),
          "business.nit": business.nit,
          "business.tradename": business.tradename,
          "business.countryCod": business.countryCod,
          "delivery.method": "HomeDelivery",
          "delivery.status": "Unpaid Order"
        }
      },
      {
        $project: {
          business: 1,
          client: 1,
          "orderStatus": 1,
          gratuity: 1,
          "delivery.method": "HomeDelivery",
          "delivery.status": "Unpaid Order",
          // Proyectar los ítems del pedido, si existen
          items: {
            $map: {
              input: { $ifNull: ["$orderDetails.items", []] },
              as: "item",
              in: {
                _id: "$$item._id",
                name: "$$item.name",
                quantity: "$$item.quantity",
                price: "$$item.price",
                total: { $multiply: ["$$item.price", "$$item.quantity"] },
                toppings: "$$item.toppings",
                statusItem: "$$item.statusItem"
              }
            }
          },
          // Calcular el subtotal sumando el total de cada ítem
          subtotal: {
            $sum: {
              $map: {
                input: { $ifNull: ["$orderDetails.items", []] },
                as: "item",
                in: { $multiply: ["$$item.price", "$$item.quantity"] }
              }
            }
          }
        }
      }
    ];

    const results = await order.aggregate(pipeline);
    
    return results.length
      ? { ok: true, msg: results }
      : { ok: false, msg: "No hay órdenes de domicilio pendientes" };
  } catch (error) {
    console.error(`Error en HomeDelivery: ${error}`);
    return { ok: false, msg: error.message };
  }
};

// TODO: Edicion de Ordes para Agregar Productos
const getEditOrderAddDAO = async (orderData) => { 

  const { business, orderDetails, delivery, _id, orderStatus } = orderData;

  try {

    // Recuperar el pedido existente por _id
    const existingOrder = await order.findById(_id);
    if (!existingOrder) {
      return { ok: false, msg: "Orden no encontrada" };
    }

    // Validar que la cuenta esté abierta (delivery.status debe ser "Unpaid Order")
    if (!(existingOrder.delivery.status === "Unpaid Order" && existingOrder.orderStatus === "Pending")) {
      return {
        ok: false,
        msg: "La cuenta ya está cerrada. No se puede agregar producto."
      };
    }

    // Validar que el negocio sea el mismo
    if (
      existingOrder.business.nit !== business.nit ||
      existingOrder.business.tradename !== business.tradename ||
      existingOrder.business.countryCod !== business.countryCod
    ) {
      return { ok: false, msg: "El negocio no coincide." };
    }

    // Validar la condición de la mesa
    // El número de mesa provisto (convertido a número)
    const providedTableNumber = parseInt(business.tableID, 10);
    // La mesa principal del pedido (almacenada en el pedido)
    const mainTable = parseInt(existingOrder.business.tableID, 10);

    if (providedTableNumber !== mainTable) {
      // Si es diferente a la mesa principal, debe estar en combinedTables de algún item
      const tableFound = existingOrder.orderDetails.items.some(item => {
        return item.combinedTables && item.combinedTables.includes(providedTableNumber);
      });
      if (!tableFound) {
        return { 
          ok: false, 
          msg: "Desde esa mesa no se puede realizar un pedido." 
        };
      }
    }

    // Suponemos que el nuevo producto viene en orderDetails.items (por ejemplo, el primer elemento del arreglo)
    const newProduct = orderDetails.items[0];
    if (!newProduct) {
      return { ok: false, msg: "No se envió un producto para agregar." };
    }

    // Realizar conversiones necesarias para el nuevo producto
    newProduct.productID = new mongoose.Types.ObjectId(newProduct.productID);
    newProduct.quantity = parseInt(newProduct.quantity, 10);
    newProduct.price = parseFloat(newProduct.price);
    newProduct.promoCode = parseFloat(newProduct.promoCode) || 0;
    newProduct.total = parseFloat(newProduct.total);
    
    // Convertir staff.staffID a ObjectId si existe
    if(newProduct.staff && newProduct.staff.staffID) {
      newProduct.staff.staffID = new mongoose.Types.ObjectId(newProduct.staff.staffID);
    }
    // Asegurarse de que combinedTables es un arreglo de números
    if (newProduct.combinedTables && Array.isArray(newProduct.combinedTables)) {
      newProduct.combinedTables = newProduct.combinedTables.map(t => parseInt(t, 10));
    }

    // Actualizar el pedido: agregar el nuevo producto al arreglo de items
    const updatedOrder = await order.findByIdAndUpdate(
      _id,
      { $push: { "orderDetails.items": newProduct } },
      { new: true }
    );

    return { 
      ok: true, 
      msg: updatedOrder 
    };



  } catch (error) {
    applogger.error(`ORDDAO-05: getEditOrderAddDAO Error al Adicionar un producto al Pedido de ${business.nit}: ${business.tradename}, error: ${error}`);
        res.json({
            ok: false,
            msg: `Error al Adicionar un producto al Pedido de: ${business.nit}: ${business.tradename}`, error
        });
  }


}


// TODO: Eliminar un producto del Pedido
const getEditOrderDelDAO = async (orderData) => { 
  const { business, orderDetails, _id, orderStatus, delivery } = orderData;

  try {
    // Recuperar el pedido existente por _id
    const existingOrder = await order.findById(_id);
    if (!existingOrder) {
      return { ok: false, msg: "Orden no encontrada" };
    }

    // Validar que la cuenta esté abierta:
    // Solo se permite si delivery.status es "Unpaid Order" y orderStatus es "Pending"
    if (!(existingOrder.delivery.status === "Unpaid Order" && existingOrder.orderStatus === "Pending")) {
      return {
        ok: false,
        msg: "La cuenta ya está cerrada. No se puede eliminar producto."
      };
    }

    // Validar que el negocio sea el mismo
    if (
      existingOrder.business.nit !== business.nit ||
      existingOrder.business.tradename !== business.tradename ||
      existingOrder.business.countryCod !== business.countryCod
    ) {
      return { ok: false, msg: "El negocio no coincide." };
    }

    // Validar la condición de la mesa
    // El número de mesa provisto (convertido a número)
    const providedTableNumber = parseInt(business.tableID, 10);
    // La mesa principal del pedido (almacenada en el pedido)
    const mainTable = parseInt(existingOrder.business.tableID, 10);

    if (providedTableNumber !== mainTable) {
      // Si es diferente a la mesa principal, debe estar en combinedTables de algún item
      const tableFound = existingOrder.orderDetails.items.some(item => {
        return item.combinedTables && item.combinedTables.includes(providedTableNumber);
      });
      if (!tableFound) {
        return { 
          ok: false, 
          msg: "Desde esa mesa no se puede realizar un pedido." 
        };
      }
    }

    // Validar que se envíe un producto para eliminar
    const delItem = orderDetails.items[0];
    if (!delItem) {
      return { ok: false, msg: "No se envió un producto para eliminar." };
    }

    // Convertir el productID a ObjectId y obtener la mesa de referencia del item a eliminar
    const productIdToDelete = new mongoose.Types.ObjectId(delItem.productID);
    const tableToMatch = parseInt(delItem.table, 10);

    // Actualizar el pedido: en el arreglo de items, encontrar el producto que coincida
    // con productID y table, y actualizar su campo statusItem a false
    const updatedOrder = await order.findOneAndUpdate(
      { 
        _id: _id,
        "orderDetails.items.productID": productIdToDelete,
        "orderDetails.items.table": tableToMatch
      },
      { $set: { 
          "orderDetails.items.$.statusItem": false,
          "orderDetails.items.$.notes": delItem.notes // se actualiza con el nuevo valor
        }
      },
      { new: true }
    );

    return { 
      ok: true, 
      msg: updatedOrder 
    };

  } catch (error) {
    console.error(`ORDDAO-06: getEditOrderDelDAO Error al eliminar un producto del Pedido de ${business.nit}: ${business.tradename}, error: ${error}`);
    return {
      ok: false,
      msg: `Error al eliminar un producto del Pedido de: ${business.nit}: ${business.tradename}`,
      error: error.message
    };
  }
};

// TODO: Proceso de pago de una Orden
const getViewOrderByIDDAO = async (orderID) => {
  
  
  try {

    const getOrderByIDDB = await order.findById(orderID);
    
    if (!getOrderByIDDB) {      
      return {
        ok: false,
        msg: "Orden no encontrada"
      };    
    }
    
    return { 
      ok: true, 
      msg: getOrderByIDDB 
    };
    
  } catch (error) {
    console.error(`ORDDAO-07: getPayOrderDAO Error al Generar el Pago de un Pedido de ${business.nit}: ${business.tradename}, error: ${error}`);
    return {
      ok: false,
      msg: `Error al Generar el Pago de un Pedido de: ${business.nit}: ${business.tradename}`,
      error: error.message
    };
    
  }

 }

 const getUpdateorderByOrderIDDAO = async (orderID) => {
  try {
    const updatedOrder = await order.findByIdAndUpdate(
      orderID,
      {
        $set: {
          "delivery.status": "PaidInFull",
          "payment.$[].status": "PaidInFull",
          "orderStatus": "Closed Order",
          "orderDetails.status": "Closed Order"
        }
      },
      { new: true }
    );

    return {
      ok: true,
      msg: updatedOrder,
    };
  } catch (error) {
    console.error("Error updating order:", error);
    return {
      ok: false,
      msg: "Error al actualizar la orden",
      error,
    };
  }
};
  

module.exports = { 
    getCreateMenuBistroDAO,
    getCreateOrdersDAO,
    getViewOrderDAO,
    getEditOrderAddDAO,
    getEditOrderDelDAO,
    getViewOrderByIDDAO,
    getUpdateorderByOrderIDDAO
}