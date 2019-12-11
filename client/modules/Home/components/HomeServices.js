import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Grid } from 'semantic-ui-react';

import Config from '../../../../server/config';

class HomeServices extends Component{
	render(){
		var services=[];
		if(this.props.services && this.props.services.length > 0)
		{
			services = this.props.services.map(function(data,index){
					if(index < 8)
					{
						return(
							<Grid.Column mobile={16} tablet={8} computer={4} key={index} className="srvs_item">
								<a className="srvs_lst_blk" href={'/laborers/'+data.name.replace(/ /g, '-').toLowerCase()+'/'+data.id}>
									<img src={Config.baseAssets+"images/services/"+data.image} />
									<h6 className="srvs_name">{data.name}</h6>
								</a>
							</Grid.Column>
						)
					}
			})
		}
		return(
			<div>
				<section className={"srvs_lst"}>
					<div className={"ui container"}>
						<h1>Available Services</h1>
						<div className={'ui grid'}>
							<Grid.Row>
								{services}
							</Grid.Row>
						</div>
						<div className={"more_btn"}>
							<Link to={'/services'}>
								<button className={'ui button'} role='button'>More Services</button>
							</Link>
						</div>
					</div>
				</section>
			</div>
		);
	}
}

HomeServices.propTypes = {
	services: PropTypes.array,
}

export default HomeServices;