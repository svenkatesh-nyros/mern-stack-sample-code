import React, { Component } from 'react';
import { Link } from 'react-router';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import Geosuggest from 'react-geosuggest';
import { bindActionCreators } from 'redux';

import Config from '../../server/config.js';

import { logout } from '../modules/Web/WebAuthActions.js';

class MainHeader extends Component{
	constructor(props){
		super(props);
		this.state={
			services: [],
			search_services:[],
		};
		this.searchServices = this.searchServices.bind(this);
		this.signOut = this.signOut.bind(this);
	}

	componentDidMount = () => {
		
	}
	
	signOut = () => {
		this.props.logout();
		window.location.reload();
	}
	
	searchServices =(event) => {
		var src_text = event.target.value;
		if(src_text.length >= 1 )
		{
			var matches = this.props.services.filter(function(item) {
	            if(item.name.toLowerCase().indexOf(src_text.toLowerCase()) !== -1) return true;
	        })
	        this.setState({
	            search_services: matches,
	        });
		}
		if(src_text==='')
		{
			this.setState({
				services: this.props.services,
				search_services: [],
			});
		}
	}
	
	getUserStatus = () => {
		if(this.props.auth) {
			return( 
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
										<Link onClick={() => this.signOut()} className="item"><i className="settings icon"></i>Sign Out</Link>
									</div>
							    </div>
							</div>
						</div>
						{/*<div className='ui right aligned header sign_btns'>
							<div role='list' className='ui list'>
								<div role='listitem' className='item'><Link title="SignOut" onClick={this.props.logout} >SignOut</Link></div>
							</div>
						</div>*/}
					</div>
			);
		}
		else
		{
			return (
				<div className='ui right floated header sign_btns lb_rgt_drop_menu'>
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
			{/*else{
				return (
				<div className='ui right aligned header sign_btns lb_rgt_drop_menu'>
					<div role='list' className='ui list'>
						<div role='listitem' className='item'><Link title="SignIn" to={"/signin"}>SignIn</Link></div>
						<div role='listitem' className='item'><Link title="SignUp" to={"/signup"} className='signup_btn'>Signup</Link></div>
					</div>
				</div>
			);	
			}*/}
		}
	}

	render(){
		var fixtures = [
			  {label: 'Kakinada, Andhra Pradesh, India', location: {lat: 16.9890648, lng: 82.24746479999999}},
			  {label: 'Bhimavaram, Andhra Pradesh, India', location: {lat: 16.544893, lng: 81.52124100000003}},
			  {label: 'Samalkota, Andhra Pradesh, India', location: {lat: 17.0504374, lng: 82.16592430000003}},
			  {label: 'Amalapuram, Andhra Pradesh, India',location: {lat: 16.5720904, lng: 82.00085480000007}}
		];

		var search_services = [];
		if(this.state.search_services && this.state.search_services.length > 0)
		{
			search_services = this.state.search_services.map(function(data,index){
				return(
					<li key={index}>
						<a href={'/laborers/'+data.name.replace(/ /g, '-').toLowerCase()+'/'+data.id}>{data.name}</a>	
					</li>
				);
			});
		}
		return(
			<div>
				<header className='ui segment hm_hdr'>
					{this.getUserStatus()}
					<div className="clr">&nbsp;</div>
					{/* logo starts*/}
					<div className='ui center aligned header hm_logo'>
						<Link to="/" title="LaborBridge">
							<img src={Config.baseAssets+"images/logo.png"} alt="LaborBridge" />
						</Link>
					</div>
					{/* logo end*/}
					{/* search block start */}
					<div className='ui action input srch_blk'>
						{/*<input type='text' placeholder='Search...' onChange={(event) => this.props.searchServices(event)} />*/}
						<input type='text' placeholder='Search...' onChange={(event) => this.searchServices(event)} />
						<Geosuggest 
							fixtures={fixtures} 
							placeholder="Select Service Location" 
							initialValue="" 
							onSuggestSelect={(e) => this.props.onSuggestSelect(e)}
							ignoreTab={true} 
						/>
						<button type='submit' className='ui button' role='button'>Search</button>
					</div>
					<div className='srch_rslts'>{search_services ? <ul>{search_services}</ul> : ''}</div>
					{/* search block end */}
				</header>
			</div>
		);
	}
}

MainHeader.contextTypes = {
  router: React.PropTypes.object,
};


MainHeader.propTypes = {
	searchServices: PropTypes.func,
	onSuggestSelect: PropTypes.func,
	auth: PropTypes.shape({
	    mobile_number: PropTypes.Number,
	}),
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({ logout: logout },dispatch)
}

export default connect(null, mapDispatchToProps)(MainHeader);
