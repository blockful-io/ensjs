"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensWalletActions = void 0;
const clearRecords_1 = require("../../functions/wallet/clearRecords");
const commitName_1 = require("../../functions/wallet/commitName");
const createSubname_1 = require("../../functions/wallet/createSubname");
const deleteSubname_1 = require("../../functions/wallet/deleteSubname");
const registerName_1 = require("../../functions/wallet/registerName");
const renewNames_1 = require("../../functions/wallet/renewNames");
const setAbiRecord_1 = require("../../functions/wallet/setAbiRecord");
const setAddressRecord_1 = require("../../functions/wallet/setAddressRecord");
const setChildFuses_1 = require("../../functions/wallet/setChildFuses");
const setContentHashRecord_1 = require("../../functions/wallet/setContentHashRecord");
const setFuses_1 = require("../../functions/wallet/setFuses");
const setPrimaryName_1 = require("../../functions/wallet/setPrimaryName");
const setRecords_1 = require("../../functions/wallet/setRecords");
const setResolver_1 = require("../../functions/wallet/setResolver");
const setTextRecord_1 = require("../../functions/wallet/setTextRecord");
const transferName_1 = require("../../functions/wallet/transferName");
const unwrapName_1 = require("../../functions/wallet/unwrapName");
const wrapName_1 = require("../../functions/wallet/wrapName");
const ensWalletActions = (client) => ({
    clearRecords: (parameters) => (0, clearRecords_1.default)(client, parameters),
    commitName: (parameters) => (0, commitName_1.default)(client, parameters),
    createSubname: (parameters) => (0, createSubname_1.default)(client, parameters),
    deleteSubname: (parameters) => (0, deleteSubname_1.default)(client, parameters),
    registerName: (parameters) => (0, registerName_1.default)(client, parameters),
    renewNames: (parameters) => (0, renewNames_1.default)(client, parameters),
    setAbiRecord: (parameters) => (0, setAbiRecord_1.default)(client, parameters),
    setAddressRecord: (parameters) => (0, setAddressRecord_1.default)(client, parameters),
    setChildFuses: (parameters) => (0, setChildFuses_1.default)(client, parameters),
    setContentHashRecord: (parameters) => (0, setContentHashRecord_1.default)(client, parameters),
    setFuses: (parameters) => (0, setFuses_1.default)(client, parameters),
    setPrimaryName: (parameters) => (0, setPrimaryName_1.default)(client, parameters),
    setRecords: (parameters) => (0, setRecords_1.default)(client, parameters),
    setResolver: (parameters) => (0, setResolver_1.default)(client, parameters),
    setTextRecord: (parameters) => (0, setTextRecord_1.default)(client, parameters),
    transferName: (parameters) => (0, transferName_1.default)(client, parameters),
    unwrapName: (parameters) => (0, unwrapName_1.default)(client, parameters),
    wrapName: (parameters) => (0, wrapName_1.default)(client, parameters),
});
exports.ensWalletActions = ensWalletActions;
//# sourceMappingURL=wallet.js.map