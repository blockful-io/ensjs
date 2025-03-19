"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRecordCallArray = void 0;
const encodeClearRecords_1 = require("./encoders/encodeClearRecords");
const encodeSetAbi_1 = require("./encoders/encodeSetAbi");
const encodeSetAddr_1 = require("./encoders/encodeSetAddr");
const encodeSetContentHash_1 = require("./encoders/encodeSetContentHash");
const encodeSetText_1 = require("./encoders/encodeSetText");
const generateRecordCallArray = ({ namehash, clearRecords, contentHash, texts, coins, abi, }) => {
    const calls = [];
    if (clearRecords) {
        calls.push((0, encodeClearRecords_1.encodeClearRecords)(namehash));
    }
    if (contentHash !== undefined) {
        const data = (0, encodeSetContentHash_1.encodeSetContentHash)({ namehash, contentHash });
        if (data)
            calls.push(data);
    }
    if (abi !== undefined) {
        const abis = Array.isArray(abi) ? abi : [abi];
        for (const abi_ of abis) {
            const data = (0, encodeSetAbi_1.encodeSetAbi)({ namehash, ...abi_ });
            if (data)
                calls.push(data);
        }
    }
    if (texts && texts.length > 0) {
        const data = texts.map((textItem) => (0, encodeSetText_1.encodeSetText)({ namehash, ...textItem }));
        if (data)
            calls.push(...data);
    }
    if (coins && coins.length > 0) {
        const data = coins.map((coinItem) => (0, encodeSetAddr_1.encodeSetAddr)({ namehash, ...coinItem }));
        if (data)
            calls.push(...data);
    }
    return calls;
};
exports.generateRecordCallArray = generateRecordCallArray;
//# sourceMappingURL=generateRecordCallArray.js.map