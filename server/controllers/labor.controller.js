import secret from '../secret';
import Labors from '../models/Labors';
import Users from '../models/Users';
import States from '../models/States';
import Cities from '../models/Cities';
import Countries from '../models/Countries';
import Skills from '../models/Skills';
import multer from 'multer';
import crypto from 'crypto'; 
import jwt from 'jsonwebtoken';
import sanitizeHtml from 'sanitize-html';

const curl = new (require( 'curl-request' ))();
const path = require('path');
const fs = require('fs');

const sms_username =  "";
const sms_password = "";
const sms_from =  "";
const defaultImage = 'user_image.png';
const def_labor_img = 'def_labor_img.png';


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
     callback(null, '/home/nyros/Documents/Documents/Venkatesh/LB_ADMIN/public/assets/uploads');
  },
  filename: function (req, file, callback) {
    const newFilename = `${'file_'+Date.now()}${path.extname(file.originalname)}`;
    console.log('newFilename',newFilename);
    callback(null, newFilename);
  }
});


const errors = {
    REGISTER_USERNAME_TAKEN: 'username unavailable',
    REGISTER_GENERAL_ERROR: 'an error has occured',
    LOGIN_INVALID: 'invalid mobile/password combo',
    LOGIN_GENERAL_ERROR: 'sorry, an error has occured. please try again later',
};

