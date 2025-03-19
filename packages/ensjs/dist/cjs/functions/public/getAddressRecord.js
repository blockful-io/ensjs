"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateFunction_1 = require("../../utils/generateFunction");
const _getAddr_1 = require("./_getAddr");
const universalWrapper_1 = require("./universalWrapper");
const encode = (client, { name, coin, gatewayUrls, }) => {
    const prData = _getAddr_1.default.encode(client, { name, coin });
    return universalWrapper_1.default.encode(client, {
        name,
        data: prData.data,
        gatewayUrls,
    });
};
const decode = async (client, data, passthrough, { coin, strict, gatewayUrls, }) => {
    const urData = await universalWrapper_1.default.decode(client, data, passthrough, {
        strict,
        gatewayUrls,
    });
    if (!urData)
        return null;
    return _getAddr_1.default.decode(client, urData.data, { coin, strict });
};
const getAddressRecord = (0, generateFunction_1.generateFunction)({ encode, decode });
exports.default = getAddressRecord;
//# sourceMappingURL=getAddressRecord.js.map