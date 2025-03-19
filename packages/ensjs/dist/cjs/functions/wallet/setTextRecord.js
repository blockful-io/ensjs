"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const actions_1 = require("viem/actions");
const encodeSetText_1 = require("../../utils/encoders/encodeSetText");
const normalise_1 = require("../../utils/normalise");
const makeFunctionData = (_wallet, { name, key, value, resolverAddress }) => {
    return {
        to: resolverAddress,
        data: (0, encodeSetText_1.encodeSetText)({ namehash: (0, normalise_1.namehash)(name), key, value }),
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
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
setTextRecord.makeFunctionData = exports.makeFunctionData;
exports.default = setTextRecord;
//# sourceMappingURL=setTextRecord.js.map