import { type Address, type Hex, type TypedDataDefinition, type Transport, type Account, type Hash, BaseError } from 'viem';
import type { ChainWithEns, WalletClientWithAccount } from '../contracts/consts.js';
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
export declare class NameUnavailableError extends BaseError {
    name: string;
    constructor(name: string);
}
interface ErrorResult {
    errorName: string;
    args?: readonly unknown[];
}
export declare function handleWildcardWritingRevert<TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: WalletClientWithAccount<Transport, TChain, TAccount>, errorResult: ErrorResult, encodedName: Hex, calldata: Hex, account: Address, expiry?: bigint): Promise<Hash | undefined>;
export declare function handleOffchainTransaction<TChain extends ChainWithEns, TAccount extends Account | undefined>(wallet: WalletClientWithAccount<Transport, TChain, TAccount>, encodedName: Hex, calldata: Hex, account: Address, expiry?: bigint): Promise<Hash>;
export {};
//# sourceMappingURL=wildcardWriting.d.ts.map