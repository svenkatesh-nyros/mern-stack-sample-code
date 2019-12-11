import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SubHeader from '../../../components/SubHeader.js';
import MainFooter from '../../../components/MainFooter.js';
import FullServices from '../components/FullServices.js';

import callApi from '../../../../util/apiCaller.js';

import { getServicesRequest, getCustomServicesRequest, getServicesByLocationRequest } from '../ServiceActions.js';

class AllServices extends Component{
	constructor(props){
		super(props);
		this.state={
			services: this.props.services,
			page: 1,
			size: 8,
			tot_count: 0,
		}
		this.getServices = this.getServices.bind(this);
	}

	componentDidMount = () => {
		this.getServices();
	}
	
	componentWillReceiveProps = (nextProps) => {
		if(nextProps && nextProps.services){
			this.setState({
				services: nextProps.services,
			});
		}
	}
	
	getServices = () => {
		var args_data = { size: this.state.size, page: this.state.page};
		return callApi('get_services_page','post',args_data).then(res => {
	      	if(res.status===200)
	      	{
	      		this.setState({
	      			services: this.state.services.concat(res.data),
	      			tot_count: res.tot_count,
					page: res.next_page,
	      		});
	      	}
		});
	}
	
	render(){
		return(
			<div>
				<Helmet
				    title="Services"
				    titleTemplate="%s | LaborBridge"
				    meta={[
				      { charset: 'utf-8' },
				      {
				        'http-equiv': 'X-UA-Compatible',
				        content: 'IE=edge',
				      },
				      {
				        name: 'viewport',
				        content: 'width=device-width, initial-scale=1',
				      },
				    ]}
				/>
				<SubHeader 
					auth={this.props.auth}
				/>
				<div className="body_cntnt">
					<FullServices 
		         		services={this.state.services ? this.state.services : []} 
		         		getServices = {() => this.getServices()}
		         	/>
		       </div>
				<MainFooter />
			</div>
		);
	}
}


function mapStateToProps(state) {
  return {
    services: state.services.services,
    auth: state.auth.auth,
  };
}

export default connect(mapStateToProps)(AllServices);