import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Config from '../../server/config.js';

import { logout } from '../modules/Web/WebAuthActions.js';

class SubHeader extends Component{
	constructor(props){
		super(props);
		this.state={

		}
		this.getUserStatus = this.getUserStatus.bind(this);
		this.signOut = this.signOut.bind(this);
	}
	
	signOut = () => {
		this.props.logout();
		window.location.reload();
	}

	getUserStatus = () => {
		if(this.props.auth)
		{
			return ( 
				<div className='ui right floated header sign_btns stackable menu lb_rgt_drop_menu'>
					<div className="ui attached stackable menu">
						<div className="">
							<div className="ui simple dropdown item">
						      	<img className="profile_menu_icon" src={this.props.auth && this.props.auth.avatar ? Config.baseAssets+'uploads/'+this.props.auth.avatar : Config.baseAssets+"uploads/user_image.png"} />
						      	<i className="dropdown icon"></i>
						      	<div className="menu">
						        	<Link to={'/'} className="item"><i className="home icon"></i> Home</Link>
						        	<Link to={'/services'} className="item"><i className="grid layout icon"></i> Services</Link>
						    		<Link to={'/laborers'} className="item"><i className="user icon"></i> Laborers</Link>
						        	<Link to={'/myprofile'} className="item"><i className="eye icon"></i>My Profile</Link>
						        	{/*<Link to={'/edit_profile'} className="item"><i className="edit icon"></i>Edit Profile</Link>*/}
									<Link onClick={() => this.signOut()} className="item"><i className="settings icon"></i>SignOut </Link>
								</div>
						    </div>
						</div>
					</div>
		 			{/*<div className="ui simple dropdown item">
						More
						<i className="dropdown icon"></i>
						<div className="menu">
							<a className="item"><i className="edit icon"></i>Edit Profile</a>
							<a className="item"><i className="globe icon"></i>Choose Language</a>
							<a className="item"><i className="settings icon"></i>Account Settings</a>
						</div>
					</div>
		 			<div role='list' className='ui list'>
		 				<div role='listitem' className='item'><Link onClick={() => this.signOut()} title="SignOut">SignOut</Link></div>
		 			</div>*/}
		 		</div>
		 	);
		}
		else
		{
			return (<div className='ui right floated header sign_btns lb_rgt_drop_menu'>
						<div role='list' className='ui list'>
							<div className="ui attached stackable menu">
								<div className="">
									<div className="ui simple dropdown item">
								      	<img className="profile_menu_icon" src={this.props.auth && this.props.auth.avatar ? Config.baseAssets+'/uploads/'+this.props.auth.avatar : Config.baseAssets+"images/logo.png"} />
								      	<i className="dropdown icon"></i>
								      	<div className="menu">
								        	<Link to={'/'} className="item"><i className="home icon"></i> Home</Link>
								        	<Link to={'/services'} className="item"><i className="grid layout icon"></i> Services</Link>
								    		<Link to={'/laborers'} className="item"><i className="user icon"></i> Laborers</Link>
								    		<Link to={'/signin'} className="item"><i className="sign-in icon"></i> SignIn</Link>
								    		{/*<Link to={'/signup'} className="item"><i className="signup icon"></i> SignUp</Link>*/}
								        </div>
								    </div>
								</div>
							</div>
						</div>
					</div>
			);
		}
	}
	render(){
		return(
			<div>
				<header className='ui segment inr_hdr'>
				    <div className='ui left floated header inr_logo'>
					  	<Link to="/" title="LaborBridge">
					  		<img src={Config.baseAssets+"images/logo.png"} alt="LaborBridge" />
					  	</Link>
					</div>
					{this.getUserStatus()}
				</header>
			</div>
		);
	}
}

SubHeader.propTypes = {
	logout: PropTypes.func,
	auth: PropTypes.shape({
		mobile_number: PropTypes.Number,
	})
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({ logout: logout },dispatch)
}


export default connect(null, mapDispatchToProps)(SubHeader);