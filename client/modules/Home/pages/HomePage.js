import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import callApi from '../../../../util/apiCaller.js';

// Components here
import MainHeader from '../../../components/MainHeader.js';
import MainFooter from '../../../components/MainFooter.js';

import HomeServices from '../components/HomeServices.js';
import HomeLabors from '../components/HomeLabors.js';

// actions here
import { loadUserProps, logout } from '../../Auth/AuthActions.js';
import { getServicesRequest, getCustomServicesRequest, getServicesByLocationRequest } from '../../Services/ServiceActions.js';
import { getLaborsRequest } from '../../Labors/LaborActions.js';

class HomePage extends Component{
	constructor(props){
		super(props);
		this.state={
			services: this.props.services,
			labors: this.props.labors,
			custom_services: this.props.custom_services,
			selected_services_labors: '',
			services_err_status: false,
			services_err_msg: '',
			labors_err_status: false,
			labors_err_msg: '',
		};
		this.handleLogout = this.handleLogout.bind(this);
		this.getServices = this.getServices.bind(this);
		this.getLabors = this.getLabors.bind(this);
		this.searchServices = this.searchServices.bind(this);
		this.getCustomServices = this.getCustomServices.bind(this);
		this.selectedServiceLabors = this.selectedServiceLabors.bind(this);
		this.onSuggestSelect = this.onSuggestSelect.bind(this);
	}

	componentDidMount = () => {
		this.getServices();
		this.getLabors();
		this.getCustomServices();
	}

	getCustomServices = () => {
		this.props.dispatch(getCustomServicesRequest());
	}

	onSuggestSelect = (e) => {
		console.log('home page data',e);
		this.props.dispatch(getServicesByLocationRequest(e));
	}

	componentWillReceiveProps =(nextProps) =>{
		if(nextProps.services!==this.props.services){
		    this.setState({
		    	services: nextProps.services 
		    });
		}
		if(nextProps.labors !== this.props.labors){
			this.setState({
				labors: nextProps.labors,
			});
		}
	}

	// fn for getting the list of labors
	getLabors = () => {
		this.props.dispatch(getLaborsRequest());
	}

	searchServices =(event) => {
		var src_text = event.target.value;
		if(src_text.length >= 1 )
		{
			var matches = this.props.services.filter(function(item) {
	            if(item.name.toLowerCase().indexOf(src_text.toLowerCase()) !== -1) return true;
	        })
	        this.setState({
	            services: matches,
	        });
		}
		if(src_text==='')
		{
			this.setState({
				services: this.props.services,
			});
		}
	}

	selectedServiceLabors = (data) => {
		var data = {query: "{ getService(id: \""+data+ "\"){id,name,labors{ id,name,email,user_type,avatar,mobile_number,location,address,service_location,latitude,longitude, availability,description,certification,views_count,months,years,call_count}} }"};
		callApi('graphql','post',data).then(response => {
			if(response.data && response.data.getService.labors)
			{
				if(response.data.getService.labors.length <= 0)
				{
					this.setState({
						labors: response.data.getService.labors,
						labors_err_status: true,
						labors_err_msg: 'No Laborers are found in this service category "'+response.data.getService.name+ '"',
					});
				}
				else
				{
					this.setState({
						labors: response.data.getService.labors,
						labors_err_status: false,
					});
				}
			}
		})
	}

	handleLogout = () => {
		this.props.dispatch(logout());
	}

	getServices = () => {
		this.props.dispatch(getServicesRequest());
	}

	render(){
		return(
			<div>
				<MainHeader 
					auth={this.props.auth}
					logout={this.handleLogout}
					services={this.state.services ? this.state.services : this.props.services} 
					searchServices={(e)=> this.searchServices(e)} 
		         	onSuggestSelect={(data) => this.onSuggestSelect(data)} 
				/>
				<div className="body_cntnt">
					<HomeServices 
		         		services={this.state.services ? this.state.services : []} 
		         	/>
		         	<HomeLabors 
		         		labors={this.state.labors ? this.state.labors : []} 
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

HomePage.propTypes = {
	dispatch: PropTypes.func,
	auth: PropTypes.shape({
		mobile_number: PropTypes.Number,
	}),
}


function mapStateToProps(state) {
  return {
    auth: state.auth.auth,
    services: state.services.services,
    labors: state.labors.labors,
    custom_services: state.services.custom_services,
    services_by_location: state.services.services_by_location,
  };
}

export default connect(mapStateToProps)(HomePage);
