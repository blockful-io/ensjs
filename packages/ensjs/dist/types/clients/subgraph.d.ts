import { type Client, type ClientConfig, type PublicRpcSchema, type Transport } from 'viem';
import type { ChainWithBaseContracts, ChainWithEns } from '../contracts/consts';
import type { Prettify } from '../types';
import { type EnsSubgraphActions } from './decorators/subgraph';
export type EnsSubgraphClientConfig<TTransport extends Transport = Transport, TChain extends ChainWithBaseContracts = ChainWithBaseContracts> = Pick<ClientConfig<TTransport, TChain>, 'batch' | 'key' | 'name' | 'pollingInterval' | 'transport'> & {
    chain: TChain;
};
export type EnsSubgraphClient<TTransport extends Transport = Transport, TChain extends ChainWithEns = ChainWithEns> = Prettify<Client<TTransport, TChain, undefined, PublicRpcSchema, EnsSubgraphActions>>;
/**
 * Creates a ENS Subgraph Client with a given [Transport](https://viem.sh/docs/clients/intro.html) configured for a [Chain](https://viem.sh/docs/clients/chains.html).
 *
 * @param config - {@link EnsSubgraphClientConfig}
 * @returns An ENS Subgraph Client. {@link EnsSubgraphClient}
 *
 * @example
 * import { http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { createEnsSubgraphClient } from '@ensdomains/ensjs'
 *
 * const client = createEnsSubgraphClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 */
export declare const createEnsSubgraphClient: <TTransport extends Transport, TChain extends ChainWithBaseContracts>({ batch, chain, key, name, transport, pollingInterval, }: EnsSubgraphClientConfig<TTransport, TChain>) => {
    account: undefined;
    batch?: {
        multicall?: boolean | {
            batchSize?: number | undefined;
            wait?: number | undefined;
        } | undefined;
    } | undefined;
    cacheTime: number;
    ccipRead?: false | {
        request?: ((parameters: import("viem").CcipRequestParameters) => Promise<`0x${string}`>) | undefined;
    } | undefined;
    chain: ChainWithEns<TChain>;
    key: string;
    name: string;
    pollingInterval: number;
    request: import("viem").EIP1193RequestFn<PublicRpcSchema>;
    transport: ReturnType<TTransport>["config"] & ReturnType<TTransport>["value"];
    type: string;
    uid: string;
    getDecodedName: ({ name, allowIncomplete, }: import("../subgraph").GetDecodedNameParameters) => Promise<import("../subgraph").GetDecodedNameReturnType>;
    getNameHistory: ({ name, }: import("../subgraph").GetNameHistoryParameters) => Promise<import("../subgraph").GetNameHistoryReturnType>;
    getNamesForAddress: ({ address, filter, orderBy, orderDirection, pageSize, previousPage, }: import("../subgraph").GetNamesForAddressParameters) => Promise<import("../subgraph").GetNamesForAddressReturnType>;
    getSubgraphRecords: ({ name, resolverAddress, }: import("../subgraph").GetSubgraphRecordsParameters) => Promise<import("../subgraph").GetSubgraphRecordsReturnType>;
    getSubgraphRegistrant: ({ name, }: import("../subgraph").GetSubgraphRegistrantParameters) => Promise<import("../subgraph").GetSubgraphRegistrantReturnType>;
    getSubnames: ({ name, searchString, allowExpired, allowDeleted, orderBy, orderDirection, pageSize, previousPage, }: import("../subgraph").GetSubnamesParameters) => Promise<import("../subgraph").GetSubnamesReturnType>;
    extend: <const client extends {
        [x: string]: unknown;
        account?: undefined;
        batch?: undefined;
        cacheTime?: undefined;
        ccipRead?: undefined;
        chain?: undefined;
        key?: undefined;
        name?: undefined;
        pollingInterval?: undefined;
        request?: undefined;
        transport?: undefined;
        type?: undefined;
        uid?: undefined;
    } & import("viem").ExactPartial<Pick<import("viem").PublicActions<TTransport, ChainWithEns<TChain>, undefined>, "getChainId" | "prepareTransactionRequest" | "sendRawTransaction" | "call" | "createContractEventFilter" | "createEventFilter" | "estimateContractGas" | "estimateGas" | "getBlock" | "getBlockNumber" | "getContractEvents" | "getEnsText" | "getFilterChanges" | "getGasPrice" | "getLogs" | "getTransaction" | "getTransactionCount" | "getTransactionReceipt" | "readContract" | "simulateContract" | "uninstallFilter" | "watchBlockNumber" | "watchContractEvent"> & Pick<import("viem").WalletActions<ChainWithEns<TChain>, undefined>, "sendTransaction" | "writeContract">>>(fn: (client: Client<TTransport, ChainWithEns<TChain>, undefined, PublicRpcSchema, EnsSubgraphActions>) => client) => Client<TTransport, ChainWithEns<TChain>, undefined, PublicRpcSchema, { [K in keyof client]: client[K]; } & EnsSubgraphActions>;
};
//# sourceMappingURL=subgraph.d.ts.map