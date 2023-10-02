"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PictureUploadedPublisher = void 0;
const formatted_publisher_1 = require("./formatted-publisher");
const subjects_1 = require("./subjects");
class PictureUploadedPublisher extends formatted_publisher_1.FormattedPublisher {
    constructor() {
        super(...arguments);
        this.subject = subjects_1.Subjects.PictureUploaded;
    }
}
exports.PictureUploadedPublisher = PictureUploadedPublisher;
