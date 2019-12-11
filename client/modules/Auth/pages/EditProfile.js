import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


import Helmet from 'react-helmet';
import SubHeader from '../../../../components/SubHeader.js';
import MainFooter from '../../../../components/MainFooter.js';

import EditLabor from './EditLabor.js';
import EditUser from './EditUser.js';

class EditProfile extends Component{
	render(){
		return(
			<div>
				<Helmet
		            title="Update My Profile | LaborBridge"
		            titleTemplate="%s - Bridging labor to need"
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
		        <SubHeader auth={this.props.auth} />
		        <div className="body_cntnt">
		        	{this.props.auth && this.props.auth.user_type === 2 ? 
		        		<EditLabor auth={this.props.auth} /> 
		        	: 
		        		<EditUser auth={this.props.auth} />
		        	}
				</div>
		        <MainFooter />
			</div>
		);
	}
}

function mapStateToProps(state){
	return {
		auth: state.web.auth,
	};
}

export default connect(mapStateToProps)(EditProfile);