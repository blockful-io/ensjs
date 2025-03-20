import { toHex, } from 'viem';
import { sendTransaction } from 'viem/actions';
import { packetToBytes } from 'viem/ens';
import { encodeSetContentHash } from '../../utils/encoders/encodeSetContentHash.js';
import { namehash } from '../../utils/normalise.js';
import { getRevertErrorData, handleWildcardWritingRevert, } from '../../utils/wildcardWriting.js';
export const makeFunctionData = (_wallet, { name, contentHash, resolverAddress }) => {
    return {
        to: resolverAddress,
        data: encodeSetContentHash({ namehash: namehash(name), contentHash }),
    };
};
/**
 * Sets the content hash record for a name on a resolver.
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link SetContentHashRecordParameters}
 * @returns Transaction hash. {@link SetContentHashRecordReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { setContentHashRecord } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await setContentHashRecord(wallet, {
 *   name: 'ens.eth',
 *   value: 'ipns://k51qzi5uqu5djdczd6zw0grmo23j2vkj9uzvujencg15s5rlkq0ss4ivll8wqw',
 *   resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
 * })
 * // 0x...
 */
async function setContentHashRecord(wallet, { name, contentHash, resolverAddress, ...txArgs }) {
    const data = makeFunctionData(wallet, {
        name,
        contentHash,
        resolverAddress,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    try {
        return await sendTransaction(wallet, writeArgs);
    }
    catch (error) {
        const errorData = getRevertErrorData(error);
        if (!errorData)
            throw error;
        const txHash = await handleWildcardWritingRevert(wallet, errorData, toHex(packetToBytes(name)), writeArgs.data, (txArgs.account || wallet.account));
        if (!txHash)
            throw error;
        return txHash;
    }
}
setContentHashRecord.makeFunctionData = makeFunctionData;
export default setContentHashRecord;
//# sourceMappingURL=setContentHashRecord.js.map