import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';

import callApi from '../../../util/apiCaller';
import FormError from './FormError.js';


import { verifyOtpRequest } from '../AuthActions.js';

class OtpForm extends Component{
	constructor(props){
		super(props);
		this.state={
			otp:'',
			otp_err_status: false,
			otp_err_msg:'',
		};
		this.handleOTPChange = this.handleOTPChange.bind(this);
		this.resendOTP = this.resendOTP.bind(this);
		this.submitOtp = this.submitOtp.bind(this);
	}
	
	handleOTPChange = (event) => {
		var otp = event.target.value;
		this.setState({
			otp: event.target.value.replace(/[^0-9]/g, ''),
			otp_err_status: false,
		});
	}
	
	componentWillReceiveProps(nextProps){
		if(nextProps.auth !== this.props.auth)
		{
			this.setState({
				otp_err_status: nextProps.auth.err_status,
				otp_err_msg: nextProps.auth.err_msg,
			});
			if(nextProps.auth.err_status === false && nextProps.auth.err_msg ==='')
			{
				browserHistory.push('/');
			}
		}
	}
	
	submitOtp = (event) => {
		event.preventDefault();
		var otp = this.state.otp;
		var x = 1;
		if(otp ==='')
		{
			x = 0;
			this.setState({
				otp_err_status: true,
				otp_err_msg: '* please enter your OTP',
			});
		}
		if(otp !== '' && otp.length < 5)
		{
			x = 0;
			this.setState({
				otp_err_status: true,
				otp_err_msg: '* minimum 5 characters',
			});
		}
		if( x===1)
		{
			var user_id = this.props.auth ? this.props.auth.user_id : '';
			var user_type = this.props.auth ? this.props.auth.user_type : '';
			var data = {from:'web',otp:parseInt(this.state.otp,10),user_id:user_id,user_type: user_type};
			console.log('otp submit data--->',data);
			this.props.dispatch(verifyOtpRequest(data));
		}
	}

	resendOTP = () => {
		var data = {from:'web',user_id: this.props.auth.user_id,user_type: this.props.auth.user_type,mobile_number:this.props.auth.mobile_number};
		callApi('resendOtp','post',data).then(response => {
		});
	}
	
	render(){
		return(
			<div>
				<section className="signup_frm">
					<div className="ui text container">
						<div className="signup_frm_blk">
							<h3 className="ui header no-anchor">Verify OTP</h3>
							<form className='ui form' onSubmit={(event) => this.submitOtp(event)}>
								<div className='equal width fields'>
								    <div className='field'>
								      	<label>OTP</label>
								      	<div className='ui input'>
								        	<input type='text' placeholder='OTP' value={this.state.otp} onChange={(event) => this.handleOTPChange(event)} maxLength={5} />
								      	</div>
								      	<FormError 
								      		err_status={this.state.otp_err_status} 
								      		err_msg={this.state.otp_err_msg}
								      	/>
								    </div>
								</div>
								<div className='equal width fields'>
									<div className='field'>
										<Link onClick={() => this.resendOTP()} className={'resend_btn'}>Resend OTP</Link>
									</div>
								</div>

								<div className='field'>
									<button className='ui right button sbmt_btn' type="submit" role='button'>Verify</button>
								</div>
							</form>
						</div>
					</div>
				</section>
			</div>
		);
	}
}

function mapStateToProps(state){
	return {
		auth: state.auth.auth,
		register: state.auth.register,
	}
}

export default connect(mapStateToProps)(OtpForm);