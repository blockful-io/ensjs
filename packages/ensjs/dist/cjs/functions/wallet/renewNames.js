"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const bulkRenewal_1 = require("../../contracts/bulkRenewal");
const ethRegistrarController_1 = require("../../contracts/ethRegistrarController");
const getChainContractAddress_1 = require("../../contracts/getChainContractAddress");
const general_1 = require("../../errors/general");
const getNameType_1 = require("../../utils/getNameType");
const makeFunctionData = (wallet, { nameOrNames, duration, value }) => {
    const names = Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];
    const labels = names.map((name) => {
        const label = name.split('.');
        const nameType = (0, getNameType_1.getNameType)(name);
        if (nameType !== 'eth-2ld')
            throw new general_1.UnsupportedNameTypeError({
                nameType,
                supportedNameTypes: ['eth-2ld'],
                details: 'Only 2ld-eth renewals are currently supported',
            });
        return label[0];
    });
    if (labels.length === 1) {
        return {
            to: (0, getChainContractAddress_1.getChainContractAddress)({
                client: wallet,
                contract: 'ensEthRegistrarController',
            }),
            data: (0, viem_1.encodeFunctionData)({
                abi: ethRegistrarController_1.ethRegistrarControllerRenewSnippet,
                functionName: 'renew',
                args: [labels[0], BigInt(duration)],
            }),
            value,
        };
    }
    return {
        to: (0, getChainContractAddress_1.getChainContractAddress)({
            client: wallet,
            contract: 'ensBulkRenewal',
        }),
        data: (0, viem_1.encodeFunctionData)({
            abi: bulkRenewal_1.bulkRenewalRenewAllSnippet,
            functionName: 'renewAll',
            args: [labels, BigInt(duration)],
        }),
        value,
    };
};
exports.makeFunctionData = makeFunctionData;
async function renewNames(wallet, { nameOrNames, duration, value, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, { nameOrNames, duration, value });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
renewNames.makeFunctionData = exports.makeFunctionData;
exports.default = renewNames;
//# sourceMappingURL=renewNames.js.map