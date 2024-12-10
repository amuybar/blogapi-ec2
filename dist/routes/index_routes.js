"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_routes_1 = __importDefault(require("./user_routes"));
var blog_routes_1 = __importDefault(require("./blog_routes"));
var routes = function (app) {
    (0, user_routes_1.default)(app);
    (0, blog_routes_1.default)(app);
};
exports.default = routes;
//# sourceMappingURL=index_routes.js.map