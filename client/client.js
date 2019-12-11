import  ApolloClient, { createNetworkInterface } from 'react-apollo';
// import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';

// const NETWORK_INTERFACE_URL = 'https://api.graph.cool/simple/v1/API_KEY'
// const SUBSCRIPTION_CLIENT_URL = 'wss://subscriptions.graph.cool/v1/API_KEY';
const NETWORK_INTERFACE_URL = 'http://203.193.173.125:9002/graphql';
// const SUBSCRIPTION_CLIENT_URL = 'wss://subscriptions.graph.cool/v1/API_KEY';

const networkInterface = createNetworkInterface({ uri: NETWORK_INTERFACE_URL });
// const wsClient = new SubscriptionClient(SUBSCRIPTION_CLIENT_URL, {
// 	reconnect: true
// });

// const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
//   networkInterface,
//   wsClient
// );

const client = new ApolloClient({
  networkInterface: networkInterface,
});


export default client;