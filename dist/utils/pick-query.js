"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickQueryTerms = void 0;
const pickQueryTerms = (queryObj, keys) => {
    const finalQuery = {};
    for (const key of keys) {
        if (queryObj && Object.hasOwnProperty.call(queryObj, key)) {
            finalQuery[key] = queryObj[key];
        }
    }
    return finalQuery;
};
exports.pickQueryTerms = pickQueryTerms;
