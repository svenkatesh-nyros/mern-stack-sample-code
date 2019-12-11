const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Services = new Schema({
		name: { type: String },
		image: { type: String },
		trending: { type: Boolean, default: 0 },
		isActive: { type: Boolean, default: 0 }, //isSelected
	},{
	  timestamps: true
});

module.exports = mongoose.model('Services',Services);