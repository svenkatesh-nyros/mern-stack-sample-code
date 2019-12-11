import { GET_NOTY } from './NotyActions';
import { toast } from "react-toastify";

const initialState = {};

const WebReducer = (state = initialState, action) => {
      switch (action.type) {
        case GET_NOTY : {
            var mode = action.mode;
            switch (mode){
              case 'success': 
                toast.success(action.message)
                return { 
                    ...state, 
                };
              case 'warn':
                toast.warn(action.message)
                return {
                    ...state
                  };
              case 'error':
                toast.error(action.message)
                return {
                    ...state
                  };
              case 'info':
                toast.info(action.message)
                return {
                    ...state,
                  };
              default :  
                toast(action.message)
                return {
                  ...state
                };
            }
        };
        default:
          return state;
      }
};

export default NotyReducer;
