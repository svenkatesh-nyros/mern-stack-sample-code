import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Select, Dropdown, Radio } from 'semantic-ui-react';
import Geosuggest from 'react-geosuggest';
import callApi from '../../../util/apiCaller.js';

import FormError from './FormError.js';

import { registerRequest } from '../AuthActions.js';

class SignUpForm extends Component{
	constructor(props){
		super(props);
		this.state={
			first_name:'',
			email: '',
			pwd: '',
			conf_pwd:'',
			mobile: '',
			location:'',
			address: '',
			user_type: 3,
			user_type_status: 3,//to show the block of labor form 
			all_services: [],
			selected_services: [],
			service_location: '',
			about_me: '',
			certification: '',
			years: [{key:0,text:'0 Years', value:'0 Years'},{key:1,text:'1 Year',value:'1 Year'},{key:2,text:'2 Years',value:'2 Years'},{key:3,text:'3 Years',value:'3 Years'},{key:4,text:'4 Years',value:'4 Years'},{key:5,text:'5+ Years',value:'5+ Years'}],
      		months: [{key:0,text:'0 Months',value:'0 Months'},{key:1,text:'1 Month',value:'1 Month'},{key:2,text:'2 Months',value:'2 Months'},{key:3,text:'3 Months',value:'3 Months'},{key:4,text:'4 Months',value:'4 Months'},{key:5,text:'5 Months',value:'5 Months'},{key:6,text:'6 Months',value:'6 Months'},{key:7,text:'7 Months',value:'7 Months'},{key:8,text:'8 Months',value:'8 Months'},{key:9,text:'9 Months',value:'9 Months'},{key:10,text:'10 Months',value:'10 Months'},{key:11,text:'11 Months',value:'11 Months'}],
			selected_years: -1,
			selected_months: -1,
			availability: '1',
			all_skills: [],
			selected_skills: [],
			labor_service_location: '',
			labor_latitude: '',
			labor_longitude:'',
			user_location: '',
			user_latitude: '',
			user_longitude:'',

			// Form Validations starts here
			first_name_err_status:false,
			first_name_err_msg:'',
			email_err_status:false,
			email_err_msg: '',
			pwd_err_status:false,
			pwd_err_msg: '',
			conf_pwd_err_status:false,
			conf_pwd_err_msg:'',
			mobile_err_status:false,
			mobile_err_msg: '',
			location_err_status:false,
			location_err_msg:'',
			address_err_status:false,
			address_err_msg: '',
			user_type_err_status: false,
			user_type_err_msg: 2,
			all_services_err_status: [],
			all_services_err_msg: [],
			selected_services_err_status: [],
			selected_services_err_msg: [],
			service_location_err_status:false,
			service_location_err_msg: '',
			about_me_err_status:false,
			about_me_err_msg: '',
			certification_err_status:false,
			certification_err_msg: '',
			selected_years_err_status:false,
			selected_years_err_msg: '',
			selected_months_err_status: false,
			selected_months_err_msg: '',
			selected_skills_err_status: false,
			selected_skills_err_msg: '',
			labor_service_location_err_status: false,
			labor_service_location_err_msg: '',
			user_location_err_status: false,
			user_location_err_msg: '',
			// Validations ends here
		}
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleMobileChange = this.handleMobileChange.bind(this);
		this.handleUserType = this.handleUserType.bind(this);
		this.changeServices = this.changeServices.bind(this);
		this.getCustomServices = this.getCustomServices.bind(this);
		this.changeAvailability = this.changeAvailability.bind(this);
		this.getCustomSkills = this.getCustomSkills.bind(this);
		this.yearsChange = this.yearsChange.bind(this);
		this.monthsChange = this.monthsChange.bind(this);
		this.changeServiceLocation = this.changeServiceLocation.bind(this);
		this.changeUserLocation = this.changeUserLocation.bind(this);
		this.changePwd = this.changePwd.bind(this);
		this.changeConfPwd = this.changeConfPwd.bind(this);
		this.submitSignUp = this.submitSignUp.bind(this);
		this.changeSkills = this.changeSkills.bind(this);
		this.changeAboutMe = this.changeAboutMe.bind(this);
		this.changeCertification = this.changeCertification.bind(this);
		this.changeAddress = this.changeAddress.bind(this);
	}

