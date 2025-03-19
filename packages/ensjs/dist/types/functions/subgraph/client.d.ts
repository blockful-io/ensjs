import type { RequestMiddleware, ResponseMiddleware } from 'graphql-request';
import { GraphQLClient } from 'graphql-request';
import type { ClientWithEns } from '../../contracts/consts';
export declare const requestMiddleware: RequestMiddleware;
export declare const responseMiddleware: ResponseMiddleware;
export declare const createSubgraphClient: ({ client }: {
    client: ClientWithEns;
}) => GraphQLClient;
//# sourceMappingURL=client.d.ts.map