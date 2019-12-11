import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Grid } from 'semantic-ui-react';
import { Link } from 'react-router';
import InfiniteScroll from 'react-infinite-scroll-component';

import Config from '../../../../server/config';

class FullLabors extends Component {
    selectedServiceLabors = (event: React.SyntheticEvent<HTMLDivElement>, data: any) => {
		this.props.selectedServiceLabors(data.value);
	}
	refresh = () => {
		console.log('refresh')
	}
	render(){
		var labors = [];
		if(this.props.labors && this.props.labors.length > 0)
		{
			labors = this.props.labors.map(function(data,index){
			    return(
					<Grid.Column key={index} mobile={16} tablet={8} computer={4} className="lbur_lst_item">
						<Link to={data._id ? '/laborer-details/'+data._id : '/laborer-details/'+data.id} className="lbur_lst_blk">
							<div>
								<div className="prfl_img">
									<img src={data.avatar ? Config.adminAssets+'uploads/'+data.avatar : Config.adminAssets+"uploads/default_labor.png"} />
								</div>
								<h5>{data.name}</h5>
							</div>
							<div className={"lbur_lst_dtls"}>
								<p className={"lbur_address"}>{data.service_location}</p>
								<ul>
									<li><span>{data.years && data.months ? data.years.charAt(0)+'.'+data.months.charAt(0) : ''}</span>Exp (Years)</li>
									<li><span>{data.availability ? 'Yes' : 'No'}</span>Availability</li>
									<li><span>{data.call_count > 0 ? data.call_count : 101}</span>Views</li>
								</ul>
							</div>
						</Link>
					</Grid.Column>
				);
			});
		}
		return(
			<div>
				<section className={"lbur_lst"}>
					<div className={"ui container"}>
						<h1>Laborers</h1>
						<div className={"srvs_drop"}>
							<Dropdown placeholder='Services' search selection options={this.props.custom_services ? this.props.custom_services : ''} onChange={this.selectedServiceLabors} />
						</div>
						<div className="clr">&nbsp;</div>
						<InfiniteScroll
                              pullDownToRefresh
                              pullDownToRefreshContent={
                                <h3 style={{textAlign: 'center'}}>&#8595;</h3>
                              }
                              releaseToRefreshContent={
                                <h3 style={{textAlign: 'center'}}>&#8593;</h3>
                              }
                              refreshFunction={this.refresh}
                              dataLength={this.props.labors.length}
                              next={this.props.getLabors}
                              hasMore={true}
                              scrollThreshold={"200px"}
                              loader={<h4></h4>}
                              endMessage={
                                <p style={{textAlign: 'center'}}>
                                  <b></b>
                                </p>
                              }>
                              <div className={'ui grid'}>
                                  <Grid.Row>
									{this.props.labors_err_status ? <div className="no_data_found"><h3>{this.props.labors_err_msg}</h3></div> : ''}
                                  	{labors}
                                  </Grid.Row>
                              </div>
                        </InfiniteScroll>
					</div>
				</section>
			</div>
		);
	}
}

FullLabors.propTypes = {
	labors: PropTypes.array,
	custom_services: PropTypes.array,
	selectedServiceLabors: PropTypes.func,
	getLabors: PropTypes.func,
	labors_err_status: PropTypes.bool,
	labors_err_msg:PropTypes.string
}

export default FullLabors;