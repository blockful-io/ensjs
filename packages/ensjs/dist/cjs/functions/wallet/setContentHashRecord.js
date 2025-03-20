"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const ens_1 = require("viem/ens");
const encodeSetContentHash_js_1 = require("../../utils/encoders/encodeSetContentHash.js");
const normalise_js_1 = require("../../utils/normalise.js");
const wildcardWriting_js_1 = require("../../utils/wildcardWriting.js");
const makeFunctionData = (_wallet, { name, contentHash, resolverAddress }) => {
    return {
        to: resolverAddress,
        data: (0, encodeSetContentHash_js_1.encodeSetContentHash)({ namehash: (0, normalise_js_1.namehash)(name), contentHash }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function setContentHashRecord(wallet, { name, contentHash, resolverAddress, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        contentHash,
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
setContentHashRecord.makeFunctionData = exports.makeFunctionData;
exports.default = setContentHashRecord;
//# sourceMappingURL=setContentHashRecord.js.map