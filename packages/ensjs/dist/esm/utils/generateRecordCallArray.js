import {} from 'viem';
import { encodeClearRecords } from './encoders/encodeClearRecords';
import { encodeSetAbi, } from './encoders/encodeSetAbi';
import { encodeSetAddr, } from './encoders/encodeSetAddr';
import { encodeSetContentHash } from './encoders/encodeSetContentHash';
import { encodeSetText, } from './encoders/encodeSetText';
export const generateRecordCallArray = ({ namehash, clearRecords, contentHash, texts, coins, abi, }) => {
    const calls = [];
    if (clearRecords) {
        calls.push(encodeClearRecords(namehash));
    }
    if (contentHash !== undefined) {
        const data = encodeSetContentHash({ namehash, contentHash });
        if (data)
            calls.push(data);
    }
    if (abi !== undefined) {
        const abis = Array.isArray(abi) ? abi : [abi];
        for (const abi_ of abis) {
            const data = encodeSetAbi({ namehash, ...abi_ });
            if (data)
                calls.push(data);
        }
    }
    if (texts && texts.length > 0) {
        const data = texts.map((textItem) => encodeSetText({ namehash, ...textItem }));
        if (data)
            calls.push(...data);
    }
    if (coins && coins.length > 0) {
        const data = coins.map((coinItem) => encodeSetAddr({ namehash, ...coinItem }));
        if (data)
            calls.push(...data);
    }
    return calls;
};
//# sourceMappingURL=generateRecordCallArray.js.map