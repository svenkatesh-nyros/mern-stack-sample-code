import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { browserHistory } from 'react-router';
import Helmet from 'react-helmet';

import SubHeader from '../../../../components/SubHeader.js';
import SignInForm from '../../components/SignInForm.js';
import MainFooter from '../../../../components/MainFooter.js';

class SignIn extends Component{
	constructor(props){
		super(props);
		this.state={

		};
	}
	componentDidMount = () => {
		if(this.props.auth)
		{
			browserHistory.push('/');
		}
	}
	componentWillReceiveProps(nextProps){
		// console.log('nextProps--->',nextProps);
		if(nextProps.auth !== this.props.auth)
		{
			if(nextProps.auth.page==='verify_otp')
			{
				browserHistory.push('/verify_otp');	
			}
			else
			{
				browserHistory.push('/');
			}
		}
	}
	render(){
		return(
			<div>
				<Helmet
		            title="SignIn | LaborBridge"
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
					<SignInForm />
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

export default connect(mapStateToProps)(SignIn);