const { Schema, model } = require('mongoose')
// Creating a date time object

const MenuBistroShema = Schema({ 
    business: {
        business: {
            type: Schema.Types.ObjectId,
            ref: 'business',
            require: true
        },
        nit: {
            type: Number
        },
        nameBusiness: {
            type: String,
        },
        tradename: {
            type: String,
        },
        countryCod: {
            type: String,
        }
    },
    menu: [
        {
            category: {
                type: String,
            },
            product: [
                {
                    name: {
                        type: String,
                    },
                    description: [],
                    nota: {
                        type: String,
                    },
                    price: {
                        type: Number,
                    },
                    img: {
                        type: String,
                    },
                    status: {
                        type: Boolean,
                        default: true
                    },
                    productUnique: {
                        type: String,
                        unique: true
                    },
                    dateCreate: {
                        type: String
                    },
                    update: [{
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
                }
            ],
            status: {
                type: Boolean,
                default: true
            },            
        },
    ] 
}, { collection: 'menuBistros' })

MenuBistroShema.index({
    'business.business': 1,
});
MenuBistroShema.index({
    'business.nit': 1,
});
MenuBistroShema.index({
    'business.nameBusiness': 1,
});
MenuBistroShema.index({
    'business.tradename': 1,
});
MenuBistroShema.index({
    'business.countryCod': 1,
});
MenuBistroShema.index({
    'manu.category': 1,
});
MenuBistroShema.index({
    'manu.product.name': 1,
});
MenuBistroShema.index({
    'manu.product.description': 1,
});
MenuBistroShema.index({
    'manu.product.productUnique': 1,
}, {unique: true});

MenuBistroShema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('menuBistros', MenuBistroShema);

