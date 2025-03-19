"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSetText = void 0;
const viem_1 = require("viem");
const publicResolver_1 = require("../../contracts/publicResolver");
const encodeSetText = ({ namehash, key, value, }) => {
    return (0, viem_1.encodeFunctionData)({
        abi: publicResolver_1.publicResolverSetTextSnippet,
        functionName: 'setText',
        args: [namehash, key, value ?? ''],
    });
};
exports.encodeSetText = encodeSetText;
//# sourceMappingURL=encodeSetText.js.map