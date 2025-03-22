class createPreBillingDTO {
    constructor(order) {
        // Mapeo del ID de la orden
        this.orderID = (order._id && order._id.$oid) || order._id;
    
        // Datos del negocio
        this.business = {
          businessID: (order.business.businessID && order.business.businessID.$oid) || order.business.businessID,
          nit: order.business.nit,
          nameBusiness: order.business.nameBusiness,
          tradename: order.business.tradename,
          countryCod: order.business.countryCod,
          tableID: order.business.tableID
        };
    
        // Datos del cliente
        this.client = {
          document: order.client.document,
          fullName: order.client.fullName,
          phone: order.client.phone,
          address: order.client.address,
          addressComplement: order.client.addressComplement
        };
    
        // Datos de entrega
        this.delivery = {
          method: order.delivery.method,
          status: order.delivery.status
        };
    
        // Estado de la orden
        this.orderStatus = order.orderStatus;
    
        // Procesar cada ítem: recalcular total como price * quantity y mapear toppings
        this.items = order.orderDetails.items.map(item => ({
          productID: (item.productID && item.productID.$oid) || item.productID,
          name: item.name,
          price: item.price,
          takeAway: item.takeAway,
          quantity: item.quantity,
          total: item.price * item.quantity,
          toppings: item.toppings.map(topping => ({
            flavor: topping.flavor,
            slices: topping.slices,
            _id: (topping._id && topping._id.$oid) || topping._id
          }))
        }));
    
        // Calcular el subtotal sumando los totales de cada ítem
        this.subtotal = this.items.reduce((acc, item) => acc + item.total, 0);
    
        // El totalAmount en la prefactura se define igual al subtotal (se pueden agregar descuentos o gratuity si se requiriera)
        this.totalAmount = this.subtotal;
    
        // Gratuity, discount y promoCodeItem (con valores por defecto si no existen)
        this.gratuity = order.orderDetails.gratuity || 0;
        this.discount = order.orderDetails.discount || 0;
        this.promoCodeItem = order.orderDetails.promoCodeItem || "";
    
        // Calcular el impuesto
        // Si no viene taxType en la orden, se asume 'INC'
        const taxType = order.orderDetails.taxType || 'INC';
        if (taxType === 'INC') {
          // Calcula la base dividiendo el subtotal entre 1.08
          const baseAmount = this.subtotal / 1.08;
          // El valor del impuesto es la diferencia entre el subtotal y la base
          const taxValue = Math.round(this.subtotal - baseAmount);
          this.tax = {
            taxType: 'INC',
            taxPercentage: 8,
            taxValue: taxValue
          };
        } else {
          this.tax = {
            taxType: taxType,
            taxPercentage: order.orderDetails.taxPercentage,
            taxValue: order.orderDetails.tax || 0
          };
        }
      }
    }

    class createBillingDTO {
      constructor(orderData) {
          // 1. Validación: orderStatus debe ser "Pending"
          if (orderData.orderStatus !== 'Pending') {
              throw new Error("El estado de la orden no es 'Pending'");
          }
  
          // 2. Validar cada ítem: price * quantity === total
          let computedSubtotal = 0;
          orderData.items.forEach((item, index) => {
              const expectedTotal = item.price * item.quantity;
              if (expectedTotal !== item.total) {
                  throw new Error(
                      `El total del ítem '${item.name}' (ítem ${index + 1}) no coincide: esperado ${expectedTotal} pero se encontró ${item.total}`
                  );
              }
              computedSubtotal += item.total;
          });
  
          // 3. Validar que el subtotal sea la sumatoria de todos los ítems
          if (computedSubtotal !== orderData.subtotal) {
              throw new Error(
                  `El subtotal no coincide: esperado ${computedSubtotal} pero se encontró ${orderData.subtotal}`
              );
          }
  
          // 4. Validar la operación de tax:
          // taxValue = subtotal - (subtotal / (1 + taxPercentage/100))
          const computedTaxValue = orderData.subtotal - (orderData.subtotal / (1 + orderData.tax.taxPercentage / 100));
          const roundedTaxValue = Math.round(computedTaxValue);
          orderData.tax.taxValue = roundedTaxValue;
  
          // 5. Calcular totalAmount = subtotal + gratuity - discount
          const computedTotalAmount = orderData.subtotal + orderData.gratuity - orderData.discount;
          
  
          // Asignar las propiedades validadas y calculadas
          this.orderID = orderData.orderID;
          this.business = orderData.business;
          this.client = orderData.client;
          this.delivery = orderData.delivery;
          this.orderStatus = orderData.orderStatus;
          this.items = orderData.items;
          this.subtotal = orderData.subtotal;
          this.gratuity = orderData.gratuity;
          this.discount = orderData.discount;
          this.promoCodeItem = orderData.promoCodeItem;
          this.tax = orderData.tax;
          // Usamos el totalAmount calculado en lugar del enviado
          this.totalAmount = computedTotalAmount;
          this.paymentMethod = orderData.paymentMethod;
      }
  }

  class createBillingDataDTO {
    /**
     * @param {Object} billingData - La data validada de la factura (generada por createBillingDTO).
     * @param {Object} billingResolution - La información de resolución obtenida desde viewBusinessForIDDAO.
     * @param paymentDate - Fecha de pago.
     */
    constructor(billingData, billingResolution, paymentDate) {
      // 1. Mapear la referencia del pedido.
      this.orderID = billingData.orderID;
      
      // 2. Mapear la información del negocio.
      this.business = {
        businessID: billingData.business.businessID,
        nit: billingData.business.nit,
        nameBusiness: billingData.business.nameBusiness || billingData.business.name, // según corresponda
        tradename: billingData.business.tradename,
        countryCod: billingData.business.countryCod,
      };
  
      // 3. Mapear la información del cliente.
      this.client = {
        document: billingData.client.document,
        fullName: billingData.client.fullName,
        phone: billingData.client.phone,
        address: billingData.client.address,
        addressComplement: billingData.client.addressComplement,
      };
  
      // 4. Generar datos de facturación (billingDetails).
      // Se utiliza la resolución para generar el número de factura.
      // Ejemplo: invoiceNumber = prefix + (currentNumbering + 1)
      const invoiceNumber = billingResolution.prefix + (billingResolution.currentNumbering + 1);
      // Fecha de emisión: se puede obtener según la zona horaria del país.
      const dateIssued = billingResolution.startDate;
      // Para este ejemplo, asignamos dueDate igual a dateIssued (o lo puedes calcular según reglas de negocio)
      const dueDate = billingResolution.endDate;
  
      this.billingDetails = {
        invoiceNumber,      // Número de factura generado con la resolución
        dateIssued,         // Fecha de emisión
        dueDate,            // Fecha de vencimiento
        paymentStatus: 'PaidInFull',
        currency: billingResolution.currency,
        // Mapear los ítems de la factura
        items: billingData.items.map(item => ({
          productID: item.productID,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          subTotalItem: item.total, // Se asume que 'total' ya fue validado como price * quantity
          discount: item.discount || 0,
          promoCodeItem: item.promoCodeItem || ""
        })),
        gratuity: billingData.gratuity,
        subtotal: billingData.subtotal,
        discount: billingData.discount,
        promoCodeItem: billingData.promoCodeItem,
        tax: {
          taxType: billingData.tax.taxType,
          taxPercentage: billingData.tax.taxPercentage,
          taxValue: billingData.tax.taxValue,
        },
        totalAmount: billingData.totalAmount,
        notes: billingData.notes || ""
      };
  
      // 5. Mapear información de pago (por defecto se asigna el método recibido).
      this.payment = [{
        method: billingData.paymentMethod || 'Cash',
        status: 'PaidInFull',
        amount: billingData.totalAmount,
        transactionID: billingData.transactionID || '',
        paymentDate: billingData.paymentDate || ''
      }];
  
      // 6. Mapear la información de delivery.
      this.delivery = {
        method: billingData.delivery.method,
        status: 'PaidInFull'
      };
  
      // 7. Otras propiedades: createdAt, updatedAt, AImanagement y vector.
      this.createdAt = paymentDate;
      this.updatedAt = [];
      this.AImanagement = [];
      this.vector = { data: [], metadata: [], relevance: 0 };
    }
  }


  
  module.exports = { 
    createPreBillingDTO,
    createBillingDTO,
    createBillingDataDTO,
  }

  