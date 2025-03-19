"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensPublicActions = void 0;
const batch_1 = require("../../functions/public/batch");
const getAbiRecord_1 = require("../../functions/public/getAbiRecord");
const getAddressRecord_1 = require("../../functions/public/getAddressRecord");
const getAvailable_1 = require("../../functions/public/getAvailable");
const getContentHashRecord_1 = require("../../functions/public/getContentHashRecord");
const getExpiry_1 = require("../../functions/public/getExpiry");
const getName_1 = require("../../functions/public/getName");
const getOwner_1 = require("../../functions/public/getOwner");
const getPrice_1 = require("../../functions/public/getPrice");
const getRecords_1 = require("../../functions/public/getRecords");
const getResolver_1 = require("../../functions/public/getResolver");
const getTextRecord_1 = require("../../functions/public/getTextRecord");
const getWrapperData_1 = require("../../functions/public/getWrapperData");
const getWrapperName_1 = require("../../functions/public/getWrapperName");
const ensPublicActions = (client) => ({
    ensBatch: (...parameters) => (0, batch_1.default)(client, ...parameters),
    getAbiRecord: (parameters) => (0, getAbiRecord_1.default)(client, parameters),
    getAddressRecord: (parameters) => (0, getAddressRecord_1.default)(client, parameters),
    getAvailable: (parameters) => (0, getAvailable_1.default)(client, parameters),
    getContentHashRecord: (parameters) => (0, getContentHashRecord_1.default)(client, parameters),
    getExpiry: (parameters) => (0, getExpiry_1.default)(client, parameters),
    getName: (parameters) => (0, getName_1.default)(client, parameters),
    getOwner: (parameters) => (0, getOwner_1.default)(client, parameters),
    getPrice: (parameters) => (0, getPrice_1.default)(client, parameters),
    getRecords: (parameters) => (0, getRecords_1.default)(client, parameters),
    getResolver: (parameters) => (0, getResolver_1.default)(client, parameters),
    getTextRecord: (parameters) => (0, getTextRecord_1.default)(client, parameters),
    getWrapperData: (parameters) => (0, getWrapperData_1.default)(client, parameters),
    getWrapperName: (parameters) => (0, getWrapperName_1.default)(client, parameters),
});
exports.ensPublicActions = ensPublicActions;
//# sourceMappingURL=public.js.map