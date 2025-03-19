"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEnsContracts = void 0;
const contracts_1 = require("../errors/contracts");
const consts_1 = require("./consts");
const addEnsContracts = (chain) => {
    if (!chain)
        throw new contracts_1.NoChainError();
    if (!consts_1.supportedChains.includes(chain.id))
        throw new contracts_1.UnsupportedChainError({
            chainId: chain.id,
            supportedChains: consts_1.supportedChains,
        });
    return {
        ...chain,
        contracts: {
            ...chain.contracts,
            ...consts_1.addresses[chain.id],
        },
        subgraphs: {
            ...consts_1.subgraphs[chain.id],
        },
    };
};
exports.addEnsContracts = addEnsContracts;
//# sourceMappingURL=addEnsContracts.js.map