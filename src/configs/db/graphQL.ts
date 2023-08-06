import { Logger } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import * as path from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

const graphQLConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
//   typePaths: [
//     path.join(__dirname, '/../', 'vendors/**/*.graphql'),
//     path.join(__dirname, '/../', 'modules/**/*.graphql'),
//   ],
  path: '/graphql',
  // debug: true,
  autoSchemaFile: true,
  playground: {
    endpoint: '/graphql',
  },
  context: ({ req, res }) => ({ req, res }),
//   installSubscriptionHandlers: true,
  csrfPrevention: false,
  formatError: (error: GraphQLError): any => {
    if (process.env.NODE_ENV !== 'test') {
      new Logger('GraphQLError').error(error);
    }
    return error.message;
  },
};

export default graphQLConfig;
