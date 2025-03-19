"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const getChainContractAddress_1 = require("../../contracts/getChainContractAddress");
const universalResolver_1 = require("../../contracts/universalResolver");
const checkSafeUniversalResolverData_1 = require("../../utils/checkSafeUniversalResolverData");
const generateFunction_1 = require("../../utils/generateFunction");
const hexEncodedName_1 = require("../../utils/hexEncodedName");
const labels_1 = require("../../utils/labels");
const encode = (client, { name, data, gatewayUrls }) => {
    const nameWithSizedLabels = name
        .split('.')
        .map((label) => {
        const labelLength = (0, viem_1.toBytes)(label).byteLength;
        if (labelLength > 255) {
            return (0, labels_1.encodeLabelhash)((0, viem_1.labelhash)(label));
        }
        return label;
    })
        .join('.');
    const to = (0, getChainContractAddress_1.getChainContractAddress)({
        client,
        contract: 'ensUniversalResolver',
    });
    const args = [(0, viem_1.toHex)((0, hexEncodedName_1.packetToBytes)(nameWithSizedLabels)), data];
    return {
        to,
        ...(gatewayUrls?.length
            ? {
                data: (0, viem_1.encodeFunctionData)({
                    abi: universalResolver_1.universalResolverResolveWithGatewaysSnippet,
                    functionName: 'resolve',
                    args: [...args, gatewayUrls],
                }),
                passthrough: {
                    args: [...args, gatewayUrls],
                    address: to,
                },
            }
            : {
                data: (0, viem_1.encodeFunctionData)({
                    abi: universalResolver_1.universalResolverResolveSnippet,
                    functionName: 'resolve',
                    args,
                }),
                passthrough: {
                    args,
                    address: to,
                },
            }),
    };
};
const decode = async (_client, data, passthrough, { strict, gatewayUrls, }) => {
    const isSafe = (0, checkSafeUniversalResolverData_1.checkSafeUniversalResolverData)(data, {
        strict,
        abi: gatewayUrls
            ? universalResolver_1.universalResolverResolveWithGatewaysSnippet
            : universalResolver_1.universalResolverResolveSnippet,
        args: passthrough.args,
        functionName: 'resolve',
        address: passthrough.address,
    });
    if (!isSafe)
        return null;
    try {
        const result = (0, viem_1.decodeFunctionResult)({
            abi: universalResolver_1.universalResolverResolveSnippet,
            functionName: 'resolve',
            data,
        });
        return { data: result[0], resolver: result[1] };
    }
    catch (error) {
        if (strict)
            throw error;
        return null;
    }
};
const universalWrapper = (0, generateFunction_1.generateFunction)({ encode, decode });
exports.default = universalWrapper;
//# sourceMappingURL=universalWrapper.js.map