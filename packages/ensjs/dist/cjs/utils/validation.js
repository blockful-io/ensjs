"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsDotEth = exports.parseInput = exports.validateName = void 0;
const utils_1 = require("../errors/utils");
const consts_1 = require("./consts");
const labels_1 = require("./labels");
const normalise_1 = require("./normalise");
const validateName = (name) => {
    const nameArray = name.split('.');
    const normalisedArray = nameArray.map((label) => {
        if (label.length === 0)
            throw new utils_1.NameWithEmptyLabelsError({ name });
        if (label === '[root]') {
            if (name !== label)
                throw new utils_1.RootNameIncludesOtherLabelsError({ name });
            return label;
        }
        return (0, labels_1.isEncodedLabelhash)(label)
            ? (0, labels_1.checkLabel)(label) || label
            : (0, normalise_1.normalise)(label);
    });
    const normalisedName = normalisedArray.join('.');
    (0, labels_1.saveName)(normalisedName);
    return normalisedName;
};
exports.validateName = validateName;
const parseInput = (input) => {
    let nameReference = input;
    let isValid = false;
    try {
        nameReference = (0, exports.validateName)(input);
        isValid = true;
    }
    catch { }
    const normalisedName = isValid ? nameReference : undefined;
    const labels = nameReference.split('.');
    const tld = labels[labels.length - 1];
    const isETH = tld === 'eth';
    const labelDataArray = (0, normalise_1.split)(nameReference);
    const isShort = (labelDataArray[0].output?.length || 0) < consts_1.MINIMUM_DOT_ETH_CHARS;
    if (labels.length === 1) {
        return {
            type: 'label',
            normalised: normalisedName,
            isShort,
            isValid,
            is2LD: false,
            isETH,
            labelDataArray,
        };
    }
    const is2LD = labels.length === 2;
    return {
        type: 'name',
        normalised: normalisedName,
        isShort: isETH && is2LD ? isShort : false,
        isValid,
        is2LD,
        isETH,
        labelDataArray,
    };
};
exports.parseInput = parseInput;
const checkIsDotEth = (labels) => labels.length === 2 && labels[1] === 'eth';
exports.checkIsDotEth = checkIsDotEth;
//# sourceMappingURL=validation.js.map