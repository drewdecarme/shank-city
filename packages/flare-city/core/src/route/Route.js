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
exports.Route = void 0;
var utils_1 = require("../utils");
var utils_2 = require("../utils");
var Route = /** @class */ (function () {
    function Route(params) {
        this.root = params.root;
        this.requests = {
            GET: [],
            POST: [],
        };
        this.matchedRoute = undefined;
    }
    Route.prototype.get = function (params) {
        /**
         * RATIONALE: Don't really care about the internal
         * types of this... all we care is that it get's stored
         * in the requests.get array and then can be parsed appropriately
         */
        // @ts-ignore
        this.requests.GET.push(params);
    };
    Route.prototype.post = function (params) {
        /**
         * RATIONALE: Don't really care about the internal
         * types of this... all we care is that it get's stored
         * in the requests.get array and then can be parsed appropriately
         */
        // @ts-ignore
        this.requests.POST.push(params);
    };
    Route.prototype.matchAndParseRouteRequest = function (request, routePath) {
        var requestURL = new URL(request.url).toString();
        var fullRoutePath = "".concat(this.root).concat(routePath);
        var pattern = new URLPattern({ pathname: fullRoutePath });
        var patternMatch = pattern.test(requestURL);
        utils_2.log.debug("Matching route path: '".concat(routePath, ": ").concat(patternMatch, "'"), {
            requestURL: requestURL,
            routePath: routePath,
            patternMatch: patternMatch,
        });
        if (!patternMatch) {
            return {
                isMatch: false,
                pattern: undefined,
            };
        }
        var parsedPattern = pattern.exec(requestURL);
        if (!parsedPattern) {
            throw new utils_1.ErrorServer("Unable to parse properties from route request.");
        }
        return {
            isMatch: true,
            pattern: parsedPattern,
        };
    };
    /**
     * Given a request, this method loops through
     * all of the stored requests on this route instance
     * and finds the route that matches the URL request pattern.
     * If the request.url doesn't match any of the route path
     * definitions, it will throw a ErrorNotFound error.
     */
    Route.prototype.matchRouteWithRequest = function (request) {
        var _this = this;
        try {
            utils_2.log.info("Matching request method & pathname with `route.url` pattern...");
            var method = request.method.toUpperCase();
            var routes = this.requests[method];
            if (!routes) {
                throw new utils_1.ErrorNotFound("The HTTP request method \"".concat(method, "\" is not supported."));
            }
            var matchedRoute = routes.reduce(function (accum, routeDef) {
                var urlPatternMatch = _this.matchAndParseRouteRequest(request, routeDef.path);
                if (urlPatternMatch.isMatch) {
                    return { route: routeDef, pattern: urlPatternMatch.pattern };
                }
                return accum;
            }, undefined);
            if (!matchedRoute) {
                throw new utils_1.ErrorNotFound("The route does not exist");
            }
            this.matchedRoute = matchedRoute;
            utils_2.log.info("Matching request pathname with `route.url` pattern... done.");
        }
        catch (error) {
            throw error;
        }
    };
    /**
     * Provided the arguments of the worker
     * this method checks to see if there is any middleware that
     * was defined when the Route was instantiated.
     *
     * If there is
     * it will run through the middleware sequentially, waiting
     * for the previous middleware to complete before continuing on.
     *
     * If there is no middleware defined on the route, this method
     * will return, exiting as early as possible.
     *
     * **NOTE**: Be sure to `await` this when running it so all
     * middlewares run before the route handler does
     */
    Route.prototype.runMiddleware = function (request, env, context) {
        var _b, e_1, _c, _d;
        return __awaiter(this, void 0, void 0, function () {
            var _e, parse, middleware, segmentMiddleware, searchEntries, searchParams, paramsMiddleware, _f, middleware_1, middleware_1_1, middlewareFn, error_1, e_1_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!this.matchedRoute)
                            return [2 /*return*/];
                        if (!this.matchedRoute.route.middleware) {
                            utils_2.log.debug("No middleware to run. Bypassing middleware runner.");
                            return [2 /*return*/];
                        }
                        utils_2.log.info("Running route level middleware...");
                        _e = this.matchedRoute.route, parse = _e.parse, middleware = _e.middleware;
                        // Add segment validation to middleware array if available.
                        if (parse === null || parse === void 0 ? void 0 : parse.segments) {
                            context.segments = this.matchedRoute.pattern.pathname.groups;
                            segmentMiddleware = (0, utils_2.createMiddlewareValidate)({
                                name: "segments",
                                schema: parse.segments,
                                contextKey: "segments",
                            });
                            middleware.push(segmentMiddleware);
                        }
                        // Add param validation to middleware array if available
                        if (parse === null || parse === void 0 ? void 0 : parse.params) {
                            searchEntries = new URLSearchParams(this.matchedRoute.pattern.search.input).entries();
                            searchParams = Object.fromEntries(searchEntries);
                            context.params = searchParams;
                            paramsMiddleware = (0, utils_2.createMiddlewareValidate)({
                                name: "params",
                                schema: parse.params,
                                contextKey: "params",
                            });
                            middleware.push(paramsMiddleware);
                        }
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 9, 10, 15]);
                        _f = true, middleware_1 = __asyncValues(middleware);
                        _g.label = 2;
                    case 2: return [4 /*yield*/, middleware_1.next()];
                    case 3:
                        if (!(middleware_1_1 = _g.sent(), _b = middleware_1_1.done, !_b)) return [3 /*break*/, 8];
                        _d = middleware_1_1.value;
                        _f = false;
                        middlewareFn = _d;
                        _g.label = 4;
                    case 4:
                        _g.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, middlewareFn(request, env, context)];
                    case 5:
                        _g.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _g.sent();
                        throw error_1;
                    case 7:
                        _f = true;
                        return [3 /*break*/, 2];
                    case 8: return [3 /*break*/, 15];
                    case 9:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 15];
                    case 10:
                        _g.trys.push([10, , 13, 14]);
                        if (!(!_f && !_b && (_c = middleware_1.return))) return [3 /*break*/, 12];
                        return [4 /*yield*/, _c.call(middleware_1)];
                    case 11:
                        _g.sent();
                        _g.label = 12;
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 14: return [7 /*endfinally*/];
                    case 15:
                        utils_2.log.info("Running route level middleware... done");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * This method is a public method that is exposed to allow the app
     * to run the routes
     */
    Route.prototype.run = function (request, env, context) {
        return __awaiter(this, void 0, void 0, function () {
            var error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        // Match the route with the request URL
                        this.matchRouteWithRequest(request);
                        // Run any middlewares if they exist
                        return [4 /*yield*/, this.runMiddleware(request, env, context)];
                    case 1:
                        // Run any middlewares if they exist
                        _b.sent();
                        // this should never happen... this is just to appease TS
                        if (!this.matchedRoute)
                            return [2 /*return*/];
                        // Return instantiated route.handler
                        return [2 /*return*/, this.matchedRoute.route.handler(request, env, context, _a.response)];
                    case 2:
                        error_2 = _b.sent();
                        return [2 /*return*/, (0, utils_1.errorHandler)(error_2)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    var _a;
    _a = Route;
    /**
     * A simpler handler that formats a response. This is
     * passed in as the 4th parameter to any route handler
     */
    Route.response = function (_b) {
        var json = _b.json, _c = _b.status, status = _c === void 0 ? 200 : _c;
        return __awaiter(void 0, void 0, void 0, function () { return __generator(_a, function (_d) {
            return [2 /*return*/, new Response(JSON.stringify(json), { status: status })];
        }); });
    };
    return Route;
}());
exports.Route = Route;
