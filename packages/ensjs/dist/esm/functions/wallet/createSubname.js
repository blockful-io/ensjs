import { encodeFunctionData, toHex, decodeErrorResult, zeroAddress, zeroHash, } from 'viem';
import * as chains from 'viem/chains';
import { packetToBytes } from 'viem/ens';
import { sendTransaction, readContract } from 'viem/actions';
import { getChainContractAddress } from '../../contracts/getChainContractAddress';
import { nameWrapperSetSubnodeRecordSnippet } from '../../contracts/nameWrapper';
import { registrySetSubnodeRecordSnippet } from '../../contracts/registry';
import { InvalidContractTypeError, UnsupportedNameTypeError, } from '../../errors/general';
import { encodeFuses, ParentFuses, } from '../../utils/fuses';
import { getNameType } from '../../utils/getNameType';
import { makeLabelNodeAndParent } from '../../utils/makeLabelNodeAndParent';
import { expiryToBigInt, wrappedLabelLengthCheck, makeDefaultExpiry, } from '../../utils/wrapper';
import getWrapperData from '../public/getWrapperData';
import { BaseError } from '../../errors/base';
import { erc165SupportsInterfaceSnippet, offchainRegisterSnippet, 
// universalResolverResolveSnippet,
WILDCARD_WRITING_INTERFACE_ID, universalResolverFindResolverSnippet, universalResolverResolveSnippet, } from '../../contracts/index';
import { ccipRequest, getRevertErrorData, randomSecret, } from '../../utils/registerHelpers';
export const makeFunctionData = (wallet, { name, contract, owner, resolverAddress = getChainContractAddress({
    client: wallet,
    contract: 'ensPublicResolver',
}), expiry, fuses, }) => {
    const nameType = getNameType(name);
    if (nameType === 'tld' || nameType === 'root')
        throw new UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: [
                'eth-2ld',
                'eth-subname',
                'other-2ld',
                'other-subname',
            ],
        });
    const { label, labelhash, parentNode } = makeLabelNodeAndParent(name);
    switch (contract) {
        case 'registry': {
            return {
                to: getChainContractAddress({
                    client: wallet,
                    contract: 'ensRegistry',
                }),
                data: encodeFunctionData({
                    abi: registrySetSubnodeRecordSnippet,
                    functionName: 'setSubnodeRecord',
                    args: [parentNode, labelhash, owner, resolverAddress, BigInt(0)],
                }),
            };
        }
        case 'nameWrapper': {
            wrappedLabelLengthCheck(label);
            const generatedFuses = fuses ? encodeFuses({ input: fuses }) : 0;
            const generatedExpiry = expiry
                ? expiryToBigInt(expiry)
                : makeDefaultExpiry(generatedFuses);
            return {
                to: getChainContractAddress({
                    client: wallet,
                    contract: 'ensNameWrapper',
                }),
                data: encodeFunctionData({
                    abi: nameWrapperSetSubnodeRecordSnippet,
                    functionName: 'setSubnodeRecord',
                    args: [
                        parentNode,
                        label,
                        owner,
                        resolverAddress,
                        BigInt(0),
                        generatedFuses,
                        generatedExpiry,
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
class CreateSubnamePermissionDeniedError extends BaseError {
    constructor({ parentName }) {
        super(`Create subname error: ${parentName} as burned CANNOT_CREATE_SUBDOMAIN fuse`);
        Object.defineProperty(this, "parentName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'CreateSubnamePermissionDeniedError'
        });
        this.parentName = parentName;
    }
}
class CreateSubnameParentNotLockedError extends BaseError {
    constructor({ parentName }) {
        super(`Create subname error: Cannot burn PARENT_CANNOT_CONTROL when ${parentName} has not burned CANNOT_UNWRAP fuse`);
        Object.defineProperty(this, "parentName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'CreateSubnameParentNotLockedError'
        });
        this.parentName = parentName;
    }
}
class OffchainSubnameError extends BaseError {
    constructor(name) {
        super(`Create subname error: ${name} is an offchain domain`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'OffchainSubnameError'
        });
    }
}
class SubnameUnavailableError extends BaseError {
    constructor(name) {
        super(`Create subname error: ${name} is unavailable`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'SubnameUnavailableError'
        });
    }
}
const checkCanCreateSubname = async (wallet, { name, fuses, contract, }) => {
    const [resolver] = await readContract(wallet, {
        address: getChainContractAddress({
            client: wallet,
            contract: 'ensUniversalResolver',
        }),
        abi: universalResolverFindResolverSnippet,
        functionName: 'findResolver',
        args: [toHex(packetToBytes(name))],
    });
    // TODO: check the interface through the resolve function
    const isOffchain = await readContract(wallet, {
        address: resolver,
        abi: erc165SupportsInterfaceSnippet,
        functionName: 'supportsInterface',
        args: [WILDCARD_WRITING_INTERFACE_ID],
    });
    if (isOffchain)
        throw new OffchainSubnameError(name);
    if (contract !== 'nameWrapper')
        return;
    const parentName = name.split('.').slice(1).join('.');
    if (parentName === 'eth')
        return;
    const parentWrapperData = await getWrapperData(wallet, { name: parentName });
    if (parentWrapperData?.fuses?.child?.CANNOT_CREATE_SUBDOMAIN)
        throw new CreateSubnamePermissionDeniedError({ parentName });
    const generatedFuses = fuses ? encodeFuses({ input: fuses }) : 0;
    const isBurningPCC = fuses && BigInt(generatedFuses) & ParentFuses.PARENT_CANNOT_CONTROL;
    const isParentCannotUnwrapBurned = parentWrapperData?.fuses?.child?.CANNOT_UNWRAP;
    if (isBurningPCC && !isParentCannotUnwrapBurned)
        throw new CreateSubnameParentNotLockedError({ parentName });
};
function getChain(chainId) {
    return Object.values(chains).find((chain) => chain.id === chainId);
}
/**
 * Creates a subname
 * @param wallet - {@link ClientWithAccount}
 * @param parameters - {@link CreateSubnameParameters}
 * @returns Transaction hash. {@link CreateSubnameReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { addEnsContracts } from '@ensdomains/ensjs'
 * import { createSubname } from '@ensdomains/ensjs/wallet'
 *
 * const wallet = createWalletClient({
 *   chain: addEnsContracts(mainnet),
 *   transport: custom(window.ethereum),
 * })
 * const hash = await createSubname(wallet, {
 *   name: 'sub.ens.eth',
 *   owner: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
 *   contract: 'registry',
 * })
 * // 0x...
 */
async function createSubname(wallet, { name, contract, owner, resolverAddress, expiry, fuses, extraData = zeroHash, ...txArgs }) {
    try {
        await checkCanCreateSubname(wallet, { name, fuses, contract });
    }
    catch (error) {
        const encodedName = toHex(packetToBytes(name));
        if (error instanceof OffchainSubnameError) {
            const calldata = {
                name: encodedName,
                owner,
                duration: expiry,
                secret: randomSecret(),
                resolver: resolverAddress || zeroAddress,
                extraData,
            };
            try {
                await readContract(wallet, {
                    address: getChainContractAddress({
                        client: wallet,
                        contract: 'ensUniversalResolver',
                    }),
                    abi: universalResolverResolveSnippet,
                    functionName: 'resolve',
                    args: [
                        encodedName,
                        encodeFunctionData({
                            functionName: 'getOperationHandler',
                            abi: offchainRegisterSnippet,
                            args: [
                                encodeFunctionData({
                                    functionName: 'register',
                                    abi: offchainRegisterSnippet,
                                    args: [calldata],
                                }),
                            ],
                        }),
                    ],
                });
            }
            catch (offchainError) {
                const data = getRevertErrorData(offchainError);
                if (!data || !Array.isArray(data.args))
                    throw offchainError;
                const [params] = data.args;
                const errorResult = decodeErrorResult({
                    abi: offchainRegisterSnippet,
                    data: params,
                });
                switch (errorResult?.errorName) {
                    case 'OperationHandledOffchain': {
                        const [domain, url, message] = errorResult.args;
                        if (!txArgs.account && !wallet.account) {
                            throw new Error('Account is required');
                        }
                        const signature = await wallet.signTypedData({
                            account: txArgs.account || wallet.account,
                            domain,
                            message,
                            primaryType: 'Message',
                            types: {
                                Message: [
                                    { name: 'data', type: 'bytes' },
                                    { name: 'sender', type: 'address' },
                                    { name: 'expirationTimestamp', type: 'uint256' },
                                ],
                            },
                        });
                        await ccipRequest({
                            data: message.data,
                            signature: { message, domain, signature },
                            sender: message.sender,
                            urls: [url],
                        });
                        return wallet.chain.id === chains.sepolia.id
                            ? '0x1d4cca15a7f535724328cce2ba2c857b158c940aeffb3c3b4a035645da697b25' // random successful sepolia tx hash
                            : '0xd4a47f4ff92e1bb213a6f733dc531d1baf4d3e439229bf184aa90b39d2bdb26b'; // random successful mainnet tx hash
                    }
                    case 'OperationHandledOnchain': {
                        const currentChain = wallet.chain;
                        try {
                            const [chainId, contractAddress] = errorResult.args;
                            if (wallet.chain.id !== chains.localhost.id &&
                                wallet.chain.id !== Number(chainId)) {
                                await wallet.switchChain({ id: Number(chainId) });
                                const chain = getChain(Number(chainId));
                                if (!chain)
                                    throw new Error('Chain not found');
                                wallet.chain = chain;
                            }
                            const registerParams = (await readContract(wallet, {
                                address: contractAddress,
                                abi: offchainRegisterSnippet,
                                functionName: 'registerParams',
                                args: [encodedName, expiryToBigInt(expiry)],
                            }));
                            if (!registerParams.available) {
                                throw new SubnameUnavailableError(name);
                            }
                            return await sendTransaction(wallet, {
                                ...txArgs,
                                to: contractAddress,
                                value: registerParams.price,
                                data: encodeFunctionData({
                                    functionName: 'register',
                                    abi: offchainRegisterSnippet,
                                    args: [calldata],
                                }),
                                gas: 300000n,
                            });
                        }
                        finally {
                            if (wallet.chain.id !== chains.localhost.id) {
                                await wallet.switchChain({ id: currentChain.id });
                                wallet.chain = currentChain;
                            }
                        }
                    }
                    default:
                        throw offchainError;
                }
            }
        }
    }
    const data = makeFunctionData(wallet, {
        name,
        contract,
        owner,
        resolverAddress,
        expiry,
        fuses,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return sendTransaction(wallet, writeArgs);
}
createSubname.makeFunctionData = makeFunctionData;
export default createSubname;
//# sourceMappingURL=createSubname.js.map