import { type Address, type Hex, type TypedDataDefinition, type Transport, type Account, type Hash, BaseError } from 'viem';
import type { ChainWithEns, ClientWithEns, WalletClientWithAccount } from '../contracts/consts.js';
export declare const WILDCARD_WRITING_REGISTER_INTERFACE_ID: "0x79dc93d7";
export declare class WildcardError extends BaseError {
}
export declare function getRevertErrorData(err: unknown): {
    errorName: string;
    args: unknown[];
} | undefined;
export type CcipRequestParameters = {
    data: Hex;
    sender: Address;
    urls: readonly string[];
    signature?: Pick<TypedDataDefinition, 'domain' | 'message'> & {
        signature: Hex;
    };
};
export declare function ccipRequest({ data, sender, signature, urls, }: CcipRequestParameters): Promise<Response>;
export declare class SubnameUnavailableError extends BaseError {
    name: string;
    constructor(name: string);
}
interface ErrorResult {
    errorName: string;
    args?: readonly unknown[];
}
export declare function handleWildcardWritingRevert<TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: WalletClientWithAccount<Transport, TChain, TAccount>, errorResult: ErrorResult, encodedName: Hex, calldata: Hex, account: Address, expiry?: bigint): Promise<Hash | undefined>;
export declare function handleOffchainTransaction<TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: WalletClientWithAccount<Transport, TChain, TAccount>, encodedName: Hex, calldata: Hex, account: Address, expiry?: bigint): Promise<Hash>;
/**
 * Checks whether the ENSIP-20 Wildcard Writing is supported by a given domain's resolver.
 *
 * @param wallet - The wallet client with account information
 * @param name - The domain to gather the resolver for
 * @returns True if the ENSIP-20 Wildcard Writing is supported, false otherwise
 */
export declare function isWildcardWritingSupported(wallet: ClientWithEns, name: string): Promise<boolean>;
export {};
//# sourceMappingURL=wildcardWriting.d.ts.map