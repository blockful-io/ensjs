"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const utils_1 = require("viem/utils");
const baseRegistrar_1 = require("../../contracts/baseRegistrar");
const getChainContractAddress_1 = require("../../contracts/getChainContractAddress");
const nameWrapper_1 = require("../../contracts/nameWrapper");
const general_1 = require("../../errors/general");
const fuses_1 = require("../../utils/fuses");
const hexEncodedName_1 = require("../../utils/hexEncodedName");
const validation_1 = require("../../utils/validation");
const wrapper_1 = require("../../utils/wrapper");
const makeFunctionData = (wallet, { name, newOwnerAddress, fuses, resolverAddress = (0, getChainContractAddress_1.getChainContractAddress)({
    client: wallet,
    contract: 'ensPublicResolver',
}), }) => {
    const labels = name.split('.');
    const isEth2ld = (0, validation_1.checkIsDotEth)(labels);
    const nameWrapperAddress = (0, getChainContractAddress_1.getChainContractAddress)({
        client: wallet,
        contract: 'ensNameWrapper',
    });
    if (isEth2ld) {
        (0, wrapper_1.wrappedLabelLengthCheck)(labels[0]);
        const encodedFuses = fuses
            ? (0, fuses_1.encodeFuses)({ restriction: 'child', input: fuses })
            : 0;
        const tokenId = BigInt((0, viem_1.labelhash)(labels[0]));
        const data = (0, viem_1.encodeAbiParameters)([
            { name: 'label', type: 'string' },
            { name: 'wrappedOwner', type: 'address' },
            { name: 'ownerControlledFuses', type: 'uint16' },
            { name: 'resolverAddress', type: 'address' },
        ], [labels[0], newOwnerAddress, encodedFuses, resolverAddress]);
        return {
            to: (0, getChainContractAddress_1.getChainContractAddress)({
                client: wallet,
                contract: 'ensBaseRegistrarImplementation',
            }),
            data: (0, viem_1.encodeFunctionData)({
                abi: baseRegistrar_1.baseRegistrarSafeTransferFromWithDataSnippet,
                functionName: 'safeTransferFrom',
                args: [wallet.account.address, nameWrapperAddress, tokenId, data],
            }),
        };
    }
    if (fuses)
        throw new general_1.AdditionalParameterSpecifiedError({
            parameter: 'fuses',
            allowedParameters: ['name', 'wrappedOwner', 'resolverAddress'],
            details: 'Fuses cannot be initially set when wrapping non eth-2ld names',
        });
    labels.forEach((label) => (0, wrapper_1.wrappedLabelLengthCheck)(label));
    return {
        to: nameWrapperAddress,
        data: (0, viem_1.encodeFunctionData)({
            abi: nameWrapper_1.nameWrapperWrapSnippet,
            functionName: 'wrap',
            args: [(0, viem_1.toHex)((0, hexEncodedName_1.packetToBytes)(name)), newOwnerAddress, resolverAddress],
        }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function wrapName(wallet, { name, newOwnerAddress, fuses, resolverAddress, ...txArgs }) {
    const data = (0, exports.makeFunctionData)({
        ...wallet,
        account: (0, utils_1.parseAccount)((txArgs.account || wallet.account)),
    }, { name, newOwnerAddress, fuses, resolverAddress });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
wrapName.makeFunctionData = exports.makeFunctionData;
exports.default = wrapName;
//# sourceMappingURL=wrapName.js.map