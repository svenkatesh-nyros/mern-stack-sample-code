const mongoose = require('mongoose');
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const UsersSchema = new Schema({
	name: { type: String},
	email: {type: String, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid']},
	otp: { type : Number },
	otp_flag: {type: Number, default:0 },//0-not verified, 1- verified
	avatar: { type: String },
	password: { type : String },
	mobile_number: { type: Number },
	location: { type: String },
	device_token: { type : String },
	device_id: { type : String },
	address: { type: String },
	is_admin:{ type: Number },
	reg_from: { type: String },
	auth_token: { type: Boolean, default : false },
	token: {type: String},
	latitude: { type: Number },
	longitude: { type: Number },
	user_type: { type: Number }, // 1 -> admin, 2 -> labor, 3->user or need labor
	geo_location: {type: [Number]}, // [Long, Lat]
	},{
	  timestamps: true
});

UsersSchema.pre('save', function(next) {
  var user = this;
	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) {
		return next();
	}
	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) {
      	return next(err);
      }

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
	});
});

UsersSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) {
    	return cb(err);
    }
    cb(null, isMatch);
  });
};


module.exports = mongoose.model('Users',UsersSchema);