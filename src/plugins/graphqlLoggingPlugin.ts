import { Plugin } from '@nestjs/graphql';
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';
import { GraphQLRequestContext } from 'apollo-server-types';

@Plugin()
export class GraphqlLoggingPlugin implements ApolloServerPlugin {
  requestDidStart(
    requestContext: GraphQLRequestContext,
  ): GraphQLRequestListener {
    const {
      request: { operationName, query, variables },
    } = requestContext;
    if (operationName == 'IntrospectionQuery') {
      return;
    }
    return {
      async didEncounterErrors({ errors }) {
        const message = {
          errors: JSON.stringify(errors, null, 2),
        };
        console.error(message);
      },
      async willSendResponse() {
        console.log({ operationName, query, variables });
      },
    };
  }
}
