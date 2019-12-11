import jwt from 'jsonwebtoken';
import sanitizeHtml from 'sanitize-html';
import secret from '../secret';
import Labors from '../models/Labors';
import Users from '../models/Users';

export function login(req, res) {
    console.log('/login');
    console.log('req.body',req.body);
    if (!req.body.mobile_number || !req.body.password) {
        return res.status(403).end();
    }
    const mobile_number = parseInt(req.body.mobile_number,10);
    const user_type = req.body.user_type;
    if(user_type === 2)
    {
        Labors.findOne({ mobile_number: mobile_number }).exec((err, lab_doc) => {
            console.log('err, labor',err,lab_doc);
            if (err) {
              return res.status(500).send({err: errors.LOGIN_GENERAL_ERROR});
            }
            else if(!lab_doc) {
              return res.json({err: 'check your signin credentials!'});
            }
            lab_doc.comparePassword(req.body.password, function(err, isMatch) {
                if (err) throw err;
                if(isMatch) 
                {
                    var token = jwt.sign({'id':lab_doc._id}, secret.secret, {expiresIn: 31536e3});
                    var otp_flag = lab_doc.otp_flag;
                    if(otp_flag === 1)
                    {
                        var otp = Math.floor(10000 + Math.random() * 90000);  
                        var data = {status: 200, message:'user details found!', user_id: lab_doc._id,token:token,mobile_number: lab_doc.mobile_number,otp_flag: lab_doc.otp_page,page:'dashboard',err_status: false,err_msg:'',user_type:lab_doc.user_type}
                    }
                    else
                    {
                        otp = Math.floor(10000 + Math.random() * 90000);
                        var user_type = 2;
                        // generateOTP(user_type,lab_doc._id ,mobile_number, otp);
                        var data = {status: 200, message: 'user details found!',user_id: lab_doc._id,token: token,mobile_number: lab_doc.mobile_number,otp_flag:lab_doc.otp_flag,page:'verify_otp',err_status: false,err_msg:'',user_type: lab_doc.user_type}
                    }
                    
                    Labors.updateOne({_id: lab_doc._id}, { $set: {'token': token,otp: otp}}, function(err2, tok_doc){
                        if(!err2 && tok_doc !=null)
                        {
                            res.json({
                                status: 200,
                                message: 'laborer details found!',
                                data: data,
                                token: token
                            });        
                        }
                        else
                        {
                            res.json({
                                status: 401,
                                message: 'something went wrong!',
                            });
                        }
                    }) // Labors.updateOne ends here
                }
                else 
                {
                  return res.json({err: errors.LOGIN_INVALID});
                }
            });
        });  
    }
    else if(user_type === 3)
    {
        Users.findOne({ mobile_number: mobile_number }).exec((err, user_doc) => {
            console.log('err, user_doc',err,user_doc);
            if (err) {
              return res.status(500).send({err: errors.LOGIN_INVALID});
            }
            else if(!user_doc) {
              return res.json({err: errors.LOGIN_INVALID});
            }
            user_doc.comparePassword(req.body.password, function(err, isMatch) {
              if (err) throw err;
              if(isMatch) 
              {
                    var token = jwt.sign({'id':user_doc._id}, secret.secret, {
                        expiresIn: 31536e3
                    });
                    var otp_flag = user_doc.otp_flag;
                    if(otp_flag === 1)
                    {
                        var data = {status: 200, message:'user details found!', user_id: user_doc._id,token:token,mobile_number: user_doc.mobile_number,otp_flag: user_doc.otp_page,page:'dashboard',err_status: false,err_msg:'',user_type:user_doc.user_type}
                    }
                    else
                    {
                        var otp = Math.floor(10000 + Math.random() * 90000);
                        var user_type = 3;
                        generateOTP(user_type,user_doc._id ,mobile_number, otp);
                        var data = {status: 200, message: 'user details found!',user_id: user_doc._id,token: token,mobile_number: user_doc.mobile_number,otp_flag:user_doc.otp_flag,page:'verify_otp',err_status: false,err_msg:'',user_type: user_doc.user_type}
                    }
                    Users.updateOne({_id: user_doc._id}, { $set: {'token': token}}, function(err, tok_doc){
                          if(!err && tok_doc !=null)
                          {
                              res.json({
                                  status: 200,
                                  message: 'user details found!',
                                  data: data,
                                  token: token
                              });        
                          }
                          else
                          {
                              res.json({
                                  status: 401,
                                  message: 'something went wrong!',
                              });
                          }
                    }) // Labors.updateOne ends here
              }
              else 
              {
                  return res.json({err: errors.LOGIN_INVALID});
              }
          });
        });  
    }
}

