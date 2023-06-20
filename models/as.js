const { Schema, model } = require('mongoose');

const asSettingsSchema = new Schema({
  uuid: String,
  gid: String,
  author: String,
  authora: String,
  timestamp: { type: Number, default: 0 },
  timestampa: { type: Number, default: 0 },
  reason : String,
  reasona : String,
  current: {
    type: Boolean,
    required: true,
  },

});

module.exports = model('as_settings', asSettingsSchema);
