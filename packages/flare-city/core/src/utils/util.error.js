"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ErrorValidation = exports.ErrorUnauthorized = exports.ErrorBadRequest = exports.ErrorServer = exports.ErrorNotFound = void 0;
var util_log_1 = require("./util.log");
var AppError = /** @class */ (function (_super) {
    __extends(AppError, _super);
    function AppError(params) {
        var _this = _super.call(this, params.message) || this;
        _this.status_code = params.status_code;
        _this.status_text = params.status_text;
        _this.data = params.data || {};
        return _this;
    }
    return AppError;
}(Error));
/**
 * Format's an error message and appends extra content onto
 * it if provided
 */
var formatErrorMessage = function (prefix, message) {
    return "".concat(prefix).concat(message ? ": ".concat(message) : "");
};
var ErrorNotFound = /** @class */ (function (_super) {
    __extends(ErrorNotFound, _super);
    function ErrorNotFound(message) {
        var _this = _super.call(this, {
            message: formatErrorMessage("Not Found", message),
            status_code: 404,
            status_text: "Not Found",
        }) || this;
        _this.name = "ErrorNotFound";
        return _this;
    }
    return ErrorNotFound;
}(AppError));
exports.ErrorNotFound = ErrorNotFound;
var ErrorServer = /** @class */ (function (_super) {
    __extends(ErrorServer, _super);
    function ErrorServer(message) {
        var _this = _super.call(this, {
            message: formatErrorMessage("Server Error", message),
            status_code: 500,
            status_text: "Server Error",
        }) || this;
        _this.name = "ErrorServer";
        return _this;
    }
    return ErrorServer;
}(AppError));
exports.ErrorServer = ErrorServer;
var ErrorBadRequest = /** @class */ (function (_super) {
    __extends(ErrorBadRequest, _super);
    function ErrorBadRequest(message) {
        var _this = _super.call(this, {
            message: formatErrorMessage("Bad Request", message),
            status_code: 400,
            status_text: "Bad Request",
        }) || this;
        _this.name = "ErrorBadRequest";
        return _this;
    }
    return ErrorBadRequest;
}(AppError));
exports.ErrorBadRequest = ErrorBadRequest;
var ErrorUnauthorized = /** @class */ (function (_super) {
    __extends(ErrorUnauthorized, _super);
    function ErrorUnauthorized(message) {
        var _this = _super.call(this, {
            message: formatErrorMessage("Unauthorized", message),
            status_code: 401,
            status_text: "Unauthorized",
        }) || this;
        _this.name = "ErrorUnauthorized";
        return _this;
    }
    return ErrorUnauthorized;
}(AppError));
exports.ErrorUnauthorized = ErrorUnauthorized;
var ErrorValidation = /** @class */ (function (_super) {
    __extends(ErrorValidation, _super);
    function ErrorValidation(params) {
        var _this = _super.call(this, {
            message: formatErrorMessage("Invalid", params.message),
            status_code: 422,
            status_text: "Unprocessable Entity",
            data: params.data,
        }) || this;
        _this.name = "ErrorValidation";
        return _this;
    }
    return ErrorValidation;
}(AppError));
exports.ErrorValidation = ErrorValidation;
var errorHandler = function (error) {
    // if the error is handled then just throw the error
    if (error instanceof ErrorNotFound ||
        error instanceof ErrorUnauthorized ||
        error instanceof ErrorBadRequest ||
        error instanceof ErrorValidation ||
        error instanceof ErrorServer) {
        util_log_1.log.error(error.message);
        return new Response(JSON.stringify({
            message: error.message,
            status_code: error.status_code,
            status_text: error.status_text,
            data: error.data,
        }), {
            status: error.status_code,
            statusText: error.status_text,
        });
    }
    util_log_1.log.error(error);
    throw new Error("Internal Server Error: Unhandled.");
};
exports.errorHandler = errorHandler;
