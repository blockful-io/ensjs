"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const getChainContractAddress_1 = require("../../contracts/getChainContractAddress");
const nameWrapper_1 = require("../../contracts/nameWrapper");
const fuses_1 = require("../../utils/fuses");
const normalise_1 = require("../../utils/normalise");
const makeFunctionData = (wallet, { name, fuses }) => {
    const encodedFuses = (0, fuses_1.encodeFuses)({ restriction: 'child', input: fuses });
    return {
        to: (0, getChainContractAddress_1.getChainContractAddress)({ client: wallet, contract: 'ensNameWrapper' }),
        data: (0, viem_1.encodeFunctionData)({
            abi: nameWrapper_1.nameWrapperSetFusesSnippet,
            functionName: 'setFuses',
            args: [(0, normalise_1.namehash)(name), encodedFuses],
        }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function setFuses(wallet, { name, fuses, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, { name, fuses });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
setFuses.makeFunctionData = exports.makeFunctionData;
exports.default = setFuses;
//# sourceMappingURL=setFuses.js.map