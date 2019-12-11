import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Grid } from 'semantic-ui-react';
import Swiper from 'react-id-swiper';

import { getLaborsRequest } from '../LaborActions.js';

import Config from '../../../../server/config.js';

class SimilarLaborers extends Component{
	constructor(props){
		super(props);
		this.state={
			labors: [],
			labors_err_status: false,
			labors_err_msg: '',
		}
		this.goNext = this.goNext.bind(this);
    	this.goPrev = this.goPrev.bind(this);
    	this.swiper = null;
	}
	componentDidMount = () => {
		this.getLabors()
	}
	goNext()
	{
	    if(this.swiper) this.swiper.slideNext()
	}
	goPrev()
	{
    	if(this.swiper) this.swiper.slidePrev()
  	}

	componentWillReceiveProps = (nextProps) => {
		if(nextProps.labors !== this.props.labors){
			this.setState({
				labors: nextProps.labors,
			})
		}
	}

	getLabors = () => {
		this.props.dispatch(getLaborsRequest());
	}
	
	render(){
		const params = {
	      paginationClickable: true,
	      spaceBetween: 20,
	      slidesPerView: 6,
	      autoplay: 3000,
	      autoplayDisableOnInteraction: false,
	    }
		var labors = [];
		if(this.props.labors && this.props.labors.length > 0)
		{
			labors = this.props.labors.map(function(data,index){
				return(
					<div className={'sim_lbrs_item'}>
						<Link onClick={() => this.props.changePage(data._id)} to={'/laborer-details/'+data._id}>
							<div>
								<div className="prfl_img">
									<img src={data.avatar ? Config.adminAssets+'uploads/'+data.avatar : Config.adminAssets+"uploads/default_labor.png"} />
								</div>
								
							</div>
							<div className="similar_lbrs">
								<h5>{data.name}</h5>
								<p className="lbur_address">{data.service_location}</p>
								<ul>
									<li><span>{data.years && data.months ? data.years.charAt(0)+'.'+data.months.charAt(0) : ''}</span>Exp (Years)</li>
									<li><span>{data.availability ? 'Yes' : 'No'}</span>Availability</li>
									<li><span>{data.call_count > 0 ? data.call_count : 101}</span>Views</li>
								</ul>
							</div>
						</Link>
					</div>
				)	
			})
		}
		return (
			<div className={'similar_lbrs_cntr'}>
				<Grid.Row>
			        <Grid.Column mobile={8} table={8} computer={8}>
			        	<h2>View Similar Laborers</h2>
	                </Grid.Column>
	                <Grid.Column mobile={8} table={8} computer={8} >
		                <div className={"sim_lbrs_ctrls"}>
				            <a className={"left carousel-control sim_lbrs_lft"} onClick={this.goPrev}>
				            	<span className={"sim_lbrs_arrow"} aria-hidden="true"><img src={Config.baseAssets+'images/left_arrow.png'} alt="" /></span>
				            	<span className={"sr-only"}>Previous</span>
				            </a>
				            <a href="/laborers" style={{float:'right'}}> View All</a>
				            <a className={"right carousel-control sim_lbrs_rgt"} onClick={this.goNext}>
				            	<span className={"sim_lbrs_arrow"} aria-hidden="true"><img src={Config.baseAssets+'images/right_arrow.png'} alt="" /></span>
				            	<span className={"sr-only"}>Next</span>
				            </a>
		            	</div>
		            </Grid.Column>
			    </Grid.Row>
				{labors && labors.length > 0 ? 
					<div className="clr">
						<Swiper {...params} key={labors.length} ref={node => node ? this.swiper = node.swiper : ''}>
							{labors}
						</Swiper>
					</div>
				: ''}
			</div>
		);
	}
}

function mapStateToProps(state){
	return {
		auth: state.web.auth,
		labors: state.web.labors,
	}
}

export default connect(mapStateToProps)(SimilarLaborers);