export function updateUserInfo(req, res) {
    console.log('/updateUserInfo');
    console.log('req.body',req.body);
    if (!req.body.password) {
      return res.status(403).end();
    }
    try {
      
      var decoded = jwt.verify(req.headers.authorization, secret.secret);
      User.findOne({ _id: decoded.id }).exec((err, user) => {
        if (err) {
          return res.status(500).send({err: errors.REGISTER_GENERAL_ERROR}); 
        }

        if(req.body.password !== undefined){ 
          user.password = req.body.password; 
        }

        user.save((err, saved) => {
          if (err) {
              return res.status(500).send({err: errors.REGISTER_GENERAL_ERROR}); 
          }
          return res.json({
            user: {
              username: saved.username
            } 
          });        
        });
      });
    } catch(err) {
      // error during JWT verify
      return res.status(500).send({err: errors.REGISTER_GENERAL_ERROR}); 
    }
}

export function resendOtp(req, res){
  console.log('resendOtp',req.body);
  var user_id = req.body.user_id;
  var user_type = req.body.user_type;
  var mobile_number = req.body.mobile_number;

  var otp = Math.floor(10000 + Math.random() * 90000)
  generateOTPNEW(user_type,user_id,mobile_number,otp,function(doc){
    if(doc)
    {
        res.json({
            status:200,
            message: 'otp sent'  
        })      
    }
    else
    {
        res.json({
            status:401,
            message: 'something went wrong!',
        });
    }

  });
}

