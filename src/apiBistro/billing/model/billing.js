const { Schema, model } = require('mongoose');

const BillingSchema = new Schema({
  // Referencia al pedido asociado (opcional, pero útil para enlazar la factura con el pedido original)
  orderID: {
    type: Schema.Types.ObjectId,
    ref: 'orders',
    required: true
  },
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
  client: {
    document: {
      type: String
    },
    fullName: {
      type: String
    },
    phone: {
      type: Number
    },
    address: {
      type: String
    },
    addressComplement: {
      type: String
    }
  },
  billingDetails: {
    invoiceNumber: {
      type: String,
      required: true
    },
    dateIssued: {
      type: String
    },
    dueDate: {
      type: String
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'PaidInFull', 'Overdue'],
      default: 'Pending'
    },
    currency: {
      type: String,
      default: 'COP'
    },
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
        quantity: {
          type: Number,
          required: true,
          min: 1
        },
        unitPrice: {
          type: Number,
          required: true
        },
        subTotalItem: {
          type: Number,
          required: true // Generalmente: quantity * unitPrice
        },
        discount: {
          type: Number,
          default: 0
        },
        promoCodeItem: {
          type: String
        }
      }
    ],
    gratuity: {
      type: Number
    },
    subtotal: {
      type: Number
    },
    discount: {
      type: Number,
      default: 0
    },
    promoCodeItem: {
      type: String
    },
    tax: {
      taxType: {
          type: String,
      },
      taxPercentage: {
          type: Number,
      },
      taxValue: {
        type: Number,
      }
    },
    totalAmount: {
      type: Number,
      required: true
    },
    notes: {
      type: String
    }
  },
  payment: [
    {
      method: { 
        type: String, 
        enum: ['Cash', 'DaviPlata', 'Nequi', 'Bancolombia','Online Payment', 'Digital Wallet', 'Credit Card', 'PayPal', 'CryptoCurrency'] 
      },
      status: { 
        type: String, 
        enum: ['Pending', 'PaidInFull', 'Partial', 'Failed'],
        default: 'Pending' 
      },
      amount: { type: Number },
      transactionID: { type: String },
      paymentDate: { type: String }
    }
  ],
  delivery: { 
    method: {
        type: String,
        enum: ['StorePickup', 'HomeDelivery', 'DineIn'],
        default: 'StorePickup', // Valor predeterminado para recogida en el local
    },
    status: {
        type: String,
        enum: ['Unpaid Order','PaidInFull','PartiallyPaid', 'Pending', 'InTransit', 'Delivered', 'IncompleteOrder', 'Cancelled'],
        default: 'Unpaid Order' // Estado inicial del Pedido
    },
  },
  createdAt: {
    type: String
  },
  updatedAt: [
    {
      dateUpdate: { type: String },
      updateUser: {
        type: Schema.Types.ObjectId,
        ref: 'staff'
      },
      observation: { type: String }
    }
  ],
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
}, { collection: 'billings' });

BillingSchema.index({ orderID: 1 });
BillingSchema.index({ 'business.businessID': 1 });
BillingSchema.index({ 'business.nit': 1 });
BillingSchema.index({ 'business.nameBusiness': 1 });
BillingSchema.index({ 'business.tradename': 1 });

BillingSchema.index({ 'billingDetails.invoiceNumber': 1 });
BillingSchema.index({ 'billingDetails.dateIssued': 1 });
BillingSchema.index({ 'billingDetails.paymentStatus': 1 });
BillingSchema.index({ 'billingDetails.currency': 1 });

BillingSchema.index({ 'items.productID': 1 });
BillingSchema.index({ 'items.name': 1 });
BillingSchema.index({ 'items.discount': 1 });
BillingSchema.index({ 'items.promoCodeItem': 1 });

BillingSchema.index({ discount: 1 });
BillingSchema.index({ promoCodeItem: 1 });

BillingSchema.index({ 'tax.taxType': 1 });
BillingSchema.index({ 'tax.taxPercentage': 1 });

BillingSchema.index({ 'payment.method': 1 });
BillingSchema.index({ 'payment.status': 1 });
BillingSchema.index({ 'payment.transactionID': 1 });

BillingSchema.index({ 'delivery.method': 1 });
BillingSchema.index({ 'delivery.status': 1 });

// Método para omitir campos no deseados al convertir a JSON (por ejemplo, __v)
BillingSchema.method('toJSON', function() {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model('billings', BillingSchema);
