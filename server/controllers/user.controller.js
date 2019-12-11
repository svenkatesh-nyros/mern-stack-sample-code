import crypto from 'crypto'; 
import multer from 'multer';

import Labors from '../models/Labors';
import Users from '../models/Users';
import Skills from '../models/Skills';

const path = require('path');
const fs = require('fs');
const defaultImage = 'user_image.png';


export function upload_user_profile(req,res){
    console.log('upload_user_profile');
    var upload = multer({
      storage: storage,
      fileFilter: function (req, file, callback) {
          var ext = path.extname(file.originalname);
          if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') 
          {
              return callback(new Error('Only images are allowed'))
          }
          callback(null, true)
      }
    }).single('avatar');
    
    upload(req,res,function(err) {
      var now = new Date();
      var path= '....';
      if(req.body.name && req.body.name != '')
      {
         var ext = req.body.name.split('.').pop();  
      }
      else
      {
         ext = '';
      }
      var filename=`${path+'file_'+Date.now()+'.'+ext}`;
      var file_sm_name=`${'file_'+Date.now()+'.'+ext}`;
      var user_id = req.body.user_id;
      var avatar = req.body.avatar;
      if(avatar != "")
      {
          var y = avatar.split(',')[1];  
          fs.writeFile(filename, Buffer.from(y,'base64'), function (err) {
              if (err)
              {
                 return res.json({"status" : 401,message:'something went wrong!',err:err})
              }
              else
              {
                  Users.updateOne({_id: user_id}, { $set: {'avatar': file_sm_name}},function(err, user_doc){
                      if(!err)
                      {
                          res.json({
                              status: 200,
                              message: 'Image uploaded successfully!',
                              file_sm_name: file_sm_name,
                          });
                      }
                      else
                      {
                          res.json({
                             status: 401,
                             message: 'something went wrong!',
                             err: err,
                          });
                      }
                  }); //Users.updateOne end 
              }
          }) //fs.writeFile end
      }
      else
      {
          Users.updateOne({_id: user_id}, { $set: {'avatar': 'user_image.png'}}, function(err, user_doc){
              if(!err)
              {
                  res.json({
                      status: 200,
                      message: 'Image uploaded successfully!',
                  });
              }
              else
              {
                 res.json({
                    status: 401,
                    message: 'something went wrong!',
                    err: err,
                 });
              }
          }); //Users.updateOne end 
      }
    });
}

export function create_user(req, res){
    console.log('create_user');
    console.log('req.body',req.body);
    var user_name= req.body.user_name;
    var user_email = req.body.email;
    var user_address = req.body.address;
    var user_mobile = req.body.mobile;
    var reg_from = req.body.reg_from;
    var user_type = req.body.user_type;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var geo_location = req.body.geo_location;
    var password = req.body.password;
    Users.findOne({mobile_number: user_mobile},function(err, user_doc){
        if(!err && user_doc != null)
        {
            var otp = Math.floor(10000 + Math.random() * 90000)
            // generateOTP(user_type, user_doc.id ,req.body.mobile, otp);
            res.json({
                'status': 401,
                'message':'User already exists!',
                'id':user_doc._id,
                'user_type' : user_doc.user_type,
            });
        }
        else
        {
            var otp = Math.floor(10000 + Math.random() * 90000);
            var data = {
                name: user_name,
                email: user_email,
                mobile_number: user_mobile,
                otp: otp, //Math.floor(10000 + Math.random() * 90000),
                password: password,
                address: user_address,
                reg_from: reg_from,
                auth_token: require("crypto").randomBytes(24).toString('hex'),
                avatar: defaultImage,
                user_type: user_type,
                latitude :latitude,
                longitude : longitude,
                geo_location : geo_location,
            }
            Users.create(data).then((doc) => {
                var data1 = { mobile_number: doc.mobile_number, auth_token: doc.auth_token, user_type: doc.user_type, page : "otp_page",};
                return res.json({
                          'status' : 200,
                          "message":'User created successfully',
                          "data":data1,
                          "id": doc._id,
                      });
            });//Users.create ends
        }
    });//Users.findOne
}

