const { Schema, model } = require('mongoose')
// Creating a date time object

const StaffShema = Schema({
    name: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    document: {
        type: String,
    },
    movil: {
        type: Number,
        min: [999999999, "Minimo 9 Digitos"],
        max: [99999999999, "Maximo 11 Digitos"],
        require: true,
    },
    movilVerificationToken: {
        type: Boolean,
        default: true,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    emailVerificationToken: {
        type: Boolean,
        default: true,
    },
    pass: {
        type: String,
        require: true,
    },
    updatePass: {
        type: Boolean,
        default: false,
    },
    birthdate: {
        type: String,
    },
    gender: {
        type: String,
    },
    address: {
        type: String,
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
    img: {
        type: String,
    },
    role: {
        type: String,
    },
    membership: [{
        establishments: {
            type: Schema.Types.ObjectId,
            ref: 'business',
        },
        nit: {
            type: String
        },
        businessName: {
            type: String
        },
        tradeName: {
            type: String
        },
        dateCreate: {
            type: String,
        },
    }],
    status: {
        type: Boolean,
        default: true
    },
    terms: {
        type: Boolean,
        require: true
    },
    loginType: {
        type: String,
        default: 'Login'
    },
    userUnique: {
        type: String,
        require: true,
        unique: true
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
            ref: 'businessusers',
        },
        observation: {
            type: String,
        }
    }]
}, { collection: 'staffs' });

StaffShema.index({
    'email': 1,
});
StaffShema.index({
    'document': 1,
});
StaffShema.index({
    'movil': 1,
});
StaffShema.index({
    'userUnique': 1,
},{unique: true});


StaffShema.method('toJSON', function() {
    const { __v, _id, pass, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('staff', StaffShema);