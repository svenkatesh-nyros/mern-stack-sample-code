import React, { Component } from 'react';

import { Segment, Grid, Label, Icon, Divider, Image, Radio, Message, Form, Button, Dropdown } from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import Geosuggest from 'react-geosuggest';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import { getNoty } from '../../NotyActions.js';

import FormError from '../../components/FormError.js';
import callApi from '../../../../util/apiCaller';
import Config from '../../../../../server/config';


class EditLabor extends Component{
	constructor(props){
		super(props);
		this.state={
			labor_name:'',
			labor_email:'',
			labor_address: '',
			labor_mobile: '',
			labor_service_location:'',
			about_labor: '',
			labor_certification: '',
			exp_years: 0,
      		exp_months: 0,
      		exp_years_name:'0 Years',
      		exp_months_name: '0 Months',
      		availability_status: true,
      		
  			years: [{key:0,text:'0 Years',value:'0 Years'},{key:1,text:'1 Year',value:'1 Year'},{key:2,text:'2 Years',value:'2 Years'},{key:3,text:'3 Years',value:'3 Years'},{key:4,text:'4 Years',value:'4 Years'},{key:5,text:'5+ Years',value:'5+ Years'}],
      		months: [{key:0,text:'0 Months',value:'0 Months'},{key:1,text:'1 Month',value:'1 Month'},{key:2,text:'2 Months',value:'2 Months'},{key:3,text:'3 Months',value:'3 Months'},{key:4,text:'4 Months',value:'4 Months'},{key:5,text:'5 Months',value:'5 Months'},{key:6,text:'6 Months',value:'6 Months'},{key:7,text:'7 Months',value:'7 Months'},{key:8,text:'8 Months',value:'8 Months'},{key:9,text:'9 Months',value:'9 Months'},{key:10,text:'10 Months',value:'10 Months'},{key:11,text:'11 Months',value:'11 Months'}],

			labor_name_err_status:false,
			labor_email_err_status:false,
			labor_address_err_status:false,
			labor_mobile_err_status:false,
			labor_service_location_err_status: false,
			about_labor_err_status: false,
			labor_certification_err_status: false,

			labor_name_err_msg:'',
			labor_email_err_msg:'',
			labor_address_err_msg:'',
			labor_mobile_err_msg:'',
			labor_service_location_err_msg: '',
			about_labor_err_msg: '',
			labor_certification_err_msg: '',

			all_services:[],
			all_skills:[],
			selected_services: [],
			selected_skills: [],
			
			selected_years: '',
			selected_months: '',
			latitude:'',
			longitude:'',

			file:'',
			temp_file: '',
			imageUrl: '',
			avatar:'user_image.png',
		}
		this.editLaborSubmit = this.editLaborSubmit.bind(this);
		this.changeLaborName = this.changeLaborName.bind(this);
		this.changeLaborEmail = this.changeLaborEmail.bind(this);
		this.changeLaborMobile = this.changeLaborMobile.bind(this);
		this.changeLaborAddress = this.changeLaborAddress.bind(this);
		this.getCustomServices = this.getCustomServices.bind(this);
		this.getCustomSkills = this.getCustomSkills.bind(this);
		this.changeLaborServiceLocation = this.changeLaborServiceLocation.bind(this);
		this.changeAboutLabor = this.changeAboutLabor.bind(this);
		this.changeLaborCertification = this.changeLaborCertification.bind(this);
		this.changeAvailability = this.changeAvailability.bind(this);
		this.changeServices = this.changeServices.bind(this);
		this.changeSkills = this.changeSkills.bind(this);
		this.yearsChange = this.yearsChange.bind(this);
		this.monthsChange = this.monthsChange.bind(this);
		this.onSuggestSelect = this.onSuggestSelect.bind(this);
		this.getPhoto = this.getPhoto.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.clearUpload = this.clearUpload.bind(this);
		this.getLaborDetails = this.getLaborDetails.bind(this);
	}
	componentDidMount = () => {
		if(this.props.auth && this.props.auth.user_id !== null)
		{
			this.getCustomServices();
			this.getCustomSkills();
			this.getLaborDetails();	
		}
		else
		{
			browserHistory.push('/signin');
		}
	}
	
