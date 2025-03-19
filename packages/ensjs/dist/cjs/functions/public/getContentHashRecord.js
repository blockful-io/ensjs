"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateFunction_1 = require("../../utils/generateFunction");
const _getContentHash_1 = require("./_getContentHash");
const universalWrapper_1 = require("./universalWrapper");
const encode = (client, { name, gatewayUrls }) => {
    const prData = _getContentHash_1.default.encode(client, { name });
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
    return _getContentHash_1.default.decode(client, urData.data, { strict });
};
const getContentHashRecord = (0, generateFunction_1.generateFunction)({ encode, decode });
exports.default = getContentHashRecord;
//# sourceMappingURL=getContentHashRecord.js.map