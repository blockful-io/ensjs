import { BaseError, decodeFunctionResult, encodeFunctionData, getContractError, } from 'viem';
import { getChainContractAddress } from '../../contracts/getChainContractAddress';
import { nameWrapperGetDataSnippet } from '../../contracts/nameWrapper';
import { EMPTY_ADDRESS } from '../../utils/consts';
import { decodeFuses } from '../../utils/fuses';
import { generateFunction, } from '../../utils/generateFunction';
import { makeSafeSecondsDate } from '../../utils/makeSafeSecondsDate';
import { namehash } from '../../utils/normalise';
const encode = (client, { name }) => {
    const address = getChainContractAddress({
        client,
        contract: 'ensNameWrapper',
    });
    const args = [BigInt(namehash(name))];
    return {
        to: address,
        data: encodeFunctionData({
            abi: nameWrapperGetDataSnippet,
            functionName: 'getData',
            args,
        }),
        passthrough: { address, args },
    };
};
const decode = async (_client, data, passthrough) => {
    if (typeof data === 'object')
        throw getContractError(data, {
            abi: nameWrapperGetDataSnippet,
            functionName: 'getData',
            args: passthrough.args,
            address: passthrough.address,
        });
    const [owner, fuses, expiry] = decodeFunctionResult({
        abi: nameWrapperGetDataSnippet,
        functionName: 'getData',
        data,
    });
    if (owner === EMPTY_ADDRESS) {
        return null;
    }
    const fuseObj = decodeFuses(fuses);
    const expiryDate = expiry > 0 ? makeSafeSecondsDate(expiry) : null;
    return {
        fuses: {
            ...fuseObj,
            value: fuses,
        },
        expiry: expiryDate
            ? {
                date: expiryDate,
                value: expiry,
            }
            : null,
        owner,
    };
};
/**
 * Gets the wrapper data for a name.
 * @param client - {@link ClientWithEns}
 * @param parameters - {@link GetWrapperDataParameters}
 * @returns Wrapper data object, or null if name is not wrapped. {@link GetWrapperDataReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { getWrapperData } from '@ensdomains/ensjs/public'
 *
 * const client = createPublicClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: http(),
 * })
 * const result = await getWrapperData(client, { name: 'ilikelasagna.eth' })
 */
const getWrapperData = generateFunction({ encode, decode });
export default getWrapperData;
//# sourceMappingURL=getWrapperData.js.map