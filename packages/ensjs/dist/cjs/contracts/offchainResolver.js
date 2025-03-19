"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offchainTransferrableSnippet = exports.offchainCommitableSnippet = exports.offchainRegisterSnippet = exports.operationRouterSnippet = exports.WILDCARD_WRITING_INTERFACE_ID = void 0;
exports.WILDCARD_WRITING_INTERFACE_ID = '0x79dc93d7';
exports.operationRouterSnippet = [
    {
        type: 'error',
        name: 'FunctionNotSupported',
        inputs: [],
    },
    {
        type: 'error',
        name: 'OperationHandledOnchain',
        inputs: [
            {
                name: 'chainId',
                type: 'uint256',
            },
            {
                name: 'contractAddress',
                type: 'address',
            },
        ],
    },
    {
        type: 'error',
        name: 'OperationHandledOffchain',
        inputs: [
            {
                name: 'sender',
                type: 'tuple',
                components: [
                    { name: 'name', type: 'string' },
                    { name: 'version', type: 'string' },
                    { name: 'chainId', type: 'uint64' },
                    { name: 'verifyingContract', type: 'address' },
                ],
            },
            {
                name: 'url',
                type: 'string',
            },
            {
                name: 'data',
                type: 'tuple',
                components: [
                    { name: 'data', type: 'bytes' },
                    { name: 'sender', type: 'address' },
                    { name: 'expirationTimestamp', type: 'uint256' },
                ],
            },
        ],
    },
    {
        type: 'function',
        name: 'getOperationHandler',
        inputs: [
            {
                name: 'encodedFunction',
                type: 'bytes',
            },
        ],
        outputs: [],
        stateMutability: 'view',
    },
];
exports.offchainRegisterSnippet = [
    ...exports.operationRouterSnippet,
    {
        components: [
            { name: 'name', type: 'bytes' },
            { name: 'owner', type: 'address' },
            { name: 'duration', type: 'uint256' },
            { name: 'secret', type: 'bytes32' },
            { name: 'resolver', type: 'address' },
            { name: 'extraData', type: 'bytes' },
        ],
        name: 'RegisterRequest',
        type: 'tuple',
    },
    {
        inputs: [
            { name: 'name', type: 'bytes' },
            { name: 'duration', type: 'uint256' },
        ],
        name: 'registerParams',
        outputs: [
            {
                components: [
                    { name: 'price', type: 'uint256' },
                    { name: 'available', type: 'bool' },
                    { name: 'token', type: 'address' },
                    { name: 'commitTime', type: 'uint256' },
                    { name: 'extraData', type: 'bytes' },
                ],
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    { internalType: 'bytes', name: 'name', type: 'bytes' },
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'uint256', name: 'duration', type: 'uint256' },
                    { internalType: 'bytes32', name: 'secret', type: 'bytes32' },
                    { internalType: 'address', name: 'resolver', type: 'address' },
                    { internalType: 'bytes', name: 'extraData', type: 'bytes' },
                ],
                internalType: 'struct RegisterRequest',
                name: '',
                type: 'tuple',
            },
        ],
        name: 'register',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
];
exports.offchainCommitableSnippet = [
    ...exports.operationRouterSnippet,
    {
        inputs: [
            {
                components: [
                    { name: 'name', type: 'bytes' },
                    { name: 'owner', type: 'address' },
                    { name: 'duration', type: 'uint256' },
                    { name: 'secret', type: 'bytes32' },
                    { name: 'extraData', type: 'bytes' },
                ],
                name: 'request',
                type: 'tuple',
            },
        ],
        name: 'makeCommitment',
        outputs: [{ name: 'commitHash', type: 'bytes32' }],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [{ name: 'commitment', type: 'bytes32' }],
        name: 'commit',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
exports.offchainTransferrableSnippet = [
    ...exports.operationRouterSnippet,
    {
        inputs: [
            { name: 'name', type: 'bytes' },
            { name: 'owner', type: 'address' },
            { name: 'newOwner', type: 'address' },
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
//# sourceMappingURL=offchainResolver.js.map