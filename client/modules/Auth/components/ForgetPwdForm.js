import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { Select } from 'semantic-ui-react';

import callApi from '../../../util/apiCaller.js';
import FormError from './FormError.js';

export default class ForgetPwdForm extends Component{
	constructor(props){
		super(props);
		this.state={
			mobile: '',
			mobile_err_status: false,
			mobile_err_msg: '',
			user_type: 3,
			user_type_err_status: false
		}
		this.changeMobile = this.changeMobile.bind(this);
		this.submitMobile = this.submitMobile.bind(this);
		this.handleUserType = this.handleUserType.bind(this);
	}

	changeMobile = (event) => {
		var mobile = event.target.value;
		this.setState({
			mobile: event.target.value.replace(/[^0-9]/g, ''),
			mobile_err_status:false,
		});
	}

	handleUserType = (event: React.SyntheticEvent<HTMLDivElement>, data:any) => {
		this.setState({
			user_type: data.value,
			user_type_err_status:false,
		});
	}

	submitMobile = (event) => {
		event.preventDefault();
		var mobile = this.state.mobile;
		var user_type = this.state.user_type;
		var x = 1;
		if(mobile === '')
		{
			x = 0;
			this.setState({
				mobile_err_status: true,
				mobile_err_msg: '* please enter your mobile number',
			});
		}
		if(mobile !== '' && mobile.length < 10)
		{
			x = 0;
			this.setState({
				mobile_err_status: true,
				mobile_err_msg: '* please enter valid mobile number'
			});
		}

		if(x === 1)
		{
			var data = {from:'web',mobile: mobile,user_type: this.state.user_type}
			callApi('requestOTP','post',data).then(response => {
				localStorage.setItem('m',mobile);
				localStorage.setItem('u',this.state.user_type);
				browserHistory.push('/verify_otp');
			});
		}
	}

	render(){
		const reg_options = [{ key: '1', value: 2, text: 'Laborer'},{ key: '2', value: 3, text: 'User'}];
		return(
			<div>
				<section className={"signup_frm"}>
					<div className={"ui text container"}>
						<div className={"signup_frm_blk"}>
							<h3 className={"ui header no-anchor"}>Forget password</h3>
							<form className={'ui form'} onSubmit={(event) => this.submitMobile(event) }>
								<div className={'equal width fields'}>
								    <div className={'field'}>
								      	<label>Mobile Number</label>
								      	<div className='ui input'>
								        	<input className={this.state.mobile_err_status ? 'input_err' : ''} type='text' maxLength={10} placeholder='Mobile Number' value={this.state.mobile} onChange={(event) => this.changeMobile(event)} />
								      	</div>
								      	<FormError err_status={this.state.mobile_err_status} err_msg={this.state.mobile_err_msg} />
								    </div>
								    <div className={'field'}>
										<label>Select User Type</label>
										<Select className={this.state.user_type_err_status ? 'input_err' : ''} placeholder='Please select user type' options={reg_options} value={this.state.user_type} onChange={this.handleUserType} />
										<FormError err_status={this.state.user_type_err_status} err_msg={this.state.user_type_err_msg} />
									</div>
								</div>
								<div className={'field'}>
									<button className={'ui right button sbmt_btn'} type="submit" role='button'>Submit</button>
								</div>
							</form>
						</div>
					</div>
				</section>
			</div>
		);
	}
}