const { Schema, model } = require('mongoose');


const BusinessShema = Schema({ 
    businessName: {
        type: String,
        require: true
    },
    tradeName: {
        type: String,
        require: true
    },
    nit: {
        type: Number,
        require: true,
        min: [999999, "Minimo 6 Digitos"],
        max: [99999999999, "Maximo 11 Digitos"],
    },
    branchoffices: [
        { 
            tradename: {
                type: String,
            },
            movil: {
                numberCell: {
                    type: String,
                    required: true,
                    unique: true,
                    min: 9,
                    max: 10
                },
                description: {
                    type: String
                }
            },
            email: {
                type: String,
                require: true,
                unique: true
            },
            services: [{}],
            typeService: [{}],
            phone: {
                phoneNumber: {
                    type: String,
                    required: true,
                    unique: true,
                    min: 9,
                    max: 10
                },
                description: {
                    type: String
                }
            },
            address: {
                type: String,
                require: true,
            },
            img: {
                type: [String],
                validate: {
                    validator: function (arr) {
                        return arr.length <= 3;
                    },
                    message: 'El número máximo de imágenes permitidas es 3.'
                }
            },
            country: {
                type: String,
            },
            countryCod: {
                type: String, // ISO 3166-1 alpha-2 code CO = Colombia
            },
            regionCountry: { // Region:  America/Bogota
                type: String,
            },
            city: {
                type: String, // Bogota
            },
            zip: {
                type: String, // 110741
            },
            status: {
                type: Boolean,
                default: true
            },
        }
    ],
    email: {
        type: String,
        require: true,
        unique: true
    },
    movil: {
        number: {
            type: String,
            required: true,
            unique: true,
            min: 9,
            max: 10
        },
        description: {
            type: String
        }
    },    
    phone: {
        number: {
            type: String,
            required: true,
            unique: true,
            min: 9,
            max: 10
        },
        description: {
            type: String
        }
    },
    img: {
        type: [String],
        validate: {
            validator: function (arr) {
                return arr.length <= 3;
            },
            message: 'El número máximo de imágenes permitidas es 3.'
        }
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
            default: true
        }
    },
    billingResolution:{
        resolutionNumber: {     //"18760000001"
            type: String,
        },
        startDate: {
            type: String,       //"2019-01-19"
        },
        endDate: {
            type: String,       //"2019-01-19"
        },
        prefix: {               //"SETP"
            type: String,
        },
        startNumber: {          //"990000000"
            type: Number,
        },
        currentNumbering: {     //"990000000"
            type: Number,
        },
        endNumber: {
            type: Number,       //"995000000"
        },
        typeCurrency: {         //"COP"
            type: String,
        },
        claveTecnica: {         //"fc8eac422eba16e22ffd8c6f94b3f40a6e38162c"
            type: String,
        },
        statusResolution:{
            type: Boolean,
            default: true
        },
        update: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'staff'
            },
            dateUpdate: {
                type: String
            },
            observation: {
                type: String
            },
        }]
    },
    services: [],
    typeService: [],
    address: {
        type: String,
        require: true,
    },
    country: {
        type: String,
    },
    countryCod: {
        type: String, // ISO 3166-1 alpha-2 code CO = Colombia
    },
    regionCountry: { // Region:  America/Bogota
        type: String,
    },
    city: {
        type: String, // Bogota
    },
    zip: {
        type: String, // 110741
    },
    description: {
        type: String, 
    },
    status: {
        type: Boolean,
        default: true
    },    
    collaborators: [{ //TODO: Este parametro Quizas NO lo usemos por que el Staff ya tiene asignado el BusinessID
        staff: {
            type: Schema.Types.ObjectId,
            ref: 'staff',
        },
        name: {
            type: String,
        },
        lastname: {
            type: String,
        },
        document: {
            type: String,
        },
        StaffType: [{}],
        status: {
            type: Boolean,
        },
        uniqueCollaborators: {
            type: String,
        },
        creatorUser: {
            type: Schema.Types.ObjectId,
            ref: 'staff',
        },        
        update: [{
            user: {
                type: Schema.Types.ObjectId,
                ref: 'staff'
            },
            dateUpdate: {
                type: String
            },
            observation: {
                type: String
            },
        }]

    }],
    dateCreate: {
        type: String,
    },
    updateUsers: [{
        dateUpdate: {
            type: String,
        },
        updateUser: {
            type: Schema.Types.ObjectId,
            ref: 'businessusers',
        },
        observation: {
            type: String,
        }
    }]
}, { collection: 'business' });

BusinessShema.index({
    'businessName': 1
});
BusinessShema.index({
    'tradeName': 1
});
BusinessShema.index({
    'nit': 1
}, {unique: true});
BusinessShema.index({
    'movil': 1
});
BusinessShema.index({
    'email': 1
});
BusinessShema.index({
    'services': 1
});
BusinessShema.index({
    'typeService': 1
});
BusinessShema.index({
    'country': 1
});
BusinessShema.index({
    'countryCod': 1
});
BusinessShema.index({
    'regionCountry': 1
});
BusinessShema.index({
    'city': 1
});
BusinessShema.index({
    'zip': 1
});
BusinessShema.index({
    'collaborators.document': 1
});
BusinessShema.index({
    'collaborators.staff': 1
});

BusinessShema.method('toJSON', function() {
    const { __v, _id, pass, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('business', BusinessShema);