"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMiddlewareValidate = void 0;
var zod_1 = require("zod");
var utils_1 = require("../utils");
/**
 * Parses, validates, and then enriches the context with
 * the segments defined in the `route.path` record.
 *
 * This is a curried function that intakes the validation
 * requirements needed to dynamically create a Zod schema
 * and then returns a function that can be run to pass in
 * the required args.
 */
var createMiddlewareValidate = function (_a) {
    var name = _a.name, schema = _a.schema, contextKey = _a.contextKey;
    return function (request, env, context) { return __awaiter(void 0, void 0, void 0, function () {
        var data, parsedData;
        return __generator(this, function (_a) {
            utils_1.log.debug("Running ".concat(name, " validation middleware..."));
            try {
                data = context[contextKey];
                parsedData = schema.parse(data);
                /**
                 * Not really interested in type perseveration here
                 * since we're providing a key that was added
                 * in context to when this function is called.
                 */
                // @ts-ignore
                context[contextKey] = parsedData;
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    throw new utils_1.ErrorValidation({
                        message: "Validation failed.",
                        data: {
                            issues: error.issues.reduce(function (accum, issue) {
                                console.log(JSON.stringify(issue, null, 2));
                                switch (issue.code) {
                                    case "invalid_type":
                                        return __spreadArray(__spreadArray([], accum, true), [
                                            {
                                                path: __spreadArray([contextKey], issue.path, true).join("."),
                                                code: issue.code,
                                                expected: issue.expected,
                                                received: issue.received,
                                                message: issue.message,
                                            },
                                        ], false);
                                    case "invalid_union":
                                        return __spreadArray(__spreadArray([], accum, true), issue.unionErrors.flatMap(function (_a) {
                                            var issues = _a.issues, name = _a.name;
                                            return issues.map(
                                            // these are here
                                            // @ts-ignore
                                            function (_a) {
                                                var received = _a.received, expected = _a.expected, path = _a.path, code = _a.code;
                                                var message = "Received: ".concat(received, ", Expected: ").concat(expected);
                                                return {
                                                    code: code,
                                                    path: __spreadArray([contextKey], path, true).join("."),
                                                    received: received,
                                                    expected: expected,
                                                    message: message,
                                                };
                                            });
                                        }), true);
                                    default:
                                        return accum;
                                }
                            }, []),
                        },
                    });
                }
            }
            utils_1.log.debug("Running ".concat(name, " validation middleware... done."));
            return [2 /*return*/];
        });
    }); };
};
exports.createMiddlewareValidate = createMiddlewareValidate;
