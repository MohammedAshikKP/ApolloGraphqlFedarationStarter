import { ApolloServer } from 'apollo-server';
import { ApolloGateway } from '@apollo/gateway';

const gateway = new ApolloGateway({
  serviceList: [
      { name: 'users', url: 'http://localhost:5001' },
      { name: 'tweets', url: 'http://localhost:5002' },
    ],
});

const server = new ApolloServer({ gateway, subscriptions: false });

server.listen({ port: 5000 }).then(({ url }) => {
  console.log(`Server ready at url: ${url}`);
});