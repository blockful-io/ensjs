"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnsWalletClient = void 0;
const viem_1 = require("viem");
const addEnsContracts_1 = require("../contracts/addEnsContracts");
const wallet_1 = require("./decorators/wallet");
const createEnsWalletClient = ({ account, chain, key = 'ensWallet', name = 'ENS Wallet Client', transport, pollingInterval, }) => {
    return (0, viem_1.createWalletClient)({
        account,
        chain: (0, addEnsContracts_1.addEnsContracts)(chain),
        key,
        name,
        pollingInterval,
        transport,
    }).extend(wallet_1.ensWalletActions);
};
exports.createEnsWalletClient = createEnsWalletClient;
//# sourceMappingURL=wallet.js.map