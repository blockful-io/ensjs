"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const chains = require("viem/chains");
const ens_1 = require("viem/ens");
const actions_1 = require("viem/actions");
const getChainContractAddress_js_1 = require("../../contracts/getChainContractAddress.js");
const nameWrapper_js_1 = require("../../contracts/nameWrapper.js");
const registry_js_1 = require("../../contracts/registry.js");
const general_js_1 = require("../../errors/general.js");
const fuses_js_1 = require("../../utils/fuses.js");
const getNameType_js_1 = require("../../utils/getNameType.js");
const makeLabelNodeAndParent_js_1 = require("../../utils/makeLabelNodeAndParent.js");
const wrapper_js_1 = require("../../utils/wrapper.js");
const getWrapperData_js_1 = require("../public/getWrapperData.js");
const base_js_1 = require("../../errors/base.js");
const index_js_1 = require("../../contracts/index.js");
const registerHelpers_js_1 = require("../../utils/registerHelpers.js");
const makeFunctionData = (wallet, { name, contract, owner, resolverAddress = (0, getChainContractAddress_js_1.getChainContractAddress)({
    client: wallet,
    contract: 'ensPublicResolver',
}), expiry, fuses, }) => {
    const nameType = (0, getNameType_js_1.getNameType)(name);
    if (nameType === 'tld' || nameType === 'root')
        throw new general_js_1.UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: [
                'eth-2ld',
                'eth-subname',
                'other-2ld',
                'other-subname',
            ],
        });
    const { label, labelhash, parentNode } = (0, makeLabelNodeAndParent_js_1.makeLabelNodeAndParent)(name);
    switch (contract) {
        case 'registry': {
            return {
                to: (0, getChainContractAddress_js_1.getChainContractAddress)({
                    client: wallet,
                    contract: 'ensRegistry',
                }),
                data: (0, viem_1.encodeFunctionData)({
                    abi: registry_js_1.registrySetSubnodeRecordSnippet,
                    functionName: 'setSubnodeRecord',
                    args: [parentNode, labelhash, owner, resolverAddress, BigInt(0)],
                }),
            };
        }
        case 'nameWrapper': {
            (0, wrapper_js_1.wrappedLabelLengthCheck)(label);
            const generatedFuses = fuses ? (0, fuses_js_1.encodeFuses)({ input: fuses }) : 0;
            const generatedExpiry = expiry
                ? (0, wrapper_js_1.expiryToBigInt)(expiry)
                : (0, wrapper_js_1.makeDefaultExpiry)(generatedFuses);
            return {
                to: (0, getChainContractAddress_js_1.getChainContractAddress)({
                    client: wallet,
                    contract: 'ensNameWrapper',
                }),
                data: (0, viem_1.encodeFunctionData)({
                    abi: nameWrapper_js_1.nameWrapperSetSubnodeRecordSnippet,
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
            throw new general_js_1.InvalidContractTypeError({
                contractType: contract,
                supportedContractTypes: ['registry', 'nameWrapper'],
            });
    }
};
exports.makeFunctionData = makeFunctionData;
class CreateSubnamePermissionDeniedError extends base_js_1.BaseError {
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
class CreateSubnameParentNotLockedError extends base_js_1.BaseError {
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
class OffchainSubnameError extends base_js_1.BaseError {
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
class SubnameUnavailableError extends base_js_1.BaseError {
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
    const [resolver] = await (0, actions_1.readContract)(wallet, {
        address: (0, getChainContractAddress_js_1.getChainContractAddress)({
            client: wallet,
            contract: 'ensUniversalResolver',
        }),
        abi: index_js_1.universalResolverFindResolverSnippet,
        functionName: 'findResolver',
        args: [(0, viem_1.toHex)((0, ens_1.packetToBytes)(name))],
    });
    const isOffchain = await (0, actions_1.readContract)(wallet, {
        address: resolver,
        abi: index_js_1.erc165SupportsInterfaceSnippet,
        functionName: 'supportsInterface',
        args: [index_js_1.WILDCARD_WRITING_INTERFACE_ID],
    });
    if (isOffchain)
        throw new OffchainSubnameError(name);
    if (contract !== 'nameWrapper')
        return;
    const parentName = name.split('.').slice(1).join('.');
    if (parentName === 'eth')
        return;
    const parentWrapperData = await (0, getWrapperData_js_1.default)(wallet, { name: parentName });
    if (parentWrapperData?.fuses?.child?.CANNOT_CREATE_SUBDOMAIN)
        throw new CreateSubnamePermissionDeniedError({ parentName });
    const generatedFuses = fuses ? (0, fuses_js_1.encodeFuses)({ input: fuses }) : 0;
    const isBurningPCC = fuses && BigInt(generatedFuses) & fuses_js_1.ParentFuses.PARENT_CANNOT_CONTROL;
    const isParentCannotUnwrapBurned = parentWrapperData?.fuses?.child?.CANNOT_UNWRAP;
    if (isBurningPCC && !isParentCannotUnwrapBurned)
        throw new CreateSubnameParentNotLockedError({ parentName });
};
function getChain(chainId) {
    return Object.values(chains).find((chain) => chain.id === chainId);
}
async function createSubname(wallet, { name, contract, owner, resolverAddress, expiry, fuses, extraData = viem_1.zeroHash, ...txArgs }) {
    try {
        await checkCanCreateSubname(wallet, { name, fuses, contract });
    }
    catch (error) {
        const encodedName = (0, viem_1.toHex)((0, ens_1.packetToBytes)(name));
        if (error instanceof OffchainSubnameError) {
            const calldata = {
                name: encodedName,
                owner,
                duration: expiry,
                secret: (0, registerHelpers_js_1.randomSecret)(),
                resolver: resolverAddress || viem_1.zeroAddress,
                extraData,
            };
            try {
                await (0, actions_1.readContract)(wallet, {
                    address: (0, getChainContractAddress_js_1.getChainContractAddress)({
                        client: wallet,
                        contract: 'ensUniversalResolver',
                    }),
                    abi: index_js_1.universalResolverResolveSnippet,
                    functionName: 'resolve',
                    args: [
                        encodedName,
                        (0, viem_1.encodeFunctionData)({
                            functionName: 'getOperationHandler',
                            abi: index_js_1.offchainRegisterSnippet,
                            args: [
                                (0, viem_1.encodeFunctionData)({
                                    functionName: 'register',
                                    abi: index_js_1.offchainRegisterSnippet,
                                    args: [calldata],
                                }),
                            ],
                        }),
                    ],
                });
            }
            catch (offchainError) {
                const data = (0, registerHelpers_js_1.getRevertErrorData)(offchainError);
                if (!data || !Array.isArray(data.args))
                    throw offchainError;
                const [params] = data.args;
                const errorResult = (0, viem_1.decodeErrorResult)({
                    abi: index_js_1.offchainRegisterSnippet,
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
                        await (0, registerHelpers_js_1.ccipRequest)({
                            data: message.data,
                            signature: { message, domain, signature },
                            sender: message.sender,
                            urls: [url],
                        });
                        return wallet.chain.id === chains.sepolia.id
                            ? '0x1d4cca15a7f535724328cce2ba2c857b158c940aeffb3c3b4a035645da697b25'
                            : '0xd4a47f4ff92e1bb213a6f733dc531d1baf4d3e439229bf184aa90b39d2bdb26b';
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
                            const registerParams = (await (0, actions_1.readContract)(wallet, {
                                address: contractAddress,
                                abi: index_js_1.offchainRegisterSnippet,
                                functionName: 'registerParams',
                                args: [encodedName, (0, wrapper_js_1.expiryToBigInt)(expiry)],
                            }));
                            if (!registerParams.available) {
                                throw new SubnameUnavailableError(name);
                            }
                            return await (0, actions_1.sendTransaction)(wallet, {
                                ...txArgs,
                                to: contractAddress,
                                value: registerParams.price,
                                data: (0, viem_1.encodeFunctionData)({
                                    functionName: 'register',
                                    abi: index_js_1.offchainRegisterSnippet,
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
    const data = (0, exports.makeFunctionData)(wallet, {
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
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
createSubname.makeFunctionData = exports.makeFunctionData;
exports.default = createSubname;
//# sourceMappingURL=createSubname.js.map