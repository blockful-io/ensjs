"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const actions_1 = require("viem/actions");
const encodeSetAbi_1 = require("../../utils/encoders/encodeSetAbi");
const normalise_1 = require("../../utils/normalise");
const makeFunctionData = (_wallet, { name, encodedAbi, resolverAddress }) => {
    return {
        to: resolverAddress,
        data: (0, encodeSetAbi_1.encodeSetAbi)({
            namehash: (0, normalise_1.namehash)(name),
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
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
setAbiRecord.makeFunctionData = exports.makeFunctionData;
exports.default = setAbiRecord;
//# sourceMappingURL=setAbiRecord.js.map