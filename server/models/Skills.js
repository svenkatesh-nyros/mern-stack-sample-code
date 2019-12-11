const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillsSchema = new Schema({
	name: String,
},{
	timestamps: true
});

module.exports = mongoose.model('Skills',skillsSchema);

