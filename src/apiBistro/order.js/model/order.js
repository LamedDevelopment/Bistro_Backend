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
        },
        tableID: {
            type: String
        }
    },
    client: {
        document: {
            type: String,
        },
        fullName: {
            type: String,
        },
        phone: {
            type: Number,
        },
        address: {
            type: String,
        },
        addressComplement: {
            type: String,
        }
    },
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
                    default: 0
                },
                table: {
                    type: Number, // Referencia al Numero menor de la Mesa, en caso de combinacion
                    default: 0
                },
                combinedTables: [{
                    type: Number,// Referencia a otras mesas combinadas
                    default: 0
                }],
                staff: {
                    staffID: {
                        type: Schema.Types.ObjectId,
                        ref: 'staff',
                    },
                    fullName: {
                        type: String,
                    }
                }
            }
        ],
        gratuity: {
            type: Number,
            default: 0
        },
        deliveryMethod: { //TODO: Aqui definimos como se entrega el pedido, si todo en una sola entrega
            type: String,
            enum: ['allAtOnce', 'asReady'],
            default: 'allAtOnce', // Valor predeterminado para la entrega a la mesa
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
        tip: {
            amount: {
                type: Number, // Monto de la propina
                default: 0 // Propina inicial es opcional y predeterminada a 0
            },
            notes: {
                type: String, // Observaciones o agradecimientos opcionales
            },
            staff: {
                staffID: {
                    type: Schema.Types.ObjectId,
                    ref: 'staff',
                },
                fullName: {
                    type: String,
                }
            }
        },
        totalPromoCode: { // Suma si algun producto tiene a un valor de promocion
            type: Number,
            default: 0
        },
        tax: {
            taxType: {
                type: String,
            },
            taxPercentage: {
                type: Number,
            },
            status: {
                type: Boolean,
            },
        },
        totalAmount: {
            type: Number,
            default: 0
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
            enum: ['Unpaid Order','Paid in Full','Partially Paid', 'Pending', 'In Transit', 'Delivered', 'Incomplete Order', 'Cancelled'],
            default: 'Unpaid Order' // Estado inicial del Pedido
        },
        cost: {
            type: Number,
            default: 0 // Coste adicional por domicilio, si aplica
        },
        estimatedTime: {
            type: String, // Tiempo estimado de entrega
            // required: function() { return this.delivery.method === 'HomeDelivery'; }
        },
        address: {
            type: String, // Direccion de entrega del Domicilio
        },
        addressComplement: {
            type: String, // Informacion adicional de la direccion de entrega del Domicilio
        }
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'In Transit', 'Delivered', 'Incomplete Order', 'Cancelled', 'Closed Order'],
        default: 'Pending'
    },
    payment: [
        {
            method: { type: String, enum: ['Cash', 'Credit Card', 'Online Payment', 'Digital Wallet', 'PayPal', 'CryptoCurrency']},
            status: { 
                type: String, 
                enum: ['Unpaid Order','Paid in Full', 'Authorized', 'Refunded', 'Partially Paid', 'Disputed', 'Expired', 'Chargeback', 'In Progress', 'On Hold'], 
                default: 'Unpaid Order' 
            },
            amount: { type: Number },
            fullName: { type: String },
            timestamp: { type: String },
            paidItems: [{
                name: { type: String },
                quantity: { type: Number },
                price: { type: Number }
            }],
            electronicInvoice: {
                required: { type: Boolean },
                fullName: { type: String },
                documentNumber: { type: String },
                email: { type: String },
                address: { type: String },
                invoiceNumber: { type: String },
                documentType: { type: String, enum: ['Factura', 'Boleta'] },
                issueDate: { type: Date },
                taxId: { type: String }
            }
        }
    ],
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
    }],
    AImanagement: [],
    vector: {
        data: [],
        metadata: [{
            id: {
                type: String, // Un identificador único para cada vector.
            },
            numberTokens: {
                type: Number, // Hacemos un conteo de los tokens usados para el embedding
            },
            timestamp: {
                type: String, // La fecha y hora de creación del vector.
            },
            source: {
                type: String, //La fuente de los datos utilizados para generar el vector. Nombre de la coleccion o documento
            },
            parameters: {
                type: String, //Aqui ubicamos el nombre de los campos que usamos para embedding
            },
            description: {
                type: String, //Una descripción textual del vector.
            },
        }],
        relevance: {
            type: Number, // Hacemos un conteo de los tokens usados para el embedding
        } //o un nombre descriptivo que indique que el campo almacena la relevancia de un documento para una consulta específica.
    },
}, { collection: 'orders' });

// Índices para business
OrderSchema.index({ 'business.businessID': 1 });
OrderSchema.index({ 'business.nit': 1 });
OrderSchema.index({ 'business.nameBusiness': 1 });
OrderSchema.index({ 'business.tradename': 1 });
OrderSchema.index({ 'business.countryCod': 1 });
OrderSchema.index({
  'business.businessID': 1,
  'business.nit': 1,
  'business.nameBusiness': 1,
  'business.tradename': 1,
  'business.countryCod': 1
});

// Índices para client
OrderSchema.index({ 'client.document': 1 });
OrderSchema.index({ 'client.fullName': 1 });
OrderSchema.index({ 'client.document': 1, 'client.fullName': 1 });

// Índice compuesto sin campos de arreglos paralelos
OrderSchema.index({
  'business.nit': 1,
  'client.document': 1,
  'client.fullName': 1,
  'orderStatus': 1
});

// Índices individuales para campos que son arreglos
OrderSchema.index({ 'orderDetails.items.name': 1 });
OrderSchema.index({ 'payment.method': 1 });

// Otros índices para orderDetails
OrderSchema.index({ 'orderDetails.items.productID': 1 });
OrderSchema.index({ 'orderDetails.items.notes': 1 });
OrderSchema.index({ 'orderDetails.items.combinedTables': 1 });
OrderSchema.index({ 'orderDetails.items.tableID': 1 });
OrderSchema.index({ 'orderDetails.items.table': 1 });
OrderSchema.index({ 'orderDetails.items.mainTable': 1 });

// Índices para delivery
OrderSchema.index({ 'delivery.method': 1 });
OrderSchema.index({ 'delivery.status': 1 });

// Otros índices
OrderSchema.index({ 'payment.status': 1 });


OrderSchema.method('toJSON', function() {
    const { __v,  ...object } = this.toObject();
    return object;
});



module.exports = model('orders', OrderSchema);

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