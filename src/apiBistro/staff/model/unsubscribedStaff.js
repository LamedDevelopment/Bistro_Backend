const { Schema, model } = require('mongoose');


// unsubscribed User object

const unsubscribedUsersShema = Schema({
    unsubscribedUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    dateUpdate: {
        type: String,
    },
    userData: {},
}, { collection: 'unsubscribedUsers' });

unsubscribedUsersShema.method('toJSON', function() {
    const { __v, _id, pass, ...object } = this.toObject();
    return object;
});

module.exports = model('unsubscribedUser', unsubscribedUsersShema);