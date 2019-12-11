import React, { Component } from 'react';
import { Segment, Grid, Label, Icon, Divider, Image, Radio, Message, Form, Button, Dropdown } from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import Geosuggest from 'react-geosuggest';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import FormError from '../../components/FormError.js';

import { getNoty } from '../../WebActions.js';

import callApi from '../../../../util/apiCaller';
import Config from '../../../../../server/config';

class EditUser extends Component{
	constructor(props){
		super(props);
		this.state={
			name:'',
			email: '',
			pwd: '',
			conf_pwd:'',
			mobile: '',
			address: '',
			user_type: 3,
			

			user_location: '',
			user_latitude: '',
			user_longitude:'',

			name_err_status:false,
			name_err_msg:'',
			email_err_status:false,
			email_err_msg: '',
			
			
			mobile_err_status:false,
			mobile_err_msg: '',
			address_err_status:false,
			address_err_msg: '',
			
			user_location_err_status: false,
			user_location_err_msg: '',

			user_data:'',
			
			file:'',
			temp_file: '',
			imageUrl: '',
			avatar:'user_image.png',
		}
		
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleMobileChange = this.handleMobileChange.bind(this);
		this.changeUserLocation =  this.changeUserLocation.bind(this);
		this.changeAddress = this.changeAddress.bind(this);
		this.editUserSubmit = this.editUserSubmit.bind(this);

		this.getPhoto = this.getPhoto.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.clearUpload = this.clearUpload.bind(this);
		this.getUserDetails = this.getUserDetails.bind(this);
	}

	componentDidMount = () => {
		if(this.props.auth && this.props.auth.user_id)
		{
			this.getUserDetails();	
		}
		else
		{
			browserHistory.push('/signin');
		}
		
	}
	
