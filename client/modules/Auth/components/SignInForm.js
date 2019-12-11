import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { Select, Image } from 'semantic-ui-react';

import  Config from '../../../../server/config.js';

import callApi from '../../../util/apiCaller';
import FormError from './FormError.js';

import { loginRequest } from '../AuthActions.js';


class SignInForm extends Component{
	constructor(props){
		super(props);
		this.state={
			mobile: '',
 			pwd: '',
 			mobile_err_status: false,
 			mobile_err_msg: '',
 			pwd_err_status: false,
 			pwd_err_msg: '',
			auth_res: '',

			user_type: this.props.def_user_type,
			user_type_err_status: false,
			user_type_err_msg: '',
		};
		this.signinSubmit = this.signinSubmit.bind(this);
		this.handleMobChange = this.handleMobChange.bind(this);
		this.handlePwdChange = this.handlePwdChange.bind(this);
		this.handleUserType = this.handleUserType.bind(this);
		this.selectUserType = this.selectUserType.bind(this);
	}
	
	signinSubmit = (event) => {
		event.preventDefault();
		var mobile = this.state.mobile;
		var pwd = this.state.pwd;
		var user_type = this.state.user_type;
		var x = 1;
		if(mobile ==='')
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
				mobile_err_msg: '* minimum 10 characters',
			});
		}
		if(pwd === '')
		{
			x = 0;
			this.setState({
				pwd_err_status: true,
				pwd_err_msg: '* please enter your password',
			});
		}
		if(pwd !== '' && pwd.length < 6)
		{
			x = 0;
			this.setState({
				pwd_err_status: true,
				pwd_err_msg: '* minimum 6 characters length',
			});
		}
		if(user_type === undefined)
		{
			x = 0;
			this.setState({
				user_type_err_status: true,
				user_type_err_msg: '* please select login type User/Labor',
			});
		}
		
		if( x === 1)
		{
			var data = {mobile_number:this.state.mobile,password: this.state.pwd,user_type: this.state.user_type};
			this.props.dispatch(loginRequest(data));
		}
	}

	componentWillReceiveProps =(nextProps) =>{
		if(nextProps.auth !==this.props.auth){
		    this.setState({
		    	auth_res: nextProps.auth,
		    });
		    if(nextProps.auth.page==='verify_otp')
		    {
		    	// browserHistory.push('/verify_otp');
		    }
		    else if(nextProps.auth.page==='dashboard')
		    {
		    	// browserHistory.push('/');
		    }
		    else
		    {
		    	console.log('else '+nextProps.auth.page);
		    }
		}
	}

	handleMobChange = (event) => {
		var mobile = event.target.value;
		
		this.setState({
			mobile: event.target.value.replace(/[^0-9]/g, ''),
			mobile_err_status: false,
		});
	}

	handlePwdChange = (event) => {
		var pwd = event.target.value;
		this.setState({
			pwd: pwd,
			pwd_err_status: false,
		});
	}
	
	handleUserType = (event: React.SyntheticEvent<HTMLDivElement>, data:any) => {
		this.setState({
			user_type: data.value,
			user_type_err_status:false,
		});
	}

	selectUserType = (type) => {
		this.setState({
			user_type: type,
		});
	}
	
	render(){
		const login_options = [
				{ key: '1', value: 2, text: 'Labor'},
				{ key: '2', value: 3, text: 'User'}
			];
		return(
			<div>
				<section className="signup_frm">
					<div className="ui text container">
						<div className="signup_frm_blk">
							<form className='ui form' onSubmit={(event) => this.signinSubmit(event)}>
								<Image.Group spaced className={'signin_img_container'}>
							      	<Image title={'Sign in as User'} circular spaced src={Config.baseAssets+'/images/signin_user.png'} className={this.state.user_type === 3 ? 'sn_active' : 'sn_inactive'} onClick={() => this.selectUserType(3)} />
							      	<Image title={'Sign in as Laborer'} circular spaced src={Config.baseAssets+'/images/signin_labor.png'} className={this.state.user_type === 2 ? 'sn_active' : 'sn_inactive'} onClick={() => this.selectUserType(2)} />
							    </Image.Group>
								{this.state.user_type === 2 || this.state.user_type === 3 ?
								<div>
									<div className='equal width fields'>
									    <div className='field'>
									      	<label>Mobile Number</label>
									      	<div className='ui input'>
									        	<input type='text' className={this.state.mobile_err_status ? 'input_err':''} placeholder='Mobile Number' value={this.state.mobile} maxLength={10} onChange={(event) => this.handleMobChange(event)}  />
									      	</div>
									      	<FormError err_status={this.state.mobile_err_status} err_msg={this.state.mobile_err_msg} />
									    </div>
									</div>
									<div className='equal width fields'>
										<div className='field'>
									      	<label>Password</label>
									      	<div className='ui input'>
									        	<input className={this.state.pwd_err_status ? 'input_err':''} type='password' placeholder='Password' value={this.state.pwd} onChange={(event) => this.handlePwdChange(event) } />
									      	</div>
									      	<FormError err_status={this.state.pwd_err_status} err_msg={this.state.pwd_err_msg} />
									    </div>
									</div>
									<div className='equal width fields'>
										<div className='field'>
											<Link to={"/forget_password"}>Forget password ?</Link>
										</div>
									</div>
									<div className='field'>
										<button className='ui right button sbmt_btn' type="submit" role='button'>Sign In</button>
									</div>
								</div> : ''}
							</form>
							<div className="clr">&nbsp;</div>
							<div className="singup_desc"><p>Don't have an account! click here to <a href="/signup">Sign Up</a></p></div>
						</div>
					</div>
				</section>
			</div>
		);
	}
}

function mapStateToProps(state) {
  return {
    auth: state.auth.auth,
    def_user_type: state.auth.def_user_type
  };
}


export default connect(mapStateToProps)(SignInForm);