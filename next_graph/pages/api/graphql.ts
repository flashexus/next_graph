import { ApolloServer, gql } from 'apollo-server-micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { ObjectID } from 'bson';

const prisma = new PrismaClient();
const users = [
  { id: '1', name: 'John Doe', email: 'john@test.com' },
  { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
];
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    hello: String
    users: [User]
    usersm: [User]
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: Int!, name: String!, email: String!): User
    deleteUser(id: Int!): User
  }
`;

interface Context {
  prisma: PrismaClient;
}

const resolvers = {
  Query: {
    hello: () => 'Hello World',
    users: () => users,
    usersm: async (parent: undefined, args: {}, context: Context) => {
      return await context.prisma.user.findMany();
    }
  },
  Mutation: {
    createUser: ( parent: undefined,args:{ name:string, email:string }, context: Context ) => {
      const id  = new ObjectID().toString();

      return context.prisma.user.create({
        data: {
          name:args.name,
          email:args.email,
          id:id
        }
      })
    },
    updateUser:(parent: undefined,args:{ name:string, email:string, id:string }) => {
      return prisma.user.update({
        where:{
          id: args.id
        },
        data:{
          name: args.name,
          email: args.email,
        }
      })
    },
    deleteUser: (parent: undefined, args:{id:string}) => {
      return prisma.user.delete({
        where:{id: args.id}
      })
    }
  }
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    prisma,
  },
});

const startServer = apolloServer.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  await startServer;
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};