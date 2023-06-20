const { Schema, model } = require('mongoose');

const infosSettingsSchema = new Schema({
  day: String,
  nb_check: { type: Number, default: 0 },
  timestamp: { type: Number, default: 0 },


});

module.exports = model('infos_settings', infosSettingsSchema);
