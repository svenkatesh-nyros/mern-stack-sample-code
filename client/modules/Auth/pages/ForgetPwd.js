import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import Helmet from 'react-helmet';
import SubHeader from '../../../../components/SubHeader.js';
import MainFooter from '../../../../components/MainFooter.js';
import ForgetPwdForm from '../../components/ForgetPwdForm.js';

import { getNoty } from '../../WebActions.js';

class ForgetPwd extends Component{
	
	componentDidMount = () => {
		if(this.props.auth)
		{
			browserHistory.push('/');
		}
	}
	// sendNoty = (mode, message) => {
	// 	console.log('mode, message',mode, message);
	// 	this.props.dispatch(getNoty(mode,message))
	// }
	render(){
		return(
			<div>
				<Helmet
		            title="Forget Password | LaborBridge"
		            titleTemplate="%s - bridging labor to need"
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
					<ForgetPwdForm />
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

export default connect(mapStateToProps)(ForgetPwd);