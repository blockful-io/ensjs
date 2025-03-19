"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const getChainContractAddress_1 = require("../../contracts/getChainContractAddress");
const nameWrapper_1 = require("../../contracts/nameWrapper");
const generateFunction_1 = require("../../utils/generateFunction");
const hexEncodedName_1 = require("../../utils/hexEncodedName");
const normalise_1 = require("../../utils/normalise");
const encode = (client, { name }) => {
    const address = (0, getChainContractAddress_1.getChainContractAddress)({
        client,
        contract: 'ensNameWrapper',
    });
    const args = [(0, normalise_1.namehash)(name)];
    return {
        to: address,
        data: (0, viem_1.encodeFunctionData)({
            abi: nameWrapper_1.nameWrapperNamesSnippet,
            functionName: 'names',
            args,
        }),
        passthrough: { address, args },
    };
};
const decode = async (_client, data, passthrough) => {
    if (typeof data === 'object')
        throw (0, viem_1.getContractError)(data, {
            abi: nameWrapper_1.nameWrapperNamesSnippet,
            functionName: 'names',
            args: passthrough.args,
            address: passthrough.address,
        });
    const result = (0, viem_1.decodeFunctionResult)({
        abi: nameWrapper_1.nameWrapperNamesSnippet,
        functionName: 'names',
        data,
    });
    if (!result || result === '0x' || BigInt(result) === 0n)
        return null;
    return (0, hexEncodedName_1.bytesToPacket)((0, viem_1.hexToBytes)(result));
};
const getWrapperName = (0, generateFunction_1.generateFunction)({ encode, decode });
exports.default = getWrapperName;
//# sourceMappingURL=getWrapperName.js.map