	componentDidMount = () => {
		this.getCustomServices();
		this.getCustomSkills();
	}

	handleNameChange = (event) => {
		var name = event.target.value;
		this.setState({
			first_name: name,
			first_name_err_status:false,
		});
	}

	handleEmailChange = (event) => {
		var email = event.target.value;
		this.setState({
			email: email,
			email_err_status:false,
		});
	}

	handleMobileChange = (event) => {
		var mobile = event.target.value;
		this.setState({
			mobile: mobile,
			mobile_err_status: false,
		});
	}

	changeAboutMe = (event) => {
		var about_me= event.target.value;
		this.setState({
			about_me: about_me,
		});
	}

	changeCertification = (event) => {
		var cert = event.target.value;
		this.setState({
			certification: cert,
		});
	}

	handleUserType = (event: React.SyntheticEvent<HTMLDivElement>, data:any) => {
		this.setState({
			user_type: data.value,
			user_type_err_status:false,
			user_type_status: data.value,
		});
	}
	
	changeServices = (event: React.SyntheticEvent<HTMLDivElement>, data: any) => {
		this.setState({
			selected_services:data.value,
			selected_services_err_status:false,
		});
	}

	changeSkills = (event: React.SyntheticEvent<HTMLDivElement>, data: any) => {
		this.setState({
			selected_skills: data.value,
			selected_skills_err_status:false,
		});
	}

	getCustomServices = () => {
		var data={};
		callApi('get_custom_services','post',data).then(response => {
			if(response.status===200)
			{
				this.setState({
					all_services:response.data,
				});
			}
			else
			{
				console.log('err',response);
			}
		});
	}
	
	getCustomSkills = () => {
		var data={};
		callApi('get_custom_skills','post',data).then(response => {
			if(response.status===200)
			{
				this.setState({
					all_skills: response.data,
				});
			}
			else
			{
				console.log('err',response);
			}
		});
	}

	changeAvailability = (e, { value }) => {
		this.setState({
			availability: value,
		})
	}

	yearsChange = (event: React.SyntheticEvent<HTMLDivElement>, data:any) => {
		this.setState({
			selected_years: data.value,
			selected_years_err_status:false,
		});
	}

	monthsChange = (event: React.SyntheticEvent<HTMLDivElement>, data:any) => {
		this.setState({
			selected_months: data.value,
			selected_months_err_status:false,
		});
	}
	
	changeServiceLocation = (e) => {
		if(e !== undefined)
		{
			this.setState({
				labor_service_location: e.label,
				labor_latitude: e.location.lat,
				labor_longitude: e.location.lng,
				labor_service_location_err_status:false,
			});
		}
	}

	changeUserLocation =(e) => {
		if(e !== undefined)
		{
			this.setState({
				user_location: e.label,
				user_latitude: e.location.lat,
				user_longitude: e.location.lng,
				user_location_err_status:false,
			});
		}
	}

	changePwd = (event) => {
		var pwd = event.target.value;
		this.setState({
			pwd: pwd,
			pwd_err_status:false,
			conf_pwd:'',
			conf_pwd_err_status:false,
		});
	}

	changeConfPwd = (event) => {
		var pwd = event.target.value;
		this.setState({
			conf_pwd: event.target.value,
			conf_pwd_err_status: false,
		});
	}

	changeAddress = (event) => {
		var address = event.target.value;
		this.setState({
			address: address,
			address_err_status: false,
		});
	}

