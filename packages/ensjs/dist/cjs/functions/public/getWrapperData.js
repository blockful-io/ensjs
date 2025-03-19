"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const getChainContractAddress_1 = require("../../contracts/getChainContractAddress");
const nameWrapper_1 = require("../../contracts/nameWrapper");
const consts_1 = require("../../utils/consts");
const fuses_1 = require("../../utils/fuses");
const generateFunction_1 = require("../../utils/generateFunction");
const makeSafeSecondsDate_1 = require("../../utils/makeSafeSecondsDate");
const normalise_1 = require("../../utils/normalise");
const encode = (client, { name }) => {
    const address = (0, getChainContractAddress_1.getChainContractAddress)({
        client,
        contract: 'ensNameWrapper',
    });
    const args = [BigInt((0, normalise_1.namehash)(name))];
    return {
        to: address,
        data: (0, viem_1.encodeFunctionData)({
            abi: nameWrapper_1.nameWrapperGetDataSnippet,
            functionName: 'getData',
            args,
        }),
        passthrough: { address, args },
    };
};
const decode = async (_client, data, passthrough) => {
    if (typeof data === 'object')
        throw (0, viem_1.getContractError)(data, {
            abi: nameWrapper_1.nameWrapperGetDataSnippet,
            functionName: 'getData',
            args: passthrough.args,
            address: passthrough.address,
        });
    const [owner, fuses, expiry] = (0, viem_1.decodeFunctionResult)({
        abi: nameWrapper_1.nameWrapperGetDataSnippet,
        functionName: 'getData',
        data,
    });
    if (owner === consts_1.EMPTY_ADDRESS) {
        return null;
    }
    const fuseObj = (0, fuses_1.decodeFuses)(fuses);
    const expiryDate = expiry > 0 ? (0, makeSafeSecondsDate_1.makeSafeSecondsDate)(expiry) : null;
    return {
        fuses: {
            ...fuseObj,
            value: fuses,
        },
        expiry: expiryDate
            ? {
                date: expiryDate,
                value: expiry,
            }
            : null,
        owner,
    };
};
const getWrapperData = (0, generateFunction_1.generateFunction)({ encode, decode });
exports.default = getWrapperData;
//# sourceMappingURL=getWrapperData.js.map