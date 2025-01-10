const { Schema, model } = require('mongoose');

const OrderSchema = Schema({
    business: {
        businessID: {
            type: Schema.Types.ObjectId,
            ref: 'business',
            required: true
        },
        nit: {
            type: Number
        },
        nameBusiness: {
            type: String
        },
        tradename: {
            type: String
        },
        countryCod: {
            type: String
        }
    },
    client: [{
        document: {
            type: String,
        },
        fullName: {
            type: String,
        },
    }],
    orderDetails: {
        items: [
            {
                productID: {
                    type: Schema.Types.ObjectId,
                    ref: 'menuBistros',
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                toppings: [
                    {
                        flavor: {
                            type: String
                        },
                        slices: {
                            type: Number
                        },
                    }
                ],
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                price: {
                    type: Number,
                    required: true
                },
                promoCode: {
                    type: Number,
                },
                total: {
                    type: Number,
                    required: true // quantity * price
                },
                statusItem: {
                    type: Boolean, // TODO: Aqui el cliente puede cancelar un producto
                    default: true
                },
                notes: {
                    type: String,
                },
                takeAway: {
                    type: Boolean,
                    default: false
                },
                mainTable: {
                    type: Schema.Types.ObjectId,
                    ref: 'Table', // Referencia a la Combinacion de la Mesa (número menor)
                    default: null // Para determinar cuál es la mesa principal en la combinación
                },
                tableID: {
                    type: Number, // Referencia al numero de la Mesa
                },
                table: {
                    type: Number, // Referencia al Numero menor de la Mesa, en caso de combinacion
                    default: 0
                },
                combinedTables: [{
                    type: Number,// Referencia a otras mesas combinadas
                    default: 0
                }],
            }
        ],
        deliveryMethod: { //TODO: Aqui definimos como se entrega el pedido
            type: String,
            enum: ['allAtOnce', 'asReady'],
            default: 'asReady', // Valor predeterminado para la entrega a la mesa
        },
        status: { //TODO: Aqui definimos las etapa del pedido
            type: String,
            enum: ['OrderConfirmed', 'BeingPrepared', 'ReadyforDelivery', 'Delivered','Cancelled','Completed','Cooking', 'Served'],
            default: 'OrderConfirmed', // Valor predeterminado para recogida en el local
        },
        subtotal: {
            type: Number,
            required: true
        },
        tip: { // Valor de la Propina
            type: Number,
        },
        totalPromoCode: { // Suma si algun producto tiene a un valor de promocion
            type: Number,
        },
        tax: {
            type: Number,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        }
    },
    delivery: {
        method: {
            type: String,
            enum: ['StorePickup', 'HomeDelivery', 'DineIn'],
            default: 'StorePickup', // Valor predeterminado para recogida en el local
        },
        status: {
            type: String,
            enum: ['Pending', 'In Transit', 'Delivered', 'Incomplete Order', 'Cancelled'],
            default: 'Pending' // Estado inicial del domicilio
        },
        cost: {
            type: Number,
            default: 0 // Coste adicional por domicilio, si aplica
        },
        estimatedTime: {
            type: String, // Tiempo estimado de entrega
            // required: function() { return this.delivery.method === 'HomeDelivery'; }
        }
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'In Transit', 'Delivered', 'Incomplete Order', 'Cancelled'],
        default: 'Pending'
    },
    payment: [{
        method: {
            type: String,
            enum: ['Cash', 'Credit Card', 'Online Payment', 'Digital Wallet', 'PayPal', 'CryptoCurrency'],
            required: true
        },
        status: {
            type: String,
            enum: ['Authorized', 'Refunded', 'Partially Paid', 'Disputed', 'Expired', 'Chargeback', 'In Progress', 'On Hold'],
            default: 'Pending'
        },
        amount: {
            type: Number,
            required: true // El monto del pago realizado
        },
        fullName: {
            type: String,
            required: false // Nombre del cliente que hizo el pago (opcional)
        },
        timestamp: {
            type: String, // Fecha y hora en que se realizó el pago
        },
        paidItems: [{
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true
            },
        }],
        electronicInvoice: {
            required: {
                type: Boolean,
                default: false // Indica si el cliente solicitó una factura electrónica
            },
            fullName: {
                type: String, // Número de la factura electrónica // Solo requerido si se solicita factura electrónica
            },
            documentNumber: {
                type: String, // Número de la factura electrónica // Solo requerido si se solicita factura electrónica
            },
            email: {
                type: String, // Número de la factura electrónica // Solo requerido si se solicita factura electrónica
            },
            address: {
                type: String, // Número de la factura electrónica // Solo requerido si se solicita factura electrónica
            },
            invoiceNumber: {
                type: String, // Número de la factura electrónica
                //required: function() { return this.electronicInvoice; } // Solo requerido si se solicita factura electrónica
            },
            documentType: {
                type: String,
                enum: ['Factura', 'Boleta'], // Tipos de documento disponibles
                //required: function() { return this.electronicInvoice; } // Solo requerido si se solicita factura electrónica
            },
            issueDate: {
                type: Date, 
                //required: function() { return this.electronicInvoice; } // Solo requerido si se solicita factura electrónica
            },
            taxId: {
                type: String, // NIT o RUC del cliente (opcional)
                required: false // Puede ser requerido dependiendo de las regulaciones fiscales locales
            }
        }
    }],
    createdAt: {
        type: String        
    },    
    updatedAt: [{
        dateUpdate: {
            type: String,
        },
        updateUser: {
            type: Schema.Types.ObjectId,
            ref: 'staff',
        },
        observation: {
            type: String,
        }
    }]
}, { collection: 'orders' });