	handleNameChange = (event) => {
		var name = event.target.value;
		this.setState({
			name: name,
			name_err_status:false,
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

	changeAddress = (event) => {
		var address = event.target.value;
		this.setState({
			address: address,
			address_err_status: false,
		});
	}

	getUserDetails = () => {
		if(this.props.auth && this.props.auth.user_id)
		{
			if(this.props.auth.user_type === 3)
			{
				var user_id = this.props.auth.user_id; //'5ba0c746bd77e602195d4232'; 
				var data = {from:'web',user_id:user_id,user_type: this.props.auth.user_type};
				callApi('get_user_details','post',data).then(response => {
					if(response.status === 200)
					{
						this.setState({
							user_data: response.data,
							name: response.data.name,
							email: response.data.email,
							mobile: response.data.mobile_number,
							user_location: response.data.location,
							user_latitude: response.data.latitude,
							user_longitude:response.data.longitude,
							address: response.data.address,
							avatar: response.data.avatar,
						});
					}
					else
					{
						console.log(response.message);
					}
				});
			}
		}
	}
	
	clearUpload = () => {
		this.setState({
			temp_file: '',
			file: [],
			avatar: 'user_image.png',
		});
	}

	editUserSubmit = (event) => {
		event.preventDefault();
		var name = this.state.name;
		var email = this.state.email;
		var mobile = this.state.mobile;
		var address = this.state.address;
		var avatar = 'user_image.png';
		var user_location = this.state.user_location;
		var user_type = this.state.user_type;
		var user_latitude = this.state.user_latitude;
		var user_longitude = this.state.user_longitude;
		var user_geo_location = [this.state.user_longitude, this.state.user_latitude];
		
		var x = 1;

		const emailPattern = /(.+)@(.+){2,}\.(.+){2,}/;

		if(name === '')
		{
			x = 0;
			this.setState({
				name_err_status:true,
				name_err_msg:'* please enter your name',
			});
		}
		if(name !=='' && name.length < 3)
		{
			x = 0;
			this.setState({
				name_err_status: true,
				name_err_msg: '* minimum 3 characters!',
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
		
		if(x === 1)
		{
			if(this.state.file !== '' && this.state.file !==undefined)
			{
				var avatar=this.state.file.name
			}
			else
			{
				avatar = 'user_image.png';
			}
			var data= {user_id: this.props.auth.user_id, user_name: name,email: email,mobile: mobile,address: address,user_type:user_type,reg_from:'web',latitude:user_latitude,longitude:user_longitude,geo_location:user_geo_location,location: user_location};
			console.log('submited user details',data);
			callApi('edit_user','post',data).then(response => {
				if(response.status === 200)
				{
					this.uploadFile(response.user_id);
					this.props.dispatch(getNoty('success','profile details updated successfully!'));
				}
				else
				{
					this.props.dispatch(getNoty('error','something went wrong!'));
					console.log('err->',response);
				}
			});
		}
	}

	getPhoto(e)
	{
		e.preventDefault();
		let reader= new FileReader();
		let file= e.target.files[0];
		let temp_file = URL.createObjectURL(e.target.files[0]);
		reader.onloadend= () => {
		  	this.setState({
		    	file: file,
		    	temp_file: temp_file,
		      	imageUrl: reader.result,
		    });
		};
		reader.readAsDataURL(file);
		// setTimeout(() => {this.uploadFile()}, 5000);
	}

	uploadFile(user_id)
 	{
	    if(this.state.file !== '' && this.state.file !== undefined)
	    {
	    	var data={avatar: this.state.imageUrl,name: this.state.file.name,user_id: this.props.auth.user_id,user_type: 3};
		    callApi('upload_user_profile','post',data).then(response => {
		    	console.log('response',response);
		    });	
	    }
	    else
	    {
	    	return null;
	    }
	}


	render(){
		var fixtures = [
			  {label: 'Kakinada, Andhra Pradesh, India', location: {lat: 16.9890648, lng: 82.24746479999999}},
			  {label: 'Bhimavaram, Andhra Pradesh, India', location: {lat: 16.544893, lng: 81.52124100000003}},
			  {label: 'Samalkota, Andhra Pradesh, India', location: {lat: 17.0504374, lng: 82.16592430000003}},
			  {label: 'Amalapuram, Andhra Pradesh, India',location: {lat: 16.5720904, lng: 82.00085480000007}}
		];
		return(
			<section className="ui text container">
				<div className="prf_sctn">
					<div className="prf_bg">&nbsp;</div>
					<div className="prof_cntnt">
						<Grid columns={2} divided>
		                    <Grid.Row>
		                    	<Grid.Column className="four wide column" >
		                    		<form action='' className={'uploadForm'} encType="multipart/form-data">
			                    		<div className="pro_pic">
											<label>
							                	<input type="file" style={{display:'none'}} onChange={(event) => this.getPhoto(event)} />
							                	<Image src={this.state.temp_file ? this.state.temp_file : Config.adminAssets+'uploads/'+this.state.avatar} alt=" " className='create_labor_pic' />
							                </label>
										</div>
									</form>
								</Grid.Column>
								<Grid.Column className="twelve wide column edit_form_blk">
									<form className='ui form' onSubmit={(event) => this.editUserSubmit(event)}>
						  				<div className='equal width fields'>
											<div className='field'>
										      	<label>Name</label>
										      	<div className='ui input'>
										        	<input className={this.state.name_err_status ? 'input_err' : ''} type='text' placeholder='Your Name' value={this.state.name} onChange={(event) => this.handleNameChange(event)} />
										      	</div>
										      	<FormError err_status={this.state.name_err_status} err_msg={this.state.name_err_msg} />
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
												<Geosuggest className={this.state.user_location_err_status ? "loc_geosuggest input_err" : "loc_geosuggest"}  fixtures={fixtures} placeholder="Select Your Location" initialValue={this.state.user_location} onSuggestSelect={this.changeUserLocation} ignoreTab={true} />
												<FormError err_status={this.state.user_location_err_status} err_msg={this.state.user_location_err_msg} />
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
										<div className='field'>
											<button className='ui right button' type="button" role='button' onClick={() => browserHistory.push('/myprofile')}>Cancel</button>
											<button className='ui right button sbmt_btn' type="submit" role='button'>Update</button>
										</div>
										<div className={"clr"}>&nbsp;</div>
									</form>
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</div>
				</div>
			</section>
		);
	}
}



export default connect()(EditUser);