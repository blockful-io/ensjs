import * as chains from 'viem/chains';
import { decodeErrorResult, zeroHash, encodeFunctionData, BaseError, } from 'viem';
import { readContract, sendTransaction } from 'viem/actions';
import { getChainContractAddress } from '../contracts/getChainContractAddress.js';
import { offchainRegisterSnippet, universalResolverResolveSnippet, } from '../contracts/index.js';
export const WILDCARD_WRITING_REGISTER_INTERFACE_ID = '0x79dc93d7';
const WILDCARD_WRITING_REGISTER_SELECTOR = '0xf43c313a';
export class WildcardError extends BaseError {
}
export function getRevertErrorData(err) {
    if (!(err instanceof BaseError))
        return;
    const error = err.walk();
    return error?.data;
}
export async function ccipRequest({ data, sender, signature, urls, }) {
    return Promise.any(urls
        .map((url) => url.replace('/{sender}/{data}.json', ''))
        .map(async (url) => {
        return fetch(url, {
            body: JSON.stringify({
                data,
                sender,
                signature,
            }, (_, value) => typeof value === 'bigint' ? value.toString() : value),
            method: 'POST',
            headers: {
                /* eslint-disable-next-line @typescript-eslint/naming-convention */
                'Content-Type': 'application/json',
            },
        });
    }));
}
function getChain(chainId) {
    return Object.values(chains).find((chain) => chain.id === chainId);
}
export class NameUnavailableError extends BaseError {
    constructor(name) {
        super(`Create name error: ${name} is unavailable`);
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'NameUnavailableError'
        });
    }
}
export async function handleWildcardWritingRevert(wallet, errorResult, encodedName, calldata, account, expiry) {
    const currentChain = wallet.chain;
    if (errorResult.errorName === 'OperationHandledOffchain') {
        const [domain, url, message] = errorResult.args;
        const signature = await wallet.signTypedData({
            account,
            domain,
            message,
            primaryType: 'Message',
            types: {
                Message: [
                    { name: 'data', type: 'bytes' },
                    { name: 'sender', type: 'address' },
                    { name: 'expirationTimestamp', type: 'uint256' },
                ],
            },
        });
        const response = await ccipRequest({
            data: message.data,
            signature: {
                message,
                domain: { ...domain, chainId: Number(domain.chainId) },
                signature,
            },
            sender: message.sender,
            urls: [url],
        });
        if (response.status !== 200)
            return zeroHash;
    }
    if (errorResult.errorName === 'OperationHandledOnchain') {
        try {
            const [chainId, contractAddress] = errorResult.args;
            if (wallet.chain.id !== chains.localhost.id &&
                wallet.chain.id !== Number(chainId)) {
                await wallet.switchChain({ id: Number(chainId) });
                const chain = getChain(Number(chainId));
                if (!chain)
                    throw new Error('Chain not found');
                wallet.chain = chain;
            }
            let value = 0n;
            if (calldata.slice(0, 10) === WILDCARD_WRITING_REGISTER_SELECTOR) {
                const registerParams = (await readContract(wallet, {
                    address: contractAddress,
                    abi: offchainRegisterSnippet,
                    functionName: 'registerParams',
                    args: [encodedName, expiry],
                }));
                if (!registerParams.available) {
                    throw new NameUnavailableError(encodedName);
                }
                value = registerParams.price;
            }
            await sendTransaction(wallet, {
                to: contractAddress,
                value,
                data: calldata,
            });
        }
        finally {
            if (wallet.chain.id !== chains.localhost.id) {
                await wallet.switchChain({ id: currentChain.id });
                wallet.chain = currentChain;
            }
        }
    }
    // random ethereum transaction hashes had to be returned to avoid breaking changes
    return currentChain.id === chains.sepolia.id
        ? '0x1d4cca15a7f535724328cce2ba2c857b158c940aeffb3c3b4a035645da697b25' // random successful sepolia tx hash
        : '0xd4a47f4ff92e1bb213a6f733dc531d1baf4d3e439229bf184aa90b39d2bdb26b'; // random successful mainnet tx hash
}
export async function handleOffchainTransaction(wallet, encodedName, calldata, account, expiry) {
    try {
        await readContract(wallet, {
            address: getChainContractAddress({
                client: wallet,
                contract: 'ensUniversalResolver',
            }),
            abi: universalResolverResolveSnippet,
            functionName: 'resolve',
            args: [
                encodedName,
                encodeFunctionData({
                    functionName: 'getOperationHandler',
                    abi: offchainRegisterSnippet,
                    args: [calldata],
                }),
            ],
        });
        return zeroHash;
    }
    catch (offchainError) {
        const data = getRevertErrorData(offchainError);
        if (!data || !Array.isArray(data.args))
            throw offchainError;
        const [params] = data.args;
        const errorResult = decodeErrorResult({
            abi: offchainRegisterSnippet,
            data: params,
        });
        const txHash = await handleWildcardWritingRevert(wallet, errorResult, encodedName, calldata, account, expiry);
        if (!txHash)
            throw offchainError;
        return txHash;
    }
}
//# sourceMappingURL=wildcardWriting.js.map