OrderSchema.index({
    'business.businessID': 1
});
OrderSchema.index({
    'business.nit': 1
});
OrderSchema.index({
    'business.nameBusiness': 1
});
OrderSchema.index({
    'business.tradename': 1
});
OrderSchema.index({
    'business.countryCod': 1
});

OrderSchema.index({
    'business.businessID': 1,
    'business.nit': 1,
    'business.nameBusiness': 1,
    'business.tradename': 1,
    'business.countryCod': 1
});


OrderSchema.index({
    'client.document': 1
});
OrderSchema.index({
    'client.fullName': 1
});
OrderSchema.index({
    'client.document': 1,
    'client.fullName': 1
});

OrderSchema.index({
    'business.nit': 1,
    'client.document': 1,
    'client.fullName': 1,
    'orderDetails.items.name': 1,
    'payment.method': 1,
    'orderStatus': 1
});

OrderSchema.index({
    'orderDetails.items.productID': 1
});
OrderSchema.index({
    'orderDetails.items.notes': 1
});
OrderSchema.index({
    'orderDetails.items.name': 1
});
OrderSchema.index({
    'orderDetails.items.combinedTables': 1
});
OrderSchema.index({
    'orderDetails.items.tableID': 1
});
OrderSchema.index({
    'orderDetails.items.table': 1
});
OrderSchema.index({
    'orderDetails.items.mainTable': 1
});

OrderSchema.index({
    'delivery.method': 1
});
OrderSchema.index({
    'delivery.status': 1
});

OrderSchema.index({
    'orderStatus': 1
});
OrderSchema.index({
    'payment.method': 1
});
OrderSchema.index({
    'payment.status': 1
});
OrderSchema.index({
    'createdAt': 1
});



OrderSchema.method('toJSON', function() {
    const { __v,  ...object } = this.toObject();
    return object;
});



module.exports = model('order', OrderSchema);

/**
 * 
    1. Authorized: Autorizado. Indica que el pago ha sido aprobado por el banco, pero aún no se ha capturado.
    2. Refunded: Reembolsado. Indica que el pago fue devuelto al cliente.
    3. Partially Paid: Parcialmente pagado. Indica que solo se ha recibido una parte del monto total.
    4. Disputed: En disputa. Indica que el cliente o la institución financiera ha cuestionado el cargo.
    5. Expired: Expirado. Indica que el pago no se completó dentro del tiempo permitido.
    6. Chargeback: Contracargo. Indica que el cliente ha solicitado una devolución forzada a través de su banco.
    7. In Progress: En progreso. Indica que el pago está en revisión o espera de confirmación adicional.
    8. On Hold: En espera. Indica que el pago está retenido por algún motivo (revisión de seguridad, fondos no disponibles, etc.).
 */