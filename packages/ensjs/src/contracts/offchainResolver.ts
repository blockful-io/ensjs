export const offchainRegisterSnippet = [
  {
    components: [
      { name: 'name', type: 'bytes' },
      { name: 'owner', type: 'address' },
      { name: 'duration', type: 'uint256' },
      { name: 'secret', type: 'bytes32' },
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
    name: 'register',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
] as const

// OffchainCommitable interface functions
export const offchainCommitableSnippet = [
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
] as const

// OffchainTransferrable interface functions
export const offchainTransferrableSnippet = [
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
] as const
