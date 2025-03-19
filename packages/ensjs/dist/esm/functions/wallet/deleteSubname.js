import { encodeFunctionData, } from 'viem';
import { sendTransaction } from 'viem/actions';
import { getChainContractAddress } from '../../contracts/getChainContractAddress';
import { nameWrapperSetRecordSnippet, nameWrapperSetSubnodeRecordSnippet, } from '../../contracts/nameWrapper';
import { registrySetRecordSnippet, registrySetSubnodeRecordSnippet, } from '../../contracts/registry';
import { InvalidContractTypeError, UnsupportedNameTypeError, } from '../../errors/general';
import { EMPTY_ADDRESS } from '../../utils/consts';
import { getNameType } from '../../utils/getNameType';
import { makeLabelNodeAndParent } from '../../utils/makeLabelNodeAndParent';
import { namehash } from '../../utils/normalise';
export const makeFunctionData = (wallet, { name, contract, asOwner }) => {
    const nameType = getNameType(name);
    if (nameType !== 'eth-subname' && nameType !== 'other-subname')
        throw new UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: ['eth-subname', 'other-subname'],
            details: 'Cannot delete a name that is not a subname',
        });
    switch (contract) {
        case 'registry': {
            const registryAddress = getChainContractAddress({
                client: wallet,
                contract: 'ensRegistry',
            });
            if (asOwner)
                return {
                    to: registryAddress,
                    data: encodeFunctionData({
                        abi: registrySetRecordSnippet,
                        functionName: 'setRecord',
                        args: [namehash(name), EMPTY_ADDRESS, EMPTY_ADDRESS, BigInt(0)],
                    }),
                };
            const { labelhash, parentNode } = makeLabelNodeAndParent(name);
            return {
                to: registryAddress,
                data: encodeFunctionData({
                    abi: registrySetSubnodeRecordSnippet,
                    functionName: 'setSubnodeRecord',
                    args: [
                        parentNode,
                        labelhash,
                        EMPTY_ADDRESS,
                        EMPTY_ADDRESS,
                        BigInt(0),
                    ],
                }),
            };
        }
        case 'nameWrapper': {
            const nameWrapperAddress = getChainContractAddress({
                client: wallet,
                contract: 'ensNameWrapper',
            });
            if (asOwner)
                return {
                    to: nameWrapperAddress,
                    data: encodeFunctionData({
                        abi: nameWrapperSetRecordSnippet,
                        functionName: 'setRecord',
                        args: [namehash(name), EMPTY_ADDRESS, EMPTY_ADDRESS, BigInt(0)],
                    }),
                };
            const { label, parentNode } = makeLabelNodeAndParent(name);
            return {
                to: nameWrapperAddress,
                data: encodeFunctionData({
                    abi: nameWrapperSetSubnodeRecordSnippet,
                    functionName: 'setSubnodeRecord',
                    args: [
                        parentNode,
                        label,
                        EMPTY_ADDRESS,
                        EMPTY_ADDRESS,
                        BigInt(0),
                        0,
                        BigInt(0),
                    ],
                }),
            };
        }
        default:
            throw new InvalidContractTypeError({
                contractType: contract,
                supportedContractTypes: ['registry', 'nameWrapper'],
            });
    }
};
/**
 * Deletes a subname
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link DeleteSubnameParameters}
 * @returns Transaction hash. {@link DeleteSubnameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { deleteSubname } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: mainnetWithEns,
 *   transport: custom(window.ethereum),
 * })
 * const hash = await deleteSubname(wallet, {
 *   name: 'sub.ens.eth',
 *   contract: 'registry',
 * })
 * // 0x...
 */
async function deleteSubname(wallet, { name, contract, asOwner, ...txArgs }) {
    const data = makeFunctionData(wallet, {
        name,
        contract,
        asOwner,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
deleteSubname.makeFunctionData = makeFunctionData;
export default deleteSubname;
//# sourceMappingURL=deleteSubname.js.map