import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';


import SubHeader from '../../../../components/SubHeader.js';
import MainFooter from '../../../../components/MainFooter.js';
import SignUpForm from '../../components/SignUpForm.js';

class SignUp extends Component{
	componentDidMount = () => {
		if(this.props.auth)
		{
			browserHistory.push('/');
		}
	}
	render(){
		return(
			<div>
				<Helmet
		            title="SignUp | LaborBridge"
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
					<SignUpForm />
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

export default connect(mapStateToProps)(SignUp);