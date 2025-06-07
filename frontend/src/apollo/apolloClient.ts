import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URI,
});

const authLink = setContext((_, { headers }) => {
    const token = sessionStorage.getItem("token");
    return {
        headers: {
            ...headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    };
});

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(createClient({
    url: import.meta.env.VITE_GRAPHQL_WS_URI, // e.g. ws://localhost:4000/graphql
    connectionParams: () => {
        const token = sessionStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    },
}));

// Use split to send data to each link depending on operation type
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    authLink.concat(httpLink)
);

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});

export default client;