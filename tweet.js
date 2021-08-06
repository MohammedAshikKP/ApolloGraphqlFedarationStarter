import { buildFederatedSchema } from '@apollo/federation';
import { ApolloServer, gql } from 'apollo-server';

const tweetsArray =[
    {
        id:100,
        text:'tweet by user 1',
        userId:1
    },
        {
        id:101,
        text:'tweet by user 2',
        userId:2
    },    
    {
        id:103,
        text:'tweet by user 3',
        userId:3
    }
]

const typeDefs = gql`

  extend type Query {       
    tweet(id: ID!): Tweet
    tweets: [Tweet]
  }


  extend type Mutation {
    createTweet(tweetPayload: TweetPayload): Tweet
  }


  type Tweet {
    text: String
    id: ID!
    creator: User
  }



  extend type User @key(fields: "id") {
    id: ID! @external
    tweets: [Tweet]
  }


  input TweetPayload {
    userId: String
    text: String
  }




`;

const resolvers = {
  Query: {
    tweet: async (_, { id }) => {
      const currentTweet = tweetsArray.find((tweet) => tweet.id == id)
      return currentTweet;
    },
    tweets: async () => {
      return tweetsArray;
    },
  },
  /***
   * Here this service dnt knw how to resolve creator field in Tweet type
   * 
   * whenever creator field  need to be solved 'User' query will be called ,
   * as we have extended the User type here  this will invoke '__resolveReference' in user service
   */
  Tweet: {
    creator: (tweet) => ({ __typename: 'User', id: tweet.userId }),
  },
  User: {
    tweets: async (user) => {
      const tweetsByUser = tweetsArray.find((tweet)=>tweet.userId == user.id)
      return tweetsByUser;
    },
  },
  Mutation: {
    createTweet: async (_, { tweetPayload: { text, userId } }) => {
      const newTweet = new Tweet({ text, userId });
      //create new user
      return createdTweet;
    },
  },
};


const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }]),
});

server.listen({ port: 5002 }).then(({ url }) => {
  console.log(`Tweet service ready at url: ${url}`);
});