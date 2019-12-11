import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Helmet from 'react-helmet';
import SubHeader from '../../../../components/SubHeader.js';
import MainFooter from '../../../../components/MainFooter.js';
import MyProfileView from '../../components/MyProfileView.js';


class MyProfile extends Component{
	render(){
		return(
			<div>
				<Helmet
		            title="My Profile | LaborBridge"
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
		        	<MyProfileView />
		        </div>
		        <MainFooter />
			</div>
		);
	}
}


function mapStateToProps(store){
	return {
		auth: store.web.auth,
	}
}
export default connect(mapStateToProps)(MyProfile);