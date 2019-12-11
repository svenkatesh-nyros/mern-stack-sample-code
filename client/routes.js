/* eslint-disable global-require */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import cookie from 'react-cookie';
import App from './modules/App';
import HomePage from './modules/Home/pages/HomePage';

// require.ensure polyfill for node
if (typeof require.ensure !== 'function') {
  require.ensure = function requireModule(deps, callback) {
    callback(require);
  };
}

if (process.env.NODE_ENV !== 'production') {
  // Require async routes only in development for react-hot-reloader to work.
}

const requireLoggedIn = (nextState, replace, cb) => {
  const authCookie = cookie.load('mernAuth');
  if(!authCookie || !authCookie.t) {
    replace('/');
  }
  cb();
};
const requireNotLoggedIn = (nextState, replace, cb) => {
  const authCookie = cookie.load('mernAuth');
  if(authCookie && authCookie.t) {
      replace('/');
  }
  cb();
};


export default (
    <Route path="/" component={App}>
        <IndexRoute
            getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('./modules/Home/pages/HomePage').default);
              });
            }}
        />
        <Route
            path="/signin"
            onEnter={requireNotLoggedIn} 
            getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('./modules/Auth/pages/SignIn').default);
              });
            }}
        />
        <Route 
            path="signup"
            getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('./modules/Auth/pages/SignUp').default);
              })
            }}
        />
        <Route
            path="/home"
            getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('./modules/Home/pages/HomePage').default);
              });
            }}
        />
        <Route
            path="/forget_password"
            getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('./modules/Auth/pages/ForgetPwd').default);
              });
            }}
          />
        <Route
            path="/verify_otp"
            getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('./modules/Auth/pages/VerifyOtp').default);
              });
            }}
        />
        <Route
            path="/forgot_verify_otp"
            getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('./modules/Auth/pages/ForgotVerifyOtp').default);
              });
            }}
        />
        <Route
            path="/reset_password"
            getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('./modules/Auth/pages/ResetPwd').default);
              });
            }}
        />
        <Route
            path="/myprofile"
            getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('./modules/Auth/pages/MyProfile').default);
              });
            }}
        />
        <Route
            path="/edit_profile"
            getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('./modules/Auth/pages/EditProfile').default);
              });
            }}
        />
        <Route
            path="/services"
            getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('./modules/Services/pages/AllServices').default);
              });
            }}
        />
        <Route
            path="/laborers"
            getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('./modules/Labors/pages/AllLabors').default);
              });
            }}
        />
        <Route
            path="/laborers/:ServiceName/:ServiceID"
            getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('./modules/Labors/pages/LaborsByService').default);
              });
            }}
        />
        <Route
            path="/laborer-details/:labor_id"
            getComponent={(nextState, cb) => {
              require.ensure([], require => {
                cb(null, require('./modules/Labors/pages/LaborDetails').default);
              });
            }}
        />
  </Route>
);
