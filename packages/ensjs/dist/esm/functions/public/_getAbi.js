import { decodeFunctionResult, encodeFunctionData, hexToBytes, hexToString, } from 'viem';
import { publicResolverAbiSnippet } from '../../contracts/publicResolver';
import { EMPTY_ADDRESS } from '../../utils/consts';
import { generateFunction } from '../../utils/generateFunction';
import { namehash } from '../../utils/normalise';
const encode = (_client, { name, supportedContentTypes = 0xfn, }) => {
    return {
        to: EMPTY_ADDRESS,
        data: encodeFunctionData({
            abi: publicResolverAbiSnippet,
            functionName: 'ABI',
            args: [namehash(name), supportedContentTypes],
        }),
    };
};
const decode = async (_client, data, { strict }) => {
    if (data === '0x')
        return null;
    try {
        const [bigintContentType, encodedAbiData] = decodeFunctionResult({
            abi: publicResolverAbiSnippet,
            functionName: 'ABI',
            data,
        });
        if (!bigintContentType || !encodedAbiData) {
            return null;
        }
        const contentType = Number(bigintContentType);
        if (!contentType) {
            return null;
        }
        let abiData;
        let decoded = false;
        switch (contentType) {
            // JSON
            case 1:
                abiData = JSON.parse(hexToString(encodedAbiData));
                decoded = true;
                break;
            // CBOR
            case 4: {
                const { cborDecode } = await import('@ensdomains/address-encoder/utils');
                abiData = await cborDecode(hexToBytes(encodedAbiData).buffer);
                decoded = true;
                break;
            }
            // URI
            case 8:
                abiData = hexToString(encodedAbiData);
                decoded = true;
                break;
            default:
                try {
                    abiData = hexToString(encodedAbiData);
                    decoded = true;
                }
                catch {
                    abiData = encodedAbiData;
                }
        }
        return {
            contentType,
            decoded,
            abi: abiData,
        };
    }
    catch (error) {
        if (strict)
            throw error;
        return null;
    }
};
const _getAbi = generateFunction({ encode, decode });
export default _getAbi;
//# sourceMappingURL=_getAbi.js.map