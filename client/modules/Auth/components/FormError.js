import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class FormError extends Component{
	render(){
		return(
			<div className={"form_err_container"}>
				{this.props.err_status ? <p className={"form_err_msg"}>{this.props.err_msg}</p> : <p className={"form_err_msg"}>&nbsp;</p>}
			</div>
		);
	}
}