	submitSignUp = (event) => {
		event.preventDefault();
		var first_name = this.state.first_name;
		var email = this.state.email;
		var mobile = this.state.mobile;
		var pwd = this.state.pwd;
		var conf_pwd = this.state.conf_pwd;
		var address = this.state.address;
		var labor_service_location = this.state.labor_service_location;
		var about_me = this.state.about_me;
		var certification = this.state.certification;
		var years = this.state.selected_years;
		var months = this.state.selected_months;
		var selected_services = this.state.selected_services;
		var selected_skills = this.state.selected_skills;
		var availability = this.state.availability === '1' ? true : false;
		var avatar = 'user_image.png';
		var user_type = this.state.user_type;
		var user_latitude = this.state.user_latitude;
		var user_longitude = this.state.user_longitude;
		var labor_latitude = this.state.labor_latitude;
		var labor_longitude = this.state.labor_longitude;
		var labor_geo_location = [this.state.labor_longitude, this.state.labor_latitude];
		var user_geo_location = [this.state.user_longitude, this.state.user_latitude];
		
		var user_type_status = this.state.user_type_status;
		var x = 1;

		const emailPattern = /(.+)@(.+){2,}\.(.+){2,}/;

		if(first_name ==='')
		{
			x = 0;
			this.setState({
				first_name_err_status:true,
				first_name_err_msg:'* please enter your name',
			});
		}
		if(first_name !=='' && first_name.length < 3)
		{
			x = 0;
			this.setState({
				first_name_err_status: true,
				first_name_err_msg: '* minimum 3 characters!',
			})
		}
		if(email === '')
		{
			x = 0;
			this.setState({
				email_err_status: true,
				email_err_msg: "* email can't be empty",
			});
		}
		if(email !== '' && !emailPattern.test(email))
		{
			x = 0;
			this.setState({
				email_err_status: true,
				email_err_msg: '* plase enter valid email',
			});
		}

		if(mobile ==='')
		{
			x = 0;
			this.setState({
				mobile_err_status: true,
				mobile_err_msg: "* mobile can't be empty",
			});
		}
		
		if(mobile !=='' && mobile.length < 10)
		{
			x = 0;
			this.setState({
				mobile_err_status: true,
				mobile_err_msg: '* enter valid mobile number',
			});
		}

		if(pwd === '')
		{
			x = 0;
			this.setState({
				pwd_err_status:true,
				pwd_err_msg:"* password can't be empty",
			});
		}
		if(pwd !== '' && pwd.length < 6)
		{
			x = 0;
			this.setState({
				pwd_err_status: true,
				pwd_err_msg: '* password should contain 6 characters',
			});
		}
		if(conf_pwd === '')
		{
			x = 0;
			this.setState({
				conf_pwd_err_status:true,
				conf_pwd_err_msg: "* confirm password can't be empty!"
			});
		}
		if(conf_pwd !== '' && conf_pwd.length < 6)
		{
			x=0;
			this.setState({
				conf_pwd_err_status:true,
				conf_pwd_err_msg: '* password shold contain min 6 characters!',
			});
		}
		if(pwd !=='' && conf_pwd !== '' && pwd !== conf_pwd)
		{
			x = 0;
			this.setState({
				conf_pwd_err_status: true,
				conf_pwd_err_msg:'* password mismatch',
			});
		}

		if(user_type_status === 2)
		{
			if(labor_service_location === '')
			{
				x = 0;
				this.setState({
					labor_service_location_err_status: true,
					labor_service_location_err_msg: '* please select service location',
				});
			}
			if(selected_skills.length <= 0)
			{
				x = 0;
				this.setState({
					selected_skills_err_status:true,
					selected_skills_err_msg:'* select atleast 1 skill',
				});
			}
			if(selected_services.length <= 0)
			{
				x = 0;
				this.setState({
					selected_services_err_status:true,
					selected_services_err_msg:'* select atleast 1 service',
				});
			}
			if(years === -1)
			{
				x=0;
				this.setState({
					selected_years_err_status: true,
					selected_years_err_msg: '* please select years',
				});
			}
			if(months === -1)
			{
				x = 0;
				this.setState({
					selected_months_err_status: true,
					selected_months_err_msg: '* please select months'
				});
			}
		}
			

		if(x===1)
		{
			if(user_type_status === 2)
			{

				var data= {
					name: first_name,
					email: email,
					mobile_number:parseInt(mobile,10),
					password: pwd,
					address: address,
					user_type:user_type,
					reg_from:'web',
					service_location:labor_service_location,
					about_labor:about_me,
					certification:certification,
					years:years,
					months:months,
					selected_services:selected_services,
					selected_skills:selected_skills,
					availability:availability,
					avatar:avatar,
					latitude:labor_latitude,
					longitude:labor_longitude,
					geo_location:labor_geo_location
				};	
				var end_url ='create_labor';
			}
			else
			{
				data= {
					user_name: first_name,
					email: email,
					mobile:mobile,
					password: pwd,
					address: address,
					user_type:user_type,
					reg_from:'web',
					latitude:user_latitude,
					longitude:user_longitude,
					geo_location:user_geo_location
				};
				end_url = 'create_user';
			}
			
			this.props.dispatch(registerRequest(data,end_url))

		}
	}

