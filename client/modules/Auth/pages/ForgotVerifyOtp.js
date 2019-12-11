import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Helmet from 'react-helmet';

import SubHeader from '../../../../components/SubHeader.js';
import ForgotOtpForm from '../../components/ForgotOtpForm.js';
import MainFooter from '../../../../components/MainFooter.js';

class ForgotVerifyOtp extends Component{
	componentDidMount = () => {
		if(this.props.auth)
		{
			if(this.props.auth.otp_flag ===1)
			{
				browserHistory.push('/');
			}
		}
	}
	render(){
		return(
			<div>
				<Helmet
		            title="Verify OTP | LaborBridge"
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
				<SubHeader 
					auth={this.props.auth}
				/>
				<div className="body_cntnt">
					<ForgotOtpForm  />
				</div>
				<MainFooter />
			</div>
		);
	}
}

function mapStateToProps(state){
	return {
		auth: state.web.auth,
		register: state.web.register,
	}
}

export default connect(mapStateToProps)(ForgotVerifyOtp);