const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Cities = new Schema({
		name: { type: String },
		state_id: { type: Number },
		latitude: { type: Number },
		longitude: { type: Number },
	},{
	  timestamps: true
});

module.exports = mongoose.model("Cities", Cities);
