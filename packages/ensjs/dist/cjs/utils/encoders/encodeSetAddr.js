"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSetAddr = void 0;
const viem_1 = require("viem");
const publicResolver_1 = require("../../contracts/publicResolver");
const normaliseCoinId_1 = require("../normaliseCoinId");
const encodeSetAddr = ({ namehash, coin, value, }) => {
    const coder = (0, normaliseCoinId_1.getCoderFromCoin)(coin);
    const inputCoinType = coder.coinType;
    let encodedAddress = value ? coder.decode(value) : '0x';
    if (inputCoinType === 60 && encodedAddress === '0x')
        encodedAddress = coder.decode('0x0000000000000000000000000000000000000000');
    if (typeof encodedAddress !== 'string') {
        encodedAddress = (0, viem_1.bytesToHex)(encodedAddress);
    }
    return (0, viem_1.encodeFunctionData)({
        abi: publicResolver_1.publicResolverSetAddrSnippet,
        functionName: 'setAddr',
        args: [namehash, BigInt(inputCoinType), encodedAddress],
    });
};
exports.encodeSetAddr = encodeSetAddr;
//# sourceMappingURL=encodeSetAddr.js.map