"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFunctionData = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const getChainContractAddress_1 = require("../../contracts/getChainContractAddress");
const nameWrapper_1 = require("../../contracts/nameWrapper");
const general_1 = require("../../errors/general");
const getNameType_1 = require("../../utils/getNameType");
const makeLabelNodeAndParent_1 = require("../../utils/makeLabelNodeAndParent");
const makeFunctionData = (wallet, { name, newOwnerAddress, newRegistrantAddress, }) => {
    const { labelhash, parentNode } = (0, makeLabelNodeAndParent_1.makeLabelNodeAndParent)(name);
    const nameWrapperAddress = (0, getChainContractAddress_1.getChainContractAddress)({
        client: wallet,
        contract: 'ensNameWrapper',
    });
    const nameType = (0, getNameType_1.getNameType)(name);
    if (nameType === 'eth-2ld') {
        if (!newRegistrantAddress)
            throw new general_1.RequiredParameterNotSpecifiedError({
                parameter: 'newRegistrantAddress',
                details: 'Must provide newRegistrantAddress for eth-2ld names',
            });
        return {
            to: nameWrapperAddress,
            data: (0, viem_1.encodeFunctionData)({
                abi: nameWrapper_1.nameWrapperUnwrapEth2ldSnippet,
                functionName: 'unwrapETH2LD',
                args: [labelhash, newRegistrantAddress, newOwnerAddress],
            }),
        };
    }
    if (newRegistrantAddress)
        throw new general_1.AdditionalParameterSpecifiedError({
            parameter: 'newRegistrantAddress',
            allowedParameters: ['name', 'newOwnerAddress'],
            details: 'newRegistrantAddress can only be specified for eth-2ld names',
        });
    return {
        to: nameWrapperAddress,
        data: (0, viem_1.encodeFunctionData)({
            abi: nameWrapper_1.nameWrapperUnwrapSnippet,
            functionName: 'unwrap',
            args: [parentNode, labelhash, newOwnerAddress],
        }),
    };
};
exports.makeFunctionData = makeFunctionData;
async function unwrapName(wallet, { name, newOwnerAddress, newRegistrantAddress, ...txArgs }) {
    const data = (0, exports.makeFunctionData)(wallet, {
        name,
        newOwnerAddress,
        newRegistrantAddress,
    });
    const writeArgs = {
        ...data,
        ...txArgs,
    };
    return (0, actions_1.sendTransaction)(wallet, writeArgs);
}
unwrapName.makeFunctionData = exports.makeFunctionData;
exports.default = unwrapName;
//# sourceMappingURL=unwrapName.js.map