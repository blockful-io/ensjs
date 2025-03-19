"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const getChainContractAddress_1 = require("../../contracts/getChainContractAddress");
const nameWrapper_1 = require("../../contracts/nameWrapper");
const registry_1 = require("../../contracts/registry");
const normalise_1 = require("../../utils/normalise");
const makeFunctionData = (wallet, { name, contract, resolverAddress }) => {
    if (contract !== 'registry' && contract !== 'nameWrapper')
        throw new Error(`Unknown contract: ${contract}`);
    const to = (0, getChainContractAddress_1.getChainContractAddress)({
        client: wallet,
        contract: contract === 'nameWrapper' ? 'ensNameWrapper' : 'ensRegistry',
    });
    const args = [(0, normalise_1.namehash)(name), resolverAddress];
    const functionName = 'setResolver';
    if (contract === 'nameWrapper')
        return {
            to,
            data: (0, viem_1.encodeFunctionData)({
                abi: nameWrapper_1.nameWrapperSetResolverSnippet,
                functionName,
                args,
            }),
        };
    return {
        to,
        data: (0, viem_1.encodeFunctionData)({
            abi: registry_1.registrySetResolverSnippet,
            functionName,
            args,
        }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function setResolver(wallet, { name, contract, resolverAddress, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, { name, contract, resolverAddress });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
setResolver.makeFunctionData = exports.makeFunctionData;
exports.default = setResolver;
//# sourceMappingURL=setResolver.js.map