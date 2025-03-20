"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const ens_1 = require("viem/ens");
const encodeSetAddr_js_1 = require("../../utils/encoders/encodeSetAddr.js");
const normalise_js_1 = require("../../utils/normalise.js");
const wildcardWriting_js_1 = require("../../utils/wildcardWriting.js");
const makeFunctionData = (_wallet, { name, coin, value, resolverAddress }) => {
    return {
        to: resolverAddress,
        data: (0, encodeSetAddr_js_1.encodeSetAddr)({ namehash: (0, normalise_js_1.namehash)(name), coin, value }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function setAddressRecord(wallet, { name, coin, value, resolverAddress, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        coin,
        value,
        resolverAddress,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    try {
        return await (0, actions_1.sendTransaction)(wallet, writeArgs);
    }
    catch (error) {
        const errorData = (0, wildcardWriting_js_1.getRevertErrorData)(error);
        if (!errorData)
            throw error;
        const txHash = await (0, wildcardWriting_js_1.handleWildcardWritingRevert)(wallet, errorData, (0, viem_1.toHex)((0, ens_1.packetToBytes)(name)), writeArgs.data, (txArgs.account || wallet.account));
        if (!txHash)
            throw error;
        return txHash;
    }
}
setAddressRecord.makeFunctionData = exports.makeFunctionData;
exports.default = setAddressRecord;
//# sourceMappingURL=setAddressRecord.js.map