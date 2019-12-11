/**
 * Main store function
 */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { ApolloClient, ApolloProvider } from 'react-apollo';
import DevTools from './modules/Web/components/DevTools';

import rootReducer from './reducers';

const client = new ApolloClient();

export function configureStore(initialState = {}) {
    // Middleware and store enhancers
    const enhancers = [
      applyMiddleware(thunk),
    ];

    if(process.env.CLIENT && process.env.NODE_ENV === 'development'){
      enhancers.push(window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument());
      // enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION : DevTools.instrument());
    }
    const store = createStore(rootReducer, initialState, compose(applyMiddleware(client.middleware()), ...enhancers));
    
    // For hot reloading reducers
    if (module.hot) {
      // Enable Webpack hot module replacement for reducers
      module.hot.accept('./reducers', () => {
        const nextReducer = require('./reducers').default; // eslint-disable-line global-require
        store.replaceReducer(nextReducer);
      });
    }
    return store;
}
