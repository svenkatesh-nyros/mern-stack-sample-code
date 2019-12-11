import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Grid } from 'semantic-ui-react';

import Config from '../../../../server/config';

class FullServices extends Component{
	refresh = () => {
		console.log('refresh')
	}
	render(){
		var services=[];
		if(this.props.services && this.props.services.length > 0)
		{
			services = this.props.services.map(function(data,index){
				return(
					<Grid.Column key={index} mobile={16} tablet={8} computer={4} className="srvs_item">
						<a href={'/laborers/'+data.name.replace(/ /g, '-').toLowerCase()+'/'+data.id} className="srvs_lst_blk">
							<img src={Config.baseAssets+"images/services/"+data.image} />
							<h6 className={"srvs_name"}>{data.name}</h6>
						</a>
					</Grid.Column>
				)
			})
		}
		return(
			<div>
				<section className={"srvs_lst"}>
					<div className={"ui container"}>
						<h1>Available Services</h1>
						<InfiniteScroll
                              pullDownToRefresh
                              pullDownToRefreshContent={
                                <h3 style={{textAlign: 'center'}}>&#8595;</h3>
                              }
                              releaseToRefreshContent={
                                <h3 style={{textAlign: 'center'}}>&#8593;</h3>
                              }
                              
                              refreshFunction={this.refresh}
                              dataLength={this.props.services.length}
                              next={this.props.getServices}
                              hasMore={true}
                              scrollThreshold={"200px"}
                              loader={<h4></h4>}
                              endMessage={
                                <p style={{textAlign: 'center'}}>
                                  <b></b>
                                </p>
                              }>
                              <div className='ui grid'>
								<Grid.Row>
									{this.props.labors_err_status ? <div className="no_data_found"><h3>{this.props.labors_err_msg}</h3></div> : ''}
									{services}
								</Grid.Row>
							</div>
                        </InfiniteScroll>
					</div>
				</section>
			</div>
		);
	}
}

FullServices.propTypes = {
	services: PropTypes.array,
}

export default FullServices;