	getLaborDetails = () => {
		if(this.props.auth && this.props.auth.user_id)
		{
			if(this.props.auth.user_type === 2)
			{
				var user_id = this.props.auth.user_id; //'5ba0c746bd77e602195d4232'; 
				var data = {from:'web',labor_id:user_id,user_type: this.props.auth.user_type};
				callApi('get_labor_details','post',data).then(response => {
					if(response.status === 200)
					{
						this.setState({
							labor_name:response.data[0].name,
							labor_email:response.data[0].email,
							labor_mobile:response.data[0].mobile_number,
							labor_address:response.data[0].address,
							labor_service_location:response.data[0].service_location,
							latitude: response.data[0].latitude,
							longitude: response.data[0].longitude,
							about_labor:response.data[0].description,
							labor_certification:response.data[0].certification,
							availability_status:response.data[0].availability,
							selected_years: response.data[0].years,
							selected_months: response.data[0].months,
							selected_skills : response.data[0].skills,
							avatar: response.data[0].avatar,
							selected_services: response.data[0].services
						});
					}
					else
					{
						alert(response.message);
					}
				});
			}
		}
	}
	
	yearsChange = (event: React.SyntheticEvent<HTMLDivElement>, data:any) => {
		this.setState({
			selected_years: data.value,
		});
	}
	
	onSuggestSelect = (e) => {
		if(e !== undefined)
		{
			this.setState({
				labor_service_location: e.label,
				latitude: e.location.lat,
				longitude: e.location.lng,
			})	
		}
	}
	
	monthsChange = (event: React.SyntheticEvent<HTMLDivElement>, data:any) => {
		this.setState({
			selected_months: data.value,
		});
	}
	
	changeServices = (event: React.SyntheticEvent<HTMLDivElement>, data: any) => {
		// event.preventDefault();
		this.setState({
			selected_services:data.value,
		});
	}
	
	changeSkills = (event: React.SyntheticEvent<HTMLDivElement>, data: any) => {
		this.setState({
			selected_skills: data.value,
		});
	}
	
	changeLaborCertification = (event) => {
		event.preventDefault();
		this.setState({
			labor_certification: event.target.value,
		});
	}
	
	changeAvailability = (event) => {
		event.preventDefault();
		this.setState({
			availability_status: !this.state.availability_status,
		});
	}
	
