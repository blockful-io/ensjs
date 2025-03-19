"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const getChainContractAddress_1 = require("../../contracts/getChainContractAddress");
const nameWrapper_1 = require("../../contracts/nameWrapper");
const registry_1 = require("../../contracts/registry");
const general_1 = require("../../errors/general");
const consts_1 = require("../../utils/consts");
const getNameType_1 = require("../../utils/getNameType");
const makeLabelNodeAndParent_1 = require("../../utils/makeLabelNodeAndParent");
const normalise_1 = require("../../utils/normalise");
const makeFunctionData = (wallet, { name, contract, asOwner }) => {
    const nameType = (0, getNameType_1.getNameType)(name);
    if (nameType !== 'eth-subname' && nameType !== 'other-subname')
        throw new general_1.UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: ['eth-subname', 'other-subname'],
            details: 'Cannot delete a name that is not a subname',
        });
    switch (contract) {
        case 'registry': {
            const registryAddress = (0, getChainContractAddress_1.getChainContractAddress)({
                client: wallet,
                contract: 'ensRegistry',
            });
            if (asOwner)
                return {
                    to: registryAddress,
                    data: (0, viem_1.encodeFunctionData)({
                        abi: registry_1.registrySetRecordSnippet,
                        functionName: 'setRecord',
                        args: [(0, normalise_1.namehash)(name), consts_1.EMPTY_ADDRESS, consts_1.EMPTY_ADDRESS, BigInt(0)],
                    }),
                };
            const { labelhash, parentNode } = (0, makeLabelNodeAndParent_1.makeLabelNodeAndParent)(name);
            return {
                to: registryAddress,
                data: (0, viem_1.encodeFunctionData)({
                    abi: registry_1.registrySetSubnodeRecordSnippet,
                    functionName: 'setSubnodeRecord',
                    args: [
                        parentNode,
                        labelhash,
                        consts_1.EMPTY_ADDRESS,
                        consts_1.EMPTY_ADDRESS,
                        BigInt(0),
                    ],
                }),
            };
        }
        case 'nameWrapper': {
            const nameWrapperAddress = (0, getChainContractAddress_1.getChainContractAddress)({
                client: wallet,
                contract: 'ensNameWrapper',
            });
            if (asOwner)
                return {
                    to: nameWrapperAddress,
                    data: (0, viem_1.encodeFunctionData)({
                        abi: nameWrapper_1.nameWrapperSetRecordSnippet,
                        functionName: 'setRecord',
                        args: [(0, normalise_1.namehash)(name), consts_1.EMPTY_ADDRESS, consts_1.EMPTY_ADDRESS, BigInt(0)],
                    }),
                };
            const { label, parentNode } = (0, makeLabelNodeAndParent_1.makeLabelNodeAndParent)(name);
            return {
                to: nameWrapperAddress,
                data: (0, viem_1.encodeFunctionData)({
                    abi: nameWrapper_1.nameWrapperSetSubnodeRecordSnippet,
                    functionName: 'setSubnodeRecord',
                    args: [
                        parentNode,
                        label,
                        consts_1.EMPTY_ADDRESS,
                        consts_1.EMPTY_ADDRESS,
                        BigInt(0),
                        0,
                        BigInt(0),
                    ],
                }),
            };
        }
        default:
            throw new general_1.InvalidContractTypeError({
                contractType: contract,
                supportedContractTypes: ['registry', 'nameWrapper'],
            });
    }
};
exports.makeFunctionData = makeFunctionData;
async function deleteSubname(wallet, { name, contract, asOwner, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        contract,
        asOwner,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
deleteSubname.makeFunctionData = exports.makeFunctionData;
exports.default = deleteSubname;
//# sourceMappingURL=deleteSubname.js.map