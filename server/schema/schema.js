const graphql = require('graphql');

const Skills = require('../models/Skills');
const Labors = require('../models/Labors');
const Users = require('../models/Users');
const Services = require('../models/Services');
const Cities = require('../models/Cities');
const Countries = require('../models/Countries');
const States = require('../models/States');
const _ = require('lodash');

// import * as SchemaTypes from './schemaTypes/index.js';
import * as SchemaTypes from './schemaTypes.js';

const { 
	GraphQLObjectType,
	GraphQLInt,
	GraphQLFloat,
	GraphQLString, 
	GraphQLSchema,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull,
	GraphQLBoolean,
	GraphQLInputObjectType,
	GraphQLInputType
} = graphql;


// import {
//   GraphQLDate,
//   GraphQLTime,
//   GraphQLDateTime
// } from 'graphql-iso-date';

// const SkillsType = require('./schemaTypes/SkillsType.js');


const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		labors: {
			type: new GraphQLList(SchemaTypes.LaborsType),
			args: {limit: {type: GraphQLInt}, offset: {type: GraphQLInt}},
			resolve(parent,args,info){
				// return Labors.find({}).skip(args.offset).limit(args.limit)}
				const data1= 1
				return new Promise((resolve) => {
		          	Labors.find({}).skip(args.offset).limit(args.limit).then((items) => {
		          		return resolve({'labors':items,limit: 4})
			        })
		          })
		    }
		},
		getLabor: {
			type: SchemaTypes.LaborsType,
			args: {id: {type: GraphQLID}},
			resolve(parent, args){
				return Labors.findById(args.id);
			}
		},
		users: {
			type: new GraphQLList(SchemaTypes.UsersType),
			args: { limit: { type: GraphQLInt}, offset: { type: GraphQLInt } },
			resolve(parent, args){
				return Users.find({}).skip(args.offset).limit(args.limit);
			}
		},
		getUser: {
			type: SchemaTypes.UsersType,
			args: {id: {type: GraphQLID}},
			resolve(parent,args){
				// return _.find(authors, {id: args.id});
				return Users.findById(args.id);
			}
		},
		skills: {
			type: new GraphQLList(SchemaTypes.SkillsType),
			args: { limit: {type: GraphQLInt}, offset: { type: GraphQLInt } },
			resolve(parent, args){
				return Skills.find({}).skip(args.offset).limit(args.limit);
			}
		},
		getSkill:{
			type: SchemaTypes.SkillsType,
			args: {
				id: { type: GraphQLID }
			},
			resolve(parent, args){
				return Skills.findById(args.id)
			}
		},
		services: {
			type : new GraphQLList(SchemaTypes.ServicesType),
			args: {limit: { type: GraphQLInt },offset: { type: GraphQLInt }},
			resolve(parent, args){
				return Services.find({}).skip(args.offset).limit(args.limit);
			}
		},
		getService:{
			type: SchemaTypes.ServicesType,
			args: {
				id: { type: GraphQLID },
			},
			resolve(parent, args){
				return Services.findById(args.id);
			}
		},
		states: {
			type: new GraphQLList(SchemaTypes.StatesType),
			args: {limit: { type: GraphQLInt}, offset: { type: GraphQLInt } },
			resolve(parent, args){
				return States.find({}).skip(args.offset).limit(args.limit);
			}
		},
		getState: {
			type: new GraphQLList(SchemaTypes.StatesType),
			args: {
				name: { type: GraphQLString },
			},
			resolve(parent,args){
				return States.find({name: args.name});
			}
		},
		cities: {
			type : new GraphQLList(SchemaTypes.CitiesType),
			args: {limit: { type: GraphQLInt}, offset: { type: GraphQLInt } },
			resolve(parent, args){
				return Cities.find({}).skip(args.offset).limit(args.limit);
			}
		},
		getCity:{
			type: new GraphQLList(SchemaTypes.CitiesType),
			args: { 
				name: { type: GraphQLString },
			},
			resolve(parent,args){
				var city = args.name;
				return Cities.find({name: args.name})
			}
		},
		countries: {
			type: new GraphQLList(SchemaTypes.CountriesType),
			args: { limit: { type:GraphQLInt },offset: { type: GraphQLInt } },
			resolve(parent, args){
				return Countries.find({}).skip(args.offset).limit(args.limit);
			}
		},
	}
})

//Mutations are used for performing create or alter operations(actions)

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		createUser: {
			type: SchemaTypes.UsersType,
			args: {
				name : { type: new GraphQLNonNull(GraphQLString)},
				email : { type: new GraphQLNonNull(GraphQLString)},
				otp : { type: GraphQLFloat },
				otp_flag : { type: GraphQLBoolean },
				avatar: { type: GraphQLString},
				password: { type: new GraphQLNonNull(GraphQLString) },
				mobile_number: { type: new GraphQLNonNull(GraphQLFloat)},
				location: { type: new GraphQLNonNull(GraphQLString)},
				device_token: { type: GraphQLString },
				device_id: { type: GraphQLString },
				address:{ type: GraphQLString },
				reg_from:{ type: GraphQLString },
				token: { type: GraphQLString },
				latitude: { type: GraphQLFloat },
				longitude: { type: GraphQLFloat },
				user_type: { type: new GraphQLNonNull(GraphQLInt)},
				// geo_location:[{type: GraphQLFloat},{type: GraphQLFloat}]
			},
			async resolve(parent, args){
				var mobile_number = args.mobile_number;
				const user = await Users.findOne({mobile_number: mobile_number});
				if(user != null)
		        {
		        	console.log('user exists');
		        	return new Error("Labor details exists");
				}
		        else if(user === null)
		        {
		    		let cre_user = new Users();
			           	cre_user.name = args.name;
						cre_user.email = args.email;
						cre_user.otp = Math.floor(10000 + Math.random() * 90000);
						cre_user.otp_flag = false;
						cre_user.avatar = args.avatar;
						cre_user.password = args.password;
						cre_user.mobile_number = args.mobile_number;
						cre_user.location = args.location;
						// cre_user.device_token = 
						// cre_user.device_id
						cre_user.address = args.address;
						cre_user.reg_from = args.reg_from;
						// cre_user.token = args.token
						cre_user.latitude = args.latitude;
						cre_user.longitude = args.longitude;
						cre_user.user_type = args.user_type;
						// cre_user.geo_location = args.geo_location;
					return cre_user.save()
				}
		        else
		        {
		            return new Error("something went wrong!")
		        }
			}
		},
		editUser: {
			type: SchemaTypes.UsersType,
			args: {
				id: { type : new GraphQLNonNull(GraphQLID) },
				name : { type: GraphQLString },
				mobile_number: { type: new GraphQLNonNull(GraphQLFloat)},
				email : { type: GraphQLString },
				location: { type: GraphQLString },
				address:{ type: GraphQLString },
				latitude: { type: GraphQLFloat },
				longitude: { type: GraphQLFloat },
			},
			async resolve(parent, args){
				var mobile_number = args.mobile_number;
				const user = await Users.findOne({$and: [{mobile_number: mobile_number,_id: args.id}]});
				if(user != null)
		        {
		        	var data= {args}
					return Users.findByIdAndUpdate(args.id, 
							{ 	$set: {data
									// name:args.name,
									// email:args.email,
									// location:args.location,
									// address:args.address,
									// latitude:args.latitude,
									// longitude:args.longitude,		
								} 
							},
							{new : true}
					)
					.catch(err => new Error(err));
				}
		        else if(user === null)
		        {
		    		console.log('no user found');
		        	return new Error("No User details found!");
		    	}
		        else
		        {
		            return new Error("something went wrong!")
		        }
			}
		},
		deleteUser: {
			type: SchemaTypes.UsersType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				mobile_number: { type: new GraphQLNonNull(GraphQLFloat) },
			},
			resolve(parent,args){
				const user = Users.findOne({$and: [{_id: args.id},{mobile_number: args.mobile_number}]});
				if(user == null)
				{
					return new Error("No user details found!");
				}
				else
				{
					return Users.deleteOne({_id: args.id})
					.catch(err => new Error(err));

				}
			}
		},
		createLabor: {
			type: SchemaTypes.LaborsType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				password : { type : new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) },
				otp: { type: GraphQLString },
				otp_flag : { type: GraphQLBoolean },
				avatar : { type : GraphQLString },
				mobile_number : { type : GraphQLFloat },
				location : { type: GraphQLString },
				device_token : { type : GraphQLString },
				device_id : { type: GraphQLString },
				address : { type: GraphQLString },
				reg_from : { type: GraphQLString },
				// token: { type : GraphQLString },
				service_location: { type: GraphQLString },
				latitude: { type: GraphQLFloat },
				longitude: { type: GraphQLFloat },
				availability: { type: GraphQLBoolean },
				description: { type: GraphQLString },
				certification: { type: GraphQLString },
				views_count: { type: GraphQLInt },
				months: { type : GraphQLString },
				years: { type: GraphQLString },
				call_count: { type: GraphQLInt },
				user_type: { type: GraphQLInt },
				// skills: { type: new GraphQLList(SchemaTypes.InputSkillsType) },
				// services: { type: SchemaTypes.InputServicesType }
			},
			async resolve(parent,args){
				console.log('create_labor');
			    var mobile_number = args.mobile_number;
			    let labor = await Labors.findOne({mobile_number: mobile_number});
			    if(labor != null)
			    {
			    	return new Error("labor existed already!");
			    }
				else if(labor === null)
			    {
		            const cre_labor = new Labors();
		              cre_labor.name = args.name;
		              cre_labor.email = args.email;
		              cre_labor.mobile_number = args.mobile_number;
		              cre_labor.password = args.password;
		              cre_labor.location = args.location;
		              cre_labor.address = args.address;
		              cre_labor.reg_from = args.reg_from;
		              cre_labor.geo_location = args.geo_location;
		              cre_labor.latitude = args.latitude;
		              cre_labor.longitude = args.longitude;
		              // cre_labor.services = args.selected_services;
		              cre_labor.user_type = args.user_type;
		              cre_labor.skills = args.skills;
		              cre_labor.otp = Math.floor(10000 + Math.random() * 90000);
		              cre_labor.otp_flag = 0;
		              cre_labor.availability = args.availability;
		              cre_labor.certification= args.certification;
		              cre_labor.description = args.about_labor;
		              cre_labor.months = args.months;
		              cre_labor.years = args.years;
		              cre_labor.service_location = args.service_location;
			              
		              return cre_labor.save()
			    }
			    else
			    {
			        return new Error("something went wrong!");
			    }
			}
		},
		editLabor: {
			type: SchemaTypes.LaborsType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				mobile_number: { type: new GraphQLNonNull(GraphQLFloat) }, 
				name: { type: GraphQLString },
				email: { type: GraphQLString },
				location : { type: GraphQLString },
				address : { type: GraphQLString },
				service_location: { type:GraphQLString },
				latitude: { type: GraphQLFloat },
				longitude: { type: GraphQLFloat },
				availability: { type: GraphQLBoolean },
				description: { type: GraphQLString},
				certification: { type: GraphQLString },
				months: { type : GraphQLString },
				years: { type: GraphQLString },
			},
			async resolve(parent,args){
				console.log('edit_labor');
			    var mobile_number = args.mobile_number;
			    let labor = await Labors.findOne({$and: [{mobile_number: mobile_number},{_id:args.id}]});
			    if(labor != null)
			    {
			        await Labors.findByIdAndUpdate(args.id, args, (err,labor) => {
			    		console.log('err,labor',err,labor)
			    		if(err){
			    			return new Error("something went wrong!",err)
			    		}
			    		else
			    		{
			    			return labor;
			    		}
			    	});
			    }
				else if(labor === null)
			    {
		            return new Error("labor details not found!");
		        }
			    else
			    {
			        return new Error("something went wrong!");
			    }
			}
		},
		deleteLabor:{
			type: SchemaTypes.LaborsType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				mobile_number: { type: new GraphQLNonNull(GraphQLFloat) }
			},
			resolve(parent,args)
			{
				const labor = Labors.findOne({$and: [{_id: args.id},{mobile_number: args.mobile_number}]});
				if(labor == null)
				{
					return new Error("no labor details found!");
				}
				else
				{
					return Labors.deleteOne({_id: args.id});
				}
			}
		},
		createSkill: {
			type: SchemaTypes.SkillsType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString)},
			},
			async resolve(parent,args){
				var name = args.name.replace(/\s+/g,'_').toLowerCase();
				console.log('name->',name);
				var check = await Skills.findOne({name: name});
				if(check == null)
				{
					var skills = new Skills();
					skills.name = args.name.replace(/\s+/g,'_').toLowerCase();
					return skills.save()
				}
				else
				{
					return new Error("skill name already existed!")
				}
			}
		},
		editSkill:{
			type: SchemaTypes.SkillsType,
			args: {
				id: { type: new GraphQLNonNull(GraphQLID) },
				name: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parent,args){
				 return Skills.findByIdAndUpdate(args.id, 
							{$set: { name: args.name} },
							{new : true}
						)
					.catch(err => new Error(err));
			}
		},
		deleteSkill:{
			type: SchemaTypes.SkillsType,
			args: {
				id: { type: GraphQLID }
			},
			resolve(parent,args){
				return Skills.deleteOne({_id: args.id})
				.catch(err => new Error(err));

			}
		},
		createService: {
			type: SchemaTypes.ServicesType,
			args: {																																																	
				name: { type: new GraphQLNonNull(GraphQLString) },
			},
			async resolve(parent,args){
				var name = args.name.replace(/\s+/g,'_').toLowerCase();
				const check = await Services.findOne({name: name});
				if(check == null)
				{
					var services = new Services();
	    			services.name = name;
	    			return services.save();	
				}
				else
				{
					return new Error("service name already existed!");
				}
			}
		},
		editService:{
			type: SchemaTypes.ServicesType,
			args: {
				id: { type: GraphQLID },
				name: { type: new GraphQLNonNull(GraphQLString) },
			},
			resolve(parent,args){
				return Services.findByIdAndUpdate(args.id,
					{$set: {name: args.name}},
					{new : true}
				)
				.catch(err => new Error(err));
			}
		},
		deleteService:{
			type: SchemaTypes.ServicesType,
			args: {
				id: { type: GraphQLID },
			},
			resolve(parent,args){
				return Services.deleteOne({_id: args.id})
				.catch(err => new Error(err));
			}
		}
		
	}
});


module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});