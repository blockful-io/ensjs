"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ownerFromContract = void 0;
const viem_1 = require("viem");
const baseRegistrar_1 = require("../contracts/baseRegistrar");
const getChainContractAddress_1 = require("../contracts/getChainContractAddress");
const nameWrapper_1 = require("../contracts/nameWrapper");
const registry_1 = require("../contracts/registry");
const general_1 = require("../errors/general");
const ownerFromContract = ({ client, contract, namehash, labels, }) => {
    switch (contract) {
        case 'nameWrapper':
            return {
                to: (0, getChainContractAddress_1.getChainContractAddress)({ client, contract: 'ensNameWrapper' }),
                data: (0, viem_1.encodeFunctionData)({
                    abi: nameWrapper_1.nameWrapperOwnerOfSnippet,
                    functionName: 'ownerOf',
                    args: [BigInt(namehash)],
                }),
            };
        case 'registry':
            return {
                to: (0, getChainContractAddress_1.getChainContractAddress)({ client, contract: 'ensRegistry' }),
                data: (0, viem_1.encodeFunctionData)({
                    abi: registry_1.registryOwnerSnippet,
                    functionName: 'owner',
                    args: [namehash],
                }),
            };
        case 'registrar':
            return {
                to: (0, getChainContractAddress_1.getChainContractAddress)({
                    client,
                    contract: 'ensBaseRegistrarImplementation',
                }),
                data: (0, viem_1.encodeFunctionData)({
                    abi: baseRegistrar_1.baseRegistrarOwnerOfSnippet,
                    functionName: 'ownerOf',
                    args: [BigInt((0, viem_1.labelhash)(labels[0]))],
                }),
            };
        default:
            throw new general_1.InvalidContractTypeError({
                contractType: contract,
                supportedContractTypes: ['nameWrapper', 'registry', 'registrar'],
            });
    }
};
exports.ownerFromContract = ownerFromContract;
//# sourceMappingURL=ownerFromContract.js.map