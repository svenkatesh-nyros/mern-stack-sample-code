import React, { Component } from 'react';
import PropTypes from 'prop-types';

import callApi from '../../../util/apiCaller.js';
import FormError from './FormError.js';

export default class ResetPwdForm extends Component{
	constructor(props){
		super(props);
		this.state={
			pwd: '',
			conf_pwd: '',
			pwd_err_status: false,
			pwd_err_msg: '',
			conf_pwd_err_status: false,
			conf_pwd_err_msg: '',
		}
		this.changePwd = this.changePwd.bind(this);
		this.changeConfPwd = this.changeConfPwd.bind(this);
		this.submitResetPwd = this.submitResetPwd.bind(this);
	}

	changePwd = (event) => {
		var pwd = event.target.value;
		this.setState({
			pwd: pwd,
			pwd_err_status: false,
			conf_pwd: '',
			conf_pwd_err_status: false,
			conf_pwd_err_msg: '',
		});
		this.changeConfPwd = this.changeConfPwd.bind(this);
		this.submitResetPwd = this.submitResetPwd.bind(this);
	}

	changeConfPwd = (event) => {
		var conf_pwd = event.target.value;
		this.setState({
			conf_pwd: conf_pwd,
			conf_pwd_err_status: false,
		});
	}

	submitResetPwd = (event) => {
		event.preventDefault();
		var pwd = this.state.pwd;
		var conf_pwd = this.state.conf_pwd;
		var x = 1;
		if(pwd === '')
		{
			x = 0;
			this.setState({
				pwd_err_status: true,
				pwd_err_msg: '* please enter your password!',
			});
		}
		if(pwd !== '' && pwd.length < 6)
		{
			x = 0;
			this.setState({
				pwd_err_status: true,
				pwd_err_msg: '* password is minimum 6 characters!',
			});
		}
		if(conf_pwd === '')
		{
			x = 0;
			this.setState({
				conf_pwd_err_status: true,
				conf_pwd_err_msg : '* please confirm your password!'
			});
		}
		if(conf_pwd !== '' && conf_pwd.length < 6)
		{
			x = 0;
			this.setState({
				conf_pwd_err_status: true,
				conf_pwd_err_msg: '* password is minimum 6 characters!',
			});
		}
		if(conf_pwd !== '' && conf_pwd !== pwd)
		{
			x = 0;
			this.setState({
				conf_pwd_err_status: true,
				conf_pwd_err_msg: '* password mismatch!',
			});
		}
		if(x === 1)
		{
			var data = {from:'web',pwd: pwd, conf_pwd: pwd,};
			callApi('reset_pwd','post',data).then(response => {
			});
		}
	}
	render(){
		return(
			<div>
				<section className={"signup_frm"}>
					<div className={"ui text container"}>
						<div className={"signup_frm_blk"}>
							<h3 className={"ui header no-anchor"}>Reset password</h3>
							<form className={"ui form"} onSubmit={(event) => {this.submitResetPwd(event)}}>
								<div className={"equal width fields"}>
								    <div className={"field"}>
								      	<label>New password</label>
								      	<div className={'ui input'}>
								        	<input type='password' placeholder='New password' value={this.state.pwd} onChange={(event) => {this.changePwd(event)}} />
								      	</div>
								      	<FormError err_status={this.state.pwd_err_status} err_msg={this.state.pwd_err_msg} />
								    </div>
								</div>
								<div className={'equal width fields'}>
								    <div className={'field'}>
								      	<label>Confirm password</label>
								      	<div className={'ui input'}>
								        	<input type='password' placeholder='Confirm password' value={this.state.conf_pwd} onChange={(event) => this.changeConfPwd(event)} />
								      	</div>
								      	<FormError err_status={this.state.conf_pwd_err_status} err_msg={this.state.conf_pwd_err_msg} />
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