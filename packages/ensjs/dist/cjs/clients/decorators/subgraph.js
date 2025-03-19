"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensSubgraphActions = void 0;
const getDecodedName_1 = require("../../functions/subgraph/getDecodedName");
const getNameHistory_1 = require("../../functions/subgraph/getNameHistory");
const getNamesForAddress_1 = require("../../functions/subgraph/getNamesForAddress");
const getSubgraphRecords_1 = require("../../functions/subgraph/getSubgraphRecords");
const getSubgraphRegistrant_1 = require("../../functions/subgraph/getSubgraphRegistrant");
const getSubnames_1 = require("../../functions/subgraph/getSubnames");
const ensSubgraphActions = (client) => ({
    getDecodedName: (parameters) => (0, getDecodedName_1.default)(client, parameters),
    getNameHistory: (parameters) => (0, getNameHistory_1.default)(client, parameters),
    getNamesForAddress: (parameters) => (0, getNamesForAddress_1.default)(client, parameters),
    getSubgraphRecords: (parameters) => (0, getSubgraphRecords_1.default)(client, parameters),
    getSubgraphRegistrant: (parameters) => (0, getSubgraphRegistrant_1.default)(client, parameters),
    getSubnames: (parameters) => (0, getSubnames_1.default)(client, parameters),
});
exports.ensSubgraphActions = ensSubgraphActions;
//# sourceMappingURL=subgraph.js.map