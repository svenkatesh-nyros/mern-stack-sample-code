const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const States = new Schema({
		name: { type: String },
		state_id: { type: Number },
		country_id: { type: Number },
	},{
	  timestamps: true
});

module.exports = mongoose.model('States', States);