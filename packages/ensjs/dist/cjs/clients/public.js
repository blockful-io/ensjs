"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnsPublicClient = void 0;
const viem_1 = require("viem");
const addEnsContracts_1 = require("../contracts/addEnsContracts");
const public_1 = require("./decorators/public");
const subgraph_1 = require("./decorators/subgraph");
const createEnsPublicClient = ({ batch, chain, key = 'ensPublic', name = 'ENS Public Client', transport, pollingInterval, }) => {
    return (0, viem_1.createClient)({
        batch,
        chain: (0, addEnsContracts_1.addEnsContracts)(chain),
        key,
        name,
        pollingInterval,
        transport,
        type: 'ensPublicClient',
    })
        .extend(public_1.ensPublicActions)
        .extend(subgraph_1.ensSubgraphActions);
};
exports.createEnsPublicClient = createEnsPublicClient;
//# sourceMappingURL=public.js.map