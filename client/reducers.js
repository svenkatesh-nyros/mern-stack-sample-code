/**
 * Root Reducer
 */
import { combineReducers } from 'redux';
import { ApolloClient, ApolloProvider } from 'react-apollo';

// Import Reducers
import auth from './modules/Auth/AuthReducer';
import labors from './modules/Labors/LaborReducer';
import services from './modules/Services/ServiceReducer';
import noty from './modules/NotyReducer';

const client = new ApolloClient();
// Combine all reducers into one root reducer
export default combineReducers({
  auth,
  labors,
  services,
  noty,
  apollo: client.reducer()
});
