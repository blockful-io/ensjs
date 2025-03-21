"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOffchainTransaction = exports.handleWildcardWritingRevert = exports.NameUnavailableError = exports.ccipRequest = exports.getRevertErrorData = exports.WildcardError = exports.WILDCARD_WRITING_REGISTER_INTERFACE_ID = void 0;
const chains = require("viem/chains");
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const getChainContractAddress_js_1 = require("../contracts/getChainContractAddress.js");
const index_js_1 = require("../contracts/index.js");
exports.WILDCARD_WRITING_REGISTER_INTERFACE_ID = '0x79dc93d7';
const WILDCARD_WRITING_REGISTER_SELECTOR = '0xf43c313a';
class WildcardError extends viem_1.BaseError {
}
exports.WildcardError = WildcardError;
function getRevertErrorData(err) {
    if (!(err instanceof viem_1.BaseError))
        return;
    const error = err.walk();
    return error?.data;
}
exports.getRevertErrorData = getRevertErrorData;
async function ccipRequest({ data, sender, signature, urls, }) {
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
                'Content-Type': 'application/json',
            },
        });
    }));
}
exports.ccipRequest = ccipRequest;
function getChain(chainId) {
    return Object.values(chains).find((chain) => chain.id === chainId);
}
class NameUnavailableError extends viem_1.BaseError {
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
exports.NameUnavailableError = NameUnavailableError;
async function handleWildcardWritingRevert(wallet, errorResult, encodedName, calldata, account, expiry) {
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
            return viem_1.zeroHash;
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
                const registerParams = (await (0, actions_1.readContract)(wallet, {
                    address: contractAddress,
                    abi: index_js_1.offchainRegisterSnippet,
                    functionName: 'registerParams',
                    args: [encodedName, expiry],
                }));
                if (!registerParams.available) {
                    throw new NameUnavailableError(encodedName);
                }
                value = registerParams.price;
            }
            await (0, actions_1.sendTransaction)(wallet, {
                account,
                to: contractAddress,
                value,
                data: calldata,
                gas: 300000n,
                authorizationList: [],
            });
        }
        finally {
            if (wallet.chain.id !== chains.localhost.id) {
                await wallet.switchChain({ id: currentChain.id });
                wallet.chain = currentChain;
            }
        }
    }
    return currentChain.id === chains.sepolia.id
        ? '0x1d4cca15a7f535724328cce2ba2c857b158c940aeffb3c3b4a035645da697b25'
        : '0xd4a47f4ff92e1bb213a6f733dc531d1baf4d3e439229bf184aa90b39d2bdb26b';
}
exports.handleWildcardWritingRevert = handleWildcardWritingRevert;
async function handleOffchainTransaction(wallet, encodedName, calldata, account, expiry) {
    try {
        await (0, actions_1.readContract)(wallet, {
            address: (0, getChainContractAddress_js_1.getChainContractAddress)({
                client: wallet,
                contract: 'ensUniversalResolver',
            }),
            abi: index_js_1.universalResolverResolveSnippet,
            functionName: 'resolve',
            args: [
                encodedName,
                (0, viem_1.encodeFunctionData)({
                    functionName: 'getOperationHandler',
                    abi: index_js_1.offchainRegisterSnippet,
                    args: [calldata],
                }),
            ],
        });
        return viem_1.zeroHash;
    }
    catch (offchainError) {
        const data = getRevertErrorData(offchainError);
        if (!data || !Array.isArray(data.args))
            throw offchainError;
        const [params] = data.args;
        const errorResult = (0, viem_1.decodeErrorResult)({
            abi: index_js_1.offchainRegisterSnippet,
            data: params,
        });
        const txHash = await handleWildcardWritingRevert(wallet, errorResult, encodedName, calldata, account, expiry);
        if (!txHash)
            throw offchainError;
        return txHash;
    }
}
exports.handleOffchainTransaction = handleOffchainTransaction;
//# sourceMappingURL=wildcardWriting.js.map