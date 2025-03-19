import type { BaseError, Hex } from 'viem';
import type { ClientWithEns } from '../../contracts/consts';
import type { GenericPassthrough, Prettify, SimpleTransactionRequest } from '../../types';
import { type GeneratedFunction } from '../../utils/generateFunction';
import { type InternalGetTextParameters, type InternalGetTextReturnType } from './_getText';
export type GetTextRecordParameters = Prettify<InternalGetTextParameters & {
    /** Batch gateway URLs to use for resolving CCIP-read requests. */
    gatewayUrls?: string[];
}>;
export type GetTextRecordReturnType = Prettify<InternalGetTextReturnType>;
declare const encode: (client: ClientWithEns, { name, key, gatewayUrls }: Omit<GetTextRecordParameters, 'strict'>) => SimpleTransactionRequest;
declare const decode: (client: ClientWithEns, data: Hex | BaseError, passthrough: GenericPassthrough, { strict, gatewayUrls, }: Pick<GetTextRecordParameters, 'strict' | 'gatewayUrls'>) => Promise<GetTextRecordReturnType>;
type BatchableFunctionObject = GeneratedFunction<typeof encode, typeof decode>;
/**
 * Gets a text record for a name.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetTextRecordParameters}
 * @returns Text record string, or null if none is found. {@link GetTextRecordReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getTextRecord } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getTextRecord(client, { name: 'ens.eth', key: 'com.twitter' })
 * // ensdomains
 */
declare const getTextRecord: ((client: ClientWithEns, { name, key, strict, gatewayUrls }: GetTextRecordParameters) => Promise<GetTextRecordReturnType>) & BatchableFunctionObject;
export default getTextRecord;
//# sourceMappingURL=getTextRecord.d.ts.map