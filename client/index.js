/**
 * Client entry point
 */
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './App';
import { configureStore } from './store';
import client from './client.js';
// Initialize store
const store = configureStore(window.__INITIAL_STATE__);
const mountApp = document.getElementById('root');

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

render(
  <ApolloProvider client={client} store={store}>
    <AppContainer>
      <App client={client} store={store} />
    </AppContainer>
  </ApolloProvider>,
  mountApp
);

// For hot reloading of react components
if (module.hot) {
  module.hot.accept('./App', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const NextApp = require('./App').default; // eslint-disable-line global-require
    render(
      <ApolloProvider client={client} store={store}>
        <AppContainer>
          <NextApp store={store} />
        </AppContainer>
      </ApolloProvider>,
      mountApp
    );
  });
}
