import { GET_SERVICES, GET_CUSTOM_SERVICES, GET_SERVICES_BY_LOCATION,  } from './ServiceActions';

import { toast } from "react-toastify";
import { browserHistory } from 'react-router';
import cookie from 'react-cookie';

// Initial State
  const initialState = { 
      services:[], 
      custom_services:[], 
      services_by_location: [],
  };

  const ServiceReducer = (state = initialState, action) => {
      switch (action.type) {
        case GET_SERVICES : 
          return {
            ...state,
            services: action.data,
          };
        case GET_CUSTOM_SERVICES: 
          return {
            ...state,
            custom_services: action.data,
          };
        case GET_SERVICES_BY_LOCATION : 
          return {
            ...state,
            services_by_location: action.data,
          };
        default:
          return state;
      }
  };

// Export Reducer
export default ServiceReducer;