export function requestOTP(req, res){
  console.log('requestOTP',req.body);
  var mobile_number = req.body.mobile;
  var user_type = req.body.user_type;
  if(user_type === 2)
  {
      Labors.findOne({mobile_number: mobile_number}).exec(function(err,lab_doc){
          if(!err && lab_doc != null)
          {
              var otp = Math.floor(10000 + Math.random() * 90000);
              generateOTPNEW(user_type, lab_doc._id, lab_doc.mobile_number,otp,function(doc){
                  if(doc)
                  {
                      res.json({
                          status:200,
                          message: 'otp sent'  
                      });
                  }
                  else
                  {
                      res.json({
                          status:401,
                          message: 'something went wrong!',
                      });
                  }
              });
          }
          else if(!err && lab_doc == null){
              res.json({
                  status: 401,
                  message: 'Laborer details not found!'
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
      })
  }
  else if(user_type === 3)
  {
      Users.findOne({mobile_number: mobile_number}).exec(function(err,usr_doc){
          console.log('err,usr_doc',err,usr_doc)
          if(!err && usr_doc != null)
          {
              var otp = Math.floor(10000 + Math.random() * 90000);
              generateOTPNEW(user_type, usr_doc._id, usr_doc.mobile_number,otp,function(doc){
                  if(doc)
                  {
                      res.json({
                          status:200,
                          message: 'otp sent to your registerd mobile number'  
                      });
                  }
                  else
                  {
                      res.json({
                          status:401,
                          message: 'something went wrong!',
                      });
                  }
              });
          }
          else if(!err && usr_doc == null)
          {
              res.json({
                  status: 401,
                  message: 'User details not found!',
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

      });
  }
}

export function verify_otp(req, res){
    console.log('verify_otp');
    console.log('req.body',req.body);
    var user_type = req.body.user_type;
    var otp = req.body.otp;
    if(user_type== 2)
    {
        Labors.findOne({$and: [{_id: req.body.user_id},{otp:req.body.otp}]}).exec(function(err, lab_doc){
            console.log('findOne, err, lab_doc',err, lab_doc);
            if(!err && lab_doc != null)
            {
                Labors.update({_id: lab_doc._id}, {$set: {'otp_flag' : 1}}, function(err1, res_doc){
                    if(!err1 && res_doc != null)
                    {
                        var data = {_id: lab_doc._id, otp_flag: lab_doc.otp_flag, page: 'dashboard',};
                        res.json({
                            status: 200,
                            message:'verified',
                            data: data,
                            // token: lab_doc.token,
                            // user_id: lab_doc._id,
                        });
                    }
                    else if(!err1 && res_doc ==null)
                    {
                        res.json({
                            status: 401,
                            message: 'invalid otp',
                        });
                    }
                    else
                    {
                        res.json({
                            status: 401,
                            message: 'something went wrong!',
                            err: err1,
                        });
                    }
              })//Labors.update ends
                
            }
            else if(!err && lab_doc==null)
            {
                res.json({
                    status: 401,
                    message: 'invalid otp',
                });
            }
        })//Labors.findOne ends
    }
    else if(user_type == 3)
    {
        Users.findOne({ $and : [{'_id': req.body.user_id},{otp: req.body.otp}]}).exec(function(err,user_doc){
            if(!err && user_doc !=null)
            {
                Users.update({_id: user_doc._id}, {$set: {'otp_flag' : 1}}, function(err1, res_doc){
                  if(!err1 && res_doc !=null)
                  {
                      var data = {_id: user_doc._id, otp_flag: user_doc.otp_flag, page: 'dashboard'};
                      res.json({
                          status: 200,
                          message:'verified',
                          data: data,
                          // token: lab_doc.token,
                          // user_id: lab_doc._id,
                      });
                  }
                  else if(!err1 && res_doc ==null)
                  {
                      res.json({
                          status: 401,
                          message: 'invalid otp',
                      });
                  }
                  else
                  {
                      res.json({
                          status: 401,
                          message: 'something went wrong!',
                          err: err1,
                      });
                  }
              })//User.update
          }
          else
          {
              res.json({
                  status: 401,
                  message: 'invalid otp',
              });
          }
        })//Users findone ends
    }
}

export function forgot_verify_otp(req, res){
    console.log('forgot_verify_otp');
    console.log('req.body',req.body);
    var user_type = req.body.user_type;
    var mobile_number = req.body.mobile_number;
    var otp = req.body.otp;
    if(user_type == 2)
    {
        Labors.findOne({$and: [{mobile_number: req.body.mobile_number},{otp:req.body.otp}]}).exec(function(err, lab_doc){
            console.log('findOne, err, lab_doc',err, lab_doc);
            if(!err && lab_doc != null)
            {
                res.json({
                    status: 200,
                    message: 'otp verified successfully!',
                    data: {mobile_number: lab_doc.mobile_number,_id: lab_doc._id,user_type:lab_doc.user_type},
                    page: 'reset_password',
                })
            }
            else if(!err && lab_doc == null)
            {
                res.json({
                    status: 401,
                    message: 'invalid otp',
                });
            }
        })//Labors.findOne ends
    }
    else if(user_type == 3)
    {
        Users.findOne({ $and : [{'mobile_number': req.body.mobile_number},{otp: req.body.otp}]}).exec(function(err,user_doc){
            console.log('err,user_doc test',err,user_doc);
            res.send('hello')
            res.json({
              status: 401,
              message:' test'
            })
            // if(user_doc != null)
            // {
            //     res.json({
            //         status: 200,
            //         message: 'otp verified successfully!',
            //         data: { mobile_number: user_doc.mobile_number,_id: user_doc._id,user_type:user_doc.user_type},
            //         page: 'reset_password',
            //     });
            // }
            // else if(user_doc == null)
            // {
            //     res.json({
            //         status: 401,
            //         message: 'invalid otp',
            //     });
            // }
            // else
            // {
            //     res.json({
            //       status: 401,
            //       message: 'something went wrong'
            //     })
            // }
        })//Users findone ends
    }
    else
    {
        res.json({
            status: 401,
            message: 'something went wrong!',
        })
    }
}
