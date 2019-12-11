import React, { Component } from 'react';
import PropTypes from 'prop-types';
import callApi from '../../../util/apiCaller.js';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Grid } from 'semantic-ui-react';

import Config from '../../../../server/config';

class MyProfileView extends Component{
	constructor(props){
		super(props);
		this.state={
			user_data:'',
			labor_data: '',
			user_type:this.props.auth ? this.props.auth.user_type : 0,
			contact_status: false,
		}
		this.getProfileData = this.getProfileData.bind(this);
		this.contactLabor = this.contactLabor.bind(this);
	}
	
	componentDidMount = () => {
		this.getProfileData();
	}

	contactLabor = () => {
		this.setState({
			contact_status: !this.state.contact_status,
		})
	}

	getProfileData = () => {
		if(this.props.auth)
		{
			var data = {from:'web',user_type:this.props.auth.user_type,user_id:this.props.auth.user_id,token:this.props.auth.token};
			callApi('myprofile','post',data).then(response => {
				if(response.status === 200)
				{	
					if(response.data.user_type === 3)
					{
						this.setState({
							user_data: response.data,	
						});
					}
					else if(response.data.user_type === 2)
					{
						this.setState({
							labor_data: response.data,	
						});
					}
				}
			});
		}
		else
		{
			browserHistory.push('/signin');
		}
	}

	displayUserData = () => {
		if(this.state.user_data && this.state.user_type === 3)
		{
			return (
				<Grid.Row>
					<Grid.Column computer={4} mobile={16} tablet={8}>
						<div className="pro_pic">
							<img src={this.state.user_data && this.state.user_data.avatar ? Config.adminAssets+'uploads/'+this.state.user_data.avatar : Config.adminAssets+"images/labor_list_defult_pic.png"} />
						</div>
					</Grid.Column>
					<Grid.Column className={"lbr_dtls_blk1"} computer={12} tablet={8} mobile={16}>
						<h3 className={"usr_name"}>{this.state.user_data.name}</h3>
						<p><span className={"bold"}>Mobile</span></p>
						<p><span>{this.state.user_data ? this.state.user_data.mobile_number : ''}</span></p>
						<p><span className={"bold"}>Email</span></p>
						<p><span>{this.state.user_data ? this.state.user_data.email : ''}</span></p>
						<p><span className={"bold"}>Location</span></p>
						<p><span>{this.state.user_data ? this.state.user_data.location : ''}</span></p>
						<p><span className={"bold"}>Address</span></p>
						<p><span>{this.state.user_data ? this.state.user_data.address : ''}</span></p>
					</Grid.Column>
				</Grid.Row>
			);
		}
		else if (this.state.labor_data && this.state.user_type === 2)
		{
			return (
				<Grid.Row>
					<Grid.Column computer={4} mobile={16} tablet={8}>
						<div className={"pro_pic"}>
							<img src={this.state.labor_data && this.state.labor_data.avatar ? Config.adminAssets+'uploads/'+this.state.labor_data.avatar : Config.adminAssets+"images/labor_list_defult_pic.png"} />
						</div>
					</Grid.Column>
					<Grid.Column className={"lbr_dtls_blk1"} computer={12} tablet={8} mobile={16}>
						<h3 className={"lbr_name"}><span>{this.state.labor_data.name}</span><span className={'verify_status_blk'}>{this.state.labor_data.otp_flag===1 ? <img src={Config.baseAssets+'images/ok.png'} alt=" "  /> : ''}</span></h3>
						<p><span className={"bold"}>Description</span></p>
						<p><span className={"span_right"}>{this.state.labor_data.description}</span></p>
						<p><span className={"bold"}>Mobile</span></p>
						<p><span>{this.state.labor_data.mobile_number}</span></p>
						<p><span className={"bold"}>Email</span></p>
						<p><span>{this.state.labor_data.email}</span></p>
						<p><span className={"bold"}>Location </span></p>
						<p><span>{this.state.labor_data.address}</span></p>
						{this.state.labor_data.services && this.state.labor_data.services.length > 0 ? <p><span className="bold">Services </span></p> : ''}
						<p>{this.state.labor_data.services ? this.state.labor_data.services.map((item,index) => {
								return (
										<span key={index} className={"badge"}>{item.name}</span>
									);
						  	}) 
							: ''}</p>
						{this.state.labor_data.skills && this.state.labor_data.skills.length > 0 ? <p><span className="bold">Skills </span></p> : ''}
						<p>{this.state.labor_data.skills ? this.state.labor_data.skills.map((item,index) => {
								return (
									<span className={"skl_badge"} key={index}>{item.name}</span>
								);
							}) : ''}
						</p>
						<p><span className={"bold"}>Experience</span></p>
						<p>{this.state.labor_data.years && this.state.labor_data.months ? <span>{this.state.labor_data.years.charAt(0)+'.'+this.state.labor_data.months.charAt(0)+' Years'}</span> : ''}</p>
						<p><span className={"bold"}>Certifications</span></p>
						<p><span>{this.state.labor_data.certification}</span></p>
						<p><span className={"bold"}>Service Location </span></p>
						<p><span>{this.state.labor_data.service_location}</span></p>
						<p><span className={"bold"}>Availability</span></p>
						<p><span>{this.state.labor_data.availability ? 'Yes' : 'No'}</span></p>
						<p><span className={"bold"}>Call Count (Views) </span></p>
						<p>{this.state.labor_data.call_count > 0 ? this.state.labor_data.call_count : 10}</p>
						<div className={'field'}>
							<button className={'ui button cntct_btn'} role='button' onClick={() => {this.contactLabor()}}>{this.state.contact_status ? (this.state.labor_data.mobile_number ? '+91 '+this.state.labor_data.mobile_number : '')  : 'Contact'}</button>
						</div>
					</Grid.Column>
				</Grid.Row>
			);
		}
	}
	render(){
		return(
			<div>
				<section className={"ui text container"}>
					<div className={"prf_sctn"}>
						<div className={"prf_bg"}>&nbsp;</div>
						<div className={"prof_cntnt"}>
							<div className={"ui grid"}>
								{this.props.auth && this.props.auth.user_id !== null ? <div className="pro_edt_blk"><a href="/edit_profile" title={'Edit Profile'}><i className="signup icon"></i></a></div> : ''}
								{this.displayUserData()}
							</div>
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
	}
}

export default connect(mapStateToProps)(MyProfileView);