"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PictureUploadedRabbitmqPublisher = void 0;
const subjects_1 = require("../subjects");
class PictureUploadedRabbitmqPublisher {
    constructor() {
        this.subject = subjects_1.Subjects.PictureUploaded;
    }
}
exports.PictureUploadedRabbitmqPublisher = PictureUploadedRabbitmqPublisher;
