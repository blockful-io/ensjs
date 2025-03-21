"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const ens_1 = require("viem/ens");
const encodeSetText_js_1 = require("../../utils/encoders/encodeSetText.js");
const normalise_js_1 = require("../../utils/normalise.js");
const wildcardWriting_js_1 = require("../../utils/wildcardWriting.js");
const makeFunctionData = (_wallet, { name, key, value, resolverAddress }) => {
    return {
        to: resolverAddress,
        data: (0, encodeSetText_js_1.encodeSetText)({ namehash: (0, normalise_js_1.namehash)(name), key, value }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function setTextRecord(wallet, { name, key, value, resolverAddress, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        key,
        value,
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
setTextRecord.makeFunctionData = exports.makeFunctionData;
exports.default = setTextRecord;
//# sourceMappingURL=setTextRecord.js.map