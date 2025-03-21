"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const ens_1 = require("viem/ens");
const encodeSetAbi_js_1 = require("../../utils/encoders/encodeSetAbi.js");
const normalise_js_1 = require("../../utils/normalise.js");
const wildcardWriting_js_1 = require("../../utils/wildcardWriting.js");
const makeFunctionData = (_wallet, { name, encodedAbi, resolverAddress }) => {
    return {
        to: resolverAddress,
        data: (0, encodeSetAbi_js_1.encodeSetAbi)({
            namehash: (0, normalise_js_1.namehash)(name),
            ...encodedAbi,
        }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function setAbiRecord(wallet, { name, encodedAbi, resolverAddress, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        encodedAbi,
        resolverAddress,
    });
    const encodedName = (0, viem_1.toHex)((0, ens_1.packetToBytes)(name));
    const txHash = await (0, wildcardWriting_js_1.handleOffchainTransaction)(wallet, encodedName, data.data, (txArgs.account || wallet.account));
    if (txHash !== viem_1.zeroHash)
        return txHash;
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
setAbiRecord.makeFunctionData = exports.makeFunctionData;
exports.default = setAbiRecord;
//# sourceMappingURL=setAbiRecord.js.map