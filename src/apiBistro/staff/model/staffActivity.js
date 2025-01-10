const { Schema, model } = require('mongoose');

const StaffActivitySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: String,
  },
  status: {
    type: String,
    enum: ['online', 'offline'],
    required: true
  }
}, { collection: 'staffActivitys' })

StaffActivitySchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject()
    return object;
});

module.exports = model('staffActivity', StaffActivitySchema);