var generateOTP = function(user_type, user_id, mobile_number, otp) {
  console.log('user_id, mobile_number, otp',user_id, mobile_number, otp);
  var message = encodeURIComponent("Labor Bridge Mobile Verification Code :" + otp )
  var url = 'http://sms.scubedigi.com/api.php?username='+ sms_username + '&password=' +  sms_password + '&to=' + JSON.stringify(mobile_number).replace(/"/g,'') + '&from=' + sms_from + '&message='+ message
  console.log("-------------------")
  console.log(url)
  curl.setHeaders([
      'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
  ]).get('http://sms.scubedigi.com/api.php?username='+ sms_username + '&password=' +  sms_password + '&to=' + JSON.stringify(mobile_number).replace(/"/g,'') + '&from=' + sms_from + '&message='+ message )
  .then(({statusCode, body, headers}) => {
      console.log("-----sending otp--------")
      console.log("statusCode, body, headers",statusCode, body, headers);
      if(user_type == 2)
      {
          Labors.updateOne({_id: user_id}, { $set: {'otp': otp}}, function(err, otp_doc){
              if(!err && otp_doc !=null)
              {
                  return true;
              }
              else
              {
                  return false;
              }
          })
      }
      else
      {
          Users.updateOne({_id: user_id}, { $set: {'otp': otp}}, function(err, otp_usr_doc){
              if(!err && otp_usr_doc !=null)
              {
                  return true;
              }
              else
              {
                  return false;
              }
          })
      }
      
  }).catch((e) => {
      console.log(e);
  });   
};

function generateOTPNEW(user_type, user_id, mobile_number, otp, callback) {
  console.log('user_id, mobile_number, otp',user_id, mobile_number, otp);
  var message = encodeURIComponent("Labor Bridge Mobile Verification Code :" + otp )
  var url = 'http://sms.scubedigi.com/api.php?username='+ sms_username + '&password=' +  sms_password + '&to=' + JSON.stringify(mobile_number).replace(/"/g,'') + '&from=' + sms_from + '&message='+ message
  console.log("-------------------")
  console.log(url)
  curl.setHeaders([
      'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
  ]).get('http://sms.scubedigi.com/api.php?username='+ sms_username + '&password=' +  sms_password + '&to=' + JSON.stringify(mobile_number).replace(/"/g,'') + '&from=' + sms_from + '&message='+ message )
  .then(({statusCode, body, headers}) => {
      console.log("-----sending otp--------")
      console.log("statusCode, body, headers",statusCode, body, headers);
      if(user_type == 2)
      {
          Labors.updateOne({_id: user_id}, { $set: {'otp': otp}}, function(err, otp_doc){
              if(!err && otp_doc !=null)
              {
                  // return true;
                  callback(true) 

              }
              else
              {
                  // return false;
                  callback(false) 
              }
          })
      }
      else
      {
          Users.updateOne({_id: user_id}, { $set: {'otp': otp}}, function(err, otp_usr_doc){
              if(!err && otp_usr_doc !=null)
              {
                  // return true;
                  callback(true) 
              }
              else
              {
                  // return false;
                  callback(false)
              }
          })
      }
      
  }).catch((e) => {
      console.log(e);
      callback(e)
  });   
};

export function create_labor(req, res) {
    console.log('create_labor');
    console.log('req.body',req.body);
    
    var mobile_number = parseInt(req.body.mobile_number,10);
    Labors.findOne({mobile_number: mobile_number},function(err, lb_doc){
        if(!err && lb_doc != null)
        {
            return res.json({
                      status: 401,
                      message: 'Labourer details already exists!',
                   });
        }
        else if(!err && lb_doc === null)
        {
              var otp = Math.floor(10000 + Math.random() * 90000);
              var user_type = 2;
              // generateOTP(user_type,lb_doc._id ,mobile_number,otp);
              const cre_labor = new Labors();
              cre_labor.name = req.body.name;
              cre_labor.email = req.body.email;
              cre_labor.mobile_number = mobile_number;
              cre_labor.password = req.body.password;
              cre_labor.location = req.body.location;
              cre_labor.address = req.body.address;
              cre_labor.reg_from = req.body.reg_from;
              cre_labor.geo_location = req.body.geo_location;
              cre_labor.latitude = req.body.latitude;
              cre_labor.longitude = req.body.longitude;
              cre_labor.services = req.body.selected_services;
              cre_labor.user_type = req.body.user_type;
              cre_labor.skills = req.body.selected_skills;
              cre_labor.otp = otp;//Math.floor(10000 + Math.random() * 90000);
              cre_labor.otp_flag = 0;
              cre_labor.avatar = def_labor_img;
              cre_labor.availability = req.body.availability;
              cre_labor.certification= req.body.certification;
              cre_labor.description = req.body.about_labor;
              cre_labor.months = req.body.months;
              cre_labor.years = req.body.years;
              cre_labor.service_location = req.body.service_location;
              
              cre_labor.save(function(err2,lbnew_doc){
                console.log('err2,lbnew_doc',err2,lbnew_doc);
                  if(!err2)
                  {
                     var data = {
                          mobile_number: lbnew_doc.mobile_number,
                          auth_token: lbnew_doc.auth_token,
                          user_type: lbnew_doc.user_type,
                          page : "otp_page",
                          user_id: lbnew_doc._id,
                      };
                       generateOTP(user_type,lbnew_doc._id ,mobile_number,otp,);
                       return res.json({
                                  status: 200,
                                  message: 'Laborer created successfully!',
                                  id: lbnew_doc._id,
                                  data: data,
                              });
                  }
                  else
                  {
                       return res.json({
                                  status: 401,
                                  message: 'something went wrong!',
                                  err: err2
                              });
                  }
              });//cre_labor.save end
        }
        else
        {
           return res.json({
                status: 401,
                message: 'something went wrong!',
            });
        }
    })
}

export function get_labors(req, res){
    console.log('/get_labors');
    console.log('req.body',req.body);
    Labors.count({},function(err,tot_count){
      if(err)
      {
          res.json({
              status: 401,
              message: 'something went wrong!',
              err: err,
          });
      }
      else
      {
          Labors.find({}).sort('name':1).populate('services').exec(function(err, lab_doc){
              if(!err && lab_doc.length > 0)
              {
                  res.json({
                      status: 200,
                      message: 'Labors list',
                      data: lab_doc,
                  });
              }
              else if(!err && lab_doc.length == 0)
              {
                  res.json({
                      status: 401,
                      message: 'No labors found!'
                  });
              }
              else
              {
                  res.json({
                      status: 401,
                      message:'Something went wrong!',
                  });
              }
          });//Labors.find end
      }
    })//Labors.count end
}

export function get_labors_page(req, res){
    console.log('get_labors_page');
    console.log('req.body',req.body);
    var size = req.body.size;
    var page = req.body.page;
    var query = {}
    if( page < 0 || page === 0)
    {
       result = {'status': 401,'message':'invalid page number,should start with 1'};
       return res.json(result);
    }
    query.skip = size * (page - 1)
    query.limit = size

    Labors.count({},function(err,tot_count){
      if(err)
      {
          res.json({
              status: 401,
              message: 'something went wrong!',
              err: err,
          });
      }
      else
      {
          const skip_count = size * (page - 1);
          if(skip_count >= tot_count)
          {
            query.skip = 0;
          }
          var x = tot_count/page;
          if(skip_count < tot_count)
          {
               Labors.find({},{},query).sort('name':1).exec(function(err, lab_doc){
                  if(!err && lab_doc.length > 0)
                  {
                      res.json({
                          status: 200,
                          message: 'Labors list',
                          data: lab_doc,
                          tot_count: tot_count,
                          next_page: page + 1
                      });
                  }
                  else if(!err && lab_doc.length == 0)
                  {
                      res.json({
                          status: 401,
                          message: 'No labourers found!'
                      });
                  }
                  else
                  {
                      res.json({
                          status: 401,
                          message:'Something went wrong!',
                      });
                  }
              });//Labors.find end
          }
          else
          {
              res.json({
                  status: 401,
                  message:'No labourers found!',
                  err: 'limit'
              })
          }
         
      }
    })//Labors.count end
}

export function all_labors(req, res){
    console.log('all_labors');
    console.log('req.body',req.body);
    Labors.find({}).sort({'name':1}).exec(function(err,lab_doc){
        if(!err && lab_doc.length >0)
        {
            res.json({
                status: 200,
                message:'All labors List',
                data: lab_doc,
            });
        }
        else
        {
            res.json({
                status: 401,
                message:'No labors found',
            })
        }
    })//Labors.find ends/
}

export function get_labor_details(req, res){
    console.log('get_labor_details');
    console.log('req.body',req.body);
    var labor_id =req.body.labor_id;
    var user_type = req.body.user_type;
    if(user_type ==2)
    {
        // Labors.find({_id: labor_id}).populate('services',{name: 1, _id: 1,}).populate('skills',{name:1,_id: 1}).exec(function(err,lab_doc){
        Labors.find({_id: labor_id},{password:0}).exec(function(err,lab_doc){
            if(!err)
            {
                res.json({
                    status: 200,
                    message: 'Labour Details',
                    data: lab_doc,
                });
            }
            else
            {
                res.json({
                    status: 401,
                    message:'Labourer details not found!',
                    err: err,
                });
            }
        })
    }
    else
    {
        res.json({
            status: 401,
            message: 'labourer details not found',
        })
    }
}

export function myprofile(req, res){
    console.log('myprofile');
    console.log('req.body',req.body);
    // user_type : -> 1 admin , 2 -> labor, 3 -> user or need labor
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

export function edit_labor(req, res){
    console.log('edit_labor');
    console.log('req.body',req.body);
    var admin_id =req.body.admin_id;
    var labor_id = req.body.labor_id;
    var labor_name = req.body.labor_name;
    var labor_email = req.body.labor_email;
    var labor_address = req.body.labor_address;
    var mobile = req.body.mobile;
    var admin_id = req.body.admin_id;
    var user_type = req.body.user_type;
    // var reg_from= 'admin';
    var service_location = req.body.service_location; 
    var about_labor = req.body.about_labor;
    var certification = req.body.certification;
    var years = req.body.years;
    var months = req.body.months;
    var selected_services = req.body.selected_services;
    var selected_skills = req.body.selected_skills;
    var availability = req.body.availability;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    var geo_location = req.body.geo_location;
    var location = req.body.location;
    
    Labors.findByIdAndUpdate({_id: labor_id}, {$set: {name: labor_name,email:labor_email,mobile_number:mobile,address:labor_address,categories:selected_services,services:selected_services,skills:selected_skills,availability:availability,certification:certification,description:about_labor,months:months,years:years,service_location:service_location,latitude:latitude,longitude:longitude,geo_location:geo_location}},function(err,up_doc){
        console.log('err,up_doc',err,up_doc);
        if(!err)
        {
            res.json({
                status: 200,
                message: 'Labourer details updated successfully!',
                data: up_doc,
            });
        }
        else
        {
            res.json({
                status: 401,
                message: 'something went wrong!',
                err: err
            });
        }
    });//Users.findByIdAndUpdate end
}

export function upload_profile(req,res){
    console.log('upload_profile');
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
      var path= '/home/nyros/Documents/Decuments/Venkatesh/LB_ADMIN/public/assets/uploads/';
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
      var labor_id = req.body.labor_id;
      var x = req.body.avatar;
      if(x != "")
      {
          var y = x.split(',')[1];  
          fs.writeFile(filename, Buffer.from(y,'base64'), function (err) {
              if (err){
               return res.json({"status" : 401,message:'something went wrong!',err:err})
              }
              else
              {
                  Labors.updateOne({_id: labor_id}, { $set: {'avatar': file_sm_name}}, function(err, lab_doc){
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
                  }); //Labors.updateOne end 
              }
          }) //fs.writeFile end
      }
      else
      {
          Labors.updateOne({_id: labor_id}, { $set: {'avatar': 'user_image.png'}}, function(err, lab_doc){
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
          }); //Labors.updateOne end 
      }
    });
}
