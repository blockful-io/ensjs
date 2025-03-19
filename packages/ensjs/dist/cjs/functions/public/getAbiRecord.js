"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateFunction_1 = require("../../utils/generateFunction");
const _getAbi_1 = require("./_getAbi");
const universalWrapper_1 = require("./universalWrapper");
const encode = (client, { name, supportedContentTypes, gatewayUrls, }) => {
    const prData = _getAbi_1.default.encode(client, { name, supportedContentTypes });
    return universalWrapper_1.default.encode(client, {
        name,
        data: prData.data,
        gatewayUrls,
    });
};
const decode = async (client, data, passthrough, { strict, gatewayUrls, }) => {
    const urData = await universalWrapper_1.default.decode(client, data, passthrough, {
        strict,
        gatewayUrls,
    });
    if (!urData)
        return null;
    return _getAbi_1.default.decode(client, urData.data, { strict });
};
const getAbiRecord = (0, generateFunction_1.generateFunction)({ encode, decode });
exports.default = getAbiRecord;
//# sourceMappingURL=getAbiRecord.js.map