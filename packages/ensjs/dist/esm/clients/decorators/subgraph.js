import getDecodedName, {} from '../../functions/subgraph/getDecodedName';
import getNameHistory, {} from '../../functions/subgraph/getNameHistory';
import getNamesForAddress, {} from '../../functions/subgraph/getNamesForAddress';
import getSubgraphRecords, {} from '../../functions/subgraph/getSubgraphRecords';
import getSubgraphRegistrant, {} from '../../functions/subgraph/getSubgraphRegistrant';
import getSubnames, {} from '../../functions/subgraph/getSubnames';
/**
 * Extends the viem client with ENS subgraph actions
 * @param client - The viem {@link Client} object to add the ENS subgraph actions to
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts, ensSubgraphActions } from '@ensdomains/ensjs'
 *
 * const clientWithEns = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * }).extend(ensSubgraphActions)
 */
export const ensSubgraphActions = (client) => ({
    getDecodedName: (parameters) => getDecodedName(client, parameters),
    getNameHistory: (parameters) => getNameHistory(client, parameters),
    getNamesForAddress: (parameters) => getNamesForAddress(client, parameters),
    getSubgraphRecords: (parameters) => getSubgraphRecords(client, parameters),
    getSubgraphRegistrant: (parameters) => getSubgraphRegistrant(client, parameters),
    getSubnames: (parameters) => getSubnames(client, parameters),
});
//# sourceMappingURL=subgraph.js.map