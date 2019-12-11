import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { browserHistory } from 'react-router';

import SubHeader from '../../../../components/SubHeader.js';
import MainFooter from '../../../../components/MainFooter.js';
import ResetPwdForm from '../../components/ResetPwdForm.js';

class ResetPwd extends Component{
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
		            title="Reset Password | LaborBridge"
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
					<ResetPwdForm />
				</div>
				<MainFooter />
			</div>
		);
	}
}

function mapStateToProps(store){
	return{
		auth: store.web.auth,
	}
}

export default connect(mapStateToProps)(ResetPwd);