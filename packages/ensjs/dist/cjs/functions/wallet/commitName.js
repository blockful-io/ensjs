"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const ethRegistrarController_1 = require("../../contracts/ethRegistrarController");
const getChainContractAddress_1 = require("../../contracts/getChainContractAddress");
const general_1 = require("../../errors/general");
const getNameType_1 = require("../../utils/getNameType");
const registerHelpers_1 = require("../../utils/registerHelpers");
const wrapper_1 = require("../../utils/wrapper");
const makeFunctionData = (wallet, args) => {
    const labels = args.name.split('.');
    const nameType = (0, getNameType_1.getNameType)(args.name);
    if (nameType !== 'eth-2ld')
        throw new general_1.UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: ['eth-2ld'],
            details: 'Only 2ld-eth name registration is supported',
        });
    (0, wrapper_1.wrappedLabelLengthCheck)(labels[0]);
    return {
        to: (0, getChainContractAddress_1.getChainContractAddress)({
            client: wallet,
            contract: 'ensEthRegistrarController',
        }),
        data: (0, viem_1.encodeFunctionData)({
            abi: ethRegistrarController_1.ethRegistrarControllerCommitSnippet,
            functionName: 'commit',
            args: [(0, registerHelpers_1.makeCommitment)(args)],
        }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function commitName(wallet, { name, owner, duration, secret, resolverAddress, records, reverseRecord, fuses, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        owner,
        duration,
        secret,
        resolverAddress,
        records,
        reverseRecord,
        fuses,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
commitName.makeFunctionData = exports.makeFunctionData;
exports.default = commitName;
//# sourceMappingURL=commitName.js.map