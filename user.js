import { buildFederatedSchema } from '@apollo/federation';
import { ApolloServer, gql } from 'apollo-server';


const usersArray =[
    {
        id:1,
        username: 'John',
        email:'john@gmail.com'
    },
    {
        id:2,
        username:'Bob',
        email:'bob@gmail.com'
    },
    {
        id:3,
        username:'Lal',
        email:'lal@gmail.com'
    }
];


const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    username: String
    email:String
  }

  input UserPayload {
    username: String!
  }


  extend type Query {
    users: [User]
    user(id: ID!): User
  }
  extend type Mutation {
    createUser(userPayload: UserPayload): User
  }

`;

const resolvers = {
  Query: {
    users: async () => {
      return usersArray
    },
    user: async (_, { id }) => {
      const currentUser =   usersArray.find((user)=>user.id == id)
      return currentUser;
    },
  },
  //called when User query is called from some other services where user type is extended
  User: {
    __resolveReference: async (ref) => {
       const currentUser =   usersArray.find((user)=>user.id == ref.id)
      return currentUser;
    },
  },
  Mutation: {
    createUser: async (_, { userPayload: { username } }) => {
      const user = new User({ username });
      const createdUser = await user.save();
      return createdUser;
    },
  },
};



const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen({ port: 5001 }).then(({ url }) => {
  console.log(`User service ready at url: ${url}`);
});