"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDefaultExpiry = exports.wrappedLabelLengthCheck = exports.expiryToBigInt = exports.MAX_EXPIRY = void 0;
const viem_1 = require("viem");
const utils_1 = require("../errors/utils");
const fuses_1 = require("./fuses");
exports.MAX_EXPIRY = 2n ** 64n - 1n;
const expiryToBigInt = (expiry, defaultValue = 0n) => {
    if (!expiry)
        return defaultValue;
    if (typeof expiry === 'bigint')
        return expiry;
    if (typeof expiry === 'string' || typeof expiry === 'number')
        return BigInt(expiry);
    if (expiry instanceof Date)
        return BigInt(Math.floor(expiry.getTime() / 1000));
    throw new TypeError('Expiry must be a bigint, string, number or Date');
};
exports.expiryToBigInt = expiryToBigInt;
const wrappedLabelLengthCheck = (label) => {
    const bytes = (0, viem_1.stringToBytes)(label);
    if (bytes.byteLength > 255)
        throw new utils_1.WrappedLabelTooLargeError({ label, byteLength: bytes.byteLength });
};
exports.wrappedLabelLengthCheck = wrappedLabelLengthCheck;
const makeDefaultExpiry = (fuses) => {
    if (fuses && BigInt(fuses) & fuses_1.ParentFuses.PARENT_CANNOT_CONTROL)
        return exports.MAX_EXPIRY;
    return 0n;
};
exports.makeDefaultExpiry = makeDefaultExpiry;
//# sourceMappingURL=wrapper.js.map