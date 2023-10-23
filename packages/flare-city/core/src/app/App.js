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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var utils_1 = require("../utils");
var App = /** @class */ (function () {
    function App(name) {
        this.name = name;
        this.routes = [];
        this.middlewares = [];
    }
    App.prototype.addRoute = function (route) {
        this.routes.push(route);
    };
    App.prototype.addMiddleware = function (fn) {
        this.middlewares.push(fn);
    };
    App.prototype.runMiddlewares = function () {
        var _a, e_1, _b, _c;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _d, _e, _f, middlewareFn, e_1_1, error_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        _g.trys.push([0, 14, , 15]);
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 7, 8, 13]);
                        _d = true, _e = __asyncValues(this.middlewares);
                        _g.label = 2;
                    case 2: return [4 /*yield*/, _e.next()];
                    case 3:
                        if (!(_f = _g.sent(), _a = _f.done, !_a)) return [3 /*break*/, 6];
                        _c = _f.value;
                        _d = false;
                        middlewareFn = _c;
                        return [4 /*yield*/, middlewareFn.apply(void 0, args)];
                    case 4:
                        _g.sent();
                        _g.label = 5;
                    case 5:
                        _d = true;
                        return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _g.trys.push([8, , 11, 12]);
                        if (!(!_d && !_a && (_b = _e.return))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _b.call(_e)];
                    case 9:
                        _g.sent();
                        _g.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        error_1 = _g.sent();
                        (0, utils_1.errorHandler)(error_1);
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    App.prototype.run = function (request, env, context, options) {
        return __awaiter(this, void 0, void 0, function () {
            var pathname, route, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pathname = new URL(request.url).pathname;
                        // set logging based upon some options
                        utils_1.log.setLogLevel((options === null || options === void 0 ? void 0 : options.logLevel) || "debug");
                        utils_1.log.setLoggingType((options === null || options === void 0 ? void 0 : options.logType) || "json");
                        utils_1.log.setName("FlareCity");
                        utils_1.log.info("Matching base route...");
                        route = this.routes.reduce(function (accum, routeDef) {
                            utils_1.log.debug("Path: ".concat(pathname, " | RouteRoot: ").concat(routeDef.root, " | Match? ").concat(pathname.startsWith(routeDef.root)));
                            if (pathname.startsWith(routeDef.root)) {
                                return routeDef;
                            }
                            return accum;
                        }, undefined);
                        utils_1.log.info("Matching base route... done");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        // If there isn't a route that matches the
                        // pathname, then throw an error
                        if (typeof route === "undefined") {
                            throw new utils_1.ErrorNotFound("The route does not exist");
                        }
                        // Run middlewares
                        utils_1.log.info("Running app level middleware...");
                        return [4 /*yield*/, this.runMiddlewares(request, env, context)];
                    case 2:
                        _a.sent();
                        utils_1.log.info("Running app level middleware... done");
                        // Run the handler
                        utils_1.log.info("Executing route...");
                        return [4 /*yield*/, route.run(request, env, context)];
                    case 3:
                        response = _a.sent();
                        utils_1.log.info("Executing route... done.");
                        return [2 /*return*/, response];
                    case 4:
                        error_2 = _a.sent();
                        return [2 /*return*/, (0, utils_1.errorHandler)(error_2)];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return App;
}());
exports.App = App;
