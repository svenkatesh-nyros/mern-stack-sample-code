import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

const path = require('path');
const fs = require('fs');
// const curl = new (require( 'curl-request' ))();

import Users from '../models/Users';
import Labors from '../models/Labors';
import Services from '../models/Services';
import Skills from '../models/Skills';
import States from '../models/States';
import Cities from '../models/Cities';



export function popular_services(req, res) {
  console.log('popular_services');
  Services.find({'trending': true},function(err,ser_doc){
  		if(!err)
  		{
    			// for(var i=0; i< cat_doc.length; i++)
    			// {
    			// 	ser_doc[i].dataValues['checked'] = false
    			// }
    			res.json({
              status: 200,
              message:'popular services list',
              data: ser_doc
          })
  		}
  		else
  		{
    			res.json({
      				status: 401,
      				message:'no popular services found!',
      				err:err,
    			});
  		}
  })//Services end
}

export function services_by_location(req, res){
    console.log('services_by_location');
    console.log('req.body',req.body);
    var lat = req.body.lat;
    var lng = req.body.lng;
    Labors.find({geo_location: { $nearSphere: { $geometry: { type: "Point", coordinates: [ req.body.lng, req.body.lat ] }, $maxDistance:  80467 } } },{'services': 1}).populate('services',{'updatedAt':0,'createdAt':0,'__v':0}).exec(function(err,lab_doc){
        if(!err && lab_doc.length==0)
        {
            res.json({
                status: 401,
                message:'No services found in your near location',
            });
        }
        else if(!err && lab_doc.length > 0)
        {
            res.json({
                status: 200,
                message:'Services list near your place',
                data: lab_doc,
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
    })//Labors.find ends
}

export function create_service(req, res){
    console.log('create_service');
    Services.create({name: req.body.name,trending:req.body.trending},function(err,ser_doc){
        if(!err)
        {
            res.json({
                status: 200,
                message:'Service created successfully!',
            })
        }
        else
        {
            res.json({
                status: 401,
                message: 'something went wrong!',
            })
        }
    })
}

export function get_services(req, res){
	console.log('get_services');
  console.log('req.body',req.body);
  Services.find({}).sort({name:1}).exec(function(err, ser_doc){
      if(!err)
      {
          var data=[];
          for(var i=0;i<ser_doc.length; i++)
          {
              data.push({_id:ser_doc[i]._id,name:ser_doc[i].name.replace(/\_+/g,' ')})
          }
          res.json({
              status: 200,
              message:'Services list',
              data: ser_doc,
          });
      }
      else
      {
          res.json({
              status: 401,
              message: 'No Services found!',
              err: err,
          });
      }
  })//Services end//
}
export function get_services_page(req, res){
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

    Services.count({},function(err,tot_count){
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
               Services.find({},{},query).sort('name':1).exec(function(err, ser_doc){
                  if(!err && ser_doc.length > 0)
                  {
                      res.json({
                          status: 200,
                          message: 'Services',
                          data: ser_doc,
                          tot_count: tot_count,
                          next_page: page + 1
                      });
                  }
                  else if(!err && ser_doc.length == 0)
                  {
                      res.json({
                          status: 401,
                          message: 'No Services found!'
                      });
                  }
                  else
                  {
                      res.json({
                          status: 401,
                          message:'Something went wrong!',
                      });
                  }
              });//Services.find end
          }
          else
          {
              res.json({
                  status: 401,
                  message:'No Services found!',
                  err: 'limit'
              })
          }
         
      }
    })//Labors.count end
}
export function get_custom_services(req, res){
    console.log('get_custom_services');
    Services.find({},{createdAt: 0,updatedAt:0,__v:0,trending:0,isactive:0},function(err,ser_doc){
        if(!err && ser_doc.length > 0)
        {
            var data= [];
            for(var i=0;i<ser_doc.length; i++)
            {
                // { key: 'angular', text: 'Angular', value: 'angular' },
                data.push({key:ser_doc[i]._id,text:ser_doc[i].name, value:ser_doc[i]._id})
            }
            res.json({
                status: 200,
                message: 'Services list',
                data: data,
            });
        }
        else
        {
            res.json({
                status: 401,
                message: 'something went wrong!',
            });
        }
    })
}

export function get_custom_skills(req, res){
    console.log('get_custom_skills');
    Skills.find({},{createdAt: 0,updatedAt:0,__v:0,},function(err,ski_doc){
        if(!err && ski_doc.length > 0)
        {
            var data=[];
            for(var i=0; i< ski_doc.length; i++)
            {
               data.push({key:ski_doc[i]._id,text:ski_doc[i].name, value:ski_doc[i]._id})
            }
            res.json({
                status: 200,
                message: 'skills list',
                data: data,
            });
        }
        else
        {
            res.json({
                status: 401,
                message:'no skills found!',
            });
        }
    })//Skills.find error
}