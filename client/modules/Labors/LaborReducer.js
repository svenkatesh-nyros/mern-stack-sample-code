import { GET_LABORS } from './LaborActions';

import { toast } from "react-toastify";
import { browserHistory } from 'react-router';
import cookie from 'react-cookie';


  const initialState = { 
      labors: [], 
  };

  const WebReducer = (state = initialState, action) => {
      switch (action.type) {
        case GET_LABORS : 
          return {
            ...state,
            labors: action.data,
          };
        default:
          return state;
      }
  };

export default WebReducer;
