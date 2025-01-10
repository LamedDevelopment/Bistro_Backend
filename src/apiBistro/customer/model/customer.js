const { Schema, model } = require('mongoose');

// Creando el esquema del cliente
const CustomerShema = Schema({
    fullName: {
        type: String,
    },
    document: {
        type: String,
    },
    movil: {
        type: Number,
        min: [999999999, "Minimo 9 Digitos"],
        max: [9999999999999, "Maximo 13 Digitos"],
        require: true,
    },
    email: {
        type: String,
    },
    birthdate: {
        type: String,
    },
    gender: {
        type: String,
    },
    address: [{
        homeAddress: {
            type: String,
        },
        addressComplement: {
            type: String,
        },
        city: {
            type: String, // Ejemplo: Bogotá
        },
        country: {
            type: String,
        },
        countryCod: {
            type: String, // ISO 3166-1 alpha-2 code CO = Colombia
        },
        regionCountry: { // Ejemplo: America/Bogota
            type: String,
        },
        zip: {
            type: String, // Ejemplo: 110741
        },
        dialingCode: {
            type: Number, // Ejemplo: Colombia = 57
        },
        coordinates: {
            type: [Number], // Array de dos números: [longitud, latitud]
            validate: {
                validator: function(value) {
                    return value.length === 2; // Validar que tenga exactamente dos elementos
                },
                message: "Las coordenadas deben contener exactamente dos valores: [longitud, latitud]"
            },
        },
        status: {
            type: Boolean,
            default: true
        },
        mainAddress: {  // Aqui el usuario podria definir la direccion Primaria, para realizar los Pedidos a esta Direccion
            type: Boolean,
            default: false
        },
    }],
    role: {
        type: String,
        default: 'customer'
    },
    status: {
        type: Boolean,
        default: true
    },
    terms: {
        type: Boolean,
        require: true
    },
    userUnique: {
        type: String,
        require: true,
    },
    dateCreate: {
        type: String,
    },
    updateUsers: [{
        dateUpdate: {
            type: String,
        },
        updateUser: {
            type: Schema.Types.ObjectId,
            ref: 'customer',
        },
        observation: {
            type: String,
        }
    }]
}, { collection: 'customers' });

// Índices para optimizar búsquedas
CustomerShema.index({
    'fullName': 1,
});
CustomerShema.index({
    'document': 1,
});
CustomerShema.index({
    'movil': 1,
});
CustomerShema.index({
    'email': 1,
});
CustomerShema.index({
    'userUnique': 1,
},{unique: true});

// Método para serializar el esquema
CustomerShema.method('toJSON', function() {
    const { __v,  ...object } = this.toObject();
    return object;
});

module.exports = model('customers', CustomerShema);
