const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
// var Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

var LaborsSchema = new Schema({
  username: { type: 'String' },
  password: { type: 'String', required: true },
  name: { type : String },
  email: {type: String, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid']},
  otp: { type : Number },
  otp_flag: {type: Number, default: 0 },//0-not verified, 1- verified
  avatar: { type: String },
  mobile_number: { type: Number },
  location: { type: String },
  device_token: { type : String },
  device_id: { type : String },
  address: { type: String },
  reg_from: { type: String },
  auth_token : { type: Boolean, default : false },
  token: {type: String},
  geo_location: {type: [Number]}, // [Long, Lat]
  //user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
  service_location: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  availability: { type: Boolean },
  description: { type: String },
  certification: { type: String },
  views_count:{ type: Number },
  months: { type: String },
  years: { type: String },
  call_count: { type: Number, default: 0 },
  user_type: { type: Number },//-> 1 admin , 2 -> labor, 3 -> user or need labor
  skills:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Skills' }],
  services:[{type: mongoose.Schema.Types.ObjectId, ref: 'Services' }],
});

LaborsSchema.pre('save', function(next) {
  var labor = this;
	// only hash the password if it has been modified (or is new)
	if (!labor.isModified('password')) {
		return next();
	}
	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(labor.password, salt, function(err, hash) {
      if (err) {
      	return next(err);
      }

      // override the cleartext password with the hashed one
      labor.password = hash;
      next();
    });
	});
});

LaborsSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
    	return cb(err);
    }
    cb(null, isMatch);
  });
};

// export default mongoose.model('Labors', LaborsSchema);
module.exports = mongoose.model('Labors',LaborsSchema);