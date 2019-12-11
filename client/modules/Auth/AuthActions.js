import cookie from 'react-cookie';
import callApi from '../../util/apiCaller';

export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
export const REGISTER_FAILURE = 'REGISTER_FAILURE'
export const UPDATE_USER_INFO_SUCCESS = 'UPDATE_USER_INFO_SUCCESS'
export const UPDATE_USER_INFO_FAILURE = 'UPDATE_USER_INFO_FAILURE'
export const LOAD_USER_PROPS = 'LOAD_USER_PROPS';

export const VERIFY_OTP_SUCCESS = 'VERIFY_OTP_SUCCESS';
export const VERIFY_OTP_FAIL = 'VERIFY_OTP_FAIL';

import { toast } from "react-toastify";
import { browserHistory } from 'react-router';

export function loginRes(data) {
  return {
    type: LOGIN,
    data,
  };
}

export function verifyOtpRequest(data)
{
  return (dispatch) => {
      return callApi('verify_otp','post',data).then(response => {
                if(response.status == 200)
                {
                    const loginResult = cookie.load('mernAuth');
                    const token = loginResult ? loginResult.t : null;
                    const mobile_number = loginResult ? loginResult.u : null;
                    const user_type = loginResult ? loginResult.ut : null;
                    const user_id = loginResult ? loginResult.i : null;
                    const otp_flag = loginResult ? 1 : null;
                    const page = loginResult ? 'dashboard' : null;
                    const err_status = loginResult ? false : null;
                    const err_msg = loginResult ? '' : null;

                    cookie.save('mernAuth', {
                        i:user_id,
                        u: mobile_number,
                        t: token,
                        ut: user_type,
                        otp_flag: otp_flag,
                        page: page,
                        err_status: err_status,
                        err_msg: err_msg,
                      },
                      {
                        maxAge: 31536e3,
                        path: '/'
                      }
                    );
                    dispatch(loadUserProps({mobile_number: mobile_number,user_type: user_type,token: token,user_id:user_id,otp_flag:otp_flag,page:page,err_status:err_status,err_msg:err_msg}))
                    dispatch(verifyOtpSuccess(response))
                }
                else
                {
                    const loginResult = cookie.load('mernAuth');
                    const token = loginResult ? loginResult.t : null;
                    const mobile_number = loginResult ? loginResult.u : null;
                    const user_type = loginResult ? loginResult.ut : null;
                    const user_id = loginResult ? loginResult.i : null;
                    const otp_flag = loginResult ? 0 : null;
                    const page = loginResult ? 'verify_otp' : null;
                    const err_status = loginResult ? true : null;
                    const err_msg = loginResult ? '* invalid otp' : null;
                    cookie.save('mernAuth', {
                        i:user_id,
                        u: mobile_number,
                        t: token,
                        ut: user_type,
                        otp_flag: otp_flag,
                        page: page,
                        err_status: err_status,
                        err_msg: err_msg,
                      },
                      {
                        maxAge: 31536e3,
                        path: '/'
                      }
                    );
                    dispatch(loadUserProps({mobile_number: mobile_number,user_type: user_type,token: token,user_id:user_id,otp_flag:otp_flag,page:page,err_status:err_status,err_msg:err_msg}))
                    dispatch(verifyOtpFail(response))
                }


                // if(response.status === 200)
                // {
                //     if(response.data.page ==='dashboard')
                //     {
                //         browserHistory.push('/');
                //     }
                // }
                // else
                // {
                //     this.setState({
                //         pwd_err_status: true,
                //         pwd_err_msg: response.message,
                //     });
                // }
            });
  }
}

export function verifyOtpSuccess(data)
{
    console.log('verifyOtpSuccess-->data',data);
    return {
      type: VERIFY_OTP_SUCCESS,
      data,
    }; 
}

export function verifyOtpFail(err)
{
    console.log('verifyOtpFail--->err',err);
    return {
      type: VERIFY_OTP_FAIL,
      err,
    }; 
}

export function loginRequest(userInfo) {
  return (dispatch) => {
    return callApi('login', 'post', {
      mobile_number: userInfo.mobile_number,
      password: userInfo.password,
      user_type: userInfo.user_type,
    }).then(res => {
      if(res.status === 200) {
        dispatch(loginSuccess(res.data, res.token))
      }
      else {// invalid credentials
        dispatch(loginFailure(res));
      }
    });
  };
}

export function loginSuccess(data, token) {
    cookie.save('mernAuth', {
        i:data.user_id,
        u: data.mobile_number,
        t: token,
        ut: data.user_type,
        otp_flag: data.otp_flag,
        page: data.page,
        err_status: data.err_status,
        err_msg: data.err_msg,
      },
      {
        maxAge: 31536e3,
        path: '/'
      }
    );

    return {
      type: LOGIN_SUCCESS,
      data,
    }; 
}

export function loginFailure(res) {
  return {
    type: LOGIN_FAILURE,
    err_msg: res.err,
  };
}

export function logout() {
  cookie.remove('mernAuth', { path: '/' });
  return {
    type: LOGOUT,
  };
}



export function registerRequest(data,end_url) {
  console.log('userInfo in web auth---->end_url,data',end_url,data);
  return (dispatch) => {
    return callApi(end_url, 'post', data).then(res => {
      if(res.status === 200) {
        dispatch(registerSuccess(res))
      }
      else {
        dispatch(registerFailure(res));
      }
    });
  };
}

export function registerSuccess(res) {
  console.log('registrationSuccess',res)
  cookie.save('regAuth',res);
 
  if(res.data.user_type == 3)
  {
     toast.success('User created successfully! Sign in now')  
  }
  else if(res.data.user_type == 2)
  {
      toast.success('Laborer created successfully! Sign in now')  
  }
  browserHistory.push('/signin');
  var def_user_type = res.data.user_type;
  return {
    type: REGISTER_SUCCESS,
    res,
    def_user_type
  };
}

export function registerFailure(res) {
  toast.error(res.message)
  // alert('registration failed: '+res.message);
  return {
    type: REGISTER_FAILURE,
  };
}

export function loadUserProps(user) {
  return {
    type: LOAD_USER_PROPS,
    user
  };
}

export function updateUserInfoRequest(newUserInfo) {
  return (dispatch) => {
    let token = cookie.load('mernAuth').t;
    return callApi('updateUserInfo', 'post', newUserInfo,
      {
        'content-type': 'application/json',
        'Authorization': token,
      }
    ).then(res => {
      if(res.user) {
        dispatch(updateUserInfoSuccess(res.user));
      }
      else {
        dispatch(updateUserInfoFailure(res));
      }
    });
  };
}


export function updateUserInfoSuccess(user) {
  alert('profile updated successfully');
  return {
    type: UPDATE_USER_INFO_SUCCESS,
    user,
  };
}

export function updateUserInfoFailure(res) {
  alert('update failed: '+res.err);
  return {
    type: UPDATE_USER_INFO_FAILURE,
  };
}