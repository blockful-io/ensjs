"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const erc165_1 = require("../../contracts/erc165");
const generateFunction_1 = require("../../utils/generateFunction");
const multicallWrapper_1 = require("./multicallWrapper");
const encodeInterface = (interfaceId) => (0, viem_1.encodeFunctionData)({
    abi: erc165_1.erc165SupportsInterfaceSnippet,
    functionName: 'supportsInterface',
    args: [interfaceId],
});
const encode = (client, { address, interfaces }) => {
    const calls = interfaces.map((interfaceId) => ({
        to: address,
        data: encodeInterface(interfaceId),
    }));
    const encoded = multicallWrapper_1.default.encode(client, {
        transactions: calls,
    });
    return {
        ...encoded,
        passthrough: calls,
    };
};
const decode = async (client, data, passthrough) => {
    if (typeof data === 'object')
        throw data;
    const result = await multicallWrapper_1.default.decode(client, data, passthrough);
    return result.map((r) => r.success && r.returnData === (0, viem_1.padHex)('0x01'));
};
const getSupportedInterfaces = (0, generateFunction_1.generateFunction)({ encode, decode });
exports.default = getSupportedInterfaces;
//# sourceMappingURL=getSupportedInterfaces.js.map