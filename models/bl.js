const { Schema, model } = require('mongoose');

const blSettingsSchema = new Schema({
  uuid: String,
  gid: String,
  author: String,
  timestamp: { type: Number, default: 0 },
  reason : String,
  current: {
    type: Boolean,
    required: true,
  },

});

module.exports = model('bl_settings', blSettingsSchema);
