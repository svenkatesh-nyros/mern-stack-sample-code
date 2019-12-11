const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Countries = new Schema({
		name: { type: String },
		country_code:{ type: String },
	},{
	  timestamps: true
});

module.exports = mongoose.model('Countries', Countries);
