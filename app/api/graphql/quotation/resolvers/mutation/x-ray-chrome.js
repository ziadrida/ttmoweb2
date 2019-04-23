"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Puppeteer = require("puppeteer");
exports.xRayChrome = function (options) {
    if (options === void 0) { options = {}; }
    var page, browser;
    var setup = false;
    var defaults = {
        viewPort: { width: 1280, height: 800 }
    };
    var _a = Object.assign({}, defaults, options), viewPort = _a.viewPort, cl = _a.cl, navigationOptions = _a.navigationOptions, launchOptions = __rest(_a, ["viewPort", "cl", "navigationOptions"]);
    return function (ctx, done) { return __awaiter(_this, void 0, void 0, function () {
        var _a, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!!browser) return [3 /*break*/, 2];
                    return [4 /*yield*/, Puppeteer.launch(launchOptions)];
                case 1:
                    browser = _b.sent();
                    _b.label = 2;
                case 2:
                    if (!!page) return [3 /*break*/, 5];
                    return [4 /*yield*/, browser.newPage()];
                case 3:
                    page = _b.sent();
                    return [4 /*yield*/, page.setViewport(viewPort)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 11, , 12]);
                    return [4 /*yield*/, page.goto(ctx.url, navigationOptions)];
                case 6:
                    _b.sent();
                    if (!(typeof cl === 'function' && !setup)) return [3 /*break*/, 8];
                    console.log("call cl function");
                    return [4 /*yield*/, cl(page, ctx)];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8:
                    if (!!ctx.body) return [3 /*break*/, 10];
                    _a = ctx;
                    return [4 /*yield*/, page.content()];
                case 9:
                    _a.body = _b.sent();
                    _b.label = 10;
                case 10:
                    done(null, ctx);
                    return [3 /*break*/, 12];
                case 11:
                    err_1 = _b.sent();
                    done(err_1, null);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    }); };
};
exports.default = exports.xRayChrome;
