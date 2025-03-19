"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSetContentHash = void 0;
const viem_1 = require("viem");
const publicResolver_1 = require("../../contracts/publicResolver");
const contentHash_1 = require("../contentHash");
const encodeSetContentHash = ({ namehash, contentHash, }) => {
    let encodedHash = '0x';
    if (contentHash) {
        encodedHash = (0, contentHash_1.encodeContentHash)(contentHash);
    }
    return (0, viem_1.encodeFunctionData)({
        abi: publicResolver_1.publicResolverSetContenthashSnippet,
        functionName: 'setContenthash',
        args: [namehash, encodedHash],
    });
};
exports.encodeSetContentHash = encodeSetContentHash;
//# sourceMappingURL=encodeSetContentHash.js.map