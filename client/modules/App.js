import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import cookie from 'react-cookie';
import { ToastContainer, toast } from 'react-toastify';

// Import Custom Components
import MainHeader from './components/MainHeader.js';
import MainFooter from './components/MainFooter.js';

// Import Actions
import { loadUserProps, logout } from './Auth/AuthActions';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isMounted: false };
  }

  componentDidMount() {
    this.setState({isMounted: true}); // eslint-disable-line
  }

  componentWillMount() {
    const loginResult = cookie.load('mernAuth');
    const token = loginResult ? loginResult.t : null;
    const mobile_number = loginResult ? loginResult.u : null;
    const user_type = loginResult ? loginResult.ut : null;
    const user_id = loginResult ? loginResult.i : null;
    const otp_flag = loginResult ? loginResult.otp_flag : null;
    const page = loginResult ? loginResult.page : null;
    const err_status = loginResult ? loginResult.err_status : null;
    const err_msg = loginResult ? loginResult.err_msg : null;
    
    if(this.props.user == null && token && mobile_number) 
    {
        this.props.dispatch(loadUserProps({mobile_number: mobile_number,user_type: user_type,token: token,user_id:user_id,otp_flag:otp_flag,page:page,err_status:err_status,err_msg:err_msg }));
    } 
  }
    
  handleLogout = () => {
    this.props.dispatch(logout());
  };


  render() {
    return (
      <div>
        <div>
          <Helmet
            title="LaborBridge "
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
          <div className={'container'}>
            {this.props.children}
            <ToastContainer />
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  auth: PropTypes.shape({
    mobile_number: PropTypes.Number,
  }),
};

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    auth: state.auth.auth,
  };
}

export default connect(mapStateToProps)(App);
