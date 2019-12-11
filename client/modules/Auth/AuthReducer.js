import { LOGIN , REGISTER_SUCCESS, REGISTER_FAILURE, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT, LOAD_USER_PROPS, UPDATE_USER_INFO_SUCCESS, UPDATE_USER_INFO_FAILURE, VERIFY_OTP_SUCCESS, VERIFY_OTP_FAIL } from './AuthActions.js';

import { toast } from "react-toastify";
import { browserHistory } from 'react-router';
import cookie from 'react-cookie';

// Initial State
  const initialState = { 
      register:'',
      auth:null,
      def_user_type: 3,
  };

  const WebReducer = (state = initialState, action) => {
      switch (action.type) {
        case VERIFY_OTP_SUCCESS: 
          return {
            ...state,
            auth: {
                ...state.auth,
                otp_flag: 1,
                page:'dashboard',
                err_status: false,
                err_msg: '',
            },
          };
        case VERIFY_OTP_FAIL:
          return {
            ...state,
            auth: {
              ...state.auth,
              err_status: true,
              err_msg: '* invalid otp',
            }
          }
        case LOGIN : 
          return {
            ...state,
            auth: action.data,
          };
        case REGISTER_SUCCESS:
          return {
            ...state,
            register: action.res,
            def_user_type: action.def_user_type
          };
        case REGISTER_FAILURE:
          return {
            ...state,
          };
        case LOGIN_SUCCESS:
          return {
            ...state,
            auth: action.data,
          };
        case LOGIN_FAILURE:
          toast.error(action.err_msg);
          return {    
            ...state,
          };
        case LOGOUT:
          return {
            ...state,
            auth: null,
          };
        case LOAD_USER_PROPS:
          return {
            ...state,
            auth: action.user,
            register: action.user.register,
          };
        case UPDATE_USER_INFO_SUCCESS:
          return {
            ...state,
            auth: action.user,
          };
        case UPDATE_USER_INFO_FAILURE:
          return {
            ...state,
          };
        default:
          return state;
      }
  };


// Export Reducer
export default AuthReducer;
