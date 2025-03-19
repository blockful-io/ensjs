"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const publicResolver_1 = require("../../contracts/publicResolver");
const consts_1 = require("../../utils/consts");
const generateFunction_1 = require("../../utils/generateFunction");
const normalise_1 = require("../../utils/normalise");
const encode = (_client, { name, supportedContentTypes = 0xfn, }) => {
    return {
        to: consts_1.EMPTY_ADDRESS,
        data: (0, viem_1.encodeFunctionData)({
            abi: publicResolver_1.publicResolverAbiSnippet,
            functionName: 'ABI',
            args: [(0, normalise_1.namehash)(name), supportedContentTypes],
        }),
    };
};
const decode = async (_client, data, { strict }) => {
    if (data === '0x')
        return null;
    try {
        const [bigintContentType, encodedAbiData] = (0, viem_1.decodeFunctionResult)({
            abi: publicResolver_1.publicResolverAbiSnippet,
            functionName: 'ABI',
            data,
        });
        if (!bigintContentType || !encodedAbiData) {
            return null;
        }
        const contentType = Number(bigintContentType);
        if (!contentType) {
            return null;
        }
        let abiData;
        let decoded = false;
        switch (contentType) {
            case 1:
                abiData = JSON.parse((0, viem_1.hexToString)(encodedAbiData));
                decoded = true;
                break;
            case 4: {
                const { cborDecode } = await Promise.resolve().then(() => require('@ensdomains/address-encoder/utils'));
                abiData = await cborDecode((0, viem_1.hexToBytes)(encodedAbiData).buffer);
                decoded = true;
                break;
            }
            case 8:
                abiData = (0, viem_1.hexToString)(encodedAbiData);
                decoded = true;
                break;
            default:
                try {
                    abiData = (0, viem_1.hexToString)(encodedAbiData);
                    decoded = true;
                }
                catch {
                    abiData = encodedAbiData;
                }
        }
        return {
            contentType,
            decoded,
            abi: abiData,
        };
    }
    catch (error) {
        if (strict)
            throw error;
        return null;
    }
};
const _getAbi = (0, generateFunction_1.generateFunction)({ encode, decode });
exports.default = _getAbi;
//# sourceMappingURL=_getAbi.js.map