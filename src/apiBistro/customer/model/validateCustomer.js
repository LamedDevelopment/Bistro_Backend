const { Schema, model } = require('mongoose');

const ValidateStaffShema = Schema({
    email: {
        type: String,
    },
    datetimeMilliseconds: {
        type: Number
    },
    token: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false
    },
    dateCreate: {
        type: String,
    },
    dateUpdate: {
        type: String,
    }
}, { collection: 'validateStaffs' })

ValidateStaffShema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
});

module.exports = model('ValidateStaff', ValidateStaffShema);