export function check_user_exists(req, res){
    console.log('check_user_exists');
    var status = '';
    var user_type=req.body.user_type;
    if(user_type==2)
    {
        Labors.findOne({mobile_number: req.body.mobile},function(err, lab_doc){
            if(!err && lab_doc != null)
            {
                  var otp = Math.floor(10000 + Math.random() * 90000)
                  generateOTP(user_type,lab_doc._id,lab_doc.mobile_number, otp);
                  res.json({
                      "status": 200,
                      "message":"user exists",
                      "page":"otp_page",
                      user_type: user_type,
                  });
            }
            else
            {
                res.json({
                    "status": 401,
                    "message":"user details not found",
                    "page": "signup_page"
                });
            }
        });// Labors findone end
    }
    else
    {
        Users.findOne({mobile_number: req.body.mobile},function(err, user_doc){
            if(!err && user_doc != null)
            {
                  var otp = Math.floor(10000 + Math.random() * 90000)
                  generateOTP(user_type,user_doc._id,user_doc.mobile_number, otp);
                  res.json({
                      "status": 200,
                      "message":"user exists",
                      "page":"otp_page",
                      "user_type":user_type,
                  });
            }
            else
            {
                res.json({
                    "status": 401,
                    "message":"user not found",
                    "page": "signup_page"
                });
            }
        })// Users findone end
    } 
}

export function edit_user(req, res){
    console.log('edit_user');
    console.log('req.body',req.body);
    var user_id = req.body.user_id;
    var name = req.body.user_name;
    var email = req.body.email;
    var number = req.body.mobile;
    var location = req.body.location;
    var user_type = req.body.user_type;
    var longitude = req.body.longitude;
    var latitude = req.body.latitude;
    var address = req.body.address;
    var geo_location = req.body.geo_location;

    Users.update({_id: user_id},{$set: {'name': name,'email':email,'mobile_number': number,address: address,location: location,latitude: latitude,longitude: longitude,geo_location: geo_location}},function(err, user_doc){
        console.log('err, user_doc',err, user_doc)
        if(!err && user_doc != null)
        {
            res.json({
                status: 200,
                message: 'user updated successfully!',
                user_id: user_id,
            })  
        }
        else
        {
            res.json({
                status: 401,
                message:'something went wrong!',
            });
        }
    });// Users update end  
}

export function get_user_details(req, res){
    console.log('get_user_details');
    console.log('req.body',req.body);
    var user_id = req.body.user_id;
    var user_type = req.body.user_type;
    Users.findOne({_id: user_id},{password: 0,otp:0}).exec(function(err, user_doc){
        if(!err && user_doc!= null)
        {
            res.json({
                status: 200,
                message:'User details',
                data: user_doc,
            });
        }
        else if(!err && user_doc==null)
        {
            res.json({
                status: 401,
                message:'user details not found!',
            });
        }
        else
        {
            res.json({
                status: 401,
                message:'something went wrong!',
            });
        }
    });//Users.findOne ends
}

export function myprofile(req, res){
    // user_type : 1 ->  admin , 2 -> labor, 3 -> user
    console.log('myprofile');
    console.log('req.body',req.body);
    var user_id = req.body.user_id;
    var user_type = req.body.user_type;
    
    if(user_type === 3)
    {
       Users.findOne({_id: user_id}).exec(function(err,user_doc){
          if(!err && user_doc != null)
          {
              res.json({
                  status:200,
                  message:'User details!',
                  data:user_doc,
              });
          }
          else if(!err && user_doc == null)
          {
              res.json({
                  status: 401,
                  message: 'no details found!',
              });
          }
          else
          {
              res.json({
                status: 401,
                message: 'something went wrong!',
                err: err,
              });
          }
       })//Users.fineOne end here
    }
    else if(user_type ===2)
    {
       Labors.findOne({_id: user_id}).populate('skills',{_id: 0,createdAt:0,updatedAt: 0,__v: 0,}).populate('services',{_id: 0,createdAt: 0,updatedAt: 0,__v: 0,isactive: 0, isActive:0,image: 0,trending: 0,}).exec(function(err,lab_doc){
          if(!err && lab_doc != null)
          {
              res.json({
                  status: 200,
                  message: 'Labourer details',
                  data: lab_doc,
              });
          }
          else if(!err && lab_doc == null)
          {
              res.json({
                  status: 401,
                  message: 'no details found!',
              });
          }
          else
          {
              res.json({
                  status: 401,
                  message:'something went wrong!',
                  err: err,
              });
          }
       })//Labors.findOne end
    }
    else
    {
        res.json({
            status: 401,
            message: 'something went wrong!',
        })
    }
}