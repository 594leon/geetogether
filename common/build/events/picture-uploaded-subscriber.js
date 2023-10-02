"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PictureUploadedSubscriber = void 0;
const subjects_1 = require("./subjects");
class PictureUploadedSubscriber {
    constructor() {
        this.subject = subjects_1.Subjects.PictureUploaded;
    }
    onMessage(content, checker) {
        checker.ack();
    }
    ;
}
exports.PictureUploadedSubscriber = PictureUploadedSubscriber;