	changeAboutLabor = (event) => {
		event.preventDefault();
		this.setState({
			about_labor: event.target.value,
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
				alert(response.messsage);
			}
		});
	}
	
	editLaborSubmit = (event) => {
		event.preventDefault();
		var labor_name = this.state.labor_name;
		var labor_email = this.state.labor_email;
		var labor_mobile = this.state.labor_mobile;
		var labor_address = this.state.labor_address;
		var labor_service_location = this.state.labor_service_location;
		var about_labor = this.state.about_labor;
		var labor_certification = this.state.labor_certification;
		var years = this.state.selected_years;
		var months = this.state.selected_months;
		var selected_services = this.state.selected_services;
		var selected_skills = this.state.selected_skills;
		var availability_status = this.state.availability_status;
		var user_type = 2;
		var latitude = this.state.latitude;
		var longitude = this.state.longitude;
		var geo_location = [this.state.longitude, this.state.latitude];
		var x = 1;

		const emailPattern = /(.+)@(.+){2,}\.(.+){2,}/;

		if(labor_name ==='')
		{
			x = 0;
			this.setState({
				labor_name_err_status:true,
				labor_name_err_msg:'* please enter user name',
			});
		}

		if(labor_name !=='' && labor_name.length < 3)
		{
			x = 0;
			this.setState({
				labor_name_err_status: true,
				labor_name_err_msg: '* minimum 3 characters!',
			})
		}

		if(labor_email=== '')
		{
			x = 0;
			this.setState({
				labor_email_err_status: true,
				labor_email_err_msg: "* email can't be empty",
			});
		}
		
		if(labor_email !== '' && !emailPattern.test(labor_email))
		{
			x = 0;
			this.setState({
				labor_email_err_status: true,
				labor_email_err_msg: '* plase enter valid email',
			});
		}

		if(labor_mobile ==='')
		{
			x = 0;
			this.setState({
				labor_mobile_err_status: true,
				labor_mobile_err_msg: "* mobile can't be empty",
			});
		}
		
		if(labor_mobile !=='' && labor_mobile.length < 10)
		{
			x = 0;
			this.setState({
				labor_mobile_err_status: true,
				labor_mobile_err_msg: '* enter valid mobile number',
			});
		}

		if(labor_service_location === '')
		{
			x = 0;
			this.setState({
				labor_service_location_err_status: true,
				labor_service_location_err_msg: '* please select serice location',
			});
		}

		if(x===1)
		{
			if(this.state.file !== '' && this.state.file !==undefined)
			{
				var avatar=this.state.file.name
			}
			else
			{
				avatar = 'user_image.png';
			}
			var labor_id = this.props.auth.user_id;
			var data= { labor_id: labor_id,labor_name: labor_name,labor_email: labor_email,mobile:labor_mobile,labor_address: labor_address,user_type:user_type,'service_location':labor_service_location,'about_labor':about_labor,'certification':labor_certification,'years':years,'months':months,'selected_services':selected_services,'selected_skills':selected_skills,'availability':availability_status,latitude:latitude,longitude:longitude,geo_location:geo_location,avatar:avatar};
			console.log('edit labor data->',data);
			callApi('edit_labor','post',data).then(response => {
				if(response.status === 200)
				{
					console.log('edit labor response--->',response);
					this.uploadFile(response.data._id);
					this.props.dispatch(getNoty('success','Profile details updated successfully!'));
				}
				else
				{
					this.props.dispatch(getNoty('error','something went wrong!'));
					console.log('else block in edit_labor',response);
				}
			});
		}
	}
	
	changeLaborName = (event) => {
		event.preventDefault();
		this.setState({
			labor_name: event.target.value,
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
				console.log(response.messsage);
			}
		})
	}
	
	changeLaborServiceLocation = (event) => {
		event.preventDefault();
		this.setState({
			labor_service_location:event.target.value,
		});
	}
	
	changeLaborEmail = (event) => {
		event.preventDefault();
		this.setState({
			labor_email: event.target.value,
		});
	}
	
	changeLaborMobile = (event) => {
		event.preventDefault();
		this.setState({
			labor_mobile: event.target.value.replace(/[^0-9]/g, ''),
		});
	}
	
	changeLaborAddress = (event) => {
		event.preventDefault();
		this.setState({
			labor_address: event.target.value,
		});
	}

	clearUpload = () => {
		this.setState({
			temp_file: '',
			file: [],
			avatar: 'user_image.png',
		});
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

	uploadFile(labor_id)
 	{
	    if(this.state.file !== '' && this.state.file !== undefined)
	    {
	    	var data={avatar: this.state.imageUrl,name: this.state.file.name,labor_id: labor_id};
		    callApi('upload_profile','post',data).then(response => {
		    	console.log('response',response);
		    });	
	    }
	    else
	    {
	    	return null;
	    }
	}

	render(){
		return(
			<section className="ui text container">
				<div className="prf_sctn">
					<div className="prf_bg">&nbsp;</div>
					<div className="prof_cntnt">
						<div className='ui grid'>
							<div>
								<Grid columns={2} divided>
				                    <Grid.Row>
				                    	<Grid.Column className={"four wide column"}>
				                    		<form action='' className={'uploadForm'} encType="multipart/form-data">
					                    		<div className={"pro_pic"}>
													<label>
									                	<input type="file" style={{display:'none'}} onChange={(event) => this.getPhoto(event)} />
									                	<Image src={this.state.temp_file ? this.state.temp_file : Config.adminAssets+'uploads/'+this.state.avatar} alt=" " className='create_labor_pic' />
									                </label>
												</div>
											</form>
										</Grid.Column>
				                    	<Grid.Column className={"twelve wide column edit_form_blk"}>
						                    <Form error onSubmit={(event) => this.editLaborSubmit(event)}>
										      	<Grid columns={2}>
										      		<Grid.Row>
										      			<Grid.Column>
										      				<Form.Input className={this.state.labor_name_err_status ? 'input_err' : ''} label='Name' placeholder='Name' value={this.state.labor_name ? this.state.labor_name : ''} onChange={(event) => this.changeLaborName(event)} />
															<FormError err_status={this.state.labor_name_err_status} err_msg={this.state.labor_name_err_msg} />
														</Grid.Column>
										      		
										      			<Grid.Column>
										      				<Form.Input className={this.state.labor_email_err_status ? 'input_err' : ''} label='Email' placeholder='Email' value={this.state.labor_email ? this.state.labor_email : ''} onChange={(event) => this.changeLaborEmail(event)} />
													      	<FormError err_status={this.state.labor_email_err_status} err_msg={this.state.labor_email_err_msg} />
													    </Grid.Column>
										      		
										      			<Grid.Column>
										      				<Form.Input className={this.state.labor_mobile_err_status ? 'input_err' : ''} label='Mobile Number' value={this.state.labor_mobile ? this.state.labor_mobile : ''} onChange={(event) => this.changeLaborMobile(event)} placeholder='Mobile Number' maxLength={10} />
											    			<FormError err_status={this.state.labor_mobile_err_status} err_msg={this.state.labor_mobile_err_msg} />
											    		</Grid.Column>
										      			
										      			<Grid.Column>
										      				<Form.Input className={this.state.labor_address_err_status ? 'input_err' : ''} label="Address" value={this.state.labor_address ? this.state.labor_address : ''} onChange={(event) => this.changeLaborAddress(event)} placeholder="Enter User Address" />
											    			<FormError err_status={this.state.labor_address_err_status} err_msg={this.state.labor_address_err_msg} />
											    		</Grid.Column>
										      			
										      			<Grid.Column>
										      				<Form.Input className={this.state.about_labor_err_status ? 'input_err' : ''} label="About the Laborer" value={this.state.about_labor ? this.state.about_labor : ''} onChange={(event) => this.changeAboutLabor(event)} placeholder="About the Labor" />
											    			<FormError err_status={this.state.about_labor_err_status} err_msg={this.state.about_err_msg} />
											    		</Grid.Column>
										      			
										      			<Grid.Column>
										      				<Form.Input label="Select Service Location">
													    		<Geosuggest placeholder="Select Service Location" initialValue={this.state.labor_service_location ? this.state.labor_service_location : ''} onSuggestSelect={this.onSuggestSelect} ignoreTab={true} />
													    	</Form.Input>
										      			</Grid.Column>
										      			
										      			<Grid.Column>
										      				<Form.Input className={this.state.labor_certification_err_status ? 'input_err' : ''} label="Certification" value={this.state.labor_certification ? this.state.labor_certification : ''} onChange={(event) => this.changeLaborCertification(event)} placeholder="Certification (SSC, DEGREE, ...)" />
											    			<FormError err_status={this.state.labor_certification_err_status} err_msg={this.state.labor_certification_err_msg} />
											    		</Grid.Column>
										      		</Grid.Row>
										      		
										      		<Grid.Column>
										      			<Form.Input label="Select Your Experience">
													    	<Dropdown className={'exp_dropdown exp_years_menu'} placeholder='Years' openOnFocus selection options={this.state.years ? this.state.years : ''} value={this.state.selected_years} onChange={this.yearsChange} />
													    	<Dropdown className={'exp_dropdown exp_months_menu'} placeholder='Months' openOnFocus selection options={this.state.months} value={this.state.selected_months} onChange={this.monthsChange} />
													    </Form.Input>
										      		</Grid.Column>
										      		
										      		<Grid.Column width={16} >
									      				<p>Select Services </p>
														{this.state.all_services ? <Dropdown placeholder='Select Services' fluid multiple search selection options={this.state.all_services ? this.state.all_services : []} value={this.state.selected_services} onChange={this.changeServices} /> : ''}
													</Grid.Column>
									      			
									      			<Grid.Column width={16}>
									      				<p>Select Skills</p>
														{this.state.all_skills ? <Dropdown placeholder='Select Skills' fluid multiple search selection options={this.state.all_skills ? this.state.all_skills : []} value={this.state.selected_skills ? this.state.selected_skills : []} onChange={this.changeSkills} /> : ''}
													</Grid.Column>
										      		
										      		<Grid.Row>
										      			<Grid.Column>
										      				<div className={'availability_container'}>Availability <Radio checked={this.state.availability_status} toggle onChange={(event) => this.changeAvailability(event)} /></div>
										      			</Grid.Column>
										      		</Grid.Row>
										      		
										      		<Grid.Row>
										      			<div className={'update_btn_blk'}>
															<button type="button" className="cancel_btn" onClick={() => browserHistory.push('/myprofile')}>Cancel</button>
															<button type="button" onClick={(event) => this.editLaborSubmit(event)}  className="sub_btn">Update</button>
														</div>
										      		</Grid.Row>
										      	</Grid>
										    </Form>
										</Grid.Column>
									</Grid.Row>
								</Grid>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}
}



export default connect()(EditLabor);