	render(){
		const reg_options = [{ key: '1', value: 2, text: 'Laborer'},{ key: '2', value: 3, text: 'User'}];
		return(
			<div>
				{/* signup start */}
				<section className="signup_frm">
					<div className="ui text container">
						<div className="signup_frm_blk">
							{/*<h3 className="ui header no-anchor">Sign Up</h3>*/}
							<form className='ui form' onSubmit={(event) => this.submitSignUp(event)}>
				  				<div className='equal width fields'>
									<div className='field'>
								      	<label>Name</label>
								      	<div className='ui input'>
								        	<input className={this.state.first_name_err_status ? 'input_err' : ''} type='text' placeholder='Your Name' value={this.state.first_name} onChange={(event) => this.handleNameChange(event)} />
								      	</div>
								      	<FormError err_status={this.state.first_name_err_status} err_msg={this.state.first_name_err_msg} />
								    </div>
									<div className='field'>
								      	<label>Email</label>
								      	<div className='ui input'>
								        	<input className={this.state.email_err_status ? 'input_err' : ''} type='text' placeholder='Email' value={this.state.email} onChange={(event) => this.handleEmailChange(event)}/>
								      	</div>
								      	<FormError err_status={this.state.email_err_status} err_msg={this.state.email_err_msg} />
								    </div>
								</div>
								
								<div className='equal width fields'>
									<div className='field'>
								    	<label>Mobile</label>
										<div className='ui labeled input'>
											<div className='ui basic label label'><i className='in flag'></i>+91</div>
											<input className={this.state.mobile_err_status ? 'input_err' : ''} type='text' maxLength={10} placeholder='Mobile Number' value={this.state.mobile} onChange={(event) => this.handleMobileChange(event)} />
										</div>
										<FormError err_status={this.state.mobile_err_status} err_msg={this.state.mobile_err_msg} />
								    </div>
									<div className='field'>
								    	<label>Location</label>
										<Geosuggest className={this.state.user_location_err_status ? "loc_geosuggest input_err" : "loc_geosuggest"} placeholder="Select Your Location" initialValue="" onSuggestSelect={this.changeUserLocation} ignoreTab={true} />
										<FormError err_status={this.state.user_location_err_status} err_msg={this.state.user_location_err_msg} />
									</div>
								</div>
								
								<div className='equal width fields'>
									<div className='field'>
								    	<label>Password</label>
									    <div className='ui input'>
									        <input className={this.state.pwd_err_status ? 'input_err' : ''} type='password' placeholder='Password' value={this.state.pwd} onChange={(event) => this.changePwd(event)} />
									    </div>
									    <FormError err_status={this.state.pwd_err_status} err_msg={this.state.pwd_err_msg} />
								    </div>
									<div className='field'>
								    	<label>Confirm Password</label>
										<div className='ui icon input'>
											<input className={this.state.conf_pwd_err_status ? 'input_err' :''} type='password' placeholder='Confirm Password' value={this.state.conf_pwd} onChange={(event) => this.changeConfPwd(event)} />
										</div>
										<FormError err_status={this.state.conf_pwd_err_status} err_msg={this.state.conf_pwd_err_msg} />
								    </div>
								</div>
								
								<div className='equal width fields'>
									<div className='field'>
								    	<label>Address</label>
										<div className='ui icon input'>
											<textarea className={this.state.address_err_status ? 'input_err' : ''} placeholder='Address' rows={3} value={this.state.address} onChange={(event) => this.changeAddress(event)} ></textarea>
										</div>
										<FormError err_status={this.state.address_err_status} err_msg={this.state.address_err_msg} />
								    </div>
								</div>
								
								<div className='equal width fields'>
									<div className='field'>
										<label>Register as</label>
										<Select className={this.state.user_type_err_status ? 'input_err' : ''} placeholder='Please select user type' options={reg_options} value={this.state.user_type} onChange={this.handleUserType} />
										<FormError err_status={this.state.user_type_err_status} err_msg={this.state.user_type_err_msg} />
									</div>
								</div>
								{this.state.user_type_status === 2 ? 
									<div className="labor_frm_container">
										<div className='equal width fields'>
											<div className='field'>
												<label>Select Services</label>
												<Dropdown className={this.state.selected_services_err_status ? 'input_err' : ''} placeholder='Select Services' fluid multiple search selection options={this.state.all_services} onChange={this.changeServices} />
												<FormError err_status={this.state.selected_services_err_status} err_msg={this.state.selected_services_err_msg} />
											</div>
										</div>

										<div className='equal width fields'>
											<div className='field'>
										    	<label>Service Location</label>
												<Geosuggest className={this.state.labor_service_location_err_status ? 'input_err' : ''} fixtures={fixtures} placeholder="Select Service Location" initialValue="" onSuggestSelect={this.changeServiceLocation} ignoreTab={true} />
												<FormError err_status={this.state.labor_service_location_err_status} err_msg={this.state.labor_service_location_err_msg} />
											</div>

										    <div className='field'>
										      	<label>About Me</label>
										      	<div className='ui input'>
										        	<input className={this.state.about_me_err_status ? 'input_err' : ''} type='text' placeholder='About Me' value={this.state.about_me} onChange={(event) => this.changeAboutMe(event)} />
										      	</div>
										      	<FormError err_status={this.state.about_me_err_status} err_msg={this.state.about_me_err_msg} />
										    </div>

										    <div className='field'>
										      	<label>Certifications</label>
										      	<div className='ui input'>
										        	<input className={this.state.certification_err_status ? 'input_err' : ''} type='text' placeholder='Certifications' value={this.state.certification} onChange={(event) => this.changeCertification(event)} />
										      	</div>
										      	<FormError err_status={this.state.certification_err_status} err_msg={this.state.certification_err_msg} />
										    </div>
										</div>

										<div className='equal width fields'>
											<div className='field'>
												<label>Work Experience</label>
												<Dropdown className={this.state.selected_years_err_status ? 'exp_dropdown input_err' : 'exp_dropdown'} placeholder='Years' openOnFocus selection options={this.state.years} onChange={this.yearsChange} />
												<FormError err_status={this.state.selected_years_err_status} err_msg={this.state.selected_years_err_msg} />
											</div>
											<div className='field'>
												<label>&nbsp;</label>
												<Dropdown className={this.state.selected_months_err_status ? 'exp_dropdown input_err' : 'exp_dropdown'} placeholder='Months' openOnFocus selection options={this.state.months} onChange={this.monthsChange} />
												<FormError err_status={this.state.selected_months_err_status} err_msg={this.state.selected_months_err_msg} />
										    </div>
											<div className='field'>
												<label>Availability</label>
												<div className='ui radio checkbox avlbty_inpt'>
													<Radio
											            label='Yes'
											            name='availability'
											            value='1'
											            checked={this.state.availability === '1'}
											            onChange={this.changeAvailability}
											        />
											    </div>
											</div>
											<div className='field'>
												<label>&nbsp;</label>
												<div className='ui radio checkbox avlbty_inpt'>
													<Radio
											            label='No'
											            name='availability'
											            value='0'
											            checked={this.state.availability === '0'}
											            onChange={this.changeAvailability}
											        />
										        </div>
											</div>
										</div> 

										<div className='equal width fields'>
											<div className='field'>
												<label>Select Skills</label>
												<Dropdown className={this.state.selected_skills_err_status ? 'input_err' : ''} upward={true} placeholder='Select Skills' fluid multiple search selection options={this.state.all_skills} onChange={this.changeSkills} />
												<FormError err_status={this.state.selected_skills_err_status} err_msg={this.state.selected_skills_err_msg} />
											</div>
										</div>
									</div> : ''}

								<div className="clr">&nbsp;</div>
								<div className='field'>
									<button className='ui right button sbmt_btn' role='button'>Submit</button>
								</div>
							</form>
							<div className="clr">&nbsp;</div>
							<div className="signin_desc"><p>Already have an account! click here to <a href="/signin">Sign In</a></p></div>
						</div>
					</div>
				</section>
			</div>
		);
	}
}

function mapStateToProps(state){
	return {

	}
}
export default connect(mapStateToProps)(SignUpForm);