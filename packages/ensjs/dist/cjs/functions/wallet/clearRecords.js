"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const actions_1 = require("viem/actions");
const encodeClearRecords_1 = require("../../utils/encoders/encodeClearRecords");
const normalise_1 = require("../../utils/normalise");
const makeFunctionData = (_wallet, { name, resolverAddress }) => {
    return {
        to: resolverAddress,
        data: (0, encodeClearRecords_1.encodeClearRecords)((0, normalise_1.namehash)(name)),
    };
};
exports.makeFunctionData = makeFunctionData;
async function clearRecords(wallet, { name, resolverAddress, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        resolverAddress,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
clearRecords.makeFunctionData = exports.makeFunctionData;
exports.default = clearRecords;
//# sourceMappingURL=clearRecords.js.map