const { Schema, model } = require('mongoose');

const ForgotPasswordUserShema = Schema({
    email: {
        type: String,
    },
    datetimeMilliseconds: {
        type: Number
    },
    token: {
        type: String,
    },
    codValidateUser: {
        type: Number,
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
}, { collection: 'forgotPassUsers' })

ForgotPasswordUserShema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
});

module.exports = model('ForgotPassUsers', ForgotPasswordUserShema);
