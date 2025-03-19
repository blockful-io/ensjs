"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSafeSecondsDate = void 0;
const consts_1 = require("./consts");
const makeSafeSecondsDate = (seconds) => {
    const milliseconds = BigInt(seconds) * 1000n;
    if (milliseconds > BigInt(consts_1.MAX_DATE_INT))
        return new Date(consts_1.MAX_DATE_INT);
    return new Date(Number(milliseconds));
};
exports.makeSafeSecondsDate = makeSafeSecondsDate;
//# sourceMappingURL=makeSafeSecondsDate.js.map