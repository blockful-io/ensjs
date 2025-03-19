"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const publicResolver_1 = require("../../contracts/publicResolver");
const consts_1 = require("../../utils/consts");
const generateFunction_1 = require("../../utils/generateFunction");
const normalise_1 = require("../../utils/normalise");
const encode = (_client, { name, key }) => {
    return {
        to: consts_1.EMPTY_ADDRESS,
        data: (0, viem_1.encodeFunctionData)({
            abi: publicResolver_1.publicResolverTextSnippet,
            functionName: 'text',
            args: [(0, normalise_1.namehash)(name), key],
        }),
    };
};
const decode = async (_client, data, { strict }) => {
    if (data === '0x')
        return null;
    try {
        const response = (0, viem_1.decodeFunctionResult)({
            abi: publicResolver_1.publicResolverTextSnippet,
            functionName: 'text',
            data,
        });
        if (!response)
            return null;
        return response;
    }
    catch (error) {
        if (strict)
            throw error;
        return null;
    }
};
const _getText = (0, generateFunction_1.generateFunction)({ encode, decode });
exports.default = _getText;
//# sourceMappingURL=_getText.js.map