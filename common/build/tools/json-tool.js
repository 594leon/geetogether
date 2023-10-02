"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJson = void 0;
const parseJson = (serializedObj, ...dateKeys) => {
    //JSON.parse()遇到'ISO日期字串'還是會parse成字串，而不是我們要的Date型別，所以要特別處理
    return JSON.parse(serializedObj, (key, value) => {
        for (const dateKey of dateKeys) {
            if (key === dateKey) {
                return new Date(value);
            }
        }
        return value;
    });
};
exports.parseJson = parseJson;
