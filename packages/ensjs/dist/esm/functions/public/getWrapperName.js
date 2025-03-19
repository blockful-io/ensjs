import { BaseError, decodeFunctionResult, encodeFunctionData, getContractError, hexToBytes, } from 'viem';
import { getChainContractAddress } from '../../contracts/getChainContractAddress';
import { nameWrapperNamesSnippet } from '../../contracts/nameWrapper';
import { generateFunction, } from '../../utils/generateFunction';
import { bytesToPacket } from '../../utils/hexEncodedName';
import { namehash } from '../../utils/normalise';
const encode = (client, { name }) => {
    const address = getChainContractAddress({
        client,
        contract: 'ensNameWrapper',
    });
    const args = [namehash(name)];
    return {
        to: address,
        data: encodeFunctionData({
            abi: nameWrapperNamesSnippet,
            functionName: 'names',
            args,
        }),
        passthrough: { address, args },
    };
};
const decode = async (_client, data, passthrough) => {
    if (typeof data === 'object')
        throw getContractError(data, {
            abi: nameWrapperNamesSnippet,
            functionName: 'names',
            args: passthrough.args,
            address: passthrough.address,
        });
    const result = decodeFunctionResult({
        abi: nameWrapperNamesSnippet,
        functionName: 'names',
        data,
    });
    if (!result || result === '0x' || BigInt(result) === 0n)
        return null;
    return bytesToPacket(hexToBytes(result));
};
/**
 * Gets the full name for a name with unknown labels from the NameWrapper.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetWrapperNameParameters}
 * @returns Full name, or null if name was not found. {@link GetWrapperNameReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getWrapperName } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getWrapperName(client, { name: '[4ca938ec1b323ca71c4fb47a712abb68cce1cabf39ea4d6789e42fbc1f95459b].eth' })
 * // wrapped.eth
 */
const getWrapperName = generateFunction({ encode, decode });
export default getWrapperName;
//# sourceMappingURL=getWrapperName.js.map