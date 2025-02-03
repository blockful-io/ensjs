export const operationRouterSnippet = [
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
] as const
