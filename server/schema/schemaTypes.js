/* eslint-disable no-undef */
const graphql = require('graphql');
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
	GraphQLInputObjectType
} = graphql;

const _ = require('lodash');
const Skills = require('../models/Skills');
const Labors = require('../models/Labors');
const Users = require('../models/Users');
const Services = require('../models/Services');
const Cities = require('../models/Cities');
const Countries = require('../models/Countries');
const States = require('../models/States');

export const LaborsType = new GraphQLObjectType ({
	name: 'Labor',
	fields: () => ({
		id: {type: GraphQLID},
		name: { type : GraphQLString },
		password: { type : GraphQLString },
		email: { type : GraphQLString },
		otp: { type : GraphQLInt },
		otp_flag: { type : GraphQLInt },
		avatar: { type : GraphQLString },
		mobile_number: { type : GraphQLFloat },
		location: { type : GraphQLString },
		device_token: { type : GraphQLString},
		device_id: { type : GraphQLString },
		address : { type : GraphQLString },
		reg_from : { type: GraphQLString },
		token : { type : GraphQLString },
		geo_location: { type : GraphQLFloat },
		service_location : { type : GraphQLString },
		latitude: { type : GraphQLFloat },
		longitude: { type: GraphQLFloat },
		availability: { type : GraphQLBoolean },
		description : { type : GraphQLString },
		certification : { type : GraphQLString },
		views_count : { type : GraphQLInt },
		months: { type : GraphQLString },
		years : { type : GraphQLString },
		call_count : { type : GraphQLInt },
		user_type : { type : GraphQLInt },
		skills: {
			type: new GraphQLList(SkillsType),
			args: {limit: {type: GraphQLInt },offset:{ type: GraphQLInt }},
			resolve(parent, args){
				return Skills.find({"_id": {$in: parent.skills}}).skip(args.offset).limit(args.limit);
			}
		},
		services: {
			type: new GraphQLList(ServicesType),
			args: {limit: { type: GraphQLInt },offset: { type: GraphQLInt }},
			resolve(parent, args){
				return Services.find({"_id": {$in: parent.services}}).skip(args.offset).limit(args.limit);
			}
		}
	})
});

export const InputLaborsType = new GraphQLInputObjectType ({
	name: 'OutputLabor',
	fields: () => ({
		id: {type: GraphQLID},
		name: { type : GraphQLString },
		password: { type : GraphQLString },
		email: { type : GraphQLString },
		otp: { type : GraphQLInt },
		otp_flag: { type : GraphQLInt },
		avatar: { type : GraphQLString },
		mobile_number: { type : GraphQLFloat },
		location: { type : GraphQLString },
		device_token: { type : GraphQLString},
		device_id: { type : GraphQLString },
		address : { type : GraphQLString },
		reg_from : { type: GraphQLString },
		token : { type : GraphQLString },
		geo_location: { type : GraphQLFloat },
		service_location : { type : GraphQLString },
		latitude: { type : GraphQLFloat },
		longitude: { type: GraphQLFloat },
		availability: { type : GraphQLBoolean },
		description : { type : GraphQLString },
		certification : { type : GraphQLString },
		views_count : { type : GraphQLInt },
		months: { type : GraphQLString },
		years : { type : GraphQLString },
		call_count : { type : GraphQLInt },
		user_type : { type : GraphQLInt },
		// skills: {type: [InputSkillsType]},
		// services: {
		// 	type: new GraphQLList(InputServicesType),
		// }
	})
});

export const UsersType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		id : { type : GraphQLString }, 
		name : { type : GraphQLString },
		email : { type : GraphQLString },
		otp : { type : GraphQLFloat },
		otp_flag : { type : GraphQLBoolean },
		avatar : { type : GraphQLString },
		password : { type : GraphQLString },
		mobile_number : { type : GraphQLFloat },
		location : { type : GraphQLString },
		device_token : { type : GraphQLString },
		device_id : { type : GraphQLString },
		address : { type : GraphQLString },
		is_admin : { type : GraphQLString },
		reg_from : { type : GraphQLString },
		auth_token : { type : GraphQLString },
		token : { type : GraphQLString },
		latitude : { type : GraphQLFloat },
		longitude : { type : GraphQLFloat },
		user_type : { type : GraphQLInt },
		
		// geo_location : { type : GraphQLFloat },
	})
});

export const CitiesType = new GraphQLObjectType({
	name: 'Cities',
	fields : () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		state_id: { type: GraphQLInt },
		latitude: { type: GraphQLFloat },
		longitude: { type: GraphQLFloat },
		state:{
			type: new GraphQLList(StatesType),
			args:{limit: { type: GraphQLInt }, offset: { type: GraphQLInt} },
			resolve(parent,args){
				return States.find({state_id: parent.state_id}).skip(args.offset).limit(args.limit);
			}
		}
	})
});

export const CountriesType = new GraphQLObjectType({
	name: 'Countries',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		country_code: { type: GraphQLString },
	})
});

export const ServicesType = new GraphQLObjectType({
	name: 'Services',
	fields: () => ({
		id: { type: GraphQLID },
		name : { type : GraphQLString },
		image : { type : GraphQLString },
		trending : { type : GraphQLBoolean },
		isActive : { type : GraphQLBoolean },
		labors:{
			type: new GraphQLList(LaborsType),
			args: {limit: {type: GraphQLInt}, offset: {type: GraphQLInt} },
			resolve(parent,args){
				return Labors.find({services: parent.id}).skip(args.offset).limit(args.limit);
			}
		}
	})
});

export const InputServicesType = new GraphQLInputObjectType({
	name: 'InputServices',
	fields: () => ({
		id: { type: GraphQLID },
		name : { type : GraphQLString },
		image : { type : GraphQLString },
		trending : { type : GraphQLBoolean },
		isActive : { type : GraphQLBoolean },
	})
});

export const SkillsType = new GraphQLObjectType({
	name: 'Skills',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type : GraphQLString },
		labors:{
			type: new GraphQLList(LaborsType),
			args: {limit: { type:GraphQLInt }, offset: { type: GraphQLInt }},
			resolve(parent,args){
				return Labors.find({skills: parent.id}).skip(args.offset).limit(args.limit);
			}
		}
	})
});

export const InputSkillsType = new GraphQLInputObjectType({
	name: 'InputSkills',
	fields: () => ({
		id: { type: GraphQLString },
		name: { type : GraphQLString },
	})
});

export const StatesType = new GraphQLObjectType({
	name: 'States',
	fields : () => ({
		id: { type: GraphQLID },
		state_id: { type: GraphQLInt },
		name : { type : GraphQLString },
		country_id : { type : GraphQLInt },
		cities: {
			type: new GraphQLList(CitiesType),
			args: { limit: { type: GraphQLInt },offset: { type: GraphQLInt } },
			resolve(parent,args){
				return Cities.find({state_id: parent.state_id}).skip(args.offset).limit(args.limit);
			}
		}
	})
});

export default {
	LaborsType : LaborsType,
	InputLaborsType: InputLaborsType,
	UsersType : UsersType,
	CitiesType : CitiesType,
	CountriesType : CountriesType,
	ServicesType : ServicesType,
	InputServicesType : InputServicesType,
	SkillsType : SkillsType,
	InputSkillsType : InputSkillsType,
	StatesType : StatesType
}
// /* eslint-enable */