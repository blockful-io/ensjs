import { type Hex } from 'viem';
import type { Prettify } from '../types';
import type { EncodedAbi } from './encoders/encodeAbi';
import { type EncodeSetAddrParameters } from './encoders/encodeSetAddr';
import { type EncodeSetTextParameters } from './encoders/encodeSetText';
export type RecordOptions = Prettify<{
    /** Clears all current records */
    clearRecords?: boolean;
    /** ContentHash value */
    contentHash?: string | null;
    /** Array of text records */
    texts?: Omit<EncodeSetTextParameters, 'namehash'>[];
    /** Array of coin records */
    coins?: Omit<EncodeSetAddrParameters, 'namehash'>[];
    /** ABI value */
    abi?: EncodedAbi | EncodedAbi[];
}>;
export declare const generateRecordCallArray: ({ namehash, clearRecords, contentHash, texts, coins, abi, }: {
    namehash: Hex;
} & {
    clearRecords?: boolean | undefined;
    contentHash?: string | null | undefined;
    texts?: Omit<EncodeSetTextParameters, "namehash">[] | undefined;
    coins?: Omit<EncodeSetAddrParameters, "namehash">[] | undefined;
    abi?: EncodedAbi | EncodedAbi[] | undefined;
}) => Hex[];
//# sourceMappingURL=generateRecordCallArray.d.ts.map