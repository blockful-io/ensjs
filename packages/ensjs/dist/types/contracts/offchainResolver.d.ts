export declare const WILDCARD_WRITING_INTERFACE_ID: "0x79dc93d7";
export declare const operationRouterSnippet: readonly [{
    readonly type: "error";
    readonly name: "FunctionNotSupported";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "OperationHandledOnchain";
    readonly inputs: readonly [{
        readonly name: "chainId";
        readonly type: "uint256";
    }, {
        readonly name: "contractAddress";
        readonly type: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "OperationHandledOffchain";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly name: "version";
            readonly type: "string";
        }, {
            readonly name: "chainId";
            readonly type: "uint64";
        }, {
            readonly name: "verifyingContract";
            readonly type: "address";
        }];
    }, {
        readonly name: "url";
        readonly type: "string";
    }, {
        readonly name: "data";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "data";
            readonly type: "bytes";
        }, {
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly name: "expirationTimestamp";
            readonly type: "uint256";
        }];
    }];
}, {
    readonly type: "function";
    readonly name: "getOperationHandler";
    readonly inputs: readonly [{
        readonly name: "encodedFunction";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "view";
}];
export declare const offchainRegisterSnippet: readonly [{
    readonly type: "error";
    readonly name: "FunctionNotSupported";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "OperationHandledOnchain";
    readonly inputs: readonly [{
        readonly name: "chainId";
        readonly type: "uint256";
    }, {
        readonly name: "contractAddress";
        readonly type: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "OperationHandledOffchain";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly name: "version";
            readonly type: "string";
        }, {
            readonly name: "chainId";
            readonly type: "uint64";
        }, {
            readonly name: "verifyingContract";
            readonly type: "address";
        }];
    }, {
        readonly name: "url";
        readonly type: "string";
    }, {
        readonly name: "data";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "data";
            readonly type: "bytes";
        }, {
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly name: "expirationTimestamp";
            readonly type: "uint256";
        }];
    }];
}, {
    readonly type: "function";
    readonly name: "getOperationHandler";
    readonly inputs: readonly [{
        readonly name: "encodedFunction";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "view";
}, {
    readonly components: readonly [{
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly name: "duration";
        readonly type: "uint256";
    }, {
        readonly name: "secret";
        readonly type: "bytes32";
    }, {
        readonly name: "resolver";
        readonly type: "address";
    }, {
        readonly name: "extraData";
        readonly type: "bytes";
    }];
    readonly name: "RegisterRequest";
    readonly type: "tuple";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly name: "duration";
        readonly type: "uint256";
    }];
    readonly name: "registerParams";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly name: "price";
            readonly type: "uint256";
        }, {
            readonly name: "available";
            readonly type: "bool";
        }, {
            readonly name: "token";
            readonly type: "address";
        }, {
            readonly name: "commitTime";
            readonly type: "uint256";
        }, {
            readonly name: "extraData";
            readonly type: "bytes";
        }];
        readonly name: "";
        readonly type: "tuple";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "bytes";
            readonly name: "name";
            readonly type: "bytes";
        }, {
            readonly internalType: "address";
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "duration";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes32";
            readonly name: "secret";
            readonly type: "bytes32";
        }, {
            readonly internalType: "address";
            readonly name: "resolver";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "extraData";
            readonly type: "bytes";
        }];
        readonly internalType: "struct RegisterRequest";
        readonly name: "";
        readonly type: "tuple";
    }];
    readonly name: "register";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}];
export declare const offchainCommitableSnippet: readonly [{
    readonly type: "error";
    readonly name: "FunctionNotSupported";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "OperationHandledOnchain";
    readonly inputs: readonly [{
        readonly name: "chainId";
        readonly type: "uint256";
    }, {
        readonly name: "contractAddress";
        readonly type: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "OperationHandledOffchain";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly name: "version";
            readonly type: "string";
        }, {
            readonly name: "chainId";
            readonly type: "uint64";
        }, {
            readonly name: "verifyingContract";
            readonly type: "address";
        }];
    }, {
        readonly name: "url";
        readonly type: "string";
    }, {
        readonly name: "data";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "data";
            readonly type: "bytes";
        }, {
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly name: "expirationTimestamp";
            readonly type: "uint256";
        }];
    }];
}, {
    readonly type: "function";
    readonly name: "getOperationHandler";
    readonly inputs: readonly [{
        readonly name: "encodedFunction";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "view";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly name: "name";
            readonly type: "bytes";
        }, {
            readonly name: "owner";
            readonly type: "address";
        }, {
            readonly name: "duration";
            readonly type: "uint256";
        }, {
            readonly name: "secret";
            readonly type: "bytes32";
        }, {
            readonly name: "extraData";
            readonly type: "bytes";
        }];
        readonly name: "request";
        readonly type: "tuple";
    }];
    readonly name: "makeCommitment";
    readonly outputs: readonly [{
        readonly name: "commitHash";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly name: "commit";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const offchainTransferrableSnippet: readonly [{
    readonly type: "error";
    readonly name: "FunctionNotSupported";
    readonly inputs: readonly [];
}, {
    readonly type: "error";
    readonly name: "OperationHandledOnchain";
    readonly inputs: readonly [{
        readonly name: "chainId";
        readonly type: "uint256";
    }, {
        readonly name: "contractAddress";
        readonly type: "address";
    }];
}, {
    readonly type: "error";
    readonly name: "OperationHandledOffchain";
    readonly inputs: readonly [{
        readonly name: "sender";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly name: "version";
            readonly type: "string";
        }, {
            readonly name: "chainId";
            readonly type: "uint64";
        }, {
            readonly name: "verifyingContract";
            readonly type: "address";
        }];
    }, {
        readonly name: "url";
        readonly type: "string";
    }, {
        readonly name: "data";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "data";
            readonly type: "bytes";
        }, {
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly name: "expirationTimestamp";
            readonly type: "uint256";
        }];
    }];
}, {
    readonly type: "function";
    readonly name: "getOperationHandler";
    readonly inputs: readonly [{
        readonly name: "encodedFunction";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [];
    readonly stateMutability: "view";
}, {
    readonly inputs: readonly [{
        readonly name: "name";
        readonly type: "bytes";
    }, {
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly name: "newOwner";
        readonly type: "address";
    }];
    readonly name: "transferFrom";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
/**
 * @notice Struct used to define the domain of the typed data signature, defined in EIP-712.
 * @param name The user friendly name of the contract that the signature corresponds to.
 * @param version The version of domain object being used.
 * @param chainId The ID of the chain that the signature corresponds to (ie Ethereum mainnet: 1, Goerli testnet: 5, ...).
 * @param verifyingContract The address of the contract that the signature pertains to.
 */
export type DomainData = {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: `0x${string}`;
};
/**
 * @notice Struct used to define the message context used to construct a typed data signature, defined in EIP-712,
 * to authorize and define the deferred mutation being performed.
 * @param callData The encoded function to be called
 * @param sender The address of the user performing the mutation (msg.sender).
 */
export type MessageData = {
    data: `0x${string}`;
    sender: `0x${string}`;
    expirationTimestamp: bigint;
};
//# sourceMappingURL=offchainResolver.d.ts.map