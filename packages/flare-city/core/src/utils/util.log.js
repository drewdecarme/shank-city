"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
var logger_1 = require("@flare-city/logger");
exports.log = new logger_1.WorkersLogger({
    name: "FlareCity",
    level: "debug",
});
