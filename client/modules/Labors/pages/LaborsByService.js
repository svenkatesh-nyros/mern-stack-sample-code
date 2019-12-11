import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import SubHeader from '../../../components/SubHeader.js';
import MainFooter from '../../../components/MainFooter.js';
import FullLabors from '../components/FullLabors.js';

import { getLaborsRequest } from '../LaborActions.js';
import { getCustomServicesRequest } from '../../Services/ServiceActions.js';

import callApi from '../../../../util/apiCaller.js';

class LaborsByService extends Component{
	constructor(props){
		super(props);
		this.state={
			labors: [],
			labors_err_status:false,
			labors_err_msg:'',
		}
		this.getLabors = this.getLabors.bind(this);
	}
	
	componentDidMount = () => {
		this.getCustomServices();
		if(this.props.params.ServiceID && this.props.params.ServiceID !==null)
		{
			this.selectedServiceLabors(this.props.params.ServiceID);
		}
	}

	componentWillReceiveProps = (nextProps) => {
		if(nextProps.labors !== this.props.labors){
			this.setState({
				labors: nextProps.labors,
			})
		}
	}
	
	getLabors = () => {
		this.props.dispatch(getLaborsRequest());
	}

	getCustomServices = () => {
		this.props.dispatch(getCustomServicesRequest())
	}
	
	selectedServiceLabors = (data) => {
		var data = {query: "{ getService(id: \""+data+ "\"){id,name,labors{ id,name,email,user_type,avatar,mobile_number,location,address,service_location,latitude,longitude, availability,description,certification,views_count,months,years,call_count}} }"};
		callApi('graphql','post',data).then(response => {
			if(response.data && response.data.getService)
			{
				if(response.data.getService === null)
				{
					this.setState({
						labors: null,
						labors_err_status: true,
						labors_err_msg: 'No service category found!',
					});
				}
				else if(response.data.getService && response.data.getService.labors.length <= 0)
				{
					this.setState({
						labors: response.data.getService.labors,
						labors_err_status: true,
						labors_err_msg: 'No laborers are found in the service category "'+response.data.getService.name+'"',
					});
				}
				else
				{
					this.setState({
						labors: response.data.getService.labors,
						labors_err_status: false,
						labors_err_msg: '',
					});
				}
			}
			else
			{
				this.setState({
					labors: null,
					labors_err_status: true,
					labors_err_msg: 'No Service category is found!'
				})
			}
		})
	}
	
	render(){
		return(
			<div>
				<SubHeader 
					auth={this.props.auth} 
				/>
				<div className="body_cntnt">
					<FullLabors 
			       		labors={this.state.labors ? this.state.labors : this.props.labors} 
			       		custom_services={this.props.custom_services ? this.props.custom_services : []}
			       		selectedServiceLabors={(data) => this.selectedServiceLabors(data)}
			       		labors_err_status={this.state.labors_err_status}
						labors_err_msg={this.state.labors_err_msg}
			       	/>
				</div>
				<MainFooter />
			</div>
		);
	}
}

function mapStateToProps(state) {
  return {
    labors: state.labors.labors,
    auth: state.auth.auth,
    custom_services: state.services.custom_services,
  };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({ getLaborsRequest, getCustomServicesRequest }, dispatch);
}

export default connect(mapStateToProps)(LaborsByService);