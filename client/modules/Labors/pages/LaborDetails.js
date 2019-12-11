import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import SubHeader from '../../../components/SubHeader.js';
import MainFooter from '../../../components/MainFooter.js';
import LaborDetailsView from '../components/LaborDetailsView.js';
import SimilarLaborers from '../components/SimilarLaborers.js';

class LaborDetails extends Component{
	constructor(props){
		super(props);
		this.state={
			labor_id: this.props.params.labor_id
		}
		this.changePage = this.changePage.bind(this);
	}
	
	changePage = (labor_id) => {
		this.setState({
			labor_id: labor_id,
		})
	}
	render(){
		return(
			<div>
				<Helmet
		            title="Laborer Details | LaborBridge"
		            titleTemplate="%s - Bridging labor to need"
		            meta={[
		              { charset: 'utf-8' },
		              {
		                'http-equiv': 'X-UA-Compatible',
		                content: 'IE=edge',
		              },
		              {
		                name: 'viewport',
		                content: 'width=device-width, initial-scale=1',
		              },
		            ]}
		        />
		        <SubHeader auth={this.props.auth} />
		        <div className="body_cntnt">
		        	<LaborDetailsView labor_id={this.state.labor_id} auth={this.props.auth} />
		        </div>
		        <SimilarLaborers changePage={(labor_id) => this.changePage(labor_id)} />
		        <MainFooter />
			</div>
		);
	}
}


function mapStateToProps(state){
	return {
		auth: state.auth.auth,
	}
}

export default connect(mapStateToProps)(LaborDetails);