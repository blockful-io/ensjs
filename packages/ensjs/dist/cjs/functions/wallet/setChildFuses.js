"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const getChainContractAddress_1 = require("../../contracts/getChainContractAddress");
const nameWrapper_1 = require("../../contracts/nameWrapper");
const fuses_1 = require("../../utils/fuses");
const normalise_1 = require("../../utils/normalise");
const makeFunctionData = (wallet, { name, fuses, expiry }) => {
    const encodedFuses = (0, fuses_1.encodeFuses)({ input: fuses });
    const labels = name.split('.');
    const labelHash = (0, viem_1.labelhash)(labels.shift());
    const parentNode = (0, normalise_1.namehash)(labels.join('.'));
    return {
        to: (0, getChainContractAddress_1.getChainContractAddress)({ client: wallet, contract: 'ensNameWrapper' }),
        data: (0, viem_1.encodeFunctionData)({
            abi: nameWrapper_1.nameWrapperSetChildFusesSnippet,
            functionName: 'setChildFuses',
            args: [parentNode, labelHash, encodedFuses, BigInt(expiry ?? 0)],
        }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function setChildFuses(wallet, { name, fuses, expiry, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, { name, fuses, expiry });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
setChildFuses.makeFunctionData = exports.makeFunctionData;
exports.default = setChildFuses;
//# sourceMappingURL=setChildFuses.js.map