import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from 'semantic-ui-react';

import callApi from '../../../util/apiCaller.js';
import Config from '../../../../server/config';

export default class LaborDetailsView extends Component{
	constructor(props){
		super(props);
		this.state={
			user_data:'',
			labor_data: '',
			user_type:2,
			labor_id: this.props.labor_id,
			labor_data_err_status: false,
			labor_data_err_msg: '',
			user_data_err_status: false,
			user_data_err_msg: '',
			contact_status: false,
		}
		this.getLaborDetails = this.getLaborDetails.bind(this);
		this.contactLabor = this.contactLabor.bind(this);
	}
	
	componentDidMount = () => {
		this.getLaborDetails();
	}
	
	componentWillReceiveProps(nextProps){
		if(nextProps.labor_id !== this.props.labor_id)
		{
			this.setState({
				labor_id: nextProps.labor_id,
			})
			this.getLaborDetails()
		}
		this.setState({
			labor_id: nextProps.labor_id,
		})
		this.getLaborDetails()
	}

	getLaborDetails = () => {
		var data = {query: "{getLabor(id:\""+this.state.labor_id+"\"){ id,name,email,avatar,mobile_number,location,address,token,service_location,latitude,longitude,availability,description,certification,views_count,months,years,call_count,services{id,name},skills{id,name},otp_flag }}"};
		callApi('graphql','post',data).then(response => {
			if(response.data.getLabor !== null)
			{
				this.setState({
					labor_data: response.data.getLabor,	
					labor_data_err_status: false,
					labor_data_err_msg: '',
				});
			}
			else 
			{
				this.setState({
					labor_data_err_status: true,
					labor_data_err_msg: 'No Details Found!',
				})
			}	
				
		});
	}

	contactLabor = () => {
		this.setState({
			contact_status: !this.state.contact_status,
		})
	}

	displayUserData = () => {
		if(this.state.user_data && this.state.user_type === 3)
		{
			return (
				<div className={"two column row"}>
					<div className={"four wide column"}>
						<div className={"pro_pic"}>
							<img src={this.state.user_data && this.state.user_data.avatar ? Config.adminAssets+'uploads/'+this.state.user_data.avatar : Config.adminAssets+"images/labor_list_defult_pic.png"} />
						</div>
					</div>
					{!this.state.user_data_err_status ?  
						<div className={"twelve wide column"}>
							<h3>{this.state.user_data.name}</h3>
							<p><span>Mobile: </span>{this.state.user_data ? this.state.user_data.mobile_number : ''}</p>
							<p><span>Email: </span>{this.state.user_data ? this.state.user_data.email : ''}</p>
						</div>
						: 	<div>
								<h3>No user details found!</h3>
							</div>
					}
				</div>
			);
		}
		else if (this.state.labor_data && this.state.user_type === 2)
		{
			return (
					<Grid.Row>
						<Grid.Column computer={4} mobile={16} table={8}>
							<div className={"pro_pic"}>
								<img src={this.state.labor_data && this.state.labor_data.avatar ? Config.adminAssets+'uploads/'+this.state.labor_data.avatar : Config.adminAssets+"images/labor_list_defult_pic.png"} alt=" " />
							</div>
						</Grid.Column>
						<Grid.Column className={"lbr_dtls_blk1"} computer={12} table={8} mobile={16}>
							<h3 className="lbr_name"><span>{this.state.labor_data.name}</span><span className="verify_status_blk">{this.state.labor_data.otp_flag === 1 ? <img src={Config.baseAssets+'images/ok.png'} /> : ''}</span></h3>
							<Grid.Row className="lbr_dtls_lst">
							<h6>Description</h6>
							<p><span>{this.state.labor_data.description}</span></p>
							</Grid.Row>
							
							<Grid.Row className={"lbr_dtls_lst"}>
							<h6>Email </h6>
							<p><span>{this.state.labor_data ? this.state.labor_data.email : ''}</span></p>
							</Grid.Row>

							<Grid.Row className={"lbr_dtls_lst"}>
							<h6>Location </h6>
							<p><span>{this.state.labor_data ? this.state.labor_data.address : ''}</span></p>
							</Grid.Row>

							<Grid.Row className={"lbr_dtls_lst"}>
							{this.state.labor_data.services && this.state.labor_data.services.length > 0 ? <h6>Services </h6> : ''}
							<ul className="services_ul">
								{this.state.labor_data.services ? this.state.labor_data.services.map((item,index) => {
											return (
												<li key={index} className="badge">{item.name}</li>
											);
									  }) 
								: ''}
							</ul>
							</Grid.Row>

							<Grid.Row className={"lbr_dtls_lst"}>							
							{this.state.labor_data && this.state.labor_data.skills ? <h6>Skills</h6> : ''}
							<ul className="skils_ul">
							{this.state.labor_data.skills ? this.state.labor_data.skills.map((item,index) => {
								return (
									<li className="skl_badge" key={index}>{item.name ? item.name.replace('_', ' ') : ''}</li>
								);
							}) : ''}
							</ul>
							</Grid.Row>

							<Grid.Row className={"lbr_dtls_lst"}>
							<h6>Experience</h6>
							<p>{this.state.labor_data.years && this.state.labor_data.months ? <span>{this.state.labor_data.years.charAt(0)+'.'+this.state.labor_data.months.charAt(0)+' Years'}</span> : ''}</p>
							</Grid.Row>

							<Grid.Row className={"lbr_dtls_lst"}>
							<h6>Certifications</h6>
							<p><span>{this.state.labor_data.certification}</span></p>
							</Grid.Row>

							<Grid.Row className={"lbr_dtls_lst"}>
							<h6>Service Location </h6>
							<p><span>{this.state.labor_data.service_location}</span></p>
							</Grid.Row>

							<Grid.Row className={"lbr_dtls_lst"}>
							<h6>Availability </h6>
							<p><span>{this.state.labor_data.availability ? 'Yes' : 'No'}</span></p>
							</Grid.Row>

							<Grid.Row className={"lbr_dtls_lst"}>
							<h6>Call Count (Views) </h6>
							<p><span>{this.state.labor_data.call_count > 0 ? this.state.labor_data.call_count : 10}</span></p>
							</Grid.Row>
							<div className='field'>
								<button className={'ui button cntct_btn'} role='button' onClick={() => {this.contactLabor()}}>{this.state.contact_status ? (this.state.labor_data.mobile_number ? '+91 '+this.state.labor_data.mobile_number : '')  : 'Contact'}</button>
							</div>
						</Grid.Column>
				</Grid.Row>
				
			);
		}
		else
		{
			return (
				<div className='no_data'>
					<div className="">
						<h2>No details found!</h2>
					</div>
				</div>
			);
		}
		
	}
	render(){
		return(
			<div>
				<section className="ui text container">
					<div className="prf_sctn">
						<div className="prf_bg">&nbsp;</div>
						<div className="prof_cntnt">
							<div className='ui grid'>
								{this.props.auth && this.props.auth.user_id === this.props.labor_id ? <div className="pro_edt_blk"><a href="/edit_profile" title={'Edit Profile'}><i className="signup icon"></i></a></div> : ''}
								{this.displayUserData()}
							</div>
						</div>
					</div>
				</section>
			</div>
		